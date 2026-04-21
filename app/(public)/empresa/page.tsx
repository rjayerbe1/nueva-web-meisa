import { Metadata } from 'next'
import EmpresaContent from './EmpresaContent'
import prisma from '@/lib/prisma'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getEmpresaData } from '@/lib/content/empresa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const [pagina, config] = await Promise.all([
    prisma.pagina.findUnique({ where: { slug: 'empresa' } }),
    prisma.configuracionEmpresa.findUnique({ where: { id: 'default' } }),
  ])

  const fallbackDesc =
    config?.descripcion ??
    'MEISA - Metálicas e Ingeniería S.A.S. Conoce nuestra historia, misión, visión, valores y políticas corporativas.'

  return {
    title:
      pagina?.metaTitle ??
      pagina?.titulo ??
      'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
    description: pagina?.metaDescription ?? fallbackDesc,
    keywords: [
      'MEISA empresa',
      'estructuras metálicas Colombia',
      'historia MEISA',
      'misión visión valores',
      'gobierno corporativo',
    ],
  }
}

export default async function EmpresaPage() {
  const [pagina, plantas, empresa] = await Promise.all([
    prisma.pagina.findUnique({
      where: { slug: 'empresa' },
      include: {
        secciones: {
          where: { visible: true },
          orderBy: { orden: 'asc' },
        },
      },
    }),
    getPlantasPublicas(),
    getEmpresaData(),
  ])

  return (
    <EmpresaContent
      paginaData={pagina}
      plantas={plantas}
      empresa={empresa}
    />
  )
}
