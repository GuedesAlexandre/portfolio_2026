import { render, screen } from '@testing-library/react';
import App from './App';

it('affiche la marque a.', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /accueil/i })).toHaveTextContent('a.');
});
