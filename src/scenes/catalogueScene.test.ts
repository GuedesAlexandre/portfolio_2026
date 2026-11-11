import { drawCatalogue } from './catalogueScene';

function fakeCtx() {
  const calls: string[] = [];
  const ctx = new Proxy({} as Record<string, unknown>, {
    get(target, key: string) {
      if (key in target) return target[key];
      if (key === 'createRadialGradient') return () => ({ addColorStop() {} });
      return (...args: unknown[]) => {
        if (args.some((a) => typeof a === 'number' && !Number.isFinite(a))) throw new Error(`${key} : valeur invalide`);
        calls.push(key);
      };
    },
    set(target, key: string, v) { target[key] = v; return true; },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

it('dessine toute la boucle sans valeur invalide', () => {
  for (const t of [0, 2.5, 6, 8.5, 11, 25]) {
    const { ctx, calls } = fakeCtx();
    drawCatalogue(ctx, t, 1440, 900);
    expect(calls.filter((k) => k === 'fillRect').length).toBeGreaterThan(50);
  }
});

it('écrit « ce soir » sous le film choisi', () => {
  const { ctx, calls } = fakeCtx();
  drawCatalogue(ctx, 9, 1440, 900);
  expect(calls).toContain('fillText');
});
