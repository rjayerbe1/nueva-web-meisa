import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

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
    const requiredFields = ['titulo', 'descripcion', 'categoria', 'cliente', 'ubicacion', 'fechaInicio']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    // Verificar que el slug sea único
    let baseSlug = body.slug
    let slug = baseSlug
    let counter = 1

    while (await prisma.proyecto.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear el proyecto
    const proyecto = await prisma.proyecto.create({
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categoria: body.categoria,
        estado: body.estado || 'PLANIFICACION',
        prioridad: body.prioridad || 'MEDIA',
        fechaInicio: new Date(body.fechaInicio),
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
        fechaEstimada: body.fechaEstimada ? new Date(body.fechaEstimada) : null,
        presupuesto: body.presupuesto ? parseFloat(body.presupuesto) : null,
        costoReal: body.costoReal ? parseFloat(body.costoReal) : null,
        moneda: body.moneda || 'COP',
        cliente: body.cliente,
        contactoCliente: body.contactoCliente || null,
        telefono: body.telefono || null,
        email: body.email || null,
        ubicacion: body.ubicacion,
        coordenadas: body.coordenadas || null,
        tags: body.tags || [],
        destacado: body.destacado || false,
        visible: body.visible !== false, // Por defecto true
        ordenFrontend: body.ordenFrontend || null,
        slug,
        metaTitle: body.metaTitle || body.titulo,
        metaDescription: body.metaDescription || body.descripcion.substring(0, 160),
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(proyecto, { status: 201 })
    
  } catch (error) {
    console.error('Error creando proyecto:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const proyectos = await prisma.proyecto.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        imagenes: {
          where: { tipo: 'PORTADA' },
          take: 1,
        },
        _count: {
          select: {
            imagenes: true,
            documentos: true,
            comentarios: true,
          }
        }
      }
    })

    return NextResponse.json(proyectos)
    
  } catch (error) {
    console.error('Error obteniendo proyectos:', error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}