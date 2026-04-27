import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

const ESTADOS_VALIDOS = new Set([
  'NUEVO',
  'LEIDO',
  'RESPONDIDO',
  'COTIZADO',
  'CERRADO',
])

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const message = await prisma.contactForm.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje no encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const update: Record<string, unknown> = {}

    if (typeof data.estado === 'string' && ESTADOS_VALIDOS.has(data.estado)) {
      update.estado = data.estado
      update.leido = data.estado !== 'NUEVO'
      update.respondido = ['RESPONDIDO', 'COTIZADO', 'CERRADO'].includes(data.estado)
    }
    if (typeof data.leido === 'boolean') {
      update.leido = data.leido
      if (data.leido && !update.estado) update.estado = 'LEIDO'
    }
    if (typeof data.notasInternas === 'string') {
      update.notasInternas = data.notasInternas
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'No hay cambios válidos' },
        { status: 400 },
      )
    }

    const message = await prisma.contactForm.update({
      where: { id: params.id },
      data: update,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.contactForm.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Mensaje eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
