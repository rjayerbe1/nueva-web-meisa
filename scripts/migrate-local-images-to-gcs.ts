import { Storage } from '@google-cloud/storage'
import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Usar globalThis para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Inicializar Google Cloud Storage
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})
const bucket = storage.bucket('meisa-imagenes')

interface MigrationResult {
  localPath: string
  gcsUrl: string
  size: number
}

async function uploadFileToGCS(localPath: string, gcsPath: string): Promise<string> {
  try {
    const fileBuffer = readFileSync(localPath)
    const gcsFile = bucket.file(gcsPath)

    // Determinar tipo de contenido
    const extension = localPath.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    }
    const contentType = contentTypeMap[extension || ''] || 'image/jpeg'

    await gcsFile.save(fileBuffer, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000', // 1 año
      },
      public: true
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsPath}`
    return publicUrl
  } catch (error) {
    console.error(`❌ Error subiendo ${localPath}:`, error)
    throw error
  }
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath)

  files.forEach(file => {
    const filePath = join(dirPath, file)
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      // Solo archivos de imagen
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        arrayOfFiles.push(filePath)
      }
    }
  })

  return arrayOfFiles
}

async function migrateImages() {
  console.log('🚀 Iniciando migración de imágenes locales a Google Cloud Storage...\n')

  const uploadsDir = join(process.cwd(), 'public', 'uploads')

  // Verificar si existe el directorio
  try {
    statSync(uploadsDir)
  } catch (error) {
    console.log('❌ No se encontró el directorio /public/uploads')
    return
  }

  // Obtener todos los archivos de imagen
  const allFiles = getAllFiles(uploadsDir)
  console.log(`📁 Encontradas ${allFiles.length} imágenes para migrar\n`)

  if (allFiles.length === 0) {
    console.log('✅ No hay imágenes para migrar')
    return
  }

  const migrationResults: MigrationResult[] = []
  const urlMapping: Map<string, string> = new Map()

  // Migrar cada archivo
  for (let i = 0; i < allFiles.length; i++) {
    const localPath = allFiles[i]
    const relativePath = localPath.replace(join(process.cwd(), 'public'), '')
    const urlPath = relativePath.replace(/\\/g, '/') // Normalizar para Windows

    // Extraer la ruta después de /uploads/
    const gcsPath = relativePath.replace('/uploads/', 'categories/')

    console.log(`[${i + 1}/${allFiles.length}] Migrando: ${urlPath}`)

    try {
      const gcsUrl = await uploadFileToGCS(localPath, gcsPath)
      const fileSize = statSync(localPath).size

      migrationResults.push({
        localPath: urlPath,
        gcsUrl,
        size: fileSize
      })

      // Guardar mapeo de URL antigua a nueva
      urlMapping.set(urlPath, gcsUrl)

      console.log(`   ✅ Subido a: ${gcsUrl}`)
    } catch (error) {
      console.error(`   ❌ Error: ${error}`)
    }
  }

  console.log(`\n✅ Migradas ${migrationResults.length} de ${allFiles.length} imágenes\n`)

  // Actualizar URLs en la base de datos
  console.log('📝 Actualizando URLs en la base de datos...\n')

  // Actualizar categorías
  const categorias = await prisma.categoria.findMany({
    where: {
      OR: [
        { imagenCover: { startsWith: '/uploads/' } },
        { imagenBanner: { startsWith: '/uploads/' } }
      ]
    }
  })

  console.log(`📋 Encontradas ${categorias.length} categorías con imágenes locales`)

  for (const categoria of categorias) {
    const updates: any = {}

    if (categoria.imagenCover && categoria.imagenCover.startsWith('/uploads/')) {
      const newUrl = urlMapping.get(categoria.imagenCover)
      if (newUrl) {
        updates.imagenCover = newUrl
        console.log(`   📸 Cover: ${categoria.nombre}`)
        console.log(`      Antes: ${categoria.imagenCover}`)
        console.log(`      Después: ${newUrl}`)
      }
    }

    if (categoria.imagenBanner && categoria.imagenBanner.startsWith('/uploads/')) {
      const newUrl = urlMapping.get(categoria.imagenBanner)
      if (newUrl) {
        updates.imagenBanner = newUrl
        console.log(`   🎨 Banner: ${categoria.nombre}`)
        console.log(`      Antes: ${categoria.imagenBanner}`)
        console.log(`      Después: ${newUrl}`)
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.categoria.update({
        where: { id: categoria.id },
        data: updates
      })
      console.log(`   ✅ Actualizada categoría: ${categoria.nombre}\n`)
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN DE MIGRACIÓN')
  console.log('='.repeat(60))
  console.log(`Total de archivos migrados: ${migrationResults.length}`)
  console.log(`Tamaño total: ${(migrationResults.reduce((acc, r) => acc + r.size, 0) / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Categorías actualizadas: ${categorias.length}`)
  console.log('='.repeat(60))
  console.log('\n✅ Migración completada exitosamente!')
  console.log('\n💡 Las imágenes locales en /public/uploads/ ya no se usan.')
  console.log('   Puedes eliminarlas manualmente si lo deseas.')
}

migrateImages()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('❌ Error en migración:', error)
    prisma.$disconnect()
    process.exit(1)
  })
