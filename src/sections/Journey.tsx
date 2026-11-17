import type { CSSProperties } from 'react';
import { INVENTORY, JOURNEY, STACK } from '../story/about';
import { useInView } from '../ui/useInView';

/** Le parcours comme une page du carnet : une frise tracée à l'encre, puis deux fiches à points de conduite. */
export function Journey() {
  const [ref, seen] = useInView<HTMLOListElement>();
  return (
    <section id="parcours" className="journey" aria-labelledby="parcours-title">
      <h2 id="parcours-title" className="section-title">Parcours</h2>
      <ol ref={ref} className={`timeline${seen ? ' is-drawn' : ''}`}>
        {JOURNEY.map((j, i) => (
          <li key={j.what} style={{ '--i': i } as CSSProperties}>
            <span className="timeline-when">{j.when}</span>
            <span className="timeline-dot" aria-hidden="true" />
            <span className="timeline-what"><strong>{j.what}</strong>{j.how}</span>
          </li>
        ))}
      </ol>
      <p className="margin-note n-5" aria-hidden="true">ingénieur, 2028</p>
      <div className="sheets">
        <Sheet title="La stack" rows={STACK.map((s) => [s.part, s.value])} />
        <Sheet title="Le reste" rows={INVENTORY} />
      </div>
    </section>
  );
}

function Sheet({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="sheet">
      <h3 className="sheet-title">{title}</h3>
      <dl>
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </div>
  );
}
