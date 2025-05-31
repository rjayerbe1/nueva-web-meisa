import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeExactDuplicates() {
  console.log('🔍 ELIMINANDO DUPLICADOS EXACTOS...\n')

  // Pares de duplicados a eliminar (mantener el primero, eliminar el segundo)
  const duplicatePairs = [
    // Centro Comerciales
    ['Centro Paseo Villa Del Rio', 'Paseo Villa del Río'],
    
    // Edificios
    ['Clinica Reina Victoria', 'Clínica Reina Victoria'],
    ['Estacion Mio Guadalupe', 'Estación MIO Guadalupe'],
    ['Bomberos Popayan', 'Estación de Bomberos Popayán'],
    ['Modulos Medicos', 'Módulos Médicos'],
    ['Terminal Intermedio Mio Cali', 'Terminal Intermedio MIO'],
    
    // Industria
    ['Ampliacion Cargill', 'Ampliación Cargill'],
    ['Bodega Duplex', 'Bodega Duplex Ingeniería'],
    ['Torre Cogeneracion Propal', 'Torre Cogeneración Propal'],
    
    // Escenarios Deportivos
    ['Cecun', 'CECUN (Universidad del Cauca)'],
    ['Coliseo De Artes Marciales', 'Coliseo de Artes Marciales Nacionales 2012'],
    
    // Puentes Peatonales
    ['La 63 Cali', 'Puente Peatonal La 63']
  ]

  console.log(`🎯 Eliminando ${duplicatePairs.length} duplicados específicos...`)

  for (const [keep, remove] of duplicatePairs) {
    try {
      // Buscar el proyecto a eliminar
      const projectToDelete = await prisma.proyecto.findFirst({
        where: { titulo: remove }
      })

      if (projectToDelete) {
        // Eliminar sus imágenes primero
        await prisma.imagenProyecto.deleteMany({
          where: { proyectoId: projectToDelete.id }
        })

        // Eliminar el proyecto
        await prisma.proyecto.delete({
          where: { id: projectToDelete.id }
        })

        console.log(`   ✅ Eliminado: "${remove}" (manteniendo "${keep}")`)
      } else {
        console.log(`   ⚠️  No encontrado: "${remove}"`)
      }
    } catch (error) {
      console.log(`   ❌ Error eliminando "${remove}": ${error}`)
    }
  }

  // Eliminar proyectos con muy pocas imágenes o nombres problemáticos
  const lowQualityProjects = await prisma.proyecto.findMany({
    where: {
      OR: [
        { titulo: { in: ['Tequendama', 'Terminal'] } }, // Muy genéricos
        { 
          AND: [
            { _count: { imagenes: { lt: 2 } } },
            { titulo: { contains: 'Coliseo' } }
          ]
        }
      ]
    },
    include: {
      _count: {
        select: { imagenes: true }
      }
    }
  })

  if (lowQualityProjects.length > 0) {
    console.log(`\n🧹 Eliminando ${lowQualityProjects.length} proyectos de baja calidad...`)
    
    for (const project of lowQualityProjects) {
      await prisma.imagenProyecto.deleteMany({
        where: { proyectoId: project.id }
      })

      await prisma.proyecto.delete({
        where: { id: project.id }
      })

      console.log(`   🗑️  Eliminado: "${project.titulo}" (${project._count.imagenes} img)`)
    }
  }

  // Estadísticas finales
  const finalProjects = await prisma.proyecto.findMany({
    select: {
      titulo: true,
      categoria: true,
      _count: {
        select: { imagenes: true }
      }
    },
    orderBy: [
      { categoria: 'asc' },
      { titulo: 'asc' }
    ]
  })

  const finalByCategory = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: true
  })

  console.log(`\n🎉 LIMPIEZA DE DUPLICADOS COMPLETADA!`)
  console.log(`   📊 Proyectos finales: ${finalProjects.length}`)
  console.log(`   📋 Por categoría:`)
  
  finalByCategory.forEach(cat => {
    console.log(`      ${cat.categoria}: ${cat._count}`)
  })

  if (finalProjects.length <= 55) {
    console.log(`\n✅ PROYECTOS FINALES (${finalProjects.length}):`)
    finalProjects.forEach(p => {
      console.log(`   📂 ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
    })
  }

  await prisma.$disconnect()
}

removeExactDuplicates().catch(console.error)