import { prisma } from "@/lib/prisma"
import { ServicesAdminTabs } from "@/components/admin/services/ServicesAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ServicesAdminPage() {
  const [servicios, procesoFases, paginaConfig] = await Promise.all([
    prisma.servicio.findMany({ orderBy: { orden: "asc" } }),
    prisma.procesoFase.findMany({ orderBy: { numero: "asc" } }),
    prisma.serviciosPagina.findUnique({ where: { id: "default" } }),
  ])
  return (
    <ServicesAdminTabs
      servicios={servicios}
      procesoFases={procesoFases}
      paginaConfig={paginaConfig}
    />
  )
}
