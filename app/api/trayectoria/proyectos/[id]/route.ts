import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Obtener proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proyecto = await prisma.proyectoHojaVida.findUnique({
      where: { id: params.id }
    })

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(proyecto)
  } catch (error) {
    console.error('Error fetching proyecto:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyecto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar proyecto (requiere autenticación)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const proyecto = await prisma.proyectoHojaVida.update({
      where: { id: params.id },
      data: {
        entidadContratante: body.entidadContratante,
        objetoContrato: body.objetoContrato,
        fechaInicio: new Date(body.fechaInicio),
        fechaFin: new Date(body.fechaFin),
        pesoKg: body.pesoKg ? parseFloat(body.pesoKg) : null,
        areaM2: body.areaM2 ? parseFloat(body.areaM2) : null,
        ubicacion: body.ubicacion,
        departamento: body.departamento || null,
        valorContrato: parseFloat(body.valorContrato),
        moneda: body.moneda || 'COP',
        imagenes: body.imagenes || null,
        destacado: body.destacado || false,
        visible: body.visible !== false,
        orden: body.orden || 0
      }
    })

    return NextResponse.json(proyecto)
  } catch (error) {
    console.error('Error updating proyecto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proyecto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar proyecto (requiere autenticación como ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.proyectoHojaVida.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting proyecto:', error)
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    )
  }
}
