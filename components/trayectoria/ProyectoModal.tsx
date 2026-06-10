"use client"

import { useState } from 'react'
import { MapPin, Calendar, Weight, Maximize2, Building2, ChevronLeft, ChevronRight, Image } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border-slate-200">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {proyecto.destacado && (
                <p className="text-red-600 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-2">
                  Proyecto destacado
                </p>
              )}
              <DialogTitle className="text-2xl md:text-3xl font-bebas uppercase leading-[0.98] text-slate-950 mb-2">
                {proyecto.objetoContrato}
              </DialogTitle>
              <div className="flex items-center gap-2 text-slate-600 font-lato font-semibold text-sm">
                <Building2 className="w-4 h-4 text-slate-400" />
                {proyecto.entidadContratante}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel - Solo si el proyecto tiene imágenes */}
          {hasImages && (
            <div className="relative bg-slate-950 overflow-hidden aspect-video">
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-none"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-none"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 text-sm flex items-center gap-1.5">
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
                        className={`w-2 h-2 transition-all ${
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
            <div className="border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-lato font-bold text-[11px] uppercase tracking-[0.15em] text-slate-500">Ubicación</span>
              </div>
              <p className="text-slate-950 font-lato font-semibold">{proyecto.ubicacion}</p>
              {proyecto.departamento && (
                <p className="text-sm text-slate-600 mt-1">{proyecto.departamento}</p>
              )}
            </div>

            <div className="border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-lato font-bold text-[11px] uppercase tracking-[0.15em] text-slate-500">Período de ejecución</span>
              </div>
              <p className="text-sm text-slate-950">
                <span className="font-semibold">Inicio:</span> {formatDate(proyecto.fechaInicio)}
              </p>
              <p className="text-sm text-slate-950 mt-1">
                <span className="font-semibold">Fin:</span> {formatDate(proyecto.fechaFin)}
              </p>
            </div>
          </div>

          {/* Información Técnica - Sin mostrar valores */}
          {(proyecto.pesoKg || proyecto.areaM2) && (
            <div className="flex flex-wrap gap-x-10 gap-y-4 py-4 border-y border-slate-200">
              {proyecto.pesoKg && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Weight className="w-4 h-4 text-slate-400" />
                    <span className="font-lato font-bold text-[11px] uppercase tracking-[0.15em] text-slate-500">Peso total</span>
                  </div>
                  <p className="font-bebas text-3xl md:text-4xl text-slate-950 leading-none">
                    {Math.round(Number(proyecto.pesoKg) / 1000)}
                    <span className="text-slate-400 text-xl md:text-2xl ml-1.5">ton</span>
                  </p>
                </div>
              )}

              {proyecto.areaM2 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span className="font-lato font-bold text-[11px] uppercase tracking-[0.15em] text-slate-500">Área construida</span>
                  </div>
                  <p className="font-bebas text-3xl md:text-4xl text-slate-950 leading-none">
                    {Math.round(Number(proyecto.areaM2)).toLocaleString()}
                    <span className="text-slate-400 text-xl md:text-2xl ml-1.5">m²</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Descripción */}
          <div>
            <h4 className="font-lato font-bold text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-2">
              Descripción del proyecto
            </h4>
            <p className="text-slate-700 font-lato leading-relaxed">
              {proyecto.objetoContrato}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
