import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { deleteFromGcs } from "@/lib/media/gcs"
import { isValidPath } from "@/lib/media/folder-path"
import { ensureFolderPath } from "@/lib/media/folder-repo"

const patchSchema = z
  .object({
    altText: z.string().nullable(),
    title: z.string().nullable(),
    folder: z.string().min(1),
    tags: z.array(z.string()),
    proyectoIds: z.array(z.string()),
  })
  .partial()

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const item = await prisma.media.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    return NextResponse.json(item)
  } catch (e) {
    return apiErrorResponse(e)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = patchSchema.parse(body)
    if (data.folder !== undefined && !isValidPath(data.folder)) {
      return NextResponse.json(
        { error: `Ruta de carpeta inválida: "${data.folder}"` },
        { status: 400 },
      )
    }
    const updated = await prisma.media.update({ where: { id: params.id }, data })
    if (data.folder) await ensureFolderPath(data.folder)
    return NextResponse.json(updated)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const item = await prisma.media.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    if (item.pathGcs) {
      await deleteFromGcs(item.pathGcs)
    }
    await prisma.media.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
