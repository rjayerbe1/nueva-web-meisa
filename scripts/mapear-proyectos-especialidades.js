const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const proyectosCompletos = require('../proyectos-completos.json')

// Mapeo de palabras clave para categorizar proyectos
const KEYWORDS_CATEGORIAS = {
  comercial: ['dollar', 'comercial', 'super', 'tienda', 'local', 'centro comercial', 'cc ', 'mall'],
  industrial: ['bodega', 'planta', 'industrial', 'hangar', 'ingenio', 'farmacéutica', 'tecnoquímicas', 'postobón', 'distribución', 'cuarto frío'],
  puentes: ['puente'],
  infraestructura: ['ciclo', 'estacion', 'terminal', 'transmilenio', 'transporte'],
  edificaciones: ['edificio', 'ampliacion', 'parqueadero', 'piso', 'sede'],
  deportes: ['coliseo', 'cancha', 'estadio', 'deportivo', 'complejo acuático', 'piscina', 'gradería']
}

// Categorizar proyecto por keywords
function categorizarProyecto(proyecto) {
  const texto = (proyecto.objetoContrato + ' ' + proyecto.tituloDisplay + ' ' + (proyecto.descripcionSecundaria || '')).toLowerCase()

  for (const [categoria, keywords] of Object.entries(KEYWORDS_CATEGORIAS)) {
    for (const keyword of keywords) {
      if (texto.includes(keyword)) {
        return categoria
      }
    }
  }

  return 'otros'
}

