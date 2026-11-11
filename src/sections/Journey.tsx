import { INVENTORY, JOURNEY, STACK } from '../story/about';

export function Journey() {
  return (
    <section id="parcours" className="journey" aria-labelledby="parcours-title">
      <h2 id="parcours-title" className="section-title">Parcours</h2>
      <ol className="journey-list">
        {JOURNEY.map((j) => (
          <li key={j.what}><span className="journey-when">{j.when}</span><span><strong>{j.what}</strong><br />{j.how}</span></li>
        ))}
      </ol>
      <div className="journey-grid">
        <dl className="kv">{STACK.map((s) => <div key={s.part}><dt>{s.part}</dt><dd>{s.value}</dd></div>)}</dl>
        <dl className="kv">{INVENTORY.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>
      <p className="margin-note n-5" aria-hidden="true">ingénieur, 2028</p>
    </section>
  );
}
