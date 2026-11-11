import type { ChapterId } from './chapters';

export type ScriptBlock = {
  kind: 'heading' | 'action' | 'character' | 'dialogue' | 'placeholder';
  text: string;
};

export type ProjectId = 'sba' | 'kelp' | 'movierecom' | 'azathro';

export interface Project {
  title: string;
  credit: string;
  tags: string[];
  script: ScriptBlock[];
  next: ChapterId;
}

export const PROJECTS: Record<ProjectId, Project> = {
  sba: {
    title: 'Spring Boot Admin',
    credit: 'mission d’alternance — BPCE SI, DSI de BPCE Factor',
    tags: ['Spring Boot Admin', 'SSO / OAuth2', 'découverte Kubernetes'],
    script: [
      { kind: 'heading', text: 'INT. POSTE D’OBSERVATION — ENTRE DEUX EAUX' },
      { kind: 'action', text: 'Les applications Spring Boot de la DSI tournent chacune dans leur coin. Personne ne voit l’ensemble.' },
      { kind: 'action', text: 'ALEXANDRE, apprenti ingénieur logiciel, installe une instance Spring Boot Admin : un seul écran pour suivre l’état de toutes les applications.' },
      { kind: 'character', text: 'ALEXANDRE (V.O.)' },
      { kind: 'dialogue', text: 'Mise en place de l’instance, intégration SSO / OAuth2, et découverte native des applications dans Kubernetes.' },
      { kind: 'action', text: 'Projet interne : pas de capture, seulement le récit.' },
    ],
    next: 'kelp',
  },
  kelp: {
    title: 'Kelp',
    credit: 'écrit et développé par Alexandre — projet perso, en cours',
    tags: ['Spring Boot', 'Fabric8', 'docker-java', 'WebSocket', 'DDD'],
    script: [
      { kind: 'heading', text: 'INT. LE VOID — NUIT' },
      { kind: 'action', text: 'Un espace sans fond entre les algues. Des conteneurs flottent, chacun dans une alvéole hexagonale. ALEXANDRE en relie deux d’un câble lumineux.' },
      { kind: 'action', text: 'En coulisses, un cluster Kubernetes, des namespaces et des déploiements apparaissent. Personne n’a écrit une ligne de YAML.' },
      { kind: 'character', text: 'ALEXANDRE (V.O.)' },
      { kind: 'dialogue', text: 'Seul le provisioning d’infrastructure est un domaine métier. Le Void n’est qu’une projection de cet état.' },
      { kind: 'action', text: 'Pilotage réel de Docker ou Podman et d’un cluster local : Spring Boot, client Fabric8, docker-java, WebSocket pour le temps réel. Front portable Linux et Mac.' },
      { kind: 'placeholder', text: '[ capture / vidéo du Void à fournir ]' },
    ],
    next: 'movierecom',
  },
  movierecom: {
    title: 'MovieRecom',
    credit: 'projet E4INFO — ESIEE Paris, en binôme',
    tags: ['Helidon SE', 'jOOQ', 'SQLite', 'Svelte', 'Bits UI', 'Qwen2.5-7B-Instruct'],
    script: [
      { kind: 'heading', text: 'INT. CINÉMA ENGLOUTI — SÉANCE DE MINUIT' },
      { kind: 'action', text: 'Pas de catalogue à faire défiler. Juste une conversation avec un modèle de langage qui tourne en local.' },
      { kind: 'character', text: 'LE SPECTATEUR' },
      { kind: 'dialogue', text: 'Un truc qui fait peur, mais pas trop ?' },
      { kind: 'character', text: 'LE MODÈLE' },
      { kind: 'dialogue', text: 'Un huis clos dans la neige, années 80 ?' },
      { kind: 'action', text: 'llama.cpp intégré en Java via java-llama.cpp, modèle Qwen2.5-7B-Instruct au format GGUF, sur CPU comme sur GPU. Stack imposée par le cours : Helidon SE, jOOQ, SQLite, Svelte, Bits UI — Flyway interdit.' },
      { kind: 'placeholder', text: '[ capture de la conversation à fournir ]' },
    ],
    next: 'azathro',
  },
  azathro: {
    title: 'Azathro',
    credit: 'projet perso — jeu',
    tags: ['Java', 'sealed interfaces', 'records', 'Zen', 'JAR'],
    script: [
      { kind: 'heading', text: 'EXT. ABYSSES — PLUS AUCUNE LUMIÈRE' },
      { kind: 'action', text: 'Des cartes dérivent dans le noir. Quelque chose de très grand ouvre un œil.' },
      { kind: 'action', text: 'Un roguelike de cartes à l’ambiance lovecraftienne, conçu et codé de zéro en Java.' },
      { kind: 'character', text: 'ALEXANDRE (V.O.)' },
      { kind: 'dialogue', text: 'Moteur isolé dans une classe GameEngine, couleurs et rangs en sealed interfaces et records, cycle des cartes, interface avec Zen, assets chargés depuis le JAR.' },
      { kind: 'placeholder', text: '[ captures du jeu à fournir ]' },
    ],
    next: 'generique',
  },
};
