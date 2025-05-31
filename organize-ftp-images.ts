import fs from 'fs'
import path from 'path'

async function organizeFTPImages() {
  console.log('🖼️  Organizing high-quality images from FTP backup...\n')

  // Paths
  const ftpUploadsPath = path.join(process.cwd(), '..', 'wordpress-ftp-backup-20250528-085630', 'wp-content', 'uploads')
  const outputPath = path.join(process.cwd(), 'ftp-images-organized')

  // Create output directory
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  console.log(`📁 Scanning FTP uploads: ${ftpUploadsPath}`)
  console.log(`📁 Output directory: ${outputPath}\n`)

  const yearFolders = ['2020', '2021', '2022', '2023', '2024', '2025']
  const minSizeKB = 100 // Minimum 100KB
  const minSizeBytes = minSizeKB * 1024

  let totalImages = 0
  let qualityImages = 0
  const imageGroups: { [key: string]: string[] } = {}

  // Function to get base name for grouping
  function getBaseName(filename: string): string {
    const cleanName = filename
      .toLowerCase()
      .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '') // Remove extension
      .replace(/-\d+x\d+/g, '') // Remove dimensions like -400x400
      .replace(/-\d+$/g, '') // Remove trailing numbers like -1, -2
      .replace(/[-_]+/g, '-') // Normalize separators
      .replace(/^-|-$/g, '') // Remove leading/trailing dashes

    // Group similar names
    if (cleanName.includes('centro') || cleanName.includes('cc-') || cleanName.includes('comercial')) {
      return 'centros-comerciales'
    }
    if (cleanName.includes('edificio')) {
      return 'edificios'
    }
    if (cleanName.includes('industria') || cleanName.includes('bodega') || cleanName.includes('torre')) {
      return 'industria'
    }
    if (cleanName.includes('puente') && cleanName.includes('vehicular')) {
      return 'puentes-vehiculares'
    }
    if (cleanName.includes('puente') && (cleanName.includes('peatonal') || cleanName.includes('escalinata'))) {
      return 'puentes-peatonales'
    }
    if (cleanName.includes('escenario') || cleanName.includes('coliseo') || cleanName.includes('cancha') || cleanName.includes('complejo')) {
      return 'escenarios-deportivos'
    }
    if (cleanName.includes('cubierta') || cleanName.includes('fachada') || cleanName.includes('taquilla')) {
      return 'cubiertas-y-fachadas'
    }
    if (cleanName.includes('estructura') && cleanName.includes('modular')) {
      return 'estructuras-modulares'
    }
    if (cleanName.includes('oil') || cleanName.includes('gas') || cleanName.includes('tanque')) {
      return 'oil-and-gas'
    }
    
    // For other images, use the first part of the name
    const parts = cleanName.split('-')
    return parts[0] || 'otros'
  }

  // Scan all year folders
  for (const year of yearFolders) {
    const yearPath = path.join(ftpUploadsPath, year)
    if (!fs.existsSync(yearPath)) continue

    console.log(`📅 Scanning year: ${year}`)

    // Get all month folders
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

        console.log(`   📂 ${year}/${month}: ${imageFiles.length} images`)

        for (const file of imageFiles) {
          totalImages++
          const filePath = path.join(monthPath, file)
          const stats = fs.statSync(filePath)

          // Check if file meets minimum size requirement
          if (stats.size >= minSizeBytes) {
            qualityImages++
            const baseName = getBaseName(file)
            
            if (!imageGroups[baseName]) {
              imageGroups[baseName] = []
            }
            
            imageGroups[baseName].push(filePath)
            console.log(`     ✅ ${file} (${(stats.size / 1024).toFixed(1)}KB) → ${baseName}`)
          } else {
            console.log(`     ❌ ${file} (${(stats.size / 1024).toFixed(1)}KB) - too small`)
          }
        }
      } catch (error) {
        console.log(`   ❌ Error reading ${year}/${month}: ${error}`)
      }
    }
  }

  console.log(`\n📊 SCANNING SUMMARY:`)
  console.log(`   🖼️  Total images found: ${totalImages}`)
  console.log(`   ✅ Quality images (${minSizeKB}KB+): ${qualityImages}`)
  console.log(`   📁 Groups created: ${Object.keys(imageGroups).length}`)

  console.log(`\n📁 GROUPS FOUND:`)
  for (const [groupName, files] of Object.entries(imageGroups)) {
    console.log(`   ${groupName}: ${files.length} images`)
  }

  console.log(`\n📂 Creating organized folders...`)

  // Create folders and copy images
  let copiedFiles = 0
  for (const [groupName, files] of Object.entries(imageGroups)) {
    const groupPath = path.join(outputPath, groupName)
    
    if (!fs.existsSync(groupPath)) {
      fs.mkdirSync(groupPath, { recursive: true })
    }

    for (const filePath of files) {
      const fileName = path.basename(filePath)
      const destPath = path.join(groupPath, fileName)
      
      try {
        fs.copyFileSync(filePath, destPath)
        copiedFiles++
      } catch (error) {
        console.log(`   ❌ Error copying ${fileName}: ${error}`)
      }
    }
    
    console.log(`   ✅ ${groupName}: ${files.length} images copied`)
  }

  console.log(`\n🎉 ORGANIZATION COMPLETE!`)
  console.log(`   📁 Output folder: ${outputPath}`)
  console.log(`   ✅ Files copied: ${copiedFiles}`)
  console.log(`   📊 Groups created: ${Object.keys(imageGroups).length}`)
  
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Review the organized folders in: ${outputPath}`)
  console.log(`   2. Select the best images from each category`)
  console.log(`   3. Copy selected images to the project uploads folder`)
  console.log(`   4. Update database image URLs if needed`)
}

organizeFTPImages().catch(console.error)