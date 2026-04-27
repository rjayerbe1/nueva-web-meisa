"use client"

import { PROJECT_CATEGORIES } from "@/lib/categories-config"

interface ProjectTypeSelectorProps {
  value: string | null
  onChange: (value: string) => void
  error?: string
  otroDetalle: string
  onChangeOtroDetalle: (value: string) => void
}

export function ProjectTypeSelector({
  value,
  onChange,
  error,
  otroDetalle,
  onChangeOtroDetalle,
}: ProjectTypeSelectorProps) {
  const showOtroInput = value === "OTRO"

  return (
    <div>
      <label className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-3">
        Tipo de proyecto *
      </label>
      <p className="text-white/40 font-lato text-[11px] leading-snug mb-3 -mt-1">
        Trabajamos cualquier estructura metálica. Si la tuya no encaja, marca "Otro" y cuéntanos.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {PROJECT_CATEGORIES.map((cat) => {
          const selected = value === cat.dbValue
          return (
            <button
              key={cat.dbValue}
              type="button"
              onClick={() => onChange(cat.dbValue)}
              aria-pressed={selected}
              className={`group relative px-4 py-3.5 border text-left transition-colors duration-200 ${
                selected
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-slate-900 border-white/20 text-white/80 hover:border-white/60 hover:text-white"
              }`}
            >
              <span className="block font-lato font-bold text-[11px] md:text-xs uppercase tracking-[0.12em] leading-tight">
                {cat.name}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange("OTRO")}
          aria-pressed={showOtroInput}
          className={`group relative px-4 py-3.5 border text-left transition-colors duration-200 ${
            showOtroInput
              ? "bg-red-600 border-red-600 text-white"
              : "bg-slate-900 border-white/20 text-white/80 hover:border-white/60 hover:text-white"
          }`}
        >
          <span className="block font-lato font-bold text-[11px] md:text-xs uppercase tracking-[0.12em] leading-tight">
            Otro
          </span>
        </button>
      </div>

      {showOtroInput && (
        <input
          type="text"
          value={otroDetalle}
          onChange={(e) => onChangeOtroDetalle(e.target.value)}
          placeholder="Describe brevemente el tipo (ej. tanques, plataformas, mobiliario urbano…)"
          className="mt-3 w-full px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-colors font-lato"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-500 font-lato">{error}</p>}
    </div>
  )
}
