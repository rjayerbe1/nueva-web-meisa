/**
 * Seed de 8 landings de ciudad (tipo CIUDAD en landings_seo) — julio 2026.
 * Expansión del clúster: captura del vacío B&V (Barranquilla, Villavicencio)
 * + ciudades fuertes sin landing (Neiva, Pasto) + suroccidente (Jamundí,
 * Yumbo, Palmira, Santander de Quilichao).
 *
 * Contenido anclado en obras reales de la DB (tonelajes verificados al
 * 2026-07-10). Idempotente: si el slug ya existe, lo salta (no pisa
 * ediciones del admin).
 *
 * Ejecutar: npx tsx scripts/seed-landings-ciudades-2026-07.ts
 */
import { PrismaClient } from '@prisma/client'
import { ciudadContenidoSchema } from '../lib/landings-schema'

const prisma = new PrismaClient()

const PRECIOS_FAQ_RESPUESTA_BASE =
  'Como rango orientativo de mercado: estructura liviana de bodegas y cubiertas entre $10.900 y $13.000 COP por kilogramo instalado, estructura media de edificios y entrepisos entre $13.000 y $17.000, y estructuras especiales o de grandes luces entre $17.000 y $25.000. La cotización real se elabora sobre planos o anteproyecto, e incluye fabricación, pintura y montaje.'

const REL_PRECIOS = {
  href: '/precios-estructuras-metalicas',
  eyebrow: 'Guía',
  titulo: '¿Cuánto cuesta una estructura metálica?',
  descripcion:
    'Rangos reales de precio por kilogramo instalado en Colombia y los factores que lo hacen variar.',
}
const REL_PILAR = {
  href: '/estructuras-metalicas-colombia',
  eyebrow: 'Nacional',
  titulo: 'Estructuras metálicas en Colombia',
  descripcion:
    'Capacidad nacional de MEISA: tres plantas, equipo propio de montaje y proyectos entregados en todo el país.',
}

interface CiudadSeed {
  slug: string
  titulo: string
  metaTitle: string
  metaDescription: string
  contenido: Record<string, unknown>
}

