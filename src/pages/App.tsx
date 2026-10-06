import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import ReviewPage from "./ReviewPage";

type Company = {
  name: string;
  category: string;
  score: string;
  reviews: number;
  initials: string;
  color: string;
  note: string;
};

const companies: Company[] = [
  {
    name: "Nubea",
    category: "Finanzas · Tecnología",
    score: "4,8",
    reviews: 128,
    initials: "nu",
    color: "lilac",
    note: "Da feedback después de cada entrevista",
  },
  {
    name: "Marea",
    category: "Movilidad · Tecnología",
    score: "4,6",
    reviews: 86,
    initials: "C",
    color: "mint",
    note: "Proceso claro desde el primer contacto",
  },
  {
    name: "Faro",
    category: "Logística · Consumo",
    score: "3,9",
    reviews: 204,
    initials: "G",
    color: "peach",
    note: "Algunas candidaturas se quedan sin respuesta",
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Opiniones verificadas",
    text: "Experiencias de personas que han pasado por el proceso, no rumores de pasillo.",
  },
  {
    icon: Sparkles,
    title: "Sin cajas negras",
    text: "Señalamos cuándo se usa IA y si hay transparencia sobre cómo se toman decisiones.",
  },
  {
    icon: HeartHandshake,
    title: "El trato también cuenta",
    text: "Feedback, tiempos y comunicación importan tanto como el sueldo o el puesto.",
  },
];

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => {
    function syncPathname() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", syncPathname);
    return () => window.removeEventListener("popstate", syncPathname);
  }, []);

  function navigateTo(path: string) {
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
      setPathname(path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredCompanies = useMemo(() => {
    if (!submittedQuery) return companies;
    const normalizedQuery = submittedQuery.toLocaleLowerCase("es");
    return companies.filter((company) =>
      `${company.name} ${company.category}`.toLocaleLowerCase("es").includes(normalizedQuery),
    );
  }, [submittedQuery]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    document.getElementById("empresas")?.scrollIntoView({ behavior: "smooth" });
  }

  if (pathname === "/resena") {
    return <ReviewPage onNavigate={navigateTo} />;
  }

  return (
    <div className="site-shell">
      <header className="site-header d-flex align-items-center justify-content-between">
        <a className="brand d-inline-flex align-items-center" href="/" aria-label="Trato, inicio" onClick={(event) => { event.preventDefault(); navigateTo("/"); }}>
          <span className="brand-mark">t.</span>
          <span>trato</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#empresas">Explorar empresas</a>
          <a href="#principios">Para qué existe</a>
        </nav>
        <a className="header-cta d-flex align-items-center u-focus-ring" href="/resena" onClick={(event) => { event.preventDefault(); navigateTo("/resena"); }}>
          Escribir una reseña <ArrowUpRight size={15} />
        </a>
      </header>

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> EL TRATO TAMBIÉN ES TRABAJO</div>
            <h1>
              No postules
              <br />
              <span>a ciegas.</span>
            </h1>
            <p className="hero-description">
              Descubre cómo es un proceso de selección antes de entrar en él. Porque buscar trabajo
              también debería sentirse humano.
            </p>
            <form className="search-form" onSubmit={handleSearch}>
              <Search size={19} aria-hidden="true" />
              <label className="visually-hidden" htmlFor="company-search">Busca una empresa</label>
              <input
                id="company-search"
                type="search"
                placeholder="Busca una empresa..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="d-inline-flex align-items-center justify-content-center" type="submit">Buscar <ArrowRight size={16} /></button>
            </form>
            <div className="hero-footnote d-flex align-items-center">
              <span className="avatar-stack d-flex" aria-hidden="true">
                <i>m</i><i>a</i><i>l</i><i>+</i>
              </span>
              <span>Una comunidad que comparte para ayudar.</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Resumen de valoraciones de una empresa">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="floating-note note-top d-flex align-items-center"><span className="note-icon"><Check size={15} /></span> Responden en 10 días</div>
            <div className="rating-card">
              <div className="rating-card-top d-flex align-items-center">
                <div className="company-avatar lilac">nu</div>
                <div><span className="micro-label">EJEMPLO · PERFIL DE EMPRESA</span><h2>Nubea</h2></div>
                <button className="icon-button u-focus-ring" type="button" aria-label="Ver perfil de Nubea"><ArrowUpRight size={17} /></button>
              </div>
              <div className="rating-score-row d-flex align-items-center">
                <strong>4,8</strong>
                <div className="star-rating" aria-label="4,8 de 5 estrellas">
                  <span className="d-flex"><Star /><Star /><Star /><Star /><Star /></span>
                  <small>de 128 experiencias</small>
                </div>
              </div>
              <div className="rating-divider" />
              <div className="metric-row d-flex justify-content-between align-items-center"><span className="d-flex align-items-center"><Clock3 size={15} /> Tiempo de respuesta</span><b className="d-flex align-items-center">Rápido <i className="metric-dot good" /></b></div>
              <div className="metric-row d-flex justify-content-between align-items-center"><span className="d-flex align-items-center"><Sparkles size={15} /> Transparencia con IA</span><b className="d-flex align-items-center">Alta <i className="metric-dot good" /></b></div>
              <div className="metric-row d-flex justify-content-between align-items-center"><span className="d-flex align-items-center"><HeartHandshake size={15} /> Trato a candidatos</span><b className="d-flex align-items-center">Muy bueno <i className="metric-dot good" /></b></div>
              <div className="quote-card">
                <span className="quote-stars">★★★★★</span>
                <p>“Me avisaron en cada etapa, incluso cuando decidieron seguir con otra persona.”</p>
                <small>— Experiencia compartida · hace 2 semanas</small>
              </div>
            </div>
            <div className="floating-note note-bottom d-flex align-items-center"><span className="pulse-dot" /> 128 personas ya compartieron</div>
            <div className="art-caption">Una candidatura merece una respuesta.</div>
          </div>
        </section>

        <section className="trust-strip d-flex align-items-center" aria-label="La misión de Trato">
          <span>MENOS INCERTIDUMBRE.</span>
          <span className="strip-star">✳</span>
          <span>MÁS TRANSPARENCIA.</span>
          <span className="strip-star">✳</span>
          <span>MEJORES PROCESOS.</span>
          <span className="strip-star">✳</span>
          <span>MENOS INCERTIDUMBRE.</span>
        </section>

        <section className="companies-section section-wrap" id="empresas">
          <div className="section-heading">
            <div>
              <div className="eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> LO QUE CUENTA LA COMUNIDAD</div>
              <h2>Empresas, <span>sin filtro.</span></h2>
            </div>
            <a href="#principios" className="text-link d-inline-flex align-items-center">Cómo puntuamos <ArrowRight size={16} /></a>
          </div>
          {submittedQuery && (
            <p className="search-feedback" role="status">
              {filteredCompanies.length
                ? `Resultados para “${submittedQuery}”`
                : `No encontramos “${submittedQuery}” entre las empresas de ejemplo. Prueba con Nubea, Marea o Faro.`}
              <button type="button" onClick={() => { setQuery(""); setSubmittedQuery(""); }}>Ver todas</button>
            </p>
          )}
          {filteredCompanies.length > 0 ? (
            <div className="company-grid">
              {filteredCompanies.map((company) => (
                <article className="company-card" key={company.name}>
                  <div className="company-card-head d-flex align-items-center justify-content-between">
                    <div className={`company-avatar ${company.color}`}>{company.initials}</div>
                    <span className="score-badge d-inline-flex align-items-center"><Star size={14} fill="currentColor" /> {company.score}</span>
                  </div>
                  <h3>{company.name}</h3>
                  <p className="company-category">{company.category}</p>
                  <div className="company-card-rule" />
                  <p className="company-note d-flex align-items-center"><span className="note-check"><Check size={13} /></span>{company.note}</p>
                  <div className="company-card-bottom d-flex justify-content-between align-items-center">
                    <span>{company.reviews} experiencias</span>
                    <a className="u-focus-ring" href="#como-funciona" aria-label={`Conoce más sobre ${company.name}`}><ArrowUpRight size={17} /></a>
                  </div>
                </article>
              ))}
            </div>
          ) : submittedQuery ? null : null}
          <p className="example-disclaimer">Nombres, valoraciones y opiniones ficticios, solo para enseñar cómo funciona la plataforma.</p>
        </section>

        <section className="how-section" id="como-funciona">
          <div className="section-wrap how-layout">
            <div className="how-intro">
              <div className="eyebrow light-eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> INFORMACIÓN QUE CAMBIA EL JUEGO</div>
              <h2>Una búsqueda de trabajo más <span>justa empieza aquí.</span></h2>
              <p>Compartir una experiencia puede ahorrarle semanas de incertidumbre a alguien más.</p>
              <a href="#principios" className="light-link d-inline-flex align-items-center">Nuestra forma de hacer las cosas <ArrowRight size={16} /></a>
            </div>
            <div className="steps-list">
              <article className="step-item">
                <span className="step-number">01</span><div><h3>Busca antes de postular</h3><p>Encuentra experiencias reales sobre entrevistas, comunicación y tiempos.</p></div><ChevronDown size={18} />
              </article>
              <article className="step-item">
                <span className="step-number">02</span><div><h3>Decide con contexto</h3><p>Compara cómo cuida cada empresa a quienes están buscando una oportunidad.</p></div><ChevronDown size={18} />
              </article>
              <article className="step-item">
                <span className="step-number">03</span><div><h3>Comparte lo que viviste</h3><p>Tu experiencia ayuda a que la siguiente persona llegue mejor preparada.</p></div><ChevronDown size={18} />
              </article>
            </div>
          </div>
        </section>

        <section className="principles-section section-wrap" id="principios">
          <div className="principles-heading">
            <div className="eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> UN MERCADO LABORAL MÁS HUMANO</div>
            <h2>El talento merece <span>respeto.</span></h2>
            <p>La transparencia no es un extra. Es el punto de partida.</p>
          </div>
          <div className="principle-grid">
            {principles.map(({ icon: Icon, title, text }, index) => (
              <article className="principle-card" key={title}>
                <div className="principle-icon"><Icon size={21} /></div>
                <span className="principle-index">0{index + 1}</span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="join-section section-wrap">
          <div className="join-card">
            <div className="join-sparkle">✳</div>
            <div className="eyebrow light-eyebrow d-flex align-items-center"><span className="eyebrow-dot" /> TU EXPERIENCIA PUEDE AYUDAR</div>
            <h2>¿Ya pasaste por un proceso?</h2>
            <p>Cuéntalo de forma anónima. Hagamos que buscar trabajo sea un poco menos a ciegas.</p>
            <a href="/resena" className="join-button d-inline-flex align-items-center u-focus-ring" onClick={(event) => { event.preventDefault(); navigateTo("/resena"); }}>Comparte tu experiencia <ArrowRight size={17} /></a>
            <span className="join-note"><ShieldCheck size={14} /> Sin nombres. Sin juicios. Solo información útil.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap d-flex align-items-center">
        <a className="brand footer-brand d-inline-flex align-items-center" href="/" onClick={(event) => { event.preventDefault(); navigateTo("/"); }}><span className="brand-mark">t.</span><span>trato</span></a>
        <span>Un poco más de contexto. Un poco menos de ghosting.</span>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="back-top d-flex align-items-center">Volver arriba <ArrowDown size={14} /></a>
        <span className="copyright">© 2025 Trato</span>
      </footer>
    </div>
  );
}

export default App;
