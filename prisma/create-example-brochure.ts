import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Creating example brochure...')

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    console.log('❌ No admin user found')
    return
  }

  // Get default template
  const template = await prisma.brochureTemplate.findFirst({
    where: { isDefault: true }
  })

  if (!template) {
    console.log('❌ No default template found. Run: npm run db:seed:brochures')
    return
  }

  // Get Centros Comerciales category
  const categoria = await prisma.categoriaProyecto.findFirst({
    where: { slug: 'centros-comerciales' }
  })

  if (!categoria) {
    console.log('❌ Category "centros-comerciales" not found')
    return
  }

  console.log(`✅ Using template: ${template.nombre}`)
  console.log(`✅ Using category: ${categoria.nombre}`)

  // Create brochure
  const brochure = await prisma.brochure.create({
    data: {
      titulo: 'Portafolio Centros Comerciales 2025',
      descripcion: 'Proyectos destacados de estructuras metálicas para centros comerciales',
      templateId: template.id,
      categoriaId: categoria.id,
      contenido: {},
      datosPersonalizados: {},
      configuracion: {},
      activo: true,
      publicado: true,
      fechaPublicacion: new Date(),
      urlAmigable: 'portafolio-centros-comerciales-2025',
      versionNumero: 1,
      thumbnail: '/images/placeholder-project.jpg',
      createdBy: admin.id
    }
  })

  console.log(`✅ Brochure created: ${brochure.titulo}`)

  // Create pages
  const pages = [
    {
      nombre: 'Portada',
      orden: 0,
      visible: true,
      contenido: {
        type: 'COVER_PAGE',
        title: 'CENTROS COMERCIALES',
        subtitle: 'Estructuras Metálicas de Alto Impacto',
        year: '2025',
        logo: '/images/logo/logo-meisa.png',
        backgroundColor: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)'
      },
      componentesData: {}
    },
    {
      nombre: 'Proyectos Destacados',
      orden: 1,
      visible: true,
      contenido: {
        type: 'PROJECT_GRID',
        title: 'Proyectos Destacados',
        subtitle: 'Estructuras que transforman espacios comerciales',
        projects: [
          {
            titulo: 'Centro Comercial Plaza Central',
            ubicacion: 'Cali, Valle del Cauca',
            año: '2024',
            area: 2500,
            peso: 350,
            cliente: 'Grupo Empresarial XYZ',
            imagen: '/images/placeholder-project.jpg'
          },
          {
            titulo: 'Mall del Norte',
            ubicacion: 'Barranquilla, Atlántico',
            año: '2023',
            area: 3200,
            peso: 420,
            cliente: 'Inversiones del Caribe',
            imagen: '/images/placeholder-project.jpg'
          },
          {
            titulo: 'Centro Comercial El Tesoro',
            ubicacion: 'Medellín, Antioquia',
            año: '2023',
            area: 1800,
            peso: 280,
            cliente: 'Constructora Antioqueña',
            imagen: '/images/placeholder-project.jpg'
          },
          {
            titulo: 'Plaza Mayor Shopping',
            ubicacion: 'Bogotá, Cundinamarca',
            año: '2022',
            area: 4500,
            peso: 580,
            cliente: 'Grupo Inmobiliario Capital',
            imagen: '/images/placeholder-project.jpg'
          }
        ]
      },
      componentesData: {}
    },
    {
      nombre: 'Estadísticas',
      orden: 2,
      visible: true,
      contenido: {
        type: 'STATS_GRID',
        stats: [
          {
            value: '15,000+',
            label: 'Toneladas en Centros Comerciales'
          },
          {
            value: '25+',
            label: 'Centros Comerciales Construidos'
          },
          {
            value: '800,000+',
            label: 'M² Área Total'
          },
          {
            value: '100%',
            label: 'Cumplimiento en Plazos'
          }
        ]
      },
      componentesData: {}
    },
    {
      nombre: 'Cronología',
      orden: 3,
      visible: true,
      contenido: {
        type: 'TIMELINE',
        title: 'Proceso de Construcción',
        events: [
          {
            title: 'Diseño y Planificación',
            date: 'Semana 1-2',
            description: 'Análisis estructural y diseño detallado según especificaciones del cliente'
          },
          {
            title: 'Fabricación',
            date: 'Semana 3-8',
            description: 'Fabricación en planta con control de calidad en cada etapa'
          },
          {
            title: 'Pre-ensamblaje',
            date: 'Semana 9-10',
            description: 'Verificación de ajustes y pre-ensamblaje en planta'
          },
          {
            title: 'Montaje en Obra',
            date: 'Semana 11-14',
            description: 'Instalación en sitio con equipos especializados'
          },
          {
            title: 'Entrega Final',
            date: 'Semana 15',
            description: 'Inspección final y entrega certificada al cliente'
          }
        ]
      },
      componentesData: {}
    },
    {
      nombre: 'Especificaciones Técnicas',
      orden: 4,
      visible: true,
      contenido: {
        type: 'TECHNICAL_SPECS',
        title: 'Especificaciones Técnicas',
        specs: [
          {
            label: 'Material Principal',
            value: 'Acero estructural ASTM A36 y A572'
          },
          {
            label: 'Capacidad de Carga',
            value: '500',
            unit: 'kg/m²'
          },
          {
            label: 'Resistencia Sísmica',
            value: 'NSR-10 Zona de amenaza alta'
          },
          {
            label: 'Recubrimiento',
            value: 'Pintura anticorrosiva + acabado arquitectónico'
          },
          {
            label: 'Luces Máximas',
            value: '25',
            unit: 'metros'
          },
          {
            label: 'Altura Típica',
            value: '8-12',
            unit: 'metros'
          },
          {
            label: 'Certificaciones',
            value: 'ISO 9001, ISO 14001, OHSAS 18001'
          },
          {
            label: 'Garantía',
            value: '10 años en estructura'
          }
        ]
      },
      componentesData: {}
    },
    {
      nombre: 'Galería',
      orden: 5,
      visible: true,
      contenido: {
        type: 'IMAGE_GALLERY',
        title: 'Galería de Proyectos',
        columns: 3,
        images: [
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Estructura metálica centro comercial',
            caption: 'Estructuras principales'
          },
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Proceso de montaje',
            caption: 'Montaje en obra'
          },
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Detalles arquitectónicos',
            caption: 'Acabados de precisión'
          },
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Vista nocturna',
            caption: 'Iluminación arquitectónica'
          },
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Interior del centro comercial',
            caption: 'Espacios interiores'
          },
          {
            url: '/images/placeholder-project.jpg',
            alt: 'Fachada principal',
            caption: 'Fachada metálica'
          }
        ]
      },
      componentesData: {}
    },
    {
      nombre: 'Por Qué Elegirnos',
      orden: 6,
      visible: true,
      contenido: {
        type: 'TEXT_BLOCK',
        title: '¿Por Qué Elegir MEISA para tu Centro Comercial?',
        content: 'En MEISA contamos con más de 25 años de experiencia en el diseño y construcción de estructuras metálicas para centros comerciales. Nuestro equipo de ingenieros especializados trabaja con tecnología de punta para garantizar estructuras seguras, eficientes y estéticamente impactantes. Cumplimos con todas las normativas sísmicas colombianas (NSR-10) y contamos con certificaciones internacionales de calidad. Cada proyecto es único y nos adaptamos a las necesidades específicas de arquitectura y diseño de nuestros clientes.',
        align: 'left'
      },
      componentesData: {}
    },
    {
      nombre: 'Contacto',
      orden: 7,
      visible: true,
      contenido: {
        type: 'CONTACT_INFO',
        title: 'Contáctenos',
        address: 'Cali, Valle del Cauca, Colombia',
        phone: '+57 (2) 123 4567',
        email: 'contacto@meisa.com.co',
        website: 'www.meisa.com.co'
      },
      componentesData: {}
    }
  ]

  for (const page of pages) {
    await prisma.brochurePage.create({
      data: {
        ...page,
        brochureId: brochure.id
      }
    })
  }

  console.log(`✅ Created ${pages.length} pages`)

  // Create initial analytics
  await prisma.brochureAnalytics.create({
    data: {
      brochureId: brochure.id,
      vistas: 0,
      descargas: 0,
      compartidos: 0
    }
  })

  console.log('✅ Example brochure created successfully!')
  console.log('\n📍 View it at:')
  console.log(`   - Category page: http://localhost:3001/proyectos/categoria/centros-comerciales`)
  console.log(`   - Direct link: http://localhost:3001/brochure/portafolio-centros-comerciales-2025`)
  console.log(`\n🎉 You can now click "Ver Brochure Digital" on the category page!`)
}

main()
  .catch((e) => {
    console.error('❌ Error creating example brochure:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
