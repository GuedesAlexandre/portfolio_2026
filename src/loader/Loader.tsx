import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { SIGNATURE } from './signature';
import { knot, line, smooth, toPath, untangle } from './thread';

/**
 * L'histoire du loader, en secondes : la page du carnet se trace, la plume gribouille « un truc complexe »,
 * on tire sur le fil, la pelote se dénoue en une ligne, et la ligne s'écrit en signature.
 */
const T = { knot: [0.35, 1.4], untangle: [1.5, 2.5], sign: 2.45, glyphGap: 0.13, glyph: 0.45 } as const;
const INK_AT = T.sign + SIGNATURE.glyphs.length * T.glyphGap + 0.15;
export const STORY_MS = Math.round((INK_AT + 0.5) * 1000);

const N = 220;
const KNOT = knot(N, SIGNATURE.width / 2, 135, 110);
const LINE = line(N, 40, SIGNATURE.width - 40, 228);
const SEEN = 'carnet-intro-vu';

const seenBefore = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } };
const markSeen = () => { try { sessionStorage.setItem(SEEN, '1'); } catch { /* navigation privée : on rejouera */ } };
const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Quand l'histoire a commencé, en temps de `performance.now()`. La page arrive prérendue : les tracés CSS de la
 * signature tournent déjà avant que React s'hydrate, on cale donc le fil sur leur départ réel.
 */
function storyStart(svg: SVGSVGElement | null): number {
  const t = svg?.querySelector('path')?.getAnimations?.()[0]?.startTime;
  return typeof t === 'number' ? t : performance.now();
}

/** Le fil à l'instant `s` (en secondes depuis le début de l'histoire). */
function threadAt(s: number): string {
  const [k0, k1] = T.knot, [u0, u1] = T.untangle;
  if (s < k0) return '';
  if (s < k1) return toPath(KNOT, 0, 2 + (N - 2) * smooth((s - k0) / (k1 - k0)));
  if (s < u0) return toPath(KNOT);
  if (s < u1) return toPath(untangle(KNOT, LINE, (s - u0) / (u1 - u0)));
  // La plume consomme le fil à mesure qu'elle écrit le nom.
  const q = smooth((s - T.sign) / (INK_AT - T.sign));
  return q < 1 ? toPath(LINE, (N - 2) * q) : '';
}

/** Écran de chargement : une petite histoire, puis le titre prend le relais. Rejouée une seule fois par session. */
export function Loader({ whenReady, onDone, minMs = STORY_MS, maxMs = 8000 }: {
  whenReady: Promise<unknown>; onDone: () => void; minMs?: number; maxMs?: number;
}) {
  // Même premier rendu qu'au build (histoire complète) ; la version courte est choisie avant l'affichage.
  const [brief, setBrief] = useState(false);
  useLayoutEffect(() => { if (seenBefore() || reducedMotion()) setBrief(true); }, []);
  const svg = useRef<SVGSVGElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const thread = useRef<SVGPathElement>(null);
  const left = useRef(false);

  const leave = useCallback(() => {
    if (left.current) return;
    left.current = true;
    markSeen();
    setLeaving(true);
    // Le titre apparaît pendant que le loader s'efface (fondu croisé), pas après.
    onDone();
    setTimeout(() => setGone(true), 750);
  }, [onDone]);

  useEffect(() => {
    let alive = true;
    const elapsed = performance.now() - storyStart(svg.current);
    const min = new Promise((r) => setTimeout(r, Math.max(0, (brief ? Math.min(minMs, 700) : minMs) - elapsed)));
    const max = new Promise((r) => setTimeout(r, maxMs));
    Promise.race([Promise.all([whenReady, min]), max]).then(() => { if (alive) leave(); });
    return () => { alive = false; };
  }, [whenReady, minMs, maxMs, brief, leave]);

  // Le fil est redessiné à chaque image, sans passer par React.
  useEffect(() => {
    if (brief || typeof requestAnimationFrame === 'undefined') return;
    let raf = 0;
    const t0 = storyStart(svg.current);
    const frame = (now: number) => {
      const s = (now - t0) / 1000;
      thread.current?.setAttribute('d', threadAt(s));
      if (s < INK_AT + 0.1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [brief]);

  if (gone) return null;
  return (
    <div className={`loader${leaving ? ' is-leaving' : ''}${brief ? ' is-brief' : ''}`} onPointerDown={leave}>
      <div className="loader-stage">
        <svg ref={svg} className="signature" viewBox={`0 0 ${SIGNATURE.width} ${SIGNATURE.height}`} aria-hidden="true">
          {SIGNATURE.glyphs.map((d, i) => (
            <path key={i} d={d} pathLength="1" style={{ animationDelay: `${T.sign + i * T.glyphGap}s, ${INK_AT}s`, animationDuration: `${T.glyph}s, 0.5s` }} />
          ))}
          {!brief && <path ref={thread} className="thread" d="" />}
        </svg>
        {!brief && (
          <>
            <p className="loader-note loader-note-1" aria-hidden="true" style={{ '--at': `${T.knot[0] + 0.5}s` } as CSSProperties}>un truc complexe</p>
            <p className="loader-note loader-note-2" aria-hidden="true" style={{ '--at': `${T.untangle[1]}s` } as CSSProperties}>… rendu simple.</p>
          </>
        )}
      </div>
      {!brief && <button type="button" className="loader-skip" onClick={leave}>passer</button>}
      <p className="sr-only" role="status">chargement</p>
    </div>
  );
}
