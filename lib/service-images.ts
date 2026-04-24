// Imágenes placeholder para cada servicio - Imágenes locales
export const serviceImages: Record<string, string[]> = {
  'consultoria-en-diseno-estructural': [
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/consultoria-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/consultoria-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/consultoria-3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/consultoria-4.jpg'
  ],
  'fabricacion-de-estructuras-metalicas': [
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/fabricacion-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/fabricacion-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/fabricacion-3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/fabricacion-4.jpg'
  ],
  'montaje-de-estructuras': [
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/montaje-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/montaje-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/montaje-3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/montaje-4.jpg'
  ],
  'gestion-integral-de-proyectos': [
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/gestion-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/gestion-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/gestion-3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/gestion-4.jpg'
  ]
}

// Imágenes de fondo únicas para cada servicio - usando imágenes de Unsplash relevantes
export const serviceBackgroundImages: Record<string, string> = {
  'consultoria-en-diseno-estructural': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070', // Arquitecto con planos
  'fabricacion-de-estructuras-metalicas': 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=2074', // Soldadura industrial
  'montaje-de-estructuras': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070', // Construcción con grúas
  'gestion-integral-de-proyectos': 'https://images.unsplash.com/photo-1664906225771-ad3c3c585c4a?q=80&w=2070' // Gestión de proyectos
}

export function getServiceImages(slug: string): string[] {
  return serviceImages[slug] || [
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/default-1.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/default-2.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/default-3.jpg',
    'https://storage.googleapis.com/meisa-imagenes/site/servicios/default-4.jpg'
  ]
}

export function getServiceBackgroundImage(slug: string): string {
  return serviceBackgroundImages[slug] || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070'
}