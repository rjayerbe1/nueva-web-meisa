import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServiciosContent from './ServiciosContent'
import { getServiceColors } from '@/lib/service-colors'
import { aniosExperiencia } from '@/lib/site-meta'
import { BreadcrumbSchema } from '@/components/seo/JsonLdSchema'
import { getProcesoFases, getServiciosPagina, type ServiciosStatConfig } from '@/lib/content/servicios-contacto'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

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


// Resuelve la franja de cifras: valores "AUTO" se calculan en vivo desde la DB
// (mismo origen que /soluciones → nunca se contradicen); literales se usan tal cual.
async function getStats(config: ServiciosStatConfig[]) {
  const agg = await prisma.proyecto.aggregate({
    where: { visible: true },
    _count: { _all: true },
    _sum: { toneladas: true, areaTotal: true },
  })
  const floorTo = (n: number, step: number) => Math.floor(n / step) * step
  const fmt = (n: number) => n.toLocaleString('es-CO')
  const auto: Record<string, string> = {
    anios: `${aniosExperiencia()}`,
    proyectos: fmt(floorTo(agg._count._all, 10)),
    toneladas: fmt(floorTo(Math.round(Number(agg._sum.toneladas || 0)), 1000)),
    m2: fmt(floorTo(Math.round(Number(agg._sum.areaTotal || 0)), 10000)),
  }
  return config.map((s) => ({
    value: s.valor === 'AUTO' ? auto[s.clave] ?? s.valor : s.valor,
    suffix: s.sufijo || undefined,
    label: s.label,
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
      imagen: servicio.imagen || `https://storage.googleapis.com/meisa-imagenes/site/servicios/${servicio.slug}.jpg`,
      icono: servicio.icono || 'Settings',
      color: servicio.color || 'blue',
      bgGradient: servicio.bgGradient || colors.gradient
    }
  })
}

export default async function ServiciosPage() {
  const [servicios, procesoIntegral, pagina] = await Promise.all([
    getServicios(),
    getProcesoIntegral(),
    getServiciosPagina(),
  ])
  const stats = await getStats(pagina.stats)

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
          stats={stats}
          pagina={pagina}
        />
      </Suspense>
    </>
  )
}

export const metadata = {
  title: { absolute: 'Servicios de Estructuras Metálicas | MEISA' },
  description:
    'Servicios de estructuras metálicas en Colombia: diseño estructural, fabricación CNC, montaje especializado y consultoría BIM. Certificación RUC, desde 1996.',
  keywords: [
    'servicios estructuras metálicas',
    'diseño estructural Colombia',
    'fabricación estructuras acero',
    'montaje estructuras metálicas',
    'consultoría ingeniería estructural',
    'modelado BIM estructuras',
    'soldadura calificada AWS',
    'estructuras metálicas industriales',
    'cubiertas metálicas',
    'puentes metálicos fabricación',
  ],
  openGraph: {
    title: 'Servicios de Estructuras Metálicas | MEISA Colombia',
    description:
      'Diseño, fabricación y montaje de estructuras metálicas. Tecnología BIM, soldadura calificada AWS y garantía de calidad.',
    url: 'https://meisa.com.co/servicios',
    images: [
      {
        url: 'https://storage.googleapis.com/meisa-imagenes/site/og-servicios.jpg',
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
