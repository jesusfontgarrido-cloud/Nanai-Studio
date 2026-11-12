/**
 * Escenas del CV de Jesús Font (/jesus-font), cuarta versión (repaso del 12-11-2026).
 *
 * Criterio (skill de Emil Kowalski): la apertura se ve una vez y admite su momento; lo ligado
 * al scroll avanza 1:1 con él y Lenis pone la suavidad; las entradas, con ease-out fuerte; lo
 * que flota, con seno suave y amplitud pequeña. Transform, opacity, filter (poco) y canvas.
 * Todo vive dentro de gsap.matchMedia: con movimiento reducido no se monta nada.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const root = document.documentElement;
root.classList.add('cv-ready');

const EASE_OUT = 'expo.out'; // ≈ cubic-bezier(0.23, 1, 0.32, 1)
const EASE_MOVE = 'power3.inOut'; // ≈ cubic-bezier(0.77, 0, 0.175, 1)
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

// ── Reproductor (también sin movimiento) ─────────────────────────
const player = $<HTMLDialogElement>('[data-player]');
const screen = $('[data-player-screen]', player);
$$<HTMLButtonElement>('[data-play]').forEach((button) =>
  button.addEventListener('click', () => {
    if (typeof player.showModal !== 'function') {
      window.open(`https://www.youtube.com/watch?v=${button.dataset.play}`, '_blank', 'noopener');
      return;
    }
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.play}?autoplay=1&rel=0&playsinline=1`;
    frame.title = button.dataset.title ?? 'Vídeo';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    screen.replaceChildren(frame);
    $('[data-player-title]', player).textContent = button.dataset.title ?? '';
    player.showModal();
  }),
);
$('[data-player-close]', player).addEventListener('click', () => player.close());
player.addEventListener('click', (event) => event.target === player && player.close());
player.addEventListener('close', () => screen.replaceChildren());

// ── Índice lateral: marca la sección en la que estás (también sin movimiento) ──
const indexLinks = $$('[data-index-link]');
const markIndex = (id: string) => indexLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.indexLink === id));
markIndex('inicio');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && markIndex((e.target as HTMLElement).id)),
  { rootMargin: '-45% 0px -50% 0px' },
);
indexLinks.forEach((a) => {
  const target = document.getElementById(a.dataset.indexLink!);
  if (target) sectionObserver.observe(target);
});

/** Parte una palabra en letras (para la apertura). */
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';
  return [...text].map((ch) => {
    const span = document.createElement('span');
    span.className = 'cvh__char';
    span.textContent = ch;
    el.appendChild(span);
    return span;
  });
}

/**
 * El retrato se forma con grano: un lienzo pinta la foto solo en los granos que ya han
 * «revelado». Cada grano tiene su umbral (azar + un poco de gradiente, para que nazca desde
 * abajo). La máscara es diminuta (un píxel por grano) y se escala sin suavizado.
 */
