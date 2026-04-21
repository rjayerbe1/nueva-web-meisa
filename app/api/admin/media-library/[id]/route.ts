import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { deleteFromGcs } from "@/lib/media/gcs"

const patchSchema = z
  .object({
    altText: z.string().nullable(),
    title: z.string().nullable(),
    folder: z.string().min(1),
    tags: z.array(z.string()),
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
    const updated = await prisma.media.update({ where: { id: params.id }, data })
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
