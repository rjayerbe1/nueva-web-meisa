import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectDetailClient from './ProjectDetailClient'

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

  // Serializar Date → string para pasar al client component
  const proyectoSerialized = JSON.parse(JSON.stringify(proyecto))

  return <ProjectDetailClient proyecto={proyectoSerialized} />
}
