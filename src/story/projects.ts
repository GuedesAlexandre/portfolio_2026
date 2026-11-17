export type ProjectId = 'kelp' | 'movierecom' | 'azathro' | 'deserts';

export interface Project {
  id: ProjectId;
  title: string;
  context: string;
  summary: string;
  details: string[];
  stack: string[];
  note?: string;
  /** Dépôt public du code, affiché en lien « voir le code ». */
  repo?: string;
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
  },
  {
    id: 'movierecom',
    title: 'MovieRecom',
    context: 'ESIEE Paris · en binôme',
    summary: 'Un « conseil du soir » : plutôt qu’un catalogue à faire défiler, on décrit son envie du moment et un LLM local négocie avec toi le film à regarder.',
    details: [
      'llama.cpp intégré en Java via java-llama.cpp, modèle Qwen2.5-7B-Instruct au format GGUF, sur CPU comme sur GPU.',
      'Stack imposée par le cours de Java avancé : Helidon SE, jOOQ, SQLite, Svelte et Bits UI. Flyway interdit.',
    ],
    stack: ['Helidon SE', 'jOOQ', 'SQLite', 'Svelte', 'Qwen2.5-7B'],
    note: 'un LLM, en local',
  },
  {
    id: 'azathro',
    title: 'Azathro',
    context: 'Projet perso · jeu',
    summary: 'Une version lite de Balatro, le jeu de cartes roguelike, recodée de zéro en Java avec une ambiance lovecraftienne.',
    details: [
      'Moteur de jeu isolé dans une classe GameEngine.',
      'Couleurs et rangs modélisés avec des sealed interfaces et des records.',
      'Interface graphique construite avec Zen, packaging en JAR, assets chargés depuis le classpath.',
    ],
    stack: ['Java', 'sealed interfaces', 'records', 'Zen'],
    note: 'moteur fait maison',
    repo: 'https://github.com/GuedesAlexandre/Azathro',
  },
  {
    id: 'deserts',
    title: 'Déserts médicaux',
    context: 'ESIEE Paris · projet pluridisciplinaire · en équipe',
    summary: 'Où construire les hôpitaux de France ? Un algorithme génétique en C choisit, parmi les 34 437 communes de métropole, où placer des hôpitaux pour que chacun en ait un à moins de 10 km, au moindre coût.',
    details: [
      'Fitness : population couverte, moins 5 000 points par hôpital construit, plus un bonus pour les CHRU des grandes villes.',
      'Génome de taille variable (malloc / realloc) : l’algorithme ferme de lui-même les hôpitaux qui ne servent à rien.',
      'Sélection par tournoi, 800 individus, jusqu’à 1 000 générations, mutation de 0,30 à 0,05, immigrants et redémarrages.',
      'Meilleure solution trouvée : 1 299 hôpitaux dont 2 CHRU, exportée en CSV puis rendue en carte et en PDF.',
    ],
    stack: ['C', 'MLV', 'Python', 'GeoJSON'],
    note: '1 299 hôpitaux placés',
    repo: 'https://github.com/GuedesAlexandre/Projet_Multidisciplinaire_S2',
  },
];
