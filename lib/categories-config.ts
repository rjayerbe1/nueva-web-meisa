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
    id: "CentrosComerciales",
    name: "Centros Comerciales",
    description: "Encuentra aquí los centros comerciales hechos por Meisa.",
    icon: "/images/categories/centros-comerciales/icon.svg",
    image: "/images/categories/centros-comerciales/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "centro-comercial-campanario",
    dbValue: "CENTROS_COMERCIALES"
  },
  {
    id: "Edificios",
    name: "Edificios",
    description: "Encuentra aquí los edificios hechos por Meisa.",
    icon: "/images/categories/edificios/icon.svg",
    image: "/images/categories/edificios/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "edificios-cinemateca-distrital",
    dbValue: "EDIFICIOS"
  },
  {
    id: "Industria",
    name: "Industria",
    description: "Encuentra aquí estructuras industriales hechos por Meisa.",
    icon: "/images/categories/industria/icon.svg",
    image: "/images/categories/industria/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "industria-ampliacion-cargill",
    dbValue: "INDUSTRIA"
  },
  {
    id: "PuentesVehiculares",
    name: "Puentes Vehiculares",
    description: "Encuentra aquí puentes vehiculares hechos por Meisa.",
    icon: "/images/categories/puentes-vehiculares/icon.svg",
    image: "/images/categories/puentes-vehiculares/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "puentes-vehiculares-puente-nolasco",
    dbValue: "PUENTES_VEHICULARES"
  },
  {
    id: "PuentesPeatonales",
    name: "Puentes Peatonales",
    description: "Encuentra aquí puentes peatonales hechos por Meisa.",
    icon: "/images/categories/puentes-peatonales/icon.svg",
    image: "/images/categories/puentes-peatonales/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "puentes-peatonales-escalinata-curva-rio-cali",
    dbValue: "PUENTES_PEATONALES"
  },
  {
    id: "EscenariosDeportivos",
    name: "Escenarios Deportivos",
    description: "Encuentra aquí escenarios deportivos hechos por Meisa.",
    icon: "/images/categories/escenarios-deportivos/icon.svg",
    image: "/images/categories/escenarios-deportivos/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "escenarios-deportivos-complejo-acuatico-popayan",
    dbValue: "ESCENARIOS_DEPORTIVOS"
  },
  {
    id: "CubiertasyFachadas",
    name: "Cubiertas y Fachadas",
    description: "Contamos con nuestra propia maquinaria para fabricar: tejas standing seam, snap lock, curvadora de tejas, steel deck y perfiles de fachada.",
    icon: "/images/categories/cubiertas-y-fachadas/icon.svg",
    image: "/images/categories/cubiertas-y-fachadas/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "centros-comerciales-campanario",
    dbValue: "CUBIERTAS_Y_FACHADAS"
  },
  {
    id: "EstructurasModulares",
    name: "Estructuras Modulares",
    description: "Las estructuras modulares son una opción para aquellos clientes que requieren de construcciones rápidas, prácticas y económicas para diferentes espacios.",
    icon: "/images/categories/estructuras-modulares/icon.svg",
    image: "/images/categories/estructuras-modulares/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "estructuras-modulares-cocinas-ocultas",
    dbValue: "ESTRUCTURAS_MODULARES"
  },
  {
    id: "OilandGas",
    name: "Oil and Gas",
    description: "En MEISA brindamos soluciones para la industria petrolera, química, alimenticia, papelera, entre otras, fabricando: Intercambiadores de calor, recipientes a presión, recipientes atmosféricos y muchos más equipos industriales.",
    icon: "/images/categories/oil-and-gas/icon.svg",
    image: "/images/categories/oil-and-gas/cover.jpg",
    backgroundColor: "#2d2e80",
    exampleProject: "oil-and-gas-tanque-pulmon",
    dbValue: "OIL_AND_GAS"
  }
]

export function getCategoryByDbValue(dbValue: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.dbValue === dbValue)
}

export function getCategoryById(id: string): ProjectCategory | undefined {
  return PROJECT_CATEGORIES.find(cat => cat.id === id)
}