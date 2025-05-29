import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkServices() {
  try {
    const services = await prisma.servicio.findMany()
    
    console.log('📋 Servicios en la base de datos:')
    services.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.nombre}`)
      console.log(`   ID: ${service.id}`)
      console.log(`   Descripción: ${service.descripcion.substring(0, 50)}...`)
      console.log(`   Características: ${service.caracteristicas ? service.caracteristicas.length : 'undefined'}`)
      console.log(`   Orden: ${service.orden}`)
      console.log(`   Icono: ${service.icono}`)
      console.log(`   Slug: ${service.slug}`)
    })
    
    console.log(`\n✅ Total de servicios: ${services.length}`)
  } catch (error) {
    console.error('❌ Error al consultar servicios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkServices()