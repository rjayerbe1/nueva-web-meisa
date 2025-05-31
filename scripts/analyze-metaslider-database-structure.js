const mysql = require('mysql2/promise')

async function analyzeMetaSliderStructure() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔍 ANÁLISIS DE ESTRUCTURA METASLIDER\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Analizar la tabla wp_postmeta para metaslider
    console.log('📊 Analizando wp_postmeta para MetaSlider...\n')
    
    const [metaSliderMeta] = await connection.execute(
      `SELECT DISTINCT meta_key, COUNT(*) as count
       FROM wp_postmeta pm
       JOIN wp_posts p ON pm.post_id = p.ID
       WHERE meta_key LIKE '%meta%' OR meta_key LIKE '%slide%' OR meta_key LIKE '%ml%'
       GROUP BY meta_key
       ORDER BY count DESC`
    )

    console.log('Claves meta relacionadas con MetaSlider:')
    metaSliderMeta.forEach(meta => {
      console.log(`  ${meta.meta_key}: ${meta.count} registros`)
    })

    // 2. Buscar un slider específico y analizar su estructura
    console.log('\n\n🎯 Analizando slider específico: "Centro comercial-Campanario"...\n')
    
    const [sliderInfo] = await connection.execute(
      `SELECT * FROM wp_posts WHERE post_title = 'Centro comercial-Campanario' AND post_type = 'ml-slider'`
    )

    if (sliderInfo.length > 0) {
      const sliderId = sliderInfo[0].ID
      console.log(`Slider ID: ${sliderId}`)
      console.log(`Título: ${sliderInfo[0].post_title}`)
      
      // Buscar metadatos del slider
      const [sliderMeta] = await connection.execute(
        `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?`,
        [sliderId]
      )
      
      console.log('\nMetadatos del slider:')
      sliderMeta.forEach(meta => {
        if (meta.meta_value.length < 200) {
          console.log(`  ${meta.meta_key}: ${meta.meta_value}`)
        } else {
          console.log(`  ${meta.meta_key}: [Contenido largo - ${meta.meta_value.length} caracteres]`)
        }
      })

      // Buscar slides asociados
      const [slides] = await connection.execute(
        `SELECT * FROM wp_posts WHERE post_parent = ? AND post_type = 'ml-slide'`,
        [sliderId]
      )

      console.log(`\nSlides encontrados: ${slides.length}`)
      
      for (const slide of slides) {
        console.log(`\n--- Slide ID: ${slide.ID} ---`)
        console.log(`Título: ${slide.post_title}`)
        console.log(`Contenido: ${slide.post_content?.substring(0, 100)}...`)
        
        // Metadatos del slide
        const [slideMeta] = await connection.execute(
          `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?`,
          [slide.ID]
        )
        
        console.log('Metadatos del slide:')
        slideMeta.forEach(meta => {
          if (meta.meta_value.length < 200) {
            console.log(`  ${meta.meta_key}: ${meta.meta_value}`)
          } else {
            console.log(`  ${meta.meta_key}: [Contenido largo]`)
          }
        })
      }
    }

    // 3. Buscar todos los attachments (imágenes)
    console.log('\n\n🖼️ Analizando attachments...\n')
    
    const [attachments] = await connection.execute(
      `SELECT COUNT(*) as total FROM wp_posts WHERE post_type = 'attachment'`
    )
    
    console.log(`Total de attachments: ${attachments[0].total}`)

    // Buscar attachments recientes
    const [recentAttachments] = await connection.execute(
      `SELECT ID, post_title, guid, post_parent
       FROM wp_posts 
       WHERE post_type = 'attachment' 
       AND guid LIKE '%.jpg' OR guid LIKE '%.png' OR guid LIKE '%.jpeg' OR guid LIKE '%.webp'
       ORDER BY ID DESC 
       LIMIT 10`
    )

    console.log('\nÚltimos 10 attachments (imágenes):')
    recentAttachments.forEach(att => {
      const fileName = att.guid.split('/').pop()
      console.log(`  ID: ${att.ID} | ${fileName} | Parent: ${att.post_parent}`)
    })

    // 4. Buscar relaciones específicas de MetaSlider
    console.log('\n\n🔗 Analizando relaciones MetaSlider...\n')
    
    const [mlRelations] = await connection.execute(
      `SELECT 
         pm.meta_key,
         pm.meta_value,
         p.post_title,
         p.post_type
       FROM wp_postmeta pm
       JOIN wp_posts p ON pm.post_id = p.ID
       WHERE pm.meta_key LIKE 'ml-%' OR pm.meta_key LIKE 'metaslider%'
       LIMIT 20`
    )

    console.log('Relaciones MetaSlider encontradas:')
    mlRelations.forEach(rel => {
      console.log(`  ${rel.post_title} (${rel.post_type}): ${rel.meta_key} = ${rel.meta_value}`)
    })

    // 5. Buscar en wp_options para configuración de MetaSlider
    console.log('\n\n⚙️ Configuración MetaSlider en wp_options...\n')
    
    const [mlOptions] = await connection.execute(
      `SELECT option_name, option_value 
       FROM wp_options 
       WHERE option_name LIKE '%metaslider%' OR option_name LIKE '%ml_%'`
    )

    console.log('Opciones de MetaSlider:')
    mlOptions.forEach(opt => {
      if (opt.option_value.length < 200) {
        console.log(`  ${opt.option_name}: ${opt.option_value}`)
      } else {
        console.log(`  ${opt.option_name}: [Configuración compleja]`)
      }
    })

    console.log('\n\n✅ Análisis completado')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

analyzeMetaSliderStructure()