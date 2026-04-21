"use client"

import { MapPin, Weight, Maximize2 } from 'lucide-react'

interface Proyecto {
  id: string
  entidadContratante: string
  objetoContrato: string
  tituloDisplay?: string | null
  descripcionSecundaria?: string | null
  fechaInicio: string
  fechaFin: string
  ubicacion: string
  departamento: string | null
  pesoKg: number | null
  pesoKgProporcional?: number
  areaM2: number | null
  imagenes: string[] | null
  destacado: boolean
}

interface Props {
  proyecto: Proyecto
  onClick: () => void
}

export function ProyectoListItem({ proyecto, onClick }: Props) {
  const formatMonth = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')
  }

  const formatYear = (dateString: string) => {
    const date = new Date(dateString)
    return date.getFullYear().toString().slice(-2)
  }

  const yearInicio = new Date(proyecto.fechaInicio).getFullYear()
  const yearFin = new Date(proyecto.fechaFin).getFullYear()
  const isMultiYear = yearInicio !== yearFin

  const pesoParaMostrar = proyecto.pesoKgProporcional ?? proyecto.pesoKg

  return (
    <div
      onClick={onClick}
      className="group flex items-stretch gap-3 border border-transparent hover:border-slate-300 hover:bg-stone-50 transition-colors cursor-pointer overflow-hidden"
    >
      {/* Barra lateral estilo calendario - brutalist */}
      <div className={`flex flex-col items-center justify-center px-3 py-2 text-center min-w-[56px] ${
        isMultiYear
          ? 'bg-slate-200 text-slate-700'
          : 'bg-slate-950 text-white'
      }`}>
        {isMultiYear ? (
          <>
            <div className="text-[9px] font-lato font-bold uppercase tracking-wider leading-none">
              {formatMonth(proyecto.fechaInicio)}
            </div>
            <div className="text-base font-bebas leading-none mt-0.5">
              '{formatYear(proyecto.fechaInicio)}
            </div>
            <div className="text-[8px] my-0.5 opacity-60">→</div>
            <div className="text-[9px] font-lato font-bold uppercase tracking-wider leading-none">
              {formatMonth(proyecto.fechaFin)}
            </div>
            <div className="text-base font-bebas leading-none mt-0.5">
              '{formatYear(proyecto.fechaFin)}
            </div>
          </>
        ) : (
          <>
            <div className="text-[10px] font-lato font-bold uppercase tracking-wider leading-none">
              {formatMonth(proyecto.fechaInicio)}
            </div>
            <div className="text-xl font-bebas leading-none mt-0.5">
              '{formatYear(proyecto.fechaInicio)}
            </div>
          </>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0 py-2 pr-3">
        {/* Título y cliente */}
        <div className="flex flex-col gap-0.5">
          {proyecto.tituloDisplay ? (
            <>
              <p className="text-sm text-slate-950 font-lato font-semibold leading-snug">
                {proyecto.tituloDisplay}
              </p>
              {proyecto.descripcionSecundaria && (
                <p className="text-xs text-slate-600 font-lato leading-snug">
                  {proyecto.descripcionSecundaria}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-950 font-lato leading-snug">
              <span className="font-semibold">{proyecto.entidadContratante}</span>
              <span className="text-slate-600"> — {proyecto.objetoContrato}</span>
            </p>
          )}
        </div>

        {/* Info compacta en una línea */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            <span className="font-lato">{proyecto.ubicacion}</span>
          </div>

          {pesoParaMostrar && (
            <div className="flex items-center gap-1 text-slate-700 font-lato font-semibold">
              <Weight className="w-3 h-3" strokeWidth={2} />
              <span>
                {isMultiYear && proyecto.pesoKgProporcional ? (
                  <>
                    {Math.round(Number(pesoParaMostrar) / 1000)}/{Math.round(Number(proyecto.pesoKg) / 1000)} ton
                  </>
                ) : (
                  <>{Math.round(Number(pesoParaMostrar) / 1000)} ton</>
                )}
              </span>
            </div>
          )}

          {proyecto.areaM2 && (
            <div className="flex items-center gap-1 text-slate-700 font-lato font-semibold">
              <Maximize2 className="w-3 h-3" strokeWidth={2} />
              <span>{Math.round(Number(proyecto.areaM2)).toLocaleString()} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
