import { notFound } from 'next/navigation'
import { getCatalogo, imagenesTop, ordenar } from '@/lib/content/snapshot'
import ProjectDetailClient from './ProjectDetailClient'

// NOTA: generateMetadata + JSON-LD viven en layout.tsx (ya es robusto).
export const revalidate = 3600

// Sin generateStaticParams, Next 14 trata una ruta con segmento dinámico como
// 100 % dinámica y `revalidate` no aplica (cada visita renderiza y consulta
// Neon). Con la función presente —aunque no pre-renderice nada en el build—
// cada slug se genera bajo demanda en la primera visita y queda en caché
// (ISR) durante `revalidate`.
export async function generateStaticParams() {
  return []
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: { slug: string }
}) {
  // Todo sale del catálogo público cacheado (lib/content/snapshot.ts): la
  // regeneración de las 264 páginas de proyecto no consulta la base.
  const catalogo = await getCatalogo()
  const base = catalogo.proyectos.find((p) => p.slug === params.slug)

  if (!base) notFound()

  // Obra (solo si está activa) con sus proyectos visibles, orden fechaFin asc.
  const obraRow = base.obraId ? catalogo.obras.find((o) => o.id === base.obraId && o.activa) : undefined
  const obra = obraRow
    ? {
        ...obraRow,
        proyectos: ordenar(
          catalogo.proyectos.filter((p) => p.obraId === obraRow.id),
          [(p) => p.fechaFin, 'asc'],
        ).map((p) => ({
          id: p.id,
          slug: p.slug,
          titulo: p.titulo,
          fechaFin: p.fechaFin,
          toneladas: p.toneladas,
          areaTotal: p.areaTotal,
          ubicacion: p.ubicacion,
          imagenes: imagenesTop(p),
        })),
      }
    : null
  const proyecto = { ...base, obra }

  // Proyectos relacionados: misma categoría, excluir actual, top 3 destacados + recientes
  const relacionados = ordenar(
    catalogo.proyectos.filter((p) => p.categoria === base.categoria && p.id !== base.id),
    [(p) => p.destacado, 'desc'],
    [(p) => p.fechaInicio, 'desc'],
  )
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      titulo: p.titulo,
      slug: p.slug,
      ubicacion: p.ubicacion,
      toneladas: p.toneladas,
      imagenes: imagenesTop(p),
    }))

  // Cover de la categoría como fallback del hero si el proyecto no tiene imágenes
  const cat = catalogo.categorias.find((c) => c.key === base.categoria)
  const categoria = cat ? { slug: cat.slug, nombre: cat.nombre, imagenCover: cat.imagenCover } : null

  // Serializar Date/Decimal → string/number para pasar al client component
  const proyectoSerialized = JSON.parse(JSON.stringify(proyecto))
  const relacionadosSerialized = JSON.parse(JSON.stringify(relacionados))

  return (
    <ProjectDetailClient
      proyecto={proyectoSerialized}
      relacionados={relacionadosSerialized}
      categoria={categoria}
    />
  )
}
