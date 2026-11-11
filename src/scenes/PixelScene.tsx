import { useEffect, useRef } from 'react';
import type { ProjectId } from '../story/projects';
import { SCENES, SCENE_H, SCENE_W } from './scenes';

/** Fond animé en pixel art ; ne tourne que lorsqu'il est à l'écran. */
export function PixelScene({ id }: { id: Exclude<ProjectId, 'azathro'> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;
    const draw = SCENES[id];
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    draw(ctx, 2);
    if (still || typeof IntersectionObserver === 'undefined') return;
    let raf = 0, on = false;
    const loop = (ms: number) => { draw(ctx, ms / 1000); if (on) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [id]);
  return <canvas ref={ref} className="pixel-scene" width={SCENE_W} height={SCENE_H} aria-hidden="true" />;
}
