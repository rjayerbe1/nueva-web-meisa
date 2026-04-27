"use client"

const UNITS = [
  { value: "M2", label: "m²" },
  { value: "TON", label: "Toneladas" },
  { value: "NA", label: "No sé" },
] as const

export type ScaleUnit = (typeof UNITS)[number]["value"]

interface ScaleInputProps {
  valor: number | null
  unidad: ScaleUnit | null
  onChangeValor: (valor: number | null) => void
  onChangeUnidad: (unidad: ScaleUnit) => void
}

export function ScaleInput({ valor, unidad, onChangeValor, onChangeUnidad }: ScaleInputProps) {
  return (
    <div>
      <label className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-3">
        Escala estimada <span className="text-white/30 normal-case tracking-normal font-normal">(opcional)</span>
      </label>
      <div className="flex items-stretch gap-0">
        <input
          type="number"
          min={0}
          step="0.01"
          value={valor === null || Number.isNaN(valor) ? "" : valor}
          onChange={(e) => {
            const v = e.target.value
            onChangeValor(v === "" ? null : Number(v))
          }}
          placeholder="500"
          disabled={unidad === "NA"}
          className="flex-1 px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-colors font-lato disabled:opacity-40 disabled:cursor-not-allowed border-r-0"
        />
        <div className="flex">
          {UNITS.map((u) => {
            const active = unidad === u.value
            return (
              <button
                key={u.value}
                type="button"
                onClick={() => {
                  onChangeUnidad(u.value)
                  if (u.value === "NA") onChangeValor(null)
                }}
                aria-pressed={active}
                className={`px-3 md:px-4 py-3 border font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.12em] transition-colors duration-200 -ml-px first:ml-0 ${
                  active
                    ? "bg-white text-slate-950 border-white z-10"
                    : "bg-slate-900 border-white/20 text-white/60 hover:text-white hover:border-white/60"
                }`}
              >
                {u.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
