import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const NEON_URL = 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const LOCAL_URL = process.env.DATABASE_URL

const neonPrisma = new PrismaClient({ datasources: { db: { url: NEON_URL } } })
const localPrisma = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } })

async function compareTables() {
  console.log('\n📊 COMPARACIÓN COMPLETA DE TABLAS\n')
  console.log('═'.repeat(80))

  const tables = [
    { name: 'Usuarios', model: 'user' },
    { name: 'Proyectos', model: 'proyecto' },
    { name: 'Imágenes Proyecto', model: 'imagenProyecto' },
    { name: 'Progreso Proyecto', model: 'progresoProyecto' },
    { name: 'Categorías Proyecto', model: 'categoriaProyecto' },
    { name: 'Clientes', model: 'cliente' },
    { name: 'Servicios', model: 'servicio' },
    { name: 'Configuración Sitio', model: 'configuracionSitio' },
    { name: 'Hitos Trayectoria', model: 'hitoTrayectoria' },
    { name: 'Configuración Trayectoria', model: 'configuracionTrayectoria' },
    { name: 'Resumen Año', model: 'resumenAnio' },
    { name: 'Páginas', model: 'pagina' },
    { name: 'Secciones Página', model: 'seccionPagina' },
    { name: 'Formularios Contacto', model: 'contactForm' },
    { name: 'Documentos Proyecto', model: 'documentoProyecto' },
    { name: 'Timeline Entries', model: 'timelineEntry' },
    { name: 'Comentarios Proyecto', model: 'comentarioProyecto' },
    { name: 'Brochures', model: 'brochure' },
    { name: 'Brochure Pages', model: 'brochurePage' },
    { name: 'Historias Proyecto', model: 'historiaProyecto' },
    { name: 'Proyecto Hoja Vida', model: 'proyectoHojaVida' },
  ]

  for (const table of tables) {
    try {
      const neonCount = await neonPrisma[table.model].count()
      const localCount = await localPrisma[table.model].count()

      const status = neonCount === localCount ? '✅' : '❌'
      const diff = neonCount - localCount

      console.log(`${status} ${table.name.padEnd(30)} Producción: ${String(neonCount).padStart(4)}  |  Local: ${String(localCount).padStart(4)}  |  Diferencia: ${diff > 0 ? '+' : ''}${diff}`)
    } catch (error) {
      console.log(`⚠️  ${table.name.padEnd(30)} Error: ${error.message}`)
    }
  }

  console.log('═'.repeat(80))
  console.log('\n')

  await neonPrisma.$disconnect()
  await localPrisma.$disconnect()
}

compareTables()
