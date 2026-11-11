import { lazy } from 'react';
import type { ProjectId } from '../story/projects';

export const SCENE_IDS: ProjectId[] = ['kelp', 'movierecom', 'azathro', 'sba'];
/** Les scènes 3D sont chargées à part, au premier projet qui approche de l'écran. */
export const ProjectScene = lazy(() => import('./Scenes3D'));
