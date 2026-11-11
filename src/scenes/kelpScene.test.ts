import { drawKelp } from './kelpScene';

/** Contexte 2D factice : enregistre les appels et refuse toute coordonnée invalide. */
function fakeCtx() {
  const calls: string[] = [];
  const ctx = new Proxy({} as Record<string, unknown>, {
    get(target, key: string) {
      if (key in target) return target[key];
      if (key === 'measureText') return () => ({ width: 100 });
      return (...args: unknown[]) => {
        if (args.some((a) => typeof a === 'number' && !Number.isFinite(a))) throw new Error(`${key} reçoit une valeur invalide`);
        calls.push(key);
      };
    },
    set(target, key: string, v) { target[key] = v; return true; },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

it('dessine toute la session sans valeur invalide', () => {
  for (const t of [0, 0.5, 3.1, 4.5, 8.5, 11, 15.5, 33]) {
    const { ctx, calls } = fakeCtx();
    drawKelp(ctx, t, 1440, 900);
    expect(calls.length).toBeGreaterThan(5);
  }
});

it('trace des alvéoles une fois les conteneurs créés', () => {
  const early = fakeCtx(); drawKelp(early.ctx, 0.1, 1440, 900);
  const later = fakeCtx(); drawKelp(later.ctx, 9, 1440, 900);
  const count = (c: string[]) => c.filter((k) => k === 'closePath').length;
  expect(count(later.calls)).toBeGreaterThan(count(early.calls));
});
