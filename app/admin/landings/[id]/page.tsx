import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LandingEditor } from "@/components/admin/landings/LandingEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LandingEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const landing = await prisma.landingSeo.findUnique({
    where: { id: params.id },
  })
  if (!landing) notFound()

  return (
    <LandingEditor
      landing={{
        id: landing.id,
        slug: landing.slug,
        tipo: landing.tipo,
        titulo: landing.titulo,
        metaTitle: landing.metaTitle,
        metaDescription: landing.metaDescription,
        contenido: (landing.contenido ?? {}) as Record<string, unknown>,
        activa: landing.activa,
        orden: landing.orden,
      }}
    />
  )
}
