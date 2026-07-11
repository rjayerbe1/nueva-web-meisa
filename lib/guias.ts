// Configuración tipada de las 4 guías técnicas SEO standalone:
//   /precios-estructuras-metalicas    (variante "precios", layout propio)
//   /estructura-metalica-vs-concreto  (variante "template", GuiaTemplate)
//   /tipos-de-estructuras-metalicas   (variante "template", GuiaTemplate)
//   /peso-estructura-metalica-por-m2  (variante "template", GuiaTemplate)
//
// Este archivo es la FUENTE DE FALLBACK: el contenido editable vive en la
// tabla `landings_seo` (tipo GUIA) y se lee vía lib/content/landings.ts.
// Si la fila no existe o su Json no valida, las páginas usan estos configs.
import type { GuiaConfig } from '@/components/guias/GuiaTemplate'

/* ─── Contenido de la guía de precios (layout propio) ────────────────── */

export interface RangoPrecio {
  /** Etiqueta del tipo de estructura (col 1 de la tabla). */
  tipo: string
  /** Descripción / ejemplos (col 2). */
  ejemplos: string
  /** Rango COP/kg instalado (col 3), ej. "$10.900 – $13.000". */
  rango: string
}

export interface FactorPrecio {
  titulo: string
  descripcion: string
}

export interface GuiaPreciosFaq {
  pregunta: string
  respuesta: string
}

export interface GuiaPreciosContenido {
  variante: 'precios'
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  heroSub: string
  /** Imagen de portada del hero. Si no se define, se usa imagenCover de INDUSTRIAL. */
  heroImagen?: string
  breadcrumbName: string
  cotizacionEyebrow: string
  cotizacionTitulo1: string
  cotizacionTitulo2: string
  cotizacionParrafos: string[]
  rangosEyebrow: string
  rangosTitulo1: string
  rangosTitulo2: string
  rangosSubtitulo: string
  rangos: RangoPrecio[]
  /** Nota bajo la tabla (se antepone "Nota:" en negrita en el render). */
  rangosNota: string
  factoresEyebrow: string
  factoresTitulo1: string
  factoresTitulo2: string
  factores: FactorPrecio[]
  conversionEyebrow: string
  conversionTitulo1: string
  conversionTitulo2: string
  /** Párrafos; admiten **negrita** con doble asterisco. */
  conversionParrafos: string[]
  faqTitulo1: string
  faqTitulo2: string
  faq: GuiaPreciosFaq[]
  ctaEyebrow: string
  ctaTitulo1: string
  ctaTitulo2: string
  ctaDescripcion: string
}

/* ─── Wrapper común de guía ──────────────────────────────────────────── */

export interface GuiaTemplateContenido extends GuiaConfig {
  variante: 'template'
}

export type GuiaContenido = GuiaTemplateContenido | GuiaPreciosContenido

export interface GuiaLanding {
  slug: string
  /** Label legible en el admin. */
  titulo: string
  metaTitle: string
  metaDescription: string
  contenido: GuiaContenido
  /**
   * Última edición en /admin/landings (updatedAt de la fila). Señal de
   * frescura: fecha visible en la página + article:modified_time.
   * Undefined cuando la guía se sirve del fallback en código.
   */
  updatedAt?: Date
}

/* ─── Guía 1: precios ────────────────────────────────────────────────── */

const GUIA_PRECIOS: GuiaLanding = {
  slug: 'precios-estructuras-metalicas',
  titulo: 'Guía de precios — ¿Cuánto cuesta una estructura metálica?',
  metaTitle:
    '¿Cuánto Cuesta una Estructura Metálica en Colombia? Guía de Precios 2026 | MEISA',
  metaDescription:
    'Guía honesta de precios de estructura metálica en Colombia 2026: la estructura se cotiza por kg de acero fabricado y montado. Rangos orientativos por tipo de proyecto, factores que mueven el precio y conversión aproximada a m².',
  contenido: {
    variante: 'precios',
    heroEyebrow: 'Guía de precios 2026',
    heroTitulo1: '¿Cuánto cuesta una',
    heroTitulo2: 'estructura metálica?',
    heroSub:
      'Rangos reales del mercado colombiano, qué incluyen, qué los hace variar y cómo pasar de kilogramos a metros cuadrados. Sin rodeos ni promesas infladas.',
    breadcrumbName: '¿Cuánto cuesta una estructura metálica en Colombia?',
    cotizacionEyebrow: '01 — Cómo se cotiza',
    cotizacionTitulo1: 'Por kilogramo,',
    cotizacionTitulo2: 'no por m²',
    cotizacionParrafos: [
      'En Colombia las estructuras metálicas se cotizan por kilogramo de acero fabricado y montado, no por metro cuadrado. La razón es simple: dos edificios con la misma área pueden requerir cantidades de acero muy distintas según la luz libre, la altura, las cargas y la zona sísmica. El kilogramo instalado refleja el trabajo real: material, ingeniería de detalle, fabricación, protección anticorrosiva, transporte y montaje.',
      'Por eso, cuando alguien le cotiza una estructura "por m²" sin haber calculado el peso, está adivinando. El camino serio es: estimar (o calcular) los kilogramos de acero del proyecto y multiplicarlos por un precio por kg acorde con su complejidad. Esta guía le da los rangos del mercado para hacer ese ejercicio de manera informada.',
    ],
    rangosEyebrow: '02 — Rangos 2026',
    rangosTitulo1: 'Precio por kg',
    rangosTitulo2: 'instalado',
    rangosSubtitulo:
      'Rangos orientativos del mercado colombiano — cada proyecto se cotiza sobre planos',
    rangos: [
      {
        tipo: 'Estructura estándar (repetitiva)',
        ejemplos: 'Bodegas, naves industriales, cubiertas de luces medias',
        rango: '$10.900 – $13.000',
      },
      {
        tipo: 'Estructura de edificación / entrepiso',
        ejemplos: 'Edificios, entrepisos, mezzanines, plataformas industriales',
        rango: '$13.000 – $17.000',
      },
      {
        tipo: 'Estructura especial / alta complejidad',
        ejemplos: 'Puentes, grandes luces, cerchas, arcos, geometrías singulares',
        rango: '$17.000 – $25.000',
      },
    ],
    rangosNota:
      'el $/kg sube con la complejidad de fabricación y montaje, no con el peso. Una estructura liviana pero muy detallada (cerchas de gran luz, perfilería plegada) puede costar más por kilo que un pórtico pesado y repetitivo: lo liviano ahorra en kilos totales, no necesariamente en el precio por kilo. Los rangos incluyen fabricación, pintura y montaje; excluyen cimentación, cubierta y acabados. Precios de referencia 2026 en pesos colombianos.',
    factoresEyebrow: '03 — Las variables',
    factoresTitulo1: 'Qué hace variar',
    factoresTitulo2: 'el precio',
    factores: [
      {
        titulo: 'Peso de acero por m²',
        descripcion:
          'A mayor luz libre y mayores cargas (cubierta, puente grúa, sismo, viento), más kilogramos de acero por metro cuadrado. Es la variable que más mueve el costo total: una bodega liviana puede usar 25 kg/m² y una estructura de grandes luces superar los 60 kg/m².',
      },
      {
        titulo: 'Complejidad de las conexiones',
        descripcion:
          'Conexiones soldadas de momento, nudos de celosía o empalmes de obra exigen más horas de fabricación e inspección que conexiones simples apernadas. La geometría repetitiva abarata; la geometría única encarece.',
      },
      {
        titulo: 'Acabado y protección',
        descripcion:
          'Una pintura alquídica estándar, un sistema epóxico de alto desempeño o el galvanizado en caliente tienen costos muy distintos. El ambiente del proyecto (industrial, costero, urbano) define el sistema requerido.',
      },
      {
        titulo: 'Sitio y logística',
        descripcion:
          'La distancia desde planta, el estado de las vías, los permisos de carga extradimensionada y la disponibilidad de espacio en obra afectan el transporte y el montaje. Un sitio urbano congestionado o una zona de montaña cuestan más que un parque industrial plano.',
      },
      {
        titulo: 'Alturas y método de montaje',
        descripcion:
          'Montar a 6 m con grúa telescópica desde piso firme no cuesta lo mismo que izar a 30 m, lanzar un puente sobre un cauce o trabajar en jornadas nocturnas con cierres viales. El plan de izaje define equipos y rendimientos.',
      },
      {
        titulo: 'Volumen total del proyecto',
        descripcion:
          'El tonelaje total diluye los costos fijos de ingeniería, alistamiento de planta y movilización. Por eso el precio por kilogramo de un proyecto de 800 toneladas suele ser mejor que el de uno de 40.',
      },
    ],
    conversionEyebrow: '04 — De kg a m²',
    conversionTitulo1: 'Conversión',
    conversionTitulo2: 'aproximada',
    conversionParrafos: [
      'Si solo necesita un orden de magnitud temprano, puede convertir los rangos a metro cuadrado. Una bodega liviana típica consume entre **25 y 45 kg de acero por m²** según la luz libre, la altura y las cargas. Multiplicando por el rango de estructura estándar ($10.900 – $13.000 COP/kg), la sola estructura de una bodega se ubica aproximadamente entre **$272.000 y $585.000 COP por m²**.',
      'Insistimos: es una aproximación para presupuestar en etapa temprana, no una cotización. El peso real por m² solo se conoce con el diseño estructural, y es la cifra que separa un presupuesto serio de una sorpresa en obra.',
    ],
    faqTitulo1: 'Sobre costos',
    faqTitulo2: 'y cotizaciones',
    faq: [
      {
        pregunta:
          '¿Por qué las estructuras metálicas se cotizan por kilogramo y no por m²?',
        respuesta:
          'Porque el metro cuadrado no describe la estructura: dos bodegas de 1.000 m² pueden necesitar cantidades de acero muy distintas según la luz libre, la altura y las cargas. El kilogramo de acero fabricado y montado sí captura el trabajo real — material, fabricación, pintura, transporte y montaje — y permite comparar ofertas de manera transparente. El m² solo sirve como aproximación temprana, multiplicando el peso estimado por m² por el precio por kg.',
      },
      {
        pregunta: '¿La estructura metálica es más cara que el concreto?',
        respuesta:
          'Por kilogramo el acero parece más costoso, pero la comparación correcta es el costo total de obra terminada. La estructura metálica pesa menos (cimentaciones más económicas), se fabrica en planta mientras avanza la cimentación (meses menos de plazo) y elimina cimbras, encofrados y tiempos de curado. En bodegas de grandes luces, entrepisos sobre estructuras existentes y puentes, el costo total y la velocidad suelen favorecer al acero; en edificaciones de luces cortas el concreto puede competir. Cada proyecto merece su comparación con números reales.',
      },
      {
        pregunta: '¿Cuánto cuesta el diseño estructural?',
        respuesta:
          'Cuando MEISA desarrolla el proyecto completo (diseño + fabricación + montaje), la ingeniería de detalle está incluida en el precio por kilogramo. El diseño estructural como servicio independiente se cotiza según la complejidad y el alcance — típicamente como suma fija basada en el área o el tonelaje estimado del proyecto. Contar con diseño y fabricación en la misma casa evita sobrecostos por estructuras difíciles de fabricar o montar.',
      },
      {
        pregunta: '¿Cómo pido una cotización formal?',
        respuesta:
          'Envíenos los planos estructurales o el anteproyecto arquitectónico a través del formulario de contacto, indicando ubicación de la obra y plazos esperados. Con planos estructurales entregamos cotización detallada por kilogramo con peso calculado; con un anteproyecto entregamos un estimado preliminar y, si lo necesita, la propuesta de diseño estructural. No cotizamos cifras definitivas sin planos: sería engañarlo.',
      },
    ],
    ctaEyebrow: 'Pase de rangos a números reales',
    ctaTitulo1: 'Cotice con planos,',
    ctaTitulo2: 'no con promedios.',
    ctaDescripcion:
      'Envíenos los planos estructurales o el anteproyecto y reciba una cotización formal con peso de acero calculado, alcance y plazo.',
  },
}

/* ─── Guía 2: acero vs concreto ──────────────────────────────────────── */

const GUIA_VS_CONCRETO: GuiaLanding = {
  slug: 'estructura-metalica-vs-concreto',
  titulo: 'Guía — Estructura metálica vs concreto',
  metaTitle:
    'Estructura Metálica vs Concreto en Colombia: Comparación Real | MEISA',
  metaDescription:
    'Comparamos estructura metálica y concreto en Colombia: costo real, velocidad, luces libres, sismo y mantenimiento. Guía técnica con datos de 264 proyectos.',
  contenido: {
    variante: 'template',
    path: '/estructura-metalica-vs-concreto',
    breadcrumbName: 'Estructura metálica vs concreto: ¿cuál conviene?',
    heroEyebrow: 'Guía técnica de decisión',
    heroTitulo1: 'Acero vs',
    heroTitulo2: 'concreto',
    heroSub:
      'Estructura metálica vs concreto: comparación honesta, criterio por criterio, para que decida con datos y no con dogmas.',
    introEyebrow: '01 — La decisión',
    introTitulo1: '¿Cuál sistema',
    introTitulo2: 'conviene?',
    intro:
      'Elegir entre estructura metálica y concreto reforzado es una de las decisiones que más impacta el costo, el plazo y la flexibilidad de una obra. No hay un ganador universal: cada sistema tiene terrenos donde es claramente superior. En esta guía comparamos ambos, criterio por criterio, con la experiencia de MEISA fabricando y montando más de 32.000 toneladas de acero estructural en 264 proyectos desde 1996. El objetivo no es venderle acero: es que usted decida con datos y sepa exactamente cuándo conviene cada sistema.',
    categoriaHero: 'EDIFICACIONES',
    stats: [
      { valor: '264', label: 'Proyectos entregados' },
      { valor: '32.000', sufijo: '+', label: 'Toneladas de acero' },
      { valor: '59', label: 'Ciudades de Colombia' },
      { valor: '29', sufijo: '+', label: 'Años de experiencia' },
    ],
    secciones: [
      {
        titulo: 'Comparación honesta, criterio por criterio',
        parrafos: [
          "La discusión seria no es 'acero o concreto', sino qué criterio pesa más en su proyecto: presupuesto total, fecha de entrega, luces libres, condiciones del suelo o vida útil. Aquí está la comparación directa, sin inflar ninguno de los dos sistemas.",
        ],
        items: [
          {
            nombre: 'Costo directo de la estructura',
            descripcion:
              'En edificaciones de pórticos convencionales y luces cortas, el concreto suele tener menor costo directo por metro cuadrado de estructura: materiales locales, mano de obra abundante y formaletería amortizada. El acero, cotizado por kilogramo fabricado y montado, puede verse más caro en esa comparación aislada. Por eso este criterio, solo, nunca debería definir la decisión.',
          },
          {
            nombre: 'Costo total de obra',
            descripcion:
              'Cuando se suma el cuadro completo —cimentaciones más pequeñas por menor peso, semanas o meses menos de obra, menos equipos y campamento, menores costos financieros y apertura anticipada del negocio— la ecuación cambia. En bodegas, centros comerciales y ampliaciones, el costo total con acero es con frecuencia igual o menor que con concreto, y el lucro cesante evitado suele inclinar la balanza.',
          },
          {
            nombre: 'Velocidad de construcción',
            descripcion:
              'Es la ventaja más contundente del acero: la estructura se fabrica en planta mientras en obra avanzan las cimentaciones, y el montaje es atornillado, sin tiempos de fraguado ni formaleta. En proyectos comparables, una estructura metálica se entrega entre 40 % y 60 % más rápido que su equivalente en concreto vaciado en sitio.',
          },
          {
            nombre: 'Luces libres',
            descripcion:
              'El acero domina sin discusión. Con cerchas y vigas de alma llena se logran luces de 20, 30 o más de 40 metros sin columnas intermedias, algo que en concreto convencional resulta antieconómico por encima de 10 a 12 metros. Para bodegas, escenarios deportivos y plantas de espacios flexibles, esta es la razón técnica de fondo.',
          },
          {
            nombre: 'Peso sobre la cimentación',
            descripcion:
              'Una estructura metálica pesa típicamente entre la mitad y un tercio de su equivalente en concreto. Eso se traduce en cimentaciones más pequeñas y económicas, y es decisivo en suelos blandos —comunes en el Valle del Cauca y la costa— o al ampliar verticalmente un edificio existente sin reforzar toda su fundación.',
          },
          {
            nombre: 'Comportamiento sísmico',
            descripcion:
              'Ambos sistemas, bien diseñados bajo la NSR-10, son seguros en zonas de amenaza sísmica alta. El acero parte con dos ventajas físicas: alta ductilidad (disipa energía deformándose sin colapsar) y menor masa, que reduce la fuerza sísmica que la estructura debe resistir. El concreto bien detallado y supervisado también logra excelente desempeño; la diferencia real la hace la calidad del diseño y la construcción.',
          },
          {
            nombre: 'Mantenimiento y vida útil',
            descripcion:
              'El acero exige protección anticorrosiva —sistemas de pintura, galvanizado en ambientes agresivos— e inspecciones periódicas del recubrimiento; bien protegido, supera los 50 años de servicio. El concreto requiere menos mantenimiento superficial, pero no es inmune: fisuración, carbonatación y corrosión del refuerzo embebido son patologías reales y costosas de reparar porque ocurren dentro del elemento.',
          },
          {
            nombre: 'Sostenibilidad y reciclaje',
            descripcion:
              'El acero estructural es reciclable prácticamente al 100 % y conserva sus propiedades; gran parte del acero nuevo ya proviene de chatarra. Una estructura metálica además se puede desmontar, ampliar o reutilizar. El concreto carga con la huella de carbono del cemento y su demolición genera escombro de bajo aprovechamiento, aunque el sector avanza con cementos adicionados y agregados reciclados.',
          },
        ],
      },
      {
        titulo: '¿Cuál sistema gana según el tipo de obra?',
        parrafos: [
          'Si los criterios anteriores le parecen empate técnico, esta tabla mental resuelve el 90 % de los casos reales. Está construida sobre lo que vemos cotización tras cotización: hay tipos de obra donde el acero gana con claridad y otros donde el concreto sigue siendo la respuesta correcta.',
        ],
        items: [
          {
            nombre: 'Bodegas y naves industriales: acero',
            descripcion:
              'Grandes luces, alturas libres para puente grúa, montaje rápido y posibilidad de ampliar después. Es el terreno natural de la estructura metálica y donde la diferencia de plazo y costo total es más evidente.',
          },
          {
            nombre: 'Grandes luces y espacios abiertos: acero',
            descripcion:
              'Centros comerciales, coliseos, terminales de transporte y cubiertas especiales. Donde el diseño pide plantas libres sin columnas, el concreto convencional simplemente no compite. Proyectos como el C.C. Bochalema Plaza en Cali (1.781 t) existen con esa flexibilidad gracias al acero.',
          },
          {
            nombre: 'Ampliaciones sobre edificios existentes: acero',
            descripcion:
              'Su bajo peso evita reforzar cimentaciones, y el montaje atornillado permite trabajar con el negocio operando. Las ampliaciones del C.C. Campanario en Popayán (2.455 t) y del C.C. Único en Cali (1.800 t) se ejecutaron sobre centros comerciales en funcionamiento.',
          },
          {
            nombre: 'Plazos cortos u obra con fecha inamovible: acero',
            descripcion:
              'Si la obra debe abrir para una temporada comercial, una cosecha o un contrato con fecha de inicio, la fabricación en paralelo con la cimentación recorta el cronograma de forma que el concreto vaciado en sitio no puede igualar.',
          },
          {
            nombre: 'Puentes vehiculares y peatonales: acero o mixto',
            descripcion:
              'Luces grandes, montaje sobre vías o cauces sin suspender el tráfico y menor peso sobre apoyos hacen del acero —solo o en sección compuesta con losa de concreto— la opción dominante en puentes de luz media y grande.',
          },
          {
            nombre: 'Vivienda multifamiliar tipo: el concreto compite fuerte',
            descripcion:
              'Torres de apartamentos con plantas repetitivas y luces cortas son el terreno donde el concreto industrializado (muros vaciados, formaleta tipo túnel) logra costos y ritmos excelentes, con masa que favorece la acústica entre unidades. Aquí el acero rara vez es la opción más económica y hay que decirlo.',
          },
          {
            nombre: 'Sótanos y estructuras enterradas: concreto',
            descripcion:
              'Muros de contención, tanques y todo lo que trabaja contra el suelo y la humedad permanente es territorio del concreto reforzado. Ningún fabricante serio de estructura metálica propone otra cosa.',
          },
          {
            nombre: 'La respuesta frecuente: sistema híbrido',
            descripcion:
              'Muchos de los mejores proyectos combinan ambos: cimentación, sótanos y núcleos de circulación en concreto, con esqueleto metálico y entrepisos en lámina colaborante (steel deck) que aprovechan la velocidad y las luces del acero. No es una concesión: es ingeniería usando cada material donde rinde más.',
          },
        ],
      },
      {
        titulo: 'Mitos comunes que conviene aclarar',
        parrafos: [
          'Buena parte de las decisiones equivocadas —en ambas direcciones— nacen de ideas heredadas que la práctica ya desmintió. Estos son los mitos que más escuchamos en mesas de diseño y comités de obra.',
        ],
        items: [
          {
            nombre: '“El acero siempre es más caro”',
            descripcion:
              'Confunde costo directo de la estructura con costo total de obra. Cuando se incluyen cimentación, plazo, costos financieros y apertura anticipada, el acero empata o gana en bodegas, comercio, industria y ampliaciones. En vivienda tipo, en cambio, el mito suele ser cierto: por eso la comparación hay que hacerla por proyecto, no por dogma.',
          },
          {
            nombre: '“El acero se oxida y dura poco”',
            descripcion:
              'Con preparación de superficie y sistemas de protección correctos —pinturas epóxicas o poliuretano, galvanizado en caliente en ambientes agresivos— una estructura metálica supera los 50 años con mantenimiento razonable. Hay puentes metálicos en Colombia con más de un siglo en servicio. La corrosión es un riesgo de especificación deficiente, no una sentencia del material.',
          },
          {
            nombre: '“En un incendio el acero colapsa de inmediato”',
            descripcion:
              'El acero pierde resistencia a altas temperaturas, y por eso la norma exige protección pasiva —pinturas intumescentes, morteros proyectados, recubrimientos— calculada según el tiempo de resistencia requerido. Con esa protección cumple los mismos estándares exigidos a cualquier sistema. El concreto resiste mejor de forma inherente, pero también se degrada y descascara en incendios severos: ninguno se diseña ignorando el fuego.',
          },
          {
            nombre: '“Las estructuras metálicas vibran y suenan”',
            descripcion:
              'Un entrepiso metálico mal dimensionado puede vibrar, igual que una losa de concreto demasiado esbelta. El control de vibraciones es un criterio de diseño estándar (rigidez, masa, amortiguamiento) y los entrepisos en sección compuesta con steel deck logran el confort de una losa tradicional. Es un problema de diseño, no del material.',
          },
          {
            nombre: '“El concreto es tecnología del pasado”',
            descripcion:
              'Falso, y un fabricante de estructura metálica debería ser el primero en decirlo. El concreto sigue siendo insuperable en cimentaciones, sótanos, muros de contención y vivienda industrializada, y evoluciona con cementos adicionados y aditivos de alto desempeño. Desconfíe de quien descalifica en bloque al otro sistema: probablemente está vendiendo, no asesorando.',
          },
        ],
      },
      {
        titulo: 'Cómo evaluarlo para su proyecto',
        parrafos: [
          'La decisión correcta sale de comparar alternativas reales sobre el mismo anteproyecto: estructura en concreto, en acero y, casi siempre, una opción híbrida. Esa comparación debe incluir cimentación, plazo de obra y costo financiero, no solo el presupuesto de la estructura. Hecha así, la respuesta suele ser evidente.',
          'En MEISA hacemos esa evaluación desde la ingeniería: modelamos la alternativa metálica con software de análisis y BIM, la cotizamos sobre planos con peso real por kilogramo, y le decimos con franqueza cuándo el acero es la mejor opción y cuándo no lo es. Veintinueve años, 264 proyectos y 32.000 toneladas montadas en 59 ciudades nos permiten sostener esa franqueza: el acero gana lo suficiente por mérito propio como para no tener que exagerar.',
        ],
      },
    ],
    proyectosSlugs: [
      'arinsa-ampliacion-cc-campanario-popayan',
      'cc-unico-ampliacion-centro-comercial-cali',
      'centro-comercial-bochalema-plaza',
      'ingenio-providencia-complejo-piedechinche',
    ],
    proyectosIntro:
      'La comparación está respaldada por obra real ejecutada en acero: la ampliación del Centro Comercial Campanario en Popayán (2.454 toneladas montadas con el centro operando), la ampliación del Único en Cali (1.800 toneladas), el Centro Comercial Bochalema Plaza (1.781 toneladas) y el Complejo Industrial Piedechinche en El Cerrito (812 toneladas), entre 264 proyectos entregados desde 1996.',
    faq: [
      {
        pregunta:
          '¿Cuánto cuesta una estructura metálica frente a una de concreto en Colombia?',
        respuesta:
          'El costo del acero depende del peso por metro cuadrado, la complejidad de las conexiones, el acabado (pintura o galvanizado) y la logística de montaje. Como rango orientativo de mercado en 2026: estructura estándar y repetitiva (bodegas, naves) entre $10.900 y $13.000 COP/kg instalado, edificación y entrepisos entre $13.000 y $17.000, y estructuras especiales o puentes entre $17.000 y $25.000. La comparación justa con concreto se hace sobre costo total de obra —incluyendo cimentación y plazo—, donde el acero suele empatar o ganar en bodegas, comercio y ampliaciones. La cifra real solo sale de una cotización sobre planos.',
      },
      {
        pregunta: '¿Qué tanto más rápida es la construcción con estructura metálica?',
        respuesta:
          'En proyectos comparables, entre un 40 % y un 60 % más rápida que el concreto vaciado en sitio. La razón es estructural al proceso: mientras en obra se ejecutan las cimentaciones, la estructura ya se está fabricando en planta con corte CNC y soldadura calificada. El montaje es atornillado y no depende de fraguados ni formaleta, y los entrepisos en lámina colaborante reciben el vaciado de varios niveles en paralelo. En ampliaciones de edificios en operación, además, reduce drásticamente la interferencia con el negocio.',
      },
      {
        pregunta: '¿La estructura metálica es segura en un país sísmico como Colombia?',
        respuesta:
          'Sí. La NSR-10 regula ambos materiales para zonas de amenaza sísmica alta, y el acero parte con dos ventajas físicas: ductilidad, que le permite disipar energía deformándose sin colapso súbito, y menor masa, que reduce la fuerza sísmica sobre la estructura y la cimentación. Por eso es el material preferido en hospitales, puentes y edificios esenciales de países sísmicos como Japón y Chile. Un concreto bien detallado también es seguro: lo determinante es la calidad del diseño estructural, la fabricación y la supervisión.',
      },
      {
        pregunta: '¿Se pueden combinar estructura metálica y concreto en un mismo edificio?',
        respuesta:
          'No solo se puede: es la solución más frecuente en proyectos medianos y grandes. Lo típico es cimentación, sótanos y núcleos de ascensores en concreto reforzado, con esqueleto de columnas y vigas metálicas y entrepisos en sección compuesta con lámina colaborante (steel deck), donde el concreto y el acero trabajan juntos. Así cada material hace lo que mejor sabe: el concreto resiste el contacto con el suelo y aporta masa y rigidez, y el acero aporta luces libres, bajo peso y velocidad de montaje.',
      },
    ],
    faqTitulo1: 'Acero o concreto:',
    faqTitulo2: 'lo que nos preguntan',
    relacionados: [
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'Rangos reales de precio por kilogramo instalado en Colombia, factores que mueven el precio y conversión aproximada a m².',
      },
      {
        href: '/peso-estructura-metalica-por-m2',
        eyebrow: 'Guía',
        titulo: '¿Cuántos kg/m² pesa una estructura metálica?',
        descripcion:
          'Rangos reales de peso por metro cuadrado según el tipo de obra, con casos documentados de proyectos MEISA.',
      },
      {
        href: '/tipos-de-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Tipos de estructuras metálicas',
        descripcion:
          'Pórticos, cerchas, arcos y viga cajón: sistemas estructurales, perfiles, conexiones y normativa NSR-10 explicados.',
      },
      {
        href: '/soluciones/estructura-metalica-para-bodegas',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para bodegas',
        descripcion:
          'Diseño, fabricación y montaje de bodegas y naves industriales: 72 proyectos y más de 6.200 toneladas entregadas.',
      },
      {
        href: '/soluciones/edificios-en-estructura-metalica',
        eyebrow: 'Solución',
        titulo: 'Edificios en estructura metálica',
        descripcion:
          'Edificios corporativos, clínicos e industriales en acero: más de 3.500 toneladas en 14 ciudades desde 1998.',
      },
      {
        href: '/soluciones/estructura-metalica-centros-comerciales',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para centros comerciales',
        descripcion:
          'Más de 14.600 toneladas en retail, incluyendo ampliaciones ejecutadas sin cerrar la operación del centro comercial.',
      },
    ],
    ctaEyebrow: 'Compare con números reales',
    ctaTitulo1: 'Evalúe su proyecto',
    ctaTitulo2: 'sin dogmas.',
    ctaDescripcion:
      'Envíenos los planos o el anteproyecto y reciba la evaluación de la alternativa en acero: peso real, costo por kilogramo y plazo — y una opinión franca sobre si le conviene.',
  },
}

/* ─── Guía 3: tipos de estructuras ───────────────────────────────────── */

const GUIA_TIPOS: GuiaLanding = {
  slug: 'tipos-de-estructuras-metalicas',
  titulo: 'Guía — Tipos de estructuras metálicas',
  metaTitle: 'Tipos de Estructuras Metálicas: Guía Completa | MEISA',
  metaDescription:
    'Tipos de estructuras metálicas: pórticos, cerchas, arcos y viga cajón. Perfiles, conexiones y normativa NSR-10 explicados por MEISA, fabricante desde 1996.',
  contenido: {
    variante: 'template',
    path: '/tipos-de-estructuras-metalicas',
    breadcrumbName: 'Tipos de estructuras metálicas: guía completa',
    heroEyebrow: 'Guías técnicas',
    heroTitulo1: 'Tipos de estructuras',
    heroTitulo2: 'metálicas: guía completa',
    heroSub:
      'Pórticos, cerchas, arcos, sistemas colgantes y viga cajón: qué sistema conviene en cada proyecto, con qué perfiles se construye y qué exige la NSR-10.',
    introEyebrow: '01 — La guía',
    introTitulo1: 'Elegir el sistema',
    introTitulo2: 'define el proyecto',
    intro:
      'Las estructuras metálicas se clasifican por su sistema estructural — pórticos rígidos, cerchas, arcos, sistemas colgantes, vigas cajón — y por su uso: bodegas, puentes, edificios, cubiertas o escenarios. Elegir bien el sistema define el costo, el plazo y el comportamiento sísmico del proyecto. Esta guía explica cada tipo con criterios prácticos de selección, los perfiles y aceros que se usan en Colombia, las conexiones disponibles y la normativa aplicable. La escribe MEISA, fabricante colombiano con 264 proyectos y más de 32.000 toneladas montadas desde 1996.',
    categoriaHero: 'PUENTES',
    stats: [
      { valor: '264', label: 'Proyectos entregados' },
      { valor: '32.000', sufijo: '+', label: 'Toneladas de acero' },
      { valor: '59', label: 'Ciudades de Colombia' },
      { valor: '1996', label: 'Fabricando desde' },
    ],
    secciones: [
      {
        titulo: 'Clasificación por sistema estructural',
        parrafos: [
          'El sistema estructural describe cómo la estructura lleva las cargas hasta la cimentación: por flexión, por trabajo axial en tracción y compresión, o por una combinación de ambos. Es la clasificación más útil para entender por qué un mismo programa — cubrir 40 metros de luz, por ejemplo — puede resolverse con soluciones de peso y costo muy distintos.',
          'En la práctica colombiana, cinco sistemas cubren la gran mayoría de los proyectos en acero. Cada uno tiene un rango de luces donde es competitivo; salirse de ese rango suele encarecer el kilo de acero sin ganar desempeño.',
        ],
        items: [
          {
            nombre: 'Pórticos rígidos',
            descripcion:
              'Columnas y vigas unidas con conexiones a momento que forman marcos estables en su propio plano. Es el sistema más usado en bodegas y naves industriales de 15 a 40 m de luz, con perfiles de alma llena o armados de altura variable que concentran el material donde el momento flector es mayor. Permite alturas libres a la medida de estanterías y puentes grúa.',
          },
          {
            nombre: 'Cerchas y celosías',
            descripcion:
              'Estructuras trianguladas cuyos elementos trabajan solo a tracción o compresión, sin flexión significativa. Son la opción más liviana para luces mayores de 30-40 m: cubiertas de centros comerciales, coliseos y naves sin columnas intermedias. La ampliación del C.C. Campanario en Popayán — 2.454 toneladas fabricadas y montadas por MEISA — resolvió sus grandes luces con este sistema.',
          },
          {
            nombre: 'Arcos',
            descripcion:
              'Trabajan predominantemente a compresión transfiriendo las cargas por su geometría curva. Cubren grandes luces con secciones esbeltas y aportan valor arquitectónico, por lo que son frecuentes en coliseos, hangares y cubiertas emblemáticas. Exigen controlar el empuje horizontal en los apoyos mediante tirantes o contrafuertes.',
          },
          {
            nombre: 'Sistemas colgantes y atirantados',
            descripcion:
              'Cables o tirantes a tracción sostienen el tablero o la cubierta desde pilones o mástiles. Aprovechan al máximo el acero — la tracción pura no pandea — y permiten luces que otros sistemas no alcanzan. En Colombia se usan en puentes peatonales, ciclopuentes y cubiertas de escenarios donde se busca despejar por completo el espacio inferior.',
          },
          {
            nombre: 'Viga cajón',
            descripcion:
              'Sección cerrada armada de lámina con gran rigidez a torsión y flexión. Es el sistema típico de los puentes vehiculares metálicos de luces medias y grandes, incluyendo trazados curvos donde la torsión gobierna el diseño. MEISA la ha fabricado en puentes como el Cascada (537 t) y el Ovejas (536 t) en el Cauca.',
          },
        ],
      },
      {
        titulo: 'Clasificación por uso: qué sistema conviene en cada proyecto',
        parrafos: [
          'El uso del proyecto acota rápidamente los sistemas viables: las cargas, las luces y las condiciones de montaje de una bodega no se parecen a las de un puente o un coliseo. Esta es la correspondencia más frecuente en los proyectos que MEISA ha entregado en 59 ciudades de Colombia.',
        ],
        items: [
          {
            nombre: 'Bodegas y naves industriales',
            categoria: 'INDUSTRIAL',
            descripcion:
              'Pórticos rígidos a dos aguas para luces de 15 a 40 m; cerchas cuando la luz o la carga de cubierta lo exigen. Se complementan con correas formadas en frío y, si la operación lo requiere, vigas carrileras para puente grúa. Es la tipología que MEISA desarrolla en su solución de estructura metálica para bodegas, con 72 proyectos industriales entregados, como el CEDI Tecnosur en Villa Rica (840 t).',
          },
          {
            nombre: 'Puentes vehiculares y peatonales',
            categoria: 'PUENTES',
            descripcion:
              'Vigas cajón y vigas armadas de alma llena para puentes vehiculares; celosías, arcos y sistemas atirantados para puentes peatonales y ciclopuentes. La fabricación en planta y el montaje por lanzamiento o izaje reducen la afectación al tráfico. MEISA ha fabricado 46 puentes — más de 4.600 toneladas — detallados en su solución de puentes metálicos.',
          },
          {
            nombre: 'Edificios de varios pisos',
            categoria: 'EDIFICACIONES',
            descripcion:
              'Pórticos resistentes a momento o combinados con arriostramientos, con entrepisos de vigas, viguetas y lámina colaborante que se funden sin formaleta. El acero reduce el peso sísmico del edificio y acelera el ciclo por piso. Ejemplos MEISA: el edificio Colpatria en Neiva (902 t) y la estructura del World Trade Center (247 t).',
          },
          {
            nombre: 'Cubiertas y grandes luces comerciales',
            categoria: 'COMERCIAL',
            descripcion:
              'Cerchas, arcos y estructuras espaciales para centros comerciales, terminales y plazas cubiertas donde el área libre es el requisito dominante. Aquí el acero compite sin rival: en concreto, esas luces son antieconómicas o inviables. MEISA suma 54 proyectos comerciales con más de 14.600 toneladas.',
          },
          {
            nombre: 'Escenarios deportivos y educativos',
            categoria: 'DEPORTES_EDUCACION',
            descripcion:
              'Cerchas de gran luz, arcos y voladizos para graderías cubiertas, coliseos y aulas múltiples. La estructura suele quedar a la vista, así que el detallado y el acabado pesan tanto como el cálculo. MEISA fabricó el coliseo de fútbol sala de los Juegos Nacionales de Popayán (267 t) y cinco coliseos del Plan Colombia en el Cauca.',
          },
          {
            nombre: 'Infraestructura urbana',
            categoria: 'INFRAESTRUCTURA_URBANA',
            descripcion:
              'Estaciones de transporte masivo, paraderos, pérgolas y puentes peatonales urbanos que combinan pórticos, celosías y secciones tubulares a la vista. MEISA fabricó la Terminal Intermedia del MIO en Cali (654 t) y estaciones de Transmilenio en Bogotá (424 t).',
          },
        ],
      },
      {
        titulo: 'Perfiles y materiales: con qué se construye',
        parrafos: [
          'Definido el sistema, el ingeniero selecciona los perfiles. La elección depende de la solicitación de cada elemento — flexión, compresión, tracción — y de la disponibilidad comercial en Colombia, donde conviven perfiles importados de catálogo americano y europeo con perfiles armados fabricados en planta.',
          'En materiales, las especificaciones dominantes son ASTM A36 (esfuerzo de fluencia de 250 MPa) para elementos secundarios y láminas de uso general, y ASTM A572 Grado 50 (345 MPa) para elementos principales: con 38 % más de fluencia a un costo por kilo similar, el A572-50 produce estructuras más livianas y es hoy el estándar de facto en perfiles armados y puentes. Toda compra seria debe exigir certificados de calidad de acería (mill certificates) que garanticen la trazabilidad del material.',
        ],
        items: [
          {
            nombre: 'Perfiles laminados en caliente (W, HEA, IPE)',
            descripcion:
              'Secciones en I producidas en acería: serie W americana (AISC) y series HEA/HEB e IPE europeas. Son la primera opción para columnas y vigas de edificios y estructuras industriales por su disponibilidad, propiedades certificadas y rapidez de detallado.',
          },
          {
            nombre: 'Perfiles armados de lámina',
            descripcion:
              'Secciones en I, H o cajón soldadas en planta a partir de lámina cortada con CNC. Permiten dimensiones exactas a la demanda del cálculo — incluyendo altura variable — y son la base de los pórticos de bodegas optimizados y de las vigas de puentes. Su calidad depende directamente del control de soldadura del fabricante.',
          },
          {
            nombre: 'Perfiles tubulares (HSS)',
            descripcion:
              'Secciones huecas circulares, cuadradas o rectangulares (típicamente ASTM A500). Excelente desempeño a compresión y torsión y apariencia limpia, por lo que dominan en celosías a la vista, arcos, pérgolas y estructuras arquitectónicas de escenarios y espacio público.',
          },
          {
            nombre: 'Perfiles formados en frío (correas C y Z)',
            descripcion:
              'Láminas delgadas dobladas en frío que conforman correas de cubierta y fachada, viguetas livianas y elementos secundarios. Aportan poco peso por metro cuadrado y se traslapan para dar continuidad. Se diseñan por el capítulo F.4 de la NSR-10.',
          },
          {
            nombre: 'Ángulos, platinas y barras',
            descripcion:
              'Perfiles L (ángulos), platinas y barras macizas, casi siempre en ASTM A36. Son los elementos secundarios por excelencia: arriostramientos, montantes y diagonales de celosías livianas, cartelas y platinas de conexión. Se cortan, punzonan y barrenan en planta a la medida exacta del despiece.',
          },
          {
            nombre: 'Lámina colaborante (steel deck)',
            descripcion:
              'Lámina de acero grecada y galvanizada que funciona a la vez como formaleta y como refuerzo a tracción en entrepisos compuestos acero-concreto, eliminando la formaleta tradicional. Con conectores de cortante hace que la losa trabaje en conjunto con las vigas: es el sistema de piso estándar en edificios metálicos.',
          },
        ],
      },
      {
        titulo: 'Conexiones: pernadas, soldadas y precalificadas',
        parrafos: [
          'Las conexiones son el punto crítico de toda estructura metálica: por ellas pasan las cargas entre elementos y en ellas se concentra la demanda sísmica. La regla de oro de la industria es soldar en planta y pernar en obra — la soldadura de taller se ejecuta en posición, bajo techo y con inspección directa, mientras el perno permite un montaje rápido, verificable y sin dependencia del clima.',
          'Para edificaciones con capacidad de disipación de energía moderada o especial (DMO/DES), la NSR-10 exige que las conexiones a momento demuestren su desempeño cíclico. Lo usual es emplear conexiones precalificadas — geometrías ya ensayadas y normalizadas como las del estándar AISC 358: placa de extremo extendida (end-plate), viga de sección reducida (RBS) o placas de ala soldadas — que evitan ensayos de laboratorio proyecto por proyecto.',
        ],
        items: [
          {
            nombre: 'Conexiones pernadas',
            descripcion:
              'Usan pernos de alta resistencia ASTM F3125 (grados A325 y A490) en juntas de aplastamiento o de deslizamiento crítico. Ventajas: montaje veloz, control en obra por torque o tensión calibrada, y posibilidad de desmontar o ampliar. Son el estándar para empalmes de campo en vigas, columnas y celosías.',
          },
          {
            nombre: 'Conexiones soldadas',
            descripcion:
              'Filetes y penetraciones completas ejecutadas bajo AWS D1.1, con procedimientos (WPS) calificados y soldadores certificados. Logran continuidad total y nudos rígidos compactos. Las soldaduras críticas se verifican con ensayos no destructivos: ultrasonido, tintas penetrantes o partículas magnéticas.',
          },
          {
            nombre: 'Conexiones precalificadas a momento',
            descripcion:
              'Configuraciones normalizadas (AISC 358 / NSR-10 F.3.9) cuyo comportamiento ante carga cíclica ya fue demostrado en laboratorio. Garantizan que la rótula plástica se forme en la viga y no en la conexión, condición esencial del diseño sismo resistente en pórticos DMO y DES.',
          },
        ],
      },
      {
        titulo: 'Normativa colombiana: NSR-10, AWS y AISC',
        parrafos: [
          'En Colombia toda estructura metálica de edificación se rige por el Título F de la NSR-10 (Reglamento Colombiano de Construcción Sismo Resistente). El capítulo F.2 — basado en la especificación AISC 360 — cubre el diseño de miembros y conexiones; el F.3 — basado en AISC 341 — establece las provisiones sísmicas para pórticos y arriostramientos con disipación de energía; y el F.4 regula los perfiles formados en frío. Los puentes se diseñan por el Código Colombiano de Puentes CCP-14, basado en AASHTO LRFD.',
          'La normativa no se queda en el cálculo: exige calidad verificable en la ejecución. La soldadura estructural debe cumplir AWS D1.1, lo que implica procedimientos de soldadura calificados, soldadores certificados por posición y proceso, e inspección con ensayos no destructivos según el tipo de junta. Los materiales deben llegar con certificados ASTM trazables, y los proyectos de cierta envergadura requieren supervisión técnica independiente conforme al Título I de la NSR-10.',
          'Para quien contrata, la implicación práctica es directa: el fabricante debe poder demostrar — con WPS, certificados de soldadores, registros dimensionales y de ensayos — que lo que sale de su planta cumple lo que el diseñador especificó. MEISA fabrica bajo estos estándares en sus plantas de Jamundí y Popayán, con corte CNC, soldadores calificados AWS D1.1 y trazabilidad por pieza desde el modelo BIM hasta el montaje.',
        ],
      },
      {
        titulo: 'Cómo elegir el tipo de estructura para su proyecto',
        parrafos: [
          'La selección parte de tres preguntas: cuál es la luz libre que el uso exige, qué cargas debe resistir la estructura (cubierta liviana, entrepisos, puente grúa, tráfico vehicular) y qué condiciones impone el sitio (sismicidad, viento, acceso para montaje). Con esas variables, el rango de sistemas competitivos se reduce a uno o dos candidatos, y la decisión final la dan el peso de acero por metro cuadrado y el plazo de fabricación y montaje.',
          'Un buen fabricante participa desde la ingeniería: optimizar el sistema y las conexiones antes de comprar el acero ahorra más que cualquier descuento posterior. Si está evaluando un proyecto, el equipo de ingeniería de MEISA puede revisar sus planos o anteproyecto y proponer la alternativa estructural más eficiente, con cotización formal sobre cantidades reales.',
        ],
      },
    ],
    proceso: [
      {
        titulo: 'Ingeniería y modelado BIM',
        descripcion:
          'Diseño o revisión estructural según NSR-10 y modelado de detalle en 3D: cada pieza, conexión y perno queda definido antes de cortar el primer perfil.',
      },
      {
        titulo: 'Fabricación con corte CNC',
        descripcion:
          'Corte CNC, armado y soldadura bajo AWS D1.1 con soldadores calificados y control dimensional por conjunto en las plantas de Jamundí y Popayán.',
      },
      {
        titulo: 'Acabado y logística',
        descripcion:
          'Limpieza, pintura o galvanizado según especificación, codificación pieza por pieza y despachos coordinados a cualquier región del país.',
      },
      {
        titulo: 'Montaje certificado',
        descripcion:
          'Izaje y conexión en obra con personal propio certificado para trabajo en alturas, equipos de izaje adecuados al sitio y entrega con registros de calidad.',
      },
    ],
    procesoTitulo1: 'Cualquier tipo,',
    procesoTitulo2: 'el mismo rigor',
    proyectosSlugs: [
      'arinsa-ampliacion-cc-campanario-popayan',
      'estructura-metalica-y-cubierta-en-neiva',
      'tecnosur-centro-distribucion-villa-rica',
      'consorcio-metrovial-sb-terminal-intermedio',
      'casa-puente-cascada',
      'consorcio-mj-2011-coliseo-futbol-sala',
    ],
    proyectosIntro:
      'Cada sistema de esta guía está construido en obra real: cerchas de gran luz en la ampliación del C.C. Campanario (2.454 t), pórticos de edificio en el Colpatria de Neiva (902 t), pórticos industriales en el CEDI Tecnosur (840 t), celosías urbanas en la Terminal Intermedia del MIO (654 t), viga cajón en el Puente Cascada (537 t) y arcos y cerchas deportivas en el Coliseo de Fútbol Sala de Popayán (267 t).',
    faq: [
      {
        pregunta: '¿Cuál es el tipo de estructura metálica más usado en Colombia?',
        respuesta:
          'El pórtico rígido es el sistema más extendido porque resuelve la tipología más demandada: bodegas y naves industriales de 15 a 40 metros de luz, con buen comportamiento sísmico y peso optimizado mediante perfiles armados de altura variable. Le siguen las cerchas y celosías, dominantes en cubiertas de grandes luces — centros comerciales, coliseos — y los entrepisos con lámina colaborante en edificios. La elección correcta depende de la luz libre, las cargas y el uso, no de la popularidad del sistema.',
      },
      {
        pregunta: '¿Cuándo conviene usar cerchas en lugar de vigas de alma llena?',
        respuesta:
          'Como regla práctica, a partir de 25 a 30 metros de luz la cercha empieza a ganar: al triangular la estructura, sus elementos trabajan a tracción y compresión puras y el peso de acero crece mucho más lento con la luz que en una viga de alma llena. Por debajo de ese rango, la viga de alma llena suele ser más económica porque su fabricación es más simple y rápida. También favorecen a la cercha las cargas pesadas de cubierta y la necesidad de pasar instalaciones a través de la estructura.',
      },
      {
        pregunta: '¿Qué es mejor: conexiones pernadas o soldadas?',
        respuesta:
          'No compiten: se complementan. La práctica óptima es soldar en planta — donde la junta se ejecuta en posición, bajo techo y con inspección directa según AWS D1.1 — y pernar en obra con pernos de alta resistencia ASTM F3125 (A325/A490), que permiten un montaje rápido y verificable sin depender del clima. En zonas de amenaza sísmica alta, las conexiones a momento de pórticos DMO y DES deben además ser precalificadas (AISC 358 / NSR-10 F.3.9) para garantizar su desempeño ante carga cíclica.',
      },
      {
        pregunta: '¿Qué acero se usa en las estructuras metálicas en Colombia?',
        respuesta:
          'Los dos materiales dominantes son ASTM A36, con fluencia de 250 MPa, para elementos secundarios y láminas de uso general, y ASTM A572 Grado 50, con fluencia de 345 MPa, para elementos principales, perfiles armados y puentes. El A572-50 ofrece 38 % más resistencia a un costo por kilo similar, por lo que produce estructuras más livianas y es el estándar actual. Los tubulares suelen ser ASTM A500. En todos los casos debe exigirse el certificado de calidad de acería que garantiza la trazabilidad del material.',
      },
      {
        pregunta: '¿Cuánto cuesta una estructura metálica por kilo instalado?',
        respuesta:
          'Depende del tipo de estructura, la complejidad de las conexiones, el acabado (pintura o galvanizado), la ciudad de montaje y el precio del acero del momento. Como rango orientativo de mercado en Colombia: estructura estándar y repetitiva (correas, cubiertas y pórticos de bodega) entre $10.900 y $13.000 COP/kg instalado; edificación y entrepisos entre $13.000 y $17.000; y estructura especial o puentes entre $17.000 y $25.000. Son referencias para presupuestar en etapa temprana — la cotización real se hace sobre planos y cantidades.',
      },
    ],
    faqTitulo1: 'Sobre tipos',
    faqTitulo2: 'y sistemas',
    relacionados: [
      {
        href: '/soluciones/estructura-metalica-para-bodegas',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para bodegas',
        descripcion:
          'Pórticos rígidos, cerchas y mezzanines para bodegas y naves industriales: 72 proyectos y más de 6.200 toneladas entregadas.',
      },
      {
        href: '/soluciones/puentes-metalicos',
        eyebrow: 'Solución',
        titulo: 'Puentes metálicos',
        descripcion:
          'Viga cajón, celosías y arcos para puentes vehiculares y peatonales: 46 puentes y más de 4.600 toneladas bajo CCP-14.',
      },
      {
        href: '/soluciones/cubiertas-metalicas',
        eyebrow: 'Solución',
        titulo: 'Cubiertas metálicas para grandes luces',
        descripcion:
          'Cerchas, arcos y cubiertas autoportantes para coliseos, colegios e industria: más de 57.000 m² instalados.',
      },
      {
        href: '/soluciones/estructura-metalica-escenarios-deportivos',
        eyebrow: 'Solución',
        titulo: 'Coliseos y escenarios deportivos',
        descripcion:
          '28 escenarios deportivos y educativos en acero, incluidos los Juegos Nacionales 2012 y los Juegos Mundiales 2013.',
      },
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'Rangos reales de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
      },
      {
        href: '/estructura-metalica-vs-concreto',
        eyebrow: 'Guía',
        titulo: 'Estructura metálica vs concreto',
        descripcion:
          'Comparación honesta criterio por criterio: costo, velocidad, luces, sismo y mantenimiento.',
      },
    ],
    ctaEyebrow: 'Defina el sistema correcto',
    ctaTitulo1: 'Su proyecto merece',
    ctaTitulo2: 'ingeniería real.',
    ctaDescripcion:
      'Envíenos los planos o el anteproyecto: proponemos el sistema estructural más eficiente y entregamos cotización formal con peso de acero, alcance y plazo.',
  },
}

