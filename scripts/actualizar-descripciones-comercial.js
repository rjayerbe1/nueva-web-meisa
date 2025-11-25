const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const DESCRIPCIONES_NUEVAS = {
  'Estructuras de Gran Luz': 'Estructuras metálicas que permiten espacios comerciales amplios sin columnas intermedias que obstruyan la circulación o distribución de locales. MEISA ha construido centros comerciales hasta 30,000 m² con luces de gran claro que maximizan el área rentable. Sistema modular que facilita futuras remodelaciones según cambien los inquilinos. Ideal para supermercados, centros comerciales y grandes superficies donde la flexibilidad espacial es clave para el negocio.',

  'Cubiertas y Fachadas Metálicas': 'Cubiertas metálicas que protegen espacios comerciales con sistemas impermeables de larga duración. MEISA ha instalado sistemas standing seam en múltiples locales comerciales y centros comerciales. Fachadas metálicas que combinan funcionalidad estructural con estética arquitectónica moderna. Reducen tiempos de construcción comparado con sistemas tradicionales. Ideales para proyectos retail, locales comerciales y edificios donde la imagen es importante para atraer clientes.',

  'Entrepisos y Mezanines de Alta Capacidad': 'Estructuras que duplican el área útil sin ampliar la huella del edificio. MEISA ha construido entrepisos metálicos en locales comerciales y bodegas que soportan cargas pesadas de inventario y público. Sistema desmontable que permite reconfiguración si cambia el uso del espacio. Maximizan rentabilidad al crear dos o más niveles donde antes había uno. Aplicable en retail, bodegas comerciales y puntos de venta.'
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DESCRIPCIONES COMERCIAL (conservadoras)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'comercial' }
    })

    if (!categoria) {
      console.log('❌ Categoría COMERCIAL no encontrada')
      return
    }

    // Respaldo
    const backupFile = `./respaldo-descripciones-comercial-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify({
      nombre: categoria.nombre,
      especialidades: categoria.especialidades
    }, null, 2))
    console.log(`📦 Respaldo creado: ${backupFile}\n`)

    // Actualizar descripciones
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
      where: { slug: 'comercial' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ COMERCIAL: Descripciones actualizadas')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
