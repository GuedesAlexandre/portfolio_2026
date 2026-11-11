import { CHAPTERS, type ChapterId } from './chapters';

const LAST = CHAPTERS.length - 1;
const clamp01 = (p: number) => (Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0);
const pad = (n: number) => String(n).padStart(2, '0');

export function formatTimecode(totalSeconds: number): string {
  const whole = Math.floor(totalSeconds);
  const frames = Math.floor((totalSeconds - whole) * 24);
  return `${pad(Math.floor(whole / 3600))}:${pad(Math.floor(whole / 60) % 60)}:${pad(whole % 60)}:${pad(frames)}`;
}

/** Début du chapitre sur la timeline, entre 0 et 1. */
export function chapterProgress(id: ChapterId): number {
  return CHAPTERS.findIndex((c) => c.id === id) / LAST;
}

export function progressToState(p: number) {
  const x = clamp01(p) * LAST;
  const index = Math.min(LAST, Math.floor(x + 1e-9));
  const t = index === LAST ? 0 : x - index;
  const a = CHAPTERS[index];
  const b = CHAPTERS[Math.min(LAST, index + 1)];
  return {
    index,
    id: a.id,
    depthMeters: Math.round(a.depthMeters + (b.depthMeters - a.depthMeters) * t),
    timecode: formatTimecode(a.seconds + (b.seconds - a.seconds) * t),
  };
}

export type StoryState = ReturnType<typeof progressToState>;
