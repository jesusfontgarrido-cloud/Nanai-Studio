/**
 * Grano del CV de /jesus-font, compartido con la web de Nanai (16-11-2026): la foto se forma en un
 * lienzo, grano a grano, del grano gordo y desenfocado a la foto nítida. Copia de grainReveal de
 * src/scripts/cv.ts (si cambia allí, cambiarlo aquí también).
 */
/**
 * El retrato se forma con grano: un lienzo pinta la foto solo en los granos que ya han
 * «revelado». Cada grano tiene su umbral (azar + un poco de gradiente, para que nazca desde
 * abajo). La máscara es diminuta (un píxel por grano) y se escala sin suavizado.
 */
export function grainReveal(host: HTMLElement, src: string, className = 'fgrain', maxPx = 1600) {
  const GRAIN = 3;
  const canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  const ctx = canvas.getContext('2d')!;
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d')!;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;

  let cells = new Float32Array(0);
  let data: ImageData | null = null;
  let progress = 0;
  let lastKey = -1;

  const draw = () => {
    if (!data || !img.complete || !img.naturalWidth) return;
    const key = Math.round(progress * 400);
    if (key === lastKey) return;
    lastKey = key;
    const px = data.data;
    for (let i = 0; i < cells.length; i++) px[i * 4 + 3] = cells[i] < progress ? 255 : 0;
    mctx.putImageData(data, 0, 0);
    const { width: w, height: h } = canvas;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mask, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-in';
    ctx.imageSmoothingEnabled = true;
    // Encaje «cover» de la foto en el lienzo
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const size = () => {
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    if (!w || !h) return;
    // Densidad: hasta 2x, pero el lado largo del lienzo nunca pasa de maxPx (rendimiento)
    const dpr = Math.min(devicePixelRatio || 1, 2, maxPx / Math.max(w, h));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    mask.width = Math.ceil(w / GRAIN);
    mask.height = Math.ceil(h / GRAIN);
    cells = new Float32Array(mask.width * mask.height);
    for (let y = 0; y < mask.height; y++) {
      const fromBottom = 1 - y / mask.height;
      for (let x = 0; x < mask.width; x++) cells[y * mask.width + x] = Math.random() * 0.72 + fromBottom * 0.27;
    }
    data = mctx.createImageData(mask.width, mask.height);
    lastKey = -1;
    draw();
  };

  img.addEventListener('load', () => {
    lastKey = -1;
    draw();
  });
  size();
  return {
    size,
    set(p: number) {
      progress = p;
      // Del grano gordo y desenfocado a la foto nítida: el desenfoque se va con el grano
      const blur = Math.pow(1 - p, 1.3) * 18;
      canvas.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : '';
      draw();
    },
  };
}
