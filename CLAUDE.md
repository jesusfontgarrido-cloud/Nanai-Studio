# Nanai Studio · Reglas del proyecto

Web de Nanai Studio, productora audiovisual creativa de Sevilla, dirigida por Jesús Font.
Todo el contenido visible va en español. El código (variables, clases, commits) en inglés.
El criterio visual sale de la skill `estilo-nanai` (rúbrica de la sección 8).

## Dirección visual: editorial limpia (1-10-2026, tercera vuelta)

**Entre un guion y una revista.** Papel blanco con un punto de gris (`#F4F4F1`) y grano fino
sobre toda la página; mucho aire, poca información y la imagen mandando. Referencias: A24
(concepto de Behance), VYNN, Trato, Commuter. Regla de oro del usuario: **economizar** — cada
sección dice una cosa, sin cabeceras numeradas, sin lecturas de cámara de adorno y sin
botones repetidos («Hablemos» solo en la barra; el contacto es el mismo en todas las páginas).

- **Hero** (estructura de la web publicada de Nanai): la foto del rodaje de Fama de Maleante
  (DSC08704) a sangre y, encima, centrado en la pantalla, «Productora creativa en Sevilla», el
  claim con sus fotogramas y los botones Ver trabajos y WhatsApp, en claro sobre una sombra
  suave solo detrás del texto (contraste AA medido sobre la foto). Abajo del todo la foto se
  funde con el papel. En móvil lleva su propio recorte vertical (si no, sale borrosa). Fotos
  probadas con este montaje: docs/capturas-2026-10-01-final/hero-opciones-foto.jpg.
- **Fotogramas en los titulares** con formas suaves (`.inframe--pill`, `.inframe--arch`).
- **Sin cortes secos:** la página es siempre el mismo papel. Lo que tiene color va en cápsulas de
  esquinas suaves con un margen de papel alrededor: el proceso (hueso), el trabajo y el pie
  (negro, la sala de proyección) y las preguntas (rojo `#D9291C`, un plano por página).
- **Voces:** League Spartan (titulares, minúscula; también la firma de Jesús), Archivo (cuerpo e
  interfaz, incluida la barra), Courier Prime (solo notas pequeñas: etiquetas, pies y créditos de
  foto, la voz de guion) y Playfair cursiva solo en «sienta» y «espectacular».
- **Imágenes** con esquinas de 10 px (`--f-r-media`) y la del hero, `--f-r-card`. BTS en blanco y
  negro que se enciende a color; crédito «Foto @gallagm» en una esquina de la foto.
- **Trabajo:** fotogramas limpios con solo el título; al pasar el ratón se oscurece el vídeo y
  aparecen tipo, rol y «Reproducir». Home: dos piezas y «Ver todos los trabajos».
- **Contacto:** WhatsApp primero, como enlace grande sin caja; correo debajo; formulario al lado.
- **Sin etiquetas que repitan el titular:** ni «Trabajos» sobre «Trabajos del estudio», ni
  «Sobre nosotros» sobre «Quiénes somos», ni «Contacto» sobre «¿Hablamos?», ni «Preguntas»
  sobre «Antes de escribirnos…». Las que quedan (Cómo trabajamos, Proceso, La idea) nombran algo
  que el titular no dice. Bajo algunos titulares, una sola línea de contexto (copy.ts).
- **Sobre nosotros:** galería-collage sin título ni pies, con visor (flechas, Esc). En escritorio,
  tres columnas con los formatos repartidos para que acaben rectas.
- **Trabajos (portfolio del 2-10-2026, del «Briefing Portfolio Web.pdf»):** Marketing y anuncios (TBS: vídeo de producto del curso en grande + 4 en dos columnas) · Branded content, eventos y redes (podcast incluido) · Videoclips · Fotografía (Lima Sorda; moda y retrato, en filas justificadas con visor). Datos en work.ts (los privados de YouTube llevan hidden) y photos.ts.
- **Reseñas de Google** (widget de Featurable) bajo las preguntas en las tres páginas; se carga al acercarse y se viste con la piel inyectando estilos en su shadow DOM.
- **Redes de Jesús** (Instagram @itsjesusfont y LinkedIn) solo en «¿Quién hay detrás de Nanai?».
- **Formulario:** Web3Forms (clave de la web anterior, llega al correo del estudio), enviado con fetch y confirmación en la página; en desarrollo no envía.
- **PDF de la web entera** (para enviar): docs/nanai-studio-web-2026-10-02.pdf; se regenera con scripts/pdf-web.
- **Copy del 2-10-2026** (dictado por el usuario, en copy.ts): claim del hero todo en claro; método «Trabajamos con método» apoyado en datos; idea «Un vídeo no debe ser solo bonito»; Sobre nosotros con «¿Quién hay detrás de Nanai?» y la bio de Jesús (sin principios); preguntas nuevas, también en Trabajos.
- Base: `src/styles/flat.css` y `src/components/flat/`. Puntos de retorno en
  `_retirado/snapshot-2026-10-01*` (negro: `-01c-negro-planos`; la editorial anterior a esta
  limpieza no se guardó aparte: está descrita en la memoria).

