import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateServices() {
  try {
    console.log('🔄 Actualizando servicios con información completa...')

    const serviciosData = [
      {
        slug: 'consultoria-diseno-estructural',
        nombre: 'Consultoría en Diseño Estructural',
        titulo: 'Consultoría en Diseño Estructural',
        subtitulo: 'Ingeniería de precisión con más de 27 años de experiencia',
        descripcion: 'Nuestro equipo de ingenieros estructurales altamente calificados brinda soluciones integrales en diseño de estructuras metálicas. Combinamos experiencia técnica con tecnología de vanguardia para desarrollar proyectos que cumplen con los más altos estándares internacionales.',
        capacidades: [
          'Análisis estructural avanzado con software especializado',
          'Modelado BIM 3D para visualización y coordinación',
          'Cálculos sísmicos según normativa NSR-10',
          'Optimización de diseños para reducción de costos',
          'Revisión y verificación de proyectos existentes',
          'Estudios de factibilidad técnica y económica'
        ],
        tecnologias: {
          titulo: 'Tecnología de Vanguardia',
          items: ['SAP2000', 'ETABS', 'Tekla Structures', 'AutoCAD', 'Revit', 'Robot Structural']
        },
        normativas: {
          titulo: 'Cumplimiento Normativo',
          items: ['NSR-10', 'AISC 360', 'AWS D1.1', 'NTC 2289', 'ACI 318', 'ISO 9001']
        },
        expertiseTitulo: 'Nuestra Experiencia',
        expertiseDescripcion: 'Con más de 500 proyectos completados, nuestro equipo ha desarrollado expertise especializada en diversas tipologías estructurales, desde edificios industriales hasta infraestructura compleja.',
        icono: 'Calculator',
        color: 'blue',
        bgGradient: 'from-blue-600 to-blue-800',
        orden: 1,
        metaTitle: 'Consultoría en Diseño Estructural | MEISA',
        metaDescription: 'Servicio especializado de consultoría en diseño de estructuras metálicas con más de 27 años de experiencia. Análisis estructural avanzado y modelado BIM 3D.'
      },
      {
        slug: 'fabricacion-estructuras-metalicas',
        nombre: 'Fabricación de Estructuras Metálicas',
        titulo: 'Fabricación de Estructuras Metálicas',
        subtitulo: 'Producción de precisión con control de calidad certificado',
        descripcion: 'Nuestras instalaciones de fabricación están equipadas con tecnología CNC de última generación y cuentan con soldadores certificados AWS. Implementamos rigurosos controles de calidad en cada etapa del proceso productivo para garantizar la excelencia en cada componente estructural.',
        capacidades: [
          'Corte CNC de alta precisión con tolerancias mínimas',
          'Soldadura especializada certificada AWS D1.1',
          'Control de calidad integral en cada etapa',
          'Tratamientos superficiales y pinturas industriales',
          'Capacidad de producción para proyectos de gran escala',
          'Trazabilidad completa de materiales y procesos'
        ],
        equipamiento: {
          titulo: 'Equipamiento Especializado',
          items: ['Cortadoras CNC Plasma', 'Equipos de soldadura MIG/TIG', 'Tornos y fresadoras CNC', 'Cabinas de pintura controladas', 'Puentes grúa para manejo de piezas']
        },
        certificaciones: {
          titulo: 'Certificaciones de Calidad',
          items: ['AWS D1.1', 'ISO 9001:2015', 'ICONTEC', 'IWE - Ingeniero Internacional en Soldadura', 'Soldadores Certificados AWS']
        },
        expertiseTitulo: 'Capacidad Productiva',
        expertiseDescripcion: 'Con más de 15,000 toneladas fabricadas, nuestro taller tiene la capacidad y experiencia para manejar desde componentes especializados hasta estructuras completas de gran envergadura.',
        icono: 'Settings',
        color: 'red',
        bgGradient: 'from-red-600 to-red-800',
        orden: 2,
        metaTitle: 'Fabricación de Estructuras Metálicas | MEISA',
        metaDescription: 'Fabricación de estructuras metálicas con tecnología CNC y soldadores certificados AWS. Control de calidad integral y capacidad de producción industrial.'
      },
      {
        slug: 'montaje-estructuras',
        nombre: 'Montaje de Estructuras',
        titulo: 'Montaje de Estructuras',
        subtitulo: 'Instalación profesional con los más altos estándares de seguridad',
        descripcion: 'Nuestro equipo de montaje especializado cuenta con la experiencia, equipos y certificaciones necesarias para la instalación segura y precisa de estructuras metálicas. Priorizamos la seguridad industrial y el cumplimiento de cronogramas sin comprometer la calidad.',
        capacidades: [
          'Montaje con grúas especializadas y equipos de izaje',
          'Personal certificado en trabajo en alturas',
          'Supervisión técnica permanente en sitio',
          'Soldadura de conexiones con procedimientos certificados',
          'Control topográfico y dimensional continuo',
          'Cumplimiento estricto de protocolos de seguridad'
        ],
        equipos: {
          titulo: 'Equipos Especializados',
          items: ['Grúas telescópicas 25-100 ton', 'Grúas torre para proyectos especiales', 'Equipos de soldadura portátil', 'Instrumentos topográficos', 'Equipos de seguridad certificados']
        },
        seguridad: {
          titulo: 'Seguridad Industrial',
          items: ['Certificación en Trabajo en Alturas', 'Protocolos de seguridad OHSAS', 'Seguro de responsabilidad civil', 'Equipos de protección personal', 'Planes de emergencia en sitio']
        },
        expertiseTitulo: 'Experiencia en Montaje',
        expertiseDescripcion: 'Hemos completado el montaje de estructuras en proyectos de alta complejidad, desde edificios industriales hasta puentes y estructuras especiales, siempre cumpliendo con los más altos estándares de seguridad.',
        icono: 'Truck',
        color: 'green',
        bgGradient: 'from-green-600 to-green-800',
        orden: 3,
        metaTitle: 'Montaje de Estructuras Metálicas | MEISA',
        metaDescription: 'Servicio profesional de montaje de estructuras metálicas con personal certificado y equipos especializados. Seguridad industrial y cumplimiento de cronogramas.'
      },
      {
        slug: 'gestion-integral-proyectos',
        nombre: 'Gestión Integral de Proyectos',
        titulo: 'Gestión Integral de Proyectos',
        subtitulo: 'Administración profesional desde el diseño hasta la entrega',
        descripcion: 'En MEISA creemos que brindar una atención al cliente de manera integral es clave para finalizar los proyectos de manera eficiente y eficaz. Nuestro enfoque de gestión integral asegura la coordinación perfecta entre todas las fases del proyecto.',
        capacidades: [
          'Planificación y programación integral de proyectos',
          'Coordinación multidisciplinaria especializada',
          'Control de calidad en todas las etapas',
          'Gestión de proveedores y subcontratistas',
          'Seguimiento de cronogramas y presupuestos',
          'Comunicación continua con el cliente'
        ],
        metodologia: {
          titulo: 'Metodología MEISA',
          items: ['Planificación detallada inicial', 'Hitos de control y seguimiento', 'Comunicación transparente', 'Gestión de riesgos proactiva', 'Entrega oportuna y calidad']
        },
        ventajas: {
          titulo: 'Ventajas Competitivas',
          items: ['Un solo interlocutor para todo el proyecto', 'Responsabilidad integral', 'Optimización de tiempos y costos', 'Experiencia comprobada', 'Garantía de calidad total']
        },
        expertiseTitulo: 'Gestión Comprobada',
        expertiseDescripcion: 'Nuestro track record de más de 500 proyectos exitosos demuestra nuestra capacidad para gestionar proyectos de cualquier escala y complejidad, entregando resultados que superan las expectativas del cliente.',
        icono: 'Users',
        color: 'purple',
        bgGradient: 'from-purple-600 to-purple-800',
        orden: 4,
        metaTitle: 'Gestión Integral de Proyectos | MEISA',
        metaDescription: 'Gestión integral de proyectos de estructuras metálicas. Coordinación multidisciplinaria desde el diseño hasta la entrega final con garantía de calidad.'
      }
    ]

    // Actualizar cada servicio
    for (const servicio of serviciosData) {
      const updated = await prisma.servicio.upsert({
        where: { slug: servicio.slug },
        update: servicio,
        create: servicio
      })
      console.log(`✅ Actualizado servicio: ${updated.nombre}`)
    }

    console.log('✅ Todos los servicios han sido actualizados exitosamente')
  } catch (error) {
    console.error('❌ Error actualizando servicios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateServices()