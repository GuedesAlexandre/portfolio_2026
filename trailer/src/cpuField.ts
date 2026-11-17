import { rnd } from '../../src/particles/field';

/**
 * Le site anime les particules dans un shader (pointSeeds). Remotion rend image par image sur CPU :
 * mêmes graines, même tourbillon, calculés ici en JS.
 */

/** Nuage en désordre qui tourbillonne lentement. */
export function chaosAt(n: number, t: number, out: Float32Array) {
  for (let i = 0; i < n; i++) {
    const r = 1.5 + rnd(i) * 3.5;
    const a = rnd(i + 1) * Math.PI * 2 + t * (0.12 + 0.45 / r);
    out[i * 3] = Math.cos(a) * r * 1.5;
    out[i * 3 + 1] = Math.sin(a * 1.3 + i) * r * 0.45 + Math.sin(t * 0.5 + i) * 0.2;
    out[i * 3 + 2] = Math.sin(a) * r * 0.7 - 1;
  }
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, Number.isFinite(x) ? x : 0));

/** out = chaos + (cible − chaos) × t, t borné à [0, 1]. Avec `delays`, chaque point part à son tour. */
export function blend(chaos: Float32Array, target: Float32Array, t: number, out: Float32Array, delays?: Float32Array) {
  const T = clamp01(t);
  for (let p = 0; p < out.length / 3; p++) {
    const d = delays ? delays[p] : 0;
    const raw = clamp01((T - d) / (1 - d));
    const k = raw * raw * (3 - 2 * raw);
    for (let c = 0; c < 3; c++) { const i = p * 3 + c; out[i] = chaos[i] + (target[i] - chaos[i]) * (delays ? k : T); }
  }
}

export const staggerDelays = (n: number, max = 0.5) => Float32Array.from({ length: n }, (_, i) => rnd(i + 31) * max);
