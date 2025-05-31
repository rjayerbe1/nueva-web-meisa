#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixConconcreto() {
  console.log('🔧 Corrigiendo información de Conconcreto...\n')

  try {
    // Buscar el cliente con nombre incorrecto
    const clienteIncorrecto = await prisma.cliente.findFirst({
      where: {
        OR: [
          { nombre: { contains: 'Constructora Concreto', mode: 'insensitive' } },
          { nombre: { contains: 'Concreto', mode: 'insensitive' } }
        ]
      }
    })

    if (clienteIncorrecto) {
      console.log(`📝 Cliente encontrado: ${clienteIncorrecto.nombre}`)
      
      // Actualizar con información correcta
      await prisma.cliente.update({
        where: { id: clienteIncorrecto.id },
        data: {
          nombre: 'Conconcreto',
          slug: 'conconcreto', 
          logo: '/images/clients/cliente-conconcreto.webp',
          descripcion: 'Empresa constructora líder en Colombia especializada en estructuras de concreto y obras civiles',
          sitioWeb: 'https://conconcreto.com',
          sector: 'CONSTRUCCION',
          destacado: true,
          proyectoDestacado: 'Estructuras de Concreto',
          capacidadProyecto: '25.000 m²',
          ubicacionProyecto: 'Colombia',
          mostrarEnHome: true,
          activo: true
        }
      })

      console.log('✅ Cliente actualizado correctamente:')
      console.log(`   Nombre: Constructora Concreto → Conconcreto`)
      console.log(`   Logo: ${clienteIncorrecto.logo} → /images/clients/cliente-conconcreto.webp`)
      console.log(`   Sitio web: ${clienteIncorrecto.sitioWeb || 'Sin sitio'} → https://conconcreto.com`)
      console.log(`   Proyecto destacado: ${clienteIncorrecto.proyectoDestacado || 'Sin proyecto'} → Estructuras de Concreto`)
      
    } else {
      console.log('⚠️  No se encontró cliente con nombre "Constructora Concreto"')
      
      // Crear nuevo cliente Conconcreto
      const nuevoCliente = await prisma.cliente.create({
        data: {
          nombre: 'Conconcreto',
          slug: 'conconcreto',
          logo: '/images/clients/cliente-conconcreto.webp',
          descripcion: 'Empresa constructora líder en Colombia especializada en estructuras de concreto y obras civiles',
          sitioWeb: 'https://conconcreto.com',
          sector: 'CONSTRUCCION',
          destacado: true,
          proyectoDestacado: 'Estructuras de Concreto',
          capacidadProyecto: '25.000 m²',
          ubicacionProyecto: 'Colombia',
          mostrarEnHome: true,
          activo: true,
          orden: 100
        }
      })
      
      console.log('🆕 Nuevo cliente Conconcreto creado')
      console.log(`   ID: ${nuevoCliente.id}`)
    }

    // Verificar resultado
    const clienteCorregido = await prisma.cliente.findFirst({
      where: { nombre: 'Conconcreto' }
    })

    if (clienteCorregido) {
      console.log('\n✅ Verificación exitosa:')
      console.log(`   Nombre: ${clienteCorregido.nombre}`)
      console.log(`   Slug: ${clienteCorregido.slug}`)
      console.log(`   Logo: ${clienteCorregido.logo}`)
      console.log(`   Sitio web: ${clienteCorregido.sitioWeb}`)
      console.log(`   Destacado: ${clienteCorregido.destacado ? 'Sí' : 'No'}`)
    }

  } catch (error) {
    console.error('❌ Error al corregir Conconcreto:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixConconcreto().catch(console.error)
}

export { fixConconcreto }