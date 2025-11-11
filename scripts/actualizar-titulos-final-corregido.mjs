/**
 * Script para actualizar los últimos 48 proyectos (2005-1996)
 * Con strings EXACTOS de la base de datos
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const titulos = {
  // ===== 2005 (3 proyectos) =====
  'Instalación 1.800 mts. Tubería de hierro dúctil acueducto del río Palacé y diseño y construcción de 5 viaductos metálicos.           Longitud 130 mts.': {
    titulo: 'Consorcio Acuanorte - Acueducto Río Palacé',
    descripcion: 'Tubería y 5 viaductos metálicos'
  },

  'Cali.    Longitud 58.80 mts.': {
    titulo: 'Constructora Pijao - 14 Puentes Metálicos',
    descripcion: 'Puentes para apartamentos'
  },

  'UNIÓN EUROPEA - Diseño y construcción puentes peatonales y caballares en Mosoco, Calderas y Cohetando, Depto. Del Cauca.  Longitud 45 mts.': {
    titulo: 'Programa Tierradentro - Puentes Peatonales Cauca',
    descripcion: '3 puentes en Mosoco, Calderas y Cohetando'
  },

  // ===== 2004 (3 proyectos) =====
  'ACUEDUCTO Y ALCANTARILLADO DE POPAYÁN S.A. Diseño y construcción viaducto para soportar tubería PVC de 1200 mm                                       Longitud 27,50 mts': {
    titulo: 'Acueducto Popayán - Viaducto Tubería',
    descripcion: 'Diseño y construcción viaducto PVC 1200mm'
  },

  'PROGRAMA TIERRADENTRO . UNIÓN EUROPEA -Diseño y construcción puentes peatonales y caballares en Yaquivá, Segovia, Carrizales y La Estrella (Cauca) Longitud 94 mts.': {
    titulo: 'Programa Tierradentro - Puentes Yaquivá',
    descripcion: '4 puentes peatonales y caballares'
  },

  'CONTORCIÓ CONCONCRETO RAMON H. ALMACEN ÉXITO Estructura metálica y obras complementarias Ampliación.': {
    titulo: 'Consorcio Conconcreto - Almacén Éxito',
    descripcion: 'Estructura metálica ampliación'
  },

  // ===== 2003 (6 proyectos) =====
  'POPAYÁN - estructura metálica de cubierta.': {
    titulo: 'Iglesia de Dios Ministerial - Popayán',
    descripcion: 'Estructura metálica cubierta'
  },

  'CALI diseño y construcción de estructura metálica para Coliseo Deportivo Dúplex en la ciudad de Cali.': {
    titulo: 'Colegio Sta. Isabel de Hungría - Coliseo',
    descripcion: 'Diseño y construcción coliseo deportivo'
  },

  'UNIÓN TEMPORAL CENTRO COMERCIAL POPULAR. Estructura para Centro Comercial en Pasto': {
    titulo: 'UT Centro Comercial Popular - Pasto',
    descripcion: 'Estructura centro comercial'
  },

  'Puente vehicular en vigas metálicas y losa de concreto sobre Metaldeck  carretera Tacueyó- López Depto. Del Cauca.                        Longitud 12 mts.': {
    titulo: 'Fertécnica - Puente Tacueyó-López',
    descripcion: 'Puente vehicular vigas metálicas'
  },

  'Viaductos para soportar tuberías 500 mm Ingenio Providencia Valle del Cauca                                                      Longitud 70 mts.': {
    titulo: 'Construcciones e Ingeniería - Ingenio Providencia',
    descripcion: 'Viaductos para tuberías'
  },

  'Estructura metálica de cubierta para Centro de Acopio en La Vega - Cauca.': {
    titulo: 'Ing. Álvaro Carvajal - Centro Acopio La Vega',
    descripcion: 'Estructura metálica cubierta'
  },

  // ===== 2002 (6 proyectos) =====
  'CONCRECAUCA LTDA. Estructuras metálicas, silos y pavimento de concreto, planta de Prefabricados en Puerto Tejada, Cauca': {
    titulo: 'Concrecauca - Planta Prefabricados',
    descripcion: 'Estructuras, silos y pavimento'
  },

  'Puente peatonal "Sesecito" en Timbiquí Cauca.                                         Longitud 22 mts.': {
    titulo: 'Ing. Hernán Vallejo - Puente Sesecito Timbiquí',
    descripcion: 'Puente peatonal'
  },

  'Ings. AURA TULIA URBANO, REGINA SOLARTE y EDUARDO CASTRILLON, estructuras metálicas para Coliseos del Plan Colombia en Almaguer,Cajibío, Morales, Caldono y Florencia- Depto. Del Cauca': {
    titulo: 'Plan Colombia - 5 Coliseos Cauca',
    descripcion: 'Coliseos en Almaguer, Cajibío, Morales, Caldono y Florencia'
  },

  'estructura metálica Hospital de Timbiquí, Cauca.': {
    titulo: 'Ing. Hernán Vallejo - Hospital Timbiquí',
    descripcion: 'Estructura metálica hospital'
  },

  'Puente colgante sobre el río El Molino, Paispamba Cauca     Longitud 25 mts.': {
    titulo: 'Ing. Jesús Albeiro Vásquez - Puente Paispamba',
    descripcion: 'Puente colgante río El Molino'
  },

  'Puente peatonal colgante río Dos Brazos en Popayán                          Longitud 28 mts.': {
    titulo: 'Ing. Jorge Palechor - Puente Dos Brazos',
    descripcion: 'Puente peatonal colgante'
  },

  // ===== 2001 (9 proyectos) =====
  'Estructura metálica para fábrica en Popayán.': {
    titulo: 'Vidrios y Aluminios Elsol - Fábrica Popayán',
    descripcion: 'Estructura metálica fábrica'
  },

  'Puente vehicular quebrada "El Lucero" Tierradentro Cauca.         Longitud : 16 mts.': {
    titulo: 'Corporación Nasa Kiwe - Puente El Lucero',
    descripcion: 'Puente vehicular quebrada'
  },

  'Estructura metálica para Plaza de Mercado en Corinto Cauca.': {
    titulo: 'Ing. Juan Carlos Canencio - Plaza Mercado Corinto',
    descripcion: 'Estructura metálica plaza'
  },

  'J.M.D. CONSTRUCCIÓN LTDA. Construcción dos puentes vehiculares Cartón de Colombia, Cauca. Longitud 20 mts.': {
    titulo: 'JMD Construcción - Puentes Cartón Colombia',
    descripcion: '2 puentes vehiculares'
  },

  'Construcción estructuras metálicas y rejas de seguridad, Penitenciaría San Isidro Popayán Cauca': {
    titulo: 'Consorcio QM San Isidro - Penitenciaría',
    descripcion: 'Estructuras y rejas seguridad'
  },

  'Refuerzo puente vehicular Cameguadua, Chinchiná, Caldas        longitud 10 mts.': {
    titulo: 'Calderón y Jaramillo - Refuerzo Puente Cameguadua',
    descripcion: 'Refuerzo puente vehicular'
  },

  'Estructura metálica de cubierta  y entrepisos, Planta de La Unión, Valle del Cauca': {
    titulo: 'Ready Fruit Company - Planta La Unión',
    descripcion: 'Estructura cubierta y entrepisos'
  },

  'Dos esculturas "Tierradentro"': {
    titulo: 'Gobernación del Cauca - Esculturas Tierradentro',
    descripcion: 'Dos esculturas metálicas'
  },

  'Estructura metálica para fábrica de quesos Delvechio - Bogotá': {
    titulo: 'Calderón y Jaramillo - Fábrica Delvechio',
    descripcion: 'Estructura metálica fábrica quesos'
  },

  // ===== 2000 (7 proyectos) =====
  'Estructura metálica Plaza de Mercado en Guapi, Depto. Del Cauca': {
    titulo: 'Ing. Juan Carlos Mejía - Plaza Mercado Guapi',
    descripcion: 'Estructura metálica plaza'
  },

  'Estructura metálica edificio Banco Coopdesarrollo en Jamundí': {
    titulo: 'Ing. Diego Carvajal - Banco Coopdesarrollo Jamundí',
    descripcion: 'Estructura metálica edificio'
  },

  'Estructuras metálicas para  bodegas C.I. Valle': {
    titulo: 'Ing. Ricardo Arboleda - Bodegas C.I. Valle',
    descripcion: 'Estructuras metálicas bodegas'
  },

  'Diseño y construcción de dos puentes peatonales en San José del Palmar Departamento del Chocó               longitud : 37 mts.': {
    titulo: 'Fondo Nal. Caminos Vecinales - Puentes Chocó',
    descripcion: '2 puentes peatonales San José del Palmar'
  },

  'Soportes metálicos para conducción acueducto Pílamo -Caloto  longitud 800 mts.': {
    titulo: 'Ing. Andrés Castrillón - Acueducto Pílamo-Caloto',
    descripcion: 'Soportes metálicos conducción'
  },

  'Carpintería metálica y cerramiento para Urbanización Villa del Viento - Popayán 400 viviendas': {
    titulo: 'Constructora Carpol - Villa del Viento',
    descripcion: 'Carpintería y cerramiento 400 viviendas'
  },

  'Estructuras básicas y de cubierta para el Condominio "Costa Esmeralda" en Panamá.': {
    titulo: 'Calderón & Jaramillo - Condominio Panamá',
    descripcion: 'Estructuras básicas y cubierta'
  },

  // ===== 1999 (8 proyectos) =====
  'Puente peatonal sobre el río Molino, sector Universidad-Hospital.    Longitud 18 mts.': {
    titulo: 'Municipio Popayán - Puente Río Molino',
    descripcion: 'Puente peatonal sector Universidad-Hospital'
  },

  'MADECONS LTDA. Diseño y construcción de dos puentes metálicos, carretera circunvalar Pasto  Longitud 25 mts c/u.': {
    titulo: 'Madecons - 2 Puentes Circunvalar Pasto',
    descripcion: 'Diseño y construcción puentes'
  },

  'Estructuras metálicas de cubierta y entrepisos Edificio Droguería Humanitaria de Cali': {
    titulo: 'Constructora Ayacar - Droguería Humanitaria',
    descripcion: 'Estructuras cubierta y entrepisos'
  },

  'Estructura metálica cubierta para fábrica en el Parque Industrial Popayán': {
    titulo: 'Aroma del Cauca - Fábrica Parque Industrial',
    descripcion: 'Estructura metálica cubierta'
  },

  'Puente sobre el río Napi para conducción tubería  de acueducto       longitud 117 mts.': {
    titulo: 'Municipio Guapi - Puente Río Napi',
    descripcion: 'Puente para tubería acueducto'
  },

  'Construcción de vigas, pen- dolones y suministro cables para puente colgante vehicular  La Troja en Tierradentro.         Longitud 103 mts.': {
    titulo: 'Corporación Nasa Kiwe - Puente La Troja',
    descripcion: 'Puente colgante vehicular'
  },

  // Nota: Hay dos con el mismo objetoContrato para Aroma del Cauca y Yazaki Metrex
  // Este es para Yazaki Metrex (necesitamos buscar por entidad)

  'Santander de Quilichao - Cubierta metálica iglesia Parroquial': {
    titulo: 'Parroquia Niño Jesús - Santander Quilichao',
    descripcion: 'Cubierta metálica iglesia'
  },

  // ===== 1998 (5 proyectos) =====
  'Diseño y construcción estructuras  metálicas para el Edificio Edgar Negret Popayán': {
    titulo: 'Lotería del Cauca - Edificio Edgar Negret',
    descripcion: 'Diseño y construcción estructuras'
  },

  'Diseño y construcción de estructuras metálicas para tres bodegas  en el Parque Industrial de Popayán': {
    titulo: 'Guido Gavilanes y Oscar Ruiz - 3 Bodegas',
    descripcion: 'Estructuras parque industrial'
  },

  'Diseño y construcción de Coliseos Polideportivos en los barrios Palacé, Alfonso López, La Esmeralda, Pandiguando, Chuni, Colegio Negret, Berlín, Sauces, Independencia y La Paz': {
    titulo: 'Municipio Popayán - 10 Coliseos Barrios',
    descripcion: 'Coliseos polideportivos en 10 barrios'
  },

  'ENTIDADES DE ORDEN DEPARTAMENTAL Y MUNICIPAL Diseño y Construcción de Coliseos Polideportivos en Santa Rosa, Piendamó, Corinto, La Sierra, Timbiquí y Santander de Quilichao (Cauca) y Tumaco (Nariño)': {
    titulo: 'Entidades Dptal. y Municipal - 7 Coliseos',
    descripcion: 'Coliseos en Cauca y Nariño'
  },

  'Diseño y construcción Coliseo Cubierto en el Campus de Popayán': {
    titulo: 'Universidad del Cauca - Coliseo Campus',
    descripcion: 'Diseño y construcción coliseo cubierto'
  },

  // ===== 1996 (1 proyecto) =====
  'Diseño y construcción de la  estructura metálica y cubierta para planta de producción en Pasto': {
    titulo: 'Friesland Colombia - Planta Pasto',
    descripcion: 'Diseño y construcción estructura y cubierta'
  }
}

async function actualizarTitulos() {
  console.log('🔄 Actualizando últimos 48 proyectos (2005-1996)...\n')

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
  let noEncontrados = []

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
      console.log(`✓ [${año}] ${mapping.titulo}`)
      actualizados++
    } else {
      const año = new Date(proyecto.fechaFin).getFullYear()
      noEncontrados.push({
        año,
        entidad: proyecto.entidadContratante,
        objeto: proyecto.objetoContrato
      })
    }
  }

  console.log('\n' + '━'.repeat(60))
  console.log(`✅ Total proyectos procesados: ${proyectos.length}`)
  console.log(`✓  Proyectos actualizados: ${actualizados}`)

  if (noEncontrados.length > 0) {
    console.log(`\n⚠️  No encontrados (${noEncontrados.length}):`)
    noEncontrados.forEach(p => {
      console.log(`\n[${p.año}] ${p.entidad}`)
      console.log(`"${p.objeto}"`)
    })
  }

  await prisma.$disconnect()
}

actualizarTitulos()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
