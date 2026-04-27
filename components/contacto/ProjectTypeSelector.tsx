"use client"

import { PROJECT_CATEGORIES } from "@/lib/categories-config"

interface ProjectTypeSelectorProps {
  value: string | null
  onChange: (value: string) => void
  error?: string
}

export function ProjectTypeSelector({ value, onChange, error }: ProjectTypeSelectorProps) {
  return (
    <div>
      <label className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-3">
        Tipo de proyecto *
      </label>
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
      </div>
      {error && <p className="mt-2 text-xs text-red-500 font-lato">{error}</p>}
    </div>
  )
}
