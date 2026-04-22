import { prisma } from "@/lib/prisma"
import { HistoriasAdminList } from "@/components/admin/historias/HistoriasAdminList"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HistoriasAdminPage() {
  const items = await prisma.historiaProyecto.findMany({
    orderBy: { fechaActualizacion: "desc" },
    include: {
      proyecto: { select: { titulo: true, slug: true, cliente: true } },
    },
  })
  return (
    <HistoriasAdminList
      items={items.map((h) => ({
        id: h.id,
        proyectoId: h.proyectoId,
        activo: h.activo,
        tituloAlternativo: h.tituloAlternativo,
        resumenCorto: h.resumenCorto,
        imagenDestacada: h.imagenDestacada,
        videoUrl: h.videoUrl,
        dificultadTecnica: h.dificultadTecnica,
        innovacionNivel: h.innovacionNivel,
        proyecto: h.proyecto,
      }))}
    />
  )
}
