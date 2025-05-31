import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAllProjects() {
  try {
    console.log('🏗️ Iniciando creación de todos los proyectos del portafolio...')
    
    // 1. CENTROS COMERCIALES (8 proyectos)
    console.log('\n📍 Creando Centros Comerciales...')
    
    const centroComercialProjects = [
      {
        titulo: "Centro Comercial Campanario",
        descripcion: "Cimentación, estructura metálica y cubiertas ampliación",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ARINSA",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2020-01-01'),
        fechaFin: new Date('2021-06-01'),
        estado: "COMPLETADO",
        slug: "centro-comercial-campanario",
        createdBy: "default-user-id", // Placeholder
        imagenes: [
          "Centro-campanario-1.webp", "Centro-campanario-2.webp", "Centro-campanario-3.webp",
          "Centro-campanario-4.webp", "Centro-campanario-5.webp", "Centro-campanario-6.webp", "Centro-campanario-7.webp"
        ]
      },
      {
        nombre: "Paseo Villa del Río",
        descripcion: "Estructura metálica de rampas, losa y racks",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Ménsula Ingenieros S.A",
        ubicacion: "Bogotá, Cundinamarca",
        peso: 420,
        area: null,
        fechaInicio: new Date('2019-06-01'),
        fechaFin: new Date('2020-12-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Centro-paseo-villa-del-rio-1-400x400.webp", "Centro-paseo-villa-del-rio-2-400x400.webp",
          "Centro-paseo-villa-del-rio-3-400x400.webp", "Centro-paseo-villa-del-rio-4-400x400.webp", "Centro-paseo-villa-del-rio-5-400x400.webp"
        ]
      },
      {
        nombre: "Centro Comercial Monserrat",
        descripcion: "Estructura Metálica y Cubierta",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Adriana Rivera SAS",
        ubicacion: "Popayán, Cauca",
        peso: null,
        area: null,
        fechaInicio: new Date('2018-03-01'),
        fechaFin: new Date('2019-08-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Monserrat-Plaza.jpg", "Monserrat-Plaza3.jpg", "Monserrat-Plaza-1.jpg",
          "monserrat-5.jpg", "Monserrat-Plaza3-1.jpg",
          "Centro-monserrat-1.webp", "Centro-monserrat-2.webp", "Centro-monserrat-3.webp", "Centro-monserrat-4.webp", "Centro-monserrat-5.webp"
        ]
      },
      {
        nombre: "Centro Comercial Unico Cali",
        descripcion: "Construcción de obra civil, estructura metálica y cubierta",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Unitres SAS",
        ubicacion: "Cali, Valle",
        peso: 790,
        area: null,
        fechaInicio: new Date('2017-04-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Centro-unico-cali-1.webp", "Centro-unico-cali-2.webp", "Centro-unico-cali-3.webp", "Centro-unico-cali-4.webp", "Centro-unico-cali-5.webp"
        ]
      },
      {
        nombre: "Centro Comercial Unico Neiva",
        descripcion: "Estructura Metálica y Cubierta",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Colpatria SAS",
        ubicacion: "Neiva, Huila",
        peso: 902,
        area: null,
        fechaInicio: new Date('2016-08-01'),
        fechaFin: new Date('2018-02-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Centro-unico-neiva-1.webp", "Centro-unico-neiva-2.webp", "Centro-unico-neiva-3.webp", "Centro-unico-neiva-4.webp", "Centro-unico-neiva-5.webp"
        ]
      },
      {
        nombre: "Centro Comercial Unico Barranquilla",
        descripcion: "Estructura Metálica y Cubierta",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Centros Comerciales de la Costa SAS",
        ubicacion: "Barranquilla, Atlántico",
        peso: null,
        area: null,
        fechaInicio: new Date('2015-01-01'),
        fechaFin: new Date('2016-06-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Centro-unico-barranquilla-2.webp", "Centro-unico-barranquilla-3.webp"
        ]
      },
      {
        nombre: "Centro Comercial Armenia Plaza",
        descripcion: "Estructura metálica",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ER Inversiones",
        ubicacion: "Armenia, Quindío",
        peso: null,
        area: null,
        fechaInicio: new Date('2014-05-01'),
        fechaFin: new Date('2015-12-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "CC-ARMENIA-PLAZA-1.jpeg", "CC-ARMENIA-PLAZA-5.jpeg",
          "Centro-armenia-plaza-1.webp", "Centro-armenia-plaza-2.webp", "Centro-armenia-plaza-3.webp", "Centro-armenia-plaza-4.webp"
        ]
      },
      {
        nombre: "Centro Comercial Bochalema Plaza",
        descripcion: "Estructura metálica",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Normandía",
        ubicacion: "Cali, Valle del Cauca",
        peso: 1781,
        area: 16347,
        fechaInicio: new Date('2013-02-01'),
        fechaFin: new Date('2014-09-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Centro-Comercial-Bochalema-Plaza-Cali.jpg",
          "Centro-bochalema-plaza-1.webp", "Centro-bochalema-plaza-2.webp", "Centro-bochalema-plaza-3.webp", 
          "Centro-bochalema-plaza-4.webp", "Centro-bochalema-plaza-5.webp", "Centro-bochalema-plaza-6.webp", 
          "Centro-bochalema-plaza-7.webp", "Centro-bochalema-plaza-8.webp", "Centro-bochalema-plaza-9.webp"
        ]
      }
    ]
    
    // 2. EDIFICIOS (9 proyectos)
    console.log('\n🏢 Creando Edificios...')
    
    const edificioProjects = [
      {
        nombre: "Cinemateca Distrital",
        descripcion: "Estructura metálica",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Cine Cultura Bogotá",
        ubicacion: "Bogotá, Cundinamarca",
        peso: 490,
        area: null,
        fechaInicio: new Date('2020-03-01'),
        fechaFin: new Date('2021-10-01'),
        estado: "COMPLETADO",
        esPortada: true,
        url: "https://meisa.com.co/project/edificios-cinemateca-distrital/",
        imagenes: [
          "Edificio-cinemateca-distrital-1.webp", "Edificio-cinemateca-distrital-2.webp", "Edificio-cinemateca-distrital-3.webp",
          "Edificio-cinemateca-distrital-4.webp", "Edificio-cinemateca-distrital-5.webp", "Edificio-cinemateca-distrital-6.webp"
        ]
      },
      {
        nombre: "Clínica Reina Victoria",
        descripcion: "Cimentación y estructura metálica",
        categoria: "EDIFICIOS",
        cliente: "INVERSIONES M&L GROUP S.A.S.",
        ubicacion: "Popayán, Cauca",
        peso: 815,
        area: null,
        fechaInicio: new Date('2019-08-01'),
        fechaFin: new Date('2021-03-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-clinica-reina-victoria-1.webp", "Edificio-clinica-reina-victoria-2.webp", "Edificio-clinica-reina-victoria-3.webp",
          "Edificio-clinica-reina-victoria-4.webp", "Edificio-clinica-reina-victoria-5.webp", "Edificio-clinica-reina-victoria-6.webp",
          "Edificio-clinica-reina-victoria-7.webp"
        ]
      },
      {
        nombre: "Edificio Omega",
        descripcion: "Estructura Metálica",
        categoria: "EDIFICIOS",
        cliente: "Omega",
        ubicacion: "Cali, Valle",
        peso: null,
        area: null,
        fechaInicio: new Date('2018-06-01'),
        fechaFin: new Date('2019-12-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-omega-1.webp", "Edificio-omega-2.webp", "Edificio-omega-3.webp", "Edificio-omega-4.webp"
        ]
      },
      {
        nombre: "Bomberos Popayán",
        descripcion: "Estructura Metálica",
        categoria: "EDIFICIOS",
        cliente: "Cuerpo de bomberos voluntarios de Popayán",
        ubicacion: "Popayán, Cauca",
        peso: null,
        area: null,
        fechaInicio: new Date('2017-09-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-bomberos-popayan-1.webp", "Edificio-bomberos-popayan-2.webp", "Edificio-bomberos-popayan-3.webp",
          "Edificio-bomberos-popayan-4.webp", "Edificio-bomberos-popayan-5.webp"
        ]
      },
      {
        nombre: "Estación MIO Guadalupe",
        descripcion: "Estructura metálica",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle",
        peso: 654,
        area: null,
        fechaInicio: new Date('2016-04-01'),
        fechaFin: new Date('2017-08-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-estacion-mio-guadalupe-1.webp", "Edificio-estacion-mio-guadalupe-2.webp", "Edificio-estacion-mio-guadalupe-3.webp",
          "Edificio-estacion-mio-guadalupe-4.webp", "Edificio-estacion-mio-guadalupe-5.webp", "Edificio-estacion-mio-guadalupe-6.webp"
        ]
      },
      {
        nombre: "SENA Santander",
        descripcion: "Estructura Metálica",
        categoria: "EDIFICIOS",
        cliente: "Sena",
        ubicacion: "Santander, Cauca",
        peso: null,
        area: null,
        fechaInicio: new Date('2015-07-01'),
        fechaFin: new Date('2016-12-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-sena-santander-1.webp", "Edificio-sena-santander-2.webp", "Edificio-sena-santander-3.webp", "Edificio-sena-santander-4.webp"
        ]
      },
      {
        nombre: "Terminal Intermedio MIO",
        descripcion: "Estructura metálica",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle del Cauca",
        peso: 654,
        area: 8842,
        fechaInicio: new Date('2014-11-01'),
        fechaFin: new Date('2016-05-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-terminal-intermedio-mio-cali-1.webp", "Edificio-terminal-intermedio-mio-cali-2.webp", "Edificio-terminal-intermedio-mio-cali-3.webp",
          "Edificio-terminal-intermedio-mio-cali-4.webp", "Edificio-terminal-intermedio-mio-cali-5.webp", "Edificio-terminal-intermedio-mio-cali-6.webp",
          "Edificio-terminal-intermedio-mio-cali-7.webp", "Edificio-terminal-intermedio-mio-cali-8.webp"
        ]
      },
      {
        nombre: "Tequendama Parking Cali",
        descripcion: "Estructura metálica y obra civil",
        categoria: "EDIFICIOS",
        cliente: "No especificado",
        ubicacion: "Cali, Valle del Cauca",
        peso: 156,
        area: 9633,
        fechaInicio: new Date('2013-08-01'),
        fechaFin: new Date('2014-10-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-tequendama-parking-cali-1.webp", "Edificio-tequendama-parking-cali-2.webp", "Edificio-tequendama-parking-cali-3.webp",
          "Edificio-tequendama-parking-cali-4.webp", "Edificio-tequendama-parking-cali-5.webp", "Edificio-tequendama-parking-cali-6.webp",
          "Edificio-tequendama-parking-cali-7.webp", "Edificio-tequendama-parking-cali-8.webp"
        ]
      },
      {
        nombre: "Módulos Médicos",
        descripcion: "Estructuras modulares médicas",
        categoria: "EDIFICIOS",
        cliente: "No especificado",
        ubicacion: "No especificada",
        peso: null,
        area: null,
        fechaInicio: new Date('2012-06-01'),
        fechaFin: new Date('2013-03-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Edificio-modulos-medicos-1.webp", "Edificio-modulos-medicos-2.webp", "Edificio-modulos-medicos-3.webp", "Edificio-modulos-medicos-4.webp"
        ]
      }
    ]
    
    // 3. INDUSTRIA (7 proyectos)
    console.log('\n🏭 Creando proyectos de Industria...')
    
    const industriaProjects = [
      {
        nombre: "Ampliación Cargill",
        descripcion: "Estructura metálica y cubierta ampliación",
        categoria: "INDUSTRIA",
        cliente: "Cargill Colombia",
        ubicacion: "Villa Rica, Cauca",
        peso: 175,
        area: null,
        fechaInicio: new Date('2020-02-01'),
        fechaFin: new Date('2021-07-01'),
        estado: "COMPLETADO",
        esPortada: true,
        url: "https://meisa.com.co/project/industria-ampliacion-cargill/",
        imagenes: [
          "Industria-ampliacion-cargill-1-400x400.webp", "Industria-ampliacion-cargill-2-400x400.webp", "Industria-ampliacion-cargill-3-400x400.webp",
          "Industria-ampliacion-cargill-4-400x400.webp", "Industria-ampliacion-cargill-5-400x400.webp", "Industria-ampliacion-cargill-6-400x400.webp"
        ]
      },
      {
        nombre: "Torre Cogeneración Propal",
        descripcion: "Estructura metálica",
        categoria: "INDUSTRIA",
        cliente: "Propal",
        ubicacion: "Yumbo, Valle del Cauca",
        peso: 110,
        area: null,
        fechaInicio: new Date('2019-04-01'),
        fechaFin: new Date('2020-06-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-torre-cogeneracion-propal-1.webp", "Industria-torre-cogeneracion-propal-2.webp", "Industria-torre-cogeneracion-propal-3.webp",
          "Industria-torre-cogeneracion-propal-4.webp", "Industria-torre-cogeneracion-propal-5.webp"
        ]
      },
      {
        nombre: "Bodega Duplex Ingeniería",
        descripcion: "Estructura metálica",
        categoria: "INDUSTRIA",
        cliente: "Duplex Ingeniería",
        ubicacion: "Colombia",
        peso: null,
        area: null,
        fechaInicio: new Date('2018-08-01'),
        fechaFin: new Date('2019-05-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-bodega-duplex-1.webp", "Industria-bodega-duplex-2.webp", "Industria-bodega-duplex-3.webp", "Industria-bodega-duplex-4.webp"
        ]
      },
      {
        nombre: "Bodega Intera",
        descripcion: "Estructura metálica",
        categoria: "INDUSTRIA",
        cliente: "Intera SAS",
        ubicacion: "Santander, Cauca",
        peso: 79,
        area: null,
        fechaInicio: new Date('2017-11-01'),
        fechaFin: new Date('2018-08-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-bodega-intera-1.webp", "Industria-bodega-intera-2.webp", "Industria-bodega-intera-3.webp", "Industria-bodega-intera-4.webp"
        ]
      },
      {
        nombre: "Tecnofar",
        descripcion: "Estructura metálica",
        categoria: "INDUSTRIA",
        cliente: "Constructora Inverteq S.A.S",
        ubicacion: "Villa Rica, Cauca",
        peso: 612,
        area: 5141,
        fechaInicio: new Date('2016-05-01'),
        fechaFin: new Date('2017-12-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-tecnofar-1.webp", "Industria-tecnofar-2.webp", "Industria-tecnofar-3.webp", "Industria-tecnofar-4.webp", "Industria-tecnofar-5.webp"
        ]
      },
      {
        nombre: "Bodega Protecnica Etapa II",
        descripcion: "Estructura metálica, fachada y cubierta",
        categoria: "INDUSTRIA",
        cliente: "Protecnica Ingenieria SAS",
        ubicacion: "Yumbo, Valle",
        peso: 28,
        area: null,
        fechaInicio: new Date('2015-09-01'),
        fechaFin: new Date('2016-04-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-bodega-protecnica-etapa-dos-1.webp", "Industria-bodega-protecnica-etapa-dos-2.webp", "Industria-bodega-protecnica-etapa-dos-3.webp",
          "Industria-bodega-protecnica-etapa-dos-4.webp", "Industria-bodega-protecnica-etapa-dos-5.webp", "Industria-bodega-protecnica-etapa-dos-6.webp",
          "Industria-bodega-protecnica-etapa-dos-7.webp"
        ]
      },
      {
        nombre: "Tecnoquímicas Jamundí",
        descripcion: "Estructura metálica",
        categoria: "INDUSTRIA",
        cliente: "Tecnoquímicas S.A.",
        ubicacion: "Jamundí, Valle del Cauca",
        peso: 508,
        area: 3676,
        fechaInicio: new Date('2014-03-01'),
        fechaFin: new Date('2015-08-01'),
        estado: "COMPLETADO",
        esPortada: false,
        imagenes: [
          "Industria-tecnoquimicas-jamundi-1.webp", "Industria-tecnoquimicas-jamundi-2.webp", "Industria-tecnoquimicas-jamundi-3.webp",
          "Industria-tecnoquimicas-jamundi-4.webp", "Industria-tecnoquimicas-jamundi-5.webp"
        ]
      }
    ]

    // Crear todos los proyectos
    const allProjects = [...centroComercialProjects, ...edificioProjects, ...industriaProjects]
    
    for (const projectData of allProjects) {
      const { imagenes, ...proyecto } = projectData
      
      console.log(`Creando proyecto: ${proyecto.nombre}`)
      
      const newProject = await prisma.proyecto.create({
        data: proyecto,
      })
      
      // Crear las imágenes del proyecto
      if (imagenes && imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
          await prisma.imagenProyecto.create({
            data: {
              proyectoId: newProject.id,
              url: imagenes[i],
              alt: `${proyecto.nombre} - Imagen ${i + 1}`,
              esPortada: i === 0, // La primera imagen es la portada
              orden: i + 1,
            },
          })
        }
      }
    }
    
    console.log(`\n✅ Se han creado ${allProjects.length} proyectos exitosamente!`)
    console.log(`   - Centros Comerciales: ${centroComercialProjects.length}`)
    console.log(`   - Edificios: ${edificioProjects.length}`)
    console.log(`   - Industria: ${industriaProjects.length}`)
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAllProjects()