// Recorre cada página pantalla a pantalla (como al hacer scroll) y guarda cada pantalla.
// Uso: DEVICE=desktop|mobile node capture.mjs
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'shots');
mkdirSync(OUT, { recursive: true });
const DEVICE = process.env.DEVICE || 'desktop';
const MOBILE = DEVICE === 'mobile';
const W = MOBILE ? 390 : 1440;
const VH = MOBILE ? 844 : 900;
const DPR = MOBILE ? 2 : 1.5;
const NAV = 60;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:4322';
const PORT = MOBILE ? 9341 : 9340;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), 'nanai-pdf-chrome-' + DEVICE)}`, '--hide-scrollbars', '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 80 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
  if (!target) await sleep(250);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0; const pending = new Map(); const listeners = new Set();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } else listeners.forEach((l) => l(m)); };
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const once = (method) => new Promise((r) => { const l = (m) => { if (m.method === method) { listeners.delete(l); r(m.params); } }; listeners.add(l); });
const run = async (fn, ...args) => {
  const expression = `(${fn.toString()})(${args.map((a) => JSON.stringify(a)).join(',')})`;
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
};
const go = async (path) => { const l = once('Page.loadEventFired'); await send('Page.navigate', { url: BASE + path }); await l; };
const shot = async (file) => {
  const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  writeFileSync(join(OUT, file), Buffer.from(data, 'base64'));
};

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: VH, deviceScaleFactor: DPR, mobile: MOBILE });
if (MOBILE) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

const manifestFile = join(HERE, 'manifest.json');
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : {};
manifest[DEVICE] = [];

// 1. La apertura («Activar creatividad»), tal como la ve quien llega por primera vez
await go('/');
await run(() => { try { sessionStorage.clear(); } catch {} return true; });
await go('/');
await run(() => document.fonts.ready.then(() => true));
await sleep(1600);
await shot(`${DEVICE}-apertura.jpg`);
manifest[DEVICE].push({ page: 'apertura', file: `${DEVICE}-apertura.jpg` });

// 2. Cada página, pantalla a pantalla
const pages = [['inicio', '/'], ['trabajos', '/trabajos'], ['sobre-nosotros', '/sobre-nosotros']];
await run(() => { try { sessionStorage.setItem('nanai-opened', '1'); } catch {} return true; });

for (const [name, path] of pages) {
  await go(path);
  await run(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 140)); }
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
    scrollTo({ top: 0, behavior: 'instant' });
    return true;
  });
  await sleep(1200);

  // Los pasos del proceso se encienden al pasar el ratón: se pasa el ratón de verdad
  if (!MOBILE) {
    const steps = await run(() => {
      const list = document.querySelector('[data-steps]');
      if (!list) return null;
      list.scrollIntoView({ block: 'center', behavior: 'instant' });
      const last = [...list.querySelectorAll('.fstep')].pop().getBoundingClientRect();
      const box = list.getBoundingClientRect();
      return { x: last.left + 20, y: box.top + 20 };
    });
    if (steps) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: steps.x - 400, y: steps.y });
      await sleep(80);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: steps.x, y: steps.y });
      await sleep(300);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: VH - 2 });
    }
  }

  // Bloques de la página (secciones de primer nivel y pie), en coordenadas de documento
  const { blocks, docH } = await run(() => {
    const els = [...document.querySelectorAll('section, footer')].filter((el) => !el.parentElement.closest('section, footer'));
    return {
      blocks: els.map((el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY }; }).sort((a, b) => a.top - b.top),
      docH: document.documentElement.scrollHeight,
    };
  });

  const positions = [0];
  let pos = 0;
  while (pos + VH < docH - 2) {
    const viewBottom = pos + VH;
    const blk = blocks.find((b) => b.bottom > viewBottom + 8);
    if (!blk) break;
    let next = Math.round(blk.top - NAV - (MOBILE ? 8 : 16));
    // Pasos cortos repiten casi toda la pantalla: entonces se avanza una pantalla entera
    if (next - pos < VH * 0.4) next = pos + VH - NAV - 60;
    next = Math.min(next, docH - VH);
    if (next <= pos) break;
    positions.push(next);
    pos = next;
  }

  for (const [i, y] of positions.entries()) {
    await run((top) => { scrollTo({ top, behavior: 'instant' }); return true; }, y);
    await sleep(900);
    const file = `${DEVICE}-${name}-${String(i + 1).padStart(2, '0')}.jpg`;
    await shot(file);
    manifest[DEVICE].push({ page: name, file });
  }
  console.log(DEVICE, name, positions.length, 'pantallas', docH + 'px');
}

writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
ws.close();
browser.kill();
