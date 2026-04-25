"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  Search,
  Trash2,
  Pencil,
  Loader2,
  Film,
  FileText,
  X,
  Save,
  Copy,
  Check,
  ImageIcon,
  Folder,
  Tag,
  SlidersHorizontal,
  ChevronRight,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media, MediaKind } from "@prisma/client"
import { MediaThumb } from "./MediaThumb"
import { UpscaleButton } from "@/components/admin/UpscaleButton"
import { ImageExpansionEditor } from "@/components/admin/ImageExpansionEditor"
import { ImageInpaintingEditor } from "@/components/admin/ImageInpaintingEditor"
import { Maximize2, Scissors, Sparkles } from "lucide-react"
import { FolderTree } from "./FolderTree"
import { UploadQueue, type UploadItem } from "./UploadQueue"
import {
  buildFolderTree,
  joinPath,
  splitPath,
  normalizeSegment,
  type FolderNode,
  ROOT_FOLDER,
} from "@/lib/media/folder-path"

type KindFilter = "any" | "IMAGE" | "VIDEO" | "DOC"

const KIND_LABEL: Record<KindFilter, string> = {
  any: "Todos",
  IMAGE: "Imágenes",
  VIDEO: "Videos",
  DOC: "Documentos",
}

const ACCEPT_ATTR =
  "image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt"

const MAX_CONCURRENT_UPLOADS = 3

interface EnqueuedUpload extends UploadItem {
  file: File
  targetFolder: string
}

interface FolderApiPayload {
  paths: string[]
  counts: Record<string, number>
}

async function walkEntry(entry: any, basePath: string, out: { file: File; relativePath: string }[]) {
  if (entry.isFile) {
    const file: File = await new Promise((res, rej) => entry.file(res, rej))
    out.push({ file, relativePath: basePath })
    return
  }
  if (entry.isDirectory) {
    const reader = entry.createReader()
    const subDir = basePath ? `${basePath}/${entry.name}` : entry.name
    const readAll = async (): Promise<any[]> => {
      const acc: any[] = []
      while (true) {
        const chunk: any[] = await new Promise((res, rej) => reader.readEntries(res, rej))
        if (chunk.length === 0) break
        acc.push(...chunk)
      }
      return acc
    }
    const children = await readAll()
    for (const child of children) await walkEntry(child, subDir, out)
  }
}

async function itemsFromDataTransfer(dt: DataTransfer): Promise<{ file: File; relativePath: string }[]> {
  const out: { file: File; relativePath: string }[] = []
  const items = Array.from(dt.items ?? [])
  const supportsEntries = items.length > 0 && typeof (items[0] as any).webkitGetAsEntry === "function"
  if (supportsEntries) {
    for (const it of items) {
      const entry = (it as any).webkitGetAsEntry?.()
      if (entry) await walkEntry(entry, "", out)
    }
  } else {
    for (const f of Array.from(dt.files ?? [])) {
      out.push({ file: f, relativePath: "" })
    }
  }
  return out
}

interface MediaManagerProps {
  initialItems?: Media[]
  initialFolderData?: FolderApiPayload
}

