import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const proyecto = await prisma.proyecto.findFirst({
      where: {
        slug: params.slug,
        visible: true
      },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        historia: {
          where: { activo: true }
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
    console.error('Error fetching project by slug:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}