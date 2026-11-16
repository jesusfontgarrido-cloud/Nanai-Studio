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
  (window as unknown as { __lenis?: unknown }).__lenis = lenis; // para las pruebas de capturas
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
    // ── El hero: la foto baja más despacio que el texto y se acerca despacio (nunca parece parada).
    // Se mueve el <picture>, no la imagen, para no pisar el enfoque de entrada que ya lleva la foto.
    const heroPic = document.querySelector<HTMLElement>('.fhero__photo picture');
    if (heroPic) {
      gsap.set(heroPic, { scale: 1.1, transformOrigin: '50% 40%' });
      gsap.to(heroPic, {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      });
      // Respiración lenta (≈ 16 s), casi imperceptible
      gsap.to(heroPic, { scale: 1.16, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // ── Fotos que suben con desenfoque, como la del hero (p. ej. el retrato de Jesús) ──
    $$<HTMLElement>('[data-rise]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: 16, opacity: 0, filter: 'blur(20px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: true } },
      );
    });

    // ── Las luces se apagan (como en el CV): mientras el trabajo o el pie están a la vista,
    // la página entera es la sala de proyección. Al salir hacia abajo, se encienden de golpe.
    const flat = document.querySelector<HTMLElement>('.flat');
    const darkRooms = $$<HTMLElement>('.sec.tone-dark');
    if (flat && darkRooms.length) {
      const active = new Set<HTMLElement>();
      const snap = () => {
        flat.classList.add('is-snap');
        requestAnimationFrame(() => requestAnimationFrame(() => flat.classList.remove('is-snap')));
      };
      darkRooms.forEach((room) =>
        ScrollTrigger.create({
          trigger: room,
          // El trabajo se apaga cuando su titular llega a media pantalla; el pie, en cuanto asoma
          start: room.matches('footer') ? 'top 65%' : 'top 55%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) active.add(room);
            else active.delete(room);
            if (!self.isActive && self.direction === 1 && !active.size) snap();
            flat.classList.toggle('is-dark', active.size > 0);
          },
        }),
      );
    }

    // ── Las piezas de trabajo llegan desde el fondo y se enderezan; su ficha entra enfocándose ──
    $$<HTMLElement>('[data-card]').forEach((card) => {
      gsap.fromTo(
        card,
        { z: -420, rotationX: 14, yPercent: 16, opacity: 0, transformOrigin: '50% 100%' },
        { z: 0, rotationX: 0, yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 105%', end: 'top 55%', scrub: true } },
      );
      const data = card.querySelector('.fpiece__data');
      if (data) {
        gsap.fromTo(
          data,
          { opacity: 0, y: 18, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 65%', toggleActions: 'play none none reverse' } },
        );
      }
    });

    // ── Zoom: las imágenes se acercan al entrar (de 1,22 a 1) y su marco crece un poco ──
    $$<HTMLElement>('[data-zoom], .fpiece__media, .fphotos__open').forEach((box) => {
      const img = box.querySelector<HTMLElement>('img, video');
      if (!img) return;
      gsap.fromTo(img, { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom 45%', scrub: true } });
      if (box.hasAttribute('data-zoom')) {
        gsap.fromTo(box, { scale: 0.86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'center 55%', scrub: true } });
      }
    });

    // ── Titulares palabra a palabra: cada palabra sube desde su línea y se endereza, al ritmo
    // del scroll (sustituye a la entrada por líneas de flat.css en los titulares de sección) ──
    $$<HTMLElement>('[data-reveal="lines"]').forEach((title) => {
      const words = splitWords(title);
      if (!words.length) return;
      title.removeAttribute('data-reveal');
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 5, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: title, start: 'top 94%', end: 'top 58%', scrub: true } },
      );
    });

    // ── Banda cinética: las dos filas se deslizan en sentidos opuestos con el scroll ──
    $$<HTMLElement>('[data-band]').forEach((band) => {
      band.querySelectorAll<HTMLElement>('[data-band-row]').forEach((row) => {
        const dir = Number(row.dataset.bandRow);
        gsap.fromTo(
          row,
          { xPercent: dir < 0 ? 0 : -30 },
          { xPercent: dir < 0 ? -30 : 0, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    });

    // ── El logo del pie sube desde abajo al llegar al final ──
    const footLogo = document.querySelector<HTMLElement>('.ffooter__logo');
    if (footLogo) {
      gsap.fromTo(
        footLogo,
        { yPercent: 70, opacity: 0.2 },
        { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: footLogo.parentElement, start: 'top bottom', end: 'bottom bottom', scrub: true } },
      );
    }

    // ── Filas que entran en 3D, abatiéndose desde arriba (preguntas y listas) ──
    $$<HTMLElement>('[data-row]').forEach((row) =>
      gsap.fromTo(
        row,
        { rotationX: -70, z: -260, opacity: 0, transformOrigin: '50% 0%' },
        { rotationX: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 98%', end: 'top 70%', scrub: true } },
      ),
    );

    // La escena fijada de la home puede montarse antes o después: se ordena y se recalcula todo
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      if (heroPic) gsap.set(heroPic, { clearProps: 'all' });
    };
  });
}

/**
 * Parte un titular en palabras para animarlas: cada palabra va en una ventana (.fw) que la
 * recorta y su interior (.fw__i) es lo que se mueve. Los elementos internos (la cursiva de
 * acento, los fotogramas) se tratan como una palabra entera.
 */
function splitWords(title: HTMLElement) {
  const inner: HTMLElement[] = [];
  const wrap = (node: Node) => {
    const outer = document.createElement('span');
    outer.className = 'fw';
    const i = document.createElement('span');
    i.className = 'fw__i';
    outer.appendChild(i);
    node.parentNode!.insertBefore(outer, node);
    i.appendChild(node);
    inner.push(i);
  };
  const walk = (el: Element) => {
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = (node.textContent ?? '').split(/(\s+)/);
        if (!parts.some((p) => p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (!part.trim()) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const word = document.createTextNode(part);
          frag.appendChild(word);
        });
        const words = [...frag.childNodes].filter((n) => (n.textContent ?? '').trim());
        node.parentNode!.replaceChild(frag, node);
        words.forEach(wrap);
      } else if (node instanceof HTMLElement) {
        // Las líneas (span de bloque) se recorren; lo demás (cursiva, fotograma) va entero
        if (getComputedStyle(node).display === 'block' || node.tagName === 'SPAN' && !node.className) walk(node);
        else wrap(node);
      }
    });
  };
  walk(title);
  return inner;
}

/**
 * Lo que no es movimiento y va siempre (también con movimiento reducido o si GSAP no llega):
 * el índice lateral marca la sección que estás viendo y la barra se aclara sobre la foto del hero.
 */
function chrome() {
  const flat = document.querySelector<HTMLElement>('.flat');
  if (!flat) return;

  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-findex-link]')];
  if (links.length && 'IntersectionObserver' in window) {
    const mark = (id: string) => links.forEach((a) => a.classList.toggle('is-active', a.dataset.findexLink === id));
    mark(links[0].dataset.findexLink!);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && mark((e.target as HTMLElement).id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((a) => {
      const target = document.getElementById(a.dataset.findexLink!);
      if (target) io.observe(target);
    });
  }

  // Rueda de categorías de /trabajos: marca la que estás viendo y solo se ve en ese tramo
  const catLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-cat-link]')];
  if (catLinks.length && 'IntersectionObserver' in window) {
    const inView = new Set<string>();
    const markCat = (id: string) => {
      catLinks.forEach((a) => {
        const on = a.dataset.catLink === id;
        a.classList.toggle('is-active', on);
        // En móvil la fila se desplaza sola para que la activa quede a la vista
        const list = a.closest('ol');
        if (on && list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).id;
          if (e.isIntersecting) {
            inView.add(id);
            markCat(id);
          } else inView.delete(id);
        });
        flat.classList.toggle('in-works', inView.size > 0);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    catLinks.forEach((a) => {
      const target = document.getElementById(a.dataset.catLink!);
      if (target) io.observe(target);
    });
  }

  // Contador de scroll «(00)» a la izquierda, como en lukebaffait.fr
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  if (progress) {
    let queued = false;
    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
      progress.textContent = `(${String(Math.min(99, pct)).padStart(2, '0')})`;
    };
    paint();
    addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    }, { passive: true });
  }

  // Sin la escena (movimiento reducido): la barra de arriba aparece cuando la de la apertura se va
  const bar = document.querySelector<HTMLElement>('[data-bar]');
  if (bar && !document.documentElement.classList.contains('stage-js') && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => flat.classList.toggle('is-docked', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(bar);
  }

  // Sobre la foto del hero la barra va en claro, hasta que empieza el fundido con el papel
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    let ticking = false;
    const check = () => {
      ticking = false;
      const box = hero.getBoundingClientRect();
      flat.classList.toggle('on-photo', box.bottom - box.height * 0.3 > 72);
    };
    check();
    addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    }, { passive: true });
    addEventListener('resize', check);
  }
}

chrome();
if (root.classList.contains('motion')) start().catch(() => root.classList.remove('fx-ready'));
