const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const DESCRIPCIONES_NUEVAS = {
  'Puentes de Vigas y Cerchas': 'Puentes metálicos mediante vigas cajón o cerchas reticuladas que salvan grandes distancias. MEISA ha construido puentes vehiculares con luces hasta 212 metros. Fabricación en taller con control de calidad certificado, montaje por dovelas que reduce cierres de vía. Incluye puentes en arco donde la geometría transfiere cargas lateralmente a los estribos. Diseño sismorresistente cumpliendo NSR-10. Acabados anticorrosivos para décadas de vida útil. Instalación nocturna permite mantener tráfico diurno.',

  'Puentes Livianos Peatonales': 'Puentes metálicos ligeros que conectan comunidades sobre vías de alto tráfico. MEISA ha construido pasarelas peatonales y ciclopuentes con luces típicas de 30 a 80 metros. Rampas accesibles permiten movilidad inclusiva para personas con discapacidad y bicicletas. Estructura prefabricada permite instalación nocturna sin interrumpir tráfico diurno. Fabricación completa en taller, transporte en secciones y montaje en horas con grúas móviles.',

  'Puentes de Cables': 'Puentes mediante cables de acero de alta resistencia ideales para salvar luces excepcionales. Los cables galvanizados soportan el tablero transfiriendo cargas a torres metálicas ancladas en los extremos. Esta solución es eficiente para cruzar cañones profundos, ríos anchos o valles donde cimentaciones intermedias son difíciles o costosas. Cables galvanizados resisten corrosión atmosférica. Ideal para puentes comunitarios que requieren soluciones de rápida instalación.'
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DESCRIPCIONES PUENTES (conservadoras)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'puentes' }
    })

    if (!categoria) {
      console.log('❌ Categoría PUENTES no encontrada')
      return
    }

    const backupFile = `./respaldo-descripciones-puentes-${Date.now()}.json`
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
      where: { slug: 'puentes' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ PUENTES: Descripciones actualizadas')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
