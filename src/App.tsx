import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeBoundary } from './SafeBoundary';
import { Loader } from './loader/Loader';
import { hasWebGL, isCompact, prefersReducedMotion } from './story/capabilities';
import { useSectionProgress } from './story/useSectionProgress';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { Journey } from './sections/Journey';
import { Manifesto } from './sections/Manifesto';
import { Projects } from './sections/Projects';
import './styles/v3.css';

const ParticleStage = lazy(() => import('./particles/ParticleStage').then((m) => ({ default: m.ParticleStage })));

/** Les sections sont rendues après que le navigateur a tenté d'aller au #fragment : on le refait. */
function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
}

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
  useEffect(() => {
    scrollToHash();
    document.fonts?.ready.then(scrollToHash);
  }, []);
  const ready = useMemo(() => {
    let resolve3d!: () => void;
    const scene = show3d ? new Promise<void>((r) => { resolve3d = r; }) : Promise.resolve();
    return { done: Promise.all([document.fonts?.ready ?? Promise.resolve(), scene]), resolve3d: () => resolve3d?.() };
  }, [show3d]);
  return (
    <div className={`site${show3d ? '' : ' no-3d'}`}>
      {show3d && (
        <SafeBoundary>
          <Suspense fallback={null}>
            <ParticleStage progress={progress} compact={compact} onReady={ready.resolve3d} />
          </Suspense>
        </SafeBoundary>
      )}
      {loading && <Loader whenReady={ready.done} onDone={endLoading} />}
      <header className="nav">
        <a href="#intro" className="logo" aria-label="accueil">a.</a>
        <nav aria-label="sections"><a href="#projets">projets</a><a href="#parcours">parcours</a><a href="#contact">contact</a></nav>
      </header>
      <main>
        <Hero revealed={!loading} />
        <Manifesto ref={manifesto} />
        <Projects ref={projects} />
        <Journey />
      </main>
      <Contact />
    </div>
  );
}