function grainReveal(host: HTMLElement, src: string) {
  const GRAIN = 3;
  const canvas = document.createElement('canvas');
  canvas.className = 'cvh__grain';
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
    const dpr = Math.min(devicePixelRatio || 1, 2);
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
      draw();
    },
  };
}

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // ── Scroll suave ─────────────────────────────────────────────
  const lenis = new Lenis({ lerp: 0.09, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // ── 1 · Apertura: línea, nombre y barra ──────────────────────
  const hero = $('[data-cvh]');
  const stage = $('.cvh__stage', hero);
  const chars = $$('[data-split]', hero).flatMap(splitChars);
  let seen = false;
  try {
    seen = sessionStorage.getItem('cv-intro') === '1';
    sessionStorage.setItem('cv-intro', '1');
  } catch {
    // Sin almacenamiento: la apertura entera.
  }

  gsap.set(chars, { yPercent: 110 });
  const intro = gsap.timeline({ defaults: { ease: EASE_OUT }, delay: 0.15 });
  intro
    .fromTo('[data-line]', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, ease: EASE_MOVE })
    .to('[data-line]', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.7, ease: EASE_MOVE }, '+=0.05')
    .to(chars, { yPercent: 0, duration: 1, stagger: 0.045 }, '<0.1')
    .fromTo('[data-bar]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .fromTo('[data-status]', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, '<')
    .fromTo('.cvtalk, .cvindex', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '<')
    .fromTo('[data-hint]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
  if (seen) intro.timeScale(2.2);

  // ── 2 · El nombre se abre, el retrato crece desde abajo con grano y la bio enfoca ──
  const portrait = $('[data-portrait]', hero);
  const space = $('[data-space]', hero);
  const grain = grainReveal(portrait, portrait.dataset.src!);
  const reveal = { p: 0 };
  ScrollTrigger.addEventListener('refresh', grain.size);

  // Desde el centro de la pantalla, abajo del todo, hasta su sitio
  // (offsetLeft/offsetTop no cuentan las transformaciones: la medida es estable con el scrub)
  const fromCenter = () => {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = space;
    while (node && node !== stage) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const w = space.offsetWidth;
    const h = space.offsetHeight;
    return { x: stage.offsetWidth / 2 - (x + w / 2), y: stage.offsetHeight - (y + h / 2) + h * 0.12 };
  };

  const heroTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=200%', scrub: true, pin: stage, invalidateOnRefresh: true },
  });
  heroTl
    .to('[data-hint]', { opacity: 0, duration: 0.05 }, 0)
    .to('[data-bar]', { opacity: 0, y: 24, duration: 0.12 }, 0)
    .to('[data-status]', { opacity: 0, y: -16, duration: 0.12 }, 0)
    .to('[data-word="left"]', { xPercent: -70, x: () => -innerWidth * 0.12, opacity: 0, filter: 'blur(14px)', duration: 0.4, ease: 'power2.in' }, 0)
    .to('[data-word="right"]', { xPercent: 70, x: () => innerWidth * 0.12, opacity: 0, filter: 'blur(14px)', duration: 0.4, ease: 'power2.in' }, 0)
    .fromTo(
      space,
      { x: () => fromCenter().x, y: () => fromCenter().y, scale: 0.32 },
      { x: 0, y: 0, scale: 1, duration: 0.62, ease: 'power3.out' },
      0.02,
    )
    .to(reveal, { p: 1, duration: 0.5, onUpdate: () => grain.set(reveal.p) }, 0.08)
    .fromTo('[data-name]', { opacity: 0, filter: 'blur(16px)', y: 30 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.2 }, 0.34)
    .fromTo($$('[data-bio] > *'), { opacity: 0, filter: 'blur(10px)', y: 40 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.2, stagger: 0.05 }, 0.42)
    .to('.cvh__still', { opacity: 1, duration: 0.04 }, 0.6);

  // Al mover el ratón, el retrato gira un poco (decorativo, solo con ratón)
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const tilt = $('[data-portrait]', hero);
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      ry((e.clientX / innerWidth - 0.5) * 12);
      rx((e.clientY / innerHeight - 0.5) * -8);
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  });

  // ── 3 · Trabajos: con las luces apagadas, los vídeos suben y la categoría crece ──
  const works = $('[data-cvw]');
  const cv = $('.cv');
  // Las luces se apagan al terminar el retrato y se encienden de golpe (un corte) en «Más de 6 años»;
  // al volver hacia arriba, el negro vuelve con fundido.
  const snap = () => {
    cv.classList.add('is-snap');
    requestAnimationFrame(() => requestAnimationFrame(() => cv.classList.remove('is-snap')));
  };
  ScrollTrigger.create({
    trigger: works,
    start: 'top bottom',
    endTrigger: '[data-years]',
    end: 'top 55%',
    onToggle: (self) => {
      if (!self.isActive && self.direction === 1) snap();
      cv.classList.toggle('is-dark', self.isActive);
    },
  });

  // La rueda de categorías: la activa se coloca en su sitio, crece con un pequeño rebote
  // («fum») y las demás casi desaparecen.
  const cats = $('[data-cats]', works);
  const items = $$('li', cats);
  const links = $$('[data-cat-link]', works);
  const setActive = (index: number) => {
    cats.style.setProperty('--idx', String(index));
    items.forEach((li, i) => {
      li.style.setProperty('--ad', String(Math.min(Math.abs(i - index), 3)));
      li.classList.toggle('is-active', i === index);
    });
    links.forEach((a, i) => a.classList.toggle('is-active', i === index));
  };
  setActive(0);
  cats.classList.add('is-wheel');
  $$('[data-cat]', works).forEach((group, i) =>
    ScrollTrigger.create({
      trigger: group,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setActive(i),
    }),
  );
  $$('[data-card]', works).forEach((card) => {
    gsap.fromTo(
      card,
      { z: -700, rotationX: 20, yPercent: 25, opacity: 0 },
      { z: 0, rotationX: 0, yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 105%', end: 'top 50%', scrub: true } },
    );
    // Los datos de la pieza entran enfocándose, justo detrás del vídeo
    gsap.fromTo(
      $('.cvw__meta', card),
      { opacity: 0, y: 24, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: EASE_OUT, scrollTrigger: { trigger: card, start: 'top 62%', toggleActions: 'play none none reverse' } },
    );
  });

  // ── 4 · Más de 6 años: las fotos llegan desde el fondo, flotan y alguna sale hacia ti ──
  const years = $('[data-years]');
  const floats = $$('[data-float]', years);
  floats.forEach((f, i) => {
    gsap.fromTo(
      f,
      { z: () => rand(-1400, -800), rotationY: () => rand(-25, 25), opacity: 0 },
      { z: 0, rotationY: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: years, start: 'top 95%', end: 'center 60%', scrub: true } },
    );
    // Al irse, dos de ellas vienen hacia la pantalla
    if (i % 2 === 0) {
      gsap.fromTo(
        f,
        { z: 0, opacity: 1 },
        { z: 520, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: years, start: 'center 35%', end: 'bottom top', scrub: true } },
      );
    }
  });
  // Flotación suave y sutil de todo lo que hay alrededor del titular (también lo que va dentro)
  $$('[data-bob]', years).forEach((el, i) => {
    const big = el.classList.contains('cvy__bob');
    gsap.to(el, {
      y: big ? rand(10, 18) : rand(3, 5),
      rotation: big ? rand(-2.5, 2.5) : 0,
      duration: rand(2.8, 4.2),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.35,
    });
  });
  gsap.fromTo(
    '[data-years-title] .cvy__line',
    { opacity: 0, y: 60, filter: 'blur(12px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.15, ease: 'none', scrollTrigger: { trigger: years, start: 'top 80%', end: 'center 55%', scrub: true } },
  );
  // Con ratón, cada foto se desplaza según su profundidad (parallax 3D)
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const movers = floats.map((f) => ({ depth: Number(f.dataset.depth || 1), x: gsap.quickTo(f, 'x', { duration: 1.2, ease: 'power3.out' }) }));
    const move = (e: PointerEvent) => movers.forEach((m) => m.x((e.clientX / innerWidth - 0.5) * -40 * m.depth));
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  });

  // Las cifras entran girando un poco hacia ti y cuentan
  gsap.fromTo(
    '[data-tile]',
    { rotationX: -50, y: 40, opacity: 0, transformOrigin: '50% 100%' },
    { rotationX: 0, y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: EASE_OUT, scrollTrigger: { trigger: '.cvn__list', start: 'top 85%' } },
  );
  // Las cifras suben al ritmo del scroll (y crecen un poco); al volver hacia arriba, bajan.
  // Llegan a su valor final antes de la mitad de la pantalla, para leerlas quietas.
  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const value = $('.cvn__value', el.closest('li')!);
    const fmt = (v: number) => (el.textContent = decimals ? v.toFixed(decimals).replace('.', ',') : String(Math.round(v)));
    fmt(from);
    gsap.set(value, { transformOrigin: '0% 100%' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      end: 'top 50%',
      scrub: 0.4,
      onUpdate: (self) => {
        const p = gsap.parseEase('power2.out')(self.progress);
        fmt(from + (to - from) * p);
        gsap.set(value, { scale: 0.72 + 0.28 * p });
      },
    });
  });

  // ── 5 · El resto: puestos que entran en 3D, herramientas y formación ──
  $$('[data-row]').forEach((row) =>
    gsap.fromTo(
      row,
      { rotationX: -70, z: -260, opacity: 0, transformOrigin: '50% 0%' },
      { rotationX: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 62%', scrub: true } },
    ),
  );

  const table = $('[data-table]');
  const tools = $$('.cvs__tools li', table);
  gsap.set(tools, { opacity: 0 });
  ScrollTrigger.create({
    trigger: table,
    start: 'top 80%',
    once: true,
    onEnter: () =>
      gsap.fromTo(
        tools,
        { opacity: 0, y: () => -innerHeight * 0.45, rotation: (i) => [-24, 18, -12, 26, -18, 14, -28][i] },
        { opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.06 },
      ),
  });
  Draggable.create(tools, { bounds: table, inertia: true, edgeResistance: 0.75, zIndexBoost: true });

  gsap.fromTo(
    '[data-edu]',
    { '--edu': 0 },
    { '--edu': 1, ease: 'none', scrollTrigger: { trigger: '[data-edu]', start: 'top 75%', end: 'bottom 55%', scrub: true } },
  );

  // ── La línea roja: avanza junto a las categorías mientras duran los trabajos ──
  gsap.fromTo(
    '[data-progress]',
    { '--p': 0 },
    { '--p': 1, ease: 'none', scrollTrigger: { trigger: works, start: 'top 55%', end: 'bottom 55%', scrub: true } },
  );

  addEventListener('load', () => ScrollTrigger.refresh());

  return () => {
    ScrollTrigger.removeEventListener('refresh', grain.size);
    cats.classList.remove('is-wheel');
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
