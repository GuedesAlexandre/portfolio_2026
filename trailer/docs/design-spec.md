# Trailer de démo — portfolio d'Alexandre (création libre en autonomie)

## Produit & contraintes (étape 0)
- Produit : le portfolio v3 (page noire éditoriale, signature manuscrite, particules « a. », 4 projets avec fonds animés, contact).
- Usage : bande-annonce de démo à partager (réseaux, LinkedIn, candidature). Public : recruteurs / tech leads + communauté créative.
- Format : 1920×1080, 30 fps, ~43 s, français. Aucune donnée sensible : contact en placeholder, aucun film/score inventé (affiches abstraites), données Déserts médicaux = dépôt public d'Alexandre.
- Son : pas de musique imposée → BGM choisie à l'étape 6 dans la bibliothèque (licence Mixkit), SFX Freesound CC0. Pas de calage au beat imposé.

## Direction visuelle (étape 1) — styleframe sautée
Raison : le site existe et fixe déjà toute la charte ; le trailer la réutilise telle quelle.
- Fond #0B0B0C, texte #EDE8DF, éteint #5C5A57, accent #E8322F (+ jaune #F5C518 réservé à MovieRecom, comme dans l'appli).
- Titres Instrument Serif, texte Hanken Grotesk, notes Homemade Apple.
- Tokens de mouvement : profil « précis et calme » (low-mid energy) : entrées 20–26 f, bezier(0.6,0,0.18,1) / ease-out, pas de rebond hors slam ; un seul slam (Azathro).

## Plans → cartes (étape 2)
| Contenu | Carte (variante) |
|---|---|
| Accroche | rhythm/trailer-grammar-moves · trailer-bumper |
| Titre de Kelp | typography/title-demote-to-label |
| Sous-titres / titres secondaires | typography/blur-slide (carte « par défaut ») |
| Score d'Azathro | effects/slam-entrance-moves · score-slam |
| Transition vers les projets | transition/shot-transitions · flash-cut |
| Clôture | outro/grain-dissolve |
Les scènes elles-mêmes sont le vrai code de dessin du site (kelpScene, catalogueScene, geneticScene, field, signature).

## Découpage (étape 3) — 30 fps
| # | frames | plan | mouvement principal |
|---|---|---|---|
| S1 | 0–150 | accroche : 3 coupes 9 f (Kelp / Azathro / carte) → 6 f noir → signature « Alexandre » tracée | trailer-bumper |
| S2 | 150–270 | titre serif + « apprenti ingénieur logiciel » ; les particules se rangent en « a. » | blur-slide + particules |
| S3 | 270–410 | manifeste qui s'éclaire mot à mot + note manuscrite | karaoke du site |
| S4 | 410–600 | Kelp : session rejouée ; « Kelp » plein écran → étiquette | flash-cut d'entrée + title-demote |
| S5 | 600–770 | MovieRecom : le catalogue s'éteint jusqu'au film du soir | blur-slide |
| S6 | 770–950 | Azathro : Cthulhu + main de cartes ; « Full House 40 × 4 » s'écrase | score-slam |
| S7 | 950–1130 | Déserts médicaux : 1 000 générations sur la carte → 1 299 hôpitaux | blur-slide |
| S8 | 1130–1300 | « { Alexandre. dis bonjour } » se désagrège et se condense en « a. » ; hold | grain-dissolve |
Holds : signature encrée ≥ 30 f ; chaque titre de projet reste ≥ 18 f avant de bouger ; « a. » final tenu ≥ 40 f.
