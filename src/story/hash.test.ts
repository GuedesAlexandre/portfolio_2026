import { parseHash } from './hash';

it('reconnaît un chapitre', () => expect(parseHash('#kelp')).toBe('kelp'));
it('ignore la casse', () => expect(parseHash('#KELP')).toBe('kelp'));
it('refuse un chapitre inconnu', () => expect(parseHash('#inconnu')).toBeNull());
it('refuse un hash vide', () => expect(parseHash('')).toBeNull());
