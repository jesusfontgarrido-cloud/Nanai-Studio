/**
 * Fotografía (Trabajos). Del briefing del 2-10-2026 y del Instagram de Jesús (@itsjesusfont).
 * Las fotos son de Jesús Font: no llevan crédito aparte.
 *
 * Ojo: las del briefing vienen a 600–1000 px y las de Instagram, capturadas de pantalla, a
 * ~800 px de ancho. Valen para la rejilla; si aparecen los originales, se sustituyen aquí.
 */
import type { ImageMetadata } from 'astro';
import carne from '../assets/media/foto/lima-sorda-carne.jpg';
import postre from '../assets/media/foto/lima-sorda-postre.jpg';
import casaManolo from '../assets/media/foto/lima-sorda-casa-manolo.jpg';
import postresMesa from '../assets/media/foto/lima-sorda-postres-mesa.jpg';
import tallerNegro from '../assets/media/foto/moda-taller-negro.jpg';
import tallerCapa from '../assets/media/foto/moda-taller-capa.jpg';
import escaleraRoja from '../assets/media/foto/moda-escalera-roja.jpg';
import tallerLuz from '../assets/media/foto/moda-taller-luz.jpg';
import flamenca from '../assets/media/foto/retrato-flamenca.jpg';
import abanico from '../assets/media/foto/retrato-abanico.jpg';
import bar from '../assets/media/foto/retrato-bar.jpg';
import chaquetaRoja from '../assets/media/foto/retrato-chaqueta-roja.jpg';
import flores from '../assets/media/foto/retrato-flores.jpg';
import paredRoja from '../assets/media/foto/retrato-pared-roja.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export interface PhotoSet {
  title: string;
  /** Una línea: qué se ve y para quién. */
  note: string;
  /** Filas de la rejilla: cada fila se ajusta a la misma altura. */
  rows: Photo[][];
}

export const photoSets: PhotoSet[] = [
  {
    title: 'Gastronomía y empresa',
    note: 'Lima Sorda, grupo de restauración: producto, food styling e imagen de sus locales.',
    rows: [
      [
        { src: carne, alt: 'Carne a la brasa con patatas sobre tabla de madera y pizarra' },
        { src: casaManolo, alt: 'Camarero de Lima Sorda con bandeja frente al restaurante Casa Manolo' },
        { src: postre, alt: 'Postre en tarro sobre pizarra, con galleta y cacao' },
        { src: postresMesa, alt: 'Cuatro postres en tarro sobre dos pizarras cruzadas, vistos desde arriba' },
      ],
    ],
  },
  {
    title: 'Moda y retrato',
    note: 'Editoriales y retratos: dirección de modelos, arte e iluminación.',
    rows: [
      [
        { src: tallerCapa, alt: 'Editorial de moda en un taller de escultura, modelo con capa bordada' },
        { src: flamenca, alt: 'Retrato de una modelo flamenca con peineta roja y pendientes de aro' },
        { src: escaleraRoja, alt: 'Modelo sentada en una escalera metálica roja' },
        { src: bar, alt: 'Retrato pin-up en la terraza de un bar, con luz verde de neón' },
        { src: tallerNegro, alt: 'Modelo con vestido negro entre estanterías de un taller' },
      ],
      [
        { src: abanico, alt: 'Retrato de una modelo con abanico pintado y flor en el pelo' },
        { src: tallerLuz, alt: 'Editorial en un taller de escultura con luz dramática' },
        { src: chaquetaRoja, alt: 'Retrato de una mujer con chaqueta roja sobre fondo blanco' },
        { src: flores, alt: 'Retrato con margaritas en el pelo, ojos cerrados' },
        { src: paredRoja, alt: 'Modelo con chaqueta vaquera apoyada en una pared roja' },
      ],
    ],
  },
];
