import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServiciosContent from './ServiciosContent'
import { getServiceColors } from '@/lib/service-colors'
import { aniosExperiencia } from '@/lib/site-meta'
import { BreadcrumbSchema } from '@/components/seo/JsonLdSchema'
import { getProcesoFases } from '@/lib/content/servicios-contacto'

// Force dynamic rendering (no static generation during build)
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Proceso integral — leído de la tabla ProcesoFase (Fase 4)
async function getProcesoIntegral() {
  const fases = await getProcesoFases()
  return fases.map((f) => ({
    fase: f.numero,
    titulo: f.titulo,
    descripcion: f.descripcion,
    fortalezas: f.fortalezas,
    entregables: '',
    icono: f.icono ?? 'Settings',
  }))
}


async function getServicios() {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
    orderBy: { orden: 'asc' }
  })
  
  return servicios.map(servicio => {
    const colors = getServiceColors(servicio.color || 'blue')
    
    return {
      id: servicio.slug,
      slug: servicio.slug,
      titulo: servicio.titulo || servicio.nombre,
      subtitulo: servicio.subtitulo || '',
      descripcion: servicio.descripcion,
      tecnologias: servicio.tecnologias as any,
      normativas: servicio.normativas as any,
      equipamiento: servicio.equipamiento as any,
      equipos: servicio.equipos as any,
      expertise: {
        titulo: servicio.expertiseTitulo || 'Nuestra Experiencia',
        descripcion: servicio.expertiseDescripcion || ''
      },
      imagen: servicio.imagen || `/images/servicios/${servicio.slug}.jpg`,
      icono: servicio.icono || 'Settings',
      color: servicio.color || 'blue',
      bgGradient: servicio.bgGradient || colors.gradient
    }
  })
}

export default async function ServiciosPage() {
  const [servicios, procesoIntegral] = await Promise.all([
    getServicios(),
    getProcesoIntegral(),
  ])

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Servicios', url: 'https://meisa.com.co/servicios' },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <ServiciosContent
          servicios={servicios}
          procesoIntegral={procesoIntegral}
        />
      </Suspense>
    </>
  )
}

export const metadata = {
  title: 'Servicios de Estructuras Metálicas',
  description:
    `Servicios completos de estructuras metálicas en Colombia: diseño estructural, fabricación con tecnología CNC, montaje especializado y consultoría BIM. Más de ${aniosExperiencia()} años de experiencia. Certificación ISO.`,
  keywords: [
    'servicios estructuras metálicas',
    'diseño estructural Colombia',
    'fabricación estructuras acero',
    'montaje estructuras metálicas',
    'consultoría ingeniería estructural',
    'modelado BIM estructuras',
    'soldadura certificada AWS',
    'estructuras metálicas industriales',
    'cubiertas metálicas',
    'puentes metálicos fabricación',
  ],
  openGraph: {
    title: 'Servicios de Estructuras Metálicas | MEISA Colombia',
    description:
      'Diseño, fabricación y montaje de estructuras metálicas. Tecnología BIM, soldadura certificada AWS y garantía de calidad.',
    url: 'https://meisa.com.co/servicios',
    images: [
      {
        url: '/images/og-servicios.jpg',
        width: 1200,
        height: 630,
        alt: 'Servicios de Estructuras Metálicas MEISA',
      },
    ],
  },
  alternates: {
    canonical: 'https://meisa.com.co/servicios',
  },
}
