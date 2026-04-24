import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectDetailClient from './ProjectDetailClient'

// NOTA: generateMetadata + JSON-LD viven en layout.tsx (ya es robusto).
export const revalidate = 60

export default async function ProyectoDetallePage({
  params,
}: {
  params: { slug: string }
}) {
  const proyecto = await prisma.proyecto.findFirst({
    where: {
      slug: params.slug,
      visible: true,
    },
    include: {
      imagenes: { orderBy: { orden: 'asc' } },
      historia: { where: { activo: true } },
    },
  })

  if (!proyecto) notFound()

  // Proyectos relacionados: misma categoría, excluir actual, top 3 destacados + recientes
  const relacionados = await prisma.proyecto.findMany({
    where: {
      categoria: proyecto.categoria,
      visible: true,
      id: { not: proyecto.id },
    },
    select: {
      id: true,
      titulo: true,
      slug: true,
      ubicacion: true,
      toneladas: true,
      imagenes: {
        orderBy: { orden: 'asc' },
        take: 1,
        select: { url: true, urlOptimized: true, alt: true },
      },
    },
    orderBy: [{ destacado: 'desc' }, { fechaInicio: 'desc' }],
    take: 3,
  })

  // Cover de la categoría como fallback del hero si el proyecto no tiene imágenes
  const categoria = await prisma.categoriaProyecto.findFirst({
    where: { key: proyecto.categoria as any },
    select: { slug: true, nombre: true, imagenCover: true },
  })

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
