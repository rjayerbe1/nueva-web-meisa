import fs from 'fs'
import path from 'path'

async function comprehensiveFTPAnalysis() {
  console.log('🔍 ANÁLISIS COMPLETO Y EXHAUSTIVO DEL FTP BACKUP...\n')

  const ftpUploadsPath = path.join(process.cwd(), '..', 'wordpress-ftp-backup-20250528-085630', 'wp-content', 'uploads')
  
  if (!fs.existsSync(ftpUploadsPath)) {
    console.log('❌ FTP backup folder not found!')
    return
  }

  console.log(`📁 Analizando: ${ftpUploadsPath}\n`)

  const yearFolders = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
  let totalImages = 0
  let totalHighQuality = 0
  let allImagesData: any[] = []

  // Analizar cada año
  for (const year of yearFolders) {
    const yearPath = path.join(ftpUploadsPath, year)
    if (!fs.existsSync(yearPath)) {
      console.log(`📅 ${year}: No existe`)
      continue
    }

    console.log(`📅 ANALIZANDO AÑO: ${year}`)
    
    const monthFolders = fs.readdirSync(yearPath).filter(folder => {
      const folderPath = path.join(yearPath, folder)
      return fs.statSync(folderPath).isDirectory()
    })

    let yearImages = 0
    let yearHighQuality = 0

    for (const month of monthFolders) {
      const monthPath = path.join(yearPath, month)
      
      try {
        const files = fs.readdirSync(monthPath)
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|webp|gif|bmp|tiff)$/i.test(file)
        )

        let monthImages = 0
        let monthHighQuality = 0

        for (const file of imageFiles) {
          const filePath = path.join(monthPath, file)
          const stats = fs.statSync(filePath)
          const sizeKB = Math.round(stats.size / 1024)
          
          totalImages++
          yearImages++
          monthImages++

          const imageData = {
            fileName: file,
            fullPath: filePath,
            relativePath: `${year}/${month}/${file}`,
            sizeKB: sizeKB,
            sizeMB: (sizeKB / 1024).toFixed(2),
            extension: path.extname(file).toLowerCase(),
            year: year,
            month: month,
            isHighQuality: sizeKB >= 100
          }

          if (sizeKB >= 100) {
            totalHighQuality++
            yearHighQuality++
            monthHighQuality++
          }

          allImagesData.push(imageData)
        }

        if (monthImages > 0) {
          console.log(`   📂 ${month}: ${monthImages} imágenes (${monthHighQuality} alta calidad)`)
        }

      } catch (error) {
        console.log(`   ❌ Error leyendo ${year}/${month}: ${error}`)
      }
    }

    console.log(`   📊 Total ${year}: ${yearImages} imágenes (${yearHighQuality} alta calidad)\n`)
  }

  // Analizar archivos en la raíz de uploads
  console.log('📁 ANALIZANDO ARCHIVOS EN RAÍZ DE UPLOADS:')
  try {
    const rootFiles = fs.readdirSync(ftpUploadsPath)
    const rootImages = rootFiles.filter(file => {
      const filePath = path.join(ftpUploadsPath, file)
      return fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png|webp|gif|bmp|tiff)$/i.test(file)
    })

    for (const file of rootImages) {
      const filePath = path.join(ftpUploadsPath, file)
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024)
      
      totalImages++
      if (sizeKB >= 100) totalHighQuality++

      allImagesData.push({
        fileName: file,
        fullPath: filePath,
        relativePath: file,
        sizeKB: sizeKB,
        sizeMB: (sizeKB / 1024).toFixed(2),
        extension: path.extname(file).toLowerCase(),
        year: 'root',
        month: 'root',
        isHighQuality: sizeKB >= 100
      })

      console.log(`   📸 ${file} (${sizeKB}KB)`)
    }
  } catch (error) {
    console.log(`   ❌ Error leyendo raíz: ${error}`)
  }

  // ANÁLISIS DETALLADO POR CATEGORÍAS
  console.log('\n🎯 ANÁLISIS POR CATEGORÍAS DE PROYECTO:\n')

  const categories = {
    'centros-comerciales': ['centro', 'cc-', 'comercial', 'mall', 'plaza'],
    'edificios': ['edificio', 'building', 'torre', 'tower'],
    'industria': ['industria', 'bodega', 'industrial', 'factory', 'planta'],
    'puentes-peatonales': ['puente.*peatonal', 'peatonal', 'escalinata'],
    'puentes-vehiculares': ['puente.*vehicular', 'vehicular', 'autopista'],
    'escenarios-deportivos': ['escenario', 'coliseo', 'cancha', 'deportivo', 'stadium'],
    'estructuras-modulares': ['modular', 'estructura.*modular', 'módulo'],
    'cubiertas-y-fachadas': ['cubierta', 'fachada', 'techo', 'roof'],
    'oil-and-gas': ['oil', 'gas', 'tanque', 'petroleo', 'gpl'],
    'montaje': ['montaje', 'assembly', 'instalacion'],
    'fabricacion': ['fabricacion', 'manufacturing', 'production'],
    'diseno': ['diseño', 'design', 'plano'],
    'servicios': ['servicio', 'consultoria', 'consulting'],
    'logos-clientes': ['logo', 'cliente', 'brand', 'marca'],
    'maquinaria': ['maquina', 'equipment', 'herramienta', 'tool'],
    'proceso': ['proceso', 'process', 'work', 'trabajo'],
    'certificaciones': ['certificacion', 'certificate', 'iso', 'calidad'],
    'equipo': ['equipo', 'team', 'personal', 'staff'],
    'instalaciones': ['instalacion', 'facility', 'planta', 'sede']
  }

  const categoryResults: { [key: string]: any[] } = {}

  for (const [categoryName, keywords] of Object.entries(categories)) {
    const categoryImages = allImagesData.filter(img => {
      const fileName = img.fileName.toLowerCase()
      return keywords.some(keyword => {
        if (keyword.includes('.*')) {
          const regex = new RegExp(keyword, 'i')
          return regex.test(fileName)
        }
        return fileName.includes(keyword.toLowerCase())
      })
    })

    categoryResults[categoryName] = categoryImages.filter(img => img.isHighQuality)
    
    console.log(`📁 ${categoryName.toUpperCase()}:`)
    console.log(`   📊 Total encontradas: ${categoryImages.length}`)
    console.log(`   ✅ Alta calidad (100KB+): ${categoryResults[categoryName].length}`)
    
    if (categoryResults[categoryName].length > 0) {
      console.log(`   🏆 Mejores imágenes:`)
      categoryResults[categoryName]
        .sort((a, b) => b.sizeKB - a.sizeKB)
        .slice(0, 5)
        .forEach((img, index) => {
          console.log(`      ${index + 1}. ${img.fileName} (${img.sizeKB}KB) - ${img.relativePath}`)
        })
    }
    console.log('')
  }

  // ANÁLISIS DE IMÁGENES NO CATEGORIZADAS
  console.log('🔍 IMÁGENES NO CATEGORIZADAS (POSIBLES PÉRDIDAS):\n')
  
  const categorizedImages = new Set()
  Object.values(categoryResults).forEach(images => {
    images.forEach(img => categorizedImages.add(img.fileName))
  })

  const uncategorizedHighQuality = allImagesData.filter(img => 
    img.isHighQuality && !categorizedImages.has(img.fileName)
  ).sort((a, b) => b.sizeKB - a.sizeKB)

  console.log(`📊 Imágenes de alta calidad NO categorizadas: ${uncategorizedHighQuality.length}`)
  
  if (uncategorizedHighQuality.length > 0) {
    console.log('🚨 IMPORTANTES A REVISAR:')
    uncategorizedHighQuality.slice(0, 20).forEach((img, index) => {
      console.log(`   ${index + 1}. ${img.fileName} (${img.sizeKB}KB) - ${img.relativePath}`)
    })
    
    if (uncategorizedHighQuality.length > 20) {
      console.log(`   ... y ${uncategorizedHighQuality.length - 20} más`)
    }
  }

  // EXTENSIONES DE ARCHIVO
  console.log('\n📋 ANÁLISIS POR EXTENSIONES:')
  const extensionCounts: { [key: string]: { total: number, highQuality: number } } = {}
  
  allImagesData.forEach(img => {
    const ext = img.extension
    if (!extensionCounts[ext]) {
      extensionCounts[ext] = { total: 0, highQuality: 0 }
    }
    extensionCounts[ext].total++
    if (img.isHighQuality) {
      extensionCounts[ext].highQuality++
    }
  })

  Object.entries(extensionCounts)
    .sort(([,a], [,b]) => b.total - a.total)
    .forEach(([ext, counts]) => {
      console.log(`   ${ext}: ${counts.total} total (${counts.highQuality} alta calidad)`)
    })

  // RESUMEN FINAL
  console.log('\n📊 RESUMEN COMPLETO:')
  console.log(`   🖼️  Total imágenes encontradas: ${totalImages}`)
  console.log(`   ✅ Alta calidad (100KB+): ${totalHighQuality}`)
  console.log(`   📁 Categorizadas: ${Array.from(categorizedImages).length}`)
  console.log(`   ❓ No categorizadas: ${uncategorizedHighQuality.length}`)
  console.log(`   📈 Porcentaje categorizado: ${((Array.from(categorizedImages).length / totalHighQuality) * 100).toFixed(1)}%`)

  console.log('\n🎯 RECOMENDACIONES:')
  console.log('1. Revisar imágenes no categorizadas importantes')
  console.log('2. Considerar crear categorías adicionales si es necesario')
  console.log('3. Verificar que todas las imágenes importantes estén incluidas')
  console.log('4. Proceder con la copia organizada de todas las categorías')

  // Guardar reporte detallado
  const reportData = {
    totalImages,
    totalHighQuality,
    categorizedCount: Array.from(categorizedImages).length,
    uncategorizedCount: uncategorizedHighQuality.length,
    categories: categoryResults,
    uncategorizedImages: uncategorizedHighQuality,
    extensionCounts,
    analysisDate: new Date().toISOString()
  }

  fs.writeFileSync('ftp-analysis-complete-report.json', JSON.stringify(reportData, null, 2))
  console.log('\n💾 Reporte completo guardado en: ftp-analysis-complete-report.json')
}

comprehensiveFTPAnalysis().catch(console.error)