import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

// GET - List all page templates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const categoria = searchParams.get('categoria')
    const isPublic = searchParams.get('public') === 'true'

    const templates = await prisma.pageTemplate.findMany({
      where: {
        ...(categoria ? { categoria } : {}),
        ...(isPublic ? { isPublic: true } : {})
      },
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(templates)

  } catch (error) {
    console.error('Error fetching page templates:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Create new page template
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

    const template = await prisma.pageTemplate.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        thumbnail: body.thumbnail,
        categoria: body.categoria,
        canvasData: body.canvasData || {},
        configuracion: body.configuracion || { width: 1200, height: 800 },
        isPublic: body.isPublic ?? false,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(template, { status: 201 })

  } catch (error) {
    console.error('Error creating page template:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
