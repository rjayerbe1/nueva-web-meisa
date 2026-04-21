import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://meisa.com.co'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/empresa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/trayectoria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/procesos-tecnologias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/calidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Obtener proyectos de la base de datos
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const proyectos = await prisma.proyecto.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })

    projectPages = proyectos.map((proyecto) => ({
      url: `${BASE_URL}/proyectos/detalle/${proyecto.slug}`,
      lastModified: proyecto.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  // Obtener servicios de la base de datos
  let servicePages: MetadataRoute.Sitemap = []
  try {
    const servicios = await prisma.servicio.findMany({
      where: { activo: true },
      select: { slug: true, updatedAt: true },
      orderBy: { orden: 'asc' },
    })

    servicePages = servicios.map((servicio) => ({
      url: `${BASE_URL}/servicios/${servicio.slug}`,
      lastModified: servicio.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching services for sitemap:', error)
  }

  // Obtener categorías de proyectos
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categorias = await prisma.categoriaProyecto.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
      orderBy: { orden: 'asc' },
    })

    categoryPages = categorias.map((categoria) => ({
      url: `${BASE_URL}/proyectos/categoria/${categoria.slug}`,
      lastModified: categoria.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...servicePages, ...categoryPages, ...projectPages]
}
