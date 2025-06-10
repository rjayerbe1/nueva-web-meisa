import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
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

    const data = await request.json()
    
    const seccion = await prisma.seccionPagina.update({
      where: { id: params.id },
      data: {
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contenido: data.contenido,
        tipo: data.tipo,
        orden: data.orden,
        visible: data.visible
      }
    })

    return NextResponse.json(seccion)
  } catch (error) {
    console.error('Error al actualizar sección:', error)
    return NextResponse.json(
      { error: 'Error al actualizar sección' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
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

    await prisma.seccionPagina.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar sección:', error)
    return NextResponse.json(
      { error: 'Error al eliminar sección' },
      { status: 500 }
    )
  }
}