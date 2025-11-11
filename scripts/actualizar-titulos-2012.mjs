/**
 * Script para actualizar los títulos de proyectos 2012 (15 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2012 = {
  'Estructura metálica y cubierta par Morgue en Tuluá (Valle)': {
    titulo: 'Alberto Vidal - Morgue Tuluá',
    descripcion: 'Estructura metálica y cubierta morgue'
  },

  'Diseño y construcción del Coliseo Cubierto No. 2 en Popayán': {
    titulo: 'Colegio Franciscanas - Coliseo Cubierto No. 2',
    descripcion: 'Diseño y construcción coliseo'
  },

  'Diseño y construcción de estructuras y cubiertas par canchas Centro Recreativo Pisojé.': {
    titulo: 'Comfacauca - Canchas Centro Recreativo Pisojé',
    descripcion: 'Diseño y construcción estructuras y cubiertas'
  },

  'Diseño y construcción de mezaninne para oficinas sede de Popayán': {
    titulo: 'Comfacauca - Mezanine Oficinas Popayán',
    descripcion: 'Diseño y construcción mezanine'
  },

  'Diseño y construcción Puente Cusiyaco              Longitud 40 mts.': {
    titulo: 'Consorcio Competitividad - Puente Cusiyaco',
    descripcion: 'Diseño y construcción puente 40m'
  },

  'Coliseo de fútbol sala para los Juegos Nacionales de Popayán': {
    titulo: 'Consorcio MJ 2011 - Coliseo Fútbol Sala',
    descripcion: 'Coliseo Juegos Nacionales Popayán'
  },

  'Coliseo de Artes Marciales para los Juegos Nacionales de Popayán': {
    titulo: 'Argeu - Coliseo Artes Marciales',
    descripcion: 'Coliseo Juegos Nacionales Popayán'
  },

  'Estructura metálica y cubierta edificio PRADO 2 en Popayán': {
    titulo: 'Cely y Caicedo - Edificio Prado 2',
    descripcion: 'Estructura metálica y cubierta edificio'
  },

  'Estructura metálica para edificio de 6 plantas, sector de mezclas en Palmira (Valle)': {
    titulo: 'Ingenio Manuelita - Edificio 6 Plantas Palmira',
    descripcion: 'Estructura metálica sector mezclas'
  },

  'Estructura metálica y  cubierta en ampliación': {
    titulo: 'Pollos Bucanero - Ampliación Etapa 3',
    descripcion: 'Estructura metálica y cubierta'
  },

  'Diseño y construcción puente vehicular sobre rio Cauca Centro Recreativo Pisojé Longitud 40 mts.': {
    titulo: 'Comfacauca - Puente Vehicular Río Cauca',
    descripcion: 'Diseño y construcción puente 40m'
  },

  'Diseño y construcción de estructuras metálicas y cubiertas, en Villavicencio': {
    titulo: 'CC Único - Estructuras Villavicencio',
    descripcion: 'Diseño y construcción estructuras y cubiertas'
  },

  'Diseño  y construcción puente vehicular en Arco,  Saraconcho     Longitud 150 mts.': {
    titulo: 'Consorcio Competitividad - Puente Arco Saraconcho',
    descripcion: 'Diseño y construcción puente 150m'
  },

  'Diseño uy construcción de mezaninne en Pasto (Nariño)': {
    titulo: 'Carrefour - Mezanine Pasto',
    descripcion: 'Diseño y construcción mezanine'
  },

  'FONDO MIXTO PARA PROMOCIÓN DEL DEPORTE- Diseño y construcción estructura metálica y cubierta para la piscina olímpica, Juegos Nacionales de Popayán': {
    titulo: 'Fondo Mixto Deporte - Piscina Olímpica Popayán',
    descripcion: 'Estructura metálica y cubierta Juegos Nacionales'
  }
}

async function actualizarTitulos2012() {
  console.log('🔄 Actualizando títulos de proyectos 2012...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2012-01-01'),
        lt: new Date('2013-01-01')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2012[proyecto.objetoContrato]

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

actualizarTitulos2012()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
