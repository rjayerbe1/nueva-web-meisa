const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Generar IDs únicos
const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ==============================================================================
// ESPECIALIDADES RESTANTES: INFRAESTRUCTURA, EDIFICACIONES, DEPORTES
// ==============================================================================

const ESPECIALIDADES_RESTANTES = {
  // ============================================================================
  // 4. INFRAESTRUCTURA_URBANA - Enfoque en MOVILIDAD URBANA
  // ============================================================================
  INFRAESTRUCTURA_URBANA: [
    {
      id: generateId(),
      titulo: 'Ciclopuentes y Pasarelas Peatonales',
      icono: 'Bike',
      descripcion: 'Movilidad sostenible urbana: ciclopuentes y pasarelas metálicas que separan tráfico vulnerable de vehicular. MEISA diseña estructuras ligeras con luces 30-60 metros que cruzan avenidas sin semáforos, acelerando flujo vehicular mientras protegen ciclistas y peatones. Con rampas accesibles en lugar de escaleras, estos puentes permiten movilidad inclusiva: bicicletas, coches de bebé, sillas de ruedas y personas mayores cruzan vías rápidas seguramente. Estructura metálica prefabricada permite instalación nocturna sin interrumpir tráfico diurno: fabricamos completo en taller, transportamos en secciones y montamos en horas. Con 50 metros de luz típica, estos puentes conectan ciclorrutas fragmentadas por autopistas, convirtiendo red ciclista teórica en sistema funcional que realmente la gente usa diariamente para desplazarse al trabajo, escuela o comercios.',
      metricas: ['50m luz', 'Movilidad sostenible', 'Rampas accesibles'],
      proyectosEjemplo: ['Ciclopuentes Urbanos'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Estaciones de Transporte Masivo',
      icono: 'Train',
      descripcion: 'Infraestructura para sistemas BRT: estaciones TransMilenio, MIO y sistemas similares requieren estructuras metálicas que soporten tráfico peatonal intenso 18+ horas diarias. MEISA diseña cubiertas metálicas que protegen usuarios de lluvia/sol mientras buses articulados circulan debajo: estructura debe resistir vibraciones continuas sin fatiga. Con 424 toneladas de acero en estaciones grandes, calculamos cargas peatonales máximas (eventos deportivos, horas pico) más equipamiento: máquinas validadoras, señalización digital, iluminación LED y eventualmente paneles solares. Diseño modular permite replicación: misma estación se adapta a múltiples sitios con ajustes menores, reduciendo costos de ingeniería por estación. Con montaje en días (no meses), minimizamos afectación vial que construir estaciones de concreto causaría, permitiendo inaugurar tramos completos de BRT rápidamente.',
      metricas: ['424 ton', '18+ horas operación', 'Montaje rápido'],
      proyectosEjemplo: ['Estaciones TransMilenio', 'Estaciones MIO'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Terminales de Transporte Intermunicipal',
      icono: 'Bus',
      descripcion: 'Infraestructura para transporte terrestre: terminales de buses requieren cubiertas amplias sin columnas que obstruyan circulación de vehículos grandes. MEISA diseña estructuras metálicas de luces 20-40 metros que cubren plataformas de embarque, protegiendo pasajeros sin impedir maniobras de buses articulados. Con alturas 6-8 metros para ventilación natural, estas cubiertas eliminan calor y gases de escape sin requerir ventilación mecánica costosa. Estructura debe ser liviana para no sobrecargar suelos urbanos usualmente blandos, pero resistente a vientos que aceleran entre pasillos largos. Con experiencia en terminales regionales, entendemos criticidad de tiempos: terminal cerrada por construcción paraliza movilidad regional, por eso diseñamos para montaje por fases que mantienen servicio ininterrumpido durante obra.',
      metricas: ['20-40m luz', '200+ ton', 'Montaje por fases'],
      proyectosEjemplo: ['Terminales Regionales'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Puentes Urbanos de Conexión Vial',
      icono: 'BridgeIcon',
      descripcion: 'Descongestión mediante pasos elevados metálicos: puentes vehiculares que eliminar semáforos críticos en vías principales. MEISA diseña estructuras metálicas con luces 40-100 metros que cruzan intersecciones sin pilares que obstruyan tráfico inferior. Con tableros prefabricados completos, instalamos puente completo en fin de semana sin cerrar vías durante semana laboral: fabricamos tablero en taller, transportamos secciones grandes y montamos con grúas móviles en operativo nocturno coordinado con autoridades. Cada puente elimina semáforo que detenía tráfico constante: analizado en 20 años de operación, puente se paga solo por combustible/tiempo ahorrado. Con diseño sismorresistente y apoyos elastoméricos, estructura sobrevive terremotos sin colapso, manteniendo conectividad vial post-desastre cuando ciudad más necesita vías funcionales para evacuación y ayuda.',
      metricas: ['40-100m luz', 'Instalación fin de semana', 'ROI 20 años'],
      proyectosEjemplo: ['Pasos Elevados Urbanos'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Estructuras de Sombra y Pérgolas Urbanas',
      icono: 'Sun',
      descripcion: 'Confort térmico en espacios públicos: pérgolas y cubiertas metálicas que hacen plazas usables bajo sol tropical. MEISA diseña estructuras ligeras con láminas perforadas o mallas metálicas que proyectan sombra sin impedir ventilación: 40% reducción térmica percibida transforma plazas desiertas a mediodía en espacios concurridos todo el día. Con diseño arquitectónico colaborativo, estas estructuras no son meramente funcionales: geometrías contemporáneas embellecen espacio público generando hitos visuales que ciudadanos fotografían y comparten, promoviendo orgullo cívico. Estructura metálica resiste vandalismo y grafiti sin degradarse: limpieza periódica restaura apariencia original que materiales porosos como concreto nunca recuperan. Con instalación en días y fundaciones mínimas, estas pérgolas activan plazas existentes subutilizadas rápidamente sin rehacer urbanización completa, permitiendo inversión pública generar impacto social inmediato mensurable en uso ciudadano.',
      metricas: ['500 m²', '40% reducción térmica', 'Activación espacios'],
      proyectosEjemplo: ['Plazas Públicas'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Miradores y Torres de Observación',
      icono: 'Eye',
      descripcion: 'Turismo urbano mediante estructuras metálicas elevadas: miradores que ofrecen vistas panorámicas 360° convirtiendo topografía en atractivo. MEISA diseña torres metálicas 10-20 metros con escaleras helicoidales o ascensores que llevan visitantes a plataformas con vistas únicas. Estructura metálica ligera minimiza fundaciones en cerros que suelos inestables harían prohibitivo construir en concreto. Con barandas transparentes en vidrio templado o malla metálica, maximizamos visuales sin sacrificar seguridad. Estas estructuras generan economía turística: visitantes gastan en cercanías, comercios locales prosperan y municipio recauda impuestos que retornan inversión inicial. Diseño iconográfico con iluminación nocturna LED convierte mirador en hito visible desde ciudad, generando identidad visual que atrae visitantes nacionales e internacionales. Con mantenimiento mínimo por resistencia corrosión del acero tratado, estos miradores operan décadas con costos operativos negligibles.',
      metricas: ['10-20m altura', 'Vista 360°', 'Impacto turístico'],
      proyectosEjemplo: ['Miradores Turísticos'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    }
  ],

  // ============================================================================
  // 5. EDIFICACIONES - Enfoque en TIPOLOGÍAS
  // ============================================================================
  EDIFICACIONES: [
    {
      id: generateId(),
      titulo: 'Edificios Institucionales y de Oficinas', // CAMBIO: reemplaza "Diseño Sismorresistente"
      icono: 'Building2',
      descripcion: 'Estructuras metálicas para edificios administrativos: alcaldías, juzgados, oficinas corporativas y entidades públicas requieren espacios amplios y flexibles. MEISA diseña marcos metálicos de 5-15 pisos con luces entre columnas que permiten plantas libres: muros divisorios no son estructurales, facilitando reconfiguración cuando entidad reorganiza departamentos. Con 300+ toneladas de acero estructural, estos edificios se construyen 30-40% más rápido que concreto: montaje de estructura metálica en semanas permite que acabados arquitectónicos inicien temprano, comprimiendo cronograma total. Diseño sismorresistente NSR-10 con arriostramientos excéntricos o marcos especiales garantiza que edificio sobrevive terremoto sin colapso: ocupantes evacuán seguramente y entidad retoma operaciones rápidamente post-desastre. Con entrepisos mixtos acero-concreto, optimizamos costo sin sacrificar rigidez: vigas metálicas soportan losa colaborante que actúa como diafragma rígido distribuyendo cargas sísmicas uniformemente.',
      metricas: ['5-15 pisos', '300+ ton', 'Plantas libres'],
      proyectosEjemplo: ['Edificios Institucionales', 'Oficinas Corporativas'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Parqueaderos Multinivel',
      icono: 'ParkingCircle',
      descripcion: 'Optimización vertical de estacionamientos: parqueaderos de múltiples pisos metálicos que multiplican capacidad sin ampliar huella. MEISA diseña estructuras con rampas helicoidales o rectas que conectan niveles eficientemente: cada piso adicional significa 100-150 vehículos más estacionados en mismo terreno. Con luces 16-18 metros entre columnas, acomodamos dos bahías de estacionamiento más circulación vehicular central sin pilares que obstaculicen maniobras: conductores entran/salen rápidamente sin fricciones que generan congestión. Estructura metálica semiabierta en perímetro permite ventilación natural eliminando ventilación mecánica costosa: ahorro operativo 40% versus parqueaderos cerrados con extractores industriales. Con acabados expuestos del acero estructural pintado, eliminamos cielorrasos reduciendo altura entre pisos: cada 30cm ahorrados significa piso adicional en misma altura total permitida, maximizando capacidad bajo restricciones urbanas. Diseño considera futuro: estructura soporta conversión a usos mixtos si algún día demanda de estacionamiento disminuye por cambios en movilidad urbana.',
      metricas: ['9,600 m²', '40% ahorro energético', '8m entre pisos'],
      proyectosEjemplo: ['Parqueaderos Bogotá'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Edificios Culturales Emblemáticos',
      icono: 'Theater',
      descripcion: 'Arquitectura icónica mediante estructuras metálicas complejas: teatros, museos, bibliotecas y centros culturales que definen identidad urbana. MEISA traduce geometrías arquitectónicas audaces en estructuras metálicas factibles: formas curvas, voladizos dramáticos y espacios doble altura que arquitectos sueñan requieren ingeniería estructural creativa. Con 490 toneladas en Cinemateca Distrital, demostramos capacidad de ejecutar proyectos emblemáticos sin simplificar visión arquitectónica: cada elemento estructural es también expresión estética. Acero permite luces mayores y secciones más esbeltas versus concreto: espacios interiores amplios sin columnas que obstruyan visuales hacia escenarios o exhibiciones. Con fabricación precisa en taller y montaje cuidadoso, entregamos estructuras donde tolerancias milimétricas permiten acabados arquitectónicos premium que edificios culturales merecen. Estos proyectos trascienden funcionalidad: generan orgullo cívico y atraen turismo cultural que dinamiza economía local décadas después de inauguración.',
      metricas: ['490 ton', 'Geometrías complejas', 'Iconicidad'],
      proyectosEjemplo: ['Cinemateca Distrital'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Colegios y Estructuras Educativas',
      icono: 'GraduationCap',
      descripcion: 'Infraestructura educativa duradera y segura: colegios, universidades y centros de formación que protegen estudiantes décadas. MEISA diseña estructuras metálicas sismorresistentes para aulas, laboratorios, bibliotecas y auditorios que alojan 1,200+ estudiantes diariamente. Con marcos metálicos especiales y arriostramientos concéntricos, garantizamos que edificio educativo sobrevive terremoto sin colapso: niños y jóvenes están protegidos durante evento sísmico y comunidad educativa retoma clases rápidamente post-desastre sin perder año escolar. Estructuras con luces generosas entre columnas permiten aulas amplias y flexibles: espacios se adaptan a pedagogías modernas que requieren reconfiguración frecuente versus salones rígidos tradicionales. Con acabados arquitectónicos que transmiten dignidad, estos edificios no son meramente funcionales: arquitectura de calidad genera orgullo institucional que motiva estudiantes y atrae docentes talentosos. Mantenimiento mínimo por durabilidad del acero tratado permite que presupuestos educativos limitados se inviertan en pedagogía no en reparaciones estructurales perpetuas.',
      metricas: ['1,200+ estudiantes', 'Sismorresistente', 'Flexibilidad pedagógica'],
      proyectosEjemplo: ['Colegios', 'Universidades'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Edificios de Altura',
      icono: 'TowerControl',
      descripcion: 'Estructuras metálicas verticales: edificios de 10-20+ pisos donde acero estructural optimiza altura y rapidez constructiva. MEISA diseña marcos metálicos arriostrados o muros de corte metálicos que resisten cargas gravitacionales y sísmicas eficientemente: cada tonelada de acero soporta más pisos versus concreto equivalente, reduciendo fundaciones y costos. Con conexiones atornilladas precortadas en taller, montaje de estructura es rápido: 2-3 pisos por semana versus 1 piso/semana en concreto tradicional. Tiempo ahorrado significa edificio generando rentas o vendiendo antes, mejorando TIR del proyecto inmobiliario significativamente. Estructura metálica permite fachadas ligeras con mayor área vidriada: vistas panorámicas aumentan valor de apartamentos/oficinas sin comprometer resistencia estructural. Con mantenimiento mínimo por protección anticorrosiva del acero, estos edificios operan 50+ años sin intervenciones estructurales mayores, garantizando inversión de largo plazo para desarrolladores y compradores finales.',
      metricas: ['10-20+ pisos', '2-3 pisos/semana', '50+ años'],
      proyectosEjemplo: ['Torres Residenciales', 'Edificios Corporativos'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Ampliaciones a Edificios Existentes', // CAMBIO: reemplaza "Reforzamiento Estructural"
      icono: 'Plus',
      descripcion: 'Expansión de edificios operativos sin interrumpir actividades: ampliaciones metálicas que agregan pisos o alas laterales a construcciones existentes. MEISA diseña estructuras nuevas que se conectan a originales sin generar incompatibilidades estructurales: calculamos cómo transmitir cargas sin sobrecargar fundaciones antiguas que no fueron dimensionadas para crecimiento futuro. Con fabricación completa en taller y montaje nocturno/fin de semana, minimizamos afectación a operación continua: hospitales, hoteles y oficinas funcionan normalmente mientras estructura crece. Técnica de desconexión sísmica mediante juntas permite que estructura nueva vibre independientemente de vieja durante terremoto, previniendo martilleo que dañaría ambas. Con experiencia en ampliaciones de colegios y hospitales que no podían cerrar, dominamos logística de construir adyacente a operación crítica: ruido controlado, polvo minimizado y seguridad perimetral estricta que protege ocupantes sin sacrificar productividad constructiva.',
      metricas: ['0 días interrupción', 'Conexión existente', 'Montaje nocturno'],
      proyectosEjemplo: ['Ampliaciones Hospitalarias', 'Expansiones Educativas'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80'
    }
  ],

  // ============================================================================
  // 6. DEPORTES_EDUCACION - Eliminar "Acústica", ajustar resto
  // ============================================================================
  DEPORTES_EDUCACION: [
    {
      id: generateId(),
      titulo: 'Coliseos para Eventos Internacionales',
      icono: 'Trophy',
      descripcion: 'Infraestructura deportiva de gran escala: coliseos con capacidad 5,000+ espectadores que alojan competencias regionales, nacionales e internacionales. MEISA diseña estructuras metálicas que cubren canchas reglamentarias completas sin columnas intermedias: geometría de canchas (baloncesto, voleibol, futsal) es inviolable, por eso cubrimos con cerchas de gran luz que dejan espacio deportivo completamente libre. Con graderías metálicas en voladizo, maximizamos capacidad sin ampliar huella: cada espectador adicional significa más ingresos por boletería que mejora sostenibilidad financiera del coliseo. Estructura soporta cargas de techo pesadas: iluminación deportiva profesional, pantallas LED gigantes, sonido de alta potencia y eventual climatización futura sin requerir refuerzos posteriores. Con diseño sísmico certificado, coliseo funciona como refugio post-desastre: comunidad afectada por terremoto o inundación encuentra albergue temporal en infraestructura robusta que sobrevivió evento.',
      metricas: ['5,000+ capacidad', 'Luces 60m', 'Canchas reglamentarias'],
      proyectosEjemplo: ['Coliseos Regionales', 'Juegos Nacionales'],
      orden: 1,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas de Grandes Luces sin Columnas',
      icono: 'Home',
      descripcion: 'Coberturas deportivas amplias: cerchas metálicas que cubren 60+ metros sin soportes internos. MEISA diseña estructuras de acero con geometrías optimizadas (Warren, Pratt, Howe) que minimizan peso propio mientras maximizan capacidad de carga: cada tonelada ahorrada reduce costos de fundaciones y montaje. Con 268 toneladas típicas, estas cubiertas protegen instalaciones deportivas de lluvia permitiendo práctica continua 365 días/año versus canchas descubiertas inutilizables cada aguacero. Estructura metálica permite instalar cubiertas en escenarios existentes sin demoler: fabricamos cerchas completas, transportamos en secciones y montamos con grúas mientras instalación opera debajo. Con aislamiento térmico en cubierta, reducimos temperatura interna mejorando confort de atletas: cada grado menos significa mejor rendimiento deportivo mensurable en tiempos/marcas. Diseño incluye ventilación natural mediante linternas cenitales que evacuan calor acumulado sin ventilación mecánica costosa.',
      metricas: ['60+ metros luz', '268 ton', '365 días uso'],
      proyectosEjemplo: ['Cubiertas Deportivas', 'Canchas Sintéticas'],
      orden: 2,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Graderías y Estructuras de Soporte de Público',
      icono: 'Armchair',
      descripcion: 'Graderías metálicas seguras y confortables: estructuras que alojan 15,000+ espectadores con visuales óptimas. MEISA diseña graderías con pendientes calculadas (25-30°) que garantizan que cada fila ve sobre cabezas de fila anterior: geometría precisa elimina puntos ciegos frustrantes. Con pasillos dimensionados según códigos de evacuación, garantizamos que coliseo lleno evacua en minutos ante emergencia: cada segundo cuenta cuando pánico amenaza con convertir evacuación en tragedia. Estructura metálica modular permite graderías desmontables: eventos temporales instalan capacidad adicional y luego retiran sin dejar huella, optimizando inversión municipal que sirve eventos grandes ocasionalmente sin sobreconstruir permanentemente. Asientos individuales atornillados a estructura metálica son reemplazables: vandalismo o desgaste normal se reparan económicamente versus graderías de concreto donde daños son irreversibles. Con barandas y pasamanos normativos, protegemos espectadores sin obstruir visuales ni circulación durante entrada/salida masiva.',
      metricas: ['15,000+ espectadores', '25-30° pendiente', 'Evacuación rápida'],
      proyectosEjemplo: ['Estadios', 'Coliseos'],
      orden: 3,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Torres Metálicas para Iluminación Deportiva', // CAMBIO: antes "Iluminación Deportiva Estructural"
      icono: 'Lightbulb',
      descripcion: 'Torres estructurales para iluminación profesional: estructuras metálicas de 15-30 metros que soportan reflectores de alta potencia. MEISA diseña torres que resisten cargas de viento extremas sin vibrar: vibración excesiva desalinea reflectores generando iluminación deficiente que televisión internacional rechazaría. Con fundaciones calculadas para vientos huracanados y eventual sismo simultáneo, garantizamos que torres no colapsan sobre graderías adyacentes poniendo en riesgo espectadores. Cableado eléctrico asciende internamente por estructura metálica protegido de vandalismo y clima: mantenimiento eléctrico es seguro mediante escalerillas internas con líneas de vida. Torres desmontables permiten reubicar iluminación cuando configuración de cancha cambia: inversión en torres no queda obsoleta si estadio se reconfigura futuro. Con acabado galvanizado o pintado, estas torres requieren mantenimiento mínimo operando décadas: inspección visual anual y reapriete de pernos garantiza seguridad continua sin costos operativos significativos.',
      metricas: ['15-30m altura', 'Reflectores alta potencia', 'Resistencia viento'],
      proyectosEjemplo: ['Torres de Iluminación', 'Estadios'],
      orden: 4,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Piscinas Cubiertas y Complejos Acuáticos',
      icono: 'Building2',
      descripcion: 'Estructuras para instalaciones acuáticas: cubiertas metálicas que protegen piscinas olímpicas permitiendo entrenamiento continuo. MEISA diseña estructuras resistentes a ambiente húmedo corrosivo: cloro vaporizado ataca acero desprotegido, por eso usamos recubrimientos anticorrosivos industriales o aceros inoxidables en zonas críticas. Con 135 toneladas cubriendo 3,557 m², estas estructuras permiten que nadadores entrenen 365 días sin suspensiones por clima: cada día adicional de entrenamiento mejora rendimiento atlético que en competencia se mide en décimas de segundo. Diseño incluye ventilación forzada que evacua vapores de cloro protegiendo salud de atletas y longevidad estructural: humedad estancada acelera corrosión y genera moho que degrada instalación rápidamente. Con iluminación natural mediante láminas translúcidas en cubierta, reducimos consumo energético 70% versus instalaciones 100% artificialmente iluminadas. Estructura soporta cargas futuras: paneles solares en techo pueden generar energía que compensa parcialmente costo de calentar agua de piscina perpetuamente.',
      metricas: ['3,557 m²', '135 ton', '70% ahorro lumínico'],
      proyectosEjemplo: ['Piscinas Olímpicas', 'Complejos Acuáticos'],
      orden: 5,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    },
    {
      id: generateId(),
      titulo: 'Cubiertas Tensionadas y Membranas',
      icono: 'Tent',
      descripcion: 'Arquitectura textil con estructuras metálicas: cubiertas ligeras mediante membranas tensadas sobre mástiles de acero. MEISA diseña sistemas de tensoestructuras donde mástiles metálicos y cables de acero pretensan membranas (PVC, PTFE, ETFE) creando superficies curvas que cubren grandes áreas con peso mínimo. Con translucidez natural de membranas, iluminación diurna penetra reduciendo consumo eléctrico 80%: espacios deportivos se sienten exteriores pese a estar cubiertos. Geometría curva de membrana evacua agua pluvial naturalmente sin acumular charcos que sobrecargarían estructura: cada gota resbala inmediatamente por pendientes calculadas. Desmontaje es reversible: estructura metálica y membrana se pueden reubicar si instalación deportiva cambia de sede, convirtiendo inversión en activo reutilizable. Con mantenimiento quinquenal de tensión en membrana, estas cubiertas operan 20-25 años antes de requerir reemplazo de textil (estructura metálica dura 50+ años sin cambio).',
      metricas: ['80% luz natural', 'Peso mínimo', '20-25 años membrana'],
      proyectosEjemplo: ['Canchas Tensionadas', 'Espacios Deportivos'],
      orden: 6,
      activo: true,
      imagen: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80'
    }
  ]
}

// ==============================================================================
// FUNCIÓN PRINCIPAL
// ==============================================================================

async function actualizarEspecialidadesRestantes() {
  console.log('='.repeat(80))
  console.log('ACTUALIZACIÓN PARTE 2: INFRAESTRUCTURA, EDIFICACIONES, DEPORTES')
  console.log('='.repeat(80))
  console.log()

  try {
    let totalActualizadas = 0

    for (const [categoriaKey, especialidades] of Object.entries(ESPECIALIDADES_RESTANTES)) {
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

    console.log()
    console.log('='.repeat(80))
    console.log('✅ PARTE 2 COMPLETADA')
    console.log('='.repeat(80))
    console.log(`   Categorías actualizadas: ${totalActualizadas}`)
    console.log()
    console.log('📋 CAMBIOS REALIZADOS:')
    console.log('   • INFRAESTRUCTURA_URBANA: Enfoque movilidad (ciclopuentes agregados)')
    console.log('   • EDIFICACIONES: "Sismorresistente" → "Edificios Institucionales"')
    console.log('   • EDIFICACIONES: "Reforzamiento" → "Ampliaciones a Edificios"')
    console.log('   • DEPORTES: "Acústica" → "Cubiertas Tensionadas"')
    console.log('   • DEPORTES: "Iluminación Deportiva" → "Torres Metálicas para Iluminación"')
    console.log()
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
actualizarEspecialidadesRestantes()
  .then(() => {
    console.log('✅ Script Parte 2 finalizado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
