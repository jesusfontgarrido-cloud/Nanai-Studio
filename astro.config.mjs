// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio de producción. Sin barra final.
const SITE = 'https://nanaistudio.es';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  // Todo el trabajo vive en /trabajos y el estudio, en /sobre-nosotros.
  redirects: {
    '/musica': '/trabajos',
    '/marcas': '/trabajos',
    '/artistas': '/trabajos',
    '/estudio': '/sobre-nosotros',
  },
  image: {
    // astro:assets genera AVIF + WebP.
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
