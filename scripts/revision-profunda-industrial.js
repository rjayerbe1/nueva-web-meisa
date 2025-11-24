const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function revisionProfundaIndustrial() {
  console.log('='.repeat(80))
  console.log('REVISIÓN PROFUNDA DE PROYECTOS EN INDUSTRIAL')
  console.log('='.repeat(80))
  console.log()

  const industriales = await prisma.proyecto.findMany({
    where: { categoria: 'INDUSTRIAL' },
    select: {
      id: true,
      titulo: true,
      cliente: true,
      descripcion: true
    },
    orderBy: { titulo: 'asc' }
  })

  console.log(`Total proyectos en INDUSTRIAL: ${industriales.length}\n`)

  // Categorizar cada proyecto
  const categorias = {
    'Definitivamente COMERCIAL': [],
    'Posible COMERCIAL': [],
    'Definitivamente EDIFICACIONES': [],
    'Posible EDIFICACIONES': [],
    'Definitivamente DEPORTES': [],
    'Posible DEPORTES': [],
    'Correcto en INDUSTRIAL': []
  }

  for (const p of industriales) {
    const texto = `${p.titulo} ${p.descripcion || ''} ${p.cliente || ''}`.toLowerCase()

    // COMERCIAL: tiendas, centros comerciales, supermercados
    if (texto.match(/centro comercial|cc |supermercado|tienda|almacen|local comercial|retail|ferreteria|estacion de servicio|mezanine.*local/i)) {
      if (texto.match(/centro comercial|cc unico|cc |supermercado|tienda|retail/i)) {
        categorias['Definitivamente COMERCIAL'].push(p)
      } else {
        categorias['Posible COMERCIAL'].push(p)
      }
    }
    // EDIFICACIONES: edificios de oficinas, torres, clínicas, hospitales
    else if (texto.match(/edificio.*oficina|torre(?!.*cogeneracion)|clinica|hospital|dispensario|(?<!planta.*)\boficinas\b/i)) {
      if (texto.match(/edificio.*oficina|torre(?!.*cogeneracion)|clinica|hospital/i)) {
        categorias['Definitivamente EDIFICACIONES'].push(p)
      } else {
        categorias['Posible EDIFICACIONES'].push(p)
      }
    }
    // DEPORTES_EDUCACION: colegios, universidades, coliseos, canchas
    else if (texto.match(/colegio|universidad|coliseo|cancha|polideportivo|piscina|estadio/i)) {
      if (texto.match(/colegio|universidad|coliseo|cancha/i)) {
        categorias['Definitivamente DEPORTES'].push(p)
      } else {
        categorias['Posible DEPORTES'].push(p)
      }
    }
    // Si no coincide con nada, probablemente es correcto en INDUSTRIAL
    else {
      categorias['Correcto en INDUSTRIAL'].push(p)
    }
  }

  // Mostrar resultados
  for (const [categoria, proyectos] of Object.entries(categorias)) {
    if (proyectos.length > 0) {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`${categoria.toUpperCase()} (${proyectos.length} proyectos)`)
      console.log('='.repeat(80))

      proyectos.forEach((p, idx) => {
        console.log(`\n${idx + 1}. ${p.titulo}`)
        console.log(`   Cliente: ${p.cliente || 'N/A'}`)
        if (p.descripcion) {
          console.log(`   Descripción: ${p.descripcion.substring(0, 100)}...`)
        }
      })
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('RESUMEN')
  console.log('='.repeat(80))
  Object.entries(categorias).forEach(([cat, proyectos]) => {
    console.log(`${cat}: ${proyectos.length} proyectos`)
  })

  await prisma.$disconnect()
  return categorias
}

revisionProfundaIndustrial()
  .then(() => {
    console.log('\n✅ Revisión completada')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
