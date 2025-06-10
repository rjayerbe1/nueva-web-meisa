// Datos oficiales de MEISA extraídos de INFORMACION-REAL-MEISA.md
export const COMPANY_STATS = {
  EMPLOYEES: 220,
  CONTRACTORS: 100,
  MONTHLY_CAPACITY: 600,
  YEARS_EXPERIENCE: 29,
  PLANTS: 3,
  PROJECTS_COMPLETED: 500,
  FOUNDING_YEAR: 1996,
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
    name: 'Sede Principal Popayán',
    location: 'Bodega E13 Parque Industrial – Cauca',
    area: 4400, // m²
    capacity: 350, // ton/mes
    naves: 3,
    bridgeCranes: 5,
    cncTables: 2,
    googleMaps: 'https://goo.gl/maps/SnHGyu5xrNRKFhgN8',
    description: 'Planta principal con mayor capacidad de producción'
  },
  {
    name: 'Sede Jamundí',
    location: 'Vía Panamericana 6 Sur – 195 – Valle del Cauca',
    area: 6000, // m²
    capacity: 250, // ton/mes
    naves: 1,
    bridgeCranes: 3,
    cncTables: 1,
    additionalEquipment: ['Ensambladora de Perfiles'],
    googleMaps: 'https://goo.gl/maps/gZ8ftUnD7Wckx6A96',
    description: 'Sede administrativa con capacidades de fabricación'
  },
  {
    name: 'Planta Villa Rica',
    location: 'Vía Puerto Tejada – Villa Rica, Vereda Agua Azul, Cauca',
    googleMaps: 'https://www.google.com/maps/@3.1985885,-76.4442089,15z',
    description: 'Planta especializada en proyectos regionales'
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