import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/content/snapshot'
import { PUBLIC_API_CACHE_HEADERS } from '@/lib/cache/content-cache'

export const revalidate = 3600

async function getCategoriasApi() {
  return (await getCatalogo()).categorias
    .filter((c) => c.visible)
    .map((c) => ({
      id: c.id,
      key: c.key,
      nombre: c.nombre,
      descripcion: c.descripcion,
      slug: c.slug,
      imagenCover: c.imagenCover,
      videoCover: c.videoCover,
      usarVideoCover: c.usarVideoCover,
      videoCoverScale: c.videoCoverScale,
      videoCoverPosition: c.videoCoverPosition,
      icono: c.icono,
      color: c.color,
      colorSecundario: c.colorSecundario,
      overlayColor: c.overlayColor,
      overlayOpacity: c.overlayOpacity,
      hoverOverlayColor: c.hoverOverlayColor,
      hoverOverlayOpacity: c.hoverOverlayOpacity,
      enableHoverOverlay: c.enableHoverOverlay,
      visible: c.visible,
      destacada: c.destacada,
      especialidades: c.especialidades,
    }))
}

export async function GET() {
  try {
    const categorias = await getCategoriasApi()
    return NextResponse.json(categorias, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
