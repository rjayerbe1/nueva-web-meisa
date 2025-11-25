const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const PUENTES_CONSOLIDADO = [
  {
    id: generateId(),
    titulo: 'Puentes de Vigas y Cerchas',
    icono: 'Bridge',
    descripcion: 'Puentes metálicos mediante sistemas de vigas cajón de acero o cerchas reticuladas que salvan grandes distancias con mínimos apoyos intermedios. MEISA diseña puentes con luces hasta 212 metros mediante vigas cajón que distribuyen eficientemente las cargas, o cerchas tipo Warren, Pratt o Howe para luces medias. La fabricación en taller asegura calidad controlada mediante soldaduras certificadas y corte de precisión, mientras el montaje por dovelas reduce tiempos de cierre de vías. El acero estructural permite secciones esbeltas que no obstruyen cauces de ríos o vías inferiores, manteniendo drenaje natural y tráfico vehicular. Incluye puentes en arco metálico donde la geometría en arco aprovecha la compresión del acero transfiriendo cargas lateralmente hacia los estribos. Diseño sismorresistente mediante conexiones dúctiles cumpliendo rigurosamente la norma NSR-10. Acabados con pintura anticorrosiva de alto desempeño garantizan 50+ años de vida útil con mantenimiento mínimo.',
    proyectosEjemplo: ['Puentes vehiculares', 'Puentes en arco', 'Viaductos', 'Puentes de gran luz'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes Livianos Peatonales',
    icono: 'Users',
    descripcion: 'Puentes metálicos ligeros que conectan comunidades o facilitan cruces seguros sobre vías de alto tráfico mediante estructuras optimizadas para cargas peatonales. MEISA diseña pasarelas con luces típicas de 30 a 80 metros, utilizando vigas de celosía o cajón según la luz requerida y restricciones arquitectónicas. Rampas accesibles con pendiente máxima 8% en lugar de escaleras permiten movilidad inclusiva para personas con discapacidad, coches de bebé, sillas de ruedas y bicicletas. La estructura prefabricada permite instalación nocturna sin interrumpir el tráfico vehicular diurno: fabricación completa en taller con control de calidad, transporte en secciones mediante camiones cama baja y montaje en pocas horas con grúas móviles. Barandas transparentes de acero inoxidable o vidrio templado cumplen normativa de seguridad peatonal sin obstruir visuales. Pisos antideslizantes con rejilla metálica o concreto texturizado. Iluminación LED integrada en estructura mejora seguridad nocturna.',
    proyectosEjemplo: ['Puentes peatonales', 'Pasarelas urbanas', 'Ciclopuentes', 'Conexiones peatonales'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes de Cables',
    icono: 'Cable',
    descripcion: 'Puentes suspendidos mediante cables de acero de alta resistencia que permiten salvar luces excepcionales minimizando cimentaciones intermedias. MEISA diseña sistemas de cables principales galvanizados que soportan el tablero mediante péndolas verticales o tirantes inclinados, transfiriendo cargas a torres metálicas ancladas en los extremos mediante bloques de anclaje de concreto masivo. Esta tipología es ideal para cruzar cañones profundos, ríos anchos o valles donde cimentaciones intermedias son imposibles o muy costosas por profundidad del cauce. Los cables galvanizados en caliente resisten corrosión atmosférica mientras las péndolas permiten movimiento controlado del tablero ante cargas dinámicas de viento o sismo sin generar esfuerzos excesivos. El tablero metálico ortótropo reduce peso propio maximizando la capacidad de carga útil del puente. Mantenimiento preventivo de cables mediante inspecciones y protección catódica asegura operación segura por décadas. Ideal para puentes comunitarios rurales que requieren soluciones económicas y de rápida instalación.',
    proyectosEjemplo: ['Puentes colgantes', 'Puentes atirantados', 'Puentes sobre cañones', 'Puentes comunitarios'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'
  }
]

async function consolidar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CONSOLIDACIÓN: PUENTES (6 → 3 especialidades)')
    console.log('='.repeat(80) + '\n')

    const categoriaActual = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'puentes' }
    })

    const backupFilename = `./respaldo-puentes-consolidacion-${Date.now()}.json`
    fs.writeFileSync(backupFilename, JSON.stringify({
      nombre: categoriaActual.nombre,
      especialidades: categoriaActual.especialidades
    }, null, 2))
    console.log(`📦 Respaldo: ${backupFilename}\n`)

    console.log('❌ ELIMINADAS/UNIFICADAS (3):')
    console.log('   • "Puentes de Gran Luz" → unido en "Puentes de Vigas y Cerchas"')
    console.log('   • "Puentes en Arco" → unido en "Puentes de Vigas y Cerchas"')
    console.log('   • "Diseño Sísmico" → incluido en todas (NSR-10)')
    console.log('   • "Peatonales de Acceso" → unido en "Puentes Livianos Peatonales"')
    console.log('   • "Colgantes" → en "Puentes de Cables"')
    console.log('   • "Sociales Rurales" → en "Puentes de Cables"')

    console.log('\n✅ NUEVAS (3):')
    console.log('   1. Puentes de Vigas y Cerchas')
    console.log('   2. Puentes Livianos Peatonales')
    console.log('   3. Puentes de Cables')

    await prisma.categoriaProyecto.update({
      where: { slug: 'puentes' },
      data: { especialidades: PUENTES_CONSOLIDADO }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ PUENTES: 6 → 3 especialidades')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

consolidar()
