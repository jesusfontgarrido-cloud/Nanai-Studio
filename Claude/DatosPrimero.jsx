/**
 * DatosPrimero — Proceso circular, 5 fases cíclicas
 * React 18 · SVG animado · IntersectionObserver · CSS transitions
 * Sin dependencias externas
 */

import React, { useRef, useEffect, useCallback } from "react"

/* ─── Datos ──────────────────────────────────────────────── */
const PHASES = [
  { label: "Fase 1", title: "Análisis",   desc: "Negocio a fondo",        cx: 350, cy: 120 },
  { label: "Fase 2", title: "Research",   desc: "Investigamos similares", cx: 540, cy: 258 },
  { label: "Fase 3", title: "Plan",       desc: "Plan de contenido",      cx: 468, cy: 482 },
  { label: "Fase 4", title: "Creación",   desc: "Pasamos a producción",   cx: 232, cy: 482 },
  { label: "Fase 5", title: "Resultados", desc: "Medimos y actuamos",     cx: 160, cy: 258 },
]

// Posiciones de etiquetas en zonas de silencio
const LABEL_CFG = [
  { anchor: "middle", lx: 350, ly: [58,  79,  97]  }, // Fase 1 – arriba
  { anchor: "start",  lx: 576, ly: [242, 263, 280] }, // Fase 2 – derecha
  { anchor: "start",  lx: 490, ly: [508, 529, 546] }, // Fase 3 – abajo-derecha
  { anchor: "end",    lx: 210, ly: [508, 529, 546] }, // Fase 4 – abajo-izquierda
  { anchor: "end",    lx: 124, ly: [242, 263, 280] }, // Fase 5 – izquierda
]

// Tiempos de la secuencia de animación (ms)
const DOT_T = [150,  660,  1310, 1960, 2510]
const LBL_T = [370,  880,  1530, 2180, 2730]
const RET_T = 2950

