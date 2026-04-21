"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ImagePlus, Upload, X, Loader2, Search, Film, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media } from "@prisma/client"
import { MediaThumb } from "./MediaThumb"

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
              <ImagePlus className="h-6 w-6" />
              <span>Seleccionar {kind === "video" ? "video" : "imagen"}</span>
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
            Seleccionar {kind === "video" ? "video" : kind === "image" ? "imagen" : "archivo"}
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
        <div className="overflow-y-auto bg-stone-50 px-6 py-5">
          {tab === "library" && <LibraryTab kind={kind} onPick={onPick} />}
          {tab === "upload" && <UploadTab kind={kind} folder={folder} onPick={onPick} />}
          {tab === "url" && allowUrl && <UrlTab onPick={onPick} />}
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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const kindParam = kind === "any" ? "" : `&kind=${kind}`
    const qParam = debouncedQuery ? `&q=${encodeURIComponent(debouncedQuery)}` : ""
    fetch(`/api/admin/media-library?limit=120${kindParam}${qParam}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [kind, debouncedQuery])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Buscar por nombre, título, alt, tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-none border border-slate-300 bg-white py-2 pl-9 pr-3 font-lato text-sm text-slate-950 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>
        <p className="flex-shrink-0 font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {items.length} resultados
        </p>
      </div>
      {loading ? (
        <div className="flex h-96 items-center justify-center text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-96 items-center justify-center font-lato text-sm text-slate-500">
          No hay {kind === "video" ? "videos" : "imágenes"} todavía. Usa la pestaña &quot;Subir
          nuevo&quot;.
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
