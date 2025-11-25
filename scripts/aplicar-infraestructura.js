const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const INFRAESTRUCTURA = [
  {
    id: generateId(),
    titulo: 'Ciclopuentes y Pasarelas Peatonales',
    icono: 'Bike',
    descripcion: 'Puentes metálicos ligeros que separan el tráfico vulnerable (peatones y ciclistas) del tráfico vehicular, mejorando la seguridad vial urbana. MEISA diseña estructuras con luces de 30 a 60 metros que cruzan avenidas de alto flujo sin interrumpir la circulación vehicular con semáforos. Rampas accesibles con pendiente máxima 8% permiten ascenso cómodo para bicicletas, coches de bebé, sillas de ruedas y personas mayores. La estructura prefabricada permite instalación nocturna sin afectar el tráfico diurno: fabricación en taller, transporte en módulos y montaje en pocas horas. Acabado arquitectónico con barandas transparentes e iluminación LED integrada crea hito urbano visible que promueve el uso del sistema.',
    proyectosEjemplo: ['Ciclopuentes', 'Pasarelas peatonales', 'Conexiones urbanas'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Estaciones de Transporte Masivo',
    icono: 'Train',
    descripcion: 'Estructuras metálicas que configuran estaciones de sistemas BRT (Bus Rapid Transit) o metro elevado, definiendo espacios urbanos funcionales. MEISA diseña cubiertas metálicas ligeras con grandes voladizos que protegen usuarios de lluvia y sol sin obstruir visuales urbanas. Columnas esbeltas de acero minimizan la ocupación de andenes permitiendo flujo peatonal óptimo. La modulación estructural permite replicar el diseño en múltiples estaciones de la red con economías de escala en fabricación. Entrepisos metálicos en estaciones elevadas soportan el tránsito constante de miles de usuarios diarios sin vibraciones molestas. Acabados durables resisten vandalismo y requieren mínimo mantenimiento. Techos translúcidos aportan iluminación natural reduciendo consumo energético.',
    proyectosEjemplo: ['Estaciones Transmilenio', 'Estaciones BRT', 'Paraderos'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Terminales de Transporte Intermunicipal',
    icono: 'Bus',
    descripcion: 'Edificios metálicos de gran escala que concentran operaciones de transporte terrestre de pasajeros con altos estándares de funcionalidad. MEISA diseña cubiertas de gran luz sin columnas en zonas de muelles de abordaje, permitiendo maniobras de buses sin obstrucciones. Estructuras modulares facilitan expansión futura de muelles conforme crece la demanda de transporte. Entrepisos metálicos para oficinas administrativas, locales comerciales y salas de espera se integran estructuralmente con la cubierta principal. Canaletas y bajantes dimensionadas para evacuación de aguas lluvias de cubiertas extensas. Iluminación natural cenital mediante lucernarios reduce consumo energético en operación 24/7. Estructura diseñada para soportar instalaciones de señalización y sistemas de información al usuario.',
    proyectosEjemplo: ['Terminales de transporte', 'Centrales de buses', 'Terminales intermunicipales'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
  }
]

async function aplicar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: INFRAESTRUCTURA_URBANA')
    console.log('='.repeat(80) + '\n')

    console.log('📝 Actualizando INFRAESTRUCTURA_URBANA...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'infraestructura-urbana' },
      data: { especialidades: INFRAESTRUCTURA }
    })

    console.log('   ✅ 3 especialidades (antes 6)')
    console.log('\n❌ ELIMINADAS:')
    console.log('   • Puentes Urbanos de Conexión Vial (duplicado)')
    console.log('   • Estructuras de Sombra y Pérgolas Urbanas (sin proyectos)')
    console.log('   • Miradores y Torres de Observación (sin proyectos)')
    console.log('\n✅ MANTENIDAS:')
    console.log('   • Ciclopuentes y Pasarelas Peatonales')
    console.log('   • Estaciones de Transporte Masivo')
    console.log('   • Terminales de Transporte Intermunicipal')

    console.log('\n' + '='.repeat(80))
    console.log('✅ INFRAESTRUCTURA_URBANA ACTUALIZADA')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

aplicar()
