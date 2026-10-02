/**
 * Textos de la web. Cada uno indica su origen; los marcados «propuesta» esperan aprobación.
 *
 * Reestructuración del 24-09: Nanai Studio es una productora audiovisual creativa dirigida
 * por Jesús Font, con dos públicos y solo dos (Marcas · Artistas y creadores). Primero
 * claridad, después personalidad. Nada de resultados, clientes ni métricas que no existan.
 */

/**
 * Titulares con gesto: lo que va entre asteriscos sale en Playfair cursiva (FlatEm).
 * Para usar el texto limpio (title, aria-label), plain().
 */
export const plain = (text: string) => text.replace(/\*/g, '');

/** Los dos únicos públicos de la arquitectura. */
export type Audience = 'brands' | 'creators';
/** En el formulario cabe además quien no se reconoce en ninguno de los dos. */
export type ContactKind = 'brand' | 'artist' | 'creator' | 'other';

/** Marca: el claim se mantiene; la definición es la que explica qué es esto. */
export const brand = {
  claim: ['Que se *sienta*,', 'y que funcione'] as const,
  eyebrow: 'Productora audiovisual creativa · Sevilla',
  definition: 'Productora audiovisual creativa en Sevilla.',
  deck: 'Dirección creativa y producción audiovisual para marcas, artistas y creadores.',
};

/** Nombres reales: artistas con videoclip publicado. */
export const artists = ['Ana Vas', 'La2bleT', 'Rubén Avilés', 'Red Crime Studio'];

/**
 * Cinta de la home. Del usuario: creatividad, diseño, iluminación, edición, paid y social
 * media. El resto son oficios reales del estudio, sin jerga de agencia.
 */
export const tickerTerms = [
  'Dirección creativa',
  'Concepto',
  'Guion',
  'Dirección de fotografía',
  'Iluminación',
  'Rodaje',
  'Dirección de arte',
  'Edición',
  'Color',
  'Sonido',
  'Branded content',
  'Videoclips',
  'Contenido social',
  'Paid',
  'Orgánico',
];

/** Frase de entrada a los dos caminos. Del usuario (24-09). */
export const pathsIntro =
  'Que sea bonito no basta: cada pieza se hace para un objetivo y para el sitio donde se publica.';

/**
 * Cómo trabajamos (home). Un solo método para marcas y para artistas, contado en bloques.
 * Todo lo que se afirma sale de cómo trabaja el estudio: nada de cifras ni promesas.
 */
export const method = {
  label: 'Cómo trabajamos',
  title: ['Trabajamos con método', 'para marcas, artistas y creadores.'] as const,
  deck: 'No nos limitamos a hacer vídeos bonitos: cada decisión que tomamos se apoya en datos y en una investigación previa.',
  blocks: {
    concept: {
      title: 'Concepto antes que cámara',
      text: 'La idea se cierra antes de producir: qué tiene que conseguir la pieza, a quién se dirige y dónde se va a publicar.',
    },
    channel: {
      title: 'Pensado para dónde se publica',
      text: 'Paid, orgánico, YouTube o una sesión en directo. Cada pieza se rueda y se monta para su canal.',
    },
    /** Hoja de rodaje: quién entra en cada proyecto. Solo la dirección es fija. */
    crew: {
      title: 'Equipo por proyecto',
      text: 'Entra quien pide cada proyecto. La dirección es siempre la misma.',
      roles: [
        { role: 'Dirección', who: 'Jesús Font' },
        { role: 'Dirección de fotografía', who: 'Según proyecto' },
        { role: 'Producción', who: 'Según proyecto' },
        { role: 'Arte', who: 'Según proyecto' },
        { role: 'Sonido', who: 'Según proyecto' },
        { role: 'Postproducción', who: 'Según proyecto' },
      ],
    },
    /** Entregas: los formatos que salen de cada rodaje. */
    delivery: {
      title: 'Listo para cada red',
      text: 'Horizontal, vertical y los cortes que pida cada canal, con color y sonido terminados.',
      frames: ['16:9', '9:16', '1:1', '4:5'],
    },
    photo: {
      caption: 'Rec · A001',
      title: 'Dirección y producción desde Sevilla',
    },
    cta: {
      title: '¿Tienes un proyecto?',
      text: 'Mira lo que hemos hecho o cuéntanos el tuyo.',
    },
  },
};

/** Los dos caminos: se ven siempre, no dependen de ninguna interacción. */
export const audiences: Record<
  Audience,
  { label: string; href: string; deck: string; formats: string[] }
> = {
  brands: {
    label: 'Marcas',
    href: '/trabajos',
    deck: 'Branded content, campañas y piezas para redes, con el objetivo definido antes de rodar.',
    formats: [
      'Branded content',
      'Campañas',
      'Spots',
      'Contenido social',
      'Piezas publicitarias',
      'Lanzamientos',
      'Paid y orgánico',
    ],
  },
  creators: {
    label: 'Artistas y creadores',
    href: '/trabajos',
    deck: 'Videoclips, visualizers, lanzamientos, contenido social y sesiones de fotos.',
    formats: [
      'Videoclips',
      'Visualizers',
      'Contenido de lanzamiento',
      'Contenido social',
      'Sesiones y directos',
      'Sesiones de fotos',
      'Piezas audiovisuales',
    ],
  },
};

/**
 * Idea / filosofía. Sustituye a «un vídeo espectacular que no genera retorno es solo un
 * gasto»: una pieza puede buscar notoriedad, marca o conversión, así que esa afirmación
 * tan absoluta no se sostiene.
 */
/** Cabeceras de las dos páginas: concretan qué se hace, sin prometer resultados. */
export const pageDecks = {
  brands: [
    'Dirección creativa y producción audiovisual para marcas. Antes de rodar definimos qué tiene que conseguir la pieza, a quién se dirige y en qué canal se publica.',
    'Llevamos la idea, el rodaje y el montaje, y entregamos la pieza con color, sonido y las versiones que pida cada canal.',
  ],
  creators: [
    'Videoclips, visualizers, piezas de lanzamiento, contenido social y sesiones de fotos para artistas y creadores.',
    'Desarrollamos el concepto contigo, montamos el equipo que pida el proyecto y lo entregamos listo para publicar.',
  ],
};

export const idea = {
  lines: ['Un vídeo no debe ser solo *bonito*:', 'debe cumplir su objetivo.'] as const,
  paragraphs: [
    'Por eso pensamos antes de rodar: qué tiene que conseguir la pieza, a quién se dirige y dónde se va a publicar.',
  ],
};

export interface Step {
  name: string;
  text: string;
  /** El paso que marca la diferencia: único nodo en rojo. */
  key?: boolean;
}

/** Cabecera del proceso (home). */
export const processHead = {
  label: 'Proceso',
  title: 'Cinco pasos, siempre los mismos.',
  deck: 'Así llega cada proyecto de la idea a la entrega, sea grande o pequeño.',
};

/** Un solo proceso para todo el estudio: es como se trabaja, venga quien venga. */
export const process: Step[] = [
  { name: 'Análisis', text: 'Estudiamos los datos del proyecto, buscamos referencias y definimos la mejor forma de cumplir el objetivo.' },
  { name: 'Concepto', text: 'Definimos la idea antes de tocar una cámara.', key: true },
  { name: 'Producción', text: 'Dirigimos, rodamos y coordinamos el proyecto.' },
  { name: 'Postproducción', text: 'Editamos sin perder de vista el objetivo: color, sonido y las versiones que hagan falta.' },
  { name: 'Aprendizaje', text: 'Analizamos y estudiamos cómo ha funcionado el trabajo para que el siguiente sea mejor.' },
];

/** Artistas y creadores: qué se encuentran al llamar. Propuesta del usuario (24-09). */
export const crew = {
  lines: ['Un equipo montado', 'para lo que necesitas publicar.'] as const,
  paragraphs: [
    'Formamos el equipo según lo que pide cada proyecto: dirección de fotografía, producción, arte, sonido o postproducción.',
    'Entregamos en los formatos que necesites: vertical, horizontal y los cortes para cada red.',
  ],
};

/** La idea firmada: la sección que une «La idea» y «Quién dirige». */
export const manifesto = {
  label: 'La idea',
  signature: 'Jesús Font',
  role: 'Director creativo y fundador',
};

