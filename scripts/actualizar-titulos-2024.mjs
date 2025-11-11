/**
 * Script para actualizar los títulos de los proyectos de 2024
 * con formato compacto (tituloDisplay + descripcionSecundaria)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapeo de títulos compactos y descripciones para 2024
const titulos2024 = {
  // Dollar City - Alfaguara
  'Construccion y Montaje Estructura Metalica Dollar City Alfaguara': {
    titulo: 'Dollar City - Alfaguara',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // Dollar City - La María
  'Construccion y Montaje Estructura Metalica Dollar City La Maria': {
    titulo: 'Dollar City - La María',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // Pollo Listo - Cuarto Frío
  'Construccion y Montaje Estructura Metalica Cuarto Frio': {
    titulo: 'Pollo Listo - Cuarto Frío',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // CASA - Puente Cascada
  'Construccion y Montaje Estructura Metalica Puente Cascada': {
    titulo: 'CASA - Puente Cascada',
    descripcion: 'Construcción y montaje estructura metálica'
  },

  // Tecnosur - Módulo 8 Villa Rica
  'Construccion Estructura Metalica Modulo 8 - Tecnosur Villa Rica': {
    titulo: 'Tecnosur - Módulo 8 Villa Rica',
    descripcion: 'Construcción estructura metálica'
  },

  // Construandes - Hangar Aeropuerto
  'Estructura Metalica Hangar Aeropuerto': {
    titulo: 'Construandes - Hangar Aeropuerto',
    descripcion: 'Estructura metálica hangar'
  },

  // Construandes - Galería CC Llanogrande
  'Galeria local 326 CC Llanogrande': {
    titulo: 'Construandes - Galería CC Llanogrande',
    descripcion: 'Galería local 326'
  },

  // Grupo Constructor - Cubierta Módulo Espíritu Santo
  'Construccion de Estructura Metalica y pintura para el Proyecto Cubierta Modulo Espiritu Santo': {
    titulo: 'Grupo Constructor - Cubierta Espíritu Santo',
    descripcion: 'Estructura metálica y pintura módulo'
  },

  // Sucroal - Edificio Cítrico
  'Edificio Citrico': {
    titulo: 'Sucroal - Edificio Cítrico',
    descripcion: 'Estructura metálica edificio'
  },

  // Sucroal - Centro de Distribución Palmira
  'Centro de Distribución - Palmira': {
    titulo: 'Sucroal - Centro Distribución Palmira',
    descripcion: 'Estructura metálica centro de distribución'
  },

  // Astrelec - Locales Natura Park
  'Construccion estructura metalica locales comerciales Natura Park': {
    titulo: 'Astrelec - Locales Natura Park',
    descripcion: 'Construcción estructura metálica locales comerciales'
  },

  // Juan Tama - Trilladora de Café
  'Infraestuctura de Trilladora de Café': {
    titulo: 'Juan Tama - Trilladora de Café',
    descripcion: 'Infraestructura trilladora'
  }
}

async function actualizarTitulos2024() {
  console.log('🔄 Actualizando títulos de proyectos 2024...\n')

  // Obtener todos los proyectos de 2024
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2024-01-01'),
        lte: new Date('2024-12-31')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2024[proyecto.objetoContrato]

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

actualizarTitulos2024()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
