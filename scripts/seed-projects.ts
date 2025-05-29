import { PrismaClient, EstadoProyecto, PrioridadEnum, CategoriaEnum } from '@prisma/client'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function seedProjects() {
  try {
    // Primero buscar un usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { 
        role: 'ADMIN'
      }
    })

    if (!adminUser) {
      console.error('❌ No se encontró un usuario admin. Por favor crea uno primero.')
      return
    }

    console.log(`👤 Usando usuario admin: ${adminUser.email}`)

    // Crear proyectos de ejemplo
    const projects = [
      {
        titulo: 'Centro Comercial Plaza Norte',
        descripcion: 'Diseño y construcción de estructura metálica para nuevo centro comercial de 15,000 m²',
        categoria: CategoriaEnum.CENTROS_COMERCIALES,
        cliente: 'Grupo Inmobiliario Plaza',
        ubicacion: 'Bogotá, Colombia',
        fechaInicio: new Date('2024-01-15'),
        fechaFin: new Date('2024-08-30'),
        estado: EstadoProyecto.EN_PROGRESO,
        prioridad: PrioridadEnum.ALTA,
        presupuesto: 2500000000,
        costoReal: 1200000000,
        destacado: true,
        slug: 'centro-comercial-plaza-norte'
      },
      {
        titulo: 'Bodega Industrial Zona Franca',
        descripcion: 'Fabricación e instalación de estructura metálica para bodega industrial de 8,000 m²',
        categoria: CategoriaEnum.INDUSTRIAL,
        cliente: 'Logística Internacional S.A.',
        ubicacion: 'Cartagena, Colombia',
        fechaInicio: new Date('2024-02-01'),
        fechaFin: new Date('2024-07-15'),
        estado: EstadoProyecto.EN_PROGRESO,
        prioridad: PrioridadEnum.MEDIA,
        presupuesto: 1800000000,
        costoReal: 900000000,
        destacado: true,
        slug: 'bodega-industrial-zona-franca'
      },
      {
        titulo: 'Puente Peatonal Universidad',
        descripcion: 'Diseño y construcción de puente peatonal metálico de 50 metros de longitud',
        categoria: CategoriaEnum.INFRAESTRUCTURA,
        cliente: 'Universidad Nacional',
        ubicacion: 'Medellín, Colombia',
        fechaInicio: new Date('2023-11-01'),
        fechaFin: new Date('2024-03-15'),
        estado: EstadoProyecto.COMPLETADO,
        prioridad: PrioridadEnum.ALTA,
        presupuesto: 850000000,
        costoReal: 820000000,
        destacado: true,
        slug: 'puente-peatonal-universidad'
      },
      {
        titulo: 'Edificio Corporativo Torre 45',
        descripcion: 'Estructura metálica para edificio de oficinas de 20 pisos',
        categoria: CategoriaEnum.EDIFICIOS,
        cliente: 'Constructora Torre 45',
        ubicacion: 'Cali, Colombia',
        fechaInicio: new Date('2024-03-01'),
        fechaFin: new Date('2025-03-01'),
        estado: EstadoProyecto.EN_PROGRESO,
        prioridad: PrioridadEnum.ALTA,
        presupuesto: 4500000000,
        costoReal: 800000000,
        destacado: false,
        slug: 'edificio-corporativo-torre-45'
      }
    ]

    console.log('🚀 Creando proyectos...')

    for (const project of projects) {
      await prisma.proyecto.create({
        data: {
          ...project,
          user: {
            connect: { id: adminUser.id }
          }
        }
      })
      console.log(`✅ Creado: ${project.titulo}`)
    }

    console.log(`\n🎉 ¡${projects.length} proyectos creados exitosamente!`)
    
    // Verificar resultado
    const totalProjects = await prisma.proyecto.count()
    console.log(`📊 Total de proyectos en la base de datos: ${totalProjects}`)
    
  } catch (error) {
    console.error('❌ Error al crear proyectos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedProjects()