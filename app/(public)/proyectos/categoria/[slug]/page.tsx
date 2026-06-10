import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CategoryPageClient from './CategoryPageClient'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const categoria = await prisma.categoriaProyecto.findFirst({
    where: { slug: params.slug, visible: true },
    select: {
      nombre: true,
      descripcion: true,
      metaTitle: true,
      metaDescription: true,
      imagenCover: true,
    },
  })

  if (!categoria) {
    return { title: 'Categoría no encontrada | MEISA' }
  }

  const customTitle = categoria.metaTitle?.trim()
  // Si hay metaTitle custom lo usamos absoluto; si no, el template del layout
  // padre le añade "| MEISA - Estructuras Metálicas Colombia".
  const title = customTitle
    ? { absolute: customTitle }
    : `Proyectos de ${categoria.nombre}`

  const description =
    categoria.metaDescription?.trim() ||
    categoria.descripcion ||
    `Proyectos de ${categoria.nombre.toLowerCase()} desarrollados por MEISA — estructuras metálicas en Colombia desde 1996.`

  const image = categoria.imagenCover || undefined

  const ogTitle = customTitle || `Proyectos de ${categoria.nombre} | MEISA`

  return {
    title,
    description,
    alternates: { canonical: `/proyectos/categoria/${params.slug}` },
    openGraph: {
      title: ogTitle,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

async function getCategoria(slug: string) {
  return await prisma.categoriaProyecto.findFirst({
    where: { slug, visible: true },
    select: {
      id: true,
      key: true,
      nombre: true,
      descripcion: true,
      slug: true,
      imagenCover: true,
      icono: true,
      color: true,
      metaTitle: true,
      metaDescription: true,
      estadisticas: true,
      casosExitoIds: true,
      especialidades: true,
      textosUi: true,
    },
  })
}

async function getProyectosByCategoria(key: string) {
  return await prisma.proyecto.findMany({
    where: {
      categoria: key as any,
      visible: true,
    },
    include: {
      imagenes: {
        orderBy: { orden: 'asc' },
        take: 1,
      },
    },
    orderBy: [{ destacado: 'desc' }, { fechaInicio: 'desc' }],
  })
}

async function getBrochureByCategoria(categoriaId: string) {
  return prisma.brochure.findFirst({
    where: {
      categoriaId,
      publicado: true,
      activo: true,
      pdfUrl: { not: null },
    },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      urlAmigable: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
    },
  })
}

export default async function CategoriaPage({
  params,
}: {
  params: { slug: string }
}) {
  const categoria = await getCategoria(params.slug)
  if (!categoria) notFound()

  const [proyectos, brochure] = await Promise.all([
    getProyectosByCategoria(categoria.key),
    getBrochureByCategoria(categoria.id),
  ])

  // Serializar Date → string para pasar al client component
  const categoriaSerialized = JSON.parse(JSON.stringify(categoria))
  const proyectosSerialized = JSON.parse(JSON.stringify(proyectos))
  const brochureSerialized = brochure ? JSON.parse(JSON.stringify(brochure)) : null

  return (
    <CategoryPageClient
      categoria={categoriaSerialized}
      proyectos={proyectosSerialized}
      brochure={brochureSerialized}
    />
  )
}
