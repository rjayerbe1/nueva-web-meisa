import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServicioDetailEnhanced from './ServicioDetailEnhanced'
import { getServiceColors } from '@/lib/service-colors'
import { getServiceImages } from '@/lib/service-images'

interface ServicioPageProps {
  params: {
    slug: string
  }
}

async function getServicio(slug: string) {
  const servicio = await prisma.servicio.findUnique({
    where: { 
      slug,
      activo: true
    }
  })

  if (!servicio) {
    return null
  }

  const colors = getServiceColors(servicio.color || 'blue')
  
  // Helper to extract items from structured sections
  const extractItems = (data: any): string[] => {
    if (!data) return []
    if (Array.isArray(data)) {
      // Filter out non-string items and convert objects to strings if needed
      return data.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null) {
          // If it's an object with titulo, use that
          if (item.titulo) return item.titulo
          // If it's an object with nombre, use that
          if (item.nombre) return item.nombre
          // Otherwise, try to stringify it
          return JSON.stringify(item)
        }
        return String(item)
      })
    }
    if (data.items && Array.isArray(data.items)) {
      return data.items.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null) {
          if (item.titulo) return item.titulo
          if (item.nombre) return item.nombre
          return JSON.stringify(item)
        }
        return String(item)
      })
    }
    return []
  }

  // Helper to extract structured data (objects) from sections
  const extractStructuredData = (data: any): any[] => {
    if (!data) return []
    if (Array.isArray(data)) {
      // Ensure each item is an object, not a string
      return data.filter(item => typeof item === 'object' && item !== null)
    }
    if (data.items && Array.isArray(data.items)) {
      return data.items.filter(item => typeof item === 'object' && item !== null)
    }
    // If data is an object with titulo/descripcion, wrap it in an array
    if (typeof data === 'object' && data.titulo) {
      return [data]
    }
    return []
  }

  return {
    id: servicio.id,
    slug: servicio.slug,
    titulo: servicio.titulo || servicio.nombre,
    subtitulo: servicio.subtitulo || '',
    descripcion: servicio.descripcion,
    tecnologias: extractStructuredData(servicio.tecnologias),
    normativas: extractItems(servicio.normativas),
    equipamiento: extractStructuredData(servicio.equipamiento),
    equipos: extractItems(servicio.equipos),
    expertise: {
      titulo: servicio.expertiseTitulo || 'Nuestra Experiencia',
      descripcion: servicio.expertiseDescripcion || ''
    },
    imagen: servicio.imagen || `/images/servicios/${servicio.slug}.jpg`,
    icono: servicio.icono || 'Settings',
    color: servicio.color || 'blue',
    bgGradient: servicio.bgGradient || colors.gradient,
    metaTitle: servicio.metaTitle,
    metaDescription: servicio.metaDescription,
    // New enhanced fields - these are already arrays
    imagenesGaleria: Array.isArray(servicio.imagenesGaleria) && servicio.imagenesGaleria.length > 0
      ? servicio.imagenesGaleria as string[]
      : getServiceImages(servicio.slug),
    estadisticas: Array.isArray(servicio.estadisticas) 
      ? servicio.estadisticas as Array<{ label: string; value: string; icon: string }>
      : [],
    procesoPasos: Array.isArray(servicio.procesoPasos) 
      ? servicio.procesoPasos as Array<{ title: string; description: string; icon: string }>
      : [],
    tablaComparativa: servicio.tablaComparativa || { headers: [], rows: [] },
    videoDemostrativo: servicio.videoDemostrativo,
    preguntasFrecuentes: Array.isArray(servicio.preguntasFrecuentes) ? servicio.preguntasFrecuentes : [],
    recursosDescargables: Array.isArray(servicio.recursosDescargables) ? servicio.recursosDescargables : []
  }
}

async function getOtrosServicios(currentSlug: string) {
  const servicios = await prisma.servicio.findMany({
    where: { 
      activo: true,
      slug: {
        not: currentSlug
      }
    },
    orderBy: { orden: 'asc' },
    take: 3
  })
  
  return servicios.map(servicio => {
    const colors = getServiceColors(servicio.color || 'blue')
    
    return {
      id: servicio.id,
      slug: servicio.slug,
      titulo: servicio.titulo || servicio.nombre,
      subtitulo: servicio.subtitulo || '',
      descripcion: servicio.descripcion,
      imagen: servicio.imagen || `/images/servicios/${servicio.slug}.jpg`,
      icono: servicio.icono || 'Settings',
      color: servicio.color || 'blue',
      bgGradient: colors.gradient
    }
  })
}

export async function generateStaticParams() {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
    select: { slug: true }
  })

  return servicios.map((servicio) => ({
    slug: servicio.slug,
  }))
}

export async function generateMetadata({ params }: ServicioPageProps) {
  const servicio = await getServicio(params.slug)
  
  if (!servicio) {
    return {
      title: 'Servicio no encontrado | MEISA',
      description: 'El servicio solicitado no fue encontrado.'
    }
  }

  return {
    title: servicio.metaTitle || `${servicio.titulo} | MEISA - Estructuras Metálicas`,
    description: servicio.metaDescription || servicio.descripcion.slice(0, 160),
    openGraph: {
      title: servicio.titulo,
      description: servicio.descripcion.slice(0, 160),
      images: [
        {
          url: servicio.imagen,
          width: 1200,
          height: 630,
          alt: servicio.titulo,
        },
      ],
    },
  }
}

export default async function ServicioPage({ params }: ServicioPageProps) {
  const [servicio, otrosServicios] = await Promise.all([
    getServicio(params.slug),
    getOtrosServicios(params.slug)
  ])

  if (!servicio) {
    notFound()
  }

  return (
    <ServicioDetailEnhanced 
      servicio={servicio}
      otrosServicios={otrosServicios}
    />
  )
}