import { MediaManager } from "@/components/admin/media/MediaManager"
import { prisma } from "@/lib/prisma"
import { getAllFolderPaths, getFolderCounts } from "@/lib/media/folder-repo"

export const dynamic = "force-dynamic"

export default async function MediaLibraryPage() {
  // Fetch inicial en SSR: primera página de items (sin filtros) + estructura de folders.
  // Esto elimina el skeleton "Cargando..." del primer render.
  const [items, paths, counts] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 120,
    }),
    getAllFolderPaths(),
    getFolderCounts(),
  ])

  return (
    <MediaManager
      initialItems={JSON.parse(JSON.stringify(items))}
      initialFolderData={{ paths, counts }}
    />
  )
}
