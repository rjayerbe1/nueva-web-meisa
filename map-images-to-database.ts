import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function mapImagesToDatabase() {
  console.log('🗄️ MAPEANDO IMÁGENES A LA BASE DE DATOS...\n')

  // Buscar o crear usuario admin para asignar proyectos
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@meisa.com.co',
        name: 'Admin MEISA',
        role: 'ADMIN'
      }
    })
    console.log('✅ Usuario admin creado')
  }

  const projectsImagesPath = path.join(process.cwd(), 'public', 'images', 'projects')
  
  if (!fs.existsSync(projectsImagesPath)) {
    console.log('❌ No se encontró la carpeta de imágenes de proyectos')
    return
  }

  // Mapeo de categorías de carpetas a categorías de la base de datos
  const categoryMapping = {
    'centros-comerciales': 'CENTROS_COMERCIALES',
    'edificios': 'EDIFICIOS', 
    'industria': 'INDUSTRIA',
    'puentes-vehiculares': 'PUENTES_VEHICULARES',
    'puentes-peatonales': 'PUENTES_PEATONALES',
    'escenarios-deportivos': 'ESCENARIOS_DEPORTIVOS',
    'estructuras-modulares': 'ESTRUCTURAS_MODULARES',
    'oil-and-gas': 'OIL_AND_GAS',
    'cubiertas-y-fachadas': 'CUBIERTAS_Y_FACHADAS',
    'otros': 'OTRO'
  }

  let totalProjectsCreated = 0
  let totalImagesLinked = 0
  let markdownReport = '# 🗄️ MAPEO DE IMÁGENES A BASE DE DATOS\n\n'
  markdownReport += `**Fecha de mapeo:** ${new Date().toLocaleString('es-CO')}\n\n`

  // Obtener todas las categorías de imágenes
  const categories = fs.readdirSync(projectsImagesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const categoryFolder of categories) {
    const categoryPath = path.join(projectsImagesPath, categoryFolder)
    const dbCategory = categoryMapping[categoryFolder] || 'otros'
    
    console.log(`\n📁 Procesando categoría: ${categoryFolder} → ${dbCategory}`)
    markdownReport += `## ${categoryFolder.toUpperCase()}\n\n`

    // Obtener todos los proyectos en esta categoría
    const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    let categoryProjectsCreated = 0
    let categoryImagesLinked = 0

    for (const projectFolder of projects) {
      const projectPath = path.join(categoryPath, projectFolder)
      
      // Obtener todas las imágenes del proyecto
      const images = fs.readdirSync(projectPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .sort()

      if (images.length === 0) {
        console.log(`   ⚠️  ${projectFolder}: Sin imágenes`)
        continue
      }

      console.log(`   📂 ${projectFolder}: ${images.length} imágenes`)

      try {
        // Generar información del proyecto basada en el nombre de la carpeta
        const projectInfo = generateProjectInfo(projectFolder, dbCategory)
        
        // Verificar si el proyecto ya existe
        const existingProject = await prisma.proyecto.findFirst({
          where: {
            OR: [
              { slug: projectInfo.slug },
              { titulo: projectInfo.titulo }
            ]
          }
        })

        let project = existingProject

        if (!existingProject) {
          // Crear nuevo proyecto
          project = await prisma.proyecto.create({
            data: {
              titulo: projectInfo.titulo,
              slug: projectInfo.slug,
              descripcion: projectInfo.descripcion,
              categoria: dbCategory,
              cliente: projectInfo.cliente || 'No especificado',
              ubicacion: projectInfo.ubicacion || 'No especificada',
              fechaInicio: new Date(),
              estado: 'COMPLETADO',
              destacado: false,
              toneladas: projectInfo.peso ? parseFloat(projectInfo.peso.replace(/[^\d.]/g, '')) : null,
              areaTotal: projectInfo.area ? parseFloat(projectInfo.area.replace(/[^\d.]/g, '')) : null,
              codigoInterno: `${dbCategory.toUpperCase()}-${String(totalProjectsCreated + 1).padStart(3, '0')}`,
              createdBy: adminUser.id
            }
          })

          totalProjectsCreated++
          categoryProjectsCreated++
          console.log(`     ✅ Proyecto creado: ${project.titulo}`)
        } else {
          console.log(`     📝 Proyecto existente: ${existingProject.titulo}`)
        }

        // Crear/actualizar imágenes del proyecto
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          const imagePath = `/images/projects/${categoryFolder}/${projectFolder}/${image}`
          const isPortada = i === 0 // Primera imagen como portada

          try {
            // Verificar si la imagen ya existe
            const existingImage = await prisma.imagenProyecto.findFirst({
              where: {
                proyectoId: project.id,
                url: imagePath
              }
            })

            if (!existingImage) {
              await prisma.imagenProyecto.create({
                data: {
                  proyectoId: project.id,
                  url: imagePath,
                  alt: `${project.titulo} - Imagen ${i + 1}`,
                  orden: i,
                  tipo: isPortada ? 'PORTADA' : 'GALERIA'
                }
              })

              totalImagesLinked++
              categoryImagesLinked++
              console.log(`       📸 Imagen ${i + 1}: ${image} ${isPortada ? '(PORTADA)' : ''}`)
            }
          } catch (imageError) {
            console.log(`       ❌ Error con imagen ${image}: ${imageError}`)
          }
        }

        markdownReport += `### ${projectInfo.titulo}\n`
        markdownReport += `- **Slug:** ${projectInfo.slug}\n`
        markdownReport += `- **Categoría:** ${dbCategory}\n`
        markdownReport += `- **Imágenes:** ${images.length}\n`
        markdownReport += `- **Ubicación:** \`${categoryFolder}/${projectFolder}/\`\n`
        markdownReport += `- **Estado:** ${existingProject ? 'Actualizado' : 'Creado'}\n\n`

      } catch (error) {
        console.log(`   ❌ Error procesando proyecto ${projectFolder}: ${error}`)
        markdownReport += `### ❌ ERROR: ${projectFolder}\n`
        markdownReport += `- **Error:** ${error.message}\n\n`
      }
    }

    console.log(`   📊 Categoría ${categoryFolder}: ${categoryProjectsCreated} proyectos creados, ${categoryImagesLinked} imágenes enlazadas`)
    markdownReport += `**Resumen categoría:**\n`
    markdownReport += `- Proyectos creados: ${categoryProjectsCreated}\n`
    markdownReport += `- Imágenes enlazadas: ${categoryImagesLinked}\n\n`
    markdownReport += `---\n\n`
  }

  // Actualizar estadísticas de proyectos
  await updateProjectStats()

  markdownReport += `# 📊 RESUMEN FINAL\n\n`
  markdownReport += `- **Total proyectos creados:** ${totalProjectsCreated}\n`
  markdownReport += `- **Total imágenes enlazadas:** ${totalImagesLinked}\n`
  markdownReport += `- **Categorías procesadas:** ${categories.length}\n\n`

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'MAPEO-DATABASE-COMPLETO.md')
  fs.writeFileSync(reportPath, markdownReport)

  console.log('\n🎉 MAPEO COMPLETO!')
  console.log(`   📊 Proyectos creados: ${totalProjectsCreated}`)
  console.log(`   🖼️  Imágenes enlazadas: ${totalImagesLinked}`)
  console.log(`   📝 Reporte guardado en: MAPEO-DATABASE-COMPLETO.md`)

  await prisma.$disconnect()
}

