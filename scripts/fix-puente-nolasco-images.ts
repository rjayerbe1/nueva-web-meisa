import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixPuenteNolascoImages() {
  try {
    console.log('🔧 CORRIGIENDO IMÁGENES DEL PUENTE NOLASCO\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Identificar el problema específico
    const nolasco2 = await prisma.proyecto.findFirst({
      where: {
        titulo: {
          contains: 'nolasco 2',
          mode: 'insensitive'
        }
      },
      include: {
        imagenes: true
      }
    })

    if (!nolasco2) {
      console.log('❌ No se encontró el proyecto "Puente nolasco 2"')
      return
    }

    console.log(`🎯 Proyecto encontrado: ${nolasco2.titulo}`)
    console.log(`📸 Imágenes asignadas: ${nolasco2.imagenes.length}`)

    // 2. Analizar las imágenes mal asignadas
    const imagenesMalAsignadas = nolasco2.imagenes.filter(img => {
      const altText = img.alt.toLowerCase()
      return altText.includes('terminal intermedio') || altText.includes('tertulia')
    })

    console.log(`\n❌ Imágenes mal asignadas: ${imagenesMalAsignadas.length}`)
    
    for (const imagen of imagenesMalAsignadas) {
      console.log(`   📄 ${imagen.url}`)
      console.log(`      Alt: ${imagen.alt}`)
      
      // Determinar a qué proyecto debería pertenecer
      const altText = imagen.alt.toLowerCase()
      let proyectoCorrect = null
      
      if (altText.includes('terminal intermedio')) {
        proyectoCorrect = await prisma.proyecto.findFirst({
          where: {
            OR: [
              { titulo: { contains: 'terminal intermedio', mode: 'insensitive' } },
              { titulo: { contains: 'Terminal Intermedio', mode: 'insensitive' } }
            ]
          }
        })
      } else if (altText.includes('tertulia')) {
        proyectoCorrect = await prisma.proyecto.findFirst({
          where: {
            titulo: { contains: 'tertulia', mode: 'insensitive' }
          }
        })
      }

      if (proyectoCorrect) {
        console.log(`      ✅ Debería estar en: ${proyectoCorrect.titulo}`)
        
        // Reasignar la imagen
        await prisma.imagenProyecto.update({
          where: { id: imagen.id },
          data: { 
            proyectoId: proyectoCorrect.id,
            alt: imagen.alt.replace(nolasco2.titulo, proyectoCorrect.titulo)
          }
        })
        
        console.log(`      🔄 Reasignada correctamente`)
      } else {
        console.log(`      ⚠️  No se encontró proyecto destino`)
      }
    }

    // 3. Buscar imágenes correctas para el Puente Nolasco 2
    console.log('\n🔍 Buscando imágenes correctas para Puente Nolasco...')
    
    // Buscar imágenes disponibles de nolasco que no estén asignadas o mal asignadas
    const imagenesNolascoDisponibles = await prisma.imagenProyecto.findMany({
      where: {
        url: {
          contains: 'nolasco',
          mode: 'insensitive'
        },
        NOT: {
          proyectoId: nolasco2.id
        }
      },
      include: {
        proyecto: true
      }
    })

    console.log(`📁 Imágenes de Nolasco disponibles: ${imagenesNolascoDisponibles.length}`)

    // 4. Consolidar proyectos duplicados de Nolasco
    const todosNolasco = await prisma.proyecto.findMany({
      where: {
        titulo: {
          contains: 'nolasco',
          mode: 'insensitive'
        }
      },
      include: {
        imagenes: true
      }
    })

    console.log(`\n📋 Total proyectos Nolasco: ${todosNolasco.length}`)
    
    if (todosNolasco.length > 1) {
      console.log('\n🔄 CONSOLIDANDO PROYECTOS DUPLICADOS:')
      
      // Mantener el proyecto principal (sin "2" en el nombre)
      const proyectoPrincipal = todosNolasco.find(p => 
        !p.titulo.includes('2') && !p.slug.includes('2')
      ) || todosNolasco[0]
      
      const proyectosDuplicados = todosNolasco.filter(p => p.id !== proyectoPrincipal.id)
      
      console.log(`   🎯 Proyecto principal: ${proyectoPrincipal.titulo}`)
      console.log(`   🗑️  Proyectos a eliminar: ${proyectosDuplicados.length}`)

      for (const duplicado of proyectosDuplicados) {
        console.log(`\n   📦 Procesando: ${duplicado.titulo}`)
        
        // Mover imágenes correctas al proyecto principal
        const imagenesCorrectas = duplicado.imagenes.filter(img => {
          const altText = img.alt.toLowerCase()
          const urlText = img.url.toLowerCase()
          return (altText.includes('nolasco') || urlText.includes('nolasco')) &&
                 !altText.includes('terminal intermedio') && 
                 !altText.includes('tertulia')
        })

        console.log(`     📸 Imágenes correctas a mover: ${imagenesCorrectas.length}`)
        
        for (const imagen of imagenesCorrectas) {
          await prisma.imagenProyecto.update({
            where: { id: imagen.id },
            data: { 
              proyectoId: proyectoPrincipal.id,
              alt: imagen.alt.replace(duplicado.titulo, proyectoPrincipal.titulo)
            }
          })
          console.log(`     ✅ Movida: ${imagen.url}`)
        }

        // Eliminar el proyecto duplicado (solo si no tiene imágenes restantes)
        const imagenesRestantes = await prisma.imagenProyecto.count({
          where: { proyectoId: duplicado.id }
        })

        if (imagenesRestantes === 0) {
          await prisma.proyecto.delete({
            where: { id: duplicado.id }
          })
          console.log(`     🗑️  Proyecto eliminado: ${duplicado.titulo}`)
        } else {
          console.log(`     ⚠️  Proyecto conservado (${imagenesRestantes} imágenes restantes)`)
        }
      }
    }

    // 5. Verificación final
    console.log('\n✅ VERIFICACIÓN FINAL:')
    
    const proyectosNolascoFinal = await prisma.proyecto.findMany({
      where: {
        titulo: {
          contains: 'nolasco',
          mode: 'insensitive'
        }
      },
      include: {
        imagenes: true
      }
    })

    for (const proyecto of proyectosNolascoFinal) {
      console.log(`\n🎯 ${proyecto.titulo}`)
      console.log(`   📸 Imágenes: ${proyecto.imagenes.length}`)
      
      const imagenesCorrectas = proyecto.imagenes.filter(img => {
        const altText = img.alt.toLowerCase()
        const urlText = img.url.toLowerCase()
        return (altText.includes('nolasco') || urlText.includes('nolasco')) &&
               !altText.includes('terminal intermedio') && 
               !altText.includes('tertulia')
      })
      
      const imagenesIncorrectas = proyecto.imagenes.length - imagenesCorrectas.length
      
      console.log(`   ✅ Correctas: ${imagenesCorrectas.length}`)
      if (imagenesIncorrectas > 0) {
        console.log(`   ❌ Incorrectas: ${imagenesIncorrectas}`)
      }
    }

    console.log('\n🎉 CORRECCIÓN COMPLETADA')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar corrección
fixPuenteNolascoImages()