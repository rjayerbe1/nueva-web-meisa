import { Metadata } from 'next'
import { getPoliticasData } from '@/lib/content/tecnologia-politicas'
import {
  getNormasActivas,
  getCertificacionesActivas,
} from '@/lib/content/empresa'
import { CalidadContent } from './CalidadContent'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/calidad' },
  title: 'Calidad | MEISA — Control de Calidad, Trazabilidad Digital y RUC',
  description:
    'Control de calidad en estructura metálica: soldadores calificados AWS D1.1, ensayos no destructivos (VT, PT, UT), trazabilidad QR por pieza y dossier digital en tiempo real. Certificación RUC del CCS.',
  keywords: [
    'control de calidad estructuras metálicas',
    'soldadura calificada AWS D1.1',
    'WPS PQR',
    'ensayos no destructivos',
    'trazabilidad QR',
    'dossier de calidad',
    'RUC CCS',
    'NSR-10',
    'AISC',
  ],
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEISA — Control de calidad en estructuras metálicas',
      },
    ],
  },
}

export default async function CalidadPage() {
  const [data, normas, certificaciones] = await Promise.all([
    getPoliticasData(),
    getNormasActivas(),
    getCertificacionesActivas(),
  ])
  return (
    <CalidadContent
      grupos={data.grupos}
      pilares={data.pilares}
      politicas={data.politicas}
      normas={normas}
      etapasControl={data.etapasControl}
      certificaciones={certificaciones}
      procesos={data.procesos}
    />
  )
}
