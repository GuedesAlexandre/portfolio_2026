import { SCENES, SCENE_W, SCENE_H } from './scenes';
import { PROJECTS } from '../story/projects';

function fakeCtx() {
  const calls: unknown[] = [];
  return { calls, ctx: { fillStyle: '', globalAlpha: 1, fillRect: (...a: number[]) => { if (a.some((v) => !Number.isFinite(v))) throw new Error('NaN'); calls.push(a); } } as unknown as CanvasRenderingContext2D };
}

it('a une scène pour chaque projet sauf Azathro (vrais assets du jeu)', () => {
  expect(Object.keys(SCENES).sort()).toEqual(PROJECTS.map((p) => p.id).filter((id) => id !== 'azathro').sort());
});

it('dessine chaque scène à plusieurs instants sans valeur invalide', () => {
  for (const draw of Object.values(SCENES)) {
    for (const t of [0, 0.5, 3.7, 12]) {
      const { ctx, calls } = fakeCtx();
      draw(ctx, t);
      expect(calls.length).toBeGreaterThan(50);
    }
  }
});

it('travaille en basse résolution 16:9', () => {
  expect(SCENE_W / SCENE_H).toBeCloseTo(16 / 9, 2);
});
