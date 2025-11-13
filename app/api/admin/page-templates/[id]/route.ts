import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

// GET - Get single page template
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const template = await prisma.pageTemplate.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json(template)

  } catch (error) {
    console.error('Error fetching page template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Update page template
export async function PUT(
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

    const template = await prisma.pageTemplate.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        thumbnail: body.thumbnail,
        categoria: body.categoria,
        canvasData: body.canvasData,
        configuracion: body.configuracion,
        isPublic: body.isPublic
      }
    })

    return NextResponse.json(template)

  } catch (error) {
    console.error('Error updating page template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Delete page template
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.EDITOR) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    await prisma.pageTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Plantilla eliminada exitosamente" })

  } catch (error) {
    console.error('Error deleting page template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
