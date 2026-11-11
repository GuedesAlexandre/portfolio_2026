import type { ProjectId } from '../story/projects';

/** Résolution logique des scènes (agrandies d'un facteur entier, pixels nets). */
export const SCENE_W = 256;
export const SCENE_H = 144;

export type Draw = (ctx: CanvasRenderingContext2D, t: number) => void;

const C = {
  bg: '#0b0b0c', night: '#111213', deep: '#161718', shade: '#211f1e', stone: '#2c2a28', mid: '#3d3b38',
  dim: '#5c5a57', grey: '#8c867c', light: '#bdb6aa', cream: '#ede8df', orange: '#ff6a1f', ember: '#8a3a14',
};

const rect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, col: string) => {
  c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
};
const px = (c: CanvasRenderingContext2D, x: number, y: number, col: string) => rect(c, x, y, 1, 1, col);
/** Pseudo-aléatoire stable : même scène à chaque visite. */
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/** Fond en bandes tramées (dégradé pixel). */
function bands(c: CanvasRenderingContext2D, top: string, bottom: string, split = 0.5) {
  rect(c, 0, 0, SCENE_W, SCENE_H, bottom);
  const sy = Math.round(SCENE_H * split);
  rect(c, 0, 0, SCENE_W, sy, top);
  for (let y = sy; y < sy + 10; y++) for (let x = (y % 2); x < SCENE_W; x += 2 + (y - sy) / 3) px(c, x, y, top);
}

/* ---------- Kelp : forêt d'algues, alvéoles reliées par des câbles ---------- */
const HEX = [[150, 46], [186, 30], [214, 60], [178, 86], [138, 82]];
const CABLES = [[0, 1], [0, 3], [0, 4], [1, 2], [3, 2]];
function hex(c: CanvasRenderingContext2D, cx: number, cy: number, col: string) {
  const r = 9;
  for (let a = 0; a < 6; a++) {
    const a1 = (Math.PI / 3) * a, a2 = (Math.PI / 3) * (a + 1);
    for (let s = 0; s <= 1; s += 0.08) px(c, cx + Math.cos(a1 + (a2 - a1) * s) * r, cy + Math.sin(a1 + (a2 - a1) * s) * r, col);
  }
}
const kelp: Draw = (c, t) => {
  bands(c, C.deep, C.bg, 0.45);
  for (let i = 0; i < 40; i++) px(c, rnd(i) * SCENE_W, (rnd(i + 9) * SCENE_H + t * (6 + rnd(i) * 8)) % SCENE_H, C.stone);
  for (let k = 0; k < 9; k++) {
    const x0 = 10 + k * 30 + rnd(k) * 14, h = 70 + rnd(k + 3) * 60, col = k % 2 ? C.stone : C.mid;
    for (let y = 0; y < h; y++) {
      const sway = Math.sin(y * 0.07 + t * 1.3 + k) * (y / h) * 6;
      const x = x0 + sway, yy = SCENE_H - y;
      rect(c, x, yy, 2, 1, col);
      if (y % 9 === 0 && y > 6) rect(c, x + (y % 18 ? 2 : -4), yy, 4, 1, col);
    }
  }
  CABLES.forEach(([a, b], i) => {
    const [x1, y1] = HEX[a], [x2, y2] = HEX[b];
    for (let s = 0; s <= 1; s += 0.025) px(c, x1 + (x2 - x1) * s, y1 + (y2 - y1) * s, C.ember);
    const p = (t * 0.6 + i * 0.2) % 1;
    rect(c, x1 + (x2 - x1) * p - 1, y1 + (y2 - y1) * p - 1, 2, 2, C.orange);
  });
  HEX.forEach(([x, y], i) => hex(c, x, y, Math.sin(t * 2 + i) > 0.6 ? C.cream : C.orange));
  for (let i = 0; i < 18; i++) {
    const y = SCENE_H - ((t * (10 + rnd(i) * 10) + rnd(i + 2) * SCENE_H) % SCENE_H);
    px(c, rnd(i + 5) * SCENE_W + Math.sin(t * 3 + i) * 1.5, y, C.light);
  }
};

/* ---------- MovieRecom : cinéma la nuit, écran qui scintille ---------- */
const cinema: Draw = (c, t) => {
  rect(c, 0, 0, SCENE_W, SCENE_H, C.bg);
  const flicker = 0.85 + Math.sin(t * 23) * 0.05 + Math.sin(t * 7.3) * 0.06;
  // faisceau du projecteur
  c.globalAlpha = 0.18 * flicker;
  for (let y = 4; y < 60; y++) { const w = 4 + (y - 4) * 1.6; rect(c, 128 - w / 2 + (y - 4) * 0.0, y, w, 1, C.light); }
  c.globalAlpha = 1;
  for (let i = 0; i < 26; i++) {
    const y = 8 + rnd(i) * 50, spread = 2 + (y - 4) * 1.6;
    px(c, 128 + (rnd(i + 4) - 0.5) * spread + Math.sin(t + i) * 2, y + Math.sin(t * 0.7 + i) * 2, C.grey);
  }
  // écran
  rect(c, 66, 58, 124, 46, C.stone);
  rect(c, 68, 60, 120, 42, flicker > 0.86 ? C.dim : C.mid);
  // le film : un horizon qui défile
  const off = (t * 20) % 40;
  for (let x = 0; x < 120; x++) { const h = 6 + Math.round(Math.sin((x + off) * 0.15) * 3 + Math.sin((x + off) * 0.05) * 4); rect(c, 68 + x, 102 - h, 1, h, C.shade); }
  rect(c, 150 + Math.sin(t * 0.5) * 20, 70, 8, 8, C.orange);
  // rangées de sièges et spectateurs
  for (let row = 0; row < 3; row++) {
    const y = 112 + row * 11, col = row === 2 ? C.night : C.shade;
    for (let s = -1; s < 15; s++) {
      const x = s * 18 + (row % 2) * 9;
      rect(c, x, y, 15, 12, col);
      if (rnd(s * 3 + row) > 0.55) { rect(c, x + 4, y - 7, 7, 7, C.night); rect(c, x + 3, y - 1, 9, 2, C.night); }
    }
  }
};

