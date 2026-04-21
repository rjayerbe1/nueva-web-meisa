import { prisma } from "@/lib/prisma"
import { PoliticasAdminTabs } from "@/components/admin/politicas/PoliticasAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PoliticasAdminPage() {
  const [politicas, pilares, normas, gruposCalidad] = await Promise.all([
    prisma.politica.findMany({ orderBy: { orden: "asc" } }),
    prisma.pilarSIG.findMany({ orderBy: { orden: "asc" } }),
    prisma.norma.findMany({ orderBy: { orden: "asc" } }),
    prisma.grupoSeccion.findMany({
      where: { pagina: "calidad" },
      orderBy: { orden: "asc" },
    }),
  ])

  return (
    <PoliticasAdminTabs
      politicas={politicas}
      pilares={pilares}
      normas={normas}
      gruposCalidad={gruposCalidad}
    />
  )
}
