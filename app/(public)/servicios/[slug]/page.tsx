import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServicioDetailEnhanced from './ServicioDetailEnhanced'
import { getServiceColors } from '@/lib/service-colors'

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
  
  return {
    id: servicio.id,
    slug: servicio.slug,
    titulo: servicio.titulo || servicio.nombre,
    subtitulo: servicio.subtitulo || '',
    descripcion: servicio.descripcion,
    capacidades: servicio.capacidades,
    tecnologias: servicio.tecnologias as any,
    normativas: servicio.normativas as any,
    equipamiento: servicio.equipamiento as any,
    certificaciones: servicio.certificaciones as any,
    metodologia: servicio.metodologia as any,
    ventajas: servicio.ventajas as any,
    equipos: servicio.equipos as any,
    seguridad: servicio.seguridad as any,
    expertise: {
      titulo: servicio.expertiseTitulo || 'Nuestra Experiencia',
      descripcion: servicio.expertiseDescripcion || ''
    },
    imagen: servicio.imagen || `/images/servicios/${servicio.slug}.jpg`,
    icono: servicio.icono || 'Settings',
    color: servicio.color || 'blue',
    bgGradient: servicio.bgGradient || colors.gradient,
    metaTitle: servicio.metaTitle,
    metaDescription: servicio.metaDescription
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