/* ─── Componente ─────────────────────────────────────────── */
export default function DatosPrimero() {
  const sectionRef = useRef(null)
  const arcRef     = useRef(null)   // arco principal (Fase1→5)
  const retRef     = useRef(null)   // arco retorno   (Fase5→1)
  const dotRefs    = useRef([])
  const lblRefs    = useRef([])
  const timerIds   = useRef([])

  /* ── Función de animación (replay-safe) ── */
  const animate = useCallback(() => {
    const arc = arcRef.current
    const ret = retRef.current
    if (!arc) return

    // Cancelar timers previos
    timerIds.current.forEach(clearTimeout)
    timerIds.current = []

    // Resetear arco: sin transición, oculto
    const len = arc.getTotalLength()
    arc.style.transition     = "none"
    arc.style.strokeDasharray  = String(len)
    arc.style.strokeDashoffset = String(len)

    // Quitar clases 'on' de todos los elementos
    ret?.classList.remove("on")
    dotRefs.current.forEach(el => el?.classList.remove("on"))
    lblRefs.current.forEach(el => el?.classList.remove("on"))

    const add = (fn, ms) => timerIds.current.push(setTimeout(fn, ms))

    // Doble rAF → garantiza que el browser pintó el reset antes de activar transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // Arco principal: draw-on con stroke-dashoffset
        add(() => {
          arc.style.transition     = "stroke-dashoffset 2.5s cubic-bezier(0.4,0,0.2,1)"
          arc.style.strokeDashoffset = "0"
        }, 60)

        // Dots y labels escalonados
        PHASES.forEach((_, i) => {
          add(() => dotRefs.current[i]?.classList.add("on"), DOT_T[i])
          add(() => lblRefs.current[i]?.classList.add("on"), LBL_T[i])
        })

        // Arco de retorno (último)
        add(() => ret?.classList.add("on"), RET_T)
      })
    })
  }, [])

  /* ── IntersectionObserver ── */
  useEffect(() => {
    const section = sectionRef.current
    const arc     = arcRef.current
    if (!section || !arc) return

    // Ocultar arco en carga inicial (antes de que IO dispare)
    const len = arc.getTotalLength()
    arc.style.strokeDasharray  = String(len)
    arc.style.strokeDashoffset = String(len)

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate() },
      { threshold: 0.15 }
    )
    obs.observe(section)

    return () => {
      obs.disconnect()
      timerIds.current.forEach(clearTimeout)
    }
  }, [animate])

  /* ── Render ── */
  return (
    <section ref={sectionRef} className="dp-section" style={s.section}>
      <style>{CSS}</style>

      {/* Título */}
      <h1 style={s.heading}>
        <span style={s.bold}>Datos primero</span>
        <br />
        <span style={s.bold}>Cámara </span>
        <em style={s.italic}>después</em>
      </h1>

      {/* Intro */}
      <p style={s.intro}>
        Como Branded Content Filmmaker no llego a una marca a "grabar bonito".
        <br />
        Llego a <em>entender el negocio</em>, leer sus datos y construir un
        sistema de contenido que mida en conversión, no en likes.
      </p>

      {/* SVG circular */}
      <div style={s.svgWrap}>
        <svg
          width="100%"
          viewBox="0 0 700 582"
          overflow="visible"
          aria-label="Proceso circular de 5 fases"
          style={{ display: "block" }}
        >
          <defs>
            {/* Flecha para el arco de retorno */}
            <marker
              id="arrowRet"
              markerWidth="7" markerHeight="7"
              refX="6" refY="3.5"
              orient="auto"
            >
              <polyline
                points="0,1 5.5,3.5 0,6"
                fill="none"
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {/* Círculo guía (muy sutil) */}
          <circle
            cx="350" cy="320" r="200"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />

          {/* Arco principal: Fase 1 → Fase 5, horario, 288°
              large-arc-flag=1 (288°>180°), sweep-flag=1 (horario) */}
          <path
            ref={arcRef}
            d="M 350,120 A 200,200 0 1 1 160,258"
            fill="none"
            stroke="rgba(255,255,255,0.62)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Arco retorno: Fase 5 → Fase 1, punteado, horario, 72°
              large-arc-flag=0 (72°<180°), sweep-flag=1 (horario) */}
          <path
            ref={retRef}
            className="rline"
            d="M 160,258 A 200,200 0 0 1 350,120"
            fill="none"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1"
            strokeDasharray="4 5"
            markerEnd="url(#arrowRet)"
          />

          {/* Fases: dot + labels */}
          {PHASES.map((p, i) => {
            const c = LABEL_CFG[i]
            return (
              <g key={i} className="pg-phase">
                {/* Punto */}
                <circle
                  ref={el => (dotRefs.current[i] = el)}
                  className="rdot"
                  cx={p.cx} cy={p.cy} r="8"
                  fill="#fff"
                />
                {/* Etiquetas */}
                <g
                  ref={el => (lblRefs.current[i] = el)}
                  className="rlbl"
                >
                  <text
                    className="txt-fase"
                    x={c.lx} y={c.ly[0]}
                    textAnchor={c.anchor}
                  >{p.label}</text>
                  <text
                    className="txt-title"
                    x={c.lx} y={c.ly[1]}
                    textAnchor={c.anchor}
                  >{p.title}</text>
                  <text
                    className="txt-desc"
                    x={c.lx} y={c.ly[2]}
                    textAnchor={c.anchor}
                  >{p.desc}</text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Footer */}
      <p style={s.footer}>
        Esto no es una línea recta, tiene que estar en constante alimentación.
      </p>
    </section>
  )
}

/* ─── CSS (clases de animación + hover) ──────────────────── */
const CSS = `
  /* ── Dot ── */
  .rdot {
    opacity: 0;
    transform: scale(0);
    transform-box: fill-box;
    transform-origin: center;
    transition: opacity .3s ease,
                transform .36s cubic-bezier(.34,1.56,.64,1);
  }
  .rdot.on {
    opacity: 1;
    transform: scale(1);
  }
  /* Hover con especificidad (0,3,0) > .rdot.on (0,2,0) */
  .pg-phase:hover .rdot {
    transform: scale(1.45);
  }

  /* ── Labels ── */
  .rlbl {
    opacity: 0;
    transition: opacity .5s ease;
  }
  .rlbl.on {
    opacity: 1;
  }

  /* ── Arco retorno ── */
  .rline {
    opacity: 0;
    transition: opacity 1.1s ease;
  }
  .rline.on {
    opacity: 1;
  }

  /* ── Tipografía SVG ── */
  .txt-fase {
    font-size: 10.5px;
    font-style: italic;
    font-family: Georgia, serif;
    fill: #fff;
    opacity: 0.40;
    transition: opacity .22s ease;
  }
  .txt-title {
    font-size: 22px;
    font-weight: 900;
    font-family: Arial, sans-serif;
    letter-spacing: -0.025em;
    fill: #fff;
    opacity: 0.94;
  }
  .txt-desc {
    font-size: 11px;
    font-family: Arial, sans-serif;
    fill: #fff;
    opacity: 0.50;
    transition: opacity .22s ease;
  }

  /* Hover: texto */
  .pg-phase:hover .txt-fase { opacity: 0.80; }
  .pg-phase:hover .txt-desc { opacity: 0.70; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .dp-section { padding: 48px 24px 56px !important; }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .rdot, .rlbl, .rline {
      transition: none !important;
      opacity: 1 !important;
      transform: scale(1) !important;
    }
  }
`

/* ─── Estilos JS ─────────────────────────────────────────── */
const s = {
  section: {
    background: "#0a0a0a",
    color: "#ffffff",
    minHeight: "100vh",
    padding: "52px 44px 60px",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "clamp(2rem, 5.5vw, 4rem)",
    lineHeight: 1.05,
    margin: "0 0 22px",
    fontWeight: 400,
  },
  bold: {
    fontWeight: 900,
    fontStyle: "normal",
    letterSpacing: "-0.02em",
  },
  italic: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontWeight: 400,
    fontStyle: "italic",
  },
  intro: {
    maxWidth: 580,
    lineHeight: 1.7,
    margin: "0 0 52px",
    fontSize: "0.96rem",
    opacity: 0.88,
  },
  svgWrap: {
    width: "100%",
    maxWidth: 700,
    margin: "0 auto",
  },
  footer: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
    fontSize: "0.88rem",
    letterSpacing: "0.01em",
  },
}
