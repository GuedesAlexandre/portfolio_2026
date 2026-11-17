import { GENERATIONS, LOOP, convergenceAt, generationAt, mutationRateAt } from './geneticTimeline';

/** Données réelles du projet (scripts/genetique-data.mjs) : contour, communes, meilleure solution. */
export type GeneticData = {
  w: number; h: number; km10: number;
  outline: number[][];
  communes: Float32Array; // x, y normalisés
  hospitals: [number, number, number][]; // x, y, est_chru
};

export type GeneticPalette = { ink: string; accent: string; dim: string; bg: string; outline: string; land: string; commune: string };
/** Palette du site (papier clair). La bande-annonce passe la sienne, sombre. */
export const GENETIC_LIGHT: GeneticPalette = {
  ink: '#161513', accent: '#cf2a25', dim: '#716b62', bg: '#f3efe7',
  outline: 'rgba(22,21,19,0.32)', land: 'rgba(22,21,19,0.025)', commune: 'rgba(22,21,19,0.2)',
};

/** Cadrage de la carte : part de la hauteur et de la largeur qu'elle peut occuper, et centre horizontal. */
export type GeneticLayout = { fitH: number; fitW: number; centerX: (w: number) => number };
/** Sur le site : centrée dans sa planche, un peu à droite pour laisser la place au tableau de bord. */
export const GENETIC_BOARD: GeneticLayout = { fitH: 0.8, fitW: 0.86, centerX: (w) => w * 0.54 };

export type GeneticOptions = { palette?: GeneticPalette; layout?: GeneticLayout };
const RANDOM_START = 2000; // nb_hop de la config : taille max d'un individu au départ
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export function decodeCommunes(b64: string): Float32Array {
  const bin = atob(b64);
  const out = new Float32Array(bin.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = (bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8)) / 65535;
  return out;
}

let cache: { key: string; canvas: HTMLCanvasElement } | null = null;

export function drawGenetic(c: CanvasRenderingContext2D, t: number, w: number, h: number, d: GeneticData, opts: GeneticOptions = {}) {
  const pal = opts.palette ?? GENETIC_LIGHT, layout = opts.layout ?? GENETIC_BOARD;
  const { ink: INK, accent: ACCENT, dim: DIM } = pal;
  const local = ((t % LOOP) + LOOP) % LOOP;
  const g = generationAt(t);
  const conv = convergenceAt(g);
  const fade = Math.min(1, local / 0.4) * (1 - Math.max(0, (local - (LOOP - 0.7)) / 0.7));

  const scale = Math.min(h * layout.fitH / d.h, w * layout.fitW / d.w);
  const ox = layout.centerX(w) - (d.w * scale) / 2;
  const oy = (h - d.h * scale) / 2;
  const X = (x: number) => ox + x * scale, Y = (y: number) => oy + y * scale;

  c.globalAlpha = 1;
  c.fillStyle = pal.bg; c.fillRect(0, 0, w, h);

  // Contour + 34 437 communes, dessinés une fois par taille, palette et cadrage.
  const key = `${w}x${h}|${pal.outline}|${pal.land}|${pal.commune}|${scale}|${ox}`;
  if (typeof document !== 'undefined' && cache?.key !== key) {
    const off = document.createElement('canvas'); off.width = w; off.height = h;
    const oc = off.getContext('2d');
    if (oc) {
      oc.strokeStyle = pal.outline; oc.lineWidth = 1; oc.fillStyle = pal.land;
      for (const ring of d.outline) {
        oc.beginPath();
        for (let i = 0; i < ring.length; i += 2) oc.lineTo(X(ring[i]), Y(ring[i + 1]));
        oc.closePath(); oc.fill(); oc.stroke();
      }
      oc.fillStyle = pal.commune;
      for (let i = 0; i < d.communes.length; i += 2) oc.fillRect(X(d.communes[i]), Y(d.communes[i + 1]), 1, 1);
      cache = { key, canvas: off };
    }
  }
  if (cache?.key === key) c.drawImage(cache.canvas, 0, 0);

  c.globalAlpha = fade;
  const r10 = Math.max(1.5, d.km10 * scale);
  const nCommunes = d.communes.length / 2;
  const draw = (x: number, y: number, a: number) => {
    c.globalAlpha = fade * a * 0.12; c.fillStyle = ACCENT;
    c.beginPath(); c.arc(X(x), Y(y), r10, 0, Math.PI * 2); c.fill();
    c.globalAlpha = fade * a; c.fillRect(X(x) - 1, Y(y) - 1, 2, 2);
  };

  // Génération 0 : hôpitaux au hasard ; ils disparaissent à mesure que la meilleure solution émerge.
  const nRandom = Math.round((1 - conv) * RANDOM_START);
  for (let i = 0; i < nRandom; i++) {
    const k = Math.floor(rnd(i) * nCommunes);
    draw(d.communes[k * 2], d.communes[k * 2 + 1], 0.9);
  }
  const nBest = Math.round(conv * d.hospitals.length);
  for (let i = 0; i < nBest; i++) { const [x, y] = d.hospitals[(i * 7919) % d.hospitals.length]; draw(x, y, 1); }

  // Mutations : quelques gènes qui clignotent, d'autant plus que le taux est élevé.
  const rate = mutationRateAt(g);
  const flick = Math.floor(local * 12);
  for (let i = 0; i < Math.round(rate * 60); i++) {
    const k = Math.floor(rnd(flick * 131 + i) * nCommunes);
    c.globalAlpha = fade; c.fillStyle = INK; c.fillRect(X(d.communes[k * 2]) - 1.5, Y(d.communes[k * 2 + 1]) - 1.5, 3, 3);
  }

  // Les 2 CHRU de la meilleure solution.
  if (g >= GENERATIONS) for (const [x, y, chru] of d.hospitals) if (chru) {
    c.globalAlpha = fade; c.strokeStyle = INK; c.lineWidth = 1.5;
    c.beginPath(); c.arc(X(x), Y(y), r10 + 5, 0, Math.PI * 2); c.stroke();
  }

  // Tableau de bord : vraie config de l'algo.
  const fs = Math.max(11, Math.min(14, Math.round(h * 0.016)));
  c.globalAlpha = fade; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.font = `${fs}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
  const lx = w * 0.05, ly = h * 0.86;
  c.fillStyle = INK; c.fillText(`génération ${String(g).padStart(4, '0')} / ${GENERATIONS}`, lx, ly - fs * 3);
  c.fillStyle = DIM; c.fillText(`mutation ${rate.toFixed(2).replace('.', ',')} · tournoi k = 5 · population 800`, lx, ly - fs * 1.5);
  if (g >= GENERATIONS) { c.fillStyle = ACCENT; c.fillText(`meilleure solution : ${d.hospitals.length.toLocaleString('fr-FR')} hôpitaux · 2 CHRU`, lx, ly); }
  c.globalAlpha = 1;
}
