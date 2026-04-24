'use client'

import { parseIconValue, IMAGE_ICONS } from '@/lib/category-assets'
import {
  Building,
  Factory,
  Camera,
  Layers,
  Home,
  Zap,
  Globe,
  Wrench,
  MoreHorizontal,
} from 'lucide-react'

const LUCIDE_MAP = {
  Building,
  Factory,
  Camera,
  Layers,
  Home,
  Zap,
  Globe,
  Wrench,
  MoreHorizontal,
} as const

interface Props {
  value: string | null
  onChange: (next: string) => void
  disabled?: boolean
}

export function IconPreview({ value, onChange, disabled }: Props) {
  const parsed = parseIconValue(value)

  const lucideKeys = Object.keys(LUCIDE_MAP) as (keyof typeof LUCIDE_MAP)[]
  const imageKeys = Object.keys(IMAGE_ICONS) as (keyof typeof IMAGE_ICONS)[]

  let preview: React.ReactNode = (
    <Layers className="h-full w-full text-slate-300" />
  )

  if (parsed?.type === 'image' && parsed.data) {
    preview = (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={parsed.data.path}
        alt=""
        className="h-full w-full object-contain"
      />
    )
  } else if (parsed?.type === 'svg' && parsed.data) {
    preview = (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={parsed.data.path}
        alt=""
        className="h-full w-full object-contain"
      />
    )
  } else if (parsed?.type === 'lucide' && parsed.key in LUCIDE_MAP) {
    const Icon = LUCIDE_MAP[parsed.key as keyof typeof LUCIDE_MAP]
    preview = <Icon className="h-full w-full text-slate-900" />
  }

  return (
    <div className="md:col-span-2">
      <div className="flex items-start gap-4">
        {/* Preview grande */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-slate-200 bg-stone-50 p-2">
          {preview}
        </div>

        <div className="min-w-0 flex-1">
          <label className="mb-1 block font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
            Ícono
          </label>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder='Building2 · image:industria · /images/categories/xxx/icon.svg'
            className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:opacity-50"
          />
          <p className="mt-1 font-lato text-[11px] text-slate-500">
            Formatos: <code className="font-mono text-[10px]">image:{"{key}"}</code> (PNGs) ·{' '}
            <code className="font-mono text-[10px]">Building</code> (Lucide) ·{' '}
            <code className="font-mono text-[10px]">/images/categories/…</code>{' '}
            (SVG).
          </p>
        </div>
      </div>

      {/* Shortcuts a los disponibles */}
      <details className="mt-3 border border-slate-200 bg-white">
        <summary className="cursor-pointer bg-stone-50 px-3 py-2 font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:text-slate-900">
          Ver íconos disponibles ({imageKeys.length} PNG + {lucideKeys.length}{' '}
          Lucide)
        </summary>
        <div className="p-3 space-y-3">
          <div>
            <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              PNG (image:{'{key}'})
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
              {imageKeys.map((k) => {
                const isActive = value === `image:${k}`
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => onChange(`image:${k}`)}
                    disabled={disabled}
                    title={IMAGE_ICONS[k].name}
                    className={`flex aspect-square items-center justify-center border p-2 transition-colors ${
                      isActive
                        ? 'border-red-600 bg-red-50'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    } disabled:opacity-50`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={IMAGE_ICONS[k].path}
                      alt={IMAGE_ICONS[k].name}
                      className="h-full w-full object-contain"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Lucide (nombre del componente)
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
              {lucideKeys.map((k) => {
                const Icon = LUCIDE_MAP[k]
                const isActive = value === k
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => onChange(k)}
                    disabled={disabled}
                    title={k}
                    className={`flex aspect-square items-center justify-center border p-2 transition-colors ${
                      isActive
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900'
                    } disabled:opacity-50`}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
