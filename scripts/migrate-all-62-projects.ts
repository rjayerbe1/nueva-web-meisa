import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function migrateAll62Projects() {
  try {
    console.log('🚀 MIGRACIÓN DE LOS 62 PROYECTOS IDENTIFICADOS\n')
    console.log('=' .repeat(70) + '\n')

    // Leer la lista de proyectos generada
    const projectsData = await fs.readFile('./complete-projects-list.json', 'utf8')
    const projects = JSON.parse(projectsData)

    console.log(`📊 Total de proyectos a migrar: ${projects.length}`)

    // Verificar si existe usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('❌ No se encontró usuario admin')
      return
    }

    console.log(`✅ Usuario admin encontrado: ${adminUser.email}`)

    // Verificar proyectos existentes
    const existingProjects = await prisma.proyecto.findMany({
      select: { titulo: true }
    })
    const existingTitles = new Set(existingProjects.map(p => p.titulo))

    console.log(`📋 Proyectos existentes en BD: ${existingProjects.length}`)

    let migrated = 0
    let skipped = 0

    // Migrar cada proyecto
    for (const project of projects) {
      const title = project.titulo

      // Verificar si ya existe
      if (existingTitles.has(title)) {
        console.log(`⚠️  Ya existe: ${title}`)
        skipped++
        continue
      }

      // Mejorar el título si es necesario
      let improvedTitle = title
      if (title.toLowerCase() === 'plaza') {
        improvedTitle = `Plaza ${project.ubicacion}`
      } else if (title.toLowerCase() === 'unico') {
        improvedTitle = `Centro Comercial Único ${project.ubicacion}`
      } else if (title.toLowerCase().includes('campanario')) {
        improvedTitle = 'Centro Comercial Campanario'
      }

      // Mejorar la descripción
      const descripcion = `Proyecto de ${project.categoria.toLowerCase()} desarrollado por MEISA en ${project.ubicacion}. ` +
        `Este proyecto incluye el diseño, fabricación y montaje de estructuras metálicas con altos estándares de calidad y seguridad.`

      // Generar slug único
      const baseSlug = improvedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
      
      const slug = `${baseSlug}-${Date.now()}`

      // Mapear categorías a enum
      const categoryMap: { [key: string]: string } = {
        'Centros Comerciales': 'CENTROS_COMERCIALES',
        'Puentes': 'PUENTES',
        'Edificios': 'EDIFICIOS',
        'Industrial': 'INDUSTRIAL',
        'Escenarios Deportivos': 'ESCENARIOS_DEPORTIVOS',
        'Cubiertas y Fachadas': 'CUBIERTAS_FACHADAS',
        'Estructuras Modulares': 'ESTRUCTURAS_MODULARES',
        'Oil and Gas': 'OIL_GAS',
        'Otros': 'OTRO'
      }

      const categoria = categoryMap[project.categoria] || 'OTRO'

      try {
        // Crear el proyecto
        const newProject = await prisma.proyecto.create({
          data: {
            titulo: improvedTitle,
            slug: slug,
            descripcion: descripcion,
            categoria: categoria as any,
            ubicacion: project.ubicacion,
            estado: 'COMPLETADO',
            fechaInicio: new Date('2020-01-01'), // Fecha estimada
            fechaFin: new Date('2023-12-31'),    // Fecha estimada
            createdBy: adminUser.id,
            cliente: 'Cliente confidencial',
            presupuesto: 0
          }
        })

        // Crear imágenes de muestra usando las imágenes ya subidas
        const sampleImages = [
          '/uploads/projects/centro-comercial-campanario-1748544061266-14.webp',
          '/uploads/projects/centro-comercial-campanario-1748544060816-13.webp',
          '/uploads/projects/centro-comercial-campanario-1748544060109-12.webp',
          '/uploads/projects/centro-comercial-campanario-1748544059686-11.webp'
        ]

        // Crear algunas imágenes de muestra para cada proyecto
        const numImages = Math.min(3, sampleImages.length)
        for (let i = 0; i < numImages; i++) {
          await prisma.imagenProyecto.create({
            data: {
              url: sampleImages[i],
              alt: `Vista ${i + 1} del proyecto ${improvedTitle}`,
              proyectoId: newProject.id,
              descripcion: `Vista ${i + 1} del proyecto ${improvedTitle}`
            }
          })
        }

        console.log(`✅ Migrado: ${improvedTitle} (${project.categoria}) - ${project.ubicacion}`)
        migrated++

      } catch (error) {
        console.error(`❌ Error migrando ${title}:`, error)
      }
    }

    // Resumen final
    console.log('\n📊 RESUMEN DE MIGRACIÓN:')
    console.log('=' .repeat(50))
    console.log(`✅ Proyectos migrados: ${migrated}`)
    console.log(`⚠️  Proyectos omitidos: ${skipped}`)
    console.log(`📊 Total en BD ahora: ${migrated + existingProjects.length}`)

    // Estadísticas por categoría
    const finalProjects = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })

    console.log('\n📂 DISTRIBUCIÓN POR CATEGORÍAS:')
    finalProjects.forEach(cat => {
      console.log(`   ${cat.categoria}: ${cat._count.id} proyectos`)
    })

    const totalImages = await prisma.imagenProyecto.count()
    console.log(`\n🖼️  Total de imágenes: ${totalImages}`)

    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!')
    console.log(`\n🌐 Ahora tienes ${migrated + existingProjects.length} proyectos en tu sitio web`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateAll62Projects()