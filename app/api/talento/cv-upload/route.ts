import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadCv } from "@/lib/talento/gcs-hv"

// Subida PÚBLICA de hoja de vida (formulario /trabaja-con-nosotros).
// Gated por el switch: si la página pública está apagada, este endpoint
// también lo está — no hay superficie de abuso mientras el módulo es interno.

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"])
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
])

export async function POST(request: NextRequest) {
  try {
    const config = await prisma.configuracionTalento.findUnique({ where: { id: "default" } })
    if (!config?.paginaPublicaActiva) {
      return NextResponse.json({ error: "No disponible" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "El archivo supera 5 MB" }, { status: 400 })
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME.has(file.type || "application/octet-stream")) {
      return NextResponse.json({ error: "Solo PDF o Word" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadCv(buffer, file.name, file.type || "application/pdf")
    return NextResponse.json(
      { pathGcs: result.pathGcs, fileName: result.fileName, contentType: result.contentType, size: result.size },
      { status: 201 },
    )
  } catch (e) {
    console.error("[talento] cv-upload público:", e)
    return NextResponse.json({ error: "Error subiendo el archivo" }, { status: 500 })
  }
}
