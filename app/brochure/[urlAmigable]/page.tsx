import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PdfViewerClient } from "@/components/brochure/PdfViewerClient"

interface PageProps {
  params: { urlAmigable: string }
}

async function getBrochure(urlAmigable: string) {
  return prisma.brochure.findUnique({
    where: { urlAmigable },
    select: {
      titulo: true,
      descripcion: true,
      pdfUrl: true,
      publicado: true,
      activo: true,
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brochure = await getBrochure(params.urlAmigable)
  if (!brochure || !brochure.publicado || !brochure.activo) {
    return { title: "Brochure no disponible — MEISA" }
  }
  return {
    title: `${brochure.titulo} — MEISA`,
    description: brochure.descripcion ?? undefined,
    openGraph: {
      title: brochure.titulo,
      description: brochure.descripcion ?? undefined,
    },
  }
}

export const revalidate = 60

export default async function BrochurePage({ params }: PageProps) {
  const brochure = await getBrochure(params.urlAmigable)

  if (!brochure || !brochure.publicado || !brochure.activo || !brochure.pdfUrl) {
    notFound()
  }

  return (
    <PdfViewerClient
      pdfUrl={`/api/documento/brochure/${params.urlAmigable}`}
      titulo={brochure.titulo}
    />
  )
}
