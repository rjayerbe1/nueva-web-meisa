"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Loader2, Maximize2, Scissors, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useImageDimensions } from '@/hooks/useImageDimensions'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  calculateAspectRatio,
  suggestExpansion,
  validateExpansion,
  formatRatio,
  MEISA_RATIOS,
  type AspectRatio,
  type ImageDimensions
} from '@/lib/aspectRatioHelpers'
import { BeforeAfterComparison } from './BeforeAfterComparison'

interface ImageExpansionEditorProps {
  imageUrl: string
  onComplete: (expandedUrl: string) => void
  onClose: () => void
  suggestedRatio?: string // Ej: "3:5"
}

export function ImageExpansionEditor({
  imageUrl,
  onComplete,
  onClose,
  suggestedRatio
}: ImageExpansionEditorProps) {
  // Control de pasos: 'crop', 'expand' o 'completed'
  const [step, setStep] = useState<'crop' | 'expand' | 'completed'>('crop')

  // Crop state
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // URL de la imagen a usar (original o recortada)
  const [workingImageUrl, setWorkingImageUrl] = useState(imageUrl)
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null)

  // Resultado de la expansión
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null)
  const [expansionResult, setExpansionResult] = useState<any>(null)
  const [showComparison, setShowComparison] = useState(false)

  const { dimensions, loading: loadingDimensions } = useImageDimensions(workingImageUrl)

  // Estado de expansión (pixeles a agregar en cada lado)
  const [top, setTop] = useState(0)
  const [right, setRight] = useState(0)
  const [bottom, setBottom] = useState(0)
  const [left, setLeft] = useState(0)

  // Estado de procesamiento
  const [isExpanding, setIsExpanding] = useState(false)
  const [isCropping, setIsCropping] = useState(false)

  // Aspect ratios
  const [currentRatio, setCurrentRatio] = useState<AspectRatio | null>(null)
  const [resultingRatio, setResultingRatio] = useState<AspectRatio | null>(null)

  // Calcular aspect ratio actual cuando se cargan las dimensiones
  useEffect(() => {
    if (dimensions) {
      const ratio = calculateAspectRatio(dimensions.width, dimensions.height)
      setCurrentRatio(ratio)
      setResultingRatio(ratio) // Inicialmente igual
    }
  }, [dimensions])

  // Recalcular aspect ratio resultante cuando cambian las expansiones
  useEffect(() => {
    if (!dimensions) return

    const newWidth = dimensions.width + left + right
    const newHeight = dimensions.height + top + bottom
    const ratio = calculateAspectRatio(newWidth, newHeight)
    setResultingRatio(ratio)
  }, [top, right, bottom, left, dimensions])

  // Early return si está cargando
  if (loadingDimensions || !dimensions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-700" />
          <p className="mt-4 text-gray-600">Cargando imagen...</p>
        </div>
      </div>
    )
  }

  // Calcular dimensiones para el preview (solo en paso 'expand')
  const resultingWidth = step === 'expand' ? dimensions.width + left + right : 0
  const resultingHeight = step === 'expand' ? dimensions.height + top + bottom : 0
  const previewMaxSize = 600
  const scaleX = resultingWidth > previewMaxSize ? previewMaxSize / resultingWidth : 1
  const scaleY = resultingHeight > previewMaxSize ? previewMaxSize / resultingHeight : 1
  const scale = Math.min(scaleX, scaleY)
  const previewWidth = resultingWidth * scale
  const previewHeight = resultingHeight * scale
  const previewImageWidth = dimensions.width * scale
  const previewImageHeight = dimensions.height * scale
  const previewLeft = left * scale
  const previewTop = top * scale

  // Función para generar imagen recortada
  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      toast.error('Por favor selecciona un área para recortar')
      return
    }

    setIsCropping(true)

    try {
      const canvas = canvasRef.current
      const image = imgRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Set canvas dimensions to crop size
      canvas.width = completedCrop.width * scaleX
      canvas.height = completedCrop.height * scaleY

      // Draw the cropped image
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      // Convert canvas to blob
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error generando imagen recortada'))
              return
            }

            setCroppedImageBlob(blob)
            const croppedUrl = URL.createObjectURL(blob)
            setWorkingImageUrl(croppedUrl)
            setStep('expand')
            toast.success('Imagen recortada. Ahora ajusta la expansión.')
            resolve()
          },
          'image/png',
          1
        )
      })
    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error('Error al recortar imagen')
    } finally {
      setIsCropping(false)
    }
  }

  // Saltar crop y pasar directo a expand
  const skipCrop = () => {
    setStep('expand')
    toast.info('Pasando a expansión sin recortar')
  }

  // Aplicar preset rápido
  const applyPreset = (targetRatioStr: string) => {
    if (!dimensions) return

    const targetRatio = Object.values(MEISA_RATIOS).find(r => r.ratio === targetRatioStr)
    if (!targetRatio) return

    const suggestion = suggestExpansion(dimensions, targetRatio)
    setTop(suggestion.top)
    setRight(suggestion.right)
    setBottom(suggestion.bottom)
    setLeft(suggestion.left)

    toast.success(`Ajustado a ${targetRatio.label}`)
  }

  // Manejar expansión con IA
  const handleExpand = async () => {
    if (!dimensions) return

    // Validar expansión
    const validation = validateExpansion(dimensions, { top, right, bottom, left })
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    // Validar que haya al menos algo de expansión
    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
      toast.error('Debes agregar al menos algo de expansión')
      return
    }

    setIsExpanding(true)
    let toastId = toast.loading('Preparando imagen...')

    try {
      let finalImageUrl = imageUrl

      // Si hay imagen recortada, primero subirla a GCS
      if (croppedImageBlob) {
        toast.loading('Subiendo imagen recortada...', { id: toastId })

        const formData = new FormData()
        formData.append('file', croppedImageBlob, 'cropped-image.png')

        // Extraer el path de la imagen original para mantener la carpeta
        const urlParts = imageUrl.split('meisa-imagenes/')
        if (urlParts.length >= 2) {
          const gcsPath = urlParts[1]
          const pathParts = gcsPath.split('/')
          const folder = pathParts.slice(0, -1).join('/')
          formData.append('folder', folder)
        }

        const uploadResponse = await fetch('/api/upload-cropped-image', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Error subiendo imagen recortada')
        }

        const uploadData = await uploadResponse.json()
        finalImageUrl = uploadData.imageUrl
      }

      toast.loading('Generando con IA (Bria Expand)...\nEsto puede tardar 30-60 segundos', { id: toastId })

      const response = await fetch('/api/expand-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          top,
          right,
          bottom,
          left,
          originalWidth: dimensions.width,
          originalHeight: dimensions.height
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al expandir imagen')
      }

      toast.success('¡Imagen expandida exitosamente! Compara y decide', { id: toastId })

      // Guardar resultado y mostrar comparación
      setExpandedImageUrl(data.expandedUrl)
      setExpansionResult(data)
      setShowComparison(true)
    } catch (error) {
      console.error('Error expandiendo imagen:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al expandir imagen',
        { id: toastId }
      )
    } finally {
      setIsExpanding(false)
    }
  }

  // Aceptar la expansión desde el modal de comparación
  const handleAccept = () => {
    if (expandedImageUrl) {
      onComplete(expandedImageUrl)
      setShowComparison(false)
      onClose()
      toast.success('Imagen expandida aplicada')
    }
  }

  // Descartar la expansión y volver a ajustar
  const handleDiscard = () => {
    setShowComparison(false)
    setExpandedImageUrl(null)
    setExpansionResult(null)
    toast.info('Expansión descartada. Ajusta de nuevo si deseas.')
  }

  // Guardar y cerrar (desde vista completed)
  const handleSaveAndClose = () => {
    if (expandedImageUrl) {
      onComplete(expandedImageUrl)
      onClose()
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {step === 'crop' ? (
                <>
                  <Scissors className="w-6 h-6" />
                  Paso 1: Recortar Imagen
                </>
              ) : step === 'expand' ? (
                <>
                  <Maximize2 className="w-6 h-6" />
                  Paso 2: Expandir con IA
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ¡Completado! Comparación Antes/Después
                </>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'crop' ? (
                'Recorta la imagen para quedarte solo con la parte que quieres. Puedes saltar este paso.'
              ) : step === 'expand' ? (
                'Ajusta cuánto expandir en cada lado. La IA generará el contenido faltante.'
              ) : (
                'Revisa la comparación antes/después. Cuando estés satisfecho, guarda los cambios.'
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isExpanding || isCropping}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === 'crop' ? (
            /* ========== PASO 1: CROP ========== */
            <>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="flex justify-center items-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                  >
                    <img
                      ref={imgRef}
                      src={imageUrl}
                      alt="Imagen para recortar"
                      style={{ maxWidth: '100%', maxHeight: '600px' }}
                    />
                  </ReactCrop>
                </div>
              </div>

              {/* Canvas oculto para generar el crop */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Info del crop */}
              {completedCrop && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Área seleccionada:</p>
                  <p className="text-xs text-blue-600">
                    {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                  </p>
                </div>
              )}

              {/* Botones del paso crop */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={skipCrop}
                  disabled={isCropping}
                >
                  Saltar Crop
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={generateCroppedImage}
                  disabled={!completedCrop || isCropping}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {isCropping ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recortando...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4 mr-2" />
                      Aplicar Crop
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : step === 'expand' ? (
            /* ========== PASO 2: EXPAND ========== */
            <>
              {/* Preview Canvas */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="flex justify-center items-center">
                  <div
                    className="relative bg-gray-200"
                    style={{
                      width: `${previewWidth}px`,
                      height: `${previewHeight}px`
                    }}
                  >
                    {/* Imagen original posicionada */}
                    <div
                      className="absolute"
                      style={{
                        left: `${previewLeft}px`,
                        top: `${previewTop}px`,
                        width: `${previewImageWidth}px`,
                        height: `${previewImageHeight}px`
                      }}
                    >
                      <Image
                        src={workingImageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                {/* Overlay indicando áreas generadas por IA */}
                {/* Top */}
                {top > 0 && (
                  <div
                    className="absolute top-0 left-0 right-0 bg-blue-500/20 border-b-2 border-blue-500/50 flex items-center justify-center"
                    style={{ height: `${previewTop}px` }}
                  >
                    <span className="text-xs font-bold text-blue-700 bg-white/80 px-2 py-1 rounded">
                      IA generará
                    </span>
                  </div>
                )}

                {/* Bottom */}
                {bottom > 0 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/20 border-t-2 border-blue-500/50 flex items-center justify-center"
                    style={{ height: `${bottom * scale}px` }}
                  >
                    <span className="text-xs font-bold text-blue-700 bg-white/80 px-2 py-1 rounded">
                      IA generará
                    </span>
                  </div>
                )}

                {/* Left */}
                {left > 0 && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-blue-500/20 border-r-2 border-blue-500/50 flex items-center justify-center"
                    style={{ width: `${previewLeft}px` }}
                  >
                    <span className="text-xs font-bold text-blue-700 bg-white/80 px-2 py-1 rounded rotate-90">
                      IA
                    </span>
                  </div>
                )}

                {/* Right */}
                {right > 0 && (
                  <div
                    className="absolute top-0 right-0 bottom-0 bg-blue-500/20 border-l-2 border-blue-500/50 flex items-center justify-center"
                    style={{ width: `${right * scale}px` }}
                  >
                    <span className="text-xs font-bold text-blue-700 bg-white/80 px-2 py-1 rounded rotate-90">
                      IA
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Aspect Ratio Info */}
          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm font-medium text-blue-900">Actual</p>
              <p className="text-2xl font-bold text-blue-700">
                {currentRatio ? formatRatio(currentRatio) : '-'}
              </p>
              <p className="text-xs text-blue-600">
                {dimensions.width} × {dimensions.height} px
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Resultante</p>
              <p className="text-2xl font-bold text-green-700">
                {resultingRatio ? formatRatio(resultingRatio) : '-'}
              </p>
              <p className="text-xs text-green-600">
                {resultingWidth} × {resultingHeight} px
              </p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Top */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top: <span className="font-bold text-blue-700">{top}px</span>
              </label>
              <input
                type="range"
                min="0"
                max={Math.floor(dimensions.height * 0.5)}
                value={top}
                onChange={(e) => setTop(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                disabled={isExpanding}
              />
            </div>

            {/* Bottom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bottom: <span className="font-bold text-blue-700">{bottom}px</span>
              </label>
              <input
                type="range"
                min="0"
                max={Math.floor(dimensions.height * 0.5)}
                value={bottom}
                onChange={(e) => setBottom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                disabled={isExpanding}
              />
            </div>

            {/* Left */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left: <span className="font-bold text-blue-700">{left}px</span>
              </label>
              <input
                type="range"
                min="0"
                max={Math.floor(dimensions.width * 0.5)}
                value={left}
                onChange={(e) => setLeft(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                disabled={isExpanding}
              />
            </div>

            {/* Right */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Right: <span className="font-bold text-blue-700">{right}px</span>
              </label>
              <input
                type="range"
                min="0"
                max={Math.floor(dimensions.width * 0.5)}
                value={right}
                onChange={(e) => setRight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                disabled={isExpanding}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Presets:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset("3:5")}
                disabled={isExpanding}
                className="text-xs"
              >
                Hero Desktop (3:5)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset("5:3")}
                disabled={isExpanding}
                className="text-xs"
              >
                Hero Mobile (5:3)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset("1:1")}
                disabled={isExpanding}
                className="text-xs"
              >
                Square (1:1)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyPreset("16:9")}
                disabled={isExpanding}
                className="text-xs"
              >
                Landscape (16:9)
              </Button>
            </div>
          </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('crop')}
                    disabled={isExpanding}
                    size="sm"
                  >
                    ← Volver a Crop
                  </Button>
                  <p className="text-sm text-gray-600">
                    Costo: <span className="font-bold text-blue-600">~$0.04 USD</span> <span className="text-xs">(Bria Expand AI)</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isExpanding}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleExpand}
                    disabled={isExpanding || (top === 0 && right === 0 && bottom === 0 && left === 0)}
                    className="bg-blue-700 hover:bg-blue-800"
                  >
                    {isExpanding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando con IA...
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Generar Expansión con IA
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* ========== PASO 3: COMPLETED - ANTES/DESPUÉS ========== */
            <>
              {/* Comparación lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ANTES */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">ANTES</h3>
                    {expansionResult && (
                      <span className="text-xs text-gray-500">
                        {expansionResult.originalSize.width} × {expansionResult.originalSize.height} px
                      </span>
                    )}
                  </div>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={workingImageUrl}
                        alt="Imagen original"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                {/* DESPUÉS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-green-700">DESPUÉS</h3>
                    {expansionResult && (
                      <span className="text-xs text-green-600 font-medium">
                        {expansionResult.expandedSize.width} × {expansionResult.expandedSize.height} px
                      </span>
                    )}
                  </div>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-green-500">
                    <div className="aspect-[4/3] relative">
                      {expandedImageUrl && (
                        <Image
                          src={expandedImageUrl}
                          alt="Imagen expandida"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info de expansión */}
              {expansionResult && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Detalles de la expansión:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Top (Arriba):</p>
                      <p className="font-bold text-green-700">{expansionResult.expansion.top}px</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Right (Derecha):</p>
                      <p className="font-bold text-green-700">{expansionResult.expansion.right}px</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bottom (Abajo):</p>
                      <p className="font-bold text-green-700">{expansionResult.expansion.bottom}px</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Left (Izquierda):</p>
                      <p className="font-bold text-green-700">{expansionResult.expansion.left}px</p>
                    </div>
                  </div>
                  <div className="text-xs text-green-800 bg-green-100 p-2 rounded">
                    <p className="font-semibold mb-1">Cambio de dimensiones:</p>
                    <p>
                      Ancho: {expansionResult.originalSize.width}px → {expansionResult.expandedSize.width}px
                      {expansionResult.expandedSize.width !== expansionResult.originalSize.width &&
                        <span className="font-bold ml-1">({expansionResult.expansion.left + expansionResult.expansion.right > 0 ? `+${expansionResult.expansion.left + expansionResult.expansion.right}px horizontalmente` : 'sin cambio'})</span>
                      }
                    </p>
                    <p>
                      Alto: {expansionResult.originalSize.height}px → {expansionResult.expandedSize.height}px
                      {expansionResult.expandedSize.height !== expansionResult.originalSize.height &&
                        <span className="font-bold ml-1">({expansionResult.expansion.top + expansionResult.expansion.bottom > 0 ? `+${expansionResult.expansion.top + expansionResult.expansion.bottom}px verticalmente` : 'sin cambio'})</span>
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Botones finales */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setStep('expand')}
                  disabled={isExpanding}
                >
                  ← Volver a Ajustar
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Descartar y Cerrar
                  </Button>
                  <Button
                    onClick={handleSaveAndClose}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Guardar y Usar Esta Imagen
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      </div>

      {/* Modal de comparación */}
      {showComparison && expandedImageUrl && (
        <BeforeAfterComparison
          beforeUrl={workingImageUrl}
          afterUrl={expandedImageUrl}
          beforeLabel="Original"
          afterLabel="Expandida"
          onAccept={handleAccept}
          onDiscard={handleDiscard}
          title="Comparación: Imagen Expandida"
          description="Arrastra el divisor para comparar. ¿Te gusta el resultado de la expansión?"
        />
      )}
    </>
  )
}
