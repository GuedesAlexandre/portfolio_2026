import { useState } from 'react';
import { isCompact, prefersReducedMotion } from '../story/capabilities';

/** Le drag ne doit jamais voler le scroll : seulement à la souris, sur grand écran, sans mouvement réduit. */
export const canDrag = () => !isCompact() && !prefersReducedMotion();
export const useCanDrag = () => useState(canDrag)[0];
