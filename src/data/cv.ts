/**
 * CV de Jesús Font para /jesus-font. Todo sale de su CV en PDF
 * («Jesús Font - Filmmaker creativo», noviembre de 2026). No añadir nada que no esté ahí.
 */

export const cv = {
  name: 'Jesús Font',
  fullName: 'Jesús Font Garrido',
  role: 'Filmmaker creativo',
  city: 'Dos Hermanas, Sevilla',
  email: 'jesusfontgarrido@gmail.com',
  phone: '689 02 64 20',
  whatsapp: 'https://wa.me/34689026420?text=' + encodeURIComponent('Hola Jesús, he visto tu CV en la web de Nanai.'),
  portfolio: 'https://jesusfont.framer.website',

  claim: 'Datos primero, cámara después.',
  summary:
    'Especializado en marketing audiovisual, con una trayectoria que va de la producción multicámara al contenido estratégico para paid media. Dirección, gestión del color e IA integrada en todo el flujo de trabajo.',

  numbers: [
    { value: 100, prefix: '+', suffix: '', label: 'piezas para campañas de Traders Business School desde 2025' },
    { value: 100, prefix: '+', suffix: 'k€', label: 'por encima del objetivo de beneficio mensual a finales de 2025' },
    { value: 9.2, prefix: '', suffix: '', decimals: 1, label: 'de nota media en el Grado Superior de Imagen' },
    { value: 2019, prefix: '', suffix: '', plain: true, label: 'el año en que empieza como filmmaker independiente' },
  ],

  experience: [
    {
      dates: 'feb. 2025 – actualidad',
      role: 'Filmmaker creativo y fotógrafo',
      org: 'Traders Business School',
      points: [
        'Más de 100 piezas para campañas desde 2025, dentro del equipo de marketing.',
        'Conseguimos superar por 100k€ el objetivo del beneficio mensual para finales de 2025.',
      ],
    },
    {
      dates: 'ago. 2025 – actualidad',
      role: 'Director',
      org: 'Nanai Studio, productora creativa',
      points: ['Dirección creativa de preproducción, producción y postproducción para Ana Vas y La2bleT, entre otros.'],
    },
    {
      dates: '2025',
      role: 'Jefe de equipo de cámara y fotografía',
      org: 'Festival de Cortometrajes de Sevilla',
      points: ['Equipo de cámara del festival y coordinación de operadores durante la gala.'],
    },
    {
      dates: 'mar. 2019 – actualidad',
      role: 'Filmmaker y fotógrafo',
      org: 'Profesional independiente',
      points: [
        'Contenido para redes: Rubén Avilés, Zeling y Ana Vas, entre otros.',
        'Vídeo de marca y publicidad; eventos y bodas.',
        'Podcast «Con Arte».',
      ],
    },
  ],

  /** Colores de las cápsulas del CV en papel. */
  tools: [
    { name: 'Premiere Pro', color: '#9B8CF7' },
    { name: 'After Effects', color: '#D99AF0' },
    { name: 'DaVinci Resolve', color: '#6FD1C1' },
    { name: 'Photoshop', color: '#39A7F4' },
    { name: 'Lightroom', color: '#8BD96E' },
    { name: 'Magnific', color: '#F18FAA' },
    { name: 'Claude', color: '#F0B24E' },
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
  ],

  closing: 'Hay más que contar, pero no cabe todo en un solo folio.',
} as const;
