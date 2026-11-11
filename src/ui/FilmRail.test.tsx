import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilmRail } from './FilmRail';

it('liste les 7 chapitres', () => {
  render(<FilmRail activeId="chambre" onJump={() => {}} />);
  const nav = screen.getByRole('navigation', { name: /chapitres/i });
  expect(nav.querySelectorAll('button')).toHaveLength(7);
  expect(screen.getByRole('button', { name: /générique/i })).toBeInTheDocument();
});

it('saute au chapitre cliqué', async () => {
  const onJump = vi.fn();
  render(<FilmRail activeId="chambre" onJump={onJump} />);
  await userEvent.click(screen.getByRole('button', { name: /kelp/i }));
  expect(onJump).toHaveBeenCalledWith('kelp');
});

it('marque le chapitre actif', () => {
  render(<FilmRail activeId="azathro" onJump={() => {}} />);
  expect(screen.getByRole('button', { name: /azathro/i })).toHaveAttribute('aria-current', 'step');
});

it('est atteignable au clavier', async () => {
  const onJump = vi.fn();
  render(<FilmRail activeId="chambre" onJump={onJump} />);
  await userEvent.tab();
  expect(screen.getByRole('button', { name: /chambre/i })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(onJump).toHaveBeenCalledWith('chambre');
});
