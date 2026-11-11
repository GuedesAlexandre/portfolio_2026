/** « Le catalogue qui s'éteint » : de toutes les affiches, il n'en reste qu'une, le film du soir. */
export const LOOP = 12;
export const ROWS = 5;
export const COLS = 14;
export const POSTERS = ROWS * COLS;
/** Le film du soir : 3e rangée, vers la droite (le texte du projet occupe le centre). */
export const CHOSEN = 2 * COLS + 11;

export const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Instant où l'affiche i s'éteint (entre 2 s et 7,6 s). */
const offAt = (i: number) => 2 + rnd(i + 5) * 5.6;

/** Luminosité de l'affiche i à l'instant t : 1 allumée, 0 éteinte. */
export function litAt(i: number, t: number): number {
  const local = ((t % LOOP) + LOOP) % LOOP;
  if (i === CHOSEN) return 1;
  const relight = clamp01((local - 10.8) / 0.8);
  const off = clamp01((local - offAt(i)) / 0.35);
  return Math.max(1 - off, relight);
}

/** Mise en avant du film du soir : 0 dans le catalogue, 1 seul à l'écran. */
export const spotlightAt = (t: number) => {
  const local = ((t % LOOP) + LOOP) % LOOP;
  return clamp01((local - 7.4) / 1) * (1 - clamp01((local - 10.6) / 0.8));
};
