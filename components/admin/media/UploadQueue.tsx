"use client"

import { CheckCircle2, Loader2, RefreshCw, X, AlertTriangle, FileText, Image as ImageIcon, Film } from "lucide-react"
import { cn } from "@/lib/utils"

export type UploadStatus = "queued" | "uploading" | "done" | "error"

export interface UploadItem {
  id: string
  name: string
  folder: string
  size: number
  status: UploadStatus
  error?: string
}

interface Props {
  items: UploadItem[]
  onClear: () => void
  onRetry: (id: string) => void
  onClose: () => void
}

export function UploadQueue({ items, onClear, onRetry, onClose }: Props) {
  if (items.length === 0) return null
  const inFlight = items.filter((i) => i.status === "queued" || i.status === "uploading").length
  const done = items.filter((i) => i.status === "done").length
  const errors = items.filter((i) => i.status === "error").length

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-2.5 text-white">
        <div>
          <p className="font-bebas text-sm uppercase tracking-wider">Subiendo</p>
          <p className="font-lato text-[11px] text-slate-300">
            {inFlight > 0
              ? `${done + errors}/${items.length} completos · ${inFlight} pendientes`
              : `${done} ok${errors > 0 ? ` · ${errors} con error` : ""}`}
          </p>
        </div>
        <div className="flex gap-1">
          {inFlight === 0 && (
            <button
              onClick={onClear}
              className="rounded border border-slate-600 px-2 py-0.5 font-lato text-[10px] uppercase tracking-wider text-slate-200 hover:bg-slate-800"
            >
              Limpiar
            </button>
          )}
          <button onClick={onClose} className="text-slate-300 hover:text-white" title="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 px-4 py-2">
            <FileIcon name={it.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-lato text-xs font-semibold text-slate-800">{it.name}</p>
              <p className="truncate font-lato text-[10px] text-slate-500">
                {it.folder || "raíz"} · {(it.size / 1024).toFixed(0)} KB
              </p>
              {it.error && (
                <p className="mt-0.5 truncate font-lato text-[10px] text-red-600">{it.error}</p>
              )}
            </div>
            <StatusIcon status={it.status} onRetry={() => onRetry(it.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusIcon({ status, onRetry }: { status: UploadStatus; onRetry: () => void }) {
  if (status === "queued")
    return <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" title="En cola" />
  if (status === "uploading")
    return <Loader2 className="h-4 w-4 animate-spin text-red-600" />
  if (status === "done") return <CheckCircle2 className="h-4 w-4 text-green-600" />
  return (
    <button
      onClick={onRetry}
      title="Reintentar"
      className="flex items-center gap-1 rounded border border-red-300 bg-red-50 px-1.5 py-0.5 text-red-600 hover:bg-red-100"
    >
      <AlertTriangle className="h-3 w-3" />
      <RefreshCw className="h-3 w-3" />
    </button>
  )
}

function FileIcon({ name }: { name: string }) {
  const ext = name.toLowerCase().split(".").pop() ?? ""
  const common = "h-4 w-4"
  if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext))
    return <ImageIcon className={cn(common, "text-slate-400")} />
  if (["mp4", "mov", "webm", "avi", "m4v"].includes(ext))
    return <Film className={cn(common, "text-slate-400")} />
  return <FileText className={cn(common, "text-slate-400")} />
}
