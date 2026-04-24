// Configuración de imágenes del Hero Section
export interface HeroImageConfig {
  // Desktop (3 columnas verticales - aspect ratio 3:5)
  leftColumn: string
  centerTop: string
  centerBottom: string
  rightTop: string
  rightBottom: string

  // Mobile (3 filas en portrait - aspect ratio ~5:3 landscape) - Opcionales
  mobile?: {
    row2Top?: string      // Fila 2 fondo (si no está, usa centerTop)
    row2Bottom?: string   // Fila 2 reveal (si no está, usa centerBottom)
    row3Top?: string      // Fila 3 fondo (si no está, usa rightTop)
    row3Bottom?: string   // Fila 3 reveal (si no está, usa rightBottom)
  }
}

// Videos intro del hero (logo animado). Si los campos en DB están vacíos
// se usan estos.
export const DEFAULT_HERO_VIDEO_DESKTOP = "https://storage.googleapis.com/meisa-imagenes/site/hero/logo-intro-desktop.mp4"
export const DEFAULT_HERO_VIDEO_MOBILE = "https://storage.googleapis.com/meisa-imagenes/site/hero/logo-intro-mobile.mp4"

// Configuración por defecto
export const defaultHeroImages: HeroImageConfig = {
  leftColumn: 'https://storage.googleapis.com/meisa-imagenes/site/hero/techo-metalico.jpg',
  centerTop: 'https://storage.googleapis.com/meisa-imagenes/site/hero/ciclopuente-atardecer.jpg',
  centerBottom: 'https://storage.googleapis.com/meisa-imagenes/site/hero/estructura-perspectiva.jpg',
  rightTop: 'https://storage.googleapis.com/meisa-imagenes/site/hero/coliseo-estructuras-rojas.jpg',
  rightBottom: 'https://storage.googleapis.com/meisa-imagenes/site/hero/montaje-grua.jpg',
  mobile: {
    // Por defecto, usa las mismas imágenes de desktop
    row2Top: undefined,
    row2Bottom: undefined,
    row3Top: undefined,
    row3Bottom: undefined,
  }
}
