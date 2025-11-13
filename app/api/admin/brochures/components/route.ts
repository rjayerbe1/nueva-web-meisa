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

    // Obtener parámetros de consulta
    const searchParams = req.nextUrl.searchParams
    const tipo = searchParams.get('tipo')
    const categoria = searchParams.get('categoria')

    const where: any = {}
    if (tipo) where.tipo = tipo
    if (categoria) where.categoria = categoria

    const components = await prisma.brochureComponent.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(components)

  } catch (error) {
    console.error('Error obteniendo componentes:', error)
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
    const requiredFields = ['nombre', 'tipo', 'htmlTemplate', 'cssEstilos', 'propiedadesSchema']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    // Crear el componente
    const component = await prisma.brochureComponent.create({
      data: {
        nombre: body.nombre,
        tipo: body.tipo,
        descripcion: body.descripcion || null,
        thumbnail: body.thumbnail || null,
        htmlTemplate: body.htmlTemplate,
        cssEstilos: body.cssEstilos,
        jsInteracciones: body.jsInteracciones || null,
        propiedadesSchema: body.propiedadesSchema,
        valorDefecto: body.valorDefecto || null,
        categoria: body.categoria || null,
        tags: body.tags || [],
        isPublic: body.isPublic !== undefined ? body.isPublic : true,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(component, { status: 201 })

  } catch (error) {
    console.error('Error creando componente:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
