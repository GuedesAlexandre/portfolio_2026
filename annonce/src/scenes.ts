// Les vraies scènes du portfolio (même code que le site), exposées à la composition HyperFrames.
// Fonctions pures du temps : parfaites pour un rendu image par image.
import { drawCatalogue } from '../../src/scenes/catalogueScene';
import { decodeCommunes, drawGenetic, type GeneticData } from '../../src/scenes/geneticScene';
import { drawKelp } from '../../src/scenes/kelpScene';
import { SIGNATURE } from '../../src/loader/signature';
import { CATALOGUE_DARK, GENETIC_DARK, GENETIC_WIDE, KELP_DARK } from '../../trailer/src/palettes';
import raw from '../../public/genetique/data.json';

const genetic: GeneticData = { ...raw, communes: decodeCommunes(raw.communes as unknown as string) } as GeneticData;
type Ctx = CanvasRenderingContext2D;

(window as unknown as { Portfolio: unknown }).Portfolio = {
  drawKelp,
  drawCatalogue,
  drawGenetic: (c: Ctx, t: number, w: number, h: number) => drawGenetic(c, t, w, h, genetic),
  // Versions sombres (palettes du trailer) pour le film façon keynote
  drawKelpDark: (c: Ctx, t: number, w: number, h: number) => drawKelp(c, t, w, h, KELP_DARK),
  drawCatalogueDark: (c: Ctx, t: number, w: number, h: number) => drawCatalogue(c, t, w, h, CATALOGUE_DARK),
  drawGeneticDark: (c: Ctx, t: number, w: number, h: number) => drawGenetic(c, t, w, h, genetic, { palette: GENETIC_DARK, layout: GENETIC_WIDE }),
  SIGNATURE,
};
