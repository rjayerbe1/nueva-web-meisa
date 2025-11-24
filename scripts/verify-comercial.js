const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verifyComercialProjects() {
  try {
    console.log('='.repeat(80))
    console.log('VERIFICACIÓN DE PROYECTOS COMERCIALES MIGRADOS')
    console.log('='.repeat(80))
    console.log()

    // Contar proyectos comerciales
    const totalComercial = await prisma.proyecto.count({
      where: { categoria: 'COMERCIAL' }
    })

    // Estadísticas agregadas
    const stats = await prisma.proyecto.aggregate({
      where: { categoria: 'COMERCIAL' },
      _sum: {
        toneladas: true,
        areaTotal: true,
        presupuesto: true
      },
      _count: {
        id: true
      }
    })

    // Proyectos visibles y destacados
    const visibles = await prisma.proyecto.count({
      where: { categoria: 'COMERCIAL', visible: true }
    })

    const destacados = await prisma.proyecto.count({
      where: { categoria: 'COMERCIAL', destacado: true }
    })

    // Últimos 10 proyectos creados
    const recientes = await prisma.proyecto.findMany({
      where: { categoria: 'COMERCIAL' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        titulo: true,
        cliente: true,
        toneladas: true,
        areaTotal: true,
        slug: true,
        createdAt: true
      }
    })

    // Proyectos vinculados a hoja de vida
    const vinculados = await prisma.proyectoHojaVida.count({
      where: {
        proyectoDetalladoId: { not: null }
      }
    })

    console.log('📊 ESTADÍSTICAS GENERALES')
    console.log('-'.repeat(80))
    console.log(`Total proyectos COMERCIAL:     ${totalComercial}`)
    console.log(`Proyectos visibles:             ${visibles}`)
    console.log(`Proyectos destacados:           ${destacados}`)
    console.log(`Proyectos vinculados (HojaVida):${vinculados}`)
    console.log()

    console.log('💰 TOTALES ACUMULADOS')
    console.log('-'.repeat(80))
    console.log(`Toneladas totales:              ${stats._sum.toneladas?.toFixed(2) || 0} ton`)
    console.log(`Área total:                     ${stats._sum.areaTotal?.toFixed(2) || 0} m²`)
    console.log(`Presupuesto total:              $${stats._sum.presupuesto?.toLocaleString() || 0} COP`)
    console.log()

    console.log('📋 ÚLTIMOS 10 PROYECTOS CREADOS')
    console.log('-'.repeat(80))
    recientes.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.titulo}`)
      console.log(`   Cliente: ${p.cliente}`)
      console.log(`   Toneladas: ${p.toneladas?.toFixed(2) || 'N/A'} ton | Área: ${p.areaTotal || 'N/A'} m²`)
      console.log(`   Slug: ${p.slug}`)
      console.log(`   Creado: ${p.createdAt.toISOString().split('T')[0]}`)
      console.log()
    })

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

verifyComercialProjects()
