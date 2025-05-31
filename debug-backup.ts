import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

async function debugBackup() {
  // Obtener el backup más reciente
  const backupDir = path.join(process.cwd(), 'backups')
  
  if (!fs.existsSync(backupDir)) {
    console.log('❌ Directorio de backups no existe')
    return
  }

  const files = fs.readdirSync(backupDir)
  const zipBackups = files.filter(file => file.endsWith('.zip'))
  
  if (zipBackups.length === 0) {
    console.log('❌ No se encontraron backups ZIP')
    return
  }

  // Usar el backup más reciente
  const latestBackup = zipBackups.sort().reverse()[0]
  const backupPath = path.join(backupDir, latestBackup)
  
  console.log(`🔍 ANALIZANDO BACKUP: ${latestBackup}`)
  console.log(`📁 Ruta: ${backupPath}`)
  
  try {
    // Extraer y analizar contenido
    const zip = new AdmZip(backupPath)
    const extractDir = path.join(process.cwd(), 'temp-debug-' + Date.now())
    
    zip.extractAllTo(extractDir, true)
    console.log(`\n📂 CONTENIDO EXTRAÍDO:`)
    
    // Listar archivos extraídos
    const extractedFiles = fs.readdirSync(extractDir, { recursive: true })
    extractedFiles.forEach(file => {
      console.log(`   📄 ${file}`)
    })
    
    // Verificar backup-info.json
    const backupInfoPath = path.join(extractDir, 'backup-info.json')
    if (fs.existsSync(backupInfoPath)) {
      const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'))
      console.log(`\n📋 INFORMACIÓN DEL BACKUP:`)
      console.log(`   📅 Fecha: ${backupInfo.backupDate}`)
      console.log(`   📦 Tipo: ${backupInfo.backupType}`)
      console.log(`   📊 Incluye:`)
      console.log(`      💾 Base de datos: ${backupInfo.includes.database}`)
      console.log(`      🖼️  Imágenes: ${backupInfo.includes.projectImages}`)
      console.log(`      🏢 Logos: ${backupInfo.includes.clientLogos}`)
      console.log(`   📈 Estadísticas:`)
      console.log(`      📁 Total archivos: ${backupInfo.stats.totalFiles}`)
      console.log(`      🖼️  Imágenes: ${backupInfo.stats.projectImagesCount}`)
      console.log(`      🏢 Logos: ${backupInfo.stats.clientLogosCount}`)
    }
    
    // Verificar archivos de base de datos
    const dbDir = path.join(extractDir, 'database')
    if (fs.existsSync(dbDir)) {
      console.log(`\n💾 ARCHIVOS DE BASE DE DATOS:`)
      const dbFiles = fs.readdirSync(dbDir)
      dbFiles.forEach(file => {
        const filePath = path.join(dbDir, file)
        const stats = fs.statSync(filePath)
        console.log(`   📄 ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
        
        // Si es JSON, analizar contenido
        if (file.endsWith('.json')) {
          try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
            console.log(`      🔍 Estructura JSON:`)
            
            if (content.data) {
              console.log(`         📊 data object encontrado`)
              if (content.data.users) console.log(`            👥 usuarios: ${content.data.users.length}`)
              if (content.data.proyectos) console.log(`            📂 proyectos: ${content.data.proyectos.length}`)
              if (content.data.clientes) console.log(`            🏢 clientes: ${content.data.clientes.length}`)
              if (content.data.servicios) console.log(`            🔧 servicios: ${content.data.servicios.length}`)
              if (content.data.miembrosEquipo) console.log(`            👤 equipo: ${content.data.miembrosEquipo.length}`)
              if (content.data.formulariosContacto) console.log(`            📧 contactos: ${content.data.formulariosContacto.length}`)
            }
            
            // También verificar estructura directa
            if (content.users) console.log(`         👥 usuarios (directo): ${content.users.length}`)
            if (content.proyectos) console.log(`         📂 proyectos (directo): ${content.proyectos.length}`)
            if (content.projects) console.log(`         📂 projects (directo): ${content.projects.length}`)
            
            // Mostrar ejemplo de proyecto si existe
            const projects = content.data?.proyectos || content.data?.projects || content.proyectos || content.projects || []
            if (projects.length > 0) {
              console.log(`      📋 EJEMPLO DE PROYECTO:`)
              const firstProject = projects[0]
              console.log(`         📝 Título: ${firstProject.titulo}`)
              console.log(`         👤 CreatedBy: ${firstProject.createdBy}`)
              console.log(`         🖼️  Imágenes: ${firstProject.imagenes?.length || 0}`)
              console.log(`         🔗 Cliente: ${firstProject.cliente}`)
              console.log(`         📅 Categoría: ${firstProject.categoria}`)
            }
            
          } catch (jsonError) {
            console.log(`      ❌ Error leyendo JSON: ${jsonError}`)
          }
        }
      })
    }
    
    // Verificar imágenes
    const imagesDir = path.join(extractDir, 'project-images')
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir, { recursive: true })
      console.log(`\n🖼️  IMÁGENES DE PROYECTOS: ${imageFiles.length} archivos`)
    }
    
    // Verificar logos
    const logosDir = path.join(extractDir, 'client-logos')
    if (fs.existsSync(logosDir)) {
      const logoFiles = fs.readdirSync(logosDir, { recursive: true })
      console.log(`🏢 LOGOS DE CLIENTES: ${logoFiles.length} archivos`)
    }
    
    // Limpiar archivos temporales
    fs.rmSync(extractDir, { recursive: true, force: true })
    console.log(`\n🧹 Archivos temporales limpiados`)
    
  } catch (error) {
    console.error(`❌ ERROR: ${error}`)
  }
}

debugBackup().catch(console.error)