import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('affiche le nom en titre principal', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alexandre');
});

it('présente les 4 projets', () => {
  render(<App />);
  for (const t of ['Kelp', 'MovieRecom', 'Azathro', 'Spring Boot Admin']) {
    expect(screen.getByRole('heading', { level: 3, name: t })).toBeInTheDocument();
  }
});

it('déplie le détail de Kelp au clavier', async () => {
  render(<App />);
  const kelp = document.getElementById('kelp')!;
  const btn = within(kelp).getByRole('button', { name: /lire la suite/i });
  expect(btn).toHaveAttribute('aria-expanded', 'false');
  btn.focus();
  await userEvent.keyboard('{Enter}');
  expect(btn).toHaveAttribute('aria-expanded', 'true');
  expect(within(kelp).getByText(/Fabric8 et docker-java/)).toBeVisible();
});

it('donne un moyen de contact', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /dis bonjour/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument();
});
