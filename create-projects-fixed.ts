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

async function createProjectsFixed() {
  try {
    console.log('🏗️ Iniciando creación de proyectos del portafolio...')
    
    // 1. Buscar o crear usuario admin
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      console.log('👤 Creando usuario admin...')
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@meisa.com.co',
          name: 'Admin MEISA',
          role: 'ADMIN'
        }
      })
    }
    
    console.log(`👤 Usuario admin encontrado: ${adminUser.email}`)
    
    // 2. CENTROS COMERCIALES (8 proyectos)
    console.log('\n📍 Creando Centros Comerciales...')
    
    const centroComercialProjects = [
      {
        titulo: "Centro Comercial Campanario",
        descripcion: "Cimentación, estructura metálica y cubiertas ampliación en Popayán, Cauca. Proyecto de 2,500 toneladas realizado para el cliente ARINSA.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ARINSA",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2020-01-01'),
        fechaFin: new Date('2021-06-01'),
        estado: "COMPLETADO",
        destacado: true,
        tags: ["estructura metálica", "cubiertas", "cimentación", "centro comercial"],
        imagenes: [
          "Centro-campanario-1.webp", "Centro-campanario-2.webp", "Centro-campanario-3.webp",
          "Centro-campanario-4.webp", "Centro-campanario-5.webp", "Centro-campanario-6.webp", "Centro-campanario-7.webp"
        ]
      },
      {
        titulo: "Paseo Villa del Río",
        descripcion: "Estructura metálica de rampas, losa y racks en Bogotá. Proyecto de 420 toneladas para Ménsula Ingenieros S.A.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Ménsula Ingenieros S.A",
        ubicacion: "Bogotá, Cundinamarca",
        fechaInicio: new Date('2019-06-01'),
        fechaFin: new Date('2020-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "rampas", "centro comercial"],
        imagenes: [
          "Centro-paseo-villa-del-rio-1-400x400.webp", "Centro-paseo-villa-del-rio-2-400x400.webp",
          "Centro-paseo-villa-del-rio-3-400x400.webp", "Centro-paseo-villa-del-rio-4-400x400.webp", "Centro-paseo-villa-del-rio-5-400x400.webp"
        ]
      },
      {
        titulo: "Centro Comercial Monserrat",
        descripcion: "Estructura Metálica y Cubierta en Popayán para Constructora Adriana Rivera SAS.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Adriana Rivera SAS",
        ubicacion: "Popayán, Cauca",
        fechaInicio: new Date('2018-03-01'),
        fechaFin: new Date('2019-08-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta", "centro comercial"],
        imagenes: [
          "Monserrat-Plaza.jpg", "Monserrat-Plaza3.jpg", "Monserrat-Plaza-1.jpg",
          "monserrat-5.jpg", "Monserrat-Plaza3-1.jpg",
          "Centro-monserrat-1.webp", "Centro-monserrat-2.webp", "Centro-monserrat-3.webp", "Centro-monserrat-4.webp", "Centro-monserrat-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Cali",
        descripcion: "Construcción de obra civil, estructura metálica y cubierta. Proyecto de 790 toneladas en Cali.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Unitres SAS",
        ubicacion: "Cali, Valle",
        fechaInicio: new Date('2017-04-01'),
        fechaFin: new Date('2018-11-01'),
        estado: "COMPLETADO",
        tags: ["obra civil", "estructura metálica", "cubierta", "centro comercial"],
        imagenes: [
          "Centro-unico-cali-1.webp", "Centro-unico-cali-2.webp", "Centro-unico-cali-3.webp", "Centro-unico-cali-4.webp", "Centro-unico-cali-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Neiva",
        descripcion: "Estructura Metálica y Cubierta en Neiva. Proyecto de 902 toneladas para Constructora Colpatria SAS.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Colpatria SAS",
        ubicacion: "Neiva, Huila",
        fechaInicio: new Date('2016-08-01'),
        fechaFin: new Date('2018-02-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta", "centro comercial"],
        imagenes: [
          "Centro-unico-neiva-1.webp", "Centro-unico-neiva-2.webp", "Centro-unico-neiva-3.webp", "Centro-unico-neiva-4.webp", "Centro-unico-neiva-5.webp"
        ]
      },
      {
        titulo: "Centro Comercial Unico Barranquilla",
        descripcion: "Estructura Metálica y Cubierta en Barranquilla para Centros Comerciales de la Costa SAS.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Centros Comerciales de la Costa SAS",
        ubicacion: "Barranquilla, Atlántico",
        fechaInicio: new Date('2015-01-01'),
        fechaFin: new Date('2016-06-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "cubierta", "centro comercial"],
        imagenes: [
          "Centro-unico-barranquilla-2.webp", "Centro-unico-barranquilla-3.webp"
        ]
      },
      {
        titulo: "Centro Comercial Armenia Plaza",
        descripcion: "Estructura metálica en Armenia para ER Inversiones.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "ER Inversiones",
        ubicacion: "Armenia, Quindío",
        fechaInicio: new Date('2014-05-01'),
        fechaFin: new Date('2015-12-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "centro comercial"],
        imagenes: [
          "CC-ARMENIA-PLAZA-1.jpeg", "CC-ARMENIA-PLAZA-5.jpeg",
          "Centro-armenia-plaza-1.webp", "Centro-armenia-plaza-2.webp", "Centro-armenia-plaza-3.webp", "Centro-armenia-plaza-4.webp"
        ]
      },
      {
        titulo: "Centro Comercial Bochalema Plaza",
        descripcion: "Estructura metálica de 1,781 toneladas en un área de 16,347 metros cuadrados en Cali.",
        categoria: "CENTROS_COMERCIALES",
        cliente: "Constructora Normandía",
        ubicacion: "Cali, Valle del Cauca",
        fechaInicio: new Date('2013-02-01'),
        fechaFin: new Date('2014-09-01'),
        estado: "COMPLETADO",
        tags: ["estructura metálica", "centro comercial"],
        imagenes: [
          "Centro-Comercial-Bochalema-Plaza-Cali.jpg",
          "Centro-bochalema-plaza-1.webp", "Centro-bochalema-plaza-2.webp", "Centro-bochalema-plaza-3.webp", 
          "Centro-bochalema-plaza-4.webp", "Centro-bochalema-plaza-5.webp", "Centro-bochalema-plaza-6.webp", 
          "Centro-bochalema-plaza-7.webp", "Centro-bochalema-plaza-8.webp", "Centro-bochalema-plaza-9.webp"
        ]
      }
    ]
    
    // Crear proyectos de centros comerciales
    for (const projectData of centroComercialProjects) {
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
    
    console.log(`\n✅ Se han creado ${centroComercialProjects.length} proyectos de Centros Comerciales exitosamente!`)
    
  } catch (error) {
    console.error('❌ Error creando proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createProjectsFixed()