// Construit assets/js/scenes.js (IIFE autonome) à partir de src/scenes.ts.
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  logLevel: 'warn',
  build: {
    outDir: 'assets/js',
    emptyOutDir: false,
    lib: { entry: 'src/scenes.ts', formats: ['iife'], name: 'PortfolioScenes', fileName: () => 'scenes.js' },
  },
});
