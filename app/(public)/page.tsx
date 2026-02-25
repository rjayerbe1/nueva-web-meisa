import { prisma } from '@/lib/prisma'
import { HeroImageConfig, defaultHeroImages } from '@/lib/hero-config'

// Importaciones de componentes mejoradas con estilo de servicios
import { HomeContent } from '@/components/home/HomeContent'

// Force dynamic rendering (no static generation during build)
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHeroImages(): Promise<HeroImageConfig> {
  try {
    const config = await prisma.configuracionSitio.findUnique({
      where: { clave: 'hero_images' }
    })

    if (!config) {
      return defaultHeroImages
    }

    return JSON.parse(config.valor) as HeroImageConfig
  } catch (error) {
    console.error('Error cargando imágenes del hero:', error)
    return defaultHeroImages
  }
}

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
  const [projectsByCategory, heroImages] = await Promise.all([
    getProjectsByCategory(),
    getHeroImages()
  ])

  return (
    <HomeContent
      projectsByCategory={projectsByCategory}
      heroImages={heroImages}
    />
  )
}
