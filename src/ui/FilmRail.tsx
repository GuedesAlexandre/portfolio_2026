import { useState } from 'react';
import { CHAPTERS, type ChapterId } from '../story/chapters';

export function FilmRail({ activeId, highlight, onJump }: { activeId: ChapterId; highlight?: string | null; onJump: (id: ChapterId) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav id="rail" className={`rail${open ? ' is-open' : ''}`} aria-label="chapitres">
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-current={c.id === activeId ? 'step' : undefined}
                className={c.id === highlight ? 'is-hinted' : undefined}
                onClick={() => { setOpen(false); onJump(c.id); }}
              >
                <span className="rail-depth">{c.depthLabel}</span>
                <span className="rail-label">{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <button type="button" className="rail-toggle" aria-expanded={open} aria-controls="rail" onClick={() => setOpen((o) => !o)}>
        chapitres
      </button>
    </>
  );
}
