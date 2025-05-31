#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Función para generar slug amigable
function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/[áäâà]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôò]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[&]/g, 'y')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Mapeo de logos descargados con información del cliente
const clientesConLogos = [
  {
    nombre: 'Protecnica Ingeniería',
    logo: '/images/clients/cliente-protecnica.webp',
    sector: 'CONSTRUCCION',
    sitioWeb: 'https://protecnica.com.co',
    descripcion: 'Empresa especializada en protección catódica y ingeniería de materiales',
    destacado: true,
    proyectoDestacado: 'Protección Catódica Industrial',
    capacidadProyecto: '500+ Sistemas',
    ubicacionProyecto: 'Plantas Industriales Colombia'
  },
  {
    nombre: 'Constructora Normandía',
    logo: '/images/clients/cliente-normandia.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Constructora líder en proyectos residenciales y comerciales',
    destacado: true,
    proyectoDestacado: 'Torres Normandía',
    capacidadProyecto: '15.000 m²',
    ubicacionProyecto: 'Bogotá, Colombia'
  },
  {
    nombre: 'Arinsa Constructora',
    logo: '/images/clients/cliente-arinsa.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Empresa constructora especializada en obras civiles'
  },
  {
    nombre: 'Pollos Bucanero',
    logo: '/images/clients/cliente-pollos-bucanero.webp',
    sector: 'INDUSTRIAL',
    descripcion: 'Empresa avícola especializada en producción y procesamiento de pollo',
    destacado: true,
    proyectoDestacado: 'Planta de Procesamiento',
    capacidadProyecto: '3.200 m²',
    ubicacionProyecto: 'Valle del Cauca'
  },
  {
    nombre: 'Tecnoquímicas',
    logo: '/images/clients/cliente-tecnoquimicas.webp',
    sector: 'INDUSTRIAL',
    sitioWeb: 'https://tecnoquimicas.com',
    descripcion: 'Líder farmacéutica colombiana con presencia internacional',
    destacado: true,
    proyectoDestacado: 'Planta Farmacéutica',
    capacidadProyecto: '8.500 m²',
    ubicacionProyecto: 'Cali, Valle del Cauca'
  },
  {
    nombre: 'Jaramillo Constructora',
    logo: '/images/clients/cliente-jaramillo.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Constructora con experiencia en proyectos de gran escala'
  },
  {
    nombre: 'Unicentro Cali',
    logo: '/images/clients/cliente-unicentro.webp',
    sector: 'COMERCIAL',
    descripcion: 'Centro comercial líder en el suroccidente colombiano',
    destacado: true,
    proyectoDestacado: 'Ampliación Unicentro',
    capacidadProyecto: '12.000 m²',
    ubicacionProyecto: 'Cali, Valle del Cauca'
  },
  {
    nombre: 'Royal Films',
    logo: '/images/clients/cliente-royal-films.webp',
    sector: 'COMERCIAL',
    sitioWeb: 'https://royalfilms.com.co',
    descripcion: 'Cadena de cines líder en Colombia',
    destacado: true,
    proyectoDestacado: 'Multiplex Royal Films',
    capacidadProyecto: '2.800 m²',
    ubicacionProyecto: 'Centros Comerciales Colombia'
  },
  {
    nombre: 'Constructora Concreto',
    logo: '/images/clients/cliente-concreto.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Empresa especializada en estructuras de concreto'
  },
  {
    nombre: 'Smurfit Kappa',
    logo: '/images/clients/cliente-smurfit-kappa.webp',
    sector: 'INDUSTRIAL',
    sitioWeb: 'https://smurfitkappa.com',
    descripcion: 'Multinacional líder en empaques sostenibles'
  },
  {
    nombre: 'SENA',
    logo: '/images/clients/cliente-sena.webp',
    sector: 'GOBIERNO',
    sitioWeb: 'https://sena.edu.co',
    descripcion: 'Servicio Nacional de Aprendizaje - Entidad pública de educación',
    destacado: true,
    proyectoDestacado: 'Centro de Formación SENA',
    capacidadProyecto: '4.500 m²',
    ubicacionProyecto: 'Popayán, Cauca'
  },
  {
    nombre: 'Seguridad Omega',
    logo: '/images/clients/cliente-seguridad-omega.webp',
    sector: 'INSTITUCIONAL',
    descripcion: 'Empresa de seguridad privada y vigilancia'
  },
  {
    nombre: 'SAINC',
    logo: '/images/clients/cliente-sainc.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Sociedad de Arquitectos e Ingenieros Consultores'
  },
  {
    nombre: 'Mensula Ingenieros',
    logo: '/images/clients/cliente-mensula.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Empresa de ingeniería y consultoría estructural'
  },
  {
    nombre: 'Johnson & Johnson',
    logo: '/images/clients/cliente-johnson-johnson.webp',
    sector: 'INDUSTRIAL',
    sitioWeb: 'https://jnj.com',
    descripcion: 'Multinacional farmacéutica y de productos de consumo',
    destacado: true,
    proyectoDestacado: 'Planta Farmacéutica J&J',
    capacidadProyecto: '6.200 m²',
    ubicacionProyecto: 'Bogotá, Colombia'
  },
  {
    nombre: 'Mayagüez',
    logo: '/images/clients/cliente-mayaguez.webp',
    sector: 'INDUSTRIAL',
    descripcion: 'Ingenio azucarero del Valle del Cauca'
  },
  {
    nombre: 'Ingenio María Luisa',
    logo: '/images/clients/cliente-ingenio-maria-luisa.webp',
    sector: 'INDUSTRIAL',
    descripcion: 'Ingenio azucarero con tradición familiar'
  },
  {
    nombre: 'Manuelita',
    logo: '/images/clients/cliente-manuelita.webp',
    sector: 'INDUSTRIAL',
    sitioWeb: 'https://manuelita.com',
    descripcion: 'Grupo empresarial agroindustrial líder en Colombia',
    destacado: true,
    proyectoDestacado: 'Planta Azúcar Manuelita',
    capacidadProyecto: '9.500 m²',
    ubicacionProyecto: 'Valle del Cauca'
  },
  {
    nombre: 'Consorcio Edificar',
    logo: '/images/clients/cliente-consorcio-edificar.webp',
    sector: 'CONSTRUCCION',
    descripcion: 'Consorcio especializado en construcción de edificaciones'
  },
  {
    nombre: 'Comfacauca',
    logo: '/images/clients/cliente-comfacauca.webp',
    sector: 'INSTITUCIONAL',
    sitioWeb: 'https://comfacauca.com',
    descripcion: 'Caja de Compensación Familiar del Cauca'
  },
  {
    nombre: 'Cargill',
    logo: '/images/clients/cliente-cargill.webp',
    sector: 'INDUSTRIAL',
    sitioWeb: 'https://cargill.com',
    descripcion: 'Multinacional de alimentos y agricultura',
    destacado: true,
    proyectoDestacado: 'Ampliación Planta Cargill',
    capacidadProyecto: '11.800 m²',
    ubicacionProyecto: 'Yumbo, Valle del Cauca'
  },
  {
    nombre: 'SURA',
    logo: '/images/clients/cliente-sura.webp',
    sector: 'INSTITUCIONAL',
    sitioWeb: 'https://sura.com',
    descripcion: 'Grupo financiero líder en América Latina'
  },
  {
    nombre: 'Ingenio Providencia',
    logo: '/images/clients/cliente-ingenio-providencia.webp',
    sector: 'INDUSTRIAL',
    descripcion: 'Ingenio azucarero del Valle del Cauca'
  },
  {
    nombre: 'Colpatria',
    logo: '/images/clients/cliente-colpatria.webp',
    sector: 'INSTITUCIONAL',
    sitioWeb: 'https://colpatria.com',
    descripcion: 'Grupo financiero colombiano'
  },
  {
    nombre: 'Éxito',
    logo: '/images/clients/cliente-exito.webp',
    sector: 'COMERCIAL',
    sitioWeb: 'https://exito.com',
    descripcion: 'Cadena de supermercados líder en Colombia',
    destacado: true,
    proyectoDestacado: 'Hipermercado Éxito',
    capacidadProyecto: '7.200 m²',
    ubicacionProyecto: 'Varias ciudades Colombia'
  }
]

