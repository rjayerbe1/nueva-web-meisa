import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'
import { TAGS } from '@/lib/cache/tags'

export const revalidate = 3600

const getCategoriasApi = cachedContent(
  ['api-categories'],
  [TAGS.categoriasProyecto],
  async () =>
    prisma.categoriaProyecto.findMany({
      where: {
        visible: true
      },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        key: true,
        nombre: true,
        descripcion: true,
        slug: true,
        imagenCover: true,
        videoCover: true,
        usarVideoCover: true,
        videoCoverScale: true,
        videoCoverPosition: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        hoverOverlayColor: true,
        hoverOverlayOpacity: true,
        enableHoverOverlay: true,
        visible: true,
        destacada: true,
        especialidades: true
      }
    }),
)

export async function GET() {
  try {
    const categorias = await getCategoriasApi()
    return NextResponse.json(categorias, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
