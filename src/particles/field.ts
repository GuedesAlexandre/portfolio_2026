/** Pseudo-aléatoire déterministe dans [0, 1[ : même indice, même valeur. */
export const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

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

/**
 * Graines par point pour le shader, 4 flottants par point : rayon du tourbillon, angle de départ,
 * phase (indice modulo 2π, pour rester précis en float32 sur GPU) et délai de départ vers la cible.
 */
export function pointSeeds(n: number, maxDelay = 0.45): Float32Array {
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    out[i * 4] = 1.5 + rnd(i) * 3.5;
    out[i * 4 + 1] = rnd(i + 1) * Math.PI * 2;
    out[i * 4 + 2] = i % (Math.PI * 2);
    out[i * 4 + 3] = rnd(i + 31) * maxDelay;
  }
  return out;
}
