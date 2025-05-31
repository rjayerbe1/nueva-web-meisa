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

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { id: params.id }
    })

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error fetching category:', error)
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

    // Generar slug si cambió el nombre
    let slug = data.slug
    if (data.nombre && !slug) {
      slug = data.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
    }

    // Build update object
    const updateData: any = {}
    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion
    if (slug) updateData.slug = slug
    if (data.imagenCover !== undefined) updateData.imagenCover = data.imagenCover
    if (data.icono !== undefined) updateData.icono = data.icono
    if (data.color !== undefined) updateData.color = data.color
    if (data.colorSecundario !== undefined) updateData.colorSecundario = data.colorSecundario
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
    if (data.orden !== undefined) updateData.orden = data.orden
    if (data.visible !== undefined) updateData.visible = data.visible
    if (data.destacada !== undefined) updateData.destacada = data.destacada

    const categoria = await prisma.categoriaProyecto.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error updating category:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese slug' }, { status: 409 })
    }
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

    // Verificar si hay proyectos usando esta categoría
    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { id: params.id }
    })

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    const projectsCount = await prisma.proyecto.count({
      where: { categoria: categoria.key }
    })

    if (projectsCount > 0) {
      return NextResponse.json({ 
        error: `No se puede eliminar la categoría porque tiene ${projectsCount} proyecto(s) asociado(s)` 
      }, { status: 409 })
    }

    await prisma.categoriaProyecto.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}