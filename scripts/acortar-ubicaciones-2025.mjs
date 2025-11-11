/**
 * Script para acortar ubicaciones de proyectos 2025
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de ubicaciones largas a versiones cortas
const ubicacionesCortas = {
  'Villa Rica-Cauca': 'Villa Rica',
  'Cali-Valle': 'Cali',
  'Santander de Quilichao-Cauca': 'S. de Quilichao',
  'Bogotá-Cundinamarca': 'Bogotá',
  'Bogotá D.C.': 'Bogotá',
}

async function acortarUbicaciones2025() {
  console.log('✂️  Acortando ubicaciones de proyectos 2025...\n')

  // Obtener todos los proyectos de 2025
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-12-31')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let sinCambios = 0

  for (const proyecto of proyectos) {
    const ubicacionCorta = ubicacionesCortas[proyecto.ubicacion]

    if (ubicacionCorta) {
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          ubicacion: ubicacionCorta
        }
      })

      console.log(`✓ ${proyecto.entidadContratante}`)
      console.log(`  ${proyecto.ubicacion} → ${ubicacionCorta}`)
      console.log('')

      actualizados++
    } else {
      console.log(`• ${proyecto.entidadContratante}`)
      console.log(`  ${proyecto.ubicacion} (sin cambios)`)
      console.log('')
      sinCambios++
    }
  }

  console.log('━'.repeat(60))
  console.log(`✅ Total proyectos procesados: ${proyectos.length}`)
  console.log(`✓  Ubicaciones actualizadas: ${actualizados}`)
  console.log(`•  Sin cambios: ${sinCambios}`)

  await prisma.$disconnect()
}

acortarUbicaciones2025()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
