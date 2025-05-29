import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function investigatePuenteNolasco() {
  try {
    console.log('🔍 INVESTIGANDO PROYECTO PUENTE NOLASCO\n')
    console.log('=' .repeat(70) + '\n')

    // 1. Buscar todos los proyectos con "nolasco" en el nombre
    const proyectosNolasco = await prisma.proyecto.findMany({
      where: {
        titulo: {
          contains: 'nolasco',
          mode: 'insensitive'
        }
      },
      include: {
        imagenes: true
      }
    })

    console.log(`📋 Proyectos con "Nolasco" encontrados: ${proyectosNolasco.length}\n`)

    for (const proyecto of proyectosNolasco) {
      console.log(`🎯 Proyecto: ${proyecto.titulo}`)
      console.log(`   ID: ${proyecto.id}`)
      console.log(`   Categoría: ${proyecto.categoria}`)
      console.log(`   Slug: ${proyecto.slug}`)
      console.log(`   Imágenes: ${proyecto.imagenes.length}`)
      
      if (proyecto.imagenes.length > 0) {
        console.log('   📸 Imágenes asignadas:')
        proyecto.imagenes.forEach(imagen => {
          console.log(`     - ${imagen.url}`)
          console.log(`       Alt: ${imagen.alt}`)
          console.log(`       Orden: ${imagen.orden}`)
        })
      }
      console.log('')
    }

    // 2. Revisar archivos de imágenes relacionados con "nolasco"
    console.log('\n🖼️ ARCHIVOS DE IMÁGENES CON "NOLASCO":\n')
    
    const imagenesDir = './public/uploads/projects'
    const archivos = await fs.readdir(imagenesDir)
    
    const archivosNolasco = archivos.filter(archivo => 
      archivo.toLowerCase().includes('nolasco')
    )

    console.log(`📁 Archivos encontrados: ${archivosNolasco.length}`)
    
    for (const archivo of archivosNolasco) {
      console.log(`   📄 ${archivo}`)
      
      // Verificar si existe el archivo
      const rutaCompleta = path.join(imagenesDir, archivo)
      try {
        const stats = await fs.stat(rutaCompleta)
        console.log(`     Tamaño: ${Math.round(stats.size / 1024)}KB`)
        console.log(`     Modificado: ${stats.mtime.toISOString().split('T')[0]}`)
      } catch (error) {
        console.log(`     ❌ Error accediendo al archivo`)
      }
    }

    // 3. Verificar si hay imágenes mal asignadas
    console.log('\n🔍 VERIFICANDO ASIGNACIÓN DE IMÁGENES:\n')
    
    // Buscar todas las imágenes que contienen "nolasco" en su URL
    const imagenesBD = await prisma.imagenProyecto.findMany({
      where: {
        url: {
          contains: 'nolasco',
          mode: 'insensitive'
        }
      },
      include: {
        proyecto: true
      }
    })

    console.log(`🔗 Imágenes en BD con "nolasco": ${imagenesBD.length}`)
    
    for (const imagen of imagenesBD) {
      console.log(`   📸 ${imagen.url}`)
      console.log(`     Asignada a: ${imagen.proyecto?.titulo || 'Sin proyecto'}`)
      console.log(`     Proyecto ID: ${imagen.proyectoId}`)
      
      // Verificar si la imagen coincide con el proyecto
      const nombreArchivo = imagen.url.split('/').pop() || ''
      const tieneNolasco = nombreArchivo.toLowerCase().includes('nolasco')
      const proyectoTieneNolasco = imagen.proyecto?.titulo.toLowerCase().includes('nolasco')
      
      if (tieneNolasco && !proyectoTieneNolasco) {
        console.log(`     ⚠️  POSIBLE ERROR: Imagen de Nolasco asignada a proyecto diferente`)
      }
      if (!tieneNolasco && proyectoTieneNolasco) {
        console.log(`     ⚠️  POSIBLE ERROR: Imagen NO de Nolasco asignada a proyecto Nolasco`)
      }
      console.log('')
    }

    // 4. Analizar duplicados y versiones
    console.log('\n📊 ANÁLISIS DE DUPLICADOS:\n')
    
    // Buscar proyectos que contengan "nolasco" y "2"
    const nolasco2 = proyectosNolasco.find(p => 
      p.titulo.toLowerCase().includes('2') || p.slug.includes('2')
    )
    
    if (nolasco2) {
      console.log(`🔄 Proyecto duplicado encontrado: ${nolasco2.titulo}`)
      console.log(`   Este proyecto puede ser una versión duplicada`)
      console.log(`   Imágenes asignadas: ${nolasco2.imagenes.length}`)
      
      if (nolasco2.imagenes.length > 0) {
        console.log('   Verificando si las imágenes son correctas...')
        
        for (const imagen of nolasco2.imagenes) {
          const nombreArchivo = imagen.url.split('/').pop() || ''
          const esImagenNolasco = nombreArchivo.toLowerCase().includes('nolasco')
          
          console.log(`     ${imagen.url}`)
          console.log(`     ✅ Es imagen de Nolasco: ${esImagenNolasco ? 'SÍ' : 'NO'}`)
          
          if (!esImagenNolasco) {
            console.log(`     ❌ IMAGEN INCORRECTA - No pertenece a Puente Nolasco`)
          }
        }
      }
    }

    // 5. Sugerencias de corrección
    console.log('\n💡 SUGERENCIAS DE CORRECCIÓN:\n')
    
    if (proyectosNolasco.length > 1) {
      console.log('🔧 Se detectaron múltiples proyectos Nolasco:')
      console.log('   1. Verificar si son proyectos diferentes o duplicados')
      console.log('   2. Si son duplicados, consolidar en un solo proyecto')
      console.log('   3. Reasignar imágenes correctamente')
    }
    
    // Verificar imágenes mal asignadas
    const imagenesMalAsignadas = imagenesBD.filter(img => {
      const nombreArchivo = img.url.split('/').pop() || ''
      const tieneNolasco = nombreArchivo.toLowerCase().includes('nolasco')
      const proyectoTieneNolasco = img.proyecto?.titulo.toLowerCase().includes('nolasco')
      return tieneNolasco !== proyectoTieneNolasco
    })
    
    if (imagenesMalAsignadas.length > 0) {
      console.log(`\n⚠️  IMÁGENES MAL ASIGNADAS: ${imagenesMalAsignadas.length}`)
      console.log('   Estas imágenes necesitan reasignación manual')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar investigación
investigatePuenteNolasco()