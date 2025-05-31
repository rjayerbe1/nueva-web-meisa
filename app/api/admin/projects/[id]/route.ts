import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, CategoriaEnum } from '@prisma/client'
import { moveImageToNewCategory, cleanupEmptyDirectory, getCategoryFolder, slugify } from '@/lib/image-utils'

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

    // Obtener proyecto actual para comparar cambios
    const currentProject = await prisma.proyecto.findUnique({
      where: { id: params.id },
      include: {
        imagenes: {
          select: { id: true, url: true }
        }
      }
    })

    if (!currentProject) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Detectar si cambió la categoría o título para mover imágenes
    const categoryChanged = data.categoria && data.categoria !== currentProject.categoria
    const titleChanged = data.titulo && data.titulo !== currentProject.titulo

    // Generar slug si el título cambió
    let slug = data.slug
    if (data.titulo && titleChanged) {
      slug = slugify(data.titulo)
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

    // Mover imágenes si cambió la categoría o título
    if ((categoryChanged || titleChanged) && currentProject.imagenes.length > 0) {
      try {
        const newCategory = data.categoria || currentProject.categoria
        const newTitle = data.titulo || currentProject.titulo
        const oldCategoryFolder = getCategoryFolder(currentProject.categoria)
        const oldProjectSlug = slugify(currentProject.titulo)

        console.log(`Moviendo ${currentProject.imagenes.length} imágenes de ${currentProject.categoria} a ${newCategory}`)

        // Mover cada imagen
        const imageUpdates = await Promise.allSettled(
          currentProject.imagenes.map(async (imagen) => {
            const newUrl = await moveImageToNewCategory(
              imagen.url,
              currentProject.categoria,
              newCategory as CategoriaEnum,
              newTitle
            )

            // Actualizar URL en base de datos si cambió
            if (newUrl !== imagen.url) {
              await prisma.imagenProyecto.update({
                where: { id: imagen.id },
                data: { url: newUrl }
              })
            }

            return { id: imagen.id, oldUrl: imagen.url, newUrl }
          })
        )

        // Log resultados
        const successful = imageUpdates.filter(result => result.status === 'fulfilled').length
        const failed = imageUpdates.filter(result => result.status === 'rejected').length
        
        console.log(`Imágenes movidas: ${successful} exitosas, ${failed} fallidas`)

        // Limpiar directorio vacío del proyecto anterior si cambió categoría o título
        if (categoryChanged || titleChanged) {
          const oldProjectDir = `${oldCategoryFolder}/${oldProjectSlug}`
          cleanupEmptyDirectory(oldProjectDir)
        }

      } catch (error) {
        console.error('Error moviendo imágenes:', error)
        // No fallar la actualización del proyecto por errores de movimiento de archivos
      }
    }

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