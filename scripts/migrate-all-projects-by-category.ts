import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProjectData {
  titulo: string
  descripcion: string
  categoria: string
  ubicacion: string
  peso: string
  cliente: string
  imagen_principal?: string
  imagenes: string[]
}

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    if (!url || url === 'placeholder' || url.includes('placeholder')) {
      return null
    }

    // Limpiar la URL
    const cleanUrl = url.replace(/["\[\]]/g, '').trim()
    if (!cleanUrl.startsWith('http')) {
      return null
    }

    console.log(`Descargando imagen: ${cleanUrl}`)
    
    const response = await fetch(cleanUrl)
    if (!response.ok) {
      console.log(`Error al descargar ${cleanUrl}: ${response.status}`)
      return null
    }

    const buffer = await response.buffer()
    const extension = path.extname(cleanUrl) || '.jpg'
    const safeFilename = `${filename}${extension}`.replace(/[^a-zA-Z0-9.-]/g, '-')
    
    const uploadDir = './public/uploads/projects'
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filepath = path.join(uploadDir, safeFilename)
    await fs.writeFile(filepath, buffer)
    
    return `/uploads/projects/${safeFilename}`
  } catch (error) {
    console.error(`Error descargando imagen ${url}:`, error)
    return null
  }
}

async function migrateAllProjectsByCategory() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meisa_wordpress',
    port: 3306
  })

  try {
    console.log('🏗️ MIGRACIÓN COMPLETA DE PROYECTOS POR CATEGORÍAS\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Obtener todas las categorías de proyectos
    console.log('📂 Buscando categorías de proyectos...\n')
    
    const [categories] = await connection.execute<any[]>(
      `SELECT DISTINCT 
         t.name as category_name,
         t.slug as category_slug,
         COUNT(tr.object_id) as project_count
       FROM wp_terms t
       INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
       INNER JOIN wp_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
       INNER JOIN wp_posts p ON tr.object_id = p.ID
       WHERE tt.taxonomy = 'project_category' 
       AND p.post_status = 'publish'
       AND p.post_type = 'project'
       GROUP BY t.term_id, t.name, t.slug
       ORDER BY project_count DESC`
    )

    console.log('Categorías encontradas:')
    categories.forEach(cat => {
      console.log(`- ${cat.category_name}: ${cat.project_count} proyectos`)
    })

    console.log('\n📊 Iniciando migración por categorías...\n')

    // 2. Para cada categoría, obtener todos sus proyectos
    for (const category of categories) {
      console.log(`\n🔄 Procesando categoría: ${category.category_name}`)
      console.log(`   Slug: ${category.category_slug}`)
      console.log(`   Proyectos: ${category.project_count}`)

      const [projects] = await connection.execute<any[]>(
        `SELECT 
           p.ID,
           p.post_title,
           p.post_content,
           p.post_excerpt,
           p.post_name,
           p.post_date
         FROM wp_posts p
         INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
         INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
         INNER JOIN wp_terms t ON tt.term_id = t.term_id
         WHERE t.slug = ?
         AND p.post_status = 'publish'
         AND p.post_type = 'project'
         ORDER BY p.post_date DESC`,
        [category.category_slug]
      )

      console.log(`   📄 Encontrados ${projects.length} proyectos en ${category.category_name}`)

      // 3. Procesar cada proyecto
      for (const project of projects) {
        console.log(`\n   🏗️  Procesando: ${project.post_title}`)

        // Obtener metadatos del proyecto
        const [metadata] = await connection.execute<any[]>(
          `SELECT meta_key, meta_value 
           FROM wp_postmeta 
           WHERE post_id = ?`,
          [project.ID]
        )

        let projectData: ProjectData = {
          titulo: project.post_title,
          descripcion: project.post_content || project.post_excerpt || '',
          categoria: category.category_name,
          ubicacion: '',
          peso: '',
          cliente: '',
          imagenes: []
        }

        // Extraer metadatos específicos
        const metaMap = new Map()
        metadata.forEach(meta => {
          metaMap.set(meta.meta_key, meta.meta_value)
        })

        // Buscar información en el contenido
        const content = project.post_content || ''
        
        // Extraer ubicación
        const ubicacionMatch = content.match(/ubicaci[óo]n[:\s]*([^<\n]+)/i) ||
                              content.match(/([^,]+,\s*[^<\n.]+(?:cauca|valle|cundinamarca|antioquia|santander))/i)
        if (ubicacionMatch) {
          projectData.ubicacion = ubicacionMatch[1].trim()
        }

        // Extraer peso/toneladas
        const pesoMatch = content.match(/(\d+(?:\.\d+)?)\s*toneladas?/i) ||
                         content.match(/peso[:\s]*(\d+(?:\.\d+)?)/i)
        if (pesoMatch) {
          projectData.peso = `${pesoMatch[1]} toneladas`
        }

        // Extraer cliente
        const clienteMatch = content.match(/cliente[:\s]*([^<\n]+)/i) ||
                           content.match(/constructor[a]?[:\s]*([^<\n]+)/i)
        if (clienteMatch) {
          projectData.cliente = clienteMatch[1].trim()
        }

        // Buscar imágenes asociadas al proyecto
        const [images] = await connection.execute<any[]>(
          `SELECT 
             p.ID,
             p.post_title,
             p.guid,
             pm.meta_value as file_path
           FROM wp_posts p
           LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_wp_attached_file'
           WHERE p.post_parent = ?
           AND p.post_type = 'attachment'
           AND p.post_mime_type LIKE 'image/%'
           ORDER BY p.menu_order ASC, p.post_date ASC`,
          [project.ID]
        )

        console.log(`     📸 Encontradas ${images.length} imágenes`)

        // Procesar imágenes
        const downloadedImages: string[] = []
        
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          const imageUrl = image.guid || `https://meisa.com.co/wp-content/uploads/${image.file_path}`
          
          if (imageUrl && !imageUrl.includes('placeholder')) {
            const filename = `${project.post_name}-${Date.now()}-${i}`
            const localPath = await downloadImage(imageUrl, filename)
            
            if (localPath) {
              downloadedImages.push(localPath)
              if (i === 0) {
                projectData.imagen_principal = localPath
              }
            }
          }
        }

        projectData.imagenes = downloadedImages
        console.log(`     ✅ Descargadas ${downloadedImages.length} imágenes`)

        // 4. Verificar si el proyecto ya existe en la base de datos
        const existingProject = await prisma.proyecto.findFirst({
          where: {
            titulo: projectData.titulo
          }
        })

        if (!existingProject) {
          // Buscar usuario admin
          const adminUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
          })

          if (!adminUser) {
            console.log('❌ No se encontró usuario admin')
            continue
          }

          // Crear proyecto
          const newProject = await prisma.proyecto.create({
            data: {
              titulo: projectData.titulo,
              descripcion: projectData.descripcion,
              categoria: projectData.categoria,
              ubicacion: projectData.ubicacion || 'Colombia',
              estado: 'COMPLETADO',
              fechaInicio: new Date(project.post_date),
              fechaFin: new Date(project.post_date),
              userId: adminUser.id,
              cliente: projectData.cliente || 'Cliente confidencial',
              presupuesto: 0,
              progreso: 100
            }
          })

          // Crear imágenes del proyecto
          for (const imagePath of projectData.imagenes) {
            await prisma.imagenProyecto.create({
              data: {
                url: imagePath,
                proyectoId: newProject.id,
                descripcion: `Imagen del proyecto ${projectData.titulo}`
              }
            })
          }

          console.log(`     ✅ Proyecto creado: ${projectData.titulo}`)
          
          // Agregar nota sobre el peso si se encontró
          if (projectData.peso) {
            console.log(`     📊 Peso identificado: ${projectData.peso}`)
          }
        } else {
          console.log(`     ⚠️  Proyecto ya existe: ${projectData.titulo}`)
        }
      }

      console.log(`\n✅ Categoría completada: ${category.category_name} (${projects.length} proyectos procesados)`)
    }

    // 5. Resumen final
    console.log('\n\n📊 RESUMEN DE MIGRACIÓN COMPLETADA')
    console.log('=' .repeat(70))
    
    const totalProjects = await prisma.proyecto.count()
    const totalImages = await prisma.imagenProyecto.count()
    
    console.log(`\n✅ Total de proyectos en la base de datos: ${totalProjects}`)
    console.log(`✅ Total de imágenes migradas: ${totalImages}`)
    
    // Proyectos por categoría
    const projectsByCategory = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    console.log('\n📂 Distribución por categorías:')
    projectsByCategory.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat._count.id} proyectos`)
    })

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await connection.end()
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateAllProjectsByCategory()