import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function finalCleanupProjects() {
  console.log('🎯 LIMPIEZA FINAL - ELIMINANDO PROYECTOS GENÉRICOS...\n')

  // Proyectos genéricos que definitivamente NO son proyectos reales
  const genericToDelete = [
    // Números puros
    '1', '2', '3', '4', '5', '6', '7', '8',
    // Años
    '2023', '2024',
    // Términos genéricos
    'Un', 'Cinemateca', 'Comfacauca', 'Ingenieria', 'Javeriana', 
    'Mio', 'Monserrat', 'Paseo', 'Puente',
    // Títulos que no son proyectos específicos
    'Estructuras Modulares Cocinas Ocultas',
    'Puentes Peatonales Escalinata Curva Rio Cali',
    'Escenarios Deportivos Complejo Acuatico Popayan',
    'Edificios Cinemateca Distrital',
    'Oil And Gas Tanque Pulmon'
  ]

  console.log(`🎯 Proyectos genéricos a eliminar: ${genericToDelete.length}`)

  // Obtener proyectos actuales
  const allProjects = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      slug: true,
      categoria: true,
      _count: {
        select: {
          imagenes: true
        }
      }
    }
  })

  console.log(`📊 Proyectos actuales: ${allProjects.length}`)

  // Identificar proyectos a eliminar
  const projectsToDelete = allProjects.filter(project => 
    genericToDelete.includes(project.titulo) ||
    project.categoria === 'OTRO' ||
    /^\d+$/.test(project.titulo) || // Solo números
    project.titulo.length < 4 || // Títulos muy cortos
    /^(Proyecto\s+)?\d+/.test(project.titulo) // Empiezan con números
  )

  console.log(`\n❌ PROYECTOS A ELIMINAR (${projectsToDelete.length}):`)
  projectsToDelete.forEach(p => {
    console.log(`   🗑️  ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
  })

  if (projectsToDelete.length > 0) {
    const projectIdsToDelete = projectsToDelete.map(p => p.id)

    // Eliminar imágenes primero
    const deletedImages = await prisma.imagenProyecto.deleteMany({
      where: {
        proyectoId: {
          in: projectIdsToDelete
        }
      }
    })

    console.log(`\n📸 Eliminadas ${deletedImages.count} imágenes`)

    // Eliminar proyectos
    const deletedProjects = await prisma.proyecto.deleteMany({
      where: {
        id: {
          in: projectIdsToDelete
        }
      }
    })

    console.log(`🗑️  Eliminados ${deletedProjects.count} proyectos`)
  }

  // Revisar duplicados restantes
  console.log(`\n🔍 REVISANDO DUPLICADOS RESTANTES...`)
  
  const remainingProjects = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      slug: true,
      categoria: true,
      createdAt: true,
      _count: {
        select: {
          imagenes: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Eliminar duplicados (mantener el más viejo)
  const seenTitles = new Set()
  const duplicatesToDelete = []

  for (const project of remainingProjects) {
    // Normalizar título para comparación
    const normalizedTitle = project.titulo.toLowerCase()
      .replace(/centro comercial\s*/i, '')
      .replace(/edificio\s*/i, '')
      .replace(/puente\s*(vehicular|peatonal)?\s*/i, '')
      .replace(/escenario deportivo\s*/i, '')
      .replace(/estructura modular\s*/i, '')
      .trim()

    if (seenTitles.has(normalizedTitle)) {
      duplicatesToDelete.push(project)
      console.log(`   🔄 Duplicado encontrado: ${project.titulo}`)
    } else {
      seenTitles.add(normalizedTitle)
    }
  }

  if (duplicatesToDelete.length > 0) {
    const duplicateIds = duplicatesToDelete.map(p => p.id)

    const deletedDuplicateImages = await prisma.imagenProyecto.deleteMany({
      where: {
        proyectoId: {
          in: duplicateIds
        }
      }
    })

    const deletedDuplicateProjects = await prisma.proyecto.deleteMany({
      where: {
        id: {
          in: duplicateIds
        }
      }
    })

    console.log(`   📸 Eliminadas ${deletedDuplicateImages.count} imágenes de duplicados`)
    console.log(`   🗑️  Eliminados ${deletedDuplicateProjects.count} proyectos duplicados`)
  }

  // Estadísticas finales
  const finalProjects = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      categoria: true,
      _count: {
        select: {
          imagenes: true
        }
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

  console.log(`\n🎉 LIMPIEZA FINAL COMPLETADA!`)
  console.log(`   📊 Proyectos finales: ${finalProjects.length}`)
  console.log(`   📋 Por categoría:`)
  
  finalByCategory.forEach(cat => {
    console.log(`      ${cat.categoria}: ${cat._count}`)
  })

  console.log(`\n✅ PROYECTOS FINALES:`)
  finalProjects.forEach(p => {
    console.log(`   📂 ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
  })

  await prisma.$disconnect()
}

finalCleanupProjects().catch(console.error)