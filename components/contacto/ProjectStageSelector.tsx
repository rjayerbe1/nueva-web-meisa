"use client"

export const PROJECT_STAGES = [
  {
    value: "IDEA",
    label: "Idea inicial",
    description: "Aún explorando opciones y alcance.",
  },
  {
    value: "ANTEPROYECTO",
    label: "Anteproyecto",
    description: "Diseños conceptuales o predimensionamiento.",
  },
  {
    value: "PLANOS_DEFINITIVOS",
    label: "Planos definitivos",
    description: "Listo para cotizar fabricación y montaje.",
  },
  {
    value: "EN_OBRA",
    label: "Ya en obra",
    description: "Necesito apoyo o ampliación inmediata.",
  },
] as const

export type ProjectStageValue = (typeof PROJECT_STAGES)[number]["value"]

interface ProjectStageSelectorProps {
  value: string | null
  onChange: (value: ProjectStageValue) => void
  error?: string
}

export function ProjectStageSelector({ value, onChange, error }: ProjectStageSelectorProps) {
  return (
    <div>
      <label className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-3">
        Etapa del proyecto *
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PROJECT_STAGES.map((stage) => {
          const selected = value === stage.value
          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => onChange(stage.value)}
              aria-pressed={selected}
              className={`group relative px-4 py-3 border text-left transition-colors duration-200 ${
                selected
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-slate-900 border-white/20 text-white/80 hover:border-white/60 hover:text-white"
              }`}
            >
              <span className="block font-lato font-bold text-[11px] md:text-xs uppercase tracking-[0.12em] leading-tight mb-1">
                {stage.label}
              </span>
              <span
                className={`block font-lato text-[11px] leading-snug ${
                  selected ? "text-white/80" : "text-white/40 group-hover:text-white/60"
                }`}
              >
                {stage.description}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-500 font-lato">{error}</p>}
    </div>
  )
}
