import { PrismaClient, CategoriaEnum, EstadoProyecto, PrioridadEnum } from '@prisma/client'
import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

// Mapeo de categorías de WordPress a la nueva plataforma
const categoryMapping: Record<string, CategoriaEnum> = {
  'oil-and-gas': CategoriaEnum.OIL_GAS,
  'estructuras-modulares': CategoriaEnum.INDUSTRIAL,
  'centros-comerciales': CategoriaEnum.CENTROS_COMERCIALES,
  'escenarios-deportivos': CategoriaEnum.EDIFICIOS,
  'puentes-peatonales': CategoriaEnum.PUENTES,
  'puentes-vehiculares': CategoriaEnum.PUENTES,
  'industria': CategoriaEnum.INDUSTRIAL
}

// Función para descargar imagen
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath)
    const protocol = url.startsWith('https') ? https : http
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close()
        fs.unlink(filepath).catch(() => {})
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
      file.on('error', (err) => {
        fs.unlink(filepath).catch(() => {})
        reject(err)
      })
    }).on('error', (err) => {
      fs.unlink(filepath).catch(() => {})
      reject(err)
    })
  })
}

// Función para procesar imágenes
async function processProjectImages(
  projectId: string, 
  imageUrls: string[], 
  projectSlug: string
): Promise<string[]> {
  const uploadedImages: string[] = []
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
  
  // Crear directorio si no existe
  await fs.mkdir(uploadDir, { recursive: true })
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i]
    try {
      // Obtener extensión del archivo
      const urlParts = imageUrl.split('/')
      const filename = urlParts[urlParts.length - 1]
      const extension = filename.split('.').pop() || 'jpg'
      
      // Crear nombre único
      const timestamp = Date.now()
      const newFilename = `${projectSlug}-${timestamp}-${i}.${extension}`
      const filepath = path.join(uploadDir, newFilename)
      
      // Descargar imagen
      console.log(`     Descargando: ${filename}...`)
      await downloadImage(imageUrl, filepath)
      
      // Guardar en base de datos
      const publicUrl = `/uploads/projects/${newFilename}`
      await prisma.imagenProyecto.create({
        data: {
          url: publicUrl,
          alt: `Imagen ${i + 1} de ${projectSlug}`,
          descripcion: null,
          proyectoId: projectId
        }
      })
      
      uploadedImages.push(publicUrl)
    } catch (error) {
      console.error(`     ❌ Error descargando imagen: ${error}`)
    }
  }
  
  return uploadedImages
}

async function migrateWordPressProjects() {
  // Conexión a MySQL
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.error('❌ No se encontró un usuario admin')
      return
    }

    console.log('🚀 Iniciando migración de proyectos de WordPress...\n')

    // Obtener proyectos de WordPress
    const [projects] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_content, post_name, post_date 
       FROM wp_posts 
       WHERE post_type = 'project' 
       AND post_status = 'publish' 
       ORDER BY post_date ASC`
    )

    console.log(`📋 Migrando ${projects.length} proyectos...\n`)

    for (const wpProject of projects) {
      console.log(`\n🏗️  Proyecto: ${wpProject.post_title}`)
      
      // Extraer información del contenido
      const content = wpProject.post_content
      const descripcionMatch = content.match(/<b>Descripción:<\/b>\s*([^<]+)/i)
      const ubicacionMatch = content.match(/<b>Ubicación:<\/b>\s*([^<]+)/i)
      const clienteMatch = content.match(/<b>Cliente:<\/b>\s*([^<]+)/i)
      
      // Determinar categoría
      let categoria = CategoriaEnum.OTRO
      for (const [key, value] of Object.entries(categoryMapping)) {
        if (wpProject.post_name.includes(key)) {
          categoria = value
          break
        }
      }
      
      // Extraer descripción limpia
      let descripcion = descripcionMatch ? descripcionMatch[1].trim() : ''
      if (!descripcion) {
        // Buscar h3 en el contenido
        const h3Match = content.match(/<h3[^>]*>([^<]+)<\/h3>/i)
        descripcion = h3Match ? h3Match[1].trim() : wpProject.post_title
      }
      
      // Crear proyecto en la nueva base de datos
      try {
        const newProject = await prisma.proyecto.create({
          data: {
            titulo: wpProject.post_title,
            descripcion: descripcion,
            categoria: categoria,
            cliente: clienteMatch ? clienteMatch[1].trim() : 'MEISA',
            ubicacion: ubicacionMatch ? ubicacionMatch[1].trim() : 'Colombia',
            fechaInicio: new Date(wpProject.post_date),
            fechaFin: new Date(wpProject.post_date), // Usar misma fecha por ahora
            estado: EstadoProyecto.COMPLETADO,
            prioridad: PrioridadEnum.MEDIA,
            presupuesto: null,
            costoReal: null,
            destacado: true,
            visible: true,
            slug: wpProject.post_name,
            user: {
              connect: { id: adminUser.id }
            }
          }
        })
        
        console.log(`   ✅ Proyecto creado con ID: ${newProject.id}`)
        
        // Buscar imágenes del proyecto
        const [attachments] = await connection.execute<any[]>(
          `SELECT guid FROM wp_posts 
           WHERE post_type = 'attachment' 
           AND post_parent = ? 
           AND post_mime_type LIKE 'image/%'`,
          [wpProject.ID]
        )
        
        if (attachments.length > 0) {
          console.log(`   📸 Procesando ${attachments.length} imágenes...`)
          const imageUrls = attachments.map((att: any) => att.guid)
          const uploadedImages = await processProjectImages(
            newProject.id, 
            imageUrls, 
            wpProject.post_name
          )
          console.log(`   ✅ ${uploadedImages.length} imágenes migradas`)
        }
        
        // Buscar imágenes en sliders MetaSlider
        const sliderMatches = content.matchAll(/\[metaslider id="(\d+)"\]/g)
        const sliderIds = Array.from(sliderMatches, m => m[1])
        
        if (sliderIds.length > 0) {
          for (const sliderId of sliderIds) {
            const [sliderImages] = await connection.execute<any[]>(
              `SELECT p.guid 
               FROM wp_posts p
               INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
               WHERE pm.meta_key = 'ml-slider_parent'
               AND pm.meta_value = ?
               AND p.post_type = 'attachment'`,
              [sliderId]
            )
            
            if (sliderImages.length > 0) {
              console.log(`   📸 Procesando ${sliderImages.length} imágenes del slider ${sliderId}...`)
              const sliderImageUrls = sliderImages.map((img: any) => img.guid)
              const uploadedSliderImages = await processProjectImages(
                newProject.id,
                sliderImageUrls,
                `${wpProject.post_name}-slider-${sliderId}`
              )
              console.log(`   ✅ ${uploadedSliderImages.length} imágenes del slider migradas`)
            }
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Error creando proyecto: ${error}`)
      }
    }

    console.log('\n\n🎉 ¡Migración completada!')
    
    // Estadísticas finales
    const totalProjects = await prisma.proyecto.count()
    const totalImages = await prisma.imagenProyecto.count()
    
    console.log('\n📊 Estadísticas finales:')
    console.log(`   - Proyectos en la nueva BD: ${totalProjects}`)
    console.log(`   - Imágenes en la nueva BD: ${totalImages}`)

  } catch (error) {
    console.error('❌ Error en la migración:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateWordPressProjects()