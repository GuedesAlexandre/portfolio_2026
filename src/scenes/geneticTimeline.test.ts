import { GENERATIONS, generationAt, mutationRateAt, convergenceAt, LOOP } from './geneticTimeline';

it('parcourt les 1 000 générations de la vraie config', () => {
  expect(GENERATIONS).toBe(1000);
  expect(generationAt(0)).toBe(0);
  expect(generationAt(LOOP * 0.99)).toBe(1000);
});

it('fait décroître la mutation de 0,30 à 0,05 comme ga.c', () => {
  expect(mutationRateAt(0)).toBeCloseTo(0.3, 5);
  expect(mutationRateAt(500)).toBeCloseTo(0.175, 5);
  expect(mutationRateAt(1000)).toBeCloseTo(0.05, 5);
});

it('converge vers la meilleure solution au fil des générations', () => {
  expect(convergenceAt(0)).toBe(0);
  expect(convergenceAt(1000)).toBe(1);
  expect(convergenceAt(300)).toBeLessThan(convergenceAt(600));
});

it('repart de la génération 0 à chaque boucle', () => {
  expect(generationAt(LOOP + 0.01)).toBe(0);
});
