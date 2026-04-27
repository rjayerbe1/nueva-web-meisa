"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { searchCities, type ColombiaCity } from "@/lib/colombia-cities"

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function CityAutocomplete({ value, onChange, error }: CityAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo<ColombiaCity[]>(() => searchCities(value, 8), [value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function pick(city: ColombiaCity) {
    onChange(city.nombre)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === "Enter") {
      if (suggestions[highlight]) {
        e.preventDefault()
        pick(suggestions[highlight])
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label
        htmlFor="ciudad"
        className="block text-white/60 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.18em] mb-2"
      >
        Ciudad *
      </label>
      <div className="relative">
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          strokeWidth={2}
        />
        <input
          id="ciudad"
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setHighlight(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Escribe tu ciudad…"
          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-colors font-lato"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-white/20 max-h-64 overflow-auto"
        >
          {suggestions.map((city, i) => (
            <li
              key={`${city.nombre}-${city.departamento}`}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(city)
              }}
              className={`px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 ${
                i === highlight ? "bg-white/10" : ""
              }`}
            >
              <span className="text-white font-lato text-sm">{city.nombre}</span>
              <span className="text-white/40 font-lato text-[11px] uppercase tracking-[0.12em]">
                {city.departamento}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-500 font-lato">{error}</p>}
    </div>
  )
}
