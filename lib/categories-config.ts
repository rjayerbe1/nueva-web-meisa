export interface ProjectCategory {
  id: string
  name: string
  description: string
  icon: string
  image: string
  backgroundColor: string
  exampleProject?: string
  dbValue: string
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: "Comercial",
    name: "Comercial",
    description: "Centros comerciales, locales retail, cines y espacios de entretenimiento.",
    icon: "/images/icons/icono-centros-comerciales_1.png",
    image: "/images/categories/centros-comerciales/cover.jpg",
    backgroundColor: "#1e40af",
    exampleProject: "centro-comercial-campanario",
    dbValue: "COMERCIAL"
  },
  {
    id: "Industrial",
    name: "Industrial",
    description: "Bodegas, centros de distribución, plantas industriales y estructuras para producción.",
    icon: "/images/icons/icono-industria_1.png",
    image: "/images/categories/industria/cover.jpg",
    backgroundColor: "#dc2626",
    exampleProject: "industria-ampliacion-cargill",
    dbValue: "INDUSTRIAL"
  },
  {
    id: "Puentes",
    name: "Puentes",
    description: "Puentes vehiculares, peatonales, ciclopuentes y viaductos.",
    icon: "/images/icons/icono-puentes-vehiculares_1.png",
    image: "/images/categories/puentes-vehiculares/cover.jpg",
    backgroundColor: "#0891b2",
    exampleProject: "puentes-vehiculares-puente-nolasco",
    dbValue: "PUENTES"
  },
  {
    id: "InfraestructuraUrbana",
    name: "Infraestructura Urbana",
    description: "Estaciones de transporte, mobiliario urbano y estructuras públicas.",
    icon: "/images/icons/icono-oil-and-gas_1.png",
    image: "/images/categories/oil-and-gas/cover.jpg",
    backgroundColor: "#7c3aed",
    exampleProject: "oil-and-gas-tanque-pulmon",
    dbValue: "INFRAESTRUCTURA_URBANA"
  },
  {
    id: "Edificaciones",
    name: "Edificaciones",
    description: "Edificios de oficinas, colegios, parqueaderos y estructuras arquitectónicas.",
    icon: "/images/icons/icono-edificios_1.png",
    image: "/images/categories/edificios/cover.jpg",
    backgroundColor: "#16a34a",
    exampleProject: "edificios-cinemateca-distrital",
    dbValue: "EDIFICACIONES"
  },
  {
    id: "DeportesEducacion",
    name: "Deportes & Educación",
    description: "Coliseos, canchas, instalaciones deportivas y educativas.",
    icon: "/images/icons/icono-escenarios-deportivos_1.png",
    image: "/images/categories/escenarios-deportivos/cover.jpg",
    backgroundColor: "#ea580c",
    exampleProject: "escenarios-deportivos-complejo-acuatico-popayan",
    dbValue: "DEPORTES_EDUCACION"
  }
]

export function getCategoryByDbValue(dbValue: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.dbValue === dbValue)
}

export function getCategoryById(id: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.id === id)
}