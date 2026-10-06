import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Star } from "lucide-react";

type ReviewDraft = {
  company: string;
  role: string;
  stage: string;
  experienceDate: string;
  rating: number;
  communication: string;
  feedback: string;
  ai: string;
  positive: string;
  improvement: string;
};

type ReviewPageProps = {
  onNavigate: (path: string) => void;
};

const communicationOptions = [
  { value: "regular", label: "Sí, me mantuvieron al tanto" },
  { value: "sometimes", label: "A veces, tuve que insistir" },
  { value: "ghosted", label: "No, dejaron de responder" },
];

const feedbackOptions = [
  { value: "helpful", label: "Sí, fue útil" },
  { value: "generic", label: "Sí, pero fue genérico" },
  { value: "none", label: "No recibí feedback" },
  { value: "not-applicable", label: "No llegué a entrevistarme" },
];

const aiOptions = [
  { value: "disclosed", label: "Sí, me explicaron cómo" },
  { value: "no-ai", label: "Me dijeron que no utilizan" },
  { value: "undisclosed", label: "No me lo aclararon" },
  { value: "unsure", label: "No estoy seguro/a" },
];

function ChoiceGroup({
  name,
  legend,
  options,
  required = false,
  selectedValue,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  required?: boolean;
  selectedValue?: string;
}) {
  return (
    <fieldset className="review-fieldset">
      <legend>{legend}{required && <span className="required-mark"> *</span>}</legend>
      <div className="choice-list">
        {options.map((option) => (
          <label className="choice-option" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              required={required}
              defaultChecked={option.value === selectedValue}
            />
            <span className="choice-indicator" aria-hidden="true"><Check size={12} /></span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReviewPage({ onNavigate }: ReviewPageProps) {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [formValues, setFormValues] = useState<ReviewDraft | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Trato — Comparte tu experiencia";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function getTextValue(formData: FormData, fieldName: string) {
    return String(formData.get(fieldName) ?? "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === 0) {
      setRatingError(true);
      document.getElementById("overall-rating")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const reviewDraft = {
      company: getTextValue(formData, "company"),
      role: getTextValue(formData, "role"),
      stage: getTextValue(formData, "stage"),
      experienceDate: getTextValue(formData, "experienceDate"),
      rating,
      communication: getTextValue(formData, "communication"),
      feedback: getTextValue(formData, "feedback"),
      ai: getTextValue(formData, "ai"),
      positive: getTextValue(formData, "positive"),
      improvement: getTextValue(formData, "improvement"),
    };
    setDraft(reviewDraft);
    setFormValues(reviewDraft);
  }

  function editDraft() {
    setDraft(null);
    setRatingError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stageLabels: Record<string, string> = {
    application: "Envié mi candidatura",
    screening: "Tuve una primera llamada",
    interviews: "Tuve una o más entrevistas",
    offer: "Recibí una oferta",
  };
  const communicationLabel = communicationOptions.find((option) => option.value === draft?.communication)?.label;
  const feedbackLabel = feedbackOptions.find((option) => option.value === draft?.feedback)?.label;
  const aiLabel = aiOptions.find((option) => option.value === draft?.ai)?.label;
  const experienceDate = draft
    ? new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(`${draft.experienceDate}-01T00:00:00Z`),
      )
    : "";

  return (
    <div className="review-page">
      <header className="site-header review-header">
        <a className="brand u-focus-ring" href="/" aria-label="Trato, volver al inicio" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <span className="brand-mark">t.</span><span>trato</span>
        </a>
        <a className="review-back-link u-focus-ring" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}><ArrowLeft size={15} /> Volver al inicio</a>
      </header>

      <main className="review-main">
        <div className="review-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> TU EXPERIENCIA IMPORTA</div>
          <h1>Que no se quede <span>en visto.</span></h1>
          <p>Comparte cómo fue tu proceso de selección. Tu opinión ayuda a otras personas a postular con más contexto.</p>
        </div>

        {draft ? (
          <section className="review-confirmation" role="status">
            <div className="confirmation-icon"><Check size={23} /></div>
            <div className="eyebrow"><span className="eyebrow-dot" /> VISTA PREVIA LISTA</div>
            <h2>Revisa tu experiencia.</h2>
            <p className="confirmation-summary">
              Así se verá el resumen de tu reseña de <strong>{draft.company}</strong>. Comprueba tus respuestas antes de continuar.
            </p>
            <dl className="draft-preview">
              <div><dt>Puesto</dt><dd>{draft.role}</dd></div>
              <div><dt>Etapa</dt><dd>{stageLabels[draft.stage]}</dd></div>
              <div><dt>Fecha</dt><dd>{experienceDate}</dd></div>
              <div><dt>Valoración</dt><dd><span className="preview-rating">{"★".repeat(draft.rating)}{"☆".repeat(5 - draft.rating)}</span> {draft.rating} de 5</dd></div>
              <div><dt>Comunicación</dt><dd>{communicationLabel}</dd></div>
              <div><dt>Feedback</dt><dd>{feedbackLabel}</dd></div>
              <div><dt>Información sobre IA</dt><dd>{aiLabel}</dd></div>
              {draft.positive && <div className="draft-comment"><dt>Qué hizo bien</dt><dd>{draft.positive}</dd></div>}
              {draft.improvement && <div className="draft-comment"><dt>Qué podría mejorar</dt><dd>{draft.improvement}</dd></div>}
            </dl>
            <div className="demo-notice">
              <ShieldCheck size={18} />
              <p><strong>Aún no se ha enviado.</strong> Esta versión no está conectada al servidor; tu reseña no se ha guardado ni publicado.</p>
            </div>
            <div className="confirmation-actions">
              <button className="review-submit-button u-focus-ring" type="button" onClick={editDraft}>Editar mis respuestas</button>
              <a className="review-secondary-link u-focus-ring" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>Volver al inicio <ArrowRight size={15} /></a>
            </div>
          </section>
        ) : (
          <div className="review-layout row g-4">
            <div className="col-12 col-lg-8">
              <form className="review-form" onSubmit={handleSubmit}>
              <section className="form-section">
                <div className="form-section-heading">
                  <span className="form-step">01</span>
                  <div><h2>El proceso</h2><p>Lo básico para entender tu experiencia.</p></div>
                </div>
                <div className="form-fields-grid">
                  <label className="form-field">
                    <span>Empresa <span className="required-mark">*</span></span>
                    <input className="form-control" name="company" type="text" placeholder="Ej. Nubea" autoComplete="organization" required maxLength={100} defaultValue={formValues?.company ?? ""} />
                  </label>
                  <label className="form-field">
                    <span>Puesto al que postulaste <span className="required-mark">*</span></span>
                    <input className="form-control" name="role" type="text" placeholder="Ej. Diseñadora de producto" required maxLength={100} defaultValue={formValues?.role ?? ""} />
                  </label>
                  <label className="form-field">
                    <span>¿Hasta dónde llegaste? <span className="required-mark">*</span></span>
                    <select className="form-select" name="stage" defaultValue={formValues?.stage ?? ""} required>
                      <option value="" disabled>Selecciona una etapa</option>
                      <option value="application">Envié mi candidatura</option>
                      <option value="screening">Tuve una primera llamada</option>
                      <option value="interviews">Tuve una o más entrevistas</option>
                      <option value="offer">Recibí una oferta</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>¿Cuándo ocurrió? <span className="required-mark">*</span></span>
                    <input className="form-control" name="experienceDate" type="month" required defaultValue={formValues?.experienceDate ?? ""} />
                  </label>
                </div>
              </section>

              <section className="form-section" id="overall-rating">
                <div className="form-section-heading">
                  <span className="form-step">02</span>
                  <div><h2>El trato</h2><p>Cuéntanos cómo te sentiste durante el proceso.</p></div>
                </div>
                <fieldset className="review-fieldset rating-fieldset">
                  <legend>En general, ¿cómo fue tu experiencia? <span className="required-mark">*</span></legend>
                  <div className="rating-picker" role="radiogroup" aria-label="Valoración general" aria-required="true">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        className={`rating-choice${rating >= value ? " selected" : ""}`}
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                        onClick={() => { setRating(value); setRatingError(false); }}
                      >
                        <Star size={25} fill={rating >= value ? "currentColor" : "none"} />
                      </button>
                    ))}
                    <span className="rating-hint">{rating ? `${rating} de 5` : "Selecciona una valoración"}</span>
                  </div>
                  {ratingError && <p className="field-error" role="alert">Elige una valoración para continuar.</p>}
                </fieldset>
                <ChoiceGroup name="communication" legend="¿Te mantuvieron al tanto?" options={communicationOptions} required selectedValue={formValues?.communication} />
                <ChoiceGroup name="feedback" legend="¿Recibiste feedback al terminar?" options={feedbackOptions} required selectedValue={formValues?.feedback} />
                <ChoiceGroup name="ai" legend="¿Te informaron sobre el uso de IA en la selección?" options={aiOptions} required selectedValue={formValues?.ai} />
              </section>

              <section className="form-section">
                <div className="form-section-heading">
                  <span className="form-step">03</span>
                  <div><h2>Lo que quieras contar</h2><p>Comparte detalles que puedan ayudar a alguien más.</p></div>
                </div>
                <label className="form-field textarea-field">
                  <span>¿Qué hizo bien la empresa?</span>
                  <textarea className="form-control" name="positive" rows={3} maxLength={1000} placeholder="Por ejemplo: explicaron las etapas y respetaron los horarios..." defaultValue={formValues?.positive ?? ""} />
                </label>
                <label className="form-field textarea-field">
                  <span>¿Qué podría mejorar?</span>
                  <textarea className="form-control" name="improvement" rows={3} maxLength={1000} placeholder="Por ejemplo: habría agradecido una respuesta después de la última entrevista..." defaultValue={formValues?.improvement ?? ""} />
                </label>
                <p className="form-guidance">Evita incluir nombres de personas, datos de contacto o información confidencial.</p>
              </section>

              <label className="consent-option">
                <input name="firsthand" type="checkbox" required defaultChecked={formValues !== null} />
                <span className="consent-checkbox"><Check size={13} /></span>
                <span>Confirmo que comparto una experiencia propia y que mi reseña no incluye datos personales de otras personas. <span className="required-mark">*</span></span>
              </label>
              <button className="review-submit-button u-focus-ring" type="submit">Revisar mi reseña <ArrowRight size={16} /></button>
              <p className="submit-hint"><ShieldCheck size={14} /> La reseña es anónima. No pedimos tu nombre ni tu correo.</p>
              </form>
            </div>

            <aside className="review-sidebar col-12 col-lg-4">
              <div className="privacy-card">
                <div className="privacy-icon"><ShieldCheck size={20} /></div>
                <h2>Tu identidad, fuera de la reseña.</h2>
                <p>No te pedimos nombre, correo ni perfil. Comparte solo lo que viviste desde tu perspectiva.</p>
                <div className="privacy-rule" />
                <ul>
                  <li><Check size={14} /> Sin nombres de entrevistadores</li>
                  <li><Check size={14} /> Sin datos de contacto</li>
                  <li><Check size={14} /> Habla desde tu experiencia</li>
                </ul>
              </div>
              <p className="review-sidebar-note">Las reseñas deben describir experiencias propias y opiniones honestas. No incluyas información confidencial de la empresa.</p>
            </aside>
          </div>
        )}
      </main>

      <footer className="review-footer">
        <a className="brand footer-brand u-focus-ring" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}><span className="brand-mark">t.</span><span>trato</span></a>
        <span>Un poco más de contexto. Un poco menos de ghosting.</span>
        <span className="copyright">© 2025 Trato</span>
      </footer>
    </div>
  );
}

export default ReviewPage;
