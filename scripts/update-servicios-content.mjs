/**
 * Reescribe el contenido de los 4 servicios de /servicios con texto veraz y
 * específico de MEISA, basado en datos verificables de la propia DB.
 *
 * Reemplaza el contenido roto anterior (cifras contradictorias, listas de
 * relleno IA, datos copiados de otra empresa "SADELEC", imágenes de stock
 * Unsplash). NO usa upsert — los 4 servicios ya existen; actualiza por slug.
 *
 * Coherencia de datos (espejo de /procesos-tecnologias, /calidad, /empresa):
 *   - Software real (tabla Tecnologia): Tekla, AutoCAD, ETABS, SAP2000, Midas,
 *     SAFE, IDEA StatiCa, FastCAM, DC-CAD  (NO RISA, NO StruM.I.S — la gestión de
 *     producción/trazabilidad es un sistema propio MEISA, no software comercial).
 *   - 3 plantas propias: Jamundí (5.629 m²), Popayán (3.400 m²), Villa Rica
 *     (7.000 m²) → ~16.000 m², 12 naves, 8 puentes grúa (5–20 t), 3 mesas CNC.
 *   - ~260 proyectos · ~32.000 ton · ~450.000 m² · 6 sectores · 8 departamentos.
 *
 * Formas JSON (load-bearing, no cambiar sin revisar el render):
 *   - tecnologias / equipamiento → array de objetos {nombre, descripcion|capacidad|cantidad}
 *   - normativas → { titulo, items[] }   (render en listado Y detalle)
 *   - estadisticas → [{ value, label, icon }]
 *   - procesoPasos → [{ title, description, icon }]
 *   - preguntasFrecuentes → [{ pregunta, respuesta }]
 *
 * Correr:  node scripts/update-servicios-content.mjs
 * (dev y prod comparten Neon; ISR 60s → en vivo en ~1 min sin deploy)
 */
import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'

loadEnv({ path: '.env.local' }) // dev y prod comparten esta misma Neon

const prisma = new PrismaClient()

const IMG = 'https://storage.googleapis.com/meisa-imagenes/site'

