import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'

const prisma = new PrismaClient()

async function fixProjectImageMapping() {
  try {
    console.log('🔧 CORRIGIENDO MAPEO DE PROYECTOS E IMÁGENES\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Leer el análisis de WordPress
    const wordpressData = JSON.parse(
      await fs.readFile('./wordpress-metaslider-projects.json', 'utf8')
    )

    console.log(`📊 Datos de WordPress: ${wordpressData.total_proyectos} proyectos`)

    // 2. Obtener proyectos actuales de la base de datos
    const proyectosActuales = await prisma.proyecto.findMany({
      include: {
        imagenes: true
      },
      orderBy: {
        titulo: 'asc'
      }
    })

    console.log(`📊 Proyectos en BD actual: ${proyectosActuales.length} proyectos`)

    // 3. Crear mapeo de nombres de WordPress a nombres actuales
    const mapeoProyectos = new Map()

    // Mapeo específico basado en los nombres encontrados
    wordpressData.proyectos.forEach((wpProyecto: any) => {
      const nombreWP = wpProyecto.titulo.toLowerCase()
      const categoriaWP = wpProyecto.categoria

      // Buscar proyecto similar en la BD actual
      const proyectoSimilar = proyectosActuales.find(p => {
        const nombreBD = p.titulo.toLowerCase()
        
        // Comparaciones específicas
        if (nombreWP.includes('campanario') && nombreBD.includes('campanario')) return true
        if (nombreWP.includes('armenia') && nombreBD.includes('armenia')) return true
        if (nombreWP.includes('escalinata') && nombreBD.includes('escalinata')) return true
        if (nombreWP.includes('cinemateca') && nombreBD.includes('cinemateca')) return true
        if (nombreWP.includes('cargill') && nombreBD.includes('cargill')) return true
        if (nombreWP.includes('bomberos') && nombreBD.includes('bomberos')) return true
        if (nombreWP.includes('mio') && nombreBD.includes('mio')) return true
        
        // Comparación general por palabras clave
        const palabrasWP = nombreWP.split(' ')
        const palabrasBD = nombreBD.split(' ')
        
        return palabrasWP.some(palabra => 
          palabra.length > 3 && palabrasBD.some(p => p.includes(palabra))
        )
      })

      if (proyectoSimilar) {
        mapeoProyectos.set(wpProyecto.id, {
          wordpress: wpProyecto,
          actual: proyectoSimilar
        })
      }
    })

    console.log(`🔗 Proyectos mapeados: ${mapeoProyectos.size}`)

    // 4. Verificar imágenes en directorio
    const imagenesDir = './public/uploads/projects'
    try {
      const archivosImagenes = await fs.readdir(imagenesDir)
      console.log(`📁 Imágenes disponibles: ${archivosImagenes.length}`)
      
      // Analizar nombres de imágenes
      const imagenesWP = archivosImagenes.filter(archivo => 
        archivo.includes('-1748') // Patrón de imágenes de WordPress migradas
      )
      
      console.log(`🖼️  Imágenes de WordPress: ${imagenesWP.length}`)
      
      // Agrupar imágenes por proyecto
      const imagenesPorProyecto = new Map()
      
      imagenesWP.forEach(imagen => {
        // Extraer nombre del proyecto de la imagen
        let nombreProyecto = imagen.split('-1748')[0]
        nombreProyecto = nombreProyecto.replace(/^(centro-comercial-|puentes-|edificios-|industria-|escenarios-)/i, '')
        
        if (!imagenesPorProyecto.has(nombreProyecto)) {
          imagenesPorProyecto.set(nombreProyecto, [])
        }
        imagenesPorProyecto.get(nombreProyecto).push(imagen)
      })

      console.log('\n📋 IMÁGENES AGRUPADAS POR PROYECTO:')
      for (const [proyecto, imagenes] of imagenesPorProyecto) {
        console.log(`   ${proyecto}: ${imagenes.length} imágenes`)
      }

      // 5. Corregir nombres de proyectos que no coinciden
      console.log('\n🔧 CORRECCIONES SUGERIDAS:\n')
      
      const correccionesNombres = [
        // Centros Comerciales
        { buscar: 'centro comercial campanario', corregir: 'Centro Comercial Campanario' },
        { buscar: 'plaza armenia', corregir: 'Plaza Armenia' },
        { buscar: 'plaza bochalema', corregir: 'Plaza Bochalema' },
        { buscar: 'monserrat', corregir: 'Centro Comercial Monserrat' },
        { buscar: 'paseo villa del rio', corregir: 'Paseo Villa del Río' },
        { buscar: 'unico barranquilla', corregir: 'Centro Comercial Único Barranquilla' },
        { buscar: 'unico cali', corregir: 'Centro Comercial Único Cali' },
        { buscar: 'unico neiva', corregir: 'Centro Comercial Único Neiva' },
        
        // Puentes
        { buscar: 'escalinata curva rio cali', corregir: 'Escalinata Curva Río Cali' },
        { buscar: 'la 63', corregir: 'Puente Peatonal La 63' },
        { buscar: 'la tertulia', corregir: 'Puente Peatonal La Tertulia' },
        
        // Edificios
        { buscar: 'bomberos popayan', corregir: 'Bomberos Popayán' },
        { buscar: 'cinemateca distrital', corregir: 'Cinemateca Distrital' },
        { buscar: 'mio guadalupe', corregir: 'MIO Guadalupe' },
        
        // Industrial
        { buscar: 'ampliacion cargill', corregir: 'Ampliación Cargill' },
        { buscar: 'bodega duplex ingenieria', corregir: 'Bodega Duplex Ingeniería' },
        { buscar: 'bodega intera', corregir: 'Bodega Intera' },
        { buscar: 'bodega protecnica', corregir: 'Bodega Protécnica II' }
      ]

      let correccionesRealizadas = 0

      for (const correcion of correccionesNombres) {
        const proyectoEncontrado = proyectosActuales.find(p => 
          p.titulo.toLowerCase().includes(correcion.buscar.toLowerCase())
        )

        if (proyectoEncontrado && proyectoEncontrado.titulo !== correcion.corregir) {
          console.log(`✏️  "${proyectoEncontrado.titulo}" → "${correcion.corregir}"`)
          
          // Actualizar en la base de datos
          await prisma.proyecto.update({
            where: { id: proyectoEncontrado.id },
            data: { titulo: correcion.corregir }
          })
          
          correccionesRealizadas++
        }
      }

      console.log(`\n✅ Correcciones aplicadas: ${correccionesRealizadas}`)

      // 6. Verificar mapeo final
      const proyectosActualizados = await prisma.proyecto.findMany({
        include: {
          imagenes: true
        },
        orderBy: {
          categoria: 'asc',
          titulo: 'asc'
        }
      })

      console.log('\n📊 ESTADO FINAL POR CATEGORÍA:')
      
      const categorias = {}
      proyectosActualizados.forEach(proyecto => {
        if (!categorias[proyecto.categoria]) {
          categorias[proyecto.categoria] = []
        }
        categorias[proyecto.categoria].push({
          titulo: proyecto.titulo,
          imagenes: proyecto.imagenes.length
        })
      })

      Object.keys(categorias).forEach(categoria => {
        console.log(`\n🏷️  ${categoria} (${categorias[categoria].length} proyectos):`)
        categorias[categoria].forEach(proyecto => {
          console.log(`   📌 ${proyecto.titulo} (${proyecto.imagenes} imágenes)`)
        })
      })

      console.log('\n✅ MAPEO CORREGIDO EXITOSAMENTE')

    } catch (error) {
      console.error('❌ Error accediendo al directorio de imágenes:', error)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar corrección
fixProjectImageMapping()