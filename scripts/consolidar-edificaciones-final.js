const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const EDIFICACIONES_CONSOLIDADO = [
  {
    id: generateId(),
    titulo: 'Pórticos Metálicos de Múltiples Niveles',
    icono: 'Building',
    descripcion: 'Estructuras de acero para edificios de 3 a 15 pisos mediante sistemas de pórticos con columnas y vigas metálicas. MEISA diseña pórticos con modulación amplia (típicamente 8x8 metros) que permiten distribución interior variable con divisiones livianas según necesidades cambiantes de la organización. Las losas colaborantes (deck metálico + concreto) se integran estructuralmente con las vigas reduciendo tiempos de construcción hasta 40% versus losa tradicional. El acero estructural permite plantas libres sin muros de carga, facilitando futuros cambios de distribución cuando el edificio evoluciona o se reestructura. Fachadas livianas se cuelgan de la estructura sin aportar peso significativo, permitiendo grandes áreas vidriadas para iluminación natural y eficiencia energética. Conexiones rígidas momento-resistentes o arriostramientos laterales garantizan estabilidad sísmica cumpliendo NSR-10. Ideal para edificios institucionales, corporativos, culturales emblemáticos con geometrías complejas, y edificios de oficinas que requieren flexibilidad espacial.',
    proyectosEjemplo: ['Edificios de oficinas', 'Sedes administrativas', 'Edificios gubernamentales', 'Museos', 'Teatros'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Estructuras Metálicas para Estacionamiento',
    icono: 'Car',
    descripcion: 'Estructuras metálicas que maximizan el número de vehículos estacionados en área limitada mediante apilamiento vertical de hasta 8 niveles. MEISA diseña parqueaderos con rampas helicoidales o rectas que conectan niveles con pendiente 15% máxima para circulación vehicular cómoda y segura. Vigas metálicas con luces económicas de 7 a 10 metros soportan losas colaborantes que resisten el tránsito vehicular sin fisurarse, con sobre-cargas de diseño de 400 kg/m² para tráfico pesado. La modulación optimizada permite el mayor número de cajones de parqueo por metro cuadrado construido (típicamente 25-30 m² por cajón), maximizando la rentabilidad de la inversión inmobiliaria. Ventilación natural mediante fachadas abiertas elimina sistemas mecánicos costosos de extracción de gases, reduciendo consumo energético operativo. La estructura desmontable con conexiones atornilladas permite reconfiguración o cambio de uso futuro del inmueble según evolucione el sector urbano.',
    proyectosEjemplo: ['Parqueaderos multinivel', 'Estacionamientos', 'Edificios de parqueo'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Estructuras Livianas Modulares',
    icono: 'Layers3',
    descripcion: 'Estructuras metálicas prefabricadas en módulos que permiten construcción rápida sin interrumpir operaciones existentes. MEISA diseña sistemas modulares con perfiles de acero liviano o pórticos ligeros que se fabrican completamente en taller, se transportan en secciones y se ensamblan en días mediante conexiones atornilladas. Para colegios y estructuras educativas, el diseño elimina columnas intermedias en aulas maximizando espacio útil y flexibilidad pedagógica, mientras entrepisos metálicos minimizan transmisión de ruido entre niveles mediante sistemas de piso flotante. La construcción rápida reduce el período de obra a meses versus años del sistema tradicional, habilitando nuevos cupos escolares urgentes. Para ampliaciones a edificios existentes, las estructuras se diseñan independientes estructuralmente del edificio original o integradas mediante conectores sísmicos. La ligereza del acero minimiza cargas sobre cimentaciones existentes evitando refuerzos costosos. El montaje nocturno o en fines de semana permite operación diurna continua, crítico en hospitales, hoteles o edificios corporativos.',
    proyectosEjemplo: ['Colegios', 'Estructuras educativas', 'Ampliaciones verticales', 'Expansiones laterales'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
  }
]

async function consolidar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CONSOLIDACIÓN: EDIFICACIONES (6 → 3 especialidades)')
    console.log('='.repeat(80) + '\n')

    const categoriaActual = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'edificaciones' }
    })

    const backupFilename = `./respaldo-edificaciones-consolidacion-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify({
      nombre: categoriaActual.nombre,
      especialidades: categoriaActual.especialidades
    }, null, 2))
    console.log(`📦 Respaldo: ${backupFilename}\n`)

    console.log('❌ ELIMINADAS/UNIFICADAS (3):')
    console.log('   • "Institucionales y Oficinas" → en "Pórticos Metálicos"')
    console.log('   • "Edificios de Altura" → en "Pórticos Metálicos"')
    console.log('   • "Culturales Emblemáticos" → en "Pórticos Metálicos"')
    console.log('   • "Colegios" → en "Estructuras Livianas Modulares"')
    console.log('   • "Ampliaciones" → en "Estructuras Livianas Modulares"')

    console.log('\n✅ NUEVAS (3):')
    console.log('   1. Pórticos Metálicos de Múltiples Niveles')
    console.log('   2. Estructuras Metálicas para Estacionamiento')
    console.log('   3. Estructuras Livianas Modulares')

    await prisma.categoriaProyecto.update({
      where: { slug: 'edificaciones' },
      data: { especialidades: EDIFICACIONES_CONSOLIDADO }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ EDIFICACIONES: 6 → 3 especialidades')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

consolidar()
