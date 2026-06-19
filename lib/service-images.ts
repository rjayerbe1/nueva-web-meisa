// Fallbacks de imágenes por servicio — fotos reales de MEISA en GCS.
// (El contenido real vive en la DB: Servicio.imagen / Servicio.imagenesGaleria.
//  Estos mapas son solo respaldo. NO usar stock/Unsplash — design system.)
const MEISA = 'https://storage.googleapis.com/meisa-imagenes'
const GCS = `${MEISA}/site`

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
    `${MEISA}/stock-brochure/plantas/1777069688120-s0pi6w-20231020_163543.jpg`,
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
// Seleccionadas para que sean HORIZONTALES, de tema acorde y de la biblioteca propia.
// Diseño usa una imagen de planos como provisional (no hay foto BIM en el pool);
// se reemplaza luego con un render/captura Tekla desde el admin.
export const serviceBackgroundImages: Record<string, string> = {
  'consultoria-en-diseno-estructural': `${GCS}/servicios/consultoria-1.jpg`,
  'fabricacion-de-estructuras-metalicas': `${MEISA}/stock-brochure/plantas/1777069732663-i5r4zi-20231020_163538.jpg`,
  'montaje-de-estructuras': `${GCS}/hero/montaje-grua.jpg`,
  'gestion-integral-de-proyectos': `${MEISA}/drone-pool/DJI_0706.webp`,
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
