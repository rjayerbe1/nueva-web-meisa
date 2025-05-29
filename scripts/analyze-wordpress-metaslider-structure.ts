import mysql from 'mysql2/promise'

async function analyzeMetaSliderStructure() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🎞️ ANÁLISIS ESTRUCTURA METASLIDER WORDPRESS\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Analizar ml-slider (los sliders principales que tienen nombres)
    console.log('📊 Analizando sliders principales (ml-slider)...\n')
    
    const [sliders] = await connection.execute<any[]>(
      `SELECT 
         ID,
         post_title as nombre,
         post_name as slug,
         post_status,
         post_date
       FROM wp_posts 
       WHERE post_type = 'ml-slider'
       AND post_status = 'publish'
       ORDER BY post_title`
    )

    console.log(`📂 Total de sliders encontrados: ${sliders.length}\n`)

    // Organizar por categorías según el nombre
    const categorias = {
      'Centro comercial': [],
      'Puentes peatonales': [],
      'Puentes vehiculares': [],
      'Edificios': [],
      'Industria': [],
      'Escenarios deportivos': [],
      'Cubiertas y fachadas': [],
      'Estructuras modulares': [],
      'Oil and Gas': [],
      'Otros': []
    }

    sliders.forEach(slider => {
      const nombre = slider.nombre.toLowerCase()
      
      if (nombre.includes('centro comercial')) {
        categorias['Centro comercial'].push(slider)
      } else if (nombre.includes('puentes peatonales')) {
        categorias['Puentes peatonales'].push(slider)
      } else if (nombre.includes('puentes vehiculares')) {
        categorias['Puentes vehiculares'].push(slider)
      } else if (nombre.includes('edificios')) {
        categorias['Edificios'].push(slider)
      } else if (nombre.includes('industria')) {
        categorias['Industria'].push(slider)
      } else if (nombre.includes('escenarios deportivos')) {
        categorias['Escenarios deportivos'].push(slider)
      } else if (nombre.includes('cubiertas y fachadas')) {
        categorias['Cubiertas y fachadas'].push(slider)
      } else if (nombre.includes('estructuras modulares')) {
        categorias['Estructuras modulares'].push(slider)
      } else if (nombre.includes('oil and gas')) {
        categorias['Oil and Gas'].push(slider)
      } else {
        categorias['Otros'].push(slider)
      }
    })

    // Mostrar categorías y proyectos
    console.log('📋 PROYECTOS POR CATEGORÍA:\n')
    
    let totalProjects = 0
    const projectsList = []

    Object.keys(categorias).forEach(categoria => {
      const proyectos = categorias[categoria]
      if (proyectos.length > 0) {
        console.log(`🏷️  ${categoria} (${proyectos.length} proyectos):`)
        
        proyectos.forEach(proyecto => {
          // Limpiar el nombre del proyecto
          let nombreLimpio = proyecto.nombre
            .replace(/^Centro comercial-?/i, '')
            .replace(/^Puentes (peatonales|vehiculares)-?/i, '')
            .replace(/^Edificios-?/i, '')
            .replace(/^Industria-?/i, '')
            .replace(/^Escenarios deportivos-?/i, '')
            .replace(/^Cubiertas y fachadas-?/i, '')
            .replace(/^Estructuras modulares-?/i, '')
            .replace(/^Oil and Gas-?/i, '')
            .trim()

          // Capitalizar primera letra
          nombreLimpio = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1)

          console.log(`   📌 ${nombreLimpio}`)
          
          projectsList.push({
            id: proyecto.ID,
            titulo: nombreLimpio,
            categoria: categoria,
            wordpress_title: proyecto.nombre,
            slug: proyecto.slug,
            fecha: proyecto.post_date
          })
          
          totalProjects++
        })
        console.log('')
      }
    })

    // 2. Para cada slider, buscar sus slides (imágenes)
    console.log('\n🖼️ Analizando imágenes por proyecto...\n')
    
    for (const proyecto of projectsList) {
      // Buscar slides asociados a este slider
      const [slides] = await connection.execute<any[]>(
        `SELECT COUNT(*) as cantidad_imagenes
         FROM wp_posts 
         WHERE post_type = 'ml-slide'
         AND post_parent = ?
         AND post_status = 'publish'`,
        [proyecto.id]
      )

      const cantidadImagenes = slides[0]?.cantidad_imagenes || 0
      proyecto.cantidad_imagenes = cantidadImagenes
      
      if (cantidadImagenes > 0) {
        console.log(`${proyecto.titulo}: ${cantidadImagenes} imágenes`)
      }
    }

    // 3. Resumen final
    console.log('\n\n📊 RESUMEN FINAL:\n')
    console.log(`✅ Total de proyectos identificados: ${totalProjects}`)
    console.log(`📂 Categorías con proyectos: ${Object.keys(categorias).filter(cat => categorias[cat].length > 0).length}`)
    
    console.log('\n📈 Distribución por categoría:')
    Object.keys(categorias).forEach(categoria => {
      if (categorias[categoria].length > 0) {
        console.log(`   ${categoria}: ${categorias[categoria].length} proyectos`)
      }
    })

    // 4. Buscar imágenes totales
    const [totalImages] = await connection.execute<any[]>(
      `SELECT COUNT(*) as total_imagenes
       FROM wp_posts p
       JOIN wp_posts parent ON p.post_parent = parent.ID
       WHERE p.post_type = 'ml-slide'
       AND p.post_status = 'publish'
       AND parent.post_type = 'ml-slider'
       AND parent.post_status = 'publish'`
    )

    console.log(`\n🖼️  Total de imágenes en sliders: ${totalImages[0]?.total_imagenes || 0}`)

    // 5. Guardar la lista estructurada
    const fs = require('fs/promises')
    await fs.writeFile(
      './wordpress-metaslider-projects.json',
      JSON.stringify({
        fecha_analisis: new Date().toISOString(),
        total_proyectos: totalProjects,
        categorias: categorias,
        proyectos: projectsList
      }, null, 2),
      'utf8'
    )

    console.log('\n💾 Análisis guardado en: wordpress-metaslider-projects.json')
    
    console.log('\n🎯 ESTRUCTURA IDENTIFICADA:')
    console.log('- 6 categorías principales de proyectos')
    console.log('- Cada categoría tiene múltiples proyectos (sliders)')
    console.log('- Cada proyecto tiene múltiples imágenes (slides)')
    console.log('- Estructura: Categoría → Proyecto → Imágenes')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar análisis
analyzeMetaSliderStructure()