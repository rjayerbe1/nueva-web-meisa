import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function finalProjectCount() {
  console.log('📊 CONTEO FINAL DE PROYECTOS...\n')

  // Obtener todos los proyectos finales
  const finalProjects = await prisma.proyecto.findMany({
    select: {
      id: true,
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

  console.log(`🎉 PROYECTOS FINALES: ${finalProjects.length}`)
  console.log(`📋 Por categoría:`)
  
  finalByCategory.forEach(cat => {
    console.log(`   ${cat.categoria}: ${cat._count}`)
  })

  console.log(`\n✅ LISTA COMPLETA DE PROYECTOS:`)
  finalProjects.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
  })

  // Eliminar proyectos genéricos restantes si los hay
  const genericProjects = finalProjects.filter(p => 
    p.titulo === 'Tequendama' || 
    p.titulo === 'Terminal' ||
    (p.titulo.includes('Coliseo') && p._count.imagenes < 2)
  )

  if (genericProjects.length > 0) {
    console.log(`\n🧹 Eliminando ${genericProjects.length} proyectos genéricos restantes...`)
    
    for (const project of genericProjects) {
      await prisma.imagenProyecto.deleteMany({
        where: { proyectoId: project.id }
      })

      await prisma.proyecto.delete({
        where: { id: project.id }
      })

      console.log(`   🗑️  Eliminado: "${project.titulo}"`)
    }

    // Reconteo final
    const trueFinalCount = await prisma.proyecto.count()
    console.log(`\n🎯 CONTEO VERDADERAMENTE FINAL: ${trueFinalCount} proyectos`)
  }

  await prisma.$disconnect()
}

finalProjectCount().catch(console.error)