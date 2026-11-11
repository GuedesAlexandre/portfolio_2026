import { sectionProgress } from './sectionMath';

it('vaut 0 quand la section entre par le bas', () => expect(sectionProgress({ top: 800, height: 1600 }, 800)).toBe(0));
it('vaut 1 quand la section sort par le haut', () => expect(sectionProgress({ top: -1600, height: 1600 }, 800)).toBe(1));
it('vaut 0.5 à mi-parcours', () => expect(sectionProgress({ top: -400, height: 1600 }, 800)).toBe(0.5));
it('est bornée', () => {
  expect(sectionProgress({ top: 5000, height: 1600 }, 800)).toBe(0);
  expect(sectionProgress({ top: -9000, height: 1600 }, 800)).toBe(1);
});
