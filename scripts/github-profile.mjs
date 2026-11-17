// Génère le README du profil GitHub (dépôt GuedesAlexandre/GuedesAlexandre), en anglais, dans la DA du portfolio :
// papier quadrillé, marge rouge, Instrument Serif, Hanken Grotesk, notes manuscrites, signature.
// La structure (projets, dépôts, liens, contact) vient des données du site (src/story/*) ; les textes sont
// traduits ci-dessous (EN) et le script s'arrête si un projet n'a pas sa traduction. Le texte est converti en tracés SVG
// (GitHub n'affiche pas les polices web dans les images).
// Usage : node scripts/github-profile.mjs <dossier du dépôt de profil>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
// opentype.js est publié en CommonJS : l'export par défaut existe à l'exécution, oxlint ne le voit pas.
// oxlint-disable-next-line import/default
import opentype from 'opentype.js';
import { createServer, loadEnv } from 'vite';

const out = process.argv[2];
if (!out) throw new Error('Usage : node scripts/github-profile.mjs <dossier du dépôt de profil>');

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const about = await vite.ssrLoadModule('/src/story/about.ts');
const { PROJECTS } = await vite.ssrLoadModule('/src/story/projects.ts');
const { SIGNATURE } = await vite.ssrLoadModule('/src/loader/signature.ts');
const { resolveSiteUrl } = await vite.ssrLoadModule('/src/seo/seo.ts');
await vite.close();
// ---------- Textes en anglais (le site reste en français) ----------
const EN = {
  role: 'Software engineering apprentice · BPCE SI & ESIEE Paris',
  tagline: 'Apprentice software engineer. I build tools that make technology a pleasure to pick up.',
  manifesto: 'I care about building things that will still be useful tomorrow. Not to shine for the length of a demo: for the people who will actually use them.',
  projects: {
    kelp: {
      context: 'Personal project · in progress',
      summary: 'Run Kubernetes without ever touching kubectl or YAML. You create containers in a visual interface, wire them together by pulling cables, and Kelp sets up the cluster, namespaces and deployments behind the scenes.',
      note: 'zero lines of YAML',
    },
    movierecom: {
      context: 'ESIEE Paris · pair project',
      summary: 'An “evening advisor”: instead of scrolling through a catalogue, you describe what you feel like and a local LLM negotiates with you on the film to watch.',
      note: 'an LLM, running locally',
    },
    azathro: {
      context: 'Personal project · game',
      summary: 'A lite version of Balatro, the roguelike card game, rebuilt from scratch in Java with a Lovecraftian atmosphere.',
      note: 'home-made engine',
    },
    deserts: {
      title: 'Medical deserts',
      context: 'ESIEE Paris · multidisciplinary project · team',
      summary: 'Where should France build its hospitals? A genetic algorithm written in C picks, among the 34,437 communes of mainland France, where to put hospitals so that everyone has one within 10 km, at the lowest cost.',
      note: '1,299 hospitals placed',
    },
  },
  journey: [
    { what: 'Software engineering apprentice at BPCE Solutions Informatiques, IT department of BPCE Factor', how: 'Modernising Spring Boot applications and observability.' },
    { what: 'Engineering degree at ESIEE Paris', how: 'Computer Science, Design, Architecture and Development track.' },
  ],
  inventory: { Machine: 'ThinkPad running Omarchy', IDE: 'IntelliJ IDEA', 'En ce moment': ['Right now', 'Kelp'], 'Hors écran': ['Off screen', 'lifting, video games, manga, cinema, Lovecraft'] },
  ui: {
    below: (n) => `${n} projects below ↓`, code: 'view the code ↗', site: 'on the portfolio ↗', journey: 'Journey', engineer: 'engineer, 2028',
    stack: 'The stack', rest: 'The rest', hello: 'say hello', kept: 'notebook kept in 2026',
  },
};

/** Données du site + textes anglais. Un projet, une étape ou une ligne sans traduction arrête le script. */
function localize() {
  const missing = (what) => { throw new Error(`Traduction anglaise manquante pour ${what} (scripts/github-profile.mjs, EN)`); };
  const projects = PROJECTS.map((p) => {
    const t = EN.projects[p.id] ?? missing(`le projet « ${p.id} »`);
    return { ...p, title: t.title ?? p.title, context: t.context, summary: t.summary, note: p.note && (t.note ?? missing(`la note de « ${p.id} »`)) };
  });
  if (about.JOURNEY.length !== EN.journey.length) missing('le parcours (nombre d’étapes différent)');
  const steps = about.JOURNEY.map((j, i) => ({ when: j.when, ...EN.journey[i] }));
  const inventory = about.INVENTORY.map(([k, v]) => {
    const t = EN.inventory[k] ?? missing(`« ${k} » dans Le reste`);
    // Une chaîne : la valeur traduite ; un couple : [libellé traduit, valeur traduite].
    return typeof t === 'string' ? [k, t] : [t[0], t[1] ?? v];
  });
  return { ...EN, projects, journey: steps, inventory, stack: about.STACK };
}
const T = localize();

const SITE = resolveSiteUrl({ ...loadEnv('production', process.cwd(), ''), ...process.env }) ?? 'https://www.alexandreguedes.dev';

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

/** Découpe en lignes (l'espace insécable ne coupe pas). */
function wrap(str, font, size, max, ls) {
  const lines = [];
  let line = '';
  for (const w of str.split(' ')) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure(next, font, size, ls) > max) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
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
const caps = (str, o) => text(str.toUpperCase(), { font: F.sansMedium, ls: 0.14, fill: C.dim, ...o });
const REDUCED = '@media (prefers-reduced-motion: reduce){*{animation:none!important}}';

// ---------- En-tête ----------
function header() {
  const W = 1000, H = 440;
  const tagline = wrap(T.tagline, F.italic, 26, 600);
  const body = paper(W, H)
    + text('a.', { font: F.hand, size: 30, x: 18, y: 56 })
    + caps(T.role, { size: 13, x: W / 2 + 28, y: 116, anchor: 'middle' })
    + text(about.IDENTITY.givenName, { font: F.serif, size: 168, x: W / 2 + 28, y: 268, anchor: 'middle', ls: -0.03, cls: 'rise' })
    + tagline.map((l, i) => text(l, { font: F.italic, size: 26, x: W / 2 + 28, y: 330 + i * 34, anchor: 'middle' })).join('')
    + note(T.ui.below(T.projects.length), 92, 404, 20, -3);
  const css = '.rise{animation:rise 1s cubic-bezier(.16,1,.3,1) both}@keyframes rise{from{opacity:0;transform:translateY(14px)}}' + REDUCED;
  return svg(W, H, `${about.FULL_NAME}. ${T.role}. ${T.tagline}`, body, css);
}

// ---------- Manifeste : les mots s'allument un à un, comme au scroll sur le site ----------
function manifesto() {
  const W = 1000, size = 46, lh = 52, maxW = 780;
  const lines = wrap(T.manifesto, F.serif, size, maxW, -0.01);
  const H = 120 + lines.length * lh;
  let i = 0, body = paper(W, H, { margin: 0 });
  lines.forEach((line, li) => {
    const y = 78 + li * lh + size * 0.72;
    let x = W / 2 - measure(line, F.serif, size, -0.01) / 2;
    for (const word of line.split(' ')) {
      body += text(word, { font: F.serif, size, x, y, fill: C.unlit, ls: -0.01, cls: 'w', style: `animation-delay:${r(0.5 + i++ * 0.11)}s` });
      x += measure(`${word} `, F.serif, size, -0.01);
    }
  });
  const css = `.w{animation:lit .5s ease forwards}@keyframes lit{to{fill:${C.ink}}}@media (prefers-reduced-motion: reduce){.w{animation:none;fill:${C.ink}}}`;
  return svg(W, H, T.manifesto, body, css);
}

