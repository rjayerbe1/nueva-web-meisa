import { prisma } from "@/lib/prisma"
import { ProcesosTecnologiasAdminTabs } from "@/components/admin/procesos-tecnologias/ProcesosTecnologiasAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProcesosTecnologiasAdminPage() {
  const [grupos, tecnologias, equipos, procesos, plantas, fasesFlujo] = await Promise.all([
    prisma.grupoSeccion.findMany({
      where: { pagina: "tecnologia" },
      orderBy: { orden: "asc" },
    }),
    prisma.tecnologia.findMany({ orderBy: { orden: "asc" } }),
    prisma.equipo.findMany({ orderBy: { orden: "asc" } }),
    prisma.procesoDigital.findMany({ orderBy: { orden: "asc" } }),
    prisma.plant.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
    prisma.faseFlujoTecnologia.findMany({ orderBy: { orden: "asc" } }),
  ])

  return (
    <ProcesosTecnologiasAdminTabs
      grupos={grupos}
      tecnologias={tecnologias}
      equipos={equipos}
      procesos={procesos}
      plantas={plantas}
      fasesFlujo={fasesFlujo}
    />
  )
}
