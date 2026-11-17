/** Unique source de vérité du montage (30 fps). */
export const FPS = 30;
export const SHOTS = {
  bumper: { from: 0, duration: 150 },
  hero: { from: 150, duration: 120 },
  manifesto: { from: 270, duration: 140 },
  kelp: { from: 410, duration: 190 },
  movie: { from: 600, duration: 170 },
  azathro: { from: 770, duration: 180 },
  genetic: { from: 950, duration: 180 },
  outro: { from: 1130, duration: 170 },
} as const;
export const TOTAL = SHOTS.outro.from + SHOTS.outro.duration;
export const C = { bg: '#0b0b0c', ink: '#ede8df', dim: '#5c5a57', accent: '#e8322f', yellow: '#f5c518' };
export const F = { serif: '"Instrument Serif", serif', sans: '"Hanken Grotesk", sans-serif', hand: '"Homemade Apple", cursive' };
