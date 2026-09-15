import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getCatalogo } from "@/lib/content/snapshot"
import { PdfViewerClient } from "@/components/brochure/PdfViewerClient"

const BROCHURE_SLUG = "sagrilaft"

async function getDocumento() {
  const b = (await getCatalogo()).brochures.find((x) => x.urlAmigable === BROCHURE_SLUG)
  return b
    ? { titulo: b.titulo, descripcion: b.descripcion, pdfUrl: b.pdfUrl, publicado: b.publicado, activo: b.activo }
    : null
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDocumento()
  if (!doc || !doc.publicado || !doc.activo) {
    return { title: "Manual SAGRILAFT — MEISA" }
  }
  return {
    title: `${doc.titulo} — MEISA`,
    description: doc.descripcion ?? undefined,
    alternates: { canonical: "/sagrilaft" },
  }
}

export const revalidate = 3600

export default async function SagrilaftPage() {
  const doc = await getDocumento()

  if (!doc || !doc.publicado || !doc.activo || !doc.pdfUrl) {
    notFound()
  }

  return (
    <PdfViewerClient
      pdfUrl={`/api/documento/brochure/${BROCHURE_SLUG}`}
      titulo={doc.titulo}
    />
  )
}
