import { prisma } from "@/lib/prisma"
import { DocumentosInstitucionalesEditor } from "@/components/admin/DocumentosInstitucionalesEditor"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SLUGS = {
  politica: "politica-de-datos",
  sagrilaft: "sagrilaft",
} as const

export default async function DocumentosInstitucionalesPage() {
  const rows = await prisma.brochure.findMany({
    where: { urlAmigable: { in: Object.values(SLUGS) } },
    select: {
      urlAmigable: true,
      titulo: true,
      descripcion: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
    },
  })

  const pickFields = (slug: string) => {
    const row = rows.find((r) => r.urlAmigable === slug)
    if (!row) return null
    const { urlAmigable: _slug, ...rest } = row
    return rest
  }

  return (
    <DocumentosInstitucionalesEditor
      politica={pickFields(SLUGS.politica)}
      sagrilaft={pickFields(SLUGS.sagrilaft)}
    />
  )
}
