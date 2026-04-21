"use client"

import { useState } from "react"
import { Save, Loader2, Check, X } from "lucide-react"
import { MediaPicker } from "@/components/admin/media/MediaPicker"
import {
  DEFAULT_HERO_VIDEO_DESKTOP,
  DEFAULT_HERO_VIDEO_MOBILE,
} from "@/lib/hero-config"
import type { HomeSeccionConfig } from "@prisma/client"

interface Props {
  initial: HomeSeccionConfig | null
}

export function HeroVideosEditor({ initial }: Props) {
  const [desktop, setDesktop] = useState<string | null>(
    initial?.heroVideoDesktop ?? null,
  )
  const [mobile, setMobile] = useState<string | null>(
    initial?.heroVideoMobile ?? null,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const dirty =
    (initial?.heroVideoDesktop ?? null) !== desktop ||
    (initial?.heroVideoMobile ?? null) !== mobile
  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/home/seccion-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroVideoDesktop: desktop,
          heroVideoMobile: mobile,
        }),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-bebas text-2xl uppercase leading-tight text-slate-950">
          Videos intro del hero
        </h2>
        <p className="mt-1.5 max-w-2xl font-lato text-sm text-slate-600">
          Videos del logo animado que aparecen tras el loader del home. Si dejas
          un campo vacío, el home usa el video por defecto que se muestra como
          preview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
        <VideoSlot
          label="Video intro (desktop)"
          value={desktop}
          onChange={setDesktop}
          defaultSrc={DEFAULT_HERO_VIDEO_DESKTOP}
        />
        <VideoSlot
          label="Video intro (mobile)"
          value={mobile}
          onChange={setMobile}
          defaultSrc={DEFAULT_HERO_VIDEO_MOBILE}
        />
      </div>

      {error && (
        <div className="mx-6 mb-4 rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        {justSaved && (
          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wide text-green-700">
            <Check className="h-3.5 w-3.5" />
            Guardado
          </span>
        )}
        <button
          onClick={save}
          disabled={saving || !dirty}
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

function VideoSlot({
  label,
  value,
  onChange,
  defaultSrc,
}: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
  defaultSrc: string
}) {
  const showingDefault = !value
  const effectiveSrc = value || defaultSrc

  return (
    <div>
      <MediaPicker
        value={value}
        onChange={onChange}
        kind="video"
        folder="hero"
        label={label}
      />

      <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-lato text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {showingDefault ? "Por defecto (activo)" : "Actual"}
          </p>
          {!showingDefault && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 font-lato text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
              title="Quitar y volver al video por defecto"
            >
              <X className="h-3 w-3" />
              Usar por defecto
            </button>
          )}
        </div>
        <video
          key={effectiveSrc}
          src={effectiveSrc}
          muted
          loop
          playsInline
          autoPlay
          className="h-40 w-full rounded border border-slate-200 bg-black object-contain"
        />
        <p className="mt-2 break-all font-mono text-[11px] text-slate-500">
          {effectiveSrc}
        </p>
      </div>
    </div>
  )
}
