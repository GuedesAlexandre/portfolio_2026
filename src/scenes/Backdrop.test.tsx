import { render } from '@testing-library/react';
import { Backdrop } from './Backdrop';

it('ne monte aucune scène 3D tant que le projet est loin de l’écran', () => {
  const observe = vi.fn();
  globalThis.IntersectionObserver = class { observe = observe; disconnect() {} } as unknown as typeof IntersectionObserver;
  const { container } = render(<Backdrop id="kelp" enabled />);
  expect(observe).toHaveBeenCalled();
  expect(container.querySelector('canvas')).toBeNull();
});

it('reste un simple fond quand la 3D est désactivée', () => {
  const { container } = render(<Backdrop id="kelp" enabled={false} />);
  expect(container.querySelector('.backdrop')).not.toBeNull();
  expect(container.querySelector('canvas')).toBeNull();
});
