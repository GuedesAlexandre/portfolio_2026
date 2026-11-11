import { KEYS, keyFor, ROW_WIDTH } from './layout';

it('aligne toutes les rangées sur la même largeur (75 %)', () => {
  const rows = new Map<number, number>();
  for (const k of KEYS) rows.set(k.row, Math.max(rows.get(k.row) ?? 0, k.x + k.w));
  for (const w of rows.values()) expect(w).toBeCloseTo(ROW_WIDTH, 5);
});

it('ne fait se chevaucher aucune touche d’une même rangée', () => {
  const byRow = new Map<number, typeof KEYS>();
  KEYS.forEach((k) => byRow.set(k.row, [...(byRow.get(k.row) ?? []), k]));
  for (const row of byRow.values()) {
    const s = [...row].sort((a, b) => a.x - b.x);
    for (let i = 1; i < s.length; i++) expect(s[i].x).toBeGreaterThanOrEqual(s[i - 1].x + s[i - 1].w - 1e-9);
  }
});

it('a une touche Entrée et une touche Échap en accent', () => {
  expect(KEYS.find((k) => k.label === 'ENTER')?.tone).toBe('accent');
  expect(KEYS.find((k) => k.label === 'ESC')?.tone).toBe('accent');
});

it('retrouve la touche d’un caractère', () => {
  expect(keyFor('k')?.label).toBe('K');
  expect(keyFor(' ')?.label).toBe('');
  expect(keyFor('é')?.label).toBe('E');
  expect(keyFor('§')).toBeUndefined();
});
