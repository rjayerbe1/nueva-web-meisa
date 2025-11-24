const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Categorías a migrar (excluyendo COMERCIAL que ya se migró)
const CATEGORIAS_TO_MIGRATE = [
  'EDIFICACIONES',
  'INDUSTRIA',
  'PUENTES_VEHICULARES',
  'PUENTES_PEATONALES',
  'ESCENARIOS_DEPORTIVOS'
]

const CATEGORIA_MAP = {
  'COMERCIAL': 'COMERCIAL',
  'EDIFICACIONES': 'EDIFICACIONES',
  'INDUSTRIA': 'INDUSTRIA',
  'PUENTES_VEHICULARES': 'PUENTES_VEHICULARES',
  'PUENTES_PEATONALES': 'PUENTES_PEATONALES',
  'ESCENARIOS_DEPORTIVOS': 'ESCENARIOS_DEPORTIVOS',
  'OTRO': 'OTRO'
}

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

  const words1 = n1.split(/\s+/).filter(w => w.length > 3)
  const words2 = n2.split(/\s+/).filter(w => w.length > 3)

  if (words1.length >= 2 && words2.length >= 2) {
    const commonWords = words1.filter(w => words2.includes(w))
    if (commonWords.length >= 2) return true
  }

  return false
}

async function migrateCategory(categoryName, adminUser, existingSlugs, hojaVidaProjects) {
  try {
    const categoryEnum = CATEGORIA_MAP[categoryName]

    console.log('\n' + '='.repeat(80))
    console.log(`📦 MIGRANDO CATEGORÍA: ${categoryName}`)
    console.log('='.repeat(80))

    const markdownPath = path.join(__dirname, '..', `CATEGORIA_${categoryName}.md`)

    if (!fs.existsSync(markdownPath)) {
      console.log(`⚠️  Archivo no encontrado: ${markdownPath}. Saltando...`)
      return { success: 0, errors: 0, notFound: 0 }
    }

    const projectNames = extractProjectNamesFromMarkdown(markdownPath)
    console.log(`📄 Encontrados ${projectNames.length} proyectos en markdown`)

    if (projectNames.length === 0) {
      console.log('⚠️  No hay proyectos para migrar')
      return { success: 0, errors: 0, notFound: 0 }
    }

    const migrations = []
    const notFound = []

    for (const projectName of projectNames) {
      const hojaVidaProject = hojaVidaProjects.find(
        (p) =>
          fuzzyMatch(projectName, p.tituloDisplay || '') ||
          fuzzyMatch(projectName, p.objetoContrato || '')
      )

      if (hojaVidaProject) {
        if (hojaVidaProject.proyectoDetalladoId) {
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
      } else {
        notFound.push(projectName)
      }
    }

    console.log(`✅ Proyectos para migrar: ${migrations.length}`)
    console.log(`❌ No encontrados: ${notFound.length}`)

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
        console.log(`  ✅ [${successCount}/${migrations.length}] ${migration.projectData.titulo}`)
      } catch (error) {
        errorCount++
        console.error(`  ❌ Error: ${migration.projectData.titulo} - ${error.message}`)
      }
    }

    console.log(`\n📊 Resultado: ${successCount} creados, ${errorCount} errores, ${notFound.length} no encontrados`)

    return { success: successCount, errors: errorCount, notFound: notFound.length }
  } catch (error) {
    console.error(`❌ Error en categoría ${categoryName}:`, error.message)
    return { success: 0, errors: 1, notFound: 0 }
  }
}

async function migrateAllCategories() {
  try {
    console.log('='.repeat(80))
    console.log('MIGRACIÓN MASIVA DE TODAS LAS CATEGORÍAS')
    console.log('='.repeat(80))
    console.log()

    // Obtener usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!adminUser) {
      throw new Error('No se encontró ningún usuario ADMIN')
    }

    console.log(`👤 Usuario creador: ${adminUser.email}`)

    // Obtener slugs existentes
    const existingProjects = await prisma.proyecto.findMany({
      select: { slug: true },
    })
    const existingSlugs = existingProjects.map((p) => p.slug)

    // Obtener todos los proyectos de hoja de vida una sola vez
    console.log('🔍 Cargando proyectos de ProyectoHojaVida...')
    const hojaVidaProjects = await prisma.proyectoHojaVida.findMany({
      orderBy: { fechaInicio: 'desc' },
    })
    console.log(`✅ ${hojaVidaProjects.length} proyectos cargados\n`)

    const results = {
      total: 0,
      success: 0,
      errors: 0,
      notFound: 0,
      byCategory: {}
    }

    // Migrar cada categoría
    for (const categoria of CATEGORIAS_TO_MIGRATE) {
      const result = await migrateCategory(categoria, adminUser, existingSlugs, hojaVidaProjects)
      results.byCategory[categoria] = result
      results.success += result.success
      results.errors += result.errors
      results.notFound += result.notFound
      results.total += result.success

      // Pequeña pausa entre categorías
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('\n' + '='.repeat(80))
    console.log('✅ MIGRACIÓN COMPLETADA - RESUMEN FINAL')
    console.log('='.repeat(80))
    console.log()
    console.log(`📊 Total proyectos creados: ${results.success}`)
    console.log(`❌ Errores: ${results.errors}`)
    console.log(`⚠️  No encontrados: ${results.notFound}`)
    console.log()
    console.log('Detalle por categoría:')
    console.log('-'.repeat(80))

    for (const [categoria, result] of Object.entries(results.byCategory)) {
      console.log(`  ${categoria}: ${result.success} creados, ${result.errors} errores, ${result.notFound} no encontrados`)
    }

    console.log()
    console.log('='.repeat(80))

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error fatal:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

migrateAllCategories()
