const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// DESCRIPCIONES CON TONO HUMANO Y CONVERSACIONAL
const DESCRIPCIONES_HUMANAS = {
  'comercial': {
    'Estructuras de Gran Luz': '¿Necesita un espacio comercial amplio sin columnas que estorben? Las estructuras metálicas le dan **espacios completamente libres** donde puede distribuir sus locales como quiera. El sistema modular aprovecha cada metro cuadrado para **maximizar su área rentable**.\n\nCuando sus inquilinos cambien o renueven, puede **adaptar el espacio fácilmente** sin tocar la estructura. Ideal para centros comerciales, supermercados o grandes superficies donde necesita flexibilidad total para que su negocio crezca y evolucione con el mercado.',

    'Cubiertas y Fachadas Metálicas': '¿Busca proteger su local comercial con cubiertas que duren años? Trabajamos con **sistemas impermeables** de alta duración que combinan protección estructural con **estética moderna** que atrae clientes a su negocio.\n\nLa construcción en acero **reduce sus tiempos de obra** significativamente comparado con métodos tradicionales. Esto significa que puede **abrir más rápido** y empezar a generar ingresos antes. Perfecto para retail, locales comerciales y edificios donde la imagen y velocidad son críticas.',

    'Entrepisos y Mezanines de Alta Capacidad': '¿Quiere duplicar su espacio sin ampliar el edificio? Con entrepisos metálicos puede crear **dos o más niveles** donde antes tenía uno solo. Sistema desmontable que le permite **reconfigurar completamente** si cambia el uso de su espacio.\n\n**Maximice la rentabilidad** de su inmueble creando área adicional para almacenamiento o venta sin gastar en expansión horizontal. Soporta cargas pesadas de inventario y tránsito de público. Ideal para retail, bodegas y puntos de venta donde cada metro cuadrado cuenta.'
  },

  'industrial': {
    'Naves Industriales de Gran Luz': '¿Necesita una bodega grande sin columnas que interrumpan sus operaciones? Construimos naves industriales con **espacios completamente libres** para que mueva montacargas y equipos sin obstáculos. Alturas generosas le permiten usar **almacenamiento vertical** con racks de múltiples niveles.\n\nEl sistema modular permite **expandir su bodega** agregando crujías cuando crezca, sin tocar lo existente ni parar operaciones. La **construcción prefabricada** reduce drásticamente los tiempos. Perfecto cuando necesita grandes espacios abiertos para logística y almacenamiento eficiente.',

    'Edificios Industriales de Múltiples Niveles': '¿Su proceso productivo necesita varios pisos? Diseñamos edificios industriales que alojan **procesos complejos en vertical**. Los entrepisos metálicos soportan maquinaria pesada **sin transmitir vibraciones** entre niveles, protegiendo sus procesos sensibles.\n\nLa estructura resiste **ambientes agresivos** por vapores químicos o humedad constante. Si necesita crecer, puede **expandir sin parar producción** durante la construcción. Ideal cuando su industria opera continuamente y no puede permitirse interrupciones mientras crece.',

    'Estructuras Especializadas de Alta Resistencia': '¿Opera en condiciones extremas? Diseñamos estructuras para **ambientes exigentes** como cuartos fríos industriales, atmósferas corrosivas y vibraciones de maquinaria pesada. Las cerchas optimizadas minimizan puentes térmicos **reduciendo su consumo energético**.\n\nUsamos acero con **recubrimientos especiales** que resisten condensación permanente y químicos agresivos. Cada estructura la diseñamos específicamente para los requerimientos únicos de su proceso, garantizando que dure décadas en las condiciones más difíciles.'
  },

  'puentes': {
    'Puentes de Vigas y Cerchas': '¿Necesita un puente vehicular o peatonal que salve luces importantes? Trabajamos con vigas cajón y cerchas metálicas que **fabricamos completamente en taller** con control de calidad estricto, garantizando precisión en cada conexión.\n\nPodemos montar su puente por dovelas o con **lanzamiento incremental** usando nariz metálica y gatos hidráulicos según su proyecto. Todo **diseñado para resistir sismos** según NSR-10, con sistemas de protección que duran décadas. Ideal cuando necesita cruzar ríos, vías o quebradas con cargas importantes.',

    'Puentes en Arco Metálico': '¿Tiene restricciones de altura pero necesita salvar una luz considerable? Los puentes en arco aprovechan la compresión del acero para resolver este desafío técnico. El arco transfiere cargas lateralmente hacia los estribos, optimizando la **eficiencia estructural**.\n\nPrefabricamos las dovelas de arco en módulos que montamos **progresivamente** desde los extremos hacia el centro. El diseño crea un **elemento visual distintivo** que se integra con el entorno. Perfecto cuando la topografía limita la altura disponible para su puente.',

    'Puentes Peatonales': '¿Necesita conectar comunidades rápidamente sin cerrar vías? Los puentes peatonales livianos permiten **instalación en horas** en lugar de semanas. Por su poco peso, podemos hacer **montaje nocturno** o en fines de semana, manteniendo el tráfico diurno normal.\n\nLos sistemas prefabricados se transportan completos y ensamblan rápidamente. El acabado **galvanizado en caliente** elimina mantenimiento en zonas de difícil acceso. Incluye **rampas accesibles** según normativa universal, conectando comunidades de forma rápida y económica donde el acceso tradicional sería muy costoso o lento.'
  },

  'edificaciones': {
    'Pórticos Metálicos de Múltiples Niveles': '¿Necesita un edificio de varios pisos con espacios flexibles? Los sistemas de pórticos metálicos le dan **plantas completamente libres** sin muros de carga. Puede distribuir el interior como quiera según sus necesidades actuales y futuras.\n\nLas losas colaborantes integradas con vigas **reducen tiempos de construcción** comparado con sistemas tradicionales. Las fachadas livianas se cuelgan de la estructura permitiendo grandes áreas vidriadas. Todo **diseñado para resistir sismos** según NSR-10 para seguridad garantizada.',

    'Estructuras Metálicas para Estacionamiento': '¿Necesita más cajones de parqueo pero tiene poco terreno? Las estructuras metálicas le permiten **apilar vehículos en vertical**, resolviendo la escasez de área en proyectos urbanos. La modulación optimiza el número de cajones por metro cuadrado construido.\n\nLa **ventilación natural** mediante fachadas abiertas elimina sistemas mecánicos de extracción, reduciendo sus costos operativos permanentemente. Construimos más rápido que con concreto, lo que significa que puede **generar ingresos por estacionamiento antes** en el cronograma de su proyecto.',

    'Estructuras Livianas Modulares': '¿Necesita ampliar su edificio sin parar operaciones? Las estructuras modulares prefabricadas permiten **construcción ultrarrápida** de ampliaciones o edificios completos. Fabricamos en taller mientras preparan cimentación, acelerando drásticamente el cronograma.\n\nLa ligereza del acero minimiza cargas sobre **cimentaciones existentes**, permitiendo ampliaciones sin reforzar bases. Podemos hacer **montaje nocturno** o en fines de semana para que opere normalmente durante el día. Perfecto cuando no puede interrumpir sus actividades durante la ampliación.'
  },

  'deportes-educacion': {
    'Coliseos y Canchas Cubiertas': '¿Necesita un coliseo o cancha cubierta con visuales óptimas? Diseñamos **cubiertas de gran luz** sin columnas para que las graderías tengan vista perfecta. Todo **diseñado para resistir sismos** garantizando seguridad en eventos masivos según normativa de federaciones internacionales.\n\nLas plataformas integradas soportan **iluminación profesional** deportiva sin interferir con el juego. La ventilación natural reduce costos operativos permanentemente. El diseño permite múltiples disciplinas deportivas en un solo recinto, maximizando la utilización del espacio durante todo el año.',

    'Piscinas Cubiertas': '¿Necesita cubrir una piscina olímpica o recreativa? Trabajamos con estructuras especiales para **ambientes de alta humedad**. El **galvanizado en caliente** más pintura epóxica especial protegen contra el ambiente salino del cloro y condensación constante.\n\nLas cubiertas translúcidas aportan **iluminación natural** reduciendo su consumo eléctrico. La ventilación integrada extrae aire húmedo evitando condensación destructiva en estructura y equipos. Capacidad para soportar marcadores electrónicos y sistemas de climatización suspendidos que necesite.',

    'Torres y Estructuras Auxiliares': '¿Necesita torres de iluminación para su escenario deportivo? Las diseñamos para resistir **vientos extremos** sin vibrar mediante análisis dinámico riguroso. Las plataformas de mantenimiento en la cima permiten **acceso seguro** para cambiar luminarias y ajustar equipos.\n\nEl acabado galvanizado elimina **mantenimiento de pintura en altura**, reduciendo sus costos a largo plazo. Incluye **graderías metálicas** de alta capacidad integradas estructuralmente. Los niveles de iluminación cumplen **normativa para transmisión televisiva** de eventos deportivos profesionales.'
  }
}

