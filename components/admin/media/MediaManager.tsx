"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import type { Media, MediaKind } from "@prisma/client"

export function MediaManager() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<"any" | "IMAGE" | "VIDEO" | "DOC">("any")
  const [editing, setEditing] = useState<Media | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (kind !== "any") params.set("kind", kind)
      if (query) params.set("q", query)
      params.set("limit", "120")
      const res = await fetch(`/api/admin/media-library?${params.toString()}`)
      const data = await res.json()
      setItems(data.items ?? [])
    } finally {
      setLoading(false)
    }
  }, [kind, query])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "general")
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
    } else {
      alert("Error eliminando")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de medios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Repositorio central de imágenes, videos y documentos del sitio.
          </p>
        </div>
        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Subir archivo
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) upload(file)
          }}
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-1 min-w-[200px] items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, título, alt, tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Todos los tipos</SelectItem>
              <SelectItem value="IMAGE">Imágenes</SelectItem>
              <SelectItem value="VIDEO">Videos</SelectItem>
              <SelectItem value="DOC">Documentos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-sm text-gray-500">
          No hay medios que coincidan. Sube archivos o ajusta los filtros.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((m) => (
            <MediaCard key={m.id} media={m} onEdit={() => setEditing(m)} onDelete={() => del(m.id)} />
          ))}
        </div>
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
    </div>
  )
}

function MediaCard({
  media,
  onEdit,
  onDelete,
}: {
  media: Media
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
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md">
      <div className="relative aspect-square w-full bg-gray-100">
        {media.kind === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.url} alt={media.altText ?? ""} className="h-full w-full object-cover" />
        ) : media.kind === "VIDEO" ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
            <Film className="h-8 w-8" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <FileText className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
          <Button variant="ghost" size="sm" className="h-7 bg-white/90 px-2 hover:bg-white" onClick={copy}>
            {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 bg-white/90 px-2 hover:bg-white" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 bg-white/90 px-2 hover:bg-white" onClick={onDelete}>
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      </div>
      <div className="p-2">
        <p className="truncate text-xs font-medium text-gray-700">{media.title ?? media.fileName}</p>
        <div className="mt-1 flex items-center gap-1">
          <Badge variant="outline" className="text-[10px]">
            {media.folder}
          </Badge>
          <span className="text-[10px] text-gray-400">
            {media.width && media.height ? `${media.width}×${media.height}` : ""}
          </span>
        </div>
      </div>
    </div>
  )
}

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
      if (res.ok) {
        onSaved(await res.json())
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar medio</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {media.kind === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.url}
                alt={media.altText ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
                <Film className="h-10 w-10" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={media.fileName}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Texto alternativo (alt)</Label>
              <Textarea
                value={form.altText}
                onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
                rows={2}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Carpeta</Label>
                <Input
                  value={form.folder}
                  onChange={(e) => setForm((f) => ({ ...f, folder: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Tags</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="coma, separados"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
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
          <Button variant="outline" onClick={onClose}>
            <X className="mr-1 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
