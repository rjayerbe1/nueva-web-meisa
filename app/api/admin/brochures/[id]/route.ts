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

    const brochure = await prisma.brochure.findUnique({
      where: { id: params.id },
      include: {
        template: {
          include: {
            pages: {
              orderBy: { orden: 'asc' }
            }
          }
        },
        categoria: true,
        pages: {
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: {
            pages: true,
            analytics: true
          }
        }
      }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    return NextResponse.json(brochure)

  } catch (error) {
    console.error('Error obteniendo brochure:', error)
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

    // Verificar que el brochure existe
    const existingBrochure = await prisma.brochure.findUnique({
      where: { id: params.id }
    })

    if (!existingBrochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Si se está cambiando la URL amigable, verificar que sea única
    if (body.urlAmigable && body.urlAmigable !== existingBrochure.urlAmigable) {
      const urlExists = await prisma.brochure.findUnique({
        where: { urlAmigable: body.urlAmigable }
      })

      if (urlExists) {
        return NextResponse.json({ error: "Esta URL ya está en uso" }, { status: 400 })
      }
    }

    // Si se está cambiando la categoría, verificar que no tenga ya un brochure asignado
    if (body.categoriaId && body.categoriaId !== existingBrochure.categoriaId) {
      const existingCategoryBrochure = await prisma.brochure.findFirst({
        where: {
          categoriaId: body.categoriaId,
          id: { not: params.id }
        }
      })

      if (existingCategoryBrochure) {
        return NextResponse.json({
          error: "Esta categoría ya tiene un brochure asignado"
        }, { status: 400 })
      }
    }

    // Preparar datos de actualización
    const updateData: any = {}

    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion
    if (body.templateId !== undefined) updateData.templateId = body.templateId
    if (body.categoriaId !== undefined) updateData.categoriaId = body.categoriaId
    if (body.contenido !== undefined) updateData.contenido = body.contenido
    if (body.datosPersonalizados !== undefined) updateData.datosPersonalizados = body.datosPersonalizados
    if (body.configuracion !== undefined) updateData.configuracion = body.configuracion
    if (body.activo !== undefined) updateData.activo = body.activo
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail
    if (body.urlAmigable !== undefined) updateData.urlAmigable = body.urlAmigable

    // Si se está publicando por primera vez, establecer la fecha de publicación
    if (body.publicado === true && !existingBrochure.publicado) {
      updateData.publicado = true
      updateData.fechaPublicacion = new Date()
    } else if (body.publicado !== undefined) {
      updateData.publicado = body.publicado
      if (!body.publicado) {
        updateData.fechaPublicacion = null
      }
    }

    // Incrementar versión si se modificó el contenido o configuración
    if (body.contenido || body.configuracion || body.templateId) {
      updateData.versionNumero = existingBrochure.versionNumero + 1
    }

    // Actualizar el brochure
    const brochure = await prisma.brochure.update({
      where: { id: params.id },
      data: updateData,
      include: {
        template: {
          select: {
            id: true,
            nombre: true,
            thumbnail: true
          }
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            key: true
          }
        },
        _count: {
          select: {
            pages: true,
            analytics: true
          }
        }
      }
    })

    return NextResponse.json(brochure)

  } catch (error) {
    console.error('Error actualizando brochure:', error)
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

    // Verificar que el brochure existe
    const brochure = await prisma.brochure.findUnique({
      where: { id: params.id }
    })

    if (!brochure) {
      return NextResponse.json({ error: "Brochure no encontrado" }, { status: 404 })
    }

    // Eliminar el brochure (las páginas y analytics se eliminan en cascada)
    await prisma.brochure.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Brochure eliminado exitosamente" })

  } catch (error) {
    console.error('Error eliminando brochure:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
