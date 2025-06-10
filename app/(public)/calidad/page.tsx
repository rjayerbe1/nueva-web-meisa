import { Metadata } from 'next'
import CalidadContent from './CalidadContent'
import prisma from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'calidad' }
  })

  if (pagina) {
    return {
      title: pagina.metaTitle || pagina.titulo || 'Certificaciones MEISA - Sistema Integrado de Gestión SIG | Calidad',
      description: pagina.metaDescription || 'Certificaciones y calidad MEISA: Sistema Integrado de Gestión SIG, normas sismo resistentes NSR-10, políticas de seguridad, transparencia y ética empresarial.',
      keywords: ['SIG', 'Sistema Integrado de Gestión', 'NSR-10', 'normas sismo resistentes', 'certificaciones', 'calidad', 'seguridad', 'AWS', 'AISC'],
    }
  }

  return {
    title: 'Certificaciones MEISA - Sistema Integrado de Gestión SIG | Calidad',
    description: 'Certificaciones y calidad MEISA: Sistema Integrado de Gestión SIG, normas sismo resistentes NSR-10, políticas de seguridad, transparencia y ética empresarial.',
    keywords: ['SIG', 'Sistema Integrado de Gestión', 'NSR-10', 'normas sismo resistentes', 'certificaciones', 'calidad', 'seguridad', 'AWS', 'AISC'],
  }
}

export default async function QualityPage() {
  // Intentar obtener contenido de la base de datos
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'calidad' },
    include: {
      secciones: {
        where: { visible: true },
        orderBy: { orden: 'asc' }
      }
    }
  })

  // Siempre usar el componente original, pero pasar datos dinámicos si existen
  return <CalidadContent paginaData={pagina} />
}