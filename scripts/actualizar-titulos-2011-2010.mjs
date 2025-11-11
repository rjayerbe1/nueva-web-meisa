/**
 * Script para actualizar los títulos de proyectos 2011-2010 (17 proyectos)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2011 (12 proyectos) =====
  'VARELA FIHOLL & CIA. LTDA. Estructura metálica, cubiertas y carpintería metálica Colegio Matamoros Popayán': {
    titulo: 'Varela Fiholl - Colegio Matamoros Popayán',
    descripcion: 'Estructura metálica, cubiertas y carpintería'
  },

  'I.C.B.F. Estructuras metálicas y cubiertas en Guapi y El Bordo, Depto, del Cauca': {
    titulo: 'ICBF - Estructuras Guapi y El Bordo',
    descripcion: 'Estructuras metálicas y cubiertas'
  },

  'Estructura metálica mezaninne para bodega de cemento en Popayán': {
    titulo: 'Ferretería Maracaibo - Mezanine Bodega Popayán',
    descripcion: 'Estructura metálica mezanine'
  },

  'Estructura metálica y cubierta Colegio Jardín Social El Mirador, Popayán': {
    titulo: 'Comfacauca - Colegio Jardín Social El Mirador',
    descripcion: 'Estructura metálica y cubierta'
  },

  'ODINSA S.A. Diseño y construcción puente peatonal Romelia 2 en Dosquebradas Risaralda  Longitud 212 mts.': {
    titulo: 'Odinsa - Puente Peatonal Romelia 2 Risaralda',
    descripcion: 'Diseño y construcción puente 212m'
  },

  'CONSORCIO VIAS DE CALI S.A.S. Diseño y construcción   puente peatonal Autopista Sur x Carrera 63B de Cali': {
    titulo: 'Consorcio Vías Cali - Puente Autopista Sur x Cra 63B',
    descripcion: 'Diseño y construcción puente peatonal'
  },

  'CONSORCIO VIAS DE CALI S.A.S. Diseño y construcción puente peatonal Autopista Sur x Carrera 68 de Cali': {
    titulo: 'Consorcio Vías Cali - Puente Autopista Sur x Cra 68',
    descripcion: 'Diseño y construcción puente peatonal'
  },

  'Cubierta en teja Standing Seam para el Colegio de Puerto Tejada (Cauca)': {
    titulo: 'Comfacauca - Colegio Puerto Tejada',
    descripcion: 'Cubierta teja Standing Seam'
  },

  'Estructura metálica y cubierta para bodegas en Buenaventura (Valle)': {
    titulo: 'Calima Motors - Bodegas Buenaventura',
    descripcion: 'Estructura metálica y cubierta'
  },

  'Estructuras metálicas y cubiertas en teja Standing Seam para sede de Pasto.': {
    titulo: 'CC Único Pasto - Estructuras Sede Pasto',
    descripcion: 'Estructuras y cubiertas Standing Seam'
  },

  'Diseño y construcción puente peatonal Romelia 1 en Risaralda - Autopistas del Café. Long. 130 mts.': {
    titulo: 'Odinsa - Puente Peatonal Romelia 1 Risaralda',
    descripcion: 'Diseño y construcción puente 130m'
  },

  'EKA S.A. Estructuras metálicas  y entrepisos para la ampliación de la fábrica en Cali': {
    titulo: 'Eka - Ampliación Fábrica Cali',
    descripcion: 'Estructuras metálicas y entrepisos'
  },

  // ===== 2010 (5 proyectos) =====
  'Estructura metálica y cubierta Obra Jardín Social en Popayán': {
    titulo: 'Comfacauca - Jardín Social Popayán',
    descripcion: 'Estructura metálica y cubierta'
  },

  'Reparación y montaje puente peatonal Terminal de Transportes de Popayán  Longitud 70 mts.': {
    titulo: 'Manuel Muñoz - Puente Terminal Popayán',
    descripcion: 'Reparación y montaje puente 70m'
  },

  'Estructuras metálicas varias Matadero de Santander de Quilichao': {
    titulo: 'Consorcio Santander 3 - Matadero S. de Quilichao',
    descripcion: 'Estructuras metálicas matadero'
  },

  'CONSORCIO M.G. Puente vehicular metálico sobre el río Mazamorras (Cauca/Huila) Longitud 45 mts.': {
    titulo: 'Consorcio MG - Puente Río Mazamorras',
    descripcion: 'Puente vehicular 45m'
  },

  'POPAYÁN Coliseo Cubierto para el Colegio': {
    titulo: 'Colegio Colombo Francés - Coliseo Popayán',
    descripcion: 'Coliseo cubierto colegio'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando títulos de proyectos 2011-2010...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('2010-01-01'),
        lt: new Date('2012-01-01')
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
