import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoria = await prisma.categoriaProyecto.findFirst({
      where: {
        slug: params.slug,
        visible: true
      },
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
        especialidades: true
      }
    })

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...categoria,
      beneficios: null
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
