// Génère le tracé SVG de « Alexandre » en Homemade Apple (exécuté une fois, résultat versionné).
// opentype.js est publié en CommonJS : l'export par défaut existe à l'exécution, oxlint ne le voit pas.
// oxlint-disable-next-line import/default
import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';
const buf = readFileSync('node_modules/@fontsource/homemade-apple/files/homemade-apple-latin-400-normal.woff');
// oxlint-disable-next-line import/no-named-as-default-member
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const path = font.getPath('Alexandre', 0, 0, 200);
const b = path.getBoundingBox();
const pad = 20;
const glyphs = font.getPaths('Alexandre', -b.x1 + pad, -b.y1 + pad, 200).map((p) => p.toPathData(1)).filter(Boolean);
const w = Math.ceil(b.x2 - b.x1 + pad * 2), h = Math.ceil(b.y2 - b.y1 + pad * 2);
writeFileSync('src/loader/signature.ts', `// Généré par scripts/signature.mjs — tracé de « Alexandre » en Homemade Apple.\nexport const SIGNATURE = { width: ${w}, height: ${h}, glyphs: ${JSON.stringify(glyphs)} };\n`);
console.log(w, h, glyphs.length);
