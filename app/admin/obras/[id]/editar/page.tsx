import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ObraDetailEditor } from "@/components/admin/obras/ObraDetailEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ObraEditarPage({
  params,
}: {
  params: { id: string }
}) {
  const obra = await prisma.obra.findUnique({ where: { id: params.id } })
  if (!obra) notFound()
  return <ObraDetailEditor obra={obra} />
}
