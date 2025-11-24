const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function resumenCategorias() {
  try {
    console.log('='.repeat(100))
    console.log('RESUMEN DE CATEGORÍAS ACTUALES EN LA BASE DE DATOS')
    console.log('='.repeat(100))
    console.log()

    // Obtener todos los proyectos agrupados por categoría
    const proyectosPorCategoria = await prisma.$queryRaw`
      SELECT
        categoria,
        COUNT(*)::int as total,
        SUM(toneladas)::numeric as toneladas_total,
        SUM("areaTotal")::numeric as area_total
      FROM proyectos
      GROUP BY categoria
      ORDER BY total DESC
    `

    let totalGlobal = 0
    let tonelajeGlobal = 0
    let areaGlobal = 0

    console.log('📊 DISTRIBUCIÓN ACTUAL:')
    console.log('-'.repeat(100))
    console.log()

    for (const cat of proyectosPorCategoria) {
      const tons = cat.toneladas_total ? Number(cat.toneladas_total).toFixed(1) : '0.0'
      const area = cat.area_total ? Number(cat.area_total).toFixed(0) : '0'

      console.log(`📦 ${cat.categoria}:`)
      console.log(`   Proyectos: ${cat.total}`)
      console.log(`   Toneladas: ${tons} ton`)
      console.log(`   Área: ${area} m²`)
      console.log()

      totalGlobal += cat.total
      tonelajeGlobal += Number(cat.toneladas_total || 0)
      areaGlobal += Number(cat.area_total || 0)
    }

    console.log('='.repeat(100))
    console.log('📈 TOTALES:')
    console.log(`   Total proyectos: ${totalGlobal}`)
    console.log(`   Total toneladas: ${tonelajeGlobal.toFixed(1)} ton`)
    console.log(`   Total área: ${areaGlobal.toFixed(0)} m²`)
    console.log()

    // Identificar proyectos con problemas
    console.log('='.repeat(100))
    console.log('⚠️  ANÁLISIS DE PROBLEMAS:')
    console.log('-'.repeat(100))
    console.log()

    // Proyectos con 490 toneladas (placeholder incorrecto)
    const con490 = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total
      FROM proyectos
      WHERE toneladas = 490
    `
    console.log(`🔴 Proyectos con 490 ton (dato incorrecto placeholder): ${con490[0].total}`)

    // Proyectos duplicados
    const duplicados = await prisma.$queryRaw`
      WITH titulo_normalizado AS (
        SELECT
          id,
          titulo,
          LOWER(REGEXP_REPLACE(titulo, '[^a-zA-Z0-9]', '', 'g')) as titulo_norm
        FROM proyectos
      )
      SELECT COUNT(*)::int as total_duplicados
      FROM (
        SELECT titulo_norm
        FROM titulo_normalizado
        GROUP BY titulo_norm
        HAVING COUNT(*) > 1
      ) dups
    `
    console.log(`🔴 Grupos de títulos duplicados: ${duplicados[0].total_duplicados}`)

    // Proyectos sin cliente real
    const sinCliente = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total
      FROM proyectos
      WHERE cliente LIKE '%Consorcio Cine Cultura%'
    `
    console.log(`🔴 Proyectos con cliente placeholder (Consorcio Cine Cultura): ${sinCliente[0].total}`)

    // Proyectos sin ubicación válida
    const sinUbicacion = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total
      FROM proyectos
      WHERE ubicacion = 'Bogotá, Cundinamarca' AND cliente LIKE '%Consorcio Cine Cultura%'
    `
    console.log(`🔴 Proyectos con ubicación placeholder: ${sinUbicacion[0].total}`)

    console.log()

    // Proyectos buenos (vinculados con hoja de vida)
    const proyectosBuenos = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total
      FROM proyectos p
      INNER JOIN proyectos_hoja_vida phv ON phv."proyectoDetalladoId" = p.id
    `
    console.log(`✅ Proyectos VÁLIDOS (vinculados con datos reales): ${proyectosBuenos[0].total}`)

    const proyectosMalos = totalGlobal - proyectosBuenos[0].total
    console.log(`❌ Proyectos PROBLEMÁTICOS (sin datos reales): ${proyectosMalos}`)

    console.log()
    console.log('='.repeat(100))
    console.log('🎯 MAPEO PARA NUEVAS CATEGORÍAS:')
    console.log('-'.repeat(100))
    console.log()
    console.log('Categorías actuales → Categorías propuestas:')
    console.log()
    console.log('  COMERCIAL (68) → COMERCIAL')
    console.log('  EDIFICACIONES (16) → EDIFICACIONES')
    console.log('  INDUSTRIA → INDUSTRIAL')
    console.log('  PUENTES_VEHICULARES → PUENTES')
    console.log('  PUENTES_PEATONALES → PUENTES')
    console.log('  ESCENARIOS_DEPORTIVOS → DEPORTES_EDUCACION')
    console.log()

    console.log('Nueva estructura propuesta:')
    console.log('  1. COMERCIAL')
    console.log('  2. INDUSTRIAL')
    console.log('  3. PUENTES (vehiculares + peatonales + viaductos)')
    console.log('  4. INFRAESTRUCTURA_URBANA (transporte, servicios)')
    console.log('  5. EDIFICACIONES')
    console.log('  6. DEPORTES_EDUCACION')
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

resumenCategorias()
