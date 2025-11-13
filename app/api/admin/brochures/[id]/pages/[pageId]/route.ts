import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; pageId: string } }
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

    // Verificar que la página existe y pertenece al brochure
    const existingPage = await prisma.brochurePage.findUnique({
      where: { id: params.pageId }
    })

    if (!existingPage || existingPage.brochureId !== params.id) {
      return NextResponse.json({ error: "Página no encontrada" }, { status: 404 })
    }

    // Actualizar la página
    const page = await prisma.brochurePage.update({
      where: { id: params.pageId },
      data: {
        nombre: body.nombre,
        orden: body.orden,
        canvasData: body.canvasData,
        contenido: body.contenido,
        componentesData: body.componentesData,
        configuracion: body.configuracion,
        visible: body.visible
      }
    })

    return NextResponse.json(page)

  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.EDITOR) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    // Verificar que la página existe y pertenece al brochure
    const page = await prisma.brochurePage.findUnique({
      where: { id: params.pageId }
    })

    if (!page || page.brochureId !== params.id) {
      return NextResponse.json({ error: "Página no encontrada" }, { status: 404 })
    }

    // Eliminar la página
    await prisma.brochurePage.delete({
      where: { id: params.pageId }
    })

    return NextResponse.json({ message: "Página eliminada exitosamente" })

  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
