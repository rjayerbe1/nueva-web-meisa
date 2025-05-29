import mysql from 'mysql2/promise'

async function migrateSliderProjects() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🎞️ MIGRACIÓN DE PROYECTOS DESDE SLIDERS\n')
    console.log('=' .repeat(70) + '\n')

    // Obtener todos los sliders con nombres descriptivos
    const [sliders] = await connection.execute<any[]>(
      `SELECT p.ID, p.post_title, p.post_name, p.post_content
       FROM wp_posts p
       WHERE p.post_type = 'ml-slider'
       AND p.post_status = 'publish'
       ORDER BY p.post_title`
    )

    console.log(`📂 Encontrados ${sliders.length} sliders con proyectos\n`)

    const projectsList = []

    for (const slider of sliders) {
      console.log(`\n🎯 Analizando: ${slider.post_title}`)
      
      // Determinar categoría basada en el nombre del slider
      let categoria = 'Otros'
      const title = slider.post_title.toLowerCase()
      
      if (title.includes('centro comercial')) categoria = 'Centros Comerciales'
      else if (title.includes('puente')) categoria = 'Puentes'
      else if (title.includes('edificio')) categoria = 'Edificios'
      else if (title.includes('industria')) categoria = 'Industrial'
      else if (title.includes('escenario')) categoria = 'Escenarios Deportivos'
      else if (title.includes('cubierta')) categoria = 'Cubiertas y Fachadas'
      else if (title.includes('modular')) categoria = 'Estructuras Modulares'
      else if (title.includes('oil')) categoria = 'Oil and Gas'

      // Extraer información del título del proyecto
      let nombreProyecto = slider.post_title
      let ubicacion = 'Colombia'
      let cliente = 'Cliente confidencial'
      
      // Limpiar nombre del proyecto
      nombreProyecto = nombreProyecto
        .replace(/^(Centro comercial|Centros comerciales|Puentes?|Edificios?|Industria|Escenarios deportivos|Cubiertas y fachadas|Estructuras modulares|Oil and Gas)\s*-?\s*/i, '')
        .trim()

      // Extraer ubicación del nombre si es posible
      const ubicaciones = [
        'bogotá', 'cali', 'medellín', 'barranquilla', 'cartagena', 'bucaramanga',
        'popayán', 'jamundí', 'neiva', 'armenia', 'cucuta', 'ibagué', 'pereira',
        'manizales', 'pasto', 'montería', 'valledupar', 'santander', 'cundinamarca',
        'valle', 'cauca', 'antioquia', 'atlántico', 'bolivar', 'bochalema'
      ]
      
      for (const city of ubicaciones) {
        if (nombreProyecto.toLowerCase().includes(city)) {
          ubicacion = city.charAt(0).toUpperCase() + city.slice(1)
          // Remover la ciudad del nombre del proyecto
          nombreProyecto = nombreProyecto.replace(new RegExp(city, 'gi'), '').trim()
          break
        }
      }

      // Obtener imágenes asociadas al slider
      const [images] = await connection.execute<any[]>(
        `SELECT 
           att.ID,
           att.guid,
           att.post_title as image_title,
           pm.meta_value as file_path
         FROM wp_posts slide
         INNER JOIN wp_posts att ON slide.ID = att.post_parent
         LEFT JOIN wp_postmeta pm ON att.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
         WHERE slide.post_parent = ?
         AND slide.post_type = 'ml-slide'
         AND att.post_type = 'attachment'
         AND att.post_mime_type LIKE 'image/%'
         ORDER BY slide.menu_order, att.menu_order
         LIMIT 10`,
        [slider.ID]
      )

      console.log(`   📸 Encontradas ${images.length} imágenes`)

      // Crear objeto del proyecto
      const proyecto = {
        titulo: nombreProyecto || `Proyecto ${categoria}`,
        categoria: categoria,
        ubicacion: ubicacion,
        cliente: cliente,
        descripcion: `Proyecto de ${categoria.toLowerCase()} desarrollado por MEISA en ${ubicacion}.`,
        imagenes: images.map(img => ({
          url: img.guid || `https://meisa.com.co/wp-content/uploads/${img.file_path}`,
          titulo: img.image_title || 'Imagen del proyecto'
        })),
        slider_id: slider.ID,
        slider_name: slider.post_title
      }

      projectsList.push(proyecto)
      console.log(`   ✅ Proyecto: ${proyecto.titulo}`)
      console.log(`   📍 Ubicación: ${proyecto.ubicacion}`)
      console.log(`   🏗️ Categoría: ${proyecto.categoria}`)
    }

    // Agrupar por categorías para resumen
    const categorias = {}
    projectsList.forEach(proyecto => {
      if (!categorias[proyecto.categoria]) {
        categorias[proyecto.categoria] = []
      }
      categorias[proyecto.categoria].push(proyecto)
    })

    console.log('\n\n📊 RESUMEN POR CATEGORÍAS:\n')
    Object.keys(categorias).sort().forEach(categoria => {
      console.log(`${categoria}: ${categorias[categoria].length} proyectos`)
      categorias[categoria].forEach(proyecto => {
        console.log(`   - ${proyecto.titulo} (${proyecto.ubicacion})`)
      })
      console.log('')
    })

    // Guardar la lista completa de proyectos
    const fs = require('fs/promises')
    await fs.writeFile(
      './complete-projects-list.json',
      JSON.stringify(projectsList, null, 2),
      'utf8'
    )

    console.log('✅ Lista completa guardada en: complete-projects-list.json')
    console.log(`📊 Total de proyectos catalogados: ${projectsList.length}`)

    // Crear archivo con resumen por categorías
    const resumen = {
      total_proyectos: projectsList.length,
      categorias: Object.keys(categorias).sort().map(cat => ({
        nombre: cat,
        cantidad: categorias[cat].length,
        proyectos: categorias[cat].map(p => ({
          titulo: p.titulo,
          ubicacion: p.ubicacion,
          imagenes_count: p.imagenes.length
        }))
      })),
      generado: new Date().toISOString()
    }

    await fs.writeFile(
      './projects-summary.json',
      JSON.stringify(resumen, null, 2),
      'utf8'
    )

    console.log('✅ Resumen guardado en: projects-summary.json')

    console.log('\n🎯 CATEGORÍAS IDENTIFICADAS:')
    Object.keys(categorias).sort().forEach(cat => {
      console.log(`- ${cat}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar migración
migrateSliderProjects()