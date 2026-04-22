import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CategoriaDetailEditor } from "@/components/admin/categories/CategoriaDetailEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CategoriaEditarPage({ params }: { params: { id: string } }) {
  const categoria = await prisma.categoriaProyecto.findUnique({ where: { id: params.id } })
  if (!categoria) notFound()
  return <CategoriaDetailEditor categoria={categoria} />
}
