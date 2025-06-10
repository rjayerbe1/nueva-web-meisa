import prisma from './lib/prisma'

async function createPages() {
  console.log('Creando páginas básicas...')

  // Página de Calidad
  const calidadPage = await prisma.pagina.upsert({
    where: { slug: 'calidad' },
    update: {},
    create: {
      slug: 'calidad',
      titulo: 'Nuestro Compromiso con la Excelencia',
      subtitulo: 'Sistema Integrado de Gestión que garantiza calidad, seguridad y cumplimiento normativo',
      contenido: {
        heroTag: 'CALIDAD Y CERTIFICACIONES',
        heroTitle: 'Nuestro Compromiso con la ',
        heroTitleHighlight: 'Excelencia',
        heroSubtitle: 'MEISA cuenta con un robusto Sistema Integrado de Gestión (SIG) que garantiza calidad, seguridad, cumplimiento normativo y mejora continua en todos nuestros procesos.',
        heroCta1: 'Solicitar Certificaciones',
        heroCta2: 'Ver Proyectos Certificados',
        heroImage: '/images/hero/hero-construccion-industrial.jpg',
        sigComponents: {
          0: {
            title: 'Gestión de Calidad',
            description: 'Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios',
            image: '/images/certificaciones/certificacion-calidad-1.jpg'
          },
          1: {
            title: 'Seguridad y Salud Ocupacional',
            description: 'Protección integral de colaboradores, contratistas y visitantes',
            image: '/images/equipo/equipo-industrial-1.jpg'
          },
          2: {
            title: 'Gestión Ambiental',
            description: 'Compromiso con el desarrollo sostenible y la protección del medio ambiente',
            image: '/images/empresa/instalaciones-planta.jpg'
          },
          3: {
            title: 'Gestión de Riesgos',
            description: 'Identificación, evaluación y control de riesgos en todos los procesos',
            image: '/images/servicios/gestion-4.jpg'
          }
        }
      },
      metaTitle: 'Calidad y Certificaciones | MEISA - Sistema Integrado de Gestión',
      metaDescription: 'Sistema Integrado de Gestión MEISA: calidad, seguridad, cumplimiento normativo. 27 años de excelencia en estructuras metálicas.',
      activa: true
    }
  })

  // Página de Tecnología
  const tecnologiaPage = await prisma.pagina.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: {
      slug: 'tecnologia',
      titulo: 'Tecnología e Innovación de Vanguardia',
      subtitulo: 'Herramientas avanzadas para diseñar, fabricar y montar estructuras metálicas con máxima precisión',
      contenido: {
        heroTag: 'TECNOLOGÍA E INNOVACIÓN',
        heroTitle: 'Tecnología e Innovación',
        heroTitleHighlight: 'de Vanguardia',
        heroSubtitle: 'En MEISA utilizamos las herramientas más avanzadas del mercado para diseñar, fabricar y montar estructuras metálicas con la máxima precisión y eficiencia.',
        heroCta1: 'Solicitar Consultoría',
        heroCta2: 'Ver Proyectos Realizados',
        heroImage: '/images/tecnologia/tecnologia-industrial-1.jpg',
        procesoFases: {
          0: {
            title: 'Diseño BIM',
            description: 'Modelado 3D con Tekla Structures',
            image: '/images/servicios/consultoria-1.jpg'
          },
          1: {
            title: 'Análisis Estructural',
            description: 'ETABS, SAP2000, Midas',
            image: '/images/servicios/consultoria-4.jpg'
          },
          2: {
            title: 'Fabricación CNC',
            description: 'Corte automatizado de precisión',
            image: '/images/equipo/equipo-industrial-1.jpg'
          },
          3: {
            title: 'Control Digital',
            description: 'Trazabilidad y calidad',
            image: '/images/servicios/gestion-2.jpg'
          }
        }
      },
      metaTitle: 'Tecnología e Innovación | MEISA - Software BIM y Fabricación CNC',
      metaDescription: 'Tecnología MEISA: BIM, análisis estructural, fabricación CNC, control digital. Tekla Structures, ETABS, SAP2000, equipamiento industrial.',
      activa: true
    }
  })

  // Página de Empresa
  const empresaPage = await prisma.pagina.upsert({
    where: { slug: 'empresa' },
    update: {},
    create: {
      slug: 'empresa',
      titulo: 'Nuestra Empresa',
      subtitulo: 'Líderes en estructuras metálicas con más de 29 años de experiencia',
      contenido: {
        heroTag: 'NUESTRA EMPRESA',
        heroTitle: 'Nuestra Empresa',
        heroTitleHighlight: 'Líderes en Estructuras Metálicas',
        heroSubtitle: 'Líderes en estructuras metálicas con más de 29 años de experiencia',
        heroCta1: 'Hablemos de tu Proyecto',
        heroCta2: 'Ver Nuestros Proyectos',
        heroImage: '/images/empresa/instalaciones-planta.jpg',
        numeroStats: {
          0: { number: '27', label: 'Años de Experiencia' },
          1: { number: '350', label: 'Toneladas/Mes' },
          2: { number: '3', label: 'Plantas' },
          3: { number: '100+', label: 'Colaboradores' }
        },
        capacidadStats: {
          0: { desc: 'Liderando el sector' },
          1: { desc: 'Capacidad de producción' },
          2: { desc: 'Popayán, Jamundí y expansión' },
          3: { desc: 'Equipo especializado' }
        },
        historia: {
          parrafo1: 'Desde 1998, MEISA ha sido pionera en el diseño, fabricación y montaje de estructuras metálicas en Colombia. Fundada en Popayán, Cauca, hemos crecido hasta convertirnos en una empresa líder del sector.',
          parrafo2: 'Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última tecnología.',
          mainImage: '/images/empresa/instalaciones-planta.jpg',
          card: {
            title: 'Desde 1998',
            subtitle: 'Construyendo el futuro de Colombia con estructuras metálicas de la más alta calidad'
          }
        },
        identidad: {
          mision: {
            title: 'Nuestra Misión',
            texto: 'Diseñar, fabricar y montar estructuras metálicas con los más altos estándares de calidad, cumpliendo los tiempos de entrega acordados y contribuyendo al desarrollo de la infraestructura nacional.'
          },
          vision: {
            title: 'Nuestra Visión',
            texto: 'Ser la empresa líder en Colombia en el diseño, fabricación y montaje de estructuras metálicas, reconocida por su excelencia, innovación y compromiso con el desarrollo sostenible.'
          }
        },
        capacidades: {
          equipoTecnico: '/images/equipo/equipo-industrial-1.jpg',
          procesoFabricacion: '/images/servicios/gestion-3.jpg',
          maquinariaEquipos: '/images/general/industria-general.jpg',
          instalacionesProduccion: '/images/empresa/instalaciones-planta.jpg'
        },
        instalaciones: {
          plantaPopayan: '/images/empresa/instalaciones-planta.jpg',
          plantaJamundi: '/images/general/industria-general.jpg',
          vistaPanoramica: '/images/servicios/gestion-4.jpg'
        },
        logros: {
          certificaciones: '/images/certificaciones/iso-certificacion.jpg',
          premios: '/images/certificaciones/certificacion-calidad-1.jpg'
        },
        cta: {
          title: 'Construyamos el Futuro Juntos',
          subtitle: 'Con más de 27 años de experiencia, MEISA continúa siendo el aliado estratégico para proyectos de estructuras metálicas en Colombia.'
        },
        ctaCta1: 'Hablemos de tu Proyecto',
        ctaCta2: 'Conoce Nuestros Proyectos'
      },
      metaTitle: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
      metaDescription: '27 años liderando el sector de estructuras metálicas en Colombia. Conoce nuestra historia, misión, visión, capacidades e instalaciones.',
      activa: true
    }
  })

  console.log('Páginas creadas exitosamente:', {
    calidad: calidadPage.id,
    tecnologia: tecnologiaPage.id,
    empresa: empresaPage.id
  })
}

createPages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })