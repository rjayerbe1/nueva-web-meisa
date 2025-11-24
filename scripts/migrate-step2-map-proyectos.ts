import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de categorías viejas a nuevas
const categoriaMapping: Record<string, string> = {
  'COMERCIAL': 'COMERCIAL',
  'EDIFICACIONES': 'EDIFICACIONES',
  'INDUSTRIA': 'INDUSTRIAL',
  'PUENTES_VEHICULARES': 'PUENTES',
  'PUENTES_PEATONALES': 'PUENTES',
  'ESCENARIOS_DEPORTIVOS': 'DEPORTES_EDUCACION',
  'CUBIERTAS_Y_FACHADAS': 'EDIFICACIONES',
  'ESTRUCTURAS_MODULARES': 'INDUSTRIAL',
  'OTRO': 'INFRAESTRUCTURA_URBANA'
}

async function analyzeProyectos() {
  try {
    console.log('=== PASO 2: Analizar proyectos detallados ===\n')

    // Obtener todos los proyectos y agrupar por categoría
    const proyectos = await prisma.$queryRaw<Array<{categoria: string, count: bigint}>>`
      SELECT categoria, COUNT(*) as count
      FROM proyectos
      GROUP BY categoria
      ORDER BY count DESC
    `

    console.log('Distribución de proyectos por categoría antigua:')
    proyectos.forEach(p => {
      const nuevaCategoria = categoriaMapping[p.categoria] || 'DESCONOCIDA'
      console.log(`  ${p.categoria} (${p.count}) → ${nuevaCategoria}`)
    })

    console.log('\n⚠️  IMPORTANTE: Los proyectos detallados (Proyecto) necesitan ser migrados manualmente')
    console.log('   porque PostgreSQL no permite cambiar valores de enum automáticamente.')
    console.log('\n📋 Opciones:')
    console.log('   1. Usar SQL directo para mapear valores antiguos a nuevos')
    console.log('   2. Crear una columna temporal, migrar datos, eliminar la antigua')
    console.log('\nRecomendación: Usar SQL directo en el siguiente paso')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeProyectos()