const SERVICIOS = [
  /* ─────────────────────────────────────────────────────────────────────── */
  {
    slug: 'consultoria-en-diseno-estructural',
    nombre: 'Consultoría y Diseño Estructural',
    titulo: 'Consultoría y Diseño Estructural',
    subtitulo: 'Ingeniería estructural y modelado BIM',
    icono: 'Calculator',
    color: 'blue',
    descripcion:
      'Diseñamos y modelamos cada estructura antes de cortar el primer perfil. Desarrollamos el análisis estructural y sísmico bajo la NSR-10 y los estándares AISC, y entregamos un modelo BIM 3D con planos de fabricación, listas de material y memorias de cálculo listos para taller. El mismo equipo que diseña acompaña la fabricación y el montaje: el diseño nace pensado para construirse.',
    expertiseTitulo: 'Nuestra experiencia',
    expertiseDescripcion:
      'Más de 260 proyectos diseñados y construidos en seis sectores —edificaciones, industria, comercio, puentes, escenarios deportivos e infraestructura urbana— nos dan criterio para optimizar peso y conexiones sin comprometer la seguridad.',
    caracteristicas: [
      'Análisis estructural y sísmico bajo NSR-10 y AISC',
      'Modelado BIM 3D en Tekla Structures',
      'Diseño y verificación de conexiones (IDEA StatiCa, CBFEM)',
      'Optimización de peso y constructibilidad',
      'Planos de taller, despiece y memorias de cálculo',
    ],
    tecnologias: [
      { nombre: 'Tekla Structures', descripcion: 'Modelado BIM 3D, planos de fabricación y despiece.' },
      { nombre: 'ETABS', descripcion: 'Análisis y diseño de edificios y estructuras complejas.' },
      { nombre: 'SAP2000', descripcion: 'Análisis universal de estructuras.' },
      { nombre: 'Midas', descripcion: 'BIM integrado y análisis avanzado.' },
      { nombre: 'IDEA StatiCa', descripcion: 'Diseño de conexiones complejas con análisis CBFEM.' },
      { nombre: 'AutoCAD', descripcion: 'Planimetría y detalles técnicos 2D/3D.' },
    ],
    equipamiento: null,
    equipos: null,
    normativas: {
      titulo: 'Normativas aplicables',
      items: [
        'NSR-10 — Reglamento Colombiano de Construcción Sismo Resistente',
        'AISC 360 — Specification for Structural Steel Buildings',
        'AWS D1.1 — Structural Welding Code (Steel)',
        'NTC — Normas Técnicas Colombianas (materiales, soldadura y recubrimientos)',
        'ASTM — Especificaciones de aceros estructurales (A36, A572, A325/A490)',
      ],
    },
    estadisticas: [
      { value: '30+', label: 'Años de experiencia', icon: 'Calendar' },
      { value: '260+', label: 'Proyectos construidos', icon: 'Building2' },
      { value: '430K+', label: 'm² construidos', icon: 'Ruler' },
      { value: '6', label: 'Sectores atendidos', icon: 'LayoutGrid' },
    ],
    procesoPasos: [
      { title: 'Levantamiento de requerimientos', description: 'Analizamos uso, cargas, condiciones del sitio y normativa aplicable.', icon: 'ClipboardList' },
      { title: 'Modelado BIM 3D', description: 'Construimos el modelo en Tekla Structures con las especialidades coordinadas.', icon: 'Boxes' },
      { title: 'Análisis estructural y sísmico', description: 'Verificamos con ETABS, SAP2000 y Midas bajo NSR-10 y AISC.', icon: 'Calculator' },
      { title: 'Diseño de conexiones y optimización', description: 'Resolvemos conexiones en IDEA StatiCa y optimizamos peso y constructibilidad.', icon: 'Wrench' },
      { title: 'Planos de taller y memorias', description: 'Entregamos despiece, listas de material y memorias de cálculo listos para fabricar.', icon: 'FileText' },
    ],
    preguntasFrecuentes: [
      { pregunta: '¿Diseñan según la NSR-10?', respuesta: 'Sí. Todo el diseño estructural y sísmico cumple la NSR-10 (Reglamento Colombiano de Construcción Sismo Resistente) y se complementa con estándares AISC y AWS.' },
      { pregunta: '¿Qué entregables reciben?', respuesta: 'Un modelo BIM 3D, planos de fabricación y despiece, listas de material y memorias de cálculo, listos para taller.' },
      { pregunta: '¿Pueden revisar u optimizar un diseño existente?', respuesta: 'Sí. Revisamos diseños de terceros para optimizar peso, conexiones y constructibilidad antes de fabricar.' },
    ],
    metaTitle: 'Diseño Estructural y Modelado BIM | MEISA',
    metaDescription:
      'Consultoría y diseño de estructuras metálicas en Colombia: análisis sísmico NSR-10, modelado BIM en Tekla y planos de taller. Más de 30 años de experiencia.',
    imagen: `${IMG}/hero/estructura-perspectiva.jpg`,
    imagenesGaleria: [
      `${IMG}/hero/estructura-perspectiva.jpg`,
      `${IMG}/about/meisa-planta-aerea.jpg`,
      `${IMG}/hero/edificios.jpg`,
      `${IMG}/proyectos/obra-construccion.jpg`,
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────── */
  {
    slug: 'fabricacion-de-estructuras-metalicas',
    nombre: 'Fabricación de Estructuras Metálicas',
    titulo: 'Fabricación de Estructuras Metálicas',
    subtitulo: 'Plantas propias · corte CNC y soldadura calificada AWS',
    icono: 'Factory',
    color: 'gray',
    descripcion:
      'Fabricamos en plantas propias con corte plasma CNC programado desde el modelo BIM (FastCAM) y soldadura ejecutada por personal calificado bajo AWS D1.1. Cada elemento pasa por granallado y un sistema de pintura anticorrosiva, con trazabilidad por pieza desde la llegada del acero hasta el despacho. Fabricar lo que diseñamos nos permite controlar tolerancias y cumplir los cronogramas que prometemos.',
    expertiseTitulo: 'Capacidad productiva',
    expertiseDescripcion:
      'Más de 32.000 toneladas fabricadas en 30 años, desde naves industriales y centros comerciales hasta puentes vehiculares y cubiertas de gran luz, en tres plantas propias con cerca de 16.000 m² instalados.',
    caracteristicas: [
      'Corte plasma y oxicorte CNC (FastCAM) hasta 150 mm',
      'Soldadura bajo código AWS D1.1 con personal calificado',
      'Granallado y pintura anticorrosiva',
      'Ensayos no destructivos y dossier digital de calidad',
      'Trazabilidad por pieza mediante código QR',
    ],
    tecnologias: [
      { nombre: 'FastCAM', descripcion: 'Nesting y programación del corte plasma y oxicorte CNC.' },
      { nombre: 'Tekla Structures', descripcion: 'Planos de taller y despiece para fabricación.' },
    ],
    equipamiento: [
      { nombre: 'Mesas de corte CNC', capacidad: 'Corte plasma/oxicorte hasta 150 mm', cantidad: 3 },
      { nombre: 'Puentes grúa', capacidad: 'De 5 a 20 toneladas', cantidad: 8 },
      { nombre: 'Granalladora industrial', capacidad: 'Preparación superficial' },
      { nombre: 'Curvadora de tejas', capacidad: 'Cubiertas curvas de gran luz' },
      { nombre: 'Ensambladora de perfiles', capacidad: 'Armado de perfiles soldados' },
      { nombre: 'Equipos de soldadura certificados', capacidad: 'Procesos calificados AWS D1.1' },
    ],
    equipos: null,
    normativas: {
      titulo: 'Normativas aplicables',
      items: [
        'AWS D1.1 — Código de Soldadura Estructural',
        'ASTM A36 / A572 — Aceros estructurales al carbono y de alta resistencia',
        'NTC — Normas Técnicas Colombianas (materiales, soldadura y recubrimientos)',
        'AISC 303 — Code of Standard Practice for Steel Buildings',
        'SSPC — Preparación de superficie y recubrimientos protectores',
      ],
    },
    estadisticas: [
      { value: '32.000+', label: 'Toneladas fabricadas', icon: 'Factory' },
      { value: '3', label: 'Plantas propias', icon: 'Warehouse' },
      { value: '16.000', label: 'm² de planta', icon: 'Ruler' },
      { value: '8', label: 'Puentes grúa', icon: 'Container' },
    ],
    procesoPasos: [
      { title: 'Ingeniería de detalle', description: 'Planos de taller y despiece generados desde el modelo BIM.', icon: 'FileText' },
      { title: 'Recepción de acero certificado', description: 'Materia prima con certificados de calidad y registro de trazabilidad.', icon: 'PackageCheck' },
      { title: 'Corte CNC', description: 'Nesting en FastCAM y corte plasma/oxicorte en mesas CNC.', icon: 'Scissors' },
      { title: 'Armado y soldadura AWS', description: 'Ensamble y soldadura por personal calificado, con inspección permanente.', icon: 'Zap' },
      { title: 'Granallado y pintura anticorrosiva', description: 'Preparación superficial y aplicación del sistema de protección.', icon: 'SprayCan' },
      { title: 'Liberación y despacho', description: 'Ensayos no destructivos, dossier digital y despacho con trazabilidad QR.', icon: 'Truck' },
    ],
    preguntasFrecuentes: [
      { pregunta: '¿Sus soldadores están calificados?', respuesta: 'Sí. La soldadura se ejecuta con procedimientos y personal calificados bajo AWS D1.1, con inspección y ensayos no destructivos.' },
      { pregunta: '¿Qué protección anticorrosiva aplican?', respuesta: 'Cada elemento pasa por granallado y un sistema de pintura anticorrosiva definido según la especificación del proyecto y el ambiente de la obra.' },
      { pregunta: '¿Manejan trazabilidad de materiales?', respuesta: 'Sí. Cada pieza se rastrea con código QR desde la recepción del acero certificado hasta el despacho, con dossier digital de calidad.' },
      { pregunta: '¿Cuál es su capacidad de fabricación?', respuesta: 'Contamos con tres plantas propias (cerca de 16.000 m²), tres mesas de corte CNC (hasta 150 mm) y ocho puentes grúa de 5 a 20 toneladas.' },
    ],
    metaTitle: 'Fabricación de Estructuras Metálicas | MEISA',
    metaDescription:
      'Fabricamos estructuras metálicas en 3 plantas propias con corte CNC y soldadura certificada AWS D1.1. Más de 32.000 toneladas fabricadas en 30 años.',
    imagen: `${IMG}/about/meisa-planta-aerea.jpg`,
    imagenesGaleria: [
      `${IMG}/about/meisa-planta-aerea.jpg`,
      `${IMG}/hero/hero-construccion-industrial.jpg`,
      `${IMG}/projects/industria/tecnofar/TECNOFAR-1.jpg`,
      `${IMG}/proyectos/obra-construccion.jpg`,
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────── */
  {
    slug: 'montaje-de-estructuras',
    nombre: 'Montaje de Estructuras',
    titulo: 'Montaje de Estructuras',
    subtitulo: 'Izaje y montaje en obra con personal certificado',
    icono: 'HardHat',
    color: 'slate',
    descripcion:
      'Montamos en sitio con cuadrillas propias y un plan de montaje coordinado contra el mismo modelo BIM con que se diseñó y fabricó. El personal está certificado para trabajo en alturas (Resolución 1409) y la obra se ejecuta bajo el Sistema Integrado de Gestión, con control topográfico, control de torque y supervisión permanente. Llegamos a obra en todo el país —hemos montado en ocho departamentos— con la logística para transportar y elevar elementos de gran tamaño.',
    expertiseTitulo: 'Experiencia en montaje',
    expertiseDescripcion:
      'Estructuras montadas en proyectos de alta complejidad —puentes vehiculares, coliseos y escenarios deportivos, centros comerciales y naves industriales—, siempre bajo protocolos de seguridad certificados.',
    caracteristicas: [
      'Izaje con grúas y equipos especializados',
      'Personal certificado para trabajo en alturas (Res. 1409)',
      'Control topográfico y de torque en obra',
      'Soldadura de campo bajo AWS D1.1',
      'Supervisión bajo el Sistema Integrado de Gestión (SIG)',
    ],
    tecnologias: [
      { nombre: 'Planeación de izaje 3D', descripcion: 'Secuencia de montaje y rigging definidos desde el modelo.' },
      { nombre: 'Topografía de precisión', descripcion: 'Control dimensional, verticalidad y alineación.' },
      { nombre: 'Trazabilidad QR', descripcion: 'Seguimiento y liberación de cada pieza en obra.' },
    ],
    equipamiento: [
      { nombre: 'Equipos de izaje', capacidad: 'Grúas y puentes grúa de 5 a 20 toneladas' },
      { nombre: 'Equipos de soldadura de campo', capacidad: 'Procesos calificados AWS D1.1' },
      { nombre: 'Equipos para trabajo en alturas', capacidad: 'Sistemas certificados (Res. 1409)' },
      { nombre: 'Transporte de carga', capacidad: 'Despacho de elementos extradimensionados por módulos' },
    ],
    equipos: null,
    normativas: {
      titulo: 'Normativas aplicables',
      items: [
        'AISC 303 — Code of Standard Practice for Steel Buildings',
        'AWS D1.1 — Código de Soldadura Estructural',
        'Resolución 1409 de 2012 — Trabajo en alturas (Colombia)',
        'SG-SST — Decreto 1072 de 2015 y Resolución 0312 de 2019',
        'NSR-10 — Reglamento Colombiano de Construcción Sismo Resistente',
      ],
    },
    estadisticas: [
      { value: '8', label: 'Departamentos con obra', icon: 'MapPin' },
      { value: '30+', label: 'Años de experiencia', icon: 'Calendar' },
      { value: '260+', label: 'Proyectos entregados', icon: 'Building2' },
      { value: 'SIG', label: 'Calidad y seguridad', icon: 'ShieldCheck' },
    ],
    procesoPasos: [
      { title: 'Plan de montaje', description: 'Secuencia, rigging y logística definidos desde el modelo 3D.', icon: 'Map' },
      { title: 'Movilización', description: 'Transporte de estructura, equipos y cuadrillas a la obra.', icon: 'Truck' },
      { title: 'Pre-ensamble en piso', description: 'Armado de subconjuntos para reducir el trabajo en altura.', icon: 'Wrench' },
      { title: 'Izaje y conexión', description: 'Elevación y montaje por secuencia, con control de seguridad permanente.', icon: 'ArrowUp' },
      { title: 'Control y entrega', description: 'Verificación topográfica, torque de pernos y liberación de la estructura.', icon: 'CheckSquare' },
    ],
    preguntasFrecuentes: [
      { pregunta: '¿Su personal está certificado para trabajo en alturas?', respuesta: 'Sí. El personal de montaje está certificado para trabajo en alturas conforme a la Resolución 1409 de 2012.' },
      { pregunta: '¿Cómo controlan la seguridad y la calidad en obra?', respuesta: 'El montaje se ejecuta bajo nuestro Sistema Integrado de Gestión (SIG) y la certificación RUC del Consejo Colombiano de Seguridad, con supervisión permanente, control topográfico y de torque.' },
      { pregunta: '¿En qué regiones del país operan?', respuesta: 'Hemos montado estructuras en ocho departamentos; desde nuestras sedes en Valle del Cauca y Cauca atendemos obra a nivel nacional.' },
    ],
    metaTitle: 'Montaje de Estructuras Metálicas | MEISA',
    metaDescription:
      'Montaje e izaje de estructuras metálicas con personal certificado para trabajo en alturas (Res. 1409) y control bajo SIG. Obra en todo el país.',
    imagen: `${IMG}/hero/montaje-grua.jpg`,
    imagenesGaleria: [
      `${IMG}/hero/montaje-grua.jpg`,
      `${IMG}/hero/ciclopuente-atardecer.jpg`,
      `${IMG}/projects/edificios/tequendama/TEQUENDAMA-PARKING-CALI.jpg`,
      `${IMG}/proyectos/puente-destacado.jpg`,
    ],
  },

  /* ─────────────────────────────────────────────────────────────────────── */
  {
    slug: 'gestion-integral-de-proyectos', // slug conservado para no romper URL/SEO
    nombre: 'Proyectos Llave en Mano',
    titulo: 'Proyectos Llave en Mano',
    subtitulo: 'Diseño, fabricación y montaje con un solo responsable',
    icono: 'Workflow',
    color: 'slate',
    descripcion:
      'Diseño, fabricación y montaje bajo un solo contrato y un solo responsable. En vez de coordinar tres proveedores, el cliente trabaja con un equipo que controla todo el flujo —del modelo BIM al acero montado— con cronograma, presupuesto e interlocutor únicos. Es como MEISA entrega la mayoría de sus proyectos: integración real, no subcontratación encadenada.',
    expertiseTitulo: 'Responsabilidad total',
    expertiseDescripcion:
      '30 años entregando proyectos completos: una sola firma diseña, fabrica y monta, y responde por el resultado. Esa integración es lo que reduce los riesgos de interfaz entre proveedores y protege el cronograma.',
    caracteristicas: [
      'Contrato único: diseño + fabricación + montaje',
      'Coordinación BIM de principio a fin',
      'Cronograma y presupuesto integrados',
      'Control de calidad SIG transversal',
      'Entrega documentada (as-built) y garantía',
    ],
    tecnologias: [
      { nombre: 'Coordinación BIM (Tekla)', descripcion: 'Un solo modelo del diseño al montaje.' },
      { nombre: 'Sistema Integrado de Gestión', descripcion: 'Calidad, seguridad y ambiente a lo largo del proyecto.' },
    ],
    equipamiento: null,
    equipos: null,
    normativas: {
      titulo: 'Normativas aplicables',
      items: [
        'NSR-10 — Reglamento Colombiano de Construcción Sismo Resistente',
        'AISC 360 — Specification for Structural Steel Buildings',
        'AWS D1.1 — Código de Soldadura Estructural',
        'SG-SST — Decreto 1072 de 2015 (Seguridad y Salud en el Trabajo)',
        'Certificación RUC — Registro Uniforme de Contratistas (Consejo Colombiano de Seguridad)',
      ],
    },
    estadisticas: [
      { value: '260+', label: 'Proyectos entregados', icon: 'PackageCheck' },
      { value: '37+', label: 'Clientes', icon: 'Users' },
      { value: '1', label: 'Interlocutor único', icon: 'UserCheck' },
      { value: '30+', label: 'Años de respaldo', icon: 'Award' },
    ],
    procesoPasos: [
      { title: 'Diagnóstico y alcance', description: 'Definimos alcance, presupuesto y cronograma del proyecto.', icon: 'Search' },
      { title: 'Diseño y planeación integrada', description: 'Ingeniería BIM y planeación de fabricación y montaje en un solo plan.', icon: 'PencilRuler' },
      { title: 'Fabricación en planta propia', description: 'Producimos lo que diseñamos, con control de calidad y trazabilidad.', icon: 'Factory' },
      { title: 'Montaje en obra', description: 'Instalamos con cuadrillas propias bajo el Sistema Integrado de Gestión.', icon: 'HardHat' },
      { title: 'Entrega as-built y garantía', description: 'Documentación final, dossier digital y soporte post-entrega.', icon: 'Award' },
    ],
    preguntasFrecuentes: [
      { pregunta: '¿Qué incluye un proyecto llave en mano?', respuesta: 'Diseño estructural, fabricación en planta propia y montaje en obra bajo un solo contrato, cronograma e interlocutor.' },
      { pregunta: '¿Quién responde por el resultado?', respuesta: 'MEISA. Al integrar diseño, fabricación y montaje, una sola firma responde por la calidad y el cumplimiento, sin diluir la responsabilidad entre proveedores.' },
      { pregunta: '¿Se encargan de la obra civil o la cimentación?', respuesta: 'Nuestro alcance es la estructura metálica (diseño, fabricación y montaje). Coordinamos con la obra civil del proyecto; el alcance puntual se confirma en la cotización.' },
    ],
    metaTitle: 'Proyectos Llave en Mano en Acero (EPC) | MEISA',
    metaDescription:
      'Diseño, fabricación y montaje de estructuras metálicas bajo un solo responsable. Más de 30 años y 260 proyectos llave en mano en Colombia.',
    imagen: `${IMG}/hero/coliseo-estructuras-rojas.jpg`,
    imagenesGaleria: [
      `${IMG}/hero/edificios.jpg`,
      `${IMG}/hero/coliseo-estructuras-rojas.jpg`,
      `${IMG}/proyectos/puente-destacado.jpg`,
      `${IMG}/hero/techo-metalico.jpg`,
    ],
  },
]

// Neon (serverless) puede estar "dormido" y rechazar las primeras conexiones;
// reintentamos con backoff para no fallar por un cold-start.
async function retry(fn, n = 6) {
  for (let i = 0; i < n; i++) {
    try { return await fn() }
    catch (e) { if (i === n - 1) throw e; await new Promise((r) => setTimeout(r, 2500)) }
  }
}

for (const { slug, ...data } of SERVICIOS) {
  await retry(() => prisma.servicio.update({ where: { slug }, data }))
  console.log('✓', slug)
}

console.log(`\n✅ ${SERVICIOS.length} servicios actualizados con contenido veraz.`)
await prisma.$disconnect()
