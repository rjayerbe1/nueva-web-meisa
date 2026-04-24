import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { 
  ensureCategoryDirectory, 
  getCategoryImageUrls, 
  moveCategoryFiles,
  deleteCategoryFiles,
  normalizeSlug
} from '@/lib/category-file-manager'

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
      where: { id: params.id },
      select: {
        id: true,
        key: true,
        nombre: true,
        descripcion: true,
        slug: true,
        imagenCover: true,
        videoCover: true,
        usarVideoCover: true,
        videoCoverScale: true,
        videoCoverPosition: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        hoverOverlayColor: true,
        hoverOverlayOpacity: true,
        enableHoverOverlay: true,
        metaTitle: true,
        metaDescription: true,
        orden: true,
        visible: true,
        destacada: true,
        totalProyectos: true,
        createdAt: true,
        updatedAt: true,
        estadisticas: true,
        casosExitoIds: true,
        especialidades: true,
        textosUi: true,
      }
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
    console.log('Update data received:', data) // Debug log

    // Obtener categoría actual
    const currentCategory = await prisma.categoriaProyecto.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        key: true,
        slug: true,
        nombre: true
      }
    })

    if (!currentCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Generar nuevo slug si cambió el nombre
    let newSlug = data.slug
    if (data.nombre && !newSlug) {
      newSlug = normalizeSlug(data.nombre)
    } else if (!newSlug) {
      newSlug = currentCategory.slug
    }

    // Si cambió el slug, mover archivos
    if (newSlug !== currentCategory.slug) {
      await moveCategoryFiles(currentCategory.slug, newSlug)
    }

    // Asegurar que existe el directorio (en caso de slug nuevo)
    await ensureCategoryDirectory(newSlug)

    // Obtener las rutas organizadas
    const imageUrls = getCategoryImageUrls(newSlug)

    // Build update object
    const updateData: any = {}
    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion
    if (newSlug) updateData.slug = newSlug
    
    // Solo actualizar rutas de imágenes si no se especificaron explícitamente
    if (data.imagenCover !== undefined) {
      updateData.imagenCover = data.imagenCover
    } else if (newSlug !== currentCategory.slug) {
      // Actualizar a la nueva ruta organizada si cambió el slug
      updateData.imagenCover = imageUrls.imagenCover
    }

    // Handle video fields (grid home)
    if (data.videoCover !== undefined) updateData.videoCover = data.videoCover
    if (data.usarVideoCover !== undefined) updateData.usarVideoCover = data.usarVideoCover
    if (data.videoCoverScale !== undefined) updateData.videoCoverScale = data.videoCoverScale
    if (data.videoCoverPosition !== undefined) updateData.videoCoverPosition = data.videoCoverPosition

    if (data.icono !== undefined) {
      updateData.icono = data.icono
    } else if (newSlug !== currentCategory.slug) {
      // Actualizar a la nueva ruta organizada si cambió el slug
      updateData.icono = imageUrls.icono
    }
    
    if (data.color !== undefined) updateData.color = data.color
    if (data.colorSecundario !== undefined) updateData.colorSecundario = data.colorSecundario
    if (data.overlayColor !== undefined) updateData.overlayColor = data.overlayColor
    if (data.overlayOpacity !== undefined) updateData.overlayOpacity = data.overlayOpacity
    if (data.hoverOverlayColor !== undefined) updateData.hoverOverlayColor = data.hoverOverlayColor
    if (data.hoverOverlayOpacity !== undefined) updateData.hoverOverlayOpacity = data.hoverOverlayOpacity
    if (data.enableHoverOverlay !== undefined) updateData.enableHoverOverlay = data.enableHoverOverlay
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
    if (data.orden !== undefined) updateData.orden = data.orden
    if (data.visible !== undefined) updateData.visible = data.visible
    if (data.destacada !== undefined) updateData.destacada = data.destacada
    
    // Handle new enhanced content fields
    if (data.estadisticas !== undefined) updateData.estadisticas = data.estadisticas
    if (data.casosExitoIds !== undefined) updateData.casosExitoIds = data.casosExitoIds
    if (data.especialidades !== undefined) updateData.especialidades = data.especialidades
    if (data.textosUi !== undefined) updateData.textosUi = data.textosUi
    console.log('Update object:', updateData) // Debug log
    
    const categoria = await prisma.categoriaProyecto.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        key: true,
        nombre: true,
        descripcion: true,
        slug: true,
        imagenCover: true,
        videoCover: true,
        usarVideoCover: true,
        videoCoverScale: true,
        videoCoverPosition: true,
        icono: true,
        color: true,
        colorSecundario: true,
        overlayColor: true,
        overlayOpacity: true,
        hoverOverlayColor: true,
        hoverOverlayOpacity: true,
        enableHoverOverlay: true,
        metaTitle: true,
        metaDescription: true,
        orden: true,
        visible: true,
        destacada: true,
        totalProyectos: true,
        createdAt: true,
        updatedAt: true,
        estadisticas: true,
        casosExitoIds: true,
        especialidades: true,
        textosUi: true,
      }
    })

    console.log(`✅ Categoría actualizada con estructura organizada: ${categoria.nombre} (${categoria.slug})`)

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error updating category:', error)
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una categoría con ese slug' }, { status: 409 })
    }
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    }, { status: 500 })
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
      where: { id: params.id },
      select: {
        id: true,
        key: true,
        slug: true,
        nombre: true
      }
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

    // Eliminar archivos de la categoría
    await deleteCategoryFiles(categoria.slug)

    console.log(`✅ Categoría y archivos eliminados: ${categoria.nombre} (${categoria.slug})`)

    return NextResponse.json({ message: 'Categoría eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
