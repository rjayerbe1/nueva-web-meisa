#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

// Clientes prioritarios con logos descargados
const clientesPrioritarios = [
  {
    nombre: 'Pavimentos Colombia SAS',
    slug: 'pavimentos-colombia-sas',
    logo: '/images/clients/cliente-pavimentos-colombia.png',
    descripcion: 'Empresa especializada en construcción y rehabilitación de carreteras con más de 56 años de experiencia',
    sitioWeb: 'https://pavimentoscolombia.com',
    sector: 'CONSTRUCCION',
    destacado: true,
    proyectoDestacado: 'Construcción de Carreteras',
    capacidadProyecto: '500+ km',
    ubicacionProyecto: 'Colombia Nacional'
  },
  {
    nombre: 'D1 SAS',
    slug: 'd1-sas',
    logo: '/images/clients/cliente-d1.png',
    descripcion: 'La cadena de tiendas de descuento más grande de Colombia, parte del Grupo Valorem, con más de 2,500 tiendas',
    sitioWeb: 'https://d1.com.co',
    sector: 'COMERCIAL',
    destacado: true,
    proyectoDestacado: 'Tiendas D1 Nacional',
    capacidadProyecto: '2.500+ Tiendas',
    ubicacionProyecto: 'Colombia Nacional'
  },
  {
    nombre: 'Crystal SAS',
    slug: 'crystal-sas',
    logo: '/images/clients/cliente-crystal.png',
    descripcion: 'Empresa textil y de moda con más de 50 años de experiencia, especializada en marcas como Gef, Punto Blanco, Baby Fresh',
    sitioWeb: 'https://www.crystal.com.co',
    sector: 'INDUSTRIAL',
    destacado: true,
    proyectoDestacado: 'Planta Industrial Textil',
    capacidadProyecto: '15.000 m²',
    ubicacionProyecto: 'Colombia'
  },
  {
    nombre: 'Construandes',
    slug: 'construandes',
    logo: '/images/clients/cliente-construandes.png',
    descripcion: 'Empresa constructora fundada en 1994, especializada en construcción de edificios residenciales y no residenciales',
    sitioWeb: 'https://andesconstructora.co',
    sector: 'CONSTRUCCION',
    destacado: true,
    proyectoDestacado: 'Edificios Residenciales',
    capacidadProyecto: '100+ Proyectos',
    ubicacionProyecto: 'Valle del Cauca'
  },
  {
    nombre: 'Tecnofar TQ SAS',
    slug: 'tecnofar-tq-sas',
    logo: '/images/clients/cliente-tecnofar.png',
    descripcion: 'Empresa farmacéutica especializada en la fabricación de productos farmacéuticos y sustancias químicas medicinales',
    sitioWeb: 'https://www.tqconfiable.com',
    sector: 'INDUSTRIAL',
    destacado: true,
    proyectoDestacado: 'Planta Farmacéutica',
    capacidadProyecto: '8.000 m²',
    ubicacionProyecto: 'Cali, Valle del Cauca'
  },
  {
    nombre: 'Dollarcity',
    slug: 'dollarcity',
    logo: '/images/clients/cliente-dollarcity.png', // Placeholder - necesita logo manual
    descripcion: 'Cadena de tiendas tipo "todo a precio fijo" especializada en artículos para el hogar, oficina y mascotas',
    sitioWeb: 'https://dollarcity.com',
    sector: 'COMERCIAL',
    destacado: true,
    proyectoDestacado: 'Tiendas Dollarcity',
    capacidadProyecto: '200+ Tiendas',
    ubicacionProyecto: 'Colombia'
  }
]

async function addPriorityClients() {
  console.log('🚀 Agregando clientes prioritarios a la base de datos...\n')

  try {
    let created = 0
    let updated = 0
    let skipped = 0

    for (const clienteData of clientesPrioritarios) {
      try {
        // Verificar si ya existe
        const existingClient = await prisma.cliente.findFirst({
          where: {
            OR: [
              { nombre: { contains: clienteData.nombre, mode: 'insensitive' } },
              { slug: clienteData.slug }
            ]
          }
        })

        if (existingClient) {
          // Actualizar cliente existente
          await prisma.cliente.update({
            where: { id: existingClient.id },
            data: {
              logo: clienteData.logo,
              logoBlanco: clienteData.logo, // Usar el mismo logo para versión blanca
              sitioWeb: clienteData.sitioWeb,
              descripcion: clienteData.descripcion,
              sector: clienteData.sector,
              destacado: clienteData.destacado,
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
          await prisma.cliente.create({
            data: {
              nombre: clienteData.nombre,
              slug: clienteData.slug,
              logo: clienteData.logo,
              logoBlanco: clienteData.logo,
              sitioWeb: clienteData.sitioWeb,
              descripcion: clienteData.descripcion,
              sector: clienteData.sector,
              destacado: clienteData.destacado,
              proyectoDestacado: clienteData.proyectoDestacado,
              capacidadProyecto: clienteData.capacidadProyecto,
              ubicacionProyecto: clienteData.ubicacionProyecto,
              mostrarEnHome: true,
              activo: true,
              orden: created + updated + 100 // Ordenar después de los existentes
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

    console.log('\n=== RESUMEN DE CLIENTES PRIORITARIOS ===')
    console.log(`🆕 Clientes creados: ${created}`)
    console.log(`✅ Clientes actualizados: ${updated}`)
    console.log(`⏭️  Clientes omitidos: ${skipped}`)
    console.log(`📊 Total procesados: ${created + updated + skipped}`)

    // Mostrar estadísticas finales
    const totalClientes = await prisma.cliente.count()
    const clientesActivos = await prisma.cliente.count({ where: { activo: true } })
    const clientesDestacados = await prisma.cliente.count({ 
      where: { 
        activo: true,
        destacado: true
      }
    })

    console.log('\n=== ESTADÍSTICAS FINALES ===')
    console.log(`📋 Total clientes: ${totalClientes}`)
    console.log(`✅ Clientes activos: ${clientesActivos}`)
    console.log(`⭐ Clientes destacados: ${clientesDestacados}`)

  } catch (error) {
    console.error('❌ Error durante la adición:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  addPriorityClients().catch(console.error)
}

export { addPriorityClients, clientesPrioritarios }