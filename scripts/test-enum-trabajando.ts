import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

async function testEnum() {
  console.log('=== PROBANDO NUEVO ENUM ===\n')

  try {
    // Test 1: Ver valores del enum
    console.log('1. Valores del enum CategoriaEnum:')
    console.log(Object.values(CategoriaEnum))
    console.log('')

    // Test 2: Buscar proyectos por cada categoría
    console.log('2. Buscando proyectos por categoría...\n')

    for (const cat of Object.values(CategoriaEnum)) {
      const count = await prisma.proyecto.count({
        where: { categoria: cat }
      })
      console.log(`   ${cat}: ${count} proyectos`)
    }

    console.log('')

    // Test 3: Buscar un proyecto con DEPORTES_EDUCACION
    console.log('3. Buscando proyecto con DEPORTES_EDUCACION...')
    const proyectoDeportes = await prisma.proyecto.findFirst({
      where: { categoria: CategoriaEnum.DEPORTES_EDUCACION },
      select: {
        titulo: true,
        categoria: true,
      }
    })

    if (proyectoDeportes) {
      console.log(`   ✓ Encontrado: ${proyectoDeportes.titulo}`)
      console.log(`   ✓ Categoría: ${proyectoDeportes.categoria}`)
    } else {
      console.log('   - No hay proyectos detallados en DEPORTES_EDUCACION')
    }

    console.log('')

    // Test 4: findMany como en la página
    console.log('4. Test de findMany (como en página de proyectos)...')
    const proyectos = await prisma.proyecto.findMany({
      where: { visible: true },
      take: 5,
      select: {
        id: true,
        titulo: true,
        categoria: true,
      }
    })

    console.log(`   ✓ Encontrados ${proyectos.length} proyectos`)
    proyectos.forEach(p => {
      console.log(`     - ${p.titulo} [${p.categoria}]`)
    })

    console.log('\n✅ ENUM FUNCIONANDO CORRECTAMENTE\n')

  } catch (error) {
    console.error('\n❌ ERROR:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEnum()
