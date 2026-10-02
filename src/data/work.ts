/**
 * El trabajo. Cada proyecto se enseña con lo que se puede demostrar: cliente, tipo de
 * proyecto, rol de Nanai Studio y formato. Nada de métricas ni resultados inventados:
 * si un proyecto no tiene datos publicables, no lleva la fila de resultado.
 */
import type { Audience } from './copy';

export interface Project {
  /** Cliente o artista. */
  client: string;
  audience: Audience;
  /** Tipo de proyecto. */
  type: string;
  /** Qué hizo Nanai Studio. Propuesta: confirmar el rol exacto de cada pieza. */
  role: string;
  format: string;
  /** Título de la pieza, cuando lo tiene. */
  title?: string;
  /** Vídeo alojado en el sitio (bucle corto) o pieza publicada en YouTube. */
  youtubeId?: string;
  video?: string;
  poster?: string;
  /** Vídeo privado en YouTube: no se enseña hasta que sea público u oculto. */
  hidden?: boolean;
}

/** El caso de marca publicable. Descrito por el usuario: VSL para la PDP de trading. */
export const brandProjects: Project[] = [
  {
    client: 'Traders Business School',
    title: 'Vídeo de producto · Curso de trading',
    audience: 'brands',
    type: 'Branded content · Paid media',
    role: 'Dirección creativa · Producción',
    format: 'VSL 16:9 · Página de producto',
    video: '/media/traders-loop.mp4',
    poster: 'traders',
  },
  // Sitio para las piezas de marca que faltan (3–6 en total). Plantilla:
  // {
  //   client: 'Cliente',
  //   audience: 'brands',
  //   type: 'Branded content · Paid media',
  //   role: 'Dirección creativa · Producción',
  //   format: '16:9 · Redes',
  //   video: '/media/archivo.mp4',   // o youtubeId: 'xxxx'
  // },
];

/** Videoclips publicados. Los nombres y los títulos son reales. */
export const creatorProjects: Project[] = [
  {
    client: 'La2bleT',
    audience: 'creators',
    title: 'Quemando Vitamina',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'ZxRvXqU2u40',
  },
  {
    client: 'Ana Vas',
    audience: 'creators',
    title: 'La Impostora',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'lSBKnSD0No4',
  },
  {
    client: 'Ana Vas',
    audience: 'creators',
    title: 'Lo que digan',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'tqWtqHeIXnc',
  },
  {
    client: 'Ana Vas',
    audience: 'creators',
    title: 'Egoísta',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'BRB6WrXJZEA',
  },
  {
    client: 'Rubén Avilés',
    audience: 'creators',
    title: 'A mí quién me salva',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'Af81rQXx0Yo',
  },
  {
    client: 'Ana Vas',
    audience: 'creators',
    title: 'Fama de Maleante',
    type: 'Videoclip',
    role: 'Dirección · Producción',
    format: '16:9',
    youtubeId: 'iq7kOCV1Mj4',
  },
];

/*
 * Portfolio completo (briefing del usuario, 2-10-2026: «Briefing Portfolio Web.pdf»).
 * Cuatro bloques de vídeo; la fotografía va aparte, en src/data/photos.ts.
 * Los que llevan «hidden» están en privado en YouTube (no tienen miniatura ni se pueden
 * reproducir desde fuera): en cuanto se pongan en público u ocultos, se quita el «hidden».
 */
const role = 'Dirección creativa · Producción';
const tbs = 'Traders Business School';

/** 1. Marketing, anuncios y estrategia: captación, conversión y lanzamientos. */
export const marketingProjects: Project[] = [
  // El vídeo de producto del curso va primero y en grande (decisión del usuario).
  { client: tbs, title: 'Vídeo de producto · Curso de trading', audience: 'brands', type: 'Lanzamiento de producto', role, format: '16:9', youtubeId: 'yptl01VvWqs' },
  { client: tbs, title: 'Spot publicitario', audience: 'brands', type: 'Anuncio · Captación', role, format: '16:9', youtubeId: 'e0-3fNZ9UlY' },
  { client: tbs, title: 'Trading algorítmico', audience: 'brands', type: 'Pieza de campaña', role, format: '16:9', youtubeId: 'yRmsgPeNcUA' },
  { client: tbs, title: 'Pieza hecha con IA', audience: 'brands', type: 'Anuncio · Hecho con IA', role: 'Dirección creativa · Producción con IA', format: '16:9', youtubeId: 'ErdE2j9k-R4' },
  { client: tbs, title: 'La desinformación en el trading', audience: 'brands', type: 'Pieza de campaña', role, format: '16:9', youtubeId: 'hbivGEOLbW8' },
];

