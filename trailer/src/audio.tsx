import { Audio, Sequence, interpolate, staticFile } from 'remotion';
import { SHOTS, TOTAL } from './shots';

/** Décalage du pic d'énergie de chaque son (mesuré à l'analyse), en frames : le pic tombe pile sur l'action. */
const PEAK: Record<string, number> = { 'fs-402692': 1, 'fs-277312': 1, 'fs-71852': 13, 'fs-427823': 6, 'fs-812593': 9, 'fs-201808': 1, 'fs-685256': 82, 'fs-648890': 16, 'fs-777578': 6 };
const S = SHOTS;
const at = (src: string, action: number, volume: number, dur?: number) => ({ src, from: action - PEAK[src], volume, dur });

/** Table centrale des SFX : chaque ligne = une action à l'image. */
export const SFX = [
  at('fs-402692', S.bumper.from + 0, 0.6, 9), // coupe 1 (Kelp) — coupé net à la coupe suivante
  at('fs-402692', S.bumper.from + 9, 0.55, 9), // coupe 2 (Azathro)
  at('fs-402692', S.bumper.from + 18, 0.5, 9), // coupe 3 (carte) — le noir 27–33 reste muet
  at('fs-277312', S.bumper.from + 37, 2.4), // la plume commence la signature
  at('fs-277312', S.bumper.from + 68, 2.1), // fin de la signature
  at('fs-71852', S.hero.from + 40, 0.35), // les particules se mettent en ordre
  at('fs-427823', S.kelp.from, 0.55), // flash-cut vers les projets
  at('fs-71852', S.kelp.from + 46, 0.3), // « Kelp » descend en étiquette
  at('fs-777578', S.movie.from + 133, 0.9), // le film du soir s'avance
  at('fs-812593', S.azathro.from + 96, 0.75), // Full House s'écrase
  at('fs-201808', S.azathro.from + 99, 0.5), // 40 jetons
  at('fs-201808', S.azathro.from + 102, 0.45), // ×4
  at('fs-648890', S.genetic.from + 143, 0.35), // génération 1000 : meilleure solution
  at('fs-685256', S.outro.from + 64, 0.5), // riser jusqu'à la condensation en « a. »
  at('fs-402692', S.outro.from + 64, 0.6), // « a. » se fige
  at('fs-777578', S.outro.from + 70, 0.8), // étincelle
];

/** Musique : démarre après le noir silencieux de l'accroche ; `bgm=false` donne la version sans musique. */
export function Soundtrack({ bgm }: { bgm: boolean }) {
  const start = S.bumper.from + 33;
  return (
    <>
      {bgm && (
        <Sequence from={start}>
          <Audio src={staticFile('audio/bgm.mp3')} volume={(f) => 0.42 * interpolate(f, [0, 20, TOTAL - start - 45, TOTAL - start], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
        </Sequence>
      )}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.from)} durationInFrames={s.dur}>
          <Audio src={staticFile(`audio/sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </>
  );
}
