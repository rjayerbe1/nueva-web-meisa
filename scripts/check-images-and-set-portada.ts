import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkImagesAndSetPortada() {
  try {
    console.log('🖼️  Verificando imágenes y configurando portadas...\n')

    // Obtener proyectos con sus imágenes
    const proyectos = await prisma.proyecto.findMany({
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    let proyectosConImagenes = 0
    let portadasConfiguradas = 0

    for (const proyecto of proyectos) {
      if (proyecto.imagenes.length > 0) {
        proyectosConImagenes++
        
        // Verificar si ya tiene una imagen de portada
        const tienePortada = proyecto.imagenes.some(img => img.tipo === 'PORTADA')
        
        if (!tienePortada) {
          // Configurar la primera imagen como portada
          await prisma.imagenProyecto.update({
            where: { id: proyecto.imagenes[0].id },
            data: { tipo: 'PORTADA' }
          })
          
          console.log(`✅ ${proyecto.titulo}: Primera imagen configurada como portada`)
          portadasConfiguradas++
        } else {
          console.log(`ℹ️  ${proyecto.titulo}: Ya tiene portada configurada`)
        }
      } else {
        console.log(`⚠️  ${proyecto.titulo}: Sin imágenes`)
      }
    }

    console.log(`\n📊 RESUMEN:`)
    console.log(`   📦 Total proyectos: ${proyectos.length}`)
    console.log(`   🖼️  Proyectos con imágenes: ${proyectosConImagenes}`)
    console.log(`   🎯 Portadas configuradas: ${portadasConfiguradas}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar script
checkImagesAndSetPortada()