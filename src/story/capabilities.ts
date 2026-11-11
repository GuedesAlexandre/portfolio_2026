const mq = (q: string) => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export const isCompact = () => mq('(max-width: 767px)') || mq('(pointer: coarse)');
