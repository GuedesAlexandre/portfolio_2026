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

/** Azathro (vrais assets du jeu) et Kelp (session de l'appli rejouée) ont leurs propres scènes. */
export type PixelId = Exclude<ProjectId, 'azathro' | 'kelp'>;
export const SCENES: Record<PixelId, Draw> = { movierecom: cinema, sba: watch };
