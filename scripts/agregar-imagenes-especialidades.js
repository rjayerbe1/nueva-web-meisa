const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Imágenes de Unsplash relacionadas con estructuras metálicas y construcción
const IMAGENES_POR_TIPO = {
  // Estructuras de gran luz / Grandes espacios
  'GRAN_LUZ': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',

  // Cubiertas metálicas / Techos
  'CUBIERTAS': 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',

  // Puentes
  'PUENTES': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',

  // Mezanines / Estructuras multinivel
  'MEZANINES': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',

  // Graderías / Estadios
  'GRADERIAS': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',

  // Fachadas metálicas
  'FACHADAS': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',

  // Ampliaciones / Construcción
  'AMPLIACIONES': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',

  // Estructuras industriales
  'INDUSTRIAL': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',

  // Estructuras deportivas
  'DEPORTIVAS': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',

  // Edificaciones
  'EDIFICACIONES': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
}

// Mapeo de palabras clave en títulos a tipos de imágenes
const PALABRAS_CLAVE_MAPEO = {
  'gran luz': 'GRAN_LUZ',
  'luz': 'GRAN_LUZ',
  'cubierta': 'CUBIERTAS',
  'standing seam': 'CUBIERTAS',
  'techo': 'CUBIERTAS',
  'puente': 'PUENTES',
  'mezanine': 'MEZANINES',
  'gradería': 'GRADERIAS',
  'graderías': 'GRADERIAS',
  'sala': 'GRADERIAS',
  'fachada': 'FACHADAS',
  'ampliación': 'AMPLIACIONES',
  'ampliaciones': 'AMPLIACIONES',
  'bodega': 'INDUSTRIAL',
  'hangar': 'INDUSTRIAL',
  'industrial': 'INDUSTRIAL',
  'coliseo': 'DEPORTIVAS',
  'estadio': 'DEPORTIVAS',
  'deportivo': 'DEPORTIVAS',
  'deportiva': 'DEPORTIVAS',
  'edificación': 'EDIFICACIONES',
  'edificio': 'EDIFICACIONES',
  'parqueadero': 'EDIFICACIONES'
}

// Función para detectar el tipo de especialidad según su título
function detectarTipoImagen(titulo) {
  const tituloLower = titulo.toLowerCase()

  for (const [palabra, tipo] of Object.entries(PALABRAS_CLAVE_MAPEO)) {
    if (tituloLower.includes(palabra)) {
      return IMAGENES_POR_TIPO[tipo]
    }
  }

  // Imagen por defecto si no se encuentra coincidencia
  return IMAGENES_POR_TIPO['INDUSTRIAL']
}

async function agregarImagenesEspecialidades() {
  console.log('='.repeat(80))
  console.log('AGREGANDO IMÁGENES A ESPECIALIDADES')
  console.log('='.repeat(80))
  console.log()

  try {
    // Obtener todas las categorías
    const categorias = await prisma.categoriaProyecto.findMany({
      select: {
        id: true,
        key: true,
        nombre: true,
        especialidades: true
      }
    })

    let totalActualizadas = 0
    let totalEspecialidades = 0

    for (const categoria of categorias) {
      if (!categoria.especialidades || !Array.isArray(categoria.especialidades)) {
        console.log(`⏭️  ${categoria.nombre}: Sin especialidades`)
        continue
      }

      console.log(`\n📦 Procesando: ${categoria.nombre}`)
      console.log(`   Especialidades: ${categoria.especialidades.length}`)

      // Agregar campo imagen a cada especialidad
      const especialidadesActualizadas = categoria.especialidades.map((esp, index) => {
        const imagenUrl = detectarTipoImagen(esp.titulo)
        totalEspecialidades++

        console.log(`   ${index + 1}. ${esp.titulo}`)
        console.log(`      → Imagen asignada: ${imagenUrl.substring(0, 60)}...`)

        return {
          ...esp,
          imagen: imagenUrl
        }
      })

      // Actualizar en la base de datos
      await prisma.categoriaProyecto.update({
        where: { id: categoria.id },
        data: {
          especialidades: especialidadesActualizadas
        }
      })

      console.log(`   ✅ Categoría actualizada`)
      totalActualizadas++
    }

    console.log()
    console.log('='.repeat(80))
    console.log(`✅ Proceso completado:`)
    console.log(`   - ${totalActualizadas} categorías actualizadas`)
    console.log(`   - ${totalEspecialidades} especialidades con imágenes`)
    console.log('='.repeat(80))
    console.log()
    console.log('📝 NOTA: Las imágenes se pueden cambiar desde el panel de administración')
    console.log('   editando el campo "especialidades" en cada categoría.')
    console.log()

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
agregarImagenesEspecialidades()
  .then(() => {
    console.log('✅ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
