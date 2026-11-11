# Portfolio « Le film de la plongée » — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le portfolio 3D d'Alexandre : une plongée racontée comme un film, du plan d'ouverture (N64) au générique de fin.

**Architecture:** Une seule page Vite + React. Le scroll du document produit une progression 0→1 (GSAP ScrollTrigger) ; un modèle pur (`timeline.ts`) la traduit en chapitre / profondeur / timecode. Une scène React Three Fiber unique contient les 7 décors alignés verticalement ; la caméra suit des images-clés par chapitre. Toute l'interface (bandes, timecode, sous-titres, pellicule, pages de script) est du DOM au-dessus du canvas, donc lisible même sans WebGL.

**Tech Stack:** Vite 6, React 19, TypeScript, three, @react-three/fiber 9, @react-three/drei 10, gsap 3 (+ ScrollTrigger), @fontsource (homemade-apple, courier-prime, jost), Vitest + @testing-library/react + jsdom.

**Spec:** `docs/2026-11-11-portfolio-plongee-design.md` · contrat de direction `.impeccable/surfaces/index-html.md` · storyboard Figma page « Storyboard v2 — Le film » (https://www.figma.com/design/ow5Cyt4fpogOPHc2WR1ci1).

## Global Constraints

- Langue du site : français. Copie des sous-titres, slugs et scripts : exactement celle du storyboard v2 (reprise dans `chapters.ts`, Task 2).
- Typo : Homemade Apple (titres, notes du réalisateur, logo « a. »), Jost (sous-titres, interface), Courier Prime (script, timecode, profondeur). Polices auto-hébergées via @fontsource, aucune requête Google Fonts.
- Chrome UI : encre `#EDE6D6`, bandes `#050505`, sous-titres `#F2C94C`. Aucune autre couleur hors de la 3D.
- Étalonnage 3D : 4 teintes max par profondeur (valeurs de la planche « 00 — Fondations v2 »).
- Cadre desktop 2.39:1 (bandes = 15.5 % de la hauteur chacune) ; < 768 px de large : cadre plein écran vertical, sans bandes, « chapitres » en haut.
- N64 fidèle sans logo ni nom Nintendo/N64 ; marque « a. » sur le capot.
- Aucun chiffre, client ou capture inventé. Placeholders explicites : `[ton.email@exemple.com]`, `[ capture … à fournir ]`. Spring Boot Admin : jamais de capture.
- Aucun emoji/glyphe Unicode comme icône ; flèches en SVG.
- `prefers-reduced-motion` et absence de WebGL : site complet en DOM, sans animation.
- Chaque projet a une URL : `#chambre #surface #sba #kelp #movierecom #azathro #generique`.

## Review Focus

1. Arrivée directe sur `#kelp` (lien partagé) → la page s'ouvre au plan Kelp, pellicule à jour, sans jouer la plongée. Test : Task 4.
2. Navigateur sans WebGL ou téléphone faible → contenu complet lisible (repli DOM). Test : Task 7.
3. Clavier seul → pellicule, cartouches et pages de script atteignables au Tab, Échap ferme le script, focus rendu au lien d'origine. Tests : Tasks 5 et 6.
4. Scroll très rapide ou redimensionnement → chapitre et timecode restent cohérents avec la position (progress borné 0–1). Test : Task 2.
5. Drag d'une alvéole Kelp ou de la console sur tactile → ne bloque pas le scroll (drag désactivé < 768 px). Test : Task 9.

---

### Task 1: Socle du projet

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/test/setup.ts`, `src/App.test.tsx`, `.gitignore`

**Interfaces:**
- Produces: `App` (export par défaut de `src/App.tsx`) ; variables CSS `--ink --bar --sub --font-hand --font-ui --font-script --bar-h` dans `tokens.css`.

- [ ] **Step 1:** `git init`, scaffold Vite React TS dans `/home/aguedes/portfolio`, installer les dépendances du Tech Stack et vitest/jsdom/testing-library.
- [ ] **Step 2: Test** `src/App.test.tsx` — `it('affiche la marque a.')` : `render(<App/>)` puis `expect(screen.getByRole('link',{name:/accueil/i})).toHaveTextContent('a.')`.
- [ ] **Step 3:** `npx vitest run` → FAIL.
- [ ] **Step 4:** `App` minimal avec le lien logo (`aria-label="accueil"`), `tokens.css` avec les valeurs des Global Constraints, `--bar-h: 15.5vh`.
- [ ] **Step 5:** `npx vitest run` → PASS ; `npm run build` → OK.
- [ ] **Step 6:** Commit `chore: socle Vite React R3F`.

### Task 2: Modèle de la timeline

**Files:**
- Create: `src/story/chapters.ts`, `src/story/timeline.ts`, `src/story/timeline.test.ts`

**Interfaces:**
- Produces: `type ChapterId = 'chambre'|'surface'|'sba'|'kelp'|'movierecom'|'azathro'|'generique'` ; `CHAPTERS: Chapter[]` avec `{id, label, depthLabel, depthMeters, timecode, subtitle, slug}` ; `progressToState(p: number): { index: number; id: ChapterId; depthMeters: number; timecode: string }` ; `chapterProgress(id: ChapterId): number` (début du chapitre, 0–1).

Valeurs (storyboard v2) : timecodes `00:00:00:00, 00:00:24:00, 00:01:10:00, 00:02:05:00, 00:03:20:00, 00:04:40:00, 00:06:00:00` ; profondeurs `0, 0, 40, 120, 300, 1000, 1000` (m) ; chapitres répartis à parts égales (7 segments).

- [ ] **Step 1: Tests** :
  - `progressToState(0)` → `{index:0, id:'chambre', depthMeters:0, timecode:'00:00:00:00'}`
  - `progressToState(chapterProgress('kelp')).id === 'kelp'` et `.timecode === '00:02:05:00'`
  - `progressToState(1).id === 'generique'`
  - `progressToState(-0.3)` égale `progressToState(0)` ; `progressToState(1.7)` égale `progressToState(1)` (Review Focus 4)
  - profondeur interpolée : à mi-chemin entre `sba` et `kelp`, `depthMeters === 80`
- [ ] **Step 2:** FAIL. **Step 3:** implémenter (interpolation linéaire de la profondeur et des secondes du timecode à l'intérieur d'un segment). **Step 4:** PASS. **Step 5:** Commit.

### Task 3: Contenu des projets (scripts)

**Files:**
- Create: `src/story/projects.ts`, `src/story/projects.test.ts`

**Interfaces:**
- Produces: `type ScriptBlock = {kind:'heading'|'action'|'character'|'dialogue'|'placeholder'; text:string}` ; `PROJECTS: Record<'sba'|'kelp'|'movierecom'|'azathro', {title:string; credit:string; tags:string[]; script:ScriptBlock[]; next: ChapterId}>`.

Texte : repris de la spec (section Contenu) et de la page de script Kelp du storyboard v2.

- [ ] **Step 1: Tests** : 4 projets ; `PROJECTS.kelp.script[0]` = `{kind:'heading', text:'INT. LE VOID — NUIT'}` ; `PROJECTS.sba.script` ne contient aucun bloc `placeholder` de capture ; chaque `next` mène au chapitre suivant (`azathro.next === 'generique'`).
- [ ] **Step 2–4:** FAIL → implémenter → PASS. **Step 5:** Commit.

### Task 4: Défilement et URL

**Files:**
- Create: `src/story/useStoryScroll.ts`, `src/story/hash.ts`, `src/story/hash.test.ts`

**Interfaces:**
- Consumes: `CHAPTERS`, `chapterProgress` (Task 2).
- Produces: `parseHash(hash: string): ChapterId | null` ; `useStoryScroll(): { progress: number; state: ReturnType<typeof progressToState>; jumpTo(id: ChapterId): void }` — la hauteur du document = `CHAPTERS.length * 160vh` ; `jumpTo` scrolle à `chapterProgress(id)` (instantané si reduced-motion) et met à jour `location.hash` via `history.replaceState`.

- [ ] **Step 1: Tests** : `parseHash('#kelp') === 'kelp'`, `parseHash('#KELP') === 'kelp'`, `parseHash('#inconnu') === null`, `parseHash('') === null`.
- [ ] **Step 2–4:** FAIL → implémenter (au montage, si `parseHash(location.hash)` → `jumpTo` sans animation : Review Focus 1) → PASS. **Step 5:** Commit.

### Task 5: Chrome cinéma (DOM)

**Files:**
- Create: `src/ui/Letterbox.tsx`, `src/ui/Timecode.tsx`, `src/ui/Subtitle.tsx`, `src/ui/FilmRail.tsx`, `src/ui/DirectorNote.tsx`, `src/ui/ArrowIcon.tsx`, `src/ui/ui.css`, `src/ui/FilmRail.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useStoryScroll` (Task 4).
- Produces: `<FilmRail activeId onJump(id)/>` (liste `nav` de 7 boutons, `aria-current="step"` sur l'actif) ; `<Timecode depthMeters timecode/>` (l'affichage de la profondeur suit la valeur avec un ressort : dépassement léger puis stabilisation, via gsap `quickTo` ease `elastic.out(1,0.6)`) ; `<Subtitle text/>` (`aria-live="polite"`) ; `<DirectorNote>` (Homemade Apple, visible au survol du plan).

- [ ] **Step 1: Tests** : 7 boutons, libellés `chambre … générique` ; clic sur « Kelp » appelle `onJump('kelp')` ; `aria-current` sur l'actif ; atteignable au Tab (Review Focus 3).
- [ ] **Step 2–4:** FAIL → implémenter (desktop : pellicule à droite dans le cadre, perforations en CSS ; < 768 px : bouton « chapitres » qui ouvre la même liste) → PASS. **Step 5:** Commit.

### Task 6: Pages de script

**Files:**
- Create: `src/ui/ScriptPage.tsx`, `src/ui/ScriptPage.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS` (Task 3), `jumpTo` (Task 4).
- Produces: `<ScriptPage projectId onClose onCutTo(id)/>` — `<dialog>` modal, format scénario en Courier Prime sur page `#FAFAF7`, bouton « fermer », « COUPE FRANCHE VERS : <projet suivant> ».

- [ ] **Step 1: Tests** : rend `INT. LE VOID — NUIT` pour `kelp` ; Échap appelle `onClose` ; le focus revient au déclencheur ; clic sur la coupe appelle `onCutTo('movierecom')`.
- [ ] **Step 2–4:** FAIL → implémenter → PASS. **Step 5:** Commit.

### Task 7: Repli sans WebGL / mouvement réduit

**Files:**
- Create: `src/story/capabilities.ts`, `src/ui/StaticFilm.tsx`, `src/ui/StaticFilm.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `hasWebGL(): boolean` ; `prefersReducedMotion(): boolean` ; `<StaticFilm/>` = les 7 chapitres en sections DOM empilées (titre, sous-titre, texte, lien script), mêmes ancres `id`.

- [ ] **Step 1: Tests** : avec `hasWebGL` mocké à `false`, `App` rend `StaticFilm` et les 4 titres de projets sont dans le document ; la section `#kelp` existe (Review Focus 2).
- [ ] **Step 2–4:** FAIL → implémenter → PASS. **Step 5:** Commit.

### Task 8: Scène 3D, rendu N64 et caméra

**Files:**
- Create: `src/scene/Stage.tsx`, `src/scene/CameraRig.tsx`, `src/scene/n64.ts`, `src/scene/sets/Room.tsx`, `Surface.tsx`, `Sonar.tsx`, `KelpVoid.tsx`, `Cinema.tsx`, `Abyss.tsx`, `SunkenCity.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `progress` (Task 4), `CHAPTERS`.
- Produces: `<Stage progress/>` ; `n64.ts` : `lowPolyMaterial(color)` (MeshLambert, `flatShading`), `pixelTexture(draw)` (CanvasTexture 64 px, `NearestFilter`) ; `SET_Y: Record<ChapterId, number>` (décors empilés de 0 à −60 unités) ; `CameraRig` interpole position/cible entre `SHOTS: Record<ChapterId,{pos:[n,n,n], look:[n,n,n], fov:number}>` qui reproduisent les cadrages du storyboard : plan large (chambre), horizon bas (surface), vue du dessus (sba), au ras des alvéoles (kelp), subjectif 3e rang (movierecom), très gros plan (azathro), frontal (générique).

Rendu N64 : `dpr` 0.5 avec CSS `image-rendering: pixelated` sur le canvas, `fog` par chapitre (couleur = teinte la plus sombre de l'étalonnage), géométries ≤ 300 triangles par objet. Console N64 fidèle (corps anthracite, bosse et fente, sliders power/reset, 4 ports, LED rouge, « a. » en texture sur le capot), manette 3 branches, 4 cartouches étiquetées (texture canvas Homemade Apple).

- [ ] **Step 1:** Implémenter `Stage` + `CameraRig` + `Room` ; vérifier visuellement au navigateur (desktop 1440×900) que le plan correspond à la scène 01 du storyboard.
- [ ] **Step 2:** Implémenter les 6 autres décors ; vérifier chaque chapitre via `#id` (capture par chapitre).
- [ ] **Step 3:** `npx vitest run` toujours vert ; `npm run build` OK ; budget : < 400 Ko JS gzip hors three.
- [ ] **Step 4:** Commit.

### Task 9: Interactions signature

**Files:**
- Modify: `src/scene/sets/Room.tsx`, `KelpVoid.tsx`, `Abyss.tsx`, `Cinema.tsx`
- Create: `src/scene/useCanDrag.ts`, `src/scene/useCanDrag.test.ts`, `src/ui/Torch.tsx`

**Interfaces:**
- Consumes: `jumpTo` (Task 4), `ScriptPage` (Task 6).
- Produces: `useCanDrag(): boolean` (faux si `(max-width: 767px)` ou `(pointer: coarse)` ou reduced-motion).

Comportements : cartouche survolée → se soulève ; cliquée → son de clap (WebAudio, seulement si son activé) + coupe franche (`jumpTo` sans animation) ; console tournable au drag ; alvéoles Kelp déplaçables, câbles en ressort ; œil d'Azathro qui suit le pointeur ; texte d'Azathro révélé dans le halo du curseur (`Torch`, masque radial CSS) et affiché en entier au clavier/tactile ; clic sur l'écran MovieRecom → négociation scriptée en sous-titres ; liens « lire le script » ouvrent `ScriptPage`.

- [ ] **Step 1: Tests** `useCanDrag` : faux avec `matchMedia('(pointer: coarse)')` vrai ; vrai sur desktop fin (Review Focus 5).
- [ ] **Step 2–4:** FAIL → implémenter → PASS, puis vérification manuelle de chaque interaction au navigateur.
- [ ] **Step 5:** Commit.

### Task 10: Finition et contrôle

**Files:** selon constats.

- [ ] **Step 1:** Captures desktop 1440×900 et 1280×800, mobile 390×844, pour les 7 chapitres + une page de script ; corriger les défauts visibles en un seul lot.
- [ ] **Step 2:** `/home/aguedes/.claude/skills/impeccable/scripts/impeccable detect --json src index.html` → traiter les constats pertinents.
- [ ] **Step 3:** `npx vitest run` + `npm run build` verts.
- [ ] **Step 4:** Commit `feat: portfolio le film de la plongée`.
