const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const BENEFICIOS_POR_CATEGORIA = {
  COMERCIAL: [
    'Estructuras de gran luz sin columnas',
    'Construcción sin interrumpir operaciones',
    'Cubiertas con 30+ años de garantía',
    'Mezanines que maximizan espacios',
    'Sistemas modulares prefabricados'
  ],

  INDUSTRIAL: [
    'Bodegas de hasta 12,000 m²',
    'Estructuras libre de vibraciones',
    'Resistencia a ambientes corrosivos',
    'Puentes grúa hasta 50 toneladas',
    'Hangares con luces de 50 metros'
  ],

  PUENTES: [
    'Puentes de gran luz hasta 212 metros',
    'Diseño sísmico certificado',
    'Puentes colgantes y en arco',
    'Conexión para comunidades rurales',
    'Estructuras con 50+ años de vida útil'
  ],

  INFRAESTRUCTURA_URBANA: [
    'Estaciones de transporte masivo',
    'Terminales de alta capacidad',
    'Ciclopuentes y movilidad sostenible',
    'Obras escultóricas urbanas',
    'Infraestructura antisísmica'
  ],

  EDIFICACIONES: [
    'Diseño sismorresistente NSR-10',
    'Parqueaderos multinivel eficientes',
    'Edificios culturales emblemáticos',
    'Estructuras educativas duraderas',
    'Reforzamiento estructural especializado'
  ],

  DEPORTES_EDUCACION: [
    'Coliseos para eventos de gran escala',
    'Cubiertas de 60m sin columnas',
    'Acústica deportiva optimizada',
    'Graderías de alta capacidad',
    'Instalaciones acuáticas especializadas'
  ]
}

async function poblarBeneficios() {
  console.log('='.repeat(80))
  console.log('POBLANDO BENEFICIOS EN CATEGORÍAS')
  console.log('='.repeat(80))
  console.log()

  let totalActualizadas = 0

  for (const [categoriaKey, beneficios] of Object.entries(BENEFICIOS_POR_CATEGORIA)) {
    try {
      console.log(`\n📦 Procesando: ${categoriaKey}`)
      console.log(`   Beneficios a agregar: ${beneficios.length}`)

      beneficios.forEach((ben, idx) => {
        console.log(`      ${idx + 1}. ${ben}`)
      })

      // Actualizar en la BD
      const resultado = await prisma.categoriaProyecto.updateMany({
        where: { key: categoriaKey },
        data: { beneficios: beneficios }
      })

      if (resultado.count > 0) {
        console.log(`   ✅ Categoría actualizada exitosamente`)
        totalActualizadas++
      } else {
        console.log(`   ⚠️  Categoría ${categoriaKey} no encontrada en BD`)
      }

    } catch (error) {
      console.error(`   ❌ Error procesando ${categoriaKey}:`, error.message)
    }
  }

  console.log()
  console.log('='.repeat(80))
  console.log(`✅ Proceso completado: ${totalActualizadas} categorías actualizadas`)
  console.log('='.repeat(80))
  console.log()

  await prisma.$disconnect()
}

// Ejecutar
poblarBeneficios()
  .then(() => {
    console.log('✅ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
