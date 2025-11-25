const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const DEPORTES_CONSOLIDADO = [
  {
    id: generateId(),
    titulo: 'Coliseos y Canchas Cubiertas',
    icono: 'Trophy',
    descripcion: 'Estructuras metálicas con cubiertas de gran luz que cumplen requerimientos de federaciones deportivas internacionales. MEISA diseña coliseos y canchas cubiertas con cerchas espaciales o vigas reticuladas de 40 a 75 metros de luz sin columnas internas que obstruyan visuales desde graderías. La altura libre mínima según deporte (12 metros para voleibol profesional, 15 metros para básquetbol) se logra sin comprometer la esbeltez estructural externa. El sistema de cerchas tridimensionales distribuye cargas uniformemente permitiendo cubiertas de geometría libre. Graderías metálicas retráctiles o fijas para 3,000 a 15,000 espectadores se integran estructuralmente a la cubierta principal. Estructura sismorresistente protege grandes concentraciones de público. Plataformas elevadas para cabinas de transmisión, pantallas LED y sistemas de iluminación profesional se anclan a la estructura. Cubiertas translúcidas integradas entre cerchas aportan iluminación natural reduciendo consumo eléctrico diurno. Ventilación natural mediante lucernarios perimetrales expulsa aire caliente.',
    proyectosEjemplo: ['Coliseos deportivos', 'Pabellones deportivos', 'Canchas cubiertas', 'Arenas'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Piscinas Cubiertas',
    icono: 'Waves',
    descripcion: 'Estructuras metálicas diseñadas específicamente para ambientes de alta humedad que soportan cubiertas sobre piscinas olímpicas y recreativas. MEISA diseña cerchas con tratamiento anticorrosivo especial mediante galvanizado en caliente más pintura epóxica de alto espesor que resisten el ambiente salino generado por cloro, humedad relativa superior al 80% y condensación constante. Cubiertas translúcidas de policarbonato entre cerchas aportan iluminación natural difusa cumpliendo requisitos FINA para competencias sin deslumbramiento. Ventilación forzada integrada en cubierta con extractores eólicos o mecánicos extrae aire húmedo evitando condensación destructiva en estructura y acabados. Vigas perimetrales robustas soportan sistemas de climatización pesados (deshumidificadores industriales) críticos para mantener confort de nadadores y espectadores. Altura libre mínima 6 metros sobre nivel de agua según normativa internacional de natación. Estructura diseñada para soportar equipos suspendidos como marcadores electrónicos, cámaras de video y banderines sin deflexiones molestas.',
    proyectosEjemplo: ['Piscinas olímpicas', 'Complejos acuáticos', 'Natatorios', 'Piscinas cubiertas'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Torres y Estructuras Auxiliares',
    icono: 'Lightbulb',
    descripcion: 'Torres estructurales de acero y estructuras complementarias que soportan sistemas de iluminación y equipamiento deportivo. MEISA diseña torres de 15 a 30 metros de altura con geometría tronco-cónica que resiste vientos extremos de hasta 150 km/h sin vibrar mediante análisis dinámico. Plataformas de mantenimiento en la cima permiten acceso seguro para cambio de luminarias mediante escalera interna con línea de vida o externa con guarda-hombres. La cimentación por zapata aislada o pilotes absorbe momentos volcantes generados por viento actuando sobre luminarias y superficie de la torre. Acabado galvanizado en caliente elimina mantenimiento de pintura en altura. Niveles de iluminación cumplen normativa FIFA (mínimo 500 lux horizontal) para transmisión televisiva de eventos internacionales. Incluye también estructuras tensionadas con mástiles metálicos y cables de acero que tensan membranas de PVC o PTFE formando superficies de doble curvatura, y graderías metálicas de alta capacidad integradas estructuralmente.',
    proyectosEjemplo: ['Torres de iluminación', 'Campos deportivos', 'Cubiertas tensionadas', 'Graderías metálicas'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'
  }
]

async function consolidar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CONSOLIDACIÓN: DEPORTES & EDUCACIÓN (5 → 3 especialidades)')
    console.log('='.repeat(80) + '\n')

    const categoriaActual = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'deportes-educacion' }
    })

    const backupFilename = `./respaldo-deportes-consolidacion-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify({
      nombre: categoriaActual.nombre,
      especialidades: categoriaActual.especialidades
    }, null, 2))
    console.log(`📦 Respaldo: ${backupFilename}\n`)

    console.log('❌ ELIMINADAS/UNIFICADAS (2):')
    console.log('   • "Coliseos Eventos" → en "Coliseos y Canchas Cubiertas"')
    console.log('   • "Cubiertas Grandes Luces" → en "Coliseos y Canchas Cubiertas"')
    console.log('   • "Torres Iluminación" → en "Torres y Estructuras Auxiliares"')
    console.log('   • "Cubiertas Tensionadas" → en "Torres y Estructuras Auxiliares"')

    console.log('\n✅ NUEVAS (3):')
    console.log('   1. Coliseos y Canchas Cubiertas')
    console.log('   2. Piscinas Cubiertas')
    console.log('   3. Torres y Estructuras Auxiliares')

    await prisma.categoriaProyecto.update({
      where: { slug: 'deportes-educacion' },
      data: { especialidades: DEPORTES_CONSOLIDADO }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ DEPORTES & EDUCACIÓN: 5 → 3 especialidades')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

consolidar()
