import { CategoriaEnum } from '@prisma/client'

// Iconos disponibles de Lucide React
export const LUCIDE_ICONS = {
  Building: { name: "Edificio", type: "lucide" as const },
  Factory: { name: "Fábrica", type: "lucide" as const },
  Camera: { name: "Cámara", type: "lucide" as const },
  Layers: { name: "Capas", type: "lucide" as const },
  Home: { name: "Casa", type: "lucide" as const },
  Zap: { name: "Energía", type: "lucide" as const },
  Globe: { name: "Globo", type: "lucide" as const },
  Wrench: { name: "Herramienta", type: "lucide" as const },
  MoreHorizontal: { name: "Más", type: "lucide" as const }
}

// Iconos de imágenes disponibles (archivos PNG/SVG)
export const IMAGE_ICONS = {
  'centros-comerciales': { 
    name: "Centros Comerciales", 
    type: "image" as const,
    path: "/images/icons/icono-centros-comerciales_1.png"
  },
  'cubiertas-y-fachadas': { 
    name: "Cubiertas y Fachadas", 
    type: "image" as const,
    path: "/images/icons/icono-cubiertas-y-fachadas_1.png"
  },
  'edificios': { 
    name: "Edificios", 
    type: "image" as const,
    path: "/images/icons/icono-edificios_1.png"
  },
  'escenarios-deportivos': { 
    name: "Escenarios Deportivos", 
    type: "image" as const,
    path: "/images/icons/icono-escenarios-deportivos_1.png"
  },
  'estructuras-modulares': { 
    name: "Estructuras Modulares", 
    type: "image" as const,
    path: "/images/icons/icono-estructuras-modulares_1.png"
  },
  'industria': { 
    name: "Industria", 
    type: "image" as const,
    path: "/images/icons/icono-industria_1.png"
  },
  'oil-and-gas': { 
    name: "Oil & Gas", 
    type: "image" as const,
    path: "/images/icons/icono-oil-and-gas_1.png"
  },
  'puentes-peatonales': { 
    name: "Puentes Peatonales", 
    type: "image" as const,
    path: "/images/icons/icono-puentes-peatonales_1.png"
  },
  'puentes-vehiculares': { 
    name: "Puentes Vehiculares", 
    type: "image" as const,
    path: "/images/icons/icono-puentes-vehiculares_1.png"
  }
}

// Imágenes de portada disponibles
export const CATEGORY_COVERS = {
  'centros-comerciales': {
    name: "Centros Comerciales",
    path: "/images/categories/centros-comerciales-imagen-azul.jpg"
  },
  'cubiertas-y-fachadas': {
    name: "Cubiertas y Fachadas", 
    path: "/images/categories/cubiertas-y-fachadas.jpg"
  },
  'edificios': {
    name: "Edificios",
    path: "/images/categories/edificios.jpg"
  },
  'escenarios-deportivos': {
    name: "Escenarios Deportivos",
    path: "/images/categories/escenarios-deportivos.jpg"
  },
  'estructuras-modulares': {
    name: "Estructuras Modulares",
    path: "/images/categories/estructuras-modulares.jpg"
  },
  'industria': {
    name: "Industria",
    path: "/images/categories/industria.jpg"
  },
  'oil-and-gas': {
    name: "Oil & Gas",
    path: "/images/categories/oil-and-gas-1.jpg"
  },
  'puentes-peatonales': {
    name: "Puentes Peatonales",
    path: "/images/categories/puentes-peatonales.jpg"
  },
  'puentes-vehiculares': {
    name: "Puentes Vehiculares",
    path: "/images/categories/puentes-vehiculares.jpg"
  }
}

// Mapeo de categorías a slugs
export const CATEGORY_TO_SLUG: Record<CategoriaEnum, string> = {
  CENTROS_COMERCIALES: 'centros-comerciales',
  EDIFICIOS: 'edificios',
  INDUSTRIA: 'industria',
  PUENTES_VEHICULARES: 'puentes-vehiculares',
  PUENTES_PEATONALES: 'puentes-peatonales',
  ESCENARIOS_DEPORTIVOS: 'escenarios-deportivos',
  CUBIERTAS_Y_FACHADAS: 'cubiertas-y-fachadas',
  ESTRUCTURAS_MODULARES: 'estructuras-modulares',
  OIL_AND_GAS: 'oil-and-gas',
  OTRO: 'otros'
}

// Función para obtener todos los iconos disponibles
export function getAllAvailableIcons() {
  return {
    lucide: LUCIDE_ICONS,
    images: IMAGE_ICONS
  }
}

// Función para obtener todas las imágenes de portada disponibles
export function getAllCategoryCovers() {
  return CATEGORY_COVERS
}

// Función para obtener el icono recomendado para una categoría
export function getRecommendedIcon(category: CategoriaEnum): string {
  const slug = CATEGORY_TO_SLUG[category]
  if (IMAGE_ICONS[slug as keyof typeof IMAGE_ICONS]) {
    return `image:${slug}`
  }
  // Fallback a iconos Lucide
  const fallbacks: Record<CategoriaEnum, string> = {
    CENTROS_COMERCIALES: 'Building',
    EDIFICIOS: 'Home',
    INDUSTRIA: 'Factory',
    PUENTES_VEHICULARES: 'Layers',
    PUENTES_PEATONALES: 'Layers',
    ESCENARIOS_DEPORTIVOS: 'Camera',
    CUBIERTAS_Y_FACHADAS: 'Layers',
    ESTRUCTURAS_MODULARES: 'Layers',
    OIL_AND_GAS: 'Zap',
    OTRO: 'MoreHorizontal'
  }
  return fallbacks[category] || 'Building'
}

// Función para obtener la imagen de portada recomendada para una categoría
export function getRecommendedCover(category: CategoriaEnum): string | null {
  const slug = CATEGORY_TO_SLUG[category]
  return CATEGORY_COVERS[slug as keyof typeof CATEGORY_COVERS]?.path || null
}

// Función para parsear un valor de icono (puede ser lucide, image legacy, o SVG organizado)
export function parseIconValue(iconValue: string | null) {
  if (!iconValue) return null
  
  // Nuevo formato: rutas SVG organizadas (/images/categories/[slug]/icon.svg)
  if (iconValue.startsWith('/images/categories/') && iconValue.endsWith('/icon.svg')) {
    return {
      type: 'svg' as const,
      key: iconValue,
      data: { path: iconValue }
    }
  }
  
  // Formato legacy: image:categoria-slug
  if (iconValue.startsWith('image:')) {
    const imageKey = iconValue.replace('image:', '')
    return {
      type: 'image' as const,
      key: imageKey,
      data: IMAGE_ICONS[imageKey as keyof typeof IMAGE_ICONS]
    }
  }
  
  // Formato Lucide: nombre del componente
  return {
    type: 'lucide' as const,
    key: iconValue,
    data: LUCIDE_ICONS[iconValue as keyof typeof LUCIDE_ICONS]
  }
}

// Función para crear una estructura de carpetas para categorías (similar a proyectos)
export function generateCategoryAssetPath(
  categorySlug: string,
  assetType: 'icons' | 'covers' | 'banners',
  fileName: string
): string {
  return `/images/categories/${categorySlug}/${assetType}/${fileName}`
}

// Función para organizar archivos de categorías
export async function organizeCategoryFiles() {
  // Esta función se puede usar para reorganizar archivos existentes
  // siguiendo la estructura de carpetas por categoría
  const categories = Object.keys(CATEGORY_TO_SLUG)
  
  console.log('📁 Estructura recomendada para archivos de categorías:')
  categories.forEach(category => {
    const slug = CATEGORY_TO_SLUG[category as CategoriaEnum]
    console.log(`/public/images/categories/${slug}/`)
    console.log(`  ├── icons/`)
    console.log(`  ├── covers/`)
    console.log(`  └── banners/`)
  })
}