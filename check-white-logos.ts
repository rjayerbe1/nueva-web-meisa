#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Mapeo de logos que tienen versiones blancas específicas
const logosBlancosDisponibles = [
  {
    nombreCliente: 'Protecnica',
    logoBlanco: '/images/clients/cliente-protecnica.svg'
  },
  {
    nombreCliente: 'Arinsa',
    logoBlanco: '/images/clients/cliente-arinsa.svg'
  },
  {
    nombreCliente: 'Pollos Bucanero',
    logoBlanco: '/images/clients/cliente-pollos-bucanero.svg'
  },
  {
    nombreCliente: 'Tecnoquímicas',
    logoBlanco: '/images/clients/cliente-tecnoquimicas.svg'
  },
  {
    nombreCliente: 'Jaramillo',
    logoBlanco: '/images/clients/cliente-jaramillo.svg'
  },
  {
    nombreCliente: 'Royal Films',
    logoBlanco: '/images/clients/cliente-royal-films.svg'
  },
  {
    nombreCliente: 'Concreto',
    logoBlanco: '/images/clients/cliente-concreto.svg'
  },
  {
    nombreCliente: 'SENA',
    logoBlanco: '/images/clients/cliente-sena.svg'
  },
  {
    nombreCliente: 'Seguridad Omega',
    logoBlanco: '/images/clients/cliente-seguridad-omega.svg'
  },
  {
    nombreCliente: 'Manuelita',
    logoBlanco: '/images/clients/cliente-manuelita.svg'
  },
  {
    nombreCliente: 'Consorcio Edificar',
    logoBlanco: '/images/clients/cliente-consorcio-edificar.svg'
  },
  {
    nombreCliente: 'Comfacauca',
    logoBlanco: '/images/clients/cliente-comfacauca.svg'
  },
  {
    nombreCliente: 'Cargill',
    logoBlanco: '/images/clients/cliente-cargill.svg'
  },
  {
    nombreCliente: 'SURA',
    logoBlanco: '/images/clients/cliente-sura.svg'
  },
  {
    nombreCliente: 'Colpatria',
    logoBlanco: '/images/clients/cliente-colpatria.svg'
  },
  {
    nombreCliente: 'Éxito',
    logoBlanco: '/images/clients/cliente-exito.svg'
  },
  {
    nombreCliente: 'Normandía',
    logoBlanco: '/images/clients/cliente-normandia.svg'
  },
  {
    nombreCliente: 'Consorcio del Cauca',
    logoBlanco: '/images/clients/cliente-consorcio-del-cauca.svg'
  },
  {
    nombreCliente: 'Mayagüez',
    logoBlanco: '/images/clients/cliente-mayaguez.svg'
  },
  {
    nombreCliente: 'Tecnofar',
    logoBlanco: '/images/clients/cliente-tecnofar.svg'
  }
]

async function checkAndUpdateWhiteLogos() {
  console.log('🔍 Verificando logos blancos disponibles...\n')

  try {
    let updated = 0
    let notFound = 0
    let clientNotFound = 0

    for (const logoData of logosBlancosDisponibles) {
      try {
        // Verificar si el archivo del logo blanco existe
        const logoPath = path.join(process.cwd(), 'public', logoData.logoBlanco)
        
        if (!fs.existsSync(logoPath)) {
          console.log(`⚠️  Logo blanco no encontrado: ${logoData.logoBlanco}`)
          notFound++
          continue
        }

        // Buscar cliente en la base de datos
        const cliente = await prisma.cliente.findFirst({
          where: {
            nombre: {
              contains: logoData.nombreCliente,
              mode: 'insensitive'
            }
          }
        })

        if (!cliente) {
          console.log(`❌ Cliente no encontrado en BD: ${logoData.nombreCliente}`)
          clientNotFound++
          continue
        }

        // Actualizar con logo blanco
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            logoBlanco: logoData.logoBlanco
          }
        })

        console.log(`✅ Actualizado logo blanco: ${cliente.nombre} -> ${logoData.logoBlanco}`)
        updated++

      } catch (error) {
        console.error(`❌ Error procesando ${logoData.nombreCliente}:`, error)
        notFound++
      }
    }

    console.log('\n=== RESUMEN DE VERIFICACIÓN ===')
    console.log(`✅ Logos blancos configurados: ${updated}`)
    console.log(`⚠️  Archivos no encontrados: ${notFound}`)
    console.log(`❌ Clientes no encontrados: ${clientNotFound}`)

    // Estadísticas finales
    const clientesConLogoBlanco = await prisma.cliente.count({
      where: {
        logoBlanco: { not: null },
        activo: true
      }
    })

    const clientesConSoloLogo = await prisma.cliente.count({
      where: {
        logo: { not: null },
        logoBlanco: null,
        activo: true
      }
    })

    console.log('\n=== ESTADÍSTICAS LOGOS ===')
    console.log(`🎨 Clientes con logo blanco: ${clientesConLogoBlanco}`)
    console.log(`📷 Clientes solo con logo normal: ${clientesConSoloLogo}`)

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkAndUpdateWhiteLogos().catch(console.error)
}

export { checkAndUpdateWhiteLogos }