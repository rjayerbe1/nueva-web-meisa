import { prisma } from "@/lib/prisma"
import { ancestors, isValidPath, ROOT_FOLDER } from "./folder-path"

/**
 * Asegura que una carpeta y todos sus ancestros existen en `MediaFolder`.
 * Idempotente — no falla si ya existen.
 */
export async function ensureFolderPath(path: string): Promise<void> {
  if (!path || path === ROOT_FOLDER || !isValidPath(path)) return
  const paths = [...ancestors(path), path]
  if (paths.length === 0) return
  await prisma.mediaFolder.createMany({
    data: paths.map((p) => ({ path: p })),
    skipDuplicates: true,
  })
}

/**
 * Obtiene todos los paths de carpetas: unión de `MediaFolder.path` y
 * `DISTINCT Media.folder`. Incluye ancestros derivados de cada path para
 * que el árbol quede cerrado (si existe `a/b/c`, también `a` y `a/b`).
 */
export async function getAllFolderPaths(): Promise<string[]> {
  const [folders, usedRaw] = await Promise.all([
    prisma.mediaFolder.findMany({ select: { path: true } }),
    prisma.media.findMany({ select: { folder: true }, distinct: ["folder"] }),
  ])

  const set = new Set<string>()
  for (const { path } of folders) {
    set.add(path)
    for (const a of ancestors(path)) set.add(a)
  }
  for (const { folder } of usedRaw) {
    if (!folder) continue
    set.add(folder)
    for (const a of ancestors(folder)) set.add(a)
  }
  return Array.from(set).sort()
}

/** Cuenta items por carpeta (folder exacto, no descendientes). */
export async function getFolderCounts(): Promise<Record<string, number>> {
  const rows = await prisma.media.groupBy({
    by: ["folder"],
    _count: { _all: true },
  })
  const out: Record<string, number> = {}
  for (const r of rows) out[r.folder] = r._count._all
  return out
}
