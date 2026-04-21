import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ServicioDetailEditor } from "@/components/admin/services/ServicioDetailEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ServicioEditarPage({ params }: { params: { id: string } }) {
  const servicio = await prisma.servicio.findUnique({ where: { id: params.id } })
  if (!servicio) notFound()
  return <ServicioDetailEditor servicio={servicio} />
}
