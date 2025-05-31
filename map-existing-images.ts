import { PrismaClient } from '@prisma/client'
import { readdirSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function mapExistingImages() {
  try {
    console.log('🖼️ Mapeando imágenes existentes...')
    
    // Leer todas las imágenes en el directorio
    const uploadsDir = '/Users/rjayerbe/Library/CloudStorage/GoogleDrive-rjayerbe@meisa.com.co/Mi unidad/Trabajo/Roberto Jose/Web-Development/meisa.com.co/nueva-web-meisa/public/uploads/projects'
    const allImages = readdirSync(uploadsDir)
    
    console.log(`📁 Encontradas ${allImages.length} imágenes en uploads/projects`)
    
    // Mapeo de proyectos con patrones de nombres de imágenes
    const imageMapping = {
      'centro-comercial-campanario': 'centro-comercial-campanario',
      'paseo-villa-del-rio': 'paseo-villa-del-rio',
      'centro-comercial-monserrat': 'monserrat',
      'centro-comercial-unico-cali': 'centro-comercial-nico-cali',
      'centro-comercial-unico-neiva': 'centro-comercial-nico-neiva',
      'centro-comercial-unico-barranquilla': 'centro-comercial-nico-barranquilla',
      'centro-comercial-armenia-plaza': 'plaza-armenia',
      'centro-comercial-bochalema-plaza': 'plaza-bochalema',
      'cinemateca-distrital': 'cinemateca-distrital',
      'clinica-reina-victoria': 'clinica-reina-victoria',
      'edificio-omega': 'omega',
      'estacion-de-bomberos-popayan': 'bomberos',
      'estacion-mio-guadalupe': 'mio-guadalupe',
      'sena-santander': 'sena',
      'terminal-intermedio-mio': 'mio-terminal-intermedio',
      'tequendama-parking-cali': 'tequendama',
      'modulos-medicos': 'mdulos-mdicos',
      'ampliacion-cargill': 'ampliacion-cargill',
      'torre-cogeneracion-propal': 'torre-cogeneracion',
      'bodega-duplex-ingenieria': 'bodega-duplex',
      'bodega-intera': 'bodega-intera',
      'tecnofar': 'tecnofar',
      'bodega-protecnica-etapa-ii': 'bodega-protecnica',
      'tecnoquimicas-jamundi': 'tecnoquimicas'
    }
    
    // Obtener todos los proyectos
    const proyectos = await prisma.proyecto.findMany({
      include: {
        imagenes: true
      }
    })
    
    console.log(`📊 Procesando ${proyectos.length} proyectos`)
    
    for (const proyecto of proyectos) {
      const projectKey = proyecto.slug
      const imagePattern = imageMapping[projectKey]
      
      if (!imagePattern) {
        console.log(`⚠️ No hay patrón para: ${projectKey}`)
        continue
      }
      
      // Buscar imágenes que coincidan con el patrón
      const matchingImages = allImages.filter(img => 
        img.toLowerCase().includes(imagePattern.toLowerCase())
      ).slice(0, 8) // Máximo 8 imágenes por proyecto
      
      if (matchingImages.length === 0) {
        console.log(`❌ No se encontraron imágenes para: ${projectKey} (patrón: ${imagePattern})`)
        continue
      }
      
      console.log(`✅ ${proyecto.titulo}: ${matchingImages.length} imágenes encontradas`)
      
      // Eliminar imágenes existentes del proyecto
      await prisma.imagenProyecto.deleteMany({
        where: { proyectoId: proyecto.id }
      })
      
      // Crear las nuevas imágenes
      for (let i = 0; i < matchingImages.length; i++) {
        const imageName = matchingImages[i]
        await prisma.imagenProyecto.create({
          data: {
            proyectoId: proyecto.id,
            url: `/uploads/projects/${imageName}`,
            alt: `${proyecto.titulo} - Imagen ${i + 1}`,
            titulo: `${proyecto.titulo} - Imagen ${i + 1}`,
            orden: i + 1,
            tipo: i === 0 ? "PORTADA" : "GALERIA",
          },
        })
      }
    }
    
    console.log('\n🎉 Mapeo de imágenes completado!')
    
  } catch (error) {
    console.error('❌ Error mapeando imágenes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

mapExistingImages()