import { PROJECTS } from './projects';

it('contient les 4 projets', () => {
  expect(Object.keys(PROJECTS).sort()).toEqual(['azathro', 'kelp', 'movierecom', 'sba']);
});
it('ouvre le script de Kelp sur le Void', () => {
  expect(PROJECTS.kelp.script[0]).toEqual({ kind: 'heading', text: 'INT. LE VOID — NUIT' });
});
it('ne promet aucune capture pour Spring Boot Admin', () => {
  expect(PROJECTS.sba.script.some((b) => b.kind === 'placeholder')).toBe(false);
});
it('enchaîne chaque projet sur le chapitre suivant', () => {
  expect(PROJECTS.sba.next).toBe('kelp');
  expect(PROJECTS.kelp.next).toBe('movierecom');
  expect(PROJECTS.movierecom.next).toBe('azathro');
  expect(PROJECTS.azathro.next).toBe('generique');
});
