import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CategoryPageClient from './CategoryPageClient'

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 60

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
      imagenBanner: true,
      videoBanner: true,
      usarVideoBanner: true,
      videoBannerScale: true,
      videoBannerPosition: true,
      icono: true,
      color: true,
      colorSecundario: true,
      overlayColor: true,
      overlayOpacity: true,
      metaTitle: true,
      metaDescription: true,
      descripcionAmpliada: true,
      estadisticas: true,
      procesoTrabajo: true,
      casosExitoIds: true,
      especialidades: true,
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
  const brochure = await prisma.brochure.findFirst({
    where: {
      categoriaId,
      publicado: true,
      activo: true,
    },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      urlAmigable: true,
      thumbnail: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
      fechaPublicacion: true,
      pages: {
        where: { visible: true },
        select: {
          id: true,
          nombre: true,
          canvasData: true,
          configuracion: true,
          orden: true,
        },
        orderBy: { orden: 'asc' },
        take: 1,
      },
    },
  })

  if (!brochure) return null

  const totalPages = await prisma.brochurePage.count({
    where: { brochureId: brochure.id, visible: true },
  })

  return {
    ...brochure,
    totalPages,
    primeraPagePreview: brochure.pages[0] || null,
  }
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
