import { headTags, resolveSiteUrl, robotsTxt, sitemapXml, structuredData } from './seo';

describe('resolveSiteUrl', () => {
  it('prend SITE_URL et retire le slash final', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://exemple.fr/' })).toBe('https://exemple.fr');
  });
  it('se rabat sur Netlify puis Vercel', () => {
    expect(resolveSiteUrl({ URL: 'https://site.netlify.app' })).toBe('https://site.netlify.app');
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'site.vercel.app' })).toBe('https://site.vercel.app');
  });
  it('ignore une valeur qui n’est pas une URL http(s)', () => {
    expect(resolveSiteUrl({ SITE_URL: 'mon-domaine' })).toBeUndefined();
    expect(resolveSiteUrl({ SITE_URL: 'ftp://exemple.fr' })).toBeUndefined();
    expect(resolveSiteUrl({})).toBeUndefined();
  });
});

describe('headTags', () => {
  it('avec un domaine : canonical, og:url et image absolus', () => {
    const h = headTags('https://exemple.fr');
    expect(h).toContain('<link rel="canonical" href="https://exemple.fr/" />');
    expect(h).toContain('<meta property="og:url" content="https://exemple.fr/" />');
    expect(h).toContain('<meta property="og:image" content="https://exemple.fr/og.png" />');
  });
  it('sans domaine : pas de canonical ni d’og:url', () => {
    const h = headTags();
    expect(h).not.toContain('canonical');
    expect(h).not.toContain('og:url');
    expect(h).toContain('content="/og.png"');
  });
  it('embarque un JSON-LD valide, sans séquence qui fermerait la balise', () => {
    const json = headTags('https://exemple.fr').match(/<script type="application\/ld\+json">(.*)<\/script>/)![1];
    expect(json).not.toContain('</');
    expect(JSON.parse(json)['@context']).toBe('https://schema.org');
  });
});

describe('structuredData', () => {
  const graph = structuredData('https://exemple.fr')['@graph'];
  const page = graph.find((n) => n['@type'] === 'ProfilePage') as Record<string, any>;

  it('décrit une page de profil dont le sujet est Alexandre Guedes', () => {
    expect(page.mainEntity.name).toBe('Alexandre Guedes');
    expect(page.mainEntity.sameAs).toEqual(expect.arrayContaining([expect.stringContaining('github.com'), expect.stringContaining('linkedin.com')]));
  });
  it('liste les 4 projets avec une URL directe', () => {
    const items = page.hasPart.itemListElement;
    expect(items).toHaveLength(4);
    expect(items[0].item.url).toBe('https://exemple.fr/#kelp');
  });
  it('n’invente pas d’URL sans domaine', () => {
    const json = JSON.stringify(structuredData());
    expect(json).not.toMatch(/"url"|"@id"/);
    expect(json).not.toContain('{}');
  });
});

it('robots.txt pointe vers le sitemap seulement si le domaine est connu', () => {
  expect(robotsTxt('https://exemple.fr')).toContain('Sitemap: https://exemple.fr/sitemap.xml');
  expect(robotsTxt()).not.toContain('Sitemap');
});

it('sitemap.xml liste la page d’accueil', () => {
  expect(sitemapXml('https://exemple.fr', '2026-11-17')).toContain('<loc>https://exemple.fr/</loc>');
});
