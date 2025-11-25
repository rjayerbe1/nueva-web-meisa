const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function simplificar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('SIMPLIFICACIÓN: "Puentes Livianos y Comunitarios" → "Puentes Peatonales"')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'puentes' }
    })

    if (!categoria) {
      console.log('❌ Categoría PUENTES no encontrada')
      return
    }

    // Respaldo
    const backupFile = `./respaldo-puentes-simplificacion-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify({
      nombre: categoria.nombre,
      especialidades: categoria.especialidades
    }, null, 2))
    console.log(`📦 Respaldo: ${backupFile}\n`)

    // Actualizar solo el título de la tercera especialidad
    const especialidadesActualizadas = categoria.especialidades.map((esp, idx) => {
      if (idx === 2) { // Tercera especialidad
        console.log(`❌ Antes: "${esp.titulo}"`)
        console.log(`✅ Después: "Puentes Peatonales"\n`)
        return { ...esp, titulo: 'Puentes Peatonales' }
      }
      return esp
    })

    await prisma.categoriaProyecto.update({
      where: { slug: 'puentes' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ PUENTES: Título simplificado')
    console.log('='.repeat(80))
    console.log('   1. Puentes de Vigas y Cerchas')
    console.log('   2. Puentes en Arco Metálico')
    console.log('   3. Puentes Peatonales ← SIMPLIFICADO')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

simplificar()
