import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const urlMapping = {
  '/uploads/projects/1748888377402-fju4az.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748888377402-fju4az.jpg',
  '/uploads/projects/1748981755533-yp7mhy.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748981755533-yp7mhy.jpg',
  '/uploads/projects/1748982400052-6ecy5f.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1748982400052-6ecy5f.jpg',
  '/uploads/projects/1762986267862-45z4ed.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986267862-45z4ed.png',
  '/uploads/projects/1762986479936-v2affj.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986479936-v2affj.png',
  '/uploads/projects/1762986490050-fkbvn7.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986490050-fkbvn7.png',
  '/uploads/projects/1762986495598-z9oncq.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986495598-z9oncq.png',
  '/uploads/projects/1762986508598-cytlni.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986508598-cytlni.png',
  '/uploads/projects/1762986985056-w07idu.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762986985056-w07idu.png',
  '/uploads/projects/1762987026253-oozvbu.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1762987026253-oozvbu.png',
  '/uploads/projects/1763038294941-ccd0jv.png': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763038294941-ccd0jv.png',
  '/uploads/projects/1763226664108-7j1r51.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763226664108-7j1r51.jpg',
  '/uploads/projects/1763559642470-wf7ao2.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763559642470-wf7ao2.jpg',
  '/uploads/projects/1763559728549-27v5in.jpg': 'https://storage.googleapis.com/meisa-imagenes/categories/projects/1763559728549-27v5in.jpg'
}

async function updateUrls() {
  try {
    console.log('🔄 Actualizando URLs...\n')

    const categorias = await prisma.categoriaProyecto.findMany()
    console.log(`📋 Encontradas ${categorias.length} categorías\n`)

    let count = 0

    for (const categoria of categorias) {
      const updates = {}

      if (categoria.imagenCover && urlMapping[categoria.imagenCover]) {
        updates.imagenCover = urlMapping[categoria.imagenCover]
        console.log(`📸 ${categoria.nombre} - Cover: ${categoria.imagenCover} -> ${updates.imagenCover}`)
      }

      if (categoria.imagenBanner && urlMapping[categoria.imagenBanner]) {
        updates.imagenBanner = urlMapping[categoria.imagenBanner]
        console.log(`🎨 ${categoria.nombre} - Banner: ${categoria.imagenBanner} -> ${updates.imagenBanner}`)
      }

      if (Object.keys(updates).length > 0) {
        await prisma.categoriaProyecto.update({
          where: { id: categoria.id },
          data: updates
        })
        count++
        console.log(`✅ Actualizada: ${categoria.nombre}\n`)
      }
    }

    console.log(`\n✅ Completado: ${count} categorías actualizadas`)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUrls()
