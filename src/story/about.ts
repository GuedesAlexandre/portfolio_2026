/** Identité pour les moteurs de recherche et les aperçus de partage (le site, lui, dit « Alexandre »). */
export const IDENTITY = {
  givenName: 'Alexandre',
  familyName: 'Guedes',
  jobTitle: 'Ingénieur logiciel en alternance',
  employer: 'BPCE Solutions Informatiques',
  school: 'ESIEE Paris',
  knowsAbout: ['Kubernetes', 'Java', 'Spring Boot', 'React', 'Angular', 'TypeScript', 'Podman', 'LLM en local', 'Algorithmes génétiques'],
};
export const FULL_NAME = `${IDENTITY.givenName} ${IDENTITY.familyName}`;

export const ROLE ='Ingénieur logiciel en alternance · BPCE SI & ESIEE Paris';
export const TAGLINE = 'Apprenti ingénieur logiciel. Je construis des outils qui rendent la technique agréable à prendre en main.';
export const MANIFESTO =
  'J’ai à cœur de construire des choses qui seront encore utiles demain. Pas pour briller le temps d’une démo : pour ceux qui s’en serviront vraiment.';
export const STACK = [
  { part: 'Front', value: 'React, Angular, TypeScript' },
  { part: 'Back', value: 'Java, Spring Boot' },
  { part: 'Infra', value: 'Podman, Kubernetes' },
];
export const JOURNEY = [
  { when: '2025 →', what: 'Apprenti ingénieur logiciel chez BPCE Solutions Informatiques, DSI de BPCE Factor', how: 'Modernisation d’applications Spring Boot et observabilité.' },
  { when: '2025 → 2028', what: 'Cycle ingénieur à l’ESIEE Paris', how: 'Filière Informatique, Design, Architecture et Développement.' },
];
export const INVENTORY = [
  ['Machine', 'ThinkPad sous Fedora'],
  ['IDE', 'IntelliJ IDEA'],
  ['En ce moment', 'Kelp'],
  ['Hors écran', 'muscu, jeux vidéo, mangas, cinéma, Lovecraft'],
];
export const CONTACT = {
  email: 'alexandreguedes77600@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/GuedesAlexandre' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandre-guedesmmi/' },
  ],
};
