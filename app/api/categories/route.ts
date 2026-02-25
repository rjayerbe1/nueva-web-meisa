import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categorias = await prisma.categoriaProyecto.findMany({
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
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
