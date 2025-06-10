const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Contenido completo editable para todas las secciones
const paginasContent = {
  calidad: {
    slug: 'calidad',
    titulo: 'Calidad y Certificaciones',
    subtitulo: 'Nuestro compromiso con la excelencia',
    metaTitle: 'Certificaciones MEISA - Sistema Integrado de Gestión SIG | Calidad',
    metaDescription: 'Certificaciones y calidad MEISA: Sistema Integrado de Gestión SIG, normas sismo resistentes NSR-10, políticas de seguridad, transparencia y ética empresarial.',
    activa: true,
    contenido: {
      heroTitle: 'Nuestro Compromiso con la ',
      heroSubtitle: 'MEISA cuenta con un robusto Sistema Integrado de Gestión (SIG) que garantiza calidad, seguridad, cumplimiento normativo y mejora continua en todos nuestros procesos. Más de 27 años de excelencia en seguridad respaldan nuestro compromiso con la calidad.',
      heroTag: 'CALIDAD Y CERTIFICACIONES',
      heroTitleHighlight: 'Excelencia',
      heroCta1: 'Solicitar Certificaciones',
      heroCta2: 'Ver Proyectos Certificados',
      procesoIntegral: {
        title: 'Sistema de Gestión Integral',
        subtitle: 'Cuatro pilares fundamentales que aseguran la excelencia operacional y el cumplimiento de los más altos estándares'
      },
      sigComponents: {
        0: {
          title: 'Gestión de Calidad',
          description: 'Sistemas y procesos para garantizar la excelencia en todos nuestros productos y servicios'
        },
        1: {
          title: 'Seguridad y Salud Ocupacional',
          description: 'Protección integral de colaboradores, contratistas y visitantes'
        },
        2: {
          title: 'Gestión Ambiental',
          description: 'Compromiso con el desarrollo sostenible y la protección del medio ambiente'
        },
        3: {
          title: 'Gestión de Riesgos',
          description: 'Identificación, evaluación y control de riesgos en todos los procesos'
        }
      },
      sections: {
        sig: {
          title: 'Sistema Integrado de Gestión (SIG)',
          subtitle: 'Cuatro pilares fundamentales que aseguran la excelencia operacional'
        },
        politicas: {
          title: 'Políticas Corporativas',
          subtitle: 'Nuestras políticas definen el marco de actuación y los compromisos que asumimos'
        },
        cumplimiento: {
          title: 'Cumplimiento Normativo',
          subtitle: 'Cumplimos rigurosamente con las normas técnicas más exigentes del sector metalmecánico'
        },
        controlcalidad: {
          title: 'Control de Calidad',
          subtitle: 'Implementamos controles rigurosos en cada etapa del proceso'
        }
      },
      policies: {
        0: {
          title: 'Política de Calidad Total',
          description: 'Adoptamos la Calidad Total como valor estratégico fundamental',
          commitments: {
            0: 'Satisfacer plenamente las necesidades y expectativas de clientes',
            1: 'Cumplir requisitos reglamentarios aplicables',
            2: 'Prevenir defectos y no conformidades',
            3: 'Mejorar continuamente nuestros procesos',
            4: 'Proporcionar recursos necesarios para el SIG'
          }
        },
        1: {
          title: 'Política de Seguridad y Salud en el Trabajo',
          description: 'Compromiso integral con la seguridad de nuestro equipo',
          commitments: {
            0: 'Protección integral de colaboradores, contratistas y visitantes',
            1: 'Identificación, evaluación y control de riesgos laborales',
            2: 'Prevención proactiva de riesgos laborales',
            3: 'Cumplimiento de normatividad nacional vigente',
            4: 'Condiciones laborales seguras y saludables'
          }
        },
        2: {
          title: 'Política de Transparencia y Ética Empresarial',
          description: 'Integridad y transparencia en todas nuestras operaciones',
          commitments: {
            0: 'Programa para mitigar riesgos de corrupción y soborno',
            1: 'Canal ético para reportes confidenciales',
            2: 'Declaración de conflictos de interés',
            3: 'Compromiso con la integridad empresarial',
            4: 'Cero tolerancia a prácticas indebidas'
          }
        },
        3: {
          title: 'Política Antilavado de Activos',
          description: 'Cumplimiento riguroso de normativas SARLAFT',
          commitments: {
            0: 'Mitigación del riesgo de LA/FT',
            1: 'Debida diligencia en relaciones comerciales',
            2: 'Reporte de operaciones sospechosas',
            3: 'Cumplimiento normativo SARLAFT',
            4: 'Capacitación continua del personal'
          }
        }
      },
      standards: {
        0: {
          category: 'Normas Técnicas',
          items: {
            0: { name: 'NSR-10', description: 'Norma Sismo Resistente Colombiana' },
            1: { name: 'AWS', description: 'American Welding Society' },
            2: { name: 'AISC', description: 'American Institute of Steel Construction' },
            3: { name: 'ICONTEC', description: 'Normas técnicas colombianas aplicables' }
          }
        },
        1: {
          category: 'Estándares de Fabricación',
          items: {
            0: { name: 'Tolerancias', description: 'Según normas internacionales' },
            1: { name: 'Soldadura', description: 'Procedimientos calificados' },
            2: { name: 'Ensayos', description: 'No destructivos cuando se requieren' },
            3: { name: 'Materiales', description: 'Certificados de calidad' }
          }
        },
        2: {
          category: 'Protocolos de Seguridad',
          items: {
            0: { name: 'Alturas', description: 'Trabajo seguro en alturas' },
            1: { name: 'Cargas', description: 'Manejo de cargas críticas' },
            2: { name: 'Espacios', description: 'Espacios confinados' },
            3: { name: 'Emergencias', description: 'Plan de emergencias' }
          }
        }
      },
      qualityControl: {
        0: {
          stage: 'En Diseño',
          processes: {
            0: 'Revisión por pares de ingenieros',
            1: 'Verificación de cálculos estructurales',
            2: 'Validación contra normas vigentes',
            3: 'Aprobación del cliente'
          }
        },
        1: {
          stage: 'En Fabricación',
          processes: {
            0: 'Inspección de materias primas',
            1: 'Control dimensional continuo',
            2: 'Verificación de soldaduras',
            3: 'Pruebas de pintura y recubrimientos',
            4: 'Liberación por inspector SIG'
          }
        },
        2: {
          stage: 'En Montaje',
          processes: {
            0: 'Check list pre-montaje',
            1: 'Verificación de torques',
            2: 'Control de verticalidad y alineación',
            3: 'Protocolo de entrega final'
          }
        }
      },
      cta: {
        title: 'Calidad que Trasciende en cada Proyecto',
        subtitle: 'Nuestro compromiso con la calidad, seguridad y cumplimiento normativo nos ha posicionado como líderes en el sector metalmecánico colombiano. Más de 27 años de excelencia operacional y cientos de proyectos exitosos respaldan nuestra trayectoria.'
      },
      ctaCta1: 'Solicitar Certificaciones',
      ctaCta2: 'Ver Proyectos Certificados'
    }
  },
  
  tecnologia: {
    slug: 'tecnologia',
    titulo: 'Tecnología e Innovación',
    subtitulo: 'Herramientas de vanguardia para la excelencia estructural',
    metaTitle: 'Tecnología MEISA - BIM, Tekla, RISA-3D, CNC | Innovación Estructural',
    metaDescription: 'Tecnología de punta en MEISA: modelado BIM con Tekla Structures, análisis RISA-3D, corte CNC, gestión StruM.I.S. 3 plantas con equipos modernos.',
    activa: true,
    contenido: {
      heroTitle: 'Tecnología e Innovación',
      heroSubtitle: 'En MEISA utilizamos las herramientas más avanzadas del mercado para diseñar, fabricar y montar estructuras metálicas con la máxima precisión y eficiencia. Desde modelado BIM hasta control de calidad digital, la tecnología es nuestro aliado para entregar excelencia.',
      heroTag: 'TECNOLOGÍA E INNOVACIÓN',
      heroTitleHighlight: 'de Vanguardia',
      heroCta1: 'Solicitar Consultoría',
      heroCta2: 'Ver Proyectos Realizados',
      procesoIntegral: {
        title: 'Proceso Tecnológico Integral',
        subtitle: 'Desde el diseño BIM hasta la fabricación CNC, cada etapa cuenta con tecnología de vanguardia'
      },
      procesoFases: {
        0: {
          title: 'Diseño BIM',
          desc: 'Modelado 3D con Tekla Structures'
        },
        1: {
          title: 'Análisis Estructural',
          desc: 'ETABS, SAP2000, Midas'
        },
        2: {
          title: 'Fabricación CNC',
          desc: 'Corte automatizado de precisión'
        },
        3: {
          title: 'Control Digital',
          desc: 'Trazabilidad y calidad'
        }
      },
      softwareTools: {
        0: {
          name: 'Trimble Tekla Structures',
          description: 'Software BIM líder mundial para modelado de estructuras metálicas y concreto',
          features: {
            0: 'Modelado 3D detallado de estructuras complejas',
            1: 'Coordinación multidisciplinaria BIM',
            2: 'Generación automática de planos de fabricación',
            3: 'Detección de interferencias',
            4: 'Cuantificación exacta de materiales'
          }
        },
        1: {
          name: 'ETABS',
          description: 'Software de análisis y diseño estructural de edificios líder en la industria',
          features: {
            0: 'Análisis no lineal avanzado',
            1: 'Diseño sísmico con normativas internacionales',
            2: 'Modelado de estructuras complejas',
            3: 'Análisis dinámico y pushover',
            4: 'Diseño de elementos de concreto y acero'
          }
        },
        2: {
          name: 'SAP2000',
          description: 'Programa de análisis estructural y diseño para todo tipo de estructuras',
          features: {
            0: 'Análisis estructural completo',
            1: 'Diseño de puentes y estructuras especiales',
            2: 'Análisis no lineal y dinámico',
            3: 'Modelado paramétrico avanzado',
            4: 'Integración con BIM'
          }
        },
        3: {
          name: 'IDEA StatiCa Connection',
          description: 'Software revolucionario para el diseño y verificación de conexiones de acero',
          features: {
            0: 'Diseño de conexiones complejas',
            1: 'Análisis por elementos finitos CBFEM',
            2: 'Verificación según códigos internacionales',
            3: 'Optimización de conexiones',
            4: 'Reportes detallados de cálculo'
          }
        }
      },
      equipment: {
        0: {
          title: 'Maquinaria de Corte',
          items: {
            0: '3 Mesas de corte CNC distribuidas en nuestras plantas',
            1: 'Control numérico computarizado',
            2: 'Precisión milimétrica',
            3: 'Capacidad para espesores diversos',
            4: 'Alta velocidad de producción'
          }
        },
        1: {
          title: 'Equipos de Izaje',
          items: {
            0: '8 Puentes grúa (5 en Popayán, 3 en Jamundí)',
            1: 'Capacidad de manejo seguro de piezas pesadas',
            2: 'Optimización de flujo en planta',
            3: 'Seguridad certificada',
            4: 'Mantenimiento preventivo continuo'
          }
        },
        2: {
          title: 'Equipos Especializados',
          items: {
            0: 'Granalladora industrial para limpieza y preparación',
            1: 'Ensambladora de perfiles de alta precisión',
            2: 'Curvadora de tejas para cubiertas especiales',
            3: 'Equipos de soldadura con personal certificado',
            4: 'Sistemas de pintura y recubrimientos'
          }
        }
      },
      innovations: {
        0: {
          title: 'Tecnología BIM',
          description: 'La mayoría de nuestros proyectos se coordinan utilizando Building Information Modeling',
          benefits: {
            0: 'Reducción de errores en obra',
            1: 'Mayor precisión en fabricación',
            2: 'Coordinación entre disciplinas',
            3: 'Visualización 3D para clientes',
            4: 'Detección temprana de conflictos'
          }
        },
        1: {
          title: 'Control de Calidad Digital',
          description: 'Sistemas digitales integrados para garantizar la excelencia en cada proceso',
          benefits: {
            0: 'Trazabilidad mediante códigos QR',
            1: 'Registro fotográfico de procesos',
            2: 'Reportes digitales en tiempo real',
            3: 'Certificados de calidad digitalizados',
            4: 'Control de espesores digitales'
          }
        }
      },
      sections: {
        softwarediseno: {
          title: 'Software de Diseño e Ingeniería',
          subtitle: 'Herramientas BIM de vanguardia'
        },
        softwareconexiones: {
          title: 'Software de Conexiones y Elementos',
          subtitle: 'Diseño especializado de conexiones'
        },
        softwareanalisis: {
          title: 'Software de Análisis Avanzado',
          subtitle: 'Capacidades de simulación superiores'
        },
        gestionproduccion: {
          title: 'Software de Gestión y Producción',
          subtitle: 'Control integral de fabricación'
        },
        equipamiento: {
          title: 'Equipamiento Industrial',
          subtitle: 'Maquinaria de última generación'
        },
        innovacion: {
          title: 'Innovación en Procesos',
          subtitle: 'Tecnología BIM y control digital'
        }
      },
      cta: {
        title: 'Tecnología al Servicio de tus Proyectos',
        subtitle: 'Descubre cómo nuestra tecnología de punta puede optimizar tu próximo proyecto de estructuras metálicas. Desde el diseño hasta el montaje, te acompañamos con las mejores herramientas del mercado.'
      },
      ctaCta1: 'Solicitar Consultoría',
      ctaCta2: 'Ver Proyectos Realizados'
    }
  },
  
  empresa: {
    slug: 'empresa',
    titulo: 'Nuestra Empresa',
    subtitulo: 'Líderes en estructuras metálicas con más de 29 años de experiencia',
    metaTitle: 'Nuestra Empresa | MEISA - Líderes en Estructuras Metálicas',
    metaDescription: 'MEISA: empresa colombiana especializada en estructuras metálicas. 29 años de experiencia, 320 colaboradores, 3 plantas. Conoce nuestra historia, misión y valores.',
    activa: true,
    contenido: {
      heroTitle: 'Nuestra Empresa',
      heroSubtitle: 'Líderes en estructuras metálicas con más de 29 años de experiencia',
      heroTag: 'NUESTRA EMPRESA',
      heroTitleHighlight: 'Líderes en Estructuras Metálicas',
      heroCta1: 'Hablemos de tu Proyecto',
      heroCta2: 'Ver Nuestros Proyectos',
      numeros: {
        title: 'MEISA en Números',
        subtitle: 'Más de 27 años de experiencia nos han posicionado como líderes en el sector metalmecánico.'
      },
      numeroStats: {
        0: {
          number: '27',
          label: 'Años de Experiencia'
        },
        1: {
          number: '350',
          label: 'Toneladas/Mes'
        },
        2: {
          number: '3',
          label: 'Plantas'
        },
        3: {
          number: '100+',
          label: 'Colaboradores'
        }
      },
      historia: {
        parrafo1: 'Desde 1998, MEISA ha sido pionera en el diseño, fabricación y montaje de estructuras metálicas en Colombia. Fundada en Popayán, Cauca, hemos crecido hasta convertirnos en una empresa líder del sector.',
        parrafo2: 'Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última tecnología.',
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
      capacidadStats: {
        0: {
          number: '27',
          label: 'Años de Experiencia',
          desc: 'Liderando el sector'
        },
        1: {
          number: '350',
          label: 'Toneladas/Mes',
          desc: 'Capacidad de producción'
        },
        2: {
          number: '3',
          label: 'Plantas',
          desc: 'Popayán, Jamundí y expansión'
        },
        3: {
          number: '100+',
          label: 'Colaboradores',
          desc: 'Equipo especializado'
        }
      },
      politicas: {
        objetivosTitle: 'Nuestros Objetivos:',
        objetivos: {
          0: 'Satisfacer plenamente las necesidades y expectativas de nuestros clientes',
          1: 'Cumplir con todos los requisitos reglamentarios aplicables',
          2: 'Prevenir defectos y no conformidades en nuestros procesos',
          3: 'Mejorar continuamente la eficacia de nuestro sistema de gestión',
          4: 'Proporcionar los recursos necesarios para el logro de estos objetivos',
          5: 'Promover la participación activa de todo el personal'
        }
      },
      sections: {
        historia: {
          title: 'Nuestra Historia',
          subtitle: 'Más de dos décadas forjando el futuro de la construcción en Colombia'
        },
        identidad: {
          title: 'Misión, Visión y Valores',
          subtitle: 'Los principios que guían nuestro trabajo'
        },
        capacidades: {
          title: 'Nuestras Capacidades',
          subtitle: 'La experiencia y capacidad productiva que nos posiciona como líderes del sector.'
        },
        politicas: {
          title: 'Política Integrada de Gestión',
          subtitle: 'Nuestro marco de gestión integra calidad, seguridad, medio ambiente y cumplimiento normativo.'
        },
        gobierno: {
          title: 'Gobierno Corporativo',
          subtitle: 'Documentos y políticas que rigen nuestro comportamiento empresarial.'
        }
      },
      cta: {
        title: 'Construyamos el Futuro Juntos',
        subtitle: 'Con más de 27 años de experiencia, MEISA continúa siendo el aliado estratégico para proyectos de estructuras metálicas en Colombia.'
      },
      ctaCta1: 'Hablemos de tu Proyecto',
      ctaCta2: 'Conoce Nuestros Proyectos'
    }
  }
}

async function updateSimpleContent() {
  console.log('🚀 Actualizando contenido editable simple...')

  try {
    for (const [slug, data] of Object.entries(paginasContent)) {
      console.log(`📄 Actualizando página: ${slug}`)
      
      await prisma.pagina.upsert({
        where: { slug },
        update: {
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          activa: data.activa,
          contenido: data.contenido
        },
        create: {
          slug: data.slug,
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          activa: data.activa,
          contenido: data.contenido
        }
      })
    }

    console.log('✅ Contenido actualizado exitosamente!')
    console.log('📝 Las páginas mantienen su diseño original pero con contenido editable')

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateSimpleContent()
  .then(() => {
    console.log('🎉 Actualización finalizada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })