import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import prisma from '@/lib/prisma'

// Mapeo de URLs antiguas a nuevas
const urlMapping = new Map([
  ['/uploads/projects/1748888377402-fju4az.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748888377402-fju4az.jpg'],
  ['/uploads/projects/1748981755533-yp7mhy.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748981755533-yp7mhy.jpg'],
  ['/uploads/projects/1748982400052-6ecy5f.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748982400052-6ecy5f.jpg'],
  ['/uploads/projects/1762986267862-45z4ed.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986267862-45z4ed.png'],
  ['/uploads/projects/1762986479936-v2affj.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986479936-v2affj.png'],
  ['/uploads/projects/1762986490050-fkbvn7.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986490050-fkbvn7.png'],
  ['/uploads/projects/1762986495598-z9oncq.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986495598-z9oncq.png'],
  ['/uploads/projects/1762986508598-cytlni.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986508598-cytlni.png'],
  ['/uploads/projects/1762986985056-w07idu.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986985056-w07idu.png'],
  ['/uploads/projects/1762987026253-oozvbu.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762987026253-oozvbu.png'],
  ['/uploads/projects/1763038294941-ccd0jv.png', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763038294941-ccd0jv.png'],
  ['/uploads/projects/1763226664108-7j1r51.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763226664108-7j1r51.jpg'],
  ['/uploads/projects/1763559642470-wf7ao2.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763559642470-wf7ao2.jpg'],
  ['/uploads/projects/1763559728549-27v5in.jpg', 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763559728549-27v5in.jpg']
])

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Solo admin puede ejecutar esta migración
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('🔄 [Migración] Iniciando actualización de URLs de categorías...')

    // Buscar todas las categorías
    const categorias = await prisma.categoriaProyecto.findMany()
    console.log(`📋 [Migración] Encontradas ${categorias.length} categorías`)

    const updates: Array<{ categoria: string; field: string; oldUrl: string; newUrl: string }> = []

    for (const categoria of categorias) {
      const categoryUpdates: any = {}

      // Actualizar imagenCover
      if (categoria.imagenCover && urlMapping.has(categoria.imagenCover)) {
        const newUrl = urlMapping.get(categoria.imagenCover)!
        categoryUpdates.imagenCover = newUrl
        updates.push({
          categoria: categoria.nombre,
          field: 'imagenCover',
          oldUrl: categoria.imagenCover,
          newUrl
        })
        console.log(`📸 [Migración] Cover "${categoria.nombre}": ${categoria.imagenCover} -> ${newUrl}`)
      }

      // Actualizar imagenBanner
      if (categoria.imagenBanner && urlMapping.has(categoria.imagenBanner)) {
        const newUrl = urlMapping.get(categoria.imagenBanner)!
        categoryUpdates.imagenBanner = newUrl
        updates.push({
          categoria: categoria.nombre,
          field: 'imagenBanner',
          oldUrl: categoria.imagenBanner,
          newUrl
        })
        console.log(`🎨 [Migración] Banner "${categoria.nombre}": ${categoria.imagenBanner} -> ${newUrl}`)
      }

      // Aplicar actualizaciones si las hay
      if (Object.keys(categoryUpdates).length > 0) {
        await prisma.categoriaProyecto.update({
          where: { id: categoria.id },
          data: categoryUpdates
        })
        console.log(`✅ [Migración] Actualizada categoría: ${categoria.nombre}`)
      }
    }

    console.log(`✅ [Migración] Completada: ${updates.length} actualizaciones realizadas`)

    return NextResponse.json({
      success: true,
      message: 'URLs actualizadas exitosamente',
      updates,
      count: updates.length
    })
  } catch (error) {
    console.error('❌ [Migración] Error:', error)
    return NextResponse.json({
      error: 'Error al actualizar URLs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
