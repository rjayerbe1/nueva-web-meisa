const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// DESCRIPCIONES ALINEADAS CON TÍTULOS
// Cada descripción EXPLICA el concepto del título de forma sencilla
const DESCRIPCIONES_ALINEADAS = {
  'comercial': {
    'Estructuras de Gran Luz': '¿Necesita un espacio amplio sin columnas en el medio? **"Gran luz"** significa que la estructura puede cubrir distancias largas (20, 30 o más metros) sin necesitar apoyos intermedios. Esto le da **libertad total** para distribuir su espacio comercial como quiera.\n\nSin columnas de por medio, puede ubicar góndolas, locales o exhibidores donde prefiera. La estructura soporta todo el peso desde los bordes, dejando **todo el interior libre** para su negocio. Ideal para supermercados, centros comerciales y grandes superficies.',

    'Cubiertas y Fachadas Metálicas': '¿Busca un techo durable o una fachada moderna para su edificio? Las **cubiertas metálicas** son los techos de acero que protegen su espacio de lluvia y sol. Las **fachadas metálicas** son los cerramientos exteriores que dan imagen y protección a su edificio.\n\nAmbas se fabrican en taller y se instalan rápido, reduciendo tiempo de obra. La cubierta resiste décadas sin goteras. La fachada le da un **aspecto moderno y profesional** que atrae clientes. Juntas protegen y embellecen su local comercial.',

    'Entrepisos y Mezanines de Alta Capacidad': '¿Quiere aprovechar la altura de su local creando un segundo nivel? Un **entrepiso** (o mezanine) es una plataforma metálica que se instala dentro de su espacio, creando un piso adicional sin construir un edificio nuevo.\n\nDuplica su área útil usando el espacio vertical que ya tiene. Se puede **desarmar y reubicar** si cambia de local. Soporta cargas pesadas de mercancía o tránsito de público. Perfecto cuando necesita más espacio pero no puede expandirse horizontalmente.'
  },

  'industrial': {
    'Naves Industriales de Gran Luz': '¿Necesita una bodega grande donde montacargas y equipos se muevan libremente? Las **naves de gran luz** son bodegas que cubren distancias amplias (30, 40 o más metros) sin columnas intermedias. Todo el espacio interior queda libre para su operación.\n\nAprovecha toda la altura para racks de almacenamiento vertical. Si después necesita más espacio, puede **agregar módulos** sin tocar lo existente. Se fabrica en taller y se monta rápido en sitio. Perfecto para centros de distribución, hangares y operaciones logísticas.',

    'Edificios Industriales de Múltiples Niveles': '¿Su proceso de producción necesita varios pisos conectados? Los **edificios industriales multinivel** son estructuras de varios pisos diseñadas para alojar maquinaria, producción y almacenamiento en vertical, aprovechando mejor el terreno disponible.\n\nLos pisos soportan cargas pesadas de equipos **sin transmitir vibraciones** entre niveles. Si trabaja con químicos o humedad, la estructura resiste esos ambientes. Puede **seguir produciendo** mientras construimos la ampliación al lado.',

    'Estructuras Especializadas de Alta Resistencia': '¿Su operación tiene condiciones especiales? Las **estructuras especializadas** se diseñan para casos particulares: cuartos fríos que necesitan aislar temperatura, plantas con vapores corrosivos, o procesos con vibración constante de maquinaria.\n\nCada caso lo analizamos y diseñamos específicamente para sus condiciones. Si es **cuarto frío**, minimizamos puentes térmicos para ahorrar energía. Si hay corrosión, usamos recubrimientos especiales. Su estructura se adapta a sus requerimientos únicos.'
  },

  'puentes': {
    'Puentes de Vigas y Cerchas': '¿Necesita un puente vehicular resistente? Las **vigas** son elementos horizontales sólidos que soportan peso directamente. Las **cerchas** son estructuras trianguladas más livianas que pueden cubrir distancias mayores. Elegimos el sistema según lo que necesite su proyecto.\n\nFabricamos todo en taller y lo montamos en sitio, sea por secciones (dovelas) o con **lanzamiento incremental** usando gatos hidráulicos. Usted elige el método según las condiciones de su obra. Todo cumple norma sísmica colombiana NSR-10.',

    'Puentes en Arco Metálico': '¿Necesita cruzar un río o quebrada pero tiene poca altura disponible? Un **puente en arco** usa una curva de acero que empuja hacia los lados (hacia los estribos) en vez de hacia abajo. Por eso puede salvar distancias grandes sin necesitar estructuras muy altas.\n\nEl arco trabaja principalmente en compresión, lo que hace muy **eficiente el uso del acero**. Además de funcional, el arco le da al puente un **aspecto distintivo** que se convierte en referencia visual del sector.',

    'Puentes Peatonales': '¿Necesita conectar dos puntos para paso de personas? Los **puentes peatonales** son estructuras livianas diseñadas específicamente para tránsito de gente, no vehículos. Por ser livianos, se pueden **instalar muy rápido** comparado con puentes de concreto.\n\nMontamos en horas lo que en concreto toma semanas. Podemos instalar de noche o fines de semana **sin cerrar vías**. Incluyen rampas accesibles para personas con movilidad reducida. Ideales para cruces de avenidas, accesos a estaciones o conexiones entre barrios.'
  },

  'edificaciones': {
    'Pórticos Metálicos de Múltiples Niveles': '¿Necesita un edificio de varios pisos con espacios flexibles? Los **pórticos metálicos** son marcos estructurales de acero (columnas + vigas) que soportan el edificio y permiten plantas completamente libres, sin muros de carga que limiten la distribución interior.\n\nPuede organizar oficinas, salones o locales como quiera, y **reorganizar después** sin tocar la estructura. Las fachadas van colgadas del pórtico, permitiendo grandes ventanales. Construcción más rápida que en concreto. Cumple norma sísmica NSR-10.',

    'Estructuras Metálicas para Estacionamiento': '¿Necesita más parqueaderos pero tiene poco terreno? Las **estructuras para estacionamiento** son edificios metálicos de varios niveles diseñados específicamente para apilar vehículos en vertical, multiplicando la capacidad de parqueo en el mismo terreno.\n\nLas rampas conectan los niveles para circulación cómoda de carros. La **ventilación natural** por fachadas abiertas elimina extractores mecánicos, reduciendo costos de operación. Se construye más rápido que en concreto, generando ingresos antes.',

    'Estructuras Livianas Modulares': '¿Necesita ampliar su edificio sin parar operaciones? Las **estructuras modulares** son sistemas prefabricados livianos que se fabrican en taller por módulos y se ensamblan rápido en sitio, como un sistema de piezas que encajan.\n\nPor ser livianas, se pueden montar sobre **edificios existentes** sin reforzar cimentaciones. Instalamos de noche o fines de semana para no interrumpir su operación diurna. Perfecto para ampliaciones de colegios, clínicas u oficinas donde no puede parar actividades.'
  },

  'deportes-educacion': {
    'Coliseos y Canchas Cubiertas': '¿Necesita cubrir una cancha deportiva o construir un coliseo? Las **cubiertas de gran luz** para deportes son techos de acero que protegen la cancha sin columnas intermedias que bloqueen la vista del público ni interfieran con el juego.\n\nLa estructura permite graderías con **visual perfecta** desde todos los ángulos. Soporta sistemas de iluminación profesional suspendidos. La ventilación natural reduce costos de operación. Diseño antisísmico garantiza **seguridad en eventos masivos** según normas internacionales.',

    'Piscinas Cubiertas': '¿Necesita cubrir una piscina olímpica o recreativa? Las **cubiertas para piscinas** son estructuras especiales diseñadas para resistir el ambiente húmedo y salino que genera el cloro. El vapor y la condensación destruyen estructuras normales, pero estas están preparadas.\n\nUsamos **galvanizado más pintura especial** para resistir la corrosión constante. Las cubiertas pueden ser translúcidas para iluminación natural. La ventilación integrada extrae la humedad, protegiendo la estructura y los equipos que tenga instalados.',

    'Torres y Estructuras Auxiliares': '¿Necesita torres de iluminación para su escenario deportivo? Las **torres de iluminación** son estructuras verticales diseñadas para soportar reflectores a gran altura y resistir vientos fuertes sin vibrar, garantizando iluminación estable para eventos.\n\nIncluyen plataformas de mantenimiento en la cima para **acceso seguro** a las luminarias. El galvanizado elimina la necesidad de pintar en altura, reduciendo costos de mantenimiento. Los niveles de luz cumplen **normativa para transmisión televisiva** de eventos profesionales.'
  }
}

