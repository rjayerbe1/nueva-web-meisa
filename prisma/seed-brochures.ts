import { PrismaClient, TipoComponenteBrochure } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding brochure system...')

  // Find or create a user for system operations
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    console.log('❌ No admin user found. Please create an admin user first.')
    return
  }

  console.log(`✅ Using admin user: ${adminUser.email}`)

  // 1. Create default MEISA template
  console.log('📄 Creating default MEISA template...')

  const defaultTemplate = await prisma.brochureTemplate.upsert({
    where: {
      // Use a combination that makes this unique
      id: 'default-meisa-template-001'
    },
    update: {},
    create: {
      id: 'default-meisa-template-001',
      nombre: 'MEISA Portafolio Estándar',
      descripcion: 'Template estándar para brochures de portafolio MEISA, basado en el diseño de los PDFs corporativos',
      thumbnail: '/images/templates/meisa-default-thumbnail.png',
      tipoCategoria: null, // Universal para todas las categorías
      isPublic: true,
      isDefault: true,
      createdBy: adminUser.id,
      estructura: {
        theme: {
          primary: '#1e40af', // MEISA Blue
          secondary: '#dc2626', // MEISA Red
          accent: '#3b82f6',
          background: '#ffffff',
          text: '#1f2937'
        },
        layout: {
          maxWidth: '1200px',
          padding: '40px',
          pageAspectRatio: '16:9'
        }
      },
      componentsLibrary: [
        'COVER_PAGE',
        'PROJECT_CARD',
        'PROJECT_GRID',
        'STATS_GRID',
        'TEXT_BLOCK',
        'IMAGE_GALLERY',
        'CONTACT_INFO'
      ],
      estilosGlobales: {
        fontFamily: "'Inter', sans-serif",
        fontSize: {
          base: '16px',
          h1: '48px',
          h2: '36px',
          h3: '24px'
        },
        colors: {
          primary: '#1e40af',
          secondary: '#dc2626',
          text: '#1f2937',
          textLight: '#6b7280'
        }
      }
    }
  })

  console.log(`✅ Template created: ${defaultTemplate.nombre}`)

  // 2. Create template pages
  console.log('📑 Creating template pages...')

  const templatePages = [
    {
      nombre: 'Portada',
      orden: 0,
      estructura: {
        type: 'COVER_PAGE',
        title: 'PORTAFOLIO DE PROYECTOS',
        subtitle: 'Excelencia en Estructuras Metálicas',
        year: new Date().getFullYear().toString(),
        logo: '/images/logo/logo-meisa.png',
        backgroundColor: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)'
      },
      estilos: {
        background: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)',
        color: '#ffffff'
      }
    },
    {
      nombre: 'Proyectos Destacados',
      orden: 1,
      estructura: {
        type: 'PROJECT_GRID',
        title: 'Proyectos Destacados',
        subtitle: 'Nuestra experiencia en estructuras metálicas',
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
            titulo: 'Edificio Corporativo Torre Sur',
            ubicacion: 'Bogotá, Colombia',
            año: '2023',
            area: 1800,
            peso: 280,
            cliente: 'Constructora ABC',
            imagen: '/images/placeholder-project.jpg'
          }
        ]
      }
    },
    {
      nombre: 'Estadísticas',
      orden: 2,
      estructura: {
        type: 'STATS_GRID',
        stats: [
          {
            value: '10,000+',
            label: 'Toneladas Fabricadas'
          },
          {
            value: '150+',
            label: 'Proyectos Completados'
          },
          {
            value: '500,000+',
            label: 'M² Área Total'
          },
          {
            value: '25+',
            label: 'Años de Experiencia'
          }
        ]
      }
    },
    {
      nombre: 'Contacto',
      orden: 3,
      estructura: {
        type: 'CONTACT_INFO',
        title: 'Contáctenos',
        address: 'Cali, Valle del Cauca, Colombia',
        phone: '+57 (2) 123 4567',
        email: 'contacto@meisa.com.co',
        website: 'www.meisa.com.co'
      }
    }
  ]

  for (const page of templatePages) {
    await prisma.brochureTemplatePage.create({
      data: {
        ...page,
        templateId: defaultTemplate.id
      }
    })
  }

  console.log(`✅ Created ${templatePages.length} template pages`)

  // 3. Create pre-built components
  console.log('🧩 Creating pre-built components...')

  const components = [
    {
      nombre: 'Portada MEISA Estándar',
      tipo: TipoComponenteBrochure.COVER_PAGE,
      descripcion: 'Portada estándar con logo MEISA, título de categoría y gradiente corporativo',
      htmlTemplate: `
<div class="cover-page">
  <div class="logo-container">
    <img src="{{logo}}" alt="MEISA" class="logo" />
  </div>
  <div class="content">
    <h1 class="title">{{title}}</h1>
    <p class="subtitle">{{subtitle}}</p>
    <div class="year">{{year}}</div>
  </div>
  <div class="diagonal-accent"></div>
</div>`,
      cssEstilos: `
.cover-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e40af 0%, #dc2626 100%);
  color: white;
  overflow: hidden;
}

.logo-container {
  position: absolute;
  top: 40px;
  left: 40px;
}

.logo {
  height: 60px;
  filter: brightness(0) invert(1);
}

.content {
  text-align: center;
  z-index: 2;
}

.title {
  font-size: 72px;
  font-weight: 900;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.subtitle {
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 40px;
}

.year {
  font-size: 32px;
  font-weight: 700;
}

.diagonal-accent {
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}`,
      propiedadesSchema: {
        type: 'object',
        properties: {
          logo: { type: 'string', default: '/images/logo/logo-meisa.png' },
          title: { type: 'string', default: 'PORTAFOLIO' },
          subtitle: { type: 'string', default: 'Proyectos destacados' },
          year: { type: 'string', default: new Date().getFullYear().toString() }
        }
      },
      valorDefecto: {
        logo: '/images/logo/logo-meisa.png',
        title: 'PORTAFOLIO',
        subtitle: 'Proyectos destacados',
        year: new Date().getFullYear().toString()
      },
      categoria: 'Portadas',
      tags: ['portada', 'hero', 'cover'],
      isPublic: true,
      createdBy: adminUser.id
    },
    {
      nombre: 'Tarjeta de Proyecto',
      tipo: TipoComponenteBrochure.PROJECT_CARD,
      descripcion: 'Tarjeta de proyecto con imagen, especificaciones técnicas y datos del cliente',
      htmlTemplate: `
<div class="project-card">
  <div class="project-image">
    <img src="{{imagen}}" alt="{{titulo}}" />
    <div class="project-overlay">
      <span class="project-year">{{año}}</span>
    </div>
  </div>
  <div class="project-content">
    <h3 class="project-title">{{titulo}}</h3>
    <p class="project-location">{{ubicacion}}</p>
    <div class="project-specs">
      <div class="spec-item">
        <span class="spec-label">Área:</span>
        <span class="spec-value">{{area}} m²</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Peso:</span>
        <span class="spec-value">{{peso}} ton</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Cliente:</span>
        <span class="spec-value">{{cliente}}</span>
      </div>
    </div>
  </div>
</div>`,
      cssEstilos: `
.project-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.project-image {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.project-year {
  background: rgba(30, 64, 175, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
}

.project-content {
  padding: 24px;
}

.project-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.project-location {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.project-specs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.spec-label {
  font-weight: 600;
  color: #4b5563;
}

.spec-value {
  color: #1e40af;
  font-weight: 600;
}`,
      propiedadesSchema: {
        type: 'object',
        properties: {
          imagen: { type: 'string' },
          titulo: { type: 'string' },
          ubicacion: { type: 'string' },
          año: { type: 'string' },
          area: { type: 'number' },
          peso: { type: 'number' },
          cliente: { type: 'string' }
        },
        required: ['imagen', 'titulo']
      },
      valorDefecto: {
        imagen: '/images/placeholder-project.jpg',
        titulo: 'Nombre del Proyecto',
        ubicacion: 'Ubicación',
        año: new Date().getFullYear().toString(),
        area: 0,
        peso: 0,
        cliente: 'Cliente'
      },
      categoria: 'Proyectos',
      tags: ['proyecto', 'card', 'portfolio'],
      isPublic: true,
      createdBy: adminUser.id
    },
    {
      nombre: 'Grid de Estadísticas',
      tipo: TipoComponenteBrochure.STATS_GRID,
      descripcion: 'Grid de 4 columnas con estadísticas destacadas y iconos',
      htmlTemplate: `
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="stat-value">{{stat1Value}}</div>
    <div class="stat-label">{{stat1Label}}</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="stat-value">{{stat2Value}}</div>
    <div class="stat-label">{{stat2Label}}</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="stat-value">{{stat3Value}}</div>
    <div class="stat-label">{{stat3Label}}</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="stat-value">{{stat4Value}}</div>
    <div class="stat-label">{{stat4Label}}</div>
  </div>
</div>`,
      cssEstilos: `
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 40px 0;
}

.stat-card {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
}`,
      propiedadesSchema: {
        type: 'object',
        properties: {
          stat1Value: { type: 'string' },
          stat1Label: { type: 'string' },
          stat2Value: { type: 'string' },
          stat2Label: { type: 'string' },
          stat3Value: { type: 'string' },
          stat3Label: { type: 'string' },
          stat4Value: { type: 'string' },
          stat4Label: { type: 'string' }
        }
      },
      valorDefecto: {
        stat1Value: '1000+',
        stat1Label: 'Toneladas',
        stat2Value: '50+',
        stat2Label: 'Proyectos',
        stat3Value: '10K+',
        stat3Label: 'M² Área',
        stat4Value: '25+',
        stat4Label: 'Años'
      },
      categoria: 'Estadísticas',
      tags: ['stats', 'metrics', 'numbers'],
      isPublic: true,
      createdBy: adminUser.id
    }
  ]

  for (const component of components) {
    await prisma.brochureComponent.upsert({
      where: {
        // Create a unique identifier based on name and type
        id: `component-${component.tipo}-${component.nombre.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: {},
      create: {
        ...component,
        id: `component-${component.tipo}-${component.nombre.toLowerCase().replace(/\s+/g, '-')}`
      }
    })
  }

  console.log(`✅ Created ${components.length} pre-built components`)

  console.log('✅ Brochure system seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding brochure system:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
