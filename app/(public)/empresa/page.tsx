import { Metadata } from 'next'
import EmpresaContent from './EmpresaContent'
import { getPlantasPublicas } from '@/lib/content/plantas'
import { getEmpresaData } from '@/lib/content/empresa'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const description =
    'Conoce a MEISA: diseñamos, fabricamos y montamos estructuras metálicas en Colombia desde 1996. Historia, plantas propias, gobierno corporativo y calidad.'

  return {
    title: { absolute: 'MEISA | Empresa de Estructuras Metálicas en Colombia' },
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
