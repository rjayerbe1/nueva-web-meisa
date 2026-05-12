"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  ImagePlus,
  Upload,
  X,
  Loader2,
  Search,
  Film,
  Check,
  FileText,
  ChevronRight,
  Folder,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media } from "@prisma/client"
import { MediaThumb } from "./MediaThumb"
import { buildFolderTree, type FolderNode } from "@/lib/media/folder-path"

type Kind = "image" | "video" | "doc" | "any"

function pickerLabel(kind: Kind): string {
  if (kind === "video") return "video"
  if (kind === "doc") return "documento"
  if (kind === "image") return "imagen"
  return "archivo"
}

interface MediaPickerProps {
  value: string | null | undefined
  onChange: (url: string | null) => void
  kind?: Kind
  folder?: string
  allowUrl?: boolean
  label?: string
  hint?: string
}

export function MediaPicker({
  value,
  onChange,
  kind = "image",
  folder = "general",
  allowUrl = true,
  label,
  hint,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      {label && (
        <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {value ? (
          <MediaPreview
            value={value}
            kind={kind}
            onRemove={() => onChange(null)}
            onReplace={() => setOpen(true)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-32 w-full items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-white text-sm text-slate-500 transition-colors hover:border-red-600 hover:bg-red-50/30 hover:text-red-600"
          >
            <div className="flex flex-col items-center gap-1">
              {kind === "doc" ? <FileText className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
              <span>Seleccionar {pickerLabel(kind)}</span>
            </div>
          </button>
        )}
        {hint && <p className="font-lato text-xs italic text-slate-500">{hint}</p>}
      </div>

      <MediaPickerModal
        open={open}
        onOpenChange={setOpen}
        kind={kind}
        folder={folder}
        allowUrl={allowUrl}
        onPick={(url) => {
          onChange(url)
          setOpen(false)
        }}
      />
    </div>
  )
}

function MediaPreview({
  value,
  kind,
  onRemove,
  onReplace,
}: {
  value: string
  kind: Kind
  onRemove: () => void
  onReplace: () => void
}) {
  const fileName = (() => {
    try {
      return decodeURIComponent(value.split("/").pop() ?? value)
    } catch {
      return value.split("/").pop() ?? value
    }
  })()
  return (
    <div className="overflow-hidden rounded-none border border-slate-200 bg-slate-50">
      {kind === "video" ? (
        <div className="relative w-full bg-black">
          <video
            key={value}
            src={value}
            controls
            preload="metadata"
            playsInline
            className="block h-48 w-full object-contain"
          >
            Tu navegador no soporta video.
          </video>
        </div>
      ) : kind === "doc" ? (
        <div className="flex h-48 w-full items-center justify-center gap-3 bg-slate-100 text-slate-500">
          <FileText className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate font-lato text-sm font-semibold text-slate-700">{fileName}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="font-lato text-xs text-red-600 hover:underline"
            >
              Abrir documento
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="block h-48 w-full object-contain" />
        </div>
      )}
      <div className="flex items-center gap-3 border-t border-slate-200 bg-white p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs text-slate-700">{value}</p>
        </div>
        <div className="flex flex-shrink-0 gap-1">
          <button
            type="button"
            onClick={onReplace}
            className="inline-flex items-center rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
          >
            Cambiar
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  kind: Kind
  folder: string
  allowUrl: boolean
  onPick: (url: string) => void
}

export function MediaPickerModal({ open, onOpenChange, kind, folder, allowUrl, onPick }: ModalProps) {
  const [tab, setTab] = useState<"library" | "upload" | "url">("library")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="grid h-[95vh] w-[95vw] max-w-none grid-rows-[auto_auto_1fr] gap-0 overflow-hidden rounded-none border-slate-200 bg-white p-0 shadow-2xl sm:rounded-none"
      >
        {/* Header */}
        <DialogHeader className="border-b border-slate-200 bg-white px-6 py-4 text-left space-y-1">
          <DialogTitle className="font-bebas text-2xl uppercase tracking-wide text-slate-950">
            Seleccionar {pickerLabel(kind)}
          </DialogTitle>
          <DialogDescription className="font-lato text-xs text-slate-500">
            Elige uno de la biblioteca, sube uno nuevo o pega una URL externa.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs — underline style */}
        <div className="flex border-b border-slate-200 bg-white px-4">
          <TabButton active={tab === "library"} onClick={() => setTab("library")}>
            <Search className="h-3.5 w-3.5" /> Biblioteca
          </TabButton>
          <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
            <Upload className="h-3.5 w-3.5" /> Subir nuevo
          </TabButton>
          {allowUrl && (
            <TabButton active={tab === "url"} onClick={() => setTab("url")}>
              URL externa
            </TabButton>
          )}
        </div>

        {/* Content */}
        <div className="overflow-hidden bg-stone-50">
          {tab === "library" && <LibraryTab kind={kind} onPick={onPick} />}
          {tab === "upload" && (
            <div className="h-full overflow-y-auto px-6 py-5">
              <UploadTab kind={kind} folder={folder} onPick={onPick} />
            </div>
          )}
          {tab === "url" && allowUrl && (
            <div className="h-full overflow-y-auto px-6 py-5">
              <UrlTab onPick={onPick} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-4 py-3 font-lato text-sm font-medium transition-colors",
        active
          ? "border-red-600 text-red-600 font-semibold"
          : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  )
}

function LibraryTab({ kind, onPick }: { kind: Kind; onPick: (url: string) => void }) {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [folder, setFolder] = useState<string | null>(null)
  const [folderPaths, setFolderPaths] = useState<string[]>([])
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({})
  const [foldersLoading, setFoldersLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  // Load folders once
  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/admin/media-library/folders", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setFolderPaths(Array.isArray(data.paths) ? data.paths : [])
        setFolderCounts(data.counts && typeof data.counts === "object" ? data.counts : {})
      })
      .catch(() => {})
      .finally(() => setFoldersLoading(false))
    return () => controller.abort()
  }, [])

  // Load items
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const params = new URLSearchParams()
    params.set("limit", "120")
    if (kind !== "any") params.set("kind", kind)
    if (debouncedQuery) params.set("q", debouncedQuery)
    if (folder) params.set("folder", folder)
    fetch(`/api/admin/media-library?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [kind, debouncedQuery, folder])

  const tree = useMemo(() => buildFolderTree(folderPaths, folderCounts), [folderPaths, folderCounts])
  const rootCount = useMemo(
    () => Object.values(folderCounts).reduce((a, b) => a + b, 0),
    [folderCounts],
  )

  const breadcrumb = folder ? folder.split("/") : []

  return (
    <div className="grid h-full grid-cols-[260px_1fr] overflow-hidden">
      {/* Folder sidebar */}
      <aside className="overflow-y-auto border-r border-slate-200 bg-white px-3 py-4">
        <p className="mb-2 px-2 font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Carpetas
        </p>
        {foldersLoading ? (
          <div className="flex h-32 items-center justify-center text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <ReadOnlyFolderTree
            nodes={tree}
            currentPath={folder}
            rootCount={rootCount}
            onNavigate={setFolder}
          />
        )}
      </aside>

      {/* Content */}
      <div className="flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 font-lato text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setFolder(null)}
              className="font-bold uppercase tracking-wider hover:text-red-600"
            >
              Todas
            </button>
            {breadcrumb.map((seg, i) => {
              const path = breadcrumb.slice(0, i + 1).join("/")
              const isLast = i === breadcrumb.length - 1
              return (
                <span key={path} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <button
                    type="button"
                    onClick={() => setFolder(path)}
                    className={cn(
                      "font-bold uppercase tracking-wider",
                      isLast ? "text-slate-900" : "hover:text-red-600",
                    )}
                  >
                    {seg}
                  </button>
                </span>
              )
            })}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Buscar nombre, título, alt, tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-none border border-slate-300 bg-white py-2 pl-9 pr-3 font-lato text-sm text-slate-950 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-3 font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {items.length} resultados {folder ? `· en ${folder}` : ""}
          </p>
          {loading ? (
            <div className="flex h-96 items-center justify-center text-slate-300">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-96 items-center justify-center font-lato text-sm text-slate-500">
              No hay {kind === "video" ? "videos" : kind === "doc" ? "documentos" : "imágenes"}{" "}
              {folder ? `en "${folder}"` : "todavía"}.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="group overflow-hidden rounded-none border border-slate-200 bg-white text-left transition-all hover:border-red-600 hover:shadow-md focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                >
                  <MediaThumb media={m} />
                  <div className="p-2">
                    <p className="truncate font-lato text-xs font-semibold text-slate-800">
                      {m.title ?? m.fileName}
                    </p>
                    <p className="truncate font-lato text-[10px] text-slate-400">{m.folder}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Read-only folder tree for the picker ─────────────────────────────── */

function ReadOnlyFolderTree({
  nodes,
  currentPath,
  rootCount,
  onNavigate,
}: {
  nodes: FolderNode[]
  currentPath: string | null
  rootCount: number
  onNavigate: (path: string | null) => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>()
    if (currentPath) {
      const parts = currentPath.split("/")
      let acc = ""
      for (const p of parts) {
        acc = acc ? `${acc}/${p}` : p
        s.add(acc)
      }
    }
    return s
  })

  const toggle = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1.5 font-lato text-sm transition-colors",
          currentPath === null
            ? "bg-red-50 font-semibold text-red-700"
            : "text-slate-700 hover:bg-stone-50 hover:text-slate-950",
        )}
      >
        <Folder className="h-3.5 w-3.5 text-slate-400" />
        <span className="flex-1 truncate text-left">Todas las carpetas</span>
        <span className="text-[11px] text-slate-400">{rootCount}</span>
      </button>
      {nodes.map((n) => (
        <PickerFolderRow
          key={n.path}
          node={n}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          currentPath={currentPath}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function PickerFolderRow({
  node,
  depth,
  expanded,
  toggle,
  currentPath,
  onNavigate,
}: {
  node: FolderNode
  depth: number
  expanded: Set<string>
  toggle: (path: string) => void
  currentPath: string | null
  onNavigate: (path: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isExpanded = expanded.has(node.path)
  const isActive = currentPath === node.path

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1.5",
          isActive && "bg-red-50",
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <button
          type="button"
          onClick={() => hasChildren && toggle(node.path)}
          className={cn(
            "flex h-4 w-4 items-center justify-center text-slate-400",
            !hasChildren && "invisible",
          )}
          aria-label={isExpanded ? "Colapsar" : "Expandir"}
        >
          <ChevronRight
            className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")}
          />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(node.path)}
          className={cn(
            "flex flex-1 items-center gap-2 font-lato text-sm transition-colors",
            isActive ? "font-semibold text-red-700" : "text-slate-700 hover:text-slate-950",
          )}
        >
          <Folder className="h-3.5 w-3.5 text-slate-400" />
          <span className="flex-1 truncate text-left">{node.name}</span>
          {node.count > 0 && (
            <span className="text-[11px] text-slate-400">{node.count}</span>
          )}
        </button>
      </div>
      {isExpanded &&
        node.children.map((c) => (
          <PickerFolderRow
            key={c.path}
            node={c}
            depth={depth + 1}
            expanded={expanded}
            toggle={toggle}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        ))}
    </div>
  )
}

function UploadTab({
  kind,
  folder,
  onPick,
}: {
  kind: Kind
  folder: string
  onPick: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [altText, setAltText] = useState("")
  const [currentFolder, setCurrentFolder] = useState(folder)

  const upload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", currentFolder)
      if (altText) fd.append("altText", altText)

      const res = await fetch("/api/admin/media-library", { method: "POST", body: fd })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error subiendo")
      }
      const saved: Media = await res.json()
      onPick(saved.url)
    } catch (e: any) {
      setError(e.message ?? "Error subiendo")
    } finally {
      setUploading(false)
    }
  }

  const accept =
    kind === "video"
      ? "video/mp4,video/quicktime,video/webm"
      : kind === "image"
        ? "image/*"
        : kind === "doc"
          ? "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
          : "image/*,video/*,application/pdf"

  const inputCls =
    "w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
          Carpeta
        </label>
        <input
          value={currentFolder}
          onChange={(e) => setCurrentFolder(e.target.value)}
          placeholder="home | empresa | servicios…"
          className={inputCls}
        />
      </div>
      {kind !== "video" && (
        <div>
          <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
            Texto alternativo (alt)
          </label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descripción para accesibilidad y SEO"
            className={inputCls}
          />
        </div>
      )}
      <div
        className={cn(
          "flex h-64 flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-white text-slate-500",
          uploading && "opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8" />
            <p className="font-lato text-sm">Arrastra un archivo o haz clic para elegir</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
            >
              Elegir archivo
            </button>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) upload(file)
          }}
        />
      </div>
      {error && (
        <div className="rounded-none border border-red-300 bg-red-50 px-3 py-2 font-lato text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}

function UrlTab({ onPick }: { onPick: (url: string) => void }) {
  const [url, setUrl] = useState("")
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <label className="mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
          URL externa
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-sm text-slate-950 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
        />
        <p className="mt-1.5 font-lato text-xs italic text-slate-500">
          No se guarda en la biblioteca. Si la necesitarás en varios lugares, mejor súbela.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onPick(url.trim())}
          disabled={!url.trim()}
          className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Usar esta URL
        </button>
      </div>
    </div>
  )
}
