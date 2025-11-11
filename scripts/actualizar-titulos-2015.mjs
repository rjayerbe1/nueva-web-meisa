/**
 * Script para actualizar los títulos de proyectos 2015 (20 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2015 = {
  // Tugo - Bodega Muebles
  'Cali - Estructura Metálica Bodega Muebles y Objetos': {
    titulo: 'Tugo - Bodega Muebles y Objetos Cali',
    descripcion: 'Estructura metálica bodega'
  },

  // Pollos Bucanero - Planta Harinas
  'Villagorgona - Planta de Harinas': {
    titulo: 'Pollos Bucanero - Planta Harinas Villagorgona',
    descripcion: 'Estructura metálica planta industrial'
  },

  // Consorcio - Barandas Iglesia
  'La Sierra Cauca - Barandas Metálicas para Peatones Iglesia': {
    titulo: 'Consorcio Competitividad - Barandas Iglesia La Sierra',
    descripcion: 'Barandas metálicas peatonales'
  },

  // Arboleda - Casa Zen
  'Cali - Estructura Metálica Casa Zen': {
    titulo: 'Arboleda Rojas - Casa Zen Cali',
    descripcion: 'Estructura metálica residencial'
  },

  // Pollos Bucanero - Cubierta Planta
  'Villagorgona - Cubierta Doble Agua Planta de Pollos': {
    titulo: 'Pollos Bucanero - Cubierta Planta Villagorgona',
    descripcion: 'Cubierta doble agua planta'
  },

  // Consorcio Decepaz
  'Cali - Estructura Metálica de Cubierta Centro de Salud DECEPAZ': {
    titulo: 'Consorcio Decepaz - Centro Salud Cali',
    descripcion: 'Estructura metálica cubierta centro salud'
  },

  // Pollos Bucanero - Taller
  'Villagorgona - Taller Satélite': {
    titulo: 'Pollos Bucanero - Taller Satélite Villagorgona',
    descripcion: 'Estructura metálica taller'
  },

  // Pollos Bucanero - Baños
  'Villagorgona - Baños & Vestir': {
    titulo: 'Pollos Bucanero - Baños y Vestier Villagorgona',
    descripcion: 'Estructura metálica instalaciones'
  },

  // Centro Comercial Único Pasto
  'PASTO - Parqueaderos y Cinemas, estructuras metálicas': {
    titulo: 'CC Único Pasto - Parqueaderos y Cinemas',
    descripcion: 'Estructuras metálicas'
  },

  // Pollos Bucanero - Cuartos Fríos
  'Barranquilla - Estructura Metálica Cuartos Fríos': {
    titulo: 'Pollos Bucanero - Cuartos Fríos Barranquilla',
    descripcion: 'Estructura metálica refrigeración'
  },

  // UT E&R - Puente El Jagua
  'Corinto - Obra Civil y Traslado Puente El Jagua L=70 pies': {
    titulo: 'UT E&R - Puente El Jagua Corinto',
    descripcion: 'Obra civil y traslado puente'
  },

  // Colpatria Neiva
  'CONSTRUCTORA COLPATRIA – NEIVA – Estructura Metálicas Centro Comercial Único Neiva.': {
    titulo: 'Constructora Colpatria - CC Único Neiva',
    descripcion: 'Estructuras metálicas centro comercial'
  },

  // Arinsa Popayán
  'ARINSA – POPAYAN – Cimentación, Estructura Metálica y Cubiertas Ampliación Centro Comercial Campanario': {
    titulo: 'Arinsa - Ampliación CC Campanario Popayán',
    descripcion: 'Cimentación, estructura y cubiertas'
  },

  // Aires Modernos
  'CONST E INST ESTRUCTURA PLATAFORMA DE EQUIPO AIRE': {
    titulo: 'Aires Modernos - Plataforma Equipo Aire',
    descripcion: 'Construcción e instalación estructura plataforma'
  },

  // Consorcio WTC
  'CONST E INST ESTRUCTURA WTC': {
    titulo: 'Consorcio Colpatria Alpes - Estructura WTC',
    descripcion: 'Construcción e instalación estructura'
  },

  // Almacenes Éxito - Plataforma
  'CONST E INST ESTRUCTURA PLATAFORMA DE EQUIPO AIRE': {
    titulo: 'Almacenes Éxito - Plataforma Equipo Aire',
    descripcion: 'Construcción e instalación estructura plataforma'
  },

  // Distribuidora - Mezanine Polo
  'MEZANINE LOCAL POLO': {
    titulo: 'Distribuidora Internacional - Mezanine Polo',
    descripcion: 'Mezanine local comercial'
  },

  // Consorcio Remin - Puente Frisoles
  'CONSORCIO REMIN – Nariño – Estructura Metálica Para Puente Frisoles, Ancuya – Ancusa, L=47 m': {
    titulo: 'Consorcio Remin - Puente Frisoles Nariño',
    descripcion: 'Estructura metálica puente 47m'
  },

  // Colpatria Barranquilla
  'CONSTRUCTORA COLPATRIA S.A. – BARRANQUILLA – Estructura Metálicas Centro Comercial Único Barranquilla': {
    titulo: 'Constructora Colpatria - CC Único Barranquilla',
    descripcion: 'Estructuras metálicas centro comercial'
  },

  'CONSTRUCTORA COLPATRIA S.A. – BARRANQUILLA – Estructura Metálicas Centro Comercial Único Barranquilla.': {
    titulo: 'Constructora Colpatria - CC Único Barranquilla',
    descripcion: 'Estructuras metálicas centro comercial'
  },

  // Estrumetal - Bodega Hero Motors
  'Villarrica - Fabricación Estructura Metálica Bodega E42 Proyecto Hero Motors': {
    titulo: 'Estrumetal - Bodega Hero Motors Villarrica',
    descripcion: 'Fabricación estructura metálica bodega'
  }
}

async function actualizarTitulos2015() {
  console.log('🔄 Actualizando títulos de proyectos 2015...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2015-01-01'),
        lt: new Date('2016-01-01')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2015[proyecto.objetoContrato]

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

actualizarTitulos2015()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
