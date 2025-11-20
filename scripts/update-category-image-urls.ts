import prisma from '../lib/prisma'

// Mapeo de URLs antiguas a nuevas (basado en las imágenes migradas)
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

async function updateCategoryUrls() {
  console.log('🔄 Actualizando URLs de categorías en la base de datos...\n')

  try {
    // Buscar todas las categorías
    const categorias = await prisma.categoria.findMany()
    console.log(`📋 Encontradas ${categorias.length} categorías totales\n`)

    let updatedCount = 0

    for (const categoria of categorias) {
      const updates: any = {}

      // Actualizar imagenCover si está en el mapeo
      if (categoria.imagenCover && urlMapping.has(categoria.imagenCover)) {
        const newUrl = urlMapping.get(categoria.imagenCover)!
        updates.imagenCover = newUrl
        console.log(`📸 Cover de "${categoria.nombre}":`)
        console.log(`   Antes:  ${categoria.imagenCover}`)
        console.log(`   Después: ${newUrl}`)
      }

      // Actualizar imagenBanner si está en el mapeo
      if (categoria.imagenBanner && urlMapping.has(categoria.imagenBanner)) {
        const newUrl = urlMapping.get(categoria.imagenBanner)!
        updates.imagenBanner = newUrl
        console.log(`🎨 Banner de "${categoria.nombre}":`)
        console.log(`   Antes:  ${categoria.imagenBanner}`)
        console.log(`   Después: ${newUrl}`)
      }

      // Si hay actualizaciones, aplicarlas
      if (Object.keys(updates).length > 0) {
        await prisma.categoria.update({
          where: { id: categoria.id },
          data: updates
        })
        updatedCount++
        console.log(`✅ Actualizada categoría: ${categoria.nombre}\n`)
      }
    }

    console.log('='.repeat(60))
    console.log(`✅ Actualización completada: ${updatedCount} categorías actualizadas`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('❌ Error actualizando URLs:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateCategoryUrls()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
