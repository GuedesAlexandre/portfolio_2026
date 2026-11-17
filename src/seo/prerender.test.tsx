import { act, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../App';
import { renderApp } from './prerender';

// Comme en vrai : au build (Node) il n'y a ni document ni WebGL ; dans le navigateur, si.
vi.mock('../story/capabilities', () => ({ hasWebGL: () => typeof document !== 'undefined', prefersReducedMotion: () => false, isCompact: () => false }));

/** Rendu « comme au build » : sans document ni window. */
function buildHtml() {
  vi.stubGlobal('document', undefined);
  vi.stubGlobal('window', undefined);
  try { return renderApp(); } finally { vi.unstubAllGlobals(); }
}
vi.mock('../particles/ParticleStage', () => ({ ParticleStage: () => null }));

it('le HTML prérendu contient le contenu indexable', () => {
  const html = buildHtml();
  expect(html).toContain('<h1');
  for (const t of ['Kelp', 'MovieRecom', 'Azathro', 'Déserts médicaux', 'Parcours']) expect(html).toContain(t);
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

it('s’hydrate sans écart avec le rendu du build, même quand le navigateur a WebGL', async () => {
  const root = document.createElement('div');
  root.innerHTML = buildHtml();
  document.body.append(root);
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, 'error').mockImplementation((...a) => { errors.push(a); });
  await act(async () => { hydrateRoot(root, <StrictMode><App /></StrictMode>, { onRecoverableError: (e) => errors.push(e) }); });
  spy.mockRestore();
  expect(errors).toEqual([]);
  expect(root.querySelector('.site')).not.toHaveClass('no-3d');
});
