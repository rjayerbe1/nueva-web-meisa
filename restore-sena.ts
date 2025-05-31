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

async function restoreSENA() {
  console.log('🔍 Verificando cliente SENA...\n')

  try {
    // Buscar SENA en la base de datos
    const senaExistente = await prisma.cliente.findFirst({
      where: {
        nombre: {
          contains: 'SENA',
          mode: 'insensitive'
        }
      }
    })

    if (senaExistente) {
      console.log(`✅ SENA ya existe en la base de datos:`)
      console.log(`   ID: ${senaExistente.id}`)
      console.log(`   Nombre: ${senaExistente.nombre}`)
      console.log(`   Logo: ${senaExistente.logo}`)
      console.log(`   Activo: ${senaExistente.activo}`)
      
      // Asegurar que tenga la información correcta
      await prisma.cliente.update({
        where: { id: senaExistente.id },
        data: {
          nombre: 'SENA',
          logo: '/images/clients/cliente-sena.webp',
          descripcion: 'Servicio Nacional de Aprendizaje - Entidad pública de educación para el trabajo y desarrollo humano',
          sitioWeb: 'https://sena.edu.co',
          sector: 'GOBIERNO',
          destacado: true,
          proyectoDestacado: 'Centro de Formación SENA',
          capacidadProyecto: '4.500 m²',
          ubicacionProyecto: 'Popayán, Cauca',
          mostrarEnHome: true,
          activo: true
        }
      })
      console.log(`   ✅ Información de SENA actualizada`)
      
    } else {
      console.log(`❌ SENA no encontrado en la base de datos. Creándolo...`)
      
      const nuevoSENA = await prisma.cliente.create({
        data: {
          nombre: 'SENA',
          slug: generateSlug('SENA'),
          logo: '/images/clients/cliente-sena.webp',
          descripcion: 'Servicio Nacional de Aprendizaje - Entidad pública de educación para el trabajo y desarrollo humano',
          sitioWeb: 'https://sena.edu.co',
          sector: 'GOBIERNO',
          destacado: true,
          proyectoDestacado: 'Centro de Formación SENA',
          capacidadProyecto: '4.500 m²',
          ubicacionProyecto: 'Popayán, Cauca',
          mostrarEnHome: true,
          activo: true,
          orden: 11
        }
      })
      
      console.log(`✅ SENA creado exitosamente:`)
      console.log(`   ID: ${nuevoSENA.id}`)
      console.log(`   Nombre: ${nuevoSENA.nombre}`)
      console.log(`   Logo: ${nuevoSENA.logo}`)
      console.log(`   Sector: ${nuevoSENA.sector}`)
    }

    // Verificación final
    const senaFinal = await prisma.cliente.findFirst({
      where: { nombre: 'SENA' }
    })

    if (senaFinal) {
      console.log('\n🎉 SENA restaurado correctamente:')
      console.log(`   Nombre: ${senaFinal.nombre}`)
      console.log(`   Logo: ${senaFinal.logo}`)
      console.log(`   Sector: ${senaFinal.sector}`)
      console.log(`   Destacado: ${senaFinal.destacado}`)
      console.log(`   Proyecto: ${senaFinal.proyectoDestacado}`)
      console.log(`   Activo: ${senaFinal.activo}`)
    }

    // Contar total de clientes
    const totalClientes = await prisma.cliente.count({ where: { activo: true } })
    console.log(`\n📊 Total clientes activos: ${totalClientes}`)

  } catch (error) {
    console.error('❌ Error al restaurar SENA:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  restoreSENA().catch(console.error)
}

export { restoreSENA }