/* ─── Guía 4: peso por m² ────────────────────────────────────────────── */

const GUIA_PESO: GuiaLanding = {
  slug: 'peso-estructura-metalica-por-m2',
  titulo: 'Guía — Peso de estructura metálica por m²',
  metaTitle:
    '¿Cuántos kg/m² pesa una estructura metálica? Rangos reales | MEISA',
  metaDescription:
    'Rangos reales de peso por m²: bodegas 25-45 kg/m², con puente grúa 45-70, entrepisos 60-100. Datos de 264 proyectos ejecutados por MEISA en Colombia.',
  contenido: {
    variante: 'template',
    path: '/peso-estructura-metalica-por-m2',
    breadcrumbName: '¿Cuántos kilos por m² pesa una estructura metálica?',
    heroEyebrow: 'Guía técnica para presupuestar',
    heroTitulo1: 'Kilos por m²:',
    heroTitulo2: 'rangos reales',
    heroSub:
      '¿Cuántos kilos por m² pesa una estructura metálica? Rangos por tipo de obra, qué dispara el peso y cómo convertirlo en presupuesto.',
    introEyebrow: '01 — El dato que falta',
    introTitulo1: 'Del anteproyecto',
    introTitulo2: 'al presupuesto',
    intro:
      'El peso por metro cuadrado es el dato que convierte un anteproyecto en un presupuesto: kg/m² × precio por kilo instalado da el orden de magnitud de la estructura antes de tener planos de taller. El problema es que los valores que circulan en internet mezclan tipologías que no se parecen en nada. En esta guía MEISA comparte los rangos que observamos en nuestra práctica real —más de 32.000 toneladas fabricadas en 264 proyectos desde 1996— separados por tipo de obra, con los factores que disparan el peso y un método claro para estimar presupuesto.',
    categoriaHero: 'INDUSTRIAL',
    stats: [
      { valor: '264', label: 'Proyectos entregados' },
      { valor: '32.000', sufijo: '+', label: 'Toneladas de acero' },
      { valor: '59', label: 'Ciudades de Colombia' },
      { valor: '2', label: 'Plantas de fabricación' },
    ],
    secciones: [
      {
        titulo: 'Rangos reales de peso por tipo de obra',
        parrafos: [
          'No existe un kg/m² universal: una cubierta liviana de bodega y un entrepiso farmacéutico pueden diferir por un factor de 5. Los rangos siguientes son orientativos de la práctica MEISA, calculados sobre proyectos ejecutados con tonelaje y área documentados. Úselos para predimensionar; el peso real solo sale del cómputo del modelo estructural.',
          'Una aclaración importante: el kg/m² depende de qué incluye el alcance. Estos rangos cubren la estructura principal y secundaria (columnas, vigas o cerchas, correas, arriostramientos y conexiones), sin teja, sin lámina colaborante ni concreto de losa.',
        ],
        items: [
          {
            nombre: 'Bodega liviana (solo cubierta, luces 15–25 m): 25–45 kg/m²',
            descripcion:
              'Pórticos o cerchas con correas, sin cargas colgadas relevantes. Es el rango típico de bodegas de almacenamiento y naves logísticas. Cubiertas muy optimizadas en luces cortas pueden bajar de 25 kg/m².',
          },
          {
            nombre: 'Bodega con puente grúa o carga de proceso: 45–70 kg/m²',
            descripcion:
              'Las vigas carrilera, las ménsulas y las columnas robustecidas suben el ratio frente a una bodega de solo cubierta. Es el rango habitual de plantas de producción y centros de distribución con equipos de izaje.',
          },
          {
            nombre: 'Entrepisos de edificios y centros comerciales: 60–100 kg/m²',
            descripcion:
              'Vigas de piso para lámina colaborante más columnas y sistema sismorresistente. Con cargas industriales pesadas (equipos de proceso en varios niveles) el ratio puede superar con creces el rango típico — esos casos se evalúan siempre con el calculista.',
          },
          {
            nombre: 'Cubiertas deportivas de grandes luces: 35–60 kg/m²',
            descripcion:
              'Cerchas y celosías espaciales que salvan entre 30 y 60 metros sin apoyos intermedios, típicas de coliseos y escenarios deportivos. La geometría de la cubierta y las cargas colgadas (iluminación, sonido, tableros) pueden empujar el ratio hacia arriba.',
          },
          {
            nombre: 'Puentes: no se miden en kg/m², se miden por luz y metro lineal',
            descripcion:
              'En puentes vehiculares el peso lo gobiernan la luz libre, el ancho de calzada y la carga viva de la norma CCP-14, no el área. Para presupuestar un puente pida toneladas por luz sobre el perfil del cruce, nunca un kg/m² genérico.',
          },
        ],
      },
      {
        titulo: 'Qué dispara el peso de una estructura metálica',
        parrafos: [
          'Dos bodegas del mismo tamaño pueden diferir 30 kg/m² por decisiones que se toman en la etapa de diseño. Si está presupuestando, estos son los cinco factores que debe verificar antes de fijar un ratio:',
        ],
        items: [
          {
            nombre: 'Luz libre entre apoyos',
            descripcion:
              'Es el factor dominante. El momento flector crece con el cuadrado de la luz: pasar de 20 a 30 m de luz no sube el peso 50%, puede subirlo 80–100% en los elementos principales. Cada columna intermedia que el proceso permita instalar es acero que se ahorra.',
          },
          {
            nombre: 'Cargas de uso y equipos colgados',
            descripcion:
              'Tuberías, ductos HVAC, bandejas eléctricas, cielos y equipos suspendidos suman carga muerta que a veces no aparece en la solicitud inicial. En plantas industriales y farmacéuticas las cargas de proceso por nivel son la razón de ratios de 120–185 kg/m² en entrepisos.',
          },
          {
            nombre: 'Puente grúa',
            descripcion:
              'No solo agrega la viga carrilera: introduce cargas dinámicas de impacto y frenado que robustecen columnas, ménsulas y arriostramientos. Una grúa de 10 t puede mover el ratio de la nave 15–25 kg/m² respecto a la misma bodega sin grúa.',
          },
          {
            nombre: 'Zona de amenaza sísmica',
            descripcion:
              'Colombia se divide en amenaza baja, intermedia y alta según NSR-10. En zona alta —Cali, Popayán, el Eje Cafetero— el sistema de resistencia sísmica exige más arriostramientos, conexiones precalificadas y secciones con requisitos de ductilidad, lo que sube el peso frente al mismo edificio en zona baja.',
          },
          {
            nombre: 'Deflexiones y vibraciones',
            descripcion:
              'Muchas veces no manda la resistencia sino el estado límite de servicio: límites de deflexión en cubiertas con equipos, control de vibración en entrepisos de oficinas o laboratorios. Cumplir L/360 en lugar de L/240 implica secciones con más inercia, es decir, más kilos.',
          },
        ],
      },
      {
        titulo: 'Cómo estimar el presupuesto: kg/m² × precio por kilo',
        parrafos: [
          'El método para una cifra de anteproyecto tiene tres pasos. Primero, ubique su obra en el rango de tipología correcto y elija un valor conservador dentro del rango si todavía hay incertidumbre en cargas o luces. Segundo, multiplique por el área cubierta o construida en estructura metálica. Tercero, multiplique las toneladas resultantes por el precio por kilo instalado vigente, que detallamos en nuestra guía de precios de estructuras metálicas.',
          'Ejemplo: una bodega de 2.000 m² con puente grúa de 5 t. Ratio estimado: 55 kg/m² → 110 toneladas. Con un precio de referencia de $14.000 COP/kg instalado, el orden de magnitud de la estructura es de unos $1.540 millones COP, sin incluir cimentación, cerramientos ni teja. Esa cifra sirve para evaluar viabilidad y comparar alternativas; la cotización real se hace sobre planos o, mejor, sobre un modelo estructural.',
          'Dos errores frecuentes al aplicar el método: usar el área del lote en vez del área cubierta en acero, y aplicar el ratio de bodega liviana a una nave que sí lleva grúa o mezanines. Ambos producen presupuestos que después no cierran contra la cotización.',
        ],
      },
      {
        titulo: 'Optimizar peso con BIM ahorra más que negociar el precio por kilo',
        parrafos: [
          'En la negociación típica el comprador pelea $300–$500 COP por kilo. Pero el ahorro grande no está en el precio: está en los kilos. Una optimización de ingeniería que baje el ratio de 48 a 40 kg/m² en una nave de 10.000 m² elimina 80 toneladas; a $14.000/kg son unos $1.120 millones COP, varias veces lo que se obtiene regateando el precio unitario sobre el mismo tonelaje.',
          'Por eso MEISA modela cada proyecto en Tekla Structures antes de fabricar. El modelo BIM permite comparar alternativas de configuración —pórtico contra cercha, separación de pórticos, posición de arriostramientos—, verificar conexiones con IDEA StatiCa y obtener el cómputo de peso exacto, pieza por pieza, antes de comprar el primer perfil. El peso que cotizamos es el del modelo estructural, no un estimado inflado con márgenes de seguridad comerciales.',
          'La conclusión práctica para quien presupuesta: involucre al fabricante en la etapa de ingeniería. Un diseño revisado por quien fabrica y monta encuentra kilos innecesarios que un ajuste de precio nunca va a compensar, y reduce además sorpresas de plazo en taller y en obra.',
        ],
      },
    ],
    proceso: [
      {
        titulo: 'Datos básicos de la obra',
        descripcion:
          'Definimos con usted área cubierta, luces requeridas, uso, cargas de equipos, puente grúa y municipio (zona de amenaza sísmica NSR-10). Con esto se ubica la tipología correcta.',
      },
      {
        titulo: 'Estimación con ratios reales',
        descripcion:
          'Aplicamos los kg/m² de proyectos MEISA comparables ya ejecutados para entregar un orden de magnitud de toneladas y presupuesto en días, no semanas.',
      },
      {
        titulo: 'Modelo estructural en Tekla',
        descripcion:
          'Si el proyecto avanza, modelamos la estructura completa en BIM, optimizamos secciones y conexiones, y obtenemos el peso exacto pieza por pieza.',
      },
      {
        titulo: 'Cotización cerrada sobre el modelo',
        descripcion:
          'Cotizamos fabricación y montaje sobre el tonelaje del modelo, con cronograma de taller en nuestras plantas de Jamundí y Popayán y plan de montaje en obra.',
      },
    ],
    procesoTitulo1: 'Del ratio',
    procesoTitulo2: 'al peso exacto',
    proyectosSlugs: [
      'cc-unico-ampliacion-centro-comercial-cali',
      'tecnosur-centro-distribucion-villa-rica',
      'puente-vehicular-ovejas',
      'consorcio-mj-2011-coliseo-futbol-sala',
    ],
    proyectosIntro:
      'Los ratios de esta guía salen de la práctica real de MEISA: más de 250 proyectos documentados con tonelaje y área en bodegas, centros comerciales, edificios, cubiertas deportivas y puentes en toda Colombia desde 1996.',
    faq: [
      {
        pregunta: '¿Cuántos kilos por m² pesa una bodega metálica estándar?',
        respuesta:
          'Una bodega liviana de solo cubierta, con luces de 15 a 25 metros y sin cargas colgadas, pesa entre 25 y 45 kg/m² de estructura metálica en la práctica MEISA. Si la nave lleva puente grúa o cargas de proceso, el rango sube a 45–70 kg/m². Son valores orientativos para predimensionar: el peso real depende de la luz libre, la zona sísmica y las cargas, y solo lo confirma el cálculo estructural del proyecto.',
      },
      {
        pregunta: '¿Cuánto cuesta una estructura metálica por kilo instalado en Colombia?',
        respuesta:
          'Como rango orientativo de mercado: estructura estándar entre $10.900 y $13.000 COP/kg instalado, edificación y entrepisos (incluidas naves con puente grúa) entre $13.000 y $17.000, y estructura especial o de puentes entre $17.000 y $25.000. El valor final depende del tonelaje total, la complejidad de conexiones, el acabado de pintura o galvanizado y la logística de montaje. La cotización real siempre se hace sobre planos o modelo estructural; consulte también nuestra guía de precios de estructuras metálicas.',
      },
      {
        pregunta: '¿El kg/m² incluye correas, teja y lámina colaborante?',
        respuesta:
          'Los rangos de esta guía incluyen estructura principal y secundaria: columnas, vigas o cerchas, correas, arriostramientos y conexiones. No incluyen teja, cerramientos, lámina colaborante ni el concreto de la losa. Al comparar cotizaciones verifique siempre el alcance del kilo: una propuesta que incluye correas y otra que no pueden diferir 8–12 kg/m² sin que ninguna esté mal. Pida el desglose de tonelaje por tipo de elemento.',
      },
      {
        pregunta: '¿Por qué los puentes no se estiman en kg/m²?',
        respuesta:
          'Porque el peso de un puente lo gobiernan la luz libre del cruce, el ancho de calzada y las cargas vivas de la norma CCP-14, no el área de tablero. Dos puentes con la misma área pero luces distintas pueden diferir más del doble en tonelaje. En MEISA los presupuestamos por toneladas según la luz y la sección — para un estimado serio se necesita el perfil del cruce.',
      },
    ],
    faqTitulo1: 'Sobre pesos',
    faqTitulo2: 'y presupuestos',
    relacionados: [
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: '¿Cuánto cuesta una estructura metálica?',
        descripcion:
          'El complemento de esta guía: rangos de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
      },
      {
        href: '/tipos-de-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Tipos de estructuras metálicas',
        descripcion:
          'Pórticos, cerchas, arcos y viga cajón: qué sistema conviene en cada proyecto y cómo afecta el peso por m².',
      },
      {
        href: '/estructura-metalica-vs-concreto',
        eyebrow: 'Guía',
        titulo: 'Estructura metálica vs concreto',
        descripcion:
          'Comparación honesta criterio por criterio para decidir el sistema estructural de su proyecto.',
      },
      {
        href: '/soluciones/estructura-metalica-para-bodegas',
        eyebrow: 'Solución',
        titulo: 'Estructura metálica para bodegas',
        descripcion:
          'La tipología con los ratios más consultados: 72 proyectos industriales y más de 6.200 toneladas entregadas.',
      },
      {
        href: '/soluciones/edificios-en-estructura-metalica',
        eyebrow: 'Solución',
        titulo: 'Edificios en estructura metálica',
        descripcion:
          'Entrepisos, sistemas sísmicos y ampliaciones verticales: más de 3.500 toneladas en 14 ciudades desde 1998.',
      },
      {
        href: '/soluciones/puentes-metalicos',
        eyebrow: 'Solución',
        titulo: 'Puentes metálicos',
        descripcion:
          '46 puentes vehiculares y peatonales fabricados y montados bajo CCP-14, presupuestados por luz y tonelaje.',
      },
    ],
    ctaEyebrow: 'Pase del ratio al peso real',
    ctaTitulo1: 'Cotice con el peso',
    ctaTitulo2: 'real del modelo.',
    ctaDescripcion:
      'Envíenos los datos básicos de su obra y reciba un orden de magnitud con ratios reales — y si avanza, la cotización cerrada sobre el modelo BIM.',
  },
}

