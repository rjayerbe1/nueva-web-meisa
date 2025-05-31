const mysql = require('mysql2/promise')
const fs = require('fs/promises')

async function extractProjectImagesExact() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🖼️ EXTRACCIÓN EXACTA DE IMÁGENES POR PROYECTO\n')
    console.log('=' .repeat(70) + '\n')

    // Definir los proyectos específicos solicitados
    const proyectosRequeridos = {
      'CENTROS COMERCIALES': [
        'Centro Comercial Campanario',
        'Paseo Villa del Río',
        'Centro Comercial Monserrat',
        'Centro Comercial Unico Cali',
        'Centro Comercial Unico Neiva',
        'Centro Comercial Unico Barranquilla',
        'Centro Comercial Armenia Plaza',
        'Centro Comercial Bochalema Plaza'
      ],
      'EDIFICIOS': [
        'Cinemateca Distrital',
        'Clínica Reina Victoria',
        'Omega',
        'Bomberos Popayán',
        'Estación MIO Guadalupe',
        'SENA Santander',
        'Terminal Intermedio MIO',
        'Tequendama Parking Cali',
        'Módulos Médicos'
      ],
      'INDUSTRIA': [
        'Ampliación Cargill',
        'Torre Cogeneración Propal',
        'Bodega Duplex Ingeniería',
        'Bodega Intera',
        'Tecnofar',
        'Bodega Protecnica Etapa II',
        'Tecnoquímicas Jamundí'
      ],
      'PUENTES VEHICULARES': [
        'Puente Nolasco',
        'Puente Carrera 100',
        'Cambrin',
        'Puente Frisoles',
        'Puente La 21',
        'Puente La Paila',
        'Puente Saraconcho',
        'Puente Río Negro'
      ],
      'PUENTES PEATONALES': [
        'Escalinata Curva - Río Cali',
        'Puente Autopista Sur - Carrera 68',
        'Puente de la 63',
        'La Tertulia',
        'Terminal Intermedio'
      ],
      'ESCENARIOS DEPORTIVOS': [
        'Complejo Acuático Popayán',
        'Complejo Acuático Juegos Nacionales 2012',
        'Coliseo Mayor Juegos Nacionales 2012',
        'Coliseo de Artes Marciales Nacionales 2012',
        'Cecun (Universidad del Cauca)',
        'Cancha Javeriana Cali'
      ],
      'ESTRUCTURAS MODULARES': [
        'Cocinas Ocultas',
        'Módulo Oficina'
      ],
      'OIL & GAS': [
        'Tanque Pulmón',
        'Tanques de Almacenamiento GLP'
      ]
    }

    // 1. Primero, obtener todos los sliders de WordPress
    const [sliders] = await connection.execute(
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

    const resultados = {}

    // 2. Para cada categoría y proyecto requerido, buscar el slider correspondiente
    for (const [categoria, proyectos] of Object.entries(proyectosRequeridos)) {
      console.log(`\n🏷️ ${categoria}:\n`)
      resultados[categoria] = {}

      for (const proyecto of proyectos) {
        console.log(`🔍 Buscando: ${proyecto}`)
        
        // Buscar slider que coincida con el nombre del proyecto
        let sliderEncontrado = null
        
        // Crear diferentes variaciones del nombre para buscar
        const variacionesNombre = [
          proyecto,
          proyecto.replace('Centro Comercial ', '').replace('Puente ', '').replace('Complejo Acuático ', '').replace('Coliseo ', ''),
          proyecto.toLowerCase(),
          proyecto.toLowerCase().replace('centro comercial ', '').replace('puente ', ''),
          // Variaciones específicas conocidas
          proyecto.replace('Estación MIO Guadalupe', 'MIO Guadalupe'),
          proyecto.replace('Terminal Intermedio MIO', 'MIO terminal intermedio'),
          proyecto.replace('Puente de la 63', 'La 63'),
          proyecto.replace('Escalinata Curva - Río Cali', 'Escalinata curva rio cali'),
          proyecto.replace('Cecun (Universidad del Cauca)', 'CECUN'),
          proyecto.replace('Cancha Javeriana Cali', 'Cancha Javeriana'),
          proyecto.replace('Tecnoquímicas Jamundí', 'Tecno químicas Jamundí'),
          proyecto.replace('Bodega Protecnica Etapa II', 'Bodega Protecnica II')
        ]

        for (const variacion of variacionesNombre) {
          sliderEncontrado = sliders.find(slider => 
            slider.nombre.toLowerCase().includes(variacion.toLowerCase()) ||
            variacion.toLowerCase().includes(slider.nombre.toLowerCase().replace(/^(centro comercial-?|puentes? (peatonales?|vehiculares?)-?|edificios?-?|industria-?|escenarios deportivos-?|estructuras modulares-?|oil and gas-?)/i, '').trim())
          )
          
          if (sliderEncontrado) break
        }

        if (sliderEncontrado) {
          console.log(`   ✅ Encontrado: "${sliderEncontrado.nombre}" (ID: ${sliderEncontrado.ID})`)
          
          // 3. Buscar todas las imágenes (slides) de este slider
          const [slides] = await connection.execute(
            `SELECT 
               p.ID as slide_id,
               p.post_title as slide_title,
               p.post_name as slide_slug,
               p.menu_order,
               pm.meta_value as attachment_id
             FROM wp_posts p
             LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
             WHERE p.post_type = 'ml-slide'
             AND p.post_parent = ?
             AND p.post_status = 'publish'
             ORDER BY p.menu_order ASC, p.ID ASC`,
            [sliderEncontrado.ID]
          )

          // 4. Para cada slide, obtener información de la imagen
          const imagenesProyecto = []
          
          for (const slide of slides) {
            // Buscar el attachment (imagen) asociado
            let imagenInfo = null
            
            if (slide.attachment_id) {
              const [attachments] = await connection.execute(
                `SELECT 
                   ID,
                   post_title as imagen_titulo,
                   guid as imagen_url,
                   post_name as imagen_slug
                 FROM wp_posts
                 WHERE ID = ? AND post_type = 'attachment'`,
                [slide.attachment_id]
              )
              
              if (attachments.length > 0) {
                imagenInfo = attachments[0]
              }
            }

            // También buscar attachments directamente asociados al slide
            if (!imagenInfo) {
              const [directAttachments] = await connection.execute(
                `SELECT 
                   ID,
                   post_title as imagen_titulo,
                   guid as imagen_url,
                   post_name as imagen_slug
                 FROM wp_posts
                 WHERE post_parent = ? AND post_type = 'attachment'
                 ORDER BY menu_order ASC, ID ASC`,
                [slide.slide_id]
              )
              
              if (directAttachments.length > 0) {
                imagenInfo = directAttachments[0]
              }
            }

            if (imagenInfo) {
              // Extraer nombre del archivo de la URL
              const nombreArchivo = imagenInfo.imagen_url.split('/').pop()
              
              imagenesProyecto.push({
                nombre_archivo: nombreArchivo,
                titulo_imagen: imagenInfo.imagen_titulo,
                url_completa: imagenInfo.imagen_url,
                orden: slide.menu_order || 0,
                slide_id: slide.slide_id
              })
              
              console.log(`      🖼️ ${nombreArchivo}`)
            } else {
              console.log(`      ⚠️ Slide ${slide.slide_id} sin imagen asociada`)
            }
          }

          resultados[categoria][proyecto] = {
            slider_id: sliderEncontrado.ID,
            slider_nombre: sliderEncontrado.nombre,
            total_imagenes: imagenesProyecto.length,
            imagenes: imagenesProyecto
          }

          console.log(`      📊 Total imágenes: ${imagenesProyecto.length}`)
          
        } else {
          console.log(`   ❌ No encontrado`)
          resultados[categoria][proyecto] = {
            slider_id: null,
            slider_nombre: null,
            total_imagenes: 0,
            imagenes: [],
            error: 'Slider no encontrado en WordPress'
          }
        }
      }
    }

    // 5. Generar resumen final
    console.log('\n\n📊 RESUMEN FINAL:\n')
    console.log('=' .repeat(70) + '\n')
    
    let totalProyectosEncontrados = 0
    let totalImagenesEncontradas = 0
    
    for (const [categoria, proyectos] of Object.entries(resultados)) {
      console.log(`🏷️ ${categoria}:`)
      
      for (const [nombreProyecto, datos] of Object.entries(proyectos)) {
        if (datos.slider_id) {
          console.log(`   ✅ ${nombreProyecto}: ${datos.total_imagenes} imágenes`)
          totalProyectosEncontrados++
          totalImagenesEncontradas += datos.total_imagenes
        } else {
          console.log(`   ❌ ${nombreProyecto}: No encontrado`)
        }
      }
      console.log('')
    }
    
    console.log(`📈 Proyectos encontrados: ${totalProyectosEncontrados}`)
    console.log(`🖼️ Total de imágenes: ${totalImagenesEncontradas}`)

    // 6. Guardar resultados
    await fs.writeFile(
      './project-images-exact-names.json',
      JSON.stringify({
        fecha_extraccion: new Date().toISOString(),
        total_proyectos_solicitados: Object.values(proyectosRequeridos).flat().length,
        total_proyectos_encontrados: totalProyectosEncontrados,
        total_imagenes_encontradas: totalImagenesEncontradas,
        resultados: resultados
      }, null, 2),
      'utf8'
    )

    console.log('\n💾 Resultados guardados en: project-images-exact-names.json')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar extracción
extractProjectImagesExact()