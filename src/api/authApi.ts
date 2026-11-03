import type { User } from "firebase/auth";

export type BackendUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
};

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080")
  .trim()
  .replace(/\/+$/, "");

const inFlightRequests = new Map<string, Promise<BackendUser>>();

export function getBackendUser(user: User): Promise<BackendUser> {
  const pendingRequest = inFlightRequests.get(user.uid);
  if (pendingRequest) return pendingRequest;

  const request = fetchBackendUser(user);
  inFlightRequests.set(user.uid, request);
  void request.finally(() => {
    if (inFlightRequests.get(user.uid) === request) {
      inFlightRequests.delete(user.uid);
    }
  }).catch(() => undefined);
  return request;
}

async function fetchBackendUser(user: User): Promise<BackendUser> {
  let idToken: string;
  try {
    idToken = await user.getIdToken();
  } catch {
    throw new ApiRequestError("No se pudo obtener el token de Firebase. Cierra sesión e inténtalo de nuevo.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiRequestError(
      `No se pudo conectar con la API (${apiBaseUrl}). Comprueba que el backend esté iniciado y que CORS permita el origen del frontend.`,
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiRequestError("El backend rechazó el token de Firebase. Comprueba que backend y frontend usan el mismo proyecto Firebase.");
    }
    if (response.status === 503) {
      throw new ApiRequestError("Firebase Admin no está configurado en el backend. Configura sus credenciales y vuelve a intentarlo.");
    }
    if (response.status === 404) {
      throw new ApiRequestError("La API no tiene disponible /api/auth/me. Comprueba que el backend ejecutado es la versión actual.");
    }
    throw new ApiRequestError(`La API respondió con un error (${response.status}). Inténtalo de nuevo más tarde.`);
  }

  let backendUser: unknown;
  try {
    backendUser = await response.json();
  } catch {
    throw new ApiRequestError("La API respondió con un formato no válido.");
  }

  if (
    typeof backendUser !== "object"
    || backendUser === null
    || !("uid" in backendUser)
    || typeof backendUser.uid !== "string"
    || !("emailVerified" in backendUser)
    || typeof backendUser.emailVerified !== "boolean"
    || !("email" in backendUser)
    || (backendUser.email !== null && typeof backendUser.email !== "string")
  ) {
    throw new ApiRequestError("La API respondió con datos de usuario incompletos o no válidos.");
  }

  if (backendUser.uid !== user.uid) {
    throw new ApiRequestError("La identidad devuelta por el backend no coincide con la sesión de Firebase.");
  }

  return {
    uid: backendUser.uid,
    email: backendUser.email,
    emailVerified: backendUser.emailVerified,
  };
}
