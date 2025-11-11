"use client"

import { useState } from 'react'
import { X, MapPin, Calendar, Weight, Maximize2, Building2, ChevronLeft, ChevronRight, Image } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Proyecto {
  id: string
  entidadContratante: string
  objetoContrato: string
  fechaInicio: string
  fechaFin: string
  ubicacion: string
  departamento: string | null
  valorContrato: number
  pesoKg: number | null
  areaM2: number | null
  imagenes: string[] | null
  destacado: boolean
}

interface Props {
  proyecto: Proyecto
  onClose: () => void
}

export function ProyectoModal({ proyecto, onClose }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatWeight = (kg: number) => {
    const tons = kg / 1000
    return `${tons.toFixed(2)} toneladas (${kg.toLocaleString()} kg)`
  }

  const hasImages = proyecto.imagenes && proyecto.imagenes.length > 0

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes!.length)
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? proyecto.imagenes!.length - 1 : prev - 1
      )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                {proyecto.objetoContrato}
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Building2 className="w-4 h-4" />
                  {proyecto.entidadContratante}
                </div>
                {proyecto.destacado && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                    Proyecto Destacado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel - Solo si el proyecto tiene imágenes */}
          {hasImages && (
            <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
              {/* Current Image */}
              <img
                src={proyecto.imagenes![currentImageIndex]}
                alt={`${proyecto.objetoContrato} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              {proyecto.imagenes!.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                    <Image className="w-4 h-4" />
                    <span>
                      {currentImageIndex + 1} / {proyecto.imagenes!.length}
                    </span>
                  </div>

                  {/* Thumbnail Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {proyecto.imagenes!.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Ubicación y Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Ubicación</span>
              </div>
              <p className="text-slate-900 font-medium">{proyecto.ubicacion}</p>
              {proyecto.departamento && (
                <p className="text-sm text-slate-600 mt-1">{proyecto.departamento}</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Período de Ejecución</span>
              </div>
              <p className="text-sm text-slate-900">
                <span className="font-medium">Inicio:</span> {formatDate(proyecto.fechaInicio)}
              </p>
              <p className="text-sm text-slate-900 mt-1">
                <span className="font-medium">Fin:</span> {formatDate(proyecto.fechaFin)}
              </p>
            </div>
          </div>

          {/* Información Técnica - Sin mostrar valores */}
          {(proyecto.pesoKg || proyecto.areaM2) && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-lg">
                Información Técnica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proyecto.pesoKg && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Weight className="w-5 h-5" />
                      <span className="font-semibold text-sm">Peso Total</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">
                      {Math.round(Number(proyecto.pesoKg) / 1000)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Toneladas</p>
                  </div>
                )}

                {proyecto.areaM2 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Maximize2 className="w-5 h-5" />
                      <span className="font-semibold text-sm">Área Construida</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">
                      {Math.round(Number(proyecto.areaM2)).toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Metros cuadrados</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">
              Descripción del Proyecto
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {proyecto.objetoContrato}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