const CIUDADES: CiudadSeed[] = [
  /* ─── NEIVA — 7 proyectos / 1.873 t ─────────────────────────────────── */
  {
    slug: 'neiva',
    titulo: 'Ciudad — Neiva',
    metaTitle: 'Estructuras Metálicas en Neiva y el Huila | MEISA',
    metaDescription:
      'Estructuras metálicas en Neiva: 7 proyectos y más de 1.800 toneladas, incluidos el Edificio Colpatria y el CC Único. Fabricación y montaje NSR-10.',
    contenido: {
      nombre: 'Neiva',
      h1: 'Estructuras metálicas en Neiva',
      heroCategoriaKey: 'EDIFICACIONES',
      heroEyebrow: 'Obra entregada — Neiva, Huila',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Neiva',
      heroDescripcion:
        'Más de 1.800 toneladas de acero estructural montadas en Neiva: el Edificio Colpatria y el Centro Comercial Único — dos de las estructuras metálicas más grandes del Huila — son obra de MEISA.',
      introEyebrow: '01 — Neiva y el Huila',
      introTitulo1: 'Acero probado',
      introTitulo2: 'en el Huila',
      intro: [
        'En Neiva hemos entregado 7 proyectos con más de 1.800 toneladas de acero estructural. Los dos anclas de la ciudad son obras mayores: el Edificio Colpatria de Neiva, con 902 toneladas de estructura metálica, y el Centro Comercial Único, también con 902 toneladas — al que después volvimos para montar sus graderías, salas de cine y mezzanines de marcas como Royal Films.',
        'Cada proyecto se fabricó en nuestras plantas del suroccidente con corte CNC y soldadura calificada AWS D1.1, se despachó por carretera y se montó con equipo propio, bajo la NSR-10. Esa logística probada Valle–Huila es la misma que ponemos al servicio de cualquier obra nueva en Neiva o en el resto del departamento.',
      ],
      statProyectosLabel: 'Proyectos en Neiva',
      statToneladasLabel: 'Toneladas montadas en la ciudad',
      statsFijas: [
        { valor: '902', sufijo: '', label: 'Toneladas del Edificio Colpatria' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Neiva',
      secciones: [
        {
          nombre: 'Edificios en estructura metálica',
          descripcion:
            'El Edificio Colpatria de Neiva — 902 toneladas de acero estructural — es una de las edificaciones metálicas más grandes del Huila: pórticos y entrepisos metálicos con la velocidad de obra que el concreto no alcanza.',
        },
        {
          nombre: 'Centros comerciales y retail',
          descripcion:
            'El Centro Comercial Único de Neiva (902 toneladas) es obra nuestra, igual que sus graderías y salas de cine de Royal Films, el contrapiso técnico y mezzanines de locales comerciales: estructura principal y remodelaciones de retail en funcionamiento.',
        },
        {
          nombre: 'Entrepisos y mezzanines comerciales',
          descripcion:
            'Mezzanines para marcas en operación — sin cerrar el local: estructuras livianas y medianas que amplían el área vendible aprovechando la altura, fabricadas a medida e izadas en jornadas nocturnas cuando la operación lo exige.',
        },
        {
          nombre: 'Bodegas e industria del Huila',
          descripcion:
            'Naves, bodegas y estructuras de proceso para la industria y el agro del Huila, fabricadas en planta y montadas con personal propio: luces de 20 a 40 metros con cubierta y cerramiento metálico.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja',
      ventajaTitulo: 'Obra mayor ya entregada en la ciudad',
      ventaja: [
        'Quien construye en Neiva puede visitar nuestras obras antes de firmar: el Colpatria y el Único no son renders, son 1.800 toneladas montadas y en servicio. Esa es la diferencia entre prometer capacidad y demostrarla en la misma ciudad donde se cotiza.',
        'La logística Valle–Huila está resuelta hace años: despachos por tramos sincronizados con el cronograma de montaje, equipo de izaje propio y residentes de obra que ya conocen la ciudad. Para el constructor eso significa una sola responsabilidad desde la ingeniería de detalle hasta el acta de entrega.',
      ],
      proyectosTitulo2: 'en Neiva',
      proyectosDescripcion:
        'Los proyectos de mayor tonelaje entregados en Neiva: el Edificio Colpatria y el Centro Comercial Único — con sus graderías, cines y mezzanines — fabricados en nuestras plantas y montados con equipo propio.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Neiva',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Neiva?',
          respuesta:
            'Siete proyectos con más de 1.800 toneladas: el Edificio Colpatria (902 toneladas), el Centro Comercial Único (902 toneladas) y las obras posteriores dentro del mismo centro comercial — graderías y salas de cine de Royal Films, contrapiso técnico y mezzanines de locales como Alberto VO5.',
        },
        {
          pregunta: '¿Cómo manejan la logística si la fabricación no es en Neiva?',
          respuesta:
            'La estructura se fabrica en nuestras plantas del suroccidente (Jamundí, Villa Rica y Popayán) y se despacha por carretera en tramos listos para montar, sincronizados con el cronograma. Así se montaron el Colpatria y el Único: el flete se planifica dentro del cronograma de obra y el montaje corre con equipo propio de MEISA, sin intermediarios.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Neiva?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para obras en Neiva el flete desde el Valle se incluye como un ítem transparente de la cotización.',
        },
        {
          pregunta: '¿Las estructuras cumplen la NSR-10?',
          respuesta:
            'Sí. Todas nuestras estructuras se diseñan bajo los Títulos A y F de la NSR-10 con los grados de disipación de energía que exige la zona. Entregamos memorias de cálculo firmadas por ingenieros matriculados, planos de taller, certificados de materiales y registros de soldadura bajo AWS D1.1.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/edificios-en-estructura-metalica',
          eyebrow: 'Solución',
          titulo: 'Edificios en estructura metálica',
          descripcion:
            'Como el Colpatria de Neiva: pórticos y entrepisos de acero para edificios de oficinas, vivienda y uso mixto.',
        },
        {
          href: '/soluciones/estructura-metalica-centros-comerciales',
          eyebrow: 'Solución',
          titulo: 'Estructura metálica para centros comerciales',
          descripcion:
            'Como el CC Único de Neiva: grandes luces y plazos cortos para retail, con más de 14.600 toneladas entregadas.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Neiva',
      ctaTitulo1: 'Su obra en Neiva,',
      ctaTitulo2: 'con acero probado.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance, flete y plazo — con visita técnica en Neiva y el Huila.',
      terminosUbicacion: ['Neiva'],
    },
  },

  /* ─── PASTO — 8 proyectos / 746 t ───────────────────────────────────── */
  {
    slug: 'pasto',
    titulo: 'Ciudad — Pasto',
    metaTitle: 'Estructuras Metálicas en Pasto y Nariño | MEISA',
    metaDescription:
      'Estructuras metálicas en Pasto: 8 proyectos entregados — puente vehicular, planta industrial Friesland, centros comerciales y retail. Fabricación y montaje NSR-10.',
    contenido: {
      nombre: 'Pasto',
      h1: 'Estructuras metálicas en Pasto',
      heroCategoriaKey: 'COMERCIAL',
      heroEyebrow: 'Obra entregada — Pasto, Nariño',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Pasto',
      heroDescripcion:
        'Ocho proyectos entregados en Pasto: un puente vehicular, la planta industrial de Friesland, centros comerciales y estructuras de retail. Acero del suroccidente para el sur del país.',
      introEyebrow: '01 — Pasto y Nariño',
      introTitulo1: 'El sur también',
      introTitulo2: 'se construye en acero',
      intro: [
        'En Pasto hemos entregado 8 proyectos que cubren casi todo el espectro de la construcción en acero: un puente vehicular urbano, la planta industrial de Friesland Colombia — infraestructura láctea con exigencias sanitarias y de proceso —, el Centro Comercial Popular, salas de cine de Royal Films y estructuras de retail para grandes superficies.',
        'Nariño es parte natural de nuestra zona de cobertura: desde las plantas del Valle y el Cauca, la carretera Panamericana conecta directamente la fabricación con la obra. Ingeniería de detalle propia, corte CNC, soldadura calificada AWS D1.1 y montaje con personal de MEISA, bajo la NSR-10 para una de las zonas sísmicas más exigentes del país.',
      ],
      statProyectosLabel: 'Proyectos en Pasto',
      statToneladasLabel: 'Toneladas montadas en la ciudad',
      statsFijas: [
        { valor: '3', sufijo: '', label: 'Plantas en el suroccidente' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Pasto y Nariño',
      secciones: [
        {
          nombre: 'Puentes vehiculares',
          descripcion:
            'El Puente Vehicular de Pasto es obra nuestra: estructura de acero fabricada en planta, transportada por la Panamericana y montada con izajes programados — la especialidad de MEISA aplicada a la infraestructura urbana de Nariño.',
        },
        {
          nombre: 'Industria y agroindustria',
          descripcion:
            'La planta de Friesland Colombia en Pasto: estructura para industria láctea con requerimientos de proceso, alturas libres y cerramientos técnicos. Experiencia directa en plantas industriales del sur del país.',
        },
        {
          nombre: 'Centros comerciales y retail',
          descripcion:
            'El Centro Comercial Popular de Pasto, las salas de cine de Royal Films del CC Único y los mezzanines de grandes superficies como Carrefour: estructura principal y ampliaciones de retail en operación.',
        },
        {
          nombre: 'Cubiertas y equipamiento',
          descripcion:
            'Cerchas, arcos y cubiertas autoportantes para equipamiento urbano, institucional y deportivo — fabricadas a medida para la topografía y la sismicidad de Nariño.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja',
      ventajaTitulo: 'Cobertura real del sur del país',
      ventaja: [
        'Para muchas empresas nacionales, Pasto queda "lejos". Para MEISA es parte de la zona natural de trabajo: el suroccidente colombiano es nuestra casa y la Panamericana es nuestra ruta de despacho. Los 8 proyectos entregados en la ciudad — del puente vehicular a la planta de Friesland — son la prueba operativa.',
        'El constructor nariñense obtiene lo mismo que el de Cali o Bogotá: una sola empresa responsable del diseño de detalle, la fabricación certificada y el montaje en obra, con cotización sobre planos y cronogramas que se cumplen.',
      ],
      proyectosTitulo2: 'en Pasto',
      proyectosDescripcion:
        'Obra entregada en Pasto: puente vehicular urbano, la planta industrial de Friesland Colombia, el Centro Comercial Popular y estructuras de retail para Royal Films y grandes superficies.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Pasto',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Pasto?',
          respuesta:
            'Ocho proyectos: el Puente Vehicular de Pasto, la planta de Friesland Colombia, el Centro Comercial Popular, las salas de cine de Royal Films en el CC Único, mezzanines para grandes superficies como Carrefour y otras estructuras comerciales e institucionales.',
        },
        {
          pregunta: '¿Atienden obras en otros municipios de Nariño?',
          respuesta:
            'Sí. Desde nuestras plantas del Valle y el Cauca despachamos por la Panamericana a todo Nariño: Ipiales, Túquerres, La Unión y el resto del departamento. La visita técnica y la propuesta se coordinan igual que para una obra en Pasto.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Pasto?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para obras en Nariño el flete por la Panamericana se planifica dentro del cronograma y se presenta como ítem transparente.',
        },
        {
          pregunta: '¿Las estructuras cumplen la NSR-10 para la sismicidad de Nariño?',
          respuesta:
            'Sí. Nariño está en zona de amenaza sísmica alta y nuestras estructuras se diseñan bajo los Títulos A y F de la NSR-10 con los grados de disipación de energía correspondientes. Entregamos memorias de cálculo firmadas, planos de taller, certificados de materiales y registros de soldadura AWS D1.1. El menor peso del acero es además una ventaja real de desempeño sísmico.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/puentes-metalicos',
          eyebrow: 'Solución',
          titulo: 'Puentes metálicos',
          descripcion:
            'Como el puente vehicular de Pasto: vigas, cerchas y sistemas mixtos fabricados en planta y montados con izajes programados.',
        },
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Como la planta de Friesland en Pasto: naves de proceso con alturas libres y cerramientos técnicos.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Pasto',
      ctaTitulo1: 'Su obra en Nariño,',
      ctaTitulo2: 'a una llamada.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance, flete y plazo — con visita técnica en Pasto y todo Nariño.',
      terminosUbicacion: ['Pasto'],
    },
  },

  /* ─── BARRANQUILLA — 4 proyectos / 638 t ────────────────────────────── */
  {
    slug: 'barranquilla',
    titulo: 'Ciudad — Barranquilla',
    metaTitle: 'Estructuras Metálicas en Barranquilla | MEISA',
    metaDescription:
      'Estructuras metálicas en Barranquilla: CC Único (626 t), industria de frío para Pollos Bucanero y retail. Fabricación certificada y montaje NSR-10 en la Costa.',
    contenido: {
      nombre: 'Barranquilla',
      h1: 'Estructuras metálicas en Barranquilla',
      heroCategoriaKey: 'COMERCIAL',
      heroEyebrow: 'Obra entregada — Barranquilla, Atlántico',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Barranquilla',
      heroDescripcion:
        'El Centro Comercial Único de Barranquilla — 626 toneladas de acero estructural — es obra de MEISA, junto con estructuras industriales de frío y retail. Acero certificado del suroccidente para la Costa.',
      introEyebrow: '01 — Barranquilla y la Costa',
      introTitulo1: 'Acero que llegó',
      introTitulo2: 'a la Costa',
      intro: [
        'En Barranquilla montamos el Centro Comercial Único — 626 toneladas de estructura metálica — y volvimos después para sus salas de cine de Royal Films y obras complementarias. También construimos los cuartos fríos de Pollos Bucanero: estructura para industria de alimentos con exigencias térmicas y sanitarias.',
        'Cada tonelada se fabricó en nuestras plantas con corte CNC y soldadura calificada AWS D1.1, se despachó a la Costa y se montó con equipo propio bajo la NSR-10. La logística de despacho nacional está probada: el mismo estándar de fabricación llega a cualquier puerto u obra del Atlántico.',
      ],
      statProyectosLabel: 'Proyectos en Barranquilla',
      statToneladasLabel: 'Toneladas montadas en la ciudad',
      statsFijas: [
        { valor: '626', sufijo: '', label: 'Toneladas del CC Único B/quilla' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Barranquilla',
      secciones: [
        {
          nombre: 'Centros comerciales y retail',
          descripcion:
            'El Centro Comercial Único de Barranquilla (626 toneladas) es obra nuestra, incluidas sus salas de cine de Royal Films y estructuras complementarias como rampas provisionales durante la construcción: retail de gran formato, de la estructura principal al detalle.',
        },
        {
          nombre: 'Industria de alimentos y frío',
          descripcion:
            'Los cuartos fríos de Pollos Bucanero en Barranquilla: estructura para industria de alimentos con cerramientos térmicos y requerimientos sanitarios — experiencia directa en el sector agroindustrial de la Costa.',
        },
        {
          nombre: 'Bodegas y naves logísticas',
          descripcion:
            'Naves y centros de distribución para el corredor logístico y portuario del Atlántico: luces de 20 a 40 metros, cubiertas y cerramientos metálicos, fabricados en planta y montados con equipo propio.',
        },
        {
          nombre: 'Estructura para clima costero',
          descripcion:
            'Especificaciones para ambiente marino: sistemas de pintura y protección anticorrosiva de mayor exigencia, granallado SSPC y esquemas epóxicos — el acero en la Costa se protege desde el taller, no en la obra.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja',
      ventajaTitulo: 'Estándar nacional, obra en la Costa',
      ventaja: [
        'El Único de Barranquilla demuestra el modelo: fabricación certificada en nuestras plantas, despacho nacional planificado y montaje con equipo propio de MEISA en la ciudad. Sin franquicias ni intermediarios — la misma empresa que calculó la estructura la entrega montada.',
        'Para el ambiente costero aplicamos protección anticorrosiva de especificación marina desde el taller: granallado, esquemas de pintura de alto espesor y tornillería adecuada. Es la diferencia entre una estructura que dura y una que se oxida a los cinco años.',
      ],
      proyectosTitulo2: 'en Barranquilla',
      proyectosDescripcion:
        'Obra entregada en Barranquilla: el Centro Comercial Único (626 toneladas) con sus cines Royal Films, y los cuartos fríos de Pollos Bucanero para la industria de alimentos.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Barranquilla',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Barranquilla?',
          respuesta:
            'Cuatro proyectos: el Centro Comercial Único (626 toneladas de estructura metálica), sus salas de cine de Royal Films, estructuras complementarias de obra y los cuartos fríos de Pollos Bucanero para industria de alimentos.',
        },
        {
          pregunta: '¿Cómo protegen el acero del clima costero?',
          respuesta:
            'Con especificación marina desde el taller: granallado SSPC, esquemas de pintura epóxica de alto espesor y tornillería galvanizada o de acero inoxidable según el caso. La protección anticorrosiva se define en la ingeniería de detalle y se aplica en planta, donde el control de calidad es verificable — no en la obra.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Barranquilla?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para la Costa, el esquema de protección anticorrosiva marina y el flete se presentan como ítems transparentes de la cotización.',
        },
        {
          pregunta: '¿Atienden otras ciudades de la Costa?',
          respuesta:
            'Sí: Cartagena, Santa Marta, Valledupar y el resto de la región Caribe. El despacho se planifica igual que para Barranquilla, con tramos listos para montar y equipo de montaje propio desplazado a la obra.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/estructura-metalica-centros-comerciales',
          eyebrow: 'Solución',
          titulo: 'Estructura metálica para centros comerciales',
          descripcion:
            'Como el CC Único de Barranquilla: más de 14.600 toneladas entregadas en retail de gran formato.',
        },
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Naves logísticas para el corredor portuario del Atlántico, con protección anticorrosiva de especificación marina.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Barranquilla',
      ctaTitulo1: 'Su obra en la Costa,',
      ctaTitulo2: 'con acero protegido.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, esquema de protección marina, flete y plazo.',
      terminosUbicacion: ['Barranquilla'],
    },
  },

  /* ─── VILLAVICENCIO — 1 proyecto / 670 t ────────────────────────────── */
  {
    slug: 'villavicencio',
    titulo: 'Ciudad — Villavicencio',
    metaTitle: 'Estructuras Metálicas en Villavicencio y el Meta | MEISA',
    metaDescription:
      'Estructuras metálicas en Villavicencio: el CC Único (670 toneladas) es obra de MEISA. Fabricación certificada y montaje NSR-10 para el Meta y los Llanos.',
    contenido: {
      nombre: 'Villavicencio',
      h1: 'Estructuras metálicas en Villavicencio',
      heroCategoriaKey: 'COMERCIAL',
      heroEyebrow: 'Obra entregada — Villavicencio, Meta',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Villavicencio',
      heroDescripcion:
        'El Centro Comercial Único de Villavicencio — 670 toneladas de acero estructural — es obra de MEISA: fabricación certificada, despacho nacional y montaje con equipo propio en la puerta de los Llanos.',
      introEyebrow: '01 — Villavicencio y el Meta',
      introTitulo1: 'Acero montado',
      introTitulo2: 'en los Llanos',
      intro: [
        'En Villavicencio montamos el Centro Comercial Único: 670 toneladas de estructura metálica en una sola obra — la carta de presentación de MEISA en el Meta. Estructura principal de retail de gran formato, fabricada con corte CNC y soldadura calificada AWS D1.1 y montada con equipo propio bajo la NSR-10.',
        'La puerta de los Llanos es un mercado en crecimiento: agroindustria, logística y comercio demandan naves, bodegas y estructuras que el concreto no resuelve con la misma velocidad. Nuestra logística de despacho nacional — probada con el Único — pone la fabricación certificada del suroccidente a disposición de cualquier obra del Meta.',
      ],
      statProyectosLabel: 'Proyectos en Villavicencio',
      statToneladasLabel: 'Toneladas montadas en la ciudad',
      statsFijas: [
        { valor: '670', sufijo: '', label: 'Toneladas del CC Único' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Villavicencio y el Meta',
      secciones: [
        {
          nombre: 'Centros comerciales y retail',
          descripcion:
            'El Centro Comercial Único de Villavicencio (670 toneladas) es obra nuestra: grandes luces, plazos cortos y estructura vista — el formato que el retail moderno exige y que el acero resuelve mejor que cualquier otro sistema.',
        },
        {
          nombre: 'Bodegas y agroindustria de los Llanos',
          descripcion:
            'Naves para almacenamiento de granos, plantas de proceso y centros de distribución del corredor Bogotá–Villavicencio: luces de 20 a 40 metros con cubierta y cerramiento metálico, fabricadas en planta.',
        },
        {
          nombre: 'Edificios y entrepisos',
          descripcion:
            'Pórticos y entrepisos metálicos para edificaciones comerciales e institucionales: menos peso, menos cimentación y obra más rápida — ventajas que pesan en los suelos de la Orinoquía.',
        },
        {
          nombre: 'Cubiertas de gran luz',
          descripcion:
            'Cerchas y arcos para equipamiento deportivo, educativo y de espacio público: cubiertas autoportantes fabricadas a medida y montadas con izajes programados.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja',
      ventajaTitulo: '670 toneladas de prueba en la ciudad',
      ventaja: [
        'El Único de Villavicencio no es una promesa comercial: es una obra de 670 toneladas que cualquier constructor puede visitar. Fabricamos, despachamos y montamos esa estructura con el mismo modelo que ofrecemos hoy — una sola empresa responsable desde la ingeniería de detalle hasta el acta de entrega.',
        'Para el Meta y los Llanos eso significa acceso a fabricación certificada de primer nivel sin depender de talleres locales de capacidad limitada: la estructura llega lista para montar, con planos de taller, certificados de materiales y soldadura calificada.',
      ],
      proyectosTitulo2: 'en Villavicencio',
      proyectosDescripcion:
        'La obra entregada en Villavicencio: el Centro Comercial Único, 670 toneladas de estructura metálica fabricadas en planta y montadas con equipo propio de MEISA.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Villavicencio',
      faq: [
        {
          pregunta: '¿Qué ha construido MEISA en Villavicencio?',
          respuesta:
            'El Centro Comercial Único de Villavicencio: 670 toneladas de estructura metálica en una sola obra — estructura principal de retail de gran formato, fabricada en nuestras plantas y montada con equipo propio bajo la NSR-10.',
        },
        {
          pregunta: '¿Cómo funciona el despacho hasta el Meta?',
          respuesta:
            'La estructura se fabrica por tramos listos para montar y se despacha por carretera de forma sincronizada con el cronograma de montaje — así se construyó el Único. El flete es un ítem transparente de la cotización y el montaje corre con equipo propio de MEISA desplazado a la obra.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Villavicencio?',
          respuesta: PRECIOS_FAQ_RESPUESTA_BASE,
        },
        {
          pregunta: '¿Atienden otros municipios de los Llanos?',
          respuesta:
            'Sí: Acacías, Granada, Puerto López, Yopal y el resto de la Orinoquía. La logística se planifica igual que para Villavicencio, con visita técnica y cotización sobre planos.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/estructura-metalica-centros-comerciales',
          eyebrow: 'Solución',
          titulo: 'Estructura metálica para centros comerciales',
          descripcion:
            'Como el CC Único de Villavicencio: retail de gran formato con más de 14.600 toneladas entregadas.',
        },
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Naves para la agroindustria y la logística de los Llanos: luces grandes, cubierta y cerramiento metálico.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Villavicencio',
      ctaTitulo1: 'Su obra en los Llanos,',
      ctaTitulo2: 'con respaldo nacional.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance, flete y plazo — con visita técnica en Villavicencio y el Meta.',
      terminosUbicacion: ['Villavicencio'],
    },
  },

  /* ─── JAMUNDÍ — 5 proyectos / 1.382 t + LA PLANTA PRINCIPAL ─────────── */
  {
    slug: 'jamundi',
    titulo: 'Ciudad — Jamundí',
    metaTitle: 'Estructuras Metálicas en Jamundí — Planta Principal | MEISA',
    metaDescription:
      'Estructuras metálicas en Jamundí: aquí está la planta principal de MEISA. Complejo Tecnoquímicas (1.250+ t), retail y obra local con flete cero.',
    contenido: {
      nombre: 'Jamundí',
      h1: 'Estructuras metálicas en Jamundí',
      heroCategoriaKey: 'INDUSTRIAL',
      heroEyebrow: 'Nuestra planta principal — Jamundí, Valle',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Jamundí',
      heroDescripcion:
        'Jamundí es la casa de MEISA: aquí opera nuestra planta principal de fabricación. Y aquí mismo está la prueba — el complejo industrial de Tecnoquímicas, con más de 1.250 toneladas montadas por nosotros.',
      introEyebrow: '01 — Nuestra casa',
      introTitulo1: 'Fabricamos',
      introTitulo2: 'en Jamundí',
      intro: [
        'La planta principal de MEISA está en Jamundí: aquí se corta, arma y suelda buena parte del acero que montamos en todo el país. Y a minutos de la planta está una de nuestras mejores cartas de presentación: el complejo industrial de Tecnoquímicas, donde hemos montado el Edificio de Sólidos de Altos Volúmenes (615 toneladas), el Edificio de Cápsulas Blandas (508 toneladas) y la Bodega 3 (132 toneladas) — infraestructura farmacéutica de precisión.',
        'Para una obra en Jamundí eso significa una ventaja que nadie más puede ofrecer: la estructura se fabrica en el mismo municipio. Flete prácticamente cero, respuesta de taller el mismo día y supervisión directa de la gerencia técnica — con corte CNC, soldadura calificada AWS D1.1 y montaje con personal propio bajo la NSR-10.',
      ],
      statProyectosLabel: 'Proyectos en Jamundí',
      statToneladasLabel: 'Toneladas montadas en el municipio',
      statsFijas: [
        { valor: '1', sufijo: '', label: 'Planta principal de MEISA' },
        { valor: '1.250', sufijo: '+', label: 'Toneladas en Tecnoquímicas' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Jamundí',
      secciones: [
        {
          nombre: 'Industria farmacéutica y de proceso',
          descripcion:
            'El complejo de Tecnoquímicas en Jamundí es obra nuestra en tres frentes: Sólidos de Altos Volúmenes (615 toneladas), Cápsulas Blandas (508 toneladas) y la Bodega 3 (132 toneladas) — edificios industriales de varios niveles con exigencias farmacéuticas de precisión y limpieza.',
        },
        {
          nombre: 'Comercio y retail local',
          descripcion:
            'Los locales comerciales de Natura Park (73 toneladas) y estructuras como el local de Dollar City en Alfaguara: el crecimiento comercial de Jamundí — uno de los municipios de mayor expansión del Valle — también se monta sobre nuestro acero.',
        },
        {
          nombre: 'Bodegas y naves',
          descripcion:
            'Naves industriales y de almacenamiento fabricadas literalmente al lado de la obra: luces de 20 a 40 metros con cubierta y cerramiento, sin flete y con despacho directo de planta a sitio.',
        },
        {
          nombre: 'Vivienda y equipamiento en expansión',
          descripcion:
            'Jamundí es la frontera de crecimiento del sur de Cali: entrepisos, cubiertas y estructuras para los proyectos residenciales, educativos y de equipamiento que acompañan esa expansión.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja local',
      ventajaTitulo: 'La estructura se fabrica en el mismo municipio',
      ventaja: [
        'Ninguna otra empresa de estructuras metálicas puede decirle a un constructor de Jamundí: "la planta está aquí". Nosotros sí. Eso elimina el flete, acorta los plazos, permite ajustes de taller el mismo día y pone la supervisión técnica a minutos de la obra.',
        'La prueba está montada: Tecnoquímicas — una de las farmacéuticas más exigentes del país — nos ha confiado más de 1.250 toneladas de su complejo en Jamundí, edificio tras edificio. La cercanía ayuda; la calidad repite.',
      ],
      proyectosTitulo2: 'en Jamundí',
      proyectosDescripcion:
        'La obra entregada en Jamundí: el complejo industrial de Tecnoquímicas — Sólidos, Cápsulas Blandas y Bodega 3 — y estructuras comerciales como Natura Park y Dollar City Alfaguara.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Jamundí',
      faq: [
        {
          pregunta: '¿MEISA tiene planta en Jamundí?',
          respuesta:
            'Sí — la planta principal. En Jamundí se fabrica buena parte del acero que MEISA monta en todo el país, con corte CNC, armado y soldadura calificada AWS D1.1. Para una obra en el municipio eso significa flete prácticamente cero y respuesta de taller inmediata. Contamos además con plantas en Villa Rica (Cauca) y Popayán.',
        },
        {
          pregunta: '¿Qué proyectos han construido en Jamundí?',
          respuesta:
            'El complejo industrial de Tecnoquímicas es el más representativo: Edificio de Sólidos de Altos Volúmenes (615 toneladas), Edificio de Cápsulas Blandas (508 toneladas) y Bodega 3 (132 toneladas). En retail, los locales comerciales de Natura Park (73 toneladas) y el local de Dollar City en Alfaguara.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Jamundí?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para obras en Jamundí la fabricación es local — el flete prácticamente desaparece del costo, una ventaja directa de nuestra planta en el municipio.',
        },
        {
          pregunta: '¿Atienden el sur de Cali y los municipios vecinos?',
          respuesta:
            'Sí: el corredor Cali–Jamundí, Puerto Tejada, Villa Rica, Caloto y el norte del Cauca están a minutos de nuestras plantas de Jamundí y Villa Rica. Es la zona de respuesta más rápida de MEISA en el país.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Como el complejo de Tecnoquímicas: naves e industria de proceso fabricadas al lado de la obra.',
        },
        {
          href: '/estructuras-metalicas/cali',
          eyebrow: 'Ciudad',
          titulo: 'Estructuras metálicas en Cali',
          descripcion:
            'La obra de MEISA en la capital del Valle: MIO, retail y más de 7.900 toneladas entregadas.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Jamundí',
      ctaTitulo1: 'Su obra, al lado',
      ctaTitulo2: 'de nuestra planta.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica el mismo día en Jamundí.',
      terminosUbicacion: ['Jamund'],
    },
  },

  /* ─── YUMBO — 8 proyectos / 640 t ───────────────────────────────────── */
  {
    slug: 'yumbo',
    titulo: 'Ciudad — Yumbo',
    metaTitle: 'Estructuras Metálicas en Yumbo — Zona Industrial | MEISA',
    metaDescription:
      'Estructuras metálicas en Yumbo: CC Único (440+ t), bodega de Cementos Argos y torre de cogeneración de Propal. Fabricación y montaje NSR-10 en la capital industrial del Valle.',
    contenido: {
      nombre: 'Yumbo',
      h1: 'Estructuras metálicas en Yumbo',
      heroCategoriaKey: 'INDUSTRIAL',
      heroEyebrow: 'Obra entregada — Yumbo, Valle',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Yumbo',
      heroDescripcion:
        'La capital industrial del Valle construye con nuestro acero: el CC Único, la bodega de Cementos Argos y la torre de cogeneración de Propal son obra de MEISA — a 30 minutos de nuestra planta.',
      introEyebrow: '01 — La capital industrial',
      introTitulo1: 'Acero para',
      introTitulo2: 'la industria',
      intro: [
        'Yumbo concentra la industria pesada del Valle, y ocho de sus estructuras son nuestras: el Centro Comercial Único con sus parqueaderos y cines (más de 440 toneladas), la bodega de Cementos Argos, la torre de cogeneración de Propal (110 toneladas) y las salas de cine de Royal Films, entre otras.',
        'Trabajar en Yumbo es jugar de local: nuestra planta principal de Jamundí está a media hora por la vía Cali–Yumbo. Estructura de proceso, bodegas, torres industriales y retail — fabricados con corte CNC y soldadura AWS D1.1, montados con equipo propio bajo la NSR-10 y con respuesta de taller el mismo día.',
      ],
      statProyectosLabel: 'Proyectos en Yumbo',
      statToneladasLabel: 'Toneladas montadas en el municipio',
      statsFijas: [
        { valor: '30', sufijo: ' min', label: 'Desde nuestra planta de Jamundí' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Yumbo',
      secciones: [
        {
          nombre: 'Estructura industrial pesada',
          descripcion:
            'La torre de cogeneración de Propal (110 toneladas) y la bodega de Cementos Argos: estructura de proceso para dos gigantes industriales del Valle — cargas dinámicas, alturas y tolerancias que exigen fabricación de precisión.',
        },
        {
          nombre: 'Centros comerciales y retail',
          descripcion:
            'El Centro Comercial Único de Yumbo es obra nuestra en varias fases: la estructura principal (320 toneladas), los parqueaderos y cines (122 toneladas) y las salas de Royal Films — retail completo, de la estructura al equipamiento.',
        },
        {
          nombre: 'Bodegas y naves logísticas',
          descripcion:
            'El corredor Cali–Yumbo es el eje logístico del suroccidente: naves de 20 a 40 metros de luz, centros de distribución y ampliaciones de planta, fabricados a 30 minutos y montados sin fricción logística.',
        },
        {
          nombre: 'Ampliaciones sin parar la producción',
          descripcion:
            'Mezzanines, plataformas y refuerzos dentro de plantas en operación: ingeniería de detalle que respeta la producción, montajes en ventanas programadas y soldadura calificada dentro de instalaciones industriales activas.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja local',
      ventajaTitulo: 'La industria del Valle, a 30 minutos de la planta',
      ventaja: [
        'Argos y Propal no contratan por catálogo: auditan taller, exigen trazabilidad y verifican soldadura. Que ambos tengan estructura nuestra en Yumbo dice más que cualquier folleto — y esa misma trazabilidad (planos de taller, certificados de materiales, registros AWS D1.1) la recibe cada cliente, sea una torre de proceso o una bodega.',
        'La cercanía es operativa, no retórica: media hora entre la planta de Jamundí y la zona industrial de Yumbo significa despachos justo a tiempo, ajustes de taller el mismo día y visitas técnicas sin agenda de por medio.',
      ],
      proyectosTitulo2: 'en Yumbo',
      proyectosDescripcion:
        'La obra entregada en Yumbo: el CC Único en sus varias fases, la bodega de Cementos Argos y la torre de cogeneración de Propal — industria y retail de la capital industrial del Valle.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Yumbo',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Yumbo?',
          respuesta:
            'Ocho proyectos: el Centro Comercial Único (320 toneladas) con sus parqueaderos y cines (122 toneladas) y salas de Royal Films, la bodega de Cementos Argos y la torre de cogeneración de Propal (110 toneladas), entre otros.',
        },
        {
          pregunta: '¿Pueden trabajar dentro de plantas en operación?',
          respuesta:
            'Sí — es parte de nuestra especialidad industrial. Planificamos montajes en ventanas de parada o en horarios que no interfieren con la producción, con permisos de trabajo, personal certificado en alturas y soldadura calificada dentro de instalaciones activas. Así se ejecutaron las obras de Propal y Argos.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Yumbo?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para Yumbo el flete es mínimo: la planta de Jamundí está a 30 minutos de la zona industrial.',
        },
        {
          pregunta: '¿Atienden el corredor industrial Cali–Yumbo completo?',
          respuesta:
            'Sí: Acopi, Arroyohondo, la zona franca del Pacífico y los parques industriales del corredor. Es nuestra zona de respuesta inmediata, junto con Cali y Jamundí.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Como la bodega de Argos en Yumbo: naves e industria de proceso para el corredor Cali–Yumbo.',
        },
        {
          href: '/estructuras-metalicas/cali',
          eyebrow: 'Ciudad',
          titulo: 'Estructuras metálicas en Cali',
          descripcion:
            'La obra de MEISA en la capital del Valle: MIO, retail y más de 7.900 toneladas entregadas.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Yumbo',
      ctaTitulo1: 'Su planta o su nave,',
      ctaTitulo2: 'a 30 minutos del taller.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica inmediata en la zona industrial.',
      terminosUbicacion: ['Yumbo'],
    },
  },

  /* ─── PALMIRA — 6 proyectos / 803 t ─────────────────────────────────── */
  {
    slug: 'palmira',
    titulo: 'Ciudad — Palmira',
    metaTitle: 'Estructuras Metálicas en Palmira | MEISA',
    metaDescription:
      'Estructuras metálicas en Palmira: Galería Llanogrande (325 t), Sucroal, Ingenio Manuelita y hangar del aeropuerto Bonilla Aragón. Fabricación y montaje NSR-10.',
    contenido: {
      nombre: 'Palmira',
      h1: 'Estructuras metálicas en Palmira',
      heroCategoriaKey: 'INDUSTRIAL',
      heroEyebrow: 'Obra entregada — Palmira, Valle',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Palmira',
      heroDescripcion:
        'De la Galería Llanogrande al hangar del aeropuerto Bonilla Aragón, pasando por Sucroal y el Ingenio Manuelita: seis proyectos y más de 800 toneladas montadas en Palmira.',
      introEyebrow: '01 — Palmira y su industria',
      introTitulo1: 'Acero para el agro',
      introTitulo2: 'y la ciudad',
      intro: [
        'En Palmira hemos entregado 6 proyectos con más de 800 toneladas: la Galería del Centro Comercial Llanogrande (325 toneladas), el centro de distribución (170 toneladas) y el Edificio Cítrico (166 toneladas) de Sucroal, el edificio de 6 plantas del Ingenio Manuelita (72 toneladas) y el hangar del aeropuerto Alfonso Bonilla Aragón (47 toneladas).',
        'Es un portafolio que retrata a Palmira: agroindustria azucarera, comercio en crecimiento e infraestructura aeroportuaria. Todo fabricado a menos de una hora, en nuestras plantas de Jamundí y Villa Rica, con corte CNC, soldadura calificada AWS D1.1 y montaje con personal propio bajo la NSR-10.',
      ],
      statProyectosLabel: 'Proyectos en Palmira',
      statToneladasLabel: 'Toneladas montadas en la ciudad',
      statsFijas: [
        { valor: '325', sufijo: '', label: 'Toneladas de la Galería Llanogrande' },
        { valor: '30', sufijo: '+', label: 'Años de experiencia desde 1996' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en Palmira',
      secciones: [
        {
          nombre: 'Agroindustria azucarera',
          descripcion:
            'Sucroal nos confió su centro de distribución (170 toneladas) y el Edificio Cítrico (166 toneladas); el Ingenio Manuelita, su edificio de 6 plantas (72 toneladas). Estructura de proceso para la industria que define al Valle.',
        },
        {
          nombre: 'Comercio y centros comerciales',
          descripcion:
            'La Galería del Centro Comercial Llanogrande — 325 toneladas — es obra nuestra: retail de gran formato con luces amplias y estructura vista, el proyecto comercial de referencia de la ciudad.',
        },
        {
          nombre: 'Infraestructura aeroportuaria',
          descripcion:
            'El hangar del aeropuerto Alfonso Bonilla Aragón (47 toneladas): estructura de gran luz libre para aviación, con las tolerancias y controles que exige la infraestructura aeroportuaria.',
        },
        {
          nombre: 'Bodegas y naves',
          descripcion:
            'Naves y centros de distribución para el eje Palmira–aeropuerto–zona franca: fabricación a menos de una hora y montaje con equipo propio, en uno de los corredores logísticos más activos del Valle.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja',
      ventajaTitulo: 'La agroindustria del Valle ya nos conoce',
      ventaja: [
        'Sucroal y Manuelita son clientes industriales que auditan a sus proveedores: procesos, trazabilidad, seguridad y cumplimiento. Tener obra entregada con ambos — más la Galería Llanogrande y el hangar del Bonilla Aragón — es la mejor referencia posible para cualquier obra nueva en Palmira.',
        'Y la logística juega a favor: nuestras plantas están a menos de una hora, lo que significa despachos sincronizados, ajustes de taller el mismo día y visitas técnicas inmediatas en toda la zona Palmira–Candelaria–El Cerrito.',
      ],
      proyectosTitulo2: 'en Palmira',
      proyectosDescripcion:
        'La obra entregada en Palmira: la Galería Llanogrande, el centro de distribución y el Edificio Cítrico de Sucroal, el edificio del Ingenio Manuelita y el hangar del aeropuerto Bonilla Aragón.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Palmira',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Palmira?',
          respuesta:
            'Seis proyectos con más de 800 toneladas: la Galería del CC Llanogrande (325 toneladas), el centro de distribución de Sucroal (170 toneladas), el Edificio Cítrico de Sucroal (166 toneladas), el edificio de 6 plantas del Ingenio Manuelita (72 toneladas) y el hangar del aeropuerto Alfonso Bonilla Aragón (47 toneladas).',
        },
        {
          pregunta: '¿Trabajan dentro de ingenios y plantas en operación?',
          respuesta:
            'Sí. Las obras de Sucroal y Manuelita se ejecutaron dentro de instalaciones industriales activas: montajes en ventanas programadas, permisos de trabajo, personal certificado y soldadura calificada sin interferir la producción.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Palmira?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para Palmira el flete es mínimo: nuestras plantas están a menos de una hora de la ciudad y del corredor del aeropuerto.',
        },
        {
          pregunta: '¿Atienden los municipios vecinos?',
          respuesta:
            'Sí: Candelaria, El Cerrito (donde también tenemos obra entregada, con más de 1.000 toneladas), Pradera, Florida y todo el corredor central del Valle.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/estructura-metalica-para-bodegas',
          eyebrow: 'Solución',
          titulo: 'Bodegas y naves industriales',
          descripcion:
            'Como el CD de Sucroal: naves de proceso y distribución para la agroindustria del Valle.',
        },
        {
          href: '/soluciones/estructura-metalica-centros-comerciales',
          eyebrow: 'Solución',
          titulo: 'Estructura metálica para centros comerciales',
          descripcion:
            'Como la Galería Llanogrande: retail de gran formato con más de 14.600 toneladas entregadas.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en Palmira',
      ctaTitulo1: 'Su obra en Palmira,',
      ctaTitulo2: 'a una hora del taller.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica en Palmira y el corredor del aeropuerto.',
      terminosUbicacion: ['Palmira'],
    },
  },

  /* ─── SANTANDER DE QUILICHAO — 6 proyectos / 784 t + Puente Ovejas ──── */
  {
    slug: 'santander-de-quilichao',
    titulo: 'Ciudad — Santander de Quilichao',
    metaTitle: 'Estructuras Metálicas en Santander de Quilichao | MEISA',
    metaDescription:
      'Estructuras metálicas en Santander de Quilichao: el Puente Vehicular Ovejas (536 t), Centro SENA y Comfacauca. Plantas propias en el norte del Cauca.',
    contenido: {
      nombre: 'Santander de Quilichao',
      h1: 'Estructuras metálicas en Santander de Quilichao',
      heroCategoriaKey: 'PUENTES',
      heroEyebrow: 'Obra entregada — Norte del Cauca',
      heroTitulo1: 'Estructuras metálicas',
      heroTitulo2: 'en Santander de Quilichao',
      heroDescripcion:
        'El Puente Vehicular Ovejas — 536 toneladas, una de nuestras obras insignia — cruza aquí. Seis proyectos entregados en Quilichao, fabricados en nuestras plantas del norte del Cauca.',
      introEyebrow: '01 — Norte del Cauca',
      introTitulo1: 'El puente insignia',
      introTitulo2: 'cruza aquí',
      intro: [
        'En Santander de Quilichao está una de las obras que mejor nos representa: el Puente Vehicular Ovejas, 536 toneladas de acero estructural sobre el río Ovejas. Junto a él hemos entregado el Centro SENA, la iglesia parroquial Niño Jesús de Praga, la cubierta Caña Dulce de Comfacauca (110 toneladas) y la cubierta metálica del peaje de la UF4 del corredor Popayán–Santander de Quilichao (104 toneladas).',
        'El norte del Cauca es zona de plantas propias: Villa Rica está a minutos y Popayán completa el triángulo. Para la industria del CAUCA — parques industriales, zona franca y agroindustria — eso significa fabricación local certificada, con corte CNC, soldadura AWS D1.1 y montaje con personal propio bajo la NSR-10.',
      ],
      statProyectosLabel: 'Proyectos en Quilichao',
      statToneladasLabel: 'Toneladas montadas en el municipio',
      statsFijas: [
        { valor: '536', sufijo: '', label: 'Toneladas del Puente Ovejas' },
        { valor: '2', sufijo: '', label: 'Plantas en el Cauca (V. Rica y Popayán)' },
      ],
      seccionesEyebrow: '02 — Sectores',
      seccionesTitulo1: 'Qué construimos',
      seccionesTitulo2: 'en el norte del Cauca',
      secciones: [
        {
          nombre: 'Puentes vehiculares',
          descripcion:
            'El Puente Vehicular Ovejas (536 toneladas) es la referencia: fabricación por dovelas en planta, transporte y montaje sobre el cauce con izajes de precisión. La ingeniería de puentes de MEISA, a minutos de sus plantas.',
        },
        {
          nombre: 'Infraestructura vial 4G',
          descripcion:
            'La cubierta metálica del peaje de la UF4 del corredor Popayán–Santander de Quilichao (104 toneladas): obra para concesión vial, con los estándares de interventoría y trazabilidad que exige la infraestructura 4G.',
        },
        {
          nombre: 'Educación y equipamiento social',
          descripcion:
            'El Centro SENA de Santander de Quilichao, la iglesia parroquial Niño Jesús de Praga y la cubierta Caña Dulce de Comfacauca (110 toneladas): equipamiento educativo, religioso y recreativo del norte del Cauca.',
        },
        {
          nombre: 'Industria del norte del Cauca',
          descripcion:
            'Parques industriales, zona franca y agroindustria entre Quilichao, Villa Rica, Puerto Tejada y Caloto: naves y estructuras de proceso fabricadas en el mismo territorio, con la ley Páez como motor histórico de la zona.',
        },
      ],
      ventajaEyebrow: '03 — La ventaja local',
      ventajaTitulo: 'Plantas propias en el norte del Cauca',
      ventaja: [
        'Nuestra planta de Villa Rica está a minutos de Santander de Quilichao, y la de Popayán cierra el circuito por el sur. Para el norte del Cauca eso significa lo mismo que para Jamundí: flete mínimo, respuesta de taller inmediata y presencia técnica permanente en el territorio.',
        'La obra entregada cubre todo el espectro — un puente insignia, infraestructura 4G, equipamiento social e industria — fabricada por una empresa que no viene de fuera: el Cauca es nuestra casa desde 1996.',
      ],
      proyectosTitulo2: 'en Quilichao',
      proyectosDescripcion:
        'La obra entregada en Santander de Quilichao: el Puente Vehicular Ovejas, la cubierta del peaje UF4, el Centro SENA, la iglesia Niño Jesús de Praga y la cubierta Caña Dulce de Comfacauca.',
      faqTitulo1: 'Sobre construir',
      faqTitulo2: 'en Quilichao',
      faq: [
        {
          pregunta: '¿Qué proyectos ha construido MEISA en Santander de Quilichao?',
          respuesta:
            'Seis proyectos: el Puente Vehicular Ovejas (536 toneladas), la cubierta metálica del peaje UF4 del corredor Popayán–Quilichao (104 toneladas), el Centro SENA, la iglesia parroquial Niño Jesús de Praga y la cubierta Caña Dulce de Comfacauca (110 toneladas).',
        },
        {
          pregunta: '¿Qué tan cerca están sus plantas?',
          respuesta:
            'Muy cerca: la planta de Villa Rica está a minutos de Santander de Quilichao, y la de Popayán atiende el sur del departamento. La planta principal de Jamundí completa la red a menos de una hora. Es la zona de mayor densidad de plantas de MEISA en el país.',
        },
        {
          pregunta: '¿Cuánto cuesta una estructura metálica en Santander de Quilichao?',
          respuesta:
            PRECIOS_FAQ_RESPUESTA_BASE +
            ' Para el norte del Cauca la fabricación es local — el flete prácticamente desaparece del costo.',
        },
        {
          pregunta: '¿Atienden los parques industriales y la zona franca del norte del Cauca?',
          respuesta:
            'Sí: Puerto Tejada, Villa Rica, Caloto, Guachené y los parques industriales de la zona son territorio de respuesta inmediata, atendidos desde nuestras plantas de Villa Rica y Jamundí.',
        },
      ],
      relacionadas: [
        {
          href: '/soluciones/puentes-metalicos',
          eyebrow: 'Solución',
          titulo: 'Puentes metálicos',
          descripcion:
            'Como el Puente Ovejas: vigas, dovelas y sistemas mixtos fabricados en planta y montados con izajes de precisión.',
        },
        {
          href: '/estructuras-metalicas/popayan',
          eyebrow: 'Ciudad',
          titulo: 'Estructuras metálicas en Popayán',
          descripcion:
            'Nuestra sede histórica: más de 40 proyectos y 4.000 toneladas en la capital del Cauca.',
        },
        REL_PRECIOS,
        REL_PILAR,
      ],
      ctaEyebrow: 'Construyamos en el norte del Cauca',
      ctaTitulo1: 'Su obra en Quilichao,',
      ctaTitulo2: 'fabricada en el Cauca.',
      ctaDescripcion:
        'Envíenos los planos o el anteproyecto y reciba una cotización formal con peso de acero, alcance y plazo — con visita técnica inmediata en el norte del Cauca.',
      terminosUbicacion: ['Quilichao'],
    },
  },
]

async function main() {
  let creadas = 0
  let saltadas = 0
  for (const [i, ciudad] of CIUDADES.entries()) {
    // Validar contra el schema ANTES de escribir (misma validación del admin)
    const parsed = ciudadContenidoSchema.safeParse(ciudad.contenido)
    if (!parsed.success) {
      console.error(`❌ ${ciudad.slug}: contenido inválido`)
      console.error(parsed.error.issues.slice(0, 5))
      process.exitCode = 1
      continue
    }
    const existente = await prisma.landingSeo.findUnique({
      where: { slug: ciudad.slug },
    })
    if (existente) {
      console.log(`↷ ${ciudad.slug}: ya existe, saltada (no se pisa)`)
      saltadas++
      continue
    }
    await prisma.landingSeo.create({
      data: {
        slug: ciudad.slug,
        tipo: 'CIUDAD',
        titulo: ciudad.titulo,
        metaTitle: ciudad.metaTitle,
        metaDescription: ciudad.metaDescription,
        contenido: parsed.data,
        activa: true,
        orden: 10 + i, // después de cali/bogota/popayan
      },
    })
    console.log(`✓ ${ciudad.slug} creada`)
    creadas++
  }
  console.log(`\nTotal: ${creadas} creadas · ${saltadas} saltadas`)
  await prisma.$disconnect()
}

main()
