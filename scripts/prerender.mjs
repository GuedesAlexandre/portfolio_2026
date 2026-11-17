// Après `vite build` : écrit le HTML de la page dans dist/index.html (lisible sans JavaScript par les
// moteurs et les aperçus de partage), ajoute les balises qui dépendent du domaine, robots.txt et sitemap.xml.
// Le domaine vient de SITE_URL (ou des variables de Netlify / Vercel), voir src/seo/seo.ts.
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer, loadEnv } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { renderApp, headTags, resolveSiteUrl, robotsTxt, sitemapXml } = await vite.ssrLoadModule('/src/seo/prerender.tsx');
  const site = resolveSiteUrl({ ...loadEnv('production', process.cwd(), ''), ...process.env });

  const file = 'dist/index.html';
  const html = readFileSync(file, 'utf8');
  for (const marker of ['<!--seo-head-->', '<!--app-html-->']) {
    if (!html.includes(marker)) throw new Error(`${marker} introuvable dans ${file}`);
  }
  writeFileSync(file, html.replace('<!--seo-head-->', () => headTags(site)).replace('<!--app-html-->', () => renderApp()));

  writeFileSync('dist/robots.txt', robotsTxt(site));
  if (site) {
    writeFileSync('dist/sitemap.xml', sitemapXml(site, new Date().toISOString().slice(0, 10)));
    console.log(`prerender : ${site}`);
  } else {
    console.warn('\x1b[33mprerender : SITE_URL absent, pas de canonical, og:url ni sitemap. Renseigne-le chez l’hébergeur (ex. SITE_URL=https://mon-domaine.fr).\x1b[0m');
  }
} finally {
  await vite.close();
}
