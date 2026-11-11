import { useEffect, useState } from 'react';
import { SIGNATURE } from './signature';

/** Écran de chargement : « Alexandre » se trace à la plume, puis laisse place au titre. */
export function Loader({ whenReady, onDone, minMs = 3600, maxMs = 7000 }: {
  whenReady: Promise<unknown>; onDone: () => void; minMs?: number; maxMs?: number;
}) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let alive = true;
    const min = new Promise((r) => setTimeout(r, minMs));
    const max = new Promise((r) => setTimeout(r, maxMs));
    Promise.race([Promise.all([whenReady, min]), max]).then(() => {
      if (!alive) return;
      setLeaving(true);
      setTimeout(() => { if (!alive) return; setGone(true); onDone(); }, 1100);
    });
    return () => { alive = false; };
  }, [whenReady, onDone, minMs, maxMs]);

  if (gone) return null;
  return (
    <div className={`loader${leaving ? ' is-leaving' : ''}`}>
      <svg className="signature" viewBox={`0 0 ${SIGNATURE.width} ${SIGNATURE.height}`} aria-hidden="true">
        {SIGNATURE.glyphs.map((d, i) => (
          <path key={i} d={d} pathLength="1" style={{ animationDelay: `${0.2 + i * 0.24}s, ${0.2 + SIGNATURE.glyphs.length * 0.24 + 0.2}s` }} />
        ))}
      </svg>
      <p className="sr-only" role="status">chargement</p>
    </div>
  );
}
