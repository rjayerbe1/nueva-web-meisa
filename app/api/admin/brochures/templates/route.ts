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

    const templates = await prisma.brochureTemplate.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(templates)

  } catch (error) {
    console.error('Error obteniendo templates:', error)
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
    if (!body.nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Crear el template
    const template = await prisma.brochureTemplate.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        thumbnail: body.thumbnail || null,
        tipoCategoria: body.tipoCategoria || null,
        estructura: body.estructura || {},
        componentsLibrary: body.componentsLibrary || [],
        estilosGlobales: body.estilosGlobales || null,
        isPublic: body.isPublic !== undefined ? body.isPublic : false,
        isDefault: body.isDefault !== undefined ? body.isDefault : false,
        createdBy: session.user.id
      },
      include: {
        pages: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    return NextResponse.json(template, { status: 201 })

  } catch (error) {
    console.error('Error creando template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