/** 2. Branded content, eventos y redes: formatos largos, podcast y vertical. */
export const contentProjects: Project[] = [
  { client: tbs, title: 'Así se invierten 125 M de euros · José Luis Domínguez', audience: 'brands', type: 'Podcast · Entrevista', role, format: 'Formato largo', youtubeId: 'x2hmLLqKDAU' },
  { client: 'La Barbería de Flory', title: 'Reels', audience: 'brands', type: 'Contenido para redes', role, format: 'Vertical', youtubeId: '1EJ0qy_TeH8' },
  { client: 'Promua', title: '18 aniversario', audience: 'brands', type: 'Evento · Pieza de marca', role, format: '16:9', youtubeId: 'X9rKRdIHmTI' },
  { client: 'Zeling', title: 'Entrenamiento para La Velada del Año', audience: 'creators', type: 'Teaser · Documental', role, format: '16:9', youtubeId: 'BsLbH6UDpgo' },
];

/** 3. Videoclips. «Hogueras» es una producción integral de Nanai Studio. */
export const musicProjects: Project[] = [
  { client: 'Juandi', title: 'Hogueras', audience: 'creators', type: 'Videoclip · Producción de Nanai Studio', role: 'Producción integral', format: '16:9', youtubeId: 'hLExGC-A2lM' },
  { client: 'Ana Vas y El Amaro', title: 'Báilame', audience: 'creators', type: 'Videoclip', role: 'Dirección · Producción', format: '16:9', youtubeId: 'McFee5DrY8s' },
  ...creatorProjects,
];

/** 4. Creatividad: piezas de autor, no comerciales (cinematografía, luz y color). */
export const filmProjects: Project[] = [
  { client: 'Pieza de autor', title: 'Euphoria', audience: 'creators', type: 'Cinematografía · Sony A7C', role: 'Dirección · Fotografía · Color', format: '16:9', youtubeId: 'lj9s5c-jfWM' },
  { client: '@amyvonblood', title: 'Cinematic', audience: 'creators', type: 'Cinematografía · Sony A7C', role: 'Dirección · Fotografía', format: '16:9', youtubeId: '8UfW72DrtKE', hidden: true },
];

/** Lo que se enseña: sin los vídeos privados. */
export const visible = (projects: Project[]) => projects.filter((project) => !project.hidden);

/** Todo el trabajo, marcas primero. Es lo que enseña /trabajos sin filtro. */
export const allProjects: Project[] = [...brandProjects, ...creatorProjects];

/** Lo que se enseña en la home: dos piezas, una de marca y un videoclip (La Impostora). */
export const featuredProjects: Project[] = [brandProjects[0], creatorProjects[1]];

/**
 * Miniatura de YouTube: «mq» (320×180), «sd» (640×480, con bandas que el recorte 16:9 quita)
 * y «maxres» (1280×720).
 */
export const ytThumb = (youtubeId: string, size: 'mq' | 'sd' | 'maxres' = 'maxres') =>
  `https://i.ytimg.com/vi/${youtubeId}/${size}default.jpg`;

/** Las tres miniaturas como srcset: el navegador baja la que pide la pantalla. */
export const ytSrcset = (youtubeId: string) =>
  `${ytThumb(youtubeId, 'mq')} 320w, ${ytThumb(youtubeId, 'sd')} 640w, ${ytThumb(youtubeId, 'maxres')} 1280w`;

/** Enlace a la pieza publicada, si la hay. */
export const projectHref = (project: Project) =>
  project.youtubeId ? `https://www.youtube.com/watch?v=${project.youtubeId}` : undefined;
