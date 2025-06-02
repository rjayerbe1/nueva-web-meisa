import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Listar todas las historias
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const historias = await prisma.historiaProyecto.findMany({
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true,
            categoria: true,
            slug: true
          }
        }
      },
      orderBy: {
        fechaActualizacion: 'desc'
      }
    })

    return NextResponse.json(historias)
  } catch (error) {
    console.error('Error fetching historias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva historia
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { proyectoId, ...historiaData } = body

    // Verificar que el proyecto existe
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId }
    })

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que no existe ya una historia para este proyecto
    const historiaExistente = await prisma.historiaProyecto.findUnique({
      where: { proyectoId }
    })

    if (historiaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una historia para este proyecto' },
        { status: 400 }
      )
    }

    const historia = await prisma.historiaProyecto.create({
      data: {
        proyectoId,
        creadoPor: session.user.id,
        ...historiaData
      },
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true,
            categoria: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(historia)
  } catch (error) {
    console.error('Error creating historia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}