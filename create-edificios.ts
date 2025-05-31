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

async function createEdificios() {
  try {
    console.log('🏢 Iniciando creación de proyectos de Edificios...')
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin')
    }
    
    const edificioProjects = [
      {
        titulo: "Cinemateca Distrital",
        descripcion: "Estructura metálica de 490 toneladas para la Cinemateca Distrital en Bogotá. Proyecto realizado para el Consorcio Cine Cultura Bogotá.",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Cine Cultura Bogotá",
        ubicacion: "Bogotá, Cundinamarca",
        fechaInicio: new Date('2020-03-01'),
        fechaFin: new Date('2021-10-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "edificio", "cultural"],
        imagenes: [
          "Edificio-cinemateca-distrital-1.webp", "Edificio-cinemateca-distrital-2.webp", "Edificio-cinemateca-distrital-3.webp",
          "Edificio-cinemateca-distrital-4.webp", "Edificio-cinemateca-distrital-5.webp", "Edificio-cinemateca-distrital-6.webp"
        ]
      },
      {
        titulo: "Clínica Reina Victoria",
        descripcion: "Cimentación y estructura metálica de 815 toneladas para la Clínica Reina Victoria en Popayán, Cauca.",
        categoria: "EDIFICIOS",
        cliente: "INVERSIONES M&L GROUP S.A.S.",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2019-08-01'),
        fechaFin: new Date('2021-03-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["cimentación", "estructura metálica", "edificio", "salud"],
        imagenes: [
          "Edificio-clinica-reina-victoria-1.webp", "Edificio-clinica-reina-victoria-2.webp", "Edificio-clinica-reina-victoria-3.webp",
          "Edificio-clinica-reina-victoria-4.webp", "Edificio-clinica-reina-victoria-5.webp", "Edificio-clinica-reina-victoria-6.webp",
          "Edificio-clinica-reina-victoria-7.webp"
        ]
      },
      {
        titulo: "Edificio Omega",
        descripcion: "Estructura Metálica para el Edificio Omega en Cali, Valle del Cauca.",
        categoria: "EDIFICIOS",
        cliente: "Omega",
        ubicacion: "Cali, Valle",
        fechaInicio: new Date('2018-06-01'),
        fechaFin: new Date('2019-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "edificio"],
        imagenes: [
          "Edificio-omega-1.webp", "Edificio-omega-2.webp", "Edificio-omega-3.webp", "Edificio-omega-4.webp"
        ]
      },
      {
        titulo: "Estación de Bomberos Popayán",
        descripcion: "Estructura Metálica para la nueva estación del Cuerpo de Bomberos Voluntarios de Popayán.",
        categoria: "EDIFICIOS",
        cliente: "Cuerpo de bomberos voluntarios de Popayán",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2017-09-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "edificio", "bomberos", "emergencias"],
        imagenes: [
          "Edificio-bomberos-popayan-1.webp", "Edificio-bomberos-popayan-2.webp", "Edificio-bomberos-popayan-3.webp",
          "Edificio-bomberos-popayan-4.webp", "Edificio-bomberos-popayan-5.webp"
        ]
      },
      {
        titulo: "Estación MIO Guadalupe",
        descripcion: "Estructura metálica de 654 toneladas para la Estación MIO Guadalupe en Cali.",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle",
        fechaInicio: new Date('2016-04-01'),
        fechaFin: new Date('2017-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "transporte", "MIO"],
        imagenes: [
          "Edificio-estacion-mio-guadalupe-1.webp", "Edificio-estacion-mio-guadalupe-2.webp", "Edificio-estacion-mio-guadalupe-3.webp",
          "Edificio-estacion-mio-guadalupe-4.webp", "Edificio-estacion-mio-guadalupe-5.webp", "Edificio-estacion-mio-guadalupe-6.webp"
        ]
      },
      {
        titulo: "SENA Santander",
        descripcion: "Estructura Metálica para las instalaciones del SENA en Santander, Cauca.",
        categoria: "EDIFICIOS",
        cliente: "Sena",
        ubicacion: "Santander, Cauca",
        fechaInicio: new Date('2015-07-01'),
        fechaFin: new Date('2016-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "educación", "SENA"],
        imagenes: [
          "Edificio-sena-santander-1.webp", "Edificio-sena-santander-2.webp", "Edificio-sena-santander-3.webp", "Edificio-sena-santander-4.webp"
        ]
      },
      {
        titulo: "Terminal Intermedio MIO",
        descripcion: "Estructura metálica de 654 toneladas en un área de 8,842 metros cuadrados para el Terminal Intermedio del MIO en Cali.",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2014-11-01'),
        fechaFin: new Date('2016-05-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "transporte", "MIO", "terminal"],
        imagenes: [
          "Edificio-terminal-intermedio-mio-cali-1.webp", "Edificio-terminal-intermedio-mio-cali-2.webp", "Edificio-terminal-intermedio-mio-cali-3.webp",
          "Edificio-terminal-intermedio-mio-cali-4.webp", "Edificio-terminal-intermedio-mio-cali-5.webp", "Edificio-terminal-intermedio-mio-cali-6.webp",
          "Edificio-terminal-intermedio-mio-cali-7.webp", "Edificio-terminal-intermedio-mio-cali-8.webp"
        ]
      },
      {
        titulo: "Tequendama Parking Cali",
        descripcion: "Estructura metálica y obra civil de 156 toneladas en un área de 9,633 metros cuadrados para parqueadero en Cali.",
        categoria: "EDIFICIOS",
        cliente: "Cliente Privado",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2013-08-01'),
        fechaFin: new Date('2014-10-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "obra civil", "parqueadero"],
        imagenes: [
          "Edificio-tequendama-parking-cali-1.webp", "Edificio-tequendama-parking-cali-2.webp", "Edificio-tequendama-parking-cali-3.webp",
          "Edificio-tequendama-parking-cali-4.webp", "Edificio-tequendama-parking-cali-5.webp", "Edificio-tequendama-parking-cali-6.webp",
          "Edificio-tequendama-parking-cali-7.webp", "Edificio-tequendama-parking-cali-8.webp"
        ]
      },
      {
        titulo: "Módulos Médicos",
        descripcion: "Estructuras modulares médicas prefabricadas para atención en salud.",
        categoria: "EDIFICIOS",
        cliente: "Sector Salud",
        ubicacion: "Colombia",
        fechaInicio: new Date('2012-06-01'),
        fechaFin: new Date('2013-03-01'),
        estado: "COMPLETADO",
        tags: ["estructuras modulares", "salud", "prefabricado"],
        imagenes: [
          "Edificio-modulos-medicos-1.webp", "Edificio-modulos-medicos-2.webp", "Edificio-modulos-medicos-3.webp", "Edificio-modulos-medicos-4.webp"
        ]
      }
    ]
    
    // Crear proyectos de edificios
    for (const projectData of edificioProjects) {
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
    
    console.log(`\n✅ Se han creado ${edificioProjects.length} proyectos de Edificios exitosamente!`)
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createEdificios()