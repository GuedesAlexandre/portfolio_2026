import { LOOP, eventsUntil } from './kelpTimeline';

/** Rejoue une session Kelp : alvéoles en nid d'abeille, câbles tirés, namespaces, cluster, load balancer. */
export type KelpPalette = { ink: string; accent: string; dim: string; cell: string; bg: string; grid: string; kelp: string; lbUp: string };
/** Palette du site (papier clair). La bande-annonce passe la sienne, sombre. */
export const KELP_LIGHT: KelpPalette = {
  ink: '#161513', accent: '#cf2a25', dim: '#716b62', cell: '#fbf9f4', bg: '#f3efe7',
  grid: 'rgba(22,21,19,0.06)', kelp: '#e2dccf', lbUp: '#2f8a3e',
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const backOut = (x: number) => { const t = clamp01(x); const c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; };

type Node = { id: string; fx: number; fy: number; at: number; lb?: boolean };
const NODES: Node[] = [
  { id: 'nginx', fx: 0.15, fy: 0.3, at: 0.9 },
  { id: 'api', fx: 0.22, fy: 0.5, at: 1.6 },
  { id: 'postgres', fx: 0.12, fy: 0.68, at: 2.3 },
  { id: 'worker', fx: 0.82, fy: 0.38, at: 5.6 },
  { id: 'redis', fx: 0.88, fy: 0.6, at: 6.3 },
  { id: 'lb', fx: 0.3, fy: 0.16, at: 8.2, lb: true },
];
/** Câbles : tirés pendant 0,6 s, juste avant l'événement qui en découle. */
const CABLES: { a: string; b: string; done: number }[] = [
  { a: 'api', b: 'postgres', done: 3.4 },
  { a: 'nginx', b: 'api', done: 4.8 },
  { a: 'worker', b: 'redis', done: 7.4 },
  { a: 'lb', b: 'nginx', done: 8.8 },
];
/** Membres de chaque namespace et instant où ils le rejoignent. */
const NAMESPACES = [
  { id: 'ns-shop', from: 3.4, members: [{ id: 'api', at: 3.4 }, { id: 'postgres', at: 3.4 }, { id: 'nginx', at: 4.8 }] },
  { id: 'ns-jobs', from: 7.4, members: [{ id: 'worker', at: 7.4 }, { id: 'redis', at: 7.4 }] },
];

let gridCache: { w: number; h: number; r: number; stroke: string; canvas: HTMLCanvasElement } | null = null;

function hexPath(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (Math.PI / 3) * i; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  c.closePath();
}

/** Centre de l'alvéole de la grille la plus proche (hexagones pointe en haut). */
function snap(x: number, y: number, r: number) {
  const w = Math.sqrt(3) * r, h = 1.5 * r;
  const row = Math.round(y / h);
  const col = Math.round((x - (row % 2 ? w / 2 : 0)) / w);
  return { x: col * w + (row % 2 ? w / 2 : 0), y: row * h };
}

function grid(c: CanvasRenderingContext2D, w: number, h: number, r: number, stroke: string) {
  if (typeof document === 'undefined') return;
  if (!gridCache || gridCache.w !== w || gridCache.h !== h || gridCache.r !== r || gridCache.stroke !== stroke) {
    const g = document.createElement('canvas'); g.width = w; g.height = h;
    const gc = g.getContext('2d');
    if (!gc) return;
    gc.strokeStyle = stroke; gc.lineWidth = 1;
    const cw = Math.sqrt(3) * r;
    for (let row = -1; row * 1.5 * r < h + r; row++) for (let col = -1; col * cw < w + cw; col++) {
      hexPath(gc, col * cw + (row % 2 ? cw / 2 : 0), row * 1.5 * r, r - 1); gc.stroke();
    }
    gridCache = { w, h, r, stroke, canvas: g };
  }
  c.drawImage(gridCache.canvas, 0, 0);
}

export function drawKelp(c: CanvasRenderingContext2D, t: number, w: number, h: number, pal: KelpPalette = KELP_LIGHT) {
  const { ink: INK, accent: ACCENT, dim: DIM, cell: CELL, bg: BG } = pal;
  const local = ((t % LOOP) + LOOP) % LOOP;
  const fade = 1 - smooth((local - 14.6) / 1.2);
  const r = Math.max(20, Math.min(50, Math.min(w, h) * 0.055));
  const pos = Object.fromEntries(NODES.map((n) => [n.id, snap(n.fx * w, n.fy * h, r)]));

  c.globalAlpha = 1;
  c.fillStyle = BG; c.fillRect(0, 0, w, h);
  grid(c, w, h, r, pal.grid);
  c.globalAlpha = fade;

  // Algues discrètes sur les bords : le clin d'œil au nom.
  c.strokeStyle = pal.kelp; c.lineWidth = Math.max(3, r * 0.12); c.lineCap = 'round';
  for (let k = 0; k < 6; k++) {
    const x0 = k < 3 ? w * (0.02 + k * 0.035) : w * (0.9 + (k - 3) * 0.035), sway = Math.sin(t * 0.8 + k) * r * 0.5;
    c.beginPath(); c.moveTo(x0, h); c.bezierCurveTo(x0 + sway, h * 0.8, x0 - sway, h * 0.7, x0 + sway * 0.6, h * (0.55 + (k % 3) * 0.05)); c.stroke();
  }

  // Cluster local : cadre pointillé.
  const cl = smooth((local - 0.4) / 0.6);
  if (cl > 0) {
    c.save(); c.globalAlpha = fade * cl * 0.55; c.strokeStyle = DIM; c.setLineDash?.([2, 6]); c.lineWidth = 1.2;
    c.strokeRect(w * 0.04, h * 0.13, w * 0.92, h * 0.8); c.setLineDash?.([]);
    c.fillStyle = DIM; c.font = `${Math.round(r * 0.32)}px "Hanken Grotesk", sans-serif`; c.fillText('cluster-local', w * 0.04 + 10, h * 0.13 + r * 0.5);
    c.restore();
  }

  // Namespaces : bulle pointillée qui s'agrandit quand un conteneur rejoint.
  for (const ns of NAMESPACES) {
    const a = smooth((local - ns.from) / 0.5);
    if (a <= 0) continue;
    const members = ns.members.filter((m) => local >= m.at).map((m) => m.id);
    const xs = members.map((m) => pos[m].x), ys = members.map((m) => pos[m].y), pad = r * 1.6;
    c.save(); c.globalAlpha = fade * a * 0.7; c.strokeStyle = INK; c.setLineDash?.([5, 5]); c.lineWidth = 1.2;
    const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad, bw = Math.max(...xs) - Math.min(...xs) + pad * 2, bh = Math.max(...ys) - Math.min(...ys) + pad * 2;
    c.beginPath(); c.roundRect?.(x, y, bw, bh, r * 0.8); if (!c.roundRect) c.rect(x, y, bw, bh); c.stroke(); c.setLineDash?.([]);
    c.fillStyle = INK; c.font = `${Math.round(r * 0.32)}px "Hanken Grotesk", sans-serif`; c.fillText(ns.id, x + 10, y + bh + r * 0.45);
    c.restore();
  }

  // Câbles tirés à la souris, puis trafic qui circule.
  c.lineCap = 'round';
  for (const cb of CABLES) {
    const p = smooth((local - (cb.done - 0.6)) / 0.6);
    if (p <= 0) continue;
    const A = pos[cb.a], B = pos[cb.b];
    const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.18, my = (A.y + B.y) / 2 + r * 0.6;
    const pt = (s: number) => ({ x: (1 - s) ** 2 * A.x + 2 * (1 - s) * s * mx + s * s * B.x, y: (1 - s) ** 2 * A.y + 2 * (1 - s) * s * my + s * s * B.y });
    c.strokeStyle = ACCENT; c.lineWidth = Math.max(2, r * 0.07);
    c.beginPath(); c.moveTo(A.x, A.y);
    for (let s = 0.04; s <= p + 1e-6; s += 0.04) { const q = pt(Math.min(s, p)); c.lineTo(q.x, q.y); }
    c.stroke();
    if (p < 1) { // le curseur qui tire le câble
      const q = pt(p);
      c.fillStyle = INK; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x + r * 0.32, q.y + r * 0.42); c.lineTo(q.x + r * 0.1, q.y + r * 0.4); c.lineTo(q.x, q.y + r * 0.55); c.closePath(); c.fill();
    } else if (local > 10) {
      for (let k = 0; k < 2; k++) { const q = pt(((local * 0.45 + k * 0.5 + cb.done) % 1)); c.fillStyle = INK; c.beginPath(); c.arc(q.x, q.y, Math.max(2, r * 0.08), 0, Math.PI * 2); c.fill(); }
    }
  }

  // Alvéoles (conteneurs) et load balancer.
  for (const n of NODES) {
    const s = backOut((local - n.at) / 0.4);
    if (s <= 0) continue;
    const { x, y } = pos[n.id];
    c.save(); c.translate(x, y); c.scale(s, s);
    hexPath(c, 0, 0, r * 0.94); c.fillStyle = CELL; c.fill();
    c.lineWidth = n.lb ? 3 : 2; c.strokeStyle = ACCENT; c.stroke();
    if (n.lb) { hexPath(c, 0, 0, r * 0.7); c.lineWidth = 1.2; c.stroke(); }
    c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `500 ${Math.round(r * (n.id.length > 6 ? 0.3 : 0.36))}px "Hanken Grotesk", sans-serif`;
    c.fillText(n.id, 0, 1);
    const up = n.lb ? local >= 10 : true;
    c.fillStyle = up ? (n.lb ? pal.lbUp : INK) : DIM;
    c.beginPath(); c.arc(0, -r * 0.55, Math.max(2, r * 0.07), 0, Math.PI * 2); c.fill();
    c.restore();
  }

  // Journal d'événements, comme le flux WebSocket.
  // Sur une planche étroite, moins de lignes, et le journal se cale toujours dans le cadre.
  const log = eventsUntil(local).slice(w < 600 ? -3 : -5);
  const fs = Math.max(11, Math.round(r * 0.3)), ly = h * 0.9;
  c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.font = `${fs}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
  const widest = Math.max(0, ...log.map((e) => c.measureText(`${String(e.t.toFixed(1)).padStart(4, '0')}s  ${e.name}  ${e.detail}`).width));
  const lx = Math.max(w * 0.04, Math.min(w * 0.6, w * 0.9 - widest));
  log.forEach((e, i) => {
    const newest = i === log.length - 1;
    c.globalAlpha = fade * (0.35 + 0.65 * ((i + 1) / log.length));
    c.font = `${fs}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
    c.fillStyle = newest ? ACCENT : DIM;
    const y = ly - (log.length - 1 - i) * fs * 1.5;
    c.fillText(`${String(e.t.toFixed(1)).padStart(4, '0')}s  ${e.name}`, lx, y);
    c.fillStyle = newest ? INK : DIM;
    c.fillText(`  ${e.detail}`, lx + c.measureText(`${String(e.t.toFixed(1)).padStart(4, '0')}s  ${e.name}`).width, y);
  });
  c.globalAlpha = 1;
}

