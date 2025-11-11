/**
 * Script para actualizar los títulos de proyectos 2009-2008 (12 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2009 (6 proyectos) =====
  'Estructuras metálicas para bodegas en Buenaventura (Valle del Cauca)': {
    titulo: 'OPP Graneles - Bodegas Buenaventura',
    descripcion: 'Estructuras metálicas bodegas'
  },

  'Estructura metálica para cubierta de bodegas': {
    titulo: 'Zona Franca Palmaseca - Cubierta Bodegas',
    descripcion: 'Estructura metálica cubierta'
  },

  'Estructuras metálicas y cubiertas Colegio Potrerogrande en Cali': {
    titulo: 'Constructora Carpol - Colegio Potrerogrande',
    descripcion: 'Estructuras metálicas y cubiertas'
  },

  'Diseño y construcción Puente Vehicular "Nolasco" sobre el río Páez        Longitud 145 mts.': {
    titulo: 'Consorcio del Cauca - Puente Nolasco',
    descripcion: 'Diseño y construcción puente 145m'
  },

  'ESTACIÓN MARBELLA -Estructura metálica para la Estación de Servicio en Cali.': {
    titulo: 'Estación Marbella - Estación Servicio Cali',
    descripcion: 'Estructura metálica estación servicio'
  },

  'BARRANQUILLA - Diseño y construcción estructura metálica y cubierta': {
    titulo: 'CC Único - Estructuras Barranquilla',
    descripcion: 'Diseño y construcción estructura y cubierta'
  },

  // ===== 2008 (6 proyectos) =====
  'Popayán': {
    titulo: 'Arinsa - CC Campanario Popayán',
    descripcion: 'Diseño y construcción estructuras y cubiertas'
  },

  'Cubierta muelle de embarque': {
    titulo: 'Terminal Transportes - Cubierta Muelle Popayán',
    descripcion: 'Cubierta muelle embarque'
  },

  'Estructura metálica Coliseo  Cubierto  Timbío': {
    titulo: 'Comité Cafeteros Cauca - Coliseo Timbío',
    descripcion: 'Estructura metálica coliseo'
  },

  'Estructura metálica de cubierta en bodega de Tuluá': {
    titulo: 'Nutriplantas - Bodega Tuluá',
    descripcion: 'Estructura metálica cubierta bodega'
  },

  'Estructura metálica para ampliación de la Clínica en Cali': {
    titulo: 'Clínica Excellence - Ampliación Cali',
    descripcion: 'Estructura metálica ampliación'
  },

  'Estructura metálica de cubierta en Yumbo (Valle)': {
    titulo: 'Discoteca Cucara-Macara - Cubierta Yumbo',
    descripcion: 'Estructura metálica cubierta'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando títulos de proyectos 2009-2008...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2008-01-01'),
        lt: new Date('2010-01-01')
      }
    },
    orderBy: {
      fechaFin: 'desc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

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
      console.log(`✓ [${año}] ${proyecto.entidadContratante}`)
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

actualizarTitulos()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
