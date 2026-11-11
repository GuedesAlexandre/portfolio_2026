import * as THREE from 'three';
import type { ChapterId } from '../story/chapters';

/** Matériau low-poly façon N64 : éclairage par face, pas de reflets. */
export function mat(color: string, opts: { emissive?: string; emissiveIntensity?: number; map?: THREE.Texture; transparent?: boolean; opacity?: number } = {}) {
  return new THREE.MeshLambertMaterial({
    color, flatShading: true, emissive: opts.emissive ?? '#000000', emissiveIntensity: opts.emissiveIntensity ?? 1,
    map: opts.map ?? null, transparent: opts.transparent ?? false, opacity: opts.opacity ?? 1,
  });
}

/** Texture dessinée sur un petit canvas, filtrée au plus proche (pixels visibles). */
export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function labelTexture(text: string, o: { w?: number; h?: number; bg: string; fg: string; font: string; size: number; lines?: boolean }) {
  return canvasTexture(o.w ?? 128, o.h ?? 64, (ctx, w, h) => {
    ctx.fillStyle = o.bg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = o.fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `${o.size}px ${o.font}`;
    const parts = text.split('\n');
    parts.forEach((p, i) => ctx.fillText(p, w / 2, h / 2 + (i - (parts.length - 1) / 2) * o.size * 1.15));
  });
}

/** Hauteur de chaque décor dans le monde : on plonge vers le bas. */
export const SET_Y: Record<ChapterId, number> = {
  chambre: 0, surface: -40, sba: -80, kelp: -120, movierecom: -160, azathro: -200, generique: -240,
};

type V3 = [number, number, number];
/** Cadrages du storyboard v2, en coordonnées monde. */
export const SHOTS: Record<ChapterId, { pos: V3; look: V3; fov: number }> = {
  chambre: { pos: [0.4, 2.6, 8.4], look: [-0.4, 0.95, 0], fov: 42 },
  surface: { pos: [0, -38.9, 12], look: [0, -36.6, -30], fov: 50 },
  sba: { pos: [0, -66, 0.01], look: [0, -80, 0], fov: 50 },
  kelp: { pos: [-1.6, -119.3, 10.5], look: [2.4, -119.7, 0], fov: 46 },
  movierecom: { pos: [0, -158.4, 9], look: [0, -157.4, 0], fov: 48 },
  azathro: { pos: [0, -200, 3.2], look: [0, -200, -6], fov: 55 },
  generique: { pos: [0, -236, 16], look: [0, -239, 0], fov: 45 },
};

/** Teinte de fond (la plus sombre de l'étalonnage) et portée du brouillard par chapitre. */
export const GRADE: Record<ChapterId, { bg: string; near: number; far: number }> = {
  chambre: { bg: '#120d18', near: 8, far: 26 },
  surface: { bg: '#efd9b6', near: 30, far: 110 },
  sba: { bg: '#164b6e', near: 8, far: 30 },
  kelp: { bg: '#0a2e4a', near: 6, far: 22 },
  movierecom: { bg: '#061a2d', near: 6, far: 24 },
  azathro: { bg: '#010309', near: 3, far: 14 },
  generique: { bg: '#050505', near: 10, far: 40 },
};
