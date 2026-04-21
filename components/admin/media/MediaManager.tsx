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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media, MediaKind } from "@prisma/client"

type KindFilter = "any" | "IMAGE" | "VIDEO" | "DOC"

const KIND_LABEL: Record<KindFilter, string> = {
  any: "Todos",
  IMAGE: "Imágenes",
  VIDEO: "Videos",
  DOC: "Documentos",
}

export function MediaManager() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [kind, setKind] = useState<KindFilter>("any")
  const [folder, setFolder] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [editing, setEditing] = useState<Media | null>(null)
  const [lightbox, setLightbox] = useState<Media | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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
    fetchList()
  }, [fetchList])

  /* ── Derived: folders + tags from loaded items ── */
  const folders = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) map.set(it.folder, (map.get(it.folder) ?? 0) + 1)
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [items])

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

  /* ── Actions ── */
  const upload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", folder ?? "general")
      const res = await fetch("/api/admin/media-library", { method: "POST", body: fd })
      if (res.ok) {
        const saved: Media = await res.json()
        setItems((prev) => [saved, ...prev])
      } else {
        const msg = await res.json().catch(() => ({ error: "Error" }))
        alert(msg.error ?? "Error subiendo")
      }
    } finally {
      setUploading(false)
    }
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

  const hasFilters = kind !== "any" || folder || tag || debouncedQuery
  const clearFilters = () => {
    setKind("any")
    setFolder(null)
    setTag(null)
    setQuery("")
  }

  return (
    <div className="space-y-6">
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
            Repositorio central de imágenes, videos y documentos del sitio. Todo lo que se
            sube aquí queda disponible para los MediaPicker de los editores.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-none bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Subir archivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) upload(file)
            e.target.value = ""
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
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

          {/* Folders */}
          <FilterGroup icon={<Folder className="h-3 w-3" />} label="Carpetas">
            <FilterItem active={folder === null} onClick={() => setFolder(null)} label="Todas" />
            {folders.map(([name, count]) => (
              <FilterItem
                key={name}
                active={folder === name}
                onClick={() => setFolder(name)}
                label={name}
                count={count}
              />
            ))}
          </FilterGroup>

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
          <div className="mb-3 flex items-center justify-between">
            <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "elemento" : "elementos"}
            </p>
          </div>

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
                Ajusta los filtros o sube un archivo para empezar.
              </p>
            </div>
          ) : (
            <div className="[column-fill:_balance] gap-3 columns-2 md:columns-3 xl:columns-4">
              {filteredItems.map((m) => (
                <div key={m.id} className="mb-3 break-inside-avoid">
                  <MediaCard
                    media={m}
                    onOpen={() => setLightbox(m)}
                    onEdit={() => setEditing(m)}
                    onDelete={() => del(m.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

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
        />
      )}
    </div>
  )
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

  const aspectStyle =
    media.width && media.height
      ? { aspectRatio: `${media.width} / ${media.height}` }
      : { aspectRatio: "1 / 1" }

  return (
    <div className="group relative overflow-hidden rounded-md border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden"
        aria-label={`Abrir ${media.fileName}`}
      >
        <div className="relative w-full bg-slate-100" style={aspectStyle}>
          {media.kind === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.url}
              alt={media.altText ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : media.kind === "VIDEO" ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
              <Film className="h-10 w-10" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <FileText className="h-10 w-10" />
            </div>
          )}
        </div>
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
}: {
  media: Media
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl p-0">
        <div className="grid max-h-[85vh] grid-cols-1 md:grid-cols-[1fr_320px]">
          {/* Media */}
          <div className="flex items-center justify-center overflow-hidden bg-slate-950 p-6">
            {media.kind === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.url}
                alt={media.altText ?? ""}
                className="max-h-[80vh] max-w-full object-contain"
              />
            ) : media.kind === "VIDEO" ? (
              <video
                src={media.url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full"
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
          <div className="flex flex-col overflow-y-auto border-l border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="mb-1 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {media.kind}
              </p>
              <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
                {media.title ?? media.fileName}
              </h2>
            </div>

            <div className="flex-1 space-y-4 px-5 py-4 text-sm">
              {media.altText && (
                <Field label="Alt text">{media.altText}</Field>
              )}
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
        </div>
      </DialogContent>
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
