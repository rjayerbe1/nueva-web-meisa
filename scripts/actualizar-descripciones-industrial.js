const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const DESCRIPCIONES_NUEVAS = {
  'Naves Industriales de Gran Luz': 'Bodegas industriales y hangares de un nivel que maximizan almacenamiento con luces hasta 50 metros sin columnas. MEISA ha construido naves para centros de distribución, almacenes y operaciones logísticas. Alturas generosas permiten aprovechar almacenamiento vertical con racks. Estructura prefabricada reduce tiempos de construcción. Sistema modular permite expansiones agregando crujías adicionales sin modificar lo existente. Ideal cuando su operación requiere grandes espacios abiertos para maniobra de montacargas.',

  'Edificios Industriales de Múltiples Niveles': 'Edificios industriales de varios pisos que alojan procesos productivos complejos. MEISA ha construido plantas para empresas farmacéuticas e ingenios azucareros que operan 24/7. Entrepisos metálicos soportan maquinaria pesada de producción sin transmitir vibraciones entre niveles. Estructura diseñada para resistir ambientes agresivos por vapores químicos o humedad constante. La modulación permite expansión sin interrumpir producción existente durante construcción. Acero con tratamientos especiales según el proceso industrial.',

  'Estructuras Especializadas de Alta Resistencia': 'Estructuras metálicas para condiciones operativas extremas. MEISA ha diseñado estructuras que resisten ambientes de refrigeración, atmósferas corrosivas y vibraciones de maquinaria pesada. Para cuartos fríos industriales, las cerchas minimizan puentes térmicos reduciendo consumo energético. Acero con recubrimientos anticorrosivos especiales resiste condensación y ambientes agresivos. Diseño estructural específico para cada proceso industrial según sus requerimientos únicos de temperatura, humedad o cargas dinámicas.'
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DESCRIPCIONES INDUSTRIAL (conservadoras)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'industrial' }
    })

    if (!categoria) {
      console.log('❌ Categoría INDUSTRIAL no encontrada')
      return
    }

    const backupFile = `./respaldo-descripciones-industrial-${Date.now()}.json`
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
      where: { slug: 'industrial' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ INDUSTRIAL: Descripciones actualizadas')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
