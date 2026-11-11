import { decodeCommunes, drawGenetic, type GeneticData } from './geneticScene';

function fakeCtx() {
  const calls: string[] = [];
  const ctx = new Proxy({} as Record<string, unknown>, {
    get(target, key: string) {
      if (key in target) return target[key];
      return (...args: unknown[]) => {
        if (args.some((a) => typeof a === 'number' && !Number.isFinite(a))) throw new Error(`${key} : valeur invalide`);
        calls.push(key);
      };
    },
    set(target, key: string, v) { target[key] = v; return true; },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const data: GeneticData = {
  w: 0.9, h: 1, km10: 0.008,
  outline: [[0, 0, 0.9, 0, 0.9, 1, 0, 1]],
  communes: new Float32Array(Array.from({ length: 400 }, (_, i) => (i % 97) / 97)),
  hospitals: [[0.2, 0.3, 0], [0.5, 0.5, 1], [0.7, 0.2, 0]],
};

it('décode les communes stockées en entiers 16 bits', () => {
  const b64 = btoa(String.fromCharCode(0, 0, 255, 255));
  expect(Array.from(decodeCommunes(b64))).toEqual([0, 1]);
});

it('dessine toute la boucle sans valeur invalide', () => {
  for (const t of [0, 1, 5.5, 11, 13.8, 20]) {
    const { ctx, calls } = fakeCtx();
    drawGenetic(ctx, t, 1440, 900, data);
    expect(calls).toContain('fillText');
  }
});

it('a beaucoup plus d’hôpitaux au hasard au début qu’à la fin', () => {
  const start = fakeCtx(); drawGenetic(start.ctx, 0.5, 1440, 900, data);
  const end = fakeCtx(); drawGenetic(end.ctx, 12, 1440, 900, data);
  const arcs = (c: string[]) => c.filter((k) => k === 'arc').length;
  expect(arcs(start.calls)).toBeGreaterThan(arcs(end.calls));
});
