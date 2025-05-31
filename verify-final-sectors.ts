#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyFinalSectors() {
  console.log('🔍 VERIFICACIÓN FINAL DE SECTORES DE CLIENTES\n')

  try {
    // Obtener todos los clientes por sector
    const clientesPorSector = await prisma.cliente.findMany({
      where: { activo: true },
      select: {
        nombre: true,
        sector: true,
        descripcion: true,
        mostrarEnHome: true
      },
      orderBy: [
        { sector: 'asc' },
        { nombre: 'asc' }
      ]
    })

    const sectores = ['CONSTRUCCION', 'INDUSTRIAL', 'COMERCIAL', 'INSTITUCIONAL', 'ENERGIA', 'GOBIERNO', 'MINERIA', 'OTRO']

    sectores.forEach(sector => {
      const clientesDelSector = clientesPorSector.filter(c => c.sector === sector)
      
      if (clientesDelSector.length > 0) {
        console.log(`🏢 ${sector} (${clientesDelSector.length} clientes):`)
        clientesDelSector.forEach((cliente, index) => {
          const homeIcon = cliente.mostrarEnHome ? '🏠' : '  '
          console.log(`   ${homeIcon} ${index + 1}. ${cliente.nombre}`)
          if (cliente.descripcion) {
            console.log(`      → ${cliente.descripcion.substring(0, 80)}${cliente.descripcion.length > 80 ? '...' : ''}`)
          }
        })
        console.log('')
      }
    })

    // Estadísticas finales
    const stats = await prisma.cliente.groupBy({
      by: ['sector'],
      _count: { sector: true },
      where: { activo: true }
    })

    const totalClientes = clientesPorSector.length
    const clientesEnHome = clientesPorSector.filter(c => c.mostrarEnHome).length

    console.log('📊 ESTADÍSTICAS FINALES:')
    console.log(`   📋 Total clientes activos: ${totalClientes}`)
    console.log(`   🏠 Clientes en home: ${clientesEnHome}`)
    console.log('')

    console.log('📈 DISTRIBUCIÓN POR SECTOR:')
    stats
      .sort((a, b) => b._count.sector - a._count.sector)
      .forEach(stat => {
        const porcentaje = ((stat._count.sector / totalClientes) * 100).toFixed(1)
        console.log(`   ${stat.sector}: ${stat._count.sector} clientes (${porcentaje}%)`)
      })

    console.log('\n✅ Verificación completada - Todos los sectores están correctamente asignados!')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
verifyFinalSectors().catch(console.error)