import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function fixMissingProjects() {
  console.log('🔧 ARREGLANDO PROYECTOS CON CATEGORÍAS INCORRECTAS\n')
  
  // Mapeo de categorías en español a enum values
  const categoryMapping: Record<string, string> = {
    'Centros Comerciales': 'CENTROS_COMERCIALES',
    'Cubiertas y Fachadas': 'CUBIERTAS_Y_FACHADAS', 
    'Edificios': 'EDIFICIOS',
    'Escenarios Deportivos': 'ESCENARIOS_DEPORTIVOS',
    'Estructuras Modulares': 'ESTRUCTURAS_MODULARES',
    'Industrial': 'INDUSTRIA',
    'Oil and Gas': 'OIL_AND_GAS',
    'Otros': 'OTRO',
    'Puentes': 'PUENTES_VEHICULARES'
  }

  // Leer el archivo de proyectos
  const projectsData = await fs.readFile('./complete-projects-list.json', 'utf8')
  const projects = JSON.parse(projectsData)
  
  // Buscar usuario admin
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    console.log('❌ No se encontró usuario admin')
    return
  }

  let migrados = 0
  let errores = 0

  // Categorías que necesitamos migrar (las que fallaron antes)
  const categoriasAProcesar = ['Cubiertas y Fachadas', 'Industrial', 'Oil and Gas']
  
  for (const project of projects) {
    // Solo procesar proyectos de las categorías que fallaron
    if (!categoriasAProcesar.includes(project.categoria)) {
      continue // Ya fue migrado exitosamente
    }

    const mappedCategory = categoryMapping[project.categoria]
    
    // Verificar si ya existe
    const exists = await prisma.proyecto.findFirst({
      where: { titulo: project.titulo }
    })

    if (exists) {
      console.log('⏭️  Ya existe:', project.titulo)
      continue
    }

    try {
      // Crear slug único
      const baseSlug = project.titulo
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      const timestamp = Date.now()
      const slug = `${baseSlug}-${timestamp}`

      const newProject = await prisma.proyecto.create({
        data: {
          titulo: project.titulo,
          slug: slug,
          descripcion: `Proyecto de ${mappedCategory.toLowerCase().replace('_', ' ')} desarrollado por MEISA en ${project.ubicacion || 'Colombia'}. Este proyecto incluye el diseño, fabricación y montaje de estructuras metálicas con altos estándares de calidad y seguridad.`,
          categoria: mappedCategory as any,
          ubicacion: project.ubicacion || 'Colombia',
          estado: 'COMPLETADO',
          fechaInicio: new Date('2020-01-01'),
          fechaFin: new Date('2023-12-31'),
          createdBy: adminUser.id,
          cliente: 'Cliente confidencial',
          presupuesto: 0,
          destacadoEnCategoria: true // Marcar como destacado
        }
      })

      console.log(`✅ Migrado: ${project.titulo} (${project.categoria} → ${mappedCategory})`)
      migrados++

    } catch (error: any) {
      console.log(`❌ Error migrando ${project.titulo}:`, error.message)
      errores++
    }
  }

  console.log(`\n📊 RESUMEN:`)
  console.log(`✅ Proyectos arreglados: ${migrados}`)
  console.log(`❌ Errores: ${errores}`)
  
  const total = await prisma.proyecto.count()
  const destacados = await prisma.proyecto.count({ where: { destacadoEnCategoria: true } })
  
  console.log(`📊 Total proyectos en BD: ${total}`)
  console.log(`⭐ Proyectos destacados en categoría: ${destacados}`)
}

fixMissingProjects()
  .then(() => {
    console.log('\n🎉 ¡Proceso completado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })