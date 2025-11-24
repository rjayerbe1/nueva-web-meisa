const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function reclasificarAdicionales() {
  console.log('='.repeat(80))
  console.log('RECLASIFICANDO PROYECTOS ADICIONALES')
  console.log('='.repeat(80))
  console.log()

  // Buscar los proyectos de Andrés Arboleda / Arboleda Rojas - Locales
  const localesArboleda = await prisma.proyecto.findMany({
    where: {
      OR: [
        { titulo: { contains: 'Andrés Arboleda' } },
        { titulo: { contains: 'Arboleda Rojas' } },
        { cliente: { contains: 'ANDRÉS ARBOLEDA' } },
        { cliente: { contains: 'ARBOLEDA ROJAS' } }
      ]
    },
    select: {
      id: true,
      titulo: true,
      cliente: true,
      categoria: true,
      descripcion: true
    }
  })

  console.log(`Proyectos de Arboleda encontrados: ${localesArboleda.length}\n`)

  let reclasificados = 0

  for (const proyecto of localesArboleda) {
    console.log(`Proyecto: ${proyecto.titulo}`)
    console.log(`Cliente: ${proyecto.cliente}`)
    console.log(`Categoría actual: ${proyecto.categoria}`)
    console.log(`Descripción: ${proyecto.descripcion?.substring(0, 100)}...`)

    // Si menciona "locales" y está en INDUSTRIAL, mover a COMERCIAL
    if (proyecto.titulo.toLowerCase().includes('local') && proyecto.categoria === 'INDUSTRIAL') {
      await prisma.proyecto.update({
        where: { id: proyecto.id },
        data: { categoria: 'COMERCIAL' }
      })

      console.log(`✅ Reclasificado a COMERCIAL`)
      reclasificados++
    } else {
      console.log(`ℹ️  No requiere cambio`)
    }
    console.log()
  }

  // Ahora buscar TODOS los proyectos de INDUSTRIAL y revisar cuáles son claramente comerciales
  console.log('='.repeat(80))
  console.log('REVISANDO TODOS LOS PROYECTOS DE INDUSTRIAL')
  console.log('='.repeat(80))
  console.log()

  const industriales = await prisma.proyecto.findMany({
    where: { categoria: 'INDUSTRIAL' },
    select: {
      id: true,
      titulo: true,
      cliente: true,
      descripcion: true,
      categoria: true
    }
  })

  console.log(`Total proyectos en INDUSTRIAL: ${industriales.length}\n`)

  // Palabras clave que indican que debería ser COMERCIAL
  const palabrasComercial = [
    'centro comercial',
    'cc único',
    'cc ',
    'almacen',
    'almacén',
    'tienda',
    'local comercial',
    'supermercado',
    'plaza de mercado',
    'carrefour',
    'éxito',
    'estación de servicio',
    'estacion de servicio',
    'mezanine local',
    'mezaninne',
    'retail'
  ]

  // Palabras clave que indican EDIFICACIONES
  const palabrasEdificaciones = [
    'edificio',
    'torre',
    'hospital',
    'clínica',
    'clinica',
    'dispensario',
    'oficinas',
    'parqueadero'
  ]

  // Palabras clave que indican DEPORTES_EDUCACION
  const palabrasDeportes = [
    'coliseo',
    'colegio',
    'universidad',
    'escuela',
    'cancha',
    'polideportivo',
    'piscina',
    'estadio',
    'gimnasio'
  ]

  const candidatosComercial = []
  const candidatosEdificaciones = []
  const candidatosDeportes = []

  for (const proyecto of industriales) {
    const textoCompleto = `${proyecto.titulo} ${proyecto.descripcion || ''} ${proyecto.cliente || ''}`.toLowerCase()

    // Verificar si es comercial
    if (palabrasComercial.some(palabra => textoCompleto.includes(palabra))) {
      candidatosComercial.push(proyecto)
    }
    // Verificar si es edificación
    else if (palabrasEdificaciones.some(palabra => textoCompleto.includes(palabra))) {
      candidatosEdificaciones.push(proyecto)
    }
    // Verificar si es deportes/educación
    else if (palabrasDeportes.some(palabra => textoCompleto.includes(palabra))) {
      candidatosDeportes.push(proyecto)
    }
  }

  console.log('\n📋 CANDIDATOS PARA RECLASIFICACIÓN:\n')

  if (candidatosComercial.length > 0) {
    console.log(`🛒 COMERCIAL (${candidatosComercial.length} proyectos):`)
    candidatosComercial.forEach(p => {
      console.log(`  - ${p.titulo}`)
      console.log(`    Cliente: ${p.cliente}`)
    })
    console.log()
  }

  if (candidatosEdificaciones.length > 0) {
    console.log(`🏢 EDIFICACIONES (${candidatosEdificaciones.length} proyectos):`)
    candidatosEdificaciones.forEach(p => {
      console.log(`  - ${p.titulo}`)
      console.log(`    Cliente: ${p.cliente}`)
    })
    console.log()
  }

  if (candidatosDeportes.length > 0) {
    console.log(`🏟️ DEPORTES_EDUCACION (${candidatosDeportes.length} proyectos):`)
    candidatosDeportes.forEach(p => {
      console.log(`  - ${p.titulo}`)
      console.log(`    Cliente: ${p.cliente}`)
    })
    console.log()
  }

  console.log(`\nTotal proyectos reclasificados: ${reclasificados}`)

  await prisma.$disconnect()
  return { reclasificados, candidatosComercial, candidatosEdificaciones, candidatosDeportes }
}

reclasificarAdicionales()
  .then(result => {
    console.log('\n✅ Análisis completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
