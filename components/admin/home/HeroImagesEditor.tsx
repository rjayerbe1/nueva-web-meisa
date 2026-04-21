"use client"

import { useEffect, useState } from "react"
import { Save, Loader2, Check, Monitor, Smartphone } from "lucide-react"
import { MediaPicker } from "@/components/admin/media/MediaPicker"
import type { HeroImageConfig } from "@/lib/hero-config"
import { cn } from "@/lib/utils"

type Mode = "desktop" | "mobile"

const EMPTY_MOBILE = {
  row2Top: undefined,
  row2Bottom: undefined,
  row3Top: undefined,
  row3Bottom: undefined,
} as const

function setDesktop(
  prev: HeroImageConfig,
  key: "leftColumn" | "centerTop" | "centerBottom" | "rightTop" | "rightBottom",
  url: string | null,
): HeroImageConfig {
  return { ...prev, [key]: url ?? "" }
}

function setMobile(
  prev: HeroImageConfig,
  key: "row2Top" | "row2Bottom" | "row3Top" | "row3Bottom",
  url: string | null,
): HeroImageConfig {
  return {
    ...prev,
    mobile: {
      ...(prev.mobile ?? EMPTY_MOBILE),
      [key]: url ?? undefined,
    },
  }
}

export function HeroImagesEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [mode, setMode] = useState<Mode>("desktop")
  const [images, setImages] = useState<HeroImageConfig>({
    leftColumn: "",
    centerTop: "",
    centerBottom: "",
    rightTop: "",
    rightBottom: "",
    mobile: { ...EMPTY_MOBILE },
  })
  const [original, setOriginal] = useState<HeroImageConfig | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/admin/hero-images")
        const json = await res.json()
        if (!alive) return
        if (json.success) {
          const data: HeroImageConfig = {
            ...json.data,
            mobile: json.data.mobile ?? { ...EMPTY_MOBILE },
          }
          setImages(data)
          setOriginal(data)
        } else {
          setError(json.error ?? "Error cargando imágenes")
        }
      } catch (e: any) {
        if (alive) setError(e.message ?? "Error cargando imágenes")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const hasChanges =
    original !== null && JSON.stringify(images) !== JSON.stringify(original)
  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Error guardando")
      setOriginal(images)
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-10">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
          Imágenes del hero
        </h2>
        <p className="mt-1.5 max-w-2xl font-lato text-sm text-slate-600">
          Grid de imágenes que compone la sección hero del home. Desktop usa 3
          columnas verticales (3:5) y mobile las 2 filas inferiores en landscape
          (5:3).
        </p>

        <div className="mt-4 flex gap-0 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMode("desktop")}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-lato text-xs font-semibold uppercase tracking-wider transition-colors",
              mode === "desktop"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            Desktop (3:5)
          </button>
          <button
            type="button"
            onClick={() => setMode("mobile")}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-lato text-xs font-semibold uppercase tracking-wider transition-colors",
              mode === "mobile"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile (5:3)
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {mode === "desktop" ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div>
              <MediaPicker
                value={images.leftColumn}
                onChange={(url) =>
                  setImages((p) => setDesktop(p, "leftColumn", url))
                }
                kind="image"
                folder="hero"
                label="Columna izquierda"
                hint="Cubre el logo al hacer scroll."
              />
            </div>
            <div className="space-y-5">
              <MediaPicker
                value={images.centerTop}
                onChange={(url) =>
                  setImages((p) => setDesktop(p, "centerTop", url))
                }
                kind="image"
                folder="hero"
                label="Columna central — superior"
                hint="Fondo de la columna central."
              />
              <MediaPicker
                value={images.centerBottom}
                onChange={(url) =>
                  setImages((p) => setDesktop(p, "centerBottom", url))
                }
                kind="image"
                folder="hero"
                label="Columna central — inferior"
                hint="Se revela al hacer scroll."
              />
            </div>
            <div className="space-y-5">
              <MediaPicker
                value={images.rightTop}
                onChange={(url) =>
                  setImages((p) => setDesktop(p, "rightTop", url))
                }
                kind="image"
                folder="hero"
                label="Columna derecha — superior"
                hint="Fondo de la columna derecha."
              />
              <MediaPicker
                value={images.rightBottom}
                onChange={(url) =>
                  setImages((p) => setDesktop(p, "rightBottom", url))
                }
                kind="image"
                folder="hero"
                label="Columna derecha — inferior"
                hint="Se revela al hacer scroll."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-none border border-blue-200 bg-blue-50 p-4 font-lato text-xs text-blue-900">
              Si dejas una imagen vacía, se usa la de desktop equivalente. La
              fila 1 en móvil muestra el logo/contenido y no lleva imagen.
            </div>

            <section>
              <h3 className="mb-4 font-bebas text-xl uppercase leading-tight text-slate-950">
                Fila 2
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <MediaPicker
                  value={images.mobile?.row2Top ?? null}
                  onChange={(url) =>
                    setImages((p) => setMobile(p, "row2Top", url))
                  }
                  kind="image"
                  folder="hero"
                  label="Fondo"
                  hint={`Por defecto usa: ${images.centerTop || "—"}`}
                />
                <MediaPicker
                  value={images.mobile?.row2Bottom ?? null}
                  onChange={(url) =>
                    setImages((p) => setMobile(p, "row2Bottom", url))
                  }
                  kind="image"
                  folder="hero"
                  label="Reveal"
                  hint={`Por defecto usa: ${images.centerBottom || "—"}`}
                />
              </div>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h3 className="mb-4 font-bebas text-xl uppercase leading-tight text-slate-950">
                Fila 3
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <MediaPicker
                  value={images.mobile?.row3Top ?? null}
                  onChange={(url) =>
                    setImages((p) => setMobile(p, "row3Top", url))
                  }
                  kind="image"
                  folder="hero"
                  label="Fondo"
                  hint={`Por defecto usa: ${images.rightTop || "—"}`}
                />
                <MediaPicker
                  value={images.mobile?.row3Bottom ?? null}
                  onChange={(url) =>
                    setImages((p) => setMobile(p, "row3Bottom", url))
                  }
                  kind="image"
                  folder="hero"
                  label="Reveal"
                  hint={`Por defecto usa: ${images.rightBottom || "—"}`}
                />
              </div>
            </section>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        {justSaved && (
          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wide text-green-700">
            <Check className="h-3.5 w-3.5" />
            Guardado
          </span>
        )}
        <button
          onClick={save}
          disabled={saving || !hasChanges}
          className="inline-flex items-center gap-2 rounded-none bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
