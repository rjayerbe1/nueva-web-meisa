import type { Metadata } from 'next'
import GuiaTemplate, {
  FALLBACK_HERO,
  type GuiaConfig,
} from '@/components/guias/GuiaTemplate'
import { getGuiaDb } from '@/lib/content/landings'
import { getGuiaFallback } from '@/lib/guias'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

const SLUG = 'estructura-metalica-vs-concreto'

async function getGuia() {
  return (await getGuiaDb(SLUG)) ?? getGuiaFallback(SLUG)!
}

export async function generateMetadata(): Promise<Metadata> {
  const guia = await getGuia()
  const ogImage = (guia.contenido as GuiaConfig).heroImagen || FALLBACK_HERO
  return {
    title: { absolute: guia.metaTitle },
    description: guia.metaDescription,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title: guia.metaTitle,
      description: guia.metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Estructura metálica vs concreto — comparación técnica MEISA',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: guia.metaTitle,
      description: guia.metaDescription,
      images: [ogImage],
    },
  }
}

export default async function EstructuraMetalicaVsConcretoPage() {
  const guia = await getGuia()
  // El contenido de esta guía usa el layout compartido (variante "template").
  return <GuiaTemplate config={guia.contenido as GuiaConfig} />
}
