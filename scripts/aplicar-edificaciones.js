const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const generateId = () => `esp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const EDIFICACIONES = [
  {
    id: generateId(),
    titulo: 'Edificios Institucionales y de Oficinas',
    icono: 'Building',
    descripcion: 'Estructuras metálicas para edificios administrativos de 5 a 15 pisos que optimizan plantas libres y flexibilidad arquitectónica. MEISA diseña sistemas de columnas y vigas con modulación amplia (típicamente 8x8 metros) que permiten distribución interior variable con divisiones livianas. Las losas colaborantes (deck metálico + concreto) se integran estructuralmente con las vigas reduciendo tiempos de construcción versus losa tradicional. El acero estructural permite plantas libres sin muros de carga, facilitando futuros cambios de distribución cuando la organización crece o reestructura. Fachadas livianas se cuelgan de la estructura sin aportar peso significativo, permitiendo grandes áreas vidriadas para iluminación natural. Conexiones rígidas o arriostramientos laterales garantizan estabilidad sísmica.',
    proyectosEjemplo: ['Edificios de oficinas', 'Sedes administrativas', 'Edificios gubernamentales'],
    orden: 1,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Parqueaderos Multinivel',
    icono: 'Car',
    descripcion: 'Estructuras metálicas que maximizan el número de vehículos estacionados en área limitada mediante apilamiento vertical de niveles. MEISA diseña parqueaderos con rampas helicoidales o rectas que conectan niveles con pendiente 15% máxima para circulación vehicular cómoda. Vigas metálicas con luces económicas soportan losas colaborantes que resisten el tránsito vehicular sin fisurarse. La modulación optimizada permite el mayor número de cajones de parqueo por metro cuadrado construido, maximizando la rentabilidad de la inversión. Ventilación natural mediante fachadas abiertas elimina sistemas mecánicos costosos de extracción de gases. La estructura desmontable permite reconfiguración o cambio de uso futuro del inmueble según evolucione el sector urbano.',
    proyectosEjemplo: ['Parqueaderos multinivel', 'Estacionamientos', 'Edificios de parqueo'],
    orden: 2,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Edificios Culturales Emblemáticos',
    icono: 'Landmark',
    descripcion: 'Estructuras metálicas que materializan diseños arquitectónicos singulares para equipamientos culturales icónicos. MEISA diseña geometrías complejas (curvas, voladizos, inclinaciones) que serían imposibles o muy costosas en concreto. El acero permite elementos estructurales esbeltos y transparentes que realzan conceptos arquitectónicos sin competir visualmente. Cubiertas de doble curvatura mediante celosías espaciales crean espacios interiores libres de columnas ideales para auditorios, museos o teatros. Fachadas metálicas se integran con la estructura principal permitiendo expresión arquitectónica completa. Acabados con pinturas especiales o pátinas controladas crean texturas que envejecen dignamente. El diseño sismorresistente protege tanto la inversión como los ocupantes.',
    proyectosEjemplo: ['Museos', 'Teatros', 'Centros culturales'],
    orden: 3,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Colegios y Estructuras Educativas',
    icono: 'GraduationCap',
    descripcion: 'Estructuras metálicas modulares para edificios educativos que permiten construcción rápida sin interrumpir semestres académicos. MEISA diseña aulas con luces que eliminan columnas intermedias, maximizando espacio útil y flexibilidad pedagógica. La construcción rápida mediante módulos prefabricados reduce el período de obra a meses versus años del sistema tradicional, habilitando nuevos cupos escolares urgentes. Entrepisos metálicos minimizan la transmisión de ruido entre niveles mediante sistemas de piso flotante, crítico para concentración estudiantil. Estructura sismorresistente garantiza seguridad de menores en zonas de amenaza sísmica alta. Posibilidad de expansiones futuras agregando módulos sin afectar aulas existentes en operación.',
    proyectosEjemplo: ['Colegios', 'Universidades', 'Centros educativos'],
    orden: 4,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Edificios de Altura',
    icono: 'Building2',
    descripcion: 'Estructuras metálicas para edificios de 10 a 20 pisos que optimizan tiempos de construcción en altura. MEISA diseña sistemas estructurales híbridos (acero + concreto) que combinan velocidad de montaje del acero con masa sísmica del concreto. Las columnas metálicas compuestas (perfiles embebidos en concreto) maximizan capacidad portante en área reducida, liberando espacio utilizable en plantas inferiores. Vigas metálicas permiten voladizos importantes en fachada sin apoyos visibles, habilitando balcones o terrazas. El montaje piso por piso avanza sin esperar fraguado del concreto, acelerando cronogramas críticos. Sistema de arriostramientos o muros de corte garantiza rigidez lateral ante vientos y sismos.',
    proyectosEjemplo: ['Torres de oficinas', 'Edificios residenciales', 'Torres mixtas'],
    orden: 5,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
  },
  {
    id: generateId(),
    titulo: 'Ampliaciones a Edificios Existentes',
    icono: 'PlusSquare',
    descripcion: 'Estructuras metálicas que agregan pisos o alas a edificios operativos sin interrumpir actividades internas. MEISA diseña ampliaciones independientes estructuralmente del edificio existente o integradas mediante conectores sísmicos según análisis estructural. La ligereza del acero minimiza cargas adicionales sobre cimentaciones existentes evitando refuerzos costosos. El montaje nocturno o en fines de semana permite operación diurna continua del edificio, crítico en hospitales, hoteles o edificios corporativos. Conexiones atornilladas facilitan desmontaje futuro si la ampliación es temporal. La velocidad de montaje reduce molestias a ocupantes del edificio existente. Acabados compatibles con fachada original mantienen unidad arquitectónica del conjunto.',
    proyectosEjemplo: ['Ampliaciones verticales', 'Expansiones laterales', 'Pisos adicionales'],
    orden: 6,
    activo: true,
    imagen: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
  }
]

async function aplicar() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('ACTUALIZACIÓN: EDIFICACIONES')
    console.log('='.repeat(80) + '\n')

    console.log('📝 Actualizando EDIFICACIONES...')
    await prisma.categoriaProyecto.update({
      where: { slug: 'edificaciones' },
      data: { especialidades: EDIFICACIONES }
    })

    console.log('   ✅ 6 especialidades actualizadas')
    console.log('\n✅ TODAS MANTENIDAS (solo actualización de descripciones):')
    console.log('   • Edificios Institucionales y de Oficinas')
    console.log('   • Parqueaderos Multinivel')
    console.log('   • Edificios Culturales Emblemáticos')
    console.log('   • Colegios y Estructuras Educativas')
    console.log('   • Edificios de Altura')
    console.log('   • Ampliaciones a Edificios Existentes')

    console.log('\n' + '='.repeat(80))
    console.log('✅ EDIFICACIONES ACTUALIZADO')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

aplicar()
