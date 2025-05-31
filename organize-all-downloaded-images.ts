import fs from 'fs'
import path from 'path'

async function organizeAllDownloadedImages() {
  console.log('🗂️ ORGANIZANDO TODAS LAS IMÁGENES DESCARGADAS...\n')

  const publicImagesPath = path.join(process.cwd(), 'public', 'images', 'projects')
  
  // Crear directorio de destino si no existe
  if (!fs.existsSync(publicImagesPath)) {
    fs.mkdirSync(publicImagesPath, { recursive: true })
  }

  // Rutas de origen de todas las imágenes descargadas
  const sourcePaths = [
    {
      path: path.join(process.cwd(), 'real-project-images-downloaded'),
      type: 'main-projects',
      description: 'Proyectos principales del sitio web'
    },
    {
      path: path.join(process.cwd(), 'all-slider-images-downloaded'),
      type: 'slider-projects', 
      description: 'Proyectos adicionales de sliders'
    },
    {
      path: path.join(process.cwd(), 'ftp-images-organized'),
      type: 'ftp-backup',
      description: 'Imágenes del backup FTP organizadas'
    }
  ]

  let totalImagesCopied = 0
  let markdownReport = '# 🗂️ ORGANIZACIÓN COMPLETA DE IMÁGENES MEISA\n\n'
  markdownReport += `**Fecha de organización:** ${new Date().toLocaleString('es-CO')}\n\n`
  markdownReport += `**Destino:** \`/public/images/projects/\`\n\n`

  // Mapeo de categorías para organización
  const categoryMapping = {
    'centro-comercial': 'centros-comerciales',
    'centro-paseo': 'centros-comerciales',
    'centro-monserrat': 'centros-comerciales', 
    'centro-unico': 'centros-comerciales',
    'centro-armenia': 'centros-comerciales',
    'centro-bochalema': 'centros-comerciales',
    'edificio': 'edificios',
    'clinica': 'edificios',
    'bomberos': 'edificios',
    'estacion-mio': 'edificios',
    'sena': 'edificios',
    'terminal': 'edificios',
    'tequendama': 'edificios',
    'modulos-medicos': 'edificios',
    'industria': 'industria',
    'bodega': 'industria',
    'torre': 'industria',
    'tecnofar': 'industria',
    'tecnoquimicas': 'industria',
    'puente-vehicular': 'puentes-vehiculares',
    'puente-peatonal': 'puentes-peatonales',
    'escalinata': 'puentes-peatonales',
    'tertulia': 'puentes-peatonales',
    'escenario-deportivo': 'escenarios-deportivos',
    'coliseo': 'escenarios-deportivos',
    'cecun': 'escenarios-deportivos',
    'cancha': 'escenarios-deportivos',
    'complejo-acuatico': 'escenarios-deportivos',
    'estructura-modular': 'estructuras-modulares',
    'cocina-oculta': 'estructuras-modulares',
    'modulo-oficina': 'estructuras-modulares',
    'oil-gas': 'oil-and-gas',
    'tanque': 'oil-and-gas'
  }

  for (const source of sourcePaths) {
    if (!fs.existsSync(source.path)) {
      console.log(`⚠️  Ruta no encontrada: ${source.path}`)
      continue
    }

    console.log(`\n📁 Procesando: ${source.description}`)
    console.log(`   📂 Origen: ${source.path}`)

    markdownReport += `## ${source.description.toUpperCase()}\n\n`
    markdownReport += `**Origen:** \`${source.path}\`\n\n`

    const projects = fs.readdirSync(source.path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    let sourceImageCount = 0

    for (const projectDir of projects) {
      const projectPath = path.join(source.path, projectDir)
      
      // Determinar categoría basada en el nombre del proyecto
      let targetCategory = 'otros'
      for (const [key, category] of Object.entries(categoryMapping)) {
        if (projectDir.toLowerCase().includes(key)) {
          targetCategory = category
          break
        }
      }

      // Crear directorio de categoría en destino
      const categoryPath = path.join(publicImagesPath, targetCategory)
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true })
      }

      // Crear subdirectorio del proyecto
      const projectDestPath = path.join(categoryPath, projectDir)
      if (!fs.existsSync(projectDestPath)) {
        fs.mkdirSync(projectDestPath, { recursive: true })
      }

      // Copiar todas las imágenes del proyecto
      const imageFiles = fs.readdirSync(projectPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

      let projectImagesCopied = 0
      for (const imageFile of imageFiles) {
        try {
          const sourcePath = path.join(projectPath, imageFile)
          const destPath = path.join(projectDestPath, imageFile)
          
          // Copiar archivo
          fs.copyFileSync(sourcePath, destPath)
          
          // Verificar tamaño
          const stats = fs.statSync(destPath)
          const sizeKB = Math.round(stats.size / 1024)
          
          console.log(`   ✅ ${targetCategory}/${projectDir}/${imageFile} (${sizeKB}KB)`)
          projectImagesCopied++
          sourceImageCount++
          totalImagesCopied++
        } catch (error) {
          console.log(`   ❌ Error copiando ${imageFile}: ${error}`)
        }
      }

      if (projectImagesCopied > 0) {
        markdownReport += `- **${projectDir}** → \`${targetCategory}/\` (${projectImagesCopied} imágenes)\n`
      }
    }

    console.log(`   📊 Total copiadas de ${source.description}: ${sourceImageCount} imágenes`)
    markdownReport += `\n**Total copiadas:** ${sourceImageCount} imágenes\n\n`
    markdownReport += `---\n\n`
  }

  // Generar estadísticas finales
  markdownReport += `# 📊 ESTADÍSTICAS FINALES\n\n`
  markdownReport += `- **Total imágenes organizadas:** ${totalImagesCopied}\n`
  markdownReport += `- **Ubicación final:** \`/public/images/projects/\`\n\n`

  // Listar estructura final
  markdownReport += `## 📁 ESTRUCTURA FINAL\n\n`
  if (fs.existsSync(publicImagesPath)) {
    const categories = fs.readdirSync(publicImagesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const category of categories) {
      const categoryPath = path.join(publicImagesPath, category)
      const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      let categoryImageCount = 0
      for (const project of projects) {
        const projectPath = path.join(categoryPath, project)
        const images = fs.readdirSync(projectPath)
          .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        categoryImageCount += images.length
      }

      markdownReport += `### ${category}/\n`
      markdownReport += `- **Proyectos:** ${projects.length}\n`
      markdownReport += `- **Imágenes:** ${categoryImageCount}\n`
      for (const project of projects.slice(0, 5)) { // Mostrar solo los primeros 5
        markdownReport += `  - ${project}/\n`
      }
      if (projects.length > 5) {
        markdownReport += `  - ... y ${projects.length - 5} más\n`
      }
      markdownReport += `\n`
    }
  }

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'ORGANIZACION-IMAGENES-COMPLETA.md')
  fs.writeFileSync(reportPath, markdownReport)

  console.log('\n🎉 ORGANIZACIÓN COMPLETA!')
  console.log(`   📁 Destino: ${publicImagesPath}`)
  console.log(`   🖼️  Total imágenes organizadas: ${totalImagesCopied}`)
  console.log(`   📝 Reporte guardado en: ORGANIZACION-IMAGENES-COMPLETA.md`)

  return {
    totalImagesCopied,
    publicImagesPath,
    reportPath
  }
}

organizeAllDownloadedImages().catch(console.error)