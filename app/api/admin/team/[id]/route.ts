import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const teamMember = await prisma.miembroEquipo.findUnique({
      where: { id: params.id }
    })

    if (!teamMember) {
      return NextResponse.json({ error: 'Miembro del equipo no encontrado' }, { status: 404 })
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    const teamMember = await prisma.miembroEquipo.update({
      where: { id: params.id },
      data: {
        nombre: data.nombre,
        cargo: data.cargo,
        bio: data.bio,
        foto: data.foto,
        email: data.email,
        telefono: data.telefono,
        linkedin: data.linkedin,
        orden: data.orden,
      }
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error updating team member:', error)
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

    await prisma.miembroEquipo.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Miembro del equipo eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}