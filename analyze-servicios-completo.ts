import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ServicioCompleto {
  id: string
  nombre: string
  descripcion: string
  caracteristicas: string[]
  capacidades: string[]
  icono?: string
  imagen?: string
  slug: string
  activo: boolean
  destacado: boolean
  orden: number
  color: string
  bgGradient?: string
  subtitulo?: string
  titulo?: string
  expertiseTitulo?: string
  expertiseDescripcion?: string
  metaTitle?: string
  metaDescription?: string
  certificaciones?: any
  equipamiento?: any
  equipos?: any
  metodologia?: any
  normativas?: any
  seguridad?: any
  tecnologias?: any
  ventajas?: any
}

interface AnalisisServicio {
  servicio: ServicioCompleto
  fortalezas: string[]
  debilidades: string[]
  contenidoTecnicoDisponible: string[]
  contenidoTecnicoFaltante: string[]
  recomendaciones: string[]
  estructuraPageSugerida: {
    seccion: string
    contenido: string
    prioridad: 'alta' | 'media' | 'baja'
  }[]
}

async function analizarServiciosCompleto() {
  console.log('🔍 Analizando servicios actuales de MEISA...\n')
  
  try {
    // Obtener todos los servicios activos
    const servicios = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' }
    })

    console.log(`📊 Total de servicios activos encontrados: ${servicios.length}\n`)

    const analisisCompleto: AnalisisServicio[] = []

    for (const servicio of servicios) {
      console.log(`\n🔧 ANALIZANDO SERVICIO: ${servicio.nombre}`)
      console.log('═'.repeat(60))

      const analisis = analizarServicioIndividual(servicio as ServicioCompleto)
      analisisCompleto.push(analisis)

      // Mostrar información básica
      console.log(`📋 Información Básica:`)
      console.log(`   • Título: ${servicio.titulo || servicio.nombre}`)
      console.log(`   • Subtítulo: ${servicio.subtitulo || 'No definido'}`)
      console.log(`   • Descripción: ${servicio.descripcion.substring(0, 100)}...`)
      console.log(`   • Slug: ${servicio.slug}`)
      console.log(`   • Color: ${servicio.color}`)
      console.log(`   • Destacado: ${servicio.destacado ? '✅' : '❌'}`)
      console.log(`   • Orden: ${servicio.orden}`)

      // Analizar características
      console.log(`\n🎯 Características (${servicio.caracteristicas?.length || 0}):`)
      servicio.caracteristicas?.forEach((carac, index) => {
        console.log(`   ${index + 1}. ${carac}`)
      })

      // Analizar capacidades
      console.log(`\n💪 Capacidades (${servicio.capacidades?.length || 0}):`)
      servicio.capacidades?.forEach((cap, index) => {
        console.log(`   ${index + 1}. ${cap}`)
      })

      // Analizar contenido técnico JSON
      console.log(`\n🔬 Contenido Técnico Disponible:`)
      const camposJson = ['tecnologias', 'equipamiento', 'equipos', 'metodologia', 'certificaciones', 'normativas', 'seguridad', 'ventajas']
      
      for (const campo of camposJson) {
        const valor = (servicio as any)[campo]
        if (valor && typeof valor === 'object') {
          console.log(`   ✅ ${campo.toUpperCase()}: ${JSON.stringify(valor).substring(0, 100)}...`)
        } else {
          console.log(`   ❌ ${campo.toUpperCase()}: No definido`)
        }
      }

      // Expertise
      console.log(`\n🎓 Expertise:`)
      console.log(`   • Título: ${servicio.expertiseTitulo || 'No definido'}`)
      console.log(`   • Descripción: ${servicio.expertiseDescripcion || 'No definido'}`)

      // SEO
      console.log(`\n🔍 SEO:`)
      console.log(`   • Meta Title: ${servicio.metaTitle || 'No definido'}`)
      console.log(`   • Meta Description: ${servicio.metaDescription || 'No definido'}`)

      console.log(`\n📈 ANÁLISIS Y RECOMENDACIONES:`)
      console.log(`   Fortalezas: ${analisis.fortalezas.length}`)
      console.log(`   Debilidades: ${analisis.debilidades.length}`)
      console.log(`   Contenido técnico disponible: ${analisis.contenidoTecnicoDisponible.length}`)
      console.log(`   Contenido técnico faltante: ${analisis.contenidoTecnicoFaltante.length}`)
    }

    // Generar reporte consolidado
    console.log('\n\n🎯 REPORTE CONSOLIDADO DE ANÁLISIS')
    console.log('═'.repeat(80))

    // Estadísticas generales
    const totalCaracteristicas = servicios.reduce((acc, s) => acc + (s.caracteristicas?.length || 0), 0)
    const totalCapacidades = servicios.reduce((acc, s) => acc + (s.capacidades?.length || 0), 0)
    const serviciosConTecnologias = servicios.filter(s => s.tecnologias).length
    const serviciosConEquipamiento = servicios.filter(s => s.equipamiento || s.equipos).length
    const serviciosConMetodologia = servicios.filter(s => s.metodologia).length

    console.log(`\n📊 ESTADÍSTICAS GENERALES:`)
    console.log(`   • Total servicios activos: ${servicios.length}`)
    console.log(`   • Promedio características por servicio: ${(totalCaracteristicas / servicios.length).toFixed(1)}`)
    console.log(`   • Promedio capacidades por servicio: ${(totalCapacidades / servicios.length).toFixed(1)}`)
    console.log(`   • Servicios con tecnologías definidas: ${serviciosConTecnologias}/${servicios.length} (${((serviciosConTecnologias/servicios.length)*100).toFixed(1)}%)`)
    console.log(`   • Servicios con equipamiento definido: ${serviciosConEquipamiento}/${servicios.length} (${((serviciosConEquipamiento/servicios.length)*100).toFixed(1)}%)`)
    console.log(`   • Servicios con metodología definida: ${serviciosConMetodologia}/${servicios.length} (${((serviciosConMetodologia/servicios.length)*100).toFixed(1)}%)`)

    // Identificar patrones y oportunidades
    console.log(`\n🎯 OPORTUNIDADES DE MEJORA GENERALES:`)
    const oportunidades = identificarOportunidadesGenerales(analisisCompleto)
    oportunidades.forEach((oportunidad, index) => {
      console.log(`   ${index + 1}. ${oportunidad}`)
    })

    // Propuesta de estructura técnica
    console.log(`\n🏗️ ESTRUCTURA TÉCNICA PROPUESTA PARA PÁGINAS DE SERVICIOS:`)
    const estructuraBase = generarEstructuraBasePaginas()
    estructuraBase.forEach((seccion, index) => {
      console.log(`   ${index + 1}. ${seccion.nombre} (${seccion.prioridad})`)
      console.log(`      ${seccion.descripcion}`)
    })

    // Generar recomendaciones específicas por servicio
    console.log(`\n\n📋 RECOMENDACIONES ESPECÍFICAS POR SERVICIO:`)
    console.log('═'.repeat(80))

    for (const analisis of analisisCompleto) {
      console.log(`\n🔧 ${analisis.servicio.nombre.toUpperCase()}:`)
      console.log(`   Prioridad de mejora: ${calcularPrioridadMejora(analisis)}`)
      console.log(`   Recomendaciones principales:`)
      analisis.recomendaciones.slice(0, 3).forEach((rec, index) => {
        console.log(`     ${index + 1}. ${rec}`)
      })
    }

    return {
      servicios,
      analisisCompleto,
      estadisticas: {
        total: servicios.length,
        promedioCaracteristicas: totalCaracteristicas / servicios.length,
        promedioCapacidades: totalCapacidades / servicios.length,
        conTecnologias: serviciosConTecnologias,
        conEquipamiento: serviciosConEquipamiento,
        conMetodologia: serviciosConMetodologia
      }
    }

  } catch (error) {
    console.error('❌ Error al analizar servicios:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

function analizarServicioIndividual(servicio: ServicioCompleto): AnalisisServicio {
  const fortalezas: string[] = []
  const debilidades: string[] = []
  const contenidoTecnicoDisponible: string[] = []
  const contenidoTecnicoFaltante: string[] = []
  const recomendaciones: string[] = []

  // Evaluar fortalezas
  if (servicio.caracteristicas && servicio.caracteristicas.length > 0) {
    fortalezas.push(`Tiene ${servicio.caracteristicas.length} características definidas`)
  }
  if (servicio.capacidades && servicio.capacidades.length > 0) {
    fortalezas.push(`Tiene ${servicio.capacidades.length} capacidades listadas`)
  }
  if (servicio.tecnologias) {
    fortalezas.push('Tecnologías especificadas')
    contenidoTecnicoDisponible.push('Tecnologías')
  }
  if (servicio.equipamiento || servicio.equipos) {
    fortalezas.push('Equipamiento documentado')
    contenidoTecnicoDisponible.push('Equipamiento')
  }
  if (servicio.metodologia) {
    fortalezas.push('Metodología definida')
    contenidoTecnicoDisponible.push('Metodología')
  }

  // Evaluar debilidades
  if (!servicio.metaTitle) {
    debilidades.push('Sin meta título para SEO')
  }
  if (!servicio.metaDescription) {
    debilidades.push('Sin meta descripción para SEO')
  }
  if (!servicio.expertiseTitulo || !servicio.expertiseDescripcion) {
    debilidades.push('Sección de expertise incompleta')
  }
  if (!servicio.imagen) {
    debilidades.push('Sin imagen principal del servicio')
  }

  // Identificar contenido técnico faltante
  const camposTecnicos = ['tecnologias', 'equipamiento', 'equipos', 'metodologia', 'certificaciones', 'normativas', 'seguridad', 'ventajas']
  for (const campo of camposTecnicos) {
    if (!(servicio as any)[campo]) {
      contenidoTecnicoFaltante.push(campo)
    }
  }

  // Generar recomendaciones
  if (contenidoTecnicoFaltante.length > 0) {
    recomendaciones.push(`Completar campos técnicos: ${contenidoTecnicoFaltante.join(', ')}`)
  }
  if (!servicio.metaTitle || !servicio.metaDescription) {
    recomendaciones.push('Optimizar metadatos para SEO')
  }
  if (servicio.caracteristicas && servicio.caracteristicas.length < 5) {
    recomendaciones.push('Ampliar lista de características técnicas')
  }
  if (servicio.capacidades && servicio.capacidades.length < 3) {
    recomendaciones.push('Detallar más capacidades específicas')
  }

  const estructuraPageSugerida = generarEstructuraPaginaServicio(servicio)

  return {
    servicio,
    fortalezas,
    debilidades,
    contenidoTecnicoDisponible,
    contenidoTecnicoFaltante,
    recomendaciones,
    estructuraPageSugerida
  }
}

function identificarOportunidadesGenerales(analisis: AnalisisServicio[]): string[] {
  const oportunidades: string[] = []

  // Análisis de patrones comunes
  const serviciosSinMetodologia = analisis.filter(a => a.contenidoTecnicoFaltante.includes('metodologia')).length
  const serviciosSinCertificaciones = analisis.filter(a => a.contenidoTecnicoFaltante.includes('certificaciones')).length
  const serviciosSinNormativas = analisis.filter(a => a.contenidoTecnicoFaltante.includes('normativas')).length

  if (serviciosSinMetodologia > analisis.length * 0.5) {
    oportunidades.push(`${serviciosSinMetodologia} servicios necesitan metodología documentada`)
  }
  if (serviciosSinCertificaciones > analisis.length * 0.5) {
    oportunidades.push(`${serviciosSinCertificaciones} servicios necesitan certificaciones especificadas`)
  }
  if (serviciosSinNormativas > analisis.length * 0.5) {
    oportunidades.push(`${serviciosSinNormativas} servicios necesitan normativas técnicas`)
  }

  oportunidades.push('Crear plantillas de contenido técnico estándar')
  oportunidades.push('Implementar casos de estudio por servicio')
  oportunidades.push('Desarrollar calculadoras/herramientas por servicio')
  oportunidades.push('Crear comparadores de tecnologías')

  return oportunidades
}

function generarEstructuraBasePaginas() {
  return [
    {
      nombre: 'Hero Section con valor diferencial',
      descripcion: 'Título, subtítulo, beneficio principal y CTA',
      prioridad: 'alta'
    },
    {
      nombre: 'Descripción técnica del servicio',
      descripcion: 'Explicación detallada del servicio y aplicaciones',
      prioridad: 'alta'
    },
    {
      nombre: 'Metodología paso a paso',
      descripcion: 'Proceso técnico documentado con fases',
      prioridad: 'alta'
    },
    {
      nombre: 'Tecnologías y equipamiento',
      descripcion: 'Lista detallada de tecnologías y equipos utilizados',
      prioridad: 'alta'
    },
    {
      nombre: 'Capacidades técnicas',
      descripcion: 'Especificaciones técnicas y rangos de trabajo',
      prioridad: 'media'
    },
    {
      nombre: 'Certificaciones y normativas',
      descripcion: 'Estándares de calidad y certificaciones aplicables',
      prioridad: 'media'
    },
    {
      nombre: 'Casos de éxito',
      descripcion: 'Proyectos destacados con este servicio',
      prioridad: 'media'
    },
    {
      nombre: 'Ventajas competitivas',
      descripcion: 'Diferenciadores vs competencia',
      prioridad: 'media'
    },
    {
      nombre: 'Herramientas y calculadoras',
      descripcion: 'Tools interactivas para el servicio',
      prioridad: 'baja'
    },
    {
      nombre: 'FAQ técnicas',
      descripcion: 'Preguntas frecuentes técnicas',
      prioridad: 'baja'
    }
  ]
}

function generarEstructuraPaginaServicio(servicio: ServicioCompleto) {
  const estructura = [
    {
      seccion: 'Hero Section',
      contenido: `Título: ${servicio.titulo || servicio.nombre}, Valor diferencial principal`,
      prioridad: 'alta' as const
    },
    {
      seccion: 'Descripción Técnica',
      contenido: 'Ampliar descripción actual con detalles técnicos y aplicaciones',
      prioridad: 'alta' as const
    },
    {
      seccion: 'Metodología',
      contenido: servicio.metodologia ? 'Expandir metodología existente' : 'Crear metodología paso a paso',
      prioridad: 'alta' as const
    },
    {
      seccion: 'Tecnologías',
      contenido: servicio.tecnologias ? 'Detallar tecnologías existentes' : 'Documentar tecnologías utilizadas',
      prioridad: 'alta' as const
    },
    {
      seccion: 'Equipamiento',
      contenido: servicio.equipamiento || servicio.equipos ? 'Expandir información de equipos' : 'Listar equipamiento especializado',
      prioridad: 'media' as const
    },
    {
      seccion: 'Capacidades',
      contenido: `Expandir las ${servicio.capacidades?.length || 0} capacidades actuales`,
      prioridad: 'media' as const
    }
  ]

  return estructura
}

function calcularPrioridadMejora(analisis: AnalisisServicio): string {
  const puntaje = analisis.contenidoTecnicoFaltante.length * 2 + analisis.debilidades.length
  
  if (puntaje >= 8) return 'ALTA'
  if (puntaje >= 5) return 'MEDIA'
  return 'BAJA'
}

// Ejecutar análisis
analizarServiciosCompleto()
  .then(resultado => {
    console.log('\n✅ Análisis completado exitosamente!')
    console.log(`📊 ${resultado.servicios.length} servicios analizados`)
  })
  .catch(error => {
    console.error('❌ Error en el análisis:', error)
    process.exit(1)
  })