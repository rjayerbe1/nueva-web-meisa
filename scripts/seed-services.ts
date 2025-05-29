import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function seedServices() {
  try {
    // Crear algunos servicios de ejemplo
    const services = [
      {
        nombre: 'Diseño Estructural',
        slug: 'diseno-estructural',
        descripcion: 'Diseño y cálculo de estructuras metálicas utilizando software especializado y normativas internacionales.',
        caracteristicas: [
          'Análisis de cargas y esfuerzos',
          'Modelado 3D estructural',
          'Cumplimiento de normativas NSR-10',
          'Optimización de materiales'
        ],
        orden: 1,
        icono: '🏗️'
      },
      {
        nombre: 'Fabricación de Estructuras',
        slug: 'fabricacion-estructuras',
        descripcion: 'Fabricación de estructuras metálicas con tecnología de punta y control de calidad certificado.',
        caracteristicas: [
          'Corte con plasma CNC',
          'Soldadura certificada',
          'Control de calidad riguroso',
          'Acabados especializados'
        ],
        orden: 2,
        icono: '⚙️'
      },
      {
        nombre: 'Montaje y Instalación',
        slug: 'montaje-instalacion',
        descripcion: 'Servicio completo de montaje e instalación de estructuras metálicas en obra.',
        caracteristicas: [
          'Personal técnico especializado',
          'Equipos de izaje certificados',
          'Supervisión técnica',
          'Cumplimiento de cronogramas'
        ],
        orden: 3,
        icono: '🔧'
      }
    ]

    for (const service of services) {
      await prisma.servicio.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      })
    }

    console.log('✅ Servicios creados exitosamente')
  } catch (error) {
    console.error('❌ Error al crear servicios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedServices()