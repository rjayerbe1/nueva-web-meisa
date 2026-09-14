import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'
import { TAGS } from '@/lib/cache/tags'

export const revalidate = 3600

const getProyectoBySlug = cachedContent(
  ['api-project-by-slug'],
  [TAGS.proyectos, TAGS.obras],
  async (slug: string) =>
    prisma.proyecto.findFirst({
      where: {
        slug,
        visible: true
      },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        obra: {
          where: { activa: true }
        }
      }
    }),
)

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const proyecto = await getProyectoBySlug(params.slug)

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(proyecto, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}