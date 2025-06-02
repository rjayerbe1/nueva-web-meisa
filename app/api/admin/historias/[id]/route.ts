import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener historia específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const historia = await prisma.historiaProyecto.findUnique({
      where: { id: params.id },
      include: {
        proyecto: {
          select: {
            titulo: true,
            cliente: true,
            categoria: true,
            slug: true,
            descripcion: true,
            fechaInicio: true,
            fechaFin: true,
            toneladas: true,
            areaTotal: true
          }
        }
      }
    })

    if (!historia) {
      return NextResponse.json(
        { error: 'Historia no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(historia)
  } catch (error) {
    console.error('Error fetching historia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar historia
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Verificar que la historia existe
    const historiaExistente = await prisma.historiaProyecto.findUnique({
      where: { id: params.id }
    })

    if (!historiaExistente) {
      return NextResponse.json(
        { error: 'Historia no encontrada' },
        { status: 404 }
      )
    }

    const historia = await prisma.historiaProyecto.update({
      where: { id: params.id },
      data: body,
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
    console.error('Error updating historia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar historia
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que la historia existe
    const historia = await prisma.historiaProyecto.findUnique({
      where: { id: params.id }
    })

    if (!historia) {
      return NextResponse.json(
        { error: 'Historia no encontrada' },
        { status: 404 }
      )
    }

    await prisma.historiaProyecto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Historia eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting historia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}