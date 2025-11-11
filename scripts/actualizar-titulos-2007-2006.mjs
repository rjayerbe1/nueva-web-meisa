/**
 * Script para actualizar los títulos de proyectos 2007-2006 (17 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2007 (7 proyectos) =====
  'Estructuras metálicas varias': {
    titulo: 'CC Único Cali - Estructuras Etapa 4',
    descripcion: 'Estructuras metálicas varias'
  },

  'Estructura metálica edificio Campestre Towers Cali': {
    titulo: 'Constructora Hernández Bohmer - Campestre Towers',
    descripcion: 'Estructura metálica edificio'
  },

  'Estructuras metálicas varias Conjunto Residencial Campo Real en Popayán': {
    titulo: 'Constructora Carpol - Conjunto Campo Real',
    descripcion: 'Estructuras metálicas varias'
  },

  '2A. Etapa. Estructuras metálicas varias': {
    titulo: 'Pollos Bucanero - Estructuras Etapa 2',
    descripcion: 'Estructuras metálicas varias'
  },

  'Estructuras metálicas fábrica Caloto Cauca': {
    titulo: 'Alpical - Fábrica Caloto',
    descripcion: 'Estructuras metálicas fábrica'
  },

  'VELKAR S.A. Estructura metálica de cubierta para bodega  de TEXCINTAS en Cali': {
    titulo: 'Velkar - Bodega Texcintas Cali',
    descripcion: 'Estructura metálica cubierta bodega'
  },

  'Estructura de Cubierta para Estación de Servicio en Manizales': {
    titulo: 'Calderón y Jaramillo - Estación Servicio Manizales',
    descripcion: 'Estructura cubierta estación servicio'
  },

  // ===== 2006 (10 proyectos) =====
  'Cali': {
    titulo: 'Velkar - CC Único Etapa 3 Cali',
    descripcion: 'Estructura metálica cubierta y soporte'
  },

  'Estructura metálica cubierta Clubhouse Urbanización Palmera Real de Cali.': {
    titulo: 'Constructora Meléndez - Clubhouse Palmera Real',
    descripcion: 'Estructura metálica cubierta clubhouse'
  },

  'Estructuras y cubierta sede Cali': {
    titulo: 'DCI Arte - Sede Cali',
    descripcion: 'Estructuras y cubierta'
  },

  'Estructura de Cubierta en sede de Cali': {
    titulo: 'Colegio Colombo Británico - Cubierta Sede',
    descripcion: 'Estructura cubierta'
  },

  'Estructura metálica mezaninne y escalera de acceso': {
    titulo: 'Pollos Bucanero - Mezanine y Escalera',
    descripcion: 'Estructura metálica mezanine'
  },

  'INCICO LTDA. Diseño y construcción estructura metálica bodega Cementos Argos en Yumbo Valle del Cauca': {
    titulo: 'Incico - Bodega Cementos Argos Yumbo',
    descripcion: 'Diseño y construcción estructura bodega'
  },

  'Estructura básica de soporte edificio de 4 plantas': {
    titulo: 'Clínica Excellence - Soporte Edificio 4 Plantas',
    descripcion: 'Estructura básica soporte'
  },

  'CAUCA. Diseño y construcción Coliseo Cubierto Plaza Principal': {
    titulo: 'Municipio Miranda - Coliseo Plaza Principal',
    descripcion: 'Diseño y construcción coliseo'
  },

  'Arq. JAIME CÁRDENAS Y ASOCS. Estructuras metálicas en Universidad San Buenaventura de Cali': {
    titulo: 'Jaime Cárdenas - U. San Buenaventura Cali',
    descripcion: 'Estructuras metálicas universidad'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando títulos de proyectos 2007-2006...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2006-01-01'),
        lt: new Date('2008-01-01')
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
