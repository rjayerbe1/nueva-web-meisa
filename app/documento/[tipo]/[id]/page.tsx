import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSitio } from "@/lib/content/snapshot"
import { PdfViewerClient } from "@/components/brochure/PdfViewerClient"

export const dynamic = "force-dynamic"

const TIPOS = ["politica", "gobierno"] as const
type Tipo = (typeof TIPOS)[number]

async function getDoc(
  tipo: string,
  id: string,
): Promise<{ titulo: string; hasPdf: boolean } | null> {
  // Lookup en el snapshot público (solo trae políticas/gobierno activos).
  const sitio = await getSitio()
  if (tipo === "politica") {
    const p = sitio.calidad.politicas.find((x) => x.id === id)
    return p ? { titulo: p.titulo, hasPdf: !!p.documentoUrl } : null
  }
  if (tipo === "gobierno") {
    const g = sitio.empresa.gobierno.find((x) => x.id === id)
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
