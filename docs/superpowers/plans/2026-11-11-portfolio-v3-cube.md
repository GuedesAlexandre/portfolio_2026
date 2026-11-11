# Portfolio v3 « Le cube » — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Remplacer la v2 « Le film » par la v3 : page noire éditoriale, Rubik's cube 3D qui se résout au scroll.

**Architecture:** Page HTML normale (sections empilées, scroll natif). Un canvas R3F fixe affiche le cube ; sa progression de résolution et sa pose dépendent de la position de scroll des sections (`useSectionProgress`). La logique du cube (mélange, états, interpolation) est pure et testée (`cube/model.ts`).

**Tech Stack:** existant (Vite 8, React 19, R3F 9, drei 10, three, Vitest) + @fontsource (instrument-serif, hanken-grotesk, homemade-apple).

**Spec:** `docs/2026-11-11-portfolio-v3-design.md`

## Global Constraints
- Couleurs : `#0B0B0C` fond, `#EDE8DF` texte, `#5C5A57` éteint, `#FF6A1F` accent. Rien d'autre.
- Rendu 3D net : dpr = devicePixelRatio (max 2), antialias activé, aucune `image-rendering: pixelated`.
- Copie et contenus repris de `src/story/projects.ts` et `src/story/about.ts`.
- Repli complet sans WebGL / mouvement réduit.

## Review Focus
1. Sans WebGL : tout le texte présent, aucune zone vide réservée au cube.
2. `#kelp` en arrivée directe : la page s'ouvre sur la section Kelp.
3. Scroll très rapide : l'état du cube reste borné (0..N coups), jamais d'état intermédiaire figé.
4. Mobile : pas de section fixée qui piège le scroll.
5. Clavier : « lire la suite » déplie/replie au clavier, avec `aria-expanded`.

### Task 1: Modèle du cube (pur)
**Files:** Create `src/cube/model.ts`, `src/cube/model.test.ts`
**Produces:** `type Move = { axis: 'x'|'y'|'z'; layer: -1|0|1; dir: 1|-1 }` ; `scramble(seed: number, n: number): Move[]` (déterministe, jamais deux coups consécutifs sur le même axe+couche) ; `solveSequence(moves): Move[]` (inverse, ordre renversé) ; `cubieStates(moves): THREE.Matrix4[][]` (n+1 états de 27 cubies) ; `poseAt(states, moves, t: number)` → `{ k: number; frac: number }` avec `t` borné à [0,1].
- [ ] Tests : `scramble(7, 20)` déterministe et de longueur 20 ; `solveSequence` appliqué après le mélange ramène chaque cubie à sa matrice d'origine (tolérance 1e-6) ; `poseAt(…, -1)` = `{k:0, frac:0}`, `poseAt(…, 2)` = `{k:n, frac:0}`.
- [ ] FAIL → implémenter → PASS → commit.

### Task 2: Progression des sections
**Files:** Create `src/story/useSectionProgress.ts`, `src/story/sectionMath.ts`, `src/story/sectionMath.test.ts`
**Produces:** `sectionProgress(rect: {top:number;height:number}, viewport: number): number` (0 quand la section entre par le bas, 1 quand elle sort par le haut, borné) ; hook `useSectionProgress(ref)`.
- [ ] Tests valeurs : top=viewport → 0 ; top=-height → 1 ; milieu → 0.5 ; bornes.
- [ ] FAIL → implémenter → PASS → commit.

### Task 3: Page éditoriale (DOM)
**Files:** Replace `src/App.tsx` ; Create `src/sections/Hero.tsx`, `Manifesto.tsx`, `Projects.tsx`, `Journey.tsx`, `Contact.tsx`, `src/styles/v3.css` ; Delete v2 film UI (`src/ui/*` sauf `ArrowIcon`), `src/scene/*`, `src/story/{chapters,timeline,hash,useStoryScroll}.ts` et leurs tests.
- [ ] Tests (`src/App.test.tsx`) : titre « Alexandre » ; 4 titres de projets ; bouton « lire la suite » de Kelp a `aria-expanded="false"` puis `true` au clic et révèle `INT. LE VOID — NUIT` ; section `#kelp` existe ; lien contact présent.
- [ ] FAIL → implémenter → PASS → commit.

### Task 4: Cube 3D
**Files:** Create `src/cube/Cube.tsx`, `src/cube/CubeStage.tsx` ; Modify `src/App.tsx`
- Cubies : `RoundedBox` (drei) noir laqué, stickers = plans arrondis légèrement émissifs ; MeshPhysicalMaterial (clearcoat) + `Environment preset="studio"` ; lumière clé orange en contre-jour.
- Hero : cube mélangé, rotation lente ; Manifeste : t = progression de la section → résolution ; Projets : cube résolu, quart de tour par projet ; ensuite le cube s'éloigne.
- [ ] Vérif visuelle headless 1440×900 et 390×844 (net, pas de pixels), tests verts, build.
- [ ] Commit.

### Task 5: Finition
- [ ] Captures, `impeccable detect`, tests + build, commit.
