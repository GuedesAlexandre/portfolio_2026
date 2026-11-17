// Génère le README du profil GitHub (dépôt GuedesAlexandre/GuedesAlexandre) : la structure de toujours
// (bannière, nom, badges, Tech Stack, citation), habillée dans la DA du portfolio. Les deux images sont faites
// avec les polices du site, converties en tracés (GitHub n'affiche pas les polices web dans les images).
// Usage : node scripts/github-profile.mjs <dossier du dépôt de profil>
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
// opentype.js est publié en CommonJS : l'export par défaut existe à l'exécution, oxlint ne le voit pas.
// oxlint-disable-next-line import/default
import opentype from 'opentype.js';
import { createServer, loadEnv } from 'vite';

const out = process.argv[2];
if (!out) throw new Error('Usage : node scripts/github-profile.mjs <dossier du dépôt de profil>');

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { CONTACT, FULL_NAME } = await vite.ssrLoadModule('/src/story/about.ts');
const { SIGNATURE } = await vite.ssrLoadModule('/src/loader/signature.ts');
const { resolveSiteUrl } = await vite.ssrLoadModule('/src/seo/seo.ts');
await vite.close();
const SITE = resolveSiteUrl({ ...loadEnv('production', process.cwd(), ''), ...process.env }) ?? 'https://www.alexandreguedes.dev';

// ---------- Contenu du README (celui d'avant, inchangé) ----------
const SUBTITLE = '**Software Engineering Student** | **Full Stack Developer**';
const STACK = {
  Frontend: [['TypeScript', 'typescript'], ['Angular', 'angular'], ['Vue.js', 'vuedotjs'], ['Nuxt.js', 'nuxt'], ['TailwindCSS', 'tailwindcss']],
  Backend: [['Java', 'openjdk'], ['Spring', 'spring'], ['NestJS', 'nestjs']],
  'Database & Tools': [['MySQL', 'mysql'], ['Git', 'git'], ['Figma', 'figma']],
};
const QUOTE = 'Don’t you dare go Hollow';
// ---------- Charte (src/styles/tokens.css) ----------
const C = { bg: '#f3efe7', ink: '#161513', dim: '#716b62', accent: '#cf2a25', unlit: '#d8d2c7', grid: 'rgba(22,21,19,0.06)', edge: 'rgba(22,21,19,0.10)' };
const load = (f) => {
  const b = readFileSync(`node_modules/@fontsource/${f}.woff`);
  // oxlint-disable-next-line import/no-named-as-default-member
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const F = {
  serif: load('instrument-serif/files/instrument-serif-latin-400-normal'),
  italic: load('instrument-serif/files/instrument-serif-latin-400-italic'),
  sans: load('hanken-grotesk/files/hanken-grotesk-latin-400-normal'),
  sansMedium: load('hanken-grotesk/files/hanken-grotesk-latin-500-normal'),
  hand: load('homemade-apple/files/homemade-apple-latin-400-normal'),
};

// ---------- Texte → tracés ----------
const ARROWS = new Set(['→', '↗', '↓']);
const r = (n) => Math.round(n * 100) / 100;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Position de chaque glyphe ; les flèches, absentes des polices, sont dessinées à part. */
function layout(str, font, size, ls = 0) {
  const scale = size / font.unitsPerEm;
  const items = [];
  let x = 0, prev = null;
  for (const ch of str) {
    if (ARROWS.has(ch)) { items.push({ arrow: ch, x }); x += size * 0.7 + ls * size; prev = null; continue; }
    const g = font.charToGlyph(ch);
    // opentype.js renvoie parfois NaN pour une paire inconnue : sans garde, tout le reste du texte disparaît.
    const kern = prev ? font.getKerningValue(prev, g) : 0;
    if (Number.isFinite(kern)) x += kern * scale;
    items.push({ g, x });
    x += g.advanceWidth * scale + ls * size;
    prev = g;
  }
  return { items, width: Math.max(0, x - ls * size) };
}
const measure = (str, font, size, ls) => layout(str, font, size, ls).width;

function arrowPath(kind, x, y, size) {
  const s = size * 0.5, cx = x + size * 0.35, cy = y - size * 0.3;
  if (kind === '→') return `M${r(cx - s / 2)} ${r(cy)}H${r(cx + s / 2)}M${r(cx + s / 6)} ${r(cy - s / 3)}L${r(cx + s / 2)} ${r(cy)}L${r(cx + s / 6)} ${r(cy + s / 3)}`;
  if (kind === '↓') return `M${r(cx)} ${r(cy - s / 2)}V${r(cy + s / 2)}M${r(cx - s / 3)} ${r(cy + s / 6)}L${r(cx)} ${r(cy + s / 2)}L${r(cx + s / 3)} ${r(cy + s / 6)}`;
  return `M${r(cx - s / 2.4)} ${r(cy + s / 2.4)}L${r(cx + s / 2.4)} ${r(cy - s / 2.4)}M${r(cx - s / 6)} ${r(cy - s / 2.4)}H${r(cx + s / 2.4)}V${r(cy + s / 6)}`;
}

/** Tracé SVG d'un glyphe, écrit à la main : le toPathData d'opentype.js produit parfois des « NaN » au formatage. */
function pathData(path) {
  let d = '';
  for (const c of path.commands) {
    if (c.type === 'M' || c.type === 'L') d += `${c.type}${r(c.x)} ${r(c.y)}`;
    else if (c.type === 'Q') d += `Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`;
    else if (c.type === 'C') d += `C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`;
    else if (c.type === 'Z') d += 'Z';
  }
  return d;
}

/** Un texte en tracés. anchor : start | middle | end. */
function text(str, { font, size, x, y, fill = C.ink, anchor = 'start', ls = 0, cls = '', style = '' }) {
  const { items, width } = layout(str, font, size, ls);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let d = '', arrows = '';
  for (const it of items) {
    if (it.arrow) arrows += arrowPath(it.arrow, x0 + it.x, y, size);
    else d += pathData(it.g.getPath(x0 + it.x, y, size));
  }
  const attrs = `${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}`;
  return (d ? `<path${attrs} fill="${fill}" d="${d}"/>` : '')
    + (arrows ? `<path${attrs} fill="none" stroke="${fill}" stroke-width="${r(size * 0.075)}" stroke-linecap="round" stroke-linejoin="round" d="${arrows}"/>` : '');
}

// ---------- Papier ----------
let uid = 0;
function paper(w, h, { margin = 56, gridSize = 36 } = {}) {
  const id = `grid${uid++}`;
  return `<defs><pattern id="${id}" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse"><path d="M${gridSize} 0H0V${gridSize}" fill="none" stroke="${C.grid}" stroke-width="1"/></pattern></defs>
<rect width="${w}" height="${h}" rx="14" fill="${C.bg}"/><rect width="${w}" height="${h}" rx="14" fill="url(#${id})"/>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="13.5" fill="none" stroke="${C.edge}"/>
${margin ? `<path d="M${margin} 0V${h}" stroke="${C.accent}" stroke-opacity="0.75" stroke-width="1.5"/>` : ''}`;
}
const svg = (w, h, title, body, css = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${css ? `<style>${css}</style>` : ''}${body}</svg>\n`;
/** Note manuscrite rouge, légèrement penchée, comme dans les marges du site. */
const note = (str, x, y, size = 22, angle = -4, anchor = 'start') => {
  const w = measure(str, F.hand, size);
  const cx = anchor === 'middle' ? x : anchor === 'end' ? x - w / 2 : x + w / 2;
  return `<g transform="rotate(${angle} ${r(cx)} ${y})">${text(str, { font: F.hand, size, x, y, fill: C.accent, anchor })}</g>`;
};


// ---------- Bannière : la page du carnet, la signature se trace à la plume ----------
function banner() {
  const W = 1000, H = 300;
  const sw = 520, k = sw / SIGNATURE.width, sx = (W - sw) / 2 + 28, sy = (H - SIGNATURE.height * k) / 2 + 6;
  const n = SIGNATURE.glyphs.length;
  const sign = SIGNATURE.glyphs.map((d, i) => `<path pathLength="1" d="${d}" style="animation-delay:${r(0.4 + i * 0.16)}s,${r(0.4 + n * 0.16)}s"/>`).join('');
  const body = paper(W, H)
    + text('a.', { font: F.hand, size: 30, x: 18, y: 56 })
    + `<g class="s" transform="translate(${r(sx)} ${r(sy)}) scale(${r(k * 1000) / 1000})">${sign}</g>`
    + note('software, by hand', W - 40, H - 34, 19, -4, 'end');
  const css = `.s path{fill:${C.ink};fill-opacity:0;stroke:${C.ink};stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:sign .5s cubic-bezier(.45,.05,.35,1) forwards,ink .6s ease forwards}@keyframes sign{to{stroke-dashoffset:0}}@keyframes ink{to{fill-opacity:1;stroke-opacity:0}}@media (prefers-reduced-motion: reduce){.s path{animation:none;stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}`;
  return svg(W, H, `${FULL_NAME}, signature`, body, css);
}

// ---------- Citation : en serif italique, comme une phrase recopiée dans la marge ----------
function quote() {
  const W = 1000, H = 150, size = 40;
  const body = paper(W, H)
    + text(`“${QUOTE}”`, { font: F.italic, size, x: W / 2 + 28, y: 88, anchor: 'middle', ls: -0.01 })
    + note('keep the flame', W / 2 + 28 + measure(`“${QUOTE}”`, F.italic, size, -0.01) / 2 - 10, 124, 16, -4, 'end');
  return svg(W, H, QUOTE, body);
}

// ---------- README ----------
const assets = join(out, 'assets');
mkdirSync(assets, { recursive: true });
for (const f of readdirSync(assets)) rmSync(join(assets, f)); // repart de zéro : pas d'image orpheline
writeFileSync(join(assets, 'banner.svg'), banner());
writeFileSync(join(assets, 'quote.svg'), quote());

/** Badge shields.io : encre sur papier pour la stack, papier sur rouge (l'accent du site) pour le contact. */
const badge = (label, logo, { bg = C.bg.slice(1), fg = C.ink.slice(1) } = {}) =>
  `![${label}](https://img.shields.io/badge/-${encodeURIComponent(label.replace(/-/g, '--'))}-${bg}?style=flat-square&logo=${encodeURIComponent(logo)}&logoColor=${fg})`;
// Le rouge reste lisible sur le fond clair comme sur le fond sombre de GitHub, contrairement à l'encre.
const ink = { bg: C.accent.slice(1), fg: C.bg.slice(1) };
const linkedin = CONTACT.links.find((l) => /linkedin/i.test(l.label));

const readme = `<!-- Généré par scripts/github-profile.mjs depuis le dépôt du portfolio : ne pas modifier à la main. -->
<div align="center">

<a href="${SITE}"><img src="assets/banner.svg" alt="${esc(FULL_NAME)}" width="1000"/></a>

# ${FULL_NAME}

${SUBTITLE}

[${badge('Portfolio', 'googlechrome', ink)}](${SITE})
[${badge('LinkedIn', 'linkedin', ink)}](${linkedin.href})
[${badge('Email', 'gmail', ink)}](mailto:${CONTACT.email})

---

## Tech Stack

${Object.entries(STACK).map(([group, items]) => `**${group}**  \n${items.map(([l, logo]) => badge(l, logo)).join('\n')}`).join('\n\n')}

---

<img src="assets/quote.svg" alt="“${esc(QUOTE)}”" width="1000"/>

</div>
`;
writeFileSync(join(out, 'README.md'), readme);
console.log(`profil généré dans ${out}`);
