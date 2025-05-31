#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateNewLogos() {
  console.log('🔄 Actualizando logos nuevos...\n')

  try {
    // 1. Actualizar Dollarcity con logo real
    const dollarcityUpdate = await prisma.cliente.updateMany({
      where: { slug: 'dollarcity' },
      data: { 
        logo: '/images/clients/cliente-dollarcity.png',
        logoBlanco: '/images/clients/cliente-dollarcity.png'
      }
    })
    console.log(`✅ Dollarcity actualizado (${dollarcityUpdate.count} registros)`)

    // 2. Verificar si Grupo Constructor Prodigyo ya existe
    const prodigyo = await prisma.cliente.findFirst({
      where: { 
        OR: [
          { nombre: { contains: 'Prodigyo', mode: 'insensitive' } },
          { slug: 'grupo-constructor-prodigyo-sa' }
        ]
      }
    })

    if (!prodigyo) {
      // Crear Grupo Constructor Prodigyo
      const newProdigyo = await prisma.cliente.create({
        data: {
          nombre: 'Grupo Constructor Prodigyo SA',
          slug: 'grupo-constructor-prodigyo-sa',
          logo: '/images/clients/cliente-grupo-prodigyo.png',
          logoBlanco: '/images/clients/cliente-grupo-prodigyo.png',
          descripcion: 'Empresa constructora especializada en proyectos de ingeniería civil y arquitectura',
          sitioWeb: 'https://www.grupoprodigyo.com',
          sector: 'CONSTRUCCION',
          destacado: true,
          proyectoDestacado: 'Proyectos de Construcción',
          capacidadProyecto: '50+ Proyectos',
          ubicacionProyecto: 'Colombia',
          mostrarEnHome: true,
          activo: true,
          orden: 200
        }
      })
      console.log(`✅ Grupo Constructor Prodigyo creado (ID: ${newProdigyo.id})`)
    } else {
      console.log(`⚠️  Grupo Constructor Prodigyo ya existe: ${prodigyo.nombre}`)
    }

    // 3. Agregar algunos clientes más sin logo pero importantes
    const clientesAdicionales = [
      {
        nombre: 'Constructora Inverteq SAS',
        slug: 'constructora-inverteq-sas',
        descripcion: 'Empresa constructora especializada en obras civiles e infraestructura',
        sector: 'CONSTRUCCION',
        destacado: false
      },
      {
        nombre: 'Emco Ingeniería SAS',
        slug: 'emco-ingenieria-sas',
        descripcion: 'Empresa de ingeniería y consultoría en proyectos de infraestructura',
        sitioWeb: 'https://emcoingenieria.com',
        sector: 'CONSTRUCCION',
        destacado: false
      },
      {
        nombre: 'Avícola Pollo Listo SAS',
        slug: 'avicola-pollo-listo-sas',
        descripcion: 'Empresa avícola especializada en producción y procesamiento de pollo',
        sector: 'INDUSTRIAL',
        destacado: false
      }
    ]

    for (const clienteData of clientesAdicionales) {
      const existeCliente = await prisma.cliente.findFirst({
        where: { 
          OR: [
            { slug: clienteData.slug },
            { nombre: { contains: clienteData.nombre.split(' ')[0], mode: 'insensitive' } }
          ]
        }
      })

      if (!existeCliente) {
        const newCliente = await prisma.cliente.create({
          data: {
            nombre: clienteData.nombre,
            slug: clienteData.slug,
            logo: null,
            logoBlanco: null,
            descripcion: clienteData.descripcion,
            sitioWeb: clienteData.sitioWeb || null,
            sector: clienteData.sector,
            destacado: clienteData.destacado,
            mostrarEnHome: false, // No mostrar en home sin logo
            activo: true,
            orden: 300
          }
        })
        console.log(`✅ ${clienteData.nombre} creado (ID: ${newCliente.id})`)
      } else {
        console.log(`⚠️  ${clienteData.nombre} ya existe`)
      }
    }

    // Estadísticas finales
    const totalClientes = await prisma.cliente.count()
    const clientesActivos = await prisma.cliente.count({ where: { activo: true } })
    const clientesConLogo = await prisma.cliente.count({ 
      where: { 
        activo: true,
        logo: { not: null }
      }
    })

    console.log('\n=== ESTADÍSTICAS ACTUALIZADAS ===')
    console.log(`📋 Total clientes: ${totalClientes}`)
    console.log(`✅ Clientes activos: ${clientesActivos}`)
    console.log(`🖼️  Clientes con logo: ${clientesConLogo}`)
    console.log(`📊 Clientes sin logo: ${clientesActivos - clientesConLogo}`)

  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateNewLogos().catch(console.error)
}

export { updateNewLogos }