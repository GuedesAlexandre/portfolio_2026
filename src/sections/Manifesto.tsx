import { forwardRef, useEffect, useState } from 'react';
import { MANIFESTO } from '../story/about';
import { litWords, stickyProgress } from '../story/sectionMath';

const WORDS = MANIFESTO.split(' ');

/** La phrase s'éclaire mot à mot au fil du scroll. */
export const Manifesto = forwardRef<HTMLElement>(function Manifesto(_, ref) {
  const [lit, setLit] = useState(WORDS.length);
  useEffect(() => {
    const el = (ref as React.RefObject<HTMLElement>).current;
    if (!el || matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const read = () => {
      // Les mots s'allument pendant que la phrase est collée à l'écran, pas pendant qu'elle arrive.
      setLit(litWords(stickyProgress(el.getBoundingClientRect(), innerHeight), WORDS.length));
    };
    read();
    addEventListener('scroll', read, { passive: true });
    return () => removeEventListener('scroll', read);
  }, [ref]);
  return (
    <section id="manifeste" className="manifesto" ref={ref}>
      <div className="manifesto-sticky">
        <p className="manifesto-text">
          <span className="sr-only">{MANIFESTO}</span>
          {WORDS.map((w, i) => <span key={i} aria-hidden="true" className={i < lit ? 'is-lit' : undefined}>{w} </span>)}
        </p>
      </div>
    </section>
  );
});
