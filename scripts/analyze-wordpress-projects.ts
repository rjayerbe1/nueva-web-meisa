import mysql from 'mysql2/promise'

async function analyzeWordPressProjects() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔍 ANÁLISIS DETALLADO DE PROYECTOS EN WORDPRESS\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Verificar tipo de contenido 'project'
    console.log('📂 Verificando proyectos...\n')
    
    const [projects] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_name, post_status, post_type
       FROM wp_posts 
       WHERE post_type = 'project'
       ORDER BY post_date DESC
       LIMIT 10`
    )

    console.log(`Proyectos encontrados (tipo 'project'): ${projects.length}`)
    projects.forEach(project => {
      console.log(`- ${project.post_title} (${project.post_status})`)
    })

    // 2. Buscar categorías de proyectos
    console.log('\n📂 Buscando categorías/taxonomías...\n')
    
    const [taxonomies] = await connection.execute<any[]>(
      `SELECT DISTINCT taxonomy, COUNT(*) as count
       FROM wp_term_taxonomy 
       WHERE taxonomy LIKE '%project%' OR taxonomy LIKE '%category%'
       GROUP BY taxonomy
       ORDER BY count DESC`
    )

    console.log('Taxonomías encontradas:')
    taxonomies.forEach(tax => {
      console.log(`- ${tax.taxonomy}: ${tax.count} términos`)
    })

    // 3. Buscar términos de categorías
    console.log('\n🏷️ Analizando términos/categorías...\n')
    
    const [terms] = await connection.execute<any[]>(
      `SELECT t.name, t.slug, tt.taxonomy, COUNT(tr.object_id) as project_count
       FROM wp_terms t
       INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
       LEFT JOIN wp_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
       LEFT JOIN wp_posts p ON tr.object_id = p.ID AND p.post_type = 'project'
       WHERE tt.taxonomy LIKE '%category%' OR tt.taxonomy LIKE '%project%'
       GROUP BY t.term_id, t.name, t.slug, tt.taxonomy
       HAVING project_count > 0
       ORDER BY project_count DESC`
    )

    console.log('Categorías con proyectos:')
    terms.forEach(term => {
      console.log(`- ${term.name} (${term.taxonomy}): ${term.project_count} proyectos`)
    })

    // 4. Analizar metadatos de proyectos
    console.log('\n🔍 Analizando metadatos de proyectos...\n')
    
    const [metaKeys] = await connection.execute<any[]>(
      `SELECT DISTINCT pm.meta_key, COUNT(*) as usage_count
       FROM wp_postmeta pm
       INNER JOIN wp_posts p ON pm.post_id = p.ID
       WHERE p.post_type = 'project'
       AND pm.meta_key NOT LIKE '\\_%'
       GROUP BY pm.meta_key
       ORDER BY usage_count DESC
       LIMIT 20`
    )

    console.log('Metadatos más comunes en proyectos:')
    metaKeys.forEach(meta => {
      console.log(`- ${meta.meta_key}: usado ${meta.usage_count} veces`)
    })

    // 5. Buscar información específica de un proyecto
    console.log('\n📄 Ejemplo detallado de un proyecto...\n')
    
    if (projects.length > 0) {
      const sampleProject = projects[0]
      console.log(`Analizando: ${sampleProject.post_title}`)
      
      // Contenido del proyecto
      const [projectContent] = await connection.execute<any[]>(
        `SELECT post_content, post_excerpt FROM wp_posts WHERE ID = ?`,
        [sampleProject.ID]
      )
      
      if (projectContent.length > 0) {
        const content = projectContent[0].post_content
        console.log(`\nContenido (primeros 300 chars):`)
        console.log(content?.substring(0, 300) + '...')
        
        // Buscar información específica en el contenido
        const ubicacionMatch = content?.match(/ubicaci[óo]n[:\s]*([^<\n]+)/i)
        const pesoMatch = content?.match(/(\d+(?:\.\d+)?)\s*toneladas?/i)
        const clienteMatch = content?.match(/cliente[:\s]*([^<\n]+)/i)
        
        if (ubicacionMatch) console.log(`\nUbicación encontrada: ${ubicacionMatch[1]}`)
        if (pesoMatch) console.log(`Peso encontrado: ${pesoMatch[1]} toneladas`)
        if (clienteMatch) console.log(`Cliente encontrado: ${clienteMatch[1]}`)
      }
      
      // Metadatos del proyecto
      const [projectMeta] = await connection.execute<any[]>(
        `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?`,
        [sampleProject.ID]
      )
      
      console.log(`\nMetadatos del proyecto:`)
      projectMeta.slice(0, 10).forEach(meta => {
        if (meta.meta_value && meta.meta_value.length < 100) {
          console.log(`- ${meta.meta_key}: ${meta.meta_value}`)
        }
      })
      
      // Imágenes asociadas
      const [projectImages] = await connection.execute<any[]>(
        `SELECT COUNT(*) as image_count FROM wp_posts 
         WHERE post_parent = ? AND post_type = 'attachment' AND post_mime_type LIKE 'image/%'`,
        [sampleProject.ID]
      )
      
      console.log(`\nImágenes asociadas: ${projectImages[0].image_count}`)
    }

    // 6. Buscar proyectos por palabras clave
    console.log('\n🔎 Buscando proyectos por categorías específicas...\n')
    
    const categories = ['centro comercial', 'puente', 'edificio', 'industrial', 'escenario']
    
    for (const category of categories) {
      const [categoryProjects] = await connection.execute<any[]>(
        `SELECT COUNT(*) as count FROM wp_posts 
         WHERE post_type = 'project' 
         AND post_status = 'publish'
         AND (post_title LIKE ? OR post_content LIKE ?)`,
        [`%${category}%`, `%${category}%`]
      )
      
      console.log(`- Proyectos con "${category}": ${categoryProjects[0].count}`)
    }

    // 7. Verificar structure de URLs de proyectos
    console.log('\n🌐 Estructura de URLs de proyectos...\n')
    
    const [urlStructure] = await connection.execute<any[]>(
      `SELECT post_name, post_title FROM wp_posts 
       WHERE post_type = 'project' AND post_status = 'publish'
       ORDER BY post_date DESC
       LIMIT 10`
    )
    
    console.log('URLs de proyectos (slug):')
    urlStructure.forEach(project => {
      console.log(`- /project/${project.post_name}/ → ${project.post_title}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar análisis
analyzeWordPressProjects()