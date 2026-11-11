import { useCallback, useMemo, useRef, useState } from 'react';
import { KeyboardStage } from './keyboard/KeyboardStage';
import { Loader } from './loader/Loader';
import { hasWebGL, isCompact, prefersReducedMotion } from './story/capabilities';
import { useSectionProgress } from './story/useSectionProgress';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { Journey } from './sections/Journey';
import { Manifesto } from './sections/Manifesto';
import { Projects } from './sections/Projects';
import './styles/v3.css';

export default function App() {
  const manifesto = useRef<HTMLElement>(null);
  const projects = useRef<HTMLElement>(null);
  const progress = useRef<Record<string, number>>({});
  const refs = useMemo(() => ({ manifesto, projects }), []);
  useSectionProgress(refs, progress);
  const [show3d] = useState(() => hasWebGL() && !prefersReducedMotion());
  const [compact] = useState(isCompact);
  const [loading, setLoading] = useState(true);
  const endLoading = useCallback(() => setLoading(false), []);
  const ready = useMemo(() => {
    let resolve3d!: () => void;
    const scene = show3d ? new Promise<void>((r) => { resolve3d = r; }) : Promise.resolve();
    return { done: Promise.all([document.fonts?.ready ?? Promise.resolve(), scene]), resolve3d: () => resolve3d?.() };
  }, [show3d]);
  return (
    <>
      {show3d && <KeyboardStage progress={progress} compact={compact} onReady={ready.resolve3d} />}
      {loading && <Loader whenReady={ready.done} onDone={endLoading} />}
      <header className="nav">
        <a href="#intro" className="logo" aria-label="accueil">a.</a>
        <nav aria-label="sections"><a href="#projets">projets</a><a href="#parcours">parcours</a><a href="#contact">contact</a></nav>
      </header>
      <main>
        <Hero />
        <Manifesto ref={manifesto} />
        <Projects ref={projects} />
        <Journey />
      </main>
      <Contact />
    </>
  );
}
