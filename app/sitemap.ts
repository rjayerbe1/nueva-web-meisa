import { MetadataRoute } from 'next'
import { getCatalogo, getSitio, ordenar } from '@/lib/content/snapshot'
// DB-first: incluye landings agregadas desde /admin/landings (con fallback
// interno a los configs en código si la DB no responde).
import { getSolucionSlugsDb, getCiudadSlugsDb } from '@/lib/content/landings'

const BASE_URL = 'https://meisa.com.co'

// Los rastreadores piden /sitemap.xml a diario; sin esto cada petición
// disparaba ~7 consultas a Neon. Se regenera como mucho una vez por hora.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solucionSlugs, ciudadSlugs] = await Promise.all([
    getSolucionSlugsDb(),
    getCiudadSlugsDb(),
  ])

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
    // Página pilar del clúster SEO (keyword nacional)
    {
      url: `${BASE_URL}/estructuras-metalicas-colombia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Landings SEO de soluciones
    ...solucionSlugs.map((slug) => ({
      url: `${BASE_URL}/soluciones/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    // Guías técnicas SEO
    {
      url: `${BASE_URL}/precios-estructuras-metalicas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/estructura-metalica-vs-concreto`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tipos-de-estructuras-metalicas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/peso-estructura-metalica-por-m2`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/granallado-y-pintura-estructuras-metalicas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/precio-cubierta-metalica-por-m2`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/como-se-construye-un-puente-metalico`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/como-elegir-empresa-de-estructuras-metalicas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Landings locales por ciudad (DB-first: incluye las agregadas del admin)
    ...ciudadSlugs.map((slug) => ({
      url: `${BASE_URL}/estructuras-metalicas/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  // Obtener proyectos de la base de datos
  let projectPages: MetadataRoute.Sitemap = []
  try {
    const proyectos = ordenar((await getCatalogo()).proyectos, [(p) => p.updatedAt, 'desc'])

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
    const servicios = (await getCatalogo()).servicios.filter((s) => s.activo)

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
    const categorias = (await getCatalogo()).categorias.filter((c) => c.visible)

    categoryPages = categorias.map((categoria) => ({
      url: `${BASE_URL}/proyectos/categoria/${categoria.slug}`,
      lastModified: categoria.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  // Obras (landings editoriales /obras/[slug])
  let obraPages: MetadataRoute.Sitemap = []
  try {
    const obras = (await getCatalogo()).obras.filter((o) => o.activa)

    obraPages = obras.map((obra) => ({
      url: `${BASE_URL}/obras/${obra.slug}`,
      lastModified: obra.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching obras for sitemap:', error)
  }

  // Vacantes (/trabaja-con-nosotros) — SOLO si la página pública está encendida
  // (ConfiguracionTalento.paginaPublicaActiva). Apagada = fuera del sitemap.
  let talentoPages: MetadataRoute.Sitemap = []
  try {
    const { talento: configTalento, vacantesAbiertas: vacantes } = await getSitio()
    if (configTalento?.paginaPublicaActiva) {
      talentoPages = [
        {
          url: `${BASE_URL}/trabaja-con-nosotros`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        },
        ...vacantes.map((v) => ({
          url: `${BASE_URL}/trabaja-con-nosotros/${v.slug}`,
          lastModified: v.updatedAt,
          changeFrequency: 'daily' as const,
          priority: 0.7,
        })),
      ]
    }
  } catch (error) {
    console.error('Error fetching vacantes for sitemap:', error)
  }

  return [
    ...staticPages,
    ...servicePages,
    ...categoryPages,
    ...projectPages,
    ...obraPages,
    ...talentoPages,
  ]
}
