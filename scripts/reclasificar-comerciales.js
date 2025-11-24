const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function reclasificarComerciales() {
  console.log('='.repeat(80))
  console.log('RECLASIFICANDO PROYECTOS COMERCIALES EN INDUSTRIAL')
  console.log('='.repeat(80))
  console.log()

  const proyectosAReclasificar = [
    'Carrefour - Mezanine Pasto',
    'Ferretería Maracaibo - Mezanine Bodega Popayán',
    'Arinsa - CC Campanario Popayán'
  ]

  let reclasificados = 0

  for (const tituloPatron of proyectosAReclasificar) {
    const palabrasClave = tituloPatron.split(' - ')

    const proyectos = await prisma.proyecto.findMany({
      where: {
        titulo: { contains: palabrasClave[0] }
      }
    })

    const proyecto = proyectos.find(p =>
      palabrasClave.every(palabra => p.titulo.includes(palabra))
    ) || proyectos[0]

    if (proyecto) {
      if (proyecto.categoria !== 'COMERCIAL') {
        await prisma.proyecto.update({
          where: { id: proyecto.id },
          data: { categoria: 'COMERCIAL' }
        })

        console.log(`✅ ${proyecto.titulo}`)
        console.log(`   ${proyecto.categoria} → COMERCIAL`)
        console.log()
        reclasificados++
      } else {
        console.log(`ℹ️  ${proyecto.titulo} ya está en COMERCIAL`)
        console.log()
      }
    } else {
      console.log(`⚠️  No encontrado: ${tituloPatron}`)
      console.log()
    }
  }

  // Almacenes Éxito
  const exitos = await prisma.proyecto.findMany({
    where: {
      OR: [
        { cliente: { contains: 'ALMACENES ÉXITO' } },
        { cliente: { contains: 'ÉXITO' } }
      ],
      categoria: 'INDUSTRIAL'
    }
  })

  console.log(`\nProyectos de Almacenes Éxito en INDUSTRIAL: ${exitos.length}`)

  for (const proyecto of exitos) {
    console.log(`\n${proyecto.titulo}`)
    console.log(`Cliente: ${proyecto.cliente}`)
    console.log(`Descripción: ${proyecto.descripcion}`)

    // Si menciona plataforma o mezanine, podría ser comercial
    if (proyecto.titulo.toLowerCase().includes('plataforma') ||
        proyecto.titulo.toLowerCase().includes('mezanine')) {

      await prisma.proyecto.update({
        where: { id: proyecto.id },
        data: { categoria: 'COMERCIAL' }
      })

      console.log(`✅ Reclasificado a COMERCIAL`)
      reclasificados++
    }
  }

  console.log()
  console.log('='.repeat(80))
  console.log(`Total reclasificados: ${reclasificados}`)
  console.log('='.repeat(80))

  await prisma.$disconnect()
  return reclasificados
}

reclasificarComerciales()
  .then(total => {
    console.log(`\n✅ Reclasificación completada: ${total} proyectos`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
