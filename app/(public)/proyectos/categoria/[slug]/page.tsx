import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCatalogo, ordenar } from '@/lib/content/snapshot'
import CategoryPageClient from './CategoryPageClient'

// ISR: sirve desde caché 1 h, regenera en background
export const revalidate = 3600

// Sin generateStaticParams, Next 14 trata una ruta con segmento dinámico como
// 100 % dinámica y `revalidate` no aplica (cada visita renderiza y consulta
// Neon). Con la función presente —aunque no pre-renderice nada en el build—
// cada slug se genera bajo demanda en la primera visita y queda en caché
// (ISR) durante `revalidate`.
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const categoria = (await getCatalogo()).categorias.find((c) => c.slug === params.slug && c.visible)

  if (!categoria) {
    return { title: 'Categoría no encontrada | MEISA' }
  }

  const customTitle = categoria.metaTitle?.trim()
  // Si hay metaTitle custom lo usamos absoluto; si no, el template del layout
  // padre le añade "| MEISA - Estructuras Metálicas Colombia".
  const title = customTitle
    ? { absolute: customTitle }
    : `Proyectos de ${categoria.nombre}`

  const description =
    categoria.metaDescription?.trim() ||
    categoria.descripcion ||
    `Proyectos de ${categoria.nombre.toLowerCase()} desarrollados por MEISA — estructuras metálicas en Colombia desde 1996.`

  const image = categoria.imagenCover || undefined

  const ogTitle = customTitle || `Proyectos de ${categoria.nombre} | MEISA`

  return {
    title,
    description,
    alternates: { canonical: `/proyectos/categoria/${params.slug}` },
    openGraph: {
      title: ogTitle,
      description,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: ogTitle }]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description,
      images: image ? [image] : undefined,
    },
  }
}

async function getCategoria(slug: string) {
  const c = (await getCatalogo()).categorias.find((cat) => cat.slug === slug && cat.visible)
  if (!c) return null
  return {
    id: c.id,
    key: c.key,
    nombre: c.nombre,
    descripcion: c.descripcion,
    slug: c.slug,
    imagenCover: c.imagenCover,
    icono: c.icono,
    color: c.color,
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    estadisticas: c.estadisticas,
    casosExitoIds: c.casosExitoIds,
    especialidades: c.especialidades,
    textosUi: c.textosUi,
  }
}

async function getProyectosByCategoria(key: string) {
  return ordenar(
    (await getCatalogo()).proyectos.filter((p) => p.categoria === key),
    [(p) => p.destacado, 'desc'],
    [(p) => p.fechaInicio, 'desc'],
  ).map((p) => ({ ...p, imagenes: p.imagenes.slice(0, 1) }))
}

async function getBrochureByCategoria(categoriaId: string) {
  const b = (await getCatalogo()).brochures.find(
    (x) => x.categoriaId === categoriaId && x.publicado && x.activo && x.pdfUrl !== null,
  )
  if (!b) return null
  return {
    id: b.id,
    titulo: b.titulo,
    descripcion: b.descripcion,
    urlAmigable: b.urlAmigable,
    pdfUrl: b.pdfUrl,
    publicado: b.publicado,
    activo: b.activo,
  }
}

export default async function CategoriaPage({
  params,
}: {
  params: { slug: string }
}) {
  const categoria = await getCategoria(params.slug)
  if (!categoria) notFound()

  const [proyectos, brochure] = await Promise.all([
    getProyectosByCategoria(categoria.key),
    getBrochureByCategoria(categoria.id),
  ])

  // Serializar Date → string para pasar al client component
  const categoriaSerialized = JSON.parse(JSON.stringify(categoria))
  const proyectosSerialized = JSON.parse(JSON.stringify(proyectos))
  const brochureSerialized = brochure ? JSON.parse(JSON.stringify(brochure)) : null

  return (
    <CategoryPageClient
      categoria={categoriaSerialized}
      proyectos={proyectosSerialized}
      brochure={brochureSerialized}
    />
  )
}
