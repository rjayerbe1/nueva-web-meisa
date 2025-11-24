const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function reclasificarUltimos() {
  console.log('='.repeat(80))
  console.log('RECLASIFICANDO ÚLTIMOS PROYECTOS')
  console.log('='.repeat(80))
  console.log()

  let total = 0

  // 1. Arinsa CC Campanario (debe ir a COMERCIAL)
  const campanario = await prisma.proyecto.findFirst({
    where: {
      titulo: { contains: 'Campanario' },
      cliente: { contains: 'ARINSA' },
      categoria: 'INDUSTRIAL'
    }
  })

  if (campanario) {
    await prisma.proyecto.update({
      where: { id: campanario.id },
      data: { categoria: 'COMERCIAL' }
    })
    console.log(`✅ ${campanario.titulo}`)
    console.log(`   INDUSTRIAL → COMERCIAL`)
    console.log()
    total++
  } else {
    console.log('ℹ️  Arinsa CC Campanario ya está en categoría correcta')
    console.log()
  }

  // 2. Almacenes Éxito (AIRES MODERNOS) - plataforma en almacén
  const exito = await prisma.proyecto.findFirst({
    where: {
      cliente: { contains: 'AIRES MODERNOS' },
      categoria: 'INDUSTRIAL'
    }
  })

  if (exito) {
    await prisma.proyecto.update({
      where: { id: exito.id },
      data: { categoria: 'COMERCIAL' }
    })
    console.log(`✅ ${exito.titulo}`)
    console.log(`   INDUSTRIAL → COMERCIAL`)
    console.log()
    total++
  } else {
    console.log('ℹ️  Almacenes Éxito (Aires Modernos) ya está en categoría correcta')
    console.log()
  }

  // 3. Ingenio Providencia - Zona Catas y Oficinas
  // Este es parte del complejo industrial del ingenio, pero tiene oficinas
  // Voy a dejarlo en INDUSTRIAL porque es parte de la planta
  console.log('ℹ️  Ingenio Providencia - Zona Catas y Oficinas:')
  console.log('   Dejando en INDUSTRIAL (es parte del complejo industrial del ingenio)')
  console.log()

  console.log('='.repeat(80))
  console.log(`Total reclasificados: ${total}`)
  console.log('='.repeat(80))

  await prisma.$disconnect()
  return total
}

reclasificarUltimos()
  .then(total => {
    console.log(`\n✅ Reclasificación completada: ${total} proyectos`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
