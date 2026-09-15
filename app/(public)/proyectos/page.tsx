import { Metadata } from "next"
import { getCatalogo } from "@/lib/content/snapshot"
import ProjectsPageClient from "./ProjectsPageClient"
import { BreadcrumbSchema } from "@/components/seo/JsonLdSchema"
import { getCategoriasPublicas } from "@/lib/content/categorias"
import { getWhatsappComercial } from "@/lib/content/whatsapp"

// ISR: sirve desde caché 60s, regenera en background
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Proyectos de Estructuras Metálicas | MEISA' },
  description:
    'Portafolio de MEISA: puentes vehiculares y peatonales, centros comerciales, edificios, naves industriales y estadios en estructura metálica en Colombia.',
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
        url: 'https://storage.googleapis.com/meisa-imagenes/site/og-proyectos.jpg',
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
  // Catálogo: visibles, orden createdAt desc. Misma proyección que antes
  // (no pasar al cliente campos internos del proyecto).
  return (await getCatalogo()).proyectos.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    descripcion: p.descripcion,
    categoria: p.categoria,
    estado: p.estado,
    cliente: p.cliente,
    ubicacion: p.ubicacion,
    fechaInicio: p.fechaInicio,
    presupuesto: p.presupuesto,
    slug: p.slug,
    destacado: p.destacado,
  }))
}

export default async function ProyectosPage() {
  const [proyectos, categorias, whatsapp] = await Promise.all([
    getProyectos(),
    getCategoriasPublicas(),
    getWhatsappComercial(),
  ])

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: 'https://meisa.com.co' },
          { name: 'Proyectos', url: 'https://meisa.com.co/proyectos' },
        ]}
      />
      <ProjectsPageClient proyectos={proyectos} categorias={categorias} whatsapp={whatsapp?.digits ?? null} />
    </>
  )
}
