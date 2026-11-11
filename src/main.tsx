import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/homemade-apple';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource-variable/jost';
import './styles/tokens.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
