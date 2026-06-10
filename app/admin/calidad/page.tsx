import { prisma } from "@/lib/prisma"
import { CalidadAdminTabs } from "@/components/admin/calidad/CalidadAdminTabs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CalidadAdminPage() {
  const [politicas, pilares, normas, gruposCalidad, etapasControl, certificaciones, procesos] =
    await Promise.all([
      prisma.politica.findMany({ orderBy: { orden: "asc" } }),
      prisma.pilarSIG.findMany({ orderBy: { orden: "asc" } }),
      prisma.norma.findMany({ orderBy: { orden: "asc" } }),
      prisma.grupoSeccion.findMany({
        where: { pagina: "calidad" },
        orderBy: { orden: "asc" },
      }),
      prisma.etapaControlCalidad.findMany({ orderBy: { orden: "asc" } }),
      prisma.certificacion.findMany({ orderBy: { orden: "asc" } }),
      prisma.procesoDigital.findMany({ orderBy: { orden: "asc" } }),
    ])

  return (
    <CalidadAdminTabs
      politicas={politicas}
      pilares={pilares}
      normas={normas}
      gruposCalidad={gruposCalidad}
      etapasControl={etapasControl}
      certificaciones={certificaciones}
      procesos={procesos}
    />
  )
}
