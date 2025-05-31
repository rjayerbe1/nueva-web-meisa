import fs from 'fs'
import path from 'path'

async function selectBestImages() {
  console.log('🎯 Selecting best images from organized categories...\n')

  const organizedPath = path.join(process.cwd(), 'ftp-images-organized')
  const destinationPath = path.join(process.cwd(), 'public', 'images', 'projects')
  
  // Ensure destination exists
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true })
  }

  // Key project categories for MEISA
  const importantCategories = [
    'centros-comerciales',
    'edificios', 
    'industria',
    'puentes-peatonales',
    'puentes-vehiculares',
    'escenarios-deportivos',
    'estructuras-modulares',
    'cubiertas-y-fachadas',
    'oil-and-gas'
  ]

  console.log('📊 CATEGORY ANALYSIS:\n')

  for (const category of importantCategories) {
    const categoryPath = path.join(organizedPath, category)
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`❌ Category not found: ${category}`)
      continue
    }

    const files = fs.readdirSync(categoryPath)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    )

    console.log(`📁 ${category.toUpperCase()}:`)
    console.log(`   📸 Total images: ${imageFiles.length}`)

    if (imageFiles.length === 0) {
      console.log(`   ⚠️  No images found\n`)
      continue
    }

    // Sort files by size (largest first) to get best quality
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

    // Show top 5 largest images
    console.log(`   🏆 Top 5 largest images:`)
    filesWithStats.slice(0, 5).forEach((file, index) => {
      console.log(`      ${index + 1}. ${file.name} (${file.sizeKB}KB)`)
    })

    // Recommend selection criteria
    const recommendedCount = Math.min(8, Math.max(3, Math.floor(imageFiles.length * 0.3)))
    console.log(`   💡 Recommended: Select ${recommendedCount} best images`)
    console.log(`   📝 Criteria: High quality, good composition, clear project view\n`)
  }

  // Show summary of other categories
  console.log('📋 OTHER CATEGORIES FOUND:')
  const allCategories = fs.readdirSync(organizedPath).filter(item => {
    const itemPath = path.join(organizedPath, item)
    return fs.statSync(itemPath).isDirectory() && !importantCategories.includes(item)
  })

  allCategories.forEach(category => {
    const categoryPath = path.join(organizedPath, category)
    const files = fs.readdirSync(categoryPath)
    const imageCount = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file)).length
    
    if (imageCount > 0) {
      console.log(`   📁 ${category}: ${imageCount} images`)
    }
  })

  console.log('\n🎯 NEXT STEPS:')
  console.log('1. Review each category folder manually')
  console.log('2. Select the best images based on:')
  console.log('   - Image quality and clarity')
  console.log('   - Best project representation')
  console.log('   - Good composition and lighting')
  console.log('   - Appropriate size (larger files usually better quality)')
  console.log('3. Copy selected images to /public/images/projects/')
  console.log('4. Rename images with descriptive names if needed')
  console.log('5. Update database project records with new image URLs')
  
  console.log('\n💡 TIP: Open each category folder and preview images to make selections')
  console.log(`📂 Organized images location: ${organizedPath}`)
  console.log(`🎯 Destination: ${destinationPath}`)
}

selectBestImages().catch(console.error)