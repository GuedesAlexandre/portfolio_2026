import { useEffect, useState } from 'react';
import { Bug } from './Bug';
import { Runner } from './Runner';

const NOTES = [
  { t: 'git pull', x: -230, y: -120 }, { t: 'mvn clean install', x: 150, y: -150 },
  { t: 'kubectl get pods', x: -260, y: 60 }, { t: 'npm run dev', x: 190, y: 40 },
  { t: 'docker compose up', x: -120, y: 170 }, { t: './gradlew build', x: 120, y: 160 },
  { t: 'SELECT 1;', x: 20, y: -200 },
];

/** Écran de chargement : le dev court après un bug pendant que la page se prépare. */
export function Loader({ whenReady, onDone, minMs = 2200, maxMs = 7000 }: {
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
      <div className="chase" aria-hidden="true">
        <div className="chase-notes">
          {NOTES.map((n, i) => (
            <span key={n.t} className="loader-note" style={{ left: `${10 + i * 13}%`, top: `${i % 2 ? 66 + ((i * 7) % 14) : 12 + ((i * 11) % 16)}%`, animationDelay: `${-((i * 1.7) % 6)}s` }}>{n.t}</span>
          ))}
        </div>
        <div className="chase-ground" />
        <div className="chase-actors">
          <Runner className="chase-runner" />
          <div className="chase-bug"><span className="bug-shout">un bug !</span><Bug /></div>
        </div>
      </div>
      <p className="loader-status" role="status">chargement… chasse au bug en cours</p>
    </div>
  );
}
