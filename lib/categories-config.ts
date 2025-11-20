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
    description: "Encuentra aquí los proyectos comerciales hechos por Meisa.",
    icon: "/images/icons/icono-centros-comerciales_1.png",
    image: "/images/categories/centros-comerciales/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "centro-comercial-campanario",
    dbValue: "COMERCIAL"
  },
  {
    id: "Edificaciones",
    name: "Edificaciones",
    description: "Encuentra aquí las edificaciones hechas por Meisa.",
    icon: "/images/icons/icono-edificios_1.png",
    image: "/images/categories/edificios/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "edificios-cinemateca-distrital",
    dbValue: "EDIFICACIONES"
  },
  {
    id: "Industria",
    name: "Industria",
    description: "Encuentra aquí estructuras industriales hechos por Meisa.",
    icon: "/images/icons/icono-industria_1.png",
    image: "/images/categories/industria/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "industria-ampliacion-cargill",
    dbValue: "INDUSTRIA"
  },
  {
    id: "PuentesVehiculares",
    name: "Puentes Vehiculares",
    description: "Encuentra aquí puentes vehiculares hechos por Meisa.",
    icon: "/images/icons/icono-puentes-vehiculares_1.png",
    image: "/images/categories/puentes-vehiculares/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "puentes-vehiculares-puente-nolasco",
    dbValue: "PUENTES_VEHICULARES"
  },
  {
    id: "PuentesPeatonales",
    name: "Puentes Peatonales",
    description: "Encuentra aquí puentes peatonales hechos por Meisa.",
    icon: "/images/icons/icono-puentes-peatonales_1.png",
    image: "/images/categories/puentes-peatonales/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "puentes-peatonales-escalinata-curva-rio-cali",
    dbValue: "PUENTES_PEATONALES"
  },
  {
    id: "EscenariosDeportivos",
    name: "Escenarios Deportivos",
    description: "Encuentra aquí escenarios deportivos hechos por Meisa.",
    icon: "/images/icons/icono-escenarios-deportivos_1.png",
    image: "/images/categories/escenarios-deportivos/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "escenarios-deportivos-complejo-acuatico-popayan",
    dbValue: "ESCENARIOS_DEPORTIVOS"
  },
  {
    id: "CubiertasyFachadas",
    name: "Cubiertas y Fachadas",
    description: "Contamos con nuestra propia maquinaria para fabricar: tejas standing seam, snap lock, curvadora de tejas, steel deck y perfiles de fachada.",
    icon: "/images/icons/icono-cubiertas-y-fachadas_1.png",
    image: "/images/categories/cubiertas-y-fachadas/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "centros-comerciales-campanario",
    dbValue: "CUBIERTAS_Y_FACHADAS"
  },
  {
    id: "EstructurasModulares",
    name: "Estructuras Modulares",
    description: "Las estructuras modulares son una opción para aquellos clientes que requieren de construcciones rápidas, prácticas y económicas para diferentes espacios.",
    icon: "/images/icons/icono-estructuras-modulares_1.png",
    image: "/images/categories/estructuras-modulares/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "estructuras-modulares-cocinas-ocultas",
    dbValue: "ESTRUCTURAS_MODULARES"
  },
  {
    id: "Otro",
    name: "Otros Proyectos",
    description: "Otros proyectos especiales y soluciones personalizadas de MEISA.",
    icon: "/images/icons/icono-oil-and-gas_1.png",
    image: "/images/categories/oil-and-gas/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "oil-and-gas-tanque-pulmon",
    dbValue: "OTRO"
  }
]

export function getCategoryByDbValue(dbValue: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.dbValue === dbValue)
}

export function getCategoryById(id: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.id === id)
}