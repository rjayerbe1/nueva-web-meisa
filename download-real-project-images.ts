import fs from 'fs'
import path from 'path'

async function downloadRealProjectImages() {
  console.log('📥 DESCARGANDO IMÁGENES REALES DE PROYECTOS MEISA...\n')

  // Datos extraídos de las páginas reales de MEISA
  const projectData = {
    'centro-comercial-campanario': {
      title: 'Centro Comercial Campanario',
      location: 'Popayán, Cauca',
      client: 'ARINSA',
      weight: '2,500 toneladas',
      description: 'Cimentación, estructura metálica y cubiertas ampliación',
      url: 'https://meisa.com.co/project/centro-comercial-campanario/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-1-scaled-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-6-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2023/05/Centro-campanario-7-400x400.webp'
      ]
    },
    'edificios-cinemateca-distrital': {
      title: 'Cinemateca Distrital',
      location: 'Bogotá, Cundinamarca',
      client: 'Consorcio Cine Cultura Bogotá',
      weight: '490 toneladas',
      description: 'Estructura metálica',
      url: 'https://meisa.com.co/project/edificios-cinemateca-distrital/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Edificio-cinemateca-distrital-6-400x400.webp'
      ]
    },
    'industria-ampliacion-cargill': {
      title: 'Ampliación Cargill',
      location: 'Villa Rica, Cauca',
      client: 'Cargill Colombia',
      weight: '175 toneladas',
      description: 'Estructura metálica y cubierta ampliación',
      url: 'https://meisa.com.co/project/industria-ampliacion-cargill/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Industria-ampliacion-cargill-6-400x400.webp'
      ]
    },
    'puentes-vehiculares-puente-nolasco': {
      title: 'Puente Nolasco',
      location: 'Nátaga, Huila',
      client: 'Consorcio del Cauca',
      weight: '395 toneladas',
      description: 'Estructura metálica',
      url: 'https://meisa.com.co/project/puentes-vehiculares-puente-nolasco/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-nolasco-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-nolasco-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-vehicular-nolasco-3-400x400.webp'
      ]
    },
    'puentes-peatonales-escalinata-curva-rio-cali': {
      title: 'Escalinata Curva Río Cali',
      location: 'Cali, Valle del Cauca',
      client: 'UNIÓN TEMPORAL ESPACIO 2015',
      weight: '30 toneladas',
      description: 'Formaleta en estructura metálica',
      url: 'https://meisa.com.co/project/puentes-peatonales-escalinata-curva-rio-cali/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Puente-peatonal-escalinata-curva-rio-cali-6-400x400.webp'
      ]
    },
    'escenarios-deportivos-complejo-acuatico-popayan': {
      title: 'Complejo Acuático Popayán',
      location: 'Popayán, Cauca',
      client: 'Fondo mixto para promoción del deporte / MAJA S.A.S.',
      weight: '135-216 toneladas',
      description: 'Obra civil y estructura metálica',
      url: 'https://meisa.com.co/project/escenarios-deportivos-complejo-acuatico-popayan/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-compejo-acuativo-popayan-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Escenario-deportivo-complejo-acuatico-popayan-2-400x400.webp'
      ]
    },
    'estructuras-modulares-cocinas-ocultas': {
      title: 'Estructuras Modulares - Cocinas Ocultas',
      location: 'Bogotá D.C.',
      client: 'COCINAS OCULTAS COLOMBIA HOLDINGS S.A.S.',
      weight: '24 unidades',
      description: 'Estructuras modulares',
      url: 'https://meisa.com.co/project/estructuras-modulares-cocinas-ocultas/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-cocina-oculta-1-400x400.jpeg',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-cocina-oculta-2-400x400.jpeg',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-cocina-oculta-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-modulo-oficina-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-modulo-oficina-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-modulo-oficina-3-400x400.webp'
      ]
    },
    'oil-and-gas-tanque-pulmon': {
      title: 'Oil and Gas - Tanque Pulmón',
      location: 'San Martín, Cesar / Pitalito, Huila',
      client: 'OIL BUSINESS SERVICES S.A.S. / Surcolombiana de Gas S.A E.S.P.',
      weight: '3,000 galones por unidad',
      description: 'Tanque estacionario vertical y tanques horizontales',
      url: 'https://meisa.com.co/project/oil-and-gas-tanque-pulmon/',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-pulmon-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-5-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-de-almacenamiento-gpl-6-400x400.webp'
      ]
    }
  }

  const outputPath = path.join(process.cwd(), 'real-project-images-downloaded')
  
  // Crear directorio de salida
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  let totalDownloaded = 0
  let totalImages = 0
  let markdownReport = '# 🖼️ IMÁGENES EXTRAÍDAS DE PÁGINAS REALES DE PROYECTOS MEISA\n\n'
  markdownReport += `**Fecha de extracción:** ${new Date().toLocaleString('es-CO')}\n\n`
  markdownReport += `**Fuente:** Sitio web oficial meisa.com.co\n\n`

  for (const [projectKey, projectInfo] of Object.entries(projectData)) {
    console.log(`\n📁 Procesando: ${projectInfo.title}`)
    
    const projectPath = path.join(outputPath, projectKey)
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true })
    }

    // Agregar información al reporte
    markdownReport += `## ${projectInfo.title.toUpperCase()}\n\n`
    markdownReport += `- **Ubicación:** ${projectInfo.location}\n`
    markdownReport += `- **Cliente:** ${projectInfo.client}\n`
    markdownReport += `- **Peso/Capacidad:** ${projectInfo.weight}\n`
    markdownReport += `- **Descripción:** ${projectInfo.description}\n`
    markdownReport += `- **URL del proyecto:** ${projectInfo.url}\n`
    markdownReport += `- **Imágenes encontradas:** ${projectInfo.images.length}\n\n`

    let projectImageCount = 0
    totalImages += projectInfo.images.length

    for (let i = 0; i < projectInfo.images.length; i++) {
      const imageUrl = projectInfo.images[i]
      try {
        const fileName = generateFileName(imageUrl, projectKey, i)
        const filePath = path.join(projectPath, fileName)
        
        const downloadResult = await downloadImage(imageUrl, filePath)
        
        if (downloadResult.success) {
          console.log(`   ✅ ${fileName} (${downloadResult.size}KB)`)
          
          // Agregar al reporte markdown
          markdownReport += `### Imagen ${i + 1}\n`
          markdownReport += `- **Archivo local:** \`${fileName}\`\n`
          markdownReport += `- **URL original:** ${imageUrl}\n`
          markdownReport += `- **Tamaño:** ${downloadResult.size}KB\n`
          markdownReport += `- **Formato:** ${path.extname(fileName).toUpperCase().replace('.', '')}\n\n`

          projectImageCount++
          totalDownloaded++
        } else {
          console.log(`   ❌ Error descargando: ${fileName} - ${downloadResult.error}`)
          markdownReport += `### ❌ Error en Imagen ${i + 1}\n`
          markdownReport += `- **URL:** ${imageUrl}\n`
          markdownReport += `- **Error:** ${downloadResult.error}\n\n`
        }
      } catch (error) {
        console.log(`   ❌ Error procesando imagen ${i + 1}: ${error}`)
      }
    }

    console.log(`   📊 Proyecto ${projectInfo.title}: ${projectImageCount}/${projectInfo.images.length} descargadas`)
    markdownReport += `**Descargadas exitosamente:** ${projectImageCount}/${projectInfo.images.length}\n\n`
    markdownReport += `---\n\n`
  }

  // Resumen final
  markdownReport += `# 📊 RESUMEN DE EXTRACCIÓN\n\n`
  markdownReport += `- **Total proyectos procesados:** ${Object.keys(projectData).length}\n`
  markdownReport += `- **Total imágenes encontradas:** ${totalImages}\n`
  markdownReport += `- **Total imágenes descargadas:** ${totalDownloaded}\n`
  markdownReport += `- **Tasa de éxito:** ${((totalDownloaded / totalImages) * 100).toFixed(1)}%\n`
  markdownReport += `- **Ubicación de archivos:** \`${outputPath}\`\n\n`

  markdownReport += `## 🗂️ ESTRUCTURA DE CARPETAS\n\n`
  Object.entries(projectData).forEach(([key, info]) => {
    markdownReport += `- \`${key}/\` - ${info.title} (${info.images.length} imágenes)\n`
  })

  markdownReport += `\n## 🔗 INFORMACIÓN TÉCNICA\n\n`
  markdownReport += `- **Formato de imágenes:** WebP y JPEG\n`
  markdownReport += `- **Dimensiones estándar:** 400x400 píxeles\n`
  markdownReport += `- **Calidad:** Alta resolución para web\n`
  markdownReport += `- **Nomenclatura:** \`proyecto-numero-nombre-original.extension\`\n\n`

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'INFORMACION-REAL-MEISA.md')
  const existingContent = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : ''
  
  // Evitar duplicación - agregar solo si no existe esta sección
  if (!existingContent.includes('IMÁGENES EXTRAÍDAS DE PÁGINAS REALES DE PROYECTOS MEISA')) {
    const updatedContent = existingContent + '\n\n' + markdownReport
    fs.writeFileSync(reportPath, updatedContent)
    console.log(`\n📝 Reporte agregado a: INFORMACION-REAL-MEISA.md`)
  }

  // Guardar datos JSON
  const jsonData = {
    extractionDate: new Date().toISOString(),
    totalProjects: Object.keys(projectData).length,
    totalImages: totalImages,
    totalDownloaded: totalDownloaded,
    successRate: (totalDownloaded / totalImages) * 100,
    projects: projectData,
    outputPath: outputPath
  }

  fs.writeFileSync(
    path.join(outputPath, 'extraction-report.json'), 
    JSON.stringify(jsonData, null, 2)
  )

  console.log('\n🎉 DESCARGA COMPLETA!')
  console.log(`   📁 Imágenes guardadas en: ${outputPath}`)
  console.log(`   📊 Proyectos procesados: ${Object.keys(projectData).length}`)
  console.log(`   🖼️  Imágenes descargadas: ${totalDownloaded}/${totalImages}`)
  console.log(`   💯 Tasa de éxito: ${((totalDownloaded / totalImages) * 100).toFixed(1)}%`)
}

function generateFileName(url: string, projectKey: string, index: number): string {
  const urlParts = url.split('/')
  const originalName = urlParts[urlParts.length - 1]
  const extension = path.extname(originalName) || '.webp'
  const baseName = path.basename(originalName, extension)
  
  return `${projectKey}-${(index + 1).toString().padStart(2, '0')}-${baseName}${extension}`
}

async function downloadImage(url: string, filePath: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filePath, Buffer.from(buffer))
    
    const stats = fs.statSync(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    
    return { success: true, size: sizeKB }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

downloadRealProjectImages().catch(console.error)