import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { categoryKey: string } }
) {
  try {
    const proyectos = await prisma.proyecto.findMany({
      where: {
        categoria: params.categoryKey as any, // Assuming CategoriaEnum
        visible: true
      },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' },
          take: 1 // Solo necesitamos la primera imagen para la lista
        }
      },
      orderBy: [
        { destacado: 'desc' }, // Destacados primero
        { fechaInicio: 'desc' } // Luego por fecha más reciente
      ]
    })

    return NextResponse.json(proyectos)
  } catch (error) {
    console.error('Error fetching projects by category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}