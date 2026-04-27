"use client"

import { useRef, useState, type DragEvent } from "react"
import { UploadCloud, FileText, X, Loader2 } from "lucide-react"

export interface UploadedFile {
  name: string
  url: string
  size: number
  mime: string
}

interface FileUploadZoneProps {
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSizeMb?: number
}

const ACCEPT = ".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.zip,.rar,.jpg,.jpeg,.png,.webp"

export function FileUploadZone({
  files,
  onChange,
  maxFiles = 4,
  maxSizeMb = 25,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadOne(file: File): Promise<UploadedFile> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/contact/upload", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error || `Error ${res.status}`)
    }
    return (await res.json()) as UploadedFile
  }

  async function handleFiles(fileList: FileList | File[]) {
    setError(null)

    const arr = Array.from(fileList)
    const remainingSlots = maxFiles - files.length
    if (remainingSlots <= 0) {
      setError(`Máximo ${maxFiles} archivos.`)
      return
    }

    const toUpload = arr.slice(0, remainingSlots)
    const tooBig = toUpload.find((f) => f.size > maxSizeMb * 1024 * 1024)
    if (tooBig) {
      setError(`"${tooBig.name}" supera ${maxSizeMb} MB.`)
      return
    }

    setUploading(true)
    try {
      const uploaded: UploadedFile[] = []
      for (const file of toUpload) {
        uploaded.push(await uploadOne(file))
      }
      onChange([...files, ...uploaded])
    } catch (e: unknown) {
      console.error("Upload error:", e)
      setError(e instanceof Error ? e.message : "Error subiendo el archivo.")
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-3">
        Adjuntos <span className="text-white/30 normal-case tracking-normal font-normal">(planos, especificaciones, RFQ — opcional)</span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed cursor-pointer transition-colors px-4 py-8 text-center ${
          dragOver
            ? "border-red-500 bg-red-600/10"
            : "border-white/30 hover:border-white/60 hover:bg-white/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-white/70 font-lato text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Subiendo…
          </div>
        ) : (
          <>
            <UploadCloud className="w-7 h-7 mx-auto mb-3 text-white/40" strokeWidth={1.5} />
            <p className="text-white font-lato font-bold text-xs md:text-sm uppercase tracking-[0.12em] mb-1">
              Arrastra archivos aquí o haz click
            </p>
            <p className="text-white/40 font-lato text-[11px] leading-snug">
              PDF · DWG · DXF · imágenes · {maxFiles} archivos máx · {maxSizeMb} MB c/u
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500 font-lato">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.url}-${i}`}
              className="flex items-center gap-3 px-3 py-2 bg-slate-900 border border-white/15"
            >
              <FileText className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={2} />
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 truncate text-white font-lato text-sm hover:text-red-500"
              >
                {f.name}
              </a>
              <span className="text-white/40 font-lato text-[11px] flex-shrink-0">
                {(f.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-white/40 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Quitar"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
