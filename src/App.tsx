import { useRef, useState } from 'react';
import { hasWebGL, prefersReducedMotion } from './story/capabilities';
import { StaticFilm } from './ui/StaticFilm';
import { useStoryScroll } from './story/useStoryScroll';
import { Letterbox } from './ui/Letterbox';
import { Shots } from './ui/Shots';
import { ScriptPage } from './ui/ScriptPage';
import { Stage } from './scene/Stage';
import { Cartridge, CARTRIDGES } from './scene/sets/Room';
import { isCompact } from './story/capabilities';
import type { ProjectId } from './story/projects';
import './ui/ui.css';

export default function App() {
  const [cinema] = useState(() => hasWebGL() && !prefersReducedMotion());
  if (!cinema) return <StaticFilm />;
  return <Cinema />;
}

function Cinema() {
  const { progress, state, jumpTo } = useStoryScroll();
  const [sound, setSound] = useState(false);
  const [script, setScript] = useState<ProjectId | null>(null);
  const progressRef = useRef(0);
  progressRef.current = progress;
  const pointer = useRef({ x: 0, y: 0 });
  const [compact] = useState(isCompact);
  const carts = CARTRIDGES.map((c, i) => (
    <group key={c.id} position={[-3.7 + i * 0.78, 0, 2.6 + (i % 2) * 0.12]} rotation={[-0.12, (i - 1.5) * 0.12, 0]} scale={0.66}>
      <Cartridge label={c.label} color={c.color} />
    </group>
  ));

  return (
    <>
      <main>
        <h1 className="sr-only">Alexandre — apprenti ingénieur logiciel. Le film de la plongée.</h1>
        <div className="timeline-spacer" aria-hidden="true" />
      </main>
      <Stage progressRef={progressRef} pointer={pointer} compact={compact} roomExtras={carts} />
      <Letterbox state={state} onJump={jumpTo} sound={sound} onToggleSound={() => setSound((s) => !s)}>
        <Shots activeId={state.id} onOpenScript={setScript} onJump={jumpTo} />
      </Letterbox>
      {script && <ScriptPage projectId={script} onClose={() => setScript(null)} onCutTo={(id) => { setScript(null); jumpTo(id, true); }} />}
    </>
  );
}
