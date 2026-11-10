/**
 * Escenas del CV de Jesús Font (/jesus-font).
 *
 * Criterio (skill de Emil Kowalski): lo ligado al scroll avanza 1:1 con él (scrub) y Lenis
 * pone la suavidad; las entradas, con ease-out fuerte; solo transform, opacity y clip-path.
 * Todo vive dentro de gsap.matchMedia: con movimiento reducido no se monta nada y la página
 * se queda quieta y completa (html.cv-js no se pone).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const EASE_OUT = 'expo.out'; // ≈ cubic-bezier(0.23, 1, 0.32, 1)
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];

/** Parte una palabra en letras (para la entrada del nombre). */
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

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // ── Scroll suave ─────────────────────────────────────────────
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // ── 1 · Hero ─────────────────────────────────────────────────
  const hero = $('[data-cvh]');
  const stage = $('.cvh__stage', hero);
  const pill = $('[data-pill]', hero);
  const media = $('[data-media]', hero);
  const words = $$('[data-split]', hero);
  const chars = words.flatMap(splitChars);

  // Recorte de la imagen grande que coincide con la píldora del titular
  const pillInset = () => {
    const m = media.getBoundingClientRect();
    const p = pill.getBoundingClientRect();
    return `inset(${p.top - m.top}px ${m.right - p.right}px ${m.bottom - p.bottom}px ${p.left - m.left}px round ${p.height / 2}px)`;
  };
  const radius = () => getComputedStyle(media).getPropertyValue('--radius').trim() || '24px';

  // Entrada al cargar: letras y luego la píldora
  gsap.from(chars, { yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.035, ease: EASE_OUT, delay: 0.1 });
  gsap.from(media, { opacity: 0, scale: 0.96, duration: 0.8, ease: EASE_OUT, delay: 0.35, transformOrigin: '50% 50%' });

  const heroTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=140%', scrub: true, pin: stage, invalidateOnRefresh: true },
  });
  heroTl
    .fromTo(media, { clipPath: pillInset }, { clipPath: () => `inset(0px 0px 0px 0px round ${radius()})`, duration: 1 }, 0)
    // En la píldora se ve tu cara; al abrirse, la cámara se aleja hasta el plano entero
    .fromTo($$('.cvh__img', media), { xPercent: -24, yPercent: 10, scale: 1.2 }, { xPercent: 0, yPercent: 0, scale: 1, duration: 1 }, 0)
    .to(words[0], { xPercent: -60, opacity: 0, duration: 0.6 }, 0)
    .to(words[1], { xPercent: 60, opacity: 0, duration: 0.6 }, 0)
    .to('[data-hero-fade]', { opacity: 0, duration: 0.25 }, 0)
    .to('[data-color]', { opacity: 1, duration: 0.6 }, 0.35)
    .fromTo('[data-caption]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.25 }, 0.8);

  // ── 2 · El lema: palabra a palabra, y el retrato enfoca a la vez ──
  const claim = $('[data-cvl]');
  gsap
    .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: claim, start: 'top top', end: '+=130%', scrub: true, pin: $('.cvl__stage', claim) } })
    .fromTo($$('.cvl__w', claim), { opacity: 0.14 }, { opacity: 1, stagger: 0.25, duration: 0.25 }, 0)
    .fromTo('[data-focus]', { filter: 'blur(16px)', scale: 1.08 }, { filter: 'blur(0px)', scale: 1, duration: 1 }, 0)
    .fromTo('[data-summary]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 });

  // La curva roja se dibuja al pasar por las cifras
  const curve = $<SVGPathElement>('[data-curve]');
  const len = curve.getTotalLength();
  gsap.fromTo(
    curve,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-cvn]', start: 'top 85%', end: 'bottom 25%', scrub: true } },
  );

  // ── 3 · Cifras: cuentan una vez al entrar ────────────────────
  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const value = { v: Number(el.dataset.from || 0) };
    const fmt = () => (el.textContent = decimals ? value.v.toFixed(decimals).replace('.', ',') : String(Math.round(value.v)));
    fmt();
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(value, { v: to, duration: 1.2, ease: EASE_OUT, onUpdate: fmt }),
    });
  });

  // ── 4 · Experiencia: en escritorio la sección se fija y el scroll cambia de puesto ──
  mm.add('(min-width: 900px)', () => {
    const section = $('[data-cvx]');
    const items = $$('[data-item]', section);
    const shots = $$('[data-shot]', section);
    let current = -1;
    const show = (i: number) => {
      if (i === current) return;
      current = i;
      items.forEach((el, k) => el.classList.toggle('is-active', k === i));
      shots.forEach((el, k) => el.classList.toggle('is-active', k === i));
    };
    show(0);
    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=12',
      end: `+=${items.length * 55}%`,
      pin: true,
      onUpdate: (self) => show(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
    });
    return () => {
      items.forEach((el) => el.classList.remove('is-active'));
      shots.forEach((el) => el.classList.remove('is-active'));
    };
  });

  // ── 5 · Competencias: las cápsulas caen y se pueden mover ────
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
        { opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: 'back.out(1.3)', stagger: 0.06 },
      ),
  });
  Draggable.create(tools, { bounds: table, inertia: true, edgeResistance: 0.75, zIndexBoost: true });

  // ── 6 · Formación: la línea crece con el scroll ──────────────
  gsap.fromTo(
    '[data-edu]',
    { '--edu': 0 },
    { '--edu': 1, ease: 'none', scrollTrigger: { trigger: '[data-edu]', start: 'top 75%', end: 'bottom 55%', scrub: true } },
  );

  // Las fuentes y las imágenes cambian medidas: se recalcula al terminar de cargar
  addEventListener('load', () => ScrollTrigger.refresh());

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
