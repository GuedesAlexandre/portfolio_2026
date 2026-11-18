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
  { when: '2025 → 2028', what: 'Cycle ingénieur à l’ESIEE Paris', how: 'Filière Informatique, Design, Architecture et Développement, en alternance.' },
  { when: '2024 →', what: 'BPCE Solutions Informatiques, DSI de BPCE Factor', how: 'Stage API DevOps en avril 2024, puis alternance : développeur full stack, ingénieur logiciel depuis 2025. Microservices Spring Boot, interfaces Angular, CI/CD, modernisation et observabilité.' },
  { when: '2023', what: 'Intégrateur web chez AZApp', how: 'Un été sur des sites WordPress : modules, développements PHP côté back et maintenance de sécurité.' },
  { when: '2022 → 2025', what: 'BUT Métiers du Multimédia et de l’Internet', how: 'Université Gustave Eiffel, major de promotion, après une première année de BUT Informatique.' },
];
export const INVENTORY = [
  ['Machine', 'ThinkPad sous Omarchy'],
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
