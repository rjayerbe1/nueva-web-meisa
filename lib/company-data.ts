// Datos oficiales de MEISA extraídos de INFORMACION-REAL-MEISA.md
const FOUNDING_YEAR = 1996
const YEARS_EXPERIENCE = new Date().getFullYear() - FOUNDING_YEAR

export const COMPANY_STATS = {
  EMPLOYEES: 220,
  CONTRACTORS: 100,
  MONTHLY_CAPACITY: 600,
  YEARS_EXPERIENCE,
  PLANTS: 3,
  PROJECTS_COMPLETED: 500,
  FOUNDING_YEAR,
  TOTAL_TEAM: 320, // Empleados + Contratistas
  SOFTWARE_COUNT: 8,
  BRIDGE_CRANES: 8,
  CNC_TABLES: 3,
  TRANSPORT_CAPACITY: 100, // toneladas
  PROTECTION_YEARS: 50, // años sin mantenimiento
  TOTAL_AREA: 10400, // m²
} as const

export const COMPANY_INFO = {
  NAME: 'MEISA',
  FULL_NAME: 'Metálicas e Ingeniería S.A.S.',
  MISSION: 'Fortalecer la empresa a nivel nacional garantizando un crecimiento en el tiempo a través de calidad de los productos y servicios, generando rentabilidad, aumento de confianza, mayor satisfacción de clientes y colaboradores para así mantener su consolidación y talento profesional ante el mercado y llegar a nuevos clientes.',
  VISION: 'Desarrollar soluciones a proyectos con estructuras metálicas y obras civiles, logrando el balance ideal entre costos, diseño, funcionalidad y excelente calidad, cumpliendo con las normas sismo resistentes vigentes, los estándares de fabricación y montaje actuales, de la mano del talento humano y responsabilidad de los trabajadores.',
  DESCRIPTION: 'En MEISA hemos fabricado e instalado estructuras metálicas para todo tipo de proyectos de construcción e infraestructura. Especialistas en brindar un servicio integral al cliente para culminar proyectos de manera eficiente y eficaz gestionando múltiples etapas del proyecto bajo una sola dirección.',
} as const

export const PLANTS = [
  {
    name: 'Planta Jamundí',
    location: 'Vía Panamericana 6 Sur – 195 – Valle del Cauca',
    area: 6000, // m²
    naves: 1,
    craneCapacity: 20, // ton
    cncTables: 1,
    additionalEquipment: ['Ensambladora de Perfiles'],
    googleMaps: 'https://goo.gl/maps/gZ8ftUnD7Wckx6A96',
    description: 'Planta de producción y sede administrativa de MEISA'
  },
  {
    name: 'Planta Popayán',
    location: 'Bodega E13 Parque Industrial – Cauca',
    area: 4400, // m²
    naves: 1,
    craneCapacity: 10, // ton
    cncTables: 2,
    googleMaps: 'https://goo.gl/maps/SnHGyu5xrNRKFhgN8',
    description: 'Planta de producción'
  },
  {
    name: 'Planta Villa Rica',
    location: 'Vía Puerto Tejada – Villa Rica, Vereda Agua Azul, Cauca',
    area: 4000, // m²
    naves: 2,
    craneCapacity: 20, // ton
    googleMaps: 'https://www.google.com/maps/@3.1985885,-76.4442089,15z',
    description: 'Planta de producción'
  }
] as const

export const SERVICES = [
  {
    id: 'diseno',
    title: 'Consultoría en Diseño Estructural',
    subtitle: 'Ingeniería de precisión',
    description: 'Nuestros ingenieros experimentados optimizan los diseños estructurales considerando cargas estructurales, comportamiento sísmico, resistencia del acero.',
    capabilities: [
      'Uso de modelado 3D y tecnología BIM',
      'Análisis de cargas estructurales y sísmicas',
      'Software: Trimble Tekla Structures, ETABS, SAFE, SAP2000',
      'Personal de proyectistas y dibujantes especializados'
    ]
  },
  {
    id: 'fabricacion',
    title: 'Fabricación de Estructuras Metálicas',
    subtitle: 'Producción industrial',
    description: 'Nuestros talleres cuentan con gerentes de fabricación de amplia experiencia que optimizan el uso de materiales y mano de obra.',
    capabilities: [
      'Procesos de limpieza y pintura anticorrosiva',
      'Protección por más de 50 años sin mantenimiento',
      'Fabricación de cubiertas standing seam',
      'Recipientes a presión e intercambiadores de calor'
    ]
  },
  {
    id: 'montaje',
    title: 'Montaje de Estructuras Metálicas',
    subtitle: 'Instalación profesional',
    description: 'Nuestros directores de proyecto supervisan cada etapa del proyecto garantizando el cumplimiento de las especificaciones técnicas y la calidad.',
    capabilities: [
      'Oficiales de montaje certificados',
      'Protocolos de trabajo en altura y seguridad',
      'Operadores de equipos profesionales',
      'Control y registro documental de actividades'
    ]
  },
  {
    id: 'construccion',
    title: 'Construcción de Obras Civiles',
    subtitle: 'Soluciones completas',
    description: 'Brindamos obras civiles que complementan nuestros servicios, desde cimentación hasta detalles de acabado.',
    capabilities: [
      'Cimentaciones especializadas',
      'Construcción integral desde cimentación',
      'Detalles de acabado profesionales',
      'Proyectos llave en mano'
    ]
  }
] as const

