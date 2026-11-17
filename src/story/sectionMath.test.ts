import { litWords, sectionProgress, stickyProgress } from './sectionMath';

it('vaut 0 quand la section entre par le bas', () => expect(sectionProgress({ top: 800, height: 1600 }, 800)).toBe(0));
it('vaut 1 quand la section sort par le haut', () => expect(sectionProgress({ top: -1600, height: 1600 }, 800)).toBe(1));
it('vaut 0.5 à mi-parcours', () => expect(sectionProgress({ top: -400, height: 1600 }, 800)).toBe(0.5));
it('est bornée', () => {
  expect(sectionProgress({ top: 5000, height: 1600 }, 800)).toBe(0);
  expect(sectionProgress({ top: -9000, height: 1600 }, 800)).toBe(1);
});

describe('stickyProgress', () => {
  it('va de 0 (collée en haut) à 1 (décollée)', () => {
    expect(stickyProgress({ top: 0, height: 2400 }, 800)).toBe(0);
    expect(stickyProgress({ top: -800, height: 2400 }, 800)).toBe(0.5);
    expect(stickyProgress({ top: -1600, height: 2400 }, 800)).toBe(1);
  });
  it('reste à 0 tant que la section n’est pas arrivée en haut', () => expect(stickyProgress({ top: 300, height: 2400 }, 800)).toBe(0));
  it('retombe sur sectionProgress sans phase collée', () => {
    expect(stickyProgress({ top: -400, height: 600 }, 800)).toBe(sectionProgress({ top: -400, height: 600 }, 800));
  });
});

describe('litWords', () => {
  it('n’allume rien avant le début et tout à la fin', () => {
    expect(litWords(0, 24)).toBe(0);
    expect(litWords(1, 24)).toBe(24);
  });
  it('allume progressivement, sans jamais reculer', () => {
    let prev = 0;
    for (let p = 0; p <= 1; p += 0.01) { const n = litWords(p, 24); expect(n).toBeGreaterThanOrEqual(prev); prev = n; }
  });
});
