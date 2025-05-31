import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reviewAndCleanProjects() {
  console.log('🔍 REVISANDO PROYECTOS EN LA BASE DE DATOS...\n')

  // Obtener todos los proyectos
  const allProjects = await prisma.proyecto.findMany({
    select: {
      id: true,
      titulo: true,
      categoria: true,
      slug: true,
      createdAt: true,
      _count: {
        select: {
          imagenes: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log(`📊 Total proyectos en BD: ${allProjects.length}\n`)

  // Agrupar por categoría
  const projectsByCategory = allProjects.reduce((acc, project) => {
    if (!acc[project.categoria]) {
      acc[project.categoria] = []
    }
    acc[project.categoria].push(project)
    return acc
  }, {} as Record<string, typeof allProjects>)

  // Mostrar resumen por categoría
  for (const [category, projects] of Object.entries(projectsByCategory)) {
    console.log(`📁 ${category}: ${projects.length} proyectos`)
    
    for (const project of projects) {
      const imageCount = project._count.imagenes
      const isRecent = new Date(project.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000) // Últimas 24 horas
      const marker = isRecent ? '🆕' : '📝'
      
      console.log(`   ${marker} ${project.titulo} (${imageCount} img) [${project.slug}]`)
    }
    console.log('')
  }

  // Identificar proyectos problemáticos
  console.log('🚨 PROYECTOS PROBLEMÁTICOS DETECTADOS:\n')

  const problematicProjects = []

  // 1. Proyectos genéricos (como "Proyecto Edificios")
  const genericProjects = allProjects.filter(p => 
    p.titulo.startsWith('Proyecto ') && 
    ['Proyecto Edificios', 'Proyecto Industria', 'Proyecto Centros Comerciales'].includes(p.titulo)
  )

  if (genericProjects.length > 0) {
    console.log(`❌ ${genericProjects.length} proyectos genéricos encontrados:`)
    genericProjects.forEach(p => {
      console.log(`   - ${p.titulo} (${p._count.imagenes} img)`)
      problematicProjects.push(p.id)
    })
    console.log('')
  }

  // 2. Proyectos duplicados (mismo slug o título similar)
  const duplicateGroups = new Map()
  allProjects.forEach(project => {
    const cleanTitle = project.titulo.toLowerCase()
      .replace(/proyecto\s+/i, '')
      .replace(/centro comercial\s+/i, '')
      .replace(/edificio\s+/i, '')
      .trim()
    
    if (!duplicateGroups.has(cleanTitle)) {
      duplicateGroups.set(cleanTitle, [])
    }
    duplicateGroups.get(cleanTitle).push(project)
  })

  const duplicates = Array.from(duplicateGroups.values()).filter(group => group.length > 1)
  if (duplicates.length > 0) {
    console.log(`❌ ${duplicates.length} grupos de proyectos duplicados:`)
    duplicates.forEach(group => {
      console.log(`   📂 "${group[0].titulo.replace(/Proyecto\s+/i, '')}" tiene ${group.length} versiones:`)
      group.forEach((p, i) => {
        console.log(`      ${i + 1}. ${p.titulo} (${p._count.imagenes} img) - ${p.createdAt.toISOString().split('T')[0]}`)
        if (i > 0) { // Mantener solo el primero
          problematicProjects.push(p.id)
        }
      })
      console.log('')
    })
  }

  // 3. Proyectos con muy pocas imágenes y nombres poco descriptivos
  const lowQualityProjects = allProjects.filter(p => 
    p._count.imagenes < 2 && 
    (p.titulo.length < 10 || p.titulo.includes('Sena') || p.titulo.includes('Terminal'))
  )

  if (lowQualityProjects.length > 0) {
    console.log(`❌ ${lowQualityProjects.length} proyectos de baja calidad:`)
    lowQualityProjects.forEach(p => {
      console.log(`   - ${p.titulo} (${p._count.imagenes} img)`)
      problematicProjects.push(p.id)
    })
    console.log('')
  }

  console.log(`🎯 PLAN DE LIMPIEZA:`)
  console.log(`   ❌ Eliminar: ${problematicProjects.length} proyectos problemáticos`)
  console.log(`   ✅ Mantener: ${allProjects.length - problematicProjects.length} proyectos válidos`)
  console.log('')

  // Preguntar confirmación (simulada)
  const shouldClean = true // En un entorno real, podrías pedir confirmación

  if (shouldClean && problematicProjects.length > 0) {
    console.log('🧹 INICIANDO LIMPIEZA...\n')

    // Eliminar imágenes primero
    const deletedImages = await prisma.imagenProyecto.deleteMany({
      where: {
        proyectoId: {
          in: problematicProjects
        }
      }
    })

    console.log(`📸 Eliminadas ${deletedImages.count} imágenes asociadas`)

    // Eliminar proyectos problemáticos
    const deletedProjects = await prisma.proyecto.deleteMany({
      where: {
        id: {
          in: problematicProjects
        }
      }
    })

    console.log(`🗑️  Eliminados ${deletedProjects.count} proyectos problemáticos`)

    // Mostrar estadísticas finales
    const finalCount = await prisma.proyecto.count()
    console.log(`\n✅ LIMPIEZA COMPLETA!`)
    console.log(`   📊 Proyectos restantes: ${finalCount}`)
    console.log(`   🎯 Meta: ~51 proyectos reales`)
  }

  await prisma.$disconnect()
}

reviewAndCleanProjects().catch(console.error)