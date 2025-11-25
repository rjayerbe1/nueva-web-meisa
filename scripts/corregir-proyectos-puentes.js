const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const PUENTES_CORREGIDO = [
  {
    id: generateId(),
    titulo: 'Puentes de Vigas y Cerchas',
    icono: 'Bridge',
    descripcion: 'Puentes metálicos mediante vigas cajón o cerchas reticuladas para tráfico vehicular y peatonal. MEISA ha construido más de 35 puentes con luces hasta 212 metros. Fabricación en taller con control de calidad certificado, montaje por dovelas que reduce cierres de vía. Diseño sismorresistente cumpliendo NSR-10. Incluye puentes vehiculares de gran luz y peatonales estándar. Acabados anticorrosivos para décadas de vida útil. Instalación nocturna permite mantener tráfico diurno.',
    proyectosEjemplo: ['Puentes vehiculares', 'Viaductos', 'Ciclopuentes', 'Puentes peatonales'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes en Arco Metálico',
    icono: 'Arc',
    descripcion: 'Puentes con geometría en arco que aprovechan la compresión del acero para salvar luces importantes con altura limitada. MEISA ha construido el Puente Arco Saraconcho de 150 metros, proyecto emblemático donde el arco transfiere cargas lateralmente a los estribos eliminando momentos en el centro. Ideal cuando hay restricciones de altura pero se requiere luz considerable. Prefabricación de dovelas de arco permite montaje progresivo. El acabado arquitectónico del arco se convierte en elemento icónico que identifica el sector.',
    proyectosEjemplo: ['Puentes en arco', 'Viaductos urbanos', 'Puentes emblemáticos'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1577791465033-6aa3e486f9d7?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Puentes Livianos y Comunitarios',
    icono: 'Users',
    descripcion: 'Puentes metálicos ligeros que conectan comunidades mediante estructuras peatonales, colgantes y rurales. MEISA ha construido más de 20 puentes livianos incluyendo pasarelas peatonales de 30 a 80 metros con rampas accesibles, 3 puentes colgantes para cruzar ríos y cañones, y múltiples puentes comunitarios que conectan veredas aisladas. Estructura prefabricada permite instalación rápida sin maquinaria pesada. Galvanizado elimina mantenimiento en zonas de difícil acceso. Diseño resistente a crecientes con altura libre adecuada.',
    proyectosEjemplo: ['Puentes peatonales', 'Pasarelas urbanas', 'Puentes colgantes', 'Puentes comunitarios'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=800&q=80'
  }
]

async function corregir() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('CORRECCIÓN: Proyectos Ejemplo de PUENTES (formato consistente)')
    console.log('='.repeat(80) + '\n')

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { slug: 'puentes' }
    })

    if (!categoria) {
      console.log('❌ Categoría PUENTES no encontrada')
      return
    }

    // Respaldo
    const backupFile = `./respaldo-puentes-correccion-${Date.now()}.json`
    fs.writeFileSync(backupFile, JSON.stringify({
      nombre: categoria.nombre,
      especialidades: categoria.especialidades
    }, null, 2))
    console.log(`📦 Respaldo: ${backupFile}\n`)

    console.log('❌ ANTES (nombres específicos):')
    categoria.especialidades?.forEach((esp, idx) => {
      console.log(`   ${idx + 1}. ${esp.titulo}`)
      console.log(`      ${esp.proyectosEjemplo.join(', ')}`)
    })

    console.log('\n✅ DESPUÉS (tipos generales - consistente con otras categorías):')
    PUENTES_CORREGIDO.forEach((esp, idx) => {
      console.log(`   ${idx + 1}. ${esp.titulo}`)
      console.log(`      ${esp.proyectosEjemplo.join(', ')}`)
    })

    // Actualizar
    await prisma.categoriaProyecto.update({
      where: { slug: 'puentes' },
      data: { especialidades: PUENTES_CORREGIDO }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ PUENTES: proyectosEjemplo corregidos (formato consistente)')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

corregir()
