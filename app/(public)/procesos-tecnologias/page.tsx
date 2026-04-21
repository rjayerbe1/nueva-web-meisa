import { Metadata } from 'next'
import { getProcesosTecnologiasData } from '@/lib/content/tecnologia-politicas'
import { ProcesosTecnologiasContent } from './ProcesosTecnologiasContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
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
    'StruM.I.S',
    'tecnología estructural',
  ],
}

export default async function ProcesosTecnologiasPage() {
  const data = await getProcesosTecnologiasData()
  return (
    <ProcesosTecnologiasContent
      grupos={data.grupos}
      tecnologias={data.tecnologias}
      equipos={data.equipos}
      procesos={data.procesos}
    />
  )
}
