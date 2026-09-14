import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'
import { TAGS } from '@/lib/cache/tags'

export const revalidate = 3600

const getCategoriaBySlug = cachedContent(
  ['api-category-by-slug'],
  [TAGS.categoriasProyecto],
  async (slug: string) =>
    prisma.categoriaProyecto.findFirst({
      where: {
        slug,
        visible: true
      },
      select: {
        id: true,
        key: true,
        nombre: true,
        descripcion: true,
        slug: true,
        imagenCover: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        metaTitle: true,
        metaDescription: true,
        estadisticas: true,
        casosExitoIds: true,
        especialidades: true
      }
    }),
)

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoria = await getCategoriaBySlug(params.slug)

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...categoria,
      beneficios: null
    }, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
