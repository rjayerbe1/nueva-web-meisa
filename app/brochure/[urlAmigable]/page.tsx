'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Download, Maximize, Minimize } from 'lucide-react'
import { ComponentRenderer } from '@/components/brochure/ComponentRenderer'
import { CanvasRenderer } from '@/components/brochure/CanvasRenderer'

interface BrochurePage {
  id: string
  nombre: string
  orden: number
  contenido: any
  componentesData: any
  canvasData?: any
  configuracion?: any
  visible: boolean
}

interface Template {
  id: string
  nombre: string
  estructura: any
  componentsLibrary: any
  estilosGlobales: any
  pages: Array<{
    id: string
    nombre: string
    orden: number
    estructura: any
    estilos: any
  }>
}

interface Brochure {
  id: string
  titulo: string
  descripcion: string | null
  urlAmigable: string
  thumbnail: string | null
  contenido: any
  datosPersonalizados: any
  configuracion: any
  template: Template
  categoria: {
    id: string
    nombre: string
    slug: string
    key: string
  } | null
  pages: BrochurePage[]
}

export default function BrochureViewerPage() {
  const params = useParams()
  const [brochure, setBrochure] = useState<Brochure | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const urlAmigable = params.urlAmigable as string

    if (!urlAmigable) return

    const fetchBrochure = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/brochures/by-url/${urlAmigable}`)

        if (!response.ok) {
          throw new Error('Brochure no encontrado')
        }

        const data = await response.json()
        setBrochure(data)

      } catch (error) {
        console.error('Error fetching brochure:', error)
        setError('Error al cargar el brochure digital')
      } finally {
        setLoading(false)
      }
    }

    fetchBrochure()
  }, [params.urlAmigable])

  const goToNextPage = () => {
    if (brochure && currentPage < brochure.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const downloadAsPDF = async () => {
    if (!brochure || isGeneratingPDF) return

    try {
      setIsGeneratingPDF(true)
      console.log('📄 [PDF] Iniciando generación de PDF...')

      // Importar jsPDF dinámicamente
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      const visiblePages = brochure.pages.filter(page => page.visible)

      // Crear PDF con orientación landscape para páginas de brochure
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      })

      console.log(`📄 [PDF] Procesando ${visiblePages.length} páginas...`)

      for (let i = 0; i < visiblePages.length; i++) {
        const page = visiblePages[i]
        console.log(`📄 [PDF] Procesando página ${i + 1}/${visiblePages.length}: ${page.nombre}`)

        // Si no es la primera página, agregar nueva página
        if (i > 0) {
          pdf.addPage()
        }

        try {
          let imageData: string

          if (page.canvasData) {
            // Método 1: Para páginas con canvas (más eficiente)
            console.log(`  📐 [PDF] Página usa canvas, buscando elemento...`)

            // Buscar el canvas en el DOM
            const canvasElements = document.querySelectorAll('canvas')
            let targetCanvas: HTMLCanvasElement | null = null

            // Si estamos viendo esta página actualmente, usar el canvas visible
            if (i === currentPage && canvasElements.length > 0) {
              targetCanvas = canvasElements[0] as HTMLCanvasElement
              console.log(`  ✅ [PDF] Canvas encontrado en página actual`)
            } else {
              // Si no es la página actual, necesitamos renderizarla temporalmente
              console.log(`  ⏭️ [PDF] Página no visible, cambiando a página ${i + 1}`)
              setCurrentPage(i)

              // Esperar a que se renderice la página
              await new Promise(resolve => setTimeout(resolve, 1000))

              const updatedCanvasElements = document.querySelectorAll('canvas')
              if (updatedCanvasElements.length > 0) {
                targetCanvas = updatedCanvasElements[0] as HTMLCanvasElement
                console.log(`  ✅ [PDF] Canvas renderizado`)
              }
            }

            if (targetCanvas) {
              imageData = targetCanvas.toDataURL('image/jpeg', 0.8)
              console.log(`  ✅ [PDF] Imagen capturada desde canvas`)
            } else {
              console.warn(`  ⚠️ [PDF] No se encontró canvas, usando html2canvas como fallback`)
              const pageElement = document.querySelector('.canvas-renderer')
              if (pageElement) {
                const canvas = await html2canvas(pageElement as HTMLElement, {
                  scale: 1.5,
                  useCORS: true,
                  logging: false
                })
                imageData = canvas.toDataURL('image/jpeg', 0.8)
              } else {
                throw new Error('No se pudo capturar la página')
              }
            }
          } else {
            // Método 2: Para páginas con ComponentRenderer (legacy)
            console.log(`  📦 [PDF] Página usa ComponentRenderer, capturando HTML...`)

            // Cambiar a la página si no estamos en ella
            if (i !== currentPage) {
              setCurrentPage(i)
              await new Promise(resolve => setTimeout(resolve, 500))
            }

            const pageElement = document.querySelector('.bg-white.text-gray-900')
            if (!pageElement) {
              throw new Error('No se encontró el elemento de la página')
            }

            const canvas = await html2canvas(pageElement as HTMLElement, {
              scale: 1.5,
              useCORS: true,
              logging: false
            })
            imageData = canvas.toDataURL('image/jpeg', 0.8)
            console.log(`  ✅ [PDF] HTML capturado con html2canvas`)
          }

          // Obtener dimensiones del PDF
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()

          // Agregar imagen al PDF manteniendo aspecto
          pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
          console.log(`  ✅ [PDF] Página ${i + 1} agregada al PDF`)

        } catch (pageError) {
          console.error(`  ❌ [PDF] Error procesando página ${i + 1}:`, pageError)
          // Continuar con las demás páginas
        }
      }

      // Generar nombre de archivo
      const fileName = `${brochure.titulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`

      // Descargar PDF
      pdf.save(fileName)
      console.log(`✅ [PDF] PDF generado y descargado: ${fileName}`)

    } catch (error) {
      console.error('❌ [PDF] Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage()
      if (e.key === 'ArrowLeft') goToPreviousPage()
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isFullscreen, brochure])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Cargando brochure digital...</p>
        </div>
      </div>
    )
  }

  if (error || !brochure) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Brochure no encontrado</h1>
          <p className="text-gray-400 mb-6">{error || 'El brochure solicitado no existe o no está disponible'}</p>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
        </div>
      </div>
    )
  }

  const visiblePages = brochure.pages.filter(page => page.visible)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Oculto en pantalla completa */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 transition-opacity ${
        isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={brochure.categoria ? `/proyectos/categoria/${brochure.categoria.slug}` : '/proyectos'}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{brochure.titulo}</h1>
                {brochure.categoria && (
                  <p className="text-sm text-gray-400">{brochure.categoria.nombre}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Page Counter */}
              <div className="text-sm text-gray-400">
                Página {currentPage + 1} de {visiblePages.length}
              </div>

              {/* Download PDF Button */}
              <button
                onClick={downloadAsPDF}
                disabled={isGeneratingPDF}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
              >
                {isGeneratingPDF ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Botón flotante para salir de pantalla completa */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 p-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-lg transition-colors"
          title="Salir de pantalla completa"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Main Viewer */}
      <div className={`min-h-screen ${isFullscreen ? 'p-0' : 'pt-24 pb-8 px-4'}`}>
        <div className={isFullscreen ? 'w-full h-screen' : 'max-w-6xl mx-auto'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`${
                isFullscreen
                  ? 'w-full h-full'
                  : 'bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden'
              }`}
              style={isFullscreen ? { minHeight: '100vh' } : { minHeight: '70vh' }}
            >
              {/* Page Content */}
              <div className={isFullscreen ? 'w-full h-full' : 'bg-gray-100'}>
                {visiblePages[currentPage] ? (
                  <>
                    {/* Si tiene canvasData, usar CanvasRenderer (nuevo sistema visual) */}
                    {visiblePages[currentPage].canvasData ? (
                      <CanvasRenderer
                        canvasData={visiblePages[currentPage].canvasData}
                        width={visiblePages[currentPage].configuracion?.width || 1200}
                        height={visiblePages[currentPage].configuracion?.height || 800}
                        className={isFullscreen ? '' : 'shadow-lg'}
                        isFullscreen={isFullscreen}
                      />
                    ) : (
                      /* Fallback a ComponentRenderer para brochures antiguos */
                      <div className="p-12">
                        <ComponentRenderer
                          contenido={visiblePages[currentPage].contenido}
                          componentesData={visiblePages[currentPage].componentesData}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No hay contenido para mostrar en esta página</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls - Flotantes en pantalla completa */}
          <div className={`flex items-center justify-between ${
            isFullscreen
              ? 'fixed bottom-8 left-0 right-0 z-50 px-8'
              : 'mt-8'
          }`}>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-6 py-3 ${
                isFullscreen
                  ? 'bg-black/70 hover:bg-black/90 backdrop-blur-sm'
                  : 'bg-gray-800 hover:bg-gray-700'
              } text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="w-5 h-5" />
              {!isFullscreen && 'Anterior'}
            </button>

            {/* Page Dots */}
            <div className={`flex items-center gap-2 ${
              isFullscreen ? 'bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg' : ''
            }`}>
              {visiblePages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage
                      ? 'w-8 bg-blue-600'
                      : isFullscreen
                        ? 'bg-gray-400 hover:bg-gray-300'
                        : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === visiblePages.length - 1}
              className={`flex items-center gap-2 px-6 py-3 ${
                isFullscreen
                  ? 'bg-black/70 hover:bg-black/90 backdrop-blur-sm'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {!isFullscreen && 'Siguiente'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
