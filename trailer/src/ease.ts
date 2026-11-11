import { Easing, interpolate } from 'remotion';
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Progression 0→1 entre `at` et `at + dur`, avec une courbe. */
export const ramp = (f: number, at: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
export const DEMOTE = Easing.bezier(0.6, 0, 0.18, 1);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
