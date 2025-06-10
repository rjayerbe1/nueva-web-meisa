import { prisma } from '@/lib/prisma'
import { TipoSeccion } from '@prisma/client'

// Datos de la página de Calidad
const calidadData = {
  slug: 'calidad',
  titulo: 'Calidad y Certificaciones',
  subtitulo: 'Nuestro compromiso con la excelencia',
  metaTitle: 'Certificaciones MEISA - Sistema Integrado de Gestión SIG | Calidad',
  metaDescription: 'Certificaciones y calidad MEISA: Sistema Integrado de Gestión SIG, normas sismo resistentes NSR-10, políticas de seguridad, transparencia y ética empresarial.',
  imagenHero: '/images/hero-calidad.jpg',
  activa: true,
  contenido: {},
  secciones: [
    {
      titulo: 'Sistema Integrado de Gestión (SIG)',
      subtitulo: 'Cuatro pilares fundamentales que aseguran la excelencia operacional',
      tipo: 'CARACTERISTICAS' as TipoSeccion,
      orden: 0,
      visible: true,
      contenido: {
        items: [
          {
            titulo: 'Gestión de Calidad',
            descripcion: 'Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios',
            icono: 'Award'
          },
          {
            titulo: 'Seguridad y Salud Ocupacional',
            descripcion: 'Protección integral de colaboradores, contratistas y visitantes',
            icono: 'Shield'
          },
          {
            titulo: 'Gestión Ambiental',
            descripcion: 'Compromiso con el desarrollo sostenible y la protección del medio ambiente',
            icono: 'Leaf'
          },
          {
            titulo: 'Gestión de Riesgos',
            descripcion: 'Identificación, evaluación y control de riesgos en todos los procesos',
            icono: 'AlertTriangle'
          }
        ]
      }
    },
    {
      titulo: 'Políticas Corporativas',
      subtitulo: 'Nuestras políticas definen el marco de actuación y los compromisos que asumimos',
      tipo: 'CONTENIDO' as TipoSeccion,
      orden: 1,
      visible: true,
      contenido: {
        texto: `## Política de Calidad Total
Adoptamos la Calidad Total como valor estratégico fundamental:
- Satisfacer plenamente las necesidades y expectativas de clientes
- Cumplir requisitos reglamentarios aplicables
- Prevenir defectos y no conformidades
- Mejorar continuamente nuestros procesos

## Política de Seguridad y Salud en el Trabajo
Compromiso integral con la seguridad de nuestro equipo:
- Protección integral de colaboradores, contratistas y visitantes
- Identificación, evaluación y control de riesgos laborales
- Prevención proactiva de riesgos laborales
- Cumplimiento de normatividad nacional vigente

## Política de Transparencia y Ética Empresarial
Integridad y transparencia en todas nuestras operaciones:
- Programa para mitigar riesgos de corrupción y soborno
- Canal ético para reportes confidenciales
- Declaración de conflictos de interés
- Cero tolerancia a prácticas indebidas`
      }
    },
    {
      titulo: 'Cumplimiento Normativo',
      subtitulo: 'Cumplimos rigurosamente con las normas técnicas más exigentes del sector metalmecánico',
      tipo: 'CARACTERISTICAS' as TipoSeccion,
      orden: 2,
      visible: true,
      contenido: {
        items: [
          {
            titulo: 'NSR-10',
            descripcion: 'Norma Sismo Resistente Colombiana'
          },
          {
            titulo: 'AWS',
            descripcion: 'American Welding Society'
          },
          {
            titulo: 'AISC',
            descripcion: 'American Institute of Steel Construction'
          },
          {
            titulo: 'ICONTEC',
            descripcion: 'Normas técnicas colombianas aplicables'
          }
        ]
      }
    },
    {
      titulo: 'Control de Calidad',
      subtitulo: 'Implementamos controles rigurosos en cada etapa del proceso',
      tipo: 'PROCESOS' as TipoSeccion,
      orden: 3,
      visible: true,
      contenido: {
        pasos: [
          {
            titulo: 'En Diseño',
            descripcion: 'Revisión por pares de ingenieros, verificación de cálculos estructurales, validación contra normas vigentes'
          },
          {
            titulo: 'En Fabricación',
            descripcion: 'Inspección de materias primas, control dimensional continuo, verificación de soldaduras, liberación por inspector SIG'
          },
          {
            titulo: 'En Montaje',
            descripcion: 'Check list pre-montaje, verificación de torques, control de verticalidad y alineación, protocolo de entrega final'
          }
        ]
      }
    },
    {
      titulo: 'Calidad que Trasciende en cada Proyecto',
      subtitulo: 'Nuestro compromiso con la calidad, seguridad y cumplimiento normativo nos ha posicionado como líderes en el sector metalmecánico colombiano',
      tipo: 'CTA' as TipoSeccion,
      orden: 4,
      visible: true,
      contenido: {
        botones: [
          {
            texto: 'Solicitar Certificaciones',
            url: '/contacto',
            tipo: 'primary'
          },
          {
            texto: 'Ver Proyectos Certificados',
            url: '/proyectos',
            tipo: 'secondary'
          }
        ]
      }
    }
  ]
}

