import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const contenidoGestionProyectos = {
  caracteristicas: [
    'Planificación integral con metodologías PMI y PRINCE2',
    'Coordinación multidisciplinaria especializada en estructuras metálicas',
    'Control de calidad en todas las etapas del proyecto',
    'Gestión integrada de proveedores y subcontratistas especializados',
    'Seguimiento en tiempo real de cronogramas y presupuestos',
    'Comunicación continua y transparente con el cliente',
    'Gestión de riesgos proactiva con planes de contingencia',
    'Documentación completa y trazabilidad de procesos',
    'Coordinación BIM para integración multidisciplinaria',
    'Entrega de proyectos llave en mano con garantías'
  ],
  tecnologias: {
    titulo: 'Tecnologías de Gestión de Proyectos',
    items: [
      'Microsoft Project Professional para planificación avanzada',
      'Primavera P6 para proyectos de gran escala',
      'BIM 360 para coordinación multidisciplinaria',
      'Autodesk Construction Cloud para colaboración',
      'Power BI para dashboards y reportes ejecutivos',
      'Teams y SharePoint para comunicación colaborativa',
      'SAP Business One para gestión financiera integrada',
      'Procore para gestión de construcción',
      'Monday.com para seguimiento de tareas',
      'DocuSign para gestión documental digital'
    ],
    descripcion: 'Utilizamos las plataformas tecnológicas más avanzadas para garantizar control total y transparencia en la gestión.'
  },
  equipamiento: {
    titulo: 'Infraestructura de Gestión Técnica',
    items: [
      'Oficina técnica equipada con estaciones de trabajo especializadas',
      'Servidores dedicados para gestión de proyectos y BIM',
      'Sistemas de videoconferencia para coordinación remota',
      'Equipos móviles para supervisión en campo',
      'Software especializado en licencias corporativas',
      'Sistemas de respaldo y seguridad de información',
      'Impresoras de gran formato para planos y documentación',
      'Equipos de medición y verificación en campo',
      'Vehículos equipados para supervisión de obras',
      'Sistemas de comunicación digital en tiempo real'
    ],
    descripcion: 'Contamos con toda la infraestructura tecnológica necesaria para gestionar proyectos de cualquier complejidad.'
  },
  metodologia: {
    titulo: 'Metodología de Gestión Integral',
    fases: [
      {
        numero: 1,
        nombre: 'Iniciación y Estructuración del Proyecto',
        descripcion: 'Definición de alcance, objetivos, stakeholders y estructuración del equipo de trabajo multidisciplinario.',
        entregables: ['Charter del proyecto', 'Estructura de desglose del trabajo (WBS)', 'Plan de comunicaciones', 'Identificación de riesgos'],
        duracion: '1-2 semanas'
      },
      {
        numero: 2,
        nombre: 'Planificación Detallada y Coordinación',
        descripcion: 'Desarrollo de cronogramas detallados, asignación de recursos y coordinación con diseño, fabricación y montaje.',
        entregables: ['Cronograma maestro detallado', 'Plan de gestión de recursos', 'Presupuesto definitivo', 'Plan de calidad'],
        duracion: '2-3 semanas'
      },
      {
        numero: 3,
        nombre: 'Ejecución y Control Continuo',
        descripcion: 'Supervisión de ejecución, control de calidad, seguimiento de cronogramas y gestión de cambios.',
        entregables: ['Reportes de avance semanales', 'Control de calidad por fases', 'Gestión de cambios', 'Seguimiento financiero'],
        duracion: 'Duración del proyecto'
      },
      {
        numero: 4,
        nombre: 'Monitoreo y Comunicación',
        descripcion: 'Seguimiento continuo de KPIs, comunicación con stakeholders y ajustes proactivos del plan.',
        entregables: ['Dashboards ejecutivos', 'Reuniones de seguimiento', 'Informes de gestión', 'Análisis de riesgos'],
        duracion: 'Continuo durante ejecución'
      },
      {
        numero: 5,
        nombre: 'Cierre y Entrega del Proyecto',
        descripcion: 'Finalización formal del proyecto, entrega de documentación completa y evaluación de lecciones aprendidas.',
        entregables: ['Actas de entrega', 'Documentación as-built', 'Evaluación del proyecto', 'Transferencia de garantías'],
        duracion: '1-2 semanas'
      }
    ],
    descripcion: 'Nuestra metodología certificada garantiza el éxito del proyecto desde la concepción hasta la entrega final.'
  },
  certificaciones: {
    titulo: 'Certificaciones en Gestión de Proyectos',
    items: [
      'PMP - Project Management Professional (PMI)',
      'PRINCE2 Practitioner - Gestión de Proyectos',
      'Agile Certified Practitioner (PMI-ACP)',
      'Certified Associate in Project Management (CAPM)',
      'Lean Six Sigma Green Belt - Optimización de Procesos',
      'ITIL Foundation - Gestión de Servicios',
      'Scrum Master Certified (SMC)',
      'Risk Management Professional (PMI-RMP)',
      'ISO 9001:2015 Lead Auditor',
      'Certified Construction Manager (CCM)'
    ],
    descripcion: 'Nuestro equipo cuenta con las certificaciones más reconocidas internacionalmente en gestión de proyectos.'
  },
  normativas: {
    titulo: 'Estándares y Normativas Aplicadas',
    items: [
      'PMI PMBOK Guide - Project Management Body of Knowledge',
      'PRINCE2 - Projects in Controlled Environments',
      'ISO 21500 - Guidance on Project Management',
      'AGILE Manifesto - Metodologías Ágiles',
      'LEAN Construction - Optimización de Procesos',
      'ISO 9001:2015 - Sistemas de Gestión de Calidad',
      'ISO 31000 - Gestión de Riesgos',
      'COSO Framework - Control Interno',
      'COBIT - Governance and Management of IT',
      'PMO Standards - Project Management Office'
    ],
    descripcion: 'Aplicamos los estándares internacionales más exigentes en gestión de proyectos para garantizar el éxito.'
  },
  seguridad: {
    titulo: 'Seguridad en Gestión de Proyectos',
    protocolos: [
      'Gestión de riesgos integrada con matrices de probabilidad e impacto',
      'Planes de contingencia para escenarios críticos identificados',
      'Seguimiento continuo de indicadores de alerta temprana',
      'Protocolos de escalamiento para situaciones críticas',
      'Backup continuo de información crítica del proyecto',
      'Control de acceso y confidencialidad de información',
      'Seguros de responsabilidad profesional y civil',
      'Protocolos de comunicación de crisis'
    ],
    certificaciones: [
      'ISO 27001 - Seguridad de la Información',
      'Seguros de responsabilidad profesional vigentes',
      'Pólizas todo riesgo para proyectos'
    ],
    descripcion: 'Implementamos múltiples capas de seguridad para proteger los intereses del proyecto y del cliente.'
  },
  ventajas: {
    titulo: 'Ventajas Competitivas en Gestión',
    items: [
      {
        titulo: 'Un Solo Interlocutor Especializado',
        descripcion: 'Responsabilidad integral desde diseño hasta entrega con un equipo coordinado.'
      },
      {
        titulo: 'Experiencia en +500 Proyectos',
        descripcion: 'Track record comprobado en proyectos de estructuras metálicas de alta complejidad.'
      },
      {
        titulo: 'Metodologías Certificadas',
        descripcion: 'Aplicación de estándares PMI, PRINCE2 y metodologías ágiles adaptadas.'
      },
      {
        titulo: 'Tecnología de Gestión Avanzada',
        descripcion: 'Plataformas integradas para control en tiempo real y transparencia total.'
      },
      {
        titulo: 'Coordinación BIM Especializada',
        descripcion: 'Integración multidisciplinaria con metodologías BIM para mayor eficiencia.'
      },
      {
        titulo: 'Garantía de Resultados',
        descripcion: 'Compromiso contractual con cronogramas, presupuestos y calidad establecidos.'
      }
    ]
  }
}

