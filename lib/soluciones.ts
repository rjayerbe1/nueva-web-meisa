// Configuración tipada de las landings SEO /soluciones/[slug].
//
// ⚠ El contenido EDITABLE vive en la DB (tabla landings_seo, tipo SOLUCION,
// editor en /admin/landings) y se lee vía lib/content/landings.ts
// (getSolucionDb). Este archivo es la fuente de FALLBACK: se usa si la fila
// no existe, está inactiva o su Json no valida. Los types de abajo son el
// contrato del Json `contenido`.
//
// Los datos dinámicos (cover de categoría, aggregates, proyectos top) se
// consultan en runtime desde Prisma usando categoriaEnum / categoriaSlug.
import type { CategoriaEnum } from '@prisma/client'

export interface SolucionSeccion {
  titulo: string
  parrafos: string[]
  bullets?: string[]
}

export interface TipoEstructura {
  nombre: string
  descripcion: string
}

export interface PasoProceso {
  titulo: string
  descripcion: string
}

export interface FaqItem {
  pregunta: string
  respuesta: string
}

export interface StatPropio {
  valor: string
  label: string
}

export interface Solucion {
  slug: string
  /** Keyword principal — se usa como H1 (heroTitulo1 + heroTitulo2 lo componen). */
  keywordH1: string
  metaTitle: string
  metaDescription: string
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  /** Imagen de portada del hero. Si no se define, se usa imagenCover de la categoría. */
  heroImagen?: string
  /** Lead paragraph de la intro (Patrón A). */
  intro: string
  secciones: SolucionSeccion[]
  /** Lista citable (AI Overviews): nombre + descripción por tipología. */
  tiposDeEstructura: TipoEstructura[]
  ventajas: string[]
  /** 4 pasos: diseño BIM → fabricación CNC/AWS → logística → montaje. */
  procesoResumen: PasoProceso[]
  faq: FaqItem[]
  /** Párrafo que abre la sección "Proyectos que nos respaldan" (proyectos insignia). */
  proyectosIntro: string
  /** Para queries de Prisma (cover de categoría, aggregates, top proyectos). */
  categoriaEnum: CategoriaEnum
  /** Para links a /proyectos/categoria/[slug]. */
  categoriaSlug: string
  /** Stats que no salen de la DB (ciudades, años). Los de proyectos/toneladas se calculan en runtime. */
  statsPropios: StatPropio[]
}

