import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanKeepOnlyRealProjects() {
  console.log('🎯 MANTENIENDO SOLO PROYECTOS REALES...\n')

  // Lista de proyectos reales que debemos mantener (basada en los originales y sliders descargados)
  const realProjects = [
    // CENTROS COMERCIALES (8 proyectos reales)
    'centro-comercial-campanario',
    'centro-comercial-armenia-plaza', 
    'centro-comercial-bochalema-plaza',
    'centro-comercial-monserrat',
    'centro-comercial-unico-barranquilla',
    'centro-comercial-unico-cali',
    'centro-comercial-unico-neiva',
    'paseo-villa-del-rio',

    // EDIFICIOS (8 proyectos reales)
    'cinemateca-distrital',
    'clinica-reina-victoria', 
    'edificio-omega',
    'estacion-de-bomberos-popayan',
    'estacion-mio-guadalupe',
    'modulos-medicos',
    'sena-santander',
    'tequendama-parking-cali',
    'terminal-intermedio-mio',

    // INDUSTRIA (7 proyectos reales)
    'ampliacion-cargill',
    'torre-cogeneracion-propal',
    'bodega-duplex-ingenieria',
    'bodega-intera',
    'tecnofar',
    'bodega-protecnica-etapa-ii',
    'tecnoquimicas-jamundi',

    // PUENTES VEHICULARES (6 proyectos reales)
    'puente-vehicular-nolasco',
    'puente-vehicular-carrera-100',
    'puente-vehicular-cambrin',
    'puente-vehicular-frisoles',
    'puente-vehicular-la-21',
    'puente-vehicular-la-paila',
    'puente-vehicular-saraconcho',

    // PUENTES PEATONALES (5 proyectos reales)
    'escalinata-curva-rio-cali',
    'puente-peatonal-autopista-sur-carrera-68',
    'puente-peatonal-la-63',
    'puente-peatonal-la-tertulia',
    'puente-peatonal-terminal-intermedio',

    // ESCENARIOS DEPORTIVOS (5 proyectos reales)
    'complejo-acuatico-popayan',
    'coliseo-mayor-juegos-nacionales-2012',
    'coliseo-de-artes-marciales-nacionales-2012',
    'cecun-universidad-del-cauca',
    'cancha-javeriana-cali',

    // ESTRUCTURAS MODULARES (2 proyectos reales)
    'cocinas-ocultas',
    'modulo-oficina',

    // OIL AND GAS (2 proyectos reales)
    'tanque-pulmon',
    'tanques-de-almacenamiento-glp',

    // CUBIERTAS Y FACHADAS (4 proyectos reales)
    'camino-viejo',
    'cubierta-interna', 
    'ips-sura',
    'taquillas-pisoje-comfacauca'
  ]

  console.log(`🎯 Proyectos reales definidos: ${realProjects.length}`)

  // Obtener todos los proyectos actuales
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

  console.log(`📊 Proyectos actuales en BD: ${allProjects.length}`)

  // Identificar proyectos a mantener y a eliminar
  const projectsToKeep = []
  const projectsToDelete = []

  for (const project of allProjects) {
    const isReal = realProjects.some(realSlug => 
      project.slug === realSlug || 
      project.slug.includes(realSlug) ||
      realSlug.includes(project.slug.replace(/^(centro-comercial-|edificio-|industria-|puente-vehicular-|puente-peatonal-|escenario-deportivo-|estructura-modular-|oil-gas-)/i, ''))
    )

    if (isReal) {
      projectsToKeep.push(project)
    } else {
      projectsToDelete.push(project)
    }
  }

  console.log(`\n📋 ANÁLISIS:`)
  console.log(`   ✅ Mantener: ${projectsToKeep.length} proyectos`)
  console.log(`   ❌ Eliminar: ${projectsToDelete.length} proyectos`)

  console.log(`\n✅ PROYECTOS A MANTENER:`)
  projectsToKeep.forEach(p => {
    console.log(`   📂 ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
  })

  if (projectsToDelete.length > 0) {
    console.log(`\n❌ PROYECTOS A ELIMINAR:`)
    projectsToDelete.slice(0, 10).forEach(p => {
      console.log(`   🗑️  ${p.titulo} (${p._count.imagenes} img) [${p.categoria}]`)
    })
    if (projectsToDelete.length > 10) {
      console.log(`   ... y ${projectsToDelete.length - 10} más`)
    }

    console.log(`\n🧹 INICIANDO ELIMINACIÓN...`)

    const projectIdsToDelete = projectsToDelete.map(p => p.id)

    // Eliminar imágenes primero
    const deletedImages = await prisma.imagenProyecto.deleteMany({
      where: {
        proyectoId: {
          in: projectIdsToDelete
        }
      }
    })

    console.log(`📸 Eliminadas ${deletedImages.count} imágenes`)

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

  // Ahora limpiar títulos removiendo "Proyecto " del inicio
  console.log(`\n🔤 LIMPIANDO TÍTULOS...`)
  
  const projectsWithBadTitles = await prisma.proyecto.findMany({
    where: {
      titulo: {
        startsWith: 'Proyecto '
      }
    }
  })

  for (const project of projectsWithBadTitles) {
    const newTitle = project.titulo.replace(/^Proyecto\s+/i, '')
    await prisma.proyecto.update({
      where: { id: project.id },
      data: { titulo: newTitle }
    })
    console.log(`   📝 "${project.titulo}" → "${newTitle}"`)
  }

  // Estadísticas finales
  const finalCount = await prisma.proyecto.count()
  const finalByCategory = await prisma.proyecto.groupBy({
    by: ['categoria'],
    _count: true
  })

  console.log(`\n🎉 LIMPIEZA COMPLETADA!`)
  console.log(`   📊 Proyectos finales: ${finalCount}`)
  console.log(`   📋 Por categoría:`)
  
  finalByCategory.forEach(cat => {
    console.log(`      ${cat.categoria}: ${cat._count}`)
  })

  await prisma.$disconnect()
}

cleanKeepOnlyRealProjects().catch(console.error)