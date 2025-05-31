import fs from 'fs'
import path from 'path'
import { WebFetch } from '@/lib/utils' // Assuming this is available

async function extractRealProjectImages() {
  console.log('🔍 EXTRAYENDO IMÁGENES REALES DE PROYECTOS MEISA...\n')

  // URLs de los proyectos reales a investigar
  const projectUrls = [
    'https://meisa.com.co/project/centro-comercial-campanario/',
    'https://meisa.com.co/project/edificios-cinemateca-distrital/',
    'https://meisa.com.co/project/industria-ampliacion-cargill/',
    'https://meisa.com.co/project/puentes-vehiculares-puente-nolasco/',
    'https://meisa.com.co/project/puentes-peatonales-escalinata-curva-rio-cali/',
    'https://meisa.com.co/project/escenarios-deportivos-complejo-acuatico-popayan/',
    'https://meisa.com.co/project/estructuras-modulares-cocinas-ocultas/',
    'https://meisa.com.co/project/oil-and-gas-tanque-pulmon/'
  ]

  const outputPath = path.join(process.cwd(), 'real-project-images')
  
  // Crear directorio de salida
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  let allImageData: any[] = []
  let markdownReport = '# IMÁGENES EXTRAÍDAS DE PROYECTOS REALES MEISA\n\n'
  markdownReport += `Fecha de extracción: ${new Date().toISOString()}\n\n`

  for (const url of projectUrls) {
    console.log(`\n🔍 Investigando: ${url}`)
    
    try {
      // Extraer información de la página
      const pageAnalysis = await analyzeProjectPage(url)
      
      if (pageAnalysis.success) {
        const projectName = extractProjectName(url)
        const categoryPath = path.join(outputPath, projectName)
        
        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath, { recursive: true })
        }

        console.log(`📁 Categoría: ${projectName}`)
        console.log(`📊 Imágenes encontradas: ${pageAnalysis.images.length}`)
        
        // Agregar al reporte markdown
        markdownReport += `## ${projectName.toUpperCase()}\n`
        markdownReport += `**URL:** ${url}\n`
        markdownReport += `**Imágenes encontradas:** ${pageAnalysis.images.length}\n\n`

        // Procesar cada imagen encontrada
        let imageCount = 0
        for (const imageData of pageAnalysis.images) {
          try {
            const fileName = generateFileName(imageData.url, projectName, imageCount)
            const filePath = path.join(categoryPath, fileName)
            
            // Descargar imagen
            const downloadResult = await downloadImage(imageData.url, filePath)
            
            if (downloadResult.success) {
              console.log(`   ✅ ${fileName} (${downloadResult.size}KB)`)
              
              // Agregar al reporte
              markdownReport += `- ![${imageData.alt || 'Imagen'}](${imageData.url})\n`
              markdownReport += `  - **Archivo:** ${fileName}\n`
              markdownReport += `  - **URL original:** ${imageData.url}\n`
              markdownReport += `  - **Tamaño:** ${downloadResult.size}KB\n`
              markdownReport += `  - **Alt text:** ${imageData.alt || 'Sin descripción'}\n\n`

              allImageData.push({
                project: projectName,
                originalUrl: imageData.url,
                localPath: filePath,
                fileName: fileName,
                size: downloadResult.size,
                alt: imageData.alt
              })

              imageCount++
            } else {
              console.log(`   ❌ Error descargando: ${imageData.url}`)
            }
          } catch (error) {
            console.log(`   ❌ Error procesando imagen: ${error}`)
          }
        }

        console.log(`   📋 Total descargadas: ${imageCount} imágenes\n`)
        markdownReport += `**Total descargadas:** ${imageCount} imágenes\n\n---\n\n`

      } else {
        console.log(`   ❌ Error analizando página: ${pageAnalysis.error}`)
        markdownReport += `## ERROR en ${extractProjectName(url)}\n`
        markdownReport += `**URL:** ${url}\n`
        markdownReport += `**Error:** ${pageAnalysis.error}\n\n---\n\n`
      }

    } catch (error) {
      console.log(`   ❌ Error general: ${error}`)
    }
  }

  // Buscar página de cubiertas y fachadas
  console.log('\n🔍 Buscando página de Cubiertas y Fachadas...')
  const cubiertasResult = await findCubiertasPage()
  
  if (cubiertasResult.found) {
    markdownReport += `## CUBIERTAS Y FACHADAS (ENCONTRADA)\n`
    markdownReport += `**URL:** ${cubiertasResult.url}\n`
    markdownReport += `**Método de búsqueda:** ${cubiertasResult.method}\n\n`
    
    // Procesar página de cubiertas si se encontró
    try {
      const pageAnalysis = await analyzeProjectPage(cubiertasResult.url)
      if (pageAnalysis.success) {
        // Similar processing as above...
        console.log(`📊 Cubiertas - Imágenes encontradas: ${pageAnalysis.images.length}`)
      }
    } catch (error) {
      console.log(`❌ Error procesando cubiertas: ${error}`)
    }
  } else {
    markdownReport += `## CUBIERTAS Y FACHADAS (NO ENCONTRADA)\n`
    markdownReport += `**Métodos intentados:** Búsqueda en sitemap, páginas principales, categorías\n\n`
  }

  // Guardar reporte completo
  const reportPath = path.join(process.cwd(), 'INFORMACION-REAL-MEISA.md')
  const existingContent = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : ''
  
  const updatedContent = existingContent + '\n\n' + markdownReport
  fs.writeFileSync(reportPath, updatedContent)

  // Guardar datos JSON
  fs.writeFileSync(
    path.join(outputPath, 'extracted-images-data.json'), 
    JSON.stringify(allImageData, null, 2)
  )

  console.log('\n🎉 EXTRACCIÓN COMPLETA!')
  console.log(`   📁 Imágenes guardadas en: ${outputPath}`)
  console.log(`   📊 Total proyectos procesados: ${projectUrls.length}`)
  console.log(`   🖼️  Total imágenes descargadas: ${allImageData.length}`)
  console.log(`   📝 Reporte actualizado en: INFORMACION-REAL-MEISA.md`)
}