async function completarGestionProyectos() {
  console.log('🚀 Completando contenido técnico para Gestión Integral de Proyectos...\n')

  try {
    const servicio = await prisma.servicio.findUnique({
      where: { slug: 'gestion-integral-de-proyectos' }
    })

    if (!servicio) {
      console.log('❌ Servicio Gestión Integral de Proyectos no encontrado')
      return
    }

    const servicioActualizado = await prisma.servicio.update({
      where: { slug: 'gestion-integral-de-proyectos' },
      data: {
        caracteristicas: contenidoGestionProyectos.caracteristicas,
        tecnologias: contenidoGestionProyectos.tecnologias,
        equipamiento: contenidoGestionProyectos.equipamiento,
        metodologia: contenidoGestionProyectos.metodologia,
        certificaciones: contenidoGestionProyectos.certificaciones,
        normativas: contenidoGestionProyectos.normativas,
        seguridad: contenidoGestionProyectos.seguridad,
        ventajas: contenidoGestionProyectos.ventajas
      }
    })

    console.log(`✅ Servicio ${servicioActualizado.nombre} actualizado exitosamente`)
    console.log(`   • ${contenidoGestionProyectos.caracteristicas.length} características técnicas`)
    console.log(`   • ${contenidoGestionProyectos.tecnologias.items.length} tecnologías`)
    console.log(`   • ${contenidoGestionProyectos.equipamiento.items.length} equipos`)
    console.log(`   • ${contenidoGestionProyectos.metodologia.fases.length} fases de metodología`)
    console.log(`   • ${contenidoGestionProyectos.certificaciones.items.length} certificaciones`)
    console.log(`   • ${contenidoGestionProyectos.normativas.items.length} normativas`)
    console.log(`   • ${contenidoGestionProyectos.seguridad.protocolos.length} protocolos de seguridad`)
    console.log(`   • ${contenidoGestionProyectos.ventajas.items.length} ventajas competitivas`)

    // Verificación final de todos los servicios
    console.log('\n🔍 Verificación final de todos los servicios...')
    const todosLosServicios = await prisma.servicio.findMany({
      where: { activo: true },
      select: {
        nombre: true,
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

    console.log('\n📊 ESTADO FINAL DE TODOS LOS SERVICIOS:')
    console.log('═'.repeat(70))

    let serviciosCompletos = 0
    for (const servicio of todosLosServicios) {
      const completo = !!(
        servicio.caracteristicas?.length &&
        servicio.tecnologias &&
        servicio.equipamiento &&
        servicio.metodologia &&
        servicio.certificaciones &&
        servicio.normativas &&
        servicio.seguridad &&
        servicio.ventajas
      )

      console.log(`\n🔧 ${servicio.nombre}: ${completo ? '✅ COMPLETO' : '❌ INCOMPLETO'}`)
      if (completo) serviciosCompletos++
    }

    console.log(`\n🎉 RESUMEN FINAL:`)
    console.log(`   • Servicios completados: ${serviciosCompletos}/${todosLosServicios.length}`)
    console.log(`   • Completitud: ${((serviciosCompletos/todosLosServicios.length)*100).toFixed(1)}%`)

    if (serviciosCompletos === todosLosServicios.length) {
      console.log('\n🚀 ¡TODOS LOS SERVICIOS TIENEN CONTENIDO TÉCNICO COMPLETO!')
    }

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la actualización
completarGestionProyectos()
  .then(() => {
    console.log('\n✅ Proceso completado exitosamente!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  })