// Datos de la página de Tecnología
const tecnologiaData = {
  slug: 'tecnologia',
  titulo: 'Tecnología e Innovación',
  subtitulo: 'Herramientas de vanguardia para la excelencia estructural',
  metaTitle: 'Tecnología MEISA - BIM, Tekla, RISA-3D, CNC | Innovación Estructural',
  metaDescription: 'Tecnología de punta en MEISA: modelado BIM con Tekla Structures, análisis RISA-3D, corte CNC, gestión StruM.I.S. 3 plantas con equipos modernos.',
  imagenHero: '/images/hero-tecnologia.jpg',
  activa: true,
  contenido: {},
  secciones: [
    {
      titulo: 'Software de Diseño y Análisis',
      subtitulo: 'Herramientas especializadas para el diseño estructural más preciso',
      tipo: 'CARACTERISTICAS' as TipoSeccion,
      orden: 0,
      visible: true,
      contenido: {
        items: [
          {
            titulo: 'Trimble Tekla Structures',
            descripcion: 'Software BIM líder mundial en estructuras metálicas y de concreto'
          },
          {
            titulo: 'ETABS',
            descripcion: 'Software de análisis y diseño estructural de edificios líder en la industria'
          },
          {
            titulo: 'SAFE',
            descripcion: 'Software especializado para el análisis y diseño de sistemas de losas y cimentaciones'
          },
          {
            titulo: 'SAP2000',
            descripcion: 'Programa de análisis estructural y diseño para todo tipo de estructuras'
          },
          {
            titulo: 'Midas',
            descripcion: 'Software avanzado de análisis y diseño estructural con capacidades BIM integradas'
          },
          {
            titulo: 'IDEA StatiCa Connection',
            descripcion: 'Software revolucionario para el diseño y verificación de conexiones de acero'
          }
        ]
      }
    },
    {
      titulo: 'Tecnología de Fabricación',
      subtitulo: 'Equipos modernos para la fabricación de precisión',
      tipo: 'CARACTERISTICAS' as TipoSeccion,
      orden: 1,
      visible: true,
      contenido: {
        items: [
          {
            titulo: 'Mesas de Corte CNC',
            descripcion: '3 mesas CNC para corte de precisión con plasma y oxicorte'
          },
          {
            titulo: 'Puentes Grúa',
            descripcion: '8 puentes grúa distribuidos en nuestras plantas para manejo eficiente'
          },
          {
            titulo: 'StruM.I.S',
            descripcion: 'Software líder mundial en gestión integral y control de producción'
          },
          {
            titulo: 'FastCAM',
            descripcion: 'Software de ingeniería para máquinas de corte por Plasma y Oxicorte'
          }
        ]
      }
    },
    {
      titulo: 'Capacidades de Producción',
      subtitulo: 'Infraestructura industrial para proyectos de gran escala',
      tipo: 'ESTADISTICAS' as TipoSeccion,
      orden: 2,
      visible: true,
      contenido: {
        stats: [
          {
            numero: '600',
            unidad: 'ton/mes',
            descripcion: 'Capacidad total de fabricación'
          },
          {
            numero: '3',
            unidad: 'plantas',
            descripcion: 'Ubicaciones estratégicas'
          },
          {
            numero: '10,400',
            unidad: 'm²',
            descripcion: 'Área total de fabricación'
          },
          {
            numero: '29',
            unidad: 'años',
            descripcion: 'Experiencia en el sector'
          }
        ]
      }
    },
    {
      titulo: 'Solicita una Demostración',
      subtitulo: 'Conoce de cerca nuestras capacidades tecnológicas y cómo pueden beneficiar tu proyecto',
      tipo: 'CTA' as TipoSeccion,
      orden: 3,
      visible: true,
      contenido: {
        botones: [
          {
            texto: 'Agendar Visita',
            url: '/contacto',
            tipo: 'primary'
          },
          {
            texto: 'Ver Proyectos',
            url: '/proyectos',
            tipo: 'secondary'
          }
        ]
      }
    }
  ]
}

// Datos de la página de Empresa
const empresaData = {
  slug: 'empresa',
  titulo: 'Nuestra Empresa',
  subtitulo: 'Líderes en estructuras metálicas con más de 29 años de experiencia',
  metaTitle: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
  metaDescription: 'MEISA: empresa colombiana especializada en estructuras metálicas. 29 años de experiencia, 320 colaboradores, 3 plantas. Conoce nuestra historia, misión y valores.',
  imagenHero: '/images/hero-empresa.jpg',
  activa: true,
  contenido: {},
  secciones: [
    {
      titulo: 'Nuestra Historia',
      subtitulo: 'Más de dos décadas forjando el futuro de la construcción en Colombia',
      tipo: 'CONTENIDO' as TipoSeccion,
      orden: 0,
      visible: true,
      contenido: {
        texto: `Metálicas e Ingeniería S.A fue constituida en el año de 1996 en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de Estructura Metálica.

Durante más de **29 años** hemos participado activamente en la construcción, manejo de Proyectos y Obras Civiles en todo el territorio Nacional, consolidándonos como una empresa líder en el sector metalmecánico colombiano.

Hoy contamos con **320 colaboradores** distribuidos en nuestras **3 plantas de producción**, con una capacidad total de **600 toneladas mensuales** y más de **10,400 m²** de área de fabricación.`
      }
    },
    {
      titulo: 'Misión, Visión y Valores',
      subtitulo: 'Los principios que guían nuestro trabajo',
      tipo: 'CONTENIDO' as TipoSeccion,
      orden: 1,
      visible: true,
      contenido: {
        texto: `## Misión
Fortalecer la empresa a nivel nacional garantizando un crecimiento en el tiempo a través de calidad de los productos y servicios, generando rentabilidad, aumento de confianza, mayor satisfacción de clientes y colaboradores para así mantener su consolidación y talento profesional ante el mercado y llegar a nuevos clientes.

## Visión
Desarrollar soluciones a proyectos con estructuras metálicas y obras civiles, logrando el balance ideal entre costos, diseño, funcionalidad y excelente calidad, cumpliendo con las normas sismo resistentes vigentes, los estándares de fabricación y montaje actuales, de la mano del talento humano y responsabilidad de los trabajadores.

## Valores Corporativos
- **Efectividad**: Cumplimos con los objetivos propuestos de manera eficiente
- **Integridad**: Actuamos con transparencia y honestidad en todos nuestros procesos
- **Lealtad**: Comprometidos con nuestros clientes y colaboradores
- **Proactividad**: Anticipamos necesidades y tomamos iniciativas
- **Aprendizaje Continuo**: Nos desarrollamos constantemente para mejorar
- **Respeto**: Valoramos a todas las personas y sus aportes
- **Pasión**: Amor por lo que hacemos y excelencia en el servicio
- **Disciplina**: Consistencia y rigor en nuestros procesos`
      }
    },
    {
      titulo: 'Nuestras Instalaciones',
      subtitulo: 'Tres ubicaciones estratégicas para servir mejor a nuestros clientes',
      tipo: 'CARACTERISTICAS' as TipoSeccion,
      orden: 2,
      visible: true,
      contenido: {
        items: [
          {
            titulo: 'Sede Principal Popayán',
            descripcion: 'Bodega E13 Parque Industrial – Cauca. 4,400 m², 350 ton/mes, 3 naves industriales, 5 puentes grúa'
          },
          {
            titulo: 'Sede Jamundí',
            descripcion: 'Vía Panamericana 6 Sur – 195 – Valle del Cauca. 6,000 m², 250 ton/mes, sede administrativa'
          },
          {
            titulo: 'Planta Villa Rica',
            descripcion: 'Vía Puerto Tejada – Villa Rica, Vereda Agua Azul, Cauca. Planta especializada en proyectos regionales'
          }
        ]
      }
    },
    {
      titulo: 'Estadísticas de la Empresa',
      subtitulo: 'Números que respaldan nuestra trayectoria',
      tipo: 'ESTADISTICAS' as TipoSeccion,
      orden: 3,
      visible: true,
      contenido: {
        stats: [
          {
            numero: '29',
            unidad: 'años',
            descripcion: 'De experiencia en el mercado'
          },
          {
            numero: '320',
            unidad: 'colaboradores',
            descripcion: 'Equipo humano especializado'
          },
          {
            numero: '500+',
            unidad: 'proyectos',
            descripcion: 'Proyectos exitosos completados'
          },
          {
            numero: '3',
            unidad: 'plantas',
            descripcion: 'Ubicaciones estratégicas'
          }
        ]
      }
    },
    {
      titulo: 'Únete a Nuestro Equipo',
      subtitulo: 'Forma parte de una empresa líder en el sector metalmecánico colombiano',
      tipo: 'CTA' as TipoSeccion,
      orden: 4,
      visible: true,
      contenido: {
        botones: [
          {
            texto: 'Conocer Oportunidades',
            url: '/contacto',
            tipo: 'primary'
          },
          {
            texto: 'Ver Proyectos',
            url: '/proyectos',
            tipo: 'secondary'
          }
        ]
      }
    }
  ]
}

async function migrarPaginas() {
  console.log('🚀 Iniciando migración de páginas...')

  try {
    // Página de Calidad
    console.log('📄 Creando página de Calidad...')
    const paginaCalidad = await prisma.pagina.upsert({
      where: { slug: 'calidad' },
      update: {
        titulo: calidadData.titulo,
        subtitulo: calidadData.subtitulo,
        metaTitle: calidadData.metaTitle,
        metaDescription: calidadData.metaDescription,
        imagenHero: calidadData.imagenHero,
        activa: calidadData.activa,
        contenido: calidadData.contenido
      },
      create: {
        slug: calidadData.slug,
        titulo: calidadData.titulo,
        subtitulo: calidadData.subtitulo,
        metaTitle: calidadData.metaTitle,
        metaDescription: calidadData.metaDescription,
        imagenHero: calidadData.imagenHero,
        activa: calidadData.activa,
        contenido: calidadData.contenido
      }
    })

    // Eliminar secciones existentes de calidad
    await prisma.seccionPagina.deleteMany({
      where: { paginaId: paginaCalidad.id }
    })

    // Crear secciones de calidad
    for (const seccion of calidadData.secciones) {
      await prisma.seccionPagina.create({
        data: {
          paginaId: paginaCalidad.id,
          titulo: seccion.titulo,
          subtitulo: seccion.subtitulo,
          tipo: seccion.tipo,
          orden: seccion.orden,
          visible: seccion.visible,
          contenido: seccion.contenido
        }
      })
    }

    // Página de Tecnología
    console.log('💻 Creando página de Tecnología...')
    const paginaTecnologia = await prisma.pagina.upsert({
      where: { slug: 'tecnologia' },
      update: {
        titulo: tecnologiaData.titulo,
        subtitulo: tecnologiaData.subtitulo,
        metaTitle: tecnologiaData.metaTitle,
        metaDescription: tecnologiaData.metaDescription,
        imagenHero: tecnologiaData.imagenHero,
        activa: tecnologiaData.activa,
        contenido: tecnologiaData.contenido
      },
      create: {
        slug: tecnologiaData.slug,
        titulo: tecnologiaData.titulo,
        subtitulo: tecnologiaData.subtitulo,
        metaTitle: tecnologiaData.metaTitle,
        metaDescription: tecnologiaData.metaDescription,
        imagenHero: tecnologiaData.imagenHero,
        activa: tecnologiaData.activa,
        contenido: tecnologiaData.contenido
      }
    })

    // Eliminar secciones existentes de tecnología
    await prisma.seccionPagina.deleteMany({
      where: { paginaId: paginaTecnologia.id }
    })

    // Crear secciones de tecnología
    for (const seccion of tecnologiaData.secciones) {
      await prisma.seccionPagina.create({
        data: {
          paginaId: paginaTecnologia.id,
          titulo: seccion.titulo,
          subtitulo: seccion.subtitulo,
          tipo: seccion.tipo,
          orden: seccion.orden,
          visible: seccion.visible,
          contenido: seccion.contenido
        }
      })
    }

    // Página de Empresa
    console.log('🏢 Creando página de Empresa...')
    const paginaEmpresa = await prisma.pagina.upsert({
      where: { slug: 'empresa' },
      update: {
        titulo: empresaData.titulo,
        subtitulo: empresaData.subtitulo,
        metaTitle: empresaData.metaTitle,
        metaDescription: empresaData.metaDescription,
        imagenHero: empresaData.imagenHero,
        activa: empresaData.activa,
        contenido: empresaData.contenido
      },
      create: {
        slug: empresaData.slug,
        titulo: empresaData.titulo,
        subtitulo: empresaData.subtitulo,
        metaTitle: empresaData.metaTitle,
        metaDescription: empresaData.metaDescription,
        imagenHero: empresaData.imagenHero,
        activa: empresaData.activa,
        contenido: empresaData.contenido
      }
    })

    // Eliminar secciones existentes de empresa
    await prisma.seccionPagina.deleteMany({
      where: { paginaId: paginaEmpresa.id }
    })

    // Crear secciones de empresa
    for (const seccion of empresaData.secciones) {
      await prisma.seccionPagina.create({
        data: {
          paginaId: paginaEmpresa.id,
          titulo: seccion.titulo,
          subtitulo: seccion.subtitulo,
          tipo: seccion.tipo,
          orden: seccion.orden,
          visible: seccion.visible,
          contenido: seccion.contenido
        }
      })
    }

    console.log('✅ Migración completada exitosamente!')
    console.log(`📄 Página de Calidad: ${calidadData.secciones.length} secciones`)
    console.log(`💻 Página de Tecnología: ${tecnologiaData.secciones.length} secciones`)
    console.log(`🏢 Página de Empresa: ${empresaData.secciones.length} secciones`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrarPaginas()
  .then(() => {
    console.log('🎉 Migración finalizada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })