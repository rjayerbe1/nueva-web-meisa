import fs from 'fs'
import path from 'path'

async function captureMissingImages() {
  console.log('🚨 CAPTURANDO TODAS LAS IMÁGENES FALTANTES IMPORTANTES...\n')

  const ftpUploadsPath = path.join(process.cwd(), '..', 'wordpress-ftp-backup-20250528-085630', 'wp-content', 'uploads')
  const outputPath = path.join(process.cwd(), 'ftp-images-complete')
  
  // Crear directorio de salida completo
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // Categorías adicionales importantes que nos faltaron
  const additionalCategories = {
    'banners-home': ['banner.*home', 'imagen.*banner', 'imagenes.*banner'],
    'hero-images': ['imagen-\\d+.*banner', 'hero', 'main.*image'],
    'logos-empresa': ['logo.*meisa', 'logo.*empresa', 'brand'],
    'servicios-detalle': ['consultoria', 'fabricacion.*slider', 'obra.*civil', 'diseño.*slider'],
    'maquinaria-equipos': ['1284136006', 'maquina', 'grua', 'crane', 'equipment'],
    'galeria-proyectos': ['galeria', 'gallery', 'imagen-\\d+[^banner]'],
    'procesos-trabajo': ['trabajo', 'proceso', 'ejecucion', 'proyectos.*ejecucion'],
    'certificaciones-calidad': ['certificacion', 'iso', 'calidad', 'quality'],
    'instalaciones-planta': ['planta.*produccion', 'instalacion', 'facility', 'sede'],
    'equipo-personal': ['equipo.*2', 'personal', 'staff', 'nuestro.*equipo'],
    'texturas-materiales': ['textura', 'material', 'acero', 'metal'],
    'presentaciones-corporativas': ['diseño.*pagina', 'presentacion', 'corporate'],
    'shutterstock-premium': ['shutterstock', 'stock', 'premium'],
    'otros-proyectos': ['\\d+-\\d+\\.', '^\\d+\\.', '^\\d+-[^p]'] // Números que no sean "peatonal"
  }

  console.log('📊 CAPTURANDO CATEGORÍAS FALTANTES:\n')

  const yearFolders = ['2020', '2021', '2022', '2023', '2024']
  let totalCaptured = 0

  for (const [categoryName, patterns] of Object.entries(additionalCategories)) {
    console.log(`📁 Procesando: ${categoryName.toUpperCase()}`)
    
    const categoryPath = path.join(outputPath, categoryName)
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true })
    }

    let categoryCount = 0
    const foundImages: any[] = []

    // Buscar en todos los años
    for (const year of yearFolders) {
      const yearPath = path.join(ftpUploadsPath, year)
      if (!fs.existsSync(yearPath)) continue

      const monthFolders = fs.readdirSync(yearPath).filter(folder => {
        const folderPath = path.join(yearPath, folder)
        return fs.statSync(folderPath).isDirectory()
      })

      for (const month of monthFolders) {
        const monthPath = path.join(yearPath, month)
        
        try {
          const files = fs.readdirSync(monthPath)
          const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
          )

          for (const file of imageFiles) {
            const fileName = file.toLowerCase()
            
            // Verificar si coincide con algún patrón
            const matches = patterns.some(pattern => {
              const regex = new RegExp(pattern, 'i')
              return regex.test(fileName)
            })

            if (matches) {
              const filePath = path.join(monthPath, file)
              const stats = fs.statSync(filePath)
              const sizeKB = Math.round(stats.size / 1024)

              // Solo imágenes de alta calidad (100KB+)
              if (sizeKB >= 100) {
                foundImages.push({
                  fileName: file,
                  filePath: filePath,
                  sizeKB: sizeKB,
                  year: year,
                  month: month
                })
              }
            }
          }
        } catch (error) {
          console.log(`   ❌ Error en ${year}/${month}: ${error}`)
        }
      }
    }

    // Ordenar por tamaño (mayor a menor)
    foundImages.sort((a, b) => b.sizeKB - a.sizeKB)

    // Copiar las mejores imágenes (límite por categoría)
    const limits: { [key: string]: number } = {
      'banners-home': 15,
      'hero-images': 10,
      'servicios-detalle': 12,
      'maquinaria-equipos': 8,
      'galeria-proyectos': 20,
      'procesos-trabajo': 10,
      'logos-empresa': 5,
      'equipo-personal': 8,
      'otros-proyectos': 25,
      'shutterstock-premium': 10,
      'texturas-materiales': 6,
      'presentaciones-corporativas': 8,
      'certificaciones-calidad': 6,
      'instalaciones-planta': 6
    }

    const limit = limits[categoryName] || 10
    const selectedImages = foundImages.slice(0, limit)

    console.log(`   📊 Encontradas: ${foundImages.length}, seleccionando: ${selectedImages.length}`)

    for (const img of selectedImages) {
      try {
        const destPath = path.join(categoryPath, img.fileName)
        
        // No sobrescribir si ya existe
        if (fs.existsSync(destPath)) {
          console.log(`   ⚠️  Ya existe: ${img.fileName}`)
          continue
        }

        fs.copyFileSync(img.filePath, destPath)
        console.log(`   ✅ ${img.fileName} (${img.sizeKB}KB) - ${img.year}/${img.month}`)
        categoryCount++
        totalCaptured++
      } catch (error) {
        console.log(`   ❌ Error copiando ${img.fileName}: ${error}`)
      }
    }

    console.log(`   📋 Total categoría: ${categoryCount} imágenes\n`)
  }

  // CATEGORÍA ESPECIAL: Imágenes súper grandes (posiblemente muy importantes)
  console.log('🏆 CAPTURANDO IMÁGENES SÚPER GRANDES (500KB+):')
  const superLargePath = path.join(outputPath, 'super-large-images')
  if (!fs.existsSync(superLargePath)) {
    fs.mkdirSync(superLargePath, { recursive: true })
  }

  const superLargeImages: any[] = []

  for (const year of yearFolders) {
    const yearPath = path.join(ftpUploadsPath, year)
    if (!fs.existsSync(yearPath)) continue

    const monthFolders = fs.readdirSync(yearPath).filter(folder => {
      const folderPath = path.join(yearPath, folder)
      return fs.statSync(folderPath).isDirectory()
    })

    for (const month of monthFolders) {
      const monthPath = path.join(yearPath, month)
      
      try {
        const files = fs.readdirSync(monthPath)
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
        )

        for (const file of imageFiles) {
          const filePath = path.join(monthPath, file)
          const stats = fs.statSync(filePath)
          const sizeKB = Math.round(stats.size / 1024)

          // Solo imágenes súper grandes
          if (sizeKB >= 500) {
            superLargeImages.push({
              fileName: file,
              filePath: filePath,
              sizeKB: sizeKB,
              year: year,
              month: month
            })
          }
        }
      } catch (error) {
        console.log(`   ❌ Error en ${year}/${month}: ${error}`)
      }
    }
  }

  // Ordenar y tomar las top 50 más grandes
  superLargeImages.sort((a, b) => b.sizeKB - a.sizeKB)
  const topSuperLarge = superLargeImages.slice(0, 50)

  let superLargeCount = 0
  for (const img of topSuperLarge) {
    try {
      const destPath = path.join(superLargePath, img.fileName)
      
      if (fs.existsSync(destPath)) continue

      fs.copyFileSync(img.filePath, destPath)
      console.log(`   🏆 ${img.fileName} (${img.sizeKB}KB) - SÚPER GRANDE`)
      superLargeCount++
      totalCaptured++
    } catch (error) {
      console.log(`   ❌ Error: ${error}`)
    }
  }

  console.log(`\n🎉 CAPTURA COMPLETA!`)
  console.log(`   ✅ Total imágenes capturadas: ${totalCaptured}`)
  console.log(`   📁 Imágenes súper grandes: ${superLargeCount}`)
  console.log(`   📂 Ubicación: ${outputPath}`)

  console.log(`\n📋 RESUMEN POR CATEGORÍA:`)
  const categoryFolders = fs.readdirSync(outputPath).filter(folder => {
    const folderPath = path.join(outputPath, folder)
    return fs.statSync(folderPath).isDirectory()
  })

  for (const folder of categoryFolders) {
    const folderPath = path.join(outputPath, folder)
    const files = fs.readdirSync(folderPath)
    const imageCount = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file)).length
    console.log(`   📁 ${folder}: ${imageCount} imágenes`)
  }

  console.log(`\n🔄 PRÓXIMOS PASOS:`)
  console.log(`1. Revisar las nuevas categorías en: ${outputPath}`)
  console.log(`2. Combinar con las imágenes ya organizadas`)
  console.log(`3. Seleccionar las mejores de cada categoría`)
  console.log(`4. Copiar a /public/images/ con estructura final`)
  console.log(`5. Actualizar base de datos con las nuevas imágenes`)
}

captureMissingImages().catch(console.error)