/* ---------- Azathro : abysses, cartes à la dérive, l'œil ---------- */
const abyss: Draw = (c, t) => {
  bands(c, C.night, C.bg, 0.3);
  for (let i = 0; i < 70; i++) {
    const tw = Math.sin(t * 2 + i * 1.7) > 0.3;
    px(c, (rnd(i) * SCENE_W - t * (1 + rnd(i) * 2) + SCENE_W * 4) % SCENE_W, rnd(i + 1) * SCENE_H, tw ? C.dim : C.stone);
  }
  // l'œil
  const cx = 206, cy = 30, blink = (t % 6) > 5.7 ? Math.sin(((t % 6) - 5.7) / 0.3 * Math.PI) : 0;
  const open = 1 - blink;
  for (let y = -16; y <= 16; y++) {
    const half = Math.round(Math.sqrt(Math.max(0, 1 - (y / 16) ** 2)) * 40);
    if (Math.abs(y) <= 16 * open) rect(c, cx - half, cy + y, half * 2, 1, C.shade);
  }
  if (open > 0.3) {
    const ix = cx + Math.sin(t * 0.6) * 8;
    for (let y = -9; y <= 9; y++) { const h = Math.round(Math.sqrt(81 - y * y)); if (Math.abs(y) <= 16 * open) rect(c, ix - h, cy + y, h * 2, 1, C.ember); }
    for (let y = -6; y <= 6; y++) { const h = Math.round(Math.sqrt(36 - y * y)); if (Math.abs(y) <= 16 * open) rect(c, ix - h, cy + y, h * 2, 1, C.orange); }
    rect(c, ix - 1, cy - 7 * open, 2, 14 * open, C.bg);
  }
  // cartes qui dérivent
  for (let k = 0; k < 6; k++) {
    const x = (k * 47 + t * (4 + k) + 20) % (SCENE_W + 20) - 10;
    const y = 100 + Math.sin(t * 0.8 + k * 1.3) * 14 - (k % 2) * 70;
    rect(c, x, y, 9, 13, C.light);
    rect(c, x + 1, y + 1, 7, 11, C.cream);
    rect(c, x + 3, y + 4, 3, 4, k % 3 ? C.bg : C.orange);
  }
};

/* ---------- Spring Boot Admin : une ville de serveurs veillée par une tour radar ---------- */
const watch: Draw = (c, t) => {
  bands(c, C.night, C.deep, 0.55);
  for (let i = 0; i < 40; i++) px(c, rnd(i) * SCENE_W, rnd(i + 7) * 60, Math.sin(t * 1.5 + i) > 0.7 ? C.light : C.stone);
  // tour et balayage radar
  const tx = 46, ty = 40;
  rect(c, tx - 2, ty, 4, SCENE_H - ty, C.mid);
  rect(c, tx - 7, ty - 4, 14, 5, C.dim);
  const a = t * 1.4;
  for (let r = 4; r < 120; r++) {
    for (let k = 0; k < 6; k++) {
      const aa = a - k * 0.03;
      const x = tx + Math.cos(aa) * r, y = ty - 2 + Math.sin(aa) * r * 0.5;
      if (y < ty + 60 && x > 0 && x < SCENE_W) { c.globalAlpha = 0.5 - k * 0.08; px(c, x, y, C.orange); }
    }
  }
  c.globalAlpha = 1;
  // baies de serveurs
  for (let b = 0; b < 11; b++) {
    const x = 70 + b * 17, h = 34 + rnd(b) * 40, y = SCENE_H - h;
    rect(c, x, y, 14, h, b % 2 ? C.shade : C.stone);
    for (let r = y + 4; r < SCENE_H - 3; r += 5) {
      rect(c, x + 2, r, 10, 1, C.night);
      const on = Math.sin(t * (2 + rnd(b + r)) + r) > 0.2;
      px(c, x + 11, r, on ? (rnd(b * 7 + r) > 0.93 ? C.orange : C.light) : C.mid);
    }
  }
  rect(c, 0, SCENE_H - 3, SCENE_W, 3, C.night);
};

export const SCENES: Record<ProjectId, Draw> = { kelp, movierecom: cinema, azathro: abyss, sba: watch };
