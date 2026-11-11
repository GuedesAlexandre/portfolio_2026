import { useEffect, useRef } from 'react';
import { IDLE, runPose, type Pose } from './pose';

const SKIN = '#e3c3a0';
const HAIR = '#1c1714';
const HOODIE = '#2c2a28';
const HOODIE_BACK = '#211f1e';
const DENIM = '#3e5876';
const DENIM_BACK = '#2f435c';
const LINE = '#ede8df';
const STITCH = '#ff6a1f';

type Part = 'root' | 'torsoA' | 'torsoB' | 'torsoC' | 'head' | 'armF' | 'elbowF' | 'armB' | 'elbowB' | 'thighF' | 'kneeF' | 'footF' | 'thighB' | 'kneeB' | 'footB';

function Leg({ front, refs }: { front: boolean; refs: Record<string, (el: SVGGElement | null) => void> }) {
  const denim = front ? DENIM : DENIM_BACK;
  const s = front ? 'F' : 'B';
  return (
    <g ref={refs[`thigh${s}`]}>
      <path d="M-10 -4 C-11 14 -9 32 -7.5 46 L7.5 46 C9 32 11 14 10 -4 Z" fill={denim} stroke={LINE} strokeWidth="1.4" />
      <path d="M3 2 C4 16 4 32 3 45" stroke={STITCH} strokeWidth="0.9" fill="none" strokeDasharray="2 1.6" />
      <g ref={refs[`knee${s}`]} transform="translate(0 46)">
        <path d="M-7.5 -2 C-7 14 -7 28 -7.4 42 L7.8 42 C7.5 28 7.5 14 7.5 -2 Z" fill={denim} stroke={LINE} strokeWidth="1.4" />
        <path d="M-8 35 L8 35" stroke={LINE} strokeWidth="1" opacity="0.7" />
        <path d="M2.5 0 L2.8 34" stroke={STITCH} strokeWidth="0.9" fill="none" strokeDasharray="2 1.6" />
        <g ref={refs[`foot${s}`]} transform="translate(0 42)">
          <path d="M-8 -3 L5 -4 Q13 -2 20 3 Q23 8 18 9 L-9 9 Q-11 3 -8 -3 Z" fill={front ? '#ede8df' : '#cfc8bb'} stroke={LINE} strokeWidth="1.2" />
          <path d="M-9 9 L18 9 Q21 11 17 12.5 L-9 12.5 Z" fill="#8c867c" />
          <path d="M-1 2 Q6 3 13 6" stroke={STITCH} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M4 -3 l2 3 M7 -2.5 l2 3" stroke={HAIR} strokeWidth="0.9" />
        </g>
      </g>
    </g>
  );
}

function Arm({ front, refs }: { front: boolean; refs: Record<string, (el: SVGGElement | null) => void> }) {
  const s = front ? 'F' : 'B';
  const sleeve = front ? HOODIE : HOODIE_BACK;
  return (
    <g transform="translate(1 -55)">
      <g ref={refs[`arm${s}`]}>
        <path d="M-6.5 -3 C-7.5 10 -6.5 20 -5.5 28 L5.5 28 C6.5 20 7.5 10 6.5 -3 Z" fill={sleeve} stroke={LINE} strokeWidth="1.3" />
        <g ref={refs[`elbow${s}`]} transform="translate(0 27)">
          <path d="M-5.5 -1 L-5 19 L5 19 L5.5 -1 Z" fill={sleeve} stroke={LINE} strokeWidth="1.3" />
          <path d="M-5.2 16 L5.2 16" stroke={LINE} strokeWidth="1" opacity="0.6" />
          <circle cx="0" cy="23.5" r="5" fill={SKIN} stroke={LINE} strokeWidth="1.1" />
        </g>
      </g>
    </g>
  );
}

