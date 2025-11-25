const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// DESCRIPCIONES CORREGIDAS PARA PUENTES
const DESCRIPCIONES_CORREGIDAS = {
  'Puentes de Vigas y Cerchas':
    'Puentes metálicos mediante vigas cajón o cerchas reticuladas que permiten salvar luces importantes para tráfico vehicular y peatonal. Fabricación en taller con **control de calidad certificado** garantiza precisión en cada conexión estructural. Incluye **lanzamiento incremental** con nariz metálica y gatos hidráulicos para montaje progresivo.\n\n**Diseño sismorresistente** cumpliendo NSR-10 con acabados anticorrosivos de larga duración. Sistemas de montaje por dovelas o lanzamiento completo según requerimientos del proyecto. Ideal para salvar luces considerables sobre ríos, vías o quebradas con cargas vehiculares importantes.',

  'Puentes Peatonales':
    'Puentes metálicos livianos que conectan comunidades mediante **instalación rápida** sin cerrar vías principales. La ligereza de las estructuras peatonales permite **montaje nocturno** o en fines de semana, manteniendo tráfico vehicular diurno sin interrupciones.\n\nSistemas prefabricados completos que se transportan y ensamblan en **horas en lugar de semanas**. Acabado **galvanizado en caliente** elimina mantenimiento en zonas de difícil acceso. Incluye **rampas accesibles** cumpliendo normativa universal, conectando comunidades de forma rápida y económica donde acceso tradicional sería costoso o lento.'
}

async function corregir() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CORRECCIÓN: Puentes - Lanzamiento Incremental + Rapidez Peatonales')
    console.log('='.repeat(80) + '\n')

    // Obtener categoría de puentes
    const puentes = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'puentes' }
    })

    if (!puentes) {
      console.log('❌ Categoría PUENTES no encontrada')
      return
    }

    // Crear respaldo
    const backupFile = `./respaldo-puentes-lanzamiento-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify({
      nombre: puentes.nombre,
      especialidades: puentes.especialidades
    }, null, 2))
    console.log(`💾 Respaldo creado: ${backupFile}\n`)

    // Actualizar especialidades
    const especialidadesActualizadas = puentes.especialidades.map(esp => {
      const nuevaDesc = DESCRIPCIONES_CORREGIDAS[esp.titulo]

      if (nuevaDesc) {
        console.log(`✅ ${esp.titulo}`)
        console.log('-'.repeat(80))

        if (esp.titulo === 'Puentes de Vigas y Cerchas') {
          console.log('   CAMBIOS:')
          console.log('   [+] Agregado: "lanzamiento incremental con nariz metálica"')
          console.log('   [-] Eliminado: "cerrar completamente la vía inferior"')
          console.log('   [-] Eliminado: "Instalación nocturna" y "pérdidas económicas"')
          console.log('   [→] Enfoque: Métodos constructivos y capacidades técnicas')
        }

        if (esp.titulo === 'Puentes Peatonales') {
          console.log('   CAMBIOS:')
          console.log('   [+] Agregado: "montaje nocturno sin cerrar vías"')
          console.log('   [+] Agregado: "horas en lugar de semanas"')
          console.log('   [+] Enfatizado: Rapidez de instalación')
          console.log('   [→] Enfoque: Velocidad y facilidad de montaje')
        }

        const parrafos = nuevaDesc.split('\n\n').length
        const negritas = (nuevaDesc.match(/\*\*/g) || []).length / 2
        const palabras = nuevaDesc.replace(/\*\*/g, '').split(' ').length

        console.log(`   📊 Párrafos: ${parrafos} | Negritas: ${negritas} | Palabras: ${palabras}\n`)

        return { ...esp, descripcion: nuevaDesc }
      }

      return esp
    })

    // Guardar cambios
    await prisma.categoriaProyecto.update({
      where: { slug: 'puentes' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ CORRECCIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log('\n📝 Resumen:')
    console.log('   • Puentes de Vigas y Cerchas: Agregado lanzamiento incremental')
    console.log('   • Puentes Peatonales: Reescrito enfocando en rapidez de instalación')
    console.log('   • Cada especialidad ahora describe correctamente sus características\n')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

corregir()
