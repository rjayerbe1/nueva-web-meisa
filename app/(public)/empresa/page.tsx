import { Metadata } from 'next'
import EmpresaContent from './EmpresaContent'
import { siteConfig } from '@/lib/site-config'
import prisma from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'empresa' }
  })

  if (pagina) {
    return {
      title: pagina.metaTitle || pagina.titulo || 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
      description: pagina.metaDescription || `${siteConfig.empresa.descripcion}. Conoce nuestra historia, misión, visión, valores y políticas corporativas.`,
      keywords: ['MEISA empresa', 'estructuras metálicas Colombia', 'historia MEISA', 'misión visión valores', 'gobierno corporativo'],
    }
  }

  return {
    title: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
    description: `${siteConfig.empresa.descripcion}. Conoce nuestra historia, misión, visión, valores y políticas corporativas.`,
    keywords: ['MEISA empresa', 'estructuras metálicas Colombia', 'historia MEISA', 'misión visión valores', 'gobierno corporativo'],
  }
}

export default async function EmpresaPage() {
  // Intentar obtener contenido de la base de datos
  const pagina = await prisma.pagina.findUnique({
    where: { slug: 'empresa' },
    include: {
      secciones: {
        where: { visible: true },
        orderBy: { orden: 'asc' }
      }
    }
  })

  // Siempre usar el componente original, pero pasar datos dinámicos si existen
  return <EmpresaContent paginaData={pagina} />
}