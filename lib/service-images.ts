// Fallbacks de imágenes por servicio — fotos reales de MEISA en GCS.
// (El contenido real vive en la DB: Servicio.imagen / Servicio.imagenesGaleria.
//  Estos mapas son solo respaldo. NO usar stock/Unsplash — design system.)
const GCS = 'https://storage.googleapis.com/meisa-imagenes/site'

export const serviceImages: Record<string, string[]> = {
  'consultoria-en-diseno-estructural': [
    `${GCS}/hero/estructura-perspectiva.jpg`,
    `${GCS}/about/meisa-planta-aerea.jpg`,
    `${GCS}/hero/edificios.jpg`,
    `${GCS}/proyectos/obra-construccion.jpg`,
  ],
  'fabricacion-de-estructuras-metalicas': [
    `${GCS}/about/meisa-planta-aerea.jpg`,
    `${GCS}/hero/hero-construccion-industrial.jpg`,
    `${GCS}/projects/industria/tecnofar/TECNOFAR-1.jpg`,
    `${GCS}/proyectos/obra-construccion.jpg`,
  ],
  'montaje-de-estructuras': [
    `${GCS}/hero/montaje-grua.jpg`,
    `${GCS}/hero/ciclopuente-atardecer.jpg`,
    `${GCS}/projects/edificios/tequendama/TEQUENDAMA-PARKING-CALI.jpg`,
    `${GCS}/proyectos/puente-destacado.jpg`,
  ],
  'gestion-integral-de-proyectos': [
    `${GCS}/hero/edificios.jpg`,
    `${GCS}/hero/coliseo-estructuras-rojas.jpg`,
    `${GCS}/proyectos/puente-destacado.jpg`,
    `${GCS}/hero/techo-metalico.jpg`,
  ],
}

// Imagen de fondo del hero en /servicios/[slug] (la usa getServiceBackgroundImage).
export const serviceBackgroundImages: Record<string, string> = {
  'consultoria-en-diseno-estructural': `${GCS}/hero/estructura-perspectiva.jpg`,
  'fabricacion-de-estructuras-metalicas': `${GCS}/about/meisa-planta-aerea.jpg`,
  'montaje-de-estructuras': `${GCS}/hero/montaje-grua.jpg`,
  'gestion-integral-de-proyectos': `${GCS}/hero/coliseo-estructuras-rojas.jpg`,
}

export function getServiceImages(slug: string): string[] {
  return (
    serviceImages[slug] || [
      `${GCS}/hero/estructura-perspectiva.jpg`,
      `${GCS}/hero/hero-construccion-industrial.jpg`,
      `${GCS}/hero/montaje-grua.jpg`,
      `${GCS}/hero/edificios.jpg`,
    ]
  )
}

export function getServiceBackgroundImage(slug: string): string {
  return serviceBackgroundImages[slug] || `${GCS}/hero/estructura-perspectiva.jpg`
}
