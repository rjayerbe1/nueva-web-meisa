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
        urlAmigable: true,
        publicado: true,
        activo: true
      }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    return NextResponse.json(brochure)

  } catch (error) {
    console.error('Error obteniendo brochure por categoría:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
