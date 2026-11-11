import { forwardRef, useEffect, useState } from 'react';
import { MANIFESTO } from '../story/about';
import { sectionProgress } from '../story/sectionMath';

const WORDS = MANIFESTO.split(' ');

/** La phrase s'éclaire mot à mot pendant que le clavier la tape. */
export const Manifesto = forwardRef<HTMLElement>(function Manifesto(_, ref) {
  const [lit, setLit] = useState(WORDS.length);
  useEffect(() => {
    const el = (ref as React.RefObject<HTMLElement>).current;
    if (!el || matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const read = () => {
      const p = sectionProgress(el.getBoundingClientRect(), innerHeight);
      setLit(Math.round(Math.min(1, Math.max(0, (p - 0.2) / 0.5)) * WORDS.length));
    };
    read();
    addEventListener('scroll', read, { passive: true });
    return () => removeEventListener('scroll', read);
  }, [ref]);
  return (
    <section id="manifeste" className="manifesto" ref={ref}>
      <div className="manifesto-sticky">
        <p className="margin-note n-4" aria-hidden="true">O(complexe) → O(simple)</p>
        <p className="manifesto-text">
          <span className="sr-only">{MANIFESTO}</span>
          {WORDS.map((w, i) => <span key={i} aria-hidden="true" className={i < lit ? 'is-lit' : undefined}>{w} </span>)}
        </p>
      </div>
    </section>
  );
});
