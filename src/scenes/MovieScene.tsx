import '@fontsource/poppins/500.css';
import '@fontsource/poppins/800.css';

const WISH = 'Un truc tendu mais lent, pas trop bavard...';

/** Mêmes tracés que les icônes de l'appli MovieRecom. */
const Icon = ({ d }: { d: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d={d} stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Result({ n, title, facts, reason }: { n: string; title: string; facts: string; reason: string }) {
  return (
    <div className={`mr-result mr-result-${n}`}>
      <div className="mr-poster" />
      <div className="mr-details">
        <p className="mr-badge">Proposition - {n}</p>
        <p className="mr-title">{title}</p>
        <p className="mr-facts">{facts}</p>
        <p className="mr-why">Pourquoi ce choix ?</p>
        <p className="mr-reason">{reason}</p>
      </div>
      <div className="mr-nav mr-prev"><Icon d="M15 5l-7 7 7 7" /> <span>Pas ce soir</span></div>
      <div className="mr-nav mr-take"><Icon d="M5 12l5 5 9-10" /> <span>Je prends</span></div>
    </div>
  );
}

/** Fond du projet MovieRecom : une session « Conseil du soir » rejouée, avec l'interface réelle de l'appli. */
export function MovieScene() {
  return (
    <div className="mr" aria-hidden="true">
      <div className="mr-halo" />
      <p className="mr-watermark">ce soir</p>

      <div className="mr-request">
        <p className="mr-eyebrow">CONSEIL DU SOIR · VENDREDI 21 H 30</p>
        <p className="mr-h1">Qu'est-ce que t'as envie de regarder ce soir ?</p>
        <div className="mr-types">
          <span>Peu importe</span><span className="mr-type-film">Un film</span><span>Une série</span>
        </div>
        <div className="mr-input">
          <span className="mr-typed" style={{ '--n': WISH.length } as React.CSSProperties}>{WISH}</span>
          <span className="mr-send">ENVOYER</span>
        </div>
      </div>

      <div className="mr-status"><span className="mr-spinner" />On cherche ton film du soir…</div>

      <Result n="01" title="Un huis clos dans la neige" facts="Film · Années 80 · Moins de 2 h" reason="Tendu, lent, très peu de dialogues : exactement ce que tu as demandé." />
      <Result n="02" title="Une traque silencieuse" facts="Film · Thriller · 1 h 50" reason="Plus lent encore, et presque sans paroles. Pas de suite à rattraper." />
      <p className="mr-toast">Ajouté à ta Pensine</p>
    </div>
  );
}
