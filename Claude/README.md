# Nanai Studio — Web

Sitio web de **Nanai Studio**, productora audiovisual en Sevilla (videoclips, contenido y estrategia).

Web estática (HTML + CSS + JS, sin dependencias ni build). Se puede publicar tal cual.

## Estructura

```
index.html      → la web (una sola página)
styles.css      → estilos
script.js       → interacciones (nav, slider, lightbox de vídeo, animaciones)
images/         → logos (SVG), fondo e imágenes de rodaje
```

- **Fondo en uso:** `images/fondo17.jpg` (`fondo18.jpg` es una alternativa con más aire).
- **Logo:** `images/logo-horizontal-blanco.svg`. Favicon: `images/isotipo-negro.svg`.
- Las miniaturas del portfolio se cargan automáticamente desde YouTube (no hacen falta archivos locales).
- El portfolio se gestiona desde el array `projects` al principio de `script.js` (para añadir/reordenar vídeos, basta con editar esa lista).

## Publicar

Al ser estática, sirve cualquier hosting de estáticos:

- **GitHub Pages:** sube estos archivos al repo → Settings → Pages → Deploy from branch (`main`, carpeta `/root`).
- **Netlify / Vercel:** arrastra la carpeta o conecta el repo. Sin comando de build; carpeta de publicación = raíz.

## Dependencias externas (se cargan por CDN, requieren internet)

- Google Fonts (Playfair Display) — League Spartan va auto-alojada en el CSS.
- Widget de reseñas de Google (Featurable).
- Reproductor y miniaturas de YouTube.
