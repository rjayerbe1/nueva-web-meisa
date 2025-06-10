import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pagina = await prisma.pagina.findUnique({
      where: { id: params.id },
      include: {
        secciones: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    if (!pagina) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(pagina)
  } catch (error) {
    console.error('Error al obtener página:', error)
    return NextResponse.json(
      { error: 'Error al obtener página' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const pagina = await prisma.pagina.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contenido: data.contenido,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        imagenHero: data.imagenHero,
        imagenBanner: data.imagenBanner,
        activa: data.activa
      }
    })

    return NextResponse.json(pagina)
  } catch (error) {
    console.error('Error al actualizar página:', error)
    return NextResponse.json(
      { error: 'Error al actualizar página' },
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
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.pagina.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar página:', error)
    return NextResponse.json(
      { error: 'Error al eliminar página' },
      { status: 500 }
    )
  }
}