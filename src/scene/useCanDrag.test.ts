import { canDrag } from './useCanDrag';

const mockMedia = (matches: Record<string, boolean>) => {
  window.matchMedia = ((q: string) => ({ matches: !!matches[q], media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
};

it('refuse le drag sur écran tactile', () => {
  mockMedia({ '(pointer: coarse)': true });
  expect(canDrag()).toBe(false);
});
it('refuse le drag sur petit écran', () => {
  mockMedia({ '(max-width: 767px)': true });
  expect(canDrag()).toBe(false);
});
it('autorise le drag à la souris sur desktop', () => {
  mockMedia({});
  expect(canDrag()).toBe(true);
});
