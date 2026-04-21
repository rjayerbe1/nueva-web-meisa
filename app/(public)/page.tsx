import { prisma } from '@/lib/prisma'
import { HeroImageConfig, defaultHeroImages } from '@/lib/hero-config'
import { getHomeData, resolveStatValue } from '@/lib/content/home'
import { getConfiguracionContacto } from '@/lib/content/servicios-contacto'
import { getConfiguracionEmpresa } from '@/lib/content/empresa'

import { HomeContent } from '@/components/home/HomeContent'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHeroImages(): Promise<HeroImageConfig> {
  try {
    const config = await prisma.configuracionSitio.findUnique({
      where: { clave: 'hero_images' },
    })
    if (!config) return defaultHeroImages
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
    orderBy: { createdAt: 'desc' },
    include: {
      imagenes: { orderBy: { orden: 'asc' } },
    },
  })

  const mappedProjects = projects.map((project) => {
    const imagenPortada =
      project.imagenes.find((img) => img.tipo === 'PORTADA') || project.imagenes[0]

    return {
      id: project.id,
      titulo: project.titulo,
      descripcion: project.descripcion,
      categoria: project.categoria,
      cliente: project.cliente,
      ubicacion: project.ubicacion,
      slug: project.slug,
      imagenPortada: imagenPortada
        ? { url: imagenPortada.url, alt: imagenPortada.alt || project.titulo }
        : undefined,
    }
  })

  const projectsByCategory: Record<string, typeof mappedProjects> = {}
  mappedProjects.forEach((project) => {
    if (!projectsByCategory[project.categoria]) {
      projectsByCategory[project.categoria] = []
    }
    projectsByCategory[project.categoria].push(project)
  })

  return projectsByCategory
}

export default async function HomePage() {
  const [projectsByCategory, heroImages, home, contactoConfig, empresaConfig] =
    await Promise.all([
      getProjectsByCategory(),
      getHeroImages(),
      getHomeData(),
      getConfiguracionContacto(),
      getConfiguracionEmpresa(),
    ])

  const foundingYear = empresaConfig?.fundacion ?? 1996

  // Transforma los stats de DB al formato que espera StatsStrip
  const stats = home.stats.map((s) => ({
    value: resolveStatValue(s, foundingYear),
    suffix: s.valor === 'AUTO' ? '+' : s.valor.match(/^\d+$/) ? '+' : '',
    label: s.label,
  }))

  // Especialidades del hero
  const especialidades = home.especialidades.map((e) => e.label)

  // Proyecto destacado (stats desde Json)
  const featured = home.featured
    ? {
        name: home.featured.nombre,
        location: home.featured.ubicacion,
        image: home.featured.imagen,
        description: home.featured.descripcion,
        eyebrow: home.featured.eyebrowTexto,
        ctaText: home.featured.ctaTexto,
        ctaUrl: home.featured.ctaUrl,
        stats: Array.isArray(home.featured.stats)
          ? ((home.featured.stats as any) as Array<{ value: string; label: string }>)
          : [],
      }
    : null

  // Servicios destacados
  const servicios = home.servicios.map((s) => ({
    id: s.slug,
    nombre: s.nombre,
    subtitulo: s.subtitulo,
    descripcion: s.descripcion,
    video: s.video,
    image: s.imagen,
    color: s.color,
    overlayColor: s.overlayColor,
    overlayOpacity: s.overlayOpacity,
    href: s.hrefAncla || `/servicios#${s.slug}`,
  }))

  // Copy
  const clientesCopy = home.seccionConfig
    ? {
        eyebrow: home.seccionConfig.clientesEyebrow,
        titulo: home.seccionConfig.clientesTitulo,
        descripcion: home.seccionConfig.clientesDescripcion,
        ctaTexto: home.seccionConfig.clientesCtaTexto,
        ctaUrl: home.seccionConfig.clientesCtaUrl,
      }
    : null

  const contactCopy = home.seccionConfig
    ? {
        eyebrow: home.seccionConfig.contactoEyebrow,
        titulo: home.seccionConfig.contactoTitulo,
        descripcion: home.seccionConfig.contactoDescripcion,
        cta1: home.seccionConfig.contactoCta1Texto,
        cta2: home.seccionConfig.contactoCta2Texto,
      }
    : null

  const heroVideos = {
    desktop: home.seccionConfig?.heroVideoDesktop ?? null,
    mobile: home.seccionConfig?.heroVideoMobile ?? null,
  }

  const orden = Array.isArray(home.orden?.orden)
    ? ((home.orden?.orden as any) as Array<{ clave: string; activo: boolean }>)
    : []

  return (
    <HomeContent
      projectsByCategory={projectsByCategory}
      heroImages={heroImages}
      heroVideos={heroVideos}
      especialidades={especialidades}
      stats={stats}
      featured={featured}
      servicios={servicios}
      clientesCopy={clientesCopy}
      contactCopy={contactCopy}
      contactoConfig={contactoConfig}
      orden={orden}
      foundingYear={foundingYear}
    />
  )
}
