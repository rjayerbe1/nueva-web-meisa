const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

// ==============================================================================
// SCRIPT DE ACTUALIZACIÓN DE ESPECIALIDADES - ENFOQUE ESTRUCTURAS METÁLICAS
// ==============================================================================

// Generar IDs únicos para las especialidades
const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ==============================================================================
// NUEVAS ESPECIALIDADES POR CATEGORÍA
// ==============================================================================

const ESPECIALIDADES_NUEVAS = {
  // ============================================================================
  // 1. COMERCIAL - 1 cambio
  // ============================================================================
  COMERCIAL: [
    {
      id: generateId(),
      titulo: 'Estructuras de Gran Luz',
      icono: 'Bridge',
      descripcion: 'Espacios comerciales amplios sin columnas intermedias: centros comerciales, supermercados e hipermercados requieren áreas despejadas para máxima flexibilidad. MEISA diseña estructuras metálicas con luces hasta 30 metros mediante cerchas optimizadas, permitiendo distribuciones comerciales libres sin obstrucciones visuales ni funcionales. Con 16,000 m² cubiertos en un solo proyecto, dominamos la ingeniería que elimina columnas internas maximizando espacio rentable: cada metro sin columna significa más estantería, mejor circulación y mayores ventas por m². Nuestras estructuras soportan cargas de techo, HVAC y señalización sin comprometer la amplitud, entregando espacios que arquitectos comerciales necesitan para crear experiencias de compra fluidas que convierten visitantes en compradores.',
      metricas: ['30 metros luz', '16,000 m²'],
      proyectosEjemplo: ['Dollar City Mazurén', 'Centros Comerciales'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas Standing Seam',
      icono: 'Home',
      descripcion: 'Techos metálicos de larga duración: Standing Seam ofrece impermeabilidad superior sin mantenimiento constante. MEISA fabrica e instala cubiertas con juntas elevadas que expanden/contraen térmicamente sin generar filtraciones, garantizando 30+ años sin reemplazo. Sistema ideal para comercios que no pueden cerrar por goteras: instalación rápida, sin soldaduras expuestas y estética contemporánea metálica. Con pendientes calculadas para evacuación pluvial inmediata, estas cubiertas protegen mercancía valiosa eliminando riesgos de humedad que generan pérdidas millonarias. Material 100% reciclable y reflectivo reduce carga térmica 40% versus tejas tradicionales, bajando costos energéticos de climatización perpetuamente.',
      metricas: ['30+ años durabilidad', '40% reducción térmica'],
      proyectosEjemplo: ['Tiendas Dollar City'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Entrepisos y Estructuras Multi-nivel',
      icono: 'Layers3',
      descripcion: 'Multiplicar espacio vertical en locales comerciales existentes: mezanines y entrepisos metálicos duplican área utilizable sin ampliar huella. MEISA diseña estructuras de acero que aprovechan altura libre desperdiciada, creando segundos niveles para oficinas, bodegas o showrooms adicionales sin requerir permisos de construcción mayor. Instalación en días sin cerrar operaciones: fabricamos entrepisos completos en taller, transportamos en secciones y ensamblamos rápidamente in-situ mientras negocio funciona abajo. Soportan cargas operativas reales: oficinas con archivos pesados, bodegas con producto densamente almacenado, showrooms con público circulando. Estructuras modulares permiten desmontaje/reconfiguración futura cuando negocio evoluciona, protegiendo inversión a largo plazo.',
      metricas: ['5,000 m²/nivel', '500 kg/m²'],
      proyectosEjemplo: ['Locales Comerciales'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Mezanines de Alta Capacidad',
      icono: 'Layers',
      descripcion: 'Entrepisos industriales robustos para cargas pesadas: mezanines metálicos que soportan maquinaria, inventario denso y tráfico intenso. MEISA fabrica plataformas de acero estructural calculadas para cargas vivas superiores a estándares comerciales: 500-800 kg/m² permiten almacenamiento vertical de mercancía pesada sin deflexiones. Ideal para bodegas que maximizan capacidad: cada metro cúbico vertical aprovechado reduce necesidad de expansión horizontal costosa. Con escaleras industriales, barandas normativas y acabados antideslizantes, estos mezanines cumplen códigos de seguridad mientras optimizan logística. Instalación modular sin soldadura in-situ acelera montaje y facilita desmontaje si operación cambia de sede, convirtiendo estructura en activo reutilizable no en costo hundido permanente.',
      metricas: ['500 kg/m² capacidad', 'Hasta 5,000 m²'],
      proyectosEjemplo: ['Bodegas Comerciales'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Ampliaciones sin Interrupciones',
      icono: 'Plus',
      descripcion: 'Expansión de locales comerciales operativos: estructuras metálicas permiten ampliar sin cerrar negocio. MEISA domina técnica de conectar estructura nueva a existente mientras comercio funciona normalmente: fabricación completa en taller, transporte nocturno y montaje acelerado en horarios no comerciales. Coordinación milimétrica entre estructura vieja y nueva evita juntas visibles o desniveles: clientes no perciben adición porque integración es arquitectónicamente invisible. Con 30,000 m² ampliados sin detener ventas, entendemos que cada día cerrado significa ingresos perdidos irrecuperables. Método modular metálico completa en semanas versus meses de construcción tradicional, permitiendo capitalizar crecimiento rápidamente sin sacrificar operación actual que genera flujo de caja necesario para financiar misma expansión.',
      metricas: ['0 días interrupción', '30,000 m² ampliados'],
      proyectosEjemplo: ['Ampliaciones Comerciales'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas y Fachadas Metálicas', // CAMBIO: antes era solo "Fachadas Ventiladas"
      icono: 'Building',
      descripcion: 'Envolventes metálicas de alto rendimiento: fachadas ventiladas y cubiertas que protegen, aíslan y embellecen edificaciones comerciales. MEISA integra paneles metálicos con cámaras de aire que reducen transferencia térmica 40%, cortando costos de climatización perpetuamente. Sistema de fachada ventilada permite que aire circule entre panel exterior y muro, evacuando calor verano y reteniendo invierno sin consumo energético. Cubiertas metálicas complementarias con aislamiento térmico superior crean envolvente integral que transforma edificio comercial en estructura energéticamente eficiente. Con 5,000 m² instalados y garantía 30+ años, estas envolventes requieren mantenimiento mínimo: sin pintura periódica, sin reemplazo de elementos, solo limpieza ocasional. Material metálico reciclable 100% al final de vida útil cumple estándares sostenibilidad que inquilinos corporativos exigen cada vez más.',
      metricas: ['40% reducción térmica', '5,000 m²', '30+ años'],
      proyectosEjemplo: ['Edificios Comerciales'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
    }
  ],

  // ============================================================================
  // 2. INDUSTRIAL - Sin cambios (perfecta)
  // ============================================================================
  INDUSTRIAL: [
    {
      id: generateId(),
      titulo: 'Bodegas de Gran Escala',
      icono: 'Warehouse',
      descripcion: 'Almacenamiento masivo bajo techo: bodegas industriales hasta 12,000 m² en una sola nave sin columnas internas. MEISA diseña estructuras metálicas optimizadas para maximizar volumen almacenable: alturas 12-15 metros permiten racks verticales multinivel que multiplican capacidad por área de suelo. Con luces entre columnas de 20-30 metros, montacargas y transpaletas circulan libremente sin obstrucciones, acelerando operaciones logísticas críticas. Estructuras calculadas para cargas de techo superiores: puentes grúa, HVAC industrial, iluminación LED y eventualmente paneles solares futuros sin requerir refuerzos posteriores costosos. Diseño modular permite expansiones longitudinales agregando crujías adicionales, convirtiendo bodega en activo escalable que crece con negocio sin reconstruir.',
      metricas: ['12,000 m²', '15m altura', '20-30m luz'],
      proyectosEjemplo: ['Bodegas Industriales'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Plantas Farmacéuticas',
      icono: 'Pill',
      descripcion: 'Estructuras para ambientes controlados: plantas farmacéuticas requieren espacios libres de vibraciones, contaminación y con precisión dimensional milimétrica. MEISA fabrica estructuras metálicas con tolerancias estrictas que soportan entrepisos técnicos para equipos sensibles, cielorrasos herméticos y sistemas HVAC ultra-filtrados sin introducir partículas metálicas. Acero estructural pintado con recubrimientos inertes evita desprendimiento que contaminaría procesos certificados GMP. Con experiencia en ingenios que procesan alimentos/medicinas, entendemos criticidad de limpiabilidad: juntas selladas, superficies lisas y accesibilidad para sanitización periódica. Estructuras libre de vibraciones mediante fundaciones aisladas y arriostramientos calculados protegen equipos de precisión costosos que rechazo por vibración significaría pérdidas millonarias en producto no conforme.',
      metricas: ['Ambientes controlados', 'Libre vibraciones', 'GMP'],
      proyectosEjemplo: ['Plantas Farmacéuticas'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Ingenios Azucareros',
      icono: 'Factory',
      descripcion: 'Estructuras pesadas para procesamiento agroindustrial: ingenios azucareros operan maquinaria masiva 24/7 en ambientes corrosivos. MEISA diseña estructuras de acero de alta resistencia que soportan equipos de molienda, calderas, centrifugadoras y silos sin fatiga estructural. Con cargas dinámicas por maquinaria rotativa y vibraciones constantes, calculamos arriostramientos y fundaciones que mantienen estabilidad perpetua. Ambiente húmedo con vapor de caña y azúcar cristalizada requiere aceros con recubrimientos anticorrosivos industriales: galvanizado en caliente, pintura epóxica de alto espesor o aceros inoxidables en zonas críticas. Entendemos que parada no planificada en zafra significa pérdida irreversible de caña madura: diseñamos redundancia estructural y accesibilidad para mantenimiento predictivo que previene fallas catastróficas.',
      metricas: ['Cargas pesadas', 'Ambientes corrosivos', '24/7'],
      proyectosEjemplo: ['Ingenios Azucareros'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cuartos Fríos Industriales',
      icono: 'Snowflake',
      descripcion: 'Estructuras para refrigeración industrial: cuartos fríos requieren marcos metálicos que resistan gradientes térmicos extremos sin deformación. MEISA fabrica estructuras que soportan paneles aislados pesados, equipos de refrigeración en techo y puertas industriales masivas sin deflectar. Con temperaturas internas -25°C y externas +35°C, acero sufre contracción/expansión térmica que diseño debe absorber mediante juntas calculadas. Estructuras deben ser impermeables a vapor: cualquier infiltración condensa dentro aislamiento anulando capacidad térmica y pudriendo paneles costosos. Calculamos cargas de hielo acumulado en techo por fugas térmicas, previniendo colapsos invernales comunes en instalaciones mal diseñadas. Con experiencia en plantas procesadoras de alimentos, entendemos criticidad de mantener cadena de frío: falla estructural que detiene refrigeración significa pérdida de inventario completo.',
      metricas: ['-25°C temperatura', 'Paneles aislados', 'Hermeticidad'],
      proyectosEjemplo: ['Plantas de Alimentos'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Hangares Aeronáuticos',
      icono: 'Plane',
      descripcion: 'Coberturas de gran luz para aviación: hangares requieren estructuras sin columnas internas que obstruyan maniobras de aeronaves. MEISA diseña cerchas metálicas con luces hasta 50 metros que cubren completamente aviones comerciales, helicópteros o jets privados sin soportes intermedios. Con alturas 15-20 metros para acomodar empenajes verticales, calculamos estructuras que resisten cargas de viento y succión aerodinámica sin pandeo. Hangares deben soportar cargas de mantenimiento: puentes grúa para motores, plataformas elevadas para acceso a fuselaje y sistemas de extracción de gases pesados. Puertas motorizadas de 40+ metros de ancho requieren dinteles metálicos ultra-resistentes sin deflexión que genere trabas operacionales. Con experiencia en infraestructura aeroportuaria, entendemos criticidad de tiempos: cada hora que avión no vuela significa ingresos perdidos, por eso diseñamos hangares que facilitan mantenimiento rápido.',
      metricas: ['50m luz', '500+ ton capacidad', '15-20m altura'],
      proyectosEjemplo: ['Hangares Aeronáuticos'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes Grúa Industriales',
      icono: 'Crane',
      descripcion: 'Vigas metálicas para manejo de cargas pesadas: puentes grúa mueven materiales masivos dentro plantas industriales. MEISA diseña vigas carrileras de acero estructural que soportan grúas hasta 50 toneladas con recorridos 30+ metros sin fatiga. Calculamos deflexiones máximas permitidas: exceso genera descarrilamiento, insuficiencia significa sobrecosto estructural. Conexiones entre viga carrilera y columnas deben absorber cargas dinámicas laterales cuando grúa frena/arranca bruscamente: diseñamos cartelas reforzadas y pernos de alta resistencia. Vigas deben ser accesibles para mantenimiento de riel: inspección de desgaste, lubricación y eventual reemplazo sin desmontar estructura completa. Con experiencia en plantas siderúrgicas y astilleros que operan grúas continuamente, entendemos que falla de puente grúa paraliza planta completa costando millones diarios en producción detenida.',
      metricas: ['50 ton capacidad', '30m recorrido', 'Alta resistencia'],
      proyectosEjemplo: ['Plantas Industriales'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    }
  ],

  // ============================================================================
  // 3. PUENTES - 1 cambio
  // ============================================================================
  PUENTES: [
    {
      id: generateId(),
      titulo: 'Puentes de Gran Luz (Vehiculares y Peatonales)',
      icono: 'Bridge',
      descripcion: 'Puentes metálicos que cruzan ríos, valles y vías sin pilares intermedios: MEISA diseña estructuras con luces hasta 212 metros mediante cerchas reticuladas, cajones metálicos o vigas compuestas acero-concreto. Eliminando soportes en cauce, protegemos hidrodinámica natural que pilares obstruirían generando socavación y eventual colapso. Con 350+ toneladas en un solo puente, dominamos logística de transporte, montaje y soldadura en altura que convierte diseño en realidad física. Cada puente considera sismicidad regional (NSR-10), cargas vivas vehiculares (CCP-14) y vientos extremos para garantizar 50+ años sin mantenimiento mayor. Diseño incluye drenaje, juntas de expansión, barandas vehiculares y peatonales certificadas que protegen vidas sin añadir peso muerto innecesario que encarecería estructura.',
      metricas: ['212 metros luz máxima', '350+ toneladas', '50+ años vida'],
      proyectosEjemplo: ['Puentes Regionales'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes en Arco Metálicos',
      icono: 'BridgeIcon',
      descripcion: 'Estética estructural mediante arcos metálicos: puentes donde forma arquitectónica y función estructural son inseparables. MEISA diseña arcos que trabajan primariamente en compresión, optimizando acero: cada tonelada instalada soporta más carga versus vigas rectas equivalentes. Geometría parabólica del arco distribuye cargas naturalmente hacia apoyos, minimizando momentos flectores que generarían secciones masivas costosas. Con luces 50-100 metros, arcos metálicos compiten económicamente contra puentes viga tradicionales mientras entregan iconicidad arquitectónica que puente viga nunca logra. Ideal para cruces urbanos donde puente es hito visual: forma escultural del arco metálico embellece paisaje urbano generando valor intangible para comunidad. Fabricación modular en segmentos permite transporte por carreteras estándar y montaje progresivo desde ambos estribos hasta cierre central ceremonial.',
      metricas: ['50-100m luz', 'Compresión optimizada', 'Iconicidad'],
      proyectosEjemplo: ['Puentes Urbanos'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes Peatonales y de Acceso', // CAMBIO: antes "Ciclopuentes y Movilidad Sostenible"
      icono: 'Users',
      descripcion: 'Conexión segura para peatones en zonas rurales y urbanas: puentes metálicos ligeros que comunican poblaciones aisladas. MEISA diseña estructuras peatonales con luces 30-80 metros que cruzan quebradas, ríos o barrancos sin requerir maquinaria pesada inaccesible en zonas remotas. Con apenas 20-50 toneladas de acero, helicópteros pueden transportar secciones prefabricadas a comunidades sin vías, permitiendo ensamblaje manual por cuadrillas locales capacitadas. Cada puente peatonal restituye acceso permanente que invierno destruía anualmente: niños llegan a escuela seguramente, enfermos alcanzan centros de salud, productores sacan cosechas a mercados. Diseño antisísmico garantiza que terremoto no reaísle comunidad cuando más necesitan evacuación. Con barandas altas y superficies antideslizantes, estos puentes protegen población vulnerable que antes arriesgaba vidas cruzando ríos crecidos en temporada invernal.',
      metricas: ['30-80m luz', 'Acceso seguro', 'Transporte helicóptero'],
      proyectosEjemplo: ['Puentes Rurales', 'Acceso Comunitario'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes Colgantes (Vehiculares y Peatonales)',
      icono: 'Link',
      descripcion: 'Puentes suspendidos por cables de acero: solución óptima para valles profundos donde pilares intermedios serían prohibitivamente costosos. MEISA diseña sistemas de suspensión con torres metálicas altas, cables principales de alta resistencia y péndolas verticales que distribuyen carga del tablero uniformemente. Con capacidad para luces superiores a 150 metros, puentes colgantes cruzan geografías imposibles para viaductos tradicionales: valles profundos, cañones fluviales o brazos marinos anchos. Tablero metálico ligero reduce carga en cables, optimizando economía: cada kilogramo ahorrado en deck significa toneladas menos en cables y torres. Sistema permite oscilación controlada ante sismos y vientos sin colapsar: flexibilidad estructural absorbe energías que romperían estructura rígida. Con mantenimiento de cables cada 10 años, estos puentes alcanzan 50+ años operando confiablemente en geografías donde otras tipologías estructurales no son viables técnica ni económicamente.',
      metricas: ['150+ metros luz', 'Cables alta resistencia', 'Geografías extremas'],
      proyectosEjemplo: ['Puentes Colgantes'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Diseño Sísmico de Puentes',
      icono: 'Waves',
      descripcion: 'Ingeniería especializada para resistir terremotos: Colombia en zona sísmica alta exige puentes diseñados para sobrevivir movimientos telúricos sin colapso. MEISA aplica NSR-10 calculando espectros de respuesta específicos por región, diseñando sistemas de disipación energética que protegen estructura principal. Conexiones articuladas entre superestructura y subestructura permiten movimientos diferenciales sin transmitir fuerzas destructivas: tablero flota sobre apoyos elastoméricos que absorben desplazamientos horizontales. Juntas de expansión dimensionadas para acomodar deformaciones sísmicas previenen colapso por martilleo entre tramos. Con análisis no-lineal pushover y time-history, verificamos que puente no solo sobrevive sismo de diseño sino que permanece operativo inmediatamente después para evacuación post-desastre: puente caído reaísla comunidad exactamente cuando más necesitan acceso externo para rescate y ayuda humanitaria.',
      metricas: ['NSR-10', 'Disipación sísmica', 'Post-desastre'],
      proyectosEjemplo: ['Puentes Sísmicos'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes Sociales para Comunidades Rurales',
      icono: 'Heart',
      descripcion: 'Infraestructura de integración social: puentes metálicos que transforman calidad de vida rural. MEISA diseña estructuras económicas pero dignas que reconectan poblaciones fragmentadas por geografía: campesinos acceden a mercados, estudiantes llegan a colegios, pacientes alcanzan hospitales. Con inversión pública limitada, optimizamos diseño para maximizar impacto social por peso de acero: puentes peatonales de 40-60 metros en 25-35 toneladas conectan cientos de familias. Fabricación modular permite réplica: mismo diseño se adapta a múltiples sitios con ajustes menores, reduciendo costos de ingeniería. Montaje rápido (semanas no meses) minimiza periodo que comunidad espera obra: cada semana adicional significa estudiantes ausentes y enfermos sin atención. Con barandas coloridas y placas conmemorativas, estos puentes no son solo infraestructura funcional: son símbolos tangibles de que Estado no olvidó rural, generando capital social que cohesiona comunidades.',
      metricas: ['40-60m luz', '25-35 ton', 'Impacto social'],
      proyectosEjemplo: ['Puentes Comunitarios'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    }
  ]
}

// ==============================================================================
// FUNCIÓN PRINCIPAL
// ==============================================================================

async function actualizarEspecialidades() {
  console.log('=' .repeat(80))
  console.log('ACTUALIZACIÓN DE ESPECIALIDADES - ENFOQUE ESTRUCTURAS METÁLICAS')
  console.log('='.repeat(80))
  console.log()

  try {
    // ============================================================================
    // 1. RESPALDO COMPLETO
    // ============================================================================
    console.log('📦 Paso 1: Creando respaldo...')
    const categorias = await prisma.categoriaProyecto.findMany()
    const respaldoPath = `./respaldo-especialidades-${Date.now()}.json`
    fs.writeFileSync(respaldoPath, JSON.stringify(categorias, null, 2))
    console.log(`   ✅ Respaldo creado: ${respaldoPath}`)
    console.log()

    // ============================================================================
    // 2. ACTUALIZAR CATEGORÍAS UNA POR UNA
    // ============================================================================
    let totalActualizadas = 0

    for (const [categoriaKey, especialidades] of Object.entries(ESPECIALIDADES_NUEVAS)) {
      console.log(`\n📝 Actualizando: ${categoriaKey}`)
      console.log(`   Especialidades: ${especialidades.length}`)

      especialidades.forEach((esp, idx) => {
        console.log(`      ${idx + 1}. ${esp.titulo}`)
      })

      // Actualizar en BD
      const resultado = await prisma.categoriaProyecto.updateMany({
        where: { key: categoriaKey },
        data: { especialidades: especialidades }
      })

      if (resultado.count > 0) {
        console.log(`   ✅ Actualizada exitosamente`)
        totalActualizadas++
      } else {
        console.log(`   ⚠️  Categoría ${categoriaKey} no encontrada`)
      }
    }

    // ============================================================================
    // 3. RESUMEN FINAL
    // ============================================================================
    console.log()
    console.log('='.repeat(80))
    console.log('✅ ACTUALIZACIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log(`   Categorías actualizadas: ${totalActualizadas}`)
    console.log(`   Total especialidades: ${Object.values(ESPECIALIDADES_NUEVAS).flat().length}`)
    console.log()
    console.log('📋 CAMBIOS REALIZADOS:')
    console.log('   • COMERCIAL: "Fachadas Ventiladas" → "Cubiertas y Fachadas Metálicas"')
    console.log('   • PUENTES: "Ciclopuentes" → "Puentes Peatonales y de Acceso"')
    console.log('   • Todas las especialidades: 100% enfocadas en estructuras metálicas')
    console.log()
    console.log(`📁 Respaldo guardado en: ${respaldoPath}`)
    console.log('='.repeat(80))
    console.log()

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
actualizarEspecialidades()
  .then(() => {
    console.log('✅ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
