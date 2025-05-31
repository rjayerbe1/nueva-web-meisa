import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, TipoImagen } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === UserRole.VIEWER) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { tipo } = await request.json()

    if (tipo === 'PORTADA') {
      // Primero obtener el proyecto de la imagen
      const imagenActual = await prisma.imagenProyecto.findUnique({
        where: { id: params.id },
        select: { proyectoId: true }
      })

      if (!imagenActual) {
        return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
      }

      // Cambiar todas las imágenes del proyecto a GALERIA
      await prisma.imagenProyecto.updateMany({
        where: { 
          proyectoId: imagenActual.proyectoId,
          tipo: TipoImagen.PORTADA
        },
        data: { tipo: TipoImagen.GALERIA }
      })

      // Establecer la nueva imagen como PORTADA
      await prisma.imagenProyecto.update({
        where: { id: params.id },
        data: { tipo: TipoImagen.PORTADA }
      })
    } else {
      // Para otros tipos, simplemente actualizar
      await prisma.imagenProyecto.update({
        where: { id: params.id },
        data: { tipo: tipo as TipoImagen }
      })
    }

    return NextResponse.json({ message: 'Tipo de imagen actualizado exitosamente' })
  } catch (error) {
    console.error('Error updating media type:', error)
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

    await prisma.imagenProyecto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Imagen eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}