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

    const project = await prisma.proyecto.update({
      where: { id: params.id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        cliente: data.cliente,
        ubicacion: data.ubicacion,
        fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
        fechaFin: data.fechaFin ? new Date(data.fechaFin) : undefined,
        estado: data.estado,
        prioridad: data.prioridad,
        presupuesto: data.presupuesto,
        costoReal: data.costoReal,
        moneda: data.moneda,
        contactoCliente: data.contactoCliente,
        telefono: data.telefono,
        email: data.email,
        destacado: data.destacado,
        visible: data.visible,
        slug: slug || undefined
      }
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