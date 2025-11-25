const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const DESCRIPCIONES_NUEVAS = {
  'Coliseos y Canchas Cubiertas': 'Estructuras deportivas cubiertas que cumplen normativa de federaciones internacionales. MEISA ha construido coliseos y canchas cubiertas incluyendo sedes de Juegos Mundiales. Cubiertas de gran luz sin columnas que permiten graderías con visuales óptimas para el público. Estructura sismorresistente para seguridad de concentraciones masivas. Plataformas integradas para iluminación profesional. Ventilación natural reduce costos operativos. Construcción en tiempos reducidos para inauguraciones programadas.',

  'Piscinas Cubiertas': 'Estructuras metálicas sobre piscinas olímpicas y recreativas con tratamiento especial para ambientes de alta humedad. MEISA ha construido complejos acuáticos con cerchas que resisten ambiente salino generado por cloro y condensación constante. Galvanizado en caliente más pintura epóxica especial protegen la estructura. Cubiertas translúcidas aportan iluminación natural. Ventilación integrada extrae aire húmedo evitando condensación destructiva. Soportan equipos pesados suspendidos como marcadores electrónicos.',

  'Torres y Estructuras Auxiliares': 'Torres de iluminación y estructuras complementarias para escenarios deportivos. MEISA ha instalado torres que resisten vientos extremos sin vibrar mediante análisis dinámico. Plataformas de mantenimiento en la cima permiten acceso seguro para cambio de luminarias. Acabado galvanizado elimina mantenimiento de pintura en altura. Incluye graderías metálicas de alta capacidad integradas estructuralmente. Niveles de iluminación cumplen normativa para transmisión televisiva de eventos. Cimentación absorbe momentos generados por viento.'
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DESCRIPCIONES DEPORTES & EDUCACIÓN (conservadoras)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'deportes-educacion' }
    })

    if (!categoria) {
      console.log('❌ Categoría DEPORTES & EDUCACIÓN no encontrada')
      return
    }

    const backupFile = `./respaldo-descripciones-deportes-${Date.now()}.json`
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
      where: { slug: 'deportes-educacion' },
      data: { especialidades: especialidadesActualizadas }
    })

    console.log('='.repeat(80))
    console.log('✅ DEPORTES & EDUCACIÓN: Descripciones actualizadas')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
