const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function compararEstadoConPlan() {
  try {
    console.log('='.repeat(100))
    console.log('ANÁLISIS: ESTADO ACTUAL VS PLAN DE MIGRACIÓN')
    console.log('='.repeat(100))
    console.log()

    // ============================================
    // 1. VERIFICAR SCHEMA Y ENUM
    // ============================================
    console.log('📋 1. VERIFICACIÓN DE SCHEMA')
    console.log('-'.repeat(100))

    const schemaInfo = await prisma.$queryRaw`
      SELECT
        enumlabel as valor
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'CategoriaEnum'
      ORDER BY e.enumsortorder
    `

    console.log('Categorías en enum CategoriaEnum:')
    schemaInfo.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.valor}`)
    })
    console.log()

    const categoriasEsperadas = [
      'COMERCIAL',
      'INDUSTRIAL',
      'PUENTES',
      'INFRAESTRUCTURA_URBANA',
      'EDIFICACIONES',
      'DEPORTES_EDUCACION'
    ]

    const categoriasActuales = schemaInfo.map(r => r.valor)
    const faltantes = categoriasEsperadas.filter(c => !categoriasActuales.includes(c))
    const sobrantes = categoriasActuales.filter(c => !categoriasEsperadas.includes(c))

    if (faltantes.length === 0) {
      console.log('✅ Schema tiene todas las categorías necesarias')
    } else {
      console.log('❌ Faltan categorías:', faltantes.join(', '))
    }

    if (sobrantes.length > 0) {
      console.log('⚠️  Categorías antiguas aún presentes:', sobrantes.join(', '))
    }
    console.log()

    // ============================================
    // 2. ESTADO DE PROYECTOS POR CATEGORÍA
    // ============================================
    console.log('📊 2. DISTRIBUCIÓN ACTUAL DE PROYECTOS')
    console.log('-'.repeat(100))

    const distribucionActual = await prisma.$queryRaw`
      SELECT
        categoria,
        COUNT(*)::int as total,
        COUNT(CASE WHEN cliente LIKE '%Consorcio Cine Cultura%' THEN 1 END)::int as problematicos
      FROM proyectos
      GROUP BY categoria
      ORDER BY total DESC
    `

    console.log('Categoría              | Total | Problemáticos | Válidos')
    console.log('-'.repeat(70))

    let totalProyectos = 0
    let totalProblematicos = 0

    distribucionActual.forEach(row => {
      const validos = row.total - row.problematicos
      const pad = ' '.repeat(22 - row.categoria.length)
      console.log(`${row.categoria}${pad} | ${row.total.toString().padStart(5)} | ${row.problematicos.toString().padStart(13)} | ${validos.toString().padStart(7)}`)
      totalProyectos += row.total
      totalProblematicos += row.problematicos
    })

    console.log('-'.repeat(70))
    console.log(`TOTAL:                    ${totalProyectos.toString().padStart(5)} | ${totalProblematicos.toString().padStart(13)} | ${(totalProyectos - totalProblematicos).toString().padStart(7)}`)
    console.log()

    // ============================================
    // 3. COMPARAR CON PLAN
    // ============================================
    console.log('🎯 3. COMPARACIÓN CON PLAN DE MIGRACIÓN')
    console.log('-'.repeat(100))

    const planEsperado = {
      'COMERCIAL': 55,
      'INDUSTRIAL': 70,
      'PUENTES': 50,
      'INFRAESTRUCTURA_URBANA': 8,
      'EDIFICACIONES': 42,
      'DEPORTES_EDUCACION': 35
    }

    console.log('Categoría              | Esperado | Actual | Diferencia | Estado')
    console.log('-'.repeat(80))

    let totalEsperado = 0
    for (const [cat, esperado] of Object.entries(planEsperado)) {
      const actual = distribucionActual.find(d => d.categoria === cat)
      const actualCount = actual ? actual.total : 0
      const diff = actualCount - esperado
      const status = diff === 0 ? '✅' : (diff > 0 ? '⚠️ +' : '❌')

      const pad = ' '.repeat(22 - cat.length)
      console.log(`${cat}${pad} | ${esperado.toString().padStart(8)} | ${actualCount.toString().padStart(6)} | ${diff.toString().padStart(10)} | ${status}`)

      totalEsperado += esperado
    }

    console.log('-'.repeat(80))
    console.log(`TOTAL:                    ${totalEsperado.toString().padStart(8)} | ${totalProyectos.toString().padStart(6)} | ${(totalProyectos - totalEsperado).toString().padStart(10)}`)
    console.log()

    // ============================================
    // 4. CATEGORÍAS QUE NECESITAN RECLASIFICACIÓN
    // ============================================
    console.log('🔄 4. NECESIDADES DE RECLASIFICACIÓN')
    console.log('-'.repeat(100))

    // Verificar si existen proyectos con categorías antiguas
    const categoriasAntiguas = [
      'PUENTES_VEHICULARES',
      'PUENTES_PEATONALES',
      'ESCENARIOS_DEPORTIVOS',
      'INDUSTRIA',
      'CUBIERTAS_Y_FACHADAS',
      'ESTRUCTURAS_MODULARES',
      'OTRO'
    ]

    let necesitaReclasificacion = false
    for (const catAntigua of categoriasAntiguas) {
      const count = await prisma.proyecto.count({
        where: { categoria: catAntigua }
      })

      if (count > 0) {
        console.log(`⚠️  ${count} proyectos con categoría antigua: ${catAntigua}`)
        necesitaReclasificacion = true
      }
    }

    if (!necesitaReclasificacion) {
      console.log('✅ No hay proyectos con categorías antiguas')
    }
    console.log()

    // ============================================
    // 5. PROYECTOS PROBLEMÁTICOS DETALLADOS
    // ============================================
    console.log('❌ 5. PROYECTOS PROBLEMÁTICOS (primeros 10)')
    console.log('-'.repeat(100))

    const problematicos = await prisma.proyecto.findMany({
      where: {
        cliente: { contains: 'Consorcio Cine Cultura' }
      },
      select: {
        id: true,
        titulo: true,
        categoria: true,
        cliente: true,
        toneladas: true,
        ubicacion: true
      },
      take: 10
    })

    problematicos.forEach((p, idx) => {
      console.log(`${idx + 1}. [${p.categoria}] ${p.titulo}`)
      console.log(`   Cliente: ${p.cliente}`)
      console.log(`   Ubicación: ${p.ubicacion}`)
      console.log(`   Toneladas: ${p.toneladas || 'N/A'}`)
      console.log()
    })

    // ============================================
    // 6. DUPLICADOS
    // ============================================
    console.log('🔗 6. PROYECTOS DUPLICADOS')
    console.log('-'.repeat(100))

    const duplicados = await prisma.$queryRaw`
      WITH titulo_normalizado AS (
        SELECT
          id,
          titulo,
          cliente,
          categoria,
          LOWER(REGEXP_REPLACE(titulo, '[^a-zA-Z0-9]', '', 'g')) as titulo_norm
        FROM proyectos
      ),
      grupos_duplicados AS (
        SELECT titulo_norm, COUNT(*) as total
        FROM titulo_normalizado
        GROUP BY titulo_norm
        HAVING COUNT(*) > 1
      )
      SELECT
        t.titulo,
        t.cliente,
        t.categoria,
        g.total as grupo_total
      FROM titulo_normalizado t
      INNER JOIN grupos_duplicados g ON t.titulo_norm = g.titulo_norm
      ORDER BY g.total DESC, t.titulo
      LIMIT 20
    `

    if (duplicados.length > 0) {
      console.log(`Se encontraron ${duplicados.length / 2} grupos de duplicados:\n`)
      let currentGroup = null
      duplicados.forEach((p, idx) => {
        if (p.titulo !== currentGroup) {
          console.log(`\n📌 Grupo ${Math.floor(idx / 2) + 1}:`)
          currentGroup = p.titulo
        }
        console.log(`  - [${p.categoria}] ${p.titulo}`)
        console.log(`    Cliente: ${p.cliente}`)
      })
    } else {
      console.log('✅ No se encontraron duplicados')
    }
    console.log()

    // ============================================
    // 7. RESUMEN Y RECOMENDACIONES
    // ============================================
    console.log('='.repeat(100))
    console.log('📝 7. RESUMEN Y RECOMENDACIONES')
    console.log('='.repeat(100))
    console.log()

    console.log('Estado actual:')
    console.log(`  ✅ Schema tiene categorías correctas: ${faltantes.length === 0 ? 'SÍ' : 'NO'}`)
    console.log(`  ✅ Proyectos válidos (con datos reales): ${totalProyectos - totalProblematicos}`)
    console.log(`  ❌ Proyectos problemáticos (placeholder): ${totalProblematicos}`)
    console.log(`  ⚠️  Necesita reclasificación: ${necesitaReclasificacion ? 'SÍ' : 'NO'}`)
    console.log()

    console.log('Acciones necesarias:')
    console.log()
    console.log('  1. 🧹 LIMPIAR: Eliminar ' + totalProblematicos + ' proyectos con datos placeholder')
    console.log('  2. 🔗 DEDUPLICAR: Eliminar duplicados y dejar solo versiones vinculadas')

    if (necesitaReclasificacion) {
      console.log('  3. 🔄 RECLASIFICAR: Migrar proyectos de categorías antiguas a nuevas')
    }

    console.log('  4. ✅ VERIFICAR: Confirmar que distribución coincide con plan')
    console.log('  5. 📊 ACTUALIZAR: Contadores en tabla CategoriaProyecto')
    console.log()

    console.log('='.repeat(100))
    console.log('✅ ANÁLISIS COMPLETADO')
    console.log('='.repeat(100))

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

compararEstadoConPlan()
