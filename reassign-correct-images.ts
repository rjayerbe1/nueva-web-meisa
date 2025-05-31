import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function reassignCorrectImages() {
  console.log('🔄 REASIGNANDO IMÁGENES CORRECTAS...\n')

  // Primero eliminar TODAS las imágenes existentes
  console.log('🧹 Eliminando todas las imágenes actuales...')
  const deletedImages = await prisma.imagenProyecto.deleteMany({})
  console.log(`   ✅ Eliminadas ${deletedImages.count} imágenes\n`)

  // Rutas de las carpetas de imágenes descargadas
  const imageFolders = [
    {
      path: path.join(process.cwd(), 'real-project-images-downloaded'),
      type: 'main'
    },
    {
      path: path.join(process.cwd(), 'all-slider-images-downloaded'),
      type: 'slider'
    }
  ]

  // Mapeo de carpetas de imágenes a proyectos en BD
  const projectMapping = {
    // CENTROS COMERCIALES
    'centro-comercial-campanario': 'Centro Comercial Campanario',
    'centro-comercial-armenia-plaza': 'Centro Comercial Armenia Plaza',
    'centro-comercial-bochalema-plaza': 'Centro Comercial Bochalema Plaza',
    'centro-comercial-monserrat': 'Centro Comercial Monserrat',
    'centro-comercial-unico-barranquilla': 'Centro Comercial Unico Barranquilla',
    'centro-comercial-unico-cali': 'Centro Comercial Unico Cali',
    'centro-comercial-unico-neiva': 'Centro Comercial Unico Neiva',
    'centro-paseo-villa-del-rio': 'Centro Paseo Villa Del Rio',

    // EDIFICIOS
    'edificios-cinemateca-distrital': 'Cinemateca Distrital',
    'edificio-clinica-reina-victoria': 'Clinica Reina Victoria',
    'edificio-omega': 'Edificio Omega',
    'edificio-bomberos-popayan': 'Bomberos Popayan',
    'edificio-estacion-mio-guadalupe': 'Estacion Mio Guadalupe',
    'edificio-modulos-medicos': 'Modulos Medicos',
    'edificio-sena-santander': 'Sena Santander',
    'edificio-tequendama-parking-cali': 'Tequendama Parking Cali',
    'edificio-terminal-intermedio-mio-cali': 'Terminal Intermedio Mio Cali',

    // INDUSTRIA
    'industria-ampliacion-cargill': 'Ampliacion Cargill',
    'industria-bodega-duplex': 'Bodega Duplex',
    'industria-bodega-intera': 'Bodega Intera',
    'industria-bodega-protecnica-etapa-dos': 'Bodega Protecnica Etapa II',
    'industria-tecnofar': 'Tecnofar',
    'industria-tecnoquimicas-jamundi': 'Tecnoquímicas Jamundí',
    'industria-torre-cogeneracion-propal': 'Torre Cogeneracion Propal',

    // PUENTES VEHICULARES
    'puentes-vehiculares-puente-nolasco': 'Puente Vehicular Nolasco',
    'puente-vehicular-carrera-cien': 'Puente Vehicular Carrera 100',
    'puente-vehicular-cambrin': 'Puente Vehicular Cambrin',
    'puente-vehicular-frisoles': 'Puente Vehicular Frisoles',
    'puente-vehicular-la-veinti-uno': 'Puente Vehicular La 21',
    'puente-vehicular-la-paila': 'Puente Vehicular La Paila',
    'puente-vehicular-saraconcho': 'Puente Vehicular Saraconcho',

    // PUENTES PEATONALES
    'puentes-peatonales-escalinata-curva-rio-cali': 'Escalinata Curva - Río Cali',
    'puente-peatonal-la-63-cali': 'La 63 Cali',
    'puente-peatonal-autopista-sur-cali': 'Puente Peatonal Autopista Sur - Carrera 68',
    'puente-peatonal-la-tertulia': 'Puente Peatonal La Tertulia',
    'puente-peatonal-terminal-intermedio': 'Puente Peatonal Terminal Intermedio',

    // ESCENARIOS DEPORTIVOS
    'escenarios-deportivos-complejo-acuatico-popayan': 'Complejo Acuático Popayán',
    'escenario-deportivo-juegos-nacionales-coliseo-mayor': 'Coliseo Mayor Juegos Nacionales 2012',
    'escenario-deportivo-cecun': 'Cecun',
    'escenario-deportivo-cancha-javeriana-cali': 'Cancha Javeriana Cali',

    // ESTRUCTURAS MODULARES
    'estructuras-modulares-cocinas-ocultas': 'Cocinas Ocultas',

    // OIL & GAS
    'oil-and-gas-tanque-pulmon': 'Tanques de Almacenamiento GLP'
  }

  let totalImagesAssigned = 0
  let projectsUpdated = 0

  console.log('📂 Procesando carpetas de imágenes...\n')

  for (const folder of imageFolders) {
    if (!fs.existsSync(folder.path)) {
      console.log(`⚠️  Carpeta no encontrada: ${folder.path}`)
      continue
    }

    console.log(`📁 Procesando: ${folder.type} (${folder.path})`)

    const projectFolders = fs.readdirSync(folder.path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const projectFolder of projectFolders) {
      const projectTitle = projectMapping[projectFolder]
      
      if (!projectTitle) {
        console.log(`   ⚠️  Sin mapeo: ${projectFolder}`)
        continue
      }

      // Buscar el proyecto en la BD
      const project = await prisma.proyecto.findFirst({
        where: { titulo: projectTitle }
      })

      if (!project) {
        console.log(`   ❌ Proyecto no encontrado en BD: ${projectTitle}`)
        continue
      }

      // Obtener las imágenes de la carpeta
      const projectPath = path.join(folder.path, projectFolder)
      const imageFiles = fs.readdirSync(projectPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .sort()

      if (imageFiles.length === 0) {
        console.log(`   ⚠️  Sin imágenes: ${projectFolder}`)
        continue
      }

      console.log(`   📂 ${projectTitle}: ${imageFiles.length} imágenes`)

      // Determinar la categoría de la carpeta para el path público
      let publicCategory = 'otros'
      if (projectFolder.includes('centro-comercial') || projectFolder.includes('centro-paseo')) {
        publicCategory = 'centros-comerciales'
      } else if (projectFolder.includes('edificio') || projectFolder.includes('edificios')) {
        publicCategory = 'edificios'
      } else if (projectFolder.includes('industria')) {
        publicCategory = 'industria'
      } else if (projectFolder.includes('puente-vehicular') || projectFolder.includes('puentes-vehiculares')) {
        publicCategory = 'puentes-vehiculares'
      } else if (projectFolder.includes('puente-peatonal') || projectFolder.includes('puentes-peatonales') || projectFolder.includes('escalinata')) {
        publicCategory = 'puentes-peatonales'
      } else if (projectFolder.includes('escenario-deportivo') || projectFolder.includes('escenarios-deportivos')) {
        publicCategory = 'escenarios-deportivos'
      } else if (projectFolder.includes('estructura-modular') || projectFolder.includes('estructuras-modulares') || projectFolder.includes('cocina')) {
        publicCategory = 'estructuras-modulares'
      } else if (projectFolder.includes('oil-gas') || projectFolder.includes('tanque')) {
        publicCategory = 'oil-and-gas'
      }

      // Crear las imágenes en la BD
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        const isPortada = i === 0 // Primera imagen como portada

        try {
          const imagePath = `/images/projects/${publicCategory}/${projectFolder}/${imageFile}`
          
          await prisma.imagenProyecto.create({
            data: {
              proyectoId: project.id,
              url: imagePath,
              alt: `${project.titulo} - Imagen ${i + 1}`,
              orden: i,
              tipo: isPortada ? 'PORTADA' : 'GALERIA'
            }
          })

          totalImagesAssigned++
          
          if (i === 0) {
            console.log(`     📸 ${imageFile} (PORTADA)`)
          }
        } catch (error) {
          console.log(`     ❌ Error creando imagen ${imageFile}: ${error}`)
        }
      }

      projectsUpdated++
      console.log(`     ✅ ${imageFiles.length} imágenes asignadas\n`)
    }
  }

  // Estadísticas finales
  const finalStats = await prisma.proyecto.findMany({
    select: {
      titulo: true,
      categoria: true,
      _count: {
        select: { imagenes: true }
      }
    },
    orderBy: [
      { categoria: 'asc' },
      { titulo: 'asc' }
    ]
  })

  console.log('🎉 REASIGNACIÓN COMPLETADA!')
  console.log(`   📊 Proyectos actualizados: ${projectsUpdated}`)
  console.log(`   🖼️  Total imágenes asignadas: ${totalImagesAssigned}`)
  console.log(`   📋 Proyectos con imágenes:`)

  finalStats.forEach(p => {
    if (p._count.imagenes > 0) {
      console.log(`      📂 ${p.titulo}: ${p._count.imagenes} img [${p.categoria}]`)
    } else {
      console.log(`      ⚠️  ${p.titulo}: SIN IMÁGENES [${p.categoria}]`)
    }
  })

  await prisma.$disconnect()
}

reassignCorrectImages().catch(console.error)