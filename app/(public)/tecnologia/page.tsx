import { Metadata } from 'next'
import TecnologiaContent from './TecnologiaContent'
import prisma from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'tecnologia' }
  })

  if (pagina) {
    return {
      title: pagina.metaTitle || pagina.titulo || 'Tecnología MEISA - BIM, Tekla, RISA-3D, CNC | Innovación Estructural',
      description: pagina.metaDescription || 'Tecnología de punta en MEISA: modelado BIM con Tekla Structures, análisis RISA-3D, corte CNC, gestión StruM.I.S. 3 plantas con equipos modernos.',
      keywords: ['BIM', 'Tekla Structures', 'RISA-3D', 'CNC', 'StruM.I.S', 'tecnología estructural', 'modelado 3D', 'análisis estructural'],
    }
  }

  return {
    title: 'Tecnología MEISA - BIM, Tekla, RISA-3D, CNC | Innovación Estructural',
    description: 'Tecnología de punta en MEISA: modelado BIM con Tekla Structures, análisis RISA-3D, corte CNC, gestión StruM.I.S. 3 plantas con equipos modernos.',
    keywords: ['BIM', 'Tekla Structures', 'RISA-3D', 'CNC', 'StruM.I.S', 'tecnología estructural', 'modelado 3D', 'análisis estructural'],
  }
}

export default async function TechnologiesPage() {
  // Intentar obtener contenido de la base de datos
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'tecnologia' },
    include: {
      secciones: {
        where: { visible: true },
        orderBy: { orden: 'asc' }
      }
    }
  })

  // Siempre usar el componente original, pero pasar datos dinámicos si existen
  return <TecnologiaContent paginaData={pagina} />
}