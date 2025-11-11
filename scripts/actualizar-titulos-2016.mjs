/**
 * Script para actualizar los títulos de proyectos 2016 (20 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2016 = {
  'Yumbo - Obras Civiles Adecuación de Salas de Cine C.C Único Yumbo': {
    titulo: 'Royal Films - Salas Cine CC Único Yumbo',
    descripcion: 'Obras civiles adecuación salas'
  },

  'JUAN MANUEL RODRIGUEZ -MEZANINE ALBERTO Vo5 UNICO NEIVA': {
    titulo: 'J.M. Rodriguez - Mezanine Alberto VO5 Neiva',
    descripcion: 'Estructura metálica mezanine'
  },

  'CONTRAPISO LOCAL ROYAL FILMS C.C.UNICO NEIVA': {
    titulo: 'Centros Comerciales Huila - Contrapiso Royal Films',
    descripcion: 'Contrapiso local CC Único Neiva'
  },

  'Cali - Estructura Metálica Soporte Graderías y Cuartos de Proyección Salas de Cine C.C. Jardín Plaza': {
    titulo: 'Royal Films - Graderías CC Jardín Plaza Cali',
    descripcion: 'Estructura metálica soporte graderías y proyección'
  },

  'CONST E INST CUBIERTA TEJA': {
    titulo: 'Ingenio Providencia - Cubierta Teja',
    descripcion: 'Construcción e instalación cubierta'
  },

  'Adecuación Royal Films UNICO NEIVA': {
    titulo: 'Centros Comerciales Café - Royal Films Neiva',
    descripcion: 'Adecuación salas cine'
  },

  'Construcción de obra civiles, estructuras y cubiertas para la Ampliación C.C. UNICO NEIVA': {
    titulo: 'Banco de Occidente - Ampliación CC Único Neiva',
    descripcion: 'Obras civiles, estructuras y cubiertas'
  },

  'Construcción de obra civiles, estructuras y cubiertas para la Ampliación C.C. UNICO TRES - Cali': {
    titulo: 'Banco de Occidente - Ampliación CC Único Tres Cali',
    descripcion: 'Obras civiles, estructuras y cubiertas'
  },

  'Estructura metálica Edificio Servicios Industriales (Equipos Auxiliares) POSTOBON Estructura Metálica cubiertas nueva sala de jarabes': {
    titulo: 'CC Construcciones - Edificio Servicios Postobón',
    descripcion: 'Estructura metálica equipos auxiliares y sala jarabes'
  },

  'Cali - Estructura Metálica Soporte Graderías y Cuartos de Proyección Salas de Cine C.C Único Cali': {
    titulo: 'Royal Films - Graderías CC Único Cali',
    descripcion: 'Estructura metálica soporte graderías y proyección'
  },

  'Remodelación Vacio central UNICO II': {
    titulo: 'Prococasa - Remodelación Vacío Central Único',
    descripcion: 'Remodelación estructura'
  },

  'Construcción Puente Vehicular "La Paila"': {
    titulo: 'UT EYR - Puente Vehicular La Paila',
    descripcion: 'Construcción puente vehicular'
  },

  'Barandas metálicas peatonales para puente El Jagual - Caloto': {
    titulo: 'UT EYR - Barandas Puente El Jagual',
    descripcion: 'Barandas metálicas peatonales'
  },

  'Construcción graderías y losas salas de cine UNICO NEIVA Y ADICIONALES': {
    titulo: 'Royal Films - Graderías y Losas Único Neiva',
    descripcion: 'Construcción graderías y losas salas'
  },

  'Construcción graderías y losas salas de cine C.C. LA ESTACION CALI': {
    titulo: 'Royal Films - Graderías CC La Estación Cali',
    descripcion: 'Construcción graderías y losas salas'
  },

  'Pasto - Obras Civiles de Salas de Cine C.C Único Pasto': {
    titulo: 'Royal Films - Salas Cine CC Único Pasto',
    descripcion: 'Obras civiles salas'
  },

  'Estructura metálica Edificio Servicios Industriales (Equipos Auxiliares) POSTOBÓN': {
    titulo: 'CC Construcciones - Edificio Servicios Postobón',
    descripcion: 'Estructura metálica equipos auxiliares'
  },

  'Estructura cielo falso PETERLAND UNICO NEIVA': {
    titulo: 'Juegos Electrónicos - Cielo Falso Peterland',
    descripcion: 'Estructura cielo falso'
  },

  'Adecuación Royal Films UNICO BARRANQUILLA': {
    titulo: 'Centros Comerciales Costa - Royal Films Barranquilla',
    descripcion: 'Adecuación salas cine'
  },

  'Cali - Estructura Metálica para obras de Adecuación Salas de Cine C.C. Jardín Plaza': {
    titulo: 'Royal Films - Adecuación CC Jardín Plaza Cali',
    descripcion: 'Estructura metálica adecuación salas'
  },

  'Mezanine local ESPRIT - LA ESTACION CALI': {
    titulo: 'Industria Mercadeo y Color - Mezanine Esprit',
    descripcion: 'Mezanine local La Estación Cali'
  },

  'Estructura metálica para el proyecto Cinemateca distrital Bogotá': {
    titulo: 'Edgar Oliveros - Cinemateca Distrital Bogotá',
    descripcion: 'Estructura metálica cinemateca'
  },

  'ESTRUCT METALICA RAMPA PROVISIONAL UNICO BARRANQUILLA': {
    titulo: 'Desarrollos Inmobiliarios - Rampa Único Barranquilla',
    descripcion: 'Estructura metálica rampa provisional'
  }
}

async function actualizarTitulos2016() {
  console.log('🔄 Actualizando títulos de proyectos 2016...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2016-01-01'),
        lt: new Date('2017-01-01')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2016[proyecto.objetoContrato]

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

actualizarTitulos2016()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
