import { useCallback, useEffect, useMemo, useState } from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BlurSlide, DrawCanvas, Kicker, Signature, signatureEnd } from './parts';
import { C, F } from './shots';
import { DEMOTE, clamp01, mix, ramp } from './ease';
import { drawKelp } from './site/kelpScene';
import { drawCatalogue } from './site/catalogueScene';
import { decodeCommunes, drawGenetic, type GeneticData } from './site/geneticScene';
import { blend, chaosAt, sampleTargets, staggerDelays } from './site/field';

const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/* ---------- Données réelles de « Déserts médicaux » ---------- */
export function useGeneticData() {
  const [data, setData] = useState<GeneticData | null>(null);
  const [handle] = useState(() => delayRender('données Déserts médicaux'));
  useEffect(() => {
    fetch(staticFile('genetique/data.json')).then((r) => r.json()).then((raw) => {
      setData({ ...raw, communes: decodeCommunes(raw.communes) });
      continueRender(handle);
    });
  }, [handle]);
  return data;
}

/* ---------- Scène Azathro : vrais assets du jeu ---------- */
function AzathroArt({ f, cards = true }: { f: number; cards?: boolean }) {
  const breathe = 1.03 + 0.03 * Math.sin(f / 40);
  const glow = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0e1424' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 1920 * 1.0, aspectRatio: '1920 / 1296', transform: `translate(-50%, -52%) scale(${breathe})` }}>
        <Img src={staticFile('azathro/background.webp')} style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
        {[41.9, 50.5].map((x) => (
          <div key={x} style={{ position: 'absolute', left: `${x}%`, top: '44%', width: '3.2%', aspectRatio: '1', transform: `translate(-50%,-50%) scale(${0.9 + glow * 0.35})`, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,236,210,0.95) 0 22%, rgba(255,106,31,0.55) 40%, transparent 70%)', mixBlendMode: 'screen', opacity: 0.35 + glow * 0.65 }} />
        ))}
      </div>
      {cards && (
        <div style={{ position: 'absolute', left: '50%', bottom: -40, display: 'flex', transform: 'translateX(-50%)', perspective: 900 }}>
          {['king_heart', 'king_spade', 'king_club', 'ace_spade', 'ace_heart'].map((c, i) => (
            <Img key={c} src={staticFile(`azathro/${c}.png`)} style={{
              width: 150, margin: '0 -12px', imageRendering: 'pixelated', transformOrigin: '50% 120%',
              transform: `rotate(${(i - 2) * 6}deg) translateY(${Math.abs(i - 2) * 14 + Math.sin(f / 16 + i) * 5}px) rotateY(${Math.sin(f / 18 + i * 0.6) * 8}deg)`,
              filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.55))',
            }} />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
}

/* ---------- S1 · trailer-bumper ---------- */
export function Bumper({ data }: { data: GeneticData }) {
  const f = useCurrentFrame();
  const push = (start: number) => interpolate(f, [start, start + 9], [1, 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const kelp = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => drawKelp(c, 9.6, w, h), []);
  const map = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => drawGenetic(c, 12, w, h, data), [data]);
  if (f < 9) return <AbsoluteFill style={{ transform: `scale(${push(0)})` }}><DrawCanvas draw={kelp} /></AbsoluteFill>;
  if (f < 18) return <AbsoluteFill style={{ transform: `scale(${push(9)})` }}><AzathroArt f={f} /></AbsoluteFill>;
  if (f < 27) return (
    // Gros plan net : le canvas est redessiné 1,8× plus grand (pas d'agrandissement flou).
    <AbsoluteFill style={{ transform: `scale(${push(18)})`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -1500, top: -430 }}><DrawCanvas draw={map} w={3456} h={1944} /></div>
    </AbsoluteFill>
  );
  if (f < 33) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill style={{ background: C.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Signature at={36} width={1150} />
    </AbsoluteFill>
  );
}
export const BUMPER_SIGNATURE_DONE = signatureEnd(36);

/* ---------- S2 · titre + particules qui forment « a. » ---------- */
const N = 2600;
function logoTargets(width: number) {
  const c = document.createElement('canvas'); c.width = 460; c.height = 220;
  const x = c.getContext('2d')!;
  x.font = '150px "Homemade Apple"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
  x.fillText('a.', 230, 120);
  return sampleTargets(x.getImageData(0, 0, 460, 220), N, width);
}
export function Hero() {
  const f = useCurrentFrame();
  const target = useMemo(() => logoTargets(9), []);
  const delays = useMemo(() => staggerDelays(N, 0.45), []);
  const chaos = useMemo(() => new Float32Array(N * 3), []);
  const out = useMemo(() => new Float32Array(N * 3), []);
  const order = ramp(f, 26, 74, Easing.inOut(Easing.cubic));
  const particles = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => {
    c.clearRect(0, 0, w, h);
    chaosAt(N, (f + 150) / 30, chaos);
    blend(chaos, target, order, out, delays);
    for (let i = 0; i < N; i++) {
      const z = out[i * 3 + 2], k = 1 / (1 - z * 0.08);
      const sc = mix(100, 62, order), cy = mix(0.52, 0.8, order);
      const x = w / 2 + out[i * 3] * sc * k, y = h * cy - out[i * 3 + 1] * sc * k;
      c.globalAlpha = 0.55; c.fillStyle = i % 9 === 0 ? C.accent : C.ink;
      c.beginPath(); c.arc(x, y, 2.1 * k, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
  }, [f, order, target, delays, chaos, out]);
  const sigOut = 1 - ramp(f, 0, 14);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <DrawCanvas draw={particles} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: sigOut }}><Signature at={-200} width={1150} /></AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 250, flexDirection: 'column', gap: 34, textShadow: '0 0 30px rgba(11,11,12,0.9)' }}>
        <BlurSlide text="Alexandre" at={6} size={300} win={30} style={{ letterSpacing: '-0.03em' }} />
        <BlurSlide text="Apprenti ingénieur logiciel. Je rends simple ce qui est complexe." at={26} size={44} italic gap={2.4} win={20} style={{ justifyContent: 'center', maxWidth: 1200 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ---------- S3 · manifeste qui s'éclaire ---------- */
const MANIFESTO = 'Je prends un truc complexe, un cluster Kubernetes, un LLM, un moteur de jeu, et je le rends simple à manipuler.';
export function Manifesto() {
  const f = useCurrentFrame();
  const words = MANIFESTO.split(' ');
  const note = ramp(f, 40, 18);
  return (
    <AbsoluteFill style={{ background: C.bg, alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ margin: 0, maxWidth: 1400, textAlign: 'center', fontFamily: F.serif, fontSize: 84, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
        {words.map((w, i) => {
          const p = clamp01((f - 8 - i * 4.6) / 6);
          return <span key={i} style={{ color: `rgb(${Math.round(mix(44, 237, p))},${Math.round(mix(43, 232, p))},${Math.round(mix(41, 223, p))})` }}>{w} </span>;
        })}
      </p>
      <div style={{ position: 'absolute', right: 190, top: 170, fontFamily: F.hand, fontSize: 30, color: C.accent, transform: 'rotate(5deg)', opacity: note }}>O(complexe) → O(simple)</div>
    </AbsoluteFill>
  );
}

/* ---------- S4 · Kelp : title-demote-to-label ---------- */
export function Kelp() {
  const f = useCurrentFrame();
  const scene = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => drawKelp(c, 0.8 + (f / 30) * 1.65, w, h), [f]);
  const d = ramp(f, 34, 26, DEMOTE); // 18 f debout puis 26 f de déclassement
  const scale = mix(1, 0.22, d);
  const x = mix(960, 96, d), y = mix(540, 150, d);
  const shade = 1 - d;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <DrawCanvas draw={scene} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(11,11,12,0.92), rgba(11,11,12,0.2))', opacity: 0.35 + shade * 0.6 }} />
      <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${mix(-50, 0, d)}%, -50%) scale(${scale})`, transformOrigin: 'left center', filter: `blur(${(Math.sin(d * Math.PI) * 3).toFixed(2)}px)` }}>
        <BlurSlide text="Kelp" at={2} size={220} win={16} style={{ letterSpacing: '-0.02em' }} />
      </div>
      <Kicker text="Projet perso · en cours" at={62} />
      <div style={{ position: 'absolute', left: 96, bottom: 120, width: 820, textShadow: '0 0 24px rgba(11,11,12,0.95)' }}>
        <BlurSlide text="Du Kubernetes sans une ligne de YAML." at={60} size={58} />
        <BlurSlide text="Des alvéoles, des câbles, et Kelp monte le cluster en coulisses." at={78} size={30} font={F.sans} gap={2.4} win={20} style={{ marginTop: 18, color: '#bdb6aa' }} />
      </div>
    </AbsoluteFill>
  );
}

/* ---------- S5 · MovieRecom : le catalogue qui s'éteint ---------- */
export function Movie() {
  const f = useCurrentFrame();
  const scene = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => drawCatalogue(c, 1.4 + (f / 30) * 1.35, w, h), [f]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <DrawCanvas draw={scene} />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(14,14,15,0.92) 0%, rgba(14,14,15,0.75) 42%, rgba(14,14,15,0) 62%)' }} />
      <Kicker text="ESIEE Paris · en binôme" at={10} />
      <div style={{ position: 'absolute', left: 96, top: 300, width: 900 }}>
        <BlurSlide text="MovieRecom" at={6} size={150} win={26} style={{ letterSpacing: '-0.02em' }} />
        <BlurSlide text="Plus de catalogue. Un LLM local te trouve le film du soir." at={26} size={44} italic gap={2.4} win={20} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
}

/* ---------- S6 · Azathro : score-slam ---------- */
const SLAM = 90;
export function Azathro() {
  const f = useCurrentFrame();
  const fall = clamp01((f - SLAM) / 6);
  const s = mix(2.6, 1, Easing.in(Easing.quad)(fall));
  const rot = mix(5, 0, Easing.in(Easing.quad)(fall));
  const hit = f >= SLAM + 6;
  const since = f - (SLAM + 6);
  const shake = hit && since < 10 ? (1 - since / 10) * 14 : 0;
  const sx = shake * (rnd(f) - 0.5) * 2, sy = shake * (rnd(f + 99) - 0.5) * 2;
  const land = (at: number) => (f < at ? 0 : mix(1.8, 1, Easing.out(Easing.cubic)(clamp01((f - at) / 4))));
  const box = (bg: string) => ({ padding: '8px 22px', background: bg, border: '3px solid #ede8df' });
  return (
    <AbsoluteFill style={{ background: C.bg, transform: `translate(${sx}px, ${sy}px)` }}>
      <AzathroArt f={f} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 45% 55% at 26% 30%, rgba(11,11,12,0.85), rgba(11,11,12,0.1))' }} />
      <Kicker text="Projet perso · jeu" at={8} />
      <div style={{ position: 'absolute', left: 96, top: 140, width: 900 }}>
        <BlurSlide text="Azathro" at={4} size={150} win={26} />
        <BlurSlide text="Un roguelike de cartes lovecraftien, codé de zéro en Java." at={24} size={40} italic gap={2.4} win={20} style={{ marginTop: 22, maxWidth: 760 }} />
      </div>
      {f >= SLAM && (
        <div style={{ position: 'absolute', left: '50%', top: 650, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, opacity: Math.min(1, fall * 3),
          display: 'flex', alignItems: 'center', gap: 16, fontFamily: '"Pix32", monospace', fontSize: 64, color: C.ink }}>
          <span style={box('rgba(20,20,40,0.92)')}>Full House</span>
          <span style={{ ...box('#2f5bd8'), transform: `scale(${land(SLAM + 9)})`, opacity: f >= SLAM + 9 ? 1 : 0 }}>40</span>
          <span style={{ opacity: f >= SLAM + 9 ? 1 : 0 }}>×</span>
          <span style={{ ...box('#e5322d'), transform: `scale(${land(SLAM + 12)})`, opacity: f >= SLAM + 12 ? 1 : 0 }}>4</span>
        </div>
      )}
      {hit && since < 22 && (
        <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
          <circle cx={960} cy={650} r={60 + since * 22} fill="none" stroke={C.ink} strokeWidth={Math.max(0.5, 6 - since * 0.28)} opacity={1 - since / 22} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2 + rnd(i) * 0.3, d = 120 + since * (14 + rnd(i + 3) * 10);
            return <rect key={i} x={960 + Math.cos(a) * d} y={650 + Math.sin(a) * d * 0.6} width={6} height={6} fill={i % 3 ? C.ink : C.accent} opacity={1 - since / 22} />;
          })}
        </svg>
      )}
      {hit && since < 3 && <AbsoluteFill style={{ background: '#fff', opacity: 0.32 * (1 - since / 3) }} />}
    </AbsoluteFill>
  );
}

/* ---------- S7 · Déserts médicaux ---------- */
export function Genetic({ data }: { data: GeneticData }) {
  const f = useCurrentFrame();
  const scene = useCallback((c: CanvasRenderingContext2D, w: number, h: number) => drawGenetic(c, Math.min(12.6, (f / 30) * 2.3), w, h, data), [f, data]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <DrawCanvas draw={scene} />
      <Kicker text="ESIEE Paris · projet en équipe" at={10} />
      <div style={{ position: 'absolute', left: 96, top: 300, width: 760, textShadow: '0 0 24px rgba(11,11,12,0.95)' }}>
        <BlurSlide text="Déserts médicaux" at={6} size={130} win={26} style={{ letterSpacing: '-0.02em' }} />
        <BlurSlide text="Un algorithme génétique en C place les hôpitaux de France." at={26} size={40} italic gap={2.4} win={20} style={{ marginTop: 24 }} />
      </div>
    </AbsoluteFill>
  );
}

/* ---------- S8 · grain-dissolve vers « a. » ---------- */
const OUT = 90;
export function Outro() {
  const f = useCurrentFrame();
  const t = clamp01(f / OUT);
  const burst = Easing.out(Easing.cubic)(clamp01((t - 0.13) / 0.15));
  const lock = Easing.inOut(Easing.cubic)(clamp01((t - 0.68) / 0.22));
  const cross = Easing.inOut(Easing.cubic)(clamp01((t - 0.6) / 0.11));
  const cond = Easing.out(Easing.cubic)(clamp01((t - 0.6) / 0.2));
  const settle = clamp01((t - 0.88) / 0.12);
  const disp = 52 * burst * (1 - lock);
  const blur = 1.1 * burst * (1 - lock);
  const glow = burst * 0.3 + cond * 0.7 - settle * 0.45;
  const frameOn = burst * (1 - clamp01((t - 0.55) / 0.09));
  const seed = Math.floor(t * 46);
  const foot = ramp(f, OUT + 10, 20);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="sand" x="-20%" y="-60%" width="140%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency={0.9 + 0.4 * burst} numOctaves={2} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={disp} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={blur} result="b" />
            <feGaussianBlur in="b" stdDeviation={4} result="g1" />
            <feGaussianBlur in="b" stdDeviation={26} result="g2" />
            <feColorMatrix in="g2" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${Math.max(0, glow) * 0.9} 0`} result="g2c" />
            <feMerge><feMergeNode in="g2c" /><feMergeNode in="g1" /><feMergeNode in="b" /></feMerge>
          </filter>
          <pattern id="hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="10" stroke="#ede8df" strokeWidth="1" opacity="0.35" /></pattern>
        </defs>
        <rect x={560} y={440} width={800} height={200} fill="url(#hatch)" stroke={C.ink} strokeOpacity={0.5} opacity={frameOn} />
        <g filter="url(#sand)">
          <text x={960} y={560} textAnchor="middle" fontFamily='"Instrument Serif"' fontSize={72} fill={C.ink} opacity={1 - cross}>{'{ Alexandre. dis bonjour }'}</text>
          <text x={960} y={620} textAnchor="middle" fontFamily='"Homemade Apple"' fontSize={280} fill={C.ink} opacity={cross}>a.</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: F.sans, fontSize: 26, letterSpacing: '0.14em', color: C.dim, opacity: foot }}>PORTFOLIO · 2026</div>
    </AbsoluteFill>
  );
}
