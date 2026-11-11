export type Tone = 'base' | 'mod' | 'accent';
export interface Key { id: string; label: string; sub?: string; row: number; x: number; w: number; tone: Tone; char?: string }

/** Clavier 75 % (comme le modèle d'Alexandre). Largeurs en unités de touche. */
type Spec = [label: string, w?: number, tone?: Tone, char?: string, sub?: string];
const ROWS: Spec[][] = [
  [['ESC', 1, 'accent'], ...Array.from({ length: 12 }, (_, i) => [`F${i + 1}`, 1, 'base'] as Spec), ['PRT', 1, 'mod'], ['INS', 1, 'mod'], ['DEL', 1, 'mod']],
  [['`', 1, 'mod', '`', '~'], ...'1234567890'.split('').map((c) => [c, 1, 'base', c] as Spec), ['-', 1, 'base', '-', '_'], ['=', 1, 'base', '=', '+'], ['BACKSPACE', 2, 'mod'], ['PGUP', 1, 'mod']],
  [['TAB', 1.5, 'mod'], ...'QWERTYUIOP'.split('').map((c) => [c, 1, 'base', c.toLowerCase()] as Spec), ['[', 1, 'base', '['], [']', 1, 'base', ']'], ['\\', 1.5, 'base', '\\'], ['PGDN', 1, 'mod']],
  [['CAPS', 1.75, 'mod'], ...'ASDFGHJKL'.split('').map((c) => [c, 1, 'base', c.toLowerCase()] as Spec), [';', 1, 'base', ';', ':'], ["'", 1, 'base', "'", '"'], ['ENTER', 2.25, 'accent', '\n'], ['HOME', 1, 'mod']],
  [['SHIFT', 2.25, 'mod'], ...'ZXCVBNM'.split('').map((c) => [c, 1, 'base', c.toLowerCase()] as Spec), [',', 1, 'base', ','], ['.', 1, 'base', '.'], ['/', 1, 'base', '/'], ['SHIFT', 1.75, 'mod'], ['↑', 1, 'mod'], ['END', 1, 'mod']],
  [['CTRL', 1.25, 'mod'], ['OPT', 1.25, 'mod'], ['ALT', 1.25, 'mod'], ['', 6.25, 'mod', ' '], ['ALT', 1, 'mod'], ['FN', 1, 'mod'], ['CTRL', 1, 'mod'], ['←', 1, 'mod'], ['↓', 1, 'mod'], ['→', 1, 'mod']],
];

export const ROW_WIDTH = 16;

export const KEYS: Key[] = ROWS.flatMap((row, r) => {
  let x = 0;
  return row.map(([label, w = 1, tone = 'base', char, sub], i) => {
    const k: Key = { id: `${r}-${i}`, label, sub, row: r, x, w, tone, char };
    x += w;
    return k;
  });
});

const BY_CHAR = new Map(KEYS.filter((k) => k.char !== undefined).map((k) => [k.char!, k]));

/** Touche qui tape ce caractère (accents ramenés à la lettre de base). */
export function keyFor(ch: string): Key | undefined {
  const c = ch.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return BY_CHAR.get(c);
}
