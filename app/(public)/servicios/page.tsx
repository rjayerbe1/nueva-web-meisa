import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ServiciosContent from './ServiciosContent'
import { getServiceColors } from '@/lib/service-colors'

// Proceso integral de MEISA - 4 fases optimizadas con toda la información clave
const procesoIntegral = [
  {
    fase: 1,
    titulo: 'Consultoría e Ingeniería BIM',
    descripcion: 'Análisis estructural integral, modelado 3D avanzado y planeación detallada del proyecto',
    fortalezas: [
      'Análisis estructural y sísmico especializado',
      'Modelado 3D con Tekla Structures y BIM 360',
      'Software RISA-3D, RISAFloor, RISAConnection',
      'Modelos BIM 3D con coordinación multidisciplinaria',
      'Planos de fabricación y memorias de cálculo',
      'Plan de ejecución integral del proyecto'
    ],
    entregables: '',
    icono: 'Calculator'
  },
  {
    fase: 2,
    titulo: 'Fabricación y Logística Integral',
    descripcion: 'Producción especializada con tecnología CNC, gestión integrada y transporte de cargas pesadas',
    fortalezas: [
      'Corte CNC con FastCAM de alta precisión',
      'Sistema de gestión de producción integrado',
      'Soldadura calificada con certificación AWS',
      'Protección anticorrosiva garantizada 50 años',
      'Estructuras fabricadas con trazabilidad completa',
      'Transporte especializado hasta 100 toneladas'
    ],
    entregables: '',
    icono: 'Cog'
  },
  {
    fase: 3,
    titulo: 'Montaje Especializado',
    descripcion: 'Instalación con equipos especializados, trabajo en altura certificado e inspección continua SIG',
    fortalezas: [
      'Izaje con grúas y equipos especializados',
      'Trabajo en altura certificado',
      'Inspección continua con Sistema SIG',
      'Protocolos de seguridad ISO 45001',
      'Estructura montada con documentación completa',
      'Coordinación previa con modelo 3D'
    ],
    entregables: '',
    icono: 'HardHat'
  },
  {
    fase: 4,
    titulo: 'Entrega y Garantía',
    descripcion: 'Puesta en marcha documentada con garantía de calidad, capacitación y soporte especializado',
    fortalezas: [
      'Documentación As-Built completa',
      'Capacitación técnica especializada al cliente',
      'Garantía de calidad certificada',
      'Soporte post-venta continuo',
      'Transferencia completa de conocimiento',
      'Seguimiento de desempeño del proyecto'
    ],
    entregables: '',
    icono: 'Award'
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