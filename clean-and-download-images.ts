import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanAndPrepareForDownload() {
  try {
    console.log('🧹 Eliminando todas las imágenes de la base de datos...')
    
    // Eliminar todas las imágenes de proyectos
    const deletedImages = await prisma.imagenProyecto.deleteMany({})
    console.log(`✅ Eliminadas ${deletedImages.count} imágenes de la base de datos`)
    
    console.log('\n📋 Lista de imágenes que deben descargarse desde meisa.com.co:')
    
    // Definir las imágenes exactas por proyecto según la información proporcionada
    const projectImages = {
      'centro-comercial-campanario': [
        'Centro-campanario-1.webp',
        'Centro-campanario-2.webp', 
        'Centro-campanario-3.webp',
        'Centro-campanario-4.webp',
        'Centro-campanario-5.webp',
        'Centro-campanario-6.webp',
        'Centro-campanario-7.webp'
      ],
      'paseo-villa-del-rio': [
        'Centro-paseo-villa-del-rio-1-400x400.webp',
        'Centro-paseo-villa-del-rio-2-400x400.webp',
        'Centro-paseo-villa-del-rio-3-400x400.webp',
        'Centro-paseo-villa-del-rio-4-400x400.webp',
        'Centro-paseo-villa-del-rio-5-400x400.webp'
      ],
      'centro-comercial-monserrat': [
        'Monserrat-Plaza.jpg',
        'Monserrat-Plaza3.jpg',
        'Monserrat-Plaza-1.jpg',
        'monserrat-5.jpg',
        'Monserrat-Plaza3-1.jpg',
        'Centro-monserrat-1.webp',
        'Centro-monserrat-2.webp',
        'Centro-monserrat-3.webp',
        'Centro-monserrat-4.webp',
        'Centro-monserrat-5.webp'
      ],
      'centro-comercial-unico-cali': [
        'Centro-unico-cali-1.webp',
        'Centro-unico-cali-2.webp',
        'Centro-unico-cali-3.webp',
        'Centro-unico-cali-4.webp',
        'Centro-unico-cali-5.webp'
      ],
      'centro-comercial-unico-neiva': [
        'Centro-unico-neiva-1.webp',
        'Centro-unico-neiva-2.webp',
        'Centro-unico-neiva-3.webp',
        'Centro-unico-neiva-4.webp',
        'Centro-unico-neiva-5.webp'
      ],
      'centro-comercial-unico-barranquilla': [
        'Centro-unico-barranquilla-2.webp',
        'Centro-unico-barranquilla-3.webp'
      ],
      'centro-comercial-armenia-plaza': [
        'CC-ARMENIA-PLAZA-1.jpeg',
        'CC-ARMENIA-PLAZA-5.jpeg',
        'Centro-armenia-plaza-1.webp',
        'Centro-armenia-plaza-2.webp',
        'Centro-armenia-plaza-3.webp',
        'Centro-armenia-plaza-4.webp'
      ],
      'centro-comercial-bochalema-plaza': [
        'Centro-Comercial-Bochalema-Plaza-Cali.jpg',
        'Centro-bochalema-plaza-1.webp',
        'Centro-bochalema-plaza-2.webp',
        'Centro-bochalema-plaza-3.webp',
        'Centro-bochalema-plaza-4.webp',
        'Centro-bochalema-plaza-5.webp',
        'Centro-bochalema-plaza-6.webp',
        'Centro-bochalema-plaza-7.webp',
        'Centro-bochalema-plaza-8.webp',
        'Centro-bochalema-plaza-9.webp'
      ],
      'cinemateca-distrital': [
        'Edificio-cinemateca-distrital-1.webp',
        'Edificio-cinemateca-distrital-2.webp',
        'Edificio-cinemateca-distrital-3.webp',
        'Edificio-cinemateca-distrital-4.webp',
        'Edificio-cinemateca-distrital-5.webp',
        'Edificio-cinemateca-distrital-6.webp'
      ],
      'clinica-reina-victoria': [
        'Edificio-clinica-reina-victoria-1.webp',
        'Edificio-clinica-reina-victoria-2.webp',
        'Edificio-clinica-reina-victoria-3.webp',
        'Edificio-clinica-reina-victoria-4.webp',
        'Edificio-clinica-reina-victoria-5.webp',
        'Edificio-clinica-reina-victoria-6.webp',
        'Edificio-clinica-reina-victoria-7.webp'
      ],
      'edificio-omega': [
        'Edificio-omega-1.webp',
        'Edificio-omega-2.webp',
        'Edificio-omega-3.webp',
        'Edificio-omega-4.webp'
      ],
      'estacion-de-bomberos-popayan': [
        'Edificio-bomberos-popayan-1.webp',
        'Edificio-bomberos-popayan-2.webp',
        'Edificio-bomberos-popayan-3.webp',
        'Edificio-bomberos-popayan-4.webp',
        'Edificio-bomberos-popayan-5.webp'
      ],
      'estacion-mio-guadalupe': [
        'Edificio-estacion-mio-guadalupe-1.webp',
        'Edificio-estacion-mio-guadalupe-2.webp',
        'Edificio-estacion-mio-guadalupe-3.webp',
        'Edificio-estacion-mio-guadalupe-4.webp',
        'Edificio-estacion-mio-guadalupe-5.webp',
        'Edificio-estacion-mio-guadalupe-6.webp'
      ],
      'sena-santander': [
        'Edificio-sena-santander-1.webp',
        'Edificio-sena-santander-2.webp',
        'Edificio-sena-santander-3.webp',
        'Edificio-sena-santander-4.webp'
      ],
      'terminal-intermedio-mio': [
        'Edificio-terminal-intermedio-mio-cali-1.webp',
        'Edificio-terminal-intermedio-mio-cali-2.webp',
        'Edificio-terminal-intermedio-mio-cali-3.webp',
        'Edificio-terminal-intermedio-mio-cali-4.webp',
        'Edificio-terminal-intermedio-mio-cali-5.webp',
        'Edificio-terminal-intermedio-mio-cali-6.webp',
        'Edificio-terminal-intermedio-mio-cali-7.webp',
        'Edificio-terminal-intermedio-mio-cali-8.webp'
      ],
      'tequendama-parking-cali': [
        'Edificio-tequendama-parking-cali-1.webp',
        'Edificio-tequendama-parking-cali-2.webp',
        'Edificio-tequendama-parking-cali-3.webp',
        'Edificio-tequendama-parking-cali-4.webp',
        'Edificio-tequendama-parking-cali-5.webp',
        'Edificio-tequendama-parking-cali-6.webp',
        'Edificio-tequendama-parking-cali-7.webp',
        'Edificio-tequendama-parking-cali-8.webp'
      ],
      'modulos-medicos': [
        'Edificio-modulos-medicos-1.webp',
        'Edificio-modulos-medicos-2.webp',
        'Edificio-modulos-medicos-3.webp',
        'Edificio-modulos-medicos-4.webp'
      ],
      'ampliacion-cargill': [
        'Industria-ampliacion-cargill-1-400x400.webp',
        'Industria-ampliacion-cargill-2-400x400.webp',
        'Industria-ampliacion-cargill-3-400x400.webp',
        'Industria-ampliacion-cargill-4-400x400.webp',
        'Industria-ampliacion-cargill-5-400x400.webp',
        'Industria-ampliacion-cargill-6-400x400.webp'
      ],
      'torre-cogeneracion-propal': [
        'Industria-torre-cogeneracion-propal-1.webp',
        'Industria-torre-cogeneracion-propal-2.webp',
        'Industria-torre-cogeneracion-propal-3.webp',
        'Industria-torre-cogeneracion-propal-4.webp',
        'Industria-torre-cogeneracion-propal-5.webp'
      ],
      'bodega-duplex-ingenieria': [
        'Industria-bodega-duplex-1.webp',
        'Industria-bodega-duplex-2.webp',
        'Industria-bodega-duplex-3.webp',
        'Industria-bodega-duplex-4.webp'
      ],
      'bodega-intera': [
        'Industria-bodega-intera-1.webp',
        'Industria-bodega-intera-2.webp',
        'Industria-bodega-intera-3.webp',
        'Industria-bodega-intera-4.webp'
      ],
      'tecnofar': [
        'Industria-tecnofar-1.webp',
        'Industria-tecnofar-2.webp',
        'Industria-tecnofar-3.webp',
        'Industria-tecnofar-4.webp',
        'Industria-tecnofar-5.webp'
      ],
      'bodega-protecnica-etapa-ii': [
        'Industria-bodega-protecnica-etapa-dos-1.webp',
        'Industria-bodega-protecnica-etapa-dos-2.webp',
        'Industria-bodega-protecnica-etapa-dos-3.webp',
        'Industria-bodega-protecnica-etapa-dos-4.webp',
        'Industria-bodega-protecnica-etapa-dos-5.webp',
        'Industria-bodega-protecnica-etapa-dos-6.webp',
        'Industria-bodega-protecnica-etapa-dos-7.webp'
      ],
      'tecnoquimicas-jamundi': [
        'Industria-tecnoquimicas-jamundi-1.webp',
        'Industria-tecnoquimicas-jamundi-2.webp',
        'Industria-tecnoquimicas-jamundi-3.webp',
        'Industria-tecnoquimicas-jamundi-4.webp',
        'Industria-tecnoquimicas-jamundi-5.webp'
      ],
      'puente-vehicular-nolasco': [
        'Puente-vehicular-nolasco-1.webp',
        'Puente-vehicular-nolasco-2.webp',
        'Puente-vehicular-nolasco-3.webp'
      ],
      'puente-vehicular-carrera-100': [
        'Puente-vehicular-carrera-cien-1.webp',
        'Puente-vehicular-carrera-cien-2.webp',
        'Puente-vehicular-carrera-cien-3.webp',
        'Puente-vehicular-carrera-cien-4.webp',
        'Puente-vehicular-carrera-cien-5.webp'
      ],
      'puente-vehicular-cambrin': [
        'Puente-vehicular-cambrin-1.webp',
        'Puente-vehicular-cambrin-2.webp',
        'Puente-vehicular-cambrin-3.webp',
        'Puente-vehicular-cambrin-4.webp',
        'Puente-vehicular-cambrin-5.webp'
      ],
      'puente-vehicular-frisoles': [
        'Puente-vehicular-frisoles-1.webp',
        'Puente-vehicular-frisoles-2.webp'
      ],
      'puente-vehicular-la-21': [
        'Puente-vehicular-la-veinti-uno-1.webp',
        'Puente-vehicular-la-veinti-uno-2.webp',
        'Puente-vehicular-la-veinti-uno-3.webp',
        'Puente-vehicular-la-veinti-uno-4.webp'
      ],
      'puente-vehicular-la-paila': [
        'Puente-vehicular-la-paila-1.webp',
        'Puente-vehicular-la-paila-2.webp',
        'Puente-vehicular-la-paila-3.webp',
        'Puente-vehicular-la-paila-4.webp',
        'Puente-vehicular-la-paila-5.webp'
      ],
      'puente-vehicular-saraconcho': [
        'Puente-vehicular-saraconcho-1.webp',
        'Puente-vehicular-saraconcho-2.webp',
        'Puente-vehicular-saraconcho-3.webp',
        'Puente-vehicular-saraconcho-4.webp'
      ],
      'escalinata-curva-rio-cali': [
        'Puente peatonal escalinata curva rio cali 1.webp',
        'Puente peatonal escalinata curva rio cali 2.webp',
        'Puente peatonal escalinata curva rio cali 3.webp',
        'Puente peatonal escalinata curva rio cali 4.webp',
        'Puente peatonal escalinata curva rio cali 5.webp',
        'Puente peatonal escalinata curva rio cali 6.webp'
      ],
      'puente-peatonal-autopista-sur-carrera-68': [
        'Puente peatonal autopista sur cali 1.webp',
        'Puente peatonal autopista sur cali 2.webp',
        'Puente peatonal autopista sur cali 3.webp',
        'Puente peatonal autopista sur cali 4.webp'
      ],
      'puente-peatonal-la-63': [
        'Puente peatonal la 63 cali 1.webp',
        'Puente peatonal la 63 cali 2.webp',
        'Puente peatonal la 63 cali 3.webp',
        'Puente peatonal la 63 cali 4.webp'
      ],
      'puente-peatonal-la-tertulia': [
        'Puente peatonal la tertulia 1.webp',
        'Puente peatonal la tertulia 2.webp',
        'Puente peatonal la tertulia 3.webp',
        'Puente peatonal la tertulia 4.webp'
      ],
      'puente-peatonal-terminal-intermedio': [
        'Puente peatonal terminal intermedio 1.webp',
        'Puente peatonal terminal intermedio 2.webp',
        'Puente peatonal terminal intermedio 3.webp',
        'Puente peatonal terminal intermedio 4.webp',
        'Puente peatonal terminal intermedio 5.webp'
      ],
      'complejo-acuatico-popayan': [
        'Escenario-deportivo-compejo-acuativo-popayan-1.webp',
        'Escenario-deportivo-complejo-acuatico-popayan-2.webp'
      ],
      'coliseo-mayor-juegos-nacionales-2012': [
        'Escenario-deportivo-juegos-nacionales-coliseo-mayor-1.webp',
        'Escenario-deportivo-juegos-nacionales-coliseo-mayor-2.webp'
      ],
      'coliseo-de-artes-marciales-nacionales-2012': [
        'Escenario-deportivo-coliseo-de-artes-marciales-1.webp'
      ],
      'cecun-universidad-del-cauca': [
        'Escenario-deportivo-cecun-1.webp',
        'Escenario-deportivo-cecun-2.webp',
        'Escenario-deportivo-cecun-3.webp',
        'Escenario-deportivo-cecun-4.webp',
        'Escenario-deportivo-cecun-5.webp'
      ],
      'cancha-javeriana-cali': [
        'Escenario-deportivo-cancha-javeriana-cali-1.webp',
        'Escenario-deportivo-cancha-javeriana-cali-2.webp',
        'Escenario-deportivo-cancha-javeriana-cali-3.webp',
        'Escenario-deportivo-cancha-javeriana-cali-4.webp',
        'Escenario-deportivo-cancha-javeriana-cali-5.webp',
        'Escenario-deportivo-cancha-javeriana-cali-6.webp',
        'Escenario-deportivo-cancha-javeriana-cali-7.webp',
        'Escenario-deportivo-cancha-javeriana-cali-8.webp'
      ]
    }
    
    // Mostrar lista de imágenes a descargar
    let totalImages = 0
    for (const [projectSlug, images] of Object.entries(projectImages)) {
      console.log(`\n📁 ${projectSlug}:`)
      images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img}`)
        totalImages++
      })
    }
    
    console.log(`\n📊 Total de imágenes a descargar: ${totalImages}`)
    console.log('\n🔗 Base URL para descargar: https://meisa.com.co/wp-content/uploads/')
    console.log('\n⚠️  SIGUIENTE PASO: Usar un script de descarga automática o descargar manualmente desde meisa.com.co')
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanAndPrepareForDownload()