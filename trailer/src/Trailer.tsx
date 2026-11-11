import { useEffect, useState } from 'react';
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/homemade-apple';
import { Lens } from './parts';
import { Soundtrack } from './audio';
import { C, SHOTS } from './shots';
import { Azathro, Bumper, Genetic, Hero, Kelp, Manifesto, Movie, Outro, useGeneticData } from './Shots';

/** Attend les polices du site (le rendu de texte doit être identique à chaque frame). */
function useFonts() {
  const [ok, setOk] = useState(false);
  const [handle] = useState(() => delayRender('polices'));
  useEffect(() => {
    const pix = new FontFace('Pix32', `url(${staticFile('azathro/pix32.woff2')})`);
    Promise.all([
      document.fonts.load('80px "Instrument Serif"'), document.fonts.load('italic 40px "Instrument Serif"'),
      document.fonts.load('30px "Hanken Grotesk"'), document.fonts.load('150px "Homemade Apple"'),
      pix.load().then((f) => { document.fonts.add(f); }),
    ]).finally(() => { setOk(true); continueRender(handle); });
  }, [handle]);
  return ok;
}

/** flash-cut : un éclair blanc ne couvre que la coupe d'entrée dans les projets (5 f de part et d'autre). */
function FlashCut({ at }: { at: number }) {
  const f = useCurrentFrame();
  const d = Math.abs(f - at);
  if (d > 5) return null;
  return <AbsoluteFill style={{ background: '#fff', opacity: (1 - d / 5) * 0.85 }} />;
}

export function Trailer({ bgm = true }: { bgm?: boolean }) {
  const fonts = useFonts();
  const data = useGeneticData();
  if (!fonts || !data) return <AbsoluteFill style={{ background: C.bg }} />;
  const S = SHOTS;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={S.bumper.from} durationInFrames={S.bumper.duration}><Bumper data={data} /></Sequence>
      <Sequence from={S.hero.from} durationInFrames={S.hero.duration}><Hero /></Sequence>
      <Sequence from={S.manifesto.from} durationInFrames={S.manifesto.duration}><Manifesto /></Sequence>
      <Sequence from={S.kelp.from} durationInFrames={S.kelp.duration}><Kelp /></Sequence>
      <Sequence from={S.movie.from} durationInFrames={S.movie.duration}><Movie /></Sequence>
      <Sequence from={S.azathro.from} durationInFrames={S.azathro.duration}><Azathro /></Sequence>
      <Sequence from={S.genetic.from} durationInFrames={S.genetic.duration}><Genetic data={data} /></Sequence>
      <Sequence from={S.outro.from} durationInFrames={S.outro.duration}><Outro /></Sequence>
      <FlashCut at={S.kelp.from} />
      <Lens />
      <Soundtrack bgm={bgm} />
    </AbsoluteFill>
  );
}
