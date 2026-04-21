import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"
import { isDescendant, isValidPath } from "@/lib/media/folder-path"
import { ensureFolderPath } from "@/lib/media/folder-repo"

export const runtime = "nodejs"

function pathFromSegments(segments: string[]): string {
  return segments.map((s) => decodeURIComponent(s)).join("/")
}

const renameSchema = z.object({
  newPath: z.string().min(1),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    await requireAdmin()
    const oldPath = pathFromSegments(params.path)
    const body = await req.json()
    const { newPath } = renameSchema.parse(body)

    if (!isValidPath(oldPath) || !isValidPath(newPath)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 400 })
    }
    if (oldPath === newPath) {
      return NextResponse.json({ ok: true, renamed: 0 })
    }
    if (isDescendant(newPath, oldPath) || newPath === oldPath) {
      return NextResponse.json(
        { error: "No puedes renombrar una carpeta adentro de sí misma." },
        { status: 400 },
      )
    }

    // Rename this folder + all descendants in Media and MediaFolder.
    // pathGcs queda congelado intencionalmente; el link url → folder no se
    // rompe porque ambos se leen por la columna `folder` de la DB.
    const result = await prisma.$transaction(async (tx) => {
      const mediaRows = await tx.media.findMany({
        where: {
          OR: [{ folder: oldPath }, { folder: { startsWith: oldPath + "/" } }],
        },
        select: { id: true, folder: true },
      })
      for (const row of mediaRows) {
        const next = row.folder === oldPath ? newPath : newPath + row.folder.slice(oldPath.length)
        await tx.media.update({ where: { id: row.id }, data: { folder: next } })
      }

      const folderRows = await tx.mediaFolder.findMany({
        where: {
          OR: [{ path: oldPath }, { path: { startsWith: oldPath + "/" } }],
        },
        select: { id: true, path: true },
      })
      for (const row of folderRows) {
        const next = row.path === oldPath ? newPath : newPath + row.path.slice(oldPath.length)
        // Si el destino ya existe (merge), borramos el origen.
        const clash = await tx.mediaFolder.findUnique({ where: { path: next } })
        if (clash && clash.id !== row.id) {
          await tx.mediaFolder.delete({ where: { id: row.id } })
        } else {
          await tx.mediaFolder.update({ where: { id: row.id }, data: { path: next } })
        }
      }

      return { mediaUpdated: mediaRows.length, foldersUpdated: folderRows.length }
    })

    // Garantiza que ancestros del nuevo path existen
    await ensureFolderPath(newPath)

    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", issues: e.issues }, { status: 400 })
    }
    return apiErrorResponse(e)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    await requireAdmin()
    const path = pathFromSegments(params.path)
    if (!isValidPath(path)) {
      return NextResponse.json({ error: "Ruta inválida" }, { status: 400 })
    }

    const [mediaCount, subfolderCount] = await Promise.all([
      prisma.media.count({
        where: { OR: [{ folder: path }, { folder: { startsWith: path + "/" } }] },
      }),
      prisma.mediaFolder.count({
        where: { path: { startsWith: path + "/" } },
      }),
    ])

    if (mediaCount > 0) {
      return NextResponse.json(
        { error: `La carpeta tiene ${mediaCount} archivo(s). Muévelos o elimínalos primero.` },
        { status: 400 },
      )
    }
    if (subfolderCount > 0) {
      return NextResponse.json(
        { error: `La carpeta tiene ${subfolderCount} subcarpeta(s). Elimínalas primero.` },
        { status: 400 },
      )
    }

    await prisma.mediaFolder.deleteMany({ where: { path } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return apiErrorResponse(e)
  }
}
