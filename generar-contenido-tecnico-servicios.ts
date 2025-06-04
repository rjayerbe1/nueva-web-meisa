import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ContenidoTecnicoCompleto {
  caracteristicas: string[]
  tecnologias: {
    titulo: string
    items: string[]
    descripcion: string
  }
  equipamiento: {
    titulo: string
    items: string[]
    descripcion: string
  }
  metodologia: {
    titulo: string
    fases: {
      numero: number
      nombre: string
      descripcion: string
      entregables: string[]
      duracion: string
    }[]
    descripcion: string
  }
  certificaciones: {
    titulo: string
    items: string[]
    descripcion: string
  }
  normativas: {
    titulo: string
    items: string[]
    descripcion: string
  }
  seguridad: {
    titulo: string
    protocolos: string[]
    certificaciones: string[]
    descripcion: string
  }
  ventajas: {
    titulo: string
    items: {
      titulo: string
      descripcion: string
    }[]
  }
}

const contenidoTecnicoPorServicio: Record<string, ContenidoTecnicoCompleto> = {
  'consultoria-en-diseno-estructural': {
    caracteristicas: [
      'Análisis estructural avanzado con elementos finitos',
      'Modelado BIM 3D para coordinación multidisciplinaria',
      'Cálculos sísmicos según normativa NSR-10 y códigos internacionales',
      'Optimización de diseños para reducción de materiales y costos',
      'Análisis de estabilidad y pandeo en estructuras metálicas',
      'Diseño de conexiones especializadas y detalles constructivos',
      'Estudios de fatiga para estructuras sometidas a cargas dinámicas',
      'Análisis de segundo orden para estructuras esbeltas',
      'Verificación de deflexiones y vibraciones excesivas',
      'Diseño sísmico con sistemas de disipación de energía'
    ],
    tecnologias: {
      titulo: 'Software y Tecnologías de Análisis',
      items: [
        'SAP2000 - Análisis estructural avanzado',
        'ETABS - Modelado de edificios y análisis sísmico',
        'Tekla Structures - Modelado BIM detallado',
        'AutoCAD - Dibujo técnico y detalles',
        'Revit Structure - Modelado BIM colaborativo',
        'Robot Structural - Análisis de elementos finitos',
        'STAAD.Pro - Análisis y diseño estructural',
        'RISA-3D - Modelado y análisis 3D',
        'RAM Structural System - Diseño integral de edificios',
        'CSiBridge - Análisis especializado de puentes'
      ],
      descripcion: 'Utilizamos las tecnologías más avanzadas del mercado para garantizar precisión y eficiencia en cada análisis estructural.'
    },
    equipamiento: {
      titulo: 'Equipamiento Técnico Especializado',
      items: [
        'Estaciones de trabajo de alto rendimiento (64GB RAM, tarjetas gráficas especializadas)',
        'Servidores de cálculo para análisis complejos distribuidos',
        'Equipos de medición láser para verificación dimensional',
        'Instrumentos topográficos de precisión',
        'Dispositivos de medición de vibraciones y aceleraciones',
        'Equipos de ensayos no destructivos portátiles',
        'Sistemas de respaldo y seguridad de información',
        'Impresoras de gran formato para planos técnicos',
        'Equipos de digitalización 3D por escáner láser',
        'Tablets industriales para trabajo de campo'
      ],
      descripcion: 'Contamos con equipamiento de última generación que nos permite realizar análisis precisos y entregar resultados confiables.'
    },
    metodologia: {
      titulo: 'Metodología de Consultoría Estructural',
      fases: [
        {
          numero: 1,
          nombre: 'Análisis de Requisitos y Normativas',
          descripcion: 'Revisión exhaustiva de requisitos del proyecto, normativas aplicables y condiciones de sitio.',
          entregables: ['Memoria de cálculo preliminar', 'Listado de normativas aplicables', 'Criterios de diseño'],
          duracion: '3-5 días'
        },
        {
          numero: 2,
          nombre: 'Modelado Estructural y Análisis',
          descripcion: 'Creación del modelo estructural 3D y ejecución de análisis según cargas y combinaciones de diseño.',
          entregables: ['Modelo estructural 3D', 'Análisis de cargas', 'Verificación sísmica'],
          duracion: '7-10 días'
        },
        {
          numero: 3,
          nombre: 'Optimización y Diseño Detallado',
          descripcion: 'Optimización del diseño para eficiencia de materiales y desarrollo de detalles constructivos.',
          entregables: ['Diseño optimizado', 'Detalles de conexiones', 'Especificaciones técnicas'],
          duracion: '5-7 días'
        },
        {
          numero: 4,
          nombre: 'Documentación Técnica y Entrega',
          descripcion: 'Preparación de memorias de cálculo, planos estructurales y especificaciones finales.',
          entregables: ['Memoria de cálculo completa', 'Planos estructurales', 'Especificaciones de materiales'],
          duracion: '3-5 días'
        }
      ],
      descripcion: 'Nuestra metodología garantiza análisis precisos y diseños optimizados siguiendo las mejores prácticas internacionales.'
    },
    certificaciones: {
      titulo: 'Certificaciones y Competencias',
      items: [
        'Ingenieros Estructurales con Maestría en Estructuras',
        'Certificación Professional Engineer (PE) Internacional',
        'Especialización en Análisis Sísmico Avanzado',
        'Certificación Tekla Structures - Nivel Avanzado',
        'Instructor Certificado SAP2000 y ETABS',
        'Miembro AISC - American Institute of Steel Construction',
        'Certificación ISO 9001:2015 en Servicios de Ingeniería',
        'Especialización en Normas Internacionales (AISC, Eurocode)',
        'Certificación en Gestión de Proyectos de Ingeniería',
        'Actualización continua en códigos de construcción'
      ],
      descripcion: 'Nuestro equipo mantiene las certificaciones más exigentes del sector para garantizar la excelencia técnica.'
    },
    normativas: {
      titulo: 'Cumplimiento Normativo Integral',
      items: [
        'NSR-10 - Reglamento Colombiano de Construcción Sismo Resistente',
        'AISC 360 - Specification for Structural Steel Buildings',
        'AWS D1.1 - Structural Welding Code Steel',
        'NTC 2289 - Perfiles Estructurales de Acero Laminado en Caliente',
        'ACI 318 - Building Code Requirements for Structural Concrete',
        'ISO 9001:2015 - Sistemas de Gestión de Calidad',
        'ASCE 7 - Minimum Design Loads for Buildings',
        'Eurocode 3 - Design of Steel Structures',
        'ASTM Standards - Materiales y Ensayos',
        'NTC 4017 - Métodos de Ensayo para Determinar las Propiedades'
      ],
      descripcion: 'Cumplimos rigurosamente con todas las normativas nacionales e internacionales aplicables a cada proyecto.'
    },
    seguridad: {
      titulo: 'Protocolos de Seguridad en Diseño',
      protocolos: [
        'Verificación múltiple de cálculos críticos por ingeniero senior',
        'Revisión independiente de modelos estructurales',
        'Factores de seguridad según normativas vigentes',
        'Análisis de sensibilidad para parámetros críticos',
        'Documentación completa de hipótesis y criterios',
        'Respaldo digital seguro de toda la información',
        'Protocolos de confidencialidad de información',
        'Seguimiento de cambios en normativas aplicables'
      ],
      certificaciones: [
        'Certificación ISO 27001 - Seguridad de la Información',
        'Protocolos internos de revisión y aprobación',
        'Seguros de responsabilidad profesional vigentes'
      ],
      descripcion: 'Implementamos múltiples capas de verificación para garantizar la confiabilidad y seguridad de nuestros diseños.'
    },
    ventajas: {
      titulo: 'Ventajas Competitivas en Consultoría',
      items: [
        {
          titulo: 'Experiencia Comprobada en +500 Proyectos',
          descripcion: 'Más de 27 años de experiencia en proyectos de alta complejidad técnica.'
        },
        {
          titulo: 'Tecnología de Vanguardia',
          descripcion: 'Software especializado y equipamiento de última generación para análisis precisos.'
        },
        {
          titulo: 'Equipo Multidisciplinario',
          descripcion: 'Ingenieros especializados en diferentes áreas de la ingeniería estructural.'
        },
        {
          titulo: 'Optimización de Costos',
          descripcion: 'Diseños optimizados que reducen materiales manteniendo la seguridad estructural.'
        },
        {
          titulo: 'Cumplimiento Normativo Integral',
          descripcion: 'Conocimiento profundo de normativas nacionales e internacionales.'
        },
        {
          titulo: 'Modelado BIM Avanzado',
          descripcion: 'Integración total con metodologías BIM para coordinación multidisciplinaria.'
        }
      ]
    }
  },

  'fabricacion-de-estructuras-metalicas': {
    caracteristicas: [
      'Corte CNC de alta precisión con tolerancias de ±1mm',
      'Soldadura especializada certificada AWS D1.1 y D1.5',
      'Control de calidad integral en cada etapa productiva',
      'Tratamientos superficiales y pinturas industriales especializadas',
      'Capacidad de producción de hasta 500 toneladas mensuales',
      'Trazabilidad completa de materiales con certificados de calidad',
      'Fabricación de elementos de gran envergadura (hasta 40m de longitud)',
      'Procesos automatizados de nesting para optimización de material',
      'Sistemas de manejo y almacenamiento especializado',
      'Despacho especializado para elementos de gran tamaño'
    ],
    tecnologias: {
      titulo: 'Tecnologías de Fabricación Avanzada',
      items: [
        'CAD/CAM integrado para optimización de nesting automático',
        'Control Numérico Computarizado (CNC) de 5 ejes',
        'Sistemas láser de alta potencia para corte de precisión',
        'Tecnología de soldadura robotizada para series',
        'Sistemas MES para trazabilidad de producción',
        'Software de gestión de taller especializado',
        'Tecnología de marcado láser para identificación',
        'Sistemas automatizados de manipulación de materiales',
        'Control de calidad con equipos de medición 3D',
        'Tecnología de pulverización automatizada de pintura'
      ],
      descripcion: 'Integramos las tecnologías más avanzadas de fabricación para garantizar precisión, eficiencia y calidad superior.'
    },
    equipamiento: {
      titulo: 'Maquinaria y Equipamiento Industrial',
      items: [
        'Cortadoras CNC Plasma de alta definición (hasta 200A)',
        'Equipos de soldadura MIG/TIG/SAW especializados',
        'Tornos y fresadoras CNC para mecanizado de precisión',
        'Cabinas de pintura con sistema de recuperación',
        'Puentes grúa de 10, 20 y 50 toneladas de capacidad',
        'Plegadoras hidráulicas para chapas de gran formato',
        'Equipos de oxicorte para elementos de gran espesor',
        'Sistemas de granallado para preparación superficial',
        'Equipos de enderezado y conformado en frío',
        'Herramientas neumáticas e hidráulicas especializadas'
      ],
      descripcion: 'Nuestro taller cuenta con maquinaria de última generación que nos permite fabricar estructuras de la más alta calidad.'
    },
    metodologia: {
      titulo: 'Proceso de Fabricación Certificado',
      fases: [
        {
          numero: 1,
          nombre: 'Recepción y Verificación de Materiales',
          descripcion: 'Inspección de materiales entrantes, verificación de certificados de calidad y almacenamiento controlado.',
          entregables: ['Certificados de calidad verificados', 'Registro de inventario', 'Etiquetado de trazabilidad'],
          duracion: '1-2 días'
        },
        {
          numero: 2,
          nombre: 'Programación y Corte CNC',
          descripcion: 'Programación CAM optimizada, nesting automático y corte de precisión con control dimensional.',
          entregables: ['Piezas cortadas con tolerancias', 'Reportes de nesting', 'Control dimensional'],
          duracion: '2-5 días'
        },
        {
          numero: 3,
          nombre: 'Conformado y Soldadura Certificada',
          descripcion: 'Conformado de piezas, soldadura con procedimientos certificados y control de calidad continuo.',
          entregables: ['Elementos soldados certificados', 'Reportes de soldadura', 'Inspección visual y END'],
          duracion: '5-15 días'
        },
        {
          numero: 4,
          nombre: 'Tratamiento Superficial y Acabado',
          descripcion: 'Preparación superficial, aplicación de sistemas de pintura y control de calidad final.',
          entregables: ['Elementos con acabado final', 'Certificados de pintura', 'Inspección final'],
          duracion: '3-7 días'
        },
        {
          numero: 5,
          nombre: 'Control de Calidad y Despacho',
          descripcion: 'Inspección dimensional final, empaque especializado y despacho con documentación completa.',
          entregables: ['Certificados de calidad final', 'Documentación de despacho', 'Elementos listos para montaje'],
          duracion: '1-2 días'
        }
      ],
      descripcion: 'Nuestro proceso certificado garantiza calidad constante y trazabilidad completa en cada elemento fabricado.'
    },
    certificaciones: {
      titulo: 'Certificaciones de Fabricación',
      items: [
        'AWS D1.1 - Soldadura Estructural en Acero',
        'AWS D1.5 - Soldadura de Puentes',
        'ISO 9001:2015 - Gestión de Calidad en Fabricación',
        'ICONTEC - Certificación Nacional de Calidad',
        'IWE - Ingeniero Internacional en Soldadura',
        'Soldadores Certificados AWS 6G y 6GR',
        'Certificación en Ensayos No Destructivos (END)',
        'SSPC - Preparación de Superficies y Pintura',
        'Certificación OSHA para Seguridad Industrial',
        'Trazabilidad ISO 14001 - Gestión Ambiental'
      ],
      descripcion: 'Mantenemos las certificaciones más exigentes del sector para asegurar la máxima calidad en fabricación.'
    },
    normativas: {
      titulo: 'Normativas de Fabricación Aplicadas',
      items: [
        'ASTM A36/A36M - Acero Estructural al Carbono',
        'ASTM A572/A572M - Acero Estructural de Alta Resistencia',
        'AWS D1.1 - Código de Soldadura Estructural',
        'AISC 303 - Code of Standard Practice',
        'SSPC-Paint Standards - Sistemas de Pintura',
        'ISO 5817 - Niveles de Calidad en Soldadura',
        'NTC 2289 - Perfiles Estructurales Colombianos',
        'ASTM A325/A325M - Pernos Estructurales',
        'ISO 9606 - Calificación de Soldadores',
        'NACE Standards - Protección contra Corrosión'
      ],
      descripcion: 'Aplicamos rigurosamente todas las normativas nacionales e internacionales de fabricación de estructuras metálicas.'
    },
    seguridad: {
      titulo: 'Seguridad Industrial Integral',
      protocolos: [
        'Programa de seguridad industrial OHSAS 18001',
        'Capacitación continua en seguridad para todo el personal',
        'Uso obligatorio de EPP especializado por área',
        'Procedimientos de trabajo seguro para cada operación',
        'Inspecciones de seguridad diarias y semanales',
        'Mantenimiento preventivo de equipos y maquinaria',
        'Protocolos de respuesta ante emergencias',
        'Señalización y demarcación completa del taller'
      ],
      certificaciones: [
        'Certificación OHSAS 18001 - Seguridad y Salud Ocupacional',
        'Personal certificado en primeros auxilios',
        'Brigadas de emergencia entrenadas y equipadas'
      ],
      descripcion: 'La seguridad de nuestro personal y la calidad de nuestros productos son nuestra máxima prioridad.'
    },
    ventajas: {
      titulo: 'Ventajas Competitivas en Fabricación',
      items: [
        {
          titulo: 'Capacidad Productiva Superior',
          descripcion: 'Hasta 500 toneladas mensuales con flexibilidad para proyectos urgentes.'
        },
        {
          titulo: 'Precisión y Calidad Certificada',
          descripcion: 'Tolerancias de ±1mm y soldadores certificados AWS garantizan calidad superior.'
        },
        {
          titulo: 'Trazabilidad Completa',
          descripcion: 'Seguimiento total desde materia prima hasta producto terminado.'
        },
        {
          titulo: 'Flexibilidad en Tamaños',
          descripcion: 'Capacidad para elementos desde componentes pequeños hasta vigas de 40 metros.'
        },
        {
          titulo: 'Integración Tecnológica',
          descripcion: 'CAD/CAM integrado y sistemas automatizados para máxima eficiencia.'
        },
        {
          titulo: 'Experiencia en Proyectos Complejos',
          descripcion: 'Más de 15,000 toneladas fabricadas en proyectos de alta complejidad técnica.'
        }
      ]
    }
  },

  'montaje-de-estructuras': {
    caracteristicas: [
      'Montaje con grúas especializadas de 25 a 100 toneladas de capacidad',
      'Personal certificado en trabajo en alturas y soldadura de campo',
      'Supervisión técnica permanente con ingenieros especializados',
      'Soldadura de conexiones con procedimientos certificados AWS',
      'Control topográfico y dimensional continuo durante montaje',
      'Cumplimiento estricto de protocolos de seguridad OHSAS',
      'Capacidad de montaje en condiciones ambientales adversas',
      'Coordinación multidisciplinaria con otros trades',
      'Sistemas de comunicación avanzados en sitio',
      'Logística especializada para elementos de gran tamaño'
    ],
    tecnologias: {
      titulo: 'Tecnologías de Montaje Especializado',
      items: [
        'Sistemas de guiado láser para alineación de precisión',
        'Software de planificación de izaje (3D Lift Plan)',
        'Equipos de comunicación digital en tiempo real',
        'Sistemas de posicionamiento GPS para elementos grandes',
        'Tecnología de soldadura automatizada para campo',
        'Equipos de medición topográfica de alta precisión',
        'Sistemas de monitoreo de cargas en tiempo real',
        'Drones para inspección de elementos en altura',
        'Aplicaciones móviles para control de calidad',
        'Sistemas de trazabilidad digital de montaje'
      ],
      descripcion: 'Utilizamos las tecnologías más avanzadas para garantizar precision, seguridad y eficiencia en cada montaje.'
    },
    equipamiento: {
      titulo: 'Equipamiento Especializado de Montaje',
      items: [
        'Grúas telescópicas Liebherr 25-100 toneladas',
        'Grúas torre Potain para proyectos especiales',
        'Equipos de soldadura Lincoln Electric portátiles',
        'Equipos topográficos Leica de alta precisión',
        'Herramientas neumáticas e hidráulicas Atlas Copco',
        'Equipos de comunicación Motorola digitales',
        'Andamios certificados y plataformas de trabajo',
        'Equipos de izaje menor y aparejos especializados',
        'Herramientas de medición y control dimensional',
        'Vehículos especializados para transporte de equipos'
      ],
      descripcion: 'Contamos con equipamiento de las mejores marcas mundiales para ejecutar montajes de la más alta calidad.'
    },
    metodologia: {
      titulo: 'Metodología de Montaje Estructural',
      fases: [
        {
          numero: 1,
          nombre: 'Planificación y Preparación del Sitio',
          descripcion: 'Análisis de sitio, planificación de izaje, preparación de áreas de trabajo y establecimiento de protocolos.',
          entregables: ['Plan de montaje detallado', 'Análisis de riesgos', 'Preparación de sitio'],
          duracion: '2-5 días'
        },
        {
          numero: 2,
          nombre: 'Izaje y Posicionamiento de Elementos',
          descripcion: 'Izaje controlado de elementos estructurales con verificación de capacidades y protocolos de seguridad.',
          entregables: ['Elementos izados y posicionados', 'Reportes de izaje', 'Verificación de capacidades'],
          duracion: 'Según cronograma'
        },
        {
          numero: 3,
          nombre: 'Alineación y Nivelación Estructural',
          descripcion: 'Alineación precisa de elementos con equipos topográficos y ajustes dimensionales según planos.',
          entregables: ['Estructura alineada y nivelada', 'Reportes topográficos', 'Verificación dimensional'],
          duracion: '1-3 días por área'
        },
        {
          numero: 4,
          nombre: 'Conexiones Soldadas y Atornilladas',
          descripcion: 'Ejecución de conexiones definitivas con soldadores certificados y verificación de calidad.',
          entregables: ['Conexiones completadas', 'Certificados de soldadura', 'Inspección END'],
          duracion: 'Según complejidad'
        },
        {
          numero: 5,
          nombre: 'Verificación Final y Entrega',
          descripcion: 'Inspección dimensional final, verificación de plomadas y entrega con documentación completa.',
          entregables: ['Estructura verificada', 'Certificados de montaje', 'Documentación de entrega'],
          duracion: '1-2 días'
        }
      ],
      descripcion: 'Nuestra metodología probada garantiza montajes seguros, precisos y dentro de los cronogramas establecidos.'
    },
    certificaciones: {
      titulo: 'Certificaciones de Montaje',
      items: [
        'Certificación en Trabajo en Alturas (Resolución 1409)',
        'AWS D1.1 - Soldadores Certificados para Campo',
        'OHSAS 18001 - Seguridad y Salud Ocupacional',
        'Operadores de Grúa Certificados NCCCO',
        'Certificación en Rigger y Señalero',
        'Supervisores Certificados en Montaje de Acero',
        'Certificación en Primeros Auxilios Industrial',
        'Brigadistas Certificados para Emergencias',
        'Certificación en Espacios Confinados',
        'Manejo Defensivo y Transporte de Cargas'
      ],
      descripcion: 'Todo nuestro personal mantiene certificaciones vigentes para garantizar montajes seguros y de calidad.'
    },
    normativas: {
      titulo: 'Normativas de Montaje Aplicadas',
      items: [
        'OSHA 1926 Subpart R - Steel Erection',
        'AISC 303 - Code of Standard Practice for Steel Buildings',
        'AWS D1.1 - Structural Welding Code',
        'ANSI/ASME B30.5 - Mobile and Locomotive Cranes',
        'Resolución 1409 de 2012 - Trabajo en Alturas Colombia',
        'AISC 341 - Seismic Provisions for Structural Steel Buildings',
        'NTC-OHSAS 18001 - Seguridad y Salud Ocupacional',
        'ISO 45001 - Sistemas de Gestión de Seguridad',
        'SSPC Standards - Pintura y Protección en Campo',
        'ANSI Z359 - Fall Protection Code'
      ],
      descripcion: 'Cumplimos rigurosamente con todas las normativas nacionales e internacionales de montaje estructural.'
    },
    seguridad: {
      titulo: 'Protocolos de Seguridad en Montaje',
      protocolos: [
        'Análisis de riesgos específico para cada operación',
        'Permisos de trabajo para actividades de alto riesgo',
        'Inspección diaria de equipos de seguridad y montaje',
        'Comunicación constante entre operadores y señaleros',
        'Verificación de condiciones climáticas antes de izaje',
        'Delimitación y señalización de áreas de trabajo',
        'Procedimientos de emergencia específicos del sitio',
        'Reuniones de seguridad diarias con todo el personal'
      ],
      certificaciones: [
        'Certificación OHSAS 18001 - Gestión de Seguridad',
        'Seguros de responsabilidad civil y laboral',
        'Pólizas de seguro para equipos y operaciones'
      ],
      descripcion: 'La seguridad es nuestra prioridad número uno en todas las operaciones de montaje.'
    },
    ventajas: {
      titulo: 'Ventajas Competitivas en Montaje',
      items: [
        {
          titulo: 'Experiencia Comprobada en Altura',
          descripcion: 'Más de 500 estructuras montadas incluyendo edificios industriales y puentes complejos.'
        },
        {
          titulo: 'Equipos de Gran Capacidad',
          descripcion: 'Grúas de hasta 100 toneladas para proyectos de gran envergadura y complejidad.'
        },
        {
          titulo: 'Personal Altamente Certificado',
          descripcion: 'Operadores, soldadores y supervisores con certificaciones internacionales vigentes.'
        },
        {
          titulo: 'Precisión Dimensional Garantizada',
          descripcion: 'Control topográfico continuo y tolerancias de montaje de ±5mm.'
        },
        {
          titulo: 'Flexibilidad Logística',
          descripción: 'Capacidad de adaptación a condiciones especiales de sitio y cronogramas exigentes.'
        },
        {
          titulo: 'Seguridad Sin Compromisos',
          descripción: 'Cero accidentes en proyectos ejecutados con protocolos de seguridad estrictos.'
        }
      ]
    }
  }
}

async function actualizarServiciosConContenidoTecnico() {
  console.log('🚀 Iniciando actualización de servicios con contenido técnico completo...\n')

  try {
    for (const [slug, contenido] of Object.entries(contenidoTecnicoPorServicio)) {
      console.log(`\n📝 Actualizando servicio: ${slug}`)
      
      const servicio = await prisma.servicio.findUnique({
        where: { slug }
      })

      if (!servicio) {
        console.log(`❌ Servicio ${slug} no encontrado`)
        continue
      }

      // Actualizar el servicio con todo el contenido técnico
      const servicioActualizado = await prisma.servicio.update({
        where: { slug },
        data: {
          caracteristicas: contenido.caracteristicas,
          tecnologias: contenido.tecnologias,
          equipamiento: contenido.equipamiento,
          metodologia: contenido.metodologia,
          certificaciones: contenido.certificaciones,
          normativas: contenido.normativas,
          seguridad: contenido.seguridad,
          ventajas: contenido.ventajas,
          // Actualizar también algunos campos básicos si están vacíos
          metaTitle: servicio.metaTitle || `${servicio.nombre} | MEISA - Estructuras Metálicas`,
          metaDescription: servicio.metaDescription || `${servicio.descripcion.substring(0, 150)}...`
        }
      })

      console.log(`✅ Servicio ${servicioActualizado.nombre} actualizado exitosamente`)
      console.log(`   • ${contenido.caracteristicas.length} características técnicas`)
      console.log(`   • ${contenido.tecnologias.items.length} tecnologías`)
      console.log(`   • ${contenido.equipamiento.items.length} equipos`)
      console.log(`   • ${contenido.metodologia.fases.length} fases de metodología`)
      console.log(`   • ${contenido.certificaciones.items.length} certificaciones`)
      console.log(`   • ${contenido.normativas.items.length} normativas`)
      console.log(`   • ${contenido.seguridad.protocolos.length} protocolos de seguridad`)
      console.log(`   • ${contenido.ventajas.items.length} ventajas competitivas`)
    }

    // Verificar actualización
    console.log('\n\n🔍 Verificando actualización...')
    const serviciosActualizados = await prisma.servicio.findMany({
      where: { activo: true },
      select: {
        nombre: true,
        slug: true,
        caracteristicas: true,
        tecnologias: true,
        equipamiento: true,
        metodologia: true,
        certificaciones: true,
        normativas: true,
        seguridad: true,
        ventajas: true
      }
    })

    console.log('\n📊 RESUMEN DE ACTUALIZACIÓN:')
    console.log('═'.repeat(60))

    for (const servicio of serviciosActualizados) {
      console.log(`\n🔧 ${servicio.nombre}:`)
      console.log(`   ✅ Características: ${servicio.caracteristicas?.length || 0}`)
      console.log(`   ✅ Tecnologías: ${servicio.tecnologias ? 'Sí' : 'No'}`)
      console.log(`   ✅ Equipamiento: ${servicio.equipamiento ? 'Sí' : 'No'}`)
      console.log(`   ✅ Metodología: ${servicio.metodologia ? 'Sí' : 'No'}`)
      console.log(`   ✅ Certificaciones: ${servicio.certificaciones ? 'Sí' : 'No'}`)
      console.log(`   ✅ Normativas: ${servicio.normativas ? 'Sí' : 'No'}`)
      console.log(`   ✅ Seguridad: ${servicio.seguridad ? 'Sí' : 'No'}`)
      console.log(`   ✅ Ventajas: ${servicio.ventajas ? 'Sí' : 'No'}`)
    }

    console.log('\n🎉 ACTUALIZACIÓN COMPLETADA EXITOSAMENTE!')
    console.log('Todos los servicios ahora tienen contenido técnico completo.')

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la actualización
actualizarServiciosConContenidoTecnico()
  .then(() => {
    console.log('\n✅ Proceso completado exitosamente!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  })