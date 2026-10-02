/**
 * Fotos de rodaje (BTS) elegidas del archivo N:\Fotos\Export el 1-10-2026 y exportadas a
 * src/assets/media/bts. Lo que se busca enseñar: un equipo trabajando, con oficio.
 * Las que empiezan por «@Gallagm» son de ese fotógrafo y llevan su crédito en una esquina;
 * las DSC… van sin crédito hasta confirmar autoría.
 *
 * Ojo: la carpeta «Tati Videoclip» es el rodaje de Quemando Vitamina (La2bleT): lo dice la
 * claqueta.
 */
import type { ImageMetadata } from 'astro';
import impostoraGimbal from '../assets/media/bts/impostora-gimbal.jpg';
import impostoraEquipo from '../assets/media/bts/impostora-equipo.jpg';
import lqdDireccion from '../assets/media/bts/lqd-direccion.jpg';
import lqdMontaje from '../assets/media/bts/lqd-montaje-difusion.jpg';
import lqdClaqueta from '../assets/media/bts/lqd-claqueta.jpg';
import famaMonitor from '../assets/media/bts/fama-monitor-rojo.jpg';
import famaPlan from '../assets/media/bts/fama-plan-tableta.jpg';
import famaEquipo from '../assets/media/bts/fama-equipo.jpg';
import bailameEquipo from '../assets/media/bts/bailame-equipo.jpg';
import bailameCamiseta from '../assets/media/bts/bailame-camiseta.jpg';
import conciertoCamara from '../assets/media/bts/concierto-camara.jpg';
import juandiOperadora from '../assets/media/bts/juandi-playa-operadora.jpg';
import qvEquipo from '../assets/media/bts/tati-equipo.jpg';
import qvEncuadre from '../assets/media/bts/tati-encuadre-tableta.jpg';

export interface Still {
  src: ImageMetadata;
  alt: string;
  /** Rodaje al que pertenece (para el texto alternativo y el visor). */
  shoot: string;
  /** Autor de la foto, si se conoce. */
  credit?: string;
  /** Punto de interés para el recorte. */
  focus?: string;
}

const gallagm = '@gallagm';

export const stills: Still[] = [
  { src: impostoraGimbal, alt: 'Jesús Font con el gimbal y la camiseta de Nanai Studio', shoot: 'Ana Vas · La Impostora', credit: gallagm, focus: '60% 40%' },
  { src: lqdClaqueta, alt: 'Claqueta delante de la mesa del banquete en el rodaje de Lo que digan', shoot: 'Ana Vas · Lo que digan', focus: '50% 40%' },
  { src: famaEquipo, alt: 'El equipo revisa el plan de rodaje en una tableta junto a la carretera', shoot: 'Ana Vas · Fama de Maleante', focus: '50% 40%' },
  { src: lqdDireccion, alt: 'Dirección en el set: enseñando el plano en cámara a una actriz', shoot: 'Ana Vas · Lo que digan', focus: '55% 40%' },
  { src: qvEquipo, alt: 'Equipo de rodaje de noche, con la camiseta del estudio', shoot: 'La2bleT · Quemando Vitamina', credit: gallagm, focus: '50% 40%' },
  { src: bailameEquipo, alt: 'El equipo prepara una toma al atardecer, con dos operadores al fondo', shoot: 'Ana Vas · Báilame', credit: gallagm, focus: '50% 45%' },
  { src: famaMonitor, alt: 'Operador siguiendo el plano en el monitor, con luz roja', shoot: 'Ana Vas · Fama de Maleante', focus: '45% 50%' },
  { src: juandiOperadora, alt: 'Operadora con gimbal grabando en la playa', shoot: 'Juandi · Videoclip', credit: gallagm, focus: '35% 50%' },
  { src: impostoraEquipo, alt: 'Jesús Font prepara el gimbal con una compañera del equipo', shoot: 'Ana Vas · La Impostora', credit: gallagm, focus: '55% 40%' },
  { src: famaPlan, alt: 'Revisión del plan en una tableta entre tomas', shoot: 'Ana Vas · Fama de Maleante', focus: '50% 40%' },
  { src: lqdMontaje, alt: 'Montaje de la tela de difusión en exteriores', shoot: 'Ana Vas · Lo que digan', focus: '60% 40%' },
  { src: qvEncuadre, alt: 'El encuadre revisado en una tableta durante el rodaje', shoot: 'La2bleT · Quemando Vitamina', credit: gallagm, focus: '50% 50%' },
  { src: bailameCamiseta, alt: 'Miembro del equipo con la camiseta «tus ideas se ven como se sienten»', shoot: 'Ana Vas · Báilame', credit: gallagm, focus: '70% 45%' },
  { src: conciertoCamara, alt: 'Cámara entre el público en el concierto de Ana Vas, en blanco y negro', shoot: 'Ana Vas · En directo', focus: '40% 40%' },
];
