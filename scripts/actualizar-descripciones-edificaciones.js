const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const DESCRIPCIONES_NUEVAS = {
  'Pórticos Metálicos de Múltiples Niveles': 'Estructuras de acero para edificios de múltiples pisos mediante sistemas de pórticos. MEISA ha construido edificios administrativos, sedes corporativas y edificios institucionales. Modulación amplia permite plantas libres sin muros de carga, facilitando distribución interior variable según necesidades. Losas colaborantes integradas con vigas reducen tiempos de construcción. Fachadas livianas se cuelgan de la estructura permitiendo grandes áreas vidriadas. Conexiones rígidas garantizan estabilidad sísmica cumpliendo NSR-10.',

  'Estructuras Metálicas para Estacionamiento': 'Estructuras metálicas que maximizan vehículos estacionados mediante apilamiento vertical. MEISA ha construido parqueaderos multinivel con rampas que conectan niveles para circulación vehicular cómoda. Vigas metálicas soportan losas que resisten tránsito vehicular pesado. Modulación optimizada maximiza el número de cajones por metro cuadrado construido. Ventilación natural mediante fachadas abiertas elimina sistemas mecánicos de extracción de gases reduciendo costos operativos.',

  'Estructuras Livianas Modulares': 'Estructuras metálicas prefabricadas en módulos para construcción rápida. MEISA ha realizado ampliaciones verticales y laterales a edificios existentes sin interrumpir operaciones. Las estructuras se fabrican en taller, transportan en secciones y ensamblan mediante conexiones atornilladas. Construcción rápida reduce el período de obra significativamente. Ligereza del acero minimiza cargas sobre cimentaciones existentes. Montaje nocturno o en fines de semana permite operación diurna continua en hospitales, hoteles o edificios corporativos.'
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DESCRIPCIONES EDIFICACIONES (conservadoras)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'edificaciones' }
    })

    if (!categoria) {
      console.log('❌ Categoría EDIFICACIONES no encontrada')
      return
    }

    const backupFile = `./respaldo-descripciones-edificaciones-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify({
      nombre: categoria.nombre,
      especialidades: categoria.especialidades
    }, null, 2))
    console.log(`📦 Respaldo creado: ${backupFile}\n`)

    const especialidadesActualizadas = categoria.especialidades.map(esp => {
      const nuevaDesc = DESCRIPCIONES_NUEVAS[esp.titulo]
      if (nuevaDesc) {
        const palabrasAntes = esp.descripcion.split(' ').length
        const palabrasAhora = nuevaDesc.split(' ').length
        console.log(`✏️  ${esp.titulo}`)
        console.log(`   Antes: ${palabrasAntes} palabras`)
        console.log(`   Ahora: ${palabrasAhora} palabras (-${Math.round((1 - palabrasAhora/palabrasAntes) * 100)}%)\n`)
        return { ...esp, descripcion: nuevaDesc }
      }
      return esp
    })

    await prisma.categoriaProyecto.update({
      where: { slug: 'edificaciones' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ EDIFICACIONES: Descripciones actualizadas')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
