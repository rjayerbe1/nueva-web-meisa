const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function limpiarProyectosProblematicos() {
  console.log('='.repeat(80))
  console.log('PASO 1: LIMPIAR PROYECTOS PROBLEMÁTICOS')
  console.log('='.repeat(80))
  console.log()

  // 1. Contar proyectos problemáticos
  console.log('🔍 Identificando proyectos problemáticos...\n')

  const problematicos = await prisma.proyecto.findMany({
    where: {
      OR: [
        { cliente: { contains: 'Consorcio Cine Cultura' } },
        { toneladas: 490 },
        { ubicacion: 'Bogotá, Cundinamarca' }
      ]
    },
    select: {
      id: true,
      titulo: true,
      cliente: true,
      categoria: true,
      hojaVida: { select: { id: true } }
    }
  })

  console.log(`Total proyectos problemáticos encontrados: ${problematicos.length}`)
  console.log()

  // Mostrar algunos ejemplos
  console.log('📋 Ejemplos de proyectos a eliminar:')
  problematicos.slice(0, 5).forEach((p, idx) => {
    const vinculado = p.hojaVida ? '🔗' : '  '
    console.log(`${vinculado} ${idx + 1}. [${p.categoria}] ${p.titulo}`)
    console.log(`   Cliente: ${p.cliente}`)
  })

  if (problematicos.length > 5) {
    console.log(`   ... y ${problematicos.length - 5} proyectos más`)
  }
  console.log()

  // 2. Buscar duplicados
  console.log('🔍 Identificando duplicados...\n')

  const todos = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      cliente: true,
      categoria: true,
      hojaVida: { select: { id: true } }
    }
  })

  // Agrupar por título normalizado
  const grupos = {}
  todos.forEach(p => {
    const normalizado = p.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')

    if (!grupos[normalizado]) grupos[normalizado] = []
    grupos[normalizado].push(p)
  })

  // Encontrar duplicados
  const duplicados = Object.values(grupos).filter(g => g.length > 1)

  console.log(`Grupos de duplicados encontrados: ${duplicados.length}`)

  if (duplicados.length > 0) {
    console.log('\n📋 Duplicados detectados:')
    duplicados.forEach((grupo, idx) => {
      console.log(`\nGrupo ${idx + 1}:`)
      grupo.forEach(p => {
        const vinculado = p.hojaVida ? '🔗 (vinculado)' : '   (sin vincular)'
        console.log(`  ${vinculado} ${p.titulo}`)
      })
    })
  }
  console.log()

  // 3. Determinar qué eliminar
  const idsAEliminar = new Set()

  // Agregar todos los problemáticos
  problematicos.forEach(p => idsAEliminar.add(p.id))

  // Para duplicados, mantener solo el vinculado o el primero
  duplicados.forEach(grupo => {
    // Ordenar: primero vinculados, luego por fecha de creación
    const ordenado = grupo.sort((a, b) => {
      if (a.hojaVida && !b.hojaVida) return -1
      if (!a.hojaVida && b.hojaVida) return 1
      return 0
    })

    // Mantener el primero, eliminar el resto
    for (let i = 1; i < ordenado.length; i++) {
      idsAEliminar.add(ordenado[i].id)
    }
  })

  console.log('='.repeat(80))
  console.log('RESUMEN DE LIMPIEZA:')
  console.log('='.repeat(80))
  console.log(`Total proyectos a eliminar: ${idsAEliminar.size}`)
  console.log(`  - Problemáticos: ${problematicos.length}`)
  console.log(`  - Duplicados: ${idsAEliminar.size - problematicos.length}`)
  console.log()

  // 4. EJECUTAR LIMPIEZA
  console.log('🗑️  Eliminando proyectos...')

  const resultado = await prisma.proyecto.deleteMany({
    where: {
      id: { in: Array.from(idsAEliminar) }
    }
  })

  console.log(`✅ ${resultado.count} proyectos eliminados exitosamente`)
  console.log()

  // 5. Verificar estado final
  const totalRestante = await prisma.proyecto.count()
  console.log('📊 Estado después de limpieza:')
  console.log(`   Proyectos restantes: ${totalRestante}`)
  console.log()

  console.log('='.repeat(80))
  console.log('✅ PASO 1 COMPLETADO')
  console.log('='.repeat(80))
  console.log()

  await prisma.$disconnect()
  return { eliminados: resultado.count, restantes: totalRestante }
}

limpiarProyectosProblematicos()
  .then(result => {
    console.log(`✅ Limpieza completada: ${result.eliminados} eliminados, ${result.restantes} restantes`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
