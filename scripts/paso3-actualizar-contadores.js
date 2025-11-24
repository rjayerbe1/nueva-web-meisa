const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function actualizarContadores() {
  console.log('='.repeat(80))
  console.log('PASO 3: ACTUALIZAR CONTADORES DE CATEGORÍAS')
  console.log('='.repeat(80))
  console.log()

  // 1. Contar proyectos por categoría
  console.log('📊 Contando proyectos por categoría...\n')

  const proyectosPorCategoria = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: { _all: true }
  })

  console.log('Distribución actual:')
  console.log('-'.repeat(80))

  let totalProyectos = 0
  const contadores = {}

  for (const item of proyectosPorCategoria) {
    const count = item._count._all
    contadores[item.categoria] = count
    totalProyectos += count
    console.log(`  ${item.categoria}: ${count} proyectos`)
  }

  console.log('-'.repeat(80))
  console.log(`  TOTAL: ${totalProyectos} proyectos`)
  console.log()

  // 2. Actualizar en tabla CategoriaProyecto
  console.log('🔄 Actualizando contadores en CategoriaProyecto...\n')

  for (const [categoria, total] of Object.entries(contadores)) {
    const resultado = await prisma.categoriaProyecto.updateMany({
      where: { key: categoria },
      data: { totalProyectos: total }
    })

    if (resultado.count > 0) {
      console.log(`  ✅ ${categoria}: ${total} proyectos`)
    } else {
      console.log(`  ⚠️  ${categoria}: categoría no encontrada en CategoriaProyecto`)
    }
  }

  console.log()

  // 3. Verificar que todas las categorías estén actualizadas
  console.log('✅ Verificando categorías...\n')

  const categorias = await prisma.categoriaProyecto.findMany({
    orderBy: { orden: 'asc' }
  })

  console.log('Estado final de categorías:')
  console.log('-'.repeat(80))
  console.log('Categoría              | Contador | Visible | Destacada')
  console.log('-'.repeat(80))

  categorias.forEach(cat => {
    const pad = ' '.repeat(22 - cat.nombre.length)
    const visible = cat.visible ? '✅' : '❌'
    const destacada = cat.destacada ? '⭐' : '  '
    console.log(`${cat.nombre}${pad} | ${String(cat.totalProyectos).padStart(8)} | ${visible}      | ${destacada}`)
  })

  console.log('-'.repeat(80))
  console.log()

  console.log('='.repeat(80))
  console.log('✅ PASO 3 COMPLETADO')
  console.log('='.repeat(80))
  console.log()

  await prisma.$disconnect()
  return { totalProyectos, contadores, categorias: categorias.length }
}

actualizarContadores()
  .then(result => {
    console.log(`✅ Contadores actualizados: ${result.totalProyectos} proyectos en ${result.categorias} categorías`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
