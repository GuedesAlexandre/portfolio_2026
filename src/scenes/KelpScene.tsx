import { useEffect, useRef } from 'react';
import { drawKelp } from './kelpScene';

/** Fond du projet Kelp : une session de l'appli rejouée en boucle, nette à toutes les tailles. */
export function KelpScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, on = false;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (ms: number) => { drawKelp(ctx, still ? 11 : ms / 1000, w, h); if (on && !still) raf = requestAnimationFrame(frame); };
    size(); frame(11000);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { size(); frame(performance.now()); }) : null;
    ro?.observe(canvas);
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => {
      on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(frame);
    }) : null;
    io?.observe(canvas);
    return () => { ro?.disconnect(); io?.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="kelp-scene" aria-hidden="true" />;
}
