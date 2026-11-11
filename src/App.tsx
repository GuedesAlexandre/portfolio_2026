import { useState } from 'react';
import { useStoryScroll } from './story/useStoryScroll';
import { Letterbox } from './ui/Letterbox';
import './ui/ui.css';

export default function App() {
  const { state, jumpTo } = useStoryScroll();
  const [sound, setSound] = useState(false);

  return (
    <>
      <main>
        <h1 className="sr-only">Alexandre — apprenti ingénieur logiciel. Le film de la plongée.</h1>
        <div className="timeline-spacer" aria-hidden="true" />
      </main>
      <Letterbox state={state} onJump={jumpTo} sound={sound} onToggleSound={() => setSound((s) => !s)} />
    </>
  );
}
