import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProjectsPageClient from "./ProjectsPageClient"
import { BreadcrumbSchema } from "@/components/seo/JsonLdSchema"
import { aniosExperiencia } from "@/lib/site-meta"

// Force dynamic rendering (no static generation during build)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Proyectos de Estructuras Metálicas',
  description:
    `Conozca nuestros proyectos de estructuras metálicas en Colombia: puentes vehiculares y peatonales, centros comerciales, edificios, naves industriales, estadios y más. Portafolio de MEISA con +${aniosExperiencia()} años de experiencia.`,
  keywords: [
    'proyectos estructuras metálicas',
    'portafolio construcción acero',
    'puentes metálicos Colombia',
    'centros comerciales estructura metálica',
    'edificios acero Colombia',
    'naves industriales metálicas',
    'obras MEISA',
    'proyectos construcción Colombia',
  ],
  openGraph: {
    title: 'Proyectos de Estructuras Metálicas | MEISA Colombia',
    description:
      'Portafolio de proyectos de MEISA: puentes, edificios, centros comerciales, naves industriales y estructuras especiales en acero.',
    url: 'https://meisa.com.co/proyectos',
    images: [
      {
        url: '/images/og-proyectos.jpg',
        width: 1200,
        height: 630,
        alt: 'Proyectos de Estructuras Metálicas MEISA',
      },
    ],
  },
  alternates: {
    canonical: 'https://meisa.com.co/proyectos',
  },
}

async function getProyectos() {
  return await prisma.proyecto.findMany({
    where: { visible: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estado: true,
      cliente: true,
      ubicacion: true,
      fechaInicio: true,
      presupuesto: true,
      slug: true,
      destacado: true,
    }
  })
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Proyectos', url: 'https://meisa.com.co/proyectos' },
        ]}
      />
      <ProjectsPageClient proyectos={proyectos} />
    </>
  )
}
