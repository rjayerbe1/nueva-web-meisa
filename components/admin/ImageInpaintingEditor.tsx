"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Paintbrush, Eraser, Trash2, Undo2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loadImage, canvasToFile, getCanvasCoordinates, normalizeMaskCanvas } from '@/lib/canvas-utils'
import { toast } from 'sonner'
import { BeforeAfterComparison } from './BeforeAfterComparison'

interface ImageInpaintingEditorProps {
  imageUrl: string
  onComplete: (editedUrl: string) => void
  onClose: () => void
}

export function ImageInpaintingEditor({
  imageUrl,
  onComplete,
  onClose
}: ImageInpaintingEditorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [isEraser, setIsEraser] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<'remove' | 'replace'>('remove')
  const [isDrawing, setIsDrawing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [inpaintedUrl, setInpaintedUrl] = useState<string | null>(null)

  const imageCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const historyRef = useRef<ImageData[]>([])
  const originalDimensionsRef = useRef<{ width: number; height: number } | null>(null)

  // Cargar imagen
  useEffect(() => {
    const loadAndDrawImage = async () => {
      if (!imageCanvasRef.current || !maskCanvasRef.current) return

      try {
        const img = await loadImage(imageUrl)

        // Guardar dimensiones originales
        originalDimensionsRef.current = {
          width: img.width,
          height: img.height
        }

        // Configurar canvas de imagen
        const imageCanvas = imageCanvasRef.current
        const maskCanvas = maskCanvasRef.current

        // Verificar nuevamente que los canvas existen
        if (!imageCanvas || !maskCanvas) {
          console.error('Canvas elements not available')
          return
        }

        // Calcular tamaño manteniendo aspect ratio (max 1200x900 para mejor calidad)
        const maxWidth = 1200
        const maxHeight = 900
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width
          height = maxHeight
        }

        // Configurar ambos canvas con el mismo tamaño
        imageCanvas.width = width
        imageCanvas.height = height
        maskCanvas.width = width
        maskCanvas.height = height

        // Dibujar imagen
        const imageCtx = imageCanvas.getContext('2d')
        if (imageCtx) {
          imageCtx.drawImage(img, 0, 0, width, height)
        }

        // Inicializar máscara transparente
        const maskCtx = maskCanvas.getContext('2d')
        if (maskCtx) {
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
        }

      } catch (error) {
        console.error('Error cargando imagen:', error)
        toast.error('Error cargando la imagen')
      }
    }

    loadAndDrawImage()
  }, [imageUrl])

  // Funciones de dibujo
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
    saveHistory()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return

    const canvas = maskCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const coords = getCanvasCoordinates(e.nativeEvent as any, canvas)

    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const saveHistory = () => {
    const canvas = maskCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    historyRef.current.push(imageData)

    // Limitar historial a 20 estados
    if (historyRef.current.length > 20) {
      historyRef.current.shift()
    }
  }

  const undo = () => {
    if (historyRef.current.length === 0) return

    const canvas = maskCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    historyRef.current.pop() // Remover estado actual
    const previousState = historyRef.current[historyRef.current.length - 1]

    if (previousState) {
      ctx.putImageData(previousState, 0, 0)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const clearMask = () => {
    const canvas = maskCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    historyRef.current = []
  }

  const handleApply = async () => {
    const maskCanvas = maskCanvasRef.current
    const originalDimensions = originalDimensionsRef.current

    if (!maskCanvas || !originalDimensions) return

    // Verificar que hay máscara dibujada
    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return

    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const hasMask = maskData.data.some(value => value > 0)

    if (!hasMask) {
      toast.error('Debes pintar un área para editar')
      return
    }

    // Validar prompt si es modo replace
    if (mode === 'replace' && !prompt.trim()) {
      toast.error('Debes escribir una descripción para reemplazar el área')
      return
    }

    try {
      setIsProcessing(true)
      const toastId = toast.loading(
        mode === 'remove'
          ? 'Quitando objetos con IA...'
          : `Reemplazando área con: "${prompt}"...`
      )

      // Normalizar máscara (convertir a blanco/negro)
      const normalizedMask = normalizeMaskCanvas(maskCanvas)

      // Escalar máscara a dimensiones originales
      const scaledMaskCanvas = document.createElement('canvas')
      scaledMaskCanvas.width = originalDimensions.width
      scaledMaskCanvas.height = originalDimensions.height
      const scaledCtx = scaledMaskCanvas.getContext('2d')
      if (scaledCtx) {
        // Desactivar suavizado para mantener los bordes nítidos
        scaledCtx.imageSmoothingEnabled = false
        scaledCtx.drawImage(
          normalizedMask,
          0, 0, normalizedMask.width, normalizedMask.height,
          0, 0, originalDimensions.width, originalDimensions.height
        )
      }

      // Descargar imagen original (sin redimensionar)
      const imageResponse = await fetch(imageUrl)
      const imageBlob = await imageResponse.blob()
      const imageFile = new File([imageBlob], 'image.png', { type: imageBlob.type })

      // Convertir máscara escalada a archivo
      const maskFile = await canvasToFile(scaledMaskCanvas, 'mask.png', 'image/png')

      // Enviar a API
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('mask', maskFile)
      formData.append('mode', mode)
      if (mode === 'replace' && prompt) {
        formData.append('prompt', prompt)
      }

      const response = await fetch('/api/inpaint-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error procesando imagen')
      }

      const result = await response.json()

      toast.success('Imagen editada con IA exitosamente. Compara y decide', { id: toastId })
      setInpaintedUrl(result.url)
      setShowComparison(true)

    } catch (error: any) {
      console.error('Error en inpainting:', error)
      toast.error(error.message || 'Error procesando la imagen')
    } finally {
      setIsProcessing(false)
    }
  }

  // Aceptar el resultado del inpainting
  const handleAccept = () => {
    if (inpaintedUrl) {
      onComplete(inpaintedUrl)
      setShowComparison(false)
      onClose()
      toast.success('Imagen editada aplicada')
    }
  }

  // Descartar el resultado y volver a editar
  const handleDiscard = () => {
    setShowComparison(false)
    setInpaintedUrl(null)
    toast.info('Edición descartada. Puedes volver a pintar y aplicar.')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Editar con IA</h3>
            <p className="text-sm text-gray-600">
              Pinta sobre las áreas que quieres editar
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Canvas Container */}
          <div className="flex justify-center mb-6">
            <div
              ref={containerRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
              style={{ maxWidth: '1200px', maxHeight: '900px' }}
            >
              <canvas
                ref={imageCanvasRef}
                className="block"
              />
              <canvas
                ref={maskCanvasRef}
                className="absolute top-0 left-0 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Brush Controls */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={!isEraser ? 'default' : 'outline'}
                  onClick={() => setIsEraser(false)}
                >
                  <Paintbrush className="w-4 h-4 mr-2" />
                  Pincel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isEraser ? 'default' : 'outline'}
                  onClick={() => setIsEraser(true)}
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  Borrador
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <label className="text-sm text-gray-700 whitespace-nowrap">
                  Tamaño: {brushSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="flex-1"
                />
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={undo}
                disabled={historyRef.current.length === 0}
              >
                <Undo2 className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={clearMask}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === 'remove' ? 'default' : 'outline'}
                onClick={() => setMode('remove')}
                className="flex-1 flex-col h-auto py-3"
              >
                <span className="font-semibold">Quitar (Borrado Inteligente)</span>
                <span className="text-xs opacity-80 mt-1">~$0.0015 USD por imagen</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === 'replace' ? 'default' : 'outline'}
                onClick={() => setMode('replace')}
                className="flex-1 flex-col h-auto py-3"
              >
                <span className="font-semibold">Reemplazar (Con Prompt)</span>
                <span className="text-xs opacity-80 mt-1">~$0.0038 USD por imagen</span>
              </Button>
            </div>

            {/* Prompt Input */}
            {mode === 'replace' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de lo que quieres en el área pintada:
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: árbol verde, cielo azul, pasto, persona sonriendo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  La IA generará contenido basado en esta descripción
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t flex-shrink-0">
          <p className="text-sm text-gray-600">
            {mode === 'remove'
              ? 'Pinta sobre lo que quieres quitar'
              : 'Pinta el área y describe qué quieres que aparezca'}
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Aplicar Edición'}
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Modal de comparación */}
      {showComparison && inpaintedUrl && (
        <BeforeAfterComparison
          beforeUrl={imageUrl}
          afterUrl={inpaintedUrl}
          beforeLabel="Original"
          afterLabel="Editada"
          onAccept={handleAccept}
          onDiscard={handleDiscard}
          title={mode === 'remove' ? 'Comparación: Objetos Removidos' : 'Comparación: Área Reemplazada'}
          description="Arrastra el divisor para comparar. ¿Te gusta el resultado?"
        />
      )}
    </>
  )
}
