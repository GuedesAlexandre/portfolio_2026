import { render, screen } from '@testing-library/react';
import { AzathroScene, HAND } from './AzathroScene';

it('montre le fond du jeu et une main de 5 vraies cartes', () => {
  const { container } = render(<AzathroScene />);
  expect(container.querySelector('.az-bg')).not.toBeNull();
  expect(container.querySelectorAll('.az-card')).toHaveLength(5);
});

it('affiche le vrai score de la main (Full House 40 × 4)', () => {
  render(<AzathroScene />);
  expect(HAND.combo).toEqual({ name: 'Full House', chips: 40, mult: 4 });
  expect(screen.getByText('Full House')).toBeInTheDocument();
});
