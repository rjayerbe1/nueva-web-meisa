#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const actualizaciones = [
  {
    anio: 1996,
    titulo: "1996: Friesland Colombia - Primera Planta Industrial en Pasto",
    descripcion: "Año del inicio con Friesland Colombia, construyendo 611 m² de estructura metálica para su planta industrial en Pasto, marcando nuestro primer gran proyecto en la industria alimentaria del Cauca."
  },
  {
    anio: 1998,
    titulo: "1998: Coliseos Polideportivos y Universidad del Cauca - 17 Escenarios Deportivos",
    descripcion: "Año de consolidación en infraestructura deportiva con 17 coliseos polideportivos construidos en todo el Cauca, y obras de reforzamiento estructural para la Universidad del Cauca en Popayán."
  },
  {
    anio: 1999,
    titulo: "1999: Yazaki Metrex y Madecons - Industria y Primeros Puentes Metálicos",
    descripcion: "Año de expansión con 80 toneladas de estructura metálica para Yazaki Metrex (3,000 m² de planta industrial) y nuestros primeros puentes metálicos: Puente Hato Viejo (117 m de longitud) y puentes peatonales en La Viña, Bolívar, Mercaderes y El Rosario."
  },
  {
    anio: 2000,
    titulo: "2000: Calderón & Jaramillo - Primer Proyecto Internacional en Panamá",
    descripcion: "Año histórico que marca nuestro primer proyecto internacional con Calderón & Jaramillo en Panamá, construyendo 1,510 m² de estructura metálica. También obras importantes con Frigopesca en Tumaco y continuamos con puentes peatonales en varios municipios."
  },
  {
    anio: 2001,
    titulo: "2001: Calderón y Jaramillo y Ready Fruit - Industria Alimentaria y Puentes",
    descripcion: "Año de grandes proyectos industriales con Calderón y Jaramillo (3,322 m² en Panamá) y Ready Fruit (3,579 m²). Construimos el Puente Vehicular de Naya (4,115 m² de estructura) y comenzamos el Programa Tierradentro con 5 puentes colgantes."
  },
  {
    anio: 2002,
    titulo: "2002: Plan Colombia y Puentes Colgantes - 5 Coliseos en el Cauca",
    descripcion: "Año de alto impacto social con 231 toneladas de estructura metálica para 5 coliseos del Plan Colombia en Argelia, Cajibío, Balboa, La Vega y Timbío. Continuamos el Programa Tierradentro con 7 puentes colgantes adicionales y obras para Cervecería Leona."
  },
  {
    anio: 2003,
    titulo: "2003: Ingenio Providencia y Centro Comercial Pasto",
    descripcion: "Año de diversificación con proyectos industriales para Ingenio Providencia (1,200 m² de planta) y nuestro primer centro comercial en Pasto (1,650 m² de estructura). También trabajos con Cartones del Cauca y puentes peatonales en Timbío."
  },
  {
    anio: 2004,
    titulo: "2004: Programa Tierradentro UE y Acueducto Popayán",
    descripcion: "Año de infraestructura vial y sanitaria finalizando el Programa Tierradentro (financiado por la Unión Europea) con 5 puentes colgantes vehiculares adicionales. También construimos estructuras metálicas para el Acueducto de Popayán y obras para Empaques del Cauca."
  }
]

async function main() {
  console.log('🔄 Actualizando ResumenAnio para años 1995-2004...\n')

  for (const update of actualizaciones) {
    const { anio, titulo, descripcion } = update

    try {
      // Verificar si existe
      const existe = await prisma.resumenAnio.findUnique({
        where: { anio }
      })

      if (existe) {
        // Actualizar
        await prisma.resumenAnio.update({
          where: { anio },
          data: { titulo, descripcion }
        })
        console.log(`✅ ${anio}: Actualizado`)
        console.log(`   Título: ${titulo}`)
        console.log(`   Desc: ${descripcion.substring(0, 80)}...\n`)
      } else {
        console.log(`⚠️  ${anio}: No existe ResumenAnio, se omite`)
      }
    } catch (error) {
      console.error(`❌ Error en año ${anio}:`, error)
    }
  }

  console.log('\n✨ Actualización completada!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
