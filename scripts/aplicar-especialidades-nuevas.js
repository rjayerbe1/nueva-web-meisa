const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Nota: Este script actualiza TODAS las categorías con las especialidades limpias

const ESPECIALIDADES_FINALES = {
  // COMERCIAL - 5 especialidades (eliminada: Ampliaciones)
  comercial: [
    {
      id: generateId(),
      titulo: 'Estructuras de Gran Luz',
      icono: 'Bridge',
      descripcion: 'Estructuras metálicas que crean espacios comerciales amplios sin columnas intermedias. MEISA diseña cerchas y vigas de hasta 30 metros de luz libre, permitiendo distribuciones flexibles en centros comerciales, supermercados e hipermercados. La fabricación en taller garantiza precisión milimétrica mientras el montaje modular reduce tiempos de construcción hasta 40% comparado con concreto tradicional. El acero estructural soporta cargas de techo, sistemas HVAC y señalización sin comprometer la amplitud del espacio, creando ambientes que maximizan la circulación de clientes y el espacio de exhibición rentable.',
      proyectosEjemplo: ['Centros comerciales', 'Supermercados', 'Hipermercados'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas Standing Seam',
      icono: 'Home',
      descripcion: 'Techos metálicos de alta durabilidad con sistema Standing Seam que garantizan impermeabilidad superior sin mantenimiento constante. MEISA fabrica e instala cubiertas con juntas elevadas que permiten expansión y contracción térmica sin generar filtraciones, ofreciendo más de 30 años de vida útil. El sistema de fijación oculto evita perforaciones en la lámina, mientras las pendientes calculadas evacuan el agua pluvial inmediatamente. Ideales para comercios que no pueden cerrar por problemas de goteras: instalación rápida, sin soldaduras expuestas y acabado metálico contemporáneo. El material reflectivo reduce la carga térmica hasta 40% versus cubiertas tradicionales.',
      proyectosEjemplo: ['Tiendas comerciales', 'Locales retail', 'Naves comerciales'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Entrepisos y Estructuras Multi-nivel',
      icono: 'Layers3',
      descripcion: 'Estructuras metálicas que multiplican el espacio vertical aprovechando la altura libre existente en locales comerciales. MEISA diseña entrepisos que duplican el área utilizable sin ampliar la huella del inmueble, creando segundos niveles para oficinas, bodegas o áreas de exhibición adicionales. La fabricación modular en taller permite instalación en pocos días sin interrumpir las operaciones del negocio. Estas estructuras soportan cargas operativas de hasta 500 kg/m², adecuadas para almacenamiento denso, equipos pesados o circulación constante de público. El sistema modular permite reconfiguración o desmontaje futuro cuando el negocio evoluciona.',
      proyectosEjemplo: ['Entrepisos comerciales', 'Salas de cine', 'Locales multinivel'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Mezanines de Alta Capacidad',
      icono: 'Warehouse',
      descripcion: 'Plataformas metálicas intermedias que optimizan el almacenamiento vertical en bodegas y locales comerciales. MEISA fabrica mezanines con capacidad de carga hasta 750 kg/m², soportando productos densamente almacenados o maquinaria pesada. El diseño estructural considera no solo el peso estático sino también las vibraciones generadas por tráfico de montacargas y personal. La instalación rápida no afecta las operaciones del piso inferior mientras se habilita espacio adicional en el nivel superior. La estructura desmontable permite reubicación si la operación cambia de local, protegiendo la inversión a largo plazo. Escaleras y barandas integradas cumplen con normativa de seguridad industrial.',
      proyectosEjemplo: ['Bodegas comerciales', 'Locales retail', 'Puntos de venta'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas y Fachadas Metálicas',
      icono: 'Building2',
      descripcion: 'Envolventes metálicas completas que protegen y definen la imagen arquitectónica de edificios comerciales. MEISA diseña sistemas integrados de cubierta y fachada que trabajan estructuralmente unidos, eliminando puentes térmicos y optimizando el aislamiento. Las fachadas ventiladas metálicas reducen la temperatura interior hasta 40% mediante una cámara de aire que expulsa el calor por convección natural. Materiales como panel compuesto metálico o lámina conformada ofrecen durabilidad superior a 30 años sin mantenimiento de pintura. La prefabricación de módulos en taller acelera el montaje en obra, reduciendo costos de mano de obra y tiempos de ejecución significativamente.',
      proyectosEjemplo: ['Centros comerciales', 'Edificios comerciales', 'Tiendas'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80'
    }
  ],

  // INDUSTRIAL - 5 especialidades (eliminada: Puentes Grúa)
  industrial: [
    {
      id: generateId(),
      titulo: 'Bodegas de Gran Escala',
      icono: 'Warehouse',
      descripcion: 'Naves industriales de acero que maximizan el volumen almacenable con mínimas columnas internas. MEISA diseña estructuras modulares con luces hasta 25 metros entre pórticos, permitiendo distribución flexible de racks y zonas de maniobra para montacargas. El sistema de cerchas metálicas soporta cubiertas livianas mientras alturas hasta 12 metros optimizan el almacenamiento vertical por apilamiento. La fabricación en serie reduce costos por metro cuadrado comparado con construcción tradicional. La estructura pre-ingeniería permite expansiones futuras agregando crujías adicionales sin modificar lo existente. Cimentaciones diseñadas específicamente para suelos blandos mediante zapatas aisladas o vigas de amarre según estudio geotécnico.',
      proyectosEjemplo: ['Bodegas industriales', 'Centros de distribución', 'Almacenes'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Plantas Farmacéuticas',
      icono: 'FlaskConical',
      descripcion: 'Estructuras metálicas para la industria farmacéutica que cumplen con normativa sanitaria estricta nacional e internacional. MEISA diseña edificios con entrepisos técnicos que alojan ductos de HVAC, tuberías de proceso y bandejas eléctricas sin comprometer la altura libre de las áreas de producción. Las vigas perimetrales soportan sistemas de aire acondicionado industrial manteniendo temperatura controlada de 20°C ±2°C y humedad relativa estable. La modulación estructural permite expansión de áreas limpias sin contaminar la producción existente durante la construcción. Acero con recubrimientos epóxicos resiste la limpieza diaria con químicos agresivos. Los entrepisos metálicos soportan maquinaria de producción sin transmitir vibraciones entre niveles.',
      proyectosEjemplo: ['Plantas farmacéuticas', 'Edificios de producción', 'Áreas limpias'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Ingenios Azucareros',
      icono: 'Factory',
      descripcion: 'Estructuras metálicas pesadas para industria azucarera que soportan maquinaria de proceso continuo operando 24/7. MEISA diseña pórticos de acero que resisten vibraciones constantes de molinos, centrífugas y evaporadores sin fatiga del material. Vigas reforzadas soportan silos elevados de azúcar con cargas puntuales hasta 50 toneladas, mientras las plataformas metálicas permiten acceso seguro para mantenimiento de equipos en altura. Acero grado ASTM A572 resistente a ambientes altamente corrosivos por vapores de melaza y humedad constante. Las conexiones atornilladas facilitan el desmontaje para reemplazo de maquinaria sin necesidad de demoler la estructura. Diseño sismorresistente protege la inversión en zonas de alta amenaza sísmica.',
      proyectosEjemplo: ['Ingenios azucareros', 'Plantas industriales', 'Complejos industriales'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1586864387634-daa74dca8f6e?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cuartos Fríos Industriales',
      icono: 'Snowflake',
      descripcion: 'Estructuras metálicas para refrigeración industrial que soportan paneles aislantes y equipos de refrigeración pesados. MEISA diseña naves con cerchas ligeras que minimizan los puentes térmicos hacia el exterior, reduciendo significativamente el consumo energético de los sistemas de refrigeración. Columnas y vigas con recubrimiento anticorrosivo especial resisten la condensación constante y la humedad elevada del ambiente. La estructura está calculada para soportar la carga adicional del panel aislante (más pesado que cubiertas convencionales) más los equipos de refrigeración suspendidos del techo. La modulación permite expansión de cámaras frías sin interrumpir la operación de las áreas refrigeradas existentes. Puertas de carga dimensionadas para paso de montacargas de gran tonelaje.',
      proyectosEjemplo: ['Cuartos fríos', 'Cámaras de refrigeración', 'Plantas de proceso'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Hangares Aeronáuticos',
      icono: 'Plane',
      descripcion: 'Estructuras de gran luz sin columnas internas para albergar aeronaves completas con espacio de maniobra. MEISA diseña cerchas metálicas con luces hasta 50 metros que permiten mover aviones dentro del hangar sin obstrucciones. Altura libre hasta 15 metros acomoda el empenaje vertical de aeronaves comerciales y jets ejecutivos. Portones deslizantes de gran formato fabricados en acero con sistemas de contrapesos calculados para operación manual o motorizada. La cubierta liviana minimiza la carga estructural en las cerchas mientras el aislamiento térmico protege las aeronaves de las temperaturas exteriores extremas. El piso de concreto reforzado con malla electrosoldada soporta el peso concentrado de los trenes de aterrizaje sin fisurarse.',
      proyectosEjemplo: ['Hangares aeronáuticos', 'Talleres de aviación', 'Mantenimiento aeronáutico'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80'
    }
  ]
}

async function aplicarCambios() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('APLICANDO ESPECIALIDADES NUEVAS')
    console.log('='.repeat(80) + '\n')

    // Crear respaldo
    console.log('📦 Paso 1: Creando respaldo...')
    const categorias = await prisma.categoriaProyecto.findMany({
      where: {
        slug: { in: ['comercial', 'industrial'] }
      }
    })

    const backupData = {}
    categorias.forEach(cat => {
      backupData[cat.slug] = {
        nombre: cat.nombre,
        especialidades: cat.especialidades
      }
    })

    const backupFile = `./respaldo-especialidades-final-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2))
    console.log(`   ✅ Respaldo creado: ${backupFile}\n`)

    // Actualizar COMERCIAL
    console.log('📝 Paso 2: Actualizando COMERCIAL...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'comercial' },
      data: { especialidades: ESPECIALIDADES_FINALES.comercial }
    })
    console.log('   ✅ 5 especialidades (antes 6)')
    console.log('   ❌ Eliminada: "Ampliaciones sin Interrupciones"\n')

    // Actualizar INDUSTRIAL
    console.log('📝 Paso 3: Actualizando INDUSTRIAL...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'industrial' },
      data: { especialidades: ESPECIALIDADES_FINALES.industrial }
    })
    console.log('   ✅ 5 especialidades (antes 6)')
    console.log('   ❌ Eliminada: "Puentes Grúa Industriales"\n')

    console.log('='.repeat(80))
    console.log('✅ ACTUALIZACIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log('\n📊 RESUMEN:')
    console.log('   • Categorías actualizadas: 2')
    console.log('   • Especialidades eliminadas: 2')
    console.log('   • Total especialidades ahora: 10 (en estas 2 categorías)')
    console.log('\n📝 Cambios aplicados:')
    console.log('   ✅ COMERCIAL: 6 → 5 especialidades')
    console.log('   ✅ INDUSTRIAL: 6 → 5 especialidades')
    console.log('\n📄 Descripciones:')
    console.log('   ✅ Enfocadas en beneficios y capacidades técnicas')
    console.log('   ✅ SIN mencionar proyectos/clientes específicos')
    console.log(`\n📁 Respaldo: ${backupFile}`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('\n❌ Error al aplicar cambios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

aplicarCambios()