async function analizarProyectosEspecialidades() {
  try {
    console.log('\n' + '='.repeat(100))
    console.log('ANÁLISIS COMPLETO: PROYECTOS POR CATEGORÍA Y ESPECIALIDAD')
    console.log('='.repeat(100) + '\n')

    // Obtener categorías con especialidades
    const categorias = await prisma.categoriaProyecto.findMany({
      where: {
        slug: {
          in: ['comercial', 'industrial', 'puentes', 'infraestructura-urbana', 'edificaciones', 'deportes-educacion']
        }
      },
      orderBy: { orden: 'asc' }
    })

    // Agrupar proyectos por categoría
    const proyectosPorCategoria = {
      comercial: [],
      industrial: [],
      puentes: [],
      infraestructura: [],
      edificaciones: [],
      deportes: [],
      otros: []
    }

    proyectosCompletos.forEach(p => {
      const cat = categorizarProyecto(p)
      proyectosPorCategoria[cat].push(p)
    })

    let totalProyectosAsignados = 0
    let totalEspecialidadesSinProyectos = 0

    // Analizar cada categoría
    for (const categoria of categorias) {
      const slugMap = {
        'comercial': 'comercial',
        'industrial': 'industrial',
        'puentes': 'puentes',
        'infraestructura-urbana': 'infraestructura',
        'edificaciones': 'edificaciones',
        'deportes-educacion': 'deportes'
      }

      const categoriaKey = slugMap[categoria.slug]
      const proyectos = proyectosPorCategoria[categoriaKey] || []
      const especialidades = categoria.especialidades || []

      console.log('┌' + '─'.repeat(98) + '┐')
      console.log(`│ ${categoria.nombre.toUpperCase().padEnd(96)} │`)
      console.log('├' + '─'.repeat(98) + '┤')
      console.log(`│ Total de proyectos reales: ${proyectos.length.toString().padEnd(80)} │`)
      console.log(`│ Total de especialidades: ${especialidades.length.toString().padEnd(82)} │`)
      console.log('└' + '─'.repeat(98) + '┘\n')

      // Listar todos los proyectos de la categoría
      console.log(`📁 PROYECTOS REALES EN ${categoria.nombre.toUpperCase()} (${proyectos.length}):\n`)

      if (proyectos.length > 0) {
        proyectos.forEach((p, idx) => {
          const peso = parseInt(p.pesoKg) / 1000
          const area = p.areaM2 ? `${p.areaM2} m²` : 'N/A'
          console.log(`   ${(idx + 1).toString().padStart(2, ' ')}. ${p.tituloDisplay}`)
          console.log(`       Cliente: ${p.entidadContratante || 'N/A'}`)
          console.log(`       Descripción: ${p.objetoContrato}`)
          console.log(`       📊 ${peso.toFixed(1)} ton, ${area}`)
          console.log('')
        })
      } else {
        console.log('   ⚠️  NO HAY PROYECTOS REALES EN ESTA CATEGORÍA\n')
      }

      console.log('─'.repeat(100) + '\n')

      // Analizar especialidades
      console.log(`🎯 ESPECIALIDADES DE ${categoria.nombre.toUpperCase()}:\n`)

      if (especialidades.length === 0) {
        console.log('   ⚠️  NO HAY ESPECIALIDADES DEFINIDAS\n')
        continue
      }

      especialidades.forEach((esp, idx) => {
        console.log(`   ${idx + 1}. ${esp.titulo}`)

        // Intentar asignar proyectos a esta especialidad
        const proyectosAsignados = asignarProyectosAEspecialidad(esp, proyectos)

        if (proyectosAsignados.length > 0) {
          console.log(`      ✅ ${proyectosAsignados.length} proyecto(s) asignado(s):`)
          proyectosAsignados.slice(0, 3).forEach(p => {
            const peso = parseInt(p.pesoKg) / 1000
            console.log(`         • ${p.tituloDisplay} (${peso.toFixed(1)} ton)`)
          })
          if (proyectosAsignados.length > 3) {
            console.log(`         ... y ${proyectosAsignados.length - 3} más`)
          }
          totalProyectosAsignados += proyectosAsignados.length
        } else {
          console.log(`      ❌ NO HAY PROYECTOS REALES que encajen`)
          totalEspecialidadesSinProyectos++
        }

        console.log('')
      })

      console.log('\n' + '='.repeat(100) + '\n')
    }

    // Resumen final
    console.log('┌' + '─'.repeat(98) + '┐')
    console.log(`│ ${'RESUMEN GLOBAL'.padEnd(96)} │`)
    console.log('├' + '─'.repeat(98) + '┤')
    console.log(`│ Total de proyectos analizados: ${proyectosCompletos.length.toString().padEnd(74)} │`)
    console.log(`│ Proyectos sin categoría clara: ${proyectosPorCategoria.otros.length.toString().padEnd(74)} │`)
    console.log(`│ Especialidades analizadas: ${categorias.reduce((sum, c) => sum + (c.especialidades?.length || 0), 0).toString().padEnd(77)} │`)
    console.log(`│ Especialidades SIN proyectos: ${totalEspecialidadesSinProyectos.toString().padEnd(76)} │`)
    console.log('└' + '─'.repeat(98) + '┘\n')

    if (totalEspecialidadesSinProyectos > 0) {
      console.log('⚠️  ACCIÓN REQUERIDA:')
      console.log(`   ${totalEspecialidadesSinProyectos} especialidades NO tienen proyectos reales asignados.`)
      console.log('   Estas especialidades deben ser ELIMINADAS o RENOMBRADAS.\n')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Función para asignar proyectos a especialidad basada en keywords
function asignarProyectosAEspecialidad(especialidad, proyectos) {
  const tituloLower = especialidad.titulo.toLowerCase()
  const asignados = []

  // Keywords específicas por tipo de especialidad
  const keywords = extraerKeywords(tituloLower)

  proyectos.forEach(p => {
    const textoProyecto = (p.objetoContrato + ' ' + p.tituloDisplay + ' ' + (p.descripcionSecundaria || '')).toLowerCase()

    // Verificar si alguna keyword coincide
    for (const keyword of keywords) {
      if (textoProyecto.includes(keyword)) {
        asignados.push(p)
        break
      }
    }
  })

  return asignados
}

function extraerKeywords(tituloEspecialidad) {
  const keywordMap = {
    // COMERCIAL
    'gran luz': ['centro comercial', 'cc ', 'mall', 'supermercado', 'hipermercado'],
    'cubierta': ['cubierta', 'techo', 'standing seam'],
    'entrepiso': ['mezanine', 'entrepiso', 'segundo nivel', 'piso'],
    'mezanine': ['mezanine', 'entrepiso'],
    'ampliacion': ['ampliacion', 'expansion'],
    'fachada': ['fachada', 'envolvente'],

    // INDUSTRIAL
    'bodega': ['bodega', 'almacen', 'distribucion'],
    'farmacéutica': ['farmaceutica', 'tecnoquimicas', 'tecnofar'],
    'ingenio': ['ingenio', 'azucar', 'sucroal'],
    'cuarto frío': ['cuarto frio', 'refrigerado'],
    'hangar': ['hangar', 'aeropuerto'],
    'puente grúa': ['puente grua'],

    // PUENTES
    'puente': ['puente'],
    'peatonal': ['peatonal', 'ciclo'],
    'vehicular': ['vehicular'],
    'arco': ['arco'],
    'colgante': ['colgante'],

    // INFRAESTRUCTURA
    'ciclopuente': ['ciclopuente', 'ciclo'],
    'estacion': ['estacion', 'transmilenio'],
    'terminal': ['terminal', 'transporte'],

    // EDIFICACIONES
    'edificio': ['edificio'],
    'institucional': ['institucional', 'administrativo', 'sede'],
    'parqueadero': ['parqueadero', 'parking'],
    'cultural': ['cultural', 'museo'],
    'educativo': ['colegio', 'universidad', 'educativo'],
    'ampliacion': ['ampliacion'],

    // DEPORTES
    'coliseo': ['coliseo'],
    'cubierta': ['cubierta'],
    'gradería': ['graderia'],
    'iluminacion': ['iluminacion', 'torre'],
    'piscina': ['piscina', 'acuatico'],
    'tensionada': ['tensionada', 'membrana']
  }

  // Buscar keywords que coincidan con el título
  const keywords = []
  for (const [key, values] of Object.entries(keywordMap)) {
    if (tituloEspecialidad.includes(key)) {
      keywords.push(...values)
    }
  }

  // Si no hay keywords específicas, usar el título mismo
  if (keywords.length === 0) {
    keywords.push(...tituloEspecialidad.split(' ').filter(w => w.length > 3))
  }

  return keywords
}

analizarProyectosEspecialidades()
