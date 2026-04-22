import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { HistoriaDetailEditor } from "@/components/admin/historias/HistoriaDetailEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HistoriaEditarPage({ params }: { params: { id: string } }) {
  const historia = await prisma.historiaProyecto.findUnique({
    where: { id: params.id },
    include: {
      proyecto: { select: { id: true, titulo: true, slug: true, cliente: true } },
    },
  })
  if (!historia) notFound()
  return <HistoriaDetailEditor historia={historia} proyecto={historia.proyecto ?? null} />
}
