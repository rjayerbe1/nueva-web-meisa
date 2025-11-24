import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

async function actualizarContadores() {
  try {
    console.log('=== ACTUALIZANDO CONTADORES DE CATEGORÍAS ===\n')

    // Obtener todas las categorías
    const categorias = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
    })

    console.log('Calculando contadores...\n')

    for (const categoria of categorias) {
      // Contar ProyectoHojaVida
      const countHojaVida = await prisma.proyectoHojaVida.count({
        where: { categoria: categoria.key },
      })

      // Contar Proyecto (proyectos detallados)
      const countDetallados = await prisma.proyecto.count({
        where: { categoria: categoria.key },
      })

      // Total
      const total = countHojaVida + countDetallados

      // Actualizar
      await prisma.categoriaProyecto.update({
        where: { id: categoria.id },
        data: { totalProyectos: total },
      })

      console.log(`✓ ${categoria.nombre}:`)
      console.log(`    ProyectoHojaVida: ${countHojaVida}`)
      console.log(`    Proyectos detallados: ${countDetallados}`)
      console.log(`    TOTAL: ${total}\n`)
    }

    // Resumen final
    const resumen = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' },
      select: {
        nombre: true,
        totalProyectos: true,
        destacada: true,
      },
    })

    console.log('📊 RESUMEN FINAL:\n')
    let totalGeneral = 0
    resumen.forEach((cat) => {
      const icono = cat.destacada ? '⭐' : '  '
      console.log(`  ${icono} ${cat.nombre}: ${cat.totalProyectos} proyectos`)
      totalGeneral += cat.totalProyectos
    })
    console.log(`\n  TOTAL GENERAL: ${totalGeneral} proyectos`)

    console.log('\n✅ Contadores actualizados correctamente')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

actualizarContadores()
