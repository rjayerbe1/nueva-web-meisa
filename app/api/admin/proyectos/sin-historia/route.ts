import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener proyectos que no tienen historia
    const proyectos = await prisma.proyecto.findMany({
      where: {
        historia: null,
        visible: true
      },
      select: {
        id: true,
        titulo: true,
        cliente: true,
        categoria: true,
        slug: true,
        destacado: true,
        fechaInicio: true
      },
      orderBy: [
        { destacado: 'desc' },
        { fechaInicio: 'desc' }
      ]
    })

    return NextResponse.json(proyectos)
  } catch (error) {
    console.error('Error fetching proyectos sin historia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}