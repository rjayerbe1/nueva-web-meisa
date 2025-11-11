/**
 * Script para actualizar los títulos de los proyectos de 2023
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2023 = {
  // JJVM - Entre Bosques
  'Entre Bosques': {
    titulo: 'JJVM - Entre Bosques',
    descripcion: 'Estructura metálica edificio'
  },

  // Consorcio Deportivo - Coliseo Menor Pereira
  'Coliseo Menor Pereira': {
    titulo: 'Consorcio GAMJ - Coliseo Menor Pereira',
    descripcion: 'Estructura metálica coliseo deportivo'
  },

  // UT Complejo Acuático Pereira
  'Complejo Acuatico Pereira': {
    titulo: 'UT Pereira - Complejo Acuático',
    descripcion: 'Estructura metálica complejo deportivo'
  },

  // Ingenio Providencia - Bahía de Alcoholes
  'Bahía de Alcoholes': {
    titulo: 'Ingenio Providencia - Bahía Alcoholes',
    descripcion: 'Estructura metálica industrial'
  },

  // Ingenio Providencia - Zona de Catas
  'Obras civiles y Estructura Metalica Zona de Catas Oficinas y Vestier': {
    titulo: 'Ingenio Providencia - Zona Catas y Oficinas',
    descripcion: 'Obras civiles y estructura metálica'
  },

  // Tecnosur - Módulo 7 Villa Rica
  'Construccion Estructura Metalica Modulo 7 - Tecnosur Villa Rica': {
    titulo: 'Tecnosur - Módulo 7 Villa Rica',
    descripcion: 'Construcción estructura metálica'
  },

  // Tecnoquímicas - Sólidos Altos Volúmenes
  'Construccion Estructura Metalica Solidos de Altos Volumenes TQ Jamundi': {
    titulo: 'Tecnoquímicas - Sólidos Altos Volúmenes',
    descripcion: 'Construcción estructura metálica Jamundí'
  },

  // PAVCOL - Puente La Floresta
  'Puente la Floresta': {
    titulo: 'PAVCOL - Puente La Floresta',
    descripcion: 'Estructura metálica puente'
  }
}

async function actualizarTitulos2023() {
  console.log('🔄 Actualizando títulos de proyectos 2023...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2023-01-01'),
        lte: new Date('2023-12-31')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2023[proyecto.objetoContrato]

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

actualizarTitulos2023()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
