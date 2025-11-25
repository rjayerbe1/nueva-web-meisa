const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ==============================================================================
// COMERCIAL CONSOLIDADO - 5 → 3 especialidades
// ==============================================================================

const COMERCIAL_CONSOLIDADO = [
  // 1. MANTENER: Estructuras de Gran Luz
  {
    id: generateId(),
    titulo: 'Estructuras de Gran Luz',
    icono: 'Bridge',
    descripcion: 'Estructuras metálicas que crean espacios comerciales amplios sin columnas intermedias. MEISA diseña cerchas y vigas de hasta 30 metros de luz libre, permitiendo distribuciones flexibles en centros comerciales, supermercados e hipermercados. La fabricación en taller garantiza precisión milimétrica mientras el montaje modular reduce tiempos de construcción hasta 40% comparado con concreto tradicional. El acero estructural soporta cargas de techo, sistemas HVAC y señalización sin comprometer la amplitud del espacio, creando ambientes que maximizan la circulación de clientes y el espacio de exhibición rentable.',
    proyectosEjemplo: ['Centros comerciales', 'Supermercados', 'Hipermercados'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },

  // 2. UNIFICADO: Cubiertas Standing Seam + Cubiertas y Fachadas Metálicas
  {
    id: generateId(),
    titulo: 'Cubiertas y Fachadas Metálicas',
    icono: 'Building2',
    descripcion: 'Envolventes metálicas completas que protegen y definen la imagen arquitectónica de edificios comerciales. MEISA diseña e instala sistemas integrados de cubierta Standing Seam y fachadas ventiladas que trabajan estructuralmente unidos, eliminando puentes térmicos y optimizando el aislamiento. El sistema Standing Seam con juntas elevadas permite expansión térmica sin filtraciones, garantizando más de 30 años de vida útil sin mantenimiento constante. Las fachadas ventiladas metálicas reducen la temperatura interior hasta 40% mediante cámara de aire que expulsa el calor por convección natural. Materiales como panel compuesto metálico o lámina conformada ofrecen durabilidad superior a 30 años. La prefabricación de módulos en taller acelera el montaje en obra, reduciendo costos de mano de obra y tiempos de ejecución significativamente. Ideal para comercios que no pueden cerrar por problemas de goteras: instalación rápida, sin soldaduras expuestas y acabado metálico contemporáneo.',
    proyectosEjemplo: ['Centros comerciales', 'Tiendas comerciales', 'Edificios comerciales', 'Locales retail'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80'
  },

  // 3. UNIFICADO: Entrepisos Multi-nivel + Mezanines de Alta Capacidad
  {
    id: generateId(),
    titulo: 'Entrepisos y Mezanines de Alta Capacidad',
    icono: 'Layers3',
    descripcion: 'Estructuras metálicas que multiplican el espacio vertical aprovechando la altura libre existente en locales comerciales y bodegas. MEISA diseña entrepisos y mezanines que duplican el área utilizable sin ampliar la huella del inmueble, creando segundos niveles para oficinas, bodegas, almacenamiento o áreas de exhibición adicionales. La fabricación modular en taller permite instalación en pocos días sin interrumpir las operaciones del negocio. Estas estructuras soportan cargas operativas de hasta 750 kg/m², adecuadas para almacenamiento denso, productos densamente apilados, maquinaria pesada o circulación constante de público. El diseño estructural considera no solo el peso estático sino también las vibraciones generadas por tráfico de montacargas y personal. La estructura desmontable permite reubicación si la operación cambia de local, protegiendo la inversión a largo plazo. Escaleras y barandas integradas cumplen con normativa de seguridad industrial.',
    proyectosEjemplo: ['Bodegas comerciales', 'Entrepisos comerciales', 'Locales multinivel', 'Salas de cine', 'Puntos de venta'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
  }
]

async function consolidar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CONSOLIDACIÓN: COMERCIAL (5 → 3 especialidades)')
    console.log('='.repeat(80) + '\n')

    // Crear respaldo
    console.log('📦 Creando respaldo...')
    const categoriaActual = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'comercial' }
    })

    const backupFilename = `./respaldo-comercial-consolidacion-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify({
      nombre: categoriaActual.nombre,
      especialidades: categoriaActual.especialidades
    }, null, 2))
    console.log(`   ✅ Respaldo: ${backupFilename}\n`)

    // Actualizar
    console.log('📝 Consolidando especialidades...\n')

    console.log('❌ ELIMINADAS (2):')
    console.log('   • "Cubiertas Standing Seam" → Unificada con "Cubiertas y Fachadas"')
    console.log('   • "Mezanines de Alta Capacidad" → Unificada con "Entrepisos"')

    console.log('\n✅ NUEVAS (3):')
    console.log('   1. Estructuras de Gran Luz (sin cambios)')
    console.log('   2. Cubiertas y Fachadas Metálicas (unificada)')
    console.log('   3. Entrepisos y Mezanines de Alta Capacidad (unificada)')

    await prisma.categoriaProyecto.update({
      where: { slug: 'comercial' },
      data: { especialidades: COMERCIAL_CONSOLIDADO }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ CONSOLIDACIÓN COMPLETADA')
    console.log('='.repeat(80))
    console.log('   COMERCIAL: 5 → 3 especialidades')
    console.log(`   Respaldo: ${backupFilename}`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

consolidar()
