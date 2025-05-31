import { prisma } from './lib/prisma'
import fs from 'fs'
import path from 'path'

async function copyProjectImagesFromFTP() {
  console.log('🔍 Copying project images from FTP backup...\n')

  // Paths
  const ftpUploadsPath = path.join(process.cwd(), '..', 'wordpress-ftp-backup-20250528-085630', 'wp-content', 'uploads')
  const projectsPath = path.join(process.cwd(), 'public', 'images', 'projects')
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads', 'projects')

  // Create directories if they don't exist
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true })
  }
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
  }

  // Get all project images from database
  const images = await prisma.imagenProyecto.findMany({
    include: {
      proyecto: {
        select: {
          titulo: true
        }
      }
    }
  })

  console.log(`📊 Found ${images.length} images in database\n`)

  let copiedFiles = 0
  let notFoundFiles = 0
  let alreadyExistFiles = 0

  for (const image of images) {
    const imageUrl = image.url
    console.log(`🔍 Processing: ${imageUrl}`)

    // Extract filename from URL
    let filename = ''
    if (imageUrl.startsWith('/uploads/projects/')) {
      filename = imageUrl.replace('/uploads/projects/', '')
    } else if (imageUrl.startsWith('uploads/projects/')) {
      filename = imageUrl.replace('uploads/projects/', '')
    } else if (imageUrl.includes('/')) {
      filename = path.basename(imageUrl)
    } else {
      filename = imageUrl
    }

    // Check destination paths
    const destPathProjects = path.join(projectsPath, filename)
    const destPathUploads = path.join(uploadsPath, filename)

    // Check if file already exists in either location
    if (fs.existsSync(destPathProjects) || fs.existsSync(destPathUploads)) {
      console.log(`   ✅ Already exists: ${filename}`)
      alreadyExistFiles++
      continue
    }

    // Search for file in FTP backup
    let found = false
    let sourcePath = ''

    // Search in all year folders
    const yearFolders = ['2020', '2021', '2022', '2023', '2024', '2025']
    
    for (const year of yearFolders) {
      const yearPath = path.join(ftpUploadsPath, year)
      if (!fs.existsSync(yearPath)) continue

      // Search in all month folders
      const monthFolders = fs.readdirSync(yearPath).filter(folder => {
        const folderPath = path.join(yearPath, folder)
        return fs.statSync(folderPath).isDirectory()
      })

      for (const month of monthFolders) {
        const monthPath = path.join(yearPath, month)
        const files = fs.readdirSync(monthPath)
        
        // Look for exact filename or similar variants
        const possibleFiles = files.filter(file => {
          return file === filename || 
                 file.toLowerCase() === filename.toLowerCase() ||
                 file.includes(filename.split('.')[0]) ||
                 filename.includes(file.split('.')[0])
        })

        if (possibleFiles.length > 0) {
          sourcePath = path.join(monthPath, possibleFiles[0])
          found = true
          console.log(`   📁 Found in: ${year}/${month}/${possibleFiles[0]}`)
          break
        }
      }
      if (found) break
    }

    if (found && fs.existsSync(sourcePath)) {
      try {
        // Copy to uploads folder to match database URLs
        fs.copyFileSync(sourcePath, destPathUploads)
        console.log(`   ✅ Copied to: /public/uploads/projects/${filename}`)
        copiedFiles++
      } catch (error) {
        console.log(`   ❌ Error copying: ${error}`)
        notFoundFiles++
      }
    } else {
      console.log(`   ❌ Not found in FTP backup: ${filename}`)
      notFoundFiles++
    }
  }

  // Summary
  console.log('\n📊 COPY SUMMARY:')
  console.log(`   ✅ Files copied: ${copiedFiles}`)
  console.log(`   📁 Files already existed: ${alreadyExistFiles}`)
  console.log(`   ❌ Files not found: ${notFoundFiles}`)
  console.log(`   📊 Total processed: ${images.length}`)

  console.log('\n💡 Next steps:')
  console.log('   - Check the copied files')
  console.log('   - Update database URLs if needed')
  console.log('   - Test image display on website')

  await prisma.$disconnect()
}

copyProjectImagesFromFTP().catch(console.error)