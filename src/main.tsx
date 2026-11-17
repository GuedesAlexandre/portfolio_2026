import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/homemade-apple';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/500.css';

import './styles/tokens.css';
import App from './App';

const root = document.getElementById('root')!;
const app = <StrictMode><App /></StrictMode>;
// En production, la page arrive déjà rendue (scripts/prerender.mjs) : on l'hydrate. En dev, elle est vide.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
