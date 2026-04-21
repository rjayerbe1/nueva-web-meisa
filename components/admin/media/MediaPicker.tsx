"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImagePlus, Upload, X, Loader2, Search, Film, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media, MediaKind } from "@prisma/client"

type Kind = "image" | "video" | "any"

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
      {label && <Label className="text-sm">{label}</Label>}
      <div className="mt-1 space-y-2">
        {value ? (
          <MediaPreview value={value} kind={kind} onRemove={() => onChange(null)} onReplace={() => setOpen(true)} />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex flex-col items-center gap-1">
              <ImagePlus className="h-6 w-6" />
              <span>Seleccionar {kind === "video" ? "video" : "imagen"}</span>
            </div>
          </button>
        )}
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
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
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
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
      ) : (
        <div className="relative w-full bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="block h-48 w-full object-contain"
          />
        </div>
      )}
      <div className="flex items-center gap-3 border-t border-gray-200 bg-white p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs text-gray-700">{value}</p>
        </div>
        <div className="flex flex-shrink-0 gap-1">
          <Button type="button" variant="outline" size="sm" onClick={onReplace}>
            Cambiar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
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

function MediaPickerModal({ open, onOpenChange, kind, folder, allowUrl, onPick }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Seleccionar {kind === "video" ? "video" : kind === "image" ? "imagen" : "archivo"}</DialogTitle>
          <DialogDescription>
            Elige uno de la biblioteca, sube uno nuevo o pega una URL externa.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList>
            <TabsTrigger value="library">
              <Search className="mr-1 h-4 w-4" /> Biblioteca
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="mr-1 h-4 w-4" /> Subir nuevo
            </TabsTrigger>
            {allowUrl && <TabsTrigger value="url">URL externa</TabsTrigger>}
          </TabsList>

          <TabsContent value="library" className="mt-4">
            <LibraryTab kind={kind} onPick={onPick} />
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <UploadTab kind={kind} folder={folder} onPick={onPick} />
          </TabsContent>

          {allowUrl && (
            <TabsContent value="url" className="mt-4">
              <UrlTab onPick={onPick} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function LibraryTab({ kind, onPick }: { kind: Kind; onPick: (url: string) => void }) {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const kindParam = kind === "any" ? "" : `&kind=${kind}`
    fetch(`/api/admin/media-library?limit=60${kindParam}${query ? `&q=${encodeURIComponent(query)}` : ""}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [kind, query])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar por nombre, título, alt, tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-500">
          No hay {kind === "video" ? "videos" : "imágenes"} todavía. Usa la pestaña &quot;Subir nuevo&quot;.
        </div>
      ) : (
        <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto md:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => (
            <MediaThumb key={m.id} media={m} onClick={() => onPick(m.url)} />
          ))}
        </div>
      )}
    </div>
  )
}

function MediaThumb({ media, onClick }: { media: Media; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left transition hover:border-blue-500 hover:shadow"
    >
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
      </div>
      <div className="p-2">
        <p className="truncate text-xs font-medium text-gray-700">{media.title ?? media.fileName}</p>
        <p className="truncate text-[10px] text-gray-400">{media.folder}</p>
      </div>
    </button>
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
        : "image/*,video/*,application/pdf"

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">Carpeta</Label>
        <Input
          value={currentFolder}
          onChange={(e) => setCurrentFolder(e.target.value)}
          placeholder="home | empresa | servicios…"
          className="mt-1"
        />
      </div>
      {kind !== "video" && (
        <div>
          <Label className="text-sm">Texto alternativo (alt)</Label>
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descripción para accesibilidad y SEO"
            className="mt-1"
          />
        </div>
      )}
      <div
        className={cn(
          "flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500",
          uploading && "opacity-60",
        )}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8" />
            <p className="text-sm">Arrastra un archivo o haz clic para elegir</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fileRef.current?.click()}
            >
              Elegir archivo
            </Button>
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
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}

function UrlTab({ onPick }: { onPick: (url: string) => void }) {
  const [url, setUrl] = useState("")
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">URL externa</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="mt-1"
        />
        <p className="mt-1 text-xs text-gray-500">
          No se guarda en la biblioteca. Si la necesitarás en varios lugares, prefiere subirla para
          gestionarla desde el admin.
        </p>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => onPick(url.trim())}
          disabled={!url.trim()}
        >
          <Check className="mr-2 h-4 w-4" /> Usar esta URL
        </Button>
      </div>
    </div>
  )
}
