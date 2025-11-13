'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Loader2,
  X,
  Check,
  Presentation
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { processPPTX, PPTXSlide } from '@/lib/pptxProcessor'

interface PPTXSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSlides: (slides: PPTXSlide[], indices: number[]) => void
}

export function PPTXSelectorModal({
  isOpen,
  onClose,
  onSelectSlides,
}: PPTXSelectorModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pptxFile, setPptxFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [slides, setSlides] = useState<PPTXSlide[]>([])
  const [selectedSlideIndices, setSelectedSlideIndices] = useState<Set<number>>(new Set())

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].name.endsWith('.pptx')) {
      handleFileSelected(files[0])
    } else {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor selecciona un archivo PowerPoint (.pptx)',
        variant: 'destructive'
      })
    }
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelected(files[0])
    }
  }, [])

  const handleFileSelected = async (file: File) => {
    if (!file.name.endsWith('.pptx')) {
      toast({
        title: 'Archivo inválido',
        description: 'Solo se permiten archivos PowerPoint (.pptx)',
        variant: 'destructive'
      })
      return
    }

    setPptxFile(file)
    setLoading(true)
    setSlides([])
    setSelectedSlideIndices(new Set())

    try {
      console.log(`📊 [PPTX] Procesando archivo: ${file.name}`)

      // Procesar PPTX
      const processedSlides = await processPPTX(file)

      setSlides(processedSlides)
      console.log(`✅ [PPTX] ${processedSlides.length} diapositivas procesadas`)

      toast({
        title: 'PowerPoint cargado',
        description: `${processedSlides.length} diapositivas encontradas`
      })
    } catch (error) {
      console.error('❌ [PPTX] Error procesando PowerPoint:', error)
      toast({
        title: 'Error',
        description: 'No se pudo procesar el archivo PowerPoint',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSlideSelection = (index: number) => {
    const newSelection = new Set(selectedSlideIndices)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedSlideIndices(newSelection)
  }

  const selectAll = () => {
    setSelectedSlideIndices(new Set(slides.map((_, i) => i)))
  }

  const deselectAll = () => {
    setSelectedSlideIndices(new Set())
  }

  const handleConfirm = () => {
    if (selectedSlideIndices.size === 0) {
      toast({
        title: 'Sin selección',
        description: 'Selecciona al menos una diapositiva',
        variant: 'destructive'
      })
      return
    }

    const selectedSlides = Array.from(selectedSlideIndices)
      .sort((a, b) => a - b)
      .map(index => slides[index])

    onSelectSlides(selectedSlides, Array.from(selectedSlideIndices).sort((a, b) => a - b))
    handleClose()
  }

  const handleClose = () => {
    setPptxFile(null)
    setSlides([])
    setSelectedSlideIndices(new Set())
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Presentation className="w-5 h-5" />
            Importar PowerPoint
          </DialogTitle>
          <DialogDescription>
            Selecciona un archivo PowerPoint y elige las diapositivas que deseas agregar
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!pptxFile ? (
            /* Upload area */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors min-h-[300px] ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Presentation className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arrastra un archivo PowerPoint aquí
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar
              </p>
              <input
                type="file"
                accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileInputChange}
                className="hidden"
                id="pptx-upload"
              />
              <label htmlFor="pptx-upload">
                <Button asChild>
                  <span>Seleccionar PowerPoint</span>
                </Button>
              </label>
              <p className="text-xs text-gray-400 mt-4">
                Formato: .pptx - Máx 50MB
              </p>
            </div>
          ) : loading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                Procesando PowerPoint...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Extrayendo elementos de las diapositivas
              </p>
            </div>
          ) : (
            /* Slides grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">{pptxFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {slides.length} diapositiva{slides.length !== 1 ? 's' : ''} •{' '}
                    {selectedSlideIndices.size} seleccionada{selectedSlideIndices.size !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSlideIndices.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deselectAll}
                      className="text-gray-600"
                    >
                      Deseleccionar todo
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAll}
                    className="text-blue-600"
                  >
                    Seleccionar todo
                  </Button>
                  <button
                    onClick={() => {
                      setPptxFile(null)
                      setSlides([])
                      setSelectedSlideIndices(new Set())
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSlideSelection(index)}
                    className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedSlideIndices.has(index)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Preview básico */}
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Presentation className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">
                          {slide.elements.length} elemento{slide.elements.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {slide.elements.filter(e => e.type === 'image').length} img •{' '}
                          {slide.elements.filter(e => e.type === 'text').length} txt •{' '}
                          {slide.elements.filter(e => e.type === 'shape').length} forma{slide.elements.filter(e => e.type === 'shape').length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium text-center">
                        Diapositiva {slide.slideNumber}
                      </p>
                    </div>

                    {selectedSlideIndices.has(index) && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-2">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {pptxFile && slides.length > 0 && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedSlideIndices.size === 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Continuar ({selectedSlideIndices.size})
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
