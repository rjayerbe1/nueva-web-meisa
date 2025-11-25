const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Mapeo de archivos .md a categorías de la BD
const MAPEO_ARCHIVOS = {
  'NUEVAS_OPCIONES_INDUSTRIAL.md': 'INDUSTRIAL',
  'NUEVAS_OPCIONES_PUENTES.md': 'PUENTES',
  'NUEVAS_OPCIONES_EDIFICACIONES.md': 'EDIFICACIONES',
  'NUEVAS_OPCIONES_COMERCIAL.md': 'COMERCIAL',
  'NUEVAS_OPCIONES_DEPORTES_EDUCACION.md': 'DEPORTES_EDUCACION',
  'NUEVAS_OPCIONES_INFRAESTRUCTURA_URBANA.md': 'INFRAESTRUCTURA_URBANA'
}

// Íconos sugeridos por tipo de especialidad (Lucide React icons)
const ICONOS_SUGERIDOS = {
  // Industrial
  'bodega': 'Warehouse',
  'farmacéutica': 'FlaskConical',
  'ingenio': 'Factory',
  'frío': 'Snowflake',
  'hangar': 'Plane',
  'grúa': 'Crane',
  'complejo': 'Building2',
  'producción': 'Cog',

  // Puentes
  'luz': 'Bridge',
  'arco': 'Sparkles',
  'ciclo': 'Bike',
  'colgante': 'Cable',
  'sísmico': 'Shield',
  'social': 'Users',
  'urbano': 'Building',

  // Edificaciones
  'sismo': 'Shield',
  'parqueadero': 'ParkingCircle',
  'cultural': 'Theater',
  'altura': 'TowerControl',
  'refuerzo': 'HardHat',
  'cubierta': 'Home',

  // Comercial
  'centro comercial': 'ShoppingCart',
  'standing': 'Layers',
  'gradería': 'Armchair',
  'mezanine': 'Layers3',
  'llave en mano': 'Key',

  // Deportes
  'coliseo': 'Trophy',
  'piscina': 'Waves',
  'multiuso': 'Grid3x3',
  'polideportivo': 'Volleyball',
  'internacional': 'Globe',

  // Infraestructura
  'estación': 'BusFront',
  'terminal': 'Bus',
  'escultura': 'Palette',
  'escalinata': 'ArrowUpFromLine',
  'resiliencia': 'Shield'
}

/**
 * Parsea un archivo .md y extrae las opciones
 */
function parsearArchivoMD(rutaArchivo) {
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8')

  // Dividir por "## OPCIÓN"
  const opciones = contenido.split(/## OPCIÓN \d+:/g).slice(1)

  return opciones.map((opcion, index) => {
    // Extraer título (primera línea después de "Enfoque en")
    const lineas = opcion.trim().split('\n')
    const tituloMatch = lineas[0].match(/Enfoque en (.+)/)
    const titulo = tituloMatch ? tituloMatch[1].trim() : `Especialidad ${index + 1}`

    // Extraer descripción (el párrafo después del título y línea vacía)
    const descripcion = lineas.slice(2).join('\n').trim().split('\n\n---')[0].trim()

    // Extraer métricas (números + unidades)
    const metricas = []
    const metricasMatch = descripcion.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:m²|ton|toneladas|metros|m|km|años|%|proyectos))/gi)
    if (metricasMatch) {
      metricas.push(...new Set(metricasMatch.slice(0, 4))) // Máximo 4 métricas únicas
    }

    // Extraer proyectos mencionados (palabras en mayúsculas seguidas de nombres)
    const proyectos = []
    const proyectosMatch = descripcion.match(/(?:experiencia en|proyecto|complejo|ingenio|planta)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi)
    if (proyectosMatch) {
      proyectos.push(...new Set(proyectosMatch.map(p => p.replace(/experiencia en|proyecto|complejo|ingenio|planta/gi, '').trim()).slice(0, 3)))
    }

    // Sugerir icono basado en palabras clave del título
    let icono = 'Star' // Default
    const tituloLower = titulo.toLowerCase()
    for (const [keyword, icon] of Object.entries(ICONOS_SUGERIDOS)) {
      if (tituloLower.includes(keyword)) {
        icono = icon
        break
      }
    }

    return {
      id: `esp-${Date.now()}-${index}`,
      titulo,
      icono,
      descripcion,
      metricas,
      proyectosEjemplo: proyectos,
      orden: index + 1,
      activo: true
    }
  })
}

/**
 * Función principal
 */
async function poblarEspecialidades() {
  console.log('='.repeat(80))
  console.log('POBLANDO ESPECIALIDADES DESDE ARCHIVOS .MD')
  console.log('='.repeat(80))
  console.log()

  const rootDir = path.join(__dirname, '..')
  let totalActualizadas = 0

  for (const [archivo, categoriaKey] of Object.entries(MAPEO_ARCHIVOS)) {
    try {
      const rutaArchivo = path.join(rootDir, archivo)

      if (!fs.existsSync(rutaArchivo)) {
        console.log(`⚠️  Archivo no encontrado: ${archivo}`)
        continue
      }

      console.log(`\n📖 Procesando: ${archivo}`)
      console.log(`   Categoría: ${categoriaKey}`)

      // Parsear archivo
      const especialidades = parsearArchivoMD(rutaArchivo)

      // Tomar solo las primeras 6 (las mejores)
      const especialidadesTop = especialidades.slice(0, 6)

      console.log(`   ✅ Extraídas ${especialidadesTop.length} especialidades`)
      especialidadesTop.forEach((esp, idx) => {
        console.log(`      ${idx + 1}. ${esp.titulo} (${esp.metricas.length} métricas)`)
      })

      // Actualizar en la BD
      const resultado = await prisma.categoriaProyecto.updateMany({
        where: { key: categoriaKey },
        data: { especialidades: especialidadesTop }
      })

      if (resultado.count > 0) {
        console.log(`   ✅ Categoría actualizada exitosamente`)
        totalActualizadas++
      } else {
        console.log(`   ⚠️  Categoría ${categoriaKey} no encontrada en BD`)
      }

    } catch (error) {
      console.error(`   ❌ Error procesando ${archivo}:`, error.message)
    }
  }

  console.log()
  console.log('='.repeat(80))
  console.log(`✅ Proceso completado: ${totalActualizadas} categorías actualizadas`)
  console.log('='.repeat(80))
  console.log()

  await prisma.$disconnect()
}

// Ejecutar
poblarEspecialidades()
  .then(() => {
    console.log('✅ Script finalizado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