// ---------- Projets : une planche par projet ----------
const projectLink = (p) => p.repo ?? `${SITE}/#${p.id}`;
function projectCards() {
  const W = 480, M = 34, X = M + 24, maxW = W - X - 28;
  const parts = T.projects.map((p, idx) => {
    const summary = wrap(p.summary, F.sans, 15, maxW);
    const stack = wrap(p.stack.join('  ·  '), F.sans, 13, maxW);
    return { p, idx, summary, stack, h: 132 + summary.length * 22 + 18 + stack.length * 19 + 64 };
  });
  const H = Math.max(...parts.map((x) => x.h));
  return parts.map(({ p, idx, summary, stack }) => {
    let y = 54;
    let body = paper(W, H, { margin: M, gridSize: 32 });
    body += caps(`${String(idx + 1).padStart(2, '0')} / ${String(T.projects.length).padStart(2, '0')}   ${p.context}`, { size: 10.5, x: X, y, ls: 0.12 });
    y += 58;
    body += text(p.title, { font: F.serif, size: 50, x: X, y, ls: -0.01 });
    y += 34;
    body += summary.map((l, i) => text(l, { font: F.sans, size: 15, x: X, y: y + i * 22 })).join('');
    y += summary.length * 22 + 14;
    body += stack.map((l, i) => text(l, { font: F.sans, size: 13, x: X, y: y + i * 19, fill: C.dim })).join('');
    const label = p.repo ? T.ui.code : T.ui.site;
    const ly = H - 34, lw = measure(label, F.sansMedium, 15);
    body += text(label, { font: F.sansMedium, size: 15, x: X, y: ly });
    body += `<path d="M${X} ${ly + 7}H${r(X + lw)}" stroke="${C.accent}" stroke-width="1.5"/>`;
    if (p.note) body += note(p.note, W - 28, ly - 2, 16, -4, 'end');
    const alt = `${p.title} — ${p.context}. ${p.summary} Stack: ${p.stack.join(', ')}.`;
    return { file: `projet-${p.id}.svg`, href: projectLink(p), alt, content: svg(W, H, alt, body) };
  });
}

// ---------- Parcours + fiches ----------
function journey() {
  const W = 1000, M = 56;
  let y = 92;
  let body = text(T.ui.journey, { font: F.italic, size: 54, x: W / 2 + M / 2, y: 92, anchor: 'middle', ls: -0.01 });
  y += 70;
  const lineX = 340, top = y - 28;
  const rows = T.journey.map((j, i) => {
    const what = wrap(j.what, F.sansMedium, 16, 520);
    const how = wrap(j.how, F.sans, 15, 520);
    const rowY = y;
    y += Math.max(40, (what.length + how.length) * 23) + 34;
    return text(j.when, { font: F.italic, size: 32, x: lineX - 34, y: rowY + 4, anchor: 'end' })
      + `<circle cx="${lineX}" cy="${rowY - 7}" r="6" fill="${i === 0 ? C.accent : C.bg}" stroke="${i === 0 ? C.accent : C.ink}" stroke-width="1.5"/>`
      + what.map((l, k) => text(l, { font: F.sansMedium, size: 16, x: lineX + 30, y: rowY + k * 23 })).join('')
      + how.map((l, k) => text(l, { font: F.sans, size: 15, x: lineX + 30, y: rowY + (what.length + k) * 23, fill: C.dim })).join('');
  });
  body += `<path d="M${lineX} ${top}V${y - 40}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="1.5"/>` + rows.join('');
  body += note(T.ui.engineer, W / 2 + 150, 74, 19, -6);

  // Les deux fiches à points de conduite.
  y += 16;
  const sheet = (title, entries, x0, w) => {
    let sy = y;
    let s = text(title, { font: F.italic, size: 30, x: x0, y: sy });
    sy += 40;
    for (const [k, v] of entries) {
      const kw = measure(k, F.sans, 14);
      const vals = wrap(v, F.sans, 15.5, w - kw - 60);
      const vw = measure(vals[0], F.sans, 15.5);
      s += text(k, { font: F.sans, size: 14, x: x0, y: sy, fill: C.dim });
      vals.forEach((l, i) => { s += text(l, { font: F.sans, size: 15.5, x: x0 + w, y: sy + i * 22, anchor: 'end' }); });
      s += `<path d="M${r(x0 + kw + 10)} ${sy - 3}H${r(x0 + w - vw - 10)}" stroke="${C.ink}" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="1.5 4" stroke-linecap="round"/>`;
      sy += 32 + (vals.length - 1) * 22;
    }
    return { s, end: sy };
  };
  const a = sheet(T.ui.stack, T.stack.map((s) => [s.part, s.value]), 100, 360);
  const b = sheet(T.ui.rest, T.inventory, 540, 380);
  body += a.s + b.s;
  const H = Math.max(a.end, b.end) + 30;
  const alt = `Journey: ${T.journey.map((j) => `${j.when} ${j.what} (${j.how})`).join('; ')}. The stack: ${T.stack.map((s) => `${s.part} ${s.value}`).join(', ')}. The rest: ${T.inventory.map(([k, v]) => `${k} ${v}`).join(', ')}.`;
  return svg(W, H, alt, paper(W, H, { margin: M }) + body);
}

// ---------- Contact : « dis bonjour » et la signature qui se trace ----------
function contact() {
  const W = 1000, H = 340;
  const sw = 300, k = sw / SIGNATURE.width, sx = (W - sw) / 2, sy = 150;
  const n = SIGNATURE.glyphs.length;
  const sign = SIGNATURE.glyphs.map((d, i) => `<path pathLength="1" d="${d}" style="animation-delay:${r(0.4 + i * 0.16)}s,${r(0.4 + n * 0.16)}s"/>`).join('');
  const body = paper(W, H, { margin: 0 })
    + text(T.ui.hello, { font: F.italic, size: 96, x: W / 2, y: 128, anchor: 'middle', ls: -0.02 })
    + `<g class="s" transform="translate(${r(sx)} ${sy}) scale(${r(k * 1000) / 1000})">${sign}</g>`
    + text(T.ui.kept, { font: F.sans, size: 13, x: W / 2, y: H - 34, anchor: 'middle', fill: C.dim });
  const css = `.s path{fill:${C.ink};fill-opacity:0;stroke:${C.ink};stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:sign .5s cubic-bezier(.45,.05,.35,1) forwards,ink .6s ease forwards}@keyframes sign{to{stroke-dashoffset:0}}@keyframes ink{to{fill-opacity:1;stroke-opacity:0}}@media (prefers-reduced-motion: reduce){.s path{animation:none;stroke-dashoffset:0;fill-opacity:1;stroke-opacity:0}}`;
  return svg(W, H, 'Say hello. Signature: Alexandre.', body, css);
}

// ---------- README ----------
const assets = join(out, 'assets');
mkdirSync(assets, { recursive: true });
const write = (name, content) => writeFileSync(join(assets, name), content);
write('entete.svg', header());
write('manifeste.svg', manifesto());
write('parcours.svg', journey());
write('contact.svg', contact());
const cards = projectCards();
for (const c of cards) write(c.file, c.content);

const linkedin = about.CONTACT.links.find((l) => /linkedin/i.test(l.label));
const contactLinks = [
  `<a href="${SITE}"><b>${new URL(SITE).host.replace(/^www\./, '')}</b></a>`,
  linkedin && `<a href="${linkedin.href}">LinkedIn</a>`,
  `<a href="mailto:${about.CONTACT.email}">${about.CONTACT.email}</a>`,
].filter(Boolean).join('&nbsp;&nbsp;·&nbsp;&nbsp;');
const pairs = [];
for (let i = 0; i < cards.length; i += 2) {
  pairs.push(cards.slice(i, i + 2).map((c) => `<a href="${c.href}"><img src="assets/${c.file}" width="49%" alt="${esc(c.alt)}"></a>`).join('\n'));
}

const readme = `<!-- Généré par scripts/github-profile.mjs depuis le dépôt du portfolio : ne pas modifier à la main. -->
<div align="center">

<a href="${SITE}"><img src="assets/entete.svg" width="100%" alt="${esc(`${about.FULL_NAME}. ${T.role}. ${T.tagline}`)}"></a>

${contactLinks}

<br>

<img src="assets/manifeste.svg" width="100%" alt="${esc(T.manifesto)}">

${pairs.join('\n\n')}

<img src="assets/parcours.svg" width="100%" alt="Journey, stack and the rest">

<a href="${SITE}/#contact"><img src="assets/contact.svg" width="100%" alt="Say hello"></a>

${contactLinks}

</div>
`;
writeFileSync(join(out, 'README.md'), readme);
console.log(`profil généré dans ${out} (${cards.length + 4} images)`);
