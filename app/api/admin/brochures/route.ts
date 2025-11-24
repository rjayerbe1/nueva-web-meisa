import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const brochures = await prisma.brochure.findMany({
      orderBy: { updatedAt: 'desc' },
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
            pages: true
          }
        }
      }
    })

    return NextResponse.json(brochures)

  } catch (error) {
    console.error('Error obteniendo brochures:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await req.json()

    // Validar campos requeridos
    const requiredFields = ['titulo', 'templateId', 'urlAmigable']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    // Verificar que el template existe
    const template = await prisma.brochureTemplate.findUnique({
      where: { id: body.templateId }
    })

    if (!template) {
      return NextResponse.json({ error: "Template no encontrado" }, { status: 404 })
    }

    // Verificar que la URL amigable sea única
    let baseUrl = body.urlAmigable.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    let urlAmigable = baseUrl
    let counter = 1

    while (await prisma.brochure.findUnique({ where: { urlAmigable } })) {
      urlAmigable = `${baseUrl}-${counter}`
      counter++
    }

    // Si hay categoriaId, verificar que no tenga ya un brochure asignado
    if (body.categoriaId) {
      const existingBrochure = await prisma.brochure.findUnique({
        where: { categoriaId: body.categoriaId }
      })

      if (existingBrochure) {
        return NextResponse.json({
          error: "Esta categoría ya tiene un brochure asignado. Primero desasigna el brochure existente."
        }, { status: 400 })
      }
    }

    // Crear el brochure
    const brochure = await prisma.brochure.create({
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion || null,
        templateId: body.templateId,
        categoriaId: body.categoriaId || null,
        contenido: body.contenido || {},
        datosPersonalizados: body.datosPersonalizados || null,
        configuracion: body.configuracion || null,
        activo: body.activo !== undefined ? body.activo : false,
        publicado: body.publicado !== undefined ? body.publicado : false,
        fechaPublicacion: body.publicado ? new Date() : null,
        urlAmigable,
        versionNumero: 1,
        thumbnail: body.thumbnail || null,
        createdBy: session.user.id
      },
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
        }
      }
    })

    return NextResponse.json(brochure, { status: 201 })

  } catch (error) {
    console.error('Error creando brochure:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
