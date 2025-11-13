'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CanvasRendererProps {
  canvasData: any
  width?: number
  height?: number
  className?: string
  isFullscreen?: boolean
}

/**
 * CanvasRenderer - Componente para renderizar canvas de Fabric.js en modo solo lectura
 * Usado en la vista pública de brochures
 */
export function CanvasRenderer({
  canvasData,
  width = 1200,
  height = 800,
  className = '',
  isFullscreen = false
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<any>(null)
  const fabricRef = useRef<any>(null)
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)

  // Cargar Fabric.js dinámicamente
  useEffect(() => {
    console.log('📦 [CanvasRenderer] Cargando Fabric.js...')
    import('fabric').then((fabricModule) => {
      console.log('✅ [CanvasRenderer] Fabric.js cargado')
      // Fabric.js v6 exports directly, no .fabric property
      fabricRef.current = fabricModule as any
      setFabricLoaded(true)
    }).catch((error) => {
      console.error('❌ [CanvasRenderer] Error cargando Fabric.js:', error)
    })
  }, [])

  // Función para ajustar el tamaño del canvas
  const resizeCanvas = useRef<(() => void) | null>(null)

  // Ajustar tamaño del canvas cuando cambia isFullscreen o el tamaño del contenedor
  useEffect(() => {
    if (!fabricCanvasRef.current || !canvasRef.current || !canvasReady) return

    const canvas = fabricCanvasRef.current
    const canvasElement = canvasRef.current

    const resize = () => {
      if (isFullscreen) {
        // En fullscreen, calcular dimensiones para llenar la pantalla
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Calcular el tamaño máximo manteniendo la relación de aspecto original
        const aspectRatio = width / height
        let newWidth = viewportWidth
        let newHeight = viewportWidth / aspectRatio

        // Si la altura es mayor que el viewport, ajustar por altura
        if (newHeight > viewportHeight) {
          newHeight = viewportHeight
          newWidth = viewportHeight * aspectRatio
        }

        console.log('🖥️ [CanvasRenderer] Ajustando canvas a fullscreen:', {
          viewportWidth,
          viewportHeight,
          newWidth,
          newHeight,
          aspectRatio
        })

        // Ajustar dimensiones del canvas de Fabric.js
        canvas.setDimensions({
          width: newWidth,
          height: newHeight
        })

        // Escalar el canvas y su contenido
        const scale = Math.min(newWidth / width, newHeight / height)
        canvas.setZoom(scale)

        // Ajustar el elemento canvas
        canvasElement.style.width = `${newWidth}px`
        canvasElement.style.height = `${newHeight}px`

        canvas.renderAll()
      } else {
        // En modo normal, ajustar al tamaño del contenedor
        const container = canvasElement.parentElement
        if (!container) return

        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        console.log('📐 [CanvasRenderer] Ajustando canvas a contenedor:', {
          containerWidth,
          containerHeight,
          originalWidth: width,
          originalHeight: height
        })

        // Calcular escala para ajustar al contenedor manteniendo aspecto
        const scaleX = containerWidth / width
        const scaleY = containerHeight / height
        const scale = Math.min(scaleX, scaleY)

        // Calcular dimensiones finales
        const scaledWidth = width * scale
        const scaledHeight = height * scale

        // Ajustar dimensiones del canvas de Fabric.js
        canvas.setDimensions({
          width: scaledWidth,
          height: scaledHeight
        })

        // Escalar el contenido
        canvas.setZoom(scale)

        // Centrar el canvas en el contenedor si es necesario
        canvasElement.style.width = `${scaledWidth}px`
        canvasElement.style.height = `${scaledHeight}px`

        canvas.renderAll()
      }
    }

    resizeCanvas.current = resize

    // Resize inicial con pequeño delay para asegurar que el DOM está listo
    setTimeout(resize, 50)

    // Resize cuando cambia el tamaño de la ventana (solo en modo normal)
    if (!isFullscreen) {
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }
  }, [isFullscreen, width, height, canvasReady])

  useEffect(() => {
    console.log('🔍 [CanvasRenderer] useEffect ejecutándose...')
    console.log('   - canvasRef.current:', !!canvasRef.current)
    console.log('   - fabricLoaded:', fabricLoaded)
    console.log('   - fabricRef.current:', !!fabricRef.current)

    if (!canvasRef.current || !fabricLoaded || !fabricRef.current) {
      console.log('❌ [CanvasRenderer] Condiciones no cumplidas')
      return
    }

    console.log('✅ [CanvasRenderer] Creando canvas...')

    const fabric = fabricRef.current

    try {
      // Crear instancia de canvas en modo ESTÁTICO (solo lectura)
      const canvas = new fabric.StaticCanvas(canvasRef.current, {
        width,
        height,
        renderOnAddRemove: true,
        preserveObjectStacking: true
      })

      fabricCanvasRef.current = canvas
      console.log('✅ [CanvasRenderer] StaticCanvas creado (modo solo lectura)')

      // Cargar datos del canvas si existen
      if (canvasData && canvasData.objects) {
        console.log('📥 [CanvasRenderer] Cargando canvasData...', {
          objectCount: canvasData.objects.length,
          version: canvasData.version,
          firstObject: canvasData.objects[0]
        })

        canvas.loadFromJSON(canvasData, () => {
          const objects = canvas.getObjects()
          console.log('✅ [CanvasRenderer] JSON cargado, forzando renders múltiples...')
          console.log('   - Canvas dimensions:', canvas.width, 'x', canvas.height)
          console.log('   - Canvas background:', canvas.backgroundColor)
          console.log('   - Objetos cargados:', objects.length)

          // Debug: mostrar info de cada objeto
          objects.forEach((obj: any, index: number) => {
            console.log(`   - Objeto ${index}:`, {
              type: obj.type,
              left: obj.left,
              top: obj.top,
              width: obj.width || obj.radius * 2,
              height: obj.height || obj.radius * 2,
              fill: obj.fill,
              visible: obj.visible
            })
          })

          // Estrategia 1: Render inmediato
          canvas.renderAll()
          console.log('   - Render #1 ejecutado')

          // Estrategia 2: Render con requestAnimationFrame
          requestAnimationFrame(() => {
            canvas.renderAll()
            console.log('   - Render #2 (RAF) ejecutado')

            // Estrategia 3: Render con pequeño delay
            setTimeout(() => {
              canvas.renderAll()
              console.log('   - Render #3 (delay) ejecutado')

              // Estrategia 4: Render final y marcar como listo
              setTimeout(() => {
                canvas.renderAll()
                console.log('   - Render #4 (final) ejecutado')
                setCanvasReady(true)
              }, 200)
            }, 50)
          })
        })
      } else {
        console.log('⚠️ [CanvasRenderer] No hay canvasData')
        setCanvasReady(true)
      }

      // Cleanup
      return () => {
        console.log('🧹 [CanvasRenderer] Limpiando canvas...')
        try {
          if (canvas && canvas.dispose) {
            canvas.dispose()
          }
        } catch (error) {
          console.warn('⚠️ [CanvasRenderer] Error en cleanup:', error)
        }
        fabricCanvasRef.current = null
      }
    } catch (error) {
      console.error('❌ [CanvasRenderer] Error:', error)
    }
  }, [canvasData, width, height, fabricLoaded])

  const isReady = fabricLoaded && canvasReady

  console.log('🎨 [CanvasRenderer] Render:', {
    fabricLoaded,
    canvasReady,
    isReady,
    showOverlay: !isReady
  })

  return (
    <div className={`canvas-renderer relative w-full ${isFullscreen ? 'h-screen bg-black' : className ? 'bg-white' : 'bg-black'} ${className}`}>
      {/* Canvas Container - Responsive wrapper */}
      <div
        className={`relative w-full ${isFullscreen ? 'h-full flex items-center justify-center' : ''}`}
        style={isFullscreen ? undefined : { paddingBottom: `${(height / width) * 100}%` }}
      >
        {/* Canvas - ALWAYS rendered */}
        <canvas
          ref={canvasRef}
          className={`${isFullscreen ? 'max-w-full max-h-full' : 'absolute top-0 left-0 w-full h-full'} ${
            className ? 'border-2 border-gray-300 shadow-lg' : ''
          }`}
          style={{ display: 'block', objectFit: 'contain' }}
        />

        {/* Loading Overlay - ENCIMA del canvas */}
        {!isReady && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            className ? 'bg-white bg-opacity-90' : 'bg-black bg-opacity-90'
          }`}>
            <div className="text-center">
              <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-2 ${
                className ? 'text-blue-600' : 'text-white'
              }`} />
              <p className={`text-sm font-medium ${
                className ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {!fabricLoaded ? 'Cargando Fabric.js...' : 'Renderizando canvas...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
