import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearOldData() {
  try {
    console.log('=== PASO 1: Limpiar datos antiguos antes de migración ===\n')

    // Eliminar registros de CategoriaProyecto (son solo metadata, se pueden recrear)
    const deletedCategorias = await prisma.categoriaProyecto.deleteMany({})
    console.log(`✓ Eliminadas ${deletedCategorias.count} categorías antiguas`)

    // Los ProyectoHojaVida no tienen categoria todavía, así que no hay que limpiar nada
    console.log('✓ ProyectoHojaVida no requiere limpieza (no tiene campo categoria aún)')

    // Verificar proyectos detallados que usan categoría
    const proyectosDetallados = await prisma.proyecto.count()
    console.log(`\n⚠️  Hay ${proyectosDetallados} proyectos detallados que usan categorías`)
    console.log('   Estos se migrarán automáticamente después del schema update')

    console.log('\n✅ Limpieza completada. Ahora puedes ejecutar: npx prisma db push')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearOldData()