export const CORPORATE_VALUES = [
  { name: 'Efectividad', description: 'Cumplimos con los objetivos propuestos de manera eficiente' },
  { name: 'Integridad', description: 'Actuamos con transparencia y honestidad en todos nuestros procesos' },
  { name: 'Lealtad', description: 'Comprometidos con nuestros clientes y colaboradores' },
  { name: 'Proactividad', description: 'Anticipamos necesidades y tomamos iniciativas' },
  { name: 'Aprendizaje Continuo', description: 'Nos desarrollamos constantemente para mejorar' },
  { name: 'Respeto', description: 'Valoramos a todas las personas y sus aportes' },
  { name: 'Pasión', description: 'Amor por lo que hacemos y excelencia en el servicio' },
  { name: 'Disciplina', description: 'Consistencia y rigor en nuestros procesos' }
] as const

export const TECHNOLOGIES = [
  { name: 'Trimble Tekla Structures', description: 'Software BIM líder mundial en estructura metálicas y de concreto' },
  { name: 'ETABS', description: 'Software de análisis y diseño estructural de edificios líder en la industria' },
  { name: 'SAFE', description: 'Software especializado para el análisis y diseño de sistemas de losas y cimentaciones' },
  { name: 'SAP2000', description: 'Programa de análisis estructural y diseño para todo tipo de estructuras' },
  { name: 'Midas', description: 'Software avanzado de análisis y diseño estructural con capacidades BIM integradas' },
  { name: 'IDEA StatiCa Connection', description: 'Software revolucionario para el diseño y verificación de conexiones de acero' },
  { name: 'DC-CAD Vigas y Columnas', description: 'Software especializado para el diseño de elementos estructurales de concreto reforzado' },
  { name: 'StruM.I.S', description: 'Software líder mundial en gestión integral y control de producción para fabricantes de estructuras metálicas' },
  { name: 'FastCAM', description: 'Proveedor líder de software de ingeniería para máquina de corte por Plasma y Oxicorte' }
] as const

// Cita del liderazgo para la página de empresa
export const LEADERSHIP_QUOTE = {
  quote: 'En MEISA no solo construimos estructuras de acero, construimos la infraestructura que impulsa el desarrollo de Colombia. Cada proyecto es un compromiso con la excelencia y la seguridad.',
  name: 'Roberto Ayerbe Camayo',
  title: 'Gerente Técnico | Socio Fundador',
  image: '/images/empresa/liderazgo/roberto-ayerbe.png'
} as const

// Contenido de Seguridad Laboral
export const SAFETY_CONTENT = {
  title: 'Seguridad Laboral',
  subtitle: 'La seguridad de nuestro equipo es nuestra prioridad #1',
  items: [
    'Protocolos certificados de trabajo en altura',
    'Equipos de protección personal de última generación',
    'Programa de capacitación continua',
    'Supervisión permanente en obra',
    'Certificaciones en seguridad industrial'
  ],
  goal: 'Meta organizacional: Cero accidentes'
} as const

// Contenido de Sostenibilidad
export const SUSTAINABILITY_CONTENT = {
  title: 'Sostenibilidad',
  subtitle: 'Comprometidos con el medio ambiente',
  items: [
    'Gestión responsable de residuos metálicos',
    'Optimización de cortes para minimizar desperdicios',
    'Programa de reciclaje de materiales',
    'Eficiencia energética en operaciones',
    'Proveedores con prácticas sostenibles'
  ],
  commitment: 'Compromiso con las futuras generaciones'
} as const

// Certificación de la empresa
export const CERTIFICATIONS = [
  {
    name: 'RUC',
    fullName: 'Registro Uniforme de Contratistas',
    description: 'Certificación del Consejo Colombiano de Seguridad en SSTA',
    logo: '/images/certificaciones/ruc-logo.png',
    issuer: 'Consejo Colombiano de Seguridad (CCS)',
    importance: 'Requisito exigido por grandes empresas contratantes en procesos de licitación',
    benefits: [
      'Gestión certificada en Seguridad, Salud en el Trabajo y Ambiente (SSTA)',
      'Evaluación anual por auditores profesionales del CCS',
      'Visibilidad ante grandes empresas contratantes del país',
      'Compromiso demostrado con la seguridad de los trabajadores'
    ]
  }
] as const

// Normas que cumplimos (no son certificaciones)
export const STANDARDS_COMPLIANCE = [
  {
    name: 'NSR-10',
    description: 'Norma Sismo Resistente Colombiana',
    logo: '/images/normas/nsr-10.png'
  },
  {
    name: 'AWS D1.1',
    description: 'Código de Soldadura Estructural',
    logo: '/images/normas/aws.png'
  },
  {
    name: 'AISC 360',
    description: 'Especificación para Edificios de Acero',
    logo: '/images/normas/aisc.png'
  },
  {
    name: 'NTC',
    description: 'Normas Técnicas Colombianas',
    logo: '/images/normas/ntc.png'
  }
] as const

// Documentos corporativos
export const CORPORATE_DOCUMENTS = [
  {
    name: 'Manual SAGRILAFT',
    description: 'Sistema de Autocontrol y Gestión del Riesgo',
    url: '/documentos/manual-sagrilaft.pdf'
  },
  {
    name: 'Política de Transparencia y Ética',
    description: 'Lineamientos de conducta empresarial',
    url: '/documentos/politica-transparencia.pdf'
  },
  {
    name: 'Tratamiento de Datos Personales',
    description: 'Política de privacidad y protección de datos',
    url: '/documentos/tratamiento-datos.pdf'
  }
] as const

// Historia de MEISA - Evolución de la empresa
export const COMPANY_HISTORY = {
  // Texto introductorio en 3 párrafos
  intro: [
    `Metálicas e Ingeniería S.A.S. fue constituida en el año ${FOUNDING_YEAR} en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de Estructuras Metálicas. A lo largo de más de ${YEARS_EXPERIENCE} años, hemos participado activamente en la construcción y manejo de Proyectos y Obras Civiles en todo el territorio Nacional.`,
    'Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última tecnología, permitiéndonos ser cada vez más eficientes en los tiempos de entrega y en la reducción de costos de los proyectos.',
    'Hoy contamos con tres plantas de producción estratégicamente ubicadas en el suroccidente colombiano, con una capacidad combinada de 600 toneladas mensuales y un equipo de más de 320 colaboradores comprometidos con la excelencia.'
  ],
  // 5 hitos principales de la empresa
  timeline: [
    {
      period: '1996',
      title: 'Fundación',
      description: 'MEISA nace en Popayán, Cauca, como un taller especializado en estructuras metálicas con la visión de ofrecer soluciones de calidad a la región suroccidental de Colombia.',
      highlight: 'Inicio de operaciones'
    },
    {
      period: '2006-2010',
      title: 'Expansión',
      description: 'Inauguración de la segunda planta de producción en la ciudad de Jamundí. Construcción de centros comerciales y puentes vehiculares en la región.',
      highlight: 'Planta Jamundí'
    },
    {
      period: '2011-2015',
      title: 'Certificación',
      description: 'Obtención de la certificación RUC del Consejo Colombiano de Seguridad. Consolidación como empresa de clase nacional con estándares de calidad y seguridad.',
      highlight: 'RUC Certificado'
    },
    {
      period: '2016-2020',
      title: 'Proyectos Emblemáticos',
      description: 'Participación en proyectos de gran envergadura: centros comerciales, edificios corporativos, coliseos deportivos e infraestructura de transporte en todo el país.',
      highlight: '+300 proyectos'
    },
    {
      period: '2021-Presente',
      title: 'Consolidación',
      description: 'Con 3 plantas operativas y tecnología BIM de última generación, participamos en proyectos industriales, comerciales y de infraestructura vial en todo el país.',
      highlight: 'Presencia nacional'
    }
  ],
  achievements: [
    'Más de 500 proyectos completados en toda Colombia',
    `${YEARS_EXPERIENCE} años de experiencia continua en el mercado`,
    '3 plantas de producción estratégicamente ubicadas',
    '600 toneladas de capacidad mensual de fabricación',
    'Equipo de más de 320 profesionales comprometidos'
  ]
} as const
