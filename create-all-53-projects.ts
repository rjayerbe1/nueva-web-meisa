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

async function createAll53Projects() {
  try {
    console.log('🚀 Iniciando creación de TODOS los 53+ proyectos...')
    
    // Eliminar todos los proyectos existentes primero
    await prisma.imagenProyecto.deleteMany({})
    await prisma.proyecto.deleteMany({})
    console.log('🧹 Base de datos limpiada')
    
    // Buscar usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin')
    }
    
    const allProjects = [
      // 🏬 CENTROS COMERCIALES (8 proyectos)
      {
        titulo: "Centro Comercial Campanario",
        descripcion: "Cimentación, estructura metálica y cubiertas ampliación en Popayán, Cauca",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ARINSA",
        ubicacion: "Popayán, Cauca",
        toneladas: 2500,
        fechaInicio: new Date('2020-01-01'),
        fechaFin: new Date('2021-06-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "cubiertas", "cimentación"],
        imagenes: [
          "Centro-campanario-1.webp", "Centro-campanario-2.webp", "Centro-campanario-3.webp",
          "Centro-campanario-4.webp", "Centro-campanario-5.webp", "Centro-campanario-6.webp", "Centro-campanario-7.webp"
        ]
      },
      {
        titulo: "Paseo Villa del Río",
        descripcion: "Estructura metálica de rampas, losa y racks en Bogotá",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Ménsula Ingenieros S.A",
        ubicacion: "Bogotá, Cundinamarca",
        toneladas: 420,
        fechaInicio: new Date('2019-06-01'),
        fechaFin: new Date('2020-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "rampas"],
        imagenes: [
          "Centro-paseo-villa-del-rio-1-400x400.webp", "Centro-paseo-villa-del-rio-2-400x400.webp",
          "Centro-paseo-villa-del-rio-3-400x400.webp", "Centro-paseo-villa-del-rio-4-400x400.webp", "Centro-paseo-villa-del-rio-5-400x400.webp"
        ]
      },
      {
        titulo: "Centro Comercial Monserrat",
        descripcion: "Estructura Metálica y Cubierta en Popayán",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Adriana Rivera SAS",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2018-03-01'),
        fechaFin: new Date('2019-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta"],
        imagenes: [
          "Monserrat-Plaza.jpg", "Monserrat-Plaza3.jpg", "Monserrat-Plaza-1.jpg",
          "monserrat-5.jpg", "Monserrat-Plaza3-1.jpg",
          "Centro-monserrat-1.webp", "Centro-monserrat-2.webp", "Centro-monserrat-3.webp", "Centro-monserrat-4.webp", "Centro-monserrat-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Cali",
        descripcion: "Construcción de obra civil, estructura metálica y cubierta",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Unitres SAS",
        ubicacion: "Cali, Valle",
        toneladas: 790,
        fechaInicio: new Date('2017-04-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        tags: ["obra civil", "estructura metálica", "cubierta"],
        imagenes: [
          "Centro-unico-cali-1.webp", "Centro-unico-cali-2.webp", "Centro-unico-cali-3.webp", "Centro-unico-cali-4.webp", "Centro-unico-cali-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Neiva",
        descripcion: "Estructura Metálica y Cubierta en Neiva",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Colpatria SAS",
        ubicacion: "Neiva, Huila",
        toneladas: 902,
        fechaInicio: new Date('2016-08-01'),
        fechaFin: new Date('2018-02-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta"],
        imagenes: [
          "Centro-unico-neiva-1.webp", "Centro-unico-neiva-2.webp", "Centro-unico-neiva-3.webp", "Centro-unico-neiva-4.webp", "Centro-unico-neiva-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Barranquilla",
        descripcion: "Estructura Metálica y Cubierta en Barranquilla",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Centros Comerciales de la Costa SAS",
        ubicacion: "Barranquilla, Atlántico",
        fechaInicio: new Date('2015-01-01'),
        fechaFin: new Date('2016-06-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta"],
        imagenes: [
          "Centro-unico-barranquilla-2.webp", "Centro-unico-barranquilla-3.webp"
        ]
      },
      {
        titulo: "Centro Comercial Armenia Plaza",
        descripcion: "Estructura metálica en Armenia",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ER Inversiones",
        ubicacion: "Armenia, Quindío",
        fechaInicio: new Date('2014-05-01'),
        fechaFin: new Date('2015-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica"],
        imagenes: [
          "CC-ARMENIA-PLAZA-1.jpeg", "CC-ARMENIA-PLAZA-5.jpeg",
          "Centro-armenia-plaza-1.webp", "Centro-armenia-plaza-2.webp", "Centro-armenia-plaza-3.webp", "Centro-armenia-plaza-4.webp"
        ]
      },
      {
        titulo: "Centro Comercial Bochalema Plaza",
        descripcion: "Estructura metálica de gran envergadura en Cali",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Normandía",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 1781,
        areaTotal: 16347,
        fechaInicio: new Date('2013-02-01'),
        fechaFin: new Date('2014-09-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica"],
        imagenes: [
          "Centro-Comercial-Bochalema-Plaza-Cali.jpg",
          "Centro-bochalema-plaza-1.webp", "Centro-bochalema-plaza-2.webp", "Centro-bochalema-plaza-3.webp", 
          "Centro-bochalema-plaza-4.webp", "Centro-bochalema-plaza-5.webp", "Centro-bochalema-plaza-6.webp", 
          "Centro-bochalema-plaza-7.webp", "Centro-bochalema-plaza-8.webp", "Centro-bochalema-plaza-9.webp"
        ]
      },

      // 🏢 EDIFICIOS (9 proyectos)
      {
        titulo: "Cinemateca Distrital",
        descripcion: "Estructura metálica para la Cinemateca Distrital en Bogotá",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Cine Cultura Bogotá",
        ubicacion: "Bogotá, Cundinamarca",
        toneladas: 490,
        fechaInicio: new Date('2020-03-01'),
        fechaFin: new Date('2021-10-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "cultural"],
        imagenes: [
          "Edificio-cinemateca-distrital-1.webp", "Edificio-cinemateca-distrital-2.webp", "Edificio-cinemateca-distrital-3.webp",
          "Edificio-cinemateca-distrital-4.webp", "Edificio-cinemateca-distrital-5.webp", "Edificio-cinemateca-distrital-6.webp"
        ]
      },
      {
        titulo: "Clínica Reina Victoria",
        descripcion: "Cimentación y estructura metálica para clínica en Popayán",
        categoria: "EDIFICIOS",
        cliente: "INVERSIONES M&L GROUP S.A.S.",
        ubicacion: "Popayán, Cauca",
        toneladas: 815,
        fechaInicio: new Date('2019-08-01'),
        fechaFin: new Date('2021-03-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["cimentación", "estructura metálica", "salud"],
        imagenes: [
          "Edificio-clinica-reina-victoria-1.webp", "Edificio-clinica-reina-victoria-2.webp", "Edificio-clinica-reina-victoria-3.webp",
          "Edificio-clinica-reina-victoria-4.webp", "Edificio-clinica-reina-victoria-5.webp", "Edificio-clinica-reina-victoria-6.webp",
          "Edificio-clinica-reina-victoria-7.webp"
        ]
      },
      {
        titulo: "Edificio Omega",
        descripcion: "Estructura Metálica para Edificio Omega en Cali",
        categoria: "EDIFICIOS",
        cliente: "Omega",
        ubicacion: "Cali, Valle",
        fechaInicio: new Date('2018-06-01'),
        fechaFin: new Date('2019-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica"],
        imagenes: [
          "Edificio-omega-1.webp", "Edificio-omega-2.webp", "Edificio-omega-3.webp", "Edificio-omega-4.webp"
        ]
      },
      {
        titulo: "Estación de Bomberos Popayán",
        descripcion: "Estructura Metálica para estación de bomberos",
        categoria: "EDIFICIOS",
        cliente: "Cuerpo de bomberos voluntarios de Popayán",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2017-09-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "emergencias"],
        imagenes: [
          "Edificio-bomberos-popayan-1.webp", "Edificio-bomberos-popayan-2.webp", "Edificio-bomberos-popayan-3.webp",
          "Edificio-bomberos-popayan-4.webp", "Edificio-bomberos-popayan-5.webp"
        ]
      },
      {
        titulo: "Estación MIO Guadalupe",
        descripcion: "Estructura metálica para estación del sistema MIO",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle",
        toneladas: 654,
        fechaInicio: new Date('2016-04-01'),
        fechaFin: new Date('2017-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "transporte"],
        imagenes: [
          "Edificio-estacion-mio-guadalupe-1.webp", "Edificio-estacion-mio-guadalupe-2.webp", "Edificio-estacion-mio-guadalupe-3.webp",
          "Edificio-estacion-mio-guadalupe-4.webp", "Edificio-estacion-mio-guadalupe-5.webp", "Edificio-estacion-mio-guadalupe-6.webp"
        ]
      },
      {
        titulo: "SENA Santander",
        descripcion: "Estructura Metálica para instalaciones del SENA",
        categoria: "EDIFICIOS",
        cliente: "Sena",
        ubicacion: "Santander, Cauca",
        fechaInicio: new Date('2015-07-01'),
        fechaFin: new Date('2016-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "educación"],
        imagenes: [
          "Edificio-sena-santander-1.webp", "Edificio-sena-santander-2.webp", "Edificio-sena-santander-3.webp", "Edificio-sena-santander-4.webp"
        ]
      },
      {
        titulo: "Terminal Intermedio MIO",
        descripcion: "Estructura metálica para terminal de transporte masivo",
        categoria: "EDIFICIOS",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 654,
        areaTotal: 8842,
        fechaInicio: new Date('2014-11-01'),
        fechaFin: new Date('2016-05-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "transporte"],
        imagenes: [
          "Edificio-terminal-intermedio-mio-cali-1.webp", "Edificio-terminal-intermedio-mio-cali-2.webp", "Edificio-terminal-intermedio-mio-cali-3.webp",
          "Edificio-terminal-intermedio-mio-cali-4.webp", "Edificio-terminal-intermedio-mio-cali-5.webp", "Edificio-terminal-intermedio-mio-cali-6.webp",
          "Edificio-terminal-intermedio-mio-cali-7.webp", "Edificio-terminal-intermedio-mio-cali-8.webp"
        ]
      },
      {
        titulo: "Tequendama Parking Cali",
        descripcion: "Estructura metálica y obra civil para parqueadero",
        categoria: "EDIFICIOS",
        cliente: "Cliente Privado",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 156,
        areaTotal: 9633,
        fechaInicio: new Date('2013-08-01'),
        fechaFin: new Date('2014-10-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "obra civil"],
        imagenes: [
          "Edificio-tequendama-parking-cali-1.webp", "Edificio-tequendama-parking-cali-2.webp", "Edificio-tequendama-parking-cali-3.webp",
          "Edificio-tequendama-parking-cali-4.webp", "Edificio-tequendama-parking-cali-5.webp", "Edificio-tequendama-parking-cali-6.webp",
          "Edificio-tequendama-parking-cali-7.webp", "Edificio-tequendama-parking-cali-8.webp"
        ]
      },
      {
        titulo: "Módulos Médicos",
        descripcion: "Estructuras modulares médicas prefabricadas",
        categoria: "EDIFICIOS",
        cliente: "Sector Salud",
        ubicacion: "Colombia",
        fechaInicio: new Date('2012-06-01'),
        fechaFin: new Date('2013-03-01'),
        estado: "COMPLETADO",
        tags: ["estructuras modulares", "salud"],
        imagenes: [
          "Edificio-modulos-medicos-1.webp", "Edificio-modulos-medicos-2.webp", "Edificio-modulos-medicos-3.webp", "Edificio-modulos-medicos-4.webp"
        ]
      },

      // 🏭 INDUSTRIA (7 proyectos)
      {
        titulo: "Ampliación Cargill",
        descripcion: "Estructura metálica y cubierta para ampliación industrial",
        categoria: "INDUSTRIA",
        cliente: "Cargill Colombia",
        ubicacion: "Villa Rica, Cauca",
        toneladas: 175,
        fechaInicio: new Date('2020-02-01'),
        fechaFin: new Date('2021-07-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "cubierta", "ampliación"],
        imagenes: [
          "Industria-ampliacion-cargill-1-400x400.webp", "Industria-ampliacion-cargill-2-400x400.webp", "Industria-ampliacion-cargill-3-400x400.webp",
          "Industria-ampliacion-cargill-4-400x400.webp", "Industria-ampliacion-cargill-5-400x400.webp", "Industria-ampliacion-cargill-6-400x400.webp"
        ]
      },
      {
        titulo: "Torre Cogeneración Propal",
        descripcion: "Estructura metálica para torre de cogeneración",
        categoria: "INDUSTRIA",
        cliente: "Propal",
        ubicacion: "Yumbo, Valle del Cauca",
        toneladas: 110,
        fechaInicio: new Date('2019-04-01'),
        fechaFin: new Date('2020-06-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "torre", "cogeneración"],
        imagenes: [
          "Industria-torre-cogeneracion-propal-1.webp", "Industria-torre-cogeneracion-propal-2.webp", "Industria-torre-cogeneracion-propal-3.webp",
          "Industria-torre-cogeneracion-propal-4.webp", "Industria-torre-cogeneracion-propal-5.webp"
        ]
      },
      {
        titulo: "Bodega Duplex Ingeniería",
        descripcion: "Estructura metálica para bodega industrial",
        categoria: "INDUSTRIA",
        cliente: "Duplex Ingeniería",
        ubicacion: "Colombia",
        fechaInicio: new Date('2018-08-01'),
        fechaFin: new Date('2019-05-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "bodega"],
        imagenes: [
          "Industria-bodega-duplex-1.webp", "Industria-bodega-duplex-2.webp", "Industria-bodega-duplex-3.webp", "Industria-bodega-duplex-4.webp"
        ]
      },
      {
        titulo: "Bodega Intera",
        descripcion: "Estructura metálica para bodega de Intera SAS",
        categoria: "INDUSTRIA",
        cliente: "Intera SAS",
        ubicacion: "Santander, Cauca",
        toneladas: 79,
        fechaInicio: new Date('2017-11-01'),
        fechaFin: new Date('2018-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "bodega"],
        imagenes: [
          "Industria-bodega-intera-1.webp", "Industria-bodega-intera-2.webp", "Industria-bodega-intera-3.webp", "Industria-bodega-intera-4.webp"
        ]
      },
      {
        titulo: "Tecnofar",
        descripcion: "Estructura metálica para planta farmacéutica",
        categoria: "INDUSTRIA",
        cliente: "Constructora Inverteq S.A.S",
        ubicacion: "Villa Rica, Cauca",
        toneladas: 612,
        areaTotal: 5141,
        fechaInicio: new Date('2016-05-01'),
        fechaFin: new Date('2017-12-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "farmacéutica"],
        imagenes: [
          "Industria-tecnofar-1.webp", "Industria-tecnofar-2.webp", "Industria-tecnofar-3.webp", "Industria-tecnofar-4.webp", "Industria-tecnofar-5.webp"
        ]
      },
      {
        titulo: "Bodega Protecnica Etapa II",
        descripcion: "Estructura metálica, fachada y cubierta para bodega",
        categoria: "INDUSTRIA",
        cliente: "Protecnica Ingenieria SAS",
        ubicacion: "Yumbo, Valle",
        toneladas: 28,
        fechaInicio: new Date('2015-09-01'),
        fechaFin: new Date('2016-04-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "fachada", "cubierta"],
        imagenes: [
          "Industria-bodega-protecnica-etapa-dos-1.webp", "Industria-bodega-protecnica-etapa-dos-2.webp", "Industria-bodega-protecnica-etapa-dos-3.webp",
          "Industria-bodega-protecnica-etapa-dos-4.webp", "Industria-bodega-protecnica-etapa-dos-5.webp", "Industria-bodega-protecnica-etapa-dos-6.webp",
          "Industria-bodega-protecnica-etapa-dos-7.webp"
        ]
      },
      {
        titulo: "Tecnoquímicas Jamundí",
        descripcion: "Estructura metálica para planta de Tecnoquímicas",
        categoria: "INDUSTRIA",
        cliente: "Tecnoquímicas S.A.",
        ubicacion: "Jamundí, Valle del Cauca",
        toneladas: 508,
        areaTotal: 3676,
        fechaInicio: new Date('2014-03-01'),
        fechaFin: new Date('2015-08-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "farmacéutica"],
        imagenes: [
          "Industria-tecnoquimicas-jamundi-1.webp", "Industria-tecnoquimicas-jamundi-2.webp", "Industria-tecnoquimicas-jamundi-3.webp",
          "Industria-tecnoquimicas-jamundi-4.webp", "Industria-tecnoquimicas-jamundi-5.webp"
        ]
      },

      // 🌉 PUENTES VEHICULARES (8 proyectos)
      {
        titulo: "Puente Vehicular Nolasco",
        descripcion: "Estructura metálica para puente vehicular en Nátaga",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio del Cauca",
        ubicacion: "Nátaga, Huila",
        toneladas: 395,
        fechaInicio: new Date('2018-05-01'),
        fechaFin: new Date('2019-11-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-nolasco-1.webp", "Puente-vehicular-nolasco-2.webp", "Puente-vehicular-nolasco-3.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Carrera 100",
        descripcion: "Estructura metálica para puente vehicular en Cali",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio Islas 2019",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 420,
        fechaInicio: new Date('2019-03-01'),
        fechaFin: new Date('2020-09-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-carrera-cien-1.webp", "Puente-vehicular-carrera-cien-2.webp", "Puente-vehicular-carrera-cien-3.webp",
          "Puente-vehicular-carrera-cien-4.webp", "Puente-vehicular-carrera-cien-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Cambrin",
        descripcion: "Estructura metálica para puente vehicular en Tolima",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Consorcio Cambrin 2017",
        ubicacion: "Tolima",
        toneladas: 250,
        fechaInicio: new Date('2017-08-01'),
        fechaFin: new Date('2018-12-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-cambrin-1.webp", "Puente-vehicular-cambrin-2.webp", "Puente-vehicular-cambrin-3.webp",
          "Puente-vehicular-cambrin-4.webp", "Puente-vehicular-cambrin-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Frisoles",
        descripcion: "Estructura metálica para puente vehicular en Pasto",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Pasto",
        fechaInicio: new Date('2016-10-01'),
        fechaFin: new Date('2017-07-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-frisoles-1.webp", "Puente-vehicular-frisoles-2.webp"
        ]
      },
      {
        titulo: "Puente Vehicular La 21",
        descripcion: "Estructura metálica para puente vehicular en Cali",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Unión Temporal Espacio 2015",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 151,
        fechaInicio: new Date('2015-04-01'),
        fechaFin: new Date('2016-02-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-la-veinti-uno-1.webp", "Puente-vehicular-la-veinti-uno-2.webp",
          "Puente-vehicular-la-veinti-uno-3.webp", "Puente-vehicular-la-veinti-uno-4.webp"
        ]
      },
      {
        titulo: "Puente Vehicular La Paila",
        descripcion: "Estructura metálica para puente en vía Santander de Quilichao",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Unión Temporal E&R",
        ubicacion: "Vía Santander de Quilichao – Río Desbaratado, Cauca",
        toneladas: 293,
        fechaInicio: new Date('2014-06-01'),
        fechaFin: new Date('2015-09-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-la-paila-1.webp", "Puente-vehicular-la-paila-2.webp", "Puente-vehicular-la-paila-3.webp",
          "Puente-vehicular-la-paila-4.webp", "Puente-vehicular-la-paila-5.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Saraconcho",
        descripcion: "Estructura metálica para puente vehicular en Bolívar",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Bolívar, Cauca",
        fechaInicio: new Date('2013-09-01'),
        fechaFin: new Date('2014-08-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: [
          "Puente-vehicular-saraconcho-1.webp", "Puente-vehicular-saraconcho-2.webp",
          "Puente-vehicular-saraconcho-3.webp", "Puente-vehicular-saraconcho-4.webp"
        ]
      },
      {
        titulo: "Puente Vehicular Río Negro",
        descripcion: "Estructura metálica para puente vehicular",
        categoria: "PUENTES_VEHICULARES",
        cliente: "Cliente Público",
        ubicacion: "Río Negro, Cauca",
        toneladas: 53,
        fechaInicio: new Date('2012-11-01'),
        fechaFin: new Date('2013-06-01'),
        estado: "COMPLETADO",
        tags: ["puente", "vehicular", "estructura metálica"],
        imagenes: []
      },

      // 🚶 PUENTES PEATONALES (5 proyectos)
      {
        titulo: "Escalinata Curva - Río Cali",
        descripcion: "Formaleta en estructura metálica para escalinata curva",
        categoria: "PUENTES_PEATONALES",
        cliente: "UNIÓN TEMPORAL ESPACIO 2015",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 30,
        fechaInicio: new Date('2015-08-01'),
        fechaFin: new Date('2016-04-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["puente peatonal", "escalinata", "estructura metálica"],
        imagenes: [
          "Puente peatonal escalinata curva rio cali 1.webp", "Puente peatonal escalinata curva rio cali 2.webp",
          "Puente peatonal escalinata curva rio cali 3.webp", "Puente peatonal escalinata curva rio cali 4.webp",
          "Puente peatonal escalinata curva rio cali 5.webp", "Puente peatonal escalinata curva rio cali 6.webp"
        ]
      },
      {
        titulo: "Puente Peatonal Autopista Sur - Carrera 68",
        descripcion: "Estructura metálica para puente peatonal",
        categoria: "PUENTES_PEATONALES",
        cliente: "CONSORCIO VÍAS DE CALI S.A.S.",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 128,
        fechaInicio: new Date('2016-02-01'),
        fechaFin: new Date('2017-01-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "Puente peatonal autopista sur cali 1.webp", "Puente peatonal autopista sur cali 2.webp",
          "Puente peatonal autopista sur cali 3.webp", "Puente peatonal autopista sur cali 4.webp"
        ]
      },
      {
        titulo: "Puente Peatonal La 63",
        descripcion: "Estructura metálica para puente peatonal",
        categoria: "PUENTES_PEATONALES",
        cliente: "Cliente Público",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2014-11-01'),
        fechaFin: new Date('2015-08-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "Puente peatonal la 63 cali 1.webp", "Puente peatonal la 63 cali 2.webp",
          "Puente peatonal la 63 cali 3.webp", "Puente peatonal la 63 cali 4.webp"
        ]
      },
      {
        titulo: "Puente Peatonal La Tertulia",
        descripcion: "Estructura metálica para puente peatonal",
        categoria: "PUENTES_PEATONALES",
        cliente: "Harold Méndez",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 8,
        fechaInicio: new Date('2013-05-01'),
        fechaFin: new Date('2014-02-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica"],
        imagenes: [
          "Puente peatonal la tertulia 1.webp", "Puente peatonal la tertulia 2.webp",
          "Puente peatonal la tertulia 3.webp", "Puente peatonal la tertulia 4.webp"
        ]
      },
      {
        titulo: "Puente Peatonal Terminal Intermedio",
        descripcion: "Estructura metálica para puente peatonal del terminal MIO",
        categoria: "PUENTES_PEATONALES",
        cliente: "Consorcio Metrovial SB",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 240,
        fechaInicio: new Date('2014-08-01'),
        fechaFin: new Date('2015-12-01'),
        estado: "COMPLETADO",
        tags: ["puente peatonal", "estructura metálica", "MIO"],
        imagenes: [
          "Puente peatonal terminal intermedio 1.webp", "Puente peatonal terminal intermedio 2.webp",
          "Puente peatonal terminal intermedio 3.webp", "Puente peatonal terminal intermedio 4.webp", "Puente peatonal terminal intermedio 5.webp"
        ]
      },

      // 🏟️ ESCENARIOS DEPORTIVOS (6 proyectos)
      {
        titulo: "Complejo Acuático Popayán",
        descripcion: "Obra civil y estructura metálica para complejo acuático",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Fondo mixto para promoción del deporte",
        ubicacion: "Popayán, Cauca",
        toneladas: 135,
        fechaInicio: new Date('2012-01-01'),
        fechaFin: new Date('2012-10-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["escenario deportivo", "acuático", "estructura metálica"],
        imagenes: [
          "Escenario-deportivo-compejo-acuativo-popayan-1.webp", "Escenario-deportivo-complejo-acuatico-popayan-2.webp"
        ]
      },
      {
        titulo: "Complejo Acuático Juegos Nacionales 2012",
        descripcion: "Obra civil y estructura metálica para Juegos Nacionales",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "MAJA S.A.S.",
        ubicacion: "Popayán, Cauca",
        toneladas: 216,
        fechaInicio: new Date('2011-08-01'),
        fechaFin: new Date('2012-09-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["escenario deportivo", "juegos nacionales", "acuático"],
        imagenes: [
          "Escenario-deportivo-compejo-acuativo-popayan-1.webp", "Escenario-deportivo-complejo-acuatico-popayan-2.webp"
        ]
      },
      {
        titulo: "Coliseo Mayor Juegos Nacionales 2012",
        descripcion: "Obra civil y estructura metálica para Coliseo Mayor",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "MAJA S.A.S.",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2011-06-01'),
        fechaFin: new Date('2012-09-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["escenario deportivo", "coliseo", "juegos nacionales"],
        imagenes: [
          "Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp", "Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp"
        ]
      },
      {
        titulo: "Coliseo de Artes Marciales Nacionales 2012",
        descripcion: "Obra civil y estructura metálica para Coliseo de Artes Marciales",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "MAJA S.A.S.",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2011-08-01'),
        fechaFin: new Date('2012-07-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "artes marciales", "juegos nacionales"],
        imagenes: [
          "Escenario-deportivo-coliseo-de-artes-marciales-1.webp"
        ]
      },
      {
        titulo: "CECUN (Universidad del Cauca)",
        descripcion: "Estructura metálica y cubierta para edificio CECUN",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Consorcio Cecun",
        ubicacion: "Popayán, Cauca",
        toneladas: 78,
        fechaInicio: new Date('2010-04-01'),
        fechaFin: new Date('2011-03-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "universidad", "estructura metálica"],
        imagenes: [
          "Escenario-deportivo-cecun-1.webp", "Escenario-deportivo-cecun-2.webp", "Escenario-deportivo-cecun-3.webp",
          "Escenario-deportivo-cecun-4.webp", "Escenario-deportivo-cecun-5.webp"
        ]
      },
      {
        titulo: "Cancha Javeriana Cali",
        descripcion: "Estructura metálica, cerramientos y cubierta para cancha deportiva",
        categoria: "ESCENARIOS_DEPORTIVOS",
        cliente: "Pontificia Universidad Javeriana",
        ubicacion: "Cali, Valle del Cauca",
        toneladas: 117,
        fechaInicio: new Date('2009-08-01'),
        fechaFin: new Date('2010-12-01'),
        estado: "COMPLETADO",
        tags: ["escenario deportivo", "universidad", "cancha"],
        imagenes: [
          "Escenario-deportivo-cancha-javeriana-cali-1.webp", "Escenario-deportivo-cancha-javeriana-cali-2.webp",
          "Escenario-deportivo-cancha-javeriana-cali-3.webp", "Escenario-deportivo-cancha-javeriana-cali-4.webp",
          "Escenario-deportivo-cancha-javeriana-cali-5.webp", "Escenario-deportivo-cancha-javeriana-cali-6.webp",
          "Escenario-deportivo-cancha-javeriana-cali-7.webp", "Escenario-deportivo-cancha-javeriana-cali-8.webp"
        ]
      },

      // 🏗️ ESTRUCTURAS MODULARES (2 proyectos)
      {
        titulo: "Cocinas Ocultas",
        descripcion: "Estructuras modulares para cocinas ocultas en Bogotá",
        categoria: "ESTRUCTURAS_MODULARES",
        cliente: "COCINAS OCULTAS COLOMBIA HOLDINGS S.A.S.",
        ubicacion: "Bogotá D.C.",
        fechaInicio: new Date('2021-03-01'),
        fechaFin: new Date('2021-09-01'),
        estado: "COMPLETADO",
        tags: ["estructuras modulares", "cocinas"],
        imagenes: [
          "Estructura-modular-cocina-oculta-1-400x400.jpeg", "Estructura-modular-cocina-oculta-2-400x400.webp", "Estructura-modular-cocina-oculta-3-400x400.webp"
        ]
      },
      {
        titulo: "Módulo Oficina",
        descripcion: "Estructura metálica, cerramiento y cubierta para módulo de oficina",
        categoria: "ESTRUCTURAS_MODULARES",
        cliente: "Meisa",
        ubicacion: "Obra Parqueadero Tequendama",
        fechaInicio: new Date('2020-11-01'),
        fechaFin: new Date('2021-02-01'),
        estado: "COMPLETADO",
        tags: ["estructuras modulares", "oficina"],
        imagenes: [
          "Estructura-modular-modulo-oficina-1-400x400.webp", "Estructura-modular-modulo-oficina-2-400x400.webp", "Estructura-modular-modulo-oficina-3-400x400.webp"
        ]
      },

      // ⛽ OIL & GAS (2 proyectos)
      {
        titulo: "Tanque Pulmón",
        descripcion: "Tanque estacionario vertical de 3,000 galones",
        categoria: "OIL_AND_GAS",
        cliente: "OIL BUSINESS SERVICES S.A.S.",
        ubicacion: "San Martín, Cesar",
        fechaInicio: new Date('2020-05-01'),
        fechaFin: new Date('2020-11-01'),
        estado: "COMPLETADO",
        tags: ["tanque", "oil & gas", "almacenamiento"],
        imagenes: [
          "Oil-gas-tanque-pulmon-1-400x400.webp"
        ]
      },
      {
        titulo: "Tanques de Almacenamiento GLP",
        descripcion: "Tanques estacionarios horizontales de 3,000 galones cada uno",
        categoria: "OIL_AND_GAS",
        cliente: "Surcolombiana de Gas S.A E.S.P.",
        ubicacion: "Pitalito, Huila",
        fechaInicio: new Date('2019-09-01'),
        fechaFin: new Date('2020-04-01'),
        estado: "COMPLETADO",
        tags: ["tanques", "GLP", "gas", "almacenamiento"],
        imagenes: [
          "Oil-gas-tanque-de-almacenamiento-gpl-1-400x400.webp", "Oil-gas-tanque-de-almacenamiento-gpl-2-400x400.webp",
          "Oil-gas-tanque-de-almacenamiento-gpl-3-400x400.webp", "Oil-gas-tanque-de-almacenamiento-gpl-4-400x400.webp",
          "Oil-gas-tanque-de-almacenamiento-gpl-5-400x400.webp", "Oil-gas-tanque-de-almacenamiento-gpl-6-400x400.webp"
        ]
      },

      // 🏗️ CUBIERTAS Y FACHADAS (5 proyectos)
      {
        titulo: "Camino Viejo",
        descripcion: "Proyecto de cubiertas y fachadas metálicas",
        categoria: "CUBIERTAS_Y_FACHADAS",
        cliente: "Cliente Privado",
        ubicacion: "Colombia",
        fechaInicio: new Date('2021-01-01'),
        fechaFin: new Date('2021-06-01'),
        estado: "COMPLETADO",
        tags: ["cubiertas", "fachadas"],
        imagenes: [
          "Cubiertas-y-fachadas-camino-viejo-1.webp", "Cubiertas-y-fachadas-camino-viejo-2.webp"
        ]
      },
      {
        titulo: "Cubierta Interna",
        descripcion: "Proyecto de cubiertas metálicas internas",
        categoria: "CUBIERTAS_Y_FACHADAS",
        cliente: "Cliente Privado",
        ubicacion: "Colombia",
        fechaInicio: new Date('2020-08-01'),
        fechaFin: new Date('2021-01-01'),
        estado: "COMPLETADO",
        tags: ["cubiertas", "internas"],
        imagenes: [
          "Cubiertas-y-fachadas-cubierta-interna-1.webp", "Cubiertas-y-fachadas-cubierta-interna-2.webp"
        ]
      },
      {
        titulo: "IPS Sura",
        descripcion: "Proyecto de cubiertas y fachadas para IPS Sura",
        categoria: "CUBIERTAS_Y_FACHADAS",
        cliente: "Sura",
        ubicacion: "Colombia",
        fechaInicio: new Date('2020-03-01'),
        fechaFin: new Date('2020-09-01'),
        estado: "COMPLETADO",
        tags: ["cubiertas", "fachadas", "salud"],
        imagenes: [
          "Cubiertas-y-fachadas-ips-sura-1.webp", "Cubiertas-y-fachadas-ips-sura-2.webp"
        ]
      },
      {
        titulo: "Taquillas Pisoje",
        descripcion: "Cubiertas y fachadas para taquillas",
        categoria: "CUBIERTAS_Y_FACHADAS",
        cliente: "Cliente Privado",
        ubicacion: "Colombia",
        fechaInicio: new Date('2019-11-01'),
        fechaFin: new Date('2020-05-01'),
        estado: "COMPLETADO",
        tags: ["cubiertas", "fachadas", "taquillas"],
        imagenes: [
          "Cubiertas-y-fachadas-taquillas-pisoje-1.webp", "Cubiertas-y-fachadas-taquillas-pisoje-2.webp"
        ]
      },
      {
        titulo: "Taquillas Pisoje Comfacauca",
        descripcion: "Cubiertas y fachadas para taquillas de Comfacauca",
        categoria: "CUBIERTAS_Y_FACHADAS",
        cliente: "Comfacauca",
        ubicacion: "Cauca",
        fechaInicio: new Date('2019-06-01'),
        fechaFin: new Date('2020-01-01'),
        estado: "COMPLETADO",
        tags: ["cubiertas", "fachadas", "taquillas"],
        imagenes: [
          "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-1.webp", "Cubiertas-y-fachadas-taquillas-pisoje-comfacauca-2.webp"
        ]
      }
    ]
    
    console.log(`\n📊 Creando ${allProjects.length} proyectos...`)
    
    for (const projectData of allProjects) {
      const { imagenes, ...proyecto } = projectData
      
      const slug = generateSlug(proyecto.titulo)
      console.log(`✅ Creando: ${proyecto.titulo} (${proyecto.categoria})`)
      
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
              url: `/uploads/projects/${imagenes[i]}`,
              alt: `${proyecto.titulo} - Imagen ${i + 1}`,
              titulo: `${proyecto.titulo} - Imagen ${i + 1}`,
              orden: i + 1,
              tipo: i === 0 ? "PORTADA" : "GALERIA",
            },
          })
        }
        console.log(`   📸 ${imagenes.length} imágenes asociadas`)
      }
    }
    
    // Resumen por categorías
    const summary = allProjects.reduce((acc, project) => {
      acc[project.categoria] = (acc[project.categoria] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log(`\n🎉 RESUMEN DE CREACIÓN:`)
    console.log(`📊 Total de proyectos creados: ${allProjects.length}`)
    console.log(`\n📂 Por categorías:`)
    Object.entries(summary).forEach(([categoria, count]) => {
      console.log(`   🏷️  ${categoria.replace(/_/g, ' ')}: ${count} proyectos`)
    })
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAll53Projects()