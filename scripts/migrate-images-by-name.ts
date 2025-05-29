import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    if (!url || url === 'placeholder' || url.includes('placeholder')) {
      return null
    }

    console.log(`📥 Descargando: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`❌ Error ${response.status}: ${url}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    // Determinar extensión
    let extension = path.extname(url) || '.jpg'
    if (!extension || extension === '.') {
      extension = '.jpg'
    }
    
    const safeFilename = `${filename}${extension}`.replace(/[^a-zA-Z0-9.-]/g, '-')
    
    const uploadDir = './public/uploads/projects'
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filepath = path.join(uploadDir, safeFilename)
    await fs.writeFile(filepath, uint8Array)
    
    console.log(`✅ Guardado: ${safeFilename}`)
    return `/uploads/projects/${safeFilename}`
  } catch (error) {
    console.error(`❌ Error descargando ${url}:`, error)
    return null
  }
}

async function migrateImagesByName() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🖼️ MIGRACIÓN DE IMÁGENES POR NOMBRE DE PROYECTO\n')
    console.log('=' .repeat(70) + '\n')

    // Obtener todos los proyectos de nuestra base de datos
    const projects = await prisma.proyecto.findMany({
      include: { imagenes: true }
    })

    console.log(`📊 Encontrados ${projects.length} proyectos para procesar\n`)

    let totalImagesDownloaded = 0
    let projectsUpdated = 0

    // Mapeo de palabras clave para búsqueda
    const searchTerms: { [key: string]: string[] } = {
      'campanario': ['campanario'],
      'unico': ['unico'],
      'plaza': ['plaza', 'bochalema'],
      'monserrat': ['monserrat'],
      'paseo villa del rio': ['paseo', 'villa', 'rio'],
      'bomberos': ['bomberos'],
      'cinemateca': ['cinemateca'],
      'clinica reina victoria': ['clinica', 'reina', 'victoria'],
      'mio guadalupe': ['mio', 'guadalupe'],
      'mio terminal': ['mio', 'terminal'],
      'modulos medicos': ['modulos', 'medicos'],
      'omega': ['omega'],
      'sena': ['sena'],
      'tequendama': ['tequendama'],
      'cargill': ['cargill'],
      'bodega duplex': ['bodega', 'duplex'],
      'bodega intera': ['bodega', 'intera'],
      'protecnica': ['protecnica'],
      'tecnofar': ['tecnofar'],
      'tecno quimicas': ['tecno', 'quimicas'],
      'cogeneracion': ['cogeneracion', 'propal'],
      'escalinata': ['escalinata'],
      'nolasco': ['nolasco'],
      'frisoles': ['frisoles'],
      'cambrin': ['cambrin'],
      'saraconcho': ['saraconcho'],
      'paila': ['paila'],
      'carrera 100': ['carrera'],
      'rio negro': ['rio', 'negro'],
      'tertulia': ['tertulia'],
      'autopista': ['autopista'],
      'cancha javeriana': ['cancha', 'javeriana'],
      'cecun': ['cecun'],
      'coliseo': ['coliseo'],
      'complejo acuatico': ['complejo', 'acuatico'],
      'cocinas': ['cocinas'],
      'oficinas': ['oficinas'],
      'tanque': ['tanque'],
      'glp': ['glp'],
      'camino viejo': ['camino'],
      'cubierta': ['cubierta'],
      'ips sura': ['ips', 'sura'],
      'taquillas': ['taquillas']
    }

    for (const project of projects) {
      console.log(`\n🎯 Procesando: ${project.titulo}`)
      
      // Determinar términos de búsqueda para este proyecto
      const projectLower = project.titulo.toLowerCase()
      let searchKeys: string[] = []
      
      // Buscar términos que coincidan con el proyecto
      for (const [key, terms] of Object.entries(searchTerms)) {
        if (terms.some(term => projectLower.includes(term))) {
          searchKeys = terms
          break
        }
      }

      // Si no encuentra términos específicos, usar palabras del título
      if (searchKeys.length === 0) {
        searchKeys = project.titulo
          .toLowerCase()
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 2)
      }

      console.log(`   🔍 Buscando imágenes con términos: ${searchKeys.join(', ')}`)

      // Buscar imágenes que contengan estos términos
      let foundImages: any[] = []
      
      for (const searchTerm of searchKeys) {
        const [images] = await connection.execute<any[]>(
          `SELECT DISTINCT p.ID, p.post_title, p.guid, p.post_mime_type, p.post_date
           FROM wp_posts p
           WHERE p.post_type = 'attachment'
           AND p.post_mime_type LIKE 'image/%'
           AND (p.post_title LIKE ? OR p.guid LIKE ?)
           ORDER BY p.post_date DESC
           LIMIT 10`,
          [`%${searchTerm}%`, `%${searchTerm}%`]
        )
        
        // Agregar imágenes encontradas sin duplicados
        images.forEach(img => {
          if (!foundImages.find(existing => existing.ID === img.ID)) {
            foundImages.push(img)
          }
        })
      }

      console.log(`   📸 Encontradas ${foundImages.length} imágenes`)

      if (foundImages.length === 0) {
        console.log(`   ⚠️ No se encontraron imágenes para ${project.titulo}`)
        continue
      }

      // Eliminar imágenes existentes del proyecto
      await prisma.imagenProyecto.deleteMany({
        where: { proyectoId: project.id }
      })

      // Descargar y crear nuevas imágenes
      const downloadedImages: string[] = []
      
      for (let i = 0; i < Math.min(foundImages.length, 8); i++) {
        const image = foundImages[i]
        const imageUrl = image.guid

        if (!imageUrl) {
          continue
        }

        const filename = `${project.slug}-${Date.now()}-${i + 1}`
        const localPath = await downloadImage(imageUrl, filename)
        
        if (localPath) {
          // Crear registro en base de datos
          await prisma.imagenProyecto.create({
            data: {
              url: localPath,
              alt: `${project.titulo} - ${image.post_title}`,
              proyectoId: project.id,
              descripcion: image.post_title || `Imagen ${i + 1} del proyecto ${project.titulo}`
            }
          })
          
          downloadedImages.push(localPath)
          totalImagesDownloaded++
        }
      }

      console.log(`   ✅ Descargadas ${downloadedImages.length} imágenes para ${project.titulo}`)
      
      if (downloadedImages.length > 0) {
        projectsUpdated++
      }
    }

    // Resumen final
    console.log('\n\n📊 RESUMEN DE MIGRACIÓN DE IMÁGENES')
    console.log('=' .repeat(50))
    console.log(`✅ Proyectos actualizados: ${projectsUpdated}`)
    console.log(`✅ Imágenes descargadas: ${totalImagesDownloaded}`)
    
    // Verificar totales en base de datos
    const totalProjects = await prisma.proyecto.count()
    const totalImages = await prisma.imagenProyecto.count()
    
    console.log(`📊 Total proyectos en BD: ${totalProjects}`)
    console.log(`🖼️ Total imágenes en BD: ${totalImages}`)

    // Proyectos con y sin imágenes
    const projectsWithImages = await prisma.proyecto.count({
      where: {
        imagenes: {
          some: {}
        }
      }
    })
    
    const projectsWithoutImages = totalProjects - projectsWithImages
    
    console.log(`✅ Proyectos con imágenes: ${projectsWithImages}`)
    console.log(`⚠️ Proyectos sin imágenes: ${projectsWithoutImages}`)

    console.log('\n🎉 ¡MIGRACIÓN DE IMÁGENES COMPLETADA!')

    // Mostrar algunos ejemplos de proyectos con imágenes
    const exampleProjects = await prisma.proyecto.findMany({
      include: { imagenes: true },
      where: {
        imagenes: {
          some: {}
        }
      },
      take: 5
    })

    console.log('\n📋 EJEMPLOS DE PROYECTOS CON IMÁGENES:')
    exampleProjects.forEach(project => {
      console.log(`- ${project.titulo}: ${project.imagenes.length} imágenes`)
    })

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateImagesByName()