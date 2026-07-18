import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { uploadCv } from "@/lib/talento/gcs-hv"

const MAX_SIZE_BYTES = 10 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"])

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/octet-stream",
])

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "El archivo supera 10 MB" }, { status: 400 })
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME.has(file.type || "application/octet-stream")) {
      return NextResponse.json(
        { error: "Formato no permitido (PDF, Word o imagen)" },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadCv(buffer, file.name, file.type || "application/pdf")
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
