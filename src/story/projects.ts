export type ProjectId = 'kelp' | 'movierecom' | 'azathro' | 'sba';

export interface Project {
  id: ProjectId;
  title: string;
  context: string;
  summary: string;
  details: string[];
  stack: string[];
  note: string;
  /** Faux si aucune capture ne doit jamais être montrée (projet interne). */
  showsCapture: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'kelp',
    title: 'Kelp',
    context: 'Projet perso · en cours',
    summary: 'Monter du Kubernetes sans jamais toucher à kubectl ni au YAML. On crée des conteneurs dans une interface visuelle, on les relie en tirant des câbles, et Kelp monte en coulisses le cluster, les namespaces et les déploiements.',
    details: [
      'Le Void, l’écran central : chaque conteneur est une alvéole ; on choisit l’image et sa configuration, puis on connecte les alvéoles.',
      'Pilotage réel de Docker ou Podman et d’un cluster Kubernetes local.',
      'Client Kubernetes Fabric8 et docker-java côté Spring Boot, mises à jour en temps réel via WebSocket.',
      'Approche DDD : seul le provisioning d’infrastructure est un domaine métier ; le Void n’est qu’une projection de cet état.',
    ],
    stack: ['Spring Boot', 'Fabric8', 'docker-java', 'WebSocket', 'DDD'],
    note: 'zéro ligne de YAML',
    showsCapture: true,
  },
  {
    id: 'movierecom',
    title: 'MovieRecom',
    context: 'ESIEE Paris · en binôme',
    summary: 'Un « conseil du soir » : plutôt qu’un catalogue à faire défiler, on décrit son envie du moment et un LLM local négocie avec toi le film à regarder.',
    details: [
      'llama.cpp intégré en Java via java-llama.cpp, modèle Qwen2.5-7B-Instruct au format GGUF, sur CPU comme sur GPU.',
      'Stack imposée par le cours de Java avancé : Helidon SE, jOOQ, SQLite, Svelte et Bits UI — Flyway interdit.',
    ],
    stack: ['Helidon SE', 'jOOQ', 'SQLite', 'Svelte', 'Qwen2.5-7B'],
    note: 'un LLM, en local',
    showsCapture: true,
  },
  {
    id: 'azathro',
    title: 'Azathro',
    context: 'Projet perso · jeu',
    summary: 'Un jeu de cartes roguelike à l’ambiance lovecraftienne, conçu et codé de zéro en Java.',
    details: [
      'Moteur de jeu isolé dans une classe GameEngine.',
      'Couleurs et rangs modélisés avec des sealed interfaces et des records.',
      'Interface graphique construite avec Zen, packaging en JAR, assets chargés depuis le classpath.',
    ],
    stack: ['Java', 'sealed interfaces', 'records', 'Zen'],
    note: 'sealed interface Suit',
    showsCapture: true,
  },
  {
    id: 'sba',
    title: 'Spring Boot Admin',
    context: 'Alternance · BPCE SI',
    summary: 'Une instance d’observabilité centralisée pour suivre l’état des applications Spring Boot de la DSI de BPCE Factor depuis un seul endroit.',
    details: [
      'Mise en place de l’instance Spring Boot Admin.',
      'Intégration SSO / OAuth2.',
      'Découverte native des applications dans Kubernetes.',
      'Projet interne : description seule, aucune capture.',
    ],
    stack: ['Spring Boot Admin', 'OAuth2', 'Kubernetes'],
    note: '/actuator/health',
    showsCapture: false,
  },
];
