# Portfolio d'Alexandre — v3 « Le cube »

Statut : validé par Alexandre (« pour moi c'est good »), 2026-11-11. Remplace entièrement la v2 « Le film » (rejetée : « trop moche », rendu pixelisé).

## Intention

Un portfolio qui mélange ses deux références :
- **Overmind** (overmindlab.ai) : fond noir profond, serif élégant, un seul accent (orange), sections projets qui restent fixées pendant le scroll.
- **Money in Check** (moneyincheck.org) : titre géant en serif éditorial, **un objet 3D héros qui traverse les lettres**, annotations manuscrites dans les marges, texte qui s'éclaire mot à mot au scroll.

Page blanche sur l'histoire : plus de N64, plus de plongée, plus de Lovecraft dans la DA. Restent le contenu (projets, parcours, stack) et la 3D.

## L'objet héros : un Rubik's cube

Rendu net et brillant (pleine résolution, antialiasing — **jamais pixelisé**). Mélangé au départ, il **se résout au fil du scroll** : c'est la phrase d'Alexandre « je rends simple ce qui est complexe » rendue visible. Dans la section projets, le cube résolu tourne pour présenter une face par projet.

Faces : palette restreinte (orange d'accent, crème, et des gris), pas les 6 couleurs classiques.

## Structure de la page (une seule page, scroll natif, canvas fixe)

1. **Hero** — « Alexandre » en serif géant, le cube mélangé passe à travers les lettres ; sous-titre « apprenti ingénieur logiciel — je rends simple ce qui est complexe » ; notes manuscrites de dev dans les marges (orange) : `kubectl apply -f`, `@Transactional`, `git push`, `SELECT *`…
2. **Manifeste** — phrase longue qui s'éclaire mot à mot pendant que le cube se résout.
3. **Projets** — 4 sections fixées (Kelp, MovieRecom, Azathro, Spring Boot Admin) : texte à gauche (titre serif, description, stack, lien « lire la suite » qui déplie le détail), cube à droite qui présente une face. Emplacement de capture explicite « [ capture à fournir ] » (rien pour Spring Boot Admin, interne BPCE).
4. **Parcours & stack** — ESIEE Paris (2025 → 2028), BPCE SI (alternance depuis 2025) ; front / back / infra ; inventaire et centres d'intérêt.
5. **Contact** — « dis bonjour » en serif géant, email et liens en placeholders.

## Typo et couleur

- Titres : serif éditorial fin (Instrument Serif). Notes de marge : Homemade Apple (sa plume). Texte : Hanken Grotesk.
- Fond `#0B0B0C`, texte `#EDE8DF`, texte éteint `#5C5A57`, accent orange `#FF6A1F`. Aucune autre couleur.

## Contraintes

- URL par section (`#projets`, `#kelp`…). Version complète sans WebGL / mouvement réduit (cube masqué, tout le texte visible). Mobile : cube au-dessus du texte, sections non fixées.
- Aucun chiffre, client ou capture inventé ; placeholders explicites.
