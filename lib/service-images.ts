// Imágenes placeholder para cada servicio - Imágenes locales
export const serviceImages: Record<string, string[]> = {
  'consultoria-en-diseno-estructural': [
    '/images/servicios/consultoria-1.jpg',
    '/images/servicios/consultoria-2.jpg',
    '/images/servicios/consultoria-3.jpg',
    '/images/servicios/consultoria-4.jpg'
  ],
  'fabricacion-de-estructuras-metalicas': [
    '/images/servicios/fabricacion-1.jpg',
    '/images/servicios/fabricacion-2.jpg',
    '/images/servicios/fabricacion-3.jpg',
    '/images/servicios/fabricacion-4.jpg'
  ],
  'montaje-de-estructuras': [
    '/images/servicios/montaje-1.jpg',
    '/images/servicios/montaje-2.jpg',
    '/images/servicios/montaje-3.jpg',
    '/images/servicios/montaje-4.jpg'
  ],
  'gestion-integral-de-proyectos': [
    '/images/servicios/gestion-1.jpg',
    '/images/servicios/gestion-2.jpg',
    '/images/servicios/gestion-3.jpg',
    '/images/servicios/gestion-4.jpg'
  ]
}

export function getServiceImages(slug: string): string[] {
  return serviceImages[slug] || [
    '/images/servicios/default-1.jpg',
    '/images/servicios/default-2.jpg',
    '/images/servicios/default-3.jpg',
    '/images/servicios/default-4.jpg'
  ]
}