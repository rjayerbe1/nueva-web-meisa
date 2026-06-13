'use client'

import { useEffect, useRef, useState } from 'react'

type Tab = {
  id: string
  index: string
  label: string
}

const TABS: Tab[] = [
  { id: 'flujo', index: '01', label: 'Flujo' },
  { id: 'diseno', index: '02', label: 'Software' },
  { id: 'fabricacion', index: '03', label: 'Planta y equipos' },
  { id: 'control', index: '04', label: 'Control digital' },
]

export function TecnologiaTabsNav() {
  const [activeId, setActiveId] = useState<string>(TABS[0].id)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      ref={navRef}
      className="hidden md:block sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/10"
      aria-label="Secciones de tecnología"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <ul
          className="flex items-stretch gap-1 sm:gap-2 md:gap-6 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeId
            return (
              <li key={tab.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleClick(tab.id)}
                  className="group relative flex items-baseline gap-2 px-3 md:px-4 py-4 md:py-5 transition-colors duration-200"
                >
                  <span
                    className={`font-bebas text-xs md:text-sm leading-none transition-colors ${
                      isActive ? 'text-red-500' : 'text-white/30 group-hover:text-white/60'
                    }`}
                  >
                    {tab.index}
                  </span>
                  <span
                    className={`font-lato font-bold uppercase tracking-[0.2em] text-xs md:text-sm whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-red-600" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
