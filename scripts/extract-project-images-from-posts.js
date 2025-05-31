const mysql = require('mysql2/promise')
const fs = require('fs/promises')

async function extractProjectImagesFromPosts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🖼️ EXTRACCIÓN DE IMÁGENES DESDE POSTS DE PROYECTOS\n')
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

    // 1. Buscar posts de proyectos primero
    console.log('📊 Buscando posts de proyectos...\n')
    
    const [posts] = await connection.execute(
      `SELECT 
         ID,
         post_title,
         post_name,
         post_type,
         post_status
       FROM wp_posts 
       WHERE post_type = 'post'
       AND post_status = 'publish'
       ORDER BY post_title`
    )

    console.log(`📂 Total de posts encontrados: ${posts.length}\n`)

    const resultados = {}

    // 2. Para cada categoría y proyecto requerido, buscar el post correspondiente
    for (const [categoria, proyectos] of Object.entries(proyectosRequeridos)) {
      console.log(`\n🏷️ ${categoria}:\n`)
      resultados[categoria] = {}

      for (const proyecto of proyectos) {
        console.log(`🔍 Buscando: ${proyecto}`)
        
        // Buscar post que coincida con el nombre del proyecto
        let postEncontrado = null
        
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
          proyecto.replace('Bodega Protecnica Etapa II', 'Bodega Protecnica II'),
          proyecto.replace('Clínica Reina Victoria', 'Clinica reina victoria'),
          proyecto.replace('Ampliación Cargill', 'Ampliacion cargill'),
          proyecto.replace('Bodega Duplex Ingeniería', 'Bodega Duplex Ingenieria'),
          proyecto.replace('Paseo Villa del Río', 'Paseo villa del rio')
        ]

        for (const variacion of variacionesNombre) {
          postEncontrado = posts.find(post => 
            post.post_title.toLowerCase().includes(variacion.toLowerCase()) ||
            variacion.toLowerCase().includes(post.post_title.toLowerCase())
          )
          
          if (postEncontrado) break
        }

        if (postEncontrado) {
          console.log(`   ✅ Encontrado: "${postEncontrado.post_title}" (ID: ${postEncontrado.ID})`)
          
          // 3. Buscar todas las imágenes asociadas a este post
          const [images] = await connection.execute(
            `SELECT 
               ID,
               post_title as imagen_titulo,
               guid as imagen_url,
               post_name as imagen_slug,
               menu_order
             FROM wp_posts
             WHERE post_parent = ? 
             AND post_type = 'attachment'
             AND (guid LIKE '%.jpg' OR guid LIKE '%.jpeg' OR guid LIKE '%.png' OR guid LIKE '%.webp')
             ORDER BY menu_order ASC, ID ASC`,
            [postEncontrado.ID]
          )

          // 4. Extraer nombres de archivos
          const imagenesProyecto = []
          
          for (const imagen of images) {
            const nombreArchivo = imagen.imagen_url.split('/').pop()
            
            imagenesProyecto.push({
              nombre_archivo: nombreArchivo,
              titulo_imagen: imagen.imagen_titulo,
              url_completa: imagen.imagen_url,
              orden: imagen.menu_order || 0,
              attachment_id: imagen.ID
            })
            
            console.log(`      🖼️ ${nombreArchivo}`)
          }

          resultados[categoria][proyecto] = {
            post_id: postEncontrado.ID,
            post_title: postEncontrado.post_title,
            total_imagenes: imagenesProyecto.length,
            imagenes: imagenesProyecto
          }

          console.log(`      📊 Total imágenes: ${imagenesProyecto.length}`)
          
        } else {
          console.log(`   ❌ No encontrado`)
          
          // Buscar por nombre de archivo directamente
          console.log(`   🔍 Buscando por nombre de archivo...`)
          
          // Crear patrones de búsqueda basados en el nombre del proyecto
          const patronesArchivo = [
            proyecto.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/centro comercial /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/puente /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/complejo acuático /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/coliseo /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/bodega /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            proyecto.toLowerCase().replace(/edificio /gi, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          ]

          const imagenesEncontradas = []
          
          for (const patron of patronesArchivo) {
            if (patron.length > 3) {
              const [imagenesPatron] = await connection.execute(
                `SELECT 
                   ID,
                   post_title as imagen_titulo,
                   guid as imagen_url,
                   post_name as imagen_slug,
                   post_parent
                 FROM wp_posts
                 WHERE post_type = 'attachment'
                 AND (guid LIKE '%${patron}%' OR post_name LIKE '%${patron}%')
                 AND (guid LIKE '%.jpg' OR guid LIKE '%.jpeg' OR guid LIKE '%.png' OR guid LIKE '%.webp')
                 ORDER BY ID ASC`
              )
              
              imagenesPatron.forEach(img => {
                const nombreArchivo = img.imagen_url.split('/').pop()
                if (!imagenesEncontradas.find(i => i.nombre_archivo === nombreArchivo)) {
                  imagenesEncontradas.push({
                    nombre_archivo: nombreArchivo,
                    titulo_imagen: img.imagen_titulo,
                    url_completa: img.imagen_url,
                    attachment_id: img.ID,
                    parent_post: img.post_parent
                  })
                  console.log(`      🖼️ ${nombreArchivo} (por patrón: ${patron})`)
                }
              })
            }
          }

          resultados[categoria][proyecto] = {
            post_id: null,
            post_title: null,
            total_imagenes: imagenesEncontradas.length,
            imagenes: imagenesEncontradas,
            busqueda_por_patron: true
          }

          if (imagenesEncontradas.length === 0) {
            resultados[categoria][proyecto].error = 'No encontrado ni por post ni por nombre de archivo'
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
        if (datos.total_imagenes > 0) {
          console.log(`   ✅ ${nombreProyecto}: ${datos.total_imagenes} imágenes`)
          totalProyectosEncontrados++
          totalImagenesEncontradas += datos.total_imagenes
        } else {
          console.log(`   ❌ ${nombreProyecto}: Sin imágenes`)
        }
      }
      console.log('')
    }
    
    console.log(`📈 Proyectos con imágenes: ${totalProyectosEncontrados}`)
    console.log(`🖼️ Total de imágenes: ${totalImagenesEncontradas}`)

    // 6. Guardar resultados
    await fs.writeFile(
      './project-images-from-posts.json',
      JSON.stringify({
        fecha_extraccion: new Date().toISOString(),
        total_proyectos_solicitados: Object.values(proyectosRequeridos).flat().length,
        total_proyectos_con_imagenes: totalProyectosEncontrados,
        total_imagenes_encontradas: totalImagenesEncontradas,
        resultados: resultados
      }, null, 2),
      'utf8'
    )

    console.log('\n💾 Resultados guardados en: project-images-from-posts.json')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar extracción
extractProjectImagesFromPosts()