import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener resumen por año
export async function GET(
  request: NextRequest,
  { params }: { params: { anio: string } }
) {
  try {
    const anio = parseInt(params.anio)

    if (isNaN(anio)) {
      return NextResponse.json(
        { error: 'Año inválido' },
        { status: 400 }
      )
    }

    const resumen = await prisma.resumenAnio.findUnique({
      where: { anio }
    })

    if (!resumen) {
      return NextResponse.json(
        { error: 'Resumen no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(resumen)
  } catch (error) {
    console.error('Error fetching resumen:', error)
    return NextResponse.json(
      { error: 'Error al obtener resumen' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar resumen (requiere autenticación)
export async function PUT(
  request: NextRequest,
  { params }: { params: { anio: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const anio = parseInt(params.anio)
    if (isNaN(anio)) {
      return NextResponse.json(
        { error: 'Año inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const resumen = await prisma.resumenAnio.update({
      where: { anio },
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categorias: body.categorias || null,
        imagenesFeatured: body.imagenesFeatured || null,
        estadisticas: body.estadisticas || null,
        visible: body.visible !== false
      }
    })

    return NextResponse.json(resumen)
  } catch (error) {
    console.error('Error updating resumen:', error)
    return NextResponse.json(
      { error: 'Error al actualizar resumen' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar resumen (requiere autenticación como ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { anio: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const anio = parseInt(params.anio)
    if (isNaN(anio)) {
      return NextResponse.json(
        { error: 'Año inválido' },
        { status: 400 }
      )
    }

    await prisma.resumenAnio.delete({
      where: { anio }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resumen:', error)
    return NextResponse.json(
      { error: 'Error al eliminar resumen' },
      { status: 500 }
    )
  }
}
