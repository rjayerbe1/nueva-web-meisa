import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    // Buscar brochure publicado y activo para esta categoría
    const brochure = await prisma.brochure.findFirst({
      where: {
        categoriaId: params.categoryId,
        publicado: true,
        activo: true
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        urlAmigable: true,
        thumbnail: true,
        pdfUrl: true,
        publicado: true,
        activo: true,
        fechaPublicacion: true,
        pages: {
          where: {
            visible: true
          },
          select: {
            id: true,
            nombre: true,
            canvasData: true,
            configuracion: true,
            orden: true
          },
          orderBy: {
            orden: 'asc'
          },
          take: 1 // Solo la primera página para preview
        }
      }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Contar total de páginas visibles
    const totalPages = await prisma.brochurePage.count({
      where: {
        brochureId: brochure.id,
        visible: true
      }
    })

    // Retornar datos completos
    return NextResponse.json({
      ...brochure,
      totalPages,
      primeraPagePreview: brochure.pages[0] || null
    })

  } catch (error) {
    console.error('Error obteniendo brochure por categoría:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
