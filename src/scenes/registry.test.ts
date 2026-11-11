import { SCENE_IDS } from './registry';
import { PROJECTS } from '../story/projects';

it('a une scène 3D pour chaque projet', () => {
  expect([...SCENE_IDS].sort()).toEqual(PROJECTS.map((p) => p.id).sort());
});