async function alinear() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ALINEACIÓN: Descripciones que EXPLICAN el Título')
    console.log('Cada descripción ahora explica el concepto del título de forma sencilla')
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
      const backupFile = `./respaldo-alineado-${slug}-${Date.now()}.json`
      fs.writeFileSync(backupFile, JSON.stringify({
        nombre: categoria.nombre,
        especialidades: categoria.especialidades
      }, null, 2))

      // Actualizar descripciones
      const especialidadesActualizadas = categoria.especialidades.map(esp => {
        const nuevaDesc = DESCRIPCIONES_ALINEADAS[slug]?.[esp.titulo]
        if (nuevaDesc) {
          const parrafos = nuevaDesc.split('\n\n').length
          const negritas = (nuevaDesc.match(/\*\*/g) || []).length / 2
          const palabras = nuevaDesc.replace(/\*\*/g, '').split(' ').length

          // Verificar si explica el título
          const explicaTitulo = nuevaDesc.includes('**"') ||
                               nuevaDesc.includes('**puente') ||
                               nuevaDesc.includes('**nave') ||
                               nuevaDesc.includes('**torre') ||
                               nuevaDesc.includes('**cubierta') ||
                               nuevaDesc.includes('**entrepiso') ||
                               nuevaDesc.includes('**estructura')

          console.log(`   ✅ ${esp.titulo}`)
          console.log(`      ${explicaTitulo ? '✓ Explica el concepto del título' : ''}`)
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
    console.log(`✅ ALINEACIÓN COMPLETADA: ${totalActualizadas} especialidades`)
    console.log('='.repeat(80))
    console.log('\n🎯 Cambios aplicados:')
    console.log('   • Cada descripción ahora EXPLICA el concepto del título')
    console.log('   • "Gran luz" → explica qué significa (distancia sin columnas)')
    console.log('   • "Vigas y cerchas" → explica qué es cada una')
    console.log('   • "Entrepiso" → explica qué es un mezanine')
    console.log('   • Tono conversacional mantenido')
    console.log('\n✨ Ahora el cliente entiende QUÉ ES cada especialidad')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

alinear()
