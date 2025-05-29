import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

async function analyzeWordPressContent() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🔍 ANÁLISIS COMPLETO DEL SITIO WORDPRESS DE MEISA\n')
    console.log('=' .repeat(60) + '\n')

    // 1. Páginas principales
    console.log('📄 PÁGINAS PRINCIPALES:\n')
    const [pages] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_name, post_content, post_status, menu_order 
       FROM wp_posts 
       WHERE post_type = 'page' 
       AND post_status = 'publish' 
       ORDER BY menu_order ASC, post_date DESC`
    )

    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.post_title}`)
      console.log(`   - URL: /${page.post_name}/`)
      console.log(`   - ID: ${page.ID}`)
      console.log(`   - Orden: ${page.menu_order}`)
      
      // Extraer texto limpio del contenido
      const cleanContent = page.post_content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[.*?\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200)
      
      if (cleanContent) {
        console.log(`   - Extracto: ${cleanContent}...`)
      }
      console.log('')
    })

    // 2. Posts del blog
    console.log('\n📝 POSTS DEL BLOG:\n')
    const [posts] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_name, post_date, post_content 
       FROM wp_posts 
       WHERE post_type = 'post' 
       AND post_status = 'publish' 
       ORDER BY post_date DESC 
       LIMIT 10`
    )

    if (posts.length > 0) {
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.post_title}`)
        console.log(`   - Fecha: ${post.post_date}`)
        console.log(`   - URL: /${post.post_name}/`)
      })
    } else {
      console.log('   No se encontraron posts publicados')
    }

    // 3. Menús de navegación
    console.log('\n\n🗂️ MENÚS DE NAVEGACIÓN:\n')
    const [menuTerms] = await connection.execute<any[]>(
      `SELECT t.term_id, t.name 
       FROM wp_terms t 
       INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id 
       WHERE tt.taxonomy = 'nav_menu'`
    )

    for (const menu of menuTerms) {
      console.log(`\nMenú: ${menu.name}`)
      
      // Items del menú
      const [menuItems] = await connection.execute<any[]>(
        `SELECT p.ID, p.post_title, p.menu_order, pm.meta_value as url 
         FROM wp_posts p 
         LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_menu_item_url'
         WHERE p.post_type = 'nav_menu_item' 
         AND p.post_status = 'publish'
         ORDER BY p.menu_order ASC`
      )
      
      menuItems.forEach(item => {
        console.log(`   ${item.menu_order}. ${item.post_title} -> ${item.url || 'página interna'}`)
      })
    }

    // 4. Información de la empresa (opciones)
    console.log('\n\n🏢 INFORMACIÓN DE LA EMPRESA:\n')
    const companyOptions = [
      'blogname', 'blogdescription', 'admin_email', 
      'timezone_string', 'date_format'
    ]
    
    for (const optionName of companyOptions) {
      const [option] = await connection.execute<any[]>(
        `SELECT option_value FROM wp_options WHERE option_name = ?`,
        [optionName]
      )
      if (option.length > 0) {
        console.log(`${optionName}: ${option[0].option_value}`)
      }
    }

    // 5. Widgets y sidebars
    console.log('\n\n🔧 WIDGETS ACTIVOS:\n')
    const [widgets] = await connection.execute<any[]>(
      `SELECT option_name, option_value 
       FROM wp_options 
       WHERE option_name LIKE 'widget_%' 
       AND option_value != 'a:1:{s:12:"_multiwidget";i:1;}'`
    )
    
    widgets.forEach(widget => {
      if (widget.option_value.includes('title') || widget.option_value.includes('text')) {
        console.log(`- ${widget.option_name}`)
      }
    })

    // 6. Custom Post Types
    console.log('\n\n📦 TIPOS DE CONTENIDO PERSONALIZADOS:\n')
    const [customTypes] = await connection.execute<any[]>(
      `SELECT DISTINCT post_type, COUNT(*) as count 
       FROM wp_posts 
       WHERE post_status = 'publish' 
       GROUP BY post_type 
       ORDER BY count DESC`
    )
    
    customTypes.forEach(type => {
      console.log(`- ${type.post_type}: ${type.count} items`)
    })

    // 7. Metadatos importantes de páginas
    console.log('\n\n🔍 METADATOS DE PÁGINAS PRINCIPALES:\n')
    const mainPages = ['nuestra-empresa', 'servicios', 'contacto', 'nuestro-equipo']
    
    for (const pageName of mainPages) {
      const [page] = await connection.execute<any[]>(
        `SELECT p.ID, p.post_title 
         FROM wp_posts p 
         WHERE p.post_name = ? 
         AND p.post_type = 'page' 
         AND p.post_status = 'publish'`,
        [pageName]
      )
      
      if (page.length > 0) {
        console.log(`\n${page[0].post_title}:`)
        
        // Buscar metadatos
        const [metadata] = await connection.execute<any[]>(
          `SELECT meta_key, meta_value 
           FROM wp_postmeta 
           WHERE post_id = ? 
           AND meta_key NOT LIKE '\\_%'`,
          [page[0].ID]
        )
        
        metadata.forEach(meta => {
          if (meta.meta_value && meta.meta_value.length < 200) {
            console.log(`   ${meta.meta_key}: ${meta.meta_value}`)
          }
        })
      }
    }

    // 8. Formularios de contacto
    console.log('\n\n📧 FORMULARIOS DE CONTACTO:\n')
    const [forms] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_content 
       FROM wp_posts 
       WHERE post_type = 'wpcf7_contact_form' 
       AND post_status = 'publish'`
    )
    
    forms.forEach(form => {
      console.log(`- ${form.post_title} (ID: ${form.ID})`)
      
      // Extraer campos del formulario
      const fields = form.post_content.match(/\[(?:text|email|tel|textarea)[^\]]+\]/g)
      if (fields) {
        console.log(`  Campos: ${fields.join(', ')}`)
      }
    })

    // 9. Información de contacto en opciones
    console.log('\n\n📞 INFORMACIÓN DE CONTACTO:\n')
    const [contactInfo] = await connection.execute<any[]>(
      `SELECT option_name, option_value 
       FROM wp_options 
       WHERE option_name LIKE '%contact%' 
       OR option_name LIKE '%phone%' 
       OR option_name LIKE '%address%' 
       OR option_name LIKE '%email%'
       LIMIT 20`
    )
    
    contactInfo.forEach(info => {
      if (info.option_value && !info.option_value.includes('a:') && info.option_value.length < 100) {
        console.log(`${info.option_name}: ${info.option_value}`)
      }
    })

    // 10. Textos del tema
    console.log('\n\n🎨 OPCIONES DEL TEMA:\n')
    const [themeOptions] = await connection.execute<any[]>(
      `SELECT option_name, option_value 
       FROM wp_options 
       WHERE option_name LIKE 'theme_mods_%' 
       OR option_name LIKE 'salient%'
       LIMIT 10`
    )
    
    themeOptions.forEach(option => {
      console.log(`- ${option.option_name}`)
    })

    // 11. Sliders y contenido multimedia
    console.log('\n\n🖼️ SLIDERS Y GALERÍAS:\n')
    const [sliders] = await connection.execute<any[]>(
      `SELECT ID, post_title, post_name 
       FROM wp_posts 
       WHERE post_type IN ('nectar_slider', 'home_slider', 'ml-slider') 
       AND post_status = 'publish'`
    )
    
    sliders.forEach(slider => {
      console.log(`- ${slider.post_title} (${slider.post_name})`)
    })

    // 12. Buscar contenido específico de MEISA
    console.log('\n\n🔎 CONTENIDO ESPECÍFICO DE MEISA:\n')
    
    // Buscar misión, visión, valores
    const [misionVision] = await connection.execute<any[]>(
      `SELECT post_title, post_content 
       FROM wp_posts 
       WHERE post_content LIKE '%misión%' 
       OR post_content LIKE '%visión%' 
       OR post_content LIKE '%valores%' 
       OR post_content LIKE '%quienes somos%'
       AND post_status = 'publish'
       LIMIT 5`
    )
    
    misionVision.forEach(content => {
      console.log(`\nEn página: ${content.post_title}`)
      
      // Extraer misión
      const misionMatch = content.post_content.match(/mis[ió]n[^<]*?:?([^<]{50,300})/i)
      if (misionMatch) {
        console.log(`Misión encontrada: ${misionMatch[1].trim()}...`)
      }
      
      // Extraer visión
      const visionMatch = content.post_content.match(/visi[ón]n[^<]*?:?([^<]{50,300})/i)
      if (visionMatch) {
        console.log(`Visión encontrada: ${visionMatch[1].trim()}...`)
      }
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
  }
}

// Ejecutar análisis
analyzeWordPressContent()