function generateProjectInfo(projectFolder: string, category: string) {
  // Limpiar y generar información del proyecto basada en el nombre de la carpeta
  const cleanName = projectFolder
    .replace(/^(centro-comercial-|edificio-|industria-|puente-vehicular-|puente-peatonal-|escenario-deportivo-|estructura-modular-|oil-gas-)/i, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const slug = projectFolder.toLowerCase()

  // Información específica por categoría
  const categoryInfo = {
    'centros-comerciales': {
      prefix: 'Centro Comercial',
      description: 'Estructura metálica y cubierta para centro comercial',
      defaultClient: 'Constructora'
    },
    'edificios': {
      prefix: 'Edificio',
      description: 'Estructura metálica para edificación',
      defaultClient: 'Constructor'
    },
    'industria': {
      prefix: 'Proyecto Industrial',
      description: 'Estructura metálica industrial',
      defaultClient: 'Cliente Industrial'
    },
    'puentes-vehiculares': {
      prefix: 'Puente Vehicular',
      description: 'Estructura metálica para puente vehicular',
      defaultClient: 'Ente Territorial'
    },
    'puentes-peatonales': {
      prefix: 'Puente Peatonal',
      description: 'Estructura metálica para puente peatonal',
      defaultClient: 'Municipio'
    },
    'escenarios-deportivos': {
      prefix: 'Escenario Deportivo',
      description: 'Estructura metálica para escenario deportivo',
      defaultClient: 'Ente Deportivo'
    },
    'estructuras-modulares': {
      prefix: 'Estructura Modular',
      description: 'Estructura modular metálica',
      defaultClient: 'Cliente'
    },
    'oil-and-gas': {
      prefix: 'Oil & Gas',
      description: 'Tanque y estructura para oil & gas',
      defaultClient: 'Petrolera'
    }
  }

  const info = categoryInfo[category] || {
    prefix: 'Proyecto',
    description: 'Estructura metálica',
    defaultClient: 'Cliente'
  }

  const titulo = `${info.prefix} ${cleanName}`
  
  return {
    titulo: titulo,
    slug: slug,
    descripcion: `${info.description}. ${titulo} desarrollado por MEISA con los más altos estándares de calidad.`,
    descripcionCorta: info.description,
    cliente: info.defaultClient,
    ubicacion: extractLocation(cleanName),
    peso: extractWeight(cleanName),
    area: extractArea(cleanName)
  }
}

function extractLocation(name: string): string | null {
  // Patrones comunes de ubicaciones en Colombia
  const locationPatterns = [
    /bogot[aá]/i, /cali/i, /medell[ií]n/i, /barranquilla/i, 
    /cartagena/i, /popay[aá]n/i, /neiva/i, /pasto/i, /armenia/i,
    /cauca/i, /valle/i, /cundinamarca/i, /atl[aá]ntico/i,
    /huila/i, /quind[ií]o/i, /tolima/i, /cesar/i, /santander/i
  ]

  for (const pattern of locationPatterns) {
    const match = name.match(pattern)
    if (match) {
      return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase()
    }
  }

  return null
}

function extractWeight(name: string): string | null {
  const weightMatch = name.match(/(\d+)\s*(ton|tonelada)/i)
  return weightMatch ? `${weightMatch[1]} toneladas` : null
}

function extractArea(name: string): string | null {
  const areaMatch = name.match(/(\d+)\s*(m2|metros)/i)
  return areaMatch ? `${areaMatch[1]} m²` : null
}

async function updateProjectStats() {
  // Actualizar contadores y estadísticas
  const totalProjects = await prisma.proyecto.count()
  const categoryCounts = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: true
  })

  console.log('\n📊 ESTADÍSTICAS ACTUALIZADAS:')
  console.log(`   📈 Total proyectos en BD: ${totalProjects}`)
  
  for (const cat of categoryCounts) {
    console.log(`   📂 ${cat.categoria}: ${cat._count} proyectos`)
  }
}

mapImagesToDatabase().catch(console.error)