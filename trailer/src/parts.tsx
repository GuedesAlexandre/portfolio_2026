import { useLayoutEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, F } from './shots';
import { clamp01, ramp } from './ease';
import { SIGNATURE } from './site/signature';

/** Canvas plein cadre redessiné à chaque frame (rendu déterministe : t vient du numéro de frame). */
export function DrawCanvas({ draw, w = 1920, h = 1080 }: { draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; w?: number; h?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    draw(ctx, w, h);
  }, [frame, draw, w, h]);
  return <canvas ref={ref} width={w} height={h} style={{ position: 'absolute', inset: 0, width: w, height: h }} />;
}

/** blur-slide : mots qui montent depuis le flou, un seul `p` pour les trois canaux. */
export function BlurSlide({ text, at, size, font = F.serif, color = C.ink, gap = 4, win = 22, weight = 400, italic = false, style }: {
  text: string; at: number; size: number; font?: string; color?: string; gap?: number; win?: number; weight?: number; italic?: boolean; style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: size * 0.26, fontFamily: font, fontSize: size, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', color, lineHeight: 1.05, ...style }}>
      {words.map((w, i) => {
        const p = ramp(frame, at + i * gap, win);
        return (
          <span key={i} style={{ opacity: p, transform: `translateY(${((1 - p) * 0.38 * size).toFixed(2)}px)`, filter: `blur(${((1 - p) * Math.min(18, size * 0.11)).toFixed(2)}px)`, display: 'inline-block' }}>{w}</span>
        );
      })}
    </div>
  );
}

/** La signature du loader : chaque lettre se trace à son tour, puis l'encre se remplit. */
export function Signature({ at, width, opacity = 1 }: { at: number; width: number; opacity?: number }) {
  const frame = useCurrentFrame();
  const n = SIGNATURE.glyphs.length;
  const inkAt = at + n * 6 + 14;
  const ink = ramp(frame, inkAt, 14);
  return (
    <svg viewBox={`0 0 ${SIGNATURE.width} ${SIGNATURE.height}`} style={{ width, height: 'auto', overflow: 'visible', opacity }}>
      {SIGNATURE.glyphs.map((d, i) => {
        const p = clamp01((frame - (at + i * 6)) / 16);
        return <path key={i} d={d} pathLength={1} fill={C.ink} fillOpacity={ink} stroke={C.ink} strokeOpacity={1 - ink} strokeWidth={1.6}
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p * p * (3 - 2 * p)} />;
      })}
    </svg>
  );
}
export const signatureEnd = (at: number) => at + SIGNATURE.glyphs.length * 6 + 28;

/** Vignette + grain fixe : la même « caméra » pour tous les plans. */
export function Lens() {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, mixBlendMode: 'screen', pointerEvents: 'none' }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 24} /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
}

/** Petite étiquette de chapitre en haut à gauche (Hanken, discrète). */
export function Kicker({ text, at }: { text: string; at: number }) {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, 16);
  return <div style={{ position: 'absolute', left: 96, top: 72, fontFamily: F.sans, fontSize: 22, letterSpacing: '0.12em', color: C.dim, opacity: p, textTransform: 'uppercase' }}>{text}</div>;
}
