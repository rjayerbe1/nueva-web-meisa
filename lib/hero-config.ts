// Configuración de imágenes del Hero Section
export interface HeroImageConfig {
  leftColumn: string
  centerTop: string
  centerBottom: string
  rightTop: string
  rightBottom: string
}

// Configuración por defecto
export const defaultHeroImages: HeroImageConfig = {
  leftColumn: '/images/hero/techo-metalico.jpg',
  centerTop: '/images/hero/ciclopuente-atardecer.jpg',
  centerBottom: '/images/hero/estructura-perspectiva.jpg',
  rightTop: '/images/hero/coliseo-estructuras-rojas.jpg',
  rightBottom: '/images/hero/montaje-grua.jpg',
}
