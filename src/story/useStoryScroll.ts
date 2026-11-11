import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChapterId } from './chapters';
import { parseHash } from './hash';
import { prefersReducedMotion as reduced } from './capabilities';
import { chapterProgress, progressToState } from './timeline';

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/** Le scroll du document est la timeline du film. */
export function useStoryScroll() {
  const [progress, setProgress] = useState(0);
  const lastId = useRef<ChapterId>('chambre');

  const jumpTo = useCallback((id: ChapterId, instant = false) => {
    window.scrollTo({ top: chapterProgress(id) * maxScroll(), behavior: instant || reduced() ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  useEffect(() => {
    // Dev seulement : ?shot=kelp fige la caméra sur un plan (captures de contrôle).
    const shot = import.meta.env.DEV ? parseHash('#' + (new URLSearchParams(location.search).get('shot') ?? '')) : null;
    if (shot) { setProgress(chapterProgress(shot)); return; }
    let raf = 0;
    const read = () => {
      raf = 0;
      const p = window.scrollY / maxScroll();
      setProgress(p);
      const id = progressToState(p).id;
      if (id !== lastId.current) {
        lastId.current = id;
        history.replaceState(null, '', `#${id}`);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    const start = parseHash(location.hash);
    if (start) requestAnimationFrame(() => jumpTo(start, true));
    read();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [jumpTo]);

  return { progress, state: progressToState(progress), jumpTo };
}
