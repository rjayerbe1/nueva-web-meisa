import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function migrateImagesFromPosts() {
  console.log('🖼️ MIGRACIÓN DE IMÁGENES DESDE project-images-from-posts.json\n')
  console.log('=' .repeat(70) + '\n')

  try {
    // Leer el archivo de imágenes
    const imagesData = await fs.readFile('./project-images-from-posts.json', 'utf8')
    const imageInfo = JSON.parse(imagesData)
    
    console.log(`📊 Total de proyectos con imágenes: ${imageInfo.total_proyectos_con_imagenes}`)
    console.log(`📊 Total de imágenes encontradas: ${imageInfo.total_imagenes_encontradas}\n`)

    let proyectosActualizados = 0
    let imagenesCreadas = 0

    // Iterar por categorías
    for (const [categoria, proyectos] of Object.entries(imageInfo.resultados) as [string, any][]) {
      console.log(`\n📂 Procesando categoría: ${categoria}`)
      
      // Iterar por proyectos en la categoría
      for (const [nombreProyecto, datosProyecto] of Object.entries(proyectos) as [string, any][]) {
        if (!datosProyecto.imagenes || datosProyecto.imagenes.length === 0) {
          continue
        }

        console.log(`\n🎯 Procesando: ${nombreProyecto}`)
        
        // Buscar el proyecto en la BD usando títulos similares
        const proyecto = await prisma.proyecto.findFirst({
          where: {
            OR: [
              { titulo: { contains: nombreProyecto, mode: 'insensitive' } },
              { titulo: { contains: nombreProyecto.replace('Centro Comercial ', ''), mode: 'insensitive' } },
              { titulo: { contains: nombreProyecto.split(' ')[0], mode: 'insensitive' } }
            ]
          }
        })

        if (!proyecto) {
          console.log(`   ❌ No se encontró proyecto para: ${nombreProyecto}`)
          continue
        }

        console.log(`   ✅ Encontrado proyecto: ${proyecto.titulo}`)
        console.log(`   📸 ${datosProyecto.imagenes.length} imágenes disponibles`)

        // Verificar si ya tiene imágenes
        const imagenesExistentes = await prisma.imagenProyecto.count({
          where: { proyectoId: proyecto.id }
        })

        if (imagenesExistentes > 0) {
          console.log(`   ⏭️  Ya tiene ${imagenesExistentes} imágenes, saltando...`)
          continue
        }

        // Crear las imágenes para este proyecto
        let orden = 1
        for (const imagen of datosProyecto.imagenes) {
          try {
            await prisma.imagenProyecto.create({
              data: {
                url: imagen.url_completa,
                alt: imagen.titulo_imagen || proyecto.titulo,
                titulo: imagen.titulo_imagen,
                orden: orden,
                tipo: orden === 1 ? 'PORTADA' : 'GALERIA',
                proyectoId: proyecto.id
              }
            })
            
            console.log(`   📷 Imagen ${orden}: ${imagen.nombre_archivo}`)
            imagenesCreadas++
            orden++
          } catch (error: any) {
            console.log(`   ❌ Error creando imagen: ${error.message}`)
          }
        }

        proyectosActualizados++
      }
    }

    console.log(`\n📊 RESUMEN DE MIGRACIÓN:`)
    console.log(`==================================================`)
    console.log(`✅ Proyectos actualizados: ${proyectosActualizados}`)
    console.log(`📷 Imágenes creadas: ${imagenesCreadas}`)
    
    const totalImagenes = await prisma.imagenProyecto.count()
    const proyectosConImagenes = await prisma.proyecto.count({
      where: {
        imagenes: {
          some: {}
        }
      }
    })
    
    console.log(`📊 Total imágenes en BD: ${totalImagenes}`)
    console.log(`🖼️ Proyectos con imágenes: ${proyectosConImagenes}`)

  } catch (error: any) {
    console.error('❌ Error en la migración:', error.message)
  }
}

migrateImagesFromPosts()
  .then(() => {
    console.log('\n🎉 ¡MIGRACIÓN DE IMÁGENES COMPLETADA!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })