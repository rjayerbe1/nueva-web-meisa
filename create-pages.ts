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
        procesoIntegral: {
          title: 'Proceso Tecnológico Integral',
          subtitle: 'Tres etapas fundamentales con tecnología de vanguardia: desde diseño BIM hasta control digital'
        },
        heroCta1: 'Solicitar Consultoría',
        heroCta2: 'Ver Proyectos Realizados',
        heroImage: '/images/tecnologia/tecnologia-industrial-1.jpg',
        procesoFases: {
          0: {
            title: 'Diseño y Análisis',
            description: 'Modelado BIM + Análisis estructural integrado',
            image: '/images/servicios/consultoria-1.jpg'
          },
          1: {
            title: 'Fabricación y Montaje',
            description: 'Tecnologías CNC + Equipos de montaje especializados',
            image: '/images/equipo/equipo-industrial-1.jpg'
          },
          2: {
            title: 'Control Digital',
            description: 'Trazabilidad QR y calidad certificada',
            image: '/images/servicios/gestion-2.jpg'
          }
        },
        softwareCategories: {
          0: {
            category: 'Diseño BIM',
            description: 'Modelado 3D y coordinación multidisciplinaria',
            image: '/images/servicios/consultoria-1.jpg',
            tools: {
              0: {
                name: 'Trimble Tekla Structures',
                specialty: 'Líder mundial en BIM para estructuras',
                image: '/images/servicios/consultoria-1.jpg'
              },
              1: {
                name: 'AutoCAD',
                specialty: 'Diseño técnico 2D/3D',
                image: '/images/servicios/consultoria-2.jpg'
              }
            }
          },
          1: {
            category: 'Análisis Estructural',
            description: 'Simulación y análisis avanzado de estructuras',
            image: '/images/servicios/consultoria-4.jpg',
            tools: {
              0: {
                name: 'ETABS',
                specialty: 'Análisis de edificios y estructuras complejas',
                image: '/images/servicios/consultoria-4.jpg'
              },
              1: {
                name: 'SAP2000',
                specialty: 'Análisis universal de estructuras',
                image: '/images/servicios/consultoria-3.jpg'
              }
            }
          },
          2: {
            category: 'Conexiones Especializadas',
            description: 'Diseño y verificación de conexiones críticas',
            image: '/images/servicios/gestion-1.jpg',
            tools: {
              0: {
                name: 'IDEA StatiCa',
                specialty: 'Conexiones complejas con análisis CBFEM',
                image: '/images/servicios/gestion-1.jpg'
              }
            }
          }
        },
        equipmentCategories: {
          0: {
            category: 'Corte CNC',
            subtitle: '3 Mesas Automatizadas',
            description: 'Control numérico computarizado para corte de precisión milimétrica',
            image: '/images/equipo/equipo-industrial-1.jpg',
            specs: {
              0: 'Precisión ±0.5mm',
              1: 'Corte hasta 150mm',
              2: '3 mesas distribuidas'
            }
          },
          1: {
            category: 'Sistemas de Izaje',
            subtitle: '8 Puentes Grúa',
            description: 'Sistemas de manejo de cargas para fabricación y montaje',
            image: '/images/general/industria-general.jpg',
            specs: {
              0: '5 en Popayán',
              1: '3 en Jamundí',
              2: 'Hasta 20 toneladas'
            }
          },
          2: {
            category: 'Equipos de Montaje',
            subtitle: 'Tecnología Móvil',
            description: 'Equipamiento especializado para montaje en obra',
            image: '/images/servicios/montaje-1.jpg',
            specs: {
              0: 'Grúas móviles',
              1: 'Equipos de soldadura',
              2: 'Sistemas de posicionamiento'
            }
          },
          3: {
            category: 'Equipos Especializados',
            subtitle: 'Procesos Únicos',
            description: 'Maquinaria para procesos especializados de acabado',
            image: '/images/servicios/fabricacion-1.jpg',
            specs: {
              0: 'Granalladora industrial',
              1: 'Curvadora de tejas',
              2: 'Sistemas de pintura'
            }
          }
        },
        digitalProcesses: {
          0: {
            process: 'Trazabilidad QR Integral',
            subtitle: 'Seguimiento en Tiempo Real',
            description: 'Sistema completo de códigos QR que permite seguimiento desde fabricación hasta montaje con ubicación GPS en tiempo real',
            image: '/images/servicios/gestion-2.jpg',
            benefits: {
              0: 'Historial completo de cada pieza',
              1: 'Ubicación GPS en tiempo real',
              2: 'Control de calidad digital integrado'
            }
          },
          1: {
            process: 'Reportes Digitales Automáticos',
            subtitle: 'Certificación Digital',
            description: 'Documentación automática completa con evidencia fotográfica y certificaciones digitales blockchain',
            image: '/images/servicios/gestion-3.jpg',
            benefits: {
              0: 'Informes automáticos en tiempo real',
              1: 'Evidencia fotográfica completa',
              2: 'Certificación digital blockchain'
            }
          }
        },
        softwareGallery: {
          title: 'Software Especializado en Acción',
          subtitle: 'Herramientas de vanguardia que nos permiten crear estructuras metálicas con precisión milimétrica',
          tools: {
            0: {
              title: 'Trimble Tekla Structures',
              description: 'Software BIM líder mundial para modelado detallado de estructuras metálicas y concreto',
              image: '/images/tecnologia/software-diseno-cad.jpg',
              badge: 'BIM Líder Mundial',
              features: {
                0: 'Modelado 3D completo y detallado',
                1: 'Coordinación multidisciplinaria BIM',
                2: 'Generación automática de planos de fabricación'
              }
            },
            1: {
              title: 'ETABS & SAP2000',
              description: 'Suite completa de análisis estructural para edificios y estructuras complejas',
              image: '/images/servicios/consultoria-4.jpg',
              badge: 'Análisis Avanzado',
              features: {
                0: 'Análisis sísmico y dinámico avanzado',
                1: 'Diseño según normativas internacionales',
                2: 'Optimización estructural y de materiales'
              }
            },
            2: {
              title: 'IDEA StatiCa Connection',
              description: 'Software revolucionario para diseño y verificación de conexiones de acero complejas',
              image: '/images/servicios/consultoria-3.jpg',
              badge: 'Conexiones Especializadas',
              features: {
                0: 'Análisis por elementos finitos CBFEM',
                1: 'Verificación según códigos internacionales',
                2: 'Reportes detallados de cálculo'
              }
            },
            3: {
              title: 'Suite Complementaria',
              description: 'Midas Civil, SAFE, DC-CAD y herramientas especializadas para análisis integral',
              image: '/images/tecnologia/tecnologia-industrial-1.jpg',
              badge: 'Suite Completa',
              features: {
                0: 'Análisis de losas y cimentaciones',
                1: 'Diseño de elementos de concreto',
                2: 'Integración completa con workflow BIM'
              }
            }
          }
        },
        techStats: {
          title: 'Tecnología en Números',
          subtitle: 'Datos que demuestran nuestro compromiso con la innovación tecnológica',
          stats: {
            0: {
              number: '15+',
              label: 'Software Especializados',
              description: 'Herramientas BIM y de análisis'
            },
            1: {
              number: '99.8%',
              label: 'Precisión CNC',
              description: 'Tolerancia milimétrica'
            },
            2: {
              number: '100%',
              label: 'Trazabilidad Digital',
              description: 'Control QR completo'
            },
            3: {
              number: '27',
              label: 'Años de Innovación',
              description: 'Evolución tecnológica constante'
            }
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