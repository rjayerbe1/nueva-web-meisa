// Configuración de las landings locales /estructuras-metalicas/[ciudad].
//
// ⚠ El contenido EDITABLE vive en la DB (tabla landings_seo, tipo CIUDAD,
// editor en /admin/landings) y se lee vía lib/content/landings.ts
// (getCiudadDb). Este archivo es la fuente de FALLBACK: se usa si la fila
// no existe, está inactiva o su Json no valida. Los types de abajo son el
// contrato del Json `contenido`.
//
// La página dinámica (app/(public)/estructuras-metalicas/[ciudad]/page.tsx)
// resuelve stats y proyectos reales desde la base de datos usando
// `terminosUbicacion` (query OR contains, case-insensitive, sobre
// Proyecto.ubicacion).
//
// Rangos de costos en las FAQ: mismos rangos orientativos que lib/soluciones.ts
// (liviana $10.900–$13.000 · media $13.000–$17.000 · especial $17.000–$25.000
// COP por kg instalado).

import type { CategoriaEnum } from '@prisma/client'

export interface CiudadSeccion {
  nombre: string
  descripcion: string
}

export interface CiudadFaq {
  pregunta: string
  respuesta: string
}

export interface CiudadStat {
  valor: string
  sufijo: string
  label: string
}

export interface CiudadRelacionada {
  href: string
  eyebrow: string
  titulo: string
  descripcion: string
}

export interface CiudadConfig {
  slug: string
  /** Nombre corto para textos genéricos ("Cali y el Valle", "Bogotá", "Popayán") */
  nombre: string
  /** H1 completo (también se usa en alt de imágenes y en el ServiceSchema) */
  h1: string
  metaTitle: string
  /** <= 160 caracteres */
  metaDescription: string
  /** Key de CategoriaProyecto cuya imagenCover sirve de hero (fallback) */
  heroCategoriaKey: CategoriaEnum
  /** Imagen de portada del hero. Si no se define, se usa imagenCover de heroCategoriaKey. */
  heroImagen?: string
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  heroDescripcion: string
  introEyebrow: string
  introTitulo1: string
  introTitulo2: string
  /** Párrafos del bloque editorial de apertura */
  intro: string[]
  statProyectosLabel: string
  statToneladasLabel: string
  /** Dos stats fijas que completan el strip de 4 */
  statsFijas: CiudadStat[]
  seccionesEyebrow: string
  seccionesTitulo1: string
  seccionesTitulo2: string
  /** Tiles numerados de "Qué construimos" */
  secciones: CiudadSeccion[]
  ventajaEyebrow: string
  ventajaTitulo: string
  /** Párrafos de la sección de ventaja local/logística */
  ventaja: string[]
  proyectosTitulo2: string
  proyectosDescripcion: string
  faqTitulo1: string
  faqTitulo2: string
  faq: CiudadFaq[]
  relacionadas: CiudadRelacionada[]
  ctaEyebrow: string
  ctaTitulo1: string
  ctaTitulo2: string
  ctaDescripcion: string
  /** Términos para el query OR contains insensitive sobre Proyecto.ubicacion */
  terminosUbicacion: string[]
}

