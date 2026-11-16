/**
 * CV de Jesús Font para /jesus-font. La base sale de su CV en PDF
 * («Jesús Font - Filmmaker creativo», noviembre de 2026). El 15-11-2026 Jesús pidió ampliar
 * el perfil: además de filmmaker, crea con IA webs, apps y automatizaciones (`builds`).
 * Todo lo que hay aquí es real; no añadir proyectos, clientes ni cifras que no existan.
 */

export const cv = {
  name: 'Jesús Font',
  fullName: 'Jesús Font Garrido',
  role: 'Filmmaker y desarrollador con IA',
  city: 'Dos Hermanas, Sevilla',
  email: 'jesusfontgarrido@gmail.com',
  phone: '689 02 64 20',
  whatsapp: 'https://wa.me/34689026420?text=' + encodeURIComponent('Hola Jesús, he visto tu CV en la web de Nanai.'),
  // Sin portfolio aparte: su portfolio es la web de Nanai Studio (decisión del usuario, 12-11-2026).
  /** Píldora «Ahora mismo» (sale de su experiencia actual). */
  now: 'Filmmaker creativo en Traders Business School',
  /** Punto verde junto al retrato: lo pidió el usuario (12-11-2026). */
  available: 'Aceptando nuevos proyectos',

  claim: 'Siempre hay que empezar por los datos.',
  /** Presentación del hero, dictada por Jesús el 15-11-2026: datos → filmmaker → IA → navaja suiza. */
  intro: [
    'Mi base es el marketing audiovisual: anuncios para paid media con un objetivo medible. Antes de grabar, los datos dicen a qué avatar va cada pieza y con qué gancho abre; después, cuáles se escalan y cuáles se retiran.',
    'Con los años he crecido como filmmaker creativo y he encontrado una segunda pasión: construir herramientas con IA. Webs, apps y automatizaciones que quitan trabajo manual a cada proceso.',
  ],
  allInOne:
    'En una sola persona: grabación, fotografía y producción; diseño y desarrollo de webs, apps y herramientas; y gestión de performance. La misma persona de la idea a los resultados, con menos traspasos y menos briefings.',
  /** Para la descripción de los datos estructurados. */
  get summary() {
    return this.intro.join(' ');
  },

  numbers: [
    { value: 100, prefix: '+', suffix: '', label: 'piezas para campañas de Traders Business School desde 2025' },
    { value: 100, prefix: '+', suffix: 'k€', label: 'por encima del objetivo de beneficio mensual a finales de 2025' },
    { value: 9.2, prefix: '', suffix: '', decimals: 1, label: 'de nota media en el Grado Superior de Imagen' },
    { value: 2019, prefix: '', suffix: '', plain: true, label: 'el año en que empecé como filmmaker independiente' },
  ],

  experience: [
    {
      dates: 'feb. 2025 – actualidad',
      role: 'Filmmaker creativo y fotógrafo',
      org: 'Traders Business School',
      current: true,
      tags: ['Paid media', 'Producción', 'Fotografía', 'IA audiovisual'],
      link: { href: '#cat-marcas', label: 'Ver trabajo' },
      points: [
        'Más de 100 piezas para campañas desde 2025, dentro del equipo de marketing.',
        'Decido las creatividades con datos: leo ROAS, CTR y coste por lead para saber qué se escala, qué se itera y qué se retira.',
        'Hago con IA el informe mensual de anuncios de Google y Meta que usa el equipo.',
        'Superamos en 100k€ el objetivo de beneficio mensual a finales de 2025.',
      ],
    },
    {
      dates: 'ago. 2025 – actualidad',
      role: 'Director',
      org: 'Nanai Studio, productora creativa',
      current: true,
      tags: ['Dirección creativa', 'Preproducción', 'Producción', 'Postproducción'],
      link: { href: '/trabajos', label: 'Ver portfolio' },
      points: [
        'Dirección creativa de preproducción, producción y postproducción para Ana Vas y La2bleT, entre otros.',
        'La web, la marca y las herramientas internas del estudio también son mías, hechas con IA.',
      ],
    },
    {
      dates: '2025',
      role: 'Jefe de equipo de cámara y fotografía',
      org: 'Festival de Cortometrajes de Sevilla',
      tags: ['Cámara', 'Fotografía', 'Coordinación'],
      points: ['Equipo de cámara del festival y coordinación de operadores durante la gala.'],
    },
    {
      dates: 'mar. 2019 – actualidad',
      role: 'Filmmaker y fotógrafo',
      org: 'Profesional independiente',
      current: true,
      tags: ['Redes', 'Publicidad', 'Eventos y bodas', 'Podcast'],
      link: { href: '#cat-social', label: 'Ver trabajo' },
      points: [
        'Contenido para redes: Rubén Avilés, Zeling y Ana Vas, entre otros.',
        'Vídeo de marca y publicidad; eventos y bodas.',
        'Podcast «Con Arte».',
      ],
    },
  ],

  /** Escala de las etiquetas: del rojo de Nanai al gris (15-11-2026, fuera los pasteles). */
  tagScale: ['#D9291C', '#B4483D', '#8A8A84', '#5A5A56'],

  /** Colores de las cápsulas del CV en papel: la misma escala roja y gris. */
  tools: [
    { name: 'Premiere Pro', color: '#D9291C' },
    { name: 'After Effects', color: '#8A8A84' },
    { name: 'DaVinci Resolve', color: '#B4483D' },
    { name: 'Photoshop', color: '#BDBDB6' },
    { name: 'Lightroom', color: '#E06A5E' },
    { name: 'Magnific', color: '#5A5A56' },
    { name: 'Claude Code', color: '#D9291C' },
    { name: 'HeyGen', color: '#8A8A84' },
    { name: 'ElevenLabs', color: '#B4483D' },
    { name: 'Higgsfield', color: '#BDBDB6' },
    { name: 'ComfyUI', color: '#E06A5E' },
    { name: 'Astro', color: '#5A5A56' },
    { name: 'Cloudflare', color: '#D9291C' },
  ],

  skills: [
    {
      title: 'Producción',
      text: 'Dirección de fotografía, iluminación, etalonaje, multicámara y dirección de equipos.',
    },
    {
      title: 'Datos',
      text: 'Lectura de ROAS, CTR y coste por lead para decidir qué creatividad se escala, se itera o se retira; testing de ganchos y variantes por avatar.',
    },
    {
      title: 'IA audiovisual',
      text: 'Vídeo generado desde cero (plano, movimiento, voz y música) y en el flujo clásico: storyboard, upscaling, rotoscopia y variantes. ComfyUI en local.',
    },
    {
      title: 'Webs y automatización',
      text: 'Webs, apps y flujos de trabajo hechos con IA, del diseño a la publicación. Si un proceso se repite, lo convierto en herramienta.',
    },
  ],

  /** Lo que construye con IA (15-11-2026). Mismo formato que la experiencia. */
  builds: [
    {
      kind: 'Webs',
      title: 'Webs con diseño propio',
      org: 'nanaistudio.es, Nanai Weddings y este CV',
      tags: ['Diseño web', 'Astro', 'Cloudflare', 'SEO'],
      link: { href: '/', label: 'Ver nanaistudio.es' },
      points: [
        'Diseño, código y publicación de principio a fin, con Claude Code.',
        'Animación, formularios, reseñas de Google y SEO incluidos.',
      ],
    },
    {
      kind: 'Vídeo',
      title: 'Montaje automatizado',
      org: 'DaVinci Resolve y Claude',
      tags: ['DaVinci Resolve', 'Claude', 'Agentes', 'Subtítulos'],
      points: [
        'En DaVinci Resolve: flujos que ordenan los brutos, quitan silencios, subtitulan y exportan con mis normas de estilo, para reels, carruseles y el largo de una boda.',
        'Dentro de Claude: un equipo de agentes (guionista, editor y revisor) que no da un corte por bueno hasta que pasa la revisión.',
      ],
    },
    {
      kind: 'Apps',
      title: 'Herramientas internas',
      org: 'Nanai Studio y la cooperativa Wonder Team',
      tags: ['Gestión', 'Base de datos', 'Cloudflare'],
      points: ['Nuestro propio Notion: proyectos, agenda, tareas y fichas de boda en un solo sitio, en la nube y con acceso por invitación.'],
    },
    {
      kind: 'Agentes',
      title: 'Asistentes con criterio de marca',
      org: 'Skills de Claude',
      tags: ['Claude', 'Prompting', 'Marca'],
      points: ['Le enseño a la IA el estilo de cada marca (TBS, Nanai) para que cada pieza salga con su estilo sin repetir instrucciones.'],
    },
  ],

  education: [
    {
      dates: '2019 – 2021',
      title: 'Grado Superior en Iluminación, Captación y Tratamiento de la Imagen',
      org: 'I.E.S. Néstor Almendros',
      text: 'Nota media 9,2; operación de cámara y dirección de fotografía.',
    },
    {
      dates: '2017 – 2019',
      title: 'Grado Medio en Instalaciones de Telecomunicaciones',
      org: 'CPIFP Los Viveros',
    },
    {
      dates: 'Curso',
      title: 'Paid media y creatividad de respuesta directa',
      text: 'Avatar de cliente, ángulos de venta, ganchos y replicación de ideas que ya funcionan.',
    },
    {
      dates: 'Curso',
      title: 'IA audiovisual aplicada',
      text: 'Consistencia de personaje e imagen, ahorro de créditos y generación local con ComfyUI.',
    },
    {
      dates: 'Siempre',
      title: 'Formación constante',
      text: 'Sigo formándome en IA, automatización y performance, y lo que aprendo lo aplico al trabajo.',
    },
  ],

  closing: 'Hay más que contar, pero no cabe todo en un solo folio.',
} as const;
