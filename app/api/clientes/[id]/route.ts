import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Obtener un cliente específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id }
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error fetching cliente:', error)
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data: {
        nombre: data.nombre,
        logo: data.logo,
        logoBlanco: data.logoBlanco,
        descripcion: data.descripcion,
        sitioWeb: data.sitioWeb,
        sector: data.sector,
        proyectoDestacado: data.proyectoDestacado,
        capacidadProyecto: data.capacidadProyecto,
        ubicacionProyecto: data.ubicacionProyecto,
        mostrarEnHome: data.mostrarEnHome,
        destacado: data.destacado,
        orden: data.orden,
        activo: data.activo,
        slug: data.slug
      }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error updating cliente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Soft delete - solo marcar como inactivo
    const cliente = await prisma.cliente.update({
      where: { id: params.id },
      data: { activo: false }
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error deleting cliente:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}