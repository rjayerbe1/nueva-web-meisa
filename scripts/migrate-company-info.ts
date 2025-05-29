import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function migrateCompanyInfo() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🏢 MIGRANDO INFORMACIÓN DE LA EMPRESA\n')
    console.log('=' .repeat(60) + '\n')

    // 1. Extraer información de la página "Nuestra Empresa"
    const [empresaPage] = await connection.execute<any[]>(
      `SELECT post_content FROM wp_posts 
       WHERE post_name = 'nuestra-empresa' 
       AND post_type = 'page' 
       AND post_status = 'publish'`
    )

    if (empresaPage.length > 0) {
      const content = empresaPage[0].post_content
      console.log('📄 Extrayendo información de "Nuestra Empresa"...\n')

      // Extraer historia
      const historiaMatch = content.match(/fue constituida[^<]+1996[^<]+/i)
      const historia = historiaMatch ? historiaMatch[0].trim() : ''
      
      // Extraer misión/descripción
      const descripcionMatch = content.match(/centrando su actividad[^<]+/i)
      const descripcion = descripcionMatch ? descripcionMatch[0].trim() : ''

      console.log('Historia:', historia.substring(0, 100) + '...')
      console.log('Descripción:', descripcion.substring(0, 100) + '...\n')
    }

    // 2. Extraer información de contacto
    console.log('📞 Extrayendo información de contacto...\n')
    
    const [contactoPage] = await connection.execute<any[]>(
      `SELECT post_content FROM wp_posts 
       WHERE post_name = 'contacto' 
       AND post_type = 'page' 
       AND post_status = 'publish'`
    )

    let contactInfo = {
      direccionCali: '',
      direccionPopayan: '',
      telefonoCali: '',
      telefonoPopayan: '',
      whatsapp: '',
      email: ''
    }

    if (contactoPage.length > 0) {
      const content = contactoPage[0].post_content
      
      // Extraer direcciones
      const caliMatch = content.match(/Jamundí[^<]+Valle del Cauca/i)
      if (caliMatch) contactInfo.direccionCali = caliMatch[0].trim()
      
      const popayanMatch = content.match(/Popayán[^<]+Cauca/i)
      if (popayanMatch) contactInfo.direccionPopayan = popayanMatch[0].trim()
      
      // Extraer teléfonos
      const telefonosMatch = content.match(/\+57[^<]+/g)
      if (telefonosMatch) {
        contactInfo.telefonoCali = telefonosMatch[0].trim()
        if (telefonosMatch[1]) contactInfo.whatsapp = telefonosMatch[1].trim()
      }
      
      // Extraer email
      const emailMatch = content.match(/contacto@meisa\.com\.co/i)
      if (emailMatch) contactInfo.email = emailMatch[0]
      
      console.log('Dirección Cali:', contactInfo.direccionCali)
      console.log('Dirección Popayán:', contactInfo.direccionPopayan)
      console.log('Teléfono Cali:', contactInfo.telefonoCali)
      console.log('WhatsApp:', contactInfo.whatsapp)
      console.log('Email:', contactInfo.email)
    }

    // 3. Extraer servicios
    console.log('\n\n🛠️ Extrayendo información de servicios...\n')
    
    const [serviciosPage] = await connection.execute<any[]>(
      `SELECT post_content FROM wp_posts 
       WHERE post_name = 'servicios' 
       AND post_type = 'page' 
       AND post_status = 'publish'`
    )

    const servicios = []
    if (serviciosPage.length > 0) {
      const content = serviciosPage[0].post_content
      
      // Buscar servicios principales
      const consultoria = content.match(/Consultoría en diseño Estructural/i)
      const fabricacion = content.match(/Fabricación de Estructuras Metálicas/i)
      const montaje = content.match(/Montaje de Estructuras Metálicas/i)
      const construccion = content.match(/Construcción de obra civil/i)
      
      if (consultoria) {
        servicios.push({
          titulo: 'Consultoría en Diseño Estructural',
          descripcion: 'Ofrecemos servicios especializados de consultoría para el diseño de estructuras metálicas, optimizando costos y garantizando la seguridad de sus proyectos.',
          icono: 'design'
        })
      }
      
      if (fabricacion) {
        servicios.push({
          titulo: 'Fabricación de Estructuras Metálicas',
          descripcion: 'Contamos con modernas instalaciones y tecnología de punta para la fabricación de estructuras metálicas de alta calidad.',
          icono: 'factory'
        })
      }
      
      if (montaje) {
        servicios.push({
          titulo: 'Montaje de Estructuras Metálicas',
          descripcion: 'Nuestro equipo especializado realiza el montaje de estructuras metálicas con los más altos estándares de seguridad y calidad.',
          icono: 'construction'
        })
      }
      
      if (construccion) {
        servicios.push({
          titulo: 'Construcción de Obra Civil',
          descripcion: 'Complementamos nuestros servicios con la construcción de obra civil, ofreciendo soluciones integrales para sus proyectos.',
          icono: 'building'
        })
      }
      
      console.log(`Encontrados ${servicios.length} servicios principales`)
    }

    // 4. Crear archivo de configuración para el sitio
    console.log('\n\n📝 Creando archivo de configuración del sitio...\n')
    
    const siteConfig = {
      empresa: {
        nombre: 'MEISA - Metálicas e Ingeniería S.A.',
        descripcion: 'Somos una empresa colombiana especializada en brindar soluciones completas de ingeniería. A través de procesos eficientes y tecnologías de alto nivel, diseñamos, fabricamos e instalamos estructuras metálicas.',
        historia: 'Metálicas e Ingeniería S.A fue constituida en el año de 1996 en la ciudad de Popayán, centrando su actividad en el diseño, fabricación y montaje de Estructura Metálica.',
        aniosExperiencia: new Date().getFullYear() - 1996
      },
      contacto: contactInfo,
      servicios: servicios,
      sedes: [
        {
          ciudad: 'Jamundí - Cali',
          direccion: 'Vía Panamericana 6 Sur - 195 - Valle del Cauca',
          telefono: '+57 (2) 312 0050-51-52-53',
          tipo: 'principal'
        },
        {
          ciudad: 'Popayán',
          direccion: 'Bodega E13 Parque Industrial - Cauca',
          telefono: '',
          tipo: 'secundaria'
        }
      ],
      redes: {
        whatsapp: '+57 310 432 7227',
        email: 'contacto@meisa.com.co'
      }
    }

    // Guardar configuración
    const configContent = `// Configuración del sitio MEISA
// Generado desde WordPress el ${new Date().toLocaleString('es-CO')}

export const siteConfig = ${JSON.stringify(siteConfig, null, 2)}

export default siteConfig
`

    await require('fs').promises.writeFile(
      './lib/site-config.ts',
      configContent,
      'utf8'
    )
    
    console.log('✅ Archivo de configuración creado en lib/site-config.ts')

    // 5. Actualizar servicios en la base de datos
    console.log('\n📊 Actualizando servicios en la base de datos...\n')
    
    // Verificar si ya existen servicios
    const existingServices = await prisma.servicio.count()
    
    if (existingServices === 0) {
      // Crear servicios
      for (const servicio of servicios) {
        await prisma.servicio.create({
          data: {
            titulo: servicio.titulo,
            descripcion: servicio.descripcion,
            imagen: `/images/services/${servicio.icono}.jpg`,
            caracteristicas: [
              'Personal altamente calificado',
              'Tecnología de última generación',
              'Cumplimiento de normas y estándares',
              'Garantía de calidad'
            ]
          }
        })
        console.log(`✅ Servicio creado: ${servicio.titulo}`)
      }
    } else {
      console.log(`ℹ️  Ya existen ${existingServices} servicios en la base de datos`)
    }

    console.log('\n✅ MIGRACIÓN COMPLETADA')
    console.log('\nPróximos pasos:')
    console.log('1. Revisar el archivo lib/site-config.ts')
    console.log('2. Actualizar los componentes del frontend para usar esta configuración')
    console.log('3. Crear imágenes para los servicios')
    console.log('4. Personalizar el diseño según la identidad de MEISA')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateCompanyInfo()