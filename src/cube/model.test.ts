import { applyMoves, poseAt, scramble, solveSequence, cubieStates } from './model';

it('mélange de façon déterministe', () => {
  expect(scramble(7, 20)).toEqual(scramble(7, 20));
  expect(scramble(7, 20)).toHaveLength(20);
});

it('ne répète jamais la même couche deux fois de suite', () => {
  const m = scramble(3, 40);
  for (let i = 1; i < m.length; i++) expect(m[i].axis === m[i - 1].axis && m[i].layer === m[i - 1].layer).toBe(false);
});

it('la résolution ramène chaque cubie à son état d’origine', () => {
  const mix = scramble(11, 20);
  const end = applyMoves(applyMoves(cubieStates([])[0], mix), solveSequence(mix));
  const start = cubieStates([])[0];
  end.forEach((m, i) => m.elements.forEach((v, j) => expect(v).toBeCloseTo(start[i].elements[j], 6)));
});

it('borne la pose entre 0 et n coups', () => {
  expect(poseAt(20, -1)).toEqual({ k: 0, frac: 0 });
  expect(poseAt(20, 2)).toEqual({ k: 20, frac: 0 });
  expect(poseAt(20, 0.5)).toEqual({ k: 10, frac: 0 });
});
