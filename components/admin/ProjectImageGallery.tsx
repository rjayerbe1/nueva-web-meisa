"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Trash2,
  Image as ImageIcon,
  Eye,
  Star,
  ImagePlus,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react"
import { MediaPickerModal } from "@/components/admin/media/MediaPicker"
import { cn } from "@/lib/utils"

interface ProjectImage {
  id: string
  url: string
  alt: string
  descripcion: string | null
  tipo: "PORTADA" | "GALERIA" | "PROCESO" | "ANTES_DESPUES" | "PLANOS"
  createdAt: Date
}

interface ProjectImageGalleryProps {
  projectId: string
  projectTitle: string
  images: ProjectImage[]
  canEdit?: boolean
}

export default function ProjectImageGallery({
  projectId,
  projectTitle,
  images,
  canEdit = true,
}: ProjectImageGalleryProps) {
  const router = useRouter()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)
  const [adding, setAdding] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [updatingCoverId, setUpdatingCoverId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selection, setSelection] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const selectionMode = selection.size > 0
  const allSelected = images.length > 0 && selection.size === images.length

  const toggleSelect = (id: string) =>
    setSelection((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const selectAll = () =>
    setSelection((prev) => {
      if (prev.size === images.length) return new Set()
      return new Set(images.map((i) => i.id))
    })

  const clearSelection = () => setSelection(new Set())

  const handlePick = async (url: string) => {
    setAdding(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          descripcion: null,
          proyectoId: projectId,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "No se pudo agregar la imagen")
      }
      setPickerOpen(false)
      router.refresh()
    } catch (e: any) {
      setError(e.message || "Error agregando imagen")
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Eliminar esta imagen del proyecto?")) return
    setDeletingImageId(imageId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/media/${imageId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("No se pudo eliminar")
      router.refresh()
      if (selectedImage?.id === imageId) setSelectedImage(null)
    } catch (e: any) {
      setError(e.message || "Error eliminando imagen")
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleBulkDelete = async () => {
    const ids = Array.from(selection)
    if (ids.length === 0) return
    if (
      !confirm(
        `¿Eliminar ${ids.length} ${ids.length === 1 ? "imagen" : "imágenes"} del proyecto? Esta acción no se puede deshacer.`,
      )
    )
      return
    setBulkDeleting(true)
    setError(null)
    try {
      const results = await Promise.allSettled(
        ids.map((id) =>
          fetch(`/api/admin/media/${id}`, { method: "DELETE" }).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return id
          }),
        ),
      )
      const failed = results.filter((r) => r.status === "rejected").length
      if (failed > 0) {
        setError(
          `No se pudieron eliminar ${failed} de ${ids.length} imágenes. Refresca la página y vuelve a intentar.`,
        )
      }
      clearSelection()
      router.refresh()
    } catch (e: any) {
      setError(e.message || "Error eliminando imágenes")
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleSetCover = async (imageId: string) => {
    setUpdatingCoverId(imageId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/media/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "PORTADA" }),
      })
      if (!res.ok) throw new Error("No se pudo establecer la portada")
      router.refresh()
    } catch (e: any) {
      setError(e.message || "Error estableciendo portada")
    } finally {
      setUpdatingCoverId(null)
    }
  }

  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="font-bebas text-xl uppercase leading-tight text-slate-950">
            Galería de imágenes
          </h2>
          <p className="mt-1 font-lato text-sm text-slate-600">
            {images.length} {images.length === 1 ? "imagen" : "imágenes"} · elige de la
            biblioteca o sube nuevas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && images.length > 0 && (
            <button
              type="button"
              onClick={selectAll}
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900"
            >
              {allSelected ? (
                <CheckSquare className="h-3.5 w-3.5" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
              {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={adding}
              className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              Agregar imagen
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectionMode && canEdit && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-stone-50 px-6 py-3">
          <p className="font-lato text-sm font-semibold text-slate-900">
            {selection.size} {selection.size === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className="font-lato text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bulkDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Eliminar seleccionadas
            </button>
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 border border-red-300 bg-red-50 px-4 py-2 font-lato text-sm text-red-700">
            {error}
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => {
              const isSelected = selection.has(image.id)
              return (
                <div
                  key={image.id}
                  className={cn(
                    "group relative aspect-square overflow-hidden border bg-slate-50 transition-colors",
                    isSelected ? "border-red-600 ring-2 ring-red-600/30" : "border-slate-200",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
                    onClick={() => {
                      if (selectionMode) toggleSelect(image.id)
                      else setSelectedImage(image)
                    }}
                  />

                  {/* Selection checkbox (always visible, top-left) */}
                  {canEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSelect(image.id)
                      }}
                      className={cn(
                        "absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center border transition-colors",
                        isSelected
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-white/80 bg-white/90 text-transparent hover:text-slate-400 opacity-0 group-hover:opacity-100",
                        selectionMode && "opacity-100",
                      )}
                      aria-label={isSelected ? "Deseleccionar" : "Seleccionar"}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </button>
                  )}

                  {image.tipo === "PORTADA" && (
                    <div className="absolute right-2 top-2 z-10 flex items-center gap-1 bg-amber-500 px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider text-white">
                      <Star className="h-3 w-3" />
                      Portada
                    </div>
                  )}

                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors",
                      !selectionMode && "group-hover:bg-black/50",
                    )}
                  >
                    {!selectionMode && (
                      <div className="pointer-events-auto flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setSelectedImage(image)}
                          className="bg-white p-2 text-slate-800 transition-colors hover:text-red-600"
                          aria-label="Ver imagen"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && image.tipo !== "PORTADA" && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(image.id)}
                            disabled={updatingCoverId === image.id}
                            className="bg-white p-2 text-amber-600 transition-colors hover:text-amber-700 disabled:opacity-50"
                            aria-label="Marcar como portada"
                          >
                            {updatingCoverId === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleDelete(image.id)}
                            disabled={deletingImageId === image.id}
                            className="bg-white p-2 text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                            aria-label="Eliminar imagen"
                          >
                            {deletingImageId === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 bg-stone-50 px-6 py-16 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-lato text-sm text-slate-500">
              Aún no hay imágenes en este proyecto.
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:text-red-600"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Agregar primera imagen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media picker (biblioteca + upload + URL) */}
      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kind="image"
        folder={`projects/${projectId}`}
        allowUrl={true}
        onPick={handlePick}
      />

      {/* Preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-h-[85vh] w-full object-contain"
              />
              {selectedImage.descripcion && (
                <div className="border-t border-slate-200 px-5 py-3">
                  <p className="font-lato text-sm text-slate-700">
                    {selectedImage.descripcion}
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 bg-white p-2 text-slate-800 shadow-lg transition-colors hover:text-red-600"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
