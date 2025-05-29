import mysql from 'mysql2/promise'

async function investigateWordPressImages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔍 INVESTIGANDO ESTRUCTURA DE IMÁGENES EN WORDPRESS\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Verificar estructura de sliders
    console.log('📊 1. ESTRUCTURA DE SLIDERS:\n')
    
    const [sliderInfo] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_type, p.post_status, 
              COUNT(children.ID) as child_count
       FROM wp_posts p
       LEFT JOIN wp_posts children ON p.ID = children.post_parent
       WHERE p.post_type = 'ml-slider'
       AND p.post_status = 'publish'
       GROUP BY p.ID
       ORDER BY child_count DESC
       LIMIT 10`
    )

    sliderInfo.forEach(slider => {
      console.log(`- ${slider.post_title}: ${slider.child_count} elementos hijo`)
    })

    // 2. Verificar un slider específico con contenido
    console.log('\n📊 2. ANÁLISIS DETALLADO DE UN SLIDER:\n')
    
    const sliderId = sliderInfo[0]?.ID
    if (sliderId) {
      console.log(`Analizando slider: ${sliderInfo[0].post_title} (ID: ${sliderId})`)
      
      // Buscar todos los elementos hijo
      const [children] = await connection.execute<any[]>(
        `SELECT ID, post_title, post_type, post_status, post_content, post_excerpt, menu_order
         FROM wp_posts 
         WHERE post_parent = ?
         ORDER BY menu_order ASC`,
        [sliderId]
      )
      
      console.log(`\nElementos hijo encontrados: ${children.length}`)
      children.forEach((child, index) => {
        console.log(`  ${index + 1}. ${child.post_title} (${child.post_type}) - Order: ${child.menu_order}`)
      })

      // Buscar imágenes asociadas a los slides
      if (children.length > 0) {
        const slideId = children[0].ID
        console.log(`\nBuscando imágenes para slide ID: ${slideId}`)
        
        const [slideImages] = await connection.execute<any[]>(
          `SELECT att.ID, att.post_title, att.guid, att.post_mime_type,
                  pm.meta_value as file_path
           FROM wp_posts att
           LEFT JOIN wp_postmeta pm ON att.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
           WHERE att.post_parent = ?
           AND att.post_type = 'attachment'`,
          [slideId]
        )
        
        console.log(`Imágenes encontradas para el slide: ${slideImages.length}`)
        slideImages.forEach(img => {
          console.log(`  - ${img.post_title}`)
          console.log(`    URL: ${img.guid}`)
          console.log(`    File: ${img.file_path}`)
          console.log(`    Type: ${img.post_mime_type}`)
        })
      }
    }

    // 3. Buscar todas las imágenes de attachment
    console.log('\n📊 3. BÚSQUEDA ALTERNATIVA DE IMÁGENES:\n')
    
    const [allImages] = await connection.execute<any[]>(
      `SELECT p.post_parent, 
              COUNT(*) as image_count,
              GROUP_CONCAT(p.post_title SEPARATOR '; ') as image_titles
       FROM wp_posts p
       WHERE p.post_type = 'attachment'
       AND p.post_mime_type LIKE 'image/%'
       AND p.post_parent > 0
       GROUP BY p.post_parent
       HAVING image_count > 0
       ORDER BY image_count DESC
       LIMIT 20`
    )

    console.log('Posts con más imágenes:')
    for (const item of allImages) {
      // Buscar el título del post padre
      const [parentInfo] = await connection.execute<any[]>(
        `SELECT post_title, post_type FROM wp_posts WHERE ID = ?`,
        [item.post_parent]
      )
      
      const parentTitle = parentInfo[0]?.post_title || 'Sin título'
      const parentType = parentInfo[0]?.post_type || 'unknown'
      
      console.log(`- ${parentTitle} (${parentType}): ${item.image_count} imágenes`)
    }

    // 4. Buscar metadatos de sliders
    console.log('\n📊 4. METADATOS DE SLIDERS:\n')
    
    const [sliderMeta] = await connection.execute<any[]>(
      `SELECT p.post_title, pm.meta_key, pm.meta_value
       FROM wp_posts p
       INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
       WHERE p.post_type = 'ml-slider'
       AND pm.meta_key LIKE '%slide%'
       LIMIT 20`
    )

    console.log('Metadatos relacionados con slides:')
    sliderMeta.forEach(meta => {
      console.log(`- ${meta.post_title}: ${meta.meta_key} = ${meta.meta_value?.substring(0, 100)}...`)
    })

    // 5. Buscar en las tablas de MetaSlider específicamente
    console.log('\n📊 5. VERIFICAR SLIDES INDIVIDUALES:\n')
    
    const [mlSlides] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_parent, p.post_content, p.post_excerpt,
              COUNT(att.ID) as attached_images
       FROM wp_posts p
       LEFT JOIN wp_posts att ON p.ID = att.post_parent AND att.post_type = 'attachment'
       WHERE p.post_type = 'ml-slide'
       GROUP BY p.ID
       ORDER BY attached_images DESC
       LIMIT 20`
    )

    console.log('Slides con imágenes:')
    mlSlides.forEach(slide => {
      console.log(`- ${slide.post_title || 'Sin título'} (Parent: ${slide.post_parent}): ${slide.attached_images} imágenes`)
    })

    // 6. Buscar imágenes en posts que contengan nombres de proyectos
    console.log('\n📊 6. IMÁGENES POR NOMBRE DE PROYECTO:\n')
    
    const projectNames = ['campanario', 'unico', 'plaza', 'monserrat', 'cargill', 'bomberos']
    
    for (const projectName of projectNames) {
      const [projectImages] = await connection.execute<any[]>(
        `SELECT p.ID, p.post_title, p.guid, p.post_mime_type
         FROM wp_posts p
         WHERE p.post_type = 'attachment'
         AND p.post_mime_type LIKE 'image/%'
         AND (p.post_title LIKE ? OR p.guid LIKE ?)
         LIMIT 5`,
        [`%${projectName}%`, `%${projectName}%`]
      )
      
      if (projectImages.length > 0) {
        console.log(`\nImágenes que contienen "${projectName}":`)
        projectImages.forEach(img => {
          console.log(`  - ${img.post_title}`)
          console.log(`    ${img.guid}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar investigación
investigateWordPressImages()