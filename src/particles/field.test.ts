import { blend, chaosAt, sampleTargets } from './field';

const img = (w: number, h: number, on: (x: number, y: number) => boolean) => {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data[(y * w + x) * 4 + 3] = on(x, y) ? 255 : 0;
  return { data, width: w, height: h };
};

it('ne place les cibles que sur les pixels dessinés', () => {
  const t = sampleTargets(img(10, 10, (x) => x >= 5), 200, 4);
  expect(t).toHaveLength(200 * 3);
  for (let i = 0; i < 200; i++) expect(t[i * 3]).toBeGreaterThanOrEqual(0);
});

it('est déterministe', () => {
  const a = sampleTargets(img(8, 8, (x, y) => x === y), 50, 4);
  const b = sampleTargets(img(8, 8, (x, y) => x === y), 50, 4);
  expect(Array.from(a)).toEqual(Array.from(b));
});

it('mélange le chaos et la cible selon t, borné', () => {
  const chaos = new Float32Array([0, 0, 0]);
  const target = new Float32Array([2, 4, 6]);
  const out = new Float32Array(3);
  blend(chaos, target, 0.5, out); expect(Array.from(out)).toEqual([1, 2, 3]);
  blend(chaos, target, 7, out); expect(Array.from(out)).toEqual([2, 4, 6]);
  blend(chaos, target, -1, out); expect(Array.from(out)).toEqual([0, 0, 0]);
});

it('fait tourbillonner le chaos sans valeur invalide', () => {
  const out = new Float32Array(300);
  chaosAt(100, 3.2, out);
  expect(out.every(Number.isFinite)).toBe(true);
});

it('fait partir les points à tour de rôle avec des délais', () => {
  const chaos = new Float32Array(6), target = new Float32Array([1, 1, 1, 1, 1, 1]), out = new Float32Array(6);
  blend(chaos, target, 0.3, out, new Float32Array([0, 0.5]));
  expect(out[0]).toBeGreaterThan(0);
  expect(out[3]).toBe(0);
  blend(chaos, target, 1, out, new Float32Array([0, 0.5]));
  expect(Array.from(out)).toEqual([1, 1, 1, 1, 1, 1]);
});
