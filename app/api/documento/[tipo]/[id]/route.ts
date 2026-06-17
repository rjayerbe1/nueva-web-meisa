import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Solo se permite proxear archivos del almacenamiento propio (GCS público).
const ALLOWED_HOST = "storage.googleapis.com"

/**
 * Resuelve la URL real del PDF a partir del tipo + id del registro.
 * La URL de almacenamiento nunca se expone al cliente: el navegador solo ve
 * /api/documento/<tipo>/<id> en nuestro dominio.
 */
async function resolvePdfUrl(tipo: string, id: string): Promise<string | null> {
  if (tipo === "politica") {
    const p = await prisma.politica.findFirst({
      where: { id, activo: true },
      select: { documentoUrl: true },
    })
    return p?.documentoUrl ?? null
  }
  if (tipo === "gobierno") {
    const g = await prisma.gobiernoItem.findFirst({
      where: { id, activo: true },
      select: { documentoUrl: true },
    })
    return g?.documentoUrl ?? null
  }
  if (tipo === "brochure") {
    // Para brochures el id es el urlAmigable (slug)
    const b = await prisma.brochure.findUnique({
      where: { urlAmigable: id },
      select: { pdfUrl: true, publicado: true, activo: true },
    })
    if (!b || !b.publicado || !b.activo) return null
    return b.pdfUrl ?? null
  }
  return null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { tipo: string; id: string } },
) {
  const { tipo, id } = params

  const target = await resolvePdfUrl(tipo, id)
  if (!target) {
    return new Response("Documento no encontrado", { status: 404 })
  }

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return new Response("URL inválida", { status: 400 })
  }
  // Anti-SSRF: solo HTTPS y solo nuestro bucket público.
  if (url.protocol !== "https:" || url.hostname !== ALLOWED_HOST) {
    return new Response("Origen no permitido", { status: 403 })
  }

  const upstream = await fetch(url.toString(), { cache: "no-store" })
  if (!upstream.ok) {
    return new Response("Documento no disponible", { status: 502 })
  }

  // Bufferizamos el PDF completo en el servidor en lugar de hacer streaming:
  // así devolvemos una respuesta completa con Content-Length y sin anunciar
  // soporte de rangos, de modo que el visor (pdf.js) lo descarga en una sola
  // petición y se evitan abortos/reintentos parciales.
  const buffer = Buffer.from(await upstream.arrayBuffer())

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buffer.byteLength),
      // inline = se muestra en el visor; nombre genérico (oculta versión/archivo real)
      "Content-Disposition": 'inline; filename="documento.pdf"',
      // sin rangos: pdf.js hace una única descarga completa
      "Accept-Ranges": "none",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
