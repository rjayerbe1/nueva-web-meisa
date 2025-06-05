import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const serviceStatistics = {
  'consultoria-en-diseno-estructural': [
    { label: 'Años de experiencia', value: '25+', icon: 'Calendar' },
    { label: 'Obras en estructura metálica', value: '4.670', icon: 'Building2' },
    { label: 'M² diseñados', value: '2.5M', icon: 'Ruler' },
    { label: 'Ingenieros especializados', value: '15', icon: 'HardHat' }
  ],
  'fabricacion-de-estructuras-metalicas': [
    { label: 'Toneladas fabricadas', value: '40.000', icon: 'Factory' },
    { label: 'M² de planta de producción', value: '69.000', icon: 'Warehouse' },
    { label: 'Capacidad mensual', value: '3.000 ton', icon: 'TrendingUp' },
    { label: 'Proyectos ejecutados', value: '500+', icon: 'Package' }
  ],
  'montaje-de-estructuras': [
    { label: 'Años en montaje SADELEC', value: '35', icon: 'Award' },
    { label: 'Proyectos montados', value: '400+', icon: 'Wrench' },
    { label: 'Países de operación', value: '14', icon: 'Globe' },
    { label: 'Equipos especializados', value: '50+', icon: 'Truck' }
  ],
  'gestion-integral-de-proyectos': [
    { label: 'Proyectos gestionados', value: '200+', icon: 'ClipboardCheck' },
    { label: 'Clientes satisfechos', value: '150+', icon: 'Users' },
    { label: 'Cumplimiento de plazos', value: '98%', icon: 'Clock' },
    { label: 'Certificaciones activas', value: '8', icon: 'Shield' }
  ]
}

async function updateServiceStatistics() {
  try {
    console.log('🚀 Iniciando actualización de estadísticas de servicios...')

    for (const [slug, estadisticas] of Object.entries(serviceStatistics)) {
      console.log(`\n📊 Actualizando estadísticas para: ${slug}`)
      
      const result = await prisma.servicio.update({
        where: { slug },
        data: {
          estadisticas: estadisticas
        }
      })
      
      console.log(`✅ ${result.nombre} actualizado con ${estadisticas.length} estadísticas`)
    }

    console.log('\n✨ Todas las estadísticas han sido actualizadas exitosamente!')
  } catch (error) {
    console.error('❌ Error al actualizar estadísticas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la actualización
updateServiceStatistics()