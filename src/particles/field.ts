const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

type Img = { data: Uint8ClampedArray; width: number; height: number };

/** Positions cibles (x, y, z) tirées sur les pixels dessinés d'une image, à l'échelle `worldWidth`. */
export function sampleTargets(img: Img, n: number, worldWidth: number): Float32Array {
  const on: number[] = [];
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (img.data[(y * img.width + x) * 4 + 3] > 128) on.push(x, y);
  const out = new Float32Array(n * 3);
  const count = on.length / 2;
  if (!count) return out;
  const k = worldWidth / img.width;
  for (let i = 0; i < n; i++) {
    const p = Math.floor(rnd(i) * count);
    out[i * 3] = (on[p * 2] + rnd(i + 7) * 0.9 - img.width / 2) * k;
    out[i * 3 + 1] = -(on[p * 2 + 1] + rnd(i + 13) * 0.9 - img.height / 2) * k;
    out[i * 3 + 2] = (rnd(i + 21) - 0.5) * 0.15;
  }
  return out;
}

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
