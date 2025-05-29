import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as dotenv from 'dotenv'

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

async function continueImageMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔄 CONTINUANDO MIGRACIÓN DE IMÁGENES\n')
    console.log('=' .repeat(50) + '\n')

    // Obtener proyectos SIN imágenes
    const projectsWithoutImages = await prisma.proyecto.findMany({
      where: {
        imagenes: {
          none: {}
        }
      },
      orderBy: { titulo: 'asc' }
    })

    console.log(`📊 Proyectos sin imágenes: ${projectsWithoutImages.length}\n`)

    let totalImagesDownloaded = 0
    let projectsUpdated = 0

    // Mapeo de términos de búsqueda optimizado
    const searchTerms: { [key: string]: string[] } = {
      'sena': ['sena'],
      'tequendama': ['tequendama'],
      'bomberos': ['bomberos'],
      'omega': ['omega'],
      'modulos': ['modulos', 'medicos'],
      'terminal': ['terminal', 'mio'],
      'guadalupe': ['guadalupe', 'mio'],
      'reina victoria': ['reina', 'victoria'],
      'bodega': ['bodega'],
      'tecnofar': ['tecnofar'],
      'tecno quimicas': ['tecno', 'quimicas'],
      'protecnica': ['protecnica'],
      'duplex': ['duplex'],
      'intera': ['intera'],
      'cogeneracion': ['cogeneracion', 'propal'],
      'tanque': ['tanque'],
      'glp': ['glp'],
      'puente': ['puente'],
      'escalinata': ['escalinata'],
      'tertulia': ['tertulia'],
      'rio': ['rio'],
      'negro': ['negro'],
      'paila': ['paila'],
      'cambrin': ['cambrin'],
      'frisoles': ['frisoles'],
      'nolasco': ['nolasco'],
      'carrera': ['carrera'],
      'autopista': ['autopista'],
      'saraconcho': ['saraconcho'],
      'cecun': ['cecun'],
      'coliseo': ['coliseo'],
      'cancha': ['cancha', 'javeriana'],
      'acuatico': ['acuatico'],
      'complejo': ['complejo'],
      'deportivo': ['deportivo'],
      'camino': ['camino', 'viejo'],
      'cubierta': ['cubierta'],
      'ips': ['ips', 'sura'],
      'taquillas': ['taquillas'],
      'pisoje': ['pisoje'],
      'cocinas': ['cocinas'],
      'oficinas': ['oficinas'],
      'modulares': ['modulares'],
      'modular': ['modular']
    }

    for (const project of projectsWithoutImages) {
      console.log(`\n🎯 Procesando: ${project.titulo}`)
      
      const projectLower = project.titulo.toLowerCase()
      let searchKeys: string[] = []
      
      // Buscar términos específicos
      for (const [key, terms] of Object.entries(searchTerms)) {
        if (projectLower.includes(key)) {
          searchKeys = terms
          break
        }
      }

      // Si no encuentra términos específicos, usar palabras del título
      if (searchKeys.length === 0) {
        searchKeys = project.titulo
          .toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 3)
      }

      console.log(`   🔍 Buscando: ${searchKeys.join(', ')}`)

      let foundImages: any[] = []
      
      for (const searchTerm of searchKeys) {
        const [images] = await connection.execute<any[]>(
          `SELECT DISTINCT p.ID, p.post_title, p.guid, p.post_mime_type, p.post_date
           FROM wp_posts p
           WHERE p.post_type = 'attachment'
           AND p.post_mime_type LIKE 'image/%'
           AND (p.post_title LIKE ? OR p.guid LIKE ?)
           ORDER BY p.post_date DESC
           LIMIT 6`,
          [`%${searchTerm}%`, `%${searchTerm}%`]
        )
        
        images.forEach(img => {
          if (!foundImages.find(existing => existing.ID === img.ID)) {
            foundImages.push(img)
          }
        })
      }

      console.log(`   📸 Encontradas ${foundImages.length} imágenes`)

      if (foundImages.length === 0) {
        console.log(`   ⚠️ Sin imágenes para ${project.titulo}`)
        continue
      }

      const downloadedImages: string[] = []
      
      for (let i = 0; i < Math.min(foundImages.length, 6); i++) {
        const image = foundImages[i]
        const imageUrl = image.guid

        if (!imageUrl) continue

        const filename = `${project.slug}-${Date.now()}-${i + 1}`
        const localPath = await downloadImage(imageUrl, filename)
        
        if (localPath) {
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

        // Pequeña pausa para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      console.log(`   ✅ Descargadas ${downloadedImages.length} imágenes`)
      
      if (downloadedImages.length > 0) {
        projectsUpdated++
      }

      // Pausa entre proyectos
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('\n\n📊 RESUMEN FINAL:')
    console.log('=' .repeat(40))
    console.log(`✅ Proyectos actualizados: ${projectsUpdated}`)
    console.log(`✅ Imágenes descargadas: ${totalImagesDownloaded}`)
    
    const finalStats = await prisma.proyecto.count({
      where: {
        imagenes: {
          some: {}
        }
      }
    })
    
    console.log(`🎯 Total proyectos con imágenes: ${finalStats}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

continueImageMigration()