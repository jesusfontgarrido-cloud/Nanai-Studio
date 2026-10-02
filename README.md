# Nanai Studio — Web

Web de nanaistudio.es: productora audiovisual creativa de Sevilla, dirigida por Jesús Font.
Dos públicos: Marcas y Artistas y creadores.
Dirección editorial (1-10-2026): papel con la retícula a la vista, el negro como sala de
proyección para el trabajo, un solo rojo plano (#D9291C), League Spartan en titulares + Archivo
+ Playfair cursiva, titulares con fotogramas incrustados y fotos de rodaje en blanco y negro
que se encienden a color (`src/styles/flat.css` + `src/components/flat/`). Detalle en `CLAUDE.md`. Copias para volver atrás en
`_retirado/snapshot-2026-10-01*`; la piel anterior («Luz medida») sigue en
`src/styles/tokens.css`, `src/components/site/` y `_retirado/paginas-piel-anterior/`.
Astro 5, CSS propio y cero JS por defecto.

- Reglas del proyecto y tokens: [`CLAUDE.md`](CLAUDE.md)
- Especificación original (una sola página): [`docs/spec_home_nanai.md`](docs/spec_home_nanai.md)
- Wireframes, moodboard y referencias: [`docs/design/`](docs/design/)

> **Aún no está en producción.** nanaistudio.es sigue sirviendo la web estática anterior
> (copia en `_legacy/` y en `../nanai-studio-web-backup-20260913`). No subas esta carpeta a
> GitHub hasta el paso a producción.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Apertura «Activar creatividad» (una vez por sesión, nunca bloquea, no sale a quien llega de un anuncio; `/?intro` la fuerza), hero, cinta de oficios, cómo trabajamos (bloques + botones, en cápsula blanca), proceso (franja sin número), trabajo seleccionado con créditos, la idea (Jesús Font), preguntas, contacto |
| `/trabajos` | Todo el trabajo publicado, sin filtros: un plano para marcas y otro para artistas y creadores. Los vídeos se ven en un reproductor dentro de la web |
| `/sobre-nosotros` | Quiénes somos, la idea completa con los principios, galería de rodaje, preguntas, contacto |

`/marcas`, `/artistas` y `/musica` redirigen a `/trabajos`; `/estudio`, a `/sobre-nosotros`.
Todo el discurso (método, proceso, preguntas) vive en la home: Trabajos solo enseña trabajo.

## Puesta en marcha

Node.js 20 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # web estática en dist/
npm run preview  # sirve dist/
```

## Estructura

```
src/
  styles/       flat.css (piel actual), tokens.css + base.css (piel anterior), fonts.css
  layouts/      BaseLayout.astro, SiteLayout.astro (nav + pie)
  components/
    flat/       piel actual: Motion (revelados), Em (cursiva de los titulares), Opener,
                Nav, Hero, SlideCta, Ticker, Method, Steps, Work (+ reproductor),
                Manifesto, PageHeader, Gallery, Faq, Contact, Footer
    site/       piel anterior «Luz medida», sin usar en las páginas actuales
    ui/         Arrow, FrameMarks, Slate, Wordmark
    sections/   Footer (compartido)
  data/         site.ts (contacto), work.ts (proyectos), copy.ts (textos con su origen)
  assets/media/ fotos (se convierten a AVIF/WebP en el build)
  pages/        index, trabajos, sobre-nosotros
public/
  fonts/        League Spartan, Archivo, Playfair Display Italic (woff2, subset latino)
                + Archivo, Inter Tight y JetBrains Mono, declaradas para poder volver
  og/           imagen para compartir (1200 × 630)
  brand/        logos SVG
  media/        bucle de vídeo de Traders
_retirado/      piezas de la primera propuesta, fuera del build (ver _retirado/LEEME.md)
```

## Contenido pendiente

Los textos de `src/data/copy.ts` indican su origen; los marcados «propuesta» esperan aprobación.
Los enlaces sin destino llevan `#pendiente-…`:

```bash
grep -rn "pendiente" src
```

## Fuentes

Salen de los paquetes `@fontsource-variable/league-spartan`, `@fontsource-variable/playfair-display`
y `@fontsource/ibm-plex-mono` (devDependencies; también están los de Archivo, Inter Tight y
JetBrains Mono). Si se actualizan, vuelve a copiar los `files/*-latin-*.woff2` a `public/fonts/`.
Las reservas calibradas de `src/styles/fonts.css` (size-adjust) evitan saltos al cargar.
