import { useEffect, useState } from 'react';
import { Dev } from './Dev';

const NOTES = [
  { t: 'git pull', x: -230, y: -120 }, { t: 'mvn clean install', x: 150, y: -150 },
  { t: 'kubectl get pods', x: -260, y: 60 }, { t: 'npm run dev', x: 190, y: 40 },
  { t: 'docker compose up', x: -120, y: 170 }, { t: './gradlew build', x: 120, y: 160 },
  { t: 'SELECT 1;', x: 20, y: -200 },
];

/** Écran de chargement : des commandes manuscrites apparaissent, le petit dev arrive en marchant. */
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
      <div className="loader-stage" aria-hidden="true">
        {NOTES.map((n, i) => (
          <span key={n.t} className="loader-note" style={{ transform: `translate(${n.x}px, ${n.y}px) rotate(${((i % 3) - 1) * 4}deg)`, animationDelay: `${0.15 + i * 0.22}s` }}>{n.t}</span>
        ))}
        <Dev walking className="loader-dev" />
      </div>
      <p className="loader-status" role="status">chargement… on branche le clavier</p>
    </div>
  );
}
