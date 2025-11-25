const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const PUENTES = [
  {
    id: generateId(),
    titulo: 'Puentes de Gran Luz (Vehiculares y Peatonales)',
    icono: 'Bridge',
    descripcion: 'Puentes metálicos que salvan grandes distancias con mínimos apoyos intermedios, optimizando costos de cimentación. MEISA diseña puentes con luces hasta 212 metros mediante sistemas de vigas cajón de acero o cerchas reticuladas que distribuyen eficientemente las cargas. La fabricación en taller asegura calidad controlada mientras el montaje por dovelas reduce tiempos de cierre de vías. El acero estructural permite secciones esbeltas que no obstruyen cauces de ríos o vías inferiores, manteniendo drenaje natural y tráfico vehicular. Diseño sismorresistente mediante conexiones dúctiles y amortiguadores sísmicos cuando el proyecto lo requiere. Acabados con pintura anticorrosiva de alto desempeño garantizan 50+ años de vida útil con mantenimiento mínimo.',
    proyectosEjemplo: ['Puentes vehiculares', 'Puentes peatonales', 'Viaductos'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes en Arco Metálicos',
    icono: 'Arc',
    descripcion: 'Puentes con geometría en arco que aprovechan la compresión del acero para salvar luces importantes con altura libre limitada. MEISA diseña arcos metálicos que transfieren cargas lateralmente hacia los estribos, eliminando momentos flectores en el centro de la luz. Esta geometría es ideal cuando hay restricciones de altura pero se requiere luz considerable. Los arcos pueden estar sobre o bajo el tablero según necesidades estéticas y funcionales del proyecto. La prefabricación de dovelas de arco en taller permite montaje progresivo con grúas o mediante atirantamiento temporal. El acabado arquitectónico del arco se convierte en elemento icónico urbano que identifica el sector.',
    proyectosEjemplo: ['Puentes en arco', 'Viaductos urbanos', 'Puentes emblemáticos'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1577791465033-6aa3e486f9d7?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes Peatonales y de Acceso',
    icono: 'Users',
    descripcion: 'Puentes metálicos ligeros que conectan comunidades aisladas o facilitan cruces seguros sobre vías de alto tráfico. MEISA diseña estructuras peatonales con luces típicas de 30 a 80 metros, utilizando vigas de celosía o cajón según la luz requerida. Rampas accesibles en lugar de escaleras permiten movilidad inclusiva para personas con discapacidad, coches de bebé y bicicletas. La estructura prefabricada permite instalación nocturna sin interrumpir el tráfico vehicular diurno: fabricación completa en taller, transporte en secciones y montaje en horas. Barandas y pisos antideslizantes cumplen normativa de seguridad peatonal. Iluminación LED integrada en estructura mejora seguridad nocturna.',
    proyectosEjemplo: ['Puentes peatonales', 'Puentes de acceso', 'Conexiones rurales'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes Colgantes (Vehiculares y Peatonales)',
    icono: 'Cable',
    descripcion: 'Puentes suspendidos mediante cables de acero que permiten salvar luces excepcionales minimizando cimentaciones intermedias. MEISA diseña sistemas de cables principales que soportan el tablero mediante péndolas verticales, transfiriendo cargas a torres metálicas ancladas en los extremos. Esta tipología es ideal para cruzar cañones profundos o ríos anchos donde cimentaciones intermedias son imposibles o muy costosas. Los cables galvanizados resisten corrosión mientras las péndolas permiten movimiento controlado del tablero ante cargas dinámicas de viento o sismo. El tablero metálico ortótropo reduce peso propio maximizando la capacidad de carga útil del puente. Mantenimiento preventivo de cables asegura operación segura por décadas.',
    proyectosEjemplo: ['Puentes colgantes', 'Puentes sobre cañones', 'Accesos rurales'],
    orden: 4,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Diseño Sísmico de Puentes',
    icono: 'Activity',
    descripcion: 'Ingeniería estructural especializada que garantiza comportamiento seguro de puentes ante eventos sísmicos severos. MEISA diseña puentes con sistemas de disipación de energía sísmica mediante conexiones dúctiles, aisladores elastoméricos o amortiguadores viscosos según la amenaza sísmica del sitio. Los modelos de análisis dinámico consideran el espectro sísmico local, características del suelo y período natural de la estructura. Conexiones entre superestructura y subestructura permiten desplazamientos controlados sin colapso, cumpliendo rigurosamente la norma NSR-10 colombiana. Detalles constructivos evitan fallas frágiles en soldaduras o conexiones. Las pruebas de materiales en laboratorio certifican la calidad del acero estructural utilizado.',
    proyectosEjemplo: ['Puentes sismorresistentes', 'Puentes en zonas sísmicas', 'Viaductos'],
    orden: 5,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1587845750729-c5cd5c3ee170?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes Sociales para Comunidades Rurales',
    icono: 'Heart',
    descripcion: 'Puentes metálicos que conectan veredas aisladas con cabeceras municipales, mejorando acceso a educación y salud. MEISA diseña puentes modulares con luces de 20 a 60 metros que se adaptan a condiciones particulares de cada río o quebrada. La prefabricación completa en taller permite transporte por carreteras estrechas y montaje sin maquinaria pesada, usando grúas pequeñas o sistemas de lanzamiento manual. Cimentaciones poco profundas se adaptan a suelos de baja capacidad portante típicos de zonas rurales. El diseño resistente a crecientes contempla altura libre suficiente sobre el nivel de inundación histórico. Estructura galvanizada en caliente elimina mantenimiento de pintura en zonas de difícil acceso.',
    proyectosEjemplo: ['Puentes rurales', 'Puentes comunitarios', 'Accesos veredales'],
    orden: 6,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1547581368-6a90ca47e942?w=800&q=80'
  }
]

async function aplicar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: PUENTES')
    console.log('='.repeat(80) + '\n')

    console.log('📝 Actualizando PUENTES...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'puentes' },
      data: { especialidades: PUENTES }
    })

    console.log('   ✅ 6 especialidades actualizadas')
    console.log('\n✅ TODAS MANTENIDAS (solo actualización de descripciones):')
    console.log('   • Puentes de Gran Luz (Vehiculares y Peatonales)')
    console.log('   • Puentes en Arco Metálicos')
    console.log('   • Puentes Peatonales y de Acceso')
    console.log('   • Puentes Colgantes (Vehiculares y Peatonales)')
    console.log('   • Diseño Sísmico de Puentes')
    console.log('   • Puentes Sociales para Comunidades Rurales')

    console.log('\n' + '='.repeat(80))
    console.log('✅ PUENTES ACTUALIZADO')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

aplicar()
