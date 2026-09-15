import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/content/snapshot'
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'

export const revalidate = 3600

async function getProyectoBySlug(slug: string) {
  const catalogo = await getCatalogo()
  const p = catalogo.proyectos.find((x) => x.slug === slug)
  if (!p) return null
  const obra = p.obraId ? catalogo.obras.find((o) => o.id === p.obraId && o.activa) ?? null : null
  return { ...p, obra }
}

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