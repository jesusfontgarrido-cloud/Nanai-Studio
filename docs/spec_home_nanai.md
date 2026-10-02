# Home de nanaistudio.es · Especificación

Productora creativa de Sevilla con dos líneas: **Marcas** (brand content, publicidad, contenido para redes) y **Música** (videoclips). La dirige Jesús Font, que firma como director.

La página tiene dos zonas. **La noche** (fondo negro): secciones 01 a 04, emoción y trabajo. **El día** (fondo hueso): secciones 06 a 10, argumento y contacto. La sección 05 es la transición entre ambas y el pie vuelve al negro.

---

## Componentes

### Nav
Píldora flotante centrada, `position: fixed`, a 24px del borde superior. Único elemento con `backdrop-filter: blur(12px)` y fondo `rgba(28,27,26,0.6)`.
Contenido: logo Nanai Studio · Trabajo · Marcas · Música · Estudio · botón «Hablemos» en `--bone` con texto `--text-on-bone`.
En móvil: logo a la izquierda y menú hamburguesa a la derecha, con desplegable a pantalla completa sobre `--ink`.

### Interruptor
Píldora con dos mitades y borde de 1px en `--bone`. La mitad activa se rellena de `--bone` con texto `--text-on-bone`; la inactiva es transparente con texto blanco.
Etiquetas con superíndice: `Marcas⁰¹` y `Música⁰²`.
Dos `<button>` con `aria-pressed`. La transición del indicador dura 240ms con `cubic-bezier(0.4, 0, 0.2, 1)`.

### CTA
Píldora en `--bone`, altura 56px. De izquierda a derecha: miniatura de vídeo en píldora (96×40, `object-fit: cover`), texto en negro y círculo de 40px en `--red` con una flecha blanca.
Al pasar el ratón, el círculo se desplaza 4px a la derecha.

### Etiqueta de formato
Píldora de contorno, borde de 1px, altura 28px, texto en mono a 11px. Ejemplos: `PAID · 16:9`, `ORGÁNICO · 9:16`, `VIDEOCLIP`.

### Claqueta
Bloque de metadatos de cada pieza: un cuadrado en `--bone` con las iniciales «NS» y, al lado, tres líneas en mono:
`NS-012` / `PAID · 9:16 · 24 FPS` / `CLIENTE · AÑO`.

### Marcas de encuadre
Cuatro ángulos de 24px, línea de 1px en `--bone`, en las esquinas del hero y de las piezas destacadas.

### Cristal acanalado
Efecto de revelado: lamas verticales de 8px con degradado que va de transparente a `rgba(0,0,0,0.55)` y vuelve. Se usa al entrar el hero y al pasar el ratón por cada pieza. Se implementa con `repeating-linear-gradient` sobre un pseudoelemento y se anima la opacidad. Se desactiva con `prefers-reduced-motion`.

---

## Secciones

### 01 · Hero (negro, 100vh)
- Vídeo de fondo a sangre, con luz roja y desenfoque de movimiento. `object-fit: cover`.
- Marcas de encuadre en las cuatro esquinas.
- Arriba a la izquierda, en mono: `PRODUCTORA CREATIVA — SEVILLA`. Arriba a la derecha: `TC 00:00:12:08`, que avanza a 24 fps con JavaScript (se congela con `prefers-reduced-motion`).
- Titular bitono, alineado a la izquierda, a un tercio de la altura:
  «**Tus ideas se ven**» en blanco / «como se sienten.» en `--gray`.
- Debajo, el CTA «Ver trabajo» y el enlace de texto «Hablemos →».
- Bajo el CTA, en mono: `37.3891° N — 5.9845° W`.
- Abajo a la derecha, tarjeta del caso destacado: miniatura, `CASO 07`, «Traders Business School», `PAID · 16:9 · 2026`. Cambia junto con el vídeo de fondo.
- Wordmark «NANAI» a todo el ancho, cortado por el borde inferior de la pantalla: se ve aproximadamente el 62% superior de las letras. Se consigue con `overflow: hidden` y desplazamiento vertical, no recortando una imagen.

### 02 · Ticker (negro)
Una línea entre dos filetes de 1px, en mono, con desplazamiento horizontal continuo y pausa al pasar el ratón:
`VIDEOCLIPS ● BRAND CONTENT ● PUBLICIDAD ● DIRECCIÓN CREATIVA ● ESTRATEGIA`
Los puntos en `--red`, el texto en `--text-on-ink`.

### 03 · Declaración (negro)
Etiqueta en mono: `01 — ESTUDIO`.
Párrafo grande en peso 300, bitono, con dos píldoras de vídeo en línea dentro del texto (96×40, alineadas con la línea base):

> Productora creativa en Sevilla. Dirigimos [vídeo] videoclips y [vídeo] contenido de marca con la misma idea: que se sienta, y que funcione.

La primera frase en blanco; a partir de «con la misma idea», en `--gray`.

### 04 · Trabajo (negro)
- Etiqueta `02 — EL TRABAJO` e interruptor Marcas / Música centrado.
- Rejilla escalonada: las columnas pares bajan 48px. De 4 a 6 piezas.
- **Marcas:** formato 16:9, con claqueta debajo de cada pieza.
- **Música:** formato 9:16, con el título tipográfico del clip sobre la miniatura.
- Al pasar el ratón, el vídeo se revela tras el cristal acanalado y aparecen las marcas de encuadre.
- El cambio de línea no recarga la página: se filtra en el cliente con transición de opacidad.
- Al final, enlace «Ver todo el trabajo →».

### 05 · Transición
Bandas curvas a todo el ancho que van del negro al hueso: `--light-0` → `--light-1` → `--light-2` → `--light-3` → `--light-4` → `--light-5` → `--bone`.
Se construye apilando divs con `border-radius` grande, no con una imagen. Altura entre 200 y 320px.

### 06 · Enfoque (hueso)
- Retícula de construcción visible de fondo: líneas de 1px en `--hairline-bone` cada 64px, con crucetas en las intersecciones.
- Etiqueta `02 — ENFOQUE`. Titular: «Cómo trabajamos».
- Cinco pasos en línea horizontal unidos por un filete, con un nodo en cada uno. El nodo de «Rodaje» va en `--red` y lleva dos flechas rojas que lo enmarcan.
- Pasos, cada uno con una frase corta: Análisis · Research · Plan de contenido · Rodaje · Resultados.
- En móvil, la línea pasa a vertical.

### 07 · Clientes (hueso)
Etiqueta `03 — HAN CONFIADO`. Muro de logos en negro, de 4 a 6 por fila, con opacidad 0.7 que sube a 1 al pasar el ratón. El primero, Traders Business School.

### 08 · Quién dirige (hueso)
Dos columnas. A la izquierda, retrato con luz roja. A la derecha, `04 — QUIÉN DIRIGE`, el nombre «Jesús Font», una bio de tres líneas y el enlace «Ver su trabajo como director →».
Metadatos en las esquinas del retrato: `DIRECTOR · SEVILLA`.

### 09 · Voces (hueso)
Dos o tres citas grandes (32px, peso 300) con el nombre en mono debajo. Sin estrellas, sin logos de terceros, sin widgets externos.

### 10 · Contacto (hueso → negro)
- Titular «¿Hablamos?» a tamaño de H1.
- Interruptor de tres posiciones: Marca / Artista / Boda. Cambia el texto de ayuda del formulario y, en «Boda», muestra un enlace a Nanai Weddings.
- Formulario de tres campos: nombre, email o teléfono, cuéntanos. Botón en `--red`.
- Debajo: WhatsApp y hola@nanaistudio.es.
- Al final de la sección, las bandas de luz invertidas devuelven la página al negro.

### 11 · Pie (negro)
- Wordmark «NANAI STUDIO» gigante cortado por el borde inferior.
- Fila de datos en tres columnas, en mono: «Productora creativa» / «Sevilla, España» / «37.3891° N — 5.9845° W».
- Instagram, LinkedIn y un enlace discreto «Nanai Weddings →».
- Aviso legal y política de privacidad.

---

## Marcadores

Mientras no haya piezas reales, usa bloques con la proporción correcta y un degradado de la escala de luz, más la claqueta encima. Nunca cajas negras vacías.

## Orden de trabajo

1. Tokens, tipografías y estructura HTML de la página completa.
2. Sección 01 (hero) terminada y revisada.
3. Secciones 02 a 04.
4. Sección 05 y la zona de día (06 a 11).
5. Responsive a 390px y 768px.
6. Accesibilidad y rendimiento.
