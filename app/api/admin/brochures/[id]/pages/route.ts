import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await req.json()

    // Verificar que el brochure existe
    const brochure = await prisma.brochure.findUnique({
      where: { id: params.id }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Crear la página
    const page = await prisma.brochurePage.create({
      data: {
        brochureId: params.id,
        nombre: body.nombre || 'Nueva Página',
        orden: body.orden ?? 0,
        canvasData: body.canvasData || null,
        contenido: body.contenido || {},
        componentesData: body.componentesData || {},
        configuracion: body.configuracion || { width: 1200, height: 800 },
        visible: body.visible ?? true
      }
    })

    return NextResponse.json(page, { status: 201 })

  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
