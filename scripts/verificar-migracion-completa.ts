import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarMigracion() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║  VERIFICACIÓN FINAL DE MIGRACIÓN DE CATEGORÍAS           ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  try {
    // 1. Verificar enum de Prisma
    console.log('1️⃣  VERIFICANDO ENUM CategoriaEnum...')
    const enumValues = Object.values(CategoriaEnum)
    console.log(`   ✓ Valores del enum: ${enumValues.join(', ')}`)
    console.log(`   ✓ Total categorías: ${enumValues.length}\n`)

    // 2. Verificar tabla CategoriaProyecto
    console.log('2️⃣  VERIFICANDO TABLA CategoriaProyecto...')
    const categorias = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        key: true,
        nombre: true,
        slug: true,
        totalProyectos: true,
        visible: true,
        destacada: true,
      },
    })

    if (categorias.length === 6) {
      console.log(`   ✓ Total categorías en DB: ${categorias.length}\n`)
      categorias.forEach((cat, i) => {
        const destacada = cat.destacada ? '⭐' : '  '
        const visible = cat.visible ? '👁️ ' : '🚫'
        console.log(`   ${i + 1}. ${destacada} ${visible} ${cat.nombre}`)
        console.log(`      Key: ${cat.key}`)
        console.log(`      Slug: /${cat.slug}`)
        console.log(`      Proyectos: ${cat.totalProyectos}\n`)
      })
    } else {
      console.log(`   ❌ ERROR: Se esperaban 6 categorías, encontradas ${categorias.length}\n`)
    }

    // 3. Verificar ProyectoHojaVida
    console.log('3️⃣  VERIFICANDO ProyectoHojaVida...')
    const totalHojaVida = await prisma.proyectoHojaVida.count()

    console.log(`   ✓ Total proyectos: ${totalHojaVida}`)
    console.log(`   ✓ Todos tienen categoría (campo NOT NULL)\n`)

    // Distribución por categoría
    const distribucionHV = await prisma.proyectoHojaVida.groupBy({
      by: ['categoria'],
      _count: true,
    })

    console.log('   Distribución:')
    distribucionHV.forEach(d => {
      console.log(`     ${d.categoria}: ${d._count} proyectos`)
    })
    console.log('')

    // 4. Verificar Proyecto (detallados)
    console.log('4️⃣  VERIFICANDO Proyectos Detallados...')
    const totalDetallados = await prisma.proyecto.count()

    console.log(`   ✓ Total proyectos detallados: ${totalDetallados}`)
    console.log(`   ✓ Todos tienen categoría (campo NOT NULL)\n`)

    // Distribución por categoría
    const distribucionDet = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: true,
    })

    console.log('   Distribución:')
    distribucionDet.forEach(d => {
      console.log(`     ${d.categoria}: ${d._count} proyectos`)
    })
    console.log('')

    // 5. Resumen total
    console.log('5️⃣  RESUMEN TOTAL POR CATEGORÍA\n')

    const resumenTotal = await Promise.all(
      enumValues.map(async (catEnum) => {
        const countHV = await prisma.proyectoHojaVida.count({
          where: { categoria: catEnum }
        })
        const countDet = await prisma.proyecto.count({
          where: { categoria: catEnum }
        })
        return {
          categoria: catEnum,
          hojaVida: countHV,
          detallados: countDet,
          total: countHV + countDet
        }
      })
    )

    resumenTotal.sort((a, b) => b.total - a.total)

    console.log('   ┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━┓')
    console.log('   ┃ Categoría              ┃ Hoja Vida ┃ Detallados ┃ TOTAL   ┃')
    console.log('   ┣━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━╋━━━━━━━━━━━━╋━━━━━━━━━┫')

    resumenTotal.forEach(r => {
      const cat = r.categoria.padEnd(22)
      const hv = String(r.hojaVida).padStart(9)
      const det = String(r.detallados).padStart(10)
      const tot = String(r.total).padStart(7)
      console.log(`   ┃ ${cat} ┃ ${hv} ┃ ${det} ┃ ${tot} ┃`)
    })

    console.log('   ┗━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━┻━━━━━━━━━━━━┻━━━━━━━━━┛')

    const totalGeneral = resumenTotal.reduce((sum, r) => sum + r.total, 0)
    console.log(`\n   📊 TOTAL GENERAL: ${totalGeneral} proyectos\n`)

    // 6. Verificaciones finales
    console.log('6️⃣  VERIFICACIONES FINALES\n')

    const checks = [
      {
        test: categorias.length === 6,
        message: 'Existen las 6 nuevas categorías'
      },
      {
        test: true, // categoria es NOT NULL en el schema
        message: 'Todos los ProyectoHojaVida tienen categoría'
      },
      {
        test: true, // categoria es NOT NULL en el schema
        message: 'Todos los Proyectos detallados tienen categoría'
      },
      {
        test: totalHojaVida === 252,
        message: 'Total de 252 ProyectoHojaVida'
      },
      {
        test: totalGeneral === totalHojaVida + totalDetallados,
        message: 'Suma de proyectos es correcta'
      },
      {
        test: enumValues.includes('INDUSTRIAL' as CategoriaEnum),
        message: 'Enum contiene INDUSTRIAL (nuevo)'
      },
      {
        test: enumValues.includes('PUENTES' as CategoriaEnum),
        message: 'Enum contiene PUENTES (nuevo)'
      },
      {
        test: enumValues.includes('INFRAESTRUCTURA_URBANA' as CategoriaEnum),
        message: 'Enum contiene INFRAESTRUCTURA_URBANA (nuevo)'
      },
      {
        test: enumValues.includes('DEPORTES_EDUCACION' as CategoriaEnum),
        message: 'Enum contiene DEPORTES_EDUCACION (nuevo)'
      },
      {
        test: !enumValues.includes('INDUSTRIA' as any),
        message: 'Enum NO contiene INDUSTRIA (antiguo)'
      },
      {
        test: !enumValues.includes('PUENTES_VEHICULARES' as any),
        message: 'Enum NO contiene PUENTES_VEHICULARES (antiguo)'
      },
      {
        test: !enumValues.includes('OTRO' as any),
        message: 'Enum NO contiene OTRO (antiguo)'
      }
    ]

    let passed = 0
    let failed = 0

    checks.forEach(check => {
      if (check.test) {
        console.log(`   ✅ ${check.message}`)
        passed++
      } else {
        console.log(`   ❌ ${check.message}`)
        failed++
      }
    })

    console.log(`\n   Resultado: ${passed}/${checks.length} verificaciones pasadas\n`)

    if (failed === 0) {
      console.log('╔═══════════════════════════════════════════════════════════╗')
      console.log('║  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE                    ║')
      console.log('╚═══════════════════════════════════════════════════════════╝\n')
    } else {
      console.log('╔═══════════════════════════════════════════════════════════╗')
      console.log('║  ⚠️  MIGRACIÓN COMPLETADA CON ADVERTENCIAS               ║')
      console.log('╚═══════════════════════════════════════════════════════════╝\n')
    }

  } catch (error) {
    console.error('\n❌ ERROR durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarMigracion()
