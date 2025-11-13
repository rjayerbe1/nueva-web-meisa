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
  Upload,
  FileText,
  Loader2,
  X,
  Check
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// PDF.js se importará dinámicamente para evitar problemas de SSR

interface PDFPage {
  pageNumber: number
  thumbnail: string
  width: number
  height: number
}

interface PDFSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPage: (imageDataUrl: string) => void
}

export function PDFSelectorModal({
  isOpen,
  onClose,
  onSelectPage,
}: PDFSelectorModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([])
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null)

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
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFileSelected(files[0])
    } else {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor selecciona un archivo PDF',
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

  // Función para cargar PDF.js desde CDN
  const loadPdfJs = async () => {
    // @ts-ignore - window.pdfjsLib se cargará desde CDN
    if (window.pdfjsLib) {
      // @ts-ignore
      return window.pdfjsLib
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs'
      script.type = 'module'
      script.onload = () => {
        // @ts-ignore
        if (window.pdfjsLib) {
          // @ts-ignore
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'
          // @ts-ignore
          resolve(window.pdfjsLib)
        } else {
          reject(new Error('PDF.js no se cargó correctamente'))
        }
      }
      script.onerror = () => reject(new Error('Error cargando PDF.js'))
      document.head.appendChild(script)
    })
  }

  const handleFileSelected = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Archivo inválido',
        description: 'Solo se permiten archivos PDF',
        variant: 'destructive'
      })
      return
    }

    setPdfFile(file)
    setLoading(true)
    setPdfPages([])
    setSelectedPageIndex(null)

    try {
      // Cargar PDF.js desde CDN
      const pdfjsLib = await loadPdfJs()

      // Leer el archivo PDF
      const arrayBuffer = await file.arrayBuffer()
      // @ts-ignore
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      console.log(`📄 [PDF] Archivo cargado: ${pdf.numPages} páginas`)

      const pages: PDFPage[] = []

      // Generar thumbnails para cada página
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 0.5 })

        // Crear canvas para el thumbnail
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        // Renderizar página en el canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        // Convertir a imagen
        const thumbnail = canvas.toDataURL('image/png')

        pages.push({
          pageNumber: pageNum,
          thumbnail,
          width: viewport.width,
          height: viewport.height
        })
      }

      setPdfPages(pages)
      console.log(`✅ [PDF] ${pages.length} páginas procesadas`)
    } catch (error) {
      console.error('❌ [PDF] Error procesando PDF:', error)
      toast({
        title: 'Error',
        description: 'No se pudo procesar el archivo PDF',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPage = async () => {
    if (selectedPageIndex === null || !pdfFile) return

    setLoading(true)

    try {
      // Cargar PDF.js desde CDN
      const pdfjsLib = await loadPdfJs()

      const arrayBuffer = await pdfFile.arrayBuffer()
      // @ts-ignore
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(selectedPageIndex + 1)

      // Renderizar a tamaño completo (escala 2 para mejor calidad)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      const imageDataUrl = canvas.toDataURL('image/png')

      console.log(`✅ [PDF] Página ${selectedPageIndex + 1} seleccionada`)

      onSelectPage(imageDataUrl)
      handleClose()
    } catch (error) {
      console.error('❌ [PDF] Error al seleccionar página:', error)
      toast({
        title: 'Error',
        description: 'No se pudo procesar la página seleccionada',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPdfFile(null)
    setPdfPages([])
    setSelectedPageIndex(null)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar PDF</DialogTitle>
          <DialogDescription>
            Selecciona un archivo PDF y elige la página que deseas agregar al canvas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!pdfFile ? (
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
              <FileText className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arrastra un archivo PDF aquí
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar
              </p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button asChild>
                  <span>Seleccionar PDF</span>
                </Button>
              </label>
              <p className="text-xs text-gray-400 mt-4">
                Formato: PDF - Máx 50MB
              </p>
            </div>
          ) : loading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                Procesando PDF...
              </p>
            </div>
          ) : (
            /* Pages grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">{pdfFile.name}</p>
                  <p className="text-sm text-gray-500">{pdfPages.length} página{pdfPages.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null)
                    setPdfPages([])
                    setSelectedPageIndex(null)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {pdfPages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPageIndex(index)}
                    className={`relative aspect-[8.5/11] rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedPageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={page.thumbnail}
                      alt={`Página ${page.pageNumber}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium text-center">
                        Página {page.pageNumber}
                      </p>
                    </div>
                    {selectedPageIndex === index && (
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
        {pdfFile && pdfPages.length > 0 && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSelectPage}
              disabled={selectedPageIndex === null || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Agregar al Canvas'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
