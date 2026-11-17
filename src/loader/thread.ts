/** Le fil du loader : une pelote de traits nerveux (« un truc complexe ») qui se dénoue en une ligne simple. */
export type Pt = [number, number];

const TAU = Math.PI * 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/** Pelote centrée en (cx, cy) : des boucles qui tournent sur elles-mêmes avec un rayon qui hésite. */
export function knot(n: number, cx: number, cy: number, size: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const a = t * TAU * 7.3;
    const r = size * (0.55 + 0.3 * Math.sin(t * TAU * 3.3 + 1) + 0.15 * Math.sin(t * TAU * 11.7));
    return [cx + Math.cos(a) * r * 1.45, cy + Math.sin(a * 1.07 + 0.4) * r * 0.85];
  });
}

/** La ligne simple : de x0 à x1, presque droite, une légère houle comme un trait à main levée. */
export function line(n: number, x0: number, x1: number, y: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [x0 + (x1 - x0) * t, y + Math.sin(t * TAU * 1.5) * 5];
  });
}

/**
 * État du fil à l'avancement `p` (0 → 1) du dénouement : chaque point part à son tour, de gauche à droite,
 * comme si l'on tirait sur le bout du fil.
 */
export function untangle(from: Pt[], to: Pt[], p: number): Pt[] {
  const n = from.length;
  return from.map(([x, y], i) => {
    const k = smooth((p - (i / (n - 1)) * 0.45) / 0.55);
    if (k >= 1) return to[i];
    return [x + (to[i][0] - x) * k, y + (to[i][1] - y) * k];
  });
}

/** Chemin SVG lissé (courbes par les milieux), de l'indice `start` à `end` exclus. */
export function toPath(pts: Pt[], start = 0, end = pts.length): string {
  const s = Math.max(0, Math.floor(start)), e = Math.min(pts.length, Math.ceil(end));
  if (e - s < 2) return '';
  let d = `M${pts[s][0].toFixed(1)} ${pts[s][1].toFixed(1)}`;
  for (let i = s + 1; i < e - 1; i++) {
    const [x, y] = pts[i], [nx, ny] = pts[i + 1];
    d += `Q${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const [lx, ly] = pts[e - 1];
  return `${d}L${lx.toFixed(1)} ${ly.toFixed(1)}`;
}
