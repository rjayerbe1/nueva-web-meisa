import { Metadata } from 'next'
import { getProcesosTecnologiasData } from '@/lib/content/tecnologia-politicas'
import { ProcesosTecnologiasContent } from './ProcesosTecnologiasContent'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/procesos-tecnologias' },
  title: 'Procesos & Tecnologías | MEISA — BIM, CNC, Trazabilidad Digital',
  description:
    'Tecnología estructural de punta en MEISA: modelado BIM con Tekla, análisis con ETABS y SAP2000, corte CNC, puentes grúa y sistemas digitales de trazabilidad.',
  keywords: [
    'BIM',
    'Tekla Structures',
    'ETABS',
    'SAP2000',
    'CNC',
    'IDEA StatiCa',
    'tecnología estructural',
  ],
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEISA — Procesos y tecnologías BIM, CNC y trazabilidad digital',
      },
    ],
  },
}

export default async function ProcesosTecnologiasPage() {
  const data = await getProcesosTecnologiasData()
  return (
    <ProcesosTecnologiasContent
      grupos={data.grupos}
      tecnologias={data.tecnologias}
      equipos={data.equipos}
      procesos={data.procesos}
      fasesFlujo={data.fasesFlujo}
    />
  )
}
