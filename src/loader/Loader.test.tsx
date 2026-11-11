import { act, render, screen } from '@testing-library/react';
import { Loader } from './Loader';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('annonce le chargement puis disparaît quand tout est prêt', async () => {
  let ready!: () => void;
  const whenReady = new Promise<void>((r) => { ready = r; });
  const onDone = vi.fn();
  render(<Loader whenReady={whenReady} onDone={onDone} minMs={1000} />);
  expect(screen.getByRole('status')).toHaveTextContent(/chargement/i);
  await act(async () => { ready(); await vi.advanceTimersByTimeAsync(1000); });
  await act(async () => { await vi.advanceTimersByTimeAsync(1200); });
  expect(onDone).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('status')).toBeNull();
});

it('ne bloque jamais la page plus de maxMs', async () => {
  const onDone = vi.fn();
  render(<Loader whenReady={new Promise(() => {})} onDone={onDone} minMs={500} maxMs={3000} />);
  await act(async () => { await vi.advanceTimersByTimeAsync(3000 + 1200); });
  expect(onDone).toHaveBeenCalledTimes(1);
});
