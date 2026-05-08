// Datos REALES de MEISA + 5 puentes sample para validación de layouts.
// Stats verificados contra Prisma DB (1996 fundación, 269 proyectos, 32.577 ton).

export type LayoutKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O"

export interface ProyectoPuente {
  layout: LayoutKey
  numero: number // "01 / 50" — posición en el portafolio puentes
  tipo: string
  nombre: string
  ubicacionCorta: string
  anio: string
  diseno: string
  luzMax: string
  material: string
  longitud: string
  ancho: string
  peso: string
  fotos: string[]
}

const GCS = "https://storage.googleapis.com/meisa-imagenes/projects"
const CATS = "https://storage.googleapis.com/meisa-imagenes/categories"

// =============================================================================
// STATS GLOBALES — datos reales de DB Prisma (verificados 2026-05-07)
// =============================================================================
export const STATS_GLOBAL = {
  anios: "30",
  proyectos: "269",
  toneladas: "32.500",
  puentes: "50",
}

// =============================================================================
// EMPRESA (de ConfiguracionTrayectoria + textos canónicos del sitio)
// =============================================================================
export const EMPRESA = {
  nombre: "MEISA",
  razonSocial: "Metálicas e Ingeniería S.A.S.",
  fundacion: "1996",
  ciudadFundacion: "Popayán",
  tagline: "Construimos tu visión en acero",
  web: "meisa.com.co",
  ciudades: ["Popayán", "Cali"],

  // Línea de apertura del portafolio (página intro)
  introTitulo: "DISEÑO,\nFABRICACIÓN\nY MONTAJE",
  introSubtitulo: "DESDE 1996",
  introBody:
    "Treinta años proyectando, fabricando y montando estructuras metálicas en todo el territorio nacional. Más de 50 puentes vehiculares y peatonales construidos, con cobertura desde el sur del país hasta la capital.",
}

// =============================================================================
// CAPACIDADES (3 pilares)
// =============================================================================
export const CAPACIDADES = [
  {
    numero: "01",
    titulo: "DISEÑO",
    descripcion:
      "Modelado BIM con Tekla Structures y AutoCAD. Cumplimiento NSR-10 y AWS D1.1. Cálculo estructural y planos de fabricación.",
  },
  {
    numero: "02",
    titulo: "FABRICACIÓN",
    descripcion:
      "Plantas en Popayán y Cali con capacidad de izaje de 20 toneladas. Soldadura certificada AWS. Control dimensional y de calidad.",
  },
  {
    numero: "03",
    titulo: "MONTAJE",
    descripcion:
      "Equipos especializados en izaje y montaje en obra. Coordinación logística para sitios remotos. Cumplimiento HSE.",
  },
]

// =============================================================================
// TIMELINE (hitos clave 1996-2026)
// =============================================================================
export const TIMELINE = [
  { anio: "1996", titulo: "FUNDACIÓN", desc: "Constituida en Popayán, especializada en estructuras metálicas." },
  { anio: "2005", titulo: "PRIMERA PLANTA", desc: "Apertura de planta de fabricación con izaje 10 ton." },
  { anio: "2012", titulo: "EXPANSIÓN", desc: "Ampliación a Valle del Cauca. Primeros puentes vehiculares mayores." },
  { anio: "2018", titulo: "BIM + TEKLA", desc: "Implementación de Tekla Structures y modelado BIM completo." },
  { anio: "2024", titulo: "PUENTE CASCADA", desc: "531 toneladas, Vía Panamericana." },
  { anio: "2026", titulo: "PUENTE OVEJAS", desc: "560 toneladas, 188.8m de longitud." },
]

// =============================================================================
// MAPA — ciudades con presencia (para visual de Colombia)
// =============================================================================
export const UBICACIONES = [
  { ciudad: "BOGOTÁ", proyectos: 28 },
  { ciudad: "CALI", proyectos: 87 },
  { ciudad: "POPAYÁN", proyectos: 42 },
  { ciudad: "MEDELLÍN", proyectos: 14 },
  { ciudad: "BUCARAMANGA", proyectos: 9 },
  { ciudad: "BARRANQUILLA", proyectos: 7 },
  { ciudad: "PASTO", proyectos: 12 },
  { ciudad: "CAUCA RURAL", proyectos: 35 },
]

// =============================================================================
// PULL QUOTE — frase destacada
// =============================================================================
export const PULL_QUOTE = {
  texto: "EL PUENTE QUE\nMEJOR FUNCIONA\nES EL QUE NADIE\nVE FALLAR.",
  atribucion: "MEISA · CULTURA DE INGENIERÍA",
}

// =============================================================================
// FOTOS PARA PÁGINAS NARRATIVAS (heroes/banners aprobados de GCS)
// =============================================================================
const HERO = "https://storage.googleapis.com/meisa-imagenes/hero"
export const FOTOS_NARRATIVAS = {
  // Foto lateral en stats — un puente de impacto
  statsLateral: `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`,

  // Foto en intro misión (top o lateral) — fabricación/equipo
  introTop: `${HERO}/1763216387466-13vdb4.jpg`,

  // 3 fotos para capacidades
  capDiseno: `${HERO}/1763213863775-b9p44a.jpg`,
  capFabricacion: `${HERO}/1763217339824-vzdyof.jpg`,
  capMontaje: `${HERO}/1763216463629-enjiby.jpeg`,

  // Foto background o lateral en timeline
  timelineLateral: `${HERO}/1763559725676-sef3oi.jpg`,

  // Foto en mapa
  mapaFoto: `${HERO}/1763221343625-ordhxi.jpg`,
}

// =============================================================================
// PROYECTOS SAMPLE (5 puentes para validar layouts)
// =============================================================================
export const PROYECTOS_SAMPLE: ProyectoPuente[] = [
  {
    layout: "A",
    numero: 1,
    tipo: "PUENTE VEHICULAR",
    nombre: "OVEJAS",
    ubicacionCorta: "Vía Panamericana — Caldoño, Cauca",
    anio: "2026",
    diseno: "Puente metálico viga cajón mixto. 4 apoyos.",
    luzMax: "78 m",
    material: "A709 GR. 50W — Z1",
    longitud: "188.8 m",
    ancho: "7.7 m",
    peso: "560 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-02-Puente-vehicular-la-paila-2-1600x1600.webp`,
    ],
  },
  {
    layout: "B",
    numero: 2,
    tipo: "PUENTE VEHICULAR",
    nombre: "CASCADA",
    ubicacionCorta: "Vía Panamericana — Mondomo, Cauca",
    anio: "2024",
    diseno: "Puente metálico, 3 vigas de alma llena, 2 apoyos.",
    luzMax: "59 m",
    material: "A709 GR. 50W — Z1",
    longitud: "59 m",
    ancho: "12.5 m",
    peso: "531.4 ton",
    fotos: [
      `${CATS}/1772479892894-5ehatt.jpeg`,
      `${CATS}/1772479895971-nkx652.jpeg`,
    ],
  },
  {
    layout: "C",
    numero: 3,
    tipo: "PUENTE PEATONAL",
    nombre: "TECNOQUIMICAS",
    ubicacionCorta: "Jamundí, Valle del Cauca",
    anio: "2021",
    diseno: "Puente metálico de armadura.",
    luzMax: "60 m",
    material: "A572 Gr 50",
    longitud: "60 m",
    ancho: "2.4 m",
    peso: "33 ton",
    fotos: [
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-01-Puente-peatonal-la-tertulia-1-1600x1600.webp`,
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-02-Puente-peatonal-la-tertulia-2-1600x1600.webp`,
    ],
  },
  {
    layout: "D",
    numero: 4,
    tipo: "PUENTE VEHICULAR",
    nombre: "LA FLORESTA",
    ubicacionCorta: "Bogotá, Cundinamarca",
    anio: "2021",
    diseno: "Puente metálico viga cajón, 1 viga, 5 apoyos.",
    luzMax: "50 m",
    material: "A709 Gr 50W Z1",
    longitud: "181 m",
    ancho: "8 m",
    peso: "394 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-01-puente-vehicular-la-veinti-uno-01-Puente-vehicular-la-veinti-uno-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-02-puente-vehicular-la-veinti-uno-02-Puente-vehicular-la-veinti-uno-2-1600x1600.webp`,
    ],
  },
  {
    layout: "E",
    numero: 5,
    tipo: "PUENTE PEATONAL",
    nombre: "SANTANDER\nDE QUILICHAO",
    ubicacionCorta: "Valle del Cauca",
    anio: "2023",
    diseno: "Puente metálico vigas de alma llena, 2 vigas, 2 apoyos.",
    luzMax: "13 m",
    material: "A572 Gr 50",
    longitud: "13 m",
    ancho: "2.4 m",
    peso: "10 ton",
    fotos: [
      `${GCS}/puente-peatonal-terminal-intermedio/puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-05-1748718691432-csqud3-4000x3072.webp`,
      `${GCS}/puente-peatonal-terminal-intermedio/puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-1748718691138-m0glid-4608x3080.webp`,
    ],
  },
  // Layouts F-O reutilizan los 5 proyectos del PDF rotando para mostrar variedad de composiciones
  {
    layout: "F",
    numero: 6,
    tipo: "PUENTE VEHICULAR",
    nombre: "OVEJAS",
    ubicacionCorta: "Vía Panamericana — Caldoño, Cauca",
    anio: "2026",
    diseno: "Puente metálico viga cajón mixto. 4 apoyos.",
    luzMax: "78 m", material: "A709 GR. 50W — Z1", longitud: "188.8 m", ancho: "7.7 m", peso: "560 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-02-Puente-vehicular-la-paila-2-1600x1600.webp`,
    ],
  },
  {
    layout: "G",
    numero: 7,
    tipo: "PUENTE VEHICULAR",
    nombre: "CASCADA",
    ubicacionCorta: "Vía Panamericana — Mondomo, Cauca",
    anio: "2024",
    diseno: "Puente metálico, 3 vigas de alma llena, 2 apoyos.",
    luzMax: "59 m", material: "A709 GR. 50W — Z1", longitud: "59 m", ancho: "12.5 m", peso: "531.4 ton",
    fotos: [
      `${CATS}/1772479892894-5ehatt.jpeg`,
      `${CATS}/1772479895971-nkx652.jpeg`,
    ],
  },
  {
    layout: "H",
    numero: 8,
    tipo: "PUENTE PEATONAL",
    nombre: "TECNOQUIMICAS",
    ubicacionCorta: "Jamundí, Valle del Cauca",
    anio: "2021",
    diseno: "Puente metálico de armadura.",
    luzMax: "60 m", material: "A572 Gr 50", longitud: "60 m", ancho: "2.4 m", peso: "33 ton",
    fotos: [
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-01-Puente-peatonal-la-tertulia-1-1600x1600.webp`,
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-02-Puente-peatonal-la-tertulia-2-1600x1600.webp`,
    ],
  },
  {
    layout: "I",
    numero: 9,
    tipo: "PUENTE VEHICULAR",
    nombre: "LA FLORESTA",
    ubicacionCorta: "Bogotá, Cundinamarca",
    anio: "2021",
    diseno: "Puente metálico viga cajón, 1 viga, 5 apoyos.",
    luzMax: "50 m", material: "A709 Gr 50W Z1", longitud: "181 m", ancho: "8 m", peso: "394 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-01-puente-vehicular-la-veinti-uno-01-Puente-vehicular-la-veinti-uno-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-02-puente-vehicular-la-veinti-uno-02-Puente-vehicular-la-veinti-uno-2-1600x1600.webp`,
    ],
  },
  {
    layout: "J",
    numero: 10,
    tipo: "PUENTE PEATONAL",
    nombre: "QUILICHAO",
    ubicacionCorta: "Valle del Cauca",
    anio: "2023",
    diseno: "Puente metálico vigas de alma llena, 2 vigas, 2 apoyos.",
    luzMax: "13 m", material: "A572 Gr 50", longitud: "13 m", ancho: "2.4 m", peso: "10 ton",
    fotos: [
      `${GCS}/puente-peatonal-terminal-intermedio/puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-05-1748718691432-csqud3-4000x3072.webp`,
      `${GCS}/puente-peatonal-terminal-intermedio/puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-puente-peatonal-terminal-intermedio-01-1748718691138-m0glid-4608x3080.webp`,
    ],
  },
  {
    layout: "K",
    numero: 11,
    tipo: "PUENTE VEHICULAR",
    nombre: "OVEJAS",
    ubicacionCorta: "Vía Panamericana — Caldoño, Cauca",
    anio: "2026",
    diseno: "Puente metálico viga cajón mixto. 4 apoyos.",
    luzMax: "78 m", material: "A709 GR. 50W — Z1", longitud: "188.8 m", ancho: "7.7 m", peso: "560 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-02-Puente-vehicular-la-paila-2-1600x1600.webp`,
    ],
  },
  {
    layout: "L",
    numero: 12,
    tipo: "PUENTE VEHICULAR",
    nombre: "CASCADA",
    ubicacionCorta: "Vía Panamericana — Mondomo, Cauca",
    anio: "2024",
    diseno: "Puente metálico, 3 vigas de alma llena, 2 apoyos.",
    luzMax: "59 m", material: "A709 GR. 50W — Z1", longitud: "59 m", ancho: "12.5 m", peso: "531.4 ton",
    fotos: [
      `${CATS}/1772479892894-5ehatt.jpeg`,
      `${CATS}/1772479895971-nkx652.jpeg`,
    ],
  },
  {
    layout: "M",
    numero: 13,
    tipo: "PUENTE PEATONAL",
    nombre: "TECNOQUIMICAS",
    ubicacionCorta: "Jamundí, Valle del Cauca",
    anio: "2021",
    diseno: "Puente metálico de armadura.",
    luzMax: "60 m", material: "A572 Gr 50", longitud: "60 m", ancho: "2.4 m", peso: "33 ton",
    fotos: [
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-01-Puente-peatonal-la-tertulia-1-1600x1600.webp`,
      `${GCS}/puente-peatonal-la-tertulia/puente-peatonal-la-tertulia-02-Puente-peatonal-la-tertulia-2-1600x1600.webp`,
    ],
  },
  {
    layout: "N",
    numero: 14,
    tipo: "PUENTE VEHICULAR",
    nombre: "LA FLORESTA",
    ubicacionCorta: "Bogotá, Cundinamarca",
    anio: "2021",
    diseno: "Puente metálico viga cajón, 1 viga, 5 apoyos.",
    luzMax: "50 m", material: "A709 Gr 50W Z1", longitud: "181 m", ancho: "8 m", peso: "394 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-01-puente-vehicular-la-veinti-uno-01-Puente-vehicular-la-veinti-uno-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-21/puente-vehicular-la-21-02-puente-vehicular-la-veinti-uno-02-Puente-vehicular-la-veinti-uno-2-1600x1600.webp`,
    ],
  },
  {
    layout: "O",
    numero: 15,
    tipo: "PUENTE VEHICULAR",
    nombre: "OVEJAS",
    ubicacionCorta: "Vía Panamericana — Caldoño, Cauca",
    anio: "2026",
    diseno: "Puente metálico viga cajón mixto. 4 apoyos.",
    luzMax: "78 m", material: "A709 GR. 50W — Z1", longitud: "188.8 m", ancho: "7.7 m", peso: "560 ton",
    fotos: [
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-01-Puente-vehicular-la-paila-1-1600x1600.webp`,
      `${GCS}/puente-vehicular-la-paila/puente-vehicular-la-paila-02-Puente-vehicular-la-paila-2-1600x1600.webp`,
    ],
  },
]
