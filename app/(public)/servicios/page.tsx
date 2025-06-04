import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServiciosContent from './ServiciosContent'
import { getServiceColors } from '@/lib/service-colors'

// Proceso integral de MEISA (esto podría también venir de la BD en el futuro)
const procesoIntegral = [
  {
    fase: 1,
    titulo: 'Análisis y Conceptualización',
    descripcion: 'Entendemos profundamente su proyecto y desarrollamos la solución óptima',
    fortalezas: [
      'Equipo multidisciplinario experimentado',
      'Análisis técnico exhaustivo',
      'Propuestas innovadoras y eficientes',
      'Evaluación integral de alternativas'
    ],
    entregables: 'Propuesta técnica detallada con análisis de alternativas y recomendaciones especializadas',
    icono: 'Lightbulb'
  },
  {
    fase: 2,
    titulo: 'Ingeniería y Diseño BIM',
    descripcion: 'Desarrollamos modelado 3D avanzado con tecnología BIM para visualización completa del proyecto',
    fortalezas: [
      'Tekla Structures y Autodesk BIM 360',
      'Modelado 3D paramétrico completo',
      'Coordinación multidisciplinaria en tiempo real',
      'Detección automática de interferencias'
    ],
    entregables: 'Modelos BIM 3D, planos ejecutivos, memorias de cálculo y especificaciones técnicas',
    icono: 'Calculator'
  },
  {
    fase: 3,
    titulo: 'Fabricación con Control Numérico',
    descripcion: 'Producción automatizada con maquinaria CNC y seguimiento en tiempo real del progreso',
    fortalezas: [
      'Corte plasma CNC de alta precisión',
      'Soldadores certificados AWS D1.1',
      'Sistema ERP integrado para seguimiento',
      'Capacidad 600 ton/mes certificada'
    ],
    entregables: 'Estructuras fabricadas con trazabilidad digital y certificados de calidad',
    icono: 'Cog'
  },
  {
    fase: 4,
    titulo: 'Montaje y Coordinación en Sitio',
    descripcion: 'Coordinación previa detallada e instalación con protocolos de seguridad certificados',
    fortalezas: [
      'Coordinación previa con modelo 3D',
      'Equipos especializados certificados',
      'Comunicación constante con cliente',
      'Protocolos de seguridad ISO 45001'
    ],
    entregables: 'Estructura instalada, documentación As-Built y transferencia de conocimiento',
    icono: 'HardHat'
  }
]


async function getServicios() {
  const servicios = await prisma.servicio.findMany({
    where: { activo: true },
    orderBy: { orden: 'asc' }
  })
  
  return servicios.map(servicio => {
    const colors = getServiceColors(servicio.color || 'blue')
    
    return {
      id: servicio.slug,
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
      bgGradient: servicio.bgGradient || colors.gradient
    }
  })
}

export default async function ServiciosPage() {
  const servicios = await getServicios()

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      <ServiciosContent 
        servicios={servicios}
        procesoIntegral={procesoIntegral}
      />
    </Suspense>
  )
}

export const metadata = {
  title: 'Servicios | MEISA - Estructuras Metálicas',
  description: 'Servicios integrales de estructuras metálicas: consultoría, diseño, fabricación y montaje. Más de 27 años de experiencia en proyectos industriales y comerciales.',
}