/* ─── Guía 5: granallado y pintura ───────────────────────────────────── */

const GUIA_GRANALLADO: GuiaLanding = {
  slug: 'granallado-y-pintura-estructuras-metalicas',
  titulo: 'Guía — Granallado y pintura de estructuras metálicas',
  metaTitle:
    'Granallado y Pintura de Estructuras Metálicas: Guía Técnica 2026 | MEISA',
  metaDescription:
    'Cómo se prepara y protege el acero estructural: granallado a grado Sa 2½ (SP10), perfil de anclaje, sistemas epóxico-poliuretano e intumescente, y el control de calidad real (DFT, adherencia). MEISA granalla en planta en Jamundí y Popayán.',
  contenido: {
    variante: 'template',
    path: '/granallado-y-pintura-estructuras-metalicas',
    breadcrumbName: 'Granallado y pintura de estructuras metálicas',
    heroEyebrow: 'Guía técnica de protección · 2026',
    heroTitulo1: 'Granallado y',
    heroTitulo2: 'pintura',
    heroSub:
      'Cómo se prepara y se protege de verdad el acero estructural —del grado de limpieza al sistema de pintura— con el control de calidad que separa una estructura que dura 25 años de una que se oxida en 3.',
    categoriaHero: 'INDUSTRIAL',
    introEyebrow: '01 — Por qué el acabado define la vida útil',
    introTitulo1: 'La pintura no se echa:',
    introTitulo2: 'se especifica',
    intro:
      'El acero es el material estructural más eficiente que existe, pero tiene un enemigo serio: la corrosión. Y la corrosión no se combate con "una manito de anticorrosivo", sino con un sistema diseñado para el ambiente de la obra, aplicado sobre una superficie correctamente preparada y verificado con instrumentos. La verdad del oficio es incómoda: el 80% de la durabilidad de una pintura no está en la pintura, está en la preparación de la superficie. Por eso esta guía empieza por la limpieza, no por el color.',
    stats: [
      { valor: '2', label: 'Granalladoras en planta (Jamundí y Popayán)' },
      { valor: 'Sa 2½', label: 'Grado de limpieza estándar (SP10)' },
      { valor: '3', label: 'Capas: primer, barrera y acabado' },
      { valor: '264', label: 'Proyectos fabricados y protegidos' },
    ],
    secciones: [
      {
        titulo: 'Preparación de superficie: el 80% del resultado',
        parrafos: [
          'Antes de la primera capa hay que quitar del acero todo lo que impide que la pintura agarre: óxido, calamina de laminación (mill scale), grasa, polvo y sales. Y hay que dejar una rugosidad controlada —el perfil de anclaje— para que la pintura se ancle mecánicamente.',
          'Granallado y sandblasting no son lo mismo. El granallado lanza abrasivo metálico (granalla de acero) con turbinas en planta: es automatizado, recuperable, sin polvo de sílice y muy consistente. El sandblasting impulsa el abrasivo con aire comprimido de forma manual; sirve para piezas muy grandes o retoques en obra, pero es menos uniforme. MEISA granalla en planta como estándar.',
          'El perfil de anclaje se mide en mils (1 mil = 25,4 micras). MEISA especifica 1,5 – 3,0 mils (≈ 38 – 76 µm) y lo verifica con cinta réplica Testex (ISO 8503): muy liso y la pintura no ancla; demasiado rugoso y los picos quedan sin cubrir y se oxidan.',
        ],
        items: [
          { nombre: 'Sa 1 · SP7', descripcion: 'Barrido ligero (brush-off). Solo quita lo suelto; se reserva para casos menores.' },
          { nombre: 'Sa 2 · SP6', descripcion: 'Chorro comercial. Limpieza intermedia para ambientes poco agresivos.' },
          { nombre: 'Sa 2½ · SP10', descripcion: 'Metal casi blanco: al menos el 95% del área libre de óxido, calamina y contaminantes. El estándar MEISA para sistemas de alto desempeño.' },
          { nombre: 'Sa 3 · SP5', descripcion: 'Metal blanco. La limpieza más exigente, para ambientes extremos o inmersión.' },
        ],
      },
      {
        titulo: 'El sistema de pintura, capa por capa',
        parrafos: [
          'Pintar acero en serio es aplicar un sistema de capas, donde cada una cumple una función distinta. Se miden dos espesores: el de película húmeda (WFT, al aplicar) y el de película seca (DFT, ya curada). El que protege y el que se exige en obra es el DFT; un sistema típico suma 6 – 9 mils (≈ 150 – 230 µm). MEISA controla el espesor capa por capa, no solo el total.',
        ],
        items: [
          { nombre: 'Primer epóxico-zinc', descripcion: 'La primera capa, sobre el acero granallado (≈ 4–6 mils). Ancla al sustrato y da protección activa: el zinc se sacrifica y se corroe antes que el acero. Es la capa más crítica.' },
          { nombre: 'Barrera epóxica', descripcion: 'La intermedia y el grueso del sistema. Aporta cuerpo y bloquea la entrada de humedad, oxígeno y cloruros. En ambientes agresivos, aquí va la mayor parte de las micras.' },
          { nombre: 'Acabado poliuretano', descripcion: 'La cara externa (≈ 2–3 mils). Resiste UV e intemperie y conserva el color (RAL). El epóxico solo se "tiza" con el sol; el poliuretano alifático no.' },
        ],
      },
      {
        titulo: 'Qué sistema según el ambiente (ISO 12944)',
        parrafos: [
          'No todo lleva el mismo sistema. La norma ISO 12944 clasifica la agresividad del ambiente en categorías de corrosividad: a mayor categoría, más espesor y mejor sistema. Especificar de más es botar plata; especificar de menos es repintar en tres años. La categoría correcta sale del uso y la ubicación, y se define idealmente desde el diseño.',
        ],
        items: [
          { nombre: 'C2 — Baja', descripcion: 'Ambientes rurales e interiores con poca condensación. Sistemas livianos.' },
          { nombre: 'C3 — Media', descripcion: 'Urbano e industrial moderado. La mayoría de bodegas y edificios en ciudad.' },
          { nombre: 'C4 — Alta', descripcion: 'Industria y zonas costeras moderadas. Más espesor y mejor primer.' },
          { nombre: 'C5 — Muy alta', descripcion: 'Industria agresiva o ambiente marino con alta salinidad.' },
          { nombre: 'CX — Extrema', descripcion: 'Offshore y altísima salinidad. Sistemas de máximo desempeño.' },
        ],
      },
      {
        titulo: 'Protección contra fuego: pintura intumescente',
        parrafos: [
          'El acero pierde resistencia con el calor: hacia los 550 °C ya está cerca de su límite. En edificios, centros comerciales o industria donde la norma exige resistencia al fuego, se usa pintura intumescente como protección pasiva.',
          'Funciona así: al superar unos 300 °C, el recubrimiento se hincha hasta varias veces su espesor y forma una espuma carbonizada aislante que retrasa el calentamiento del acero, dando tiempo a evacuar y a que actúen los bomberos.',
          'Lo clave: su espesor no depende del ambiente sino del factor de forma del perfil (qué tan "masivo" es) y de la resistencia exigida —RF60, RF90, RF120 (minutos)—. Por eso se calcula perfil por perfil y se mide aparte del sistema anticorrosivo: la intumescente no lo reemplaza, lo complementa.',
        ],
      },
      {
        titulo: 'Control de calidad: lo que se mide y por qué',
        parrafos: [
          'Aquí está la diferencia entre un trabajo serio y uno improvisado: "incluye pintura" no significa nada sin números. MEISA registra cada prueba con instrumentos calibrados y un protocolo de liberación antes de despachar el acero a obra.',
        ],
        items: [
          { nombre: 'Perfil de anclaje', descripcion: 'Rugosidad del granallado medida con cinta réplica Testex (ISO 8503). Especificado: 1,5 – 3,0 mils.' },
          { nombre: 'Espesor seco (DFT)', descripcion: 'Con medidor PosiTector 6000, varios puntos por m² y capa por capa. Es el espesor que realmente protege.' },
          { nombre: 'Adherencia (pull-off)', descripcion: 'Ensayo de tracción según ASTM D4541. Verifica que el sistema esté de verdad pegado al acero.' },
          { nombre: 'Condiciones ambientales', descripcion: 'Temperatura del sustrato, humedad relativa y punto de rocío. No se pinta si el sustrato condensa o la humedad supera el límite.' },
        ],
      },
      {
        titulo: 'Cómo comparar una cotización que "incluye pintura"',
        parrafos: [
          'Dos propuestas pueden decir "incluye pintura" y costar muy distinto porque protegen distinto. Antes de comparar precios, pida que cada oferta responda lo mismo:',
        ],
        items: [
          { nombre: '¿Qué grado de limpieza?', descripcion: 'No es lo mismo Sa 2½ (SP10) que un barrido ligero. El grado define qué tanto dura todo el sistema.' },
          { nombre: '¿Cuántas micras (DFT)?', descripcion: 'Pida el espesor de película seca por capa y total. Sin micras, el "anticorrosivo" puede ser una sola mano insuficiente.' },
          { nombre: '¿Qué sistema y ambiente?', descripcion: 'Primer, barrera y acabado deben corresponder a la categoría ISO 12944 de la obra, no a "lo de siempre".' },
          { nombre: '¿Hay control de calidad?', descripcion: 'Si nadie mide perfil, DFT y adherencia, nadie puede garantizar la durabilidad. Exija el protocolo.' },
        ],
      },
    ],
    procesoTitulo1: 'Granallado en planta,',
    procesoTitulo2: 'no en obra',
    proceso: [
      { titulo: 'Recepción e inspección', descripcion: 'Se recibe el acero y se verifica su certificado de calidad antes de procesarlo.' },
      { titulo: 'Granallado a Sa 2½', descripcion: 'Granallado con granalla de acero en planta, verificando el perfil de anclaje con cinta Testex.' },
      { titulo: 'Sistema de pintura', descripcion: 'Primer dentro de la ventana antes de re-oxidación, más barrera y acabado, con control de DFT y condiciones ambientales.' },
      { titulo: 'Inspección y liberación', descripcion: 'Verificación final con protocolo y registro fotográfico. El acero llega a obra ya protegido y listo para montar.' },
    ],
    proyectosSlugs: [],
    proyectosIntro:
      'Estructuras fabricadas y protegidas en planta por MEISA, en ambientes que van desde naves industriales hasta puentes y obra expuesta.',
    faqTitulo1: 'Sobre protección',
    faqTitulo2: 'y mantenimiento',
    faq: [
      {
        pregunta: '¿Cuánto dura la pintura de una estructura metálica?',
        respuesta:
          'Según la norma ISO 12944, la durabilidad de un sistema bien aplicado va de unos 7 años (baja) a más de 25 (muy alta), según el ambiente, el sistema y —sobre todo— la preparación de la superficie. Un acero granallado a Sa 2½ con un sistema epóxico-poliuretano correcto en ambiente C3–C4 apunta a alta durabilidad; el dato real depende del mantenimiento.',
      },
      {
        pregunta: '¿Cuál es el mejor sistema de pintura para acero estructural?',
        respuesta:
          'El que corresponde a la categoría de corrosividad ISO 12944 del proyecto. No hay un "mejor" universal: una bodega urbana (C3) no necesita lo mismo que una planta junto al mar (C5). El sistema típico es primer epóxico rico en zinc, barrera epóxica y acabado de poliuretano alifático, ajustando los espesores al ambiente.',
      },
      {
        pregunta: '¿Qué es el grado Sa 2½ (SP10) y por qué importa tanto?',
        respuesta:
          'Es el grado de limpieza "metal casi blanco": al menos el 95% de cada área queda libre de óxido, calamina y contaminantes. Es la base sobre la que se sostiene todo el sistema de pintura — sin esa limpieza, hasta la mejor pintura se desprende. Es el estándar que MEISA usa para estructura que va a recibir sistema epóxico.',
      },
      {
        pregunta: '¿Granallado o sandblasting: cuál es mejor?',
        respuesta:
          'Para fabricación en planta, el granallado: es más uniforme, recuperable y sin polvo de sílice, lo que da un acabado consistente y trazable. El sandblasting (chorro abrasivo manual) es útil en obra o en piezas muy grandes. MEISA granalla en planta en sus dos sedes (Jamundí y Popayán) como estándar.',
      },
      {
        pregunta: '¿Cuánto cuesta granallar y pintar una estructura?',
        respuesta:
          'En los proyectos de MEISA la protección está incluida en el precio por kilogramo instalado (ver la guía de precios de estructuras metálicas). Lo que mueve el costo es el sistema —cuántas capas y micras—, el grado de limpieza exigido y si lleva pintura intumescente. No tiene sentido cotizar "la pintura aparte" sin definir el sistema.',
      },
      {
        pregunta: '¿Cada cuánto hay que mantener o repintar?',
        respuesta:
          'Con buena preparación y un sistema acorde al ambiente, el mantenimiento suele ser por puntos (retoques en zonas de golpe o de soldadura de campo) y no un repintado total. Los ciclos dependen de la categoría ISO 12944: cuanto más agresivo el ambiente, más seguido se inspecciona.',
      },
      {
        pregunta: '¿La pintura intumescente reemplaza el anticorrosivo?',
        respuesta:
          'No. La intumescente protege contra el fuego (retrasa el colapso del acero en un incendio); el sistema anticorrosivo protege contra la corrosión. Son funciones distintas y se complementan: normalmente va primer, capa intumescente y un sello o acabado.',
      },
    ],
    relacionados: [
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Precios de estructuras metálicas',
        descripcion: 'La protección va incluida en el $/kg instalado: vea qué más mueve el costo.',
      },
      {
        href: '/tipos-de-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Tipos de estructuras metálicas',
        descripcion: 'Pórticos, cerchas y entrepisos: qué se fabrica y se protege en cada caso.',
      },
      {
        href: '/estructura-metalica-vs-concreto',
        eyebrow: 'Guía',
        titulo: 'Estructura metálica vs concreto',
        descripcion: 'Costo total, plazo y mantenimiento — donde el acero bien protegido gana.',
      },
    ],
    ctaEyebrow: 'Proteja su inversión desde el diseño',
    ctaTitulo1: 'Especifique la protección,',
    ctaTitulo2: 'no la improvise.',
    ctaDescripcion:
      'Envíenos los planos o cuéntenos el ambiente de su obra y le proponemos el sistema correcto: granallado en planta, sistema de pintura por categoría ISO 12944 y control de calidad con protocolo.',
  },
}

/* ─── Guía 6: precio de cubierta metálica por m² ─────────────────────── */
// Ataca el cluster "precio m2 cubierta metálica" (66+ imp/mes en 3 variantes,
// pos ~6 con la guía general). Los valores por m² se DERIVAN de los rangos
// aprobados ($/kg instalado × kg/m²) — no introduce precios nuevos.

const GUIA_CUBIERTA_PRECIO: GuiaLanding = {
  slug: 'precio-cubierta-metalica-por-m2',
  titulo: 'Guía — Precio de cubierta metálica por m²',
  metaTitle: 'Precio de Cubierta Metálica por m² en Colombia 2026 | MEISA',
  metaDescription:
    'Cuánto cuesta una cubierta metálica por metro cuadrado en Colombia: cómo pasar de kg a m², rangos orientativos derivados del precio por kg instalado, qué incluye y qué no.',
  contenido: {
    variante: 'template',
    path: '/precio-cubierta-metalica-por-m2',
    breadcrumbName: 'Precio de cubierta metálica por m²',
    heroEyebrow: 'Guía de precios 2026',
    heroTitulo1: '¿Cuánto cuesta una',
    heroTitulo2: 'cubierta metálica?',
    heroSub:
      'El precio por m² de una cubierta sale de dos números: los kilogramos de acero por metro cuadrado y el precio por kilogramo instalado. Esta guía le muestra cómo hacer la cuenta con rangos reales del mercado colombiano.',
    introEyebrow: '01 — La cuenta honesta',
    introTitulo1: 'De kilos',
    introTitulo2: 'a metros cuadrados',
    intro:
      'Cuando alguien cotiza una cubierta metálica "por m²" sin calcular el peso, está adivinando. El precio real se construye así: peso de acero por m² (según la luz libre y las cargas) × precio por kg instalado (según la complejidad). Una cubierta liviana de bodega no pesa lo mismo que la cubierta de un coliseo — y por eso no cuestan lo mismo por metro. Aquí está el método y los rangos para estimar de manera informada, con la obra de MEISA como referencia.',
    categoriaHero: 'DEPORTES_EDUCACION',
    stats: [
      { valor: '25–45', sufijo: '', label: 'kg/m² típicos en cubiertas livianas' },
      { valor: '10.900', sufijo: '+', label: 'COP por kg instalado, desde' },
      { valor: '30', sufijo: '+', label: 'Años fabricando cubiertas' },
    ],
    secciones: [
      {
        titulo: 'El método: peso × precio por kilo',
        parrafos: [
          'Primero el peso. Una cubierta metálica liviana — la de una bodega o nave estándar, con cerchas o perfiles de alma llena y luces de 15 a 25 metros — pesa entre 25 y 45 kg de acero por m². A mayor luz libre, mayores cargas de viento o cubiertas con equipos colgados, el peso sube; las cubiertas de gran luz (coliseos, escenarios) pueden superar los 60 kg/m².',
          'Luego el precio por kilo. La estructura estándar y repetitiva se instala en Colombia entre $10.900 y $13.000 COP por kg; las cubiertas de gran luz o geometría especial — cerchas de coliseo, arcos, voladizos — entran en el rango de estructura especial, de $17.000 a $25.000 por kg. El precio incluye fabricación, pintura y montaje.',
          'La multiplicación da el rango orientativo: una cubierta liviana de bodega (30 kg/m² × $11.500) ronda los $350.000 COP por m² de estructura instalada; una cubierta exigente de gran luz (60 kg/m² × $18.000) puede superar el $1.000.000 por m². Por eso "el precio de la cubierta por m²" no existe como cifra única: existe la cuenta.',
        ],
      },
      {
        titulo: 'Qué incluye y qué no',
        parrafos: [
          'Los rangos anteriores cubren la ESTRUCTURA de la cubierta: ingeniería de detalle, fabricación con soldadura calificada, protección anticorrosiva (granallado y pintura) y montaje en obra con equipo propio.',
        ],
        items: [
          {
            nombre: 'Incluido',
            descripcion:
              'Ingeniería de detalle y planos de taller · fabricación con corte CNC · granallado y sistema de pintura · transporte coordinado · montaje con personal certificado · memorias y certificados de calidad.',
          },
          {
            nombre: 'No incluido (se cotiza aparte)',
            descripcion:
              'La teja o panel de cubierta (termoacústica, standing seam, policarbonato), canales y bajantes, cielos rasos, y la estructura de soporte inferior si no existe (columnas, vigas). También la cimentación.',
          },
          {
            nombre: 'La teja: el otro 30-50% del costo',
            descripcion:
              'El cerramiento (teja + accesorios + traslucidas) suele costar tanto como una fracción importante de la estructura. Pida siempre la cotización separada: estructura por kg, cubierta por m² de teja. Así compara manzanas con manzanas.',
          },
        ],
      },
      {
        titulo: 'Cerchas metálicas: el corazón de la cubierta',
        parrafos: [
          'La cercha es el sistema que hace posible la mayoría de cubiertas de luz media y grande: una armadura triangulada que trabaja a esfuerzos axiales y logra cubrir 20, 30 o 40 metros con una fracción del acero que necesitaría una viga de alma llena. Por eso "¿cuánto cuesta una cercha metálica?" se responde igual que toda esta guía: por peso — el diseño de la cercha (luz, carga, pendiente) define sus kilogramos, y su complejidad de fabricación define el precio por kilo, normalmente en el rango medio-alto por la cantidad de conexiones.',
          'MEISA fabrica cerchas de cordones paralelos, triangulares y de arco, con conexiones soldadas en taller y empalmes pernados en obra — el equilibrio correcto entre calidad de fabricación y velocidad de montaje.',
        ],
      },
      {
        titulo: 'Cubiertas reales de MEISA como referencia',
        parrafos: [
          'La obra entregada es la mejor calibración de la cuenta: la cubierta Caña Dulce de Comfacauca en Santander de Quilichao (110 toneladas), la cubierta metálica del peaje de la UF4 del corredor 4G Popayán–Quilichao (104 toneladas), los escenarios de los Juegos Nacionales 2012 en Popayán — cubiertas de competencia con luces mayores — y decenas de cubiertas de bodegas, coliseos barriales y equipamiento en todo el suroccidente.',
          'Cada una se cotizó igual que se cotizará la suya: peso calculado sobre planos × precio por kg según complejidad. Sin fórmulas mágicas por m².',
        ],
      },
    ],
    proyectosSlugs: [
      'comfacauca-cubierta-cana-dulce',
      'cubierta-metalica-peaje-popayan-uf4',
    ],
    proyectosIntro:
      'Cubiertas metálicas entregadas por MEISA: estructura de gran luz para recreación, infraestructura vial 4G y equipamiento público.',
    faq: [
      {
        pregunta: '¿Cuánto cuesta una cubierta metálica por m² en Colombia?',
        respuesta:
          'Depende del peso de acero por m² y de la complejidad. Como rango orientativo derivado del mercado: una cubierta liviana de bodega (25–45 kg/m² a $10.900–$13.000 por kg instalado) ronda entre $270.000 y $580.000 COP por m² de estructura; cubiertas de gran luz o geometría especial pueden superar el $1.000.000 por m². La teja y el cerramiento se cotizan aparte. La cifra real se calcula sobre planos.',
      },
      {
        pregunta: '¿El precio incluye la teja?',
        respuesta:
          'No. Los rangos de estructura incluyen fabricación, pintura y montaje del acero. La teja (termoacústica, standing seam, policarbonato), canales, bajantes y traslúcidas se cotizan por separado como cerramiento — y pueden representar una fracción importante del costo total del techo.',
      },
      {
        pregunta: '¿Qué luz libre puede tener una cubierta metálica?',
        respuesta:
          'Prácticamente cualquiera que el proyecto necesite: de los 15–25 metros típicos de bodegas hasta cubiertas de coliseos y escenarios deportivos de más de 40 metros sin columnas intermedias, con cerchas o arcos. A mayor luz, más kg/m² y mayor precio por kg — la cuenta de esta guía sigue aplicando.',
      },
      {
        pregunta: '¿Conviene más cubierta metálica o de concreto?',
        respuesta:
          'Para luces medianas y grandes, la metálica gana casi siempre: pesa menos (ahorra cimentación), se monta más rápido y permite luces que el concreto no alcanza económicamente. Ver nuestra guía comparativa de estructura metálica vs concreto para el análisis completo.',
      },
      {
        pregunta: '¿Cómo pido una cotización formal de mi cubierta?',
        respuesta:
          'Envíenos los planos arquitectónicos o un esquema con las dimensiones (área, luz libre, uso). Calculamos el peso real de acero, definimos el sistema estructural y le entregamos una cotización formal con alcance, plazo y precio — sin costo y sin compromiso.',
      },
    ],
    faqTitulo1: 'Preguntas sobre',
    faqTitulo2: 'cubiertas metálicas',
    relacionados: [
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Precios de estructuras metálicas',
        descripcion: 'Los rangos completos por kg instalado y los factores que los mueven.',
      },
      {
        href: '/peso-estructura-metalica-por-m2',
        eyebrow: 'Guía',
        titulo: 'Peso por m² de una estructura metálica',
        descripcion: 'La otra mitad de la cuenta: kg/m² típicos según el tipo de obra.',
      },
      {
        href: '/soluciones/cubiertas-metalicas',
        eyebrow: 'Solución',
        titulo: 'Cubiertas y fachadas metálicas',
        descripcion: 'La solución completa: cerchas, arcos y sistemas de cerramiento.',
      },
      {
        href: '/estructuras-metalicas-colombia',
        eyebrow: 'Nacional',
        titulo: 'Estructuras metálicas en Colombia',
        descripcion: 'Capacidad nacional de MEISA: tres plantas y obra entregada en todo el país.',
      },
    ],
    ctaEyebrow: 'Cotice su cubierta',
    ctaTitulo1: 'Deje de adivinar',
    ctaTitulo2: 'por m².',
    ctaDescripcion:
      'Envíenos los planos o las dimensiones de su cubierta y reciba el peso real de acero y una cotización formal — la cuenta completa, sin sorpresas.',
  },
}

