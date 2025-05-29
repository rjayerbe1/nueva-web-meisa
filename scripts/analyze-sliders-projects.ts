import mysql from 'mysql2/promise'

async function analyzeSlidersProjects() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🎞️ ANÁLISIS DE PROYECTOS EN SLIDERS\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Buscar todos los sliders
    console.log('📊 Analizando sliders y galerías...\n')
    
    const [sliders] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_name, p.post_type, p.post_status
       FROM wp_posts p
       WHERE p.post_type IN ('ml-slider', 'nectar_slider', 'ml-slide')
       AND p.post_status = 'publish'
       ORDER BY p.post_type, p.post_title`
    )

    console.log(`Total de sliders encontrados: ${sliders.length}`)
    console.log('\nSliders por tipo:')
    
    const slidersByType = {}
    sliders.forEach(slider => {
      if (!slidersByType[slider.post_type]) {
        slidersByType[slider.post_type] = []
      }
      slidersByType[slider.post_type].push(slider)
    })

    Object.keys(slidersByType).forEach(type => {
      console.log(`\n${type}: ${slidersByType[type].length} sliders`)
      slidersByType[type].forEach(slider => {
        console.log(`  - ${slider.post_title}`)
      })
    })

    // 2. Analizar slides individuales
    console.log('\n\n🖼️ Analizando slides individuales...\n')
    
    const [slides] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_name, p.post_content, p.post_parent
       FROM wp_posts p
       WHERE p.post_type = 'ml-slide'
       AND p.post_status = 'publish'
       ORDER BY p.post_parent, p.menu_order`
    )

    console.log(`Total de slides encontrados: ${slides.length}`)

    // Agrupar slides por slider padre
    const slidesByParent = {}
    slides.forEach(slide => {
      if (!slidesByParent[slide.post_parent]) {
        slidesByParent[slide.post_parent] = []
      }
      slidesByParent[slide.post_parent].push(slide)
    })

    // 3. Buscar información de proyectos en slides
    console.log('\n📋 Proyectos identificados en slides:\n')
    
    let projectCount = 0
    const projectCategories = new Set()
    const projects = []

    for (const parentId of Object.keys(slidesByParent)) {
      const parentSlides = slidesByParent[parentId]
      
      // Buscar el nombre del slider padre
      const parentSlider = sliders.find(s => s.ID == parentId)
      const parentName = parentSlider ? parentSlider.post_title : `Slider ${parentId}`
      
      console.log(`\n🎯 ${parentName} (${parentSlides.length} slides):`)
      
      parentSlides.forEach(slide => {
        // Extraer información del proyecto del título y contenido
        const title = slide.post_title
        let categoria = 'Sin categoría'
        let ubicacion = ''
        let descripcion = ''
        
        // Identificar categoría desde el título del slider padre
        if (parentName.toLowerCase().includes('centro')) categoria = 'Centros Comerciales'
        else if (parentName.toLowerCase().includes('puente')) categoria = 'Puentes'
        else if (parentName.toLowerCase().includes('edificio')) categoria = 'Edificios'
        else if (parentName.toLowerCase().includes('industria')) categoria = 'Industrial'
        else if (parentName.toLowerCase().includes('escenario')) categoria = 'Escenarios Deportivos'
        else if (parentName.toLowerCase().includes('cubierta')) categoria = 'Cubiertas y Fachadas'
        else if (parentName.toLowerCase().includes('modular')) categoria = 'Estructuras Modulares'
        else if (parentName.toLowerCase().includes('oil')) categoria = 'Oil and Gas'

        // Extraer información del contenido
        const content = slide.post_content || ''
        
        // Buscar ubicación en el contenido
        const ubicacionMatch = content.match(/([^,\n]+(?:,\s*(?:cauca|valle|cundinamarca|antioquia|santander|bogotá|cali|popayán|medellín)[^,\n]*)?)/i)
        if (ubicacionMatch) {
          ubicacion = ubicacionMatch[1].trim()
        }

        // Buscar descripción
        const descripcionMatch = content.match(/<p[^>]*>([^<]+)<\/p>/)
        if (descripcionMatch) {
          descripcion = descripcionMatch[1].trim()
        }

        projectCategories.add(categoria)
        projects.push({
          titulo: title,
          categoria: categoria,
          ubicacion: ubicacion,
          descripcion: descripcion,
          slider_parent: parentName
        })

        console.log(`    📌 ${title}`)
        if (ubicacion) console.log(`       📍 ${ubicacion}`)
        if (descripcion) console.log(`       📝 ${descripcion.substring(0, 100)}...`)
        
        projectCount++
      })
    }

    // 4. Resumen por categorías
    console.log('\n\n📊 RESUMEN POR CATEGORÍAS:\n')
    
    const categoryCounts = {}
    projects.forEach(project => {
      if (!categoryCounts[project.categoria]) {
        categoryCounts[project.categoria] = 0
      }
      categoryCounts[project.categoria]++
    })

    Object.keys(categoryCounts).sort().forEach(categoria => {
      console.log(`${categoria}: ${categoryCounts[categoria]} proyectos`)
    })

    console.log(`\n✅ Total de proyectos encontrados en sliders: ${projectCount}`)
    console.log(`📂 Categorías identificadas: ${projectCategories.size}`)

    // 5. Verificar imágenes de los slides
    console.log('\n\n🖼️ Verificando imágenes de slides...\n')
    
    const [slideImages] = await connection.execute<any[]>(
      `SELECT 
         p.ID as slide_id,
         p.post_title as slide_title,
         COUNT(att.ID) as image_count,
         GROUP_CONCAT(att.guid SEPARATOR '; ') as image_urls
       FROM wp_posts p
       LEFT JOIN wp_posts att ON p.ID = att.post_parent AND att.post_type = 'attachment'
       WHERE p.post_type = 'ml-slide'
       AND p.post_status = 'publish'
       GROUP BY p.ID
       HAVING image_count > 0
       ORDER BY image_count DESC
       LIMIT 10`
    )

    console.log('Slides con más imágenes:')
    slideImages.forEach(slide => {
      console.log(`- ${slide.slide_title}: ${slide.image_count} imágenes`)
    })

    // 6. Guardar lista de proyectos en archivo
    console.log('\n💾 Guardando lista de proyectos...\n')
    
    const projectsList = projects.map((project, index) => ({
      id: index + 1,
      titulo: project.titulo,
      categoria: project.categoria,
      ubicacion: project.ubicacion || 'Colombia',
      descripcion: project.descripcion || `Proyecto de ${project.categoria.toLowerCase()}`,
      slider_origen: project.slider_parent
    }))

    const fs = require('fs/promises')
    await fs.writeFile(
      './slider-projects-list.json',
      JSON.stringify(projectsList, null, 2),
      'utf8'
    )

    console.log('✅ Lista guardada en: slider-projects-list.json')
    console.log(`📊 ${projectsList.length} proyectos identificados y catalogados`)

    console.log('\n🎯 CATEGORÍAS FINALES IDENTIFICADAS:')
    Array.from(projectCategories).sort().forEach(cat => {
      console.log(`- ${cat}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar análisis
analyzeSlidersProjects()