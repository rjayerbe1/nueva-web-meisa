const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mapa de ID de proyecto → nueva categoría (se llenará dinámicamente)
const reclasificacionesPorTitulo = {
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

async function ejecutarReclasificacion() {
  console.log('='.repeat(80))
  console.log('EJECUTANDO RECLASIFICACIÓN DE PROYECTOS')
  console.log('='.repeat(80))
  console.log()

  let reclasificados = 0
  let errores = 0
  const cambiosPorCategoria = {}

  for (const [patternTitulo, nuevaCategoria] of Object.entries(reclasificacionesPorTitulo)) {
    try {
      // Buscar proyecto por título (parcial)
      const palabrasClave = patternTitulo.split(' - ')
      const proyectos = await prisma.proyecto.findMany({
        where: {
          titulo: {
            contains: palabrasClave[0]
          }
        }
      })

      if (proyectos.length === 0) {
        console.log(`⚠️  No encontrado: ${patternTitulo}`)
        errores++
        continue
      }

      // Buscar mejor coincidencia
      const proyecto = proyectos.find(p =>
        palabrasClave.every(palabra => p.titulo.includes(palabra))
      ) || proyectos[0]

      if (proyecto.categoria === nuevaCategoria) {
        console.log(`ℹ️  Ya está en la categoría correcta: ${proyecto.titulo}`)
        continue
      }

      // Ejecutar actualización
      await prisma.proyecto.update({
        where: { id: proyecto.id },
        data: { categoria: nuevaCategoria }
      })

      const cambio = `${proyecto.categoria} → ${nuevaCategoria}`
      if (!cambiosPorCategoria[cambio]) {
        cambiosPorCategoria[cambio] = 0
      }
      cambiosPorCategoria[cambio]++

      console.log(`✅ ${proyecto.titulo}`)
      console.log(`   ${proyecto.categoria} → ${nuevaCategoria}`)
      console.log()

      reclasificados++

    } catch (error) {
      console.error(`❌ Error con "${patternTitulo}":`, error.message)
      errores++
    }
  }

  console.log('='.repeat(80))
  console.log('RESUMEN DE RECLASIFICACIÓN')
  console.log('='.repeat(80))
  console.log()
  console.log(`✅ Proyectos reclasificados: ${reclasificados}`)
  console.log(`❌ Errores: ${errores}`)
  console.log()

  console.log('Cambios realizados:')
  Object.entries(cambiosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cambio, count]) => {
      console.log(`  ${cambio}: ${count} proyectos`)
    })
  console.log()

  await prisma.$disconnect()
  return { reclasificados, errores }
}

ejecutarReclasificacion()
  .then(result => {
    console.log(`✅ Reclasificación completada: ${result.reclasificados} proyectos actualizados`)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })
