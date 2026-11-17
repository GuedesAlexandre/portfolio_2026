# Portfolio — « le film »

Le portfolio d'Alexandre : une histoire racontée au scroll, des particules en 3D et quatre projets rejoués sur canvas (Kelp, MovieRecom, Azathro, Déserts médicaux). Le dossier `trailer/` contient une bande-annonce Remotion qui réutilise les scènes du site.

Stack : Vite, React 19, React Three Fiber, TypeScript 7, Vitest, oxlint.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | types, build statique dans `dist/`, puis prérendu et fichiers SEO (voir plus bas) |
| `npm run preview` | sert `dist/` en local pour tester le build |
| `npm test` | tests Vitest (jsdom) |
| `npm run lint` | oxlint sur le site, les scripts et la bande-annonce |
| `npm run typecheck` | types du site **et** de la bande-annonce |
| `npm run check` | tout ce qui précède, à lancer avant de pousser |

## Organisation

```
src/
  story/       textes et données (projets, à propos) : c'est ici qu'on modifie le contenu
  sections/    sections de la page (Hero, Manifesto, Projects, Journey, Contact)
  scenes/      scènes canvas des projets ; le dessin (*Scene.ts) et la chronologie (*Timeline.ts)
               sont des fonctions pures, testées, sans React
  particles/   le nuage de particules three.js (chargé à part, uniquement si WebGL est dispo)
  loader/      écran de chargement et signature manuscrite (signature.ts est généré)
  ui/          composants réutilisables (menu, icônes, hooks)
  styles/      tokens.css (couleurs, typo) puis feuilles par zone
public/        assets servis tels quels (données de la carte, sprites Azathro)
scripts/       générateurs ponctuels, leur résultat est versionné
trailer/       bande-annonce Remotion
docs/          specs de design et plans
```

### Scènes partagées avec la bande-annonce

La bande-annonce importe directement `src/scenes/*`, `src/particles/field.ts` et `src/loader/signature.ts` : il n'y en a **qu'une** version. Chaque fonction `draw*` prend une palette en dernier argument, claire par défaut pour le site (`KELP_LIGHT`, `GENETIC_LIGHT`, `CATALOGUE_LIGHT`). La bande-annonce passe ses palettes sombres, définies dans `trailer/src/palettes.ts`. Un correctif sur une scène s'applique donc aux deux. Après une modification, lance `npm run typecheck`, qui vérifie aussi la bande-annonce.

Les assets communs (`trailer/public/azathro`, `trailer/public/genetique`) sont des liens symboliques vers `public/`.

## Bande-annonce

```bash
cd trailer
npm install
npm run studio     # aperçu interactif
npm run render     # out/trailer.mp4 (1920×1080, 30 fps)
npx remotion render src/index.ts Trailer out/trailer-sans-musique.mp4 --props=props-nobgm.json
```

Le montage (début et durée de chaque plan) est défini à un seul endroit, `trailer/src/shots.ts`. Les crédits audio sont dans `trailer/public/audio/sfx/FREESOUND-CREDITS.md`.

## Scripts de génération

Ils sont lancés à la main, et leur résultat est commité.

| Script | Produit | Usage |
| --- | --- | --- |
| `scripts/signature.mjs` | `src/loader/signature.ts` | `node scripts/signature.mjs` |
| `scripts/genetique-data.mjs` | `public/genetique/data.json` | `node scripts/genetique-data.mjs <dépôt Projet_Multidisciplinaire_S2>` |
| `scripts/pix32.mjs` | `public/azathro/pix32.woff2` | copier d'abord `Pix32.ttf` du dépôt Azathro vers `public/azathro/pix32.ttf`, puis `node scripts/pix32.mjs` |

## Déployer

Le site est statique : build `npm run build`, dossier publié `dist/`. Il fonctionne sur Vercel, Netlify, Cloudflare Pages ou GitHub Pages.

**Une seule variable à renseigner chez l'hébergeur : `SITE_URL`** (par ex. `https://mon-domaine.fr`). Sur Netlify et Vercel, le domaine de production est pris automatiquement si elle manque. Sans domaine, le build passe mais avertit : il n'y a alors ni canonical, ni `og:url`, ni sitemap, et l'image d'aperçu reste en relatif.

## SEO

`npm run build` enchaîne `vite build` et [`scripts/prerender.mjs`](scripts/prerender.mjs), qui :

- **prérend la page** dans `dist/index.html`. Le contenu (titres, projets, parcours) est donc présent dans le HTML, lisible par tous les moteurs et par les robots d'aperçu qui n'exécutent pas JavaScript. `main.tsx` hydrate ensuite ce HTML au lieu de tout reconstruire ;
- ajoute les balises qui dépendent du domaine : canonical, `og:url`, `og:image` absolue et **JSON-LD** schema.org (`ProfilePage` → `Person` avec GitHub et LinkedIn en `sameAs`, plus la liste des 4 projets) ;
- écrit `robots.txt` et `sitemap.xml`.

Les textes SEO (titre, description, identité) sont dans [`src/seo/seo.ts`](src/seo/seo.ts) et `IDENTITY` dans [`src/story/about.ts`](src/story/about.ts). Les métadonnées fixes sont dans `index.html`.

**Règle pour garder l'hydratation propre :** le premier rendu d'un composant doit être identique au build. Les valeurs qui n'existent que dans le navigateur (WebGL, `matchMedia`, `sessionStorage`) se lisent dans un `useLayoutEffect`, jamais dans `useState(() => …)`. `src/seo/prerender.test.tsx` échoue si ce n'est pas le cas.

Après la mise en ligne : déclare le site dans Google Search Console et Bing Webmaster Tools, soumets `sitemap.xml`, et vérifie les données structurées avec le test des résultats enrichis de Google.
