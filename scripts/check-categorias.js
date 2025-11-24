const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

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

async function checkCategorias() {
  try {
    console.log('='.repeat(80))
    console.log('VERIFICACIÓN DE PROYECTOS POR CATEGORÍA')
    console.log('='.repeat(80))
    console.log()

    const categorias = [
      { name: 'COMERCIAL', file: 'CATEGORIA_COMERCIAL.md' },
      { name: 'EDIFICACIONES', file: 'CATEGORIA_EDIFICACIONES.md' },
      { name: 'INDUSTRIA', file: 'CATEGORIA_INDUSTRIA.md' },
      { name: 'PUENTES_VEHICULARES', file: 'CATEGORIA_PUENTES_VEHICULARES.md' },
      { name: 'PUENTES_PEATONALES', file: 'CATEGORIA_PUENTES_PEATONALES.md' },
      { name: 'ESCENARIOS_DEPORTIVOS', file: 'CATEGORIA_ESCENARIOS_DEPORTIVOS.md' }
    ]

    let totalEnMarkdown = 0
    let totalEnDB = 0
    let totalMigrados = 0

    for (const categoria of categorias) {
      // Contar en markdown
      const markdownPath = path.join(__dirname, '..', categoria.file)
      let proyectosEnMarkdown = 0

      if (fs.existsSync(markdownPath)) {
        const projectNames = extractProjectNamesFromMarkdown(markdownPath)
        proyectosEnMarkdown = projectNames.length
      }

      // Contar en base de datos
      const proyectosEnDB = await prisma.proyecto.count({
        where: { categoria: categoria.name }
      })

      // Contar migrados desde hoja de vida
      const proyectosMigrados = await prisma.proyecto.count({
        where: {
          categoria: categoria.name,
          hojaVida: { isNot: null }
        }
      })

      totalEnMarkdown += proyectosEnMarkdown
      totalEnDB += proyectosEnDB
      totalMigrados += proyectosMigrados

      // Determinar estado
      let estado = '✅'
      let nota = ''

      if (proyectosEnDB === 0) {
        estado = '❌'
        nota = ' - NO HAY PROYECTOS EN DB'
      } else if (proyectosEnDB < proyectosEnMarkdown / 2) {
        estado = '⚠️'
        nota = ' - PARECE INCOMPLETO'
      }

      console.log(`${estado} ${categoria.name}`)
      console.log(`   Esperados (markdown):  ${proyectosEnMarkdown} proyectos`)
      console.log(`   En base de datos:      ${proyectosEnDB} proyectos`)
      console.log(`   Diferencia:            ${proyectosEnDB - proyectosEnMarkdown}${nota}`)
      console.log()
    }

    console.log('='.repeat(80))
    console.log('RESUMEN TOTAL')
    console.log('='.repeat(80))
    console.log(`Total esperado (markdown):    ${totalEnMarkdown} proyectos`)
    console.log(`Total en base de datos:       ${totalEnDB} proyectos`)
    console.log(`Diferencia:                   ${totalEnDB - totalEnMarkdown}`)
    console.log()

    // Listar proyectos de cada categoría
    console.log('='.repeat(80))
    console.log('LISTA DETALLADA DE PROYECTOS POR CATEGORÍA')
    console.log('='.repeat(80))

    for (const categoria of categorias) {
      console.log()
      console.log(`📦 ${categoria.name}:`)
      console.log('-'.repeat(80))

      const proyectos = await prisma.proyecto.findMany({
        where: { categoria: categoria.name },
        orderBy: { fechaInicio: 'desc' },
        select: {
          titulo: true,
          cliente: true,
          toneladas: true,
          fechaInicio: true,
          slug: true
        }
      })

      if (proyectos.length === 0) {
        console.log('  (sin proyectos)')
      } else {
        proyectos.forEach((p, idx) => {
          const year = new Date(p.fechaInicio).getFullYear()
          const tons = p.toneladas ? `${Number(p.toneladas).toFixed(1)} ton` : 'N/A'
          console.log(`  ${idx + 1}. [${year}] ${p.titulo} - ${tons}`)
        })
      }
    }

    console.log()
    console.log('='.repeat(80))
    console.log('✅ VERIFICACIÓN COMPLETADA')
    console.log('='.repeat(80))

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkCategorias()