/** Un dev en sweat, jean et baskets. `mode="run"` : il court ; sinon il se tient debout. */
export function Runner({ mode = 'run', className = '' }: { mode?: 'run' | 'idle'; className?: string }) {
  const parts = useRef<Partial<Record<Part, SVGGElement>>>({});
  const refs = Object.fromEntries((['torsoA', 'torsoB', 'torsoC', 'head', 'armF', 'elbowF', 'armB', 'elbowB', 'thighF', 'kneeF', 'footF', 'thighB', 'kneeB', 'footB', 'root'] as Part[])
    .map((p) => [p, (el: SVGGElement | null) => { if (el) parts.current[p] = el; }]));

  useEffect(() => {
    const set = (p: Part, t: string) => parts.current[p]?.setAttribute('transform', t);
    const apply = (q: Pose) => {
      set('root', `translate(70 ${118 + q.bob})`);
      for (const t of ['torsoA', 'torsoB', 'torsoC'] as Part[]) set(t, `rotate(${q.lean})`);
      set('head', `translate(3 -64) rotate(${q.head})`);
      set('thighF', `rotate(${-q.thighFront})`); set('kneeF', `translate(0 46) rotate(${q.kneeFront})`); set('footF', `translate(0 42) rotate(${q.footFront})`);
      set('thighB', `rotate(${-q.thighBack})`); set('kneeB', `translate(0 46) rotate(${q.kneeBack})`); set('footB', `translate(0 42) rotate(${q.footBack})`);
      set('armF', `rotate(${-q.armFront})`); set('elbowF', `translate(0 27) rotate(${-q.elbowFront})`);
      set('armB', `rotate(${-q.armBack})`); set('elbowB', `translate(0 27) rotate(${-q.elbowBack})`);
    };
    const still = mode === 'idle' || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (still) { apply(IDLE); return; }
    let raf = 0;
    const loop = (t: number) => { apply(runPose((t / 620) * Math.PI * 2)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <svg className={`runner ${className}`} viewBox="0 0 140 220" aria-hidden="true">
      <g ref={refs.root} transform="translate(70 118)">
        <g ref={refs.torsoA}><Arm front={false} refs={refs} /></g>
        <Leg front={false} refs={refs} />
        <g ref={refs.torsoB}>
          <path d="M-16 2 C-19 -20 -18 -44 -12 -60 Q0 -68 13 -60 C18 -44 18 -20 15 2 Z" fill={HOODIE} stroke={LINE} strokeWidth="1.5" />
          <path d="M-12 -59 Q-23 -57 -21 -44 Q-17 -51 -12 -53" fill={HOODIE_BACK} stroke={LINE} strokeWidth="1.2" />
          <path d="M-16 -5 L15 -5" stroke={LINE} strokeWidth="1" opacity="0.6" />
          <path d="M-3 -19 Q5 -27 14 -19 L14 -7 L-2 -7 Z" fill="none" stroke={LINE} strokeWidth="1" opacity="0.75" />
          <path d="M8 -60 l1.5 13 M11.5 -60 l2.5 12" stroke={LINE} strokeWidth="1" strokeLinecap="round" />
          <g ref={refs.head} transform="translate(3 -64)">
            <path d="M-3 4 L-3 -4 L5 -4 L5 4 Z" fill={SKIN} />
            <path d="M-12 -4 Q-14 -26 2 -28 Q16 -28 17 -12 Q18 -2 11 3 Q1 7 -8 3 Z" fill={SKIN} stroke={LINE} strokeWidth="1.3" />
            <path d="M17 -12 l3 3 l-3 1.5" fill={SKIN} stroke={LINE} strokeWidth="1" />
            <circle cx="-2" cy="-12" r="3.2" fill={SKIN} stroke={LINE} strokeWidth="1" />
            <circle cx="9.5" cy="-15" r="1.7" fill={HAIR} />
            <path d="M6.5 -20 L12 -19" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="12" cy="-4" rx="2.2" ry="1.7" fill="#5a2a1e" />
            <path d="M-13 -9 Q-19 -29 0 -32 Q15 -34 19 -19 Q13 -26 7 -21 Q5 -28 -1 -22 Q-5 -26 -8 -18 Q-10 -14 -9 -9 Z" fill={HAIR} stroke={LINE} strokeWidth="1" />
          </g>
        </g>
        <Leg front refs={refs} />
        <g ref={refs.torsoC}><Arm front refs={refs} /></g>
      </g>
    </svg>
  );
}
