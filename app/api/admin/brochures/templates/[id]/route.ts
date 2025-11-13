import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const template = await prisma.brochureTemplate.findUnique({
      where: { id: params.id },
      include: {
        pages: {
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: {
            brochures: true,
            pages: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })
    }

    return NextResponse.json(template)

  } catch (error) {
    console.error('Error obteniendo template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

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

    // Verificar que el template existe
    const existingTemplate = await prisma.brochureTemplate.findUnique({
      where: { id: params.id }
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })
    }

    // Preparar datos de actualización
    const updateData: any = {}

    if (body.nombre !== undefined) updateData.nombre = body.nombre
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail
    if (body.tipoCategoria !== undefined) updateData.tipoCategoria = body.tipoCategoria
    if (body.estructura !== undefined) updateData.estructura = body.estructura
    if (body.componentsLibrary !== undefined) updateData.componentsLibrary = body.componentsLibrary
    if (body.estilosGlobales !== undefined) updateData.estilosGlobales = body.estilosGlobales
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault

    // Actualizar el template
    const template = await prisma.brochureTemplate.update({
      where: { id: params.id },
      data: updateData,
      include: {
        pages: {
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: {
            brochures: true,
            pages: true
          }
        }
      }
    })

    return NextResponse.json(template)

  } catch (error) {
    console.error('Error actualizando template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

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

    // Verificar que el template existe
    const template = await prisma.brochureTemplate.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            brochures: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })
    }

    // No permitir eliminar si tiene brochures asociados
    if (template._count.brochures > 0) {
      return NextResponse.json({
        error: `No se puede eliminar: hay ${template._count.brochures} brochure(s) usando este template`
      }, { status: 400 })
    }

    // Eliminar el template (las páginas se eliminan en cascada)
    await prisma.brochureTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Template eliminado exitosamente" })

  } catch (error) {
    console.error('Error eliminando template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
