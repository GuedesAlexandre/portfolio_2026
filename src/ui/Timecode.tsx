import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../story/capabilities';

/** Timecode + profondeur. L'aiguille de profondeur a de l'inertie : elle dépasse un peu puis se pose. */
export function Timecode({ timecode, depthMeters, label }: { timecode: string; depthMeters: number; label: string }) {
  const depthRef = useRef<HTMLSpanElement>(null);
  const value = useRef({ d: depthMeters });
  const to = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const el = depthRef.current!;
    const reduced = prefersReducedMotion();
    to.current = reduced
      ? (v) => { value.current.d = v; el.textContent = fmt(v); }
      : gsap.quickTo(value.current, 'd', { duration: 0.9, ease: 'back.out(1.6)', onUpdate: () => { el.textContent = fmt(value.current.d); } });
  }, []);
  useEffect(() => { to.current?.(depthMeters); }, [depthMeters]);

  return (
    <p className="timecode" aria-label={`${label}, profondeur ${depthMeters} mètres`}>
      <span>{timecode}</span>
      <span aria-hidden="true">·</span>
      <span ref={depthRef}>{fmt(depthMeters)}</span>
    </p>
  );
}
const fmt = (d: number) => (Math.round(d) === 0 ? '0 m' : `−${Math.max(0, Math.round(d))} m`);
