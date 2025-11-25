const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// DESCRIPCIONES CONTEXTUALIZADAS CON PROYECTOS
// Sin explicaciones básicas, usando proyectos para dar contexto
const DESCRIPCIONES_PROYECTOS = {
  'comercial': {
    'Estructuras de Gran Luz': '¿Construye un supermercado, centro comercial o hipermercado? Estas edificaciones requieren **espacios amplios sin columnas** que interrumpan la circulación o limiten cómo distribuye sus locales. La estructura metálica permite cubrir grandes áreas dejando el interior completamente libre.\n\nPuede organizar góndolas, islas promocionales o locales comerciales donde lo necesite. Si después requiere reorganizar el espacio, la estructura lo permite sin obras mayores. **Flexibilidad total** para adaptar su negocio a las tendencias del mercado.',

    'Cubiertas y Fachadas Metálicas': '¿Su centro comercial, tienda o local retail necesita protección y buena imagen? Las cubiertas metálicas le dan **techos durables** que resisten décadas sin filtraciones. Las fachadas metálicas le dan el aspecto moderno que atrae clientes a su negocio.\n\nSe fabrican en taller y se instalan rápido, acortando el tiempo de obra. Puede elegir acabados, colores y texturas que reflejen su marca. Juntas, cubierta y fachada protegen su inversión y **proyectan la imagen** que su negocio necesita.',

    'Entrepisos y Mezanines de Alta Capacidad': '¿Tiene una bodega comercial, local multinivel o punto de venta donde necesita más espacio? Un entrepiso metálico le permite **crear un nivel adicional** aprovechando la altura que ya tiene, sin ampliar el edificio ni comprar más terreno.\n\nFunciona para salas de cine con múltiples niveles, locales comerciales con mezanine de exhibición, o bodegas que necesitan área de oficinas arriba. Soporta cargas pesadas y se puede **reubicar** si cambia de local.'
  },

  'industrial': {
    'Naves Industriales de Gran Luz': '¿Necesita una bodega industrial, centro de distribución, hangar o almacén? Estas operaciones requieren **grandes espacios sin columnas** donde montacargas, racks y equipos se muevan libremente sin obstáculos que compliquen la logística.\n\nToda la altura queda disponible para almacenamiento vertical. Si su operación crece, puede **agregar módulos** sin afectar lo existente ni parar actividades. Fabricamos en taller y montamos rápido para que arranque operaciones lo antes posible.',

    'Edificios Industriales de Múltiples Niveles': '¿Opera una planta farmacéutica, ingenio azucarero o edificio de producción que necesita varios pisos? Algunos procesos industriales requieren flujos verticales donde materiales o productos bajan por gravedad o suben por bandas entre niveles.\n\nLos pisos soportan **maquinaria pesada** sin transmitir vibraciones a niveles vecinos. Resisten ambientes con químicos o humedad constante. Puede **ampliar sin parar producción** porque construimos al lado mientras usted sigue operando.',

    'Estructuras Especializadas de Alta Resistencia': '¿Su planta tiene cuartos fríos, cámaras de refrigeración o procesos con ambientes corrosivos? Estas condiciones especiales destruyen estructuras convencionales. Necesita una solución diseñada específicamente para **resistir su ambiente particular**.\n\nPara cuartos fríos, minimizamos puentes térmicos que le cuestan energía. Para ambientes corrosivos, usamos recubrimientos que resisten químicos y humedad. **Cada estructura se diseña** según las condiciones específicas de su proceso.'
  },

  'puentes': {
    'Puentes de Vigas y Cerchas': '¿Necesita un puente vehicular, viaducto o ciclopuente? Estos proyectos de infraestructura requieren estructuras que soporten tráfico pesado y cumplan normativa sísmica colombiana. Trabajamos tanto con vigas para luces moderadas como con cerchas para distancias mayores.\n\nFabricamos en taller con control de calidad y montamos en sitio por dovelas o con **lanzamiento incremental** según las condiciones de su obra. Usted elige el método que mejor funcione para su proyecto. Todo cumple **NSR-10**.',

    'Puentes en Arco Metálico': '¿Su puente debe cruzar un río, quebrada o vía con restricciones de altura? Cuando no hay espacio vertical suficiente para vigas convencionales, el arco metálico resuelve el problema empujando las cargas hacia los lados en vez de hacia abajo.\n\nAdemás de funcional, el arco le da al puente un **aspecto emblemático** que se convierte en referencia del sector. Si busca que su puente sea también un elemento distintivo de la zona, el arco es la opción que combina ingeniería y arquitectura.',

    'Puentes Peatonales': '¿Necesita conectar barrios, cruzar avenidas o dar acceso a estaciones de transporte? Los puentes peatonales y pasarelas urbanas son estructuras livianas que se instalan **mucho más rápido** que opciones en concreto.\n\nPodemos montar de noche o fines de semana sin cerrar vías. Incluyen rampas para personas con movilidad reducida. Algunos proyectos incluyen puentes colgantes para zonas rurales o cruces de ríos donde no hay acceso para equipos pesados.'
  },

  'edificaciones': {
    'Pórticos Metálicos de Múltiples Niveles': '¿Construye un edificio de oficinas, sede administrativa, edificio gubernamental, museo o teatro? Estos proyectos necesitan **plantas flexibles** donde pueda distribuir espacios según las necesidades de cada piso, sin muros estructurales que limiten el diseño.\n\nLas fachadas van colgadas del pórtico, permitiendo grandes ventanales o acabados arquitectónicos sin comprometer la estructura. Puede **reorganizar interiores** después sin tocar la estructura. Construcción más rápida que en concreto, cumpliendo NSR-10.',

    'Estructuras Metálicas para Estacionamiento': '¿Necesita un parqueadero multinivel o edificio de estacionamiento pero tiene terreno limitado? La solución es **apilar vehículos en vertical**, multiplicando la capacidad de parqueo en el mismo espacio de terreno disponible.\n\nLas rampas conectan niveles para circulación fluida. Las fachadas abiertas dan ventilación natural, eliminando extractores que cuestan operar. Se construye más rápido que en concreto, lo que significa que **genera ingresos antes** en su proyecto.',

    'Estructuras Livianas Modulares': '¿Necesita ampliar un colegio, clínica u oficina sin interrumpir operaciones? Las estructuras modulares son sistemas livianos que se fabrican en taller por secciones y se ensamblan rápido en sitio, ideales para **ampliaciones verticales o laterales**.\n\nPor ser livianas, se pueden montar sobre edificios existentes sin reforzar cimentaciones. Instalamos de noche o fines de semana para que **siga operando normalmente**. Perfecto cuando no puede cerrar mientras construye.'
  },

  'deportes-educacion': {
    'Coliseos y Canchas Cubiertas': '¿Construye un coliseo deportivo, pabellón, cancha cubierta o arena para eventos? Estos espacios necesitan **cubiertas de gran luz** sin columnas que bloqueen la vista del público o interfieran con el área de juego.\n\nLa estructura permite graderías con visual perfecta desde cualquier ubicación. Soporta iluminación profesional y equipos suspendidos. Diseño antisísmico para **seguridad en eventos masivos**. Ventilación natural que reduce costos de operación permanentemente.',

    'Piscinas Cubiertas': '¿Necesita cubrir una piscina olímpica, complejo acuático o natatorio? El ambiente sobre piscinas es agresivo: el cloro genera vapor salino y la condensación constante destruye estructuras normales en pocos años.\n\nUsamos tratamientos especiales que **resisten este ambiente único**. Cubiertas translúcidas aportan luz natural reduciendo consumo eléctrico. La ventilación integrada extrae humedad protegiendo estructura y equipos. Solución durable para un ambiente que exige materiales especializados.',

    'Torres y Estructuras Auxiliares': '¿Su campo deportivo necesita torres de iluminación o graderías metálicas? Las torres deben resistir vientos fuertes sin vibrar, garantizando **iluminación estable** para entrenamientos y eventos. Las graderías deben soportar cargas de público con seguridad.\n\nIncluyen plataformas de acceso seguro para mantenimiento de luminarias. El galvanizado elimina repintado en altura. Si transmite eventos, los niveles de luz cumplen **normativa para televisión**. Todo diseñado para operación profesional de su instalación deportiva.'
  }
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('DESCRIPCIONES CONTEXTUALIZADAS CON PROYECTOS')
    console.log('Sin explicaciones básicas - Usando proyectos ejemplo para dar contexto')
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
      const backupFile = `./respaldo-proyectos-${slug}-${Date.now()}.json`
      fs.writeFileSync(backupFile, JSON.stringify({
        nombre: categoria.nombre,
        especialidades: categoria.especialidades
      }, null, 2))

      // Actualizar descripciones
      const especialidadesActualizadas = categoria.especialidades.map(esp => {
        const nuevaDesc = DESCRIPCIONES_PROYECTOS[slug]?.[esp.titulo]
        if (nuevaDesc) {
          const parrafos = nuevaDesc.split('\n\n').length
          const negritas = (nuevaDesc.match(/\*\*/g) || []).length / 2
          const palabras = nuevaDesc.replace(/\*\*/g, '').split(' ').length

          console.log(`   ✅ ${esp.titulo}`)
          console.log(`      Proyectos usados: ${(esp.proyectosEjemplo || []).slice(0, 3).join(', ')}`)
          console.log(`      Palabras: ${palabras}`)

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
    console.log(`✅ ACTUALIZACIÓN COMPLETADA: ${totalActualizadas} especialidades`)
    console.log('='.repeat(80))
    console.log('\n🎯 Cambios aplicados:')
    console.log('   • Descripciones usan proyectos ejemplo para contextualizar')
    console.log('   • Sin explicaciones básicas tipo "gran luz significa..."')
    console.log('   • Tono profesional y directo')
    console.log('   • Cliente sabe para qué tipo de proyecto aplica')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
