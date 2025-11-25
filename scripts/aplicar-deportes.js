const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const DEPORTES = [
  {
    id: generateId(),
    titulo: 'Coliseos para Eventos Internacionales',
    icono: 'Trophy',
    descripcion: 'Estructuras metálicas de gran escala que cumplen requerimientos de federaciones deportivas internacionales (FIFA, FIVB, FIBA). MEISA diseña coliseos con cubiertas de gran luz sin columnas internas que obstruyan visuales desde graderías, utilizando cerchas espaciales o vigas reticuladas de hasta 75 metros. La altura libre mínima según deporte (mínimo 12 metros para voleibol profesional) se logra sin comprometer la esbeltez estructural externa. Graderías metálicas retráctiles o fijas para 5,000 a 15,000 espectadores se integran estructuralmente a la cubierta. Estructura sismorresistente protege grandes concentraciones de público. Plataformas elevadas para cabinas de transmisión y sistemas de iluminación profesional se anclan a la estructura principal.',
    proyectosEjemplo: ['Coliseos deportivos', 'Pabellones deportivos', 'Arenas'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Cubiertas de Grandes Luces sin Columnas',
    icono: 'Maximize2',
    descripcion: 'Techos estructurales que salvan luces excepcionales creando espacios libres de obstrucciones para prácticas deportivas. MEISA diseña cerchas metálicas tridimensionales que distribuyen cargas uniformemente alcanzando luces hasta 100 metros sin apoyos intermedios. Estas estructuras permiten canchas reglamentarias de cualquier deporte sin columnas que interrumpan visuales o trayectorias de balones. El sistema de nudos soldados o atornillados facilita montaje progresivo desde el suelo con apuntalamiento temporal. Cubiertas translúcidas integradas entre cerchas aportan iluminación natural reduciendo consumo eléctrico diurno. Ventilación natural mediante lucernarios perimetrales expulsa aire caliente sin sistemas mecánicos costosos.',
    proyectosEjemplo: ['Canchas cubiertas', 'Polideportivos', 'Coliseos'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Torres Metálicas para Iluminación Deportiva',
    icono: 'Lightbulb',
    descripcion: 'Torres estructurales de acero que soportan luminarias de alta potencia para iluminación nocturna de escenarios deportivos profesionales. MEISA diseña torres de 15 a 30 metros de altura con geometría tronco-cónica que resiste vientos extremos sin vibrar. Plataformas de mantenimiento en la cima permiten acceso seguro para cambio de luminarias mediante escalera interna o externa con línea de vida. La cimentación por zapata o pilotes absorbe momentos volcantes generados por viento actuando sobre luminarias y torre. Acabado galvanizado en caliente elimina mantenimiento de pintura en altura. Niveles de iluminación cumplen normativa FIFA (mínimo 500 lux horizontal) para transmisión televisiva de eventos deportivos internacionales.',
    proyectosEjemplo: ['Torres de iluminación', 'Campos deportivos', 'Estadios'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Piscinas Cubiertas y Complejos Acuáticos',
    icono: 'Waves',
    descripcion: 'Estructuras metálicas para ambientes de alta humedad que soportan cubiertas sobre piscinas olímpicas y recreativas. MEISA diseña cerchas con tratamiento anticorrosivo especial (galvanizado + pintura epóxica) que resisten el ambiente salino generado por cloro y humedad constante. Cubiertas translúcidas entre cerchas aportan iluminación natural cumpliendo requisitos FINA para competencias. Ventilación forzada integrada en cubierta extrae aire húmedo evitando condensación destructiva. Vigas perimetrales soportan sistemas de climatización (deshumidificadores) críticos para confort de nadadores. Altura libre mínima 6 metros sobre nivel de agua según normativa de natación. Estructura diseñada para soportar equipos suspendidos (marcadores, cámaras) sin deflexiones molestas.',
    proyectosEjemplo: ['Piscinas olímpicas', 'Complejos acuáticos', 'Natatorios'],
    orden: 4,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Cubiertas Tensionadas y Membranas',
    icono: 'Tent',
    descripcion: 'Estructuras ligeras que combinan acero con membranas tensadas creando cubiertas de geometría libre y bajo peso. MEISA diseña mástiles metálicos y cables de acero que tensan membranas de PVC o PTFE (Teflón) formando superficies de doble curvatura. Esta tipología permite cubrir grandes áreas con estructura mínima, reduciendo costos hasta 30% versus cubiertas convencionales. Las membranas translúcidas permiten 15-20% de transmisión lumínica generando iluminación difusa ideal para deportes sin deslumbramiento. Ventilación natural entre membrana y estructura expulsa aire caliente por efecto chimenea. El bajo peso de cubierta minimiza cargas sísmicas. Membranas con tratamiento anti-hongos resisten humedad tropical sin deteriorarse.',
    proyectosEjemplo: ['Canchas tensionadas', 'Cubiertas de membrana', 'Estructuras textiles'],
    orden: 5,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1562770402-c81a92a34939?w=800&q=80'
  }
]

async function aplicar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: DEPORTES_EDUCACION')
    console.log('='.repeat(80) + '\n')

    console.log('📝 Actualizando DEPORTES_EDUCACION...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'deportes-educacion' },
      data: { especialidades: DEPORTES }
    })

    console.log('   ✅ 5 especialidades (antes 6)')
    console.log('   ❌ Eliminada: "Graderías y Estructuras de Soporte de Público"\n')

    console.log('✅ MANTENIDAS:')
    console.log('   • Coliseos para Eventos Internacionales')
    console.log('   • Cubiertas de Grandes Luces sin Columnas')
    console.log('   • Torres Metálicas para Iluminación Deportiva')
    console.log('   • Piscinas Cubiertas y Complejos Acuáticos')
    console.log('   • Cubiertas Tensionadas y Membranas')

    console.log('\n' + '='.repeat(80))
    console.log('✅ DEPORTES_EDUCACION ACTUALIZADO')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

aplicar()
