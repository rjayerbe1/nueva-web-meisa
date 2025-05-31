#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixClientLogos() {
  console.log('🔧 Corrigiendo logos de clientes específicos...\n')

  try {
    // 1. Manejar Protecnica - eliminar duplicado y corregir el correcto
    console.log('1. 🔍 Verificando clientes Protecnica...')
    
    const protecnicaClientes = await prisma.cliente.findMany({
      where: {
        nombre: {
          contains: 'Protecnica',
          mode: 'insensitive'
        }
      }
    })

    console.log(`   Encontrados ${protecnicaClientes.length} clientes Protecnica:`)
    protecnicaClientes.forEach(cliente => {
      console.log(`   - ${cliente.nombre} (ID: ${cliente.id}) - Logo: ${cliente.logo}`)
    })

    if (protecnicaClientes.length > 1) {
      // Mantener el que tiene mejor información o el correcto
      const protecnicaCorrecto = protecnicaClientes.find(p => 
        p.nombre === 'Protecnica Ingeniería' || 
        p.descripcion?.includes('protección catódica')
      ) || protecnicaClientes[0]

      // Eliminar los otros
      const protecnicasAEliminar = protecnicaClientes.filter(p => p.id !== protecnicaCorrecto.id)
      
      for (const clienteEliminar of protecnicasAEliminar) {
        await prisma.cliente.delete({
          where: { id: clienteEliminar.id }
        })
        console.log(`   ❌ Eliminado duplicado: ${clienteEliminar.nombre}`)
      }

      // Actualizar el correcto
      await prisma.cliente.update({
        where: { id: protecnicaCorrecto.id },
        data: {
          nombre: 'Protecnica Ingeniería',
          logo: '/images/clients/cliente-protecnica-correcto.webp',
          descripcion: 'Empresa especializada en protección catódica y ingeniería de materiales',
          sitioWeb: 'https://protecnica.com.co',
          sector: 'CONSTRUCCION',
          destacado: true,
          proyectoDestacado: 'Protección Catódica Industrial',
          capacidadProyecto: '500+ Sistemas',
          ubicacionProyecto: 'Plantas Industriales Colombia'
        }
      })
      console.log(`   ✅ Actualizado Protecnica Ingeniería con logo correcto`)
    }

    // 2. Corregir Cargill
    console.log('\n2. 🔍 Corrigiendo logo de Cargill...')
    
    const cargillCliente = await prisma.cliente.findFirst({
      where: {
        nombre: {
          contains: 'Cargill',
          mode: 'insensitive'
        }
      }
    })

    if (cargillCliente) {
      await prisma.cliente.update({
        where: { id: cargillCliente.id },
        data: {
          logo: '/images/clients/cliente-cargill-correcto.webp'
        }
      })
      console.log(`   ✅ Logo de Cargill actualizado`)
    } else {
      console.log(`   ⚠️  Cliente Cargill no encontrado`)
    }

    // 3. Corregir SURA
    console.log('\n3. 🔍 Corrigiendo nombre y logo de SURA...')
    
    const suraCliente = await prisma.cliente.findFirst({
      where: {
        nombre: {
          contains: 'SURA',
          mode: 'insensitive'
        }
      }
    })

    if (suraCliente) {
      await prisma.cliente.update({
        where: { id: suraCliente.id },
        data: {
          nombre: 'Grupo SURA',
          slug: 'grupo-sura',
          logo: '/images/clients/cliente-grupo-sura.webp',
          descripcion: 'Grupo financiero líder en América Latina con presencia en seguros, pensiones, ahorro e inversión',
          sitioWeb: 'https://sura.com',
          sector: 'INSTITUCIONAL',
          destacado: true,
          proyectoDestacado: 'Edificio Corporativo SURA',
          capacidadProyecto: '8.500 m²',
          ubicacionProyecto: 'Medellín, Colombia'
        }
      })
      console.log(`   ✅ SURA actualizado a "Grupo SURA" con logo correcto`)
    } else {
      console.log(`   ⚠️  Cliente SURA no encontrado`)
    }

    // Verificación final
    console.log('\n=== VERIFICACIÓN FINAL ===')
    
    const protecnicaFinal = await prisma.cliente.findFirst({
      where: { nombre: 'Protecnica Ingeniería' }
    })
    
    const cargillFinal = await prisma.cliente.findFirst({
      where: { nombre: { contains: 'Cargill', mode: 'insensitive' } }
    })
    
    const suraFinal = await prisma.cliente.findFirst({
      where: { nombre: 'Grupo SURA' }
    })

    console.log(`✅ Protecnica Ingeniería: ${protecnicaFinal?.logo}`)
    console.log(`✅ Cargill: ${cargillFinal?.logo}`)
    console.log(`✅ Grupo SURA: ${suraFinal?.logo}`)

    // Contar clientes total
    const totalClientes = await prisma.cliente.count({ where: { activo: true } })
    console.log(`\n📊 Total clientes activos: ${totalClientes}`)

  } catch (error) {
    console.error('❌ Error al corregir logos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixClientLogos().catch(console.error)
}

export { fixClientLogos }