export function MediaManager({ initialItems, initialFolderData }: MediaManagerProps = {}) {
  const hasInitialData = initialItems !== undefined
  const [items, setItems] = useState<Media[]>(initialItems ?? [])
  // Si llegaron datos del server, arrancar con loading=false para evitar skeleton inicial
  const [loading, setLoading] = useState(!hasInitialData)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [kind, setKind] = useState<KindFilter>("any")
  const [folder, setFolder] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [editing, setEditing] = useState<Media | null>(null)
  const [lightbox, setLightbox] = useState<Media | null>(null)
  const [folderData, setFolderData] = useState<FolderApiPayload>(
    initialFolderData ?? { paths: [], counts: {} },
  )
  const [uploadQueue, setUploadQueue] = useState<EnqueuedUpload[]>([])
  const [queueOpen, setQueueOpen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileRef = useRef<HTMLInputElement>(null)
  // Skip primer fetch si tenemos initial data (ya son los mismos filtros default)
  const skipInitialFetch = useRef(hasInitialData)

  /* ── Debounce search ── */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  /* ── Fetch list ── */
  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (kind !== "any") params.set("kind", kind)
      if (folder) params.set("folder", folder)
      if (debouncedQuery) params.set("q", debouncedQuery)
      params.set("limit", "120")
      const res = await fetch(`/api/admin/media-library?${params.toString()}`)
      const data = await res.json()
      setItems(data.items ?? [])
    } finally {
      setLoading(false)
    }
  }, [kind, folder, debouncedQuery])

  useEffect(() => {
    // En el primer render, si ya tenemos data del server con los filtros por defecto,
    // evitar el fetch redundante. Después el useEffect refiltra normalmente.
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false
      return
    }
    fetchList()
  }, [fetchList])

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media-library/folders")
      if (res.ok) {
        const data: FolderApiPayload = await res.json()
        setFolderData(data)
      }
    } catch {
      /* noop */
    }
  }, [])

  // Si no llegaron folders iniciales, pedirlos en mount. Si sí, no hace falta.
  useEffect(() => {
    if (initialFolderData) return
    fetchFolders()
  }, [fetchFolders, initialFolderData])

  /* ── Derived: tree + inmediate subfolders + tags ── */
  const folderTree: FolderNode[] = useMemo(
    () => buildFolderTree(folderData.paths, folderData.counts),
    [folderData],
  )

  const subfolders: FolderNode[] = useMemo(() => {
    if (!folder) return folderTree
    const parts = splitPath(folder)
    let cursor = folderTree
    for (const p of parts) {
      const next = cursor.find((n) => n.name === p)
      if (!next) return []
      cursor = next.children
    }
    return cursor
  }, [folder, folderTree])

  const rootCount = useMemo(
    () => Object.values(folderData.counts).reduce((a, b) => a + b, 0),
    [folderData.counts],
  )

  const tags = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) {
      for (const t of it.tags ?? []) map.set(t, (map.get(t) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
  }, [items])

  const filteredItems = useMemo(() => {
    if (!tag) return items
    return items.filter((it) => it.tags?.includes(tag))
  }, [items, tag])

  /* ── Upload queue: procesa hasta MAX_CONCURRENT ── */
  const processQueue = useCallback(async () => {
    setUploadQueue((prev) => {
      const uploading = prev.filter((i) => i.status === "uploading").length
      if (uploading >= MAX_CONCURRENT_UPLOADS) return prev
      const next = [...prev]
      const slots = MAX_CONCURRENT_UPLOADS - uploading
      const toStart = next.filter((i) => i.status === "queued").slice(0, slots)
      for (const job of toStart) {
        job.status = "uploading"
        void runUpload(job)
      }
      return next
    })
  }, [])

  const runUpload = useCallback(async (job: EnqueuedUpload) => {
    try {
      const fd = new FormData()
      fd.append("file", job.file)
      fd.append("folder", job.targetFolder)
      const res = await fetch("/api/admin/media-library", { method: "POST", body: fd })
      if (res.ok) {
        const saved: Media = await res.json()
        setItems((prev) =>
          saved.folder === (folder ?? saved.folder) ? [saved, ...prev] : prev,
        )
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === job.id ? { ...i, status: "done" } : i)),
        )
        // refrescar árbol si apareció carpeta nueva
        if (!folderData.paths.includes(job.targetFolder)) fetchFolders()
      } else {
        const msg = await res.json().catch(() => ({ error: "Error" }))
        setUploadQueue((prev) =>
          prev.map((i) =>
            i.id === job.id ? { ...i, status: "error", error: msg.error ?? "Error" } : i,
          ),
        )
      }
    } catch (e: any) {
      setUploadQueue((prev) =>
        prev.map((i) =>
          i.id === job.id ? { ...i, status: "error", error: e?.message ?? "Error red" } : i,
        ),
      )
    } finally {
      setTimeout(() => void processQueue(), 50)
    }
  }, [folder, folderData.paths, fetchFolders, processQueue])

  const enqueueFiles = useCallback(
    (files: { file: File; relativePath: string }[], baseFolder: string) => {
      const jobs: EnqueuedUpload[] = files.map(({ file, relativePath }) => {
        const relFolder = relativePath
          .split("/")
          .map((s) => normalizeSegment(s))
          .filter(Boolean)
          .join("/")
        const target = joinPath(baseFolder || ROOT_FOLDER, relFolder)
        return {
          id: crypto.randomUUID(),
          name: file.name,
          folder: target,
          size: file.size,
          status: "queued" as const,
          file,
          targetFolder: target,
        }
      })
      if (jobs.length === 0) return
      setUploadQueue((prev) => [...jobs, ...prev])
      setQueueOpen(true)
      setTimeout(() => void processQueue(), 0)
    },
    [processQueue],
  )

  const retryJob = useCallback((id: string) => {
    setUploadQueue((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "queued", error: undefined } : i)),
    )
    setTimeout(() => void processQueue(), 0)
  }, [processQueue])

  const onBrowsePick = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const files = Array.from(list).map((f) => ({ file: f, relativePath: "" }))
    enqueueFiles(files, folder ?? "")
  }

  const del = async (id: string) => {
    if (!confirm("¿Eliminar este medio? Se borrará también del bucket GCS.")) return
    const res = await fetch(`/api/admin/media-library/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it.id !== id))
      setEditing(null)
      setLightbox(null)
    } else {
      alert("Error eliminando")
    }
  }

  /* ── Folder ops ── */
  const createFolder = async (parent: string | null, segment: string) => {
    const path = parent ? joinPath(parent, segment) : segment
    const res = await fetch("/api/admin/media-library/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    })
    if (res.ok) await fetchFolders()
    else {
      const err = await res.json().catch(() => ({}))
      alert(err.error ?? "No se pudo crear la carpeta")
    }
  }

  const renameFolder = async (oldPath: string, newPath: string) => {
    const res = await fetch(
      `/api/admin/media-library/folders/${oldPath
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPath }),
      },
    )
    if (res.ok) {
      if (folder === oldPath) setFolder(newPath)
      else if (folder?.startsWith(oldPath + "/"))
        setFolder(newPath + folder.slice(oldPath.length))
      await Promise.all([fetchFolders(), fetchList()])
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error ?? "No se pudo renombrar")
    }
  }

  const deleteFolder = async (path: string) => {
    if (!confirm(`¿Eliminar la carpeta "${path}"? Debe estar vacía.`)) return
    const res = await fetch(
      `/api/admin/media-library/folders/${path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      { method: "DELETE" },
    )
    if (res.ok) {
      if (folder === path || folder?.startsWith(path + "/")) setFolder(null)
      await fetchFolders()
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error ?? "No se pudo eliminar")
    }
  }

  const moveItems = async (ids: string[], targetFolder: string) => {
    const folderTarget = targetFolder || ROOT_FOLDER
    const res = await fetch("/api/admin/media-library/bulk-move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, folder: folderTarget }),
    })
    if (res.ok) {
      await Promise.all([fetchFolders(), fetchList()])
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error ?? "No se pudo mover")
    }
  }

  const hasFilters = kind !== "any" || folder || tag || debouncedQuery
  const clearFilters = () => {
    setKind("any")
    setFolder(null)
    setTag(null)
    setQuery("")
  }

  /* ── Drag-drop global ── */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    dragCounter.current = 0
    const dropped = await itemsFromDataTransfer(e.dataTransfer)
    enqueueFiles(dropped, folder ?? "")
  }

  return (
    <div
      className="relative space-y-6"
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return
        dragCounter.current += 1
        setIsDragging(true)
      }}
      onDragLeave={() => {
        dragCounter.current = Math.max(0, dragCounter.current - 1)
        if (dragCounter.current === 0) setIsDragging(false)
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) e.preventDefault()
      }}
      onDrop={handleDrop}
    >
      {/* Drop overlay */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-red-600/10 backdrop-blur-sm">
          <div className="border-4 border-dashed border-red-600 bg-white/90 px-10 py-8 text-center shadow-xl">
            <Upload className="mx-auto mb-3 h-10 w-10 text-red-600" />
            <p className="font-bebas text-3xl uppercase tracking-wider text-slate-950">
              Suelta para subir
            </p>
            <p className="font-lato text-sm text-slate-600">
              Archivos o carpetas enteras · preserva la estructura
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Sistema / Medios
          </p>
          <h1 className="font-bebas text-4xl uppercase leading-[0.95] text-slate-950 md:text-5xl">
            Biblioteca de medios
          </h1>
          <p className="mt-2 max-w-2xl font-lato text-sm text-slate-600">
            Repositorio central de imágenes, videos y documentos del sitio. Arrastra archivos o
            carpetas enteras para subirlos.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-none bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
        >
          <Upload className="h-4 w-4" />
          Subir archivos
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            onBrowsePick(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Search */}
          <div>
            <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Nombre, alt, tag…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-none border-slate-300 bg-white pl-9 text-sm focus:border-red-600 focus:ring-red-600/20"
              />
            </div>
          </div>

          {/* Kind */}
          <FilterGroup icon={<SlidersHorizontal className="h-3 w-3" />} label="Tipo">
            {(["any", "IMAGE", "VIDEO", "DOC"] as KindFilter[]).map((k) => (
              <FilterItem
                key={k}
                active={kind === k}
                onClick={() => setKind(k)}
                label={KIND_LABEL[k]}
              />
            ))}
          </FilterGroup>

          {/* Folder tree */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
              <Folder className="h-3 w-3 text-slate-400" />
              Carpetas
            </div>
            <FolderTree
              nodes={folderTree}
              currentPath={folder}
              rootCount={rootCount}
              onNavigate={(p) => setFolder(p)}
              onCreate={createFolder}
              onRename={renameFolder}
              onDelete={deleteFolder}
              onDropItems={moveItems}
            />
          </div>

          {/* Top tags */}
          {tags.length > 0 && (
            <FilterGroup icon={<Tag className="h-3 w-3" />} label="Tags populares">
              <FilterItem active={tag === null} onClick={() => setTag(null)} label="Sin filtro" />
              {tags.map(([name, count]) => (
                <FilterItem
                  key={name}
                  active={tag === name}
                  onClick={() => setTag(name)}
                  label={name}
                  count={count}
                />
              ))}
            </FilterGroup>
          )}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="w-full border border-slate-300 bg-white py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:text-red-600"
            >
              Limpiar filtros
            </button>
          )}
        </aside>

        {/* Grid */}
        <section>
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <Breadcrumb path={folder} onNavigate={(p) => setFolder(p)} />
            <p className="flex-shrink-0 font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "elemento" : "elementos"}
            </p>
          </div>

          {/* Subfolders como tiles */}
          {subfolders.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {subfolders.map((sf) => (
                <FolderTile
                  key={sf.path}
                  node={sf}
                  onOpen={() => setFolder(sf.path)}
                  onDropItems={(ids) => moveItems(ids, sf.path)}
                />
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center text-slate-300">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
              <p className="mb-1 font-bebas text-lg uppercase tracking-wide text-slate-700">
                Sin resultados
              </p>
              <p className="max-w-xs font-lato text-sm text-slate-500">
                Ajusta los filtros, sube un archivo o arrastra una carpeta para empezar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {filteredItems.map((m) => (
                <MediaCard
                  key={m.id}
                  media={m}
                  onOpen={() => setLightbox(m)}
                  onEdit={() => setEditing(m)}
                  onDelete={() => del(m.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {queueOpen && (
        <UploadQueue
          items={uploadQueue}
          onClear={() =>
            setUploadQueue((prev) => prev.filter((i) => i.status === "queued" || i.status === "uploading"))
          }
          onRetry={retryJob}
          onClose={() => setQueueOpen(false)}
        />
      )}

      {editing && (
        <EditDialog
          media={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
            setEditing(null)
          }}
        />
      )}

      {lightbox && (
        <Lightbox
          media={lightbox}
          onClose={() => setLightbox(null)}
          onEdit={() => {
            setEditing(lightbox)
            setLightbox(null)
          }}
          onDelete={() => del(lightbox.id)}
          onUpdate={(updated) => {
            setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
            setLightbox(updated)
          }}
          onAiResult={(newMedia) => {
            setItems((prev) => [newMedia, ...prev])
            setLightbox(newMedia)
          }}
        />
      )}
    </div>
  )
}

/* ─── Breadcrumb ──────────────────────────────────────────────────────── */

function Breadcrumb({
  path,
  onNavigate,
}: {
  path: string | null
  onNavigate: (p: string | null) => void
}) {
  const parts = path ? splitPath(path) : []
  return (
    <nav className="flex flex-wrap items-center gap-1 font-lato text-sm">
      <button
        onClick={() => onNavigate(null)}
        className={cn(
          "flex items-center gap-1 px-1.5 py-0.5 transition-colors",
          !path
            ? "font-semibold text-red-700"
            : "text-slate-500 hover:text-slate-900",
        )}
      >
        <Home className="h-3.5 w-3.5" />
        Todas
      </button>
      {parts.map((seg, i) => {
        const subPath = parts.slice(0, i + 1).join("/")
        const isLast = i === parts.length - 1
        return (
          <span key={subPath} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <button
              onClick={() => onNavigate(subPath)}
              className={cn(
                "px-1.5 py-0.5 transition-colors",
                isLast
                  ? "font-semibold text-red-700"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {seg}
            </button>
          </span>
        )
      })}
    </nav>
  )
}

/* ─── Folder tile (grid de subcarpetas) ───────────────────────────────── */

function FolderTile({
  node,
  onOpen,
  onDropItems,
}: {
  node: FolderNode
  onOpen: () => void
  onDropItems: (ids: string[]) => void
}) {
  const [over, setOver] = useState(false)
  return (
    <button
      onClick={onOpen}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("application/x-media-ids")) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        const raw = e.dataTransfer.getData("application/x-media-ids")
        setOver(false)
        if (!raw) return
        try {
          const ids = JSON.parse(raw) as string[]
          if (Array.isArray(ids) && ids.length > 0) onDropItems(ids)
        } catch {
          /* noop */
        }
      }}
      className={cn(
        "group flex items-center gap-3 border border-slate-200 bg-white px-3 py-3 text-left transition-colors hover:border-red-600",
        over && "border-red-600 bg-red-50",
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600">
        <Folder className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-lato text-sm font-semibold text-slate-900">
          {node.name}
        </p>
        <p className="font-lato text-[11px] text-slate-500">
          {(node.count ?? 0) + countDescendants(node)} elemento(s)
        </p>
      </div>
    </button>
  )
}

function countDescendants(n: FolderNode): number {
  return n.children.reduce((acc, c) => acc + c.count + countDescendants(c), 0)
}

/* ─── Sidebar filter primitives ───────────────────────────────────────── */

function FilterGroup({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function FilterItem({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between px-2.5 py-1.5 font-lato text-sm transition-colors",
        active
          ? "bg-red-50 font-semibold text-red-700"
          : "text-slate-600 hover:bg-stone-100 hover:text-slate-900",
      )}
    >
      <span className="truncate">{label}</span>
      {typeof count === "number" && (
        <span className="ml-2 flex-shrink-0 text-[11px] text-slate-400">{count}</span>
      )}
    </button>
  )
}

/* ─── Media card (masonry item) ───────────────────────────────────────── */

function MediaCard({
  media,
  onOpen,
  onEdit,
  onDelete,
}: {
  media: Media
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(media.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="group relative overflow-hidden rounded-none border border-slate-200 bg-white transition-all hover:border-red-600 hover:shadow-md"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("application/x-media-ids", JSON.stringify([media.id]))
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden"
        aria-label={`Abrir ${media.fileName}`}
      >
        <MediaThumb media={media} />
      </button>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/60 via-black/0 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        <div className="pointer-events-auto flex gap-1">
          <IconButton
            onClick={copy}
            title={copied ? "Copiado" : "Copiar URL"}
            icon={copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          />
          <IconButton onClick={onEdit} title="Editar" icon={<Pencil className="h-3.5 w-3.5" />} />
          <IconButton
            onClick={onDelete}
            title="Eliminar"
            danger
            icon={<Trash2 className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Caption */}
      <div className="px-3 py-2">
        <p className="truncate font-lato text-xs font-semibold text-slate-800">
          {media.title ?? media.fileName}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="rounded-none border border-slate-200 bg-stone-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            {media.folder}
          </span>
          {media.width && media.height && (
            <span className="font-lato text-[10px] text-slate-400">
              {media.width}×{media.height}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function IconButton({
  onClick,
  title,
  icon,
  danger,
}: {
  onClick: () => void
  title: string
  icon: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-none bg-white/95 transition-colors backdrop-blur",
        danger
          ? "text-slate-600 hover:bg-red-600 hover:text-white"
          : "text-slate-700 hover:bg-slate-950 hover:text-white",
      )}
    >
      {icon}
    </button>
  )
}

/* ─── Lightbox (preview dialog) ───────────────────────────────────────── */

function Lightbox({
  media,
  onClose,
  onEdit,
  onDelete,
  onUpdate,
  onAiResult,
}: {
  media: Media
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onUpdate?: (updated: Media) => void
  onAiResult?: (newMedia: Media) => void
}) {
  const [aiMode, setAiMode] = useState<"upscale" | "expand" | "inpaint" | null>(null)

  async function registerAiResult(newUrl: string, tool: string) {
    try {
      const res = await fetch("/api/admin/media-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl,
          folder: media.folder,
          altText: media.altText,
          title: media.title ? `${media.title} (${tool})` : `${media.fileName} (${tool})`,
          tags: Array.from(new Set([...media.tags, `ai:${tool}`])),
        }),
      })
      if (res.ok) {
        const saved: Media = await res.json()
        onAiResult?.(saved)
      }
    } catch {
      /* ignore — tool modal already showed toast */
    } finally {
      setAiMode(null)
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="grid h-[95vh] w-[95vw] max-w-none grid-cols-1 gap-0 overflow-hidden rounded-none border-slate-200 bg-white p-0 shadow-2xl sm:rounded-none md:grid-cols-[1fr_360px]">
        {/* Media */}
        <div className="relative flex items-center justify-center overflow-hidden bg-slate-950">
          {media.kind === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.url}
              alt={media.altText ?? ""}
              className="max-h-full max-w-full object-contain"
            />
          ) : media.kind === "VIDEO" ? (
            <video
              src={media.url}
              controls
              autoPlay
              className="max-h-full max-w-full"
            />
          ) : (
            <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 text-white">
              <FileText className="h-16 w-16" />
              <a
                href={media.url}
                target="_blank"
                rel="noopener"
                className="underline underline-offset-4"
              >
                Abrir documento
              </a>
            </div>
          )}
        </div>

        {/* Metadata panel */}
        <div className="flex flex-col overflow-y-auto border-t border-slate-200 bg-white md:border-l md:border-t-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="mb-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {media.kind}
            </p>
            <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
              {media.title ?? media.fileName}
            </h2>
          </div>

          <div className="flex-1 space-y-4 px-5 py-4 text-sm">
            {/* AI tools — solo para imágenes */}
            {media.kind === "IMAGE" && (
              <div>
                <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Herramientas IA
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <UpscaleButton
                    imageUrl={media.url}
                    onUpscaleComplete={(url) => registerAiResult(url, "upscale")}
                    className="w-full justify-start rounded-none border border-slate-300 bg-white text-slate-700 hover:border-red-600 hover:bg-red-50 hover:text-red-600"
                    variant="outline"
                    size="sm"
                  />
                  <button
                    onClick={() => setAiMode("expand")}
                    className="flex w-full items-center justify-start gap-2 rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Expandir / recortar
                  </button>
                  <button
                    onClick={() => setAiMode("inpaint")}
                    className="flex w-full items-center justify-start gap-2 rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    Quitar / reemplazar objeto
                  </button>
                </div>
              </div>
            )}

            {onUpdate && <ProyectoAssigner media={media} onUpdate={onUpdate} />}

            {media.altText && <Field label="Alt text">{media.altText}</Field>}
            <Field label="Archivo">{media.fileName}</Field>
            <Field label="Carpeta">{media.folder}</Field>
            {media.tags.length > 0 && (
              <Field label="Tags">
                <div className="flex flex-wrap gap-1">
                  {media.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-none border border-slate-200 bg-stone-50 px-2 py-0.5 font-lato text-xs text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Field>
            )}
            {media.width && media.height && (
              <Field label="Dimensiones">
                {media.width} × {media.height} px
              </Field>
            )}
            <Field label="Tamaño">
              {media.size ? `${(media.size / 1024).toFixed(1)} KB` : "—"}
            </Field>
            <Field label="URL">
              <code className="block break-all rounded bg-stone-100 px-2 py-1.5 font-mono text-[11px] text-slate-700">
                {media.url}
              </code>
            </Field>
          </div>

          <div className="flex gap-2 border-t border-slate-200 px-5 py-3">
            <button
              onClick={onEdit}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-none border border-slate-300 bg-white py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </div>
        </div>
      </DialogContent>

      {/* AI editors — full-screen overlays on top del lightbox */}
      {aiMode === "expand" && (
        <ImageExpansionEditor
          imageUrl={media.url}
          onComplete={(url) => registerAiResult(url, "expand")}
          onClose={() => setAiMode(null)}
        />
      )}
      {aiMode === "inpaint" && (
        <ImageInpaintingEditor
          imageUrl={media.url}
          onComplete={(url) => registerAiResult(url, "inpaint")}
          onClose={() => setAiMode(null)}
        />
      )}
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>
      <div className="font-lato text-sm text-slate-800">{children}</div>
    </div>
  )
}

/* ─── ProyectoAssigner (asigna proyectos a un Media desde el lightbox) ── */

interface ProyectoSlim {
  id: string
  titulo: string
  cliente: string | null
  categoria: string
  slug: string
}

function ProyectoAssigner({
  media,
  onUpdate,
}: {
  media: Media
  onUpdate: (updated: Media) => void
}) {
  const [assigned, setAssigned] = useState<ProyectoSlim[]>([])
  const [loadingAssigned, setLoadingAssigned] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProyectoSlim[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ids = media.proyectoIds ?? []

  // Hydrate assigned project metadata when ids change
  useEffect(() => {
    let cancelled = false
    if (ids.length === 0) {
      setAssigned([])
      return
    }
    setLoadingAssigned(true)
    fetch(`/api/admin/projects?slim=1&ids=${ids.join(",")}&limit=200`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ProyectoSlim[]) => {
        if (cancelled) return
        const map = new Map(data.map((p) => [p.id, p]))
        setAssigned(ids.map((id) => map.get(id)).filter(Boolean) as ProyectoSlim[])
      })
      .finally(() => !cancelled && setLoadingAssigned(false))
    return () => {
      cancelled = true
    }
  }, [ids.join(",")]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await fetch(
          `/api/admin/projects?slim=1&q=${encodeURIComponent(q)}&limit=10`,
        )
        if (r.ok) setResults(await r.json())
      } finally {
        setSearching(false)
      }
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  async function patch(newIds: string[]) {
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/media-library/${media.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proyectoIds: newIds }),
      })
      if (r.ok) {
        const updated: Media = await r.json()
        onUpdate(updated)
      }
    } finally {
      setSaving(false)
    }
  }

  function add(p: ProyectoSlim) {
    if (ids.includes(p.id)) return
    void patch([...ids, p.id])
    setQuery("")
    setResults([])
    setShowSearch(false)
  }

  function remove(id: string) {
    void patch(ids.filter((x) => x !== id))
  }

  function openSearch() {
    setShowSearch(true)
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  return (
    <div>
      <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
        Proyectos asignados {saving && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {assigned.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 rounded-none border border-red-200 bg-red-50 py-0.5 pl-2 pr-1 font-lato text-xs text-red-900"
            title={p.cliente ?? undefined}
          >
            <a
              href={`/admin/projects/${p.id}`}
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              {p.titulo}
            </a>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="rounded-none p-0.5 text-red-600 hover:bg-red-200 hover:text-red-900"
              aria-label="Quitar"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {loadingAssigned && ids.length > 0 && assigned.length === 0 && (
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        )}
        {!showSearch && (
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1 rounded-none border border-dashed border-slate-300 bg-white px-2 py-0.5 font-lato text-xs text-slate-600 hover:border-red-600 hover:text-red-600"
          >
            + Asignar proyecto
          </button>
        )}
      </div>

      {showSearch && (
        <div className="relative mt-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, cliente o código…"
            className="w-full rounded-none border border-slate-300 bg-white px-2.5 py-1.5 font-lato text-sm text-slate-800 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            onBlur={() => {
              blurTimer.current = setTimeout(() => {
                setShowSearch(false)
                setQuery("")
                setResults([])
              }, 150)
            }}
            onFocus={() => {
              if (blurTimer.current) clearTimeout(blurTimer.current)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowSearch(false)
                setQuery("")
                setResults([])
              }
            }}
          />
          {(searching || results.length > 0) && (
            <div className="absolute z-10 mt-1 w-full max-h-72 overflow-y-auto rounded-none border border-slate-200 bg-white shadow-lg">
              {searching && results.length === 0 && (
                <div className="px-3 py-2 font-lato text-xs text-slate-400">Buscando…</div>
              )}
              {results.map((p) => {
                const already = ids.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={already}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      if (blurTimer.current) clearTimeout(blurTimer.current)
                      if (!already) add(p)
                    }}
                    className={cn(
                      "flex w-full items-start gap-2 border-b border-slate-100 px-3 py-2 text-left last:border-b-0",
                      already
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-red-50 hover:text-red-900",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-lato text-sm font-semibold text-slate-900">
                        {p.titulo}
                      </div>
                      <div className="truncate font-lato text-[11px] text-slate-500">
                        {p.cliente ?? "(sin cliente)"} · {p.categoria}
                      </div>
                    </div>
                    {already && (
                      <span className="font-lato text-[10px] uppercase text-slate-400">
                        Asignado
                      </span>
                    )}
                  </button>
                )
              })}
              {!searching && query.trim().length >= 2 && results.length === 0 && (
                <div className="px-3 py-2 font-lato text-xs text-slate-400">
                  Sin resultados para "{query}"
                </div>
              )}
              {query.trim().length < 2 && (
                <div className="px-3 py-2 font-lato text-xs text-slate-400">
                  Escribe 2 o más caracteres para buscar
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Edit dialog ─────────────────────────────────────────────────────── */

function EditDialog({
  media,
  onClose,
  onSaved,
}: {
  media: Media
  onClose: () => void
  onSaved: (m: Media) => void
}) {
  const [form, setForm] = useState({
    title: media.title ?? "",
    altText: media.altText ?? "",
    folder: media.folder,
    tags: media.tags.join(", "),
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/media-library/${media.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || null,
          altText: form.altText || null,
          folder: form.folder,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })
      if (res.ok) onSaved(await res.json())
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    "w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl uppercase">Editar medio</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-slate-100">
            {media.kind === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.url}
                alt={media.altText ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <Film className="h-10 w-10" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <FieldWithLabel label="Título">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={media.fileName}
                className={inputCls}
              />
            </FieldWithLabel>
            <FieldWithLabel label="Texto alternativo (alt)">
              <Textarea
                value={form.altText}
                onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
                rows={2}
                className={cn(inputCls, "resize-y leading-relaxed")}
              />
            </FieldWithLabel>
            <div className="grid grid-cols-2 gap-3">
              <FieldWithLabel label="Carpeta">
                <input
                  value={form.folder}
                  onChange={(e) => setForm((f) => ({ ...f, folder: e.target.value }))}
                  className={inputCls}
                />
              </FieldWithLabel>
              <FieldWithLabel label="Tags">
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="coma, separados"
                  className={inputCls}
                />
              </FieldWithLabel>
            </div>
            <div className="font-lato text-[11px] text-slate-500">
              <p className="truncate font-mono">{media.url}</p>
              <p className="mt-1">
                {media.kind} ·{" "}
                {media.size ? `${(media.size / 1024).toFixed(1)} KB` : "tamaño desconocido"}
                {media.width && media.height && ` · ${media.width}×${media.height}`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" />
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FieldWithLabel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        {label}
      </label>
      {children}
    </div>
  )
}
