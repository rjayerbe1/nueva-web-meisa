import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PdfViewerClient } from "@/components/brochure/PdfViewerClient"

const BROCHURE_SLUG = "politica-de-datos"

async function getDocumento() {
  return prisma.brochure.findUnique({
    where: { urlAmigable: BROCHURE_SLUG },
    select: {
      titulo: true,
      descripcion: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
    },
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDocumento()
  if (!doc || !doc.publicado || !doc.activo) {
    return { title: "Política de Tratamiento de Datos — MEISA" }
  }
  return {
    title: `${doc.titulo} — MEISA`,
    description: doc.descripcion ?? undefined,
    alternates: { canonical: "/politica-datos" },
  }
}

export const revalidate = 60

export default async function PoliticaDatosPage() {
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
