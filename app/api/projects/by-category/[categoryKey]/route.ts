import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'
import { TAGS } from '@/lib/cache/tags'

export const revalidate = 3600

const getProyectosByCategoria = cachedContent(
  ['api-projects-by-category'],
  [TAGS.proyectos],
  async (categoryKey: string) =>
    prisma.proyecto.findMany({
      where: {
        categoria: categoryKey as any, // Assuming CategoriaEnum
        visible: true
      },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' },
          take: 1 // Solo necesitamos la primera imagen para la lista
        }
      },
      orderBy: [
        { destacado: 'desc' }, // Destacados primero
        { fechaInicio: 'desc' } // Luego por fecha más reciente
      ]
    }),
)

export async function GET(
  request: Request,
  { params }: { params: { categoryKey: string } }
) {
  try {
    const proyectos = await getProyectosByCategoria(params.categoryKey)

    return NextResponse.json(proyectos, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching projects by category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}