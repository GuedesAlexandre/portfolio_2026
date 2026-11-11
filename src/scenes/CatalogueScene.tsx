import { AnimatedCanvas } from './AnimatedCanvas';
import { drawCatalogue } from './catalogueScene';

/** Fond du projet MovieRecom : le catalogue s'éteint, il ne reste que le film du soir. */
export const CatalogueScene = () => <AnimatedCanvas draw={drawCatalogue} stillAt={9} />;
