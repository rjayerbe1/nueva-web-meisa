import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSampleCodigosInternos() {
  try {
    console.log('🏷️  Agregando códigos internos de ejemplo...\n')

    // Obtener todos los proyectos
    const proyectos = await prisma.proyecto.findMany({
      select: { id: true, titulo: true, categoria: true }
    })

    console.log(`📦 Total proyectos encontrados: ${proyectos.length}\n`)

    let updated = 0

    for (const proyecto of proyectos) {
      // Generar código interno basado en categoría y número aleatorio
      let prefijo = ''
      
      switch (proyecto.categoria) {
        case 'CENTROS_COMERCIALES':
          prefijo = 'CC'
          break
        case 'EDIFICIOS':
          prefijo = 'ED'
          break
        case 'PUENTES':
          prefijo = 'PT'
          break
        case 'INDUSTRIAL':
          prefijo = 'IN'
          break
        case 'OIL_GAS':
          prefijo = 'OG'
          break
        case 'RESIDENCIAL':
          prefijo = 'RS'
          break
        case 'INFRAESTRUCTURA':
          prefijo = 'IF'
          break
        default:
          prefijo = 'PM'
      }

      // Generar número aleatorio de 3 dígitos y año
      const numero = Math.floor(Math.random() * 900) + 100
      const año = Math.floor(Math.random() * 5) + 21 // 21-25 (2021-2025)
      const codigoInterno = `${prefijo}${numero}-${año}`

      // Actualizar proyecto
      await prisma.proyecto.update({
        where: { id: proyecto.id },
        data: { codigoInterno }
      })

      console.log(`✅ ${proyecto.titulo}: ${codigoInterno}`)
      updated++
    }

    console.log(`\n🎉 Códigos internos agregados: ${updated}/${proyectos.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar script
addSampleCodigosInternos()