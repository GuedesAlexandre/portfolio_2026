import { knot, line, toPath, untangle } from './thread';

it('fait une pelote qui reste autour de son centre', () => {
  const k = knot(200, 500, 140, 100);
  expect(k).toHaveLength(200);
  for (const [x, y] of k) {
    expect(Math.abs(x - 500)).toBeLessThan(100 * 1.45 + 1);
    expect(Math.abs(y - 140)).toBeLessThan(100 * 0.85 + 1);
  }
});

it('trace une ligne d’un bord à l’autre', () => {
  const l = line(50, 60, 1130, 200);
  expect(l[0][0]).toBe(60);
  expect(l[49][0]).toBeCloseTo(1130);
});

it('dénoue le fil de gauche à droite, jusqu’à la ligne', () => {
  const from = knot(100, 500, 140, 100), to = line(100, 60, 1130, 200);
  const early = untangle(from, to, 0.25);
  expect(early[0]).not.toEqual(from[0]);  // on tire déjà sur le bout gauche…
  expect(early[99]).toEqual(from[99]);    // …l'autre bout n'a pas encore bougé
  expect(untangle(from, to, 0.55)[0]).toEqual(to[0]);
  expect(untangle(from, to, 0)).toEqual(from);
  expect(untangle(from, to, 1)).toEqual(to);
});

it('écrit un chemin SVG valide, éventuellement partiel', () => {
  const l = line(10, 0, 90, 0);
  expect(toPath(l)).toMatch(/^M0\.0 0\.0Q/);
  expect(toPath(l, 4)).toMatch(/^M40\.0 /);
  expect(toPath(l, 9)).toBe('');
});
