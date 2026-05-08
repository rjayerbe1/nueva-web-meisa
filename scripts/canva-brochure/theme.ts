// Tema MEISA — sistema brutalist editorial alineado con el sitio.
// Variante Dark (showcases) como dominante, con bloques Light editorial puntuales.
// Coordenadas en inches (default de pptxgenjs).

export const THEME = {
  // Paleta MEISA: AZUL CORPORATIVO #1A3672 como dark dominante (identidad histórica).
  // Stone-50 light editorial puntual, slate-950 solo para variantes muy específicas,
  // rojo raro como acento crítico.
  color: {
    // Dark variant — AZUL MEISA corporativo (NO slate genérico)
    slate950: "1A3672", // azul corporativo MEISA — fondo dark dominante
    slate900: "1E3A8A", // azul MEISA un poco más claro
    slate800: "2C4F9F", // overlay/secciones

    // Light variant
    stone50: "FAFAF9",
    white: "FFFFFF",

    // Acentos
    rojo: "DC2626", // rojo MEISA — máxima prioridad SOLAMENTE
    azul: "1A3672", // azul corporativo — solo en logo y acentos minoritarios

    // Texto
    tinta: "0A0A0A",
    slate950Text: "020617",
    slate700: "334155", // body Light
    slate400: "94A3B8", // eyebrow Light
    slate300: "CBD5E1",
    slate200: "E2E8F0",

    whiteFull: "FFFFFF",
    white60: "94A3B8", // text-white/60 simulado en hex (slate-400)
    white40: "64748B", // text-white/40 simulado (slate-500)
    white10: "1E293B", // borders

    // Placeholder (usado solo cuando no hay foto)
    placeholder: "1E293B", // dark placeholder
  },

  // Tipografía MEISA brand (alineada con sitio)
  font: {
    display: "Bebas Neue", // titulares uppercase condensados
    displayHeavy: "Archivo Black", // nombres de proyecto extra heavy (variante)
    body: "Lato",
  },

  // Slide 16:9 estándar (LAYOUT_WIDE en pptxgenjs)
  slide: {
    width: 13.333,
    height: 7.5,
    margin: 0.5,
  },

  // Tamaños base (Bebas Neue es condensada — admite tamaños grandes)
  size: {
    displayHero: 130, // "PUENTES" portada
    displayMega: 96, // nombres en proyectos hero
    displayLarge: 64, // nombres standard
    displayMid: 36,
    displayStat: 88, // números stats grandes
    label: 14, // "PUENTE VEHICULAR"
    labelSmall: 9, // labels en grids
    body: 11,
    bodyLarge: 14,
    bodySmall: 9,
    eyebrow: 9, // "01 — EYEBROW"
  },

  // Tracking estilo sitio: 0.2em ~ 240 charSpacing en pptxgenjs (1/100 pt × 0.2em × fontSize)
  tracking: {
    eyebrow: 8,
    label: 6,
    title: 0,
  },
}

// Posiciones recurrentes
export const FRAME = {
  headerY: 0.3,
  headerLeftX: 0.5,
  headerLineY: 0.42,
  contentTopY: 0.85,
  footerY: 7.05,
  footerLineY: 7.05,
}

// Iconos Unicode para el data-sheet de specs
export const SPECS_ICONS: Record<string, string> = {
  LONGITUD: "↔︎",
  ANCHO: "↕︎",
  "PESO ESTRUCTURA": "⚖︎",
  "LUZ MÁX.": "⤢︎",
  MATERIAL: "◼︎",
  DISEÑO: "◇︎",
}

// Activos en GCS
export const ASSETS = {
  logoColor: "https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png",
  logoWhite: "https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png",
}
