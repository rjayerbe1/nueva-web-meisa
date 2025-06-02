import { Metadata } from 'next'
import { TechnologiesPageContent } from '@/components/sections/TechnologiesPageContent'

export const metadata: Metadata = {
  title: 'Tecnología MEISA - BIM, Tekla, RISA-3D, CNC | Innovación Estructural',
  description: 'Tecnología de punta en MEISA: modelado BIM con Tekla Structures, análisis RISA-3D, corte CNC, gestión StruM.I.S. 3 plantas con equipos modernos.',
  keywords: ['BIM', 'Tekla Structures', 'RISA-3D', 'CNC', 'StruM.I.S', 'tecnología estructural', 'modelado 3D', 'análisis estructural'],
}

export default function TechnologiesPage() {
  return <TechnologiesPageContent />
}