/** Estudio: la relación entre Jesús y Nanai Studio, sin inflar la estructura. */
export const studio = {
  statement: [
    'Nanai Studio es una productora creativa fundada por Jesús Font,',
    'director creativo que lleva cada producción de principio a fin.',
  ] as const,
  /** Titular de la sección de Jesús en Sobre nosotros. */
  who: '¿Quién hay detrás de *Nanai*?',
  /** Del «Sobre mí» de su web, en primera persona y con el porqué de la firma. */
  /** Texto de Jesús (2-10-2026), con retoques de estilo. */
  bio: [
    'Soy Jesús Font, filmmaker creativo.',
    'Durante los últimos años he trabajado en campañas, eventos y contenido para marcas. Pero al colaborar más de cerca con equipos de marketing entendí que una pieza no solo tiene que verse bien: tiene que comunicar, respetar una identidad y cumplir un objetivo.',
    'Por eso decidí especializarme en la parte creativa y convertirme en un perfil más completo, que combina audiovisual, estrategia y marketing. Hoy, además de grabar y editar, trabajo el copy, las métricas, la estructura y el análisis.',
    'Mi objetivo es crear contenido que no solo sea estético, sino útil y eficaz para la marca. Y sí, también uso la IA como herramienta para agilizar procesos, iterar ideas y llevar las producciones más lejos.',
  ],
  team: 'Trabajo con equipos que se forman según lo que pide cada proyecto: dirección de fotografía, producción, arte, sonido o postproducción cuando hacen falta.',
  principles: [
    { title: 'Concepto antes que cámara', text: 'La idea se decide antes de producir.' },
    { title: 'Criterio visual', text: 'Luz, encuadre y montaje se deciden en el concepto, no sobre la marcha.' },
    { title: 'De la idea al máster', text: 'Del concepto a la entrega, sin coordinar a varios proveedores por tu cuenta.' },
  ],
};

export interface Faq {
  q: string;
  a: string;
}

/**
 * Preguntas de la home. Propuesta del 24-09: pendientes de repasar una por una contigo.
 * Ninguna respuesta promete plazos ni resultados que no podamos sostener.
 */
export const homeFaq: Faq[] = [
  {
    q: '¿Qué es exactamente Nanai Studio?',
    a: 'Una productora creativa que nace para llevar a la realidad las ideas de cada cliente, con un método que equilibra la calidad y el cumplimiento de objetivos. No buscamos solo que algo sea bonito: buscamos que tenga sentido y que rinda.',
  },
  {
    q: '¿Podríais trabajar conmigo?',
    a: 'Sí. Nanai Studio se adapta a cualquier tipo de proyecto y trabaja con cualquier cliente, sea una marca, un artista o un creador.',
  },
  {
    q: '¿Cuánto cuesta un proyecto?',
    a: 'Depende de la idea y del rodaje. Ajustamos cada presupuesto todo lo posible para cumplir los objetivos de la campaña. Cuéntanos qué tienes en mente: escribirnos no te compromete a nada.',
  },
  {
    q: '¿Tengo que llevar la idea cerrada?',
    a: 'No. Podemos ayudarte a desarrollarla: a eso nos dedicamos.',
  },
  {
    q: '¿Dónde rodáis?',
    a: 'Donde sea necesario. Tenemos base en Sevilla y nos movemos a donde pida el proyecto.',
  },
  {
    q: '¿Recibiré el trabajo rápido?',
    a: 'Acordamos contigo las fechas de entrega desde el principio. Además, tenemos un flujo de trabajo optimizado con IA que nos permite entregar más rápido sin perder calidad.',
  },
  {
    q: '¿Qué pasa después de escribirnos?',
    a: 'Te responderemos en cuanto podamos. Para más rapidez, háblanos por WhatsApp.',
  },
];

/** Preguntas de Marcas. Propuesta del 24-09. */
export const brandsFaq: Faq[] = [
  {
    q: '¿Os coordináis con nuestro equipo de marketing o con la agencia?',
    a: 'Sí. Trabajamos con quien lleve la marca y nos adaptamos a la guía y al calendario que ya tengáis.',
  },
  {
    q: '¿Entregáis varias versiones de la misma pieza?',
    a: 'Sí: vertical, horizontal y los cortes que pida cada canal. Se decide antes de rodar, no después.',
  },
  {
    q: '¿Las piezas sirven para paid?',
    a: 'Se piensan para el sitio donde van a vivir. Si la pieza es para campaña, se plantea como tal desde el concepto.',
  },
  {
    q: '¿Qué necesitáis para empezar?',
    a: 'El objetivo, a quién va dirigido, dónde se va a publicar y la fecha. Con eso podemos proponer.',
  },
  {
    q: '¿Hace falta que llevemos el concepto?',
    a: 'No. Podemos partir del brief o desarrollarlo con vosotros.',
  },
  {
    q: '¿Cuánto cuesta una producción?',
    a: 'Depende del formato, del rodaje y del número de piezas. Cuéntanos el proyecto y te orientamos.',
  },
];

