import { useEffect, useRef } from 'react';
import { decodeCommunes, drawGenetic, type GeneticData } from './geneticScene';

/** Fond du projet « Déserts médicaux » : l'algo génétique sur la vraie carte de France. Données chargées à l'approche. */
export function GeneticScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext?.('2d');
    if (!ctx || typeof IntersectionObserver === 'undefined') return;
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let data: GeneticData | null = null, loading = false, w = 0, h = 0, raf = 0, on = false;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (ms: number) => {
      if (data) drawGenetic(ctx, still ? 12 : ms / 1000, w, h, data);
      if (on && !still) raf = requestAnimationFrame(frame);
    };
    const load = () => {
      if (data || loading) return;
      loading = true;
      fetch('/genetique/data.json').then((r) => r.json()).then((raw) => {
        data = { ...raw, communes: decodeCommunes(raw.communes) };
        frame(performance.now());
      }).catch(() => { /* pas de données : fond noir */ });
    };
    size();
    const ro = new ResizeObserver(() => { size(); frame(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on) load();
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(frame);
    }, { rootMargin: '50% 0px' });
    io.observe(canvas);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="kelp-scene" aria-hidden="true" />;
}
