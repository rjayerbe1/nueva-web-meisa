const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function revisarCategorizacion() {
  console.log('='.repeat(80))
  console.log('REVISIÓN COMPLETA DE CATEGORIZACIÓN DE PROYECTOS')
  console.log('='.repeat(80))
  console.log()

  // Obtener todos los proyectos con sus datos completos
  const proyectos = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      cliente: true,
      categoria: true,
      ubicacion: true,
      areaTotal: true,
      toneladas: true,
      presupuesto: true
    },
    orderBy: { categoria: 'asc' }
  })

  console.log(`Total proyectos a revisar: ${proyectos.length}\n`)

  // Agrupar por categoría
  const porCategoria = {
    INDUSTRIAL: [],
    EDIFICACIONES: [],
    PUENTES: [],
    COMERCIAL: [],
    DEPORTES_EDUCACION: [],
    INFRAESTRUCTURA_URBANA: []
  }

  proyectos.forEach(p => {
    if (porCategoria[p.categoria]) {
      porCategoria[p.categoria].push(p)
    }
  })

  // Revisar cada categoría
  for (const [categoria, proyectos] of Object.entries(porCategoria)) {
    console.log('='.repeat(80))
    console.log(`CATEGORÍA: ${categoria} (${proyectos.length} proyectos)`)
    console.log('='.repeat(80))
    console.log()

    proyectos.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.titulo}`)
      console.log(`   Cliente: ${p.cliente || 'N/A'}`)
      console.log(`   Descripción: ${p.descripcion ? p.descripcion.substring(0, 100) + '...' : 'N/A'}`)
      console.log(`   Ubicación: ${p.ubicacion || 'N/A'}`)
      if (p.toneladas) console.log(`   Toneladas: ${p.toneladas}`)
      if (p.areaTotal) console.log(`   Área: ${p.areaTotal} m²`)
      console.log()
    })
  }

  await prisma.$disconnect()
}

revisarCategorizacion()
  .then(() => {
    console.log('✅ Revisión completada')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
