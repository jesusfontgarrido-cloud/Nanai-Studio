/**
 * Escenas de la home de Nanai Studio (16-11-2026). La base es el CV de /jesus-font; el ritmo, de
 * lukebaffait.fr (solo inspiración): la página es un solo escenario que avanza con el scroll.
 *
 *  · Apertura (una vez por sesión; la segunda vez, más rápida): el logo se monta letra a letra
 *    y aparece la barra integrada de abajo.
 *  · Escena del hero (fijada, ligada al scroll): al cargar solo el logo; al bajar, la foto sube
 *    como una tarjeta desenfocada y con los bordes fundidos, se enfoca y hace zoom hasta la
 *    pantalla completa; la barra se va y aparece arriba (FlatDock); al final entran el logo
 *    pequeño, el claim y los botones.
 *  · Cómo trabajamos: las fotos llegan desde el fondo y flotan; el titular y los frentes entran.
 *
 * Criterio (skills de Emil Kowalski): lo ligado al scroll avanza 1:1 (Lenis pone la suavidad, en
 * flat-fx.ts); las entradas, con ease-out fuerte; solo transform, opacity, clip-path, filter
 * (poco) y canvas. Con movimiento reducido no se monta nada y todo se ve quieto.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const EASE_OUT = 'expo.out';
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const flat = $('.flat');
const stage = $('[data-stage]');

if (stage && flat && root.classList.contains('stage-js')) {
  root.classList.add('stage-ready');
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const pin = $('[data-stage-pin]', stage)!;
    const card = $('[data-stage-card]', stage)!;
    const frame = $('[data-frame]', stage)!;
    const pic = $('[data-pic]', stage)!;
    const logo = $('[data-logo]', stage)!;
    const glyphs = $$<SVGPathElement>('[data-logo] path', stage);
    const red = $$<SVGPathElement>('[data-logo] path[data-red]', stage);
    const ink = glyphs.filter((g) => !red.includes(g));
    const overItems = [$('[data-mini]', stage), ...$$('[data-over-item]', stage)].filter(Boolean) as HTMLElement[];

    // Tamaño de la tarjeta cuando asoma (fracción de la pantalla) y desde dónde sube
    const small = () => (innerWidth < 720 ? 0.6 : 0.4);
    const rise = () => innerHeight * 0.62;
    const RADIUS = 22;

    // ── Apertura: el logo letra a letra y la barra (la foto no se ve hasta que bajas) ──
    let seen = false;
    try {
      seen = sessionStorage.getItem('nanai-intro') === '1';
      sessionStorage.setItem('nanai-intro', '1');
    } catch {
      // Sin almacenamiento: la apertura entera.
    }
    gsap.set(ink, { y: 74 });
    gsap.set(red, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(overItems, { opacity: 0, y: 30, filter: 'blur(12px)' });
    const intro = gsap.timeline({ defaults: { ease: EASE_OUT }, delay: 0.2 });
    intro
      .to(ink, { y: 0, duration: 1.1, stagger: 0.05 })
      .to(red, { scale: 1, duration: 0.7 }, '-=0.55')
      .fromTo('[data-bar]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .fromTo('[data-hint]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
    if (seen) intro.timeScale(2.4);

    // ── Escena del hero, ligada al scroll: la tarjeta hace zoom hasta la pantalla completa ──
    let docked = false;
    const setDock = (on: boolean) => {
      if (on === docked) return;
      docked = on;
      flat.classList.toggle('is-docked', on);
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=110%',
        scrub: true,
        pin,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Si alguien baja durante la apertura, la apertura se termina al momento
          if (self.progress > 0.01 && intro.isActive()) intro.progress(1);
          setDock(self.progress > 0.06);
          flat.classList.toggle('on-photo', self.progress > 0.62);
        },
        onLeave: () => setDock(true),
      },
    });

    tl.to('[data-hint]', { opacity: 0, duration: 0.05 }, 0)
      .to('[data-bar]', { opacity: 0, y: 26, duration: 0.08 }, 0)
      // El logo sube, se aleja y se desenfoca mientras la foto se acerca
      .to(logo, { y: () => -innerHeight * 0.2, scale: 0.86, opacity: 0, filter: 'blur(12px)', duration: 0.5, ease: 'power1.in' }, 0)
      // La foto sube desde abajo como una tarjeta pequeña y hace zoom hasta la pantalla completa
      .fromTo(card, { scale: small, y: rise, opacity: 0 }, { scale: 1, y: 0, duration: 0.74, ease: 'power2.inOut' }, 0)
      .to(card, { opacity: 1, duration: 0.16 }, 0)
      .fromTo(frame, { borderRadius: () => RADIUS / small() }, { borderRadius: 0, duration: 0.74, ease: 'power2.inOut' }, 0)
      // Entra desenfocada (desenfoque gaussiano) y con los bordes fundidos en degradado; se enfoca y se abre
      .fromTo(pic, { filter: 'blur(24px)' }, { filter: 'blur(0px)', duration: 0.56, ease: 'power2.in' }, 0.04)
      .fromTo(frame, { '--feather-a': '6%', '--feather-b': '66%' }, { '--feather-a': '100%', '--feather-b': '150%', duration: 0.6, ease: 'power2.in' }, 0.04)
      // Contrazoom dentro de la foto: da profundidad
      .fromTo(pic, { scale: 1.28 }, { scale: 1.04, duration: 0.8 }, 0)
      .fromTo('[data-shade]', { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.62)
      // Con la foto entera, entra lo demás enfocándose
      .to(overItems, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.16, stagger: 0.04 }, 0.7)
      .to({}, { duration: 0.06 });

    // El tramo fijado mueve todo lo de debajo: lo demás se recalcula
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Con ratón, la foto se inclina un poco hacia donde miras (decorativo)
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const rx = gsap.quickTo(pic, 'rotationX', { duration: 1, ease: 'power3.out' });
      const ry = gsap.quickTo(pic, 'rotationY', { duration: 1, ease: 'power3.out' });
      gsap.set(pic, { transformPerspective: 1600 });
      const move = (e: PointerEvent) => {
        ry((e.clientX / innerWidth - 0.5) * 4);
        rx((e.clientY / innerHeight - 0.5) * -3);
      };
      addEventListener('pointermove', move);
      return () => removeEventListener('pointermove', move);
    });

    return () => {
      flat.classList.remove('is-docked', 'on-photo');
    };
  });
}

// ── Cómo trabajamos: como «Más de 6 años» del CV ──────────────────
const about = $('[data-about]');
if (about && root.classList.contains('motion')) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const stageEl = $('[data-about-stage]', about)!;
    const floats = $$('[data-float]', about);
    floats.forEach((f, i) => {
      gsap.fromTo(
        f,
        { z: () => rand(-1400, -800), rotationY: () => rand(-25, 25), opacity: 0 },
        { z: 0, rotationY: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: stageEl, start: 'top 95%', end: 'center 60%', scrub: true } },
      );
      // Al irse, dos de ellas vienen hacia la pantalla
      if (i % 2 === 0) {
        gsap.fromTo(
          f,
          { z: 0, opacity: 1 },
          { z: 520, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: stageEl, start: 'center 35%', end: 'bottom top', scrub: true } },
        );
      }
    });
    // Flotación suave de todo lo que hay alrededor del titular (también lo de dentro)
    $$('[data-bob]', about).forEach((el, i) => {
      const big = el.classList.contains('fabout__bob');
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
      $$('.fabout__line, .fabout__label, .fabout__sub', about),
      { opacity: 0, y: 60, filter: 'blur(12px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.12, ease: 'none', scrollTrigger: { trigger: stageEl, start: 'top 80%', end: 'center 55%', scrub: true } },
    );
    // Los cuatro frentes entran girando un poco hacia ti
    gsap.fromTo(
      $$('.fabout__item', about),
      { rotationX: -50, y: 40, opacity: 0, transformOrigin: '50% 100%' },
      { rotationX: 0, y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: EASE_OUT, scrollTrigger: { trigger: $('[data-about-grid]', about), start: 'top 85%' } },
    );
    // Con ratón, cada foto se desplaza según su profundidad
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const movers = floats.map((f) => ({ depth: Number(f.dataset.depth || 1), x: gsap.quickTo(f, 'x', { duration: 1.2, ease: 'power3.out' }) }));
      const move = (e: PointerEvent) => movers.forEach((m) => m.x((e.clientX / innerWidth - 0.5) * -40 * m.depth));
      addEventListener('pointermove', move);
      return () => removeEventListener('pointermove', move);
    });
  });
}

