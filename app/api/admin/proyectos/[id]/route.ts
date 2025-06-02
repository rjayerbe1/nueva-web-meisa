import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener proyecto específico con sus imágenes
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

    const proyecto = await prisma.proyecto.findUnique({
      where: { id: params.id },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            url: true,
            urlOptimized: true,
            alt: true,
            titulo: true,
            descripcion: true,
            orden: true
          }
        }
      }
    })

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(proyecto)
  } catch (error) {
    console.error('Error fetching proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}