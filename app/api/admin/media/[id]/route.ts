import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TipoImagen, UserRole } from '@prisma/client'

const TIPOS_VALIDOS: TipoImagen[] = [
  'PORTADA',
  'GALERIA',
  'PROCESO',
  'ANTES_DESPUES',
  'PLANOS',
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { id } = params

    const patch: {
      url?: string
      alt?: string
      titulo?: string | null
      descripcion?: string | null
      orden?: number
      tipo?: TipoImagen
    } = {}

    if (typeof data.url === 'string') patch.url = data.url
    if (typeof data.alt === 'string') patch.alt = data.alt
    if ('titulo' in data) patch.titulo = data.titulo ?? null
    if ('descripcion' in data) patch.descripcion = data.descripcion ?? null
    if (typeof data.orden === 'number') patch.orden = data.orden

    if (typeof data.tipo === 'string') {
      if (!TIPOS_VALIDOS.includes(data.tipo as TipoImagen)) {
        return NextResponse.json(
          { error: `Tipo inválido: ${data.tipo}` },
          { status: 400 },
        )
      }
      patch.tipo = data.tipo as TipoImagen
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 },
      )
    }

    // Si se promueve a PORTADA, demover la portada anterior del mismo proyecto
    // para garantizar una sola portada por proyecto.
    if (patch.tipo === 'PORTADA') {
      const target = await prisma.imagenProyecto.findUnique({
        where: { id },
        select: { proyectoId: true },
      })
      const updatedImage = await prisma.$transaction(async (tx) => {
        if (target?.proyectoId) {
          await tx.imagenProyecto.updateMany({
            where: {
              proyectoId: target.proyectoId,
              tipo: 'PORTADA',
              NOT: { id },
            },
            data: { tipo: 'GALERIA' },
          })
        }
        return tx.imagenProyecto.update({ where: { id }, data: patch })
      })
      return NextResponse.json(updatedImage)
    }

    const updatedImage = await prisma.imagenProyecto.update({
      where: { id },
      data: patch,
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    await prisma.imagenProyecto.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