export const SOLUCIONES: Solucion[] = [
  {
    slug: 'estructura-metalica-para-bodegas',
    keywordH1: 'Estructura metálica para bodegas y naves industriales',
    metaTitle:
      'Estructura Metálica para Bodegas y Naves Industriales — Fabricación y Montaje | MEISA',
    metaDescription:
      'Diseño, fabricación y montaje de estructuras metálicas para bodegas, naves industriales y centros de distribución en Colombia. 72 proyectos, +6.200 toneladas y +109.000 m² construidos desde 1996. Cotice con MEISA.',
    heroEyebrow: 'Soluciones',
    heroTitulo1: 'Estructura metálica',
    heroTitulo2: 'para bodegas y naves industriales',
    intro:
      'MEISA diseña, fabrica y monta estructuras metálicas para bodegas, naves industriales y centros de distribución en toda Colombia. Desde 1996 hemos entregado 72 proyectos industriales — más de 6.200 toneladas de acero y 109.000 m² construidos en 26 ciudades — con ingeniería propia, fabricación CNC en nuestras plantas y montaje certificado. Trabajamos con industriales, operadores logísticos y constructores que necesitan grandes luces libres, plazos cortos y una estructura que cumpla la NSR-10 sin sorpresas en obra.',
    secciones: [
      {
        titulo: 'Por qué construir su bodega en acero',
        parrafos: [
          'Una bodega es, ante todo, área operativa: cada columna intermedia que se elimina son metros cuadrados de almacenamiento, circulación de montacargas o líneas de producción que se ganan. La estructura metálica permite cubrir luces de 20, 30 o más de 40 metros sin apoyos intermedios, algo que en concreto resulta antieconómico o directamente inviable.',
          'Además, el acero se fabrica en planta mientras en obra avanza la cimentación. Esa simultaneidad — imposible con sistemas vaciados en sitio — reduce el plazo total del proyecto y adelanta la fecha en que la bodega empieza a operar y a producir ingresos. La estructura llega a obra codificada pieza por pieza y se monta con grúas en semanas, no en meses.',
        ],
      },
      {
        titulo: 'Capacidad de planta y cobertura nacional',
        parrafos: [
          'Fabricamos en plantas propias con corte CNC, equipos de soldadura calificados bajo AWS D1.1 y control dimensional sobre cada conjunto. Esa capacidad instalada nos permite atender desde una bodega de 500 m² hasta complejos industriales de más de 1.000 toneladas, con despachos coordinados a cualquier región del país.',
          'Hemos montado estructura industrial en 26 ciudades de Colombia — del Valle del Cauca y el Cauca al eje cafetero, la costa y el suroccidente — con personal propio certificado para trabajo en alturas y equipos de izaje adecuados a cada sitio.',
        ],
        bullets: [
          'Ingeniería de detalle y modelado BIM propios',
          'Corte CNC y soldadores calificados AWS D1.1',
          'Pintura y sistemas de protección anticorrosiva en planta',
          'Montaje con personal certificado y equipos de izaje propios',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Pórticos rígidos a dos aguas',
        descripcion:
          'El sistema más eficiente para bodegas de 15 a 40 m de luz libre. Columnas y vigas de alma llena o perfiles armados que optimizan el peso de acero por metro cuadrado y permiten alturas libres a la medida de estanterías y puentes grúa.',
      },
      {
        nombre: 'Cerchas y celosías para grandes luces',
        descripcion:
          'Para luces superiores a 40 m o cargas de cubierta exigentes. Las celosías distribuyen el material donde trabaja, logrando estructuras livianas que cubren naves completas sin columnas intermedias.',
      },
      {
        nombre: 'Entrepisos y mezzanines metálicos',
        descripcion:
          'Duplican el área útil de una bodega existente o nueva con sistemas de viguetas y lámina colaborante. Se diseñan para cargas de almacenamiento, oficinas técnicas o áreas de picking.',
      },
      {
        nombre: 'Cubiertas autoportantes',
        descripcion:
          'Cubiertas curvas que trabajan como estructura y teja a la vez, eliminando correas y estructura secundaria. Solución rápida y económica para luces medias.',
      },
      {
        nombre: 'Ampliaciones sobre estructuras existentes',
        descripcion:
          'Refuerzo, sobreelevación o extensión de naves en operación. Se ingenian con levantamiento de lo construido y secuencias de montaje que minimizan la interrupción de la actividad industrial.',
      },
    ],
    ventajas: [
      'Plazos de obra significativamente menores: fabricación en planta simultánea con la cimentación',
      'Luces libres de 20 a más de 40 m sin columnas intermedias',
      'Menor peso propio que el concreto: cimentaciones más sencillas y económicas',
      'Estructura ampliable, modificable y desmontable a futuro',
      'Calidad controlada en planta: soldadura calificada y control dimensional pieza a pieza',
      'Comportamiento sísmico confiable diseñado bajo la NSR-10 (Título F)',
    ],
    procesoResumen: [
      {
        titulo: 'Diseño e ingeniería BIM',
        descripcion:
          'Modelamos la estructura completa en 3D: análisis estructural, diseño de conexiones y planos de taller pieza por pieza. El modelo BIM elimina interferencias antes de cortar el primer perfil.',
      },
      {
        titulo: 'Fabricación CNC y soldadura calificada',
        descripcion:
          'Corte y perforación CNC directamente desde el modelo, ensamble y soldadura con procedimientos y soldadores calificados bajo AWS D1.1, y control dimensional de cada conjunto antes de pintura.',
      },
      {
        titulo: 'Logística y transporte',
        descripcion:
          'Cada pieza sale de planta codificada y embalada según la secuencia de montaje. Coordinamos despachos a obra en cualquier región del país desde nuestras plantas.',
      },
      {
        titulo: 'Montaje certificado',
        descripcion:
          'Montaje con grúas y personal propio certificado para trabajo en alturas, bajo plan de izaje y protocolo de seguridad. Entregamos con dossier de calidad y planos as-built.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta una bodega en estructura metálica en Colombia?',
        respuesta:
          'El precio de una estructura metálica se cotiza por kilogramo de acero fabricado y montado, no por metro cuadrado. Como referencia orientativa del mercado colombiano en 2026, una estructura liviana de bodega se ubica entre $10.900 y $13.000 COP por kg instalado (incluye fabricación, pintura y montaje; excluye cimentación, cubierta y acabados). Una bodega típica consume entre 25 y 45 kg de acero por m², según la luz libre y las cargas. El valor final depende de la luz, la altura, el acabado y el sitio de la obra: toda cotización formal se hace sobre planos o anteproyecto.',
      },
      {
        pregunta: '¿Cuánto se demora construir una bodega en estructura metálica?',
        respuesta:
          'Depende del tonelaje y la complejidad, pero como orden de magnitud: la ingeniería de detalle toma de 3 a 6 semanas, la fabricación de una bodega mediana entre 6 y 10 semanas, y el montaje entre 3 y 8 semanas. Como la fabricación en planta avanza en paralelo con la cimentación en obra, el plazo total suele ser bastante menor que el de un sistema equivalente en concreto.',
      },
      {
        pregunta: '¿Qué luces libres se logran sin columnas intermedias?',
        respuesta:
          'Con pórticos rígidos a dos aguas se cubren de manera eficiente luces de 15 a 40 m. Para luces mayores — naves de 40, 50 o más metros — se usan cerchas y celosías, que mantienen la estructura liviana aun en grandes dimensiones. La luz óptima se define en el diseño según el uso de la bodega, las cargas de cubierta y los equipos (puentes grúa, paneles solares, redes contra incendio).',
      },
      {
        pregunta: '¿La estructura cumple la norma sismo resistente NSR-10?',
        respuesta:
          'Sí. Todas nuestras estructuras se diseñan bajo el Título F de la NSR-10 (estructuras metálicas), con memorias de cálculo firmadas por ingenieros con matrícula profesional. La soldadura se ejecuta con procedimientos y soldadores calificados bajo AWS D1.1 y los materiales cuentan con certificados de calidad trazables.',
      },
      {
        pregunta: '¿MEISA hace el diseño o solo la fabricación y el montaje?',
        respuesta:
          'Hacemos el ciclo completo: diseño estructural e ingeniería de detalle, fabricación en plantas propias y montaje con personal certificado. También fabricamos y montamos sobre ingeniería suministrada por el cliente, en cuyo caso desarrollamos los planos de taller y despiece a partir de sus planos de diseño.',
      },
    ],
    proyectosIntro:
      'Detrás de cada rango y cada plazo hay obra entregada: el Centro de Distribución Tecnosur en Villa Rica (840 toneladas), el Complejo Industrial Piedechinche (812 toneladas), los edificios de Tecnoquímicas en Jamundí (más de 1.100 toneladas entre dos edificios) y la Bodega de Semisólidos Tecnofar (612 toneladas), entre 72 proyectos industriales ejecutados en todo el país.',
    categoriaEnum: 'INDUSTRIAL',
    categoriaSlug: 'industrial',
    statsPropios: [
      { valor: '26', label: 'Ciudades de Colombia' },
      { valor: '30', label: 'Años de experiencia' },
    ],
  },
  {
    slug: 'puentes-metalicos',
    keywordH1: 'Puentes metálicos vehiculares y peatonales',
    metaTitle:
      'Puentes Metálicos Vehiculares y Peatonales — Diseño, Fabricación y Montaje | MEISA',
    metaDescription:
      'Diseño, fabricación y montaje de puentes metálicos vehiculares y peatonales en Colombia. 46 puentes y +4.600 toneladas de acero en 21 ciudades, bajo CCP-14 y NSR-10. Cotice con MEISA.',
    heroEyebrow: 'Soluciones',
    heroTitulo1: 'Puentes metálicos',
    heroTitulo2: 'vehiculares y peatonales',
    intro:
      'MEISA diseña, fabrica y monta puentes metálicos vehiculares y peatonales en toda Colombia: 46 puentes y más de 4.600 toneladas de acero estructural instaladas en 21 ciudades. Trabajamos con concesiones viales, entes territoriales, consorcios y constructores en puentes de viga, cajón, celosía y arco, bajo la norma colombiana de diseño de puentes CCP-14 y los requisitos de INVIAS — incluyendo montajes en zonas de topografía difícil donde el acero es la única solución práctica.',
    secciones: [
      {
        titulo: 'Acero para salvar luces donde el concreto no llega',
        parrafos: [
          'Un puente metálico se fabrica completo en planta — con control dimensional, soldadura calificada y protección anticorrosiva aplicada en condiciones controladas — y llega a obra listo para izarse o lanzarse. Eso cambia la ecuación del proyecto: menos tiempo sobre la vía, menos interrupción del tráfico y menos exposición a los riesgos de fundir grandes volúmenes de concreto sobre cauces o cañones.',
          'El menor peso propio del acero también reduce las cargas sobre estribos y pilas, lo que se traduce en cimentaciones más sencillas. En luces medias y grandes, o en sitios de difícil acceso, esa combinación de prefabricación, peso y velocidad hace del puente metálico la alternativa más competitiva.',
        ],
      },
      {
        titulo: 'Experiencia en infraestructura vial colombiana',
        parrafos: [
          'Hemos entregado puentes para corredores nacionales, vías departamentales y sistemas de transporte masivo urbano — incluidos puentes del sistema MIO en Cali. Conocemos los requisitos de interventoría, los protocolos de INVIAS y las realidades logísticas de montar acero en cordillera: vías estrechas, cauces crecidos y ventanas de cierre de tráfico limitadas.',
          'Cada puente se entrega con su dossier de calidad completo: certificados de materiales, registros de soldadura e inspección, protocolos de pintura y planos as-built.',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Puentes de vigas de alma llena',
        descripcion:
          'Vigas armadas tipo I de gran altura para luces cortas y medias. Fabricación eficiente, montaje rápido por izaje directo y mantenimiento sencillo. La tipología más común en pasos vehiculares.',
      },
      {
        nombre: 'Puentes de viga cajón',
        descripcion:
          'Secciones cerradas de alta rigidez torsional, ideales para puentes curvos, luces medias-largas y pasos urbanos elevados. Excelente comportamiento aerodinámico y estético.',
      },
      {
        nombre: 'Puentes en celosía',
        descripcion:
          'Estructuras trianguladas que maximizan la luz con el mínimo peso de acero. Adecuados para grandes luces sobre ríos y cañones, y para montaje por lanzamiento o volados sucesivos.',
      },
      {
        nombre: 'Puentes en arco',
        descripcion:
          'El arco trabaja a compresión y permite salvar luces importantes con gran presencia visual. Usados en cruces emblemáticos donde la estética del puente hace parte del proyecto.',
      },
      {
        nombre: 'Puentes peatonales y ciclopuentes urbanos',
        descripcion:
          'Pasos elevados livianos para peatones y bicicletas, con rampas, escaleras y barandas integradas. Se montan en jornadas nocturnas cortas minimizando el cierre de vías urbanas.',
      },
    ],
    ventajas: [
      'Prefabricación completa en planta con calidad controlada',
      'Montaje rápido por izaje o lanzamiento: mínima interrupción del tráfico',
      'Menor peso propio: cimentaciones y subestructura más económicas',
      'Viabilidad en zonas de difícil acceso y topografía compleja',
      'Durabilidad con sistemas de protección anticorrosiva especificados por ambiente',
      'Diseño bajo CCP-14, requisitos INVIAS y soldadura AWS',
    ],
    procesoResumen: [
      {
        titulo: 'Diseño e ingeniería BIM',
        descripcion:
          'Modelado 3D del puente completo: análisis estructural bajo CCP-14, diseño de conexiones, contraflechas de fabricación y planos de taller. Ingeniería de montaje desde la etapa de diseño.',
      },
      {
        titulo: 'Fabricación CNC y soldadura calificada',
        descripcion:
          'Corte CNC de almas y aletas, armado y soldadura con procedimientos calificados AWS, ensayos no destructivos sobre juntas críticas y preensamble dimensional en planta antes del despacho.',
      },
      {
        titulo: 'Logística y transporte',
        descripcion:
          'Planeación de despachos por tramos según capacidad vial, permisos de carga extradimensionada y secuencia de montaje. Las piezas llegan a obra codificadas y listas para ensamblar.',
      },
      {
        titulo: 'Montaje especializado',
        descripcion:
          'Izaje con grúas, lanzamiento incremental o volados según el sitio. Personal certificado, plan de izaje aprobado por interventoría y entrega con dossier de calidad y as-built.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta un puente metálico por kilogramo en Colombia?',
        respuesta:
          'Los puentes se cotizan por kilogramo de acero fabricado y montado. Como rango orientativo del mercado colombiano en 2026, la estructura especial de puentes se ubica entre $17.000 y $25.000 COP por kg instalado, incluyendo fabricación, protección anticorrosiva y montaje. El valor depende de la tipología (viga, cajón, celosía, arco), la luz, los ensayos no destructivos exigidos, la logística de transporte y el método de montaje. Cada puente se cotiza sobre planos o prediseño.',
      },
      {
        pregunta: '¿Cuánto tarda fabricar y montar un puente metálico?',
        respuesta:
          'Como orden de magnitud, un puente vehicular de luz media toma de 4 a 8 semanas de ingeniería de detalle, de 10 a 20 semanas de fabricación según el tonelaje, y de 2 a 8 semanas de montaje según el método (izaje directo o lanzamiento). La fabricación avanza en paralelo con la construcción de estribos y pilas, por lo que el acero rara vez es la ruta crítica del proyecto.',
      },
      {
        pregunta: '¿Qué ventajas tiene un puente metálico frente a uno de concreto?',
        respuesta:
          'Tres principales: velocidad — la superestructura se fabrica en planta mientras se construye la subestructura y se monta en días o semanas; peso — el acero pesa menos, lo que reduce el costo de pilas, estribos y cimentación; y viabilidad en sitios difíciles — donde no es práctico instalar cimbras o fundir grandes volúmenes de concreto sobre un cauce o cañón, el puente metálico se lanza o se iza por tramos. En luces medias y grandes el costo total de obra suele favorecer al acero.',
      },
      {
        pregunta: '¿Bajo qué normas se diseñan y fabrican los puentes?',
        respuesta:
          'El diseño estructural se hace bajo la Norma Colombiana de Diseño de Puentes CCP-14 (basada en AASHTO LRFD) y los requisitos de INVIAS o de la entidad contratante. La fabricación y soldadura siguen los códigos AWS con procedimientos y soldadores calificados, ensayos no destructivos sobre juntas críticas y materiales con certificados de calidad trazables. Donde aplica, se complementa con la NSR-10.',
      },
      {
        pregunta: '¿Pueden montar puentes en zonas de difícil acceso?',
        respuesta:
          'Sí — es uno de los escenarios donde más valor agrega el acero. Diseñamos la ingeniería de montaje según el sitio: división del puente en tramos transportables por vías restringidas, lanzamiento incremental cuando no hay espacio para grúas, o izajes nocturnos coordinados con cierres viales cortos. Buena parte de nuestros 46 puentes están en zonas de montaña del suroccidente colombiano.',
      },
    ],
    proyectosIntro:
      'Nuestra experiencia está montada sobre vías reales: el Puente Vehicular Cascada (537 toneladas, Cauca), el Puente Vehicular Ovejas (535 toneladas), el Puente de la Carrera 100 en Cali (444 toneladas), el Puente La Floresta en Bogotá (398 toneladas), el Puente Arco Saraconcho (357 toneladas) y los puentes del sistema MIO en Cali, entre 46 puentes entregados en el país.',
    categoriaEnum: 'PUENTES',
    categoriaSlug: 'puentes',
    statsPropios: [
      { valor: '21', label: 'Ciudades de Colombia' },
      { valor: '30', label: 'Años de experiencia' },
    ],
  },
  {
    slug: 'cubiertas-metalicas',
    keywordH1: 'Cubiertas metálicas para grandes luces',
    metaTitle:
      'Cubiertas Metálicas para Grandes Luces | Diseño, Fabricación y Montaje — MEISA',
    metaDescription:
      'Cubiertas metálicas para coliseos, colegios e industria: cerchas, arcos y autoportantes. 57.000 m² instalados desde 1996. Diseño, fabricación y montaje NSR-10.',
    heroEyebrow: 'Soluciones — Estructuras metálicas para techos',
    heroTitulo1: 'Cubiertas metálicas',
    heroTitulo2: 'para grandes luces',
    intro:
      'Una cubierta metálica bien diseñada cubre 30, 40 o más de 50 metros sin columnas intermedias, pesa una fracción de lo que pesaría en concreto y se monta en semanas. MEISA diseña, fabrica y monta cubiertas metálicas desde 1996, con más de 57.000 m² instalados en coliseos, colegios, plantas industriales y espacios urbanos del suroccidente colombiano. Todo el proceso —ingeniería estructural, fabricación en plantas propias en Jamundí y Popayán, y montaje certificado— se ejecuta bajo un solo responsable, con cumplimiento pleno de la norma NSR-10.',
    secciones: [
      {
        titulo: 'Por qué acero para cubrir grandes luces',
        parrafos: [
          'Cuando un proyecto exige espacios libres de columnas —una cancha reglamentaria, una nave de producción, un patio escolar techado— el acero estructural es la solución más eficiente. Su relación resistencia-peso permite salvar luces de 20 a 60 metros con estructuras livianas que reducen la carga sobre cimentaciones y muros, algo crítico en zonas de amenaza sísmica alta como el Valle del Cauca y el Cauca.',
          'La fabricación en taller es la otra ventaja decisiva: cerchas, arcos y correas se cortan, sueldan y pintan en planta bajo control de calidad, y llegan a obra listos para izaje. Eso se traduce en plazos de montaje de semanas —no meses—, menos trabajo en altura y obras que pueden avanzar incluso con la edificación en uso parcial, como ocurre con frecuencia en colegios y plantas en operación.',
        ],
      },
      {
        titulo: 'Cubiertas para coliseos, colegios, industria y espacio urbano',
        parrafos: [
          'La mayor parte de los 57.000 m² de cubierta que MEISA ha instalado está en escenarios deportivos y educativos: coliseos para los Juegos Nacionales de Popayán 2012 y los Juegos Mundiales de Cali 2013, programas de coliseos municipales en el Cauca y canchas cubiertas para colegios y universidades. Son proyectos donde la luz libre no es negociable: una cancha múltiple exige mínimo 32 × 19 metros sin apoyos, más zonas de graderías.',
          'Pero la misma ingeniería aplica a otros sectores. En industria, MEISA fabrica cubiertas para naves de producción, bodegas y centros logísticos donde la estructura debe soportar además puentes grúa, ductos y equipos suspendidos. Y en infraestructura urbana, las cubiertas se vuelven arquitectura: pérgolas, plazoletas techadas y módulos para espacio público donde la estructura queda a la vista y el acabado importa tanto como el cálculo.',
        ],
        bullets: [
          'Deportivo y educativo: coliseos, canchas cubiertas, patios escolares y escenarios multipropósito — la categoría con más metros instalados por MEISA, con 28 proyectos y más de 57.000 m²',
          'Industrial: naves de producción, bodegas y centros logísticos con cubiertas que integran cargas de puente grúa, equipos y redes técnicas',
          'Comercial e institucional: cubiertas arquitectónicas para centros comerciales, terminales y edificios públicos, con geometrías curvas o inclinadas y estructura expuesta',
          'Espacio público: pérgolas, plazas cubiertas y mobiliario urbano estructural, diseñados para durabilidad a la intemperie y bajo mantenimiento',
        ],
      },
      {
        titulo: 'Ingeniería, fabricación y montaje bajo un solo responsable',
        parrafos: [
          'MEISA modela cada cubierta en 3D y calcula la estructura según los títulos A y F de la NSR-10, considerando cargas de viento, sismo, granizo, ceniza volcánica donde aplica y cargas colgadas de iluminación o sonido. El modelo de ingeniería alimenta directamente las máquinas de corte CNC en planta, lo que elimina errores de interpretación entre el plano y el taller.',
          'Con dos plantas de fabricación —Jamundí (Valle del Cauca) y Popayán (Cauca)— y equipos de montaje propios, la empresa controla la trazabilidad completa: desde la certificación de la lámina y el perfil hasta el torque de los pernos en obra. Para el cliente eso significa un solo contrato, un solo cronograma y un solo responsable de que la cubierta cumpla lo calculado.',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Cerchas y celosías',
        descripcion:
          'La solución clásica para luces de 15 a 40 metros: estructuras trianguladas en perfil tubular o ángulo que optimizan el acero y permiten pasar redes eléctricas e hidráulicas por el alma. Ideales para colegios, bodegas y naves industriales con cubierta a dos aguas o monopendiente.',
      },
      {
        nombre: 'Arcos metálicos',
        descripcion:
          'Para coliseos y escenarios que exigen 30 a 60 metros libres con altura interior generosa. El arco trabaja principalmente a compresión, lo que reduce el peso por metro cuadrado frente a una cercha plana de la misma luz y genera espacios de gran calidad arquitectónica.',
      },
      {
        nombre: 'Cubiertas autoportantes',
        descripcion:
          'Láminas curvadas estructurales que cubren luces medias sin correas ni cerchas intermedias: la teja es la estructura. Menos piezas, montaje rápido y costo competitivo para bodegas, canchas y ampliaciones donde la estética del arco continuo es bienvenida.',
      },
      {
        nombre: 'Estructura para teja standing seam y panel sándwich',
        descripcion:
          'Entramados de correas calibradas para recibir cubiertas arquitectónicas engrafadas (standing seam) o paneles tipo sándwich con aislamiento térmico y acústico. La estructura se diseña según las tolerancias y separaciones que exige cada sistema de teja, evitando filtraciones y vibraciones.',
      },
      {
        nombre: 'Pérgolas y cubiertas arquitectónicas urbanas',
        descripcion:
          'Estructuras a la vista para plazas, parques, accesos y zonas comerciales, donde la soldadura, la geometría y el acabado de pintura son parte del diseño. Se fabrican con protección anticorrosiva para exposición permanente a la intemperie.',
      },
    ],
    ventajas: [
      'Luces libres de 20 a 60 metros sin columnas intermedias',
      'Montaje en semanas: la estructura llega fabricada y pintada desde planta',
      'Menos carga sobre la edificación: entre 25 y 60 kg/m² según la luz',
      'Cumplimiento NSR-10 verificable: memorias, planos y certificados entregados',
      'Un solo responsable del diseño, la fabricación y el montaje',
      'Más de 57.000 m² de cubierta instalados desde 1996',
    ],
    procesoResumen: [
      {
        titulo: 'Ingeniería y modelado 3D',
        descripcion:
          'Levantamiento de requerimientos, cálculo estructural según NSR-10 y modelado BIM de la cubierta. El cliente aprueba geometría, luces y acabados antes de cortar el primer perfil.',
      },
      {
        titulo: 'Fabricación en planta',
        descripcion:
          'Corte CNC, armado y soldadura calificada en las plantas de Jamundí y Popayán, con control de calidad dimensional y aplicación del sistema de pintura especificado.',
      },
      {
        titulo: 'Transporte y montaje',
        descripcion:
          'Logística de despacho por módulos, izaje con grúa y conexiones empernadas en obra. Equipos de montaje propios con certificación de trabajo en alturas.',
      },
      {
        titulo: 'Instalación de cubierta y entrega',
        descripcion:
          'Colocación de teja (standing seam, sándwich, trapezoidal o autoportante), pruebas de estanqueidad, dossier de calidad y acta de entrega con garantía.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta una cubierta metálica por metro cuadrado o por kilo?',
        respuesta:
          'El costo depende de la luz libre, el tipo estructural (cercha, arco o autoportante), el sistema de teja, la altura de montaje y la ubicación de la obra. Como rango orientativo de mercado, la estructura metálica instalada se mueve entre $10.900 y $13.000 COP/kg en cubiertas livianas convencionales, $13.000 a $17.000 COP/kg en estructuras de complejidad media, y $17.000 a $25.000 COP/kg en geometrías especiales o grandes luces. Una cubierta típica pesa entre 25 y 60 kg/m², sin incluir la teja. La cotización real se elabora sobre planos o anteproyecto.',
      },
      {
        pregunta: '¿Qué luz máxima puede cubrir una estructura metálica sin apoyos intermedios?',
        respuesta:
          'Con cerchas planas se cubren cómodamente luces de 15 a 40 metros; con arcos metálicos, entre 30 y 60 metros, suficiente para un coliseo con cancha reglamentaria y graderías. Luces mayores son técnicamente viables con celosías espaciales o arcos atirantados, pero el peso por metro cuadrado crece y conviene evaluarlas caso a caso. MEISA ha cubierto escenarios completos como el Coliseo de Fútbol Sala de Popayán (6.133 m²) y el Coliseo Mundialista de Korfball en Cali (3.300 m²) sin columnas en la zona de juego.',
      },
      {
        pregunta: '¿Qué mantenimiento requiere una cubierta metálica?',
        respuesta:
          'Muy poco si se especifica bien desde el diseño. La rutina recomendada es una inspección anual: estado de la pintura o el galvanizado, apriete de conexiones visibles, limpieza de canales y bajantes, y revisión de traslapos o grafados de la teja. El sistema de protección anticorrosiva se elige según el ambiente —urbano, industrial o costero— y con un esquema adecuado el repintado general solo se necesita cada 10 a 15 años. Las cubiertas standing seam y los paneles sándwich prácticamente no requieren intervención sobre la teja misma.',
      },
      {
        pregunta: '¿Las cubiertas metálicas cumplen la norma NSR-10?',
        respuesta:
          'Sí, siempre que se diseñen y construyan correctamente. La NSR-10 regula las estructuras de acero en su Título F y las cargas y requisitos sísmicos en los Títulos A y B. MEISA entrega memorias de cálculo firmadas por ingeniero estructural, planos de taller y montaje, certificados de calidad del acero y registros de soldadura e inspección, que son los documentos que exigen curadurías e interventorías. En zonas de amenaza sísmica alta, como el suroccidente colombiano, el bajo peso del acero es además una ventaja de desempeño sísmico.',
      },
      {
        pregunta: '¿Pueden reemplazar o reforzar una cubierta existente sin demoler el edificio?',
        respuesta:
          'Sí, es un caso frecuente. Se evalúa primero la estructura portante existente —columnas, vigas, muros— para verificar si recibe la nueva cubierta o si requiere refuerzo. Luego se diseña la estructura metálica nueva, se fabrica en planta y se monta por etapas, lo que permite mantener la edificación parcialmente en operación: así se trabaja típicamente en colegios, donde el cambio se programa en vacaciones, y en plantas industriales que no pueden detener producción. El bajo peso del acero suele evitar intervenir las cimentaciones.',
      },
    ],
    proyectosIntro:
      'Los rangos y plazos están respaldados por obra entregada: el Colegio Enosimar en Mitú (580 toneladas y 3.663 m²), el Coliseo de Fútbol Sala de los Juegos Nacionales de Popayán (267 toneladas y 6.133 m²), el Coliseo Mundialista de Korfball de los Juegos Mundiales Cali 2013 (216 toneladas), los 5 coliseos del Plan Colombia en el Cauca y los 10 coliseos barriales de Popayán (8.650 m²), entre 28 proyectos deportivos y educativos en todo el país.',
    categoriaEnum: 'DEPORTES_EDUCACION',
    categoriaSlug: 'institucional',
    statsPropios: [
      { valor: '57.000', label: 'm² de cubierta instalados' },
      { valor: '30', label: 'Años de experiencia' },
    ],
  },
  {
    slug: 'estructura-metalica-centros-comerciales',
    keywordH1: 'Estructura metálica para centros comerciales y retail',
    metaTitle:
      'Estructura Metálica para Centros Comerciales en Colombia | MEISA',
    metaDescription:
      'Fabricamos y montamos estructura metálica para centros comerciales: +14.600 toneladas en 13 ciudades desde 2003. Ampliaciones sin cerrar la operación.',
    heroEyebrow: 'Soluciones — Comercial y retail',
    heroTitulo1: 'Centros comerciales',
    heroTitulo2: 'que crecen en acero',
    intro:
      'Un centro comercial vive de su flujo de visitantes, y su estructura debe permitirle crecer sin detenerlo. Desde 2003, MEISA ha fabricado y montado más de 14.600 toneladas de estructura metálica para centros comerciales y proyectos de retail en 13 ciudades de Colombia: la ampliación del Campanario en Popayán, las etapas del Único en Cali, Neiva y Villavicencio y Bochalema Plaza, entre 54 proyectos comerciales. Diseñamos, fabricamos en nuestras plantas de Jamundí y Popayán, y montamos por fases — incluso con el centro comercial operando.',
    secciones: [
      {
        titulo: 'Por qué los centros comerciales en Colombia se construyen en acero',
        parrafos: [
          'Un centro comercial es un negocio de área arrendable y de tiempo: cada columna de menos es un local mejor, y cada mes de obra que se ahorra es renta que entra antes. Por eso el acero estructural domina este tipo de edificación. Las luces de 20 a 40 metros que exigen plazoletas de comidas, cines y supermercados ancla son difíciles y costosas en concreto; en acero son el caso típico de diseño.',
          'Hay una segunda razón menos visible: los centros comerciales nunca se terminan. Se amplían, suman niveles, reconvierten locales, conectan etapas. Una estructura metálica bien diseñada deja previstas las conexiones y la reserva de capacidad para ese crecimiento, y el montaje atornillado permite ejecutarlo después sin demoler ni parar la operación.',
          'MEISA ha acompañado ese ciclo completo en proyectos como el Centro Comercial Único, donde hemos ejecutado etapas y ampliaciones sucesivas en Cali, Neiva y Villavicencio a lo largo de más de una década, y en el Campanario de Popayán, cuya ampliación de 2.454 toneladas y 12.000 m² se montó con el centro comercial en funcionamiento.',
        ],
      },
      {
        titulo: 'Ampliar un centro comercial sin cerrarlo: cómo lo hacemos',
        parrafos: [
          'Cerrar un centro comercial para ampliarlo no es una opción: significa lucro cesante para decenas de locales y pérdida de tráfico que tarda años en recuperarse. Toda nuestra metodología de obra en retail parte de esa restricción.',
          'El trabajo empieza en ingeniería: modelamos la estructura nueva y la existente, definimos secuencias de montaje que aíslan cada frente de obra y diseñamos conexiones que se instalan en ventanas cortas. La fabricación en nuestras plantas de Jamundí y Popayán llega a obra en despachos sincronizados con el plan de izajes, de modo que el acopio en un parqueadero operativo sea mínimo.',
          'En campo, las maniobras de grúa y los izajes mayores se programan en horario nocturno o en valles de tráfico acordados con la administración del centro comercial. Los frentes activos se cierran con senderos peatonales protegidos y señalización, y las actividades ruidosas se concentran fuera del horario comercial. El resultado: los visitantes siguen entrando y los locales siguen vendiendo durante toda la obra.',
        ],
        bullets: [
          'Montaje nocturno y por ventanas: izajes y maniobras de grúa fuera del horario comercial, con planes de izaje aprobados',
          'Frentes de obra aislados: cerramientos provisionales, senderos peatonales protegidos y rutas de evacuación coordinadas con la administración y bomberos',
          'Logística justo a tiempo: despachos desde planta sincronizados con el cronograma de montaje para minimizar acopios en zonas en uso',
          'Entregas por fases: la estructura se libera por sectores para que acabados, redes y adecuación de locales arranquen sin esperar el final del montaje',
        ],
      },
      {
        titulo: 'Alcance: de la ingeniería de detalle a la cubierta instalada',
        parrafos: [
          'Entregamos la solución completa de acero del proyecto comercial, con un solo responsable desde los planos hasta la estructura montada. Eso elimina las interfaces entre diseñador, fabricante y montador que suelen generar sobrecostos y disputas en obra.',
          'Trabajamos con el diseñador estructural del proyecto o desarrollamos la ingeniería de detalle internamente: modelado 3D de conexiones, planos de taller y despiece para fabricación. En planta, el control de calidad cubre trazabilidad del material, soldadura calificada e inspección dimensional antes de cada despacho.',
        ],
        bullets: [
          'Ingeniería de detalle y modelado 3D de la estructura y sus conexiones, coordinado con redes y arquitectura',
          'Fabricación en plantas propias con corte CNC y soldadura calificada, con capacidad para proyectos de más de 2.000 toneladas',
          'Protección y acabados: sistemas de pintura según exposición y acabados a la vista para pasarelas y cubiertas arquitectónicas',
          'Transporte y montaje: logística de despachos, grúas y personal certificado hasta el recibo de la estructura',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Estructura principal de varios niveles',
        descripcion:
          'Columnas, vigas y entrepisos en perfiles de acero para edificios comerciales de dos a cinco niveles, con losas en lámina colaborante (steel deck). El acero reduce el peso propio frente al concreto, libera plantas más abiertas para locales y acelera el cronograma porque la fabricación avanza en paralelo con la cimentación.',
      },
      {
        nombre: 'Grandes luces para plazoletas de comidas y zonas comunes',
        descripcion:
          'Cerchas y vigas de alma llena que salvan luces de 20 a 40 metros sin columnas intermedias. Son las que hacen posibles las plazoletas de comidas, cines y zonas de eventos: espacios diáfanos donde cada columna eliminada es área arrendable y mejor experiencia para el visitante.',
      },
      {
        nombre: 'Cubiertas arquitectónicas y lucernarios',
        descripcion:
          'Estructuras de cubierta con geometrías curvas o inclinadas, preparadas para teja standing seam, policarbonato o vidrio. Resolvemos la transición entre la estética que pide el diseño arquitectónico y los requisitos de carga, drenaje y mantenimiento que exige una cubierta comercial de gran formato.',
      },
      {
        nombre: 'Pasarelas y puentes interiores',
        descripcion:
          'Puentes peatonales que conectan alas del centro comercial sobre vacíos y plazoletas, con barandas, acabados a la vista y control estricto de vibraciones para el confort del peatón. Se fabrican en módulos completos y se izan en maniobras cortas, normalmente nocturnas.',
      },
      {
        nombre: 'Ampliaciones con el centro comercial operando',
        descripcion:
          'Nuestra especialidad: nuevas etapas, niveles adicionales y conexiones sobre edificios existentes sin cerrar la operación. Planificamos montaje nocturno, aislamiento de frentes de obra, izajes programados con la administración del centro y entregas por fases para que los locales sigan vendiendo durante toda la obra.',
      },
    ],
    ventajas: [
      'Velocidad: la estructura se fabrica en planta mientras avanza la cimentación — meses de renta anticipada',
      'Luces grandes con menos columnas: más área arrendable y plazoletas amplias',
      'Obra limpia y compatible con la operación: montaje atornillado con menos escombro, ruido y humedad',
      'Menor peso sobre cimentación y estructura existente: clave en ampliaciones sobre edificios en uso',
      'Crecimiento por etapas: conexiones previstas y columnas con reserva de carga para futuras fases',
    ],
    procesoResumen: [
      {
        titulo: 'Ingeniería y planeación de fases',
        descripcion:
          'Revisamos el diseño estructural, desarrollamos la ingeniería de detalle y definimos con el cliente la secuencia de fases: qué zonas del centro comercial se intervienen, en qué horarios y en qué orden se entregan.',
      },
      {
        titulo: 'Fabricación en planta',
        descripcion:
          'Corte, armado, soldadura y pintura en nuestras plantas de Jamundí y Popayán, con control de calidad y trazabilidad por elemento. La fabricación avanza en paralelo con la obra civil del proyecto.',
      },
      {
        titulo: 'Montaje coordinado con la operación',
        descripcion:
          'Despachos sincronizados, izajes programados en horario nocturno cuando el centro está operando, frentes aislados y protocolos de seguridad acordados con la administración del centro comercial.',
      },
      {
        titulo: 'Entrega por sectores',
        descripcion:
          'Liberamos la estructura por fases para que acabados y adecuación de locales arranquen cuanto antes, con dossier de calidad, planos récord y acompañamiento hasta el recibo final.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta la estructura metálica de un centro comercial?',
        respuesta:
          'Depende de las luces, el número de niveles, la complejidad de cubiertas y pasarelas, los acabados arquitectónicos y la logística (el montaje nocturno en un centro operando cuesta más que en lote libre). Como rango orientativo de mercado: estructura liviana de cubiertas entre $10.900 y $13.000 COP/kg instalado, estructura principal de entrepisos y luces medias entre $13.000 y $17.000, y elementos especiales de gran luz entre $17.000 y $25.000. La cotización real se hace sobre planos estructurales del proyecto.',
      },
      {
        pregunta: '¿Pueden ampliar el centro comercial sin cerrar la operación?',
        respuesta:
          'Sí, es nuestra especialidad en retail. Programamos los izajes y maniobras de grúa en horario nocturno, aislamos los frentes de obra con cerramientos y senderos peatonales protegidos, y coordinamos cada actividad con la administración del centro. La ampliación del Centro Comercial Campanario en Popayán — 2.454 toneladas y 12.000 m² — se montó con el centro funcionando, igual que las ampliaciones del Único en Cali. Los locales siguen vendiendo durante toda la obra.',
      },
      {
        pregunta: '¿Cuánto tarda la estructura metálica de un centro comercial?',
        respuesta:
          'Como referencia: la ingeniería de detalle toma de 6 a 10 semanas, y entre fabricación y montaje una estructura comercial avanza típicamente entre 200 y 400 toneladas por mes según la complejidad y las restricciones de horario. Una ampliación de 1.500 a 2.500 toneladas suele completarse en 10 a 14 meses desde la orden de inicio; etapas menores, en 4 a 6 meses. La fabricación en paralelo con la cimentación es lo que acorta el cronograma frente al concreto.',
      },
      {
        pregunta: '¿La estructura cumple la NSR-10? ¿Quién hace el diseño?',
        respuesta:
          'Toda la estructura se diseña y fabrica bajo la NSR-10, en particular el Título F de estructuras metálicas, con diseño sismorresistente según la zona de amenaza del proyecto. El diseño estructural puede venir del calculista del proyecto — nosotros desarrollamos la ingeniería de detalle y las conexiones — o ejecutarse completo con nuestro equipo. En ambos casos entregamos memorias de cálculo, planos de taller y dossier de calidad con trazabilidad de materiales y soldaduras para la supervisión técnica.',
      },
      {
        pregunta: '¿Se puede construir por fases para abrir primero la marca ancla?',
        respuesta:
          'Sí, y es lo usual en proyectos comerciales: la marca ancla (supermercado, cine o tienda por departamentos) suele tener fecha de apertura contractual. Diseñamos la secuencia de montaje para liberar primero su zona — estructura, cubierta y entrepisos — con juntas de construcción y conexiones previstas hacia las fases siguientes. Así la ancla abre y genera tráfico mientras se completa el resto del centro comercial, sin retrabajos ni demoliciones entre etapas.',
      },
    ],
    proyectosIntro:
      'La trayectoria está construida en obra real: la ampliación del Centro Comercial Campanario en Popayán (2.454 toneladas montadas con el centro operando), la ampliación del Único en Cali (1.800 toneladas), el Centro Comercial Bochalema Plaza (1.781 toneladas), el Único de Neiva (902 toneladas) y el Único de Villavicencio (670 toneladas), entre 54 proyectos comerciales entregados en 13 ciudades.',
    categoriaEnum: 'COMERCIAL',
    categoriaSlug: 'comercial',
    statsPropios: [
      { valor: '13', label: 'Ciudades de Colombia' },
      { valor: '2003', label: 'En retail desde' },
    ],
  },
  {
    slug: 'estructura-metalica-escenarios-deportivos',
    keywordH1: 'Coliseos y escenarios deportivos en estructura metálica',
    metaTitle:
      'Coliseos y Escenarios Deportivos en Estructura Metálica | MEISA',
    metaDescription:
      'Diseño, fabricación y montaje de coliseos, graderías y cubiertas deportivas en acero. 28 proyectos y 57.600 m² construidos. Plantas en Jamundí y Popayán.',
    heroEyebrow: 'Deportes y Educación',
    heroTitulo1: 'Coliseos y escenarios',
    heroTitulo2: 'deportivos en acero',
    intro:
      'Un escenario deportivo se define por una sola exigencia: cubrir grandes luces sin columnas intermedias que interrumpan el juego o la visual del público. La estructura metálica es la respuesta natural a ese reto. MEISA ha diseñado, fabricado y montado 28 escenarios deportivos y educativos en Colombia —más de 57.600 m² cubiertos—, incluidos cuatro escenarios de los Juegos Nacionales Popayán 2012 y el coliseo mundialista de korfball de los Juegos Mundiales Cali 2013. Desde nuestras plantas en Jamundí y Popayán atendemos proyectos públicos y privados en todo el país.',
    secciones: [
      {
        titulo: 'Experiencia que se mide en coliseos',
        parrafos: [
          'Pocas empresas en Colombia pueden acreditar la cantidad de escenarios deportivos que MEISA ha construido desde 1996. Para los Juegos Nacionales Popayán 2012 fabricamos y montamos la estructura de cuatro escenarios: el Coliseo Mayor, el Coliseo de Fútbol Sala (267 toneladas y 6.133 m²), el Coliseo de Artes Marciales (196 toneladas y 4.036 m²) y el Complejo Acuático de Popayán (135 toneladas). Un año después construimos el Coliseo Mundialista de Korfball para los Juegos Mundiales Cali 2013, con 216 toneladas de acero y 3.300 m².',
          'A esa experiencia en escenarios de competencia se suma una trayectoria amplia en infraestructura deportiva comunitaria: 10 coliseos en barrios de Popayán (8.650 m²), 7 coliseos polideportivos en municipios del Cauca (9.000 m²), 5 coliseos del programa Plan Colombia y escenarios universitarios y escolares en Cali, Popayán, Pereira y Valledupar. En total, 28 proyectos de la categoría deportes y educación con más de 57.600 m² construidos.',
        ],
      },
      {
        titulo: 'Por qué acero para un escenario deportivo',
        parrafos: [
          'La geometría de un coliseo está dictada por el deporte: una cancha múltiple reglamentaria exige entre 24 y 28 metros libres; un coliseo con graderías perimetrales puede requerir 35 a 50 metros sin apoyos intermedios. En concreto, esas luces obligan a secciones masivas y procesos lentos de formaleta y fraguado. En acero se resuelven con cerchas o arcos fabricados en planta, más livianos, que llegan a obra listos para izar.',
          'El peso propio menor de la estructura metálica también reduce la cimentación, algo decisivo en suelos de mediana capacidad como los del suroccidente colombiano. Y como la fabricación ocurre en paralelo con la obra civil, el plazo total del proyecto se comprime: en infraestructura pública, donde los cronogramas de vigencias y convenios son rígidos, esa velocidad suele ser la diferencia entre entregar a tiempo o no.',
        ],
      },
      {
        titulo: 'Infraestructura deportiva pública: cómo trabajamos con entidades',
        parrafos: [
          'Gran parte de la infraestructura deportiva en Colombia se contrata por licitación pública o por convenios con gobernaciones, municipios, cajas de compensación y universidades. MEISA ha trabajado en los tres esquemas habituales: como contratista directo de la entidad, como fabricante y montador para el contratista general de obra, y como integrante de consorcios y uniones temporales.',
          'Para estos procesos aportamos lo que la entidad y la interventoría necesitan: experiencia acreditable en escenarios deportivos (RUP y actas de obra), memorias de cálculo firmadas por ingenieros con matrícula vigente, cumplimiento del Título F de la NSR-10, soldadores calificados bajo AWS, pólizas y dossier de calidad completo al cierre. Esa documentación, más el historial de escenarios entregados para eventos nacionales, reduce el riesgo técnico del proyecto para la entidad contratante.',
        ],
      },
      {
        titulo: 'Complejos deportivos en Popayán, Cali y el suroccidente',
        parrafos: [
          'Popayán es, en buena medida, una ciudad cuyos escenarios deportivos llevan acero de MEISA: el complejo deportivo de los Juegos Nacionales 2012, el complejo acuático, el coliseo de la Universidad del Cauca y diez coliseos barriales salieron de nuestra planta local. Esa cercanía sigue vigente: fabricamos en Popayán y Jamundí, lo que significa menos transporte, respuesta rápida en obra y conocimiento directo de las condiciones sísmicas y de viento de la región.',
          'Desde el Valle y el Cauca hemos llevado escenarios deportivos y educativos a Pereira, Valledupar y hasta Mitú (Vaupés), donde entregamos las estructuras del Colegio Enosimar con 580 toneladas de acero y 3.663 m². Si su entidad o constructora planea un complejo deportivo, un coliseo municipal o la cubierta de una cancha, podemos acompañar desde la estructuración técnica del proyecto.',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Coliseos cubiertos',
        descripcion:
          'Escenarios multipropósito con luces libres de 25 a 50 metros resueltas con cerchas o arcos metálicos, graderías y cerramientos. MEISA construyó el Coliseo Mayor y el Coliseo de Fútbol Sala (6.133 m²) de los Juegos Nacionales Popayán 2012, y el Coliseo Mundialista de Korfball de los Juegos Mundiales Cali 2013.',
      },
      {
        nombre: 'Graderías metálicas',
        descripcion:
          'Estructuras de gradería en perfiles y láminas de acero, diseñadas para cargas dinámicas de público según NSR-10. Se fabrican en planta y se montan por módulos, lo que reduce el plazo frente a graderías en concreto y permite ampliaciones futuras.',
      },
      {
        nombre: 'Cubiertas para canchas múltiples',
        descripcion:
          'Cubiertas autoportantes sobre canchas de baloncesto, microfútbol y voleibol existentes o nuevas. La luz mínima útil para una cancha múltiple reglamentaria está entre 24 y 28 metros. Ejemplo: cancha múltiple de la Universidad Javeriana Cali, 87 toneladas y 1.228 m².',
      },
      {
        nombre: 'Polideportivos escolares',
        descripcion:
          'Coliseos y cubiertas para colegios y universidades, integrados con aulas y zonas comunes. MEISA ha construido escenarios para la Universidad del Cauca, los colegios Santa Isabel de Hungría y Colombo Francés, y polideportivos en instituciones educativas del Valle y el Cauca.',
      },
      {
        nombre: 'Complejos acuáticos',
        descripcion:
          'Cubiertas sobre piscinas olímpicas y semiolímpicas, con tratamiento anticorrosivo reforzado para ambientes con cloro y alta humedad. MEISA fabricó y montó la estructura de los complejos acuáticos de Popayán (135 t) y Pereira.',
      },
    ],
    ventajas: [
      'Luces libres de 25 a 50 m sin columnas: canchas reglamentarias y visual completa desde las graderías',
      'Obra más rápida y predecible: fabricación en planta en paralelo con la cimentación',
      'Experiencia en contratación pública: municipios, gobernaciones, universidades y consorcios desde 1996',
      'Diseño, fabricación y montaje integrados con un solo responsable y trazabilidad completa',
      'Dos plantas en el suroccidente: Jamundí (Valle) y Popayán (Cauca)',
      'Cumplimiento NSR-10 Título F con memorias de cálculo, soldadores calificados y dossier para interventoría',
    ],
    procesoResumen: [
      {
        titulo: 'Ingeniería y diseño',
        descripcion:
          'Modelado estructural del escenario según NSR-10: luces libres requeridas por la disciplina, cargas de viento y sismo, graderías, cargas colgadas (iluminación, sonido, tableros) y compatibilización con la cimentación.',
      },
      {
        titulo: 'Fabricación en planta',
        descripcion:
          'Corte, armado y soldadura de cerchas, arcos y columnas en nuestras plantas de Jamundí y Popayán, con soldadores calificados, control dimensional y protección anticorrosiva según el ambiente del proyecto.',
      },
      {
        titulo: 'Montaje en obra',
        descripcion:
          'Izaje y conexión de la estructura por módulos con equipos propios y personal certificado para trabajo en alturas. El montaje se programa para convivir con otras actividades de obra y minimizar cierres del escenario.',
      },
      {
        titulo: 'Cubierta, acabados y entrega',
        descripcion:
          'Instalación de teja, canales, traslucidos y cerramientos; verificación topográfica final y entrega con dossier de calidad: certificados de materiales, registros de soldadura y planos as-built para la interventoría.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta la cubierta metálica de un escenario deportivo por metro cuadrado?',
        respuesta:
          'Depende de la luz libre, el tipo de estructura (cercha, arco o pórtico), si incluye graderías y cerramientos, y las condiciones del sitio. Como rango orientativo de mercado, la estructura de una cubierta deportiva se ubica entre $13.000 y $17.000 COP por kilogramo instalado; con incidencias típicas de 30 a 50 kg de acero por m² según la luz, eso equivale a un orden de magnitud de $330.000 a $800.000 COP/m² solo en estructura, sin teja ni canales. La cotización real se elabora sobre planos o anteproyecto.',
      },
      {
        pregunta: '¿Qué luz libre necesita una cancha y cómo se logra sin columnas?',
        respuesta:
          'Una cancha múltiple reglamentaria (baloncesto, microfútbol, voleibol) requiere entre 24 y 28 metros libres incluyendo zonas de seguridad; un coliseo con graderías laterales suele necesitar de 35 a 50 metros. Esas luces se resuelven con cerchas o arcos metálicos que trabajan sin apoyos intermedios. MEISA ha construido escenarios de hasta 6.133 m² como el Coliseo de Fútbol Sala de los Juegos Nacionales Popayán 2012, con cancha y graderías completamente libres de columnas.',
      },
      {
        pregunta: '¿Pueden participar en proyectos de contratación pública? ¿Qué requisitos cumplen?',
        respuesta:
          'Sí. MEISA ha ejecutado escenarios deportivos para municipios, la Gobernación del Cauca, universidades públicas y consorcios de obra desde 1996, incluidos cuatro escenarios de los Juegos Nacionales Popayán 2012. Aportamos experiencia acreditable mediante RUP y actas de obra, memorias de cálculo según NSR-10 Título F firmadas por ingenieros matriculados, soldadores calificados bajo AWS, pólizas de cumplimiento y dossier de calidad para interventoría. Trabajamos como contratista directo, subcontratista del constructor general o integrante de consorcios y uniones temporales.',
      },
      {
        pregunta: '¿Cuánto tarda construir un coliseo o cubierta deportiva en estructura metálica?',
        respuesta:
          'Como referencia: la cubierta de una cancha múltiple escolar (800 a 1.500 m²) toma entre 2 y 4 meses entre fabricación y montaje; un coliseo municipal con graderías (2.000 a 4.000 m²), entre 4 y 7 meses; un escenario de competencia de mayor escala puede llegar a 8-10 meses. La ventaja del acero es que la fabricación en planta avanza en paralelo con la cimentación, comprimiendo el cronograma total. El plazo firme se define con el diseño aprobado y las condiciones del sitio.',
      },
      {
        pregunta: '¿La estructura soporta iluminación, sonido, tableros y otras cargas colgadas?',
        respuesta:
          'Sí, siempre que se prevean en el diseño. Las luminarias deportivas, sistemas de sonido, tableros electrónicos, mallas de protección y pasarelas de mantenimiento se incorporan como cargas colgadas en el modelo estructural según la NSR-10, con puntos de anclaje definidos en planos. Por eso es clave entregar al diseñador las especificaciones de los equipos desde el inicio: modificar una cercha ya montada para colgar cargas no previstas siempre cuesta más que diseñarlas desde el principio.',
      },
    ],
    proyectosIntro:
      'Para los Juegos Nacionales Popayán 2012 entregamos el Coliseo Mayor, el Coliseo de Fútbol Sala (267 toneladas y 6.133 m²), el Coliseo de Artes Marciales (196 toneladas) y el Complejo Acuático de Popayán (135 toneladas); para los Juegos Mundiales Cali 2013, el Coliseo Mundialista de Korfball (216 toneladas y 3.300 m²). A ellos se suman 10 coliseos barriales en Popayán y decenas de escenarios escolares y universitarios en el suroccidente.',
    categoriaEnum: 'DEPORTES_EDUCACION',
    categoriaSlug: 'institucional',
    statsPropios: [
      { valor: '57.600', label: 'm² construidos' },
      { valor: '4', label: 'Escenarios JJNN 2012' },
    ],
  },
  {
    slug: 'edificios-en-estructura-metalica',
    keywordH1: 'Edificios en estructura metálica',
    metaTitle: 'Edificios en Estructura Metálica en Colombia | MEISA',
    metaDescription:
      'Diseño, fabricación y montaje de edificios en estructura metálica: +3.500 toneladas en 14 ciudades desde 1998. Cumplimiento NSR-10. Cotice con MEISA.',
    heroEyebrow: 'Soluciones — Edificaciones',
    heroTitulo1: 'Edificios en',
    heroTitulo2: 'estructura metálica',
    intro:
      'MEISA diseña, fabrica y monta edificios en estructura metálica en Colombia desde 1998: más de 3.500 toneladas instaladas en 14 ciudades, en proyectos corporativos, clínicos, industriales y de uso mixto. Trabajamos con un proceso integrado —ingeniería de detalle, fabricación en nuestras plantas de Jamundí y Popayán, y montaje en obra— que reduce tiempos de construcción frente al sistema tradicional y garantiza cumplimiento de la norma sismorresistente NSR-10. Si su proyecto exige luces amplias, plazos cortos o construir sobre una edificación existente, el acero estructural es la respuesta.',
    secciones: [
      {
        titulo: 'Por qué construir un edificio con estructura metálica',
        parrafos: [
          'Un edificio en estructura metálica se arma con columnas y vigas de acero fabricadas en planta bajo condiciones controladas, que llegan a obra listas para conectarse. Eso cambia la lógica de la construcción: mientras se ejecuta la cimentación, la estructura ya se está fabricando, y el montaje avanza por pisos completos sin esperar fraguados.',
          'El acero permite luces más amplias con menos columnas, plantas libres más flexibles y una estructura entre 30% y 50% más liviana que su equivalente en concreto, lo que reduce el tamaño de la cimentación. Además, la calidad no depende del clima ni de la formaleta: cada pieza sale de planta con dimensiones verificadas y trazabilidad de material.',
          'En MEISA llevamos más de 25 años fabricando estructuras metálicas y desde 1998 hemos entregado 54 proyectos de edificaciones en 14 ciudades de Colombia, desde clínicas y sedes corporativas hasta edificios industriales de varios pisos para plantas farmacéuticas y de alimentos.',
        ],
      },
      {
        titulo: 'Alcance del servicio: del modelo BIM al edificio entregado',
        parrafos: [
          'Cubrimos el ciclo completo del edificio metálico con un solo responsable, lo que elimina los vacíos de coordinación entre diseñador, fabricante y montador que suelen generar sobrecostos.',
        ],
        bullets: [
          'Ingeniería y modelado BIM: modelamos la estructura en 3D, diseñamos y calculamos las conexiones, y generamos planos de taller y montaje coordinados con los demás sistemas del edificio',
          'Fabricación en planta: corte CNC, armado y soldadura con soldadores calificados, con inspección de calidad y trazabilidad digital pieza a pieza',
          'Protección y acabados: limpieza superficial, sistemas de pintura anticorrosiva o galvanizado según el ambiente, y protección contra fuego cuando el proyecto lo requiere',
          'Transporte y montaje: logística de despacho por etapas, izaje con grúas y montaje con personal propio certificado, hasta la entrega con planos récord',
        ],
      },
      {
        titulo: 'Componentes de un edificio en estructura metálica',
        parrafos: [
          'Estos son los sistemas que diseñamos y fabricamos en un edificio metálico típico:',
        ],
        bullets: [
          'Columnas y vigas principales: perfiles laminados o armados en sección I, H o cajón, dimensionados según las cargas y la altura del edificio',
          'Entrepisos con lámina colaborante: sistema steel deck con concreto y conectores de cortante — losas más delgadas, sin formaleta y con avance rápido piso a piso',
          'Sistema de resistencia sísmica: pórticos resistentes a momento o arriostramientos concéntricos/excéntricos, según el grado de disipación de energía requerido',
          'Conexiones apernadas y soldadas: diseñadas y verificadas en software especializado; las conexiones de campo se resuelven apernadas para acelerar el montaje',
          'Escaleras, barandas y misceláneos: escaleras metálicas, soportes de fachada y de equipos, integrados al mismo modelo 3D de la estructura principal',
        ],
      },
    ],
    tiposDeEstructura: [
      {
        nombre: 'Edificios corporativos y de oficinas',
        descripcion:
          'Sedes empresariales y torres de oficinas con plantas libres y luces amplias, como la estructura del World Trade Center Pacific en Cali y el edificio Colpatria en Neiva, nuestro mayor proyecto de edificaciones con 902 toneladas.',
      },
      {
        nombre: 'Clínicas y sector salud',
        descripcion:
          'Edificaciones hospitalarias con los requisitos sísmicos más exigentes de la NSR-10 (grupo de uso IV), como la Clínica Reina Victoria y los módulos médicos del parque clínico Espíritu Santo en Popayán.',
      },
      {
        nombre: 'Edificios industriales multipiso',
        descripcion:
          'Estructuras de varios niveles para procesos productivos con cargas altas y soportería de equipos, como los edificios de Cápsulas Blandas y Sólidos de Tecnoquímicas en Jamundí y el edificio Cítrico de Sucroal en Palmira.',
      },
      {
        nombre: 'Entrepisos y ampliaciones verticales',
        descripcion:
          'Pisos adicionales sobre edificaciones existentes aprovechando el bajo peso del acero: evaluamos la estructura actual, reforzamos donde se requiere y montamos con mínima interrupción de la operación.',
      },
      {
        nombre: 'Estructuras arquitectónicas especiales',
        descripcion:
          'Geometrías no convencionales, fachadas estructurales, voladizos y cubiertas integradas al edificio, resueltas con modelado 3D y fabricación de precisión.',
      },
    ],
    ventajas: [
      'Obra entre 30% y 50% más rápida: fabricación en paralelo con la cimentación y montaje sin fraguados',
      'Estructura más liviana que el concreto: cimentaciones menores, clave en suelos blandos',
      'Luces amplias y plantas libres: más área útil y flexibilidad para cambios de uso futuros',
      'Calidad controlada en planta: corte CNC, soldadores calificados y trazabilidad digital',
      'El sistema ideal para ampliar en altura sobre edificios existentes',
      'Desempeño sísmico dúctil con sistemas de alta disipación de energía conforme a la NSR-10',
    ],
    procesoResumen: [
      {
        titulo: 'Ingeniería y cotización',
        descripcion:
          'Revisamos sus planos o anteproyecto, optimizamos el sistema estructural y entregamos una cotización detallada por peso, con alcance de fabricación y montaje.',
      },
      {
        titulo: 'Modelado y planos de taller',
        descripcion:
          'Modelamos el edificio en 3D, diseñamos las conexiones y generamos planos de fabricación aprobados antes de cortar el primer perfil.',
      },
      {
        titulo: 'Fabricación en planta',
        descripcion:
          'Corte, armado, soldadura y pintura en nuestras plantas de Jamundí y Popayán, con inspección de calidad y despachos programados según el plan de montaje.',
      },
      {
        titulo: 'Montaje y entrega',
        descripcion:
          'Izaje y conexión en obra con personal propio certificado, verificación de plomos y torques, y entrega con dossier de calidad y planos récord.',
      },
    ],
    faq: [
      {
        pregunta: '¿Cuánto cuesta un edificio en estructura metálica comparado con uno en concreto?',
        respuesta:
          'El costo depende del número de pisos, las luces, las cargas de uso, el sistema sísmico, el tipo de conexiones y el acabado de protección. Como rango orientativo de mercado, la estructura metálica de un edificio típico está entre $13.000 y $17.000 COP por kilogramo instalado; estructuras livianas pueden bajar a $10.900–$13.000 y las especiales subir a $17.000–$25.000. El costo directo puede ser similar o algo superior al concreto, pero se compensa con cimentaciones menores y meses de obra ahorrados. La cotización real se hace sobre planos.',
      },
      {
        pregunta: '¿Cuántos pisos puede tener un edificio en estructura metálica?',
        respuesta:
          'La NSR-10 no impone un límite de pisos al acero: en el mundo, los edificios metálicos superan los 100 niveles. En Colombia, el rango más común va de 4 a 20 pisos, y la altura se resuelve con el sistema sísmico adecuado: pórticos resistentes a momento, arriostramientos o combinaciones con núcleos de concreto. Nuestro mayor proyecto de edificaciones, el edificio Colpatria en Neiva, suma 902 toneladas de acero estructural.',
      },
      {
        pregunta: '¿Se puede ampliar un piso sobre un edificio existente con estructura metálica?',
        respuesta:
          'Sí, y el acero es el sistema ideal para hacerlo: pesa mucho menos que el concreto, las piezas llegan listas para apernar y el montaje genera mínima interrupción sobre la operación del edificio. El proceso exige una evaluación estructural previa de la edificación existente conforme a la NSR-10, que determina si la cimentación y las columnas actuales soportan el piso adicional o requieren refuerzo. MEISA ejecuta tanto la evaluación de la conexión como la fabricación y el montaje.',
      },
      {
        pregunta: '¿Cuánto tiempo se ahorra frente a un edificio en sistema tradicional?',
        respuesta:
          'En cronograma de estructura, el ahorro típico está entre 30% y 50%. La razón es la simultaneidad: mientras en obra se ejecuta la cimentación, la estructura ya se está fabricando en planta. El montaje avanza por pisos completos con conexiones apernadas, sin esperar los 14 a 28 días de fraguado por nivel del concreto, y la lámina colaborante elimina la formaleta de las losas. En edificios de 4 a 8 pisos, eso suele representar varios meses menos de obra.',
      },
      {
        pregunta: '¿Los edificios metálicos cumplen la norma sismorresistente NSR-10?',
        respuesta:
          'Sí. El diseño de edificios en acero está regulado por el Título F de la NSR-10, que define los sistemas estructurales y sus grados de disipación de energía (DMI, DMO y DES) según la zona de amenaza sísmica. El acero es un material dúctil por naturaleza, lo que le permite deformarse y disipar energía durante un sismo sin colapsar. En MEISA fabricamos con soldadores calificados, conexiones diseñadas según la norma y trazabilidad de materiales con certificados de calidad.',
      },
    ],
    proyectosIntro:
      'Nuestra experiencia en edificaciones incluye el Edificio Colpatria en Neiva (902 toneladas), el Edificio de Cápsulas Blandas de Tecnoquímicas en Jamundí (508 toneladas), el Edificio Cítrico de Sucroal en Palmira (166 toneladas), el Parqueadero Tequendama en Cali (156 toneladas) y el World Trade Center Pacific (110 toneladas), entre 54 proyectos de edificaciones entregados en 14 ciudades.',
    categoriaEnum: 'EDIFICACIONES',
    categoriaSlug: 'edificaciones',
    statsPropios: [
      { valor: '14', label: 'Ciudades de Colombia' },
      { valor: '1998', label: 'Edificios desde' },
    ],
  },
]

export function getSolucion(slug: string): Solucion | undefined {
  return SOLUCIONES.find((s) => s.slug === slug)
}

export function getSolucionSlugs(): string[] {
  return SOLUCIONES.map((s) => s.slug)
}
