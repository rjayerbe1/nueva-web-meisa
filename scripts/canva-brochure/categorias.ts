// Metadata por categoría — fuente única para títulos, taglines, layouts y specs
// del brochure. El loader usa esto para parametrizar la generación PPTX.

import type { CategoriaEnum } from "@prisma/client"
import type { LayoutKey } from "./data"

export type SpecKey =
  | "AREA"
  | "PESO"
  | "CLIENTE"
  | "DISEÑO"
  | "LUZ_MAX"
  | "MATERIAL"
  | "LONGITUD"
  | "ANCHO"

export interface CategoriaConfig {
  /** Slug usado en filenames: "edificaciones", "comercial"... */
  slug: string
  /** Nombre display singular: "Edificación", "Puente Vehicular"... */
  nombreDisplay: string
  /** Título grande de portada con saltos de línea: "PORTAFOLIO DE\nEDIFICACIONES" */
  tituloPortada: string
  /** Header running de cada página: "PORTAFOLIO EDIFICACIONES" */
  tagline: string
  /** Año o "DESDE 1996" — debajo del título en portada */
  subtituloPortada: string
  /** 2-3 líneas para portada o intro. Opcional. */
  introBody?: string
  /** Variante visual de portada: clásica de Puentes vs angular de Edificaciones */
  portadaVariant: "default" | "angular"
  /** Variante visual de contraportada */
  contraportadaVariant: "default" | "angular"
  /** Qué specs renderizar por proyecto en orden de importancia */
  specsVisibles: SpecKey[]
  /** Pool de layouts a rotar para los proyectos de esta categoría */
  layoutPool: LayoutKey[]
  /** Layout que se asigna al primer proyecto (anchor hero). Debe estar en layoutPool */
  layoutHero: LayoutKey
  /**
   * Si está definido, se asigna a 1 solo proyecto destacado (no aparece en rotación).
   * Layout R = fondo rojo dominante = máximo 1 por brochure
   */
  layoutDestacadoUnico?: LayoutKey
}

// =============================================================================
// CONFIGURACIONES POR CATEGORÍA
// =============================================================================

export const CATEGORIAS: Record<CategoriaEnum, CategoriaConfig> = {
  PUENTES: {
    slug: "puentes",
    nombreDisplay: "Puente",
    tituloPortada: "PORTAFOLIO\nPUENTES",
    tagline: "PORTAFOLIO PUENTES",
    subtituloPortada: "2026",
    introBody:
      "Cincuenta puentes vehiculares y peatonales construidos en todo el territorio nacional. Diseño, fabricación y montaje de estructuras metálicas desde 1996.",
    portadaVariant: "default",
    contraportadaVariant: "default",
    specsVisibles: ["DISEÑO", "LUZ_MAX", "MATERIAL", "LONGITUD", "ANCHO", "PESO"],
    layoutPool: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
    layoutHero: "A",
    // Puentes NO usa layout R (mantiene v12 actual sin cambios visuales)
  },

  EDIFICACIONES: {
    slug: "edificaciones",
    nombreDisplay: "Edificación",
    tituloPortada: "PORTAFOLIO DE\nEDIFICACIONES",
    tagline: "PORTAFOLIO EDIFICACIONES",
    subtituloPortada: "2026",
    introBody:
      "Estructuras metálicas para edificios, plazas comerciales, clínicas y centros de distribución. Diseño, fabricación y montaje certificado desde 1996.",
    portadaVariant: "angular",
    contraportadaVariant: "angular",
    specsVisibles: ["AREA", "PESO", "CLIENTE"],
    // Pool restringido a layouts que respetan __ctx.specsVisibles (sin specs hardcoded de Puentes).
    // L (antes/después con render BIM) y O (cifra hero=longitud) excluidos — sin sentido sin specs Puentes.
    layoutPool: ["P", "T", "B", "Q", "S", "A", "D", "E"],
    layoutHero: "P",
    layoutDestacadoUnico: "R",
  },

  COMERCIAL: {
    slug: "comercial",
    nombreDisplay: "Proyecto Comercial",
    tituloPortada: "PORTAFOLIO\nCOMERCIAL",
    tagline: "PORTAFOLIO COMERCIAL",
    subtituloPortada: "2026",
    introBody:
      "Centros comerciales, locales, plazas y outlets en todo el país. Estructuras metálicas a la medida del retail moderno.",
    portadaVariant: "angular",
    contraportadaVariant: "angular",
    specsVisibles: ["AREA", "PESO", "CLIENTE"],
    layoutPool: ["P", "T", "B", "Q", "S", "A", "D", "E", "F", "I"],
    layoutHero: "P",
    layoutDestacadoUnico: "R",
  },

  INDUSTRIAL: {
    slug: "industrial",
    nombreDisplay: "Proyecto Industrial",
    tituloPortada: "PORTAFOLIO\nINDUSTRIAL",
    tagline: "PORTAFOLIO INDUSTRIAL",
    subtituloPortada: "2026",
    introBody:
      "Bodegas, plantas, ingenios, centros logísticos. Estructura metálica para la industria pesada colombiana, con cobertura nacional.",
    portadaVariant: "angular",
    contraportadaVariant: "angular",
    specsVisibles: ["AREA", "PESO", "CLIENTE"],
    layoutPool: ["P", "T", "B", "S", "A", "D", "E", "F", "I", "Q"],
    layoutHero: "P",
    layoutDestacadoUnico: "R",
  },

  DEPORTES_EDUCACION: {
    slug: "deportes-educacion",
    nombreDisplay: "Proyecto Deportivo / Educativo",
    tituloPortada: "PORTAFOLIO\nDEPORTES Y\nEDUCACIÓN",
    tagline: "PORTAFOLIO DEPORTES & EDUCACIÓN",
    subtituloPortada: "2026",
    introBody:
      "Coliseos, canchas, tribunas y aulas. Estructuras que sostienen la formación y el deporte en universidades, colegios y municipios.",
    portadaVariant: "angular",
    contraportadaVariant: "angular",
    specsVisibles: ["AREA", "PESO", "CLIENTE"],
    layoutPool: ["P", "T", "B", "Q", "S", "A", "D", "E"],
    layoutHero: "P",
  },

  INFRAESTRUCTURA_URBANA: {
    slug: "infraestructura-urbana",
    nombreDisplay: "Infraestructura Urbana",
    tituloPortada: "PORTAFOLIO\nINFRAESTRUCTURA\nURBANA",
    tagline: "PORTAFOLIO INFRAESTRUCTURA URBANA",
    subtituloPortada: "2026",
    introBody:
      "Estaciones, paradas, mobiliario urbano y obras de movilidad pública. Soluciones metálicas para la ciudad.",
    portadaVariant: "angular",
    contraportadaVariant: "angular",
    specsVisibles: ["AREA", "PESO", "CLIENTE"],
    layoutPool: ["P", "T", "B", "A", "D", "E"],
    layoutHero: "P",
  },
}

/** Resuelve un slug CLI ("edificaciones") al CategoriaEnum */
export function categoriaFromSlug(slug: string): CategoriaEnum | null {
  const entry = Object.entries(CATEGORIAS).find(
    ([, cfg]) => cfg.slug === slug.toLowerCase().trim(),
  )
  return entry ? (entry[0] as CategoriaEnum) : null
}
