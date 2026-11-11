import { render, screen } from '@testing-library/react';
import { Component } from 'react';
import App from './App';
import * as caps from './story/capabilities';
import { MANIFESTO } from './story/about';
import { SafeBoundary } from './SafeBoundary';

afterEach(() => { vi.restoreAllMocks(); history.replaceState(null, '', '/'); });

it('scrolle jusqu’à la section demandée par le lien (#kelp)', () => {
  const spy = vi.fn();
  Element.prototype.scrollIntoView = spy;
  history.replaceState(null, '', '/#kelp');
  render(<App />);
  expect(spy).toHaveBeenCalled();
  expect((spy.mock.contexts[0] as Element).id).toBe('kelp');
});

it('marque la page sans 3D pour libérer la place du clavier', () => {
  vi.spyOn(caps, 'hasWebGL').mockReturnValue(false);
  const { container } = render(<App />);
  expect(container.querySelector('.site.no-3d')).not.toBeNull();
});

it('lit le manifeste aux lecteurs d’écran', () => {
  render(<App />);
  expect(screen.getByText(MANIFESTO)).toHaveClass('sr-only');
});

it('ne casse pas la page si la 3D plante', () => {
  class Boom extends Component { render(): never { throw new Error('webgl'); } }
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<div><SafeBoundary><Boom /></SafeBoundary><p>texte</p></div>);
  expect(screen.getByText('texte')).toBeInTheDocument();
});
