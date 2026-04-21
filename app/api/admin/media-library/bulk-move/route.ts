import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { isValidPath } from "@/lib/media/folder-path"
import { ensureFolderPath } from "@/lib/media/folder-repo"

export const runtime = "nodejs"

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  folder: z.string().min(1),
})

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { ids, folder } = schema.parse(body)

    if (!isValidPath(folder)) {
      return NextResponse.json({ error: `Ruta inválida: "${folder}"` }, { status: 400 })
    }

    const result = await prisma.media.updateMany({
      where: { id: { in: ids } },
      data: { folder },
    })
    await ensureFolderPath(folder)

    return NextResponse.json({ ok: true, moved: result.count })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}