## Arquitectura (actualizada el 1-10-2026)

Nanai Studio es una **productora audiovisual creativa**, no una agencia de marketing ni una
productora corporativa. La definición manda sobre el claim: «Que se sienta, y que funcione»
es emocional y siempre va acompañado de qué hacemos, para quién y qué se puede contratar.

- **Páginas:** `/` · `/trabajos` · `/sobre-nosotros`. Nav: Inicio · Trabajos · Sobre nosotros · Hablemos.
- **Un solo método** para marcas, artistas y creadores: se cuenta una vez, en la home.
- **Trabajos** solo enseña trabajo, sin filtros: «Para marcas» y «Para artistas y creadores», y
  al final el mismo contacto que en la home. Nada de secciones «en montaje».
- **El trabajo se ve sin salir de la web**: reproductor propio (YouTube sin cookies).
- **Orden de la home:** hero · cómo trabajamos (una frase + tres fotos con una línea cada una:
  la idea, el rodaje, la entrega) · proceso · trabajo (dos piezas) · la idea · preguntas ·
  contacto · pie.
- **Apertura** «Activar creatividad»: una vez por sesión, nunca bloquea (rueda, deslizar,
  teclado) y no sale a quien llega de un anuncio (utm, gclid, fbclid) ni por un ancla.
- **Bodas:** fuera de la arquitectura principal. Como mucho, un enlace discreto en el pie.

## Prioridades

1. Claridad antes que estética. Navegación evidente antes que interacción espectacular.
2. Ninguna información importante detrás de un slider, un hover o una animación.
3. Demostrar antes que explicar: primero el trabajo, después el discurso.
4. Nunca inventar clientes, métricas, resultados, premios, testimonios ni equipo.
   Si no hay dato real, formulación neutra o nada.
5. Frases cortas y verbos. Si un texto no responde a qué hacemos, para quién, cómo trabajamos,
   qué problema resolvemos o por qué importa, se borra.

## Técnica

- Astro 5 estático. Sin UI kits: CSS propio.
- Fuentes autoalojadas en woff2 (`public/fonts`), precarga de League Spartan y Playfair.
- Imágenes con `astro:assets` (AVIF/WebP), `loading="lazy"` salvo el hero. Miniaturas de
  YouTube con `srcset` (320/640/1280).
- Vídeos: `muted`, `loop`, `playsinline`, `preload="none"` y `poster`.
- Medido el 1-10-2026 (dirección editorial) en móvil con red y CPU limitadas: LCP ≈ 1–1,2 s,
  CLS ≤ 0,02, home ≈ 340 KB (el bucle de Traders del hero solo se reproduce si se ve grande).
- Contraste AA, foco visible de 2 px en rojo, un H1 por página, objetivos táctiles ≥ 32 px.
- SEO: canonical, Open Graph (`public/og/nanai-studio.jpg`), datos estructurados
  (ProfessionalService + WebSite) en `BaseLayout.astro`, sitemap.
- Responsive: 390, 768 y 1440 px.

## Contenido

Los textos viven en `src/data/copy.ts` y cada uno indica su origen; el trabajo, en
`src/data/work.ts`. Donde falte una pieza real, deja un marcador claro con la proporción
correcta. Nunca publiques una sección con cajas vacías.

## Piel anterior

Los tokens de `src/styles/tokens.css` (bloques «Luz medida», noche y día) son de la piel
anterior y se conservan para poder volver; la piel plana solo usa de ahí las familias
tipográficas (`--font-sans`, `--font-serif`, `--font-mono`).