export const CIUDADES: CiudadConfig[] = [
  // ──────────────────────────────────────────────────────────────────────
  // CALI / VALLE DEL CAUCA
  // 'Jamund' cubre 'Jamundí' y 'Jamundi'; 'Cerrito' cubre 'El Cerrito' y
  // 'Cerrito-Valle'.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'cali',
    nombre: 'Cali y el Valle',
    h1: 'Estructuras metálicas en Cali y el Valle',
    metaTitle: 'Estructuras Metálicas en Cali y el Valle del Cauca | MEISA',
    metaDescription:
      'Estructuras metálicas en Cali y el Valle: +90 proyectos y 13.500 toneladas montadas. Planta en Jamundí. Diseño, fabricación y montaje NSR-10. Cotice con MEISA.',
    heroCategoriaKey: 'COMERCIAL',
    heroEyebrow: 'Cobertura local — Valle del Cauca',
    heroTitulo1: 'Estructuras metálicas',
    heroTitulo2: 'en Cali y el Valle',
    heroDescripcion:
      'Diseño, fabricación y montaje con planta propia en Jamundí, a minutos de cualquier obra en Cali, Yumbo, Palmira y el resto del departamento.',
    introEyebrow: '01 — Fabricante local',
    introTitulo1: 'Acero del Valle,',
    introTitulo2: 'para el Valle',
    intro: [
      'MEISA diseña, fabrica y monta estructuras metálicas en Cali y el Valle del Cauca desde 1996. Nuestra planta principal está en Jamundí, en el área metropolitana de Cali: eso significa menos transporte, despachos sincronizados con el montaje y un equipo de ingeniería que conoce de primera mano las condiciones sísmicas, de viento y de suelos de la región. En el departamento hemos entregado más de 90 proyectos y 13.500 toneladas de acero estructural: centros comerciales, industria, edificios, infraestructura del MIO y escenarios deportivos.',
      'Trabajamos con constructores, industriales y entidades públicas bajo un esquema integrado — ingeniería de detalle, fabricación con corte CNC y soldadura calificada AWS D1.1, y montaje con personal propio certificado — con cumplimiento pleno de la NSR-10 para zona de amenaza sísmica alta.',
    ],
    statProyectosLabel: 'Proyectos en el Valle del Cauca',
    statToneladasLabel: 'Toneladas montadas en la región',
    statsFijas: [
      { valor: '1', sufijo: '', label: 'Planta propia en Jamundí' },
      { valor: '1996', sufijo: '', label: 'En el Valle desde' },
    ],
    seccionesEyebrow: '02 — Sectores',
    seccionesTitulo1: 'Qué construimos',
    seccionesTitulo2: 'en Cali y el Valle',
    secciones: [
      {
        nombre: 'Centros comerciales y retail',
        descripcion:
          'Cali es la ciudad donde más estructura comercial hemos montado: las ampliaciones del Centro Comercial Único (1.800 toneladas), Bochalema Plaza (1.781 toneladas) y la ampliación del Único Tres, varias de ellas ejecutadas con el centro comercial operando, con izajes nocturnos coordinados con la administración.',
      },
      {
        nombre: 'Industria y agroindustria',
        descripcion:
          'Bodegas, naves de proceso y edificios industriales para Tecnoquímicas en Jamundí, los ingenios Providencia y Mayagüez en el corredor Palmira–El Cerrito, y plantas de alimentos en Yumbo y Villagorgona. Estructuras con puente grúa, soportería de equipos y cargas de proceso.',
      },
      {
        nombre: 'Edificios y sector salud',
        descripcion:
          'Estructura de edificios corporativos y clínicos en Cali, como el World Trade Center Pacific y el Edificio Parqueadero Tequendama (156 toneladas), con entrepisos en lámina colaborante y sistemas sísmicos para zona de amenaza alta.',
      },
      {
        nombre: 'Infraestructura urbana y transporte',
        descripcion:
          'Para el sistema MIO fabricamos y montamos la Terminal Intermedia de la Autopista Simón Bolívar (654 toneladas) y estaciones del corredor troncal: estructura urbana a la vista, montada en vías en operación con cierres programados.',
      },
      {
        nombre: 'Escenarios deportivos y educativos',
        descripcion:
          'El Coliseo Mundialista de Korfball de los Juegos Mundiales Cali 2013 (216 toneladas y 3.300 m²) y la cancha múltiple de la Universidad Javeriana Cali (87 toneladas), entre escenarios y cubiertas para colegios y universidades de la región.',
      },
      {
        nombre: 'Cubiertas y grandes luces',
        descripcion:
          'Cerchas, arcos y cubiertas autoportantes para naves, canchas y espacio público en todo el Valle, fabricadas en nuestra planta de Jamundí y montadas con equipos propios certificados para trabajo en alturas.',
      },
    ],
    ventajaEyebrow: '03 — La ventaja local',
    ventajaTitulo: 'Por qué fabricar a minutos de la obra',
    ventaja: [
      'En estructura metálica, la distancia entre la planta y la obra se paga tres veces: en fletes, en tiempos de respuesta y en riesgo logístico. Fabricar en Jamundí nos permite despachar por módulos según el plan de izajes — sin acopios gigantes en obra —, resolver ajustes de fabricación en horas y mantener al director de obra a una llamada de distancia del taller.',
      'Esa cercanía también es conocimiento: llevamos casi tres décadas diseñando para los suelos del valle geográfico del río Cauca y la amenaza sísmica alta de la región, y montando en condiciones urbanas reales — centros comerciales operando, corredores del MIO en servicio, plantas industriales que no pueden detener producción. Los rangos, plazos y protocolos que proponemos salen de esa obra local, no de un catálogo.',
    ],
    proyectosTitulo2: 'en el Valle',
    proyectosDescripcion:
      'Los proyectos de mayor tonelaje que hemos entregado en Cali, Jamundí, Yumbo, Palmira, El Cerrito y Villagorgona: retail, industria, transporte masivo y escenarios deportivos, fabricados en nuestra planta de Jamundí y montados con equipos propios.',
    faqTitulo1: 'Sobre construir',
    faqTitulo2: 'en Cali y el Valle',
    faq: [
      {
        pregunta: '¿MEISA tiene planta de fabricación cerca de Cali?',
        respuesta:
          'Sí. Nuestra planta principal está en Jamundí, en el área metropolitana de Cali, a menos de una hora de cualquier obra en la ciudad y sus alrededores. Contamos además con una segunda planta en Popayán. Esa cercanía reduce el costo de transporte de la estructura, permite despachos sincronizados con el cronograma de montaje y respuesta rápida del equipo técnico en obra: si algo debe ajustarse, la pieza vuelve a planta y regresa en horas, no en días.',
      },
      {
        pregunta: '¿Qué municipios del Valle del Cauca atienden?',
        respuesta:
          'Todo el departamento. Hemos entregado proyectos en Cali, Jamundí, Yumbo, Palmira, El Cerrito, Candelaria y Villagorgona, entre otros: más de 90 proyectos y 13.500 toneladas montadas en el Valle del Cauca. Desde Jamundí también atendemos el norte del Cauca (Santander de Quilichao, Villa Rica, Puerto Tejada) y, en general, cualquier región de Colombia.',
      },
      {
        pregunta: '¿Cuánto cuesta una estructura metálica en Cali?',
        respuesta:
          'Como rango orientativo de mercado: estructura liviana de bodegas y cubiertas entre $10.900 y $13.000 COP por kilogramo instalado, estructura media de edificios y entrepisos entre $13.000 y $17.000, y estructuras especiales o de grandes luces entre $17.000 y $25.000. Para obras en Cali y el área metropolitana la logística desde nuestra planta de Jamundí es mínima, lo que favorece el costo final. La cotización real se elabora sobre planos o anteproyecto.',
      },
      {
        pregunta:
          '¿Las estructuras cumplen la NSR-10 para zona de amenaza sísmica alta?',
        respuesta:
          'Sí. Cali y el Valle del Cauca están en zona de amenaza sísmica alta, y todas nuestras estructuras se diseñan bajo los Títulos A y F de la NSR-10 con los grados de disipación de energía que exige la zona. Entregamos memorias de cálculo firmadas por ingenieros matriculados, planos de taller, certificados de materiales y registros de soldadura bajo AWS D1.1 — la documentación que piden curadurías e interventorías. El menor peso del acero es además una ventaja de desempeño sísmico.',
      },
      {
        pregunta: '¿Qué proyectos han construido en Cali?',
        respuesta:
          'Entre los más representativos: la ampliación del Centro Comercial Único (1.800 toneladas), el Centro Comercial Bochalema Plaza (1.781 toneladas), la Terminal Intermedia del MIO en la Autopista Simón Bolívar (654 toneladas), el Coliseo Mundialista de Korfball de los Juegos Mundiales 2013 (216 toneladas) y el Edificio Parqueadero Tequendama (156 toneladas). En el resto del Valle: los edificios de Tecnoquímicas en Jamundí, el Complejo Industrial Piedechinche en El Cerrito (812 toneladas) y bodegas industriales en Yumbo y Palmira.',
      },
    ],
    relacionadas: [
      {
        href: '/soluciones/estructura-metalica-para-bodegas',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para bodegas',
        descripcion:
          'Bodegas y naves industriales para Yumbo, Palmira y los parques industriales del Valle: 72 proyectos entregados.',
      },
      {
        href: '/soluciones/estructura-metalica-centros-comerciales',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para centros comerciales',
        descripcion:
          'Ampliaciones sin cerrar la operación, como el Único y Bochalema Plaza en Cali: más de 14.600 toneladas en retail.',
      },
      {
        href: '/soluciones/edificios-en-estructura-metalica',
        eyebrow: 'Solución',
        titulo: 'Edificios en estructura metálica',
        descripcion:
          'Edificios corporativos, clínicos e industriales en acero, con sistemas sísmicos para zona de amenaza alta.',
      },
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'Rangos reales de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
      },
    ],
    ctaEyebrow: 'Construyamos en el Valle',
    ctaTitulo1: 'Su obra en Cali,',
    ctaTitulo2: 'nuestra planta al lado.',
    ctaDescripcion:
      'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica a obra en el área metropolitana de Cali.',
    terminosUbicacion: [
      'Cali',
      'Jamund',
      'Yumbo',
      'Palmira',
      'Villagorgona',
      'Cerrito',
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // BOGOTÁ D.C.
  // 'Bogot' cubre 'Bogotá' y 'Bogota'.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'bogota',
    nombre: 'Bogotá',
    h1: 'Estructuras metálicas en Bogotá',
    metaTitle: 'Estructuras Metálicas en Bogotá | Fabricación y Montaje | MEISA',
    metaDescription:
      'Estructuras metálicas en Bogotá: 11 proyectos y +2.600 toneladas montadas. Puentes urbanos, TransMilenio y retail. Fabricación propia y montaje NSR-10.',
    heroCategoriaKey: 'PUENTES',
    heroEyebrow: 'Cobertura nacional — Bogotá D.C.',
    heroTitulo1: 'Estructuras metálicas',
    heroTitulo2: 'en Bogotá',
    heroDescripcion:
      'Fabricamos en nuestras plantas propias del suroccidente colombiano y montamos en Bogotá con equipos propios: puentes urbanos, infraestructura de TransMilenio, equipamiento cultural y retail.',
    introEyebrow: '01 — Cobertura nacional',
    introTitulo1: 'Acero para',
    introTitulo2: 'la capital',
    intro: [
      'MEISA fabrica y monta estructuras metálicas en Bogotá desde sus plantas propias del suroccidente colombiano. En la capital hemos entregado 11 proyectos y más de 2.600 toneladas de acero estructural: la Cinemateca Distrital (490 toneladas), las estaciones de TransMilenio de las carreras 11 y 19 (424 toneladas), el Centro Comercial Paseo Villa del Río (420 toneladas), el Puente Vehicular La Floresta (398 toneladas) y el ciclopuente de la Calle 98 (381 toneladas), entre otros.',
      'El modelo es simple: fabricación con costos competitivos en nuestras plantas de Jamundí, Popayán y Villa Rica, ingeniería de despiece pensada desde el primer plano para el transporte por carretera, y montaje en Bogotá con personal propio certificado. Todo bajo la NSR-10 y con soldadura calificada AWS D1.1 — la misma documentación de cálculo, taller y calidad que exigen las curadurías y las interventorías de la capital.',
    ],
    statProyectosLabel: 'Proyectos en Bogotá D.C.',
    statToneladasLabel: 'Toneladas montadas en la capital',
    statsFijas: [
      { valor: '398', sufijo: '', label: 'Toneladas — Puente La Floresta' },
      { valor: '3', sufijo: '', label: 'Plantas de fabricación propias' },
    ],
    seccionesEyebrow: '02 — Sectores',
    seccionesTitulo1: 'Qué construimos',
    seccionesTitulo2: 'en Bogotá',
    secciones: [
      {
        nombre: 'Puentes vehiculares y peatonales urbanos',
        descripcion:
          'El Puente Vehicular La Floresta (398 toneladas) y la Estación Calle 19 con su puente peatonal sobre la Avenida Esperanza (273 toneladas), ejecutados para la infraestructura de TransMilenio: estructura montada sobre corredores viales en operación, con izajes nocturnos y cierres programados con la autoridad de tránsito.',
      },
      {
        nombre: 'Infraestructura de transporte masivo',
        descripcion:
          'Las estaciones de TransMilenio de las carreras 11 y 19 (424 toneladas): estructura urbana a la vista, fabricada por módulos y montada sin detener la operación del sistema. Experiencia directa en los protocolos de trabajo del transporte masivo bogotano.',
      },
      {
        nombre: 'Movilidad sostenible',
        descripcion:
          'El ciclopuente de la Calle 98 (381 toneladas), un paso elevado para bicicletas y peatones sobre una de las vías más transitadas del norte de Bogotá: geometría curva, luces importantes y montaje en plena malla vial arterial.',
      },
      {
        nombre: 'Equipamiento cultural y comercial',
        descripcion:
          'La estructura de la Cinemateca Distrital de Bogotá (490 toneladas), un edificio cultural insignia del centro de la ciudad, y el Centro Comercial Paseo Villa del Río (420 toneladas), con las grandes luces típicas del retail.',
      },
      {
        nombre: 'Retail en operación',
        descripcion:
          'Los locales Dollar City de Mazurén, Chapinero y Río Negro (más de 260 toneladas en conjunto), ejecutados dentro de la expansión nacional de la cadena: estructuras de adecuación comercial con plazos cortos y trabajo en edificaciones existentes.',
      },
      {
        nombre: 'Industria y reforzamiento estructural',
        descripcion:
          'Estructuras industriales como la Fábrica de Quesos Delvechio y el reforzamiento del Edificio Mira Tu Salud EPS: intervención de edificaciones existentes para llevarlas a los niveles de desempeño sísmico que exige la NSR-10.',
      },
    ],
    ventajaEyebrow: '03 — La ventaja del modelo',
    ventajaTitulo: 'Fabricar en el suroccidente, montar en Bogotá',
    ventaja: [
      'Fabricar la estructura en nuestras plantas del suroccidente y montarla en Bogotá no es una limitación: es la razón por la que nuestros precios compiten. Los costos de planta, mano de obra calificada y logística interna del suroccidente nos permiten ofrecer un kilogramo fabricado más competitivo, y el despiece se diseña desde la ingeniería de detalle para viajar: módulos dimensionados para tractomula estándar, piezas especiales con permisos de carga extradimensionada y despachos programados contra el plan de izajes, no contra el espacio de acopio disponible en obra.',
      'En Bogotá ya recorrimos la curva de aprendizaje que más cuesta: montar sobre corredores de TransMilenio en servicio, coordinar cierres viales nocturnos con las autoridades distritales y trabajar en el centro consolidado de la ciudad, como en la Cinemateca Distrital. El equipo de montaje es propio — no subcontratado —, certificado en trabajo en alturas, y permanece en obra hasta la entrega.',
    ],
    proyectosTitulo2: 'en Bogotá',
    proyectosDescripcion:
      'Los proyectos de mayor tonelaje que hemos entregado en Bogotá D.C.: puentes urbanos, infraestructura de TransMilenio, equipamiento cultural, centros comerciales y retail, fabricados en nuestras plantas del suroccidente y montados con equipos propios en la capital.',
    faqTitulo1: 'Sobre construir',
    faqTitulo2: 'en Bogotá',
    faq: [
      {
        pregunta: '¿MEISA atiende proyectos en Bogotá?',
        respuesta:
          'Sí. En Bogotá hemos entregado 11 proyectos y más de 2.600 toneladas de acero estructural, entre ellos la Cinemateca Distrital (490 toneladas), las estaciones de TransMilenio de las carreras 11 y 19 (424 toneladas), el Centro Comercial Paseo Villa del Río (420 toneladas), el Puente Vehicular La Floresta (398 toneladas) y el ciclopuente de la Calle 98 (381 toneladas). Fabricamos en nuestras plantas del suroccidente colombiano y montamos en la capital con personal propio certificado.',
      },
      {
        pregunta: '¿Cómo manejan el transporte de la estructura hasta Bogotá?',
        respuesta:
          'El transporte se resuelve desde la ingeniería de detalle, no al final: la estructura se despieza en módulos dimensionados para tractomula estándar y, cuando una pieza supera la norma, se tramitan los permisos de carga extradimensionada con sus escoltas. Los despachos salen de planta por frentes de montaje, sincronizados con el plan de izajes, de modo que la obra no necesita grandes áreas de acopio. Es el mismo esquema con el que hemos despachado estructura a todo el país, incluyendo proyectos tan remotos como Mitú.',
      },
      {
        pregunta: '¿Cuánto tarda un proyecto de estructura metálica en Bogotá?',
        respuesta:
          'La ventaja del acero es el paralelismo: mientras en obra avanza la cimentación, la estructura ya se está fabricando en planta. Cada despacho Cali–Bogotá toma del orden de dos a tres días y se programa contra el cronograma de montaje, por lo que el transporte no suma plazo si la logística se planifica bien. El plazo total depende del tonelaje y la complejidad del proyecto, y se fija por contrato en la cotización formal junto con el programa de despachos e izajes.',
      },
      {
        pregunta: '¿Cuánto cuesta una estructura metálica en Bogotá?',
        respuesta:
          'Como rango orientativo de mercado: estructura liviana de bodegas y cubiertas entre $10.900 y $13.000 COP por kilogramo instalado, estructura media de edificios y entrepisos entre $13.000 y $17.000, y estructuras especiales o de grandes luces — como puentes — entre $17.000 y $25.000. En Bogotá el flete pesa más que en una obra del suroccidente, pero se compensa con los costos competitivos de fabricación de nuestras plantas. La cotización real se elabora sobre planos o anteproyecto.',
      },
      {
        pregunta: '¿Hacen visita técnica en Bogotá?',
        respuesta:
          'Sí. Para proyectos en evaluación coordinamos visita técnica a obra en Bogotá y la sabana, y con los planos o el anteproyecto preparamos una cotización formal con peso estimado de acero, alcance, plazo y programa de despachos. Durante el montaje, el residente y el equipo técnico de MEISA permanecen en obra, y la dirección de proyecto mantiene comunicación directa con la planta para resolver cualquier ajuste de fabricación.',
      },
    ],
    relacionadas: [
      {
        href: '/soluciones/puentes-metalicos',
        eyebrow: 'Solución',
        titulo: 'Puentes metálicos',
        descripcion:
          'Puentes vehiculares y peatonales como La Floresta y el ciclopuente de la Calle 98: fabricación, transporte y montaje sobre vías en operación.',
      },
      {
        href: '/soluciones/estructura-metalica-centros-comerciales',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para centros comerciales',
        descripcion:
          'Grandes luces para retail, como el Paseo Villa del Río en Bogotá: más de 14.600 toneladas entregadas en proyectos comerciales.',
      },
      {
        href: '/soluciones/edificios-en-estructura-metalica',
        eyebrow: 'Solución',
        titulo: 'Edificios en estructura metálica',
        descripcion:
          'Edificios y reforzamientos estructurales en acero con los sistemas sísmicos que exige la NSR-10.',
      },
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'Rangos reales de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
      },
    ],
    ctaEyebrow: 'Construyamos en Bogotá',
    ctaTitulo1: 'Su obra en Bogotá,',
    ctaTitulo2: 'nuestro acero en camino.',
    ctaDescripcion:
      'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance, plazo y programa de despachos — con visita técnica a obra en Bogotá y la sabana.',
    terminosUbicacion: ['Bogot'],
  },

  // ──────────────────────────────────────────────────────────────────────
  // POPAYÁN / CAUCA
  // 'Popay' cubre 'Popayán', 'Popayan' y 'Popayán-Cauca'.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'popayan',
    nombre: 'Popayán',
    h1: 'Estructuras metálicas en Popayán',
    metaTitle: 'Estructuras Metálicas en Popayán y el Cauca | MEISA',
    metaDescription:
      'Estructuras metálicas en Popayán: +40 proyectos y 4.000 toneladas. Planta propia, CC Campanario y Juegos Nacionales 2012. Fabricación y montaje NSR-10.',
    heroCategoriaKey: 'DEPORTES_EDUCACION',
    heroEyebrow: 'Sede histórica — Popayán, Cauca',
    heroTitulo1: 'Estructuras metálicas',
    heroTitulo2: 'en Popayán',
    heroDescripcion:
      'MEISA nació en Popayán en 1996 y conserva planta de fabricación propia en la ciudad. Más de 40 proyectos entregados: del Centro Comercial Campanario a los escenarios de los Juegos Nacionales 2012.',
    introEyebrow: '01 — Sede histórica',
    introTitulo1: 'Nacimos',
    introTitulo2: 'en Popayán',
    intro: [
      'MEISA fue fundada en Popayán en 1996 y aquí está buena parte de su historia: la planta de fabricación con la que empezamos sigue operando en la ciudad, y en Popayán hemos entregado más de 40 proyectos y 4.000 toneladas de acero estructural. Construimos el Centro Comercial Campanario y su ampliación — el proyecto comercial más grande del Cauca, con cerca de 2.900 toneladas entre las dos fases — y los escenarios de los Juegos Nacionales 2012: el Coliseo de Fútbol Sala, el Coliseo de Artes Marciales y el Complejo Acuático.',
      'Somos la empresa de estructuras metálicas del Cauca: con plantas en Popayán y Villa Rica, atendemos la ciudad y todo el departamento con ingeniería de detalle propia, fabricación con corte CNC y soldadura calificada AWS D1.1, y montaje con personal propio certificado, bajo la NSR-10 para zona de amenaza sísmica alta.',
    ],
    statProyectosLabel: 'Proyectos en Popayán',
    statToneladasLabel: 'Toneladas montadas en la ciudad',
    statsFijas: [
      { valor: '1', sufijo: '', label: 'Planta propia en Popayán' },
      { valor: '1996', sufijo: '', label: 'Fundada en Popayán en' },
    ],
    seccionesEyebrow: '02 — Sectores',
    seccionesTitulo1: 'Qué construimos',
    seccionesTitulo2: 'en Popayán y el Cauca',
    secciones: [
      {
        nombre: 'Centros comerciales',
        descripcion:
          'El Centro Comercial Campanario es obra nuestra en sus dos fases: la estructura original (470 toneladas) y la gran ampliación (2.455 toneladas), el proyecto comercial más grande del Cauca. También montamos el Centro Comercial Monserrat (212 toneladas) y locales de retail en la ciudad.',
      },
      {
        nombre: 'Escenarios de los Juegos Nacionales 2012',
        descripcion:
          'Para los Juegos Nacionales de 2012 fabricamos y montamos los escenarios de competencia de Popayán: el Coliseo de Fútbol Sala (268 toneladas y 6.133 m²), el Coliseo de Artes Marciales (196 toneladas) y el Complejo Acuático (135 toneladas) — cubiertas de gran luz con plazos de entrega inamovibles.',
      },
      {
        nombre: 'Coliseos y equipamiento comunitario',
        descripcion:
          'La infraestructura deportiva de barrio también es nuestra: 10 coliseos barriales en Popayán (8.650 m² de cubierta), 7 coliseos polideportivos en municipios del Cauca y 5 coliseos del programa Plan Colombia — el deporte comunitario del departamento se juega bajo acero de MEISA.',
      },
      {
        nombre: 'Edificaciones institucionales',
        descripcion:
          'El Edificio Administrativo del Cuerpo de Bomberos de Popayán (92 toneladas), el dispensario del Batallón del Ejército y estructuras para vivienda como el Conjunto Residencial Campo Real: edificación pública y privada con entrepisos metálicos y sistemas para amenaza sísmica alta.',
      },
      {
        nombre: 'Puentes e infraestructura urbana',
        descripcion:
          'El Puente Peatonal del Terminal de Transportes (57 toneladas) y la cubierta del muelle de embarque del mismo terminal (28 toneladas), además de pasarelas y cubiertas urbanas: estructura a la vista que hace parte del paisaje cotidiano de la ciudad.',
      },
      {
        nombre: 'Industria del Cauca',
        descripcion:
          'Desde las plantas de Popayán y Villa Rica fabricamos para la industria de todo el departamento, incluido el norte del Cauca: bodegas, naves y centros de distribución como el complejo de Tecnosur en Villa Rica (840 toneladas), a una llamada de distancia de cualquier obra caucana.',
      },
    ],
    ventajaEyebrow: '03 — La ventaja local',
    ventajaTitulo: 'La empresa de estructuras metálicas del Cauca',
    ventaja: [
      'En Popayán no somos un proveedor que viene de fuera: somos una empresa payanesa. Aquí nació MEISA en 1996, aquí está nuestra planta original y aquí vive parte de nuestro equipo técnico. Eso se traduce en logística mínima — la estructura se fabrica a minutos de la obra —, en respuesta inmediata cuando algo debe ajustarse en taller y en un conocimiento de primera mano de los suelos, el clima y la sismicidad de la meseta de Popayán, una de las zonas de amenaza sísmica alta del país.',
      'La obra entregada lo respalda: cuando la ciudad fue sede de los Juegos Nacionales 2012, los escenarios de competencia se construyeron con acero fabricado en Popayán; cuando Campanario se convirtió en el centro comercial más grande del Cauca, su estructura — las dos fases — salió de nuestra planta. Tres décadas después seguimos fabricando aquí para el Cauca y para todo el suroccidente colombiano.',
    ],
    proyectosTitulo2: 'en Popayán',
    proyectosDescripcion:
      'Los proyectos de mayor tonelaje que hemos entregado en Popayán: el Centro Comercial Campanario y su ampliación, los escenarios de los Juegos Nacionales 2012, edificaciones institucionales e infraestructura urbana, fabricados en nuestra planta de la ciudad.',
    faqTitulo1: 'Sobre construir',
    faqTitulo2: 'en Popayán',
    faq: [
      {
        pregunta: '¿MEISA tiene planta de fabricación en Popayán?',
        respuesta:
          'Sí. MEISA fue fundada en Popayán en 1996 y la planta con la que comenzó sigue operando en la ciudad. Contamos además con la planta principal en Jamundí (Valle del Cauca) y una tercera en Villa Rica (norte del Cauca). Para una obra en Popayán eso significa fabricación a minutos del sitio, fletes mínimos, despachos sincronizados con el montaje y un equipo técnico local que responde el mismo día.',
      },
      {
        pregunta: '¿Qué proyectos han construido en Popayán?',
        respuesta:
          'Más de 40 proyectos y 4.000 toneladas en la ciudad. Los más representativos: el Centro Comercial Campanario y su ampliación (cerca de 2.900 toneladas entre las dos fases), los escenarios de los Juegos Nacionales 2012 — Coliseo de Fútbol Sala (268 toneladas), Coliseo de Artes Marciales (196 toneladas) y Complejo Acuático (135 toneladas) —, el Centro Comercial Monserrat (212 toneladas), el Edificio Administrativo de Bomberos (92 toneladas), el Puente Peatonal del Terminal de Transportes y 10 coliseos barriales con 8.650 m² de cubierta.',
      },
      {
        pregunta: '¿Atienden municipios del Cauca fuera de Popayán?',
        respuesta:
          'Sí, todo el departamento. Hemos construido coliseos polideportivos en 7 municipios del Cauca, 5 coliseos del programa Plan Colombia y proyectos industriales en el norte del departamento — como el complejo de Tecnosur en Villa Rica (840 toneladas) y plantas en Santander de Quilichao, Villa Rica, Puerto Tejada y Caloto —, atendidos desde nuestras plantas de Popayán y Villa Rica.',
      },
      {
        pregunta: '¿Cuánto cuesta una estructura metálica en Popayán?',
        respuesta:
          'Como rango orientativo de mercado: estructura liviana de bodegas y cubiertas entre $10.900 y $13.000 COP por kilogramo instalado, estructura media de edificios y entrepisos entre $13.000 y $17.000, y estructuras especiales o de grandes luces entre $17.000 y $25.000. Para obras en Popayán la fabricación es local, así que el flete prácticamente desaparece del costo — una ventaja directa frente a estructuras fabricadas en otras ciudades. La cotización real se elabora sobre planos o anteproyecto.',
      },
      {
        pregunta:
          '¿Las estructuras cumplen la NSR-10 para la sismicidad de Popayán?',
        respuesta:
          'Sí. Popayán está en zona de amenaza sísmica alta y su historia lo recuerda: por eso todas nuestras estructuras se diseñan bajo los Títulos A y F de la NSR-10, con los grados de disipación de energía que exige la zona. Entregamos memorias de cálculo firmadas por ingenieros matriculados, planos de taller, certificados de materiales y registros de soldadura bajo AWS D1.1. El menor peso del acero frente al concreto es, además, una ventaja real de desempeño sísmico.',
      },
    ],
    relacionadas: [
      {
        href: '/soluciones/estructura-metalica-escenarios-deportivos',
        eyebrow: 'Solución',
        titulo: 'Escenarios deportivos en estructura metálica',
        descripcion:
          'Coliseos y cubiertas de competencia como los de los Juegos Nacionales 2012: 28 proyectos deportivos y educativos en el país.',
      },
      {
        href: '/soluciones/estructura-metalica-centros-comerciales',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para centros comerciales',
        descripcion:
          'Proyectos como el Campanario y su ampliación en Popayán: más de 14.600 toneladas entregadas en retail.',
      },
      {
        href: '/soluciones/cubiertas-metalicas',
        eyebrow: 'Solución',
        titulo: 'Cubiertas metálicas',
        descripcion:
          'Cerchas, arcos y cubiertas autoportantes para coliseos, instituciones y espacio público en el Cauca.',
      },
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'Rangos reales de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
      },
    ],
    ctaEyebrow: 'Construyamos en Popayán',
    ctaTitulo1: 'Su obra en Popayán,',
    ctaTitulo2: 'nuestra casa desde 1996.',
    ctaDescripcion:
      'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica a obra en Popayán y cualquier municipio del Cauca.',
    terminosUbicacion: ['Popay'],
  },
]

export function getCiudad(slug: string): CiudadConfig | undefined {
  return CIUDADES.find((c) => c.slug === slug)
}

export function getCiudadSlugs(): string[] {
  return CIUDADES.map((c) => c.slug)
}
