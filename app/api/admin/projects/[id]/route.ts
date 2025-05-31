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

    const project = await prisma.proyecto.findUnique({
      where: { id: params.id },
      include: {
        imagenes: true,
        documentos: true,
        progreso: true,
        timeline: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
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

    // Generar slug si el título cambió
    let slug = data.slug
    if (data.titulo) {
      const existingProject = await prisma.proyecto.findUnique({
        where: { id: params.id },
        select: { titulo: true }
      })
      
      if (existingProject && existingProject.titulo !== data.titulo) {
        slug = data.titulo
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
    }

    // Build update data object only with provided fields
    const updateData: any = {}
    
    if (data.titulo !== undefined) updateData.titulo = data.titulo
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion
    if (data.categoria !== undefined) updateData.categoria = data.categoria
    if (data.cliente !== undefined) updateData.cliente = data.cliente
    if (data.clienteId !== undefined) updateData.clienteId = data.clienteId
    if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion
    if (data.fechaInicio !== undefined) updateData.fechaInicio = new Date(data.fechaInicio)
    if (data.fechaFin !== undefined) updateData.fechaFin = data.fechaFin ? new Date(data.fechaFin) : null
    if (data.estado !== undefined) updateData.estado = data.estado
    if (data.prioridad !== undefined) updateData.prioridad = data.prioridad
    if (data.presupuesto !== undefined) updateData.presupuesto = data.presupuesto
    if (data.costoReal !== undefined) updateData.costoReal = data.costoReal
    if (data.toneladas !== undefined) updateData.toneladas = data.toneladas
    if (data.areaTotal !== undefined) updateData.areaTotal = data.areaTotal
    if (data.moneda !== undefined) updateData.moneda = data.moneda
    if (data.contactoCliente !== undefined) updateData.contactoCliente = data.contactoCliente
    if (data.telefono !== undefined) updateData.telefono = data.telefono
    if (data.email !== undefined) updateData.email = data.email
    if (data.destacado !== undefined) updateData.destacado = data.destacado
    if (data.destacadoEnCategoria !== undefined) updateData.destacadoEnCategoria = data.destacadoEnCategoria
    if (data.visible !== undefined) updateData.visible = data.visible
    if (slug) updateData.slug = slug

    const project = await prisma.proyecto.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.proyecto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Proyecto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}