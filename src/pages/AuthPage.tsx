import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";

type AuthPageProps = {
  onNavigate: (path: string) => void;
  onAuthenticated: (showNameOnReviews: boolean) => void;
};

type AuthMode = "login" | "register";

function AuthPage({ onNavigate, onAuthenticated }: AuthPageProps) {
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
    onAuthenticated(isRegistering && formData.get("publicName") === "visible");
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
              <span>Acceso de demostración: las credenciales no se verifican y no se guardan. No uses una contraseña real.</span>
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
