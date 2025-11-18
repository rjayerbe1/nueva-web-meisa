import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const LOCAL_URL = process.env.DATABASE_URL

const neonPrisma = new PrismaClient({ datasources: { db: { url: NEON_URL } } })
const localPrisma = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } })

async function copyMissingTables() {
  console.log('\n🔄 Copiando tablas faltantes desde producción...\n')

  try {
    // PASO 0: Limpiar tablas que se copiarán (por si ya tienen datos parciales)
    console.log('🗑️  Limpiando tablas que se copiarán...')
    await localPrisma.brochurePage.deleteMany()
    await localPrisma.brochure.deleteMany()
    await localPrisma.historiaProyecto.deleteMany()
    await localPrisma.proyectoHojaVida.deleteMany()
    await localPrisma.seccionPagina.deleteMany()
    await localPrisma.pagina.deleteMany()
    await localPrisma.resumenAnio.deleteMany()
    await localPrisma.configuracionTrayectoria.deleteMany()
    console.log('   ✓ Tablas limpiadas\n')

    // 1. Configuración Trayectoria
    console.log('📦 1. Copiando ConfiguracionTrayectoria...')
    const configTrayectoria = await neonPrisma.configuracionTrayectoria.findMany()
    for (const config of configTrayectoria) {
      await localPrisma.configuracionTrayectoria.create({ data: config })
    }
    console.log(`   ✓ ${configTrayectoria.length} configuraciones copiadas`)

    // 2. Resumen Año (importante para trayectoria!)
    console.log('\n📦 2. Copiando ResumenAnio...')
    const resumenes = await neonPrisma.resumenAnio.findMany()
    for (const resumen of resumenes) {
      await localPrisma.resumenAnio.create({ data: resumen })
    }
    console.log(`   ✓ ${resumenes.length} resúmenes de año copiados`)

    // 3. Páginas
    console.log('\n📦 3. Copiando Páginas...')
    const paginas = await neonPrisma.pagina.findMany()
    for (const pagina of paginas) {
      await localPrisma.pagina.create({ data: pagina })
    }
    console.log(`   ✓ ${paginas.length} páginas copiadas`)

    // 4. Secciones de Página
    console.log('\n📦 4. Copiando Secciones de Página...')
    const secciones = await neonPrisma.seccionPagina.findMany()
    for (const seccion of secciones) {
      await localPrisma.seccionPagina.create({ data: seccion })
    }
    console.log(`   ✓ ${secciones.length} secciones de página copiadas`)

    // 5. Brochure Templates (PRIMERO - requerido por Brochures)
    console.log('\n📦 5. Copiando Brochure Templates...')
    try {
      const brochureTemplates = await neonPrisma.brochureTemplate.findMany()
      for (const template of brochureTemplates) {
        await localPrisma.brochureTemplate.create({ data: template })
      }
      console.log(`   ✓ ${brochureTemplates.length} templates copiados`)
    } catch (error) {
      console.log(`   ⚠️  No hay templates de brochure o ya existen`)
    }

    // 6. Page Templates
    console.log('\n📦 6. Copiando Page Templates...')
    try {
      const pageTemplates = await neonPrisma.pageTemplate.findMany()
      for (const template of pageTemplates) {
        await localPrisma.pageTemplate.create({ data: template })
      }
      console.log(`   ✓ ${pageTemplates.length} page templates copiados`)
    } catch (error) {
      console.log(`   ⚠️  No hay page templates o ya existen`)
    }

    // 7. Brochures
    console.log('\n📦 7. Copiando Brochures...')
    try {
      const brochures = await neonPrisma.brochure.findMany()
      for (const brochure of brochures) {
        await localPrisma.brochure.create({ data: brochure })
      }
      console.log(`   ✓ ${brochures.length} brochures copiados`)
    } catch (error) {
      console.log(`   ⚠️  Error copiando brochures: ${error.message}`)
    }

    // 8. Brochure Pages
    console.log('\n📦 8. Copiando Brochure Pages...')
    try {
      const brochurePages = await neonPrisma.brochurePage.findMany()
      for (const page of brochurePages) {
        await localPrisma.brochurePage.create({ data: page })
      }
      console.log(`   ✓ ${brochurePages.length} páginas de brochure copiadas`)
    } catch (error) {
      console.log(`   ⚠️  Error copiando brochure pages: ${error.message}`)
    }

    // 9. Historias de Proyecto
    console.log('\n📦 9. Copiando Historias de Proyecto...')
    const historias = await neonPrisma.historiaProyecto.findMany()
    for (const historia of historias) {
      await localPrisma.historiaProyecto.create({ data: historia })
    }
    console.log(`   ✓ ${historias.length} historias copiadas`)

    // 10. Proyecto Hoja de Vida (252 registros!)
    console.log('\n📦 10. Copiando Proyecto Hoja de Vida (esto puede tardar)...')
    const hojasVida = await neonPrisma.proyectoHojaVida.findMany()
    let copied = 0
    for (const hoja of hojasVida) {
      await localPrisma.proyectoHojaVida.create({ data: hoja })
      copied++
      if (copied % 50 === 0) {
        console.log(`   ... ${copied}/${hojasVida.length} hojas de vida copiadas`)
      }
    }
    console.log(`   ✓ ${hojasVida.length} hojas de vida copiadas`)

    console.log('\n✅ ¡Todas las tablas faltantes copiadas exitosamente!')
    console.log(`\n📊 Resumen de tablas copiadas:`)
    console.log(`   - ${configTrayectoria.length} ConfiguracionTrayectoria`)
    console.log(`   - ${resumenes.length} ResumenAnio (TRAYECTORIA)`)
    console.log(`   - ${paginas.length} Páginas`)
    console.log(`   - ${secciones.length} Secciones de Página`)
    console.log(`   - Templates de Brochure y Pages`)
    console.log(`   - Brochures y sus páginas`)
    console.log(`   - ${historias.length} Historias de Proyecto`)
    console.log(`   - ${hojasVida.length} Hojas de Vida`)
    console.log('\n   ¡Base de datos local ahora 100% completa!\n')

  } catch (error) {
    console.error('\n❌ Error copiando tablas:', error)
    throw error
  } finally {
    await neonPrisma.$disconnect()
    await localPrisma.$disconnect()
  }
}

copyMissingTables()
