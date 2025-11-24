const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Lista de reclasificaciones necesarias basadas en análisis manual
const reclasificaciones = {
  // INDUSTRIAL → PUENTES (puentes y barandas)
  'UT EYR - Barandas Puente El Jagual': 'PUENTES',
  'Consorcio Competitividad - Barandas Iglesia La Sierra': 'PUENTES',
  'UT E&R - Puente El Jagua Corinto': 'PUENTES',
  'Consorcio Competitividad - Barandas La Lupa': 'PUENTES',
  'Mejía Santander - Puentes Peatonales Paez': 'PUENTES',
  'Consorcio Competitividad - Puente Cusiyaco': 'PUENTES',
  'Programa Tierradentro - Puentes Peatonales Cauca': 'PUENTES',
  'Constructora Pijao - 14 Puentes Metálicos': 'PUENTES',
  'Programa Tierradentro - Puentes Yaquivá': 'PUENTES',
  'Ing. Jesús Albeiro Vásquez - Puente Paispamba': 'PUENTES',
  'JMD Construcción - Puentes Cartón Colombia': 'PUENTES',
  'Fondo Nal. Caminos Vecinales - Puentes Chocó': 'PUENTES',
  'Corporación Nasa Kiwe - Puente La Troja': 'PUENTES',
  'Municipio Guapi - Puente Río Napi': 'PUENTES',
  'Madecons - 2 Puentes Circunvalar Pasto': 'PUENTES',

  // INDUSTRIAL → COMERCIAL (centros comerciales y tiendas)
  'Arinsa - CC Campanario Popayán': 'COMERCIAL',
  'CC Único Cali - Estructuras Etapa 4': 'COMERCIAL',
  'Velkar - CC Único Etapa 3 Cali': 'COMERCIAL',
  'Supermercados Pomona - Sede Ciudad Jardín': 'COMERCIAL',

  // INDUSTRIAL → EDIFICACIONES (edificios, torres, clínicas)
  'Consorcio Colpatria Alpes - Estructura WTC': 'EDIFICACIONES',
  'Ingenio Mayagüez - Edificio Torre': 'EDIFICACIONES',
  'Ingenio Mayagüez - Torre Tacho 6 Niveles': 'EDIFICACIONES',
  'Clínica Excellence - Soporte Edificio 4 Plantas': 'EDIFICACIONES',
  'Mira Tu Salud EPS - Reforzamiento Edificio Bogotá': 'EDIFICACIONES',

  // INDUSTRIAL → DEPORTES_EDUCACION (universidades)
  'Jaime Cárdenas - U. San Buenaventura Cali': 'DEPORTES_EDUCACION',

  // INDUSTRIAL → INFRAESTRUCTURA_URBANA (terminales de transporte)
  'Consorcio Metrovial SB - Terminal Intermedio': 'INFRAESTRUCTURA_URBANA',

  // EDIFICACIONES → COMERCIAL (centros comerciales)
  'CC Único - Estructuras Villavicencio': 'COMERCIAL',
  'CC Único Pasto - Estructuras Sede Pasto': 'COMERCIAL',
  'Consorcio Conconcreto - Almacén Éxito': 'COMERCIAL',
  'CC Único - Estructuras Barranquilla': 'COMERCIAL',
  'CC Único - Ampliación Centro Comercial Cali': 'COMERCIAL',
  'CC Automotriz - Local Comercial Cali': 'COMERCIAL',
  'Estación Marbella - Estación Servicio Cali': 'COMERCIAL',

  // EDIFICACIONES → DEPORTES_EDUCACION (colegios y deportes)
  'Colegio Colombo Británico - Cubierta Sede': 'DEPORTES_EDUCACION',
  'Fondo Mixto Deporte - Piscina Olímpica Popayán': 'DEPORTES_EDUCACION',
  'Colegio Santa Isabel - Sede Cali Ciudad 2000': 'DEPORTES_EDUCACION',

  // EDIFICACIONES → PUENTES
  'Consorcio Remin - Puente Frisoles Nariño': 'PUENTES',

  // EDIFICACIONES → INFRAESTRUCTURA_URBANA (terminales y estaciones)
  'Terminal Transportes - Cubierta Muelle Popayán': 'INFRAESTRUCTURA_URBANA',
  'Estacion Mio Guadalupe': 'INFRAESTRUCTURA_URBANA',
  'Terminal Intermedio Mio Cali': 'INFRAESTRUCTURA_URBANA',

  // PUENTES → INFRAESTRUCTURA_URBANA (escalinatas urbanas)
  'Escalinata Curva - Río Cali': 'INFRAESTRUCTURA_URBANA'
}

async function analizarReclasificaciones() {
  console.log('='.repeat(80))
  console.log('ANÁLISIS DE RECLASIFICACIONES NECESARIAS')
  console.log('='.repeat(80))
  console.log()

  let encontrados = 0
  let noEncontrados = []

  const porCategoriaOrigen = {
    INDUSTRIAL: { PUENTES: 0, COMERCIAL: 0, EDIFICACIONES: 0, DEPORTES_EDUCACION: 0, INFRAESTRUCTURA_URBANA: 0 },
    EDIFICACIONES: { PUENTES: 0, COMERCIAL: 0, DEPORTES_EDUCACION: 0, INFRAESTRUCTURA_URBANA: 0 },
    PUENTES: { INFRAESTRUCTURA_URBANA: 0 }
  }

  for (const [titulo, nuevaCategoria] of Object.entries(reclasificaciones)) {
    // Buscar proyecto por título (parcial)
    const proyectos = await prisma.proyecto.findMany({
      where: {
        titulo: {
          contains: titulo.split(' - ')[0] // Buscar por la primera parte del título
        }
      },
      select: {
        id: true,
        titulo: true,
        categoria: true,
        cliente: true
      }
    })

    if (proyectos.length > 0) {
      // Buscar coincidencia exacta o más cercana
      const proyecto = proyectos.find(p => p.titulo.includes(titulo.split(' - ')[1] || titulo)) || proyectos[0]

      encontrados++

      if (proyecto.categoria !== nuevaCategoria) {
        console.log(`✅ ${proyecto.titulo}`)
        console.log(`   Categoría actual: ${proyecto.categoria}`)
        console.log(`   Nueva categoría:  ${nuevaCategoria}`)
        console.log(`   Cliente: ${proyecto.cliente}`)
        console.log()

        if (porCategoriaOrigen[proyecto.categoria]) {
          if (porCategoriaOrigen[proyecto.categoria][nuevaCategoria] !== undefined) {
            porCategoriaOrigen[proyecto.categoria][nuevaCategoria]++
          }
        }
      }
    } else {
      noEncontrados.push(titulo)
    }
  }

  console.log('='.repeat(80))
  console.log('RESUMEN DE CAMBIOS')
  console.log('='.repeat(80))
  console.log()

  Object.entries(porCategoriaOrigen).forEach(([origen, destinos]) => {
    const total = Object.values(destinos).reduce((a, b) => a + b, 0)
    if (total > 0) {
      console.log(`De ${origen}:`)
      Object.entries(destinos).forEach(([destino, count]) => {
        if (count > 0) {
          console.log(`  → ${destino}: ${count} proyectos`)
        }
      })
      console.log()
    }
  })

  console.log(`Total proyectos a reclasificar: ${encontrados}`)
  console.log(`No encontrados: ${noEncontrados.length}`)

  if (noEncontrados.length > 0) {
    console.log()
    console.log('Proyectos no encontrados:')
    noEncontrados.forEach(t => console.log(`  - ${t}`))
  }

  await prisma.$disconnect()
}

analizarReclasificaciones()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
