const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// FORMATO: 3 PÁRRAFOS (Pregunta sola + 2 párrafos de contenido)
const DESCRIPCIONES_3P = {
  'comercial': {
    'Estructuras de Gran Luz': '¿Construye un supermercado, centro comercial o hipermercado?\n\nEstas edificaciones requieren **espacios amplios sin columnas** que interrumpan la circulación o limiten cómo distribuye sus locales. La estructura metálica permite cubrir grandes áreas dejando el interior completamente libre para su operación comercial.\n\nPuede organizar góndolas, islas promocionales o locales donde lo necesite. Si después requiere reorganizar el espacio, la estructura lo permite sin obras mayores. **Flexibilidad total** para adaptar su negocio a las tendencias del mercado.',

    'Cubiertas y Fachadas Metálicas': '¿Su centro comercial, tienda o local necesita protección y buena imagen?\n\nLas cubiertas metálicas le dan **techos durables** que resisten décadas sin filtraciones. Las fachadas metálicas le dan el aspecto moderno que atrae clientes. Ambas se fabrican en taller y se instalan rápido, acortando tiempos de obra.\n\nPuede elegir acabados, colores y texturas que reflejen su marca. Juntas, cubierta y fachada protegen su inversión y **proyectan la imagen** profesional que su negocio necesita para destacar.',

    'Entrepisos y Mezanines de Alta Capacidad': '¿Necesita más espacio en su local sin ampliar el edificio?\n\nUn entrepiso metálico le permite **crear un nivel adicional** aprovechando la altura que ya tiene. Funciona para bodegas comerciales, salas de cine con múltiples niveles, o locales que necesitan área de exhibición o almacenamiento arriba.\n\nSoporta cargas pesadas de mercancía o tránsito de público. Se puede **desarmar y reubicar** si cambia de local. Perfecto cuando necesita duplicar área útil sin comprar más terreno.'
  },

  'industrial': {
    'Naves Industriales de Gran Luz': '¿Necesita una bodega, centro de distribución o hangar?\n\nEstas operaciones requieren **grandes espacios sin columnas** donde montacargas, racks y equipos se muevan libremente. Toda la altura queda disponible para almacenamiento vertical con sistemas de estantería de múltiples niveles.\n\nSi su operación crece, puede **agregar módulos** sin afectar lo existente ni parar actividades. Fabricamos en taller y montamos rápido para que arranque operaciones lo antes posible.',

    'Edificios Industriales de Múltiples Niveles': '¿Su proceso de producción necesita varios pisos conectados?\n\nAlgunos procesos industriales como plantas farmacéuticas o ingenios requieren flujos verticales donde materiales bajan por gravedad o suben entre niveles. Los pisos soportan **maquinaria pesada** sin transmitir vibraciones a niveles vecinos.\n\nResisten ambientes con químicos o humedad constante. Puede **ampliar sin parar producción** porque construimos al lado mientras usted sigue operando normalmente.',

    'Estructuras Especializadas de Alta Resistencia': '¿Su planta tiene cuartos fríos, cámaras de refrigeración o ambientes corrosivos?\n\nEstas condiciones especiales destruyen estructuras convencionales. Necesita una solución diseñada para **resistir su ambiente particular**: temperatura extrema, químicos agresivos o vibración constante de maquinaria.\n\nPara cuartos fríos, minimizamos puentes térmicos que le cuestan energía. Para ambientes corrosivos, usamos recubrimientos especiales. **Cada estructura se diseña** según sus condiciones específicas.'
  },

  'puentes': {
    'Puentes de Vigas y Cerchas': '¿Necesita un puente vehicular, viaducto o ciclopuente?\n\nEstos proyectos de infraestructura requieren estructuras que soporten tráfico pesado y cumplan normativa sísmica. Trabajamos con vigas para luces moderadas y cerchas para distancias mayores, eligiendo el sistema según su proyecto.\n\nFabricamos en taller y montamos por dovelas o con **lanzamiento incremental** según las condiciones de su obra. Todo cumple **norma sísmica NSR-10**. Usted elige el método que mejor funcione.',

    'Puentes en Arco Metálico': '¿Su puente debe cruzar un río o vía con restricciones de altura?\n\nCuando no hay espacio vertical suficiente para vigas convencionales, el arco metálico resuelve el problema empujando las cargas hacia los lados. Puede salvar distancias importantes sin estructuras muy altas sobre la vía inferior.\n\nAdemás de funcional, el arco le da al puente un **aspecto emblemático** que se convierte en referencia del sector. Combina ingeniería eficiente con valor arquitectónico.',

    'Puentes Peatonales': '¿Necesita conectar barrios, cruzar avenidas o dar acceso a estaciones?\n\nLos puentes peatonales son estructuras livianas que se instalan **mucho más rápido** que opciones en concreto. Podemos montar de noche o fines de semana sin cerrar vías principales durante el día.\n\nIncluyen rampas para personas con movilidad reducida. Algunos proyectos incluyen puentes colgantes para zonas rurales donde no hay acceso para equipos pesados. **Instalación rápida** que minimiza impacto en la ciudad.'
  },

  'edificaciones': {
    'Pórticos Metálicos de Múltiples Niveles': '¿Construye un edificio de oficinas, sede corporativa o edificio institucional?\n\nEstos proyectos necesitan **plantas flexibles** donde pueda distribuir espacios según las necesidades de cada piso. Los pórticos metálicos eliminan muros de carga, dejando todo el interior libre para diseño.\n\nLas fachadas van colgadas del pórtico, permitiendo grandes ventanales. Puede **reorganizar interiores** después sin tocar estructura. Construcción más rápida que en concreto, cumpliendo NSR-10.',

    'Estructuras Metálicas para Estacionamiento': '¿Necesita más parqueaderos pero tiene terreno limitado?\n\nLa solución es **apilar vehículos en vertical**, multiplicando la capacidad de parqueo en el mismo espacio de terreno. Las rampas conectan niveles para circulación fluida de vehículos entre pisos.\n\nLas fachadas abiertas dan ventilación natural, eliminando extractores que cuestan operar. Se construye más rápido que en concreto, lo que significa que **genera ingresos antes** en su proyecto.',

    'Estructuras Livianas Modulares': '¿Necesita ampliar su edificio sin interrumpir operaciones?\n\nLas estructuras modulares son sistemas livianos que se fabrican en taller por secciones y se ensamblan rápido en sitio. Ideales para **ampliaciones de colegios, clínicas u oficinas** que no pueden cerrar.\n\nPor ser livianas, se pueden montar sobre edificios existentes sin reforzar cimentaciones. Instalamos de noche o fines de semana para que **siga operando normalmente** durante el día.'
  },

  'deportes-educacion': {
    'Coliseos y Canchas Cubiertas': '¿Construye un coliseo, pabellón deportivo o cancha cubierta?\n\nEstos espacios necesitan **cubiertas de gran luz** sin columnas que bloqueen la vista del público o interfieran con el área de juego. La estructura permite graderías con visual perfecta desde cualquier ubicación.\n\nSoporta iluminación profesional y equipos suspendidos. Diseño antisísmico para **seguridad en eventos masivos**. Ventilación natural que reduce costos de operación permanentemente.',

    'Piscinas Cubiertas': '¿Necesita cubrir una piscina olímpica o complejo acuático?\n\nEl ambiente sobre piscinas es agresivo: el cloro genera vapor salino y la condensación constante destruye estructuras normales en pocos años. Necesita materiales que **resistan este ambiente único**.\n\nUsamos galvanizado más pintura especial para resistir corrosión. Cubiertas translúcidas aportan luz natural reduciendo consumo eléctrico. Ventilación integrada extrae humedad protegiendo estructura y equipos.',

    'Torres y Estructuras Auxiliares': '¿Su campo deportivo necesita torres de iluminación o graderías?\n\nLas torres deben resistir vientos fuertes sin vibrar, garantizando **iluminación estable** para entrenamientos y eventos. Las graderías deben soportar cargas de público con total seguridad estructural.\n\nIncluyen plataformas de acceso seguro para mantenimiento. El galvanizado elimina repintado en altura. Si transmite eventos, los niveles de luz cumplen **normativa para televisión**.'
  },

  'infraestructura-urbana': {
    'Ciclopuentes y Pasarelas Peatonales': '¿Su proyecto urbano necesita separar ciclistas y peatones del tráfico?\n\nLos ciclopuentes y pasarelas son estructuras livianas que **cruzan avenidas de forma segura**, conectando barrios, parques o estaciones de transporte. Se instalan rápido sin cerrar vías por mucho tiempo.\n\nIncluyen rampas accesibles y pueden tener cubiertas para proteger de lluvia y sol. Ideales para **movilidad sostenible** en ciudades que priorizan ciclistas y peatones.',

    'Estaciones de Transporte Masivo': '¿Construye estaciones para Transmilenio, BRT o metro elevado?\n\nEstas estructuras deben ser **funcionales, seguras y resistir uso intensivo** de miles de usuarios diarios. La estructura metálica permite cubiertas amplias y plataformas elevadas con tiempos de construcción reducidos.\n\nSoportan torniquetes, sistemas de información y equipos de recaudo. Fabricamos en taller y montamos de noche para **no afectar la operación** del sistema de transporte.',

    'Terminales de Transporte Intermunicipal': '¿Necesita una terminal de transporte o central de buses?\n\nEstos edificios de gran escala concentran operaciones de transporte terrestre, requiriendo **espacios amplios para buses, taquillas y zonas de espera** de pasajeros. Deben manejar flujos masivos de personas.\n\nLa estructura metálica permite cubrir grandes áreas sin columnas que obstaculicen circulación. **Construcción más rápida** que en concreto para poner en operación antes su terminal.'
  }
}

async function actualizar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('FORMATO 3 PÁRRAFOS: Pregunta sola + 2 párrafos de contenido')
    console.log('='.repeat(80) + '\n')

    const categorias = [
      'comercial', 'industrial', 'puentes',
      'edificaciones', 'deportes-educacion', 'infraestructura-urbana'
    ]

    let total = 0

    for (const slug of categorias) {
      const categoria = await prisma.categoriaProyecto.findUnique({
        where: { slug }
      })

      if (!categoria) continue

      console.log(`📁 ${categoria.nombre}`)

      // Respaldo
      fs.writeFileSync(
        `./respaldo-3parrafos-${slug}-${Date.now()}.json`,
        JSON.stringify(categoria.especialidades, null, 2)
      )

      const actualizada = categoria.especialidades.map(esp => {
        const nuevaDesc = DESCRIPCIONES_3P[slug]?.[esp.titulo]
        if (nuevaDesc) {
          const parrafos = nuevaDesc.split('\n\n').length
          console.log(`   ✅ ${esp.titulo} (${parrafos} párrafos)`)
          total++
          return { ...esp, descripcion: nuevaDesc }
        }
        return esp
      })

      await prisma.categoriaProyecto.update({
        where: { slug },
        data: { especialidades: actualizada }
      })
    }

    console.log('\n' + '='.repeat(80))
    console.log(`✅ COMPLETADO: ${total} especialidades con formato 3 párrafos`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizar()
