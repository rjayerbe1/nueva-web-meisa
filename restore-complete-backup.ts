import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { exec } from 'child_process'
import { promisify } from 'util'
import AdmZip from 'adm-zip'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

interface RestoreResult {
  success: boolean
  restoredComponents: {
    database: boolean
    projectImages: boolean
    clientLogos: boolean
    categoryImages: boolean
  }
  stats?: {
    projectsRestored: number
    imagesRestored: number
    logosRestored: number
    categoryImagesRestored: number
  }
  error?: string
}

async function restoreCompleteBackup(backupPath: string): Promise<RestoreResult> {
  console.log('🔄 INICIANDO RESTAURACIÓN COMPLETA DE BACKUP...\n')
  console.log(`📦 Archivo: ${path.basename(backupPath)}`)

  const extractDir = path.join(process.cwd(), 'temp-restore-' + Date.now())
  
  try {
    // 1. EXTRAER ARCHIVO ZIP
    console.log('\n📂 1. EXTRAYENDO ARCHIVO ZIP...')
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Archivo de backup no encontrado')
    }

    const zip = new AdmZip(backupPath)
    zip.extractAllTo(extractDir, true)
    
    console.log(`   ✅ Backup extraído en: ${extractDir}`)

    // 2. VERIFICAR ESTRUCTURA DEL BACKUP
    console.log('\n🔍 2. VERIFICANDO ESTRUCTURA DEL BACKUP...')
    
    const backupInfoPath = path.join(extractDir, 'backup-info.json')
    if (!fs.existsSync(backupInfoPath)) {
      throw new Error('Archivo de información del backup no encontrado')
    }

    const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'))
    console.log(`   📋 Tipo: ${backupInfo.backupType}`)
    console.log(`   📅 Fecha: ${backupInfo.backupDate}`)
    console.log(`   📊 Incluye:`)
    console.log(`      💾 Base de datos: ${backupInfo.includes.database ? '✅' : '❌'}`)
    console.log(`      🖼️  Imágenes proyectos: ${backupInfo.includes.projectImages ? '✅' : '❌'}`)
    console.log(`      🏢 Logos clientes: ${backupInfo.includes.clientLogos ? '✅' : '❌'}`)
    console.log(`      🏷️  Imágenes categorías: ${backupInfo.includes.categoryImages ? '✅' : '❌'}`)

    let result: RestoreResult = {
      success: true,
      restoredComponents: {
        database: false,
        projectImages: false,
        clientLogos: false,
        categoryImages: false
      },
      stats: {
        projectsRestored: 0,
        imagesRestored: 0,
        logosRestored: 0,
        categoryImagesRestored: 0
      }
    }

    // 3. CREAR BACKUP DE SEGURIDAD ANTES DE RESTAURAR
    console.log('\n💾 3. CREANDO BACKUP DE SEGURIDAD...')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const safetyBackupName = `safety-before-restore-${timestamp}.json`
    const safetyBackupPath = path.join(process.cwd(), 'backups', safetyBackupName)
    
    await fs.promises.mkdir(path.join(process.cwd(), 'backups'), { recursive: true })
    
    const currentData = {
      timestamp: new Date().toISOString(),
      database: 'meisa',
      version: '1.0',
      data: {
        users: await prisma.user.findMany(),
        proyectos: await prisma.proyecto.findMany({
          include: {
            imagenes: true,
            documentos: true,
            progreso: true,
            timeline: true,
            comentarios: true,
            clienteRel: true
          }
        }),
        clientes: await prisma.cliente.findMany(),
        servicios: await prisma.servicio.findMany(),
        formulariosContacto: await prisma.contactForm.findMany(),
        configuracion: await prisma.configuracionSitio.findMany(),
        categorias: await prisma.categoriaProyecto.findMany()
      }
    }
    
    const safetyData = JSON.stringify(currentData, (key, value) => {
      if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
        return value.toString()
      }
      return value
    }, 2)
    
    await fs.promises.writeFile(safetyBackupPath, safetyData)
    console.log(`   ✅ Backup de seguridad creado: ${safetyBackupName}`)

    // 4. RESTAURAR BASE DE DATOS
    if (backupInfo.includes.database) {
      console.log('\n💾 4. RESTAURANDO BASE DE DATOS...')
      
      const dbBackupPath = path.join(extractDir, 'database')
      let databaseRestored = false

      // Intentar restaurar desde SQL primero
      const sqlBackupPath = path.join(dbBackupPath, 'meisa-database.sql')
      if (fs.existsSync(sqlBackupPath)) {
        try {
          console.log('   🔄 Restaurando desde archivo SQL...')
          const databaseUrl = process.env.DATABASE_URL
          if (!databaseUrl) {
            throw new Error('DATABASE_URL no configurada')
          }

          const url = new URL(databaseUrl)
          const host = url.hostname
          const port = url.port || '5432'
          const username = url.username
          const password = url.password
          const database = url.pathname.slice(1)

          const psqlCommand = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${sqlBackupPath}"`
          await execAsync(psqlCommand)
          
          console.log('   ✅ Base de datos restaurada desde SQL')
          databaseRestored = true
        } catch (error) {
          console.log(`   ⚠️  Error con SQL, intentando JSON: ${error}`)
        }
      }

      // Fallback a JSON si SQL falló
      if (!databaseRestored) {
        const jsonBackupPath = path.join(dbBackupPath, 'critical-data.json')
        if (fs.existsSync(jsonBackupPath)) {
          console.log('   🔄 Restaurando desde archivo JSON...')
          
          const backupData = JSON.parse(fs.readFileSync(jsonBackupPath, 'utf8'))
          
          // Limpiar base de datos en orden correcto para PostgreSQL
          // Primero eliminar registros que dependen de otros (relaciones)
          await prisma.comentarioProyecto.deleteMany({})
          await prisma.timelineEntry.deleteMany({})
          await prisma.progresoProyecto.deleteMany({})
          await prisma.documentoProyecto.deleteMany({})
          await prisma.imagenProyecto.deleteMany({})
          await prisma.proyecto.deleteMany({})
          
          // Luego eliminar tablas independientes
          await prisma.contactForm.deleteMany({})
          await prisma.configuracionSitio.deleteMany({})
          await prisma.categoriaProyecto.deleteMany({})
          await prisma.servicio.deleteMany({})
          await prisma.cliente.deleteMany({})
          
          // Finalmente eliminar sesiones y usuarios
          await prisma.session.deleteMany({})
          await prisma.account.deleteMany({})
          await prisma.user.deleteMany({})

          // Restaurar datos en orden correcto para evitar violaciones de claves foráneas
          const data = backupData.data || backupData
          
          console.log(`   🔍 Estructura de datos encontrada:`)
          console.log(`      👥 users: ${data.users?.length || 0}`)
          console.log(`      🏢 clientes: ${(data.clientes || data.clients || []).length}`)
          console.log(`      🔧 servicios: ${(data.servicios || data.services || []).length}`)
          console.log(`      👤 equipo: ${(data.miembrosEquipo || data.team || []).length}`)
          console.log(`      🏷️  categorías: ${(data.categorias || data.categories || []).length}`)
          console.log(`      📂 proyectos: ${(data.proyectos || data.projects || []).length}`)
          console.log(`      📧 contactos: ${(data.formulariosContacto || data.contactForms || []).length}`)
          
          // 1. Primero usuarios (necesarios para proyectos)
          if (data.users?.length > 0) {
            console.log(`   📝 Restaurando ${data.users.length} usuarios...`)
            for (const user of data.users) {
              const { createdAt, updatedAt, ...userData } = user
              await prisma.user.create({ data: userData })
            }
          } else {
            console.log(`   ⚠️  No hay usuarios en el backup, creando usuario por defecto...`)
            await prisma.user.create({
              data: {
                id: 'default-user-restore',
                email: 'admin@meisa.com.co',
                name: 'Administrador',
                role: 'ADMIN'
              }
            })
          }
          
          // 2. Clientes (pueden ser referenciados por proyectos)
          const clientesData = data.clientes || data.clients || []
          if (clientesData.length > 0) {
            console.log(`   🏢 Restaurando ${clientesData.length} clientes...`)
            for (const cliente of clientesData) {
              const { id, createdAt, updatedAt, ...clienteData } = cliente
              await prisma.cliente.create({ data: clienteData })
            }
          }
          
          // 3. Servicios
          const serviciosData = data.servicios || data.services || []
          if (serviciosData.length > 0) {
            console.log(`   🔧 Restaurando ${serviciosData.length} servicios...`)
            for (const servicio of serviciosData) {
              const { id, createdAt, updatedAt, ...servicioData } = servicio
              await prisma.servicio.create({ data: servicioData })
            }
          }

          // 4. Categorías
          const categoriesData = data.categorias || data.categories || []
          if (categoriesData.length > 0) {
            console.log(`   🏷️  Restaurando ${categoriesData.length} categorías...`)
            for (const categoria of categoriesData) {
              const { id, createdAt, updatedAt, ...categoriaData } = categoria
              await prisma.categoriaProyecto.create({ data: categoriaData })
            }
          }
          
          // 6. Proyectos (con validación de claves foráneas)
          const projectsData = data.proyectos || data.projects || []
          if (projectsData.length > 0) {
            console.log(`   📂 Restaurando ${projectsData.length} proyectos...`)
            
            // Obtener usuarios existentes para validar createdBy
            const existingUsers = await prisma.user.findMany({ select: { id: true } })
            const userIds = new Set(existingUsers.map(u => u.id))
            
            // Obtener clientes existentes para validar clienteId
            const existingClients = await prisma.cliente.findMany({ select: { id: true } })
            const clientIds = new Set(existingClients.map(c => c.id))
            
            for (const proyecto of projectsData) {
              const { id, imagenes, documentos, progreso, timeline, comentarios, clienteRel, createdAt, updatedAt, ...proyectoData } = proyecto
              
              // Validar y ajustar createdBy
              if (!userIds.has(proyectoData.createdBy)) {
                console.log(`   ⚠️  Usuario ${proyectoData.createdBy} no existe, usando primer usuario disponible`)
                if (existingUsers.length > 0) {
                  proyectoData.createdBy = existingUsers[0].id
                } else {
                  console.log(`   ❌ No hay usuarios disponibles, saltando proyecto: ${proyecto.titulo}`)
                  continue
                }
              }
              
              // Validar y ajustar clienteId
              if (proyectoData.clienteId && !clientIds.has(proyectoData.clienteId)) {
                console.log(`   ⚠️  Cliente ${proyectoData.clienteId} no existe, removiendo referencia`)
                proyectoData.clienteId = null
              }
              
              try {
                console.log(`   🔄 Creando proyecto: ${proyecto.titulo}`)
                
                // Convertir campos Decimal que vienen como string
                if (proyectoData.presupuesto && typeof proyectoData.presupuesto === 'string') {
                  proyectoData.presupuesto = parseFloat(proyectoData.presupuesto)
                }
                if (proyectoData.costoReal && typeof proyectoData.costoReal === 'string') {
                  proyectoData.costoReal = parseFloat(proyectoData.costoReal)
                }
                if (proyectoData.toneladas && typeof proyectoData.toneladas === 'string') {
                  proyectoData.toneladas = parseFloat(proyectoData.toneladas)
                }
                if (proyectoData.areaTotal && typeof proyectoData.areaTotal === 'string') {
                  proyectoData.areaTotal = parseFloat(proyectoData.areaTotal)
                }
                
                // Convertir fechas que vienen como string
                if (proyectoData.fechaInicio && typeof proyectoData.fechaInicio === 'string') {
                  proyectoData.fechaInicio = new Date(proyectoData.fechaInicio)
                }
                if (proyectoData.fechaFin && typeof proyectoData.fechaFin === 'string') {
                  proyectoData.fechaFin = new Date(proyectoData.fechaFin)
                }
                if (proyectoData.fechaEstimada && typeof proyectoData.fechaEstimada === 'string') {
                  proyectoData.fechaEstimada = new Date(proyectoData.fechaEstimada)
                }
                
                const nuevoProyecto = await prisma.proyecto.create({ data: proyectoData })
                result.stats!.projectsRestored++
                console.log(`   ✅ Proyecto creado: ${nuevoProyecto.id} - ${nuevoProyecto.titulo}`)
                
                // Restaurar imágenes del proyecto
                if (imagenes?.length > 0) {
                  for (const imagen of imagenes) {
                    const { id, proyectoId, createdAt, updatedAt, ...imagenData } = imagen
                    await prisma.imagenProyecto.create({
                      data: {
                        ...imagenData,
                        proyectoId: nuevoProyecto.id
                      }
                    })
                  }
                }
                
                // Restaurar documentos del proyecto
                if (documentos?.length > 0) {
                  for (const documento of documentos) {
                    const { id, proyectoId, createdAt, updatedAt, ...documentoData } = documento
                    await prisma.documentoProyecto.create({
                      data: {
                        ...documentoData,
                        proyectoId: nuevoProyecto.id
                      }
                    })
                  }
                }
                
                // Restaurar progreso del proyecto
                if (progreso?.length > 0) {
                  for (const prog of progreso) {
                    const { id, proyectoId, createdAt, updatedAt, ...progresoData } = prog
                    await prisma.progresoProyecto.create({
                      data: {
                        ...progresoData,
                        proyectoId: nuevoProyecto.id
                      }
                    })
                  }
                }
                
                // Restaurar timeline del proyecto
                if (timeline?.length > 0) {
                  for (const entry of timeline) {
                    const { id, proyectoId, createdAt, ...timelineData } = entry
                    await prisma.timelineEntry.create({
                      data: {
                        ...timelineData,
                        proyectoId: nuevoProyecto.id
                      }
                    })
                  }
                }
                
                // Restaurar comentarios del proyecto
                if (comentarios?.length > 0) {
                  for (const comentario of comentarios) {
                    const { id, proyectoId, createdAt, updatedAt, ...comentarioData } = comentario
                    await prisma.comentarioProyecto.create({
                      data: {
                        ...comentarioData,
                        proyectoId: nuevoProyecto.id
                      }
                    })
                  }
                }
                
              } catch (error) {
                console.log(`   ❌ Error creando proyecto "${proyecto.titulo}": ${error}`)
                console.log(`   🔍 Datos del proyecto:`, JSON.stringify(proyectoData, null, 2))
                // Continuar con el siguiente proyecto
              }
            }
          }
          
          // 7. Formularios de contacto
          const contactData = data.formulariosContacto || data.contactForms || []
          if (contactData.length > 0) {
            console.log(`   📧 Restaurando ${contactData.length} formularios de contacto...`)
            for (const formulario of contactData) {
              const { id, createdAt, updatedAt, ...formData } = formulario
              await prisma.contactForm.create({ data: formData })
            }
          }
          
          // 8. Configuración del sitio
          const configData = data.configuracion || data.settings || []
          if (configData.length > 0) {
            console.log(`   ⚙️  Restaurando ${configData.length} configuraciones...`)
            for (const config of configData) {
              const { id, updatedAt, ...configItemData } = config
              await prisma.configuracionSitio.create({ data: configItemData })
            }
          }
          
          console.log(`   ✅ Base de datos restaurada desde JSON (${result.stats!.projectsRestored} proyectos)`)
          databaseRestored = true
        }
      }

      result.restoredComponents.database = databaseRestored
    }

    // 5. RESTAURAR IMÁGENES DE PROYECTOS
    if (backupInfo.includes.projectImages) {
      console.log('\n🖼️  5. RESTAURANDO IMÁGENES DE PROYECTOS...')
      
      const projectImagesSource = path.join(extractDir, 'project-images')
      const projectImagesTarget = path.join(process.cwd(), 'public', 'images', 'projects')
      
      if (fs.existsSync(projectImagesSource)) {
        // Limpiar directorio actual
        if (fs.existsSync(projectImagesTarget)) {
          await fs.promises.rm(projectImagesTarget, { recursive: true, force: true })
        }
        
        // Copiar nuevas imágenes
        await copyDirectoryRecursive(projectImagesSource, projectImagesTarget)
        const imageCount = await countFilesRecursive(projectImagesTarget)
        result.stats!.imagesRestored = imageCount
        
        console.log(`   ✅ ${imageCount} imágenes de proyectos restauradas`)
        result.restoredComponents.projectImages = true
      }
    }

    // 6. RESTAURAR LOGOS DE CLIENTES
    if (backupInfo.includes.clientLogos) {
      console.log('\n🏢 6. RESTAURANDO LOGOS DE CLIENTES...')
      
      const clientLogosSource = path.join(extractDir, 'client-logos')
      const clientLogosTarget = path.join(process.cwd(), 'public', 'images', 'clients')
      
      if (fs.existsSync(clientLogosSource)) {
        // Limpiar directorio actual
        if (fs.existsSync(clientLogosTarget)) {
          await fs.promises.rm(clientLogosTarget, { recursive: true, force: true })
        }
        
        // Copiar nuevos logos
        await copyDirectoryRecursive(clientLogosSource, clientLogosTarget)
        const logoCount = await countFilesRecursive(clientLogosTarget)
        result.stats!.logosRestored = logoCount
        
        console.log(`   ✅ ${logoCount} logos de clientes restaurados`)
        result.restoredComponents.clientLogos = true
      }
    }

    // 7. RESTAURAR IMÁGENES DE CATEGORÍAS
    if (backupInfo.includes.categoryImages) {
      console.log('\n🏷️  7. RESTAURANDO IMÁGENES DE CATEGORÍAS...')
      
      const categoryImagesSource = path.join(extractDir, 'category-images')
      const categoryImagesTarget = path.join(process.cwd(), 'public', 'images', 'categories')
      
      if (fs.existsSync(categoryImagesSource)) {
        // Limpiar directorio actual
        if (fs.existsSync(categoryImagesTarget)) {
          await fs.promises.rm(categoryImagesTarget, { recursive: true, force: true })
        }
        
        // Copiar nuevas imágenes de categorías
        await copyDirectoryRecursive(categoryImagesSource, categoryImagesTarget)
        const categoryImageCount = await countFilesRecursive(categoryImagesTarget)
        result.stats!.categoryImagesRestored = categoryImageCount
        
        console.log(`   ✅ ${categoryImageCount} imágenes de categorías restauradas`)
        result.restoredComponents.categoryImages = true
      }
    }

    // 8. LIMPIAR ARCHIVOS TEMPORALES
    console.log('\n🧹 8. LIMPIANDO ARCHIVOS TEMPORALES...')
    await fs.promises.rm(extractDir, { recursive: true, force: true })
    console.log('   ✅ Archivos temporales eliminados')

    console.log('\n🎉 RESTAURACIÓN COMPLETA EXITOSA!')
    console.log(`   💾 Base de datos: ${result.restoredComponents.database ? '✅' : '❌'}`)
    console.log(`   🖼️  Imágenes proyectos: ${result.restoredComponents.projectImages ? '✅' : '❌'} (${result.stats!.imagesRestored})`)
    console.log(`   🏢 Logos clientes: ${result.restoredComponents.clientLogos ? '✅' : '❌'} (${result.stats!.logosRestored})`)
    console.log(`   🏷️  Imágenes categorías: ${result.restoredComponents.categoryImages ? '✅' : '❌'} (${result.stats!.categoryImagesRestored})`)
    console.log(`   📁 Backup de seguridad: ${safetyBackupName}`)

    await prisma.$disconnect()
    return result

  } catch (error) {
    console.error('❌ ERROR EN RESTAURACIÓN:', error)
    
    // Limpiar archivos temporales en caso de error
    try {
      if (fs.existsSync(extractDir)) {
        await fs.promises.rm(extractDir, { recursive: true, force: true })
      }
    } catch (cleanupError) {
      console.error('Error en limpieza:', cleanupError)
    }

    await prisma.$disconnect()

    return {
      success: false,
      restoredComponents: {
        database: false,
        projectImages: false,
        clientLogos: false,
        categoryImages: false
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

export { restoreCompleteBackup, type RestoreResult }