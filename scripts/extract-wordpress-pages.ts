import mysql from 'mysql2/promise'
import * as fs from 'fs/promises'
import * as path from 'path'

async function extractWordPressPages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('📄 EXTRAYENDO CONTENIDO COMPLETO DE PÁGINAS WORDPRESS\n')
    console.log('=' .repeat(60) + '\n')

    // Extraer todas las páginas publicadas
    const [pages] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_name, post_content, post_excerpt, menu_order
       FROM wp_posts 
       WHERE post_type = 'page' 
       AND post_status = 'publish' 
       ORDER BY menu_order ASC, post_date DESC`
    )

    // Crear directorio para guardar el contenido
    const outputDir = './wordpress-content-export'
    await fs.mkdir(outputDir, { recursive: true })

    console.log(`📂 Guardando contenido en: ${outputDir}\n`)

    for (const page of pages) {
      console.log(`\n📄 Procesando: ${page.post_title}`)
      console.log(`   URL: /${page.post_name}/`)
      
      // Limpiar contenido HTML
      const cleanContent = page.post_content
        .replace(/\[vc_row[^\]]*\]/g, '\n[SECCIÓN]\n')
        .replace(/\[vc_column[^\]]*\]/g, '')
        .replace(/\[\/vc_column\]/g, '')
        .replace(/\[\/vc_row\]/g, '\n[FIN SECCIÓN]\n')
        .replace(/\[vc_column_text[^\]]*\]/g, '')
        .replace(/\[\/vc_column_text\]/g, '')
        .replace(/\[vc_custom_heading[^\]]*\]/g, '[TÍTULO] ')
        .replace(/\[\/vc_custom_heading\]/g, '')
        .replace(/<h([1-6])>/g, '\n\n### ')
        .replace(/<\/h[1-6]>/g, '\n\n')
        .replace(/<p>/g, '\n')
        .replace(/<\/p>/g, '\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim()

      // Guardar en archivo markdown
      const filename = `${page.post_name}.md`
      const filepath = path.join(outputDir, filename)
      
      const content = `# ${page.post_title}

**ID de WordPress:** ${page.ID}
**Slug:** ${page.post_name}
**Orden en menú:** ${page.menu_order || 'Sin orden'}

## Contenido

${cleanContent}

${page.post_excerpt ? `\n## Extracto\n\n${page.post_excerpt}` : ''}
`

      await fs.writeFile(filepath, content, 'utf8')
      console.log(`   ✅ Guardado en: ${filename}`)
      
      // Buscar metadatos específicos
      const [metadata] = await connection.execute<any[]>(
        `SELECT meta_key, meta_value 
         FROM wp_postmeta 
         WHERE post_id = ? 
         AND meta_key IN ('_yoast_wpseo_title', '_yoast_wpseo_metadesc', '_thumbnail_id')`,
        [page.ID]
      )
      
      if (metadata.length > 0) {
        console.log('   📌 Metadatos encontrados:')
        metadata.forEach(meta => {
          console.log(`      - ${meta.meta_key}: ${meta.meta_value}`)
        })
      }
    }

    // Extraer información adicional específica
    console.log('\n\n🔍 BUSCANDO INFORMACIÓN ESPECÍFICA DE LA EMPRESA...\n')

    // Buscar contenido con palabras clave específicas
    const keywords = ['misión', 'visión', 'valores', 'historia', 'experiencia', 'certificaciones', 'política', 'calidad']
    
    for (const keyword of keywords) {
      const [results] = await connection.execute<any[]>(
        `SELECT post_title, post_content 
         FROM wp_posts 
         WHERE (post_content LIKE ? OR post_title LIKE ?)
         AND post_status = 'publish' 
         AND post_type IN ('page', 'post')
         LIMIT 5`,
        [`%${keyword}%`, `%${keyword}%`]
      )
      
      if (results.length > 0) {
        console.log(`\n📌 Contenido con "${keyword}":`)
        results.forEach(result => {
          console.log(`   - ${result.post_title}`)
          
          // Extraer fragmento relevante
          const regex = new RegExp(`(.{0,100}${keyword}.{0,200})`, 'i')
          const match = result.post_content.match(regex)
          if (match) {
            const fragment = match[1]
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim()
            console.log(`     "${fragment}..."`)
          }
        })
      }
    }

    // Buscar sliders y galerías con contenido
    console.log('\n\n🖼️ EXTRAYENDO CONTENIDO DE SLIDERS...\n')
    
    const [sliders] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_content, pm.meta_value as slides_data
       FROM wp_posts p
       LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = 'ml-slider_settings'
       WHERE p.post_type = 'ml-slider' 
       AND p.post_status = 'publish'
       LIMIT 10`
    )
    
    if (sliders.length > 0) {
      for (const slider of sliders) {
        console.log(`\nSlider: ${slider.post_title}`)
        
        // Buscar slides asociados
        const [slides] = await connection.execute<any[]>(
          `SELECT p.post_title, p.post_excerpt, pm.meta_value as image_url
           FROM wp_posts p
           LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
           WHERE p.post_parent = ?
           AND p.post_type = 'attachment'`,
          [slider.ID]
        )
        
        if (slides.length > 0) {
          console.log(`   Slides encontrados: ${slides.length}`)
          slides.forEach((slide, index) => {
            console.log(`   ${index + 1}. ${slide.post_title || 'Sin título'}`)
            if (slide.post_excerpt) {
              console.log(`      Texto: ${slide.post_excerpt}`)
            }
          })
        }
      }
    }

    // Generar resumen
    console.log('\n\n📊 RESUMEN DE CONTENIDO ENCONTRADO\n')
    console.log('=' .repeat(60))
    console.log(`\nTotal de páginas extraídas: ${pages.length}`)
    console.log(`Archivos guardados en: ${outputDir}/`)
    console.log('\nPáginas principales:')
    pages.slice(0, 10).forEach(page => {
      console.log(`- ${page.post_title} (/${page.post_name}/)`)
    })

    // Crear archivo de índice
    const indexContent = `# Contenido exportado de WordPress - MEISA

Fecha de exportación: ${new Date().toLocaleString('es-CO')}

## Páginas disponibles

${pages.map(page => `- [${page.post_title}](./${page.post_name}.md)`).join('\n')}

## Notas

- El contenido ha sido limpiado de shortcodes de Visual Composer
- Las imágenes necesitan ser migradas por separado
- Revisar cada archivo para adaptar el contenido al nuevo diseño
`

    await fs.writeFile(path.join(outputDir, 'INDEX.md'), indexContent, 'utf8')
    console.log('\n✅ Índice creado en INDEX.md')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar extracción
extractWordPressPages()