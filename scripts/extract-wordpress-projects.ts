import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

interface WordPressProject {
  ID: number
  post_title: string
  post_content: string
  post_name: string
  post_date: Date
  post_status: string
}

interface WordPressAttachment {
  ID: number
  post_title: string
  post_content: string
  guid: string
  post_parent: number
}

async function extractWordPressProjects() {
  // Conexión a MySQL local
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sin contraseña en local
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔍 Buscando proyectos en WordPress...\n')

    // 1. Buscar todos los proyectos publicados
    const [projects] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_content, post_name, post_date, post_status 
       FROM wp_posts 
       WHERE post_type = 'project' 
       AND post_status = 'publish' 
       ORDER BY post_date DESC`
    )

    console.log(`✅ Encontrados ${projects.length} proyectos\n`)

    // 2. Para cada proyecto, buscar sus imágenes adjuntas
    for (const project of projects) {
      console.log(`\n📋 PROYECTO: ${project.post_title}`)
      console.log(`   - Slug: ${project.post_name}`)
      console.log(`   - Fecha: ${project.post_date}`)
      console.log(`   - URL: https://meisa.com.co/project/${project.post_name}/`)

      // Buscar imágenes adjuntas
      const [attachments] = await connection.execute<any[]>(
        `SELECT ID, post_title, post_content, guid 
         FROM wp_posts 
         WHERE post_type = 'attachment' 
         AND post_parent = ? 
         AND post_mime_type LIKE 'image/%'`,
        [project.ID]
      )

      if (attachments.length > 0) {
        console.log(`   - Imágenes (${attachments.length}):`)
        attachments.forEach((img, index) => {
          console.log(`     ${index + 1}. ${img.guid}`)
        })
      }

      // Buscar metadatos del proyecto
      const [metadata] = await connection.execute<any[]>(
        `SELECT meta_key, meta_value 
         FROM wp_postmeta 
         WHERE post_id = ? 
         AND meta_key IN ('cliente', 'ubicacion', 'descripcion', '_thumbnail_id')`,
        [project.ID]
      )

      if (metadata.length > 0) {
        console.log('   - Metadatos:')
        for (const meta of metadata) {
          if (meta.meta_key === '_thumbnail_id') {
            // Buscar URL de la imagen destacada
            const [thumb] = await connection.execute<any[]>(
              `SELECT guid FROM wp_posts WHERE ID = ?`,
              [meta.meta_value]
            )
            if (thumb.length > 0) {
              console.log(`     Imagen destacada: ${thumb[0].guid}`)
            }
          } else {
            console.log(`     ${meta.meta_key}: ${meta.meta_value}`)
          }
        }
      }

      // Extraer información del contenido (Visual Composer)
      const content = project.post_content
      
      // Buscar descripciones en el contenido
      const descripcionMatch = content.match(/<b>Descripción:<\/b>\s*([^<]+)/i)
      const ubicacionMatch = content.match(/<b>Ubicación:<\/b>\s*([^<]+)/i)
      const clienteMatch = content.match(/<b>Cliente:<\/b>\s*([^<]+)/i)
      const cantidadMatch = content.match(/<b>Cantidad:<\/b>\s*([^<]+)/i)
      const capacidadMatch = content.match(/<b>Capacidad:<\/b>\s*([^<]+)/i)

      if (descripcionMatch || ubicacionMatch || clienteMatch) {
        console.log('   - Información extraída del contenido:')
        if (descripcionMatch) console.log(`     Descripción: ${descripcionMatch[1].trim()}`)
        if (ubicacionMatch) console.log(`     Ubicación: ${ubicacionMatch[1].trim()}`)
        if (clienteMatch) console.log(`     Cliente: ${clienteMatch[1].trim()}`)
        if (cantidadMatch) console.log(`     Cantidad: ${cantidadMatch[1].trim()}`)
        if (capacidadMatch) console.log(`     Capacidad: ${capacidadMatch[1].trim()}`)
      }

      // Buscar IDs de sliders MetaSlider en el contenido
      const sliderMatches = content.matchAll(/\[metaslider id="(\d+)"\]/g)
      const sliderIds = Array.from(sliderMatches, m => m[1])
      
      if (sliderIds.length > 0) {
        console.log(`   - Sliders encontrados: ${sliderIds.join(', ')}`)
        
        // Buscar imágenes de cada slider
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
            console.log(`     Imágenes del slider ${sliderId}:`)
            sliderImages.forEach((img, idx) => {
              console.log(`       ${idx + 1}. ${img.guid}`)
            })
          }
        }
      }
    }

    // 3. Buscar categorías de proyectos
    console.log('\n\n📂 CATEGORÍAS DE PROYECTOS:')
    const [categories] = await connection.execute<any[]>(
      `SELECT t.name, t.slug, COUNT(tr.object_id) as count
       FROM wp_terms t
       INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
       LEFT JOIN wp_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
       WHERE tt.taxonomy = 'project-type'
       GROUP BY t.term_id
       ORDER BY count DESC`
    )

    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug}): ${cat.count} proyectos`)
    })

    // 4. Resumen
    console.log('\n\n📊 RESUMEN:')
    console.log(`   - Total de proyectos: ${projects.length}`)
    console.log(`   - Total de categorías: ${categories.length}`)
    
    // Contar imágenes totales
    const [imageCount] = await connection.execute<any[]>(
      `SELECT COUNT(*) as total 
       FROM wp_posts p1
       INNER JOIN wp_posts p2 ON p1.post_parent = p2.ID
       WHERE p1.post_type = 'attachment' 
       AND p1.post_mime_type LIKE 'image/%'
       AND p2.post_type = 'project'`
    )
    console.log(`   - Total de imágenes en proyectos: ${imageCount[0].total}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar
extractWordPressProjects()