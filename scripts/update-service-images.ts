import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateServiceImages() {
  try {
    console.log('🔄 Actualizando imágenes de servicios...')

    // URLs de imágenes placeholder temporales
    const imageUpdates = [
      {
        slug: 'consultoria-diseno-estructural',
        imagen: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop'
      },
      {
        slug: 'fabricacion-estructuras-metalicas',
        imagen: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=800&fit=crop'
      },
      {
        slug: 'montaje-estructuras',
        imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop'
      },
      {
        slug: 'gestion-integral-proyectos',
        imagen: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop'
      }
    ]

    for (const update of imageUpdates) {
      await prisma.servicio.update({
        where: { slug: update.slug },
        data: { imagen: update.imagen }
      })
      console.log(`✅ Actualizada imagen para: ${update.slug}`)
    }

    console.log('✅ Todas las imágenes han sido actualizadas')
  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateServiceImages()