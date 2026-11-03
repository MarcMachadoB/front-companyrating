import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, firebaseConfigured } from "../firebase";

type AuthPageProps = {
  onNavigate: (path: string) => void;
  onAuthenticated: (user: User, showNameOnReviews: boolean) => void;
};

type AuthMode = "login" | "register";

function AuthPage({ onNavigate, onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = mode === "login" ? "Trato — Inicia sesión" : "Trato — Crea tu cuenta";
    return () => {
      document.title = previousTitle;
    };
  }, [mode]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice("");
    setNoticeIsError(false);
  }

  function getAuthErrorMessage(error: unknown) {
    if (!(error instanceof Error) || !("code" in error)) {
      return "No se pudo completar la operación. Inténtalo de nuevo.";
    }

    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese correo. Prueba a iniciar sesión.";
      case "auth/invalid-email":
        return "El correo electrónico no tiene un formato válido.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "El correo o la contraseña no son correctos.";
      case "auth/weak-password":
        return "La contraseña es demasiado débil. Usa al menos 8 caracteres.";
      case "auth/too-many-requests":
        return "Se han realizado demasiados intentos. Espera un momento y vuelve a probar.";
      case "auth/network-request-failed":
        return "No se pudo conectar con Firebase. Comprueba tu conexión.";
      case "auth/operation-not-allowed":
        return "El acceso con correo y contraseña no está habilitado en Firebase Console.";
      case "auth/user-disabled":
        return "Esta cuenta está deshabilitada. Contacta con soporte.";
      default:
        return "Firebase no pudo completar la operación. Revisa la configuración del proyecto e inténtalo de nuevo.";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!auth) {
      setNotice("Configura las variables VITE_FIREBASE_* del archivo .env.local para activar el acceso.");
      setNoticeIsError(true);
      return;
    }
    if (isRegistering && formData.get("password") !== formData.get("passwordConfirmation")) {
      setNotice("Las contraseñas no coinciden. Revísalas e inténtalo de nuevo.");
      setNoticeIsError(true);
      return;
    }

    setNotice("");
    setNoticeIsError(false);
    setIsSubmitting(true);

    try {
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      if (isRegistering) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const name = String(formData.get("name")).trim();
        await updateProfile(credential.user, { displayName: name });
        const showNameOnReviews = formData.get("publicName") === "visible";
        onAuthenticated(credential.user, showNameOnReviews);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        onAuthenticated(
          credential.user,
          window.localStorage.getItem(`trato:public-name:${credential.user.uid}`) === "visible",
        );
      }
    } catch (error) {
      setNotice(getAuthErrorMessage(error));
      setNoticeIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    if (!auth) {
      setNotice("Configura Firebase en .env.local para activar la recuperación de contraseña.");
      setNoticeIsError(true);
      return;
    }

    const email = formRef.current ? new FormData(formRef.current).get("email") : null;
    if (typeof email !== "string" || !email) {
      setNotice("Escribe tu correo electrónico y vuelve a solicitar el restablecimiento.");
      setNoticeIsError(true);
      return;
    }

    setIsSubmitting(true);
    setNotice("");
    setNoticeIsError(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setNotice("Si hay una cuenta asociada a ese correo, recibirás un mensaje para restablecer la contraseña.");
    } catch (error) {
      setNotice(getAuthErrorMessage(error));
      setNoticeIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRegistering = mode === "register";

  return (
    <div className="auth-page">
      <header className="site-header auth-header d-flex align-items-center justify-content-between">
        <a
          className="brand d-inline-flex align-items-center u-focus-ring"
          href="/"
          aria-label="Trato, volver al inicio"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("/");
          }}
        >
          <span className="brand-mark">t.</span><span>trato</span>
        </a>
        <a
          className="auth-back-link d-inline-flex align-items-center u-focus-ring"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("/");
          }}
        >
          <ArrowLeft size={15} /> Volver al inicio
        </a>
      </header>

      <main className="auth-main">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-story">
            <span className="auth-story-mark"><ShieldCheck size={19} /></span>
            <p className="auth-story-eyebrow">UNA COMUNIDAD CON MÁS CONTEXTO</p>
            <h1>Tu experiencia merece <span>ser escuchada.</span></h1>
            <p className="auth-story-copy">
              Tu cuenta permite gestionar tus reseñas y ayuda a moderar la comunidad. Al registrarte, eliges si tu nombre aparece en tus reseñas públicas.
            </p>
            <div className="auth-story-points">
              <p><Check size={15} /> Comparte más de una experiencia</p>
              <p><Check size={15} /> Edita y gestiona tus reseñas</p>
              <p><Check size={15} /> Elige cómo mostrar tu nombre</p>
            </div>
            <div className="auth-story-footnote">
              <LockKeyhole size={15} />
              <span>La información de tu cuenta se utiliza con fines de moderación. La visibilidad de tu nombre en cada reseña es una elección tuya.</span>
            </div>
          </div>

          <div className="auth-form-side">
            <div className="auth-form-heading">
              <div className="eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> TU ESPACIO EN TRATO</div>
              <h2 id="auth-title">{isRegistering ? "Crea tu cuenta." : "Qué bueno verte."}</h2>
              <p>{isRegistering ? "Empieza a compartir experiencias con contexto." : "Accede para gestionar tus experiencias."}</p>
            </div>

            <div className="auth-mode-switch" role="group" aria-label="Tipo de acceso">
              <button
                className={isRegistering ? "" : "active"}
                type="button"
                aria-pressed={!isRegistering}
                onClick={() => changeMode("login")}
              >
                Iniciar sesión
              </button>
              <button
                className={isRegistering ? "active" : ""}
                type="button"
                aria-pressed={isRegistering}
                onClick={() => changeMode("register")}
              >
                Crear cuenta
              </button>
            </div>

            <form className="auth-form" ref={formRef} onSubmit={handleSubmit}>
              {isRegistering && (
                <label className="auth-field">
                  <span>Nombre</span>
                  <input
                    className="form-control"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Cómo te llamamos"
                    required
                    maxLength={80}
                  />
                </label>
              )}
              <label className="auth-field">
                <span>Correo electrónico</span>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  required
                  maxLength={254}
                />
              </label>
              <label className="auth-field">
                <span>Contraseña</span>
                <input
                  className="form-control"
                  name="password"
                  type="password"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                  placeholder={isRegistering ? "Al menos 8 caracteres" : "Tu contraseña"}
                  minLength={isRegistering ? 8 : undefined}
                  required
                />
              </label>
              {isRegistering && (
                <label className="auth-field">
                  <span>Repite la contraseña</span>
                  <input
                    className="form-control"
                    name="passwordConfirmation"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Vuelve a escribirla"
                    minLength={8}
                    required
                  />
                </label>
              )}
              {isRegistering && (
                <fieldset className="auth-identity-fieldset">
                  <legend>¿Cómo quieres aparecer en tus reseñas?</legend>
                  <label className="auth-identity-option">
                    <input type="radio" name="publicName" value="anonymous" defaultChecked required />
                    <span>
                      <strong>Con nombre anónimo</strong>
                      <small>Tu nombre de cuenta no se mostrará públicamente.</small>
                    </span>
                  </label>
                  <label className="auth-identity-option">
                    <input type="radio" name="publicName" value="visible" required />
                    <span>
                      <strong>Mostrar mi nombre</strong>
                      <small>Tu nombre aparecerá junto a tus reseñas públicas.</small>
                    </span>
                  </label>
                  <p>En ambos casos, los datos de tu cuenta sirven para la moderación.</p>
                </fieldset>
              )}
              {!isRegistering && (
                <button
                  className="auth-forgot-link"
                  type="button"
                onClick={handlePasswordReset}
                disabled={isSubmitting}
                >
                  ¿Has olvidado tu contraseña?
                </button>
              )}
              <button className="auth-submit d-flex align-items-center justify-content-center u-focus-ring" type="submit" disabled={isSubmitting || !firebaseConfigured}>
                {isSubmitting ? "Un momento…" : isRegistering ? "Crear cuenta" : "Iniciar sesión"} <ArrowRight size={16} />
              </button>
              {notice && <p className={`auth-notice${noticeIsError ? " is-error" : ""}`} role={noticeIsError ? "alert" : "status"}>{notice}</p>}
            </form>

            <p className="auth-privacy-note">
              <ShieldCheck size={15} />
              <span>
                {firebaseConfigured
                  ? "El acceso se verifica con Firebase Authentication. Tu nombre público se guarda solo en este navegador hasta conectar los perfiles con la base de datos."
                  : "Firebase aún no está configurado: crea .env.local a partir de .env.example con los datos de Firebase Console."}
              </span>
            </p>
            <p className="auth-review-link">
              Para escribir o gestionar reseñas, inicia sesión o crea una cuenta.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuthPage;
