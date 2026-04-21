import { prisma } from "@/lib/prisma"
import { ServicesAdminTabs } from "@/components/admin/services/ServicesAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ServicesAdminPage() {
  const [servicios, procesoFases] = await Promise.all([
    prisma.servicio.findMany({ orderBy: { orden: "asc" } }),
    prisma.procesoFase.findMany({ orderBy: { numero: "asc" } }),
  ])
  return <ServicesAdminTabs servicios={servicios} procesoFases={procesoFases} />
}
