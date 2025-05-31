import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function createRemainingProjects() {
  try {
    console.log('🚧 Iniciando creación de proyectos restantes...')
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin')
    }
    
    // PUENTES VEHICULARES (8 proyectos)
    console.log('\n🌉 Creando Puentes Vehiculares...')
    
    const puentesVehicularesProjects = [
      {
        titulo: "Puente Vehicular Nolasco",
        descripcion: "Estructura metálica de 395 toneladas para puente vehicular en Nátaga, Huila.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio del Cauca",
        ubicacion: "Nátaga, Huila",
        fechaInicio: new Date('2018-05-01'),
        fechaFin: new Date('2019-11-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-nolasco-1.webp",
          "/uploads/projects/Puente-vehicular-nolasco-2.webp",
          "/uploads/projects/Puente-vehicular-nolasco-3.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Carrera 100",
        descripcion: "Estructura metálica de 420 toneladas para puente vehicular en Cali.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio Islas 2019",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2019-03-01'),
        fechaFin: new Date('2020-09-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-carrera-cien-1.webp",
          "/uploads/projects/Puente-vehicular-carrera-cien-2.webp",
          "/uploads/projects/Puente-vehicular-carrera-cien-3.webp",
          "/uploads/projects/Puente-vehicular-carrera-cien-4.webp",
          "/uploads/projects/Puente-vehicular-carrera-cien-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Cambrin",
        descripcion: "Estructura metálica de 250 toneladas para puente vehicular en Tolima.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio Cambrin 2017",
        ubicacion: "Tolima",
        fechaInicio: new Date('2017-08-01'),
        fechaFin: new Date('2018-12-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-cambrin-1.webp",
          "/uploads/projects/Puente-vehicular-cambrin-2.webp",
          "/uploads/projects/Puente-vehicular-cambrin-3.webp",
          "/uploads/projects/Puente-vehicular-cambrin-4.webp",
          "/uploads/projects/Puente-vehicular-cambrin-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Frisoles",
        descripcion: "Estructura metálica para puente vehicular en Pasto.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Pasto",
        fechaInicio: new Date('2016-10-01'),
        fechaFin: new Date('2017-07-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-frisoles-1.webp",
          "/uploads/projects/Puente-vehicular-frisoles-2.webp"
        ]
      },
      {
        titulo: "Puente Vehicular La 21",
        descripcion: "Estructura metálica de 151 toneladas para puente vehicular en Cali.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Unión Temporal Espacio 2015",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2015-04-01'),
        fechaFin: new Date('2016-02-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-la-veinti-uno-1.webp",
          "/uploads/projects/Puente-vehicular-la-veinti-uno-2.webp",
          "/uploads/projects/Puente-vehicular-la-veinti-uno-3.webp",
          "/uploads/projects/Puente-vehicular-la-veinti-uno-4.webp"
        ]
      },
      {
        titulo: "Puente Vehicular La Paila",
        descripcion: "Estructura metálica de 293 toneladas en la vía Santander de Quilichao – Río Desbaratado.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Unión Temporal E&R",
        ubicacion: "Vía Santander de Quilichao – Río Desbaratado, Cauca",
        fechaInicio: new Date('2014-06-01'),
        fechaFin: new Date('2015-09-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-la-paila-1.webp",
          "/uploads/projects/Puente-vehicular-la-paila-2.webp",
          "/uploads/projects/Puente-vehicular-la-paila-3.webp",
          "/uploads/projects/Puente-vehicular-la-paila-4.webp",
          "/uploads/projects/Puente-vehicular-la-paila-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Saraconcho",
        descripcion: "Estructura metálica para puente vehicular en Bolívar, Cauca.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Bolívar, Cauca",
        fechaInicio: new Date('2013-09-01'),
        fechaFin: new Date('2014-08-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Puente-vehicular-saraconcho-1.webp",
          "/uploads/projects/Puente-vehicular-saraconcho-2.webp",
          "/uploads/projects/Puente-vehicular-saraconcho-3.webp",
          "/uploads/projects/Puente-vehicular-saraconcho-4.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Río Negro",
        descripcion: "Estructura metálica de 53 toneladas para puente vehicular en Río Negro, Cauca.",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Río Negro, Cauca",
        fechaInicio: new Date('2012-11-01'),
        fechaFin: new Date('2013-06-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "/uploads/projects/puente-rio-negro-placeholder.webp"
        ]
      }
    ]

    // PUENTES PEATONALES (5 proyectos)
    console.log('\n🚶 Creando Puentes Peatonales...')
    
    const puentesPeatonalesProjects = [
      {
        titulo: "Escalinata Curva - Río Cali",
        descripcion: "Formaleta en estructura metálica de 30 toneladas para escalinata curva en el río Cali.",
        categoria: "PUENTES_PEATONALES",
        cliente: "UNIÓN TEMPORAL ESPACIO 2015",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2015-08-01'),
        fechaFin: new Date('2016-04-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente peatonal", "escalinata", "estructura metálica"],
        imagenes: [
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550615413-1.webp",
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550616078-2.webp",
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550616963-3.webp",
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550617593-4.webp",
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550618261-5.webp",
          "/uploads/projects/peatonales---esnata-curva-rio-1748548302372-1748550619489-6.webp"
        ]
      },
      {
        titulo: "Puente Peatonal Autopista Sur - Carrera 68",
        descripcion: "Estructura metálica de 128 toneladas para puente peatonal en Cali.",
        categoria: "PUENTES_PEATONALES",
        cliente: "CONSORCIO VÍAS DE CALI S.A.S.",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2016-02-01'),
        fechaFin: new Date('2017-01-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "/uploads/projects/peatonales---puente-autopista-sur---carrera-68-1748548302378-1748550627565-1.webp",
          "/uploads/projects/peatonales---puente-autopista-sur---carrera-68-1748548302378-1748550628203-2.webp",
          "/uploads/projects/peatonales---puente-autopista-sur---carrera-68-1748548302378-1748550628847-3.webp",
          "/uploads/projects/peatonales---puente-autopista-sur---carrera-68-1748548302378-1748550629441-4.webp"
        ]
      },
      {
        titulo: "Puente Peatonal La 63",
        descripcion: "Estructura metálica para puente peatonal en Cali.",
        categoria: "PUENTES_PEATONALES",
        cliente: "Cliente Público",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2014-11-01'),
        fechaFin: new Date('2015-08-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "/uploads/projects/peatonales---la-63-1748548302373-1748550621297-1.png",
          "/uploads/projects/peatonales---la-63-1748548302373-1748550622209-2.jpg",
          "/uploads/projects/peatonales---la-63-1748548302373-1748550623089-3.png"
        ]
      },
      {
        titulo: "Puente Peatonal La Tertulia",
        descripcion: "Estructura metálica de 8 toneladas para puente peatonal en Cali.",
        categoria: "PUENTES_PEATONALES",
        cliente: "Harold Méndez",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2013-05-01'),
        fechaFin: new Date('2014-02-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "/uploads/projects/peatonales---la-tertulia-1748548302377-1748550624339-1.webp",
          "/uploads/projects/peatonales---la-tertulia-1748548302377-1748550624980-2.webp",
          "/uploads/projects/peatonales---la-tertulia-1748548302377-1748550625570-3.webp",
          "/uploads/projects/peatonales---la-tertulia-1748548302377-1748550626260-4.webp"
        ]
      },
      {
        titulo: "Puente Peatonal Terminal Intermedio",
        descripcion: "Estructura metálica de 240 toneladas para puente peatonal del Terminal Intermedio MIO.",
        categoria: "PUENTES_PEATONALES",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2014-08-01'),
        fechaFin: new Date('2015-12-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica", "MIO"],
        imagenes: [
          "/uploads/projects/peatonales---terminal-intermedio-1748548302381-1748550631541-1.webp",
          "/uploads/projects/peatonales---terminal-intermedio-1748548302381-1748550632143-2.webp",
          "/uploads/projects/peatonales---terminal-intermedio-1748548302381-1748550632740-3.webp",
          "/uploads/projects/peatonales---terminal-intermedio-1748548302381-1748550633329-4.webp",
          "/uploads/projects/peatonales---terminal-intermedio-1748548302381-1748550633967-5.webp"
        ]
      }
    ]

    // ESCENARIOS DEPORTIVOS (6 proyectos)
    console.log('\n🏟️ Creando Escenarios Deportivos...')
    
    const escenariosDeportivosProjects = [
      {
        titulo: "Complejo Acuático Popayán",
        descripcion: "Obra civil y estructura metálica de 135 toneladas para complejo acuático en Popayán.",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Fondo mixto para promoción del deporte",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2012-01-01'),
        fechaFin: new Date('2012-10-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["escenario deportivo", "acuático", "estructura metálica"],
        imagenes: [
          "/uploads/projects/escenarios-deportivos-complejo-acuatico-popayan-1748550229386-1.webp",
          "/uploads/projects/escenarios-deportivos-complejo-acuatico-popayan-1748550229650-2.webp"
        ]
      },
      {
        titulo: "Coliseo Mayor Juegos Nacionales 2012",
        descripcion: "Obra civil y estructura metálica para Coliseo Mayor de los Juegos Nacionales 2012.",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "MAJA S.A.S.",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2011-06-01'),
        fechaFin: new Date('2012-09-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["escenario deportivo", "coliseo", "juegos nacionales"],
        imagenes: [
          "/uploads/projects/Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp",
          "/uploads/projects/Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp"
        ]
      },
      {
        titulo: "Coliseo de Artes Marciales Nacionales 2012",
        descripcion: "Obra civil y estructura metálica para Coliseo de Artes Marciales de los Juegos Nacionales 2012.",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "MAJA S.A.S.",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2011-08-01'),
        fechaFin: new Date('2012-07-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "artes marciales", "juegos nacionales"],
        imagenes: [
          "/uploads/projects/Escenario-deportivo-coliseo-de-artes-marciales-1.webp"
        ]
      },
      {
        titulo: "CECUN (Universidad del Cauca)",
        descripcion: "Estructura metálica y cubierta de 78 toneladas para edificio CECUN de la Universidad del Cauca.",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Consorcio Cecun",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2010-04-01'),
        fechaFin: new Date('2011-03-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "universidad", "estructura metálica"],
        imagenes: [
          "/uploads/projects/Escenario-deportivo-cecun-1.webp",
          "/uploads/projects/Escenario-deportivo-cecun-2.webp",
          "/uploads/projects/Escenario-deportivo-cecun-3.webp",
          "/uploads/projects/Escenario-deportivo-cecun-4.webp",
          "/uploads/projects/Escenario-deportivo-cecun-5.webp"
        ]
      },
      {
        titulo: "Cancha Javeriana Cali",
        descripcion: "Estructura metálica, cerramientos y cubierta de 117 toneladas para cancha deportiva.",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Pontificia Universidad Javeriana",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2009-08-01'),
        fechaFin: new Date('2010-12-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "universidad", "cancha"],
        imagenes: [
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-1.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-2.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-3.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-4.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-5.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-6.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-7.webp",
          "/uploads/projects/Escenario-deportivo-cancha-javeriana-cali-8.webp"
        ]
      }
    ]

    // Crear todos los proyectos
    const allProjects = [...puentesVehicularesProjects, ...puentesPeatonalesProjects, ...escenariosDeportivosProjects]
    
    for (const projectData of allProjects) {
      const { imagenes, ...proyecto } = projectData
      
      const slug = generateSlug(proyecto.titulo)
      console.log(`Creando proyecto: ${proyecto.titulo} (${slug})`)
      
      const newProject = await prisma.proyecto.create({
        data: {
          ...proyecto,
          slug,
          createdBy: adminUser.id,
        },
      })
      
      // Crear las imágenes del proyecto
      if (imagenes && imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
          await prisma.imagenProyecto.create({
            data: {
              proyectoId: newProject.id,
              url: imagenes[i],
              alt: `${proyecto.titulo} - Imagen ${i + 1}`,
              titulo: `${proyecto.titulo} - Imagen ${i + 1}`,
              orden: i + 1,
              tipo: i === 0 ? "PORTADA" : "GALERIA",
            },
          })
        }
      }
    }
    
    console.log(`\n✅ Se han creado ${allProjects.length} proyectos adicionales exitosamente!`)
    console.log(`   - Puentes Vehiculares: ${puentesVehicularesProjects.length}`)
    console.log(`   - Puentes Peatonales: ${puentesPeatonalesProjects.length}`)
    console.log(`   - Escenarios Deportivos: ${escenariosDeportivosProjects.length}`)
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createRemainingProjects()