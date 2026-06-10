import { prisma } from "@/lib/prisma"
import { EmpresaAdminTabs } from "@/components/admin/empresa/EmpresaAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EmpresaAdminPage() {
  const [config, valores, hitos, certificaciones, normas, plantas, gobierno] = await Promise.all([
    prisma.configuracionEmpresa.findUnique({ where: { id: "default" } }),
    prisma.companyValue.findMany({ orderBy: { orden: "asc" } }),
    prisma.timelineHito.findMany({ orderBy: { orden: "asc" } }),
    prisma.certificacion.findMany({ orderBy: { orden: "asc" } }),
    prisma.norma.findMany({ orderBy: { orden: "asc" } }),
    prisma.plant.findMany({ orderBy: { orden: "asc" } }),
    prisma.gobiernoItem.findMany({ orderBy: { orden: "asc" } }),
  ])

  return (
    <EmpresaAdminTabs
      config={config}
      valores={valores}
      hitos={hitos}
      certificaciones={certificaciones}
      normas={normas}
      plantas={plantas}
      gobierno={gobierno}
    />
  )
}
