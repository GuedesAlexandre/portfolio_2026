import { CHOSEN, LOOP, litAt, POSTERS } from './catalogue';

it('allume tout le catalogue au début', () => {
  for (let i = 0; i < POSTERS; i++) expect(litAt(i, 0.5)).toBe(1);
});

it('ne laisse qu’une seule affiche allumée : le film du soir', () => {
  const lit = Array.from({ length: POSTERS }, (_, i) => litAt(i, 8.5)).filter((v) => v > 0.01);
  expect(lit).toHaveLength(1);
  expect(litAt(CHOSEN, 8.5)).toBe(1);
});

it('éteint les affiches progressivement', () => {
  const count = (t: number) => Array.from({ length: POSTERS }, (_, i) => litAt(i, t)).filter((v) => v > 0.5).length;
  expect(count(3)).toBeLessThan(count(1.5));
  expect(count(6)).toBeLessThan(count(3));
});

it('rallume tout à chaque boucle', () => {
  expect(litAt(0, LOOP + 0.5)).toBe(litAt(0, 0.5));
});
