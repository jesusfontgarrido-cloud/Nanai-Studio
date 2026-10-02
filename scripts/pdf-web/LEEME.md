# PDF de la web entera

Genera `docs/nanai-studio-web-AAAA-MM-DD.pdf`: portada con índice, escritorio pantalla a
pantalla y móvil de cuatro en cuatro. Necesita Chrome instalado y el servidor de desarrollo
en marcha en el puerto 4322 (`npm run dev`).

Desde esta carpeta:

1. `DEVICE=desktop node capture.mjs` y `DEVICE=mobile node capture.mjs` (capturas en `shots/`)
2. `node prep.cjs` (las reduce a `pdfshots/`)
3. `node build-doc.mjs` (escribe `doc.html`; la fecha de portada y las descripciones están ahí)
4. `node print.mjs ../../docs/nanai-studio-web-AAAA-MM-DD.pdf`

Las carpetas `shots/`, `pdfshots/`, `chrome-*` y `doc.html` son temporales (en .gitignore).
