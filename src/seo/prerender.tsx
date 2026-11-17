import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';

export { headTags, resolveSiteUrl, robotsTxt, sitemapXml } from './seo';

/** Le HTML de la page tel que le client le rend au premier passage : main.tsx l'hydrate ensuite. */
export const renderApp = () => renderToString(<StrictMode><App /></StrictMode>);
