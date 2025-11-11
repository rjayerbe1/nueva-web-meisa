/**
 * Script FINAL para actualizar TODOS los títulos restantes (2005-1996)
 * Total: 53 proyectos
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulosFinales = {
  // ===== 2005 (8 proyectos) =====
  'MIRA TU SALUD EPS. Reforzamiento edificio de 5 plantas en Bogotá y obras metálicas varias': {
    titulo: 'Mira Tu Salud EPS - Reforzamiento Edificio Bogotá',
    descripcion: 'Reforzamiento edificio 5 plantas y obras metálicas'
  },

  'Instalación 1.800 mts. Tubería de hierro dúctil acueducto del río Palacé y diseño y construcción puentes vehiculares que soportan el acueducto. Popayán.': {
    titulo: 'Consorcio Acuanorte - Acueducto Río Palacé',
    descripcion: 'Instalación tubería 1800m y puentes vehiculares'
  },

  'Estructura metálica para Plaza de Mercado Villarrica Cauca': {
    titulo: 'Juan Carlos Canencio - Plaza Mercado Villarrica',
    descripcion: 'Estructura metálica plaza mercado'
  },

  'Diseño y construcción puentes peatonales y caballares en Mosoco, Cuetando, Triunfo y Pueblo Nuevo-Belalcazar Cauca': {
    titulo: 'Tierradentro - Puentes Peatonales Cauca',
    descripcion: 'Diseño y construcción 4 puentes'
  },

  'Diseño y construcción estructuras metálicas para fábrica TEXCINTAS S.A. en Cali': {
    titulo: 'Velkar - Estructuras Fábrica Texcintas',
    descripcion: 'Diseño y construcción estructuras fábrica'
  },

  'VELKAR S.A.  Cubiertas parqueaderos edificio Plazuela del Sur en Cali': {
    titulo: 'Velkar - Cubiertas Plazuela del Sur',
    descripcion: 'Cubiertas parqueaderos edificio'
  },

  'Estructura básica y de cubierta , obra civil y acabados en Sede Cali Ciudad 2000': {
    titulo: 'Colegio Santa Isabel - Sede Cali Ciudad 2000',
    descripcion: 'Estructura, cubierta, obra civil y acabados'
  },

  'Construcción de 14 puentes metálicos en apartamentos - Cali.    Longitud 58.80 mts.': {
    titulo: 'Constructora Pijao - 14 Puentes Apartamentos',
    descripcion: 'Construcción 14 puentes metálicos'
  },

  // ===== 2004 (3 proyectos) =====
  'ACUEDUCTO Y ALCANTARILLADO DE POPAYÁN S.A. Diseño y construcción viaducto para soportar tubería PVC  sobre Autopista del Norte, vía Popayán - Timbío.': {
    titulo: 'Acueducto Popayán - Viaducto Autopista Norte',
    descripcion: 'Diseño y construcción viaducto tubería'
  },

  'PROGRAMA TIERRADENTRO . UNIÓN EUROPEA -Diseño y construcción puentes peatonales y caballares en Yaquivá - Tierradentro - Cauca.': {
    titulo: 'Tierradentro - Puentes Peatonales Yaquivá',
    descripcion: 'Diseño y construcción puentes'
  },

  'CONTORCIÓ CONCONCRETO RAMON H. ALMACEN ÉXITO Estructura metálica y obras complementarias Ampliación. Cali': {
    titulo: 'Consorcio Conconcreto - Almacén Éxito Cali',
    descripcion: 'Estructura metálica ampliación'
  },

  // ===== 2003 (6 proyectos) =====
  'Estructuras metálicas Plaza de Mercado Piendam Cauca': {
    titulo: 'Municipio Piendamó - Plaza Mercado',
    descripcion: 'Estructuras metálicas plaza mercado'
  },

  'Diseño y construcción estructura metálica bodega Cali': {
    titulo: 'Carboquímica - Bodega Cali',
    descripcion: 'Diseño y construcción estructura bodega'
  },

  'Diseño, Fabricación y Montaje Estructura Metálica del edificio para apartamentos en Vía Panamericana Sur, Jamundí Cauca': {
    titulo: 'Constructora Suárez - Edificio Apartamentos Jamundí',
    descripcion: 'Diseño, fabricación y montaje estructura'
  },

  'COLEGIO SANTA LIBRADA - Diseño y construcción Coliseo Cubierto en Cali': {
    titulo: 'Colegio Santa Librada - Coliseo Cali',
    descripcion: 'Diseño y construcción coliseo'
  },

  'Diseño, fabricación y montaje de estructuras en bodega de Cali': {
    titulo: 'Coltabaco - Estructuras Bodega Cali',
    descripcion: 'Diseño, fabricación y montaje estructuras'
  },

  'Diseño y construcción  de estructuras varias en Tuluá': {
    titulo: 'Riopaila - Estructuras Tuluá',
    descripcion: 'Diseño y construcción estructuras'
  },

  // ===== 2002 (6 proyectos) =====
  'Diseño y construcción puente peatonal Belalcázar - San Andrés de Pisimbalá - Cauca.  L = 127 mts.': {
    titulo: 'Municipio Belalcázar - Puente Peatonal Pisimbalá',
    descripcion: 'Diseño y construcción puente 127m'
  },

  'Diseño, fabricación y montaje estructura metálica edificio Administrativo en Cali': {
    titulo: 'Consorcio RCS - Edificio Administrativo Cali',
    descripcion: 'Diseño, fabricación y montaje estructura'
  },

  'Fabricación y montaje cubierta Cuarteles Tercera Brigada Ejército Nacional - Popayán': {
    titulo: 'Tercera Brigada Ejército - Cubierta Cuarteles',
    descripcion: 'Fabricación y montaje cubierta'
  },

  'Fabricación y montaje entrepisos metálicos en Cali. Área: 460 M2': {
    titulo: 'Coltejer - Entrepisos Metálicos Cali',
    descripcion: 'Fabricación y montaje entrepisos 460m²'
  },

  'Fabricación y Montaje cubierta (2 módulos) de Estación de Bombeo de Aguas Residuales Cali. Río Cauca - Cali': {
    titulo: 'Emcali - Cubierta Estación Bombeo Río Cauca',
    descripcion: 'Fabricación y montaje cubierta estación'
  },

  'Fabricación y Montaje estructura metálica Plaza de Mercado de Piendamó Cauca.': {
    titulo: 'Municipio Piendamó - Estructura Plaza Mercado',
    descripcion: 'Fabricación y montaje estructura'
  },

  // ===== 2001 (9 proyectos) =====
  'Diseño y construcción Estructura Metálica edificio de 4 pisos Administración Regional del Huila, Caja Agraria.    Neiva - Huila.': {
    titulo: 'Caja Agraria - Edificio Administración Neiva',
    descripcion: 'Diseño y construcción estructura 4 pisos'
  },

  'Fabricación y Montaje estructura metálica en bodega para embotelladora La Sultana S.A. en Palmira': {
    titulo: 'La Sultana - Estructura Bodega Palmira',
    descripcion: 'Fabricación y montaje estructura'
  },

  'Diseño y Construcción de Estructuras Metálicas  para tres Torres del Complejo Residencial LOMA DE LA VEGA en Popayán': {
    titulo: 'Constructora Fénix - Torres Loma de la Vega',
    descripcion: 'Diseño y construcción estructuras 3 torres'
  },

  'Fabricación y Montaje estructuras metálicas para fachada en Local Comercial de Cali': {
    titulo: 'Inversiones M&G - Fachada Local Cali',
    descripcion: 'Fabricación y montaje estructuras fachada'
  },

  'Fabricación y Montaje de pasarela "Villa Colombia" en Cali.    Longitud 46 mts.': {
    titulo: 'Secretaría Tránsito - Pasarela Villa Colombia',
    descripcion: 'Fabricación y montaje pasarela 46m'
  },

  'Fabricación y Montaje estructura metálica de entrepiso en Tuluá': {
    titulo: 'Riopaila - Entrepiso Metálico Tuluá',
    descripcion: 'Fabricación y montaje entrepiso'
  },

  'Diseño y construcción de estructuras metálicas de 3 entrepisos en Mercacentro de Cali': {
    titulo: 'Mercacentro - 3 Entrepisos Cali',
    descripcion: 'Diseño y construcción 3 entrepisos'
  },

  'Fabricación y Montaje para Plantas Térmicas de generación eléctrica en Popayán.   Peso Total:  145  TONS.': {
    titulo: 'Municipio Popayán - Plantas Térmicas',
    descripcion: 'Fabricación y montaje plantas generación 145 tons'
  },

  'Fabricación y Montaje cubierta y tanque elevado en Cali': {
    titulo: 'Ingenio Mayagüez - Cubierta y Tanque Cali',
    descripcion: 'Fabricación y montaje cubierta y tanque'
  },

  // ===== 2000 (7 proyectos) =====
  'Fabricación y montaje de cubierta para Banca de Valores en Cali': {
    titulo: 'Banca Valores - Cubierta Cali',
    descripcion: 'Fabricación y montaje cubierta'
  },

  'Fabricación y montaje estructura metálica de edificio para venta de vehículos en Cali': {
    titulo: 'Comercializadora Automotriz - Edificio Cali',
    descripcion: 'Fabricación y montaje estructura'
  },

  'Instalación y Montaje estructura metálica de bodegas para la E.P.S. EPSI CAPRESUB  en Popayán': {
    titulo: 'Epsi Capresub - Bodegas Popayán',
    descripcion: 'Instalación y montaje estructura bodegas'
  },

  'Diseño y construcción de  estructura metálica para Centro de Acopio de Café en el Tambo - Cauca.': {
    titulo: 'Comité Cafeteros - Centro Acopio El Tambo',
    descripcion: 'Diseño y construcción estructura centro'
  },

  'Diseño y construcción estructura metálica para Coliseo Cubierto de fútbol y basquetbol en El Bordo - Cauca': {
    titulo: 'Municipio Patía - Coliseo El Bordo',
    descripcion: 'Diseño y construcción coliseo fútbol y basquetbol'
  },

  'Diseño y construcción puente peatonal y vehicular sobre el Río Mondomo-Cauca     L = 32 mts': {
    titulo: 'Municipio Buenos Aires - Puente Río Mondomo',
    descripcion: 'Diseño y construcción puente 32m'
  },

  'Fabricación y montaje de tanque elevado metálico en acero inoxidable para guardar agua tratada en Tuluá': {
    titulo: 'Riopaila - Tanque Elevado Tuluá',
    descripcion: 'Fabricación y montaje tanque acero inoxidable'
  },

  // ===== 1999 (8 proyectos) =====
  'Diseño, fabricación y montaje Estructura Metálica de cubierta para Estadio Santa Rita en Popayán': {
    titulo: 'Indeportes Cauca - Estadio Santa Rita',
    descripcion: 'Diseño, fabricación y montaje cubierta estadio'
  },

  'Fabricación y Montaje estructura de puente peatonal: Avenida Ciudad de Cali con Carrera 68, Cali L= 36.5 mts': {
    titulo: 'ANDI - Puente Peatonal Av. Ciudad de Cali',
    descripcion: 'Fabricación y montaje puente 36.5m'
  },

  'Suministro, fabricación y montaje de estructuras metálicas varias para Almacén Carrefour en Cali': {
    titulo: 'Carrefour - Estructuras Almacén Cali',
    descripcion: 'Suministro, fabricación y montaje estructuras'
  },

  'Fabricación y montaje estructura metálica para Centro Comercial Los Andes en Tuluá Valle': {
    titulo: 'Constructora Alpes - CC Los Andes Tuluá',
    descripcion: 'Fabricación y montaje estructura'
  },

  'Diseño y construcción de estructura metálica y cubierta para el polideportivo Municipal de Timbío - Cauca.': {
    titulo: 'Municipio Timbío - Polideportivo',
    descripcion: 'Diseño y construcción estructura y cubierta'
  },

  'Fabricación y Montaje de cubierta feria del libro en Cali': {
    titulo: 'Cámara Comercio - Cubierta Feria del Libro',
    descripcion: 'Fabricación y montaje cubierta'
  },

  'Diseño y construcción de estructura y cubierta metálica para Planta de tratamiento de Aguas en Popayán': {
    titulo: 'Acueducto Popayán - Planta Tratamiento',
    descripcion: 'Diseño y construcción estructura planta'
  },

  'Diseño y construcción de Estructuras Metálicas de cubierta para puestos de venta del Municipio de Villarrica - Cauca': {
    titulo: 'Municipio Villarrica - Puestos Venta',
    descripcion: 'Diseño y construcción estructuras puestos'
  },

  // ===== 1998 (5 proyectos) =====
  'Estructuras metálicas varias. Complejo de apartamentos': {
    titulo: 'Constructora Pirámide - Complejo Apartamentos',
    descripcion: 'Estructuras metálicas complejo'
  },

  'Fabricación y montaje de cubierta metálica': {
    titulo: 'Frigorífico Guadalajara - Cubierta',
    descripcion: 'Fabricación y montaje cubierta'
  },

  'Construcción estructura metálica y cubierta en Planta de Tratamiento de aguas servidas. Popayán': {
    titulo: 'Acueducto Popayán - Planta Tratamiento',
    descripcion: 'Construcción estructura y cubierta planta'
  },

  'Diseño y construcción estructura metálica  para entrepiso  E.P.S.I. CAPRESUB': {
    titulo: 'Epsi Capresub - Entrepiso',
    descripcion: 'Diseño y construcción entrepiso'
  },

  'Diseño y construcción estructura metálica para Puente Peatonal El Jordán. Santander de Quilichao - Cauca. Longitud 28 mts.': {
    titulo: 'Municipio Santander - Puente El Jordán',
    descripcion: 'Diseño y construcción puente 28m'
  },

  // ===== 1996 (1 proyecto) =====
  'Diseño y construcción de estructura metálica para bodegas de la Central de Abastos en Cali': {
    titulo: 'Cavasa - Bodegas Central Abastos',
    descripcion: 'Diseño y construcción estructura bodegas'
  }
}

async function actualizarTitulosFinales() {
  console.log('🚀 ACTUALIZACIÓN FINAL: 2005-1996 (53 proyectos)...\n')

  const proyectos = await prisma.proyectoHojaVida.findMany({
    where: {
      fechaFin: {
        gte: new Date('1996-01-01'),
        lt: new Date('2006-01-01')
      },
      tituloDisplay: null
    },
    orderBy: {
      fechaFin: 'desc'
    }
  })

  let actualizados = 0
  let noEncontrados = 0

  for (const proyecto of proyectos) {
    const mapping = titulosFinales[proyecto.objetoContrato]

    if (mapping) {
      await prisma.proyectoHojaVida.update({
        where: { id: proyecto.id },
        data: {
          tituloDisplay: mapping.titulo,
          descripcionSecundaria: mapping.descripcion
        }
      })

      const año = new Date(proyecto.fechaFin).getFullYear()
      console.log(`✓ [${año}] ${mapping.titulo}`)
      actualizados++
    } else {
      const año = new Date(proyecto.fechaFin).getFullYear()
      console.log(`⚠️  [${año}] No encontrado: ${proyecto.objetoContrato.substring(0, 60)}...`)
      noEncontrados++
    }
  }

  console.log('\n' + '━'.repeat(60))
  console.log(`✅ Total proyectos procesados: ${proyectos.length}`)
  console.log(`✓  Proyectos actualizados: ${actualizados}`)
  if (noEncontrados > 0) {
    console.log(`⚠️  Proyectos no encontrados: ${noEncontrados}`)
  }

  await prisma.$disconnect()
}

actualizarTitulosFinales()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
