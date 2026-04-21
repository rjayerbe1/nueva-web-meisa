import { Metadata } from 'next'
import EmpresaContent from './EmpresaContent'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getEmpresaData } from '@/lib/content/empresa'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.configuracionEmpresa.findUnique({ where: { id: 'default' } })

  return {
    title: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
    description:
      config?.descripcion ??
      'MEISA - Metálicas e Ingeniería S.A.S. Conoce nuestra historia, misión, visión, valores y políticas corporativas.',
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
  const [plantas, empresa] = await Promise.all([getPlantasPublicas(), getEmpresaData()])

  return <EmpresaContent plantas={plantas} empresa={empresa} />
}
