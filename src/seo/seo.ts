import { CONTACT, FULL_NAME, IDENTITY, TAGLINE } from '../story/about';
import { PROJECTS } from '../story/projects';

/**
 * Tout ce qui dépend du domaine final : balises absolues, données structurées, robots.txt, sitemap.
 * Utilisé au build par scripts/prerender.mjs ; sans domaine, on n'émet que ce qui reste valide en relatif.
 */

export const TITLE = `${FULL_NAME} — ingénieur logiciel`;
export const DESCRIPTION = `Portfolio d'${FULL_NAME}, ingénieur logiciel en alternance (BPCE SI, ESIEE Paris) : Kubernetes sans YAML, un LLM en local, un algorithme génétique sur la carte de France.`;
export const SHARE_DESCRIPTION = TAGLINE;
export const OG_IMAGE = { path: '/og.png', width: 1200, height: 630, alt: `${FULL_NAME}, ingénieur logiciel — portfolio` };

type Env = Record<string, string | undefined>;

/**
 * Le domaine du site, sans slash final. Ordre : SITE_URL (à renseigner), puis ce que fournissent
 * Netlify (URL) et Vercel (VERCEL_PROJECT_PRODUCTION_URL). Rien de valide : undefined.
 */
export function resolveSiteUrl(env: Env): string | undefined {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  for (const raw of [env.SITE_URL, env.URL, vercel]) {
    if (!raw) continue;
    try {
      const u = new URL(raw.trim());
      if (u.protocol === 'https:' || u.protocol === 'http:') return `${u.origin}${u.pathname.replace(/\/+$/, '')}`;
    } catch { /* valeur suivante */ }
  }
  return undefined;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const meta = (attr: 'name' | 'property', key: string, content: string) => `<meta ${attr}="${key}" content="${esc(content)}" />`;

/** Graphe schema.org : la page de profil, la personne et ses projets. */
export function structuredData(site?: string) {
  const at = (path: string) => (site ? `${site}${path}` : undefined);
  /** Référence vers un nœud du graphe ; sans domaine, pas d'@id, donc pas de référence. */
  const ref = (path: string) => (site ? { '@id': at(path) } : undefined);
  const person = {
    '@type': 'Person',
    '@id': at('/#person'),
    name: FULL_NAME,
    givenName: IDENTITY.givenName,
    familyName: IDENTITY.familyName,
    jobTitle: IDENTITY.jobTitle,
    description: TAGLINE,
    url: at('/'),
    image: at(OG_IMAGE.path),
    sameAs: CONTACT.links.map((l) => l.href),
    worksFor: { '@type': 'Organization', name: IDENTITY.employer },
    alumniOf: { '@type': 'CollegeOrUniversity', name: IDENTITY.school },
    knowsAbout: IDENTITY.knowsAbout,
    knowsLanguage: 'fr',
  };
  const projects = PROJECTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      // Avec un dépôt public, c'est du code source : schema.org a un type et un champ pour ça.
      '@type': p.repo ? 'SoftwareSourceCode' : 'CreativeWork',
      codeRepository: p.repo,
      name: p.title,
      description: p.summary,
      url: at(`/#${p.id}`),
      keywords: p.stack.join(', '),
      creator: ref('/#person'),
    },
  }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': at('/#website'), url: at('/'), name: FULL_NAME, inLanguage: 'fr-FR' },
      {
        '@type': 'ProfilePage',
        '@id': at('/#page'),
        url: at('/'),
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'fr-FR',
        isPartOf: ref('/#website'),
        mainEntity: person,
        hasPart: { '@type': 'ItemList', name: 'Projets', itemListElement: projects },
      },
    ],
  };
}

/** JSON sûr dans une balise <script> : on neutralise toute séquence qui fermerait la balise. */
const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Balises à insérer dans <head> au build. */
export function headTags(site?: string): string {
  const image = site ? `${site}${OG_IMAGE.path}` : OG_IMAGE.path;
  const tags = [
    ...(site ? [`<link rel="canonical" href="${esc(site)}/" />`, meta('property', 'og:url', `${site}/`)] : []),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:image:alt', OG_IMAGE.alt),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', OG_IMAGE.alt),
    `<script type="application/ld+json">${jsonForScript(structuredData(site))}</script>`,
  ];
  return tags.join('\n    ');
}

export function robotsTxt(site?: string): string {
  return `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`;
}

export function sitemapXml(site: string, lastmod: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${esc(site)}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;
}
