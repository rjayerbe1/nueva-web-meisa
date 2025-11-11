/**
 * Script para actualizar los títulos de los proyectos de 2025
 * con formato compacto (tituloDisplay + descripcionSecundaria)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de títulos compactos y descripciones para 2025
const titulos2025 = {
  // Tecnosur - Villa Rica
  'Construccion Estructura Metalica Mezzanine Esteriles - Tecnosur Villa Rica': {
    titulo: 'Tecnosur - Mezzanine Estériles Villa Rica',
    descripcion: 'Construcción estructura metálica mezzanine'
  },

  // OMEGA - Cali
  'Ampliacion Omega Tercer Piso': {
    titulo: 'Omega - Ampliación Tercer Piso',
    descripcion: 'Estructura metálica para ampliación edificio'
  },

  // MHC - Transmilenio Bogotá
  'Estaciones de Transmilenio Cra 11 y 19': {
    titulo: 'MHC - Estaciones Transmilenio Cra 11 y 19',
    descripcion: 'Estructura metálica estaciones'
  },

  // PAVCOL - Ciclopuente
  'Ciclopuente Calle 98 P11 GRUPO 7': {
    titulo: 'PAVCOL - Ciclopuente Calle 98',
    descripcion: 'Estructura metálica puente peatonal y ciclista'
  },

  // Dollar City - Mazuren
  'Construccion y Montaje Estructura Metalica Dollar City Mazuren': {
    titulo: 'Dollar City - Mazuren',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // PAVCOL - Estación Calle 19
  'Estación Calle 19 y Puente Peatonal Av. Esperanza Norte P8 Grupo 4': {
    titulo: 'PAVCOL - Estación Calle 19 y Puente Av. Esperanza',
    descripcion: 'Estructura metálica estación y puente peatonal'
  },

  // Dollar City - Chapinero
  'Construccion y Montaje Estructura Metalica Dollar City Chapinero': {
    titulo: 'Dollar City - Chapinero',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // Dollar City - Río Negro
  'Construccion y Montaje Estructura Metalica Dollar City Rio Negro Calle 100': {
    titulo: 'Dollar City - Río Negro Calle 100',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // Puente Vehicular OVEJAS
  'Puente Vehicular OVEJAS': {
    titulo: 'Puente Vehicular Ovejas',
    descripcion: 'Estructura metálica puente vehicular'
  }
}

async function actualizarTitulos2025() {
  console.log('🔄 Actualizando títulos de proyectos 2025...\n')

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
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2025[proyecto.objetoContrato]

    if (mapping) {
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          tituloDisplay: mapping.titulo,
          descripcionSecundaria: mapping.descripcion
        }
      })

      console.log(`✓ Actualizado: ${proyecto.entidadContratante}`)
      console.log(`  Título: ${mapping.titulo}`)
      console.log(`  Descripción: ${mapping.descripcion}`)
      console.log('')

      actualizados++
    } else {
      console.log(`⚠️  No encontrado: ${proyecto.objetoContrato.substring(0, 80)}...`)
      noEncontrados++
    }
  }

  console.log('━'.repeat(60))
  console.log(`✅ Total proyectos procesados: ${proyectos.length}`)
  console.log(`✓  Proyectos actualizados: ${actualizados}`)
  if (noEncontrados > 0) {
    console.log(`⚠️  Proyectos no encontrados: ${noEncontrados}`)
  }

  await prisma.$disconnect()
}

actualizarTitulos2025()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
