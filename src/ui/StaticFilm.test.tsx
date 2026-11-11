import { render, screen } from '@testing-library/react';
import * as caps from '../story/capabilities';
import App from '../App';

afterEach(() => vi.restoreAllMocks());

it('affiche le film complet en DOM sans WebGL', () => {
  vi.spyOn(caps, 'hasWebGL').mockReturnValue(false);
  render(<App />);
  for (const t of ['Spring Boot Admin', 'Kelp', 'MovieRecom', 'Azathro']) {
    expect(screen.getByRole('heading', { name: t })).toBeInTheDocument();
  }
  expect(document.getElementById('kelp')).not.toBeNull();
});
