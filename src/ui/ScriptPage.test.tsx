import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScriptPage } from './ScriptPage';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };
});

it('affiche le script de Kelp', () => {
  render(<ScriptPage projectId="kelp" onClose={() => {}} onCutTo={() => {}} />);
  expect(screen.getByText('INT. LE VOID — NUIT')).toBeInTheDocument();
});

it('se ferme avec Échap', async () => {
  const onClose = vi.fn();
  render(<ScriptPage projectId="kelp" onClose={onClose} onCutTo={() => {}} />);
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

it('rend le focus au déclencheur', async () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  const { unmount } = render(<ScriptPage projectId="kelp" onClose={() => {}} onCutTo={() => {}} />);
  unmount();
  expect(trigger).toHaveFocus();
});

it('coupe vers le projet suivant', async () => {
  const onCutTo = vi.fn();
  render(<ScriptPage projectId="kelp" onClose={() => {}} onCutTo={onCutTo} />);
  await userEvent.click(screen.getByRole('button', { name: /coupe franche vers/i }));
  expect(onCutTo).toHaveBeenCalledWith('movierecom');
});
