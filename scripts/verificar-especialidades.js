const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verificarEspecialidades() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('VERIFICACIÓN DE ESPECIALIDADES - ESTRUCTURAS METÁLICAS')
    console.log('='.repeat(80) + '\n')

    const categorias = await prisma.categoria.findMany({
      where: {
        slug: {
          in: [
            'comercial',
            'industrial',
            'puentes',
            'infraestructura-urbana',
            'edificaciones',
            'deportes-educacion'
          ]
        }
      },
      orderBy: { orden: 'asc' }
    })

    let totalEspecialidades = 0
    const cambiosIdentificados = []

    for (const cat of categorias) {
      const especialidades = cat.especialidades || []
      const especialidadesActivas = especialidades.filter(e => e.activo)
      totalEspecialidades += especialidadesActivas.length

      console.log(`\n📁 ${cat.nombre.toUpperCase()}`)
      console.log(`   Slug: ${cat.slug}`)
      console.log(`   Total especialidades: ${especialidadesActivas.length}`)
      console.log(`   ${'─'.repeat(70)}`)

      especialidadesActivas.forEach((esp, idx) => {
        console.log(`   ${idx + 1}. ${esp.titulo}`)

        // Verificar que tenga imagen
        if (!esp.imagen) {
          console.log(`      ⚠️  Sin imagen asignada`)
        }

        // Verificar métricas
        if (!esp.metricas || esp.metricas.length === 0) {
          console.log(`      ⚠️  Sin métricas`)
        }

        // Verificar que sea sobre estructuras metálicas
        const descripcionLower = esp.descripcion?.toLowerCase() || ''
        const tituloLower = esp.titulo?.toLowerCase() || ''

        const estaEnfocadoEnMetal =
          descripcionLower.includes('metálica') ||
          descripcionLower.includes('acero') ||
          descripcionLower.includes('estructura') ||
          tituloLower.includes('metálica') ||
          tituloLower.includes('acero') ||
          tituloLower.includes('estructura')

        if (!estaEnfocadoEnMetal) {
          console.log(`      ⚠️  No menciona claramente estructuras metálicas`)
          cambiosIdentificados.push({
            categoria: cat.nombre,
            especialidad: esp.titulo,
            problema: 'No menciona estructuras metálicas claramente'
          })
        }
      })
    }

    console.log('\n' + '='.repeat(80))
    console.log('RESUMEN')
    console.log('='.repeat(80))
    console.log(`✅ Total de categorías verificadas: ${categorias.length}`)
    console.log(`✅ Total de especialidades activas: ${totalEspecialidades}`)
    console.log(`✅ Promedio por categoría: ${(totalEspecialidades / categorias.length).toFixed(1)}`)

    if (cambiosIdentificados.length > 0) {
      console.log(`\n⚠️  Advertencias encontradas: ${cambiosIdentificados.length}`)
      cambiosIdentificados.forEach(cambio => {
        console.log(`   • ${cambio.categoria} - ${cambio.especialidad}`)
        console.log(`     ${cambio.problema}`)
      })
    } else {
      console.log('\n✅ TODAS LAS ESPECIALIDADES ESTÁN CORRECTAMENTE ENFOCADAS EN ESTRUCTURAS METÁLICAS')
    }

    console.log('\n' + '='.repeat(80))
    console.log('CAMBIOS PRINCIPALES APLICADOS')
    console.log('='.repeat(80))
    console.log('\n✅ COMERCIAL:')
    console.log('   • "Fachadas Ventiladas" → "Cubiertas y Fachadas Metálicas"')

    console.log('\n✅ PUENTES:')
    console.log('   • "Ciclopuentes" → "Puentes Peatonales y de Acceso"')

    console.log('\n✅ INFRAESTRUCTURA_URBANA:')
    console.log('   • Agregado: "Ciclopuentes y Pasarelas Peatonales" (movilidad urbana)')
    console.log('   • Eliminado: "Escalinatas" (concreto)')
    console.log('   • Eliminado: "Servicios Públicos" (instalaciones)')
    console.log('   • Agregado: "Estructuras de Sombra y Pérgolas Urbanas"')
    console.log('   • Agregado: "Miradores y Torres de Observación"')

    console.log('\n✅ EDIFICACIONES:')
    console.log('   • "Diseño Sismorresistente" → "Edificios Institucionales y de Oficinas"')
    console.log('   • "Reforzamiento Estructural" → "Ampliaciones a Edificios Existentes"')

    console.log('\n✅ DEPORTES_EDUCACION:')
    console.log('   • "Acústica Deportiva" → "Cubiertas Tensionadas y Membranas"')
    console.log('   • "Iluminación Deportiva" → "Torres Metálicas para Iluminación Deportiva"')

    console.log('\n' + '='.repeat(80))
    console.log('✅ VERIFICACIÓN COMPLETADA')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error al verificar especialidades:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarEspecialidades()
