import type { Metadata } from 'next'
import GuiaTemplate, {
  FALLBACK_HERO,
  type GuiaConfig,
} from '@/components/guias/GuiaTemplate'
import { getGuiaDb } from '@/lib/content/landings'
import { getGuiaFallback } from '@/lib/guias'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

const SLUG = 'peso-estructura-metalica-por-m2'

async function getGuia() {
  return (await getGuiaDb(SLUG)) ?? getGuiaFallback(SLUG)!
}

export async function generateMetadata(): Promise<Metadata> {
  const guia = await getGuia()
  return {
    title: { absolute: guia.metaTitle },
    description: guia.metaDescription,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title: guia.metaTitle,
      description: guia.metaDescription,
      images: [
        {
          url: FALLBACK_HERO,
          width: 1200,
          height: 630,
          alt: 'Peso de estructura metálica por metro cuadrado — rangos reales MEISA',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: guia.metaTitle,
      description: guia.metaDescription,
      images: [FALLBACK_HERO],
    },
  }
}

export default async function PesoEstructuraMetalicaPorM2Page() {
  const guia = await getGuia()
  // El contenido de esta guía usa el layout compartido (variante "template").
  return <GuiaTemplate config={guia.contenido as GuiaConfig} />
}
