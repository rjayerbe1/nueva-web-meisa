import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function updateClientLogos() {
  console.log('🔄 Actualizando rutas de logos en la base de datos...')

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'clients')
    
    // Leer todos los archivos en el directorio
    const files = fs.readdirSync(imagesDir)
    
    // Mapeo de nombres de archivos a slugs
    const logoMappings: Record<string, string[]> = {
      'tecnoquimicas': ['cliente-tecnoquimicas.webp', 'cliente-tecnoquimicas.svg'],
      'cargill': ['cliente-cargill.webp', 'cliente-cargill.svg'],
      'tecnofar': ['cliente-tecnofar.webp', 'cliente-tecnofar.svg'],
      'protecnica': ['cliente-protecnica.webp', 'cliente-protecnica.svg'],
      'manuelita': ['cliente-manuelita.svg'],
      'mayaguez': ['cliente-mayaguez.png', 'cliente-mayaguez.svg'],
      'pollos-bucanero': ['cliente-pollos-bucanero.svg'],
      'exito': ['cliente-exito.svg'],
      'royal-films': ['cliente-royal-films.png', 'cliente-royal-films.svg'],
      'colpatria': ['cliente-colpatria.svg'],
      'normandia': ['cliente-normandia.svg'],
      'concreto': ['cliente-concreto.svg'],
      'consorcio-edificar': ['cliente-consorcio-edificar.png', 'cliente-consorcio-edificar.svg'],
      'jaramillo': ['cliente-jaramillo.svg'],
      'arinsa': ['cliente-arinsa.svg'],
      'sena': ['cliente-sena.png', 'cliente-sena.webp', 'cliente-sena.svg'],
      'sura': ['cliente-sura.webp', 'cliente-sura.svg'],
      'comfacauca': ['cliente-comfacauca.png', 'cliente-comfacauca.webp', 'cliente-comfacauca.svg'],
      'seguridad-omega': ['cliente-seguridad-omega.svg'],
      'consorcio-del-cauca': ['cliente-consorcio-del-cauca.svg']
    }

    for (const [slug, possibleFiles] of Object.entries(logoMappings)) {
      // Buscar el primer archivo que exista
      let logoPath = null
      for (const filename of possibleFiles) {
        if (files.includes(filename)) {
          logoPath = `/images/clients/${filename}`
          break
        }
      }

      if (logoPath) {
        // Actualizar el cliente con este slug
        const updated = await prisma.cliente.updateMany({
          where: { slug },
          data: {
            logo: logoPath,
            logoBlanco: logoPath // Por ahora usar el mismo para ambos
          }
        })
        
        if (updated.count > 0) {
          console.log(`✅ Actualizado logo para ${slug}: ${logoPath}`)
        }
      }
    }

    console.log('\n✅ Actualización de logos completada')
    
    // Mostrar resumen
    const clientes = await prisma.cliente.findMany()
    const conLogo = clientes.filter(c => c.logo && !c.logo.endsWith('.svg'))
    const conPlaceholder = clientes.filter(c => c.logo && c.logo.endsWith('.svg'))
    
    console.log(`\n📊 Resumen:`)
    console.log(`- Clientes con logo real: ${conLogo.length}`)
    console.log(`- Clientes con placeholder: ${conPlaceholder.length}`)
    console.log(`- Total clientes: ${clientes.length}`)
    
  } catch (error) {
    console.error('❌ Error al actualizar logos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateClientLogos()