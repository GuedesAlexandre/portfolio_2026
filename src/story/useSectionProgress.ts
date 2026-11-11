import { useEffect, type RefObject } from 'react';
import { sectionProgress } from './sectionMath';

/** Écrit la progression de chaque section observée dans `out` (pas de re-render : le canvas la lit à chaque image). */
export function useSectionProgress(refs: Record<string, RefObject<HTMLElement | null>>, out: { current: Record<string, number> }) {
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      for (const [k, r] of Object.entries(refs)) {
        const el = r.current;
        if (el) out.current[k] = sectionProgress(el.getBoundingClientRect(), innerHeight);
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    read();
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [refs, out]);
}