async function analyzeProjectPage(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const html = await response.text()
    
    // Extraer imágenes usando regex (más robusto que DOM parsing en Node.js)
    const imagePatterns = [
      // Imágenes directas en img tags
      /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      /<img[^>]+alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi,
      // Imágenes en sliders/galerías
      /data-src=["']([^"']+)["']/gi,
      /data-image=["']([^"']+)["']/gi,
      // Imágenes de fondo en CSS
      /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
      // Meta Slider específico
      /class=["'][^"']*metaslider[^"']*["'][^>]*data-src=["']([^"']+)["']/gi
    ]

    const images: Array<{url: string, alt?: string}> = []
    const foundUrls = new Set<string>()

    for (const pattern of imagePatterns) {
      let match
      while ((match = pattern.exec(html)) !== null) {
        let imageUrl = ''
        let altText = ''
        
        if (match[1] && match[1].includes('.')) {
          imageUrl = match[1]
          altText = match[2] || ''
        } else if (match[2] && match[2].includes('.')) {
          imageUrl = match[2]
          altText = match[1] || ''
        }

        if (imageUrl && !foundUrls.has(imageUrl)) {
          // Filtrar solo imágenes relevantes
          if (isRelevantImage(imageUrl)) {
            // Convertir URLs relativas a absolutas
            if (imageUrl.startsWith('/')) {
              imageUrl = 'https://meisa.com.co' + imageUrl
            } else if (!imageUrl.startsWith('http')) {
              imageUrl = 'https://meisa.com.co/' + imageUrl
            }

            images.push({ url: imageUrl, alt: altText })
            foundUrls.add(imageUrl)
          }
        }
      }
    }

    return { 
      success: true, 
      images: images,
      title: extractPageTitle(html),
      description: extractPageDescription(html)
    }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

function isRelevantImage(url: string): boolean {
  const relevantExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const irrelevantPatterns = [
    'logo', 'icon', 'favicon', 'arrow', 'button', 'social',
    'avatar', 'placeholder', 'loading', 'spinner'
  ]
  
  const hasRelevantExtension = relevantExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  )
  
  const isIrrelevant = irrelevantPatterns.some(pattern => 
    url.toLowerCase().includes(pattern)
  )
  
  return hasRelevantExtension && !isIrrelevant
}

function extractPageTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch ? titleMatch[1].trim() : 'Sin título'
}

function extractPageDescription(html: string): string {
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  return descMatch ? descMatch[1].trim() : 'Sin descripción'
}

function extractProjectName(url: string): string {
  const match = url.match(/\/project\/([^\/]+)\/?$/)
  return match ? match[1] : 'unknown-project'
}

function generateFileName(url: string, projectName: string, index: number): string {
  const urlParts = url.split('/')
  const originalName = urlParts[urlParts.length - 1]
  const extension = path.extname(originalName) || '.jpg'
  const baseName = path.basename(originalName, extension)
  
  return `${projectName}-${index + 1}-${baseName}${extension}`
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

async function findCubiertasPage() {
  // Intentar diferentes URLs posibles para cubiertas y fachadas
  const possibleUrls = [
    'https://meisa.com.co/project/cubiertas-y-fachadas/',
    'https://meisa.com.co/project/cubiertas-fachadas/',
    'https://meisa.com.co/project/cubiertas/',
    'https://meisa.com.co/project/fachadas/',
    'https://meisa.com.co/cubiertas-y-fachadas/',
    'https://meisa.com.co/servicios/cubiertas/',
    'https://meisa.com.co/proyectos/cubiertas-y-fachadas/'
  ]

  for (const url of possibleUrls) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return { found: true, url: url, method: 'URL directa' }
      }
    } catch (error) {
      // Continuar con la siguiente URL
    }
  }

  // Si no se encuentra directamente, buscar en el sitemap
  try {
    const sitemapUrl = 'https://meisa.com.co/sitemap.xml'
    const response = await fetch(sitemapUrl)
    if (response.ok) {
      const sitemap = await response.text()
      const cubiertasMatch = sitemap.match(/<loc>([^<]*cubiertas[^<]*)<\/loc>/i)
      if (cubiertasMatch) {
        return { found: true, url: cubiertasMatch[1], method: 'Sitemap XML' }
      }
    }
  } catch (error) {
    console.log('No se pudo acceder al sitemap')
  }

  return { found: false }
}

extractRealProjectImages().catch(console.error)