import { CHOSEN, COLS, LOOP, ROWS, litAt, rnd, spotlightAt } from './catalogue';

export type CataloguePalette = { bg: string; ink: string; tones: string[]; accents: string[]; credits: string };
/** Palette du site (papier clair). La bande-annonce passe la sienne, sombre. */
export const CATALOGUE_LIGHT: CataloguePalette = {
  bg: '#f3efe7', ink: '#161513',
  tones: ['#e2d9cb', '#d8c4ad', '#c3cfd4', '#dcc7b4', '#c9d0bb', '#d9c0c6', '#d6d2ca', '#e0cba6'],
  accents: ['#4a453e', '#7a6f62', '#a0714a', '#4f6a7c', '#8a5a48'],
  credits: 'rgba(22,21,19,0.45)',
};

/** Une affiche abstraite, toujours la même pour un même indice. */
function poster(c: CanvasRenderingContext2D, pal: CataloguePalette, i: number, x: number, y: number, w: number, h: number) {
  c.fillStyle = pal.tones[Math.floor(rnd(i) * pal.tones.length)];
  c.fillRect(x, y, w, h);
  const a = pal.accents[Math.floor(rnd(i + 1) * pal.accents.length)];
  c.fillStyle = a;
  const kind = i === CHOSEN ? 0 : Math.floor(rnd(i + 2) * 3);
  if (i === CHOSEN) c.fillStyle = '#f5c518';
  if (kind === 0) { c.beginPath(); c.arc(x + w * (0.3 + rnd(i + 3) * 0.4), y + h * 0.35, w * 0.18, 0, Math.PI * 2); c.fill(); }
  else if (kind === 1) { c.globalAlpha *= 0.8; c.fillRect(x, y + h * (0.45 + rnd(i + 3) * 0.15), w, h * 0.06); }
  else { c.fillRect(x + w * (0.4 + rnd(i + 3) * 0.2), y + h * 0.25, w * 0.08, h * 0.4); }
  c.fillStyle = pal.credits;
  c.fillRect(x + w * 0.12, y + h * 0.8, w * (0.4 + rnd(i + 4) * 0.4), Math.max(1, h * 0.025));
  c.fillRect(x + w * 0.12, y + h * 0.86, w * 0.3, Math.max(1, h * 0.015));
}

export function drawCatalogue(c: CanvasRenderingContext2D, t: number, w: number, h: number, pal: CataloguePalette = CATALOGUE_LIGHT) {
  const local = ((t % LOOP) + LOOP) % LOOP;
  const spot = spotlightAt(t);
  c.globalAlpha = 1;
  c.fillStyle = pal.bg; c.fillRect(0, 0, w, h);

  const pw = Math.max(48, h * 0.13), ph = pw * 1.5, gap = pw * 0.18, pitch = pw + gap;
  const top = (h - (ROWS * ph + (ROWS - 1) * gap)) / 2;
  // Le défilement ralentit puis s'arrête quand le film du soir est choisi.
  const travel = (local < 7.4 ? local : 7.4 + (local - 7.4) * (1 - spot)) * pw * 0.35;
  let chosenAt = { x: 0, y: 0 };

  for (let row = 0; row < ROWS; row++) {
    const dir = row % 2 ? 1 : -1;
    const off = ((dir * travel) % (COLS * pitch) + COLS * pitch) % (COLS * pitch);
    const y = top + row * (ph + gap);
    for (let k = -1; k <= Math.ceil(w / pitch) + 1; k++) {
      const x = k * pitch - (off % pitch);
      const col = ((k + Math.floor(off / pitch)) % COLS + COLS) % COLS;
      const i = row * COLS + col;
      if (i === CHOSEN && Math.abs(x + pw / 2 - w * 0.78) < COLS * pitch / 2) chosenAt = { x, y };
      if (i === CHOSEN) continue;
      c.globalAlpha = 0.06 + 0.4 * litAt(i, t);
      poster(c, pal, i, x, y, pw, ph);
    }
  }

  // Le film du soir : il s'avance, éclairé par le halo jaune de MovieRecom.
  const s = 1 + spot * 0.9;
  const tx = w * 0.78 - (pw * s) / 2, ty = h * 0.5 - (ph * s) / 2;
  const x = chosenAt.x + (tx - chosenAt.x) * spot, y = chosenAt.y + (ty - chosenAt.y) * spot;
  if (spot > 0) {
    const g = c.createRadialGradient(x + (pw * s) / 2, y + ph * s, 0, x + (pw * s) / 2, y + ph * s, pw * s * 2.2);
    g.addColorStop(0, `rgba(245,197,24,${0.35 * spot})`); g.addColorStop(1, 'rgba(245,197,24,0)');
    c.globalAlpha = 1; c.fillStyle = g; c.fillRect(x - pw * s * 2, y - ph * s, pw * s * 5, ph * s * 3);
  }
  c.globalAlpha = 0.62 + 0.38 * spot;
  poster(c, pal, CHOSEN, x, y, pw * s, ph * s);
  if (spot > 0) {
    c.globalAlpha = spot; c.strokeStyle = '#f5c518'; c.lineWidth = 2; c.strokeRect(x, y, pw * s, ph * s);
    c.fillStyle = pal.ink; c.textAlign = 'center';
    c.font = `italic ${Math.round(pw * 0.32)}px "Instrument Serif", serif`;
    c.fillText('ce soir', x + (pw * s) / 2, y + ph * s + pw * 0.45);
  }
  c.globalAlpha = 1;
}
