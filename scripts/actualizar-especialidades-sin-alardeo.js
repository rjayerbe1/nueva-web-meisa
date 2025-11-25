const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// NUEVAS DESCRIPCIONES: Enfoque híbrido (CÓMO + QUÉ GANA) sin alardeo
const DESCRIPCIONES_SIN_ALARDEO = {
  'comercial': {
    'Estructuras de Gran Luz': 'Estructuras metálicas que permiten espacios comerciales amplios sin columnas intermedias, maximizando la **flexibilidad de distribución** para locales y circulación. Sistema modular con luces de gran claro que aprovecha al máximo el área rentable del proyecto.\n\nEl diseño modular facilita **futuras remodelaciones** cuando cambien inquilinos o giros de negocio. Ideal para centros comerciales, supermercados y grandes superficies donde la **planta libre** es clave para la rentabilidad y adaptabilidad del espacio comercial.',

    'Cubiertas y Fachadas Metálicas': 'Cubiertas metálicas con **sistemas impermeables** de larga duración que protegen espacios comerciales. Fachadas metálicas que combinan funcionalidad estructural con **estética arquitectónica moderna**, creando imagen atractiva para clientes.\n\nLa construcción en acero **reduce tiempos de obra** significativamente comparado con sistemas tradicionales. El resultado es apertura más rápida del negocio, reduciendo períodos sin generar ingresos. Ideal para proyectos retail donde la imagen y velocidad de entrega son críticas.',

    'Entrepisos y Mezanines de Alta Capacidad': 'Estructuras que **duplican el área útil** sin ampliar la huella del edificio, creando dos o más niveles donde antes había uno. Sistema desmontable que permite **reconfiguración completa** si cambia el uso del espacio comercial.\n\n**Maximiza la rentabilidad** del inmueble al crear área adicional de almacenamiento o venta sin costos de expansión horizontal. Soporta cargas pesadas de inventario y tránsito de público. Aplicable en retail, bodegas comerciales y puntos de venta donde el metro cuadrado es crítico.'
  },

  'industrial': {
    'Naves Industriales de Gran Luz': 'Bodegas industriales y hangares con luces sin columnas que maximizan **espacios libres** para operaciones logísticas y almacenamiento. Alturas generosas permiten aprovechar **almacenamiento vertical** con sistemas de racks de múltiples niveles.\n\nSistema modular permite **expansiones futuras** agregando crujías adicionales sin modificar la estructura existente ni interrumpir operaciones. La **construcción prefabricada** reduce tiempos de obra drásticamente. Ideal cuando su operación requiere grandes espacios abiertos para maniobra de montacargas y equipos industriales.',

    'Edificios Industriales de Múltiples Niveles': 'Edificios industriales de varios pisos diseñados para alojar **procesos productivos complejos** en vertical. Entrepisos metálicos soportan maquinaria pesada de producción **sin transmitir vibraciones** entre niveles, protegiendo procesos sensibles.\n\nEstructura diseñada para resistir **ambientes agresivos** por vapores químicos o humedad constante. La modulación permite **expansión sin interrumpir producción** existente durante construcción. Ideal para industrias que requieren operación continua mientras crecen.',

    'Estructuras Especializadas de Alta Resistencia': 'Estructuras metálicas diseñadas para **condiciones operativas extremas** como refrigeración industrial, atmósferas corrosivas y vibraciones de maquinaria pesada. Cerchas optimizadas minimizan puentes térmicos **reduciendo consumo energético** en cuartos fríos.\n\nAcero con **recubrimientos anticorrosivos especiales** resiste condensación permanente y ambientes químicamente agresivos. Cada estructura se diseña específicamente según los requerimientos únicos del proceso industrial, garantizando durabilidad en las condiciones más exigentes.'
  },

  'puentes': {
    'Puentes de Vigas y Cerchas': 'Puentes metálicos mediante vigas cajón o cerchas reticuladas que permiten salvar luces importantes para tráfico vehicular y peatonal. Fabricación en taller con **control de calidad certificado** garantiza precisión en cada conexión estructural.\n\nMontaje por dovelas permite construir sin **cerrar completamente la vía inferior**, minimizando impacto en tráfico existente. **Diseño sismorresistente** cumpliendo NSR-10 con acabados anticorrosivos de larga duración. **Instalación nocturna** permite mantener operación diurna, reduciendo pérdidas económicas por congestión.',

    'Puentes en Arco Metálico': 'Puentes con geometría en arco que aprovechan el comportamiento a compresión del acero para salvar luces considerables con **restricciones de altura**. El arco transfiere cargas lateralmente hacia estribos mediante compresión pura, optimizando eficiencia estructural.\n\nPrefabricación modular de dovelas permite **montaje progresivo** desde extremos hacia el centro. El diseño arquitectónico del arco crea un **elemento visual distintivo** que se integra con el entorno. Ideal cuando la topografía limita altura pero se requiere luz considerable para la vía inferior.',

    'Puentes Peatonales': 'Puentes metálicos livianos diseñados para conectar comunidades mediante estructuras eficientes. La ligereza del acero permite construir en **terrenos difíciles** con cimentaciones económicas, crucial en zonas remotas o complejas topográficamente.\n\nSistemas prefabricados facilitan **instalación rápida** sin requerir maquinaria pesada en sitio. Acabado **galvanizado en caliente** elimina mantenimientos costosos en zonas de difícil acceso. Incluye diseño de **rampas accesibles** cumpliendo normativa de accesibilidad universal para integración comunitaria completa.'
  },

  'edificaciones': {
    'Pórticos Metálicos de Múltiples Niveles': 'Estructuras de acero para edificios de múltiples pisos mediante sistemas de pórticos que permiten **plantas libres** sin muros de carga. Modulación amplia facilita distribución interior variable según necesidades actuales y futuras del edificio.\n\nLosas colaborantes integradas con vigas **reducen tiempos de construcción** comparado con sistemas tradicionales. Fachadas livianas se cuelgan de la estructura permitiendo grandes áreas vidriadas. **Diseño sismorresistente** certificado cumpliendo NSR-10 para seguridad estructural garantizada.',

    'Estructuras Metálicas para Estacionamiento': 'Estructuras metálicas que **maximizan vehículos estacionados** mediante apilamiento vertical, resolviendo escasez de área en proyectos urbanos. Vigas metálicas soportan losas que resisten tránsito vehicular pesado con modulación optimizada por número de cajones.\n\n**Ventilación natural** mediante fachadas abiertas elimina sistemas mecánicos de extracción de gases, reduciendo costos operativos permanentemente. La construcción en acero permite construir más rápido que concreto, generando ingresos por estacionamiento antes en el cronograma del proyecto.',

    'Estructuras Livianas Modulares': 'Estructuras metálicas prefabricadas en módulos para **construcción rápida** de ampliaciones o edificios completos. Fabricación en taller mientras se prepara cimentación acelera drásticamente el cronograma comparado con construcción tradicional.\n\nLigereza del acero minimiza cargas sobre **cimentaciones existentes**, permitiendo ampliaciones verticales o laterales sin reforzar bases. **Montaje nocturno** o en fines de semana permite operación diurna continua del edificio. Ideal cuando no puede interrumpir actividades durante ampliación.'
  },

  'deportes-educacion': {
    'Coliseos y Canchas Cubiertas': 'Estructuras deportivas cubiertas con **cubiertas de gran luz** sin columnas que permiten graderías con visuales óptimas para el público. **Diseño sismorresistente** garantiza seguridad en concentraciones masivas cumpliendo normativa de federaciones deportivas internacionales.\n\nPlataformas integradas para **iluminación profesional** deportiva sin interferir con juego. Ventilación natural reduce costos operativos permanentemente. El diseño permite albergar múltiples disciplinas deportivas en un solo recinto, maximizando utilización del espacio a lo largo del año.',

    'Piscinas Cubiertas': 'Estructuras metálicas sobre piscinas con tratamiento especial para **ambientes de alta humedad**. **Galvanizado en caliente** más pintura epóxica especial protegen la estructura contra ambiente salino generado por cloro y condensación constante.\n\nCubiertas translúcidas aportan **iluminación natural** reduciendo consumo eléctrico. Ventilación integrada extrae aire húmedo evitando condensación destructiva en estructura y equipos. Capacidad para soportar equipos pesados suspendidos como marcadores electrónicos y sistemas de climatización.',

    'Torres y Estructuras Auxiliares': 'Torres de iluminación diseñadas para resistir **vientos extremos** sin vibrar mediante análisis dinámico riguroso. Plataformas de mantenimiento en la cima permiten **acceso seguro** para cambio de luminarias y ajustes de equipos.\n\nAcabado galvanizado elimina **mantenimiento de pintura en altura**, reduciendo costos operativos a largo plazo. Incluye **graderías metálicas** de alta capacidad integradas estructuralmente. Niveles de iluminación cumplen **normativa para transmisión televisiva** de eventos deportivos profesionales.'
  }
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('REESCRITURA: Enfoque Híbrido Sin Alardeo')
    console.log('Párrafo 1: CÓMO funciona (capacidades técnicas)')
    console.log('Párrafo 2: QUÉ GANA el cliente (beneficios)')
    console.log('='.repeat(80) + '\n')

    const categorias = {
      'comercial': 'COMERCIAL',
      'industrial': 'INDUSTRIAL',
      'puentes': 'PUENTES',
      'edificaciones': 'EDIFICACIONES',
      'deportes-educacion': 'DEPORTES & EDUCACIÓN'
    }

    let totalActualizadas = 0
    const stats = {
      frasesAlardeoEliminadas: 0,
      numerosEliminados: 0
    }

    for (const [slug, nombre] of Object.entries(categorias)) {
      console.log(`\n📁 ${nombre}`)
      console.log('-'.repeat(80))

      const categoria = await prisma.categoriaProyecto.findUnique({
        where: { slug }
      })

      if (!categoria) {
        console.log(`   ❌ No encontrada`)
        continue
      }

      // Respaldo
      const backupFile = `./respaldo-sin-alardeo-${slug}-${Date.now()}.json`
      fs.writeFileSync(backupFile, JSON.stringify({
        nombre: categoria.nombre,
        especialidades: categoria.especialidades
      }, null, 2))
      console.log(`   💾 Respaldo: ${backupFile}`)

      // Actualizar descripciones
      const especialidadesActualizadas = categoria.especialidades.map(esp => {
        const nuevaDesc = DESCRIPCIONES_SIN_ALARDEO[slug]?.[esp.titulo]
        if (nuevaDesc) {
          // Analizar cambios
          const tieneMeisaHa = esp.descripcion.includes('MEISA ha')
          const tieneNumeros = /\d+/.test(esp.descripcion)

          if (tieneMeisaHa) stats.frasesAlardeoEliminadas++
          if (tieneNumeros) stats.numerosEliminados++

          const parrafos = nuevaDesc.split('\n\n').length
          const negritas = (nuevaDesc.match(/\*\*/g) || []).length / 2
          const palabras = nuevaDesc.replace(/\*\*/g, '').split(' ').length

          console.log(`   ✅ ${esp.titulo}`)
          console.log(`      Eliminado: ${tieneMeisaHa ? '"MEISA ha..."' : '-'} ${tieneNumeros ? '+ números' : ''}`)
          console.log(`      Párrafos: ${parrafos} | Negritas: ${negritas} | Palabras: ${palabras}`)

          totalActualizadas++
          return { ...esp, descripcion: nuevaDesc }
        }
        return esp
      })

      await prisma.categoriaProyecto.update({
        where: { slug },
        data: { especialidades: especialidadesActualizadas }
      })
    }

    console.log('\n' + '='.repeat(80))
    console.log(`✅ REESCRITURA COMPLETADA: ${totalActualizadas} especialidades`)
    console.log('='.repeat(80))
    console.log('\n📊 Estadísticas de limpieza:')
    console.log(`   • Frases "MEISA ha construido..." eliminadas: ${stats.frasesAlardeoEliminadas}`)
    console.log(`   • Descripciones con números eliminados: ${stats.numerosEliminados}`)
    console.log('\n🎯 Nuevo enfoque aplicado:')
    console.log('   • Párrafo 1: Capacidades técnicas (CÓMO funciona)')
    console.log('   • Párrafo 2: Beneficios para el cliente (QUÉ GANA)')
    console.log('   • 100% centrado en el cliente, 0% alardeo')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
