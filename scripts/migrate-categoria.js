const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Mapeo de nombres de categoría a valores del enum
const CATEGORIA_MAP = {
  'COMERCIAL': 'COMERCIAL',
  'EDIFICACIONES': 'EDIFICACIONES',
  'INDUSTRIA': 'INDUSTRIA',
  'PUENTES_VEHICULARES': 'PUENTES_VEHICULARES',
  'PUENTES_PEATONALES': 'PUENTES_PEATONALES',
  'ESCENARIOS_DEPORTIVOS': 'ESCENARIOS_DEPORTIVOS',
  'OTRO': 'OTRO'
}

// Función para generar slug único
function generateSlug(title, existingSlugs = []) {
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)

  let finalSlug = slug
  let counter = 2
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`
    counter++
  }

  return finalSlug
}

// Función para extraer nombres de proyectos del markdown
function extractProjectNamesFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const projectNames = []

  for (const line of lines) {
    if (line.startsWith('### ')) {
      const name = line.replace('### ', '').trim()
      if (
        !name.startsWith('PROYECTOS') &&
        !name.startsWith('ESTADÍSTICAS') &&
        !name.startsWith('Distribución') &&
        !name.startsWith('Principales') &&
        !name.startsWith('Cobertura') &&
        !name.startsWith('Top') &&
        !name.startsWith('Proyectos Identificados')
      ) {
        projectNames.push(name)
      }
    }
  }

  return projectNames
}

// Función para hacer matching flexible
function fuzzyMatch(name1, name2) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')

  const n1 = normalize(name1)
  const n2 = normalize(name2)

  if (n1 === n2) return true
  if (n1.includes(n2) || n2.includes(n1)) return true

  // Matching adicional para proyectos con nombres similares
  const words1 = n1.split(/\s+/).filter(w => w.length > 3)
  const words2 = n2.split(/\s+/).filter(w => w.length > 3)

  if (words1.length >= 2 && words2.length >= 2) {
    const commonWords = words1.filter(w => words2.includes(w))
    if (commonWords.length >= 2) return true
  }

  return false
}

// Función principal de migración
async function migrateCategory(categoryName, dryRun = true) {
  try {
    // Validar categoría
    if (!CATEGORIA_MAP[categoryName]) {
      throw new Error(`Categoría no válida: ${categoryName}. Categorías disponibles: ${Object.keys(CATEGORIA_MAP).join(', ')}`)
    }

    const categoryEnum = CATEGORIA_MAP[categoryName]

    console.log('='.repeat(80))
    console.log(`MIGRACIÓN DE PROYECTOS - CATEGORÍA: ${categoryName}`)
    console.log('Modo:', dryRun ? 'DRY RUN (sin cambios en DB)' : 'REAL (insertará en DB)')
    console.log('='.repeat(80))
    console.log()

    // 1. Extraer nombres del markdown
    const markdownPath = path.join(__dirname, '..', `CATEGORIA_${categoryName}.md`)

    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Archivo no encontrado: ${markdownPath}`)
    }

    console.log('📄 Extrayendo proyectos de:', markdownPath)
    const projectNames = extractProjectNamesFromMarkdown(markdownPath)
    console.log(`✅ Encontrados ${projectNames.length} proyectos en el markdown\n`)

    if (projectNames.length === 0) {
      console.log('⚠️  No se encontraron proyectos en el markdown. Terminando.')
      await prisma.$disconnect()
      return
    }

    // 2. Obtener todos los proyectos de hoja de vida
    console.log('🔍 Buscando proyectos en ProyectoHojaVida...')
    const hojaVidaProjects = await prisma.proyectoHojaVida.findMany({
      orderBy: { fechaInicio: 'desc' },
    })
    console.log(`✅ ${hojaVidaProjects.length} proyectos en ProyectoHojaVida\n`)

    // 3. Obtener usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!adminUser) {
      throw new Error('No se encontró ningún usuario ADMIN en la base de datos')
    }
    console.log(`👤 Usuario creador: ${adminUser.email} (${adminUser.id})\n`)

    // 4. Obtener slugs existentes
    const existingProjects = await prisma.proyecto.findMany({
      select: { slug: true, id: true },
    })
    const existingSlugs = existingProjects.map((p) => p.slug)
    console.log(`📊 ${existingProjects.length} proyectos ya existen en tabla Proyecto\n`)

    // 5. Hacer matching y preparar migraciones
    console.log('🔄 Haciendo matching de proyectos...\n')
    const migrations = []
    const notFound = []

    for (const projectName of projectNames) {
      const hojaVidaProject = hojaVidaProjects.find(
        (p) =>
          fuzzyMatch(projectName, p.tituloDisplay || '') ||
          fuzzyMatch(projectName, p.objetoContrato || '')
      )

      if (hojaVidaProject) {
        // Verificar si ya tiene un proyecto detallado vinculado
        if (hojaVidaProject.proyectoDetalladoId) {
          console.log(`⚠️  SKIP: "${projectName}" ya tiene proyecto detallado vinculado`)
          continue
        }

        const slug = generateSlug(hojaVidaProject.tituloDisplay || projectName, existingSlugs)
        existingSlugs.push(slug)

        migrations.push({
          hojaVidaId: hojaVidaProject.id,
          projectData: {
            titulo: hojaVidaProject.tituloDisplay || projectName,
            codigoInterno: null,
            descripcion: hojaVidaProject.objetoContrato,
            categoria: categoryEnum,
            estado: 'COMPLETADO',
            prioridad: 'MEDIA',
            fechaInicio: hojaVidaProject.fechaInicio,
            fechaFin: hojaVidaProject.fechaFin,
            fechaEstimada: hojaVidaProject.fechaFin,
            presupuesto: hojaVidaProject.valorContrato,
            moneda: hojaVidaProject.moneda || 'COP',
            cliente: hojaVidaProject.entidadContratante,
            ubicacion: hojaVidaProject.departamento
              ? `${hojaVidaProject.ubicacion}, ${hojaVidaProject.departamento}`
              : hojaVidaProject.ubicacion,
            tags: [],
            destacado: false,
            destacadoEnCategoria: false,
            visible: true,
            slug: slug,
            createdBy: adminUser.id,
            areaTotal: hojaVidaProject.areaM2,
            toneladas: hojaVidaProject.pesoKg ? Number(hojaVidaProject.pesoKg) / 1000 : null,
          },
        })

        console.log(`✅ Match: "${projectName}" → ${hojaVidaProject.tituloDisplay}`)
      } else {
        notFound.push(projectName)
        console.log(`❌ NO MATCH: "${projectName}"`)
      }
    }

    console.log()
    console.log('='.repeat(80))
    console.log('RESUMEN DE MATCHING')
    console.log('='.repeat(80))
    console.log(`✅ Proyectos para migrar: ${migrations.length}`)
    console.log(`❌ Proyectos no encontrados: ${notFound.length}`)
    console.log()

    if (notFound.length > 0) {
      console.log('⚠️  Proyectos no encontrados en ProyectoHojaVida:')
      notFound.forEach((name) => console.log(`   - ${name}`))
      console.log()
    }

    // 6. Ejecutar migración
    if (dryRun) {
      console.log('='.repeat(80))
      console.log('PREVIEW (DRY RUN) - Primeros 5 proyectos a crear:')
      console.log('='.repeat(80))
      migrations.slice(0, 5).forEach((m, idx) => {
        console.log(`\n${idx + 1}. ${m.projectData.titulo}`)
        console.log(`   Categoría: ${m.projectData.categoria}`)
        console.log(`   Slug: ${m.projectData.slug}`)
        console.log(`   Cliente: ${m.projectData.cliente}`)
        console.log(`   Ubicación: ${m.projectData.ubicacion}`)
        console.log(`   Toneladas: ${m.projectData.toneladas || 'N/A'} ton`)
        console.log(`   Área: ${m.projectData.areaTotal || 'N/A'} m²`)
      })
      console.log()
      console.log(`... y ${migrations.length - 5} proyectos más`)
      console.log()
      console.log('✅ Para ejecutar la migración real, usa: --real')
    } else {
      console.log('='.repeat(80))
      console.log('EJECUTANDO MIGRACIÓN REAL...')
      console.log('='.repeat(80))
      console.log()

      let successCount = 0
      let errorCount = 0

      for (const migration of migrations) {
        try {
          const newProject = await prisma.proyecto.create({
            data: migration.projectData,
          })

          await prisma.proyectoHojaVida.update({
            where: { id: migration.hojaVidaId },
            data: { proyectoDetalladoId: newProject.id },
          })

          successCount++
          console.log(`✅ [${successCount}/${migrations.length}] Creado: ${migration.projectData.titulo}`)
        } catch (error) {
          errorCount++
          console.error(`❌ Error creando "${migration.projectData.titulo}":`, error.message)
        }
      }

      console.log()
      console.log('='.repeat(80))
      console.log('MIGRACIÓN COMPLETADA')
      console.log('='.repeat(80))
      console.log(`✅ Proyectos creados exitosamente: ${successCount}`)
      console.log(`❌ Errores: ${errorCount}`)
    }

    await prisma.$disconnect()
    return { success: migrations.length, errors: 0 }
  } catch (error) {
    console.error('❌ Error en migración:', error)
    await prisma.$disconnect()
    throw error
  }
}

// Ejecutar
const categoryName = process.argv[2]
const isRealMode = process.argv.includes('--real')

if (!categoryName) {
  console.error('❌ Error: Debe especificar una categoría')
  console.log('Uso: node migrate-categoria.js <CATEGORIA> [--real]')
  console.log('Categorías disponibles:', Object.keys(CATEGORIA_MAP).join(', '))
  process.exit(1)
}

migrateCategory(categoryName.toUpperCase(), !isRealMode)
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
