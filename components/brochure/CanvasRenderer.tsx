'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CanvasRendererProps {
  canvasData: any
  width?: number
  height?: number
  className?: string
}

/**
 * CanvasRenderer - Componente para renderizar canvas de Fabric.js en modo solo lectura
 * Usado en la vista pública de brochures
 */
export function CanvasRenderer({
  canvasData,
  width = 1200,
  height = 800,
  className = ''
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
      fabricRef.current = fabricModule.fabric || fabricModule
      setFabricLoaded(true)
    }).catch((error) => {
      console.error('❌ [CanvasRenderer] Error cargando Fabric.js:', error)
    })
  }, [])

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
    <div className={`canvas-renderer relative w-full bg-white ${className}`}>
      {/* Canvas Container - Responsive wrapper */}
      <div className="relative w-full" style={{ paddingBottom: `${(height / width) * 100}%` }}>
        {/* Canvas - ALWAYS rendered */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full border-2 border-gray-300 shadow-lg"
          style={{ display: 'block' }}
        />

        {/* Loading Overlay - ENCIMA del canvas */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {!fabricLoaded ? 'Cargando Fabric.js...' : 'Renderizando canvas...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
