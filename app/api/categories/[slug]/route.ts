import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/content/snapshot'
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'

export const revalidate = 3600

async function getCategoriaBySlug(slug: string) {
  const c = (await getCatalogo()).categorias.find((cat) => cat.slug === slug && cat.visible)
  if (!c) return null
  return {
    id: c.id,
    key: c.key,
    nombre: c.nombre,
    descripcion: c.descripcion,
    slug: c.slug,
    imagenCover: c.imagenCover,
    icono: c.icono,
    color: c.color,
    colorSecundario: c.colorSecundario,
    overlayColor: c.overlayColor,
    overlayOpacity: c.overlayOpacity,
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    estadisticas: c.estadisticas,
    casosExitoIds: c.casosExitoIds,
    especialidades: c.especialidades,
  }
}

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
