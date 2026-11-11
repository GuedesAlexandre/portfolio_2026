# Portfolio d'Alexandre — « La Plongée »

Statut : en attente de validation finale · 2026-11-11

## Intention

Alexandre (apprenti ingénieur logiciel, ESIEE Paris 2025→2028, alternance BPCE SI) veut un portfolio **créatif, en 3D, qui raconte une histoire** au scroll. L'ancien portfolio (pixel art VT323 indigo/crème, mains de Michel-Ange, cerveau en pixels) « manquait de créativité » et n'avait pas de 3D : on garde son contenu, on jette sa DA entièrement.

Le fil rouge d'Alexandre : *prendre un truc complexe (Kubernetes, un LLM, un moteur de jeu) et le rendre simple à manipuler*. Ses projets se répondent : Kelp (algue), le Void, Lovecraft (R'lyeh, cité engloutie). D'où l'histoire : **une plongée**.

## Le récit (scènes, dans l'ordre)

1. **Entrée — la console** (décidé par Alexandre : la console est un *point d'entrée*, pas un fil conducteur)
   Une console 3D inspirée de la N64 (forme, manette trois branches, cartouches) dans une chambre de joueur low-poly. Manipulable (rotation au drag). 4 cartouches = 4 projets, chacune avec sa jaquette. Action : insérer une cartouche ou presser START → la caméra plonge dans l'écran de la télé.
   **La console doit être fidèle à la vraie N64** (décidé par Alexandre) : proportions, couleur gris anthracite, fente cartouche, bouton power/reset, 4 ports manette, manette trois branches avec stick central, cartouches grises à étiquette. Seuls le logo et le nom Nintendo/N64 ne sont pas reproduits (remplacés par la marque d'Alexandre, « a. » ou équivalent).
2. **La surface** — lumière, calme : qui est Alexandre (ingénieur, BPCE, Spring Boot, stack). Le sérieux.
3. **La descente — un niveau par projet**, croisé en coulant :
   - **Spring Boot Admin** (mission d'alternance, près de la surface : le pro)
   - **Kelp** : alvéoles reliées par des câbles flottant dans le Void, forêt d'algues
   - **MovieRecom** : écran de cinéma englouti, LLM qui négocie le film du soir
   - **Azathro** : tout au fond, abysses lovecraftiennes, presque plus de lumière, cartes qui flottent
   Chaque niveau ouvre une fiche projet (contenu ci-dessous).
4. **Le fond — footer / contact** : illustration bicolore façon éditoriale (inspo : footer bleu & crème au cowboy de Pranav, inspora) représentant la cité engloutie, avec liens et contact posés dessus, comme un écran de fin/crédits.

Détails cachés possibles en chemin (mon idée, optionnelle) : clins d'œil mangas, cinéma, muscu, jeux vidéo.

## Direction artistique — v2 « Le film de la plongée » (refonte carte blanche, 2026-11-11)

La plongée est un film : chaque niveau est un plan 3D cadré en cinémascope (2.39:1), raconté en sous-titres, annoté à la main par le réalisateur. Pellicule-chapitres à droite (navigation directe), timecode + profondeur en haut, fiches projet = pages de scénario, footer = générique de fin. Mobile : cadre vertical 9:16. Contrat complet : `.impeccable/surfaces/index-html.md`. Storyboard : page « Storyboard v2 — Le film » du fichier Figma (la v1 est conservée).

### v1 (remplacée)

- **3D : esthétique N64 fidèle** (validé par Alexandre) — low-poly, textures basse résolution un peu baveuses (filtrage nearest/bilinéaire), vertex colors, brouillard de profondeur. Se démarque des portfolios lisses.
- Couleur : la profondeur pilote la palette — surface claire et chaude → bleus → noir abyssal avec bioluminescence (un accent lumineux, cyan ou vert pâle). Footer bicolore.
- Typo v2 : **Homemade Apple** (titres, notes du réalisateur, logo), **Jost** (sous-titres, interface), **Courier Prime** (script, timecode, profondeur). Pas d'emoji ni de glyphe Unicode comme icône : flèches dessinées en SVG.
- Typo v1 (choisie par Alexandre) : **Homemade Apple** (manuscrit, plume) pour les titres, le logo « a. » et les étiquettes de cartouches ; **Space Grotesk** pour le texte ; **JetBrains Mono** pour les métadonnées et la profondeur (« −120 m ») ; **Instrument Serif italique** réservé à la « voix des abysses » sous −1000 m. Les flèches ↗ restent en Space Grotesk (Homemade Apple n'a pas le glyphe).
- Storyboard validé visuellement dans Figma : https://www.figma.com/design/ow5Cyt4fpogOPHc2WR1ci1
- Motion : caméra pilotée par le scroll ; objets manipulables (drag, hover) ; `prefers-reduced-motion` → version statique lisible.

## Contenu (repris de l'ancien portfolio)

- Accroche : apprenti ingénieur logiciel ; fil rouge ci-dessus.
- Hors écran : muscu, jeux vidéo, mangas, cinéma, Lovecraft.
- Stack — Front : React/Angular + TypeScript · Back : Java, Spring Boot · Infra : Podman, Kubernetes.
- Inventaire : ThinkPad sous Fedora · IntelliJ IDEA · en ce moment : Kelp · ingénieur 2028.
- Parcours : 2025→ BPCE SI (DSI BPCE Factor, modernisation Spring Boot, observabilité) · 2025→2028 ESIEE Paris (Informatique, Design, Architecture et Développement).
- Projets :
  - **Kelp** (perso, en cours) — UI pour monter du Kubernetes sans kubectl ni YAML. Le Void : conteneurs en alvéoles reliées par câbles. Spring Boot, Fabric8, docker-java, WebSocket ; pilote Docker/Podman + cluster local ; approche DDD.
  - **MovieRecom** (ESIEE E4INFO, binôme) — « conseil du soir » avec LLM local qui négocie. Helidon SE, jOOQ, SQLite, Svelte, Bits UI ; Qwen2.5-7B-Instruct GGUF via java-llama.cpp ; CPU/GPU.
  - **Azathro** (perso, jeu) — roguelike de cartes lovecraftien en Java ; GameEngine isolé, sealed interfaces + records, UI Zen, packaging JAR.
  - **Spring Boot Admin** (alternance BPCE SI) — instance d'observabilité centralisée ; SSO/OAuth2 ; découverte native Kubernetes.
- Contact : email, GitHub, LinkedIn, CV.pdf — **placeholders** (décidé par Alexandre).
- Visuels projets (captures, liens, vidéos) : **placeholders** ; Spring Boot Admin (interne BPCE) reste en description seule.

## Fabrication

- **Étape 1 — Figma** (dans le compte d'Alexandre) : storyboard de chaque scène (cadrage, typo, couleurs, textes) pour valider l'histoire avant le code. Figma ne fait pas de 3D temps réel : les scènes 3D y sont représentées par des rendus/compositions.
- **Étape 2 — Site** : React + React Three Fiber (Three.js), caméra pilotée au scroll. Toute la 3D est construite par Claude en code (low-poly procédural / géométries simples), pas de modèles fournis par Alexandre.

## Objectifs / non-objectifs / anti-objectifs

- Objectifs : wow créatif + histoire claire ; on comprend qui est Alexandre et ce qu'il a fait ; on peut manipuler la 3D.
- Non-objectifs : CMS, blog, multilingue.
- Anti-objectifs : ressembler à l'ancien (pixel/VT323/indigo) ; un site 3D joli mais où on ne trouve pas les projets ; illisible ou injouable sur mobile ; usage de la marque Nintendo.

## Décisions prises par Claude (à vérifier par Alexandre)

- **Navigation** : scroller depuis la console joue toute la plongée. Choisir une cartouche fait plonger la caméra directement au niveau du projet. On peut passer la console sans interagir (scroll ou lien « plonger »). Chaque projet a son URL (`#kelp`, `#movierecom`…) qui ouvre directement le bon niveau et sa fiche.
- **Fiche projet** : panneau HTML par-dessus la scène 3D (pas une page séparée), lisible et fermable ; la scène 3D du niveau sert d'illustration en l'absence de captures.
- **Figma** : Claude crée le storyboard dans le Figma d'Alexandre ; le code démarre après sa validation du storyboard.
- **Footer** : rendu de la scène 3D de la cité engloutie avec un shader bicolore (effet illustration éditoriale), pas de dessin à la main.

- **Pas de date limite connue** : on construit en une seule fois (pas de version allégée d'abord).

## Laissé au builder

Typos exactes, palette exacte, nombre de mètres par section, détail des transitions, fallback mobile/perf (réduire la 3D sur mobile), hébergement.
