import { NextResponse } from 'next/server'
import { getCatalogo, ordenar } from '@/lib/content/snapshot'
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'

export const revalidate = 3600

async function getProyectosByCategoria(categoryKey: string) {
  return ordenar(
    (await getCatalogo()).proyectos.filter((p) => p.categoria === categoryKey),
    [(p) => p.destacado, 'desc'], // Destacados primero
    [(p) => p.fechaInicio, 'desc'], // Luego por fecha más reciente
  ).map((p) => ({ ...p, imagenes: p.imagenes.slice(0, 1) })) // Solo la primera imagen para la lista
}

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