async function updateClientLogos() {
  console.log('🚀 Actualizando logos de clientes en la base de datos...\n')

  try {
    let created = 0
    let updated = 0
    let skipped = 0

    for (const clienteData of clientesConLogos) {
      try {
        // Verificar si el logo existe en el sistema de archivos
        const logoPath = path.join(process.cwd(), 'public', clienteData.logo)
        if (!fs.existsSync(logoPath)) {
          console.log(`⚠️  Logo no encontrado: ${clienteData.logo}`)
          skipped++
          continue
        }

        // Buscar cliente existente por nombre
        const existingClient = await prisma.cliente.findFirst({
          where: {
            nombre: {
              contains: clienteData.nombre,
              mode: 'insensitive'
            }
          }
        })

        if (existingClient) {
          // Actualizar cliente existente
          await prisma.cliente.update({
            where: { id: existingClient.id },
            data: {
              logo: clienteData.logo,
              sitioWeb: clienteData.sitioWeb,
              descripcion: clienteData.descripcion,
              sector: clienteData.sector,
              destacado: clienteData.destacado || false,
              proyectoDestacado: clienteData.proyectoDestacado,
              capacidadProyecto: clienteData.capacidadProyecto,
              ubicacionProyecto: clienteData.ubicacionProyecto,
              mostrarEnHome: true,
              activo: true
            }
          })
          console.log(`✅ Actualizado: ${clienteData.nombre}`)
          updated++
        } else {
          // Crear nuevo cliente
          const slug = generateSlug(clienteData.nombre)
          await prisma.cliente.create({
            data: {
              nombre: clienteData.nombre,
              slug: slug,
              logo: clienteData.logo,
              sitioWeb: clienteData.sitioWeb,
              descripcion: clienteData.descripcion,
              sector: clienteData.sector,
              destacado: clienteData.destacado || false,
              proyectoDestacado: clienteData.proyectoDestacado,
              capacidadProyecto: clienteData.capacidadProyecto,
              ubicacionProyecto: clienteData.ubicacionProyecto,
              mostrarEnHome: true,
              activo: true,
              orden: created + updated + 1
            }
          })
          console.log(`🆕 Creado: ${clienteData.nombre}`)
          created++
        }

        // Pequeña pausa entre operaciones
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ Error procesando ${clienteData.nombre}:`, error)
        skipped++
      }
    }

    console.log('\n=== RESUMEN DE ACTUALIZACIÓN ===')
    console.log(`🆕 Clientes creados: ${created}`)
    console.log(`✅ Clientes actualizados: ${updated}`)
    console.log(`⏭️  Clientes omitidos: ${skipped}`)
    console.log(`📊 Total procesados: ${created + updated + skipped}`)

    // Mostrar estadísticas finales
    const totalClientes = await prisma.cliente.count()
    const clientesActivos = await prisma.cliente.count({ where: { activo: true } })
    const clientesConLogo = await prisma.cliente.count({ 
      where: { 
        activo: true,
        logo: { not: null }
      }
    })

    console.log('\n=== ESTADÍSTICAS FINALES ===')
    console.log(`📋 Total clientes: ${totalClientes}`)
    console.log(`✅ Clientes activos: ${clientesActivos}`)
    console.log(`🖼️  Clientes con logo: ${clientesConLogo}`)

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateClientLogos().catch(console.error)
}

export { updateClientLogos }