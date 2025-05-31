import fs from 'fs'
import path from 'path'

async function copySelectedImages() {
  console.log('📂 Copying selected best images to project folder...\n')

  const organizedPath = path.join(process.cwd(), 'ftp-images-organized')
  const destinationPath = path.join(process.cwd(), 'public', 'images', 'projects')
  
  // Ensure destination exists
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true })
  }

  // Selection strategy: Take top quality images from each category
  const selections = {
    'centros-comerciales': {
      maxImages: 8,
      priority: ['bochalema', 'armenia', 'monserrat', 'unico', 'campanario']
    },
    'edificios': {
      maxImages: 8,
      priority: ['omega', 'terminal', 'sena', 'javeriana', 'tequendama']
    },
    'industria': {
      maxImages: 8,
      priority: ['piedechinche', 'bodega', 'industrial', 'complejo']
    },
    'puentes-peatonales': {
      maxImages: 6,
      priority: ['tertulia', 'la-63', 'peatonal']
    },
    'puentes-vehiculares': {
      maxImages: 8,
      priority: ['saraconcho', 'frisoles', 'cambrin', 'calle-21']
    },
    'escenarios-deportivos': {
      maxImages: 8,
      priority: ['coliseo', 'javeriana', 'cancha', 'deportivo']
    },
    'estructuras-modulares': {
      maxImages: 4,
      priority: ['modular', 'cocina', 'oficina']
    },
    'cubiertas-y-fachadas': {
      maxImages: 6,
      priority: ['cubiertas', 'equipos', 'fachadas']
    },
    'oil-and-gas': {
      maxImages: 4,
      priority: ['tanque', 'gpl', 'almacenamiento']
    }
  }

  let totalCopied = 0

  for (const [category, config] of Object.entries(selections)) {
    const categoryPath = path.join(organizedPath, category)
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`❌ Category not found: ${category}`)
      continue
    }

    console.log(`\n📁 Processing: ${category.toUpperCase()}`)
    
    const files = fs.readdirSync(categoryPath)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    )

    // Sort by file size (largest first) for quality
    const filesWithStats = imageFiles.map(file => {
      const filePath = path.join(categoryPath, file)
      const stats = fs.statSync(filePath)
      return {
        name: file,
        path: filePath,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      }
    }).sort((a, b) => b.size - a.size)

    // Prioritize files that match project names
    const prioritizedFiles = []
    const otherFiles = []

    filesWithStats.forEach(file => {
      const fileName = file.name.toLowerCase()
      const matchesPriority = config.priority.some(keyword => 
        fileName.includes(keyword.toLowerCase())
      )
      
      if (matchesPriority) {
        prioritizedFiles.push(file)
      } else {
        otherFiles.push(file)
      }
    })

    // Combine prioritized and other files
    const sortedFiles = [...prioritizedFiles, ...otherFiles]
    
    // Select best images up to maxImages limit
    const selectedFiles = sortedFiles.slice(0, config.maxImages)
    
    console.log(`   📊 Found ${imageFiles.length} images, selecting ${selectedFiles.length}`)
    
    let categoryCount = 0
    for (const file of selectedFiles) {
      try {
        // Create descriptive filename
        const originalName = file.name
        const extension = path.extname(originalName)
        let newName = originalName
        
        // Clean up filename for better organization
        if (originalName.includes('scaled')) {
          // Skip scaled versions if we have original
          const baseNameWithoutScaled = originalName.replace('-scaled', '')
          if (selectedFiles.some(f => f.name === baseNameWithoutScaled)) {
            continue
          }
        }
        
        // Prefix with category for organization
        if (!originalName.startsWith(category)) {
          newName = `${category}-${originalName}`
        }
        
        const destPath = path.join(destinationPath, newName)
        
        // Don't overwrite if already exists
        if (fs.existsSync(destPath)) {
          console.log(`   ⚠️  Already exists: ${newName}`)
          continue
        }
        
        fs.copyFileSync(file.path, destPath)
        console.log(`   ✅ Copied: ${newName} (${file.sizeKB}KB)`)
        categoryCount++
        totalCopied++
        
      } catch (error) {
        console.log(`   ❌ Error copying ${file.name}: ${error}`)
      }
    }
    
    console.log(`   📋 Category total: ${categoryCount} images copied`)
  }

  console.log(`\n🎉 COPY COMPLETE!`)
  console.log(`   ✅ Total images copied: ${totalCopied}`)
  console.log(`   📁 Destination: ${destinationPath}`)
  
  console.log(`\n🔄 NEXT STEPS:`)
  console.log(`1. Review copied images in: ${destinationPath}`)
  console.log(`2. Rename images with more descriptive names if needed`)
  console.log(`3. Update database project records with new image paths`)
  console.log(`4. Test image display on the website`)
  console.log(`5. Consider creating thumbnails for better performance`)
}

copySelectedImages().catch(console.error)