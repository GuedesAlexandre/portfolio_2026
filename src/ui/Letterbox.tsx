import type { ReactNode } from 'react';
import type { ChapterId } from '../story/chapters';
import { CHAPTERS } from '../story/chapters';
import type { StoryState } from '../story/timeline';
import { FilmRail } from './FilmRail';
import { Timecode } from './Timecode';

export function Letterbox({ state, onJump, sound, onToggleSound, children }: {
  state: StoryState; onJump: (id: ChapterId) => void; sound: boolean; onToggleSound: () => void; children?: ReactNode;
}) {
  const ch = CHAPTERS[state.index];
  return (
    <div className="film">
      <header className="bar bar-top">
        <a href="#chambre" className="logo" aria-label="accueil" onClick={(e) => { e.preventDefault(); onJump('chambre'); }}>a.</a>
        <Timecode timecode={state.timecode} depthMeters={state.depthMeters} label={ch.label} />
        <button type="button" className="sound" aria-pressed={sound} onClick={onToggleSound}>{sound ? 'son activé' : 'son coupé'}</button>
      </header>
      <FilmRail activeId={state.id} onJump={onJump} />
      {children}
      <footer className="bar bar-bottom">
        <p className="subtitle" aria-live="polite">{ch.subtitle}</p>
        <p className="slug">{ch.slug}</p>
      </footer>
    </div>
  );
}
