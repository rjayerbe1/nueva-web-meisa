import { prisma } from "@/lib/prisma"
import { ObrasAdminList } from "@/components/admin/obras/ObrasAdminList"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ObrasAdminPage() {
  const items = await prisma.obra.findMany({
    orderBy: [{ destacada: "desc" }, { orden: "asc" }, { updatedAt: "desc" }],
    include: {
      _count: { select: { proyectos: true } },
    },
  })
  return <ObrasAdminList items={items} />
}