async function humanizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('HUMANIZACIÓN COMPLETA: Tono Conversacional')
    console.log('De lenguaje técnico/robótico → a conversación directa con el cliente')
    console.log('='.repeat(80) + '\n')

    const categorias = {
      'comercial': 'COMERCIAL',
      'industrial': 'INDUSTRIAL',
      'puentes': 'PUENTES',
      'edificaciones': 'EDIFICACIONES',
      'deportes-educacion': 'DEPORTES & EDUCACIÓN'
    }

    let totalActualizadas = 0

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
      const backupFile = `./respaldo-humanizado-${slug}-${Date.now()}.json`
      fs.writeFileSync(backupFile, JSON.stringify({
        nombre: categoria.nombre,
        especialidades: categoria.especialidades
      }, null, 2))

      // Actualizar descripciones
      const especialidadesActualizadas = categoria.especialidades.map(esp => {
        const nuevaDesc = DESCRIPCIONES_HUMANAS[slug]?.[esp.titulo]
        if (nuevaDesc) {
          const parrafos = nuevaDesc.split('\n\n').length
          const negritas = (nuevaDesc.match(/\*\*/g) || []).length / 2
          const palabras = nuevaDesc.replace(/\*\*/g, '').split(' ').length

          // Analizar cambios de tono
          const tienePreguntas = nuevaDesc.includes('¿')
          const tieneSegundaPersona = nuevaDesc.includes('su ') || nuevaDesc.includes('puede')
          const tienePrimeraPersona = nuevaDesc.includes('trabajamos') || nuevaDesc.includes('diseñamos')

          console.log(`   ✅ ${esp.titulo}`)
          console.log(`      Tono humanizado: ${tienePreguntas ? '✓ Preguntas' : ''} ${tieneSegundaPersona ? '✓ 2ªP' : ''} ${tienePrimeraPersona ? '✓ 1ªP' : ''}`)
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
    console.log(`✅ HUMANIZACIÓN COMPLETADA: ${totalActualizadas} especialidades`)
    console.log('='.repeat(80))
    console.log('\n🎯 Cambios de tono aplicados:')
    console.log('   • ¿Preguntas directas? → Sí')
    console.log('   • Segunda persona (su, puede) → Sí')
    console.log('   • Primera persona (trabajamos, diseñamos) → Sí')
    console.log('   • Lenguaje conversacional → Sí')
    console.log('\n✨ Resultado: De manual técnico a conversación con el cliente')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

humanizar()
