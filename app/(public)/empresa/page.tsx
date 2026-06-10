import { Metadata } from 'next'
import EmpresaContent from './EmpresaContent'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getEmpresaData } from '@/lib/content/empresa'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.configuracionEmpresa.findUnique({ where: { id: 'default' } })

  const description =
    config?.descripcion ??
    'MEISA - Metálicas e Ingeniería S.A.S. Conoce nuestra historia, misión, visión, valores y políticas corporativas.'

  return {
    title: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
    description,
    keywords: [
      'MEISA empresa',
      'estructuras metálicas Colombia',
      'historia MEISA',
      'misión visión valores',
      'gobierno corporativo',
    ],
    alternates: { canonical: '/empresa' },
    openGraph: {
      title: 'Nuestra Empresa | MEISA',
      description,
      url: '/empresa',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nuestra Empresa | MEISA',
      description,
    },
  }
}

export default async function EmpresaPage() {
  const [plantas, empresa] = await Promise.all([getPlantasPublicas(), getEmpresaData()])

  return <EmpresaContent plantas={plantas} empresa={empresa} />
}
