import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './Menu';

it('s’ouvre au clic et donne la main au premier lien', async () => {
  render(<Menu />);
  const burger = screen.getByRole('button', { name: /menu/i });
  expect(burger).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(burger);
  expect(burger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: /accueil/i })).toHaveFocus();
});

it('mène à chaque projet directement', async () => {
  render(<Menu />);
  await userEvent.click(screen.getByRole('button', { name: /menu/i }));
  for (const [name, id] of [['Kelp', 'kelp'], ['MovieRecom', 'movierecom'], ['Azathro', 'azathro'], ['Déserts médicaux', 'deserts']]) {
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', `#${id}`);
  }
});

it('se ferme avec Échap et rend le focus au bouton', async () => {
  render(<Menu />);
  const burger = screen.getByRole('button', { name: /menu/i });
  await userEvent.click(burger);
  await userEvent.keyboard('{Escape}');
  expect(burger).toHaveAttribute('aria-expanded', 'false');
  expect(burger).toHaveFocus();
});

it('garde le focus dans le menu ouvert', async () => {
  render(<Menu />);
  await userEvent.click(screen.getByRole('button', { name: /menu/i }));
  await userEvent.tab({ shift: true });
  expect(screen.getByRole('button', { name: /fermer/i })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('link', { name: /accueil/i })).toHaveFocus();
});

it('se ferme quand on choisit une section', async () => {
  render(<Menu />);
  const burger = screen.getByRole('button', { name: /menu/i });
  await userEvent.click(burger);
  await userEvent.click(screen.getByRole('link', { name: /parcours/i }));
  expect(burger).toHaveAttribute('aria-expanded', 'false');
});
