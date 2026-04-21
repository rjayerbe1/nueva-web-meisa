import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { isValidPath } from "@/lib/media/folder-path"
import { ensureFolderPath, getAllFolderPaths, getFolderCounts } from "@/lib/media/folder-repo"

export const runtime = "nodejs"

export async function GET() {
  try {
    await requireAdmin()
    const [paths, counts] = await Promise.all([getAllFolderPaths(), getFolderCounts()])
    return NextResponse.json({ paths, counts })
  } catch (e) {
    return apiErrorResponse(e)
  }
}

const createSchema = z.object({
  path: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { path } = createSchema.parse(body)

    if (!isValidPath(path)) {
      return NextResponse.json(
        { error: `Ruta inválida. Usa minúsculas, números, guiones y "/".` },
        { status: 400 },
      )
    }

    await ensureFolderPath(path)
    return NextResponse.json({ ok: true, path }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}
