const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// ==============================================================================
// SCRIPT DE ACTUALIZACIÓN DE BENEFICIOS - ALINEACIÓN CON ESTRUCTURAS METÁLICAS
// ==============================================================================

const BENEFICIOS_ACTUALIZADOS = {
  'comercial': {
    nombre: 'Comercial',
    beneficios: [
      'Espacios amplios sin columnas hasta 30m',
      'Construcción sin cerrar tu negocio',
      'Cubiertas metálicas 30+ años sin mantenimiento',
      'Duplica tu espacio útil con entrepisos metálicos',
      'Fachadas y cubiertas 40% más eficientes térmicamente'
    ]
  },
  'industrial': {
    nombre: 'Industrial',
    beneficios: [
      'Naves industriales hasta 12,000 m²',
      'Estructuras libre de vibraciones para maquinaria',
      'Acero resistente a ambientes corrosivos',
      'Puentes grúa hasta 50 toneladas de capacidad',
      'Hangares con luces hasta 50m sin columnas'
    ]
  },
  'puentes': {
    nombre: 'Puentes',
    beneficios: [
      'Puentes de gran luz hasta 212 metros',
      'Diseño sísmico certificado NSR-10',
      'Puentes colgantes y en arco metálicos',
      'Conexión vial para comunidades rurales',
      'Estructuras metálicas 50+ años de vida útil'
    ]
  },
  'infraestructura-urbana': {
    nombre: 'Infraestructura Urbana',
    beneficios: [
      'Ciclopuentes y pasarelas para movilidad sostenible',
      'Estaciones de transporte masivo integradas',
      'Pérgolas y estructuras de sombra urbana',
      'Miradores metálicos hasta 25m de altura',
      'Puentes urbanos que conectan comunidades'
    ]
  },
  'edificaciones': {
    nombre: 'Edificaciones',
    beneficios: [
      'Edificios de oficinas 5-15 pisos con plantas libres',
      'Parqueaderos multinivel hasta 8 niveles',
      'Edificios culturales con diseño emblemático',
      'Ampliaciones sin interrumpir operaciones del edificio',
      'Estructuras metálicas certificadas NSR-10'
    ]
  },
  'deportes-educacion': {
    nombre: 'Deportes & Educación',
    beneficios: [
      'Coliseos certificados para eventos internacionales',
      'Cubiertas de gran luz hasta 75m sin columnas',
      'Torres metálicas 15-30m para iluminación deportiva',
      'Graderías metálicas hasta 15,000 espectadores',
      'Cubiertas tensionadas con membranas arquitectónicas'
    ]
  }
}

async function actualizarBeneficios() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN DE BENEFICIOS - ALINEACIÓN CON ESTRUCTURAS METÁLICAS')
    console.log('='.repeat(80) + '\n')

    // Crear respaldo
    console.log('📦 Paso 1: Creando respaldo de beneficios...')
    const categoriasActuales = await prisma.categoriaProyecto.findMany({
      where: {
        slug: {
          in: Object.keys(BENEFICIOS_ACTUALIZADOS)
        }
      }
    })

    const backupData = {}
    categoriasActuales.forEach(cat => {
      backupData[cat.slug] = {
        nombre: cat.nombre,
        beneficios: cat.beneficios
      }
    })

    const backupFilename = `./respaldo-beneficios-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2))
    console.log(`   ✅ Respaldo creado: ${backupFilename}\n`)

    // Actualizar cada categoría
    let categoriasActualizadas = 0

    for (const [slug, data] of Object.entries(BENEFICIOS_ACTUALIZADOS)) {
      console.log(`📝 Actualizando: ${data.nombre.toUpperCase()}`)

      const categoriaActual = categoriasActuales.find(c => c.slug === slug)

      if (categoriaActual) {
        // Mostrar cambios
        console.log('   Beneficios anteriores:')
        if (categoriaActual.beneficios && categoriaActual.beneficios.length > 0) {
          categoriaActual.beneficios.forEach((b, i) => {
            console.log(`      ${i + 1}. ${b}`)
          })
        }

        console.log('   Beneficios nuevos:')
        data.beneficios.forEach((b, i) => {
          console.log(`      ${i + 1}. ${b}`)
        })

        // Actualizar en base de datos
        await prisma.categoriaProyecto.update({
          where: { id: categoriaActual.id },
          data: {
            beneficios: data.beneficios
          }
        })

        console.log('   ✅ Actualizada exitosamente\n')
        categoriasActualizadas++
      } else {
        console.log(`   ⚠️  No se encontró la categoría con slug: ${slug}\n`)
      }
    }

    // Resumen final
    console.log('='.repeat(80))
    console.log('✅ ACTUALIZACIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log(`   Categorías actualizadas: ${categoriasActualizadas}/${Object.keys(BENEFICIOS_ACTUALIZADOS).length}`)
    console.log(`   Total beneficios: ${categoriasActualizadas * 5}`)
    console.log('')
    console.log('📋 CAMBIOS PRINCIPALES:')
    console.log('   • COMERCIAL: Énfasis en métricas y beneficios comerciales')
    console.log('   • INDUSTRIAL: Mantenido (ya era coherente)')
    console.log('   • PUENTES: Mantenido (ya era coherente)')
    console.log('   • INFRAESTRUCTURA: Eliminado "obras escultóricas", agregado miradores')
    console.log('   • EDIFICACIONES: Eliminado "sismorresistente" y "reforzamiento"')
    console.log('   • DEPORTES: Eliminado "acústica", agregado torres y cubiertas tensionadas')
    console.log('')
    console.log(`📁 Respaldo guardado en: ${backupFilename}`)
    console.log('='.repeat(80) + '\n')

    console.log('✅ Script finalizado exitosamente')

  } catch (error) {
    console.error('\n❌ Error al actualizar beneficios:', error)
    console.error('\nPuedes restaurar desde el archivo de respaldo si es necesario.\n')
  } finally {
    await prisma.$disconnect()
  }
}

actualizarBeneficios()
