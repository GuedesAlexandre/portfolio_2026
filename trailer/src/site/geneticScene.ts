import { GENERATIONS, LOOP, convergenceAt, generationAt, mutationRateAt } from './geneticTimeline';

/** Données réelles du projet (scripts/genetique-data.mjs) : contour, communes, meilleure solution. */
export type GeneticData = {
  w: number; h: number; km10: number;
  outline: number[][];
  communes: Float32Array; // x, y normalisés
  hospitals: [number, number, number][]; // x, y, est_chru
};

const INK = '#ede8df', ORANGE = '#ff6a1f', DIM = '#5c5a57';
const RANDOM_START = 2000; // nb_hop de la config : taille max d'un individu au départ
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export function decodeCommunes(b64: string): Float32Array {
  const bin = atob(b64);
  const out = new Float32Array(bin.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = (bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8)) / 65535;
  return out;
}

let cache: { key: string; canvas: HTMLCanvasElement } | null = null;

export function drawGenetic(c: CanvasRenderingContext2D, t: number, w: number, h: number, d: GeneticData) {
  const local = ((t % LOOP) + LOOP) % LOOP;
  const g = generationAt(t);
  const conv = convergenceAt(g);
  const fade = Math.min(1, local / 0.4) * (1 - Math.max(0, (local - (LOOP - 0.7)) / 0.7));

  // Carte : hauteur 84 % de l'écran, décalée à droite sur grand écran.
  const scale = Math.min(h * 0.84 / d.h, w * 0.9 / d.w);
  const ox = (w > 900 ? w * 0.7 : w * 0.5) - (d.w * scale) / 2;
  const oy = (h - d.h * scale) / 2;
  const X = (x: number) => ox + x * scale, Y = (y: number) => oy + y * scale;

  c.globalAlpha = 1;
  c.fillStyle = '#0b0b0c'; c.fillRect(0, 0, w, h);

  // Contour + 34 437 communes, dessinés une fois.
  const key = `${w}x${h}`;
  if (typeof document !== 'undefined' && cache?.key !== key) {
    const off = document.createElement('canvas'); off.width = w; off.height = h;
    const oc = off.getContext('2d');
    if (oc) {
      oc.strokeStyle = 'rgba(237,232,223,0.28)'; oc.lineWidth = 1; oc.fillStyle = 'rgba(237,232,223,0.02)';
      for (const ring of d.outline) {
        oc.beginPath();
        for (let i = 0; i < ring.length; i += 2) oc.lineTo(X(ring[i]), Y(ring[i + 1]));
        oc.closePath(); oc.fill(); oc.stroke();
      }
      oc.fillStyle = 'rgba(237,232,223,0.16)';
      for (let i = 0; i < d.communes.length; i += 2) oc.fillRect(X(d.communes[i]), Y(d.communes[i + 1]), 1, 1);
      cache = { key, canvas: off };
    }
  }
  if (cache?.key === key) c.drawImage(cache.canvas, 0, 0);

  c.globalAlpha = fade;
  const r10 = Math.max(1.5, d.km10 * scale);
  const nCommunes = d.communes.length / 2;
  const draw = (x: number, y: number, a: number) => {
    c.globalAlpha = fade * a * 0.12; c.fillStyle = ORANGE;
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
  if (g >= GENERATIONS) { c.fillStyle = ORANGE; c.fillText(`meilleure solution : ${d.hospitals.length.toLocaleString('fr-FR')} hôpitaux · 2 CHRU`, lx, ly); }
  c.globalAlpha = 1;
}
