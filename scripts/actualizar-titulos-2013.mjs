/**
 * Script para actualizar los títulos de proyectos 2013 (15 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2013 = {
  'Estructura metálica y cubierta para edificio "Torre Tacho" -  seis niveles -  altura 30 mts.': {
    titulo: 'Ingenio Mayagüez - Torre Tacho 6 Niveles',
    descripcion: 'Estructura metálica y cubierta edificio 30m'
  },

  'Diseño y construcción de centro comercial en Yumbo (Valle)': {
    titulo: 'CC Único - Centro Comercial Yumbo',
    descripcion: 'Diseño y construcción centro comercial'
  },

  'Estructura metálica y cubierta para el Coliseo Mundialista Korfball en Cali, Juegos Mundiales.': {
    titulo: 'Maja - Coliseo Mundialista Korfball',
    descripcion: 'Estructura metálica y cubierta coliseo'
  },

  'Estructura metálica y cubiertas para Colegio Chiriquí en Valledupar': {
    titulo: 'Consorcio APV - Colegio Chiriquí Valledupar',
    descripcion: 'Estructura metálica y cubiertas'
  },

  'Cubierta Dispensario Batallón Ejército en Popayán': {
    titulo: 'Holguín & Herz - Dispensario Batallón Popayán',
    descripcion: 'Cubierta dispensario militar'
  },

  'Estructuras metálicas , cubiertas y fachadas para ampliación en Cali': {
    titulo: 'CC Único - Ampliación Centro Comercial Cali',
    descripcion: 'Estructuras metálicas, cubiertas y fachadas'
  },

  'CONSTRUCTORA PRODYGIO S.A.S. Estructura metálica y cubierta restaurante "La Lomita" en Popayán': {
    titulo: 'Constructora Prodygio - Restaurante La Lomita',
    descripcion: 'Estructura metálica y cubierta restaurante'
  },

  'Estructura metálica y cubierta local en Cali': {
    titulo: 'CC Automotriz - Local Comercial Cali',
    descripcion: 'Estructura metálica y cubierta local'
  },

  'Estructura metálica y cubierta para bodega Dúplex - altura 26 mts.': {
    titulo: 'Ingenio Mayagüez - Bodega Dúplex 26m',
    descripcion: 'Estructura metálica y cubierta bodega'
  },

  'Estructura metálica y cubierta para locales "Cañas Gordas" . Cali': {
    titulo: 'Andrés Arboleda - Locales Cañas Gordas',
    descripcion: 'Estructura metálica y cubierta locales'
  },

  'Estructura metálica y cubierta edificio "Portal Plaza" en Cli': {
    titulo: 'Streleck & Cohen - Edificio Portal Plaza',
    descripcion: 'Estructura metálica y cubierta edificio'
  },

  'Cali': {
    titulo: 'Crane & Safety Bureau - Casa Laguna Seca',
    descripcion: 'Estructura metálica y cubierta residencial'
  },

  'Estructuras metálicas y cubiertas  para bodegas y cuartos fríos - Cali': {
    titulo: 'Pollos Bucanero - Bodegas y Cuartos Fríos Etapa 4',
    descripcion: 'Estructuras metálicas y cubiertas'
  },

  'P.Q.P PRODUCTOS QUÍMICOS PANAMERICANOS Estructura metálica y cubiertas en Cali': {
    titulo: 'Luis Carlos Ríos - PQP Productos Químicos',
    descripcion: 'Estructura metálica y cubiertas'
  },

  'ASTRELEC S.A.S. Estructura metálica y cubierta para el edificio "Parque 102" en Cali': {
    titulo: 'Astrelec - Edificio Parque 102',
    descripcion: 'Estructura metálica y cubierta edificio'
  }
}

async function actualizarTitulos2013() {
  console.log('🔄 Actualizando títulos de proyectos 2013...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2013-01-01'),
        lt: new Date('2014-01-01')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2013[proyecto.objetoContrato]

    if (mapping) {
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          tituloDisplay: mapping.titulo,
          descripcionSecundaria: mapping.descripcion
        }
      })

      console.log(`✓ ${proyecto.entidadContratante}`)
      console.log(`  ${mapping.titulo}`)
      console.log('')

      actualizados++
    } else {
      console.log(`⚠️  No encontrado: ${proyecto.objetoContrato.substring(0, 60)}...`)
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

actualizarTitulos2013()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
