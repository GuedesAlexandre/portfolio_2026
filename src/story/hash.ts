import { CHAPTERS, type ChapterId } from './chapters';

export function parseHash(hash: string): ChapterId | null {
  const id = hash.replace(/^#/, '').trim().toLowerCase();
  return CHAPTERS.find((c) => c.id === id)?.id ?? null;
}
