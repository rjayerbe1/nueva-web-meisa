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

async function createIndustria() {
  try {
    console.log('🏭 Iniciando creación de proyectos de Industria...')
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin')
    }
    
    const industriaProjects = [
      {
        titulo: "Ampliación Cargill",
        descripcion: "Estructura metálica y cubierta ampliación de 175 toneladas para Cargill Colombia en Villa Rica, Cauca.",
        categoria: "INDUSTRIA",
        cliente: "Cargill Colombia",
        ubicacion: "Villa Rica, Cauca",
        fechaInicio: new Date('2020-02-01'),
        fechaFin: new Date('2021-07-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "cubierta", "ampliación", "industria"],
        imagenes: [
          "/images/projects/Industria-ampliacion-cargill-1-400x400.webp", 
          "/images/projects/Industria-ampliacion-cargill-2-400x400.webp", 
          "/images/projects/Industria-ampliacion-cargill-3-400x400.webp",
          "/images/projects/Industria-ampliacion-cargill-4-400x400.webp", 
          "/images/projects/Industria-ampliacion-cargill-5-400x400.webp", 
          "/images/projects/Industria-ampliacion-cargill-6-400x400.webp"
        ]
      },
      {
        titulo: "Torre Cogeneración Propal",
        descripcion: "Estructura metálica de 110 toneladas para Torre de Cogeneración de Propal en Yumbo, Valle del Cauca.",
        categoria: "INDUSTRIA",
        cliente: "Propal",
        ubicacion: "Yumbo, Valle del Cauca",
        fechaInicio: new Date('2019-04-01'),
        fechaFin: new Date('2020-06-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "torre", "cogeneración", "industria"],
        imagenes: [
          "/images/projects/Industria-torre-cogeneracion-propal-1.webp", 
          "/images/projects/Industria-torre-cogeneracion-propal-2.webp", 
          "/images/projects/Industria-torre-cogeneracion-propal-3.webp",
          "/images/projects/Industria-torre-cogeneracion-propal-4.webp", 
          "/images/projects/Industria-torre-cogeneracion-propal-5.webp"
        ]
      },
      {
        titulo: "Bodega Duplex Ingeniería",
        descripcion: "Estructura metálica para bodega industrial de Duplex Ingeniería.",
        categoria: "INDUSTRIA",
        cliente: "Duplex Ingeniería",
        ubicacion: "Colombia",
        fechaInicio: new Date('2018-08-01'),
        fechaFin: new Date('2019-05-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "bodega", "industria"],
        imagenes: [
          "/images/projects/Industria-bodega-duplex-1.webp", 
          "/images/projects/Industria-bodega-duplex-2.webp", 
          "/images/projects/Industria-bodega-duplex-3.webp", 
          "/images/projects/Industria-bodega-duplex-4.webp"
        ]
      },
      {
        titulo: "Bodega Intera",
        descripcion: "Estructura metálica de 79 toneladas para bodega de Intera SAS en Santander, Cauca.",
        categoria: "INDUSTRIA",
        cliente: "Intera SAS",
        ubicacion: "Santander, Cauca",
        fechaInicio: new Date('2017-11-01'),
        fechaFin: new Date('2018-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "bodega", "industria"],
        imagenes: [
          "/images/projects/Industria-bodega-intera-1.webp", 
          "/images/projects/Industria-bodega-intera-2.webp", 
          "/images/projects/Industria-bodega-intera-3.webp", 
          "/images/projects/Industria-bodega-intera-4.webp"
        ]
      },
      {
        titulo: "Tecnofar",
        descripcion: "Estructura metálica de 612 toneladas en un área de 5,141 metros cuadrados para Tecnofar en Villa Rica, Cauca.",
        categoria: "INDUSTRIA",
        cliente: "Constructora Inverteq S.A.S",
        ubicacion: "Villa Rica, Cauca",
        fechaInicio: new Date('2016-05-01'),
        fechaFin: new Date('2017-12-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "farmacéutica", "industria"],
        imagenes: [
          "/images/projects/Industria-tecnofar-1.webp", 
          "/images/projects/Industria-tecnofar-2.webp", 
          "/images/projects/Industria-tecnofar-3.webp", 
          "/images/projects/Industria-tecnofar-4.webp", 
          "/images/projects/Industria-tecnofar-5.webp"
        ]
      },
      {
        titulo: "Bodega Protecnica Etapa II",
        descripcion: "Estructura metálica, fachada y cubierta de 28 toneladas para Protecnica Ingeniería SAS en Yumbo, Valle.",
        categoria: "INDUSTRIA",
        cliente: "Protecnica Ingenieria SAS",
        ubicacion: "Yumbo, Valle",
        fechaInicio: new Date('2015-09-01'),
        fechaFin: new Date('2016-04-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "fachada", "cubierta", "bodega"],
        imagenes: [
          "/images/projects/Industria-bodega-protecnica-etapa-dos-1.webp", 
          "/images/projects/Industria-bodega-protecnica-etapa-dos-2.webp", 
          "/images/projects/Industria-bodega-protecnica-etapa-dos-3.webp",
          "/images/projects/Industria-bodega-protecnica-etapa-dos-4.webp", 
          "/images/projects/Industria-bodega-protecnica-etapa-dos-5.webp", 
          "/images/projects/Industria-bodega-protecnica-etapa-dos-6.webp",
          "/images/projects/Industria-bodega-protecnica-etapa-dos-7.webp"
        ]
      },
      {
        titulo: "Tecnoquímicas Jamundí",
        descripcion: "Estructura metálica de 508 toneladas en un área de 3,676 metros cuadrados para Tecnoquímicas S.A. en Jamundí, Valle del Cauca.",
        categoria: "INDUSTRIA",
        cliente: "Tecnoquímicas S.A.",
        ubicacion: "Jamundí, Valle del Cauca",
        fechaInicio: new Date('2014-03-01'),
        fechaFin: new Date('2015-08-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "farmacéutica", "industria"],
        imagenes: [
          "/images/projects/Industria-tecnoquimicas-jamundi-1.webp", 
          "/images/projects/Industria-tecnoquimicas-jamundi-2.webp", 
          "/images/projects/Industria-tecnoquimicas-jamundi-3.webp",
          "/images/projects/Industria-tecnoquimicas-jamundi-4.webp", 
          "/images/projects/Industria-tecnoquimicas-jamundi-5.webp"
        ]
      }
    ]
    
    // Crear proyectos de industria
    for (const projectData of industriaProjects) {
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
    
    console.log(`\n✅ Se han creado ${industriaProjects.length} proyectos de Industria exitosamente!`)
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createIndustria()