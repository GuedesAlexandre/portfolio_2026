import type { CataloguePalette } from '../../src/scenes/catalogueScene';
import type { GeneticLayout, GeneticPalette } from '../../src/scenes/geneticScene';
import type { KelpPalette } from '../../src/scenes/kelpScene';

/** La bande-annonce rejoue les scènes du site, mais sur fond noir. */
export const KELP_DARK: KelpPalette = {
  ink: '#ede8df', accent: '#e8322f', dim: '#5c5a57', cell: '#161514', bg: '#0b0b0c',
  grid: 'rgba(237,232,223,0.05)', kelp: '#1b1a18', lbUp: '#7fd17f',
};

export const GENETIC_DARK: GeneticPalette = {
  ink: '#ede8df', accent: '#e8322f', dim: '#5c5a57', bg: '#0b0b0c',
  outline: 'rgba(237,232,223,0.28)', land: 'rgba(237,232,223,0.02)', commune: 'rgba(237,232,223,0.16)',
};

/** Plein cadre : carte haute, décalée à droite sur grand écran. */
export const GENETIC_WIDE: GeneticLayout = { fitH: 0.84, fitW: 0.9, centerX: (w) => (w > 900 ? w * 0.7 : w * 0.5) };

export const CATALOGUE_DARK: CataloguePalette = {
  bg: '#0e0e0f', ink: '#ede8df',
  tones: ['#2a2a2e', '#3a2d22', '#1f2a33', '#33261f', '#2b3326', '#3a2230', '#26262b', '#40342a'],
  accents: ['#bdb6aa', '#8c867c', '#c9a27a', '#7f97a8', '#a8836f'],
  credits: 'rgba(237,232,223,0.7)',
};
