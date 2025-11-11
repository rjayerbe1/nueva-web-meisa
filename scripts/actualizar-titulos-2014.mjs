/**
 * Script para actualizar los títulos de proyectos 2014 (21 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos2014 = {
  'Villagorgona - Subestación Eléctrica': {
    titulo: 'Pollos Bucanero - Subestación Eléctrica',
    descripcion: 'Estructura metálica subestación'
  },

  'Cali - Estructura Metálica & Cubierta': {
    titulo: 'Park Plaza - Estructura y Cubierta Cali',
    descripcion: 'Estructura metálica y cubierta'
  },

  'Barandas para puentes sector La Lupa - Cauca': {
    titulo: 'Consorcio Competitividad - Barandas La Lupa',
    descripcion: 'Barandas metálicas puentes'
  },

  'Edificio World Trade Center Pacific, estructura metálica y cubierta': {
    titulo: 'Constructora Colpatria - WTC Pacific',
    descripcion: 'Estructura metálica y cubierta edificio'
  },

  'Construcción puente vehicular "Frisoles" - Ancuyá Nariño                       Longitud 48 mts.': {
    titulo: 'Orlando Revelo - Puente Frisoles Ancuyá',
    descripcion: 'Construcción puente vehicular 48m'
  },

  'Municipio Paez -Construcción Puentes Peatonales: El Cristo L=58m, El Buco L=39m y San Vicente L=126m': {
    titulo: 'Mejía Santander - Puentes Peatonales Paez',
    descripcion: 'Construcción 3 puentes peatonales'
  },

  'Valledupar - Estructura Metálica y Cubierta Colegio Chiriqui': {
    titulo: 'Consorcio APV - Colegio Chiriqui Valledupar',
    descripcion: 'Estructura metálica y cubierta'
  },

  'Laguna Seca - Estructura Metálica Casa': {
    titulo: 'Obando Lodoño - Casa Laguna Seca',
    descripcion: 'Estructura metálica residencial'
  },

  'Cali - Estructura Metálica y Cubierta Locales Avenida Cañasgordas': {
    titulo: 'Arboleda Rojas - Locales Av. Cañasgordas',
    descripcion: 'Estructura metálica y cubierta locales'
  },

  'Popayán - Estructura Metálica Dispensario Popayán': {
    titulo: 'Peláez Hernández - Dispensario Popayán',
    descripcion: 'Estructura metálica dispensario'
  },

  'Estructura metálica para Edificio Torre': {
    titulo: 'Ingenio Mayagüez - Edificio Torre',
    descripcion: 'Estructura metálica edificio'
  },

  'Villagorgona - Proyecto Pollo Campesino & Cuartos Fríos': {
    titulo: 'Pollos Bucanero - Pollo Campesino y Cuartos Fríos',
    descripcion: 'Estructura metálica planta y refrigeración'
  },

  'Cali - Estructura Metálica Conjunto Residencial Lombar Día Club House': {
    titulo: 'Constructora Habitek - Club House Lombar Día',
    descripcion: 'Estructura metálica club house'
  },

  'Villagorgona - Cubierta Pasillo & Nuevo Casino': {
    titulo: 'Pollos Bucanero - Cubierta Pasillo y Casino',
    descripcion: 'Cubierta pasillo y casino'
  },

  'Villagorgona - Sala de Maquinas': {
    titulo: 'Pollos Bucanero - Sala de Máquinas',
    descripcion: 'Estructura metálica sala máquinas'
  },

  'Villagorgona - 3 Niveles y Cubierta  Subproductos': {
    titulo: 'Pollos Bucanero - Edificio Subproductos',
    descripcion: 'Estructura metálica 3 niveles y cubierta'
  },

  'YUMBO - Parqueaderos y cinemas': {
    titulo: 'CC Único Yumbo - Parqueaderos y Cinemas',
    descripcion: 'Estructuras metálicas'
  },

  'Popayán - Cubierta Local Comercial Alberto VO5': {
    titulo: 'Construcciones Proformas - Local Alberto VO5',
    descripcion: 'Cubierta local comercial'
  },

  'Villagorgona - Hangar Pollo en Pie': {
    titulo: 'Pollos Bucanero - Hangar Pollo en Pie',
    descripcion: 'Estructura metálica hangar'
  },

  'Cali - Estructura Metálica para Bodega DIAN': {
    titulo: 'Consorcio PIC - Bodega DIAN Cali',
    descripcion: 'Estructura metálica bodega'
  }
}

async function actualizarTitulos2014() {
  console.log('🔄 Actualizando títulos de proyectos 2014...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2014-01-01'),
        lt: new Date('2015-01-01')
      }
    },
    orderBy: {
      fechaFin: 'asc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulos2014[proyecto.objetoContrato]

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

actualizarTitulos2014()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
