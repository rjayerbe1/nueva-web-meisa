/**
 * Script para actualizar los títulos de los proyectos de 2019, 2018 y 2017
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2019 =====
  'Puente Vehicular Cra 100': {
    titulo: 'Consorcio Islas - Puente Vehicular Cra 100',
    descripcion: 'Estructura metálica puente vehicular'
  },

  'Construcción e instalación de estructura métalica y ampliación de la cubierta': {
    titulo: 'Cargill - Ampliación Cubierta',
    descripcion: 'Construcción e instalación estructura metálica'
  },

  // ===== 2018 =====
  'Puente Vehicular Río Negro': {
    titulo: 'Orlando Revelo - Puente Vehicular Río Negro',
    descripcion: 'Estructura metálica puente vehicular'
  },

  'Construcción de estructura metálica y cubiertas para Centro comercial Monserrat': {
    titulo: 'Construcciones Adriana Rivera - CC Monserrat',
    descripcion: 'Construcción estructura metálica y cubiertas'
  },

  'Puente Vehicular Cambrín': {
    titulo: 'Consorcio Cambrin - Puente Vehicular Cambrín',
    descripcion: 'Estructura metálica puente vehicular'
  },

  // ===== 2017 =====
  'Construcción edificio nueva sede Seguridad Omega': {
    titulo: 'Omega - Edificio Nueva Sede',
    descripcion: 'Construcción edificio seguridad'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando títulos de proyectos 2019-2017...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2017-01-01'),
        lte: new Date('2019-12-31')
      }
    },
    orderBy: {
      fechaFin: 'desc'
    }
  })

  let actualizados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos[proyecto.objetoContrato]

    if (mapping) {
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          tituloDisplay: mapping.titulo,
          descripcionSecundaria: mapping.descripcion
        }
      })

      const año = new Date(proyecto.fechaFin).getFullYear()
      console.log(`✓ ${año} - ${proyecto.entidadContratante}`)
      console.log(`  ${mapping.titulo}`)
      console.log('')

      actualizados++
    }
  }

  console.log('━'.repeat(60))
  console.log(`✅ Proyectos actualizados: ${actualizados}/${proyectos.length}`)

  await prisma.$disconnect()
}

actualizarTitulos()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
