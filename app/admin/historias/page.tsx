import { prisma } from '@/lib/prisma'
import HistoriasAdminClient from './HistoriasAdminClient'

export const dynamic = 'force-dynamic'

export default async function HistoriasAdminPage() {
  // SSR: fetchear data inicial para eliminar el skeleton "Cargando..."
  const [historias, proyectosSinHistoria] = await Promise.all([
    prisma.historiaProyecto.findMany({
      include: {
        proyecto: {
          select: { titulo: true, cliente: true, categoria: true, slug: true },
        },
      },
      orderBy: { fechaActualizacion: 'desc' },
    }),
    prisma.proyecto.findMany({
      where: { historia: null, visible: true },
      select: {
        id: true,
        titulo: true,
        cliente: true,
        categoria: true,
        slug: true,
        destacado: true,
        fechaInicio: true,
      },
      orderBy: [{ destacado: 'desc' }, { fechaInicio: 'desc' }],
    }),
  ])

  return (
    <HistoriasAdminClient
      initialHistorias={JSON.parse(JSON.stringify(historias))}
      initialProyectosSinHistoria={JSON.parse(JSON.stringify(proyectosSinHistoria))}
    />
  )
}
