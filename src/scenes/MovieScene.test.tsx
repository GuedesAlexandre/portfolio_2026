import { render, screen } from '@testing-library/react';
import { MovieScene } from './MovieScene';

it('rejoue la vraie demande du Conseil du soir', () => {
  render(<MovieScene />);
  expect(screen.getByText("Qu'est-ce que t'as envie de regarder ce soir ?")).toBeInTheDocument();
  expect(screen.getByText('ENVOYER')).toBeInTheDocument();
  for (const t of ['Peu importe', 'Un film', 'Une série']) expect(screen.getByText(t)).toBeInTheDocument();
});

it('montre la proposition, son pourquoi et l’ajout à la Pensine', () => {
  render(<MovieScene />);
  expect(screen.getByText('Proposition - 01')).toBeInTheDocument();
  expect(screen.getByText('Proposition - 02')).toBeInTheDocument();
  expect(screen.getAllByText('Pourquoi ce choix ?')).toHaveLength(2);
  expect(screen.getByText('Ajouté à ta Pensine')).toBeInTheDocument();
});
