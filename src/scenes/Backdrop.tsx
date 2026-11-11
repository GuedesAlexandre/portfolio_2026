import { Suspense, useEffect, useRef, useState } from 'react';
import { SafeBoundary } from '../SafeBoundary';
import { prefersReducedMotion } from '../story/capabilities';
import type { ProjectId } from '../story/projects';
import { ProjectScene } from './registry';

/** Fond 3D d'un projet : monté seulement quand le projet approche de l'écran, démonté ensuite. */
export function Backdrop({ id, enabled }: { id: ProjectId; enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '60% 0px' });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [enabled]);
  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      {enabled && near && (
        <SafeBoundary>
          <Suspense fallback={null}>
            <ProjectScene id={id} still={prefersReducedMotion()} />
          </Suspense>
        </SafeBoundary>
      )}
    </div>
  );
}
