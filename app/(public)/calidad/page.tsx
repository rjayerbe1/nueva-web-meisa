import { Metadata } from 'next'
import { getPoliticasData } from '@/lib/content/tecnologia-politicas'
import {
  getNormasActivas,
  getCertificacionesActivas,
} from '@/lib/content/empresa'
import { PoliticasContent } from './PoliticasContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Calidad | MEISA — SIG, Políticas, Certificaciones y Normas',
  description:
    'Sistema Integrado de Gestión, políticas corporativas, certificaciones y cumplimiento normativo de MEISA. NSR-10, AWS D1.1, AISC, ICONTEC.',
  keywords: [
    'política de calidad MEISA',
    'SIG',
    'Sistema Integrado de Gestión',
    'NSR-10',
    'AWS D1.1',
    'AISC',
    'SARLAFT',
  ],
}

export default async function PoliticasPage() {
  const [data, normas, certificaciones] = await Promise.all([
    getPoliticasData(),
    getNormasActivas(),
    getCertificacionesActivas(),
  ])
  return (
    <PoliticasContent
      grupos={data.grupos}
      pilares={data.pilares}
      politicas={data.politicas}
      normas={normas}
      etapasControl={data.etapasControl}
      certificaciones={certificaciones}
    />
  )
}
