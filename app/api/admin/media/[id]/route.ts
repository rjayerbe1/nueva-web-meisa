import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.imagenProyecto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Imagen eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}