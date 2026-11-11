import { AnimatedCanvas } from './AnimatedCanvas';
import { drawKelp } from './kelpScene';

/** Fond du projet Kelp : une session de l'appli rejouée en boucle. */
export const KelpScene = () => <AnimatedCanvas draw={drawKelp} stillAt={11} />;
