// Config en código de la página PILAR del clúster SEO
// (/estructuras-metalicas-colombia). Es el FALLBACK: la fuente editable vive
// en la tabla landings_seo (tipo PILAR, editable en /admin/landings) y se
// resuelve DB-first en lib/content/landings.ts → getPilarDb().
//
// Las partes dinámicas (stats agregados, top proyectos, covers de categoría,
// guías de GUIAS_NAV) NO viven aquí — se calculan en la página.

export interface PilarLinkCard {
  href: string
  titulo: string
  descripcion: string
}

export interface PilarCiudadCard {
  href: string
  nombre: string
  descripcion: string
}

export interface PilarConfig {
  slug: string
  metaTitle: string
  metaDescription: string
  /** Override de la imagen del hero. Vacío = imagenCover de PUENTES. */
  heroImagen?: string
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  heroDescripcion: string
  introEyebrow: string
  introTitulo1: string
  introTitulo2: string
  intro: string[]
  /** Labels de los 2 stats dinámicos + stats fijos adicionales. */
  statProyectosLabel: string
  statToneladasLabel: string
  statsFijas: Array<{ valor: string; sufijo?: string; label: string }>
  solucionesEyebrow: string
  solucionesTitulo1: string
  solucionesTitulo2: string
  soluciones: PilarLinkCard[]
  ventajaEyebrow: string
  ventajaTitulo: string
  ventaja: string[]
  ciudadesEyebrow: string
  ciudadesTitulo: string
  ciudades: PilarCiudadCard[]
  guiasEyebrow: string
  guiasTitulo: string
  faqTitulo1: string
  faqTitulo2: string
  faq: Array<{ pregunta: string; respuesta: string }>
  ctaEyebrow: string
  ctaTitulo1: string
  ctaTitulo2: string
  ctaDescripcion: string
}

