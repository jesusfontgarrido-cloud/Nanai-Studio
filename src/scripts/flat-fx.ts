/**
 * Movimiento ligado al scroll de la web (home, /trabajos y /sobre-nosotros), trasladado del CV.
 *
 * Criterio (skill de Emil Kowalski): lo que va con el scroll avanza 1:1 y Lenis pone la suavidad;
 * solo se animan transform, opacity y filter; poco y bien: parallax en las fotos grandes, una
 * entrada 3D muy leve en las piezas de trabajo y un movimiento lento y continuo en el hero.
 * Nada de esto lleva información: sin JS, sin movimiento reducido o si algo falla, la página
 * se ve quieta y completa. Las entradas con desenfoque viven en flat.css (§ Movimiento).
 */
const root = document.documentElement;

async function start() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('fx-ready');

  // ── Scroll suave ─────────────────────────────────────────────
  const lenis = new Lenis({
    lerp: 0.1,
    anchors: true,
    // El visor de fotos y el reproductor (diálogos) y lo marcado manualmente scrollean solos.
    prevent: (node: Element) => Boolean(node.closest('dialog[open], [data-lenis-prevent]')),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // La apertura bloquea la página: Lenis espera a que se encienda la cámara.
  if (root.classList.contains('has-opener')) {
    lenis.stop();
    window.addEventListener('nanai:opened', () => lenis.start(), { once: true });
    new MutationObserver((_, obs) => {
      if (!root.classList.contains('has-opener')) {
        lenis.start();
        obs.disconnect();
      }
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // ── Parallax en las fotos: la imagen se desplaza dentro de su marco, más despacio que la página.
    // El marco ya recorta (overflow: hidden); la foto crece un poco para que no asome el borde.
    // Se mueve con las propiedades individuales translate/scale vía variables CSS (no pisan el transform ni su transición del rack focus).
    const parallax = (selector: string, amount: number, scale: number) =>
      $$<HTMLElement>(selector).forEach((img, i) => {
        const frame = img.parentElement!.closest<HTMLElement>('figure, button, span, li') ?? img.parentElement!;
        // Cada foto con su propia profundidad (las de columna par, algo menos): da relieve a la rejilla
        const k = amount * (i % 2 ? 0.7 : 1);
        img.style.scale = `var(--sc, ${scale})`;
        img.style.translate = '0 var(--py, 0%)';
        gsap.fromTo(
          img,
          { '--py': `${-k}%` },
          { '--py': `${k}%`, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

    parallax('.fmethod__img img', 5, 1.14);
    parallax('.fmanifesto__portrait img', 4, 1.12);
    parallax('.fpage__photo img', 6, 1.16);
    parallax('.fgallery__open img', 4, 1.1);

    // El hero baja más despacio que el texto y se acerca despacio: nunca parece parado.
    const heroImg = document.querySelector<HTMLElement>('.fhero__photo img');
    if (heroImg) {
      heroImg.style.scale = 'var(--sc, 1.12)';
      heroImg.style.translate = '0 var(--py, 0%)';
      gsap.to(heroImg, {
        '--py': '7%',
        ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      });
      // Respiración lenta (≈ 16 s), casi imperceptible, solo con la foto a la vista
      gsap.to(heroImg, { '--sc': 1.18, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // ── 3D muy leve: las piezas de trabajo se enderezan al llegar (sin pasar de ~8°) ──
    $$<HTMLElement>('.fpiece__media').forEach((media) => {
      gsap.fromTo(
        media,
        { transformPerspective: 1100, rotationX: 8, z: -90, transformOrigin: '50% 100%' },
        {
          rotationX: 0,
          z: 0,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top 105%', end: 'top 62%', scrub: 0.5 },
        },
      );
    });

    addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      $$<HTMLElement>('.fhero__photo img, .fmethod__img img, .fmanifesto__portrait img, .fpage__photo img, .fgallery__open img').forEach((el) => { el.style.scale = ''; el.style.translate = ''; });
    };
  });
}

if (root.classList.contains('motion')) start().catch(() => root.classList.remove('fx-ready'));
