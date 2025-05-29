import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")
    const estado = searchParams.get("estado")
    const destacados = searchParams.get("destacados") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = { visible: true }
    
    if (categoria) where.categoria = categoria
    if (estado) where.estado = estado
    if (destacados) where.destacado = true

    const [proyectos, total] = await Promise.all([
      prisma.proyecto.findMany({
        where,
        include: {
          imagenes: {
            where: { tipo: "PORTADA" },
            take: 1,
            orderBy: { orden: "asc" }
          },
          progreso: true,
          _count: {
            select: {
              imagenes: true,
              documentos: true
            }
          }
        },
        orderBy: [
          { destacado: "desc" },
          { ordenFrontend: "asc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit
      }),
      prisma.proyecto.count({ where })
    ])

    return NextResponse.json({
      proyectos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching proyectos:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.EDITOR)) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Generar slug único
    let slug = slugify(data.titulo)
    let counter = 1
    while (await prisma.proyecto.findUnique({ where: { slug } })) {
      slug = `${slugify(data.titulo)}-${counter}`
      counter++
    }

    const proyecto = await prisma.proyecto.create({
      data: {
        ...data,
        slug,
        createdBy: session.user.id,
        progreso: {
          create: [
            { fase: "Planificación", porcentaje: 0, orden: 1 },
            { fase: "Diseño", porcentaje: 0, orden: 2 },
            { fase: "Fabricación", porcentaje: 0, orden: 3 },
            { fase: "Montaje", porcentaje: 0, orden: 4 },
            { fase: "Finalización", porcentaje: 0, orden: 5 }
          ]
        }
      },
      include: {
        imagenes: true,
        progreso: true,
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(proyecto, { status: 201 })
  } catch (error) {
    console.error("Error creating proyecto:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}