import { pointSeeds, sampleTargets } from './field';

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

it('donne à chaque point des graines valides pour le shader', () => {
  const s = pointSeeds(500, 0.45);
  expect(s).toHaveLength(2000);
  for (let i = 0; i < 500; i++) {
    expect(s[i * 4]).toBeGreaterThanOrEqual(1.5); expect(s[i * 4]).toBeLessThanOrEqual(5);
    expect(s[i * 4 + 2]).toBeLessThan(Math.PI * 2);
    expect(s[i * 4 + 3]).toBeGreaterThanOrEqual(0); expect(s[i * 4 + 3]).toBeLessThan(0.45);
  }
  expect(Array.from(pointSeeds(20))).toEqual(Array.from(pointSeeds(20)));
});
