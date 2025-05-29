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

    // Limpiar la URL
    const cleanUrl = url.replace(/["\[\]]/g, '').trim()
    if (!cleanUrl.startsWith('http')) {
      // Si no es URL completa, construir desde meisa.com.co
      const baseUrl = cleanUrl.startsWith('/') ? 
        `https://meisa.com.co${cleanUrl}` : 
        `https://meisa.com.co/wp-content/uploads/${cleanUrl}`
      return await downloadImage(baseUrl, filename)
    }

    console.log(`📥 Descargando: ${cleanUrl}`)
    
    const response = await fetch(cleanUrl)
    if (!response.ok) {
      console.log(`❌ Error ${response.status}: ${cleanUrl}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    // Determinar extensión basada en el contenido o URL
    let extension = path.extname(cleanUrl) || '.jpg'
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

async function migrateRealProjectImages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🖼️ MIGRACIÓN DE IMÁGENES REALES DE PROYECTOS\n')
    console.log('=' .repeat(70) + '\n')

    // Obtener todos los sliders de WordPress con sus imágenes
    const [sliders] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_name 
       FROM wp_posts p
       WHERE p.post_type = 'ml-slider'
       AND p.post_status = 'publish'
       ORDER BY p.post_title`
    )

    console.log(`📂 Encontrados ${sliders.length} sliders para procesar\n`)

    let totalImagesDownloaded = 0
    let projectsUpdated = 0

    for (const slider of sliders) {
      console.log(`\n🎯 Procesando slider: ${slider.post_title}`)
      
      // Buscar el proyecto correspondiente en nuestra base de datos
      let projectTitle = slider.post_title
      
      // Limpiar el título para hacer match
      projectTitle = projectTitle
        .replace(/^(Centro comercial|Centros comerciales|Puentes?|Edificios?|Industria|Escenarios deportivos|Cubiertas y fachadas|Estructuras modulares|Oil and Gas)\s*-?\s*/i, '')
        .trim()

      // Casos especiales de mapeo
      if (projectTitle.toLowerCase().includes('campanario')) {
        projectTitle = 'Centro Comercial Campanario'
      } else if (projectTitle.toLowerCase() === 'plaza' && slider.post_title.includes('Armenia')) {
        projectTitle = 'Plaza Armenia'
      } else if (projectTitle.toLowerCase() === 'plaza' && slider.post_title.includes('Bochalema')) {
        projectTitle = 'Plaza Bochalema'
      } else if (projectTitle.toLowerCase() === 'unico') {
        if (slider.post_title.includes('Barranquilla')) projectTitle = 'Centro Comercial Único Barranquilla'
        else if (slider.post_title.includes('Cali')) projectTitle = 'Centro Comercial Único Cali'
        else if (slider.post_title.includes('Neiva')) projectTitle = 'Centro Comercial Único Neiva'
      }

      // Más mapeos específicos
      const titleMappings: { [key: string]: string } = {
        'plaza': 'Plaza',
        'campanario': 'Centro Comercial Campanario',
        'monserrat': 'Monserrat', 
        'paseo villa del rio': 'Paseo villa del rio',
        'unico': 'Centro Comercial Único',
        'camino viejo': 'Camino viejo',
        'cubierta interna': 'Cubierta interna',
        'ips sura': 'IPS Sura',
        'taquillas pisoje': 'Taquillas Pisoje',
        'bomberos': 'Bomberos',
        'cinemateca distrital': 'Cinemateca distrital',
        'clinica reina victoria': 'Clinica reina victoria',
        'mio guadalupe': 'MIO Guadalupe',
        'módulos médicos': 'Módulos Médicos',
        'omega': 'Omega',
        'sena': 'Sena',
        'tequendama parking': 'Tequendama parking'
      }

      // Buscar mapeo específico
      const lowerTitle = projectTitle.toLowerCase()
      for (const [key, value] of Object.entries(titleMappings)) {
        if (lowerTitle.includes(key)) {
          projectTitle = value
          break
        }
      }

      // Buscar proyecto en nuestra base de datos
      const project = await prisma.proyecto.findFirst({
        where: {
          OR: [
            { titulo: { contains: projectTitle, mode: 'insensitive' } },
            { titulo: { contains: slider.post_title, mode: 'insensitive' } }
          ]
        },
        include: { imagenes: true }
      })

      if (!project) {
        console.log(`   ⚠️ No se encontró proyecto para: ${slider.post_title}`)
        continue
      }

      console.log(`   ✅ Encontrado proyecto: ${project.titulo}`)

      // Buscar todas las imágenes asociadas a este slider
      const [images] = await connection.execute<any[]>(
        `SELECT 
           att.ID,
           att.guid,
           att.post_title as image_title,
           att.menu_order,
           att.post_date,
           pm.meta_value as file_path
         FROM wp_posts slide
         INNER JOIN wp_posts att ON slide.ID = att.post_parent
         LEFT JOIN wp_postmeta pm ON att.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
         WHERE slide.post_parent = ?
         AND slide.post_type = 'ml-slide'
         AND att.post_type = 'attachment'
         AND att.post_mime_type LIKE 'image/%'
         ORDER BY att.menu_order, att.post_date
         LIMIT 15`,
        [slider.ID]
      )

      console.log(`   📸 Encontradas ${images.length} imágenes`)

      if (images.length === 0) {
        console.log(`   ⚠️ No hay imágenes para descargar`)
        continue
      }

      // Eliminar imágenes de muestra existentes
      await prisma.imagenProyecto.deleteMany({
        where: { proyectoId: project.id }
      })

      // Descargar y crear nuevas imágenes
      const downloadedImages: string[] = []
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        let imageUrl = image.guid

        // Si no hay URL en guid, construir desde file_path
        if (!imageUrl || imageUrl === '') {
          imageUrl = image.file_path ? 
            `https://meisa.com.co/wp-content/uploads/${image.file_path}` :
            null
        }

        if (!imageUrl) {
          console.log(`   ⚠️ Sin URL para imagen ${i + 1}`)
          continue
        }

        const filename = `${project.slug}-${Date.now()}-${i + 1}`
        const localPath = await downloadImage(imageUrl, filename)
        
        if (localPath) {
          // Crear registro en base de datos
          await prisma.imagenProyecto.create({
            data: {
              url: localPath,
              alt: `${project.titulo} - Imagen ${i + 1}`,
              proyectoId: project.id,
              descripcion: image.image_title || `Imagen ${i + 1} del proyecto ${project.titulo}`
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

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateRealProjectImages()