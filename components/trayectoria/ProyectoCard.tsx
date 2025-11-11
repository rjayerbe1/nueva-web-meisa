"use client"

import { MapPin, Weight, Maximize2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Proyecto {
  id: string
  entidadContratante: string
  objetoContrato: string
  ubicacion: string
  valorContrato: number
  pesoKg: number | null
  areaM2: number | null
  destacado: boolean
}

interface Props {
  proyecto: Proyecto
  onClick: () => void
}

export function ProyectoCard({ proyecto, onClick }: Props) {
  const formatWeight = (kg: number) => {
    const tons = kg / 1000
    if (tons >= 1) {
      return `${Math.round(tons)} ton`
    }
    return `${Math.round(kg)} kg`
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative p-6" onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {proyecto.objetoContrato}
            </h4>
            <p className="text-sm font-medium text-blue-600">
              {proyecto.entidadContratante}
            </p>
          </div>
          {proyecto.destacado && (
            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-300 shrink-0">
              Destacado
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <MapPin className="w-4 h-4 text-slate-400" />
          {proyecto.ubicacion}
        </div>

        {/* Stats Grid - Solo mostrar peso y área, no valor */}
        {(proyecto.pesoKg || proyecto.areaM2) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {proyecto.pesoKg && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs font-medium">Peso</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {formatWeight(Number(proyecto.pesoKg))}
                </div>
              </div>
            )}

            {proyecto.areaM2 && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Área</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {Math.round(Number(proyecto.areaM2))} m²
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <Button
          variant="ghost"
          className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Ver detalles completos →
        </Button>
      </div>
    </Card>
  )
}
