import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ObraPageClient from './ObraPageClient'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const obra = await prisma.obra.findFirst({
    where: { slug: params.slug, activa: true },
    select: {
      titulo: true,
      resumenCorto: true,
      metaTitle: true,
      metaDescription: true,
      imagenDestacada: true,
    },
  })
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
    openGraph: {
      title: ogTitle,
      description,
      images: image ? [{ url: image }] : undefined,
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
  const obra = await prisma.obra.findFirst({
    where: { slug: params.slug, activa: true },
    include: {
      proyectos: {
        where: { visible: true },
        select: {
          id: true,
          slug: true,
          titulo: true,
          descripcion: true,
          fechaInicio: true,
          fechaFin: true,
          toneladas: true,
          areaTotal: true,
          cliente: true,
          ubicacion: true,
          imagenes: {
            orderBy: { orden: 'asc' },
            take: 1,
            select: { url: true, urlOptimized: true, alt: true },
          },
        },
        orderBy: { fechaFin: 'asc' },
      },
    },
  })

  if (!obra) notFound()

  const categoria = await prisma.categoriaProyecto.findFirst({
    where: { key: obra.categoria as any },
    select: { slug: true, nombre: true, imagenCover: true },
  })

  // Serializar Date/Decimal
  const obraSerialized = JSON.parse(JSON.stringify(obra))

  return <ObraPageClient obra={obraSerialized} categoria={categoria} />
}
