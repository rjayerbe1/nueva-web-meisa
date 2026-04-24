import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BreadcrumbSchema, ProjectSchema } from '@/components/seo/JsonLdSchema'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

// Generar metadata dinámica para SEO de proyectos
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { slug },
      select: {
        titulo: true,
        descripcion: true,
        categoria: true,
        cliente: true,
        ubicacion: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        imagenes: {
          where: { tipo: 'PORTADA' },
          take: 1,
          select: { url: true, urlOptimized: true, alt: true },
        },
      },
    })

    if (!proyecto) {
      return {
        title: 'Proyecto no encontrado',
        description: 'El proyecto que buscas no existe o ha sido eliminado.',
      }
    }

    const categoria = await prisma.categoriaProyecto.findUnique({
      where: { key: proyecto.categoria },
      select: { nombre: true },
    })
    const categoriaLabel = categoria?.nombre ?? proyecto.categoria
    const imagen = proyecto.imagenes[0]
    const imageUrl = imagen?.urlOptimized || imagen?.url || 'https://storage.googleapis.com/meisa-imagenes/site/og-image.jpg'

    const title = proyecto.metaTitle || `${proyecto.titulo} - Proyecto ${categoriaLabel}`
    const description =
      proyecto.metaDescription ||
      `${proyecto.descripcion.substring(0, 150)}... Proyecto de estructuras metálicas para ${proyecto.cliente} en ${proyecto.ubicacion}. MEISA Colombia.`

    return {
      title,
      description,
      keywords: [
        proyecto.titulo,
        categoriaLabel,
        'estructuras metálicas',
        proyecto.ubicacion,
        proyecto.cliente,
        'proyecto MEISA',
        'construcción en acero',
        `${categoriaLabel.toLowerCase()} Colombia`,
      ],
      openGraph: {
        title: `${proyecto.titulo} | MEISA Estructuras Metálicas`,
        description,
        url: `https://meisa.com.co/proyectos/detalle/${proyecto.slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: proyecto.titulo,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: proyecto.titulo,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://meisa.com.co/proyectos/detalle/${proyecto.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Proyecto | MEISA',
      description: 'Proyecto de estructuras metálicas de MEISA Colombia.',
    }
  }
}

export default async function ProjectDetailLayout({ children, params }: LayoutProps) {
  const { slug } = await params

  // Obtener datos del proyecto para el schema
  let proyecto = null
  try {
    proyecto = await prisma.proyecto.findUnique({
      where: { slug },
      select: {
        titulo: true,
        descripcion: true,
        cliente: true,
        ubicacion: true,
        slug: true,
        fechaInicio: true,
        imagenes: {
          where: { tipo: 'PORTADA' },
          take: 1,
          select: { url: true, urlOptimized: true },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching project for schema:', error)
  }

  return (
    <>
      {/* Breadcrumb Schema para SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Proyectos', url: 'https://meisa.com.co/proyectos' },
          {
            name: proyecto?.titulo || 'Proyecto',
            url: `https://meisa.com.co/proyectos/detalle/${slug}`,
          },
        ]}
      />

      {/* Project Schema para rich snippets */}
      {proyecto && (
        <ProjectSchema
          name={proyecto.titulo}
          description={proyecto.descripcion}
          url={`https://meisa.com.co/proyectos/detalle/${proyecto.slug}`}
          image={proyecto.imagenes[0]?.urlOptimized || proyecto.imagenes[0]?.url}
          datePublished={proyecto.fechaInicio.toISOString()}
          location={proyecto.ubicacion}
          client={proyecto.cliente}
        />
      )}

      {children}
    </>
  )
}
