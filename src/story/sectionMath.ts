/** 0 quand le haut de la section touche le bas de l'écran, 1 quand son bas quitte le haut de l'écran. */
export function sectionProgress(rect: { top: number; height: number }, viewport: number): number {
  const p = (viewport - rect.top) / (rect.height + viewport);
  return Math.min(1, Math.max(0, p));
}

/**
 * Avancement dans une section « collante » : 0 quand elle se colle en haut de l'écran, 1 quand elle se décolle.
 * Sans phase collée (section pas plus haute que l'écran), on retombe sur sectionProgress.
 */
export function stickyProgress(rect: { top: number; height: number }, viewport: number): number {
  const travel = rect.height - viewport;
  if (travel <= 0) return sectionProgress(rect, viewport);
  return Math.min(1, Math.max(0, -rect.top / travel));
}

/** Nombre de mots allumés : le texte s'éclaire entre `from` et `to` de l'avancement, en douceur. */
export function litWords(progress: number, count: number, from = 0.06, to = 0.86): number {
  const x = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return Math.round(x * x * (3 - 2 * x) * count);
}
