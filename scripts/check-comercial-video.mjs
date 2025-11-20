import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkVideo() {
  try {
    const comercial = await prisma.categoriaProyecto.findUnique({
      where: { key: 'COMERCIAL' }
    })

    console.log('\n📋 Categoría COMERCIAL:')
    console.log('='.repeat(60))
    console.log('ID:', comercial?.id)
    console.log('Nombre:', comercial?.nombre)
    console.log('imagenCover:', comercial?.imagenCover)
    console.log('imagenBanner:', comercial?.imagenBanner)
    console.log('videoBanner:', comercial?.videoBanner)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVideo()
