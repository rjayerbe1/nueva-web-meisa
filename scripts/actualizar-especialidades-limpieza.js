const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// ==============================================================================
// LIMPIEZA DE ESPECIALIDADES - Solo las que tienen proyectos reales
// ==============================================================================

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ==============================================================================
// ESPECIALIDADES FINALES - 30 especialidades (eliminadas 6 sin proyectos)
// ==============================================================================

const ESPECIALIDADES_LIMPIAS = {
  // ============================================================================
  // 1. COMERCIAL - 5 especialidades (eliminada: Ampliaciones)
  // ============================================================================
  COMERCIAL: [
    {
      id: generateId(),
      titulo: 'Estructuras de Gran Luz',
      icono: 'Bridge',
      descripcion: 'Estructuras metálicas que crean espacios comerciales amplios sin columnas intermedias. MEISA diseña cerchas y vigas de hasta 30 metros de luz libre, permitiendo distribuciones flexibles en centros comerciales, supermercados e hipermercados. La fabricación en taller garantiza precisión milimétrica mientras el montaje modular reduce tiempos de construcción hasta 40% vs concreto. El acero estructural soporta cargas de techo, HVAC y señalización sin comprometer amplitud, creando ambientes que maximizan circulación de clientes y espacio de exhibición. Con áreas hasta 16,000 m² sin interrupciones, estas estructuras transforman cada metro cuadrado en espacio rentable.',
      proyectosEjemplo: ['Centros comerciales', 'Supermercados', 'Hipermercados'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas Standing Seam',
      icono: 'Home',
      descripcion: 'Techos metálicos de larga duración con sistema Standing Seam que elimina mantenimiento constante. MEISA fabrica cubiertas con juntas elevadas que permiten expansión térmica sin filtraciones, garantizando 30+ años de vida útil. Ideal para comercios que no pueden cerrar por goteras: instalación rápida, sin soldaduras expuestas y estética metálica contemporánea. El sistema de fijación oculto evita perforaciones en la lámina, mientras pendientes calculadas evacuan agua inmediatamente. Material 100% reciclable y reflectivo reduce carga térmica 40% versus tejas tradicionales, disminuyendo costos energéticos de climatización perpetuamente.',
      proyectosEjemplo: ['Tiendas comerciales', 'Locales retail', 'Naves comerciales'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Entrepisos y Estructuras Multi-nivel',
      icono: 'Layers3',
      descripcion: 'Estructuras metálicas que multiplican espacio vertical aprovechando altura libre existente. MEISA diseña entrepisos que duplican área utilizable sin ampliar huella del local, creando segundos niveles para oficinas, bodegas o showrooms adicionales. La fabricación modular permite instalación en días sin cerrar operaciones: fabricamos en taller, transportamos en secciones y ensamblamos mientras negocio funciona abajo. Estas estructuras soportan cargas operativas reales de 500 kg/m², ideales para archivos pesados, producto almacenado o público circulando. La modularidad permite reconfiguración futura cuando negocio evoluciona.',
      proyectosEjemplo: ['Entrepisos comerciales', 'Salas de cine', 'Locales multinivel'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Mezanines de Alta Capacidad',
      icono: 'Warehouse',
      descripcion: 'Plataformas metálicas intermedias que optimizan almacenamiento vertical en bodegas y locales comerciales. MEISA fabrica mezanines con capacidad de carga hasta 750 kg/m², soportando producto densamente almacenado o maquinaria pesada. El diseño estructural considera no solo peso sino vibración por tráfico de montacargas y personal. Instalación rápida sin afectar operaciones del piso inferior mientras se crea espacio adicional arriba. Estructura desmontable permite reubicación si operación cambia de local, protegiendo inversión a largo plazo. Escaleras y barandas integradas cumplen norma de seguridad industrial.',
      proyectosEjemplo: ['Bodegas comerciales', 'Locales retail', 'Puntos de venta'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas y Fachadas Metálicas',
      icono: 'Building2',
      descripcion: 'Envolventes metálicas completas que protegen y definen imagen de edificios comerciales. MEISA diseña sistemas integrados de cubierta y fachada que trabajan estructuralmente unidos, eliminando puentes térmicos y optimizando aislamiento. Las fachadas ventiladas metálicas reducen temperatura interior 40% mediante cámara de aire que expulsa calor por convección natural. Materiales como panel metálico compuesto o lámina conformada ofrecen durabilidad 30+ años sin mantenimiento de pintura. La prefabricación de módulos en taller acelera montaje en obra, reduciendo costos de mano de obra y tiempo.',
      proyectosEjemplo: ['Centros comerciales', 'Edificios comerciales', 'Tiendas'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80'
    }
  ],

  // ============================================================================
  // 2. INDUSTRIAL - 5 especialidades (eliminada: Puentes Grúa)
  // ============================================================================
  INDUSTRIAL: [
    {
      id: generateId(),
      titulo: 'Bodegas de Gran Escala',
      icono: 'Warehouse',
      descripcion: 'Naves industriales de acero que maximizan volumen almacenable con mínimas columnas internas. MEISA diseña estructuras modulares con luces hasta 25 metros entre pórticos, permitiendo distribución flexible de racks y zonas de maniobra. El sistema de cerchas metálicas soporta cubiertas livianas mientras alturas hasta 12 metros optimizan almacenamiento vertical. Fabricación en serie reduce costos por m² comparado con construcción tradicional. Estructura pre-ing engineered permite expansiones futuras agregando crujías sin modificar lo existente. Cimentaciones diseñadas para suelos blandos mediante zapatas aisladas o vigas de amarre.',
      proyectosEjemplo: ['Bodegas industriales', 'Centros de distribución', 'Almacenes'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Plantas Farmacéuticas',
      icono: 'FlaskConical',
      descripcion: 'Estructuras metálicas para industria farmacéutica que cumplen normativa sanitaria estricta. MEISA diseña edificios con entrepisos técnicos que alojan ductos de HVAC, tuberías de proceso y bandejas eléctricas sin comprometer altura libre de producción. Vigas perimetrales soportan sistemas de aire acondicionado industrial manteniendo temperatura 20°C ±2°C y humedad controlada. Modulación estructural permite expansión de áreas limpias sin contaminar producción existente. Acero con recubrimientos epóxicos resiste limpieza diaria con químicos agresivos. Entrepisos metálicos soportan maquinaria de producción sin transmitir vibraciones.',
      proyectosEjemplo: ['Plantas farmacéuticas', 'Edificios de producción', 'Áreas limpias'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Ingenios Azucareros',
      icono: 'Factory',
      descripcion: 'Estructuras metálicas pesadas para industria azucarera que soportan maquinaria de proceso continuo. MEISA diseña pórticos de acero que resisten vibraciones de molinos, centrífugas y evaporadores operando 24/7. Vigas reforzadas soportan silos elevados de azúcar con cargas puntuales hasta 50 ton mientras plataformas metálicas permiten mantenimiento de equipos en altura. Acero grado ASTM A572 resistente a ambientes corrosivos por vapores de melaza. Conexiones atornilladas facilitan desmontaje para reemplazo de maquinaria sin demoler estructura. Diseño antisísmico protege inversión en zonas de alta amenaza.',
      proyectosEjemplo: ['Ingenios azucareros', 'Plantas industriales', 'Complejos industriales'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1586864387634-daa74dca8f6e?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cuartos Fríos Industriales',
      icono: 'Snowflake',
      descripcion: 'Estructuras metálicas para refrigeración industrial que soportan panel aislante y equipos de frío. MEISA diseña naves con cerchas ligeras que minimizan puentes térmicos hacia el exterior, reduciendo consumo energético de refrigeración. Columnas y vigas con recubrimiento anticorrosivo resisten condensación constante y humedad alta. Estructura calculada para carga de nieve en cubierta (panel aislante pesado) más equipos de refrigeración suspendidos. Modulación permite expansión de cámaras frías sin interrumpir operación de áreas existentes. Puertas de carga dimensionadas para montacargas de gran tonelaje.',
      proyectosEjemplo: ['Cuartos fríos', 'Cámaras de refrigeración', 'Plantas de proceso'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Hangares Aeronáuticos',
      icono: 'Plane',
      descripcion: 'Estructuras de gran luz sin columnas internas para albergar aeronaves completas. MEISA diseña cerchas metálicas con luces hasta 50 metros que permiten maniobrar aviones sin obstrucciones. Altura libre hasta 15 metros acomoda empenaje vertical de aeronaves comerciales. Portones deslizantes de gran formato fabricados en acero con contrapesos calculados para operación manual o automatizada. Cubierta liviana minimiza carga en cerchas mientras aislamiento térmico protege aeronaves de temperatura exterior. Piso de concreto reforzado con malla electrosoldada soporta peso concentrado de trenes de aterrizaje.',
      proyectosEjemplo: ['Hangares aeronáuticos', 'Talleres de aviación', 'Mantenimiento aeronáutico'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80'
    }
  ]
}

async function actualizarEspecialidadesLimpias() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('LIMPIEZA DE ESPECIALIDADES - Solo proyectos reales')
    console.log('='.repeat(80) + '\n')

    // Crear respaldo
    console.log('📦 Creando respaldo...')
    const categoriasActuales = await prisma.categoriaProyecto.findMany({
      where: {
        slug: { in: Object.keys(ESPECIALIDADES_LIMPIAS).map(k => k.toLowerCase().replace('_', '-')) }
      }
    })

    const backupData = {}
    categoriasActuales.forEach(cat => {
      backupData[cat.slug] = {
        nombre: cat.nombre,
        especialidades: cat.especialidades
      }
    })

    const backupFilename = `./respaldo-especialidades-limpieza-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2))
    console.log(`   ✅ Respaldo: ${backupFilename}\n`)

    // Actualizar COMERCIAL
    console.log('📝 Actualizando: COMERCIAL')
    console.log('   Cambios: Eliminada "Ampliaciones sin Interrupciones"')
    console.log('   Nueva cantidad: 5 especialidades (antes 6)')

    await prisma.categoriaProyecto.update({
      where: { slug: 'comercial' },
      data: { especialidades: ESPECIALIDADES_LIMPIAS.COMERCIAL }
    })
    console.log('   ✅ Actualizada\n')

    // Actualizar INDUSTRIAL
    console.log('📝 Actualizando: INDUSTRIAL')
    console.log('   Cambios: Eliminada "Puentes Grúa Industriales"')
    console.log('   Nueva cantidad: 5 especialidades (antes 6)')

    await prisma.categoriaProyecto.update({
      where: { slug: 'industrial' },
      data: { especialidades: ESPECIALIDADES_LIMPIAS.INDUSTRIAL }
    })
    console.log('   ✅ Actualizada\n')

    console.log('='.repeat(80))
    console.log('✅ ACTUALIZACIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log('   Categorías actualizadas: 2')
    console.log('   Especialidades eliminadas: 2')
    console.log('   Total especialidades nuevas: 10')
    console.log('\n📋 CAMBIOS:')
    console.log('   • COMERCIAL: 6 → 5 especialidades')
    console.log('   • INDUSTRIAL: 6 → 5 especialidades')
    console.log('\n📄 Descripciones: Enfocadas en beneficios y capacidades técnicas')
    console.log(`📁 Respaldo: ${backupFilename}`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizarEspecialidadesLimpias()
