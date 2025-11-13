'use client'

import { useEffect, useRef } from 'react'

export default function TestStaticCanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let canvas: any = null

    import('fabric').then((fabricModule) => {
      const fabric = fabricModule.fabric || fabricModule

      canvas = new fabric.StaticCanvas(canvasRef.current!, {
        width: 800,
        height: 600,
        backgroundColor: '#f0f0f0'
      })

      // Crear un rectángulo azul
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 150,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 3
      })

      // Crear texto
      const text = new fabric.IText('StaticCanvas Test', {
        left: 400,
        top: 250,
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#1f2937'
      })

      // Crear círculo
      const circle = new fabric.Circle({
        left: 500,
        top: 100,
        radius: 60,
        fill: '#10b981',
        stroke: '#059669',
        strokeWidth: 3
      })

      canvas.add(rect, text, circle)
      canvas.renderAll()

      console.log('✅ StaticCanvas test creado con', canvas.getObjects().length, 'objetos')
    })

    // Cleanup
    return () => {
      if (canvas) {
        console.log('🧹 Limpiando canvas de prueba')
        canvas.dispose()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test: StaticCanvas
        </h1>
        <p className="text-gray-600 mb-6">
          Si ves un rectángulo azul, texto y un círculo verde, StaticCanvas funciona correctamente.
        </p>
        <div className="border-4 border-gray-300 inline-block">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}
