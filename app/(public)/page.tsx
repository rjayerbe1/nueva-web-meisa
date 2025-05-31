import { prisma } from '@/lib/prisma'

// Importaciones de componentes
import { HeroSection } from '@/components/sections/HeroSectionNew'
import { StatsSection } from '@/components/sections/StatsSectionNew'
import { ServicesSection } from '@/components/sections/ServicesSectionNew'
import { TecnologiasSection } from '@/components/sections/TecnologiasSection'
import { InfraestructuraSection } from '@/components/sections/InfraestructuraSection'
import { ProjectsByCategorySection } from '@/components/sections/ProjectsByCategorySection'
import { ClientesSection } from '@/components/sections/ClientesSection'
import { ValoresSection } from '@/components/sections/ValoresSection'
import { AboutSection } from '@/components/sections/AboutSectionNew'
import { ContactSection } from '@/components/sections/ContactSection'

async function getProjectsByCategory() {
  const projects = await prisma.proyecto.findMany({
    where: {
      visible: true,
      destacadoEnCategoria: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      imagenes: {
        orderBy: {
          orden: 'asc'
        }
      }
    }
  })

  // Mapear los proyectos para incluir imagenPortada
  const mappedProjects = projects.map(project => {
    const imagenPortada = project.imagenes.find(img => img.tipo === 'PORTADA') || project.imagenes[0]
    
    return {
      id: project.id,
      titulo: project.titulo,
      descripcion: project.descripcion,
      categoria: project.categoria,
      cliente: project.cliente,
      ubicacion: project.ubicacion,
      slug: project.slug,
      imagenPortada: imagenPortada ? {
        url: imagenPortada.url,
        alt: imagenPortada.alt || project.titulo
      } : undefined
    }
  })

  // Agrupar por categoría
  const projectsByCategory: Record<string, typeof mappedProjects> = {}
  mappedProjects.forEach(project => {
    if (!projectsByCategory[project.categoria]) {
      projectsByCategory[project.categoria] = []
    }
    projectsByCategory[project.categoria].push(project)
  })

  return projectsByCategory
}

export default async function HomePage() {
  const projectsByCategory = await getProjectsByCategory()

  return (
    <main className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Sección de Estadísticas */}
      <StatsSection />
      
      {/* Sección Sobre Nosotros con Misión/Visión */}
      <AboutSection />
      
      {/* Sección de Servicios con modelos 3D */}
      <ServicesSection />
      
      {/* Sección de Tecnologías (8 software) */}
      <TecnologiasSection />
      
      {/* Sección de Infraestructura (3 plantas) */}
      <InfraestructuraSection />
      
      {/* Proyectos por Categoría */}
      <ProjectsByCategorySection projectsByCategory={projectsByCategory} />
      
      {/* Sección de Clientes Destacados */}
      <ClientesSection />
      
      {/* Sección de Valores Corporativos */}
      <ValoresSection />
      
      {/* Sección de Contacto */}
      <ContactSection />
    </main>
  )
}