/**
 * Script para actualizar los títulos de los proyectos de 2022, 2021 y 2020
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2022 =====
  'Centro de distribución - Villa Rica': {
    titulo: 'Tecnosur - Centro Distribución Villa Rica',
    descripcion: 'Estructura metálica centro de distribución'
  },

  'Construcción de la estructura metalica de cubierta caña dulce': {
    titulo: 'Comfacauca - Cubierta Caña Dulce',
    descripcion: 'Construcción estructura metálica cubierta'
  },

  'Construcción de obra civil, estructura metalica, fachada y cubierta del complejo industrial Piedechinche': {
    titulo: 'Ingenio Providencia - Complejo Piedechinche',
    descripcion: 'Obra civil, estructura metálica, fachada y cubierta'
  },

  'Bodega 5 Azucar': {
    titulo: 'Ingenio Providencia - Bodega 5 Azúcar',
    descripcion: 'Estructura metálica bodega'
  },

  'Construcción estructura metalica CC Bochalema Plaza': {
    titulo: 'Constructora Normandia - CC Bochalema Plaza',
    descripcion: 'Construcción estructura metálica centro comercial'
  },

  // ===== 2021 =====
  'Construccion estructura metalica edificio de 3 pisos para parqueadero.Tequendama Parking': {
    titulo: 'Diego María Romero - Parqueadero Tequendama',
    descripcion: 'Estructura metálica edificio 3 pisos'
  },

  'Terminal intermedio autopista Simon Bolivar parte 2': {
    titulo: 'Consorcio Metrovial SB - Terminal Intermedio',
    descripcion: 'Estructura metálica autopista Simón Bolívar'
  },

  'Construccion Estructura Metalica Edificio capsulas Blandas Envases y empaques TQ Jamundi': {
    titulo: 'Tecnoquímicas - Edificio Cápsulas Blandas',
    descripcion: 'Estructura metálica envases y empaques Jamundí'
  },

  'Construccion Estructura Metalica Bodega 3 TQ Jamundi': {
    titulo: 'Tecnoquímicas - Bodega 3',
    descripcion: 'Construcción estructura metálica Jamundí'
  },

  'Construccion de bodega semisolidos Tecnofar': {
    titulo: 'Inverteq - Bodega Semisólidos Tecnofar',
    descripcion: 'Construcción bodega'
  },

  // ===== 2020 =====
  'Construccion de estructura y acabados, proyecto cancha multiple- etapa 2': {
    titulo: 'Pontificia Javeriana - Cancha Múltiple Etapa 2',
    descripcion: 'Construcción estructura y acabados'
  },

  'Estructura metálica Centro Comercial Paseo Villa del Río': {
    titulo: 'Ménsula Ingenieros - CC Paseo Villa del Río',
    descripcion: 'Estructura metálica centro comercial'
  },

  'Construcción e instalación de estructura metálica para torre cogeneración': {
    titulo: 'Propal - Torre Cogeneración',
    descripcion: 'Construcción e instalación estructura metálica'
  },

  'Construcción edificio administrativo cuerpo de bomberos Popayán': {
    titulo: 'Bomberos Popayán - Edificio Administrativo',
    descripcion: 'Construcción edificio administrativo'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando títulos de proyectos 2022-2020...\n')

  // Obtener proyectos de 2020-2022
  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2020-01-01'),
        lte: new Date('2022-12-31')
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
      console.log(`✓ ${año} - ${proyecto.entidadContratante}`)
      console.log(`  Título: ${mapping.titulo}`)
      console.log('')

      actualizados++
    } else {
      const año = new Date(proyecto.fechaFin).getFullYear()
      console.log(`⚠️  ${año} - No encontrado: ${proyecto.objetoContrato.substring(0, 60)}...`)
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