export const PILAR_CONFIG: PilarConfig = {
  slug: 'estructuras-metalicas-colombia',
  metaTitle:
    'Estructuras Metálicas en Colombia — Diseño, Fabricación y Montaje | MEISA',
  metaDescription:
    'MEISA diseña, fabrica y monta estructuras metálicas en toda Colombia desde 1996: puentes, edificios, centros comerciales, naves industriales y escenarios deportivos en acero. Capacidad certificada y proyectos entregados en todo el país.',
  heroEyebrow: 'Diseño · Fabricación · Montaje — desde 1996',
  heroTitulo1: 'Estructuras metálicas',
  heroTitulo2: 'en Colombia',
  heroDescripcion:
    'Puentes, edificios, centros comerciales, naves industriales y escenarios deportivos en acero. Tres plantas, equipo propio de montaje y proyectos entregados en todo el país.',
  introEyebrow: 'Quiénes somos',
  introTitulo1: 'Acero que',
  introTitulo2: 'no miente',
  intro: [
    'MEISA es una empresa colombiana de estructuras metálicas fundada en 1996, con plantas en Jamundí, Villa Rica y Popayán y proyectos entregados en todo el país. Diseñamos, fabricamos y montamos acero estructural para puentes, edificios, centros comerciales, naves industriales y escenarios deportivos.',
    'Trabajamos sobre planos: cada proyecto se cotiza según su tonelaje, complejidad y logística de montaje. Bajo un mismo techo cubrimos diseño estructural, fabricación con control de calidad y montaje en obra — el mismo equipo responde por toda la cadena.',
  ],
  statProyectosLabel: 'Proyectos entregados',
  statToneladasLabel: 'Toneladas de acero',
  statsFijas: [
    { valor: '30', sufijo: '+', label: 'Años desde 1996' },
    { valor: '3', sufijo: '', label: 'Plantas de fabricación' },
  ],
  solucionesEyebrow: 'Qué construimos',
  solucionesTitulo1: 'Soluciones en',
  solucionesTitulo2: 'estructura metálica',
  soluciones: [
    {
      href: '/soluciones/edificios-en-estructura-metalica',
      titulo: 'Edificios en estructura metálica',
      descripcion:
        'Pórticos y entrepisos en acero para edificios de vivienda, oficinas y uso mixto.',
    },
    {
      href: '/soluciones/puentes-metalicos',
      titulo: 'Puentes metálicos',
      descripcion:
        'Puentes vehiculares y peatonales en acero: vigas, cerchas y sistemas mixtos.',
    },
    {
      href: '/soluciones/estructura-metalica-para-bodegas',
      titulo: 'Bodegas y naves industriales',
      descripcion:
        'Naves logísticas e industriales de gran luz, con cubierta y fachada metálica.',
    },
    {
      href: '/soluciones/estructura-metalica-centros-comerciales',
      titulo: 'Centros comerciales',
      descripcion:
        'Estructura para centros comerciales y retail: grandes luces y plazos de obra cortos.',
    },
    {
      href: '/soluciones/estructura-metalica-escenarios-deportivos',
      titulo: 'Escenarios deportivos',
      descripcion:
        'Coliseos, estadios y complejos deportivos con cubiertas de gran luz en acero.',
    },
    {
      href: '/soluciones/cubiertas-metalicas',
      titulo: 'Cubiertas y fachadas metálicas',
      descripcion:
        'Cubiertas, fachadas y sistemas de cerramiento en lámina y estructura metálica.',
    },
  ],
  ventajaEyebrow: 'Por qué MEISA',
  ventajaTitulo: 'Toneladas, no promesas',
  ventaja: [
    'Lo que nos separa no es una promesa, son toneladas montadas y proyectos verificables: MIO en Cali, escenarios de Juegos Nacionales, puentes y complejos deportivos entregados. El acero no miente.',
    'Con tres plantas de fabricación y equipo propio de montaje llegamos a obra en todo el territorio nacional, con la trazabilidad y las certificaciones que exigen los grandes contratos.',
  ],
  ciudadesEyebrow: 'Cobertura nacional',
  ciudadesTitulo: 'Dónde construimos',
  ciudades: [
    {
      href: '/estructuras-metalicas/cali',
      nombre: 'Cali',
      descripcion: 'Cobertura del Valle del Cauca y el suroccidente desde Jamundí.',
    },
    {
      href: '/estructuras-metalicas/bogota',
      nombre: 'Bogotá',
      descripcion: 'Proyectos de estructura metálica en la capital y la región central.',
    },
    {
      href: '/estructuras-metalicas/popayan',
      nombre: 'Popayán',
      descripcion: 'Planta y sede histórica de MEISA, obra insignia en el Cauca.',
    },
  ],
  guiasEyebrow: 'Antes de cotizar',
  guiasTitulo: 'Guías técnicas',
  faqTitulo1: 'Sobre el acero',
  faqTitulo2: 'en Colombia',
  faq: [
    {
      pregunta: '¿Cuánto cuesta una estructura metálica en Colombia?',
      respuesta:
        'El costo se cotiza por kilogramo instalado y depende del tipo de estructura. Como referencia de mercado, la estructura liviana ronda los rangos más bajos y la especial o de puentes los más altos; el valor incluye fabricación, pintura y montaje, y excluye cimentación y acabados. Siempre se cotiza sobre planos. Ver la guía de precios de estructuras metálicas para los rangos orientativos.',
    },
    {
      pregunta: '¿MEISA trabaja en toda Colombia?',
      respuesta:
        'Sí. Con plantas en Jamundí, Villa Rica y Popayán y equipo propio de montaje, MEISA fabrica y monta estructuras metálicas en todo el país, con proyectos entregados en Cali, Bogotá, Popayán y otras regiones.',
    },
    {
      pregunta: '¿Qué tipos de estructura metálica fabrica MEISA?',
      respuesta:
        'Puentes vehiculares y peatonales, edificios en acero, centros comerciales, bodegas y naves industriales, escenarios deportivos y cubiertas metálicas. Cada tipología se resuelve con el sistema estructural que mejor se ajusta a la luz, las cargas y el plazo de obra.',
    },
    {
      pregunta: '¿MEISA hace el diseño, la fabricación y el montaje?',
      respuesta:
        'Sí. MEISA integra diseño estructural, fabricación en planta con control de calidad y montaje en obra con equipo propio. Un solo responsable por toda la cadena, desde el modelo hasta el acero montado.',
    },
  ],
  ctaEyebrow: 'Construyamos juntos',
  ctaTitulo1: 'Su próxima obra',
  ctaTitulo2: 'en acero',
  ctaDescripcion:
    'Cuéntenos su proyecto y lo cotizamos sobre planos. Diseño, fabricación y montaje de estructuras metálicas en toda Colombia.',
}
