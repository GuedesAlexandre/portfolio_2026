/** 0 quand le haut de la section touche le bas de l'écran, 1 quand son bas quitte le haut de l'écran. */
export function sectionProgress(rect: { top: number; height: number }, viewport: number): number {
  const p = (viewport - rect.top) / (rect.height + viewport);
  return Math.min(1, Math.max(0, p));
}
