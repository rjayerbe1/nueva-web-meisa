const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verifyAllCategories() {
  try {
    console.log('='.repeat(80))
    console.log('REPORTE FINAL - TODOS LOS PROYECTOS MIGRADOS')
    console.log('='.repeat(80))
    console.log()

    // Estadísticas globales
    const totalProyectos = await prisma.proyecto.count()
    const totalHojaVida = await prisma.proyectoHojaVida.count()
    const vinculados = await prisma.proyectoHojaVida.count({
      where: { proyectoDetalladoId: { not: null } }
    })

    console.log('📊 ESTADÍSTICAS GLOBALES')
    console.log('-'.repeat(80))
    console.log(`Total proyectos en Proyecto:              ${totalProyectos}`)
    console.log(`Total proyectos en ProyectoHojaVida:      ${totalHojaVida}`)
    console.log(`Proyectos vinculados (migrados):          ${vinculados}`)
    console.log(`Tasa de migración:                        ${((vinculados / totalHojaVida) * 100).toFixed(1)}%`)
    console.log()

    // Estadísticas por categoría
    const categorias = [
      'COMERCIAL',
      'EDIFICACIONES',
      'INDUSTRIA',
      'PUENTES_VEHICULARES',
      'PUENTES_PEATONALES',
      'ESCENARIOS_DEPORTIVOS'
    ]

    console.log('📦 ESTADÍSTICAS POR CATEGORÍA')
    console.log('-'.repeat(80))

    const statsPerCategory = []

    for (const categoria of categorias) {
      const count = await prisma.proyecto.count({
        where: { categoria }
      })

      const stats = await prisma.proyecto.aggregate({
        where: { categoria },
        _sum: {
          toneladas: true,
          areaTotal: true,
          presupuesto: true
        }
      })

      statsPerCategory.push({
        categoria,
        count,
        toneladas: stats._sum.toneladas || 0,
        area: stats._sum.areaTotal || 0,
        presupuesto: stats._sum.presupuesto || 0
      })

      console.log()
      console.log(`${categoria}:`)
      console.log(`  Proyectos:     ${count}`)
      console.log(`  Toneladas:     ${(stats._sum.toneladas || 0).toFixed(2)} ton`)
      console.log(`  Área total:    ${(stats._sum.areaTotal || 0).toFixed(2)} m²`)
      console.log(`  Presupuesto:   $${(stats._sum.presupuesto || 0).toLocaleString('es-CO')} COP`)
    }

    console.log()
    console.log('='.repeat(80))
    console.log('📈 TOTALES ACUMULADOS (TODAS LAS CATEGORÍAS)')
    console.log('='.repeat(80))

    const totalStats = statsPerCategory.reduce((acc, cat) => ({
      count: acc.count + cat.count,
      toneladas: acc.toneladas + Number(cat.toneladas),
      area: acc.area + Number(cat.area),
      presupuesto: acc.presupuesto + Number(cat.presupuesto)
    }), { count: 0, toneladas: 0, area: 0, presupuesto: 0 })

    console.log(`Total proyectos:                          ${totalStats.count}`)
    console.log(`Total toneladas:                          ${Number(totalStats.toneladas).toFixed(2)} ton`)
    console.log(`Total área construida:                    ${Number(totalStats.area).toFixed(2)} m²`)
    console.log(`Total presupuesto:                        $${Number(totalStats.presupuesto).toLocaleString('es-CO')} COP`)
    console.log()

    // Top 10 proyectos por tonelaje
    console.log('='.repeat(80))
    console.log('🏆 TOP 10 PROYECTOS POR TONELAJE')
    console.log('='.repeat(80))

    const topProjects = await prisma.proyecto.findMany({
      where: {
        toneladas: { not: null }
      },
      orderBy: { toneladas: 'desc' },
      take: 10,
      select: {
        titulo: true,
        categoria: true,
        toneladas: true,
        cliente: true,
        ubicacion: true
      }
    })

    topProjects.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.titulo}`)
      console.log(`   Categoría: ${p.categoria} | Toneladas: ${p.toneladas?.toFixed(2)} ton`)
      console.log(`   Cliente: ${p.cliente}`)
      console.log(`   Ubicación: ${p.ubicacion}`)
      console.log()
    })

    // Distribución por estado
    console.log('='.repeat(80))
    console.log('📊 DISTRIBUCIÓN POR ESTADO')
    console.log('='.repeat(80))

    const estados = await prisma.proyecto.groupBy({
      by: ['estado'],
      _count: { id: true }
    })

    estados.forEach(e => {
      console.log(`${e.estado}: ${e._count.id} proyectos`)
    })

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

verifyAllCategories()
