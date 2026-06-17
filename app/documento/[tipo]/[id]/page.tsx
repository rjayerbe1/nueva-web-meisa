import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PdfViewerClient } from "@/components/brochure/PdfViewerClient"

export const dynamic = "force-dynamic"

const TIPOS = ["politica", "gobierno"] as const
type Tipo = (typeof TIPOS)[number]

async function getDoc(
  tipo: string,
  id: string,
): Promise<{ titulo: string; hasPdf: boolean } | null> {
  if (tipo === "politica") {
    const p = await prisma.politica.findFirst({
      where: { id, activo: true },
      select: { titulo: true, documentoUrl: true },
    })
    return p ? { titulo: p.titulo, hasPdf: !!p.documentoUrl } : null
  }
  if (tipo === "gobierno") {
    const g = await prisma.gobiernoItem.findFirst({
      where: { id, activo: true },
      select: { titulo: true, documentoUrl: true },
    })
    return g ? { titulo: g.titulo, hasPdf: !!g.documentoUrl } : null
  }
  return null
}

export async function generateMetadata({
  params,
}: {
  params: { tipo: string; id: string }
}): Promise<Metadata> {
  const doc = await getDoc(params.tipo, params.id)
  return {
    title: doc ? `${doc.titulo} — MEISA` : "Documento — MEISA",
    robots: { index: false, follow: false },
  }
}

export default async function DocumentoPage({
  params,
}: {
  params: { tipo: string; id: string }
}) {
  const { tipo, id } = params
  if (!TIPOS.includes(tipo as Tipo)) notFound()

  const doc = await getDoc(tipo, id)
  if (!doc || !doc.hasPdf) notFound()

  return (
    <PdfViewerClient pdfUrl={`/api/documento/${tipo}/${id}`} titulo={doc.titulo} />
  )
}
