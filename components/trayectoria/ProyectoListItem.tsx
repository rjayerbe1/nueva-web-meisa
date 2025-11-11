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
  // Formatear mes (Abreviado)
  const formatMonth = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')
  }

  // Formatear año (2 dígitos)
  const formatYear = (dateString: string) => {
    const date = new Date(dateString)
    return date.getFullYear().toString().slice(-2)
  }

  // Detectar si es proyecto multi-año
  const yearInicio = new Date(proyecto.fechaInicio).getFullYear()
  const yearFin = new Date(proyecto.fechaFin).getFullYear()
  const isMultiYear = yearInicio !== yearFin

  // Usar peso proporcional si está disponible, sino el peso total
  const pesoParaMostrar = proyecto.pesoKgProporcional ?? proyecto.pesoKg

  // Estilo único compacto para todos los proyectos
  return (
    <div
      onClick={onClick}
      className={`flex items-stretch gap-2 rounded-lg transition-colors cursor-pointer group overflow-hidden ${
        isMultiYear
          ? 'bg-amber-50/20 hover:bg-amber-50/40'
          : 'hover:bg-blue-50'
      }`}
    >
      {/* Barra lateral estilo calendario */}
      <div className={`flex flex-col items-center justify-center px-2.5 py-1.5 text-center min-w-[50px] ${
        isMultiYear
          ? 'bg-amber-100 text-amber-900'
          : 'bg-blue-100 text-blue-900'
      }`}>
        {isMultiYear ? (
          <>
            {/* Multi-año: dos fechas */}
            <div className="text-[9px] font-medium uppercase leading-none">
              {formatMonth(proyecto.fechaInicio)}
            </div>
            <div className="text-sm font-bold leading-none mt-0.5">
              '{formatYear(proyecto.fechaInicio)}
            </div>
            <div className="text-[8px] text-slate-600 my-0.5">→</div>
            <div className="text-[9px] font-medium uppercase leading-none">
              {formatMonth(proyecto.fechaFin)}
            </div>
            <div className="text-sm font-bold leading-none mt-0.5">
              '{formatYear(proyecto.fechaFin)}
            </div>
          </>
        ) : (
          <>
            {/* Un solo año */}
            <div className="text-[10px] font-medium uppercase leading-none">
              {formatMonth(proyecto.fechaInicio)}
            </div>
            <div className="text-lg font-bold leading-none mt-0.5">
              '{formatYear(proyecto.fechaInicio)}
            </div>
          </>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0 py-1.5 pr-3">
        {/* Título y cliente */}
        <div className="flex flex-col gap-0.5">
          {proyecto.tituloDisplay ? (
            <>
              {/* Título compacto (dos niveles) */}
              <p className="text-sm text-slate-900 font-semibold group-hover:text-blue-700 transition-colors leading-snug">
                {proyecto.tituloDisplay}
              </p>
              {proyecto.descripcionSecundaria && (
                <p className="text-xs text-slate-600 leading-snug">
                  {proyecto.descripcionSecundaria}
                </p>
              )}
            </>
          ) : (
            /* Formato original (fallback para proyectos sin título display) */
            <p className="text-sm text-slate-900 font-medium group-hover:text-blue-700 transition-colors leading-snug">
              <span className="font-semibold">{proyecto.entidadContratante}</span> - {proyecto.objetoContrato}
            </p>
          )}
        </div>

        {/* Info compacta en una línea */}
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3 h-3" />
            <span>{proyecto.ubicacion}</span>
          </div>

          {pesoParaMostrar && (
            <>
              <span className="text-slate-300">•</span>
              <div className={`flex items-center gap-1 font-medium ${
                isMultiYear ? 'text-amber-700' : 'text-blue-700'
              }`}>
                <Weight className="w-3 h-3" />
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
            </>
          )}

          {proyecto.areaM2 && (
            <>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-purple-700 font-medium">
                <Maximize2 className="w-3 h-3" />
                <span>{Math.round(Number(proyecto.areaM2)).toLocaleString()} m²</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
