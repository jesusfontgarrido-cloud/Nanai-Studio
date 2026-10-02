// Genera doc.html: portada + escritorio (una pantalla por hoja) + móvil (cuatro por hoja).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = 'file:///C:/Users/jesusfont/Documents/nanai-studio-web/public';
const m = JSON.parse(readFileSync(join(HERE, 'manifest.json'), 'utf8'));

const pages = {
  apertura: { num: '00', name: 'Apertura', note: 'Lo primero al entrar: la web se enciende con la rueda, el dedo o el teclado.' },
  inicio: { num: '01', name: 'Inicio', note: 'La presentación, cómo trabajamos, el proceso, dos trabajos, la idea, preguntas y contacto.' },
  trabajos: { num: '02', name: 'Trabajos', note: 'Marketing y anuncios, branded content y redes, videoclips y fotografía. Los vídeos se ven dentro de la web.' },
  'sobre-nosotros': { num: '03', name: 'Sobre nosotros', note: 'El estudio, quién hay detrás (Jesús Font), el rodaje en fotos, preguntas y contacto.' },
};

const head = (left, right) => `
  <header class="head">
    <div class="head__left">${left}</div>
    <div class="head__right">${right}</div>
  </header>`;

const sheets = [];

/* Portada */
const heroShot = m.desktop.find((s) => s.page === 'inicio').file;
const index = ['inicio', 'trabajos', 'sobre-nosotros']
  .map((k) => `<li><span class="type red">${pages[k].num}</span><div><strong>${pages[k].name}</strong><p>${pages[k].note}</p></div></li>`)
  .join('');
sheets.push(`
<section class="page cover">
  <div class="cover__text">
    <img class="cover__logo" src="${ROOT}/brand/logo-horizontal-negro.svg" alt="Nanai Studio" />
    <div>
      <p class="type">Propuesta de diseño · 2 de octubre de 2026</p>
      <h1 class="cover__title">La nueva web de<br />Nanai <em>Studio</em></h1>
    </div>
    <ol class="cover__index">
      ${index}
      <li><span class="type red">04</span><div><strong>En el móvil</strong><p>Las mismas páginas, como se ven en un teléfono.</p></div></li>
    </ol>
    <p class="type cover__foot">Capturas de la versión en desarrollo. Los textos están en revisión.</p>
  </div>
  <figure class="cover__shot"><img src="pdfshots/${heroShot}" alt="" /></figure>
</section>`);

/* Escritorio: una pantalla por hoja */
const groups = (list) => list.reduce((acc, s) => ((acc[s.page] ||= []).push(s), acc), {});
const desk = groups(m.desktop);
for (const key of ['apertura', 'inicio', 'trabajos', 'sobre-nosotros']) {
  const list = desk[key] || [];
  list.forEach((s, i) => {
    const p = pages[key];
    const left = `<span class="type red">${p.num}</span><strong>${p.name}</strong>${i === 0 ? `<span class="note">${p.note}</span>` : ''}`;
    const right = `<span class="type">Escritorio · ${list.length > 1 ? `${i + 1} de ${list.length}` : '1440 px'}</span>`;
    sheets.push(`
<section class="page screen">
  ${head(left, right)}
  <figure class="frame"><img src="pdfshots/${s.file}" alt="" /></figure>
</section>`);
  });
}

/* Móvil: cuatro pantallas por hoja, por página de la web */
const mob = groups(m.mobile);
const mobileRuns = [
  ['inicio', [...(mob.apertura || []), ...(mob.inicio || [])]],
  ['trabajos', mob.trabajos || []],
  ['sobre-nosotros', mob['sobre-nosotros'] || []],
];
for (const [key, list] of mobileRuns) {
  const chunks = [];
  for (let i = 0; i < list.length; i += 4) chunks.push(list.slice(i, i + 4));
  chunks.forEach((chunk, c) => {
    const p = pages[key];
    const left = `<span class="type red">04</span><strong>En el móvil</strong><span class="note">${p.name}${chunks.length > 1 ? ` · ${c + 1} de ${chunks.length}` : ''}</span>`;
    const phones = chunk.map((s) => `<figure class="phone"><img src="pdfshots/${s.file}" alt="" /></figure>`).join('');
    sheets.push(`
<section class="page phones">
  ${head(left, '<span class="type">Móvil · 390 px</span>')}
  <div class="phones__row">${phones}</div>
</section>`);
  });
}

const css = `
  @font-face { font-family: 'League Spartan'; src: url('${ROOT}/fonts/league-spartan-latin-wght-normal.woff2') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Archivo'; src: url('${ROOT}/fonts/archivo-latin-standard-normal.woff2') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Courier Prime'; src: url('${ROOT}/fonts/courier-prime-latin-400-normal.woff2') format('woff2'); font-weight: 400; }
  @font-face { font-family: 'Playfair Display'; src: url('${ROOT}/fonts/playfair-display-latin-wght-italic.woff2') format('woff2'); font-weight: 400 900; font-style: italic; }

  @page { size: 1440px 900px; margin: 0; }
  :root { --paper: #F4F4F1; --ink: #151514; --muted: #55554F; --red: #D9291C; --red-text: #B8231A; --line: rgba(21, 21, 20, 0.12); }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Archivo', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .page { position: relative; width: 1440px; height: 900px; overflow: hidden; break-after: page; background: var(--paper); }
  .page:last-child { break-after: auto; }
  .type { font-family: 'Courier Prime', monospace; font-size: 15px; color: var(--muted); }
  .red { color: var(--red-text); }

  /* Portada */
  .cover { display: grid; grid-template-columns: 520px 1fr; gap: 64px; padding: 64px 0 64px 72px; }
  .cover__text { display: grid; grid-template-rows: auto auto 1fr auto; gap: 52px; }
  .cover__logo { width: 230px; height: auto; }
  .cover__title { margin: 14px 0 0; font-family: 'League Spartan', sans-serif; font-weight: 620; font-size: 66px; line-height: 0.98; letter-spacing: -0.02em; }
  .cover__title em { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; color: var(--red); font-size-adjust: ex-height 0.46; }
  .cover__index { display: grid; align-content: start; gap: 16px; margin: 0; padding: 0; list-style: none; }
  .cover__index li { display: grid; grid-template-columns: 34px 1fr; gap: 10px; padding-top: 14px; border-top: 1px solid var(--line); }
  .cover__index strong { font-family: 'League Spartan', sans-serif; font-weight: 600; font-size: 21px; }
  .cover__index p { margin: 4px 0 0; color: var(--muted); font-size: 15px; line-height: 1.45; }
  .cover__foot { margin: 0; font-size: 13px; }
  .cover__shot { margin: 0; align-self: center; border-radius: 18px 0 0 18px; overflow: hidden; box-shadow: 0 30px 70px -30px rgba(21, 21, 20, 0.45); }
  .cover__shot img { display: block; width: 100%; height: auto; }

  /* Cabecera de cada hoja */
  .head { position: absolute; top: 0; left: 0; right: 0; height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 88px; }
  .head__left { display: flex; align-items: baseline; gap: 14px; }
  .head__left strong { font-family: 'League Spartan', sans-serif; font-weight: 600; font-size: 22px; }
  .head .note { color: var(--muted); font-size: 15px; }

  /* Escritorio */
  .frame { position: absolute; top: 70px; left: 88px; width: 1264px; height: 790px; margin: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 24px 60px -32px rgba(21, 21, 20, 0.45); }
  .frame img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }

  /* Móvil */
  .phones__row { position: absolute; top: 70px; bottom: 40px; left: 88px; right: 88px; display: flex; align-items: center; justify-content: center; gap: 28px; }
  .phone { margin: 0; width: 295px; padding: 8px; border-radius: 34px; background: #151514; box-shadow: 0 24px 60px -32px rgba(21, 21, 20, 0.55); }
  .phone img { display: block; width: 100%; height: auto; border-radius: 26px; }
`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Nanai Studio · La nueva web</title>
<style>${css}</style>
</head>
<body>
${sheets.join('\n')}
</body>
</html>`;

writeFileSync(join(HERE, 'doc.html'), html);
console.log('hojas', sheets.length);
