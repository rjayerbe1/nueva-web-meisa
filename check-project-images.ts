import { prisma } from './lib/prisma'
import fs from 'fs'
import path from 'path'

async function checkProjectImages() {
  console.log('🔍 Checking project images in database vs file system...\n')

  // Get all projects with their images
  const projects = await prisma.proyecto.findMany({
    include: {
      imagenes: true
    },
    orderBy: {
      titulo: 'asc'
    }
  })

  console.log(`📊 Found ${projects.length} projects in database\n`)

  const publicImagesPath = path.join(process.cwd(), 'public', 'uploads', 'projects')
  
  // Check if projects directory exists
  if (!fs.existsSync(publicImagesPath)) {
    console.log('❌ Projects images directory does not exist: /public/uploads/projects')
    console.log('📁 Creating directory...')
    fs.mkdirSync(publicImagesPath, { recursive: true })
  }

  // Get list of existing files in projects directory
  const existingFiles = fs.existsSync(publicImagesPath) 
    ? fs.readdirSync(publicImagesPath) 
    : []

  console.log(`📁 Found ${existingFiles.length} files in /public/uploads/projects\n`)

  let totalImagesInDb = 0
  let missingFiles = 0
  let foundFiles = 0

  for (const project of projects) {
    console.log(`🏗️  Project: ${project.titulo}`)
    console.log(`   ID: ${project.id}`)
    console.log(`   Images in DB: ${project.imagenes.length}`)
    
    totalImagesInDb += project.imagenes.length

    if (project.imagenes.length > 0) {
      for (const imagen of project.imagenes) {
        const imageUrl = imagen.url
        console.log(`   📸 Image URL: ${imageUrl}`)
        
        // Extract filename from URL
        let filename = ''
        if (imageUrl.startsWith('/images/projects/')) {
          filename = imageUrl.replace('/images/projects/', '')
        } else if (imageUrl.startsWith('images/projects/')) {
          filename = imageUrl.replace('images/projects/', '')
        } else if (imageUrl.includes('/')) {
          filename = path.basename(imageUrl)
        } else {
          filename = imageUrl
        }

        const fullPath = path.join(publicImagesPath, filename)
        
        if (fs.existsSync(fullPath)) {
          console.log(`   ✅ File exists: ${filename}`)
          foundFiles++
        } else {
          console.log(`   ❌ File missing: ${filename}`)
          missingFiles++
        }
      }
    } else {
      console.log(`   ℹ️  No images in database`)
    }
    console.log('') // Empty line for readability
  }

  // Check for orphaned files (files that exist but aren't in database)
  console.log('🔍 Checking for orphaned files...\n')
  const orphanedFiles = []
  
  for (const file of existingFiles) {
    const fileInDb = await prisma.imagenProyecto.findFirst({
      where: {
        OR: [
          { url: `/images/projects/${file}` },
          { url: `images/projects/${file}` },
          { url: file }
        ]
      }
    })
    
    if (!fileInDb) {
      orphanedFiles.push(file)
      console.log(`🗑️  Orphaned file: ${file}`)
    }
  }

  // Summary
  console.log('\n📊 SUMMARY:')
  console.log(`   📦 Total projects: ${projects.length}`)
  console.log(`   🖼️  Total images in database: ${totalImagesInDb}`)
  console.log(`   ✅ Images found on disk: ${foundFiles}`)
  console.log(`   ❌ Images missing from disk: ${missingFiles}`)
  console.log(`   📁 Files in projects folder: ${existingFiles.length}`)
  console.log(`   🗑️  Orphaned files: ${orphanedFiles.length}`)

  if (missingFiles > 0) {
    console.log('\n⚠️  WARNING: Some images are missing from the file system!')
    console.log('   This could cause broken images on the website.')
  }

  if (orphanedFiles.length > 0) {
    console.log('\n💡 INFO: Found orphaned files that could be cleaned up.')
  }

  await prisma.$disconnect()
}

checkProjectImages().catch(console.error)