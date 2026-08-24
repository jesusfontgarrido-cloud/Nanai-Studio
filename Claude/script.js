// ===================== Portfolio: lista de proyectos =====================
// Para reordenar/añadir/quitar, edita SOLO este array (id = ID de YouTube).
const projects = [
  { id: 'ZxRvXqU2u40', title: 'Quemando Vitamina',   artist: 'La2bleT',      type: 'Videoclip' },
  { id: 'lSBKnSD0No4', title: 'La Impostora',        artist: 'Ana Vas',      type: 'Videoclip' },
  { id: 'tqWtqHeIXnc', title: 'Lo que digan',        artist: 'Ana Vas',      type: 'Videoclip' },
  { id: 'BRB6WrXJZEA', title: 'Egoísta',             artist: 'Ana Vas',      type: 'Videoclip' },
  { id: 'Af81rQXx0Yo', title: 'A mí quién me salva', artist: 'Rubén Avilés', type: 'Videoclip' },
  { id: 'iq7kOCV1Mj4', title: 'Fama de Maleante',    artist: 'Ana Vas',      type: 'Videoclip' },
];
const sliderEl = document.getElementById('workSlider');
if (sliderEl) {
  sliderEl.innerHTML = projects
    .map(
      (p, i) => `
      <a class="work-card reveal" href="https://www.youtube.com/watch?v=${p.id}" target="_blank" rel="noopener" data-video="${p.id}" aria-label="Ver ${p.type.toLowerCase()}: ${p.title} — ${p.artist} en YouTube">
        <div class="work-card__media">
          <img class="work-card__img" src="https://i.ytimg.com/vi/${p.id}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${p.id}/mqdefault.jpg'" alt="${p.title} — ${p.artist}" width="1280" height="720" decoding="async" loading="${i < 2 ? 'eager' : 'lazy'}" ${i === 0 ? 'fetchpriority="high"' : ''} />
          <span class="work-card__play" aria-hidden="true">▶</span>
        </div>
        <div class="work-card__meta">
          <span class="work-card__type">${p.type}</span>
          <h3>${p.title}</h3>
          <span class="work-card__artist">${p.artist}</span>
        </div>
      </a>`
    )
    .join('');
}

// ===================== NAV: scroll-spy (ilumina la sección activa) =====================
const spyLinks = document.querySelectorAll('[data-spy]');
const setActive = (id) => {
  spyLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.spy === id));
};
const spySections = ['hero', 'proyectos', 'servicios', 'sobre', 'contacto']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ('IntersectionObserver' in window && spySections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      // La entrada que cruza la banda central marca la sección activa.
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  spySections.forEach((s) => spy.observe(s));
  setActive('hero');
}

// ===================== Reveal on scroll =====================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ===================== Lightbox de vídeo =====================
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const openLightbox = (videoId) => {
  if (!lightbox || !videoId) return;
  lightboxFrame.innerHTML =
    '<iframe src="https://www.youtube.com/embed/' + videoId +
    '?autoplay=1&rel=0&modestbranding=1" title="Vídeo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxFrame.innerHTML = ''; // detiene la reproducción
  document.body.style.overflow = '';
};
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

// ===================== Portfolio slider =====================
const slider = document.getElementById('workSlider');
if (slider) {
  // --- Flechas (PC) ---
  const arrows = document.querySelectorAll('.work__arrow');
  const step = () => {
    const card = slider.querySelector('.work-card');
    const gap = parseFloat(getComputedStyle(slider).columnGap || getComputedStyle(slider).gap || 16);
    return card ? card.offsetWidth + gap : slider.clientWidth * 0.8;
  };
  let snapTimer;
  arrows.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir === 'next' ? 1 : -1;
      // El scroll-snap mandatory cancela el scroll programático suave:
      // lo desactivamos durante la animación y lo restauramos al terminar.
      slider.style.scrollSnapType = 'none';
      slider.scrollBy({ left: dir * step(), behavior: 'smooth' });
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => { slider.style.scrollSnapType = ''; }, 600);
    });
  });

  const updateArrows = () => {
    const prev = document.querySelector('.work__arrow[data-dir="prev"]');
    const next = document.querySelector('.work__arrow[data-dir="next"]');
    if (!prev || !next) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth - 2;
    prev.disabled = slider.scrollLeft <= 2;
    next.disabled = slider.scrollLeft >= maxScroll;
  };
  slider.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();

  // --- Arrastre con ratón (drag to scroll) ---
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  // Nota: NO usamos setPointerCapture. Al capturar el puntero, Chrome
  // redirige el evento `click` al carrusel en lugar del enlace <a>, y eso
  // impedía que la tarjeta abriera YouTube en escritorio. En su lugar
  // escuchamos el movimiento a nivel de `window` mientras se arrastra.
  const onMove = (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) {
      moved = true;
      slider.classList.add('is-dragging');
    }
    slider.scrollLeft = startScroll - dx;
  };
  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', endDrag);
  };
  slider.addEventListener('pointerdown', (e) => {
    // Solo ratón/pen: el táctil ya hace scroll nativo
    if (e.pointerType === 'touch') return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = slider.scrollLeft;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  });

  // Click en tarjeta (salvo que haya sido un arrastre):
  //  - Escritorio (ratón): el enlace <a> abre el vídeo en YouTube en una
  //    pestaña nueva de forma nativa (no lo interceptamos).
  //  - Táctil/móvil: cancelamos el enlace y abrimos el reproductor (lightbox).
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  slider.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); moved = false; return; }
    const card = e.target.closest('.work-card[data-video]');
    if (!card) return;
    if (isDesktop) return; // deja pasar el enlace → YouTube en pestaña nueva
    e.preventDefault();
    openLightbox(card.dataset.video);
  });

  // Nota: NO interceptamos la rueda del ratón. Antes se convertía el scroll
  // vertical en horizontal, pero eso "atrapaba" el scroll vertical de la
  // página al pasar el cursor por encima del carrusel. Ahora la rueda vertical
  // siempre mueve la página; el carrusel se desplaza con las flechas ‹ ›, el
  // arrastre con ratón, o el gesto táctil/horizontal del trackpad.
}

// ===================== Formulario (Web3Forms) =====================
// Envía el formulario a Web3Forms por fetch (sin recargar) y muestra el
// estado en el botón + la nota inferior. Requiere pegar tu Access Key en el
// campo oculto `access_key` del HTML (se obtiene gratis en web3forms.com).
const form = document.getElementById('contactForm');
if (form) {
  const note = document.getElementById('formNote');
  const noteDefault = note ? note.textContent : '';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    const key = form.querySelector('[name="access_key"]');

    // Aviso claro si aún no se ha configurado la clave.
    if (!key || key.value.includes('TU_ACCESS_KEY')) {
      if (note) note.textContent = '⚠ Falta configurar la Access Key de Web3Forms en el HTML.';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Enviando…';
    if (note) note.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        btn.innerHTML = 'Recibido ✦';
        if (note) note.textContent = 'Recibido. Ahora toca darle forma — te escribimos pronto.';
        form.reset();
      } else {
        throw new Error(data.message || 'error');
      }
    } catch (err) {
      btn.innerHTML = original;
      if (note) note.textContent = 'Algo ha fallado. Revisa los datos o escríbenos directo por WhatsApp.';
    } finally {
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        if (note) note.textContent = noteDefault;
      }, 5000);
    }
  });
}
