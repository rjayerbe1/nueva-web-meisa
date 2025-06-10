import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const secciones = await prisma.seccionPagina.findMany({
      where: { paginaId: params.id },
      orderBy: { orden: 'asc' }
    })

    return NextResponse.json(secciones)
  } catch (error) {
    console.error('Error al obtener secciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener secciones' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    
    const seccion = await prisma.seccionPagina.create({
      data: {
        paginaId: params.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        contenido: data.contenido || {},
        tipo: data.tipo,
        orden: data.orden || 0,
        visible: data.visible ?? true
      }
    })

    return NextResponse.json(seccion, { status: 201 })
  } catch (error) {
    console.error('Error al crear sección:', error)
    return NextResponse.json(
      { error: 'Error al crear sección' },
      { status: 500 }
    )
  }
}