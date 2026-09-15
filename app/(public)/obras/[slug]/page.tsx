import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCatalogo, imagenesTop, ordenar } from '@/lib/content/snapshot'
import ObraPageClient from './ObraPageClient'

export const revalidate = 3600

// Sin generateStaticParams, Next 14 trata una ruta con segmento dinámico como
// 100 % dinámica y `revalidate` no aplica (cada visita renderiza y consulta
// Neon). Con la función presente —aunque no pre-renderice nada en el build—
// cada slug se genera bajo demanda en la primera visita y queda en caché
// (ISR) durante `revalidate`.
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const obra = (await getCatalogo()).obras.find((o) => o.slug === params.slug && o.activa)
  if (!obra) return { title: 'Obra no encontrada | MEISA' }

  const customTitle = obra.metaTitle?.trim()
  const title = customTitle
    ? { absolute: customTitle }
    : obra.titulo

  const description =
    obra.metaDescription?.trim() ||
    obra.resumenCorto ||
    `Obra ejecutada por MEISA — estructuras metálicas en Colombia desde 1996.`

  const image = obra.imagenDestacada || undefined
  const ogTitle = customTitle || `${obra.titulo} | Obra MEISA`

  return {
    title,
    description,
    alternates: { canonical: `/obras/${params.slug}` },
    openGraph: {
      title: ogTitle,
      description,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: ogTitle }]
        : undefined,
      type: 'article',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ObraDetallePage({
  params,
}: {
  params: { slug: string }
}) {
  const catalogo = await getCatalogo()
  const obraRow = catalogo.obras.find((o) => o.slug === params.slug && o.activa)

  if (!obraRow) notFound()

  const obra = {
    ...obraRow,
    proyectos: ordenar(
      catalogo.proyectos.filter((p) => p.obraId === obraRow.id),
      [(p) => p.fechaFin, 'asc'],
    ).map((p) => ({
      id: p.id,
      slug: p.slug,
      titulo: p.titulo,
      descripcion: p.descripcion,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin,
      toneladas: p.toneladas,
      areaTotal: p.areaTotal,
      cliente: p.cliente,
      ubicacion: p.ubicacion,
      imagenes: imagenesTop(p),
    })),
  }

  const cat = catalogo.categorias.find((c) => c.key === obraRow.categoria)
  const categoria = cat ? { slug: cat.slug, nombre: cat.nombre, imagenCover: cat.imagenCover } : null

  // Serializar Date/Decimal
  const obraSerialized = JSON.parse(JSON.stringify(obra))

  return <ObraPageClient obra={obraSerialized} categoria={categoria} />
}
