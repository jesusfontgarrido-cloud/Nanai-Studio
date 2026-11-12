/**
 * Escenas del CV de Jesús Font (/jesus-font), según el boceto del usuario.
 *
 * Criterio (skill de Emil Kowalski): la apertura se ve una vez y admite su momento; lo ligado
 * al scroll avanza 1:1 con él y Lenis pone la suavidad; las entradas, con ease-out fuerte; el
 * movimiento en pantalla, con ease-in-out. Solo transform, opacity y clip-path.
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

/** Reparte el retrato en fragmentos (una sola imagen como fondo). */
function buildTiles(host: HTMLElement, cols: number, rows: number) {
  const frag = document.createDocumentFragment();
  const tiles: HTMLElement[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const t = document.createElement('span');
    t.className = 'cvh__tile';
    frag.appendChild(t);
    tiles.push(t);
  }
  host.appendChild(frag);
  // En píxeles y con 1 px de solape, para que no asomen juntas entre fragmentos
  const size = () => {
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    const tw = w / cols;
    const th = h / rows;
    tiles.forEach((t, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      // Las esquinas del retrato, redondeadas como la foto final
      const tl = c === 0 && r === 0, tr = c === cols - 1 && r === 0, bl = c === 0 && r === rows - 1, br = c === cols - 1 && r === rows - 1;
      const radius = [tl, tr, br, bl].map((on) => (on ? 'var(--f-r-media)' : '0')).join(' ');
      t.style.cssText = `left:${c * tw}px;top:${r * th}px;width:${tw + (c < cols - 1 ? 1 : 0)}px;height:${th + (r < rows - 1 ? 1 : 0)}px;border-radius:${radius};background-size:${w}px ${h}px;background-position:${-c * tw}px ${-r * th}px`;
    });
  };
  size();
  return { tiles, size };
}

/** Posición de un elemento dentro de un antepasado, sin contar transformaciones. */
function offsetIn(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // ── Scroll suave ─────────────────────────────────────────────
  const lenis = new Lenis({ lerp: 0.09, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // ── 1 · Apertura: línea, nombre, menú y barra ────────────────
  const hero = $('[data-cvh]');
  const stage = $('.cvh__stage', hero);
  const title = $('[data-title]', hero);
  const name = $('[data-name]', hero);
  const chars = $$('[data-split]', hero).flatMap(splitChars);
  const nav = $('[data-nav]');
  let seen = false;
  try {
    seen = sessionStorage.getItem('cv-intro') === '1';
    sessionStorage.setItem('cv-intro', '1');
  } catch {
    // Sin almacenamiento: la apertura entera.
  }

  gsap.set(chars, { yPercent: 110 });
  gsap.set(nav, { yPercent: 160 });
  const intro = gsap.timeline({ defaults: { ease: EASE_OUT }, delay: 0.15 });
  intro
    .fromTo('[data-line]', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, ease: EASE_MOVE })
    .to('[data-line]', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.7, ease: EASE_MOVE }, '+=0.05')
    .to(chars, { yPercent: 0, duration: 1, stagger: 0.045 }, '<0.1')
    .fromTo($$('[data-menu] a'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
    .to(nav, { yPercent: 0, duration: 0.9 }, '-=0.5')
    .fromTo('[data-hint]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
  if (seen) intro.timeScale(2.2);

  // ── 2 · El nombre se coloca junto al retrato, que se monta en 3D ──
  const portrait = $('[data-portrait]', hero);
  const small = innerWidth < 700;
  const { tiles, size: sizeTiles } = buildTiles(portrait, small ? 6 : 8, small ? 8 : 10);
  ScrollTrigger.addEventListener('refresh', sizeTiles);
  const flip = () => {
    const from = offsetIn(title, stage);
    const to = offsetIn(name, stage);
    return { x: to.x - from.x, y: to.y - from.y, s: name.offsetWidth / title.offsetWidth };
  };

  gsap.set(title, { transformOrigin: '0% 0%' });
  const heroTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=230%', scrub: true, pin: stage, invalidateOnRefresh: true },
  });
  heroTl
    .to('[data-menu]', { opacity: 0, y: -12, duration: 0.1 }, 0)
    .to('[data-hint]', { opacity: 0, duration: 0.05 }, 0)
    .to(title, { x: () => flip().x, y: () => flip().y, scale: () => flip().s, duration: 0.42, ease: 'power2.inOut' }, 0)
    .set(title, { opacity: 0 }, 0.43)
    .set(name, { opacity: 1 }, 0.43)
    .fromTo(
      tiles,
      {
        x: () => rand(-0.7, 0.7) * innerWidth,
        y: () => rand(-0.8, 0.8) * innerHeight,
        z: () => rand(-1800, 700),
        rotationX: () => rand(-110, 110),
        rotationY: () => rand(-110, 110),
        opacity: 0,
      },
      { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: { amount: 0.22, from: 'random' } },
      0.06,
    )
    .fromTo(portrait, { rotationY: 38, rotationX: 10 }, { rotationY: 0, rotationX: 0, duration: 0.7 }, 0)
    .fromTo('[data-bio]', { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.25 }, 0.36)
    .to('.cvh__still', { opacity: 1, duration: 0.04 }, 0.6)
    .set(tiles, { opacity: 0 }, 0.69);

  // Al mover el ratón, el retrato gira un poco (decorativo, solo con ratón)
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const space = $('[data-space]', hero);
    const rx = gsap.quickTo(space, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(space, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      ry((e.clientX / innerWidth - 0.5) * 12);
      rx((e.clientY / innerHeight - 0.5) * -8);
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  });

  // ── 3 · Trabajos: con las luces apagadas, los vídeos suben y la categoría se marca ──
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
  const links = $$('[data-cat-link]', works);
  $$('[data-cat]', works).forEach((group) =>
    ScrollTrigger.create({
      trigger: group,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) links.forEach((a) => a.classList.toggle('is-active', a.dataset.catLink === group.dataset.cat));
      },
    }),
  );
  $$('[data-card]', works).forEach((card) =>
    gsap.fromTo(
      card,
      { z: -700, rotationX: 20, yPercent: 25, opacity: 0 },
      { z: 0, rotationX: 0, yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 105%', end: 'top 50%', scrub: true } },
    ),
  );

  // ── 4 · Más de 6 años: las fotos llegan desde el fondo y flotan ──
  gsap.fromTo('[data-rule]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-rule]', start: 'top 90%', end: 'top 50%', scrub: true } });
  const years = $('[data-years]');
  $$('[data-float]', years).forEach((f) => {
    gsap.fromTo(
      f,
      { z: () => rand(-1700, -700), rotationX: () => rand(-45, 45), rotationY: () => rand(-45, 45), opacity: 0 },
      { z: 0, rotationX: 0, rotationY: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: years, start: 'top 95%', end: 'center 55%', scrub: true } },
    );
    gsap.to(f, { yPercent: rand(-60, 60), ease: 'none', scrollTrigger: { trigger: years, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('.cvy__title', { scale: 0.86, opacity: 0.15 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: years, start: 'top 85%', end: 'center 50%', scrub: true } });

  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const value = { v: Number(el.dataset.from || 0) };
    const fmt = () => (el.textContent = decimals ? value.v.toFixed(decimals).replace('.', ',') : String(Math.round(value.v)));
    fmt();
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(value, { v: to, duration: 1.2, ease: EASE_OUT, onUpdate: fmt }) });
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
    ScrollTrigger.removeEventListener('refresh', sizeTiles);
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
