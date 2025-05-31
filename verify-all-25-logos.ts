#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Lista completa de los 25 clientes del carrusel de meisa.com.co
const clientesCarrusel = [
  { nombre: 'Protecnica Ingeniería', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Protecnica_ingenieria-300x67.webp', archivo: 'cliente-protecnica.webp' },
  { nombre: 'Constructora Normandía', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Constructora-Normandia-300x300.webp', archivo: 'cliente-normandia.webp' },
  { nombre: 'Arinsa Constructora', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Arinsa-Constructora-300x169.webp', archivo: 'cliente-arinsa.webp' },
  { nombre: 'Pollos Bucanero', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Pollosbucanero-logo-e1682387456202.webp', archivo: 'cliente-pollos-bucanero.webp' },
  { nombre: 'Tecnoquímicas', url: 'https://meisa.com.co/wp-content/uploads/2023/04/tecnoquimicas-e1682386092534-294x300.webp', archivo: 'cliente-tecnoquimicas.webp' },
  { nombre: 'Jaramillo Constructora', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Jaramillo-Constructora-300x101.webp', archivo: 'cliente-jaramillo.webp' },
  { nombre: 'Unicentro Cali', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Unicentro-Cali-e1682384734916-300x204.webp', archivo: 'cliente-unicentro.webp' },
  { nombre: 'Royal Films', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Royal-Films-1-300x300.webp', archivo: 'cliente-royal-films.webp' },
  { nombre: 'Conconcreto', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Constructora-Concreto-300x68.webp', archivo: 'cliente-conconcreto.webp' },
  { nombre: 'Smurfit Kappa', url: 'https://meisa.com.co/wp-content/uploads/2023/04/smurfit_kappa-300x89.webp', archivo: 'cliente-smurfit-kappa.webp' },
  { nombre: 'SENA', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Sena-logo-300x292.webp', archivo: 'cliente-sena.webp' },
  { nombre: 'Seguridad Omega', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Seguridad-Omega-e1682387342390-300x156.webp', archivo: 'cliente-seguridad-omega.webp' },
  { nombre: 'SAINC', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Sainc-logo-e1682387390864-300x300.webp', archivo: 'cliente-sainc.webp' },
  { nombre: 'Mensula Ingenieros', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Mensula-ingenieros-300x90.webp', archivo: 'cliente-mensula.webp' },
  { nombre: 'Johnson & Johnson', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Johnson-johnson-300x54.webp', archivo: 'cliente-johnson-johnson.webp' },
  { nombre: 'Mayagüez', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Mayaguez-logo-300x83.webp', archivo: 'cliente-mayaguez.webp' },
  { nombre: 'Ingenio María Luisa', url: 'https://meisa.com.co/wp-content/uploads/2023/04/ingenio-maria-luisa-300x55.webp', archivo: 'cliente-ingenio-maria-luisa.webp' },
  { nombre: 'Manuelita', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Azucar-Manuelita-300x225.webp', archivo: 'cliente-manuelita.webp' },
  { nombre: 'Consorcio Edificar', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Consorcio-Edificar-e1682387686401-300x111.webp', archivo: 'cliente-consorcio-edificar.webp' },
  { nombre: 'Comfacauca', url: 'https://meisa.com.co/wp-content/uploads/2023/04/comfacauca-logo-300x207.webp', archivo: 'cliente-comfacauca.webp' },
  { nombre: 'Cargill', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Cargill-Logo-e1682387837398-300x133.webp', archivo: 'cliente-cargill.webp' },
  { nombre: 'SURA', url: 'https://meisa.com.co/wp-content/uploads/2023/04/SURA-logo-300x151.webp', archivo: 'cliente-sura.webp' },
  { nombre: 'Ingenio Providencia', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Ingenio-Providencia-300x152.webp', archivo: 'cliente-ingenio-providencia.webp' },
  { nombre: 'Colpatria', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Colpatria-Constructora-300x73.webp', archivo: 'cliente-colpatria.webp' },
  { nombre: 'Éxito', url: 'https://meisa.com.co/wp-content/uploads/2023/04/Exito-Logo-300x300.webp', archivo: 'cliente-exito.webp' }
]

async function verifyAll25Logos() {
  console.log('🔍 Verificando los 25 logos del carrusel de clientes...\n')

  try {
    let archivosExistentes = 0
    let archivosFaltantes = 0
    let clientesEnBD = 0
    let clientesFaltantesBD = 0

    console.log('=== VERIFICACIÓN DE ARCHIVOS ===')
    
    for (const cliente of clientesCarrusel) {
      const rutaArchivo = path.join(process.cwd(), 'public', 'images', 'clients', cliente.archivo)
      const existe = fs.existsSync(rutaArchivo)
      
      if (existe) {
        const stats = fs.statSync(rutaArchivo)
        console.log(`✅ ${cliente.archivo} (${Math.round(stats.size / 1024)} KB)`)
        archivosExistentes++
      } else {
        console.log(`❌ ${cliente.archivo} - FALTANTE`)
        archivosFaltantes++
      }
    }

    console.log('\n=== VERIFICACIÓN EN BASE DE DATOS ===')
    
    for (const cliente of clientesCarrusel) {
      const clienteBD = await prisma.cliente.findFirst({
        where: {
          nombre: {
            contains: cliente.nombre,
            mode: 'insensitive'
          }
        }
      })
      
      if (clienteBD) {
        const tieneLogoCorrecto = clienteBD.logo === `/images/clients/${cliente.archivo}`
        console.log(`✅ ${cliente.nombre} - ${tieneLogoCorrecto ? 'Logo correcto' : `Logo: ${clienteBD.logo}`}`)
        clientesEnBD++
      } else {
        console.log(`❌ ${cliente.nombre} - NO ENCONTRADO EN BD`)
        clientesFaltantesBD++
      }
    }

    // Verificar archivos extra
    console.log('\n=== ARCHIVOS EXTRAS EN DIRECTORIO ===')
    const dirClients = path.join(process.cwd(), 'public', 'images', 'clients')
    const todosArchivos = fs.readdirSync(dirClients).filter(f => f.endsWith('.webp'))
    const archivosEsperados = clientesCarrusel.map(c => c.archivo)
    const archivosExtras = todosArchivos.filter(archivo => !archivosEsperados.includes(archivo))
    
    if (archivosExtras.length > 0) {
      console.log('📁 Archivos adicionales encontrados:')
      archivosExtras.forEach(archivo => {
        const stats = fs.statSync(path.join(dirClients, archivo))
        console.log(`   - ${archivo} (${Math.round(stats.size / 1024)} KB)`)
      })
    } else {
      console.log('✅ No hay archivos extras')
    }

    console.log('\n=== RESUMEN FINAL ===')
    console.log(`📁 Archivos de logos:`)
    console.log(`   ✅ Existentes: ${archivosExistentes}/${clientesCarrusel.length}`)
    console.log(`   ❌ Faltantes: ${archivosFaltantes}`)
    
    console.log(`💾 Base de datos:`)
    console.log(`   ✅ Clientes registrados: ${clientesEnBD}/${clientesCarrusel.length}`)
    console.log(`   ❌ Clientes faltantes: ${clientesFaltantesBD}`)
    
    console.log(`📊 Total archivos en directorio: ${todosArchivos.length}`)
    console.log(`📊 Archivos extras: ${archivosExtras.length}`)

    if (archivosExistentes === 25 && clientesEnBD === 25) {
      console.log('\n🎉 ¡PERFECTO! Los 25 logos del carrusel están completos')
    } else {
      console.log('\n⚠️  Hay logos o clientes faltantes que necesitan atención')
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verifyAll25Logos().catch(console.error)
}

export { verifyAll25Logos, clientesCarrusel }