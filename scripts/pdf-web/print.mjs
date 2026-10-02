// Previsualiza hojas de doc.html como imágenes y lo imprime a PDF.
// Uso: node print.mjs salida.pdf [hojas a previsualizar, p. ej. 1,2,30]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || join(HERE, 'web.pdf');
const PREVIEW = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9342;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), 'nanai-pdf-chrome-print')}`, '--hide-scrollbars', '--no-first-run', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
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
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const loaded = once('Page.loadEventFired');
await send('Page.navigate', { url: pathToFileURL(join(HERE, 'doc.html')).href });
await loaded;
await evaluate(`document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))))`);
const broken = await evaluate(`[...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)`);
if (broken.length) console.log('Imágenes rotas:', broken);
const fonts = await evaluate(`[...document.fonts].map((f) => f.family + ':' + f.status).join(', ')`);
console.log('Fuentes:', fonts);
await sleep(400);

if (PREVIEW.length) {
  const dir = join(HERE, 'preview');
  mkdirSync(dir, { recursive: true });
  for (const n of PREVIEW) {
    const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, captureBeyondViewport: true, clip: { x: 0, y: (n - 1) * 900, width: 1440, height: 900, scale: 1 } });
    writeFileSync(join(dir, `hoja-${String(n).padStart(2, '0')}.jpg`), Buffer.from(data, 'base64'));
  }
}

const { data } = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
writeFileSync(OUT, Buffer.from(data, 'base64'));
console.log('PDF', OUT, Math.round(Buffer.from(data, 'base64').length / 1024) + ' KB');

ws.close();
browser.kill();
