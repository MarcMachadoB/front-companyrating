import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";

type AuthPageProps = {
  onNavigate: (path: string) => void;
};

type AuthMode = "login" | "register";

function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [notice, setNotice] = useState("");

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
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isRegistering && formData.get("password") !== formData.get("passwordConfirmation")) {
      setNotice("Las contraseñas no coinciden. Revísalas e inténtalo de nuevo.");
      return;
    }
    setNotice("El formulario está completo, pero no se ha enviado: la autenticación todavía no está conectada al servidor.");
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
              Crea una cuenta para reunir tus reseñas y poder gestionarlas. Tu nombre no aparecerá junto a tus experiencias públicas.
            </p>
            <div className="auth-story-points">
              <p><Check size={15} /> Comparte más de una experiencia</p>
              <p><Check size={15} /> Edita y gestiona tus reseñas</p>
              <p><Check size={15} /> Mantén tu identidad privada</p>
            </div>
            <div className="auth-story-footnote">
              <LockKeyhole size={15} />
              <span>Tu cuenta ayuda a moderar; no cambia el anonimato público de tus reseñas.</span>
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

            <form className="auth-form" onSubmit={handleSubmit}>
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
              {!isRegistering && (
                <button
                  className="auth-forgot-link"
                  type="button"
                  onClick={() => setNotice("La recuperación de contraseña estará disponible cuando conectemos la autenticación al servidor.")}
                >
                  ¿Has olvidado tu contraseña?
                </button>
              )}
              <button className="auth-submit d-flex align-items-center justify-content-center u-focus-ring" type="submit">
                {isRegistering ? "Crear cuenta" : "Iniciar sesión"} <ArrowRight size={16} />
              </button>
              {notice && <p className="auth-notice" role="status">{notice}</p>}
            </form>

            <p className="auth-privacy-note">
              <ShieldCheck size={15} />
              <span>La autenticación aún no está activa. No introduzcas una contraseña que uses en otros servicios.</span>
            </p>
            <p className="auth-review-link">
              ¿Quieres compartir una experiencia?{" "}
              <a
                href="/resena"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate("/resena");
                }}
              >
                Ir al formulario
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuthPage;