/* ─── Guía 7: cómo se construye un puente metálico ───────────────────── */
// Cluster educativo de puentes (MIC lo explota con 12 páginas SIN puentes
// insignia). MEISA lo responde con UNA guía + obra real + el video del
// Puente Cascada embebido (facade + VideoObject).

const GUIA_PUENTE_PROCESO: GuiaLanding = {
  slug: 'como-se-construye-un-puente-metalico',
  titulo: 'Guía — Cómo se construye un puente metálico',
  metaTitle: 'Cómo se Construye un Puente Metálico — Paso a Paso | MEISA',
  metaDescription:
    'El proceso real de construcción de un puente metálico en Colombia, paso a paso: ingeniería, fabricación por dovelas, transporte, izaje y pruebas — contado por quien los construye, con video del montaje del Puente Cascada.',
  contenido: {
    variante: 'template',
    path: '/como-se-construye-un-puente-metalico',
    breadcrumbName: 'Cómo se construye un puente metálico',
    heroEyebrow: 'Guía técnica — puentes',
    heroTitulo1: 'Cómo se construye',
    heroTitulo2: 'un puente metálico',
    heroSub:
      'De los planos al primer vehículo cruzando: el proceso completo de un puente en acero, contado por quien los fabrica y los monta — con el video real del montaje del Puente Cascada en el corredor 4G Popayán–Santander de Quilichao.',
    introEyebrow: '01 — La guía',
    introTitulo1: 'Del modelo',
    introTitulo2: 'al cruce del río',
    intro:
      'Un puente metálico no se construye en el sitio: se fabrica en una planta, por partes, y se arma sobre el obstáculo con izajes de precisión. Esa es su gran ventaja — calidad de taller, velocidad en obra y luces que el concreto no alcanza económicamente. MEISA ha entregado puentes vehiculares y peatonales en todo el suroccidente colombiano, incluidos el Puente Cascada (58 m, corredor 4G) y el Puente Vehicular Ovejas (536 toneladas). Así es el proceso, paso a paso.',
    categoriaHero: 'PUENTES',
    stats: [
      { valor: '58', sufijo: ' m', label: 'Luz del Puente Cascada (4G)' },
      { valor: '536', sufijo: ' t', label: 'Acero del Puente Ovejas' },
      { valor: '30', sufijo: '+', label: 'Años construyendo en acero' },
    ],
    video: {
      videoId: '5_b1ILDSaoU',
      obra: 'Puente Cascada',
      titulo:
        'Montaje de puente metálico Puente Cascada | Corredor 4G Popayán – Santander de Quilichao',
      descripcion:
        'Montaje en obra del Puente Cascada, puente metálico de 58 m del Corredor 4G Popayán – Santander de Quilichao ejecutado por MEISA: coordinación de equipos, instalación de elementos estructurales y montaje en campo.',
      poster:
        'https://storage.googleapis.com/meisa-imagenes/site/selected-hero/07-puente-cascada.jpg',
      uploadDate: '2026-07-06',
      duration: 'PT6M1S',
    },
    secciones: [
      {
        titulo: 'Por qué los puentes se hacen en acero',
        parrafos: [
          'Tres razones dominan la decisión: la luz, el plazo y el peso. El acero salva luces grandes con menos material y menos apoyos intermedios — crítico sobre ríos, cañadas y vías en operación. La estructura se fabrica en paralelo con la cimentación, comprimiendo el cronograma. Y el menor peso propio reduce las cargas sobre pilas y estribos, abaratando la cimentación.',
          'Por eso la infraestructura vial concesionada — los corredores 4G y 5G — usa acero estructural de forma intensiva en sus puentes: el costo del cierre de una vía se mide en días, y el acero los reduce.',
        ],
      },
      {
        titulo: 'Lo que casi nadie cuenta: la logística manda',
        parrafos: [
          'El diseño de un puente metálico no termina en el cálculo estructural: cada dovela debe caber en una tractomula, pasar por las curvas de la ruta y poder izarse con las grúas disponibles en el sitio. La ingeniería de detalle divide el puente en tramos transportables y define la secuencia exacta de montaje — antes de cortar la primera lámina.',
          'En el Puente Cascada, esa planificación permitió montar 58 metros de luz sobre un cauce activo del corredor 4G sin incidentes: cada izaje estaba definido en papel meses antes de que la grúa llegara al sitio. El video de esta página muestra ese montaje real.',
        ],
      },
    ],
    proceso: [
      {
        titulo: 'Ingeniería de detalle y despiece',
        descripcion:
          'Del diseño estructural al plano de taller: cada viga, dovela, rigidizador y conexión se modela en 3D, se verifica contra la NSR-10 y el CCP-14 (norma colombiana de puentes), y se despieza en tramos transportables. Aquí se define la secuencia de montaje completa.',
      },
      {
        titulo: 'Fabricación por dovelas en planta',
        descripcion:
          'Corte CNC de láminas, armado de secciones, y soldadura calificada bajo AWS D1.5 (código de soldadura para puentes) con ensayos no destructivos. Cada dovela se pre-ensambla en taller para verificar geometría antes de despachar — el río no es lugar para descubrir errores.',
      },
      {
        titulo: 'Protección anticorrosiva',
        descripcion:
          'Granallado a metal casi blanco y sistema de pintura de alto desempeño por capas, aplicado en planta con control de espesores. Un puente queda a la intemperie por décadas: su protección se decide en el taller, no en el sitio.',
      },
      {
        titulo: 'Transporte al sitio',
        descripcion:
          'Las dovelas viajan en tractomulas con permisos de carga extradimensionada cuando aplica, en la secuencia exacta que exige el montaje. La ruta se estudió desde el despiece: alturas de puentes existentes, radios de curva y capacidad de las vías.',
      },
      {
        titulo: 'Cimentación y apoyos (obra civil)',
        descripcion:
          'En paralelo con la fabricación, el contratista de obra civil construye pilas, estribos y apoyos. La interfaz crítica son los pernos de anclaje y las placas de apoyo: se verifican topográficamente contra los planos de taller antes de programar el izaje.',
      },
      {
        titulo: 'Montaje e izaje',
        descripcion:
          'El momento crítico: grúas de capacidad calculada izan cada dovela a su posición, se alinea la geometría y se ejecutan las conexiones — pernadas de alta resistencia o soldadas en sitio con calificación. Sobre cauces o vías activas, los izajes se programan en ventanas específicas.',
      },
      {
        titulo: 'Tablero y acabados',
        descripcion:
          'Con la estructura principal montada se instala el tablero (losa colaborante o placa), barandas, juntas de dilatación y drenajes. El puente toma su forma final.',
      },
      {
        titulo: 'Pruebas y entrega',
        descripcion:
          'Verificación topográfica final, revisión de conexiones y soldaduras, prueba de carga cuando la interventoría la exige, y entrega con dossier completo: planos as-built, certificados de materiales, registros de soldadura y protocolos de calidad.',
      },
    ],
    procesoTitulo1: 'El proceso',
    procesoTitulo2: 'paso a paso',
    proyectosSlugs: ['puente-vehicular-ovejas', 'casa-puente-cascada'],
    proyectosIntro:
      'Puentes metálicos entregados por MEISA: el Puente Vehicular Ovejas (536 toneladas) y el Puente Cascada del corredor 4G, entre otros puentes y pasarelas del suroccidente colombiano.',
    faq: [
      {
        pregunta: '¿Cuánto cuesta un puente metálico?',
        respuesta:
          'Los puentes entran en el rango de estructura especial: entre $17.000 y $25.000 COP por kilogramo instalado como referencia de mercado (fabricación, pintura y montaje; excluye cimentación y tablero). El peso depende de la luz y las cargas — un puente vehicular de 50–60 m puede requerir entre 400 y 600 toneladas. La cifra real siempre se calcula sobre el diseño.',
      },
      {
        pregunta: '¿Cuánto tarda la construcción de un puente metálico?',
        respuesta:
          'La fabricación en planta de un puente mediano toma típicamente de 3 a 6 meses, y corre en paralelo con la cimentación (obra civil). El montaje en sitio es lo más rápido: semanas, no meses — esa es la ventaja del acero. El cronograma total lo domina normalmente la obra civil y las licencias, no la estructura.',
      },
      {
        pregunta: '¿Qué normas rigen los puentes metálicos en Colombia?',
        respuesta:
          'El diseño se rige por el CCP-14 (Código Colombiano de Puentes, basado en AASHTO LRFD) y la soldadura por AWS D1.5, el código específico de puentes — más exigente que el AWS D1.1 de edificaciones. MEISA entrega registros de soldadura, ensayos no destructivos y certificados de materiales con cada puente.',
      },
      {
        pregunta: '¿MEISA hace también la cimentación?',
        respuesta:
          'Nuestro alcance es la superestructura metálica: ingeniería de detalle, fabricación, transporte y montaje. La cimentación y los apoyos son obra civil del contratista principal — y coordinamos con él la interfaz crítica (anclajes y placas de apoyo) desde los planos de taller.',
      },
      {
        pregunta: '¿Construyen puentes en todo el país?',
        respuesta:
          'Sí. La fabricación es en nuestras plantas del suroccidente y el despacho por carretera llega a cualquier obra del país — los puentes viajan por partes. Trabajamos con concesionarios viales, contratistas de obra pública y constructores privados.',
      },
    ],
    faqTitulo1: 'Preguntas sobre',
    faqTitulo2: 'puentes metálicos',
    relacionados: [
      {
        href: '/soluciones/puentes-metalicos',
        eyebrow: 'Solución',
        titulo: 'Puentes metálicos',
        descripcion: 'La solución completa: vehiculares, peatonales y pasarelas en acero.',
      },
      {
        href: '/precios-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Precios de estructuras metálicas',
        descripcion: 'Rangos por kg instalado — incluido el rango especial de puentes.',
      },
      {
        href: '/granallado-y-pintura-estructuras-metalicas',
        eyebrow: 'Guía',
        titulo: 'Granallado y pintura',
        descripcion: 'La protección anticorrosiva que decide la vida útil de un puente.',
      },
      {
        href: '/estructuras-metalicas-colombia',
        eyebrow: 'Nacional',
        titulo: 'Estructuras metálicas en Colombia',
        descripcion: 'Capacidad nacional de MEISA: tres plantas y obra en todo el país.',
      },
    ],
    ctaEyebrow: 'Su puente, en acero',
    ctaTitulo1: 'Hablemos de',
    ctaTitulo2: 'su próximo cruce.',
    ctaDescripcion:
      'Concesionarios, contratistas de obra pública y constructores: envíennos el diseño o el anteproyecto y reciban una propuesta formal de fabricación y montaje con peso, plazo y precio.',
  },
}

export const GUIAS: GuiaLanding[] = [
  GUIA_PRECIOS,
  GUIA_VS_CONCRETO,
  GUIA_TIPOS,
  GUIA_PESO,
  GUIA_GRANALLADO,
  GUIA_CUBIERTA_PRECIO,
  GUIA_PUENTE_PROCESO,
]

export function getGuiaFallback(slug: string): GuiaLanding | undefined {
  return GUIAS.find((g) => g.slug === slug)
}

export function getGuiaSlugs(): string[] {
  return GUIAS.map((g) => g.slug)
}
