// Réduit la police Pix32 du projet Azathro (copier d'abord Pix32.ttf depuis le dépôt Azathro vers public/azathro/pix32.ttf)
// aux seuls caractères affichés dans la scène.
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
const src = readFileSync('public/azathro/pix32.ttf');
const out = await subsetFont(src, 'Full House 0123456789×x+=', { targetFormat: 'woff2' });
writeFileSync('public/azathro/pix32.woff2', out);
unlinkSync('public/azathro/pix32.ttf');
console.log(out.length);
