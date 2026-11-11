export type ChapterId = 'chambre' | 'surface' | 'sba' | 'kelp' | 'movierecom' | 'azathro' | 'generique';

export interface Chapter {
  id: ChapterId;
  label: string;
  depthLabel: string;
  depthMeters: number;
  /** Secondes du timecode au début du chapitre. */
  seconds: number;
  subtitle: string;
  slug: string;
}

export const CHAPTERS: Chapter[] = [
  { id: 'chambre', label: 'chambre', depthLabel: '0 m', depthMeters: 0, seconds: 0,
    subtitle: '« Choisis une cartouche. Ou appuie sur START, et on plonge. »',
    slug: 'INT. CHAMBRE D’ALEXANDRE — NUIT' },
  { id: 'surface', label: 'surface', depthLabel: '0 m', depthMeters: 0, seconds: 24,
    subtitle: '« Moi c’est Alexandre : ESIEE Paris jusqu’en 2028, en alternance chez BPCE SI. »',
    slug: 'EXT. LA SURFACE — JOUR' },
  { id: 'sba', label: 'SBA', depthLabel: '−40 m', depthMeters: 40, seconds: 70,
    subtitle: '« −40 m. En alternance chez BPCE SI, j’ai monté un poste d’observation pour les applis Spring Boot. »',
    slug: 'INT. POSTE D’OBSERVATION — ENTRE DEUX EAUX' },
  { id: 'kelp', label: 'Kelp', depthLabel: '−120 m', depthMeters: 120, seconds: 125,
    subtitle: '« −120 m. Kelp : du Kubernetes sans YAML, juste des alvéoles et des câbles. »',
    slug: 'INT. LE VOID — NUIT' },
  { id: 'movierecom', label: 'MovieRecom', depthLabel: '−300 m', depthMeters: 300, seconds: 200,
    subtitle: '« −300 m. MovieRecom : un LLM local qui négocie avec toi le film du soir. »',
    slug: 'INT. CINÉMA ENGLOUTI — SÉANCE DE MINUIT' },
  { id: 'azathro', label: 'Azathro', depthLabel: '−1000 m', depthMeters: 1000, seconds: 280,
    subtitle: '« −1000 m. Azathro : un roguelike de cartes, là où la lumière renonce. »',
    slug: 'EXT. ABYSSES — PLUS AUCUNE LUMIÈRE' },
  { id: 'generique', label: 'générique', depthLabel: 'fin', depthMeters: 1000, seconds: 360,
    subtitle: '« Fin. Merci d’avoir plongé. »',
    slug: 'GÉNÉRIQUE DE FIN — DÉFILE VERS LE HAUT' },
];
