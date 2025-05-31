import fs from 'fs'
import path from 'path'

async function completeMissingCategories() {
  console.log('🎯 COMPLETANDO CATEGORÍAS FALTANTES: OIL & GAS y ESTRUCTURAS MODULARES...\n')

  // Oil & Gas y Estructuras Modulares adicionales encontradas en sliders
  const missingProjectsData = {
    // OIL & GAS ADICIONALES
    'oil-gas-tanque-almacenamiento-vertical': {
      title: 'Tanque de Almacenamiento Vertical GPL',
      location: 'San Martín, Cesar',
      client: 'Oil Business Services S.A.S.',
      weight: '3,000 galones por unidad',
      description: 'Tanque estacionario vertical GPL',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-almacenamiento-vertical-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-almacenamiento-vertical-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanque-almacenamiento-vertical-3-400x400.webp'
      ]
    },
    'oil-gas-estacion-compresion': {
      title: 'Estación de Compresión GPL',
      location: 'Pitalito, Huila',
      client: 'Surcolombiana de Gas S.A E.S.P.',
      weight: 'No especificado',
      description: 'Estación de compresión y almacenamiento GPL',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-estacion-compresion-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-estacion-compresion-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-estacion-compresion-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-estacion-compresion-4-400x400.webp'
      ]
    },
    'oil-gas-tanques-horizontales-gpl': {
      title: 'Tanques Horizontales GPL',
      location: 'Múltiples ubicaciones',
      client: 'Varios distribuidores GPL',
      weight: '1,000-5,000 galones',
      description: 'Tanques horizontales para almacenamiento GPL',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanques-horizontales-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanques-horizontales-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanques-horizontales-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanques-horizontales-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Oil-gas-tanques-horizontales-5-400x400.webp'
      ]
    },

    // ESTRUCTURAS MODULARES ADICIONALES
    'estructura-modular-oficinas-administrativas': {
      title: 'Módulos de Oficinas Administrativas',
      location: 'Bogotá D.C.',
      client: 'Cocinas Ocultas Colombia Holdings S.A.S.',
      weight: '12 unidades',
      description: 'Estructuras modulares para oficinas administrativas',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-oficina-administrativa-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-oficina-administrativa-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-oficina-administrativa-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-oficina-administrativa-4-400x400.webp'
      ]
    },
    'estructura-modular-restaurantes-moviles': {
      title: 'Restaurantes Móviles Modulares',
      location: 'Múltiples ciudades',
      client: 'Cocinas Ocultas Colombia Holdings S.A.S.',
      weight: '8 unidades',
      description: 'Estructuras modulares para restaurantes móviles',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-restaurante-movil-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-restaurante-movil-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-restaurante-movil-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-restaurante-movil-4-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-restaurante-movil-5-400x400.webp'
      ]
    },
    'estructura-modular-almacenes-temporales': {
      title: 'Almacenes Temporales Modulares',
      location: 'Cali, Valle del Cauca',
      client: 'Varios constructores',
      weight: '6 unidades',
      description: 'Estructuras modulares para almacenamiento temporal',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-almacen-temporal-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-almacen-temporal-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-almacen-temporal-3-400x400.webp'
      ]
    },
    'estructura-modular-casetas-vigilancia': {
      title: 'Casetas de Vigilancia Modulares',
      location: 'Popayán, Cauca',
      client: 'Seguridad Privada Omega',
      weight: '4 unidades',
      description: 'Estructuras modulares para vigilancia y seguridad',
      images: [
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-caseta-vigilancia-1-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-caseta-vigilancia-2-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-caseta-vigilancia-3-400x400.webp',
        'https://meisa.com.co/wp-content/uploads/2021/03/Estructura-modular-caseta-vigilancia-4-400x400.webp'
      ]
    }
  }

  const outputPath = path.join(process.cwd(), 'missing-categories-downloaded')
  
  // Crear directorio de salida
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  let totalDownloaded = 0
  let totalImages = 0
  let markdownReport = '# 🖼️ CATEGORÍAS FALTANTES: OIL & GAS y ESTRUCTURAS MODULARES\n\n'
  markdownReport += `**Fecha de extracción:** ${new Date().toLocaleString('es-CO')}\n\n`
  markdownReport += `**Categorías completadas:** Oil & Gas y Estructuras Modulares adicionales\n\n`

  for (const [projectKey, projectInfo] of Object.entries(missingProjectsData)) {
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
  markdownReport += `# 📊 RESUMEN DE CATEGORÍAS FALTANTES\n\n`
  markdownReport += `- **Total proyectos faltantes procesados:** ${Object.keys(missingProjectsData).length}\n`
  markdownReport += `- **Total imágenes faltantes encontradas:** ${totalImages}\n`
  markdownReport += `- **Total imágenes faltantes descargadas:** ${totalDownloaded}\n`
  markdownReport += `- **Tasa de éxito:** ${((totalDownloaded / totalImages) * 100).toFixed(1)}%\n`
  markdownReport += `- **Ubicación de archivos:** \`${outputPath}\`\n\n`

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'INFORMACION-REAL-MEISA.md')
  const existingContent = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : ''
  
  // Agregar nueva sección
  const updatedContent = existingContent + '\n\n' + markdownReport
  fs.writeFileSync(reportPath, updatedContent)

  console.log('\n🎉 CATEGORÍAS FALTANTES COMPLETADAS!')
  console.log(`   📁 Imágenes faltantes guardadas en: ${outputPath}`)
  console.log(`   📊 Proyectos faltantes procesados: ${Object.keys(missingProjectsData).length}`)
  console.log(`   🖼️  Imágenes faltantes descargadas: ${totalDownloaded}/${totalImages}`)
  console.log(`   💯 Tasa de éxito: ${((totalDownloaded / totalImages) * 100).toFixed(1)}%`)
  console.log(`   📝 Reporte actualizado en: INFORMACION-REAL-MEISA.md`)
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

completeMissingCategories().catch(console.error)