/** Preguntas del Estudio. Propuesta del 24-09. */
export const studioFaq: Faq[] = [
  {
    q: '¿Quién dirige los proyectos?',
    a: 'Jesús Font. Es quien lleva la dirección creativa y responde por el proyecto de principio a fin.',
  },
  {
    q: '¿Sois un equipo fijo?',
    a: 'No. El equipo se forma según lo que pide cada proyecto: fotografía, producción, arte, sonido o postproducción.',
  },
  {
    q: '¿Podéis encargaros de todo?',
    a: 'Sí: de la idea a la entrega, sin tener que coordinar a varios proveedores por tu cuenta.',
  },
  {
    q: '¿Dónde estáis?',
    a: 'Donde haga falta. Nuestra base está en Sevilla.',
  },
];

/** De docs/estrategia-nanai.md § 13, abierto a cualquier proyecto de artista o creador. */
export const creatorsFaq: Faq[] = [
  {
    q: '¿Cuánto cuesta una producción?',
    a: 'Depende de la idea y del rodaje que pida. Cuéntanos qué tienes en mente y te orientamos sin compromiso.',
  },
  { q: '¿Trabajáis con proyectos independientes?', a: 'Sí, es la mayoría de lo que hacemos.' },
  {
    q: '¿Tengo que llevar el concepto cerrado?',
    a: 'No. Si solo tienes la canción o la idea, la desarrollamos contigo.',
  },
  {
    q: '¿Qué incluye una producción?',
    a: 'Del concepto a la entrega: dirección, rodaje, edición y color.',
  },
  { q: '¿Puedo aportar mis referencias?', a: 'Sí. Ayudan a afinar el tono desde el principio.' },
  {
    q: '¿Qué pasa después de escribir?',
    a: 'Te respondemos con los siguientes pasos y una primera orientación de cómo lo plantearíamos.',
  },
];

/** Trabajos: una sola página con todo el trabajo, de marcas y de artistas. */
export const workPage = {
  title: ['Trabajos', 'del *estudio*'] as [string, string],
  deck: 'Mira nuestro trabajo y descubre qué encaja más contigo.',
};

/** Trabajo seleccionado (home): una línea bajo el titular. */
export const featuredWork = {
  title: 'Trabajo seleccionado',
  deck: 'Algunos de nuestros trabajos destacados. Si quieres ver más, los tienes todos en Trabajos.',
};

/** Preguntas de Trabajos: una selección de las de marcas y de artistas. */
export const workFaq: Faq[] = [
  {
    q: 'No veo nada que encaje con lo que quiero. ¿Podéis hacer algo distinto?',
    a: 'Sí. Si no lo ves aquí es porque todavía no nos lo han propuesto. En Nanai no nos da miedo plantarle cara a ningún proyecto.',
  },
  homeFaq[1],
  homeFaq[2],
  homeFaq[3],
  homeFaq[5],
  homeFaq[6],
];

/** Contacto: el formulario pide lo justo para poder responder bien. */
export const contact = {
  title: '¿Hablamos?',
  /** WhatsApp primero: es lo más rápido para los dos (decisión del usuario, 1-10-2026). */
  lead: 'Lo más rápido es WhatsApp: cuéntanos qué quieres hacer, cuándo lo necesitas y dónde se va a publicar.',
  help: 'Trabajamos con proyectos de distintas escalas. Cuéntanos qué quieres hacer, cuándo lo necesitas y dónde va a publicarse.',
  note: 'Te respondemos con los siguientes pasos y una primera orientación.',
  placeholders: {
    what: 'Un videoclip, una campaña, contenido para redes…',
    when: 'Mes aproximado o fecha de entrega',
    where: 'Instagram, YouTube, paid, web…',
    budget: 'Una cifra o un rango orientativo',
  },
};

export const contactOptions: { kind: ContactKind; value: string }[] = [
  { kind: 'brand', value: 'Marca' },
  { kind: 'artist', value: 'Artista' },
  { kind: 'creator', value: 'Creador' },
  { kind: 'other', value: 'Otro' },
];

/** Qué opción llega marcada según la página. */
export const defaultKind: Record<Audience, ContactKind> = {
  brands: 'brand',
  creators: 'artist',
};
