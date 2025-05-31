import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

interface BackupResult {
  success: boolean
  backupPath?: string
  size?: number
  includes: {
    database: boolean
    projectImages: boolean
    clientLogos: boolean
  }
  stats?: {
    databaseSize: number
    projectImagesCount: number
    clientLogosCount: number
    totalFiles: number
  }
  error?: string
}

async function createEnhancedBackup(): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + 
                   new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '')
  
  const backupName = `meisa-complete-backup-${timestamp}`
  const backupDir = path.join(process.cwd(), 'backups', backupName)
  const zipPath = path.join(process.cwd(), 'backups', `${backupName}.zip`)

  console.log('🚀 INICIANDO BACKUP COMPLETO DE MEISA...\n')
  console.log(`📁 Directorio temporal: ${backupDir}`)
  console.log(`📦 Archivo final: ${zipPath}\n`)

  try {
    // Crear directorios
    await fs.promises.mkdir(path.join(process.cwd(), 'backups'), { recursive: true })
    await fs.promises.mkdir(backupDir, { recursive: true })
    await fs.promises.mkdir(path.join(backupDir, 'database'), { recursive: true })
    await fs.promises.mkdir(path.join(backupDir, 'project-images'), { recursive: true })
    await fs.promises.mkdir(path.join(backupDir, 'client-logos'), { recursive: true })

    let stats = {
      databaseSize: 0,
      projectImagesCount: 0,
      clientLogosCount: 0,
      totalFiles: 0
    }

    // 1. BACKUP DE BASE DE DATOS
    console.log('💾 1. CREANDO BACKUP DE BASE DE DATOS...')
    const dbBackupPath = path.join(backupDir, 'database', 'meisa-database.sql')
    
    try {
      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) {
        throw new Error('DATABASE_URL no está configurada')
      }

      // Extraer datos de conexión de la URL
      const url = new URL(databaseUrl)
      const host = url.hostname
      const port = url.port || '5432'
      const username = url.username
      const password = url.password
      const database = url.pathname.slice(1)

      // Comando pg_dump
      const pgDumpCommand = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --clean --create --if-exists`
      
      console.log('   📋 Ejecutando pg_dump...')
      const { stdout, stderr } = await execAsync(pgDumpCommand)
      
      await fs.promises.writeFile(dbBackupPath, stdout)
      const dbStats = await fs.promises.stat(dbBackupPath)
      stats.databaseSize = dbStats.size
      
      console.log(`   ✅ Base de datos exportada: ${(stats.databaseSize / 1024 / 1024).toFixed(2)} MB`)
    } catch (error) {
      console.log(`   ⚠️  Advertencia pg_dump: ${error}`)
      
      // Fallback: backup usando Prisma (estructura sin datos completos)
      console.log('   🔄 Intentando backup alternativo...')
      const fallbackPath = path.join(backupDir, 'database', 'prisma-schema-backup.prisma')
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
      
      if (fs.existsSync(schemaPath)) {
        await fs.promises.copyFile(schemaPath, fallbackPath)
        console.log('   📋 Schema de Prisma respaldado')
      }

      // Exportar datos críticos como JSON
      const criticalDataPath = path.join(backupDir, 'database', 'critical-data.json')
      const projects = await prisma.proyecto.findMany({
        include: {
          imagenes: true,
          documentos: true,
          progreso: true,
          timeline: true,
          comentarios: true,
          clienteRel: true
        }
      })
      
      const services = await prisma.servicio.findMany()
      const clients = await prisma.cliente.findMany()
      const team = await prisma.miembroEquipo.findMany()
      
      const criticalData = {
        exportDate: new Date().toISOString(),
        projects,
        services,
        clients,
        team
      }
      
      await fs.promises.writeFile(criticalDataPath, JSON.stringify(criticalData, null, 2))
      const criticalStats = await fs.promises.stat(criticalDataPath)
      stats.databaseSize = criticalStats.size
      
      console.log(`   ✅ Datos críticos exportados: ${(stats.databaseSize / 1024 / 1024).toFixed(2)} MB`)
    }

    // 2. BACKUP DE IMÁGENES DE PROYECTOS
    console.log('\n🖼️  2. COPIANDO IMÁGENES DE PROYECTOS...')
    const projectImagesSource = path.join(process.cwd(), 'public', 'images', 'projects')
    const projectImagesBackup = path.join(backupDir, 'project-images')

    if (fs.existsSync(projectImagesSource)) {
      await copyDirectoryRecursive(projectImagesSource, projectImagesBackup)
      stats.projectImagesCount = await countFilesRecursive(projectImagesBackup)
      console.log(`   ✅ ${stats.projectImagesCount} imágenes de proyectos copiadas`)
    } else {
      console.log('   ⚠️  Directorio de imágenes de proyectos no encontrado')
    }

    // 3. BACKUP DE LOGOS DE CLIENTES
    console.log('\n🏢 3. COPIANDO LOGOS DE CLIENTES...')
    const clientLogosSource = path.join(process.cwd(), 'public', 'images', 'clients')
    const clientLogosBackup = path.join(backupDir, 'client-logos')

    if (fs.existsSync(clientLogosSource)) {
      await copyDirectoryRecursive(clientLogosSource, clientLogosBackup)
      stats.clientLogosCount = await countFilesRecursive(clientLogosBackup)
      console.log(`   ✅ ${stats.clientLogosCount} logos de clientes copiados`)
    } else {
      console.log('   ⚠️  Directorio de logos de clientes no encontrado')
    }

    // 4. CREAR ARCHIVO DE INFORMACIÓN DEL BACKUP
    console.log('\n📋 4. GENERANDO INFORMACIÓN DEL BACKUP...')
    const backupInfo = {
      backupDate: new Date().toISOString(),
      backupType: 'complete',
      version: '1.0',
      includes: {
        database: true,
        projectImages: fs.existsSync(projectImagesSource),
        clientLogos: fs.existsSync(clientLogosSource)
      },
      stats: {
        databaseSize: stats.databaseSize,
        projectImagesCount: stats.projectImagesCount,
        clientLogosCount: stats.clientLogosCount,
        totalFiles: stats.projectImagesCount + stats.clientLogosCount + 1
      },
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      },
      instructions: {
        database: 'Restaurar con: psql -U username -d database < database/meisa-database.sql',
        projectImages: 'Copiar project-images/* a public/images/projects/',
        clientLogos: 'Copiar client-logos/* a public/images/clients/',
        note: 'Ejecutar npm run db:push después de restaurar la base de datos'
      }
    }

    await fs.promises.writeFile(
      path.join(backupDir, 'backup-info.json'), 
      JSON.stringify(backupInfo, null, 2)
    )

    // 5. CREAR ARCHIVO ZIP
    console.log('\n📦 5. CREANDO ARCHIVO ZIP COMPRIMIDO...')
    await createZipArchive(backupDir, zipPath)

    // Limpiar directorio temporal
    await fs.promises.rm(backupDir, { recursive: true, force: true })

    // Obtener tamaño final
    const finalStats = await fs.promises.stat(zipPath)
    const finalSizeMB = (finalStats.size / 1024 / 1024).toFixed(2)

    console.log(`\n🎉 BACKUP COMPLETO EXITOSO!`)
    console.log(`   📦 Archivo: ${path.basename(zipPath)}`)
    console.log(`   💾 Tamaño: ${finalSizeMB} MB`)
    console.log(`   📊 Contenido:`)
    console.log(`      💾 Base de datos: ${(stats.databaseSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`      🖼️  Imágenes proyectos: ${stats.projectImagesCount} archivos`)
    console.log(`      🏢 Logos clientes: ${stats.clientLogosCount} archivos`)
    console.log(`      📁 Total archivos: ${stats.projectImagesCount + stats.clientLogosCount + 2}`)

    await prisma.$disconnect()

    return {
      success: true,
      backupPath: zipPath,
      size: finalStats.size,
      includes: {
        database: true,
        projectImages: fs.existsSync(projectImagesSource),
        clientLogos: fs.existsSync(clientLogosSource)
      },
      stats: {
        databaseSize: stats.databaseSize,
        projectImagesCount: stats.projectImagesCount,
        clientLogosCount: stats.clientLogosCount,
        totalFiles: stats.projectImagesCount + stats.clientLogosCount + 2
      }
    }

  } catch (error) {
    console.error('❌ ERROR EN BACKUP:', error)
    
    // Limpiar en caso de error
    try {
      if (fs.existsSync(backupDir)) {
        await fs.promises.rm(backupDir, { recursive: true, force: true })
      }
      if (fs.existsSync(zipPath)) {
        await fs.promises.unlink(zipPath)
      }
    } catch (cleanupError) {
      console.error('Error en limpieza:', cleanupError)
    }

    await prisma.$disconnect()

    return {
      success: false,
      includes: {
        database: false,
        projectImages: false,
        clientLogos: false
      },
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

async function copyDirectoryRecursive(source: string, destination: string): Promise<void> {
  await fs.promises.mkdir(destination, { recursive: true })
  
  const entries = await fs.promises.readdir(source, { withFileTypes: true })
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const destPath = path.join(destination, entry.name)
    
    if (entry.isDirectory()) {
      await copyDirectoryRecursive(sourcePath, destPath)
    } else {
      await fs.promises.copyFile(sourcePath, destPath)
    }
  }
}

async function countFilesRecursive(directory: string): Promise<number> {
  let count = 0
  
  if (!fs.existsSync(directory)) {
    return 0
  }
  
  const entries = await fs.promises.readdir(directory, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    
    if (entry.isDirectory()) {
      count += await countFilesRecursive(fullPath)
    } else {
      count++
    }
  }
  
  return count
}

async function createZipArchive(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compresión
    })

    output.on('close', () => {
      console.log(`   ✅ Archivo ZIP creado: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`)
      resolve()
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

// Función principal para ejecutar el script
if (require.main === module) {
  createEnhancedBackup().then(result => {
    if (result.success) {
      console.log('\n✅ Backup completado exitosamente')
      process.exit(0)
    } else {
      console.error('\n❌ Backup falló:', result.error)
      process.exit(1)
    }
  }).catch(error => {
    console.error('Error fatal:', error)
    process.exit(1)
  })
}

export { createEnhancedBackup, type BackupResult }