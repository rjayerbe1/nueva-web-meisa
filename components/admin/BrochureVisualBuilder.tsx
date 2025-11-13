'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Save,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  GripVertical,
  FileText,
  Loader2,
  Layout,
  Download,
  Upload,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FabricCanvasEditor } from '@/components/brochure/FabricCanvasEditor'
import { SaveAsTemplateModal } from '@/components/admin/SaveAsTemplateModal'
import * as fabric from 'fabric'
import { PPTXSlide } from '@/lib/pptxProcessor'

interface Page {
  id: string
  nombre: string
  orden: number
  canvasData?: any  // JSON de Fabric.js
  contenido?: any   // Legacy - para compatibilidad
  componentesData?: any
  configuracion?: any
  visible: boolean
}

interface Brochure {
  id: string
  titulo: string
  urlAmigable: string
  pages: Page[]
  template: {
    nombre: string
  }
  categoria: {
    nombre: string
  } | null
}

interface BrochureVisualBuilderProps {
  brochure: Brochure
}

// Helper functions for creating shapes from PPTX

// Helper: Generate regular polygon points
function generatePolygonPoints(sides: number, radius: number) {
  const points = []
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    })
  }
  return points
}

// Helper: Generate star points
function generateStarPoints(points: number, outerRadius: number, innerRadius: number) {
  const starPoints = []
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i * Math.PI) / points - Math.PI / 2
    starPoints.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    })
  }
  return starPoints
}

// Helper: Create polygon shape (pentagon, hexagon, octagon, etc.)
function createPolygon(left: number, top: number, width: number, height: number, sides: number, props: any) {
  const radius = Math.min(width, height) / 2
  const centerX = left + width / 2
  const centerY = top + height / 2

  const polygonPoints = generatePolygonPoints(sides, radius)
  const adjustedPoints = polygonPoints.map((point: any) => ({
    x: centerX + point.x,
    y: centerY + point.y
  }))

  return new fabric.Polygon(adjustedPoints, {
    ...props,
    left: centerX - radius,
    top: centerY - radius,
    originX: 'center',
    originY: 'center'
  })
}

// Helper: Create arrow shape
function createArrow(left: number, top: number, width: number, height: number, direction: 'right' | 'left' | 'up' | 'down', props: any) {
  // Arrow proportions
  const shaftWidth = direction === 'up' || direction === 'down' ? width * 0.4 : height * 0.4
  const headLength = direction === 'up' || direction === 'down' ? height * 0.3 : width * 0.3

  let points: any[] = []

  switch (direction) {
    case 'right':
      points = [
        { x: left, y: top + (height - shaftWidth) / 2 },
        { x: left + width - headLength, y: top + (height - shaftWidth) / 2 },
        { x: left + width - headLength, y: top },
        { x: left + width, y: top + height / 2 },
        { x: left + width - headLength, y: top + height },
        { x: left + width - headLength, y: top + (height + shaftWidth) / 2 },
        { x: left, y: top + (height + shaftWidth) / 2 }
      ]
      break
    case 'left':
      points = [
        { x: left + width, y: top + (height - shaftWidth) / 2 },
        { x: left + headLength, y: top + (height - shaftWidth) / 2 },
        { x: left + headLength, y: top },
        { x: left, y: top + height / 2 },
        { x: left + headLength, y: top + height },
        { x: left + headLength, y: top + (height + shaftWidth) / 2 },
        { x: left + width, y: top + (height + shaftWidth) / 2 }
      ]
      break
    case 'up':
      points = [
        { x: left + (width - shaftWidth) / 2, y: top + height },
        { x: left + (width - shaftWidth) / 2, y: top + headLength },
        { x: left, y: top + headLength },
        { x: left + width / 2, y: top },
        { x: left + width, y: top + headLength },
        { x: left + (width + shaftWidth) / 2, y: top + headLength },
        { x: left + (width + shaftWidth) / 2, y: top + height }
      ]
      break
    case 'down':
      points = [
        { x: left + (width - shaftWidth) / 2, y: top },
        { x: left + (width - shaftWidth) / 2, y: top + height - headLength },
        { x: left, y: top + height - headLength },
        { x: left + width / 2, y: top + height },
        { x: left + width, y: top + height - headLength },
        { x: left + (width + shaftWidth) / 2, y: top + height - headLength },
        { x: left + (width + shaftWidth) / 2, y: top }
      ]
      break
  }

  return new fabric.Polygon(points, props)
}

// Helper: Create heart shape
function createHeart(left: number, top: number, width: number, height: number, props: any) {
  const centerX = left + width / 2
  const topY = top + height * 0.3

  const path = `M ${centerX} ${topY}
    C ${centerX} ${topY}, ${centerX - width/4} ${top}, ${centerX - width/2} ${top + height * 0.25}
    C ${centerX - width/2} ${top + height * 0.4}, ${centerX - width/2} ${top + height * 0.5}, ${centerX} ${top + height}
    C ${centerX + width/2} ${top + height * 0.5}, ${centerX + width/2} ${top + height * 0.4}, ${centerX + width/2} ${top + height * 0.25}
    C ${centerX + width/4} ${top}, ${centerX} ${topY}, ${centerX} ${topY} Z`

  return new fabric.Path(path, {
    ...props,
    left,
    top
  })
}

// Helper: Create plus/cross shape
function createPlus(left: number, top: number, width: number, height: number, props: any) {
  const thickness = Math.min(width, height) * 0.25

  const points = [
    { x: left + (width - thickness) / 2, y: top },
    { x: left + (width + thickness) / 2, y: top },
    { x: left + (width + thickness) / 2, y: top + (height - thickness) / 2 },
    { x: left + width, y: top + (height - thickness) / 2 },
    { x: left + width, y: top + (height + thickness) / 2 },
    { x: left + (width + thickness) / 2, y: top + (height + thickness) / 2 },
    { x: left + (width + thickness) / 2, y: top + height },
    { x: left + (width - thickness) / 2, y: top + height },
    { x: left + (width - thickness) / 2, y: top + (height + thickness) / 2 },
    { x: left, y: top + (height + thickness) / 2 },
    { x: left, y: top + (height - thickness) / 2 },
    { x: left + (width - thickness) / 2, y: top + (height - thickness) / 2 }
  ]

  return new fabric.Polygon(points, props)
}

// Helper: Create house shape
function createHouse(left: number, top: number, width: number, height: number, props: any) {
  const roofHeight = height * 0.4

  const points = [
    // Roof
    { x: left + width / 2, y: top },
    { x: left + width, y: top + roofHeight },
    { x: left + width, y: top + roofHeight },
    // Right wall
    { x: left + width, y: top + height },
    // Bottom
    { x: left, y: top + height },
    // Left wall
    { x: left, y: top + roofHeight },
    // Back to roof peak
    { x: left + width / 2, y: top }
  ]

  return new fabric.Polygon(points, props)
}

// SortablePageItem component for drag and drop
interface SortablePageItemProps {
  page: Page
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function SortablePageItem({ page, isSelected, onSelect, onDelete }: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 p-3 rounded-lg border transition-colors cursor-pointer ${
        isSelected
          ? 'bg-blue-50 border-blue-300 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <Layout className="w-4 h-4 text-gray-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {page.nombre}
        </p>
        <p className="text-xs text-gray-500">Página {page.orden + 1}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded transition-opacity"
        title="Eliminar página"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function BrochureVisualBuilder({ brochure }: BrochureVisualBuilderProps) {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>(brochure.pages)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(
    pages.length > 0 ? pages[0].id : null
  )
  const [saving, setSaving] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentCanvasInstance, setCurrentCanvasInstance] = useState<fabric.Canvas | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)

  // Ref para el timeout de auto-guardado (debouncing)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Configure sensors for @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const selectedPage = pages.find(p => p.id === selectedPageId)

  const handleAddPage = () => {
    const newPage: Page = {
      id: `temp-${Date.now()}`,
      nombre: `Nueva Página ${pages.length + 1}`,
      orden: pages.length,
      canvasData: null,
      contenido: {},
      componentesData: {},
      configuracion: {
        width: 1200,
        height: 800
      },
      visible: true
    }
    setPages([...pages, newPage])
    setSelectedPageId(newPage.id)
  }

  const handleAddPagesFromPPTX = async (slides: PPTXSlide[]) => {
    console.log(`📊 [PPTX] Agregando ${slides.length} diapositivas como páginas nuevas...`)

    // Crear canvas temporal para convertir elementos a JSON
    const tempCanvas = new fabric.Canvas(null as any, {
      width: slides[0]?.width || 1200,
      height: slides[0]?.height || 800
    })

    const newPages: Page[] = []

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      // Limpiar canvas temporal y ajustar al tamaño del slide
      tempCanvas.clear()
      tempCanvas.setWidth(slide.width)
      tempCanvas.setHeight(slide.height)

      console.log(`📊 [PPTX] Procesando slide ${i + 1}: ${slide.width}x${slide.height} con ${slide.elements.length} elementos`)

      // Agregar cada elemento al canvas temporal
      // Las posiciones ya vienen en píxeles del PPTX, no necesitan escala aquí
      // porque el canvas temporal tiene el mismo tamaño que el slide
      for (const element of slide.elements) {
        try {
          if (element.type === 'image' && element.imageData) {
            const img = await fabric.Image.fromURL(element.imageData, {
              crossOrigin: 'anonymous'
            })

            // Usar escala uniforme para mantener relación de aspecto
            const uniformScale = Math.min(
              element.position.width / (img.width || 1),
              element.position.height / (img.height || 1)
            )

            img.set({
              left: element.position.x,
              top: element.position.y,
              scaleX: uniformScale,
              scaleY: uniformScale
            })

            console.log(`🖼️ [PPTX] Imagen agregada: ${element.position.x}, ${element.position.y} (escala uniforme: ${uniformScale.toFixed(3)})`)
            tempCanvas.add(img)
          } else if (element.type === 'text' && element.content) {
            const text = new fabric.Textbox(element.content, {
              left: element.position.x,
              top: element.position.y,
              width: element.position.width,
              fontSize: element.style?.fontSize || 16,
              fill: element.style?.color || '#000000',
              fontFamily: element.style?.fontFamily || 'Arial'
            })

            console.log(`📝 [PPTX] Texto agregado: "${element.content.substring(0, 30)}"`)
            tempCanvas.add(text)
          } else if (element.type === 'shape') {
            let shape: any

            // Las formas mantienen sus dimensiones originales del PPTX
            // ya que el canvas temporal tiene el mismo tamaño que el slide
            const commonProps = {
              fill: element.style?.fill || '#cccccc',
              stroke: element.style?.stroke,
              strokeWidth: element.style?.strokeWidth || 0
            }

            // Mapear tipos de formas de PowerPoint a Fabric.js
            switch (element.shapeType) {
              case 'rect':
              case 'roundRect':
                shape = new fabric.Rect({
                  left: element.position.x,
                  top: element.position.y,
                  width: element.position.width,
                  height: element.position.height,
                  rx: element.shapeType === 'roundRect' ? 10 : 0,
                  ry: element.shapeType === 'roundRect' ? 10 : 0,
                  ...commonProps
                })
                break

              case 'ellipse':
              case 'circle':
                shape = new fabric.Ellipse({
                  left: element.position.x,
                  top: element.position.y,
                  rx: element.position.width / 2,
                  ry: element.position.height / 2,
                  ...commonProps
                })
                break

              case 'triangle':
                shape = new fabric.Triangle({
                  left: element.position.x,
                  top: element.position.y,
                  width: element.position.width,
                  height: element.position.height,
                  ...commonProps
                })
                break

              case 'line':
                shape = new fabric.Line([
                  element.position.x, element.position.y,
                  element.position.x + element.position.width,
                  element.position.y + element.position.height
                ], {
                  ...commonProps,
                  fill: undefined
                })
                break

              // Stars
              case 'star':
              case 'star5':
              case 'star6':
              case 'star7':
              case 'star8':
                const starPoints = element.shapeType === 'star' ? 5 :
                              parseInt(element.shapeType.replace('star', '')) || 5
                const starRadius = Math.min(element.position.width, element.position.height) / 2
                const innerRadius = starRadius * 0.5
                const starPointsArray = generateStarPoints(starPoints, starRadius, innerRadius)
                const centerX = element.position.x + element.position.width / 2
                const centerY = element.position.y + element.position.height / 2

                shape = new fabric.Polygon(
                  starPointsArray.map((p: any) => ({ x: centerX + p.x, y: centerY + p.y })),
                  {
                    ...commonProps,
                    left: centerX - starRadius,
                    top: centerY - starRadius,
                    originX: 'center',
                    originY: 'center'
                  }
                )
                break

              // Polygons
              case 'pentagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 5, commonProps)
                break

              case 'hexagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 6, commonProps)
                break

              case 'heptagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 7, commonProps)
                break

              case 'octagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 8, commonProps)
                break

              case 'decagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 10, commonProps)
                break

              case 'dodecagon':
                shape = createPolygon(element.position.x, element.position.y,
                                     element.position.width, element.position.height, 12, commonProps)
                break

              // Arrows
              case 'rightArrow':
              case 'arrow':
                shape = createArrow(element.position.x, element.position.y,
                                   element.position.width, element.position.height, 'right', commonProps)
                break

              case 'leftArrow':
                shape = createArrow(element.position.x, element.position.y,
                                   element.position.width, element.position.height, 'left', commonProps)
                break

              case 'upArrow':
                shape = createArrow(element.position.x, element.position.y,
                                   element.position.width, element.position.height, 'up', commonProps)
                break

              case 'downArrow':
                shape = createArrow(element.position.x, element.position.y,
                                   element.position.width, element.position.height, 'down', commonProps)
                break

              // Plus/Cross
              case 'plus':
              case 'mathPlus':
                shape = createPlus(element.position.x, element.position.y,
                                  element.position.width, element.position.height, commonProps)
                break

              // Heart
              case 'heart':
                shape = createHeart(element.position.x, element.position.y,
                                   element.position.width, element.position.height, commonProps)
                break

              // House
              case 'homePlate':
              case 'house':
                shape = createHouse(element.position.x, element.position.y,
                                   element.position.width, element.position.height, commonProps)
                break

              default:
                // Para formas no reconocidas (incluyendo iconos), usar rectángulo
                console.log(`⚠️ [PPTX] Forma desconocida "${element.shapeType}", renderizando como rectángulo`)
                shape = new fabric.Rect({
                  left: element.position.x,
                  top: element.position.y,
                  width: element.position.width,
                  height: element.position.height,
                  ...commonProps
                })
            }

            if (shape) {
              console.log(`📐 [PPTX] Forma "${element.shapeType}" agregada: ${element.position.x.toFixed(1)}, ${element.position.y.toFixed(1)} (${element.position.width.toFixed(1)}x${element.position.height.toFixed(1)})`)
              tempCanvas.add(shape)
            }
          }
        } catch (error) {
          console.error(`❌ [PPTX] Error agregando elemento:`, error)
        }
      }

      // Obtener JSON del canvas
      const canvasData = tempCanvas.toJSON()

      const newPage: Page = {
        id: `temp-${Date.now()}-${i}`,
        nombre: `Diapositiva ${slide.slideNumber}`,
        orden: pages.length + i,
        canvasData,
        contenido: {},
        componentesData: {},
        configuracion: {
          width: slide.width,
          height: slide.height
        },
        visible: true
      }

      newPages.push(newPage)
      console.log(`✅ [PPTX] Página ${i + 1} creada: ${slide.width}x${slide.height}`)
    }

    // Agregar todas las páginas nuevas
    setPages([...pages, ...newPages])

    // Seleccionar la primera página nueva
    if (newPages.length > 0) {
      setSelectedPageId(newPages[0].id)
    }

    console.log(`✅ [PPTX] ${newPages.length} páginas agregadas exitosamente`)
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('¿Eliminar esta página?')) return

    try {
      // Si la página existe en la base de datos (no es temporal), eliminarla
      if (!pageId.startsWith('temp-')) {
        const response = await fetch(`/api/admin/brochures/${brochure.id}/pages/${pageId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Error al eliminar la página del servidor')
        }

        console.log('✅ Página eliminada del servidor:', pageId)
      }

      // Actualizar estado local
      const newPages = pages.filter(p => p.id !== pageId)
      setPages(newPages)

      // Cambiar selección si es necesario
      if (selectedPageId === pageId && newPages.length > 0) {
        setSelectedPageId(newPages[0].id)
      }

      console.log('✅ Página eliminada localmente')
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error al eliminar la página')
    }
  }

  const handleUpdatePage = (pageId: string, updates: Partial<Page>) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, ...updates } : p))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setPages((pages) => {
      const oldIndex = pages.findIndex((p) => p.id === active.id)
      const newIndex = pages.findIndex((p) => p.id === over.id)

      const reorderedPages = arrayMove(pages, oldIndex, newIndex)

      // Update orden property
      return reorderedPages.map((page, index) => ({
        ...page,
        orden: index
      }))
    })
  }

  const handleCanvasSave = async (canvasData: any, canvasInstance?: fabric.Canvas, immediate: boolean = false) => {
    if (!selectedPage) return

    // Guardar instancia del canvas si está disponible
    if (canvasInstance) {
      setCurrentCanvasInstance(canvasInstance)
    }

    // NO actualizar estado local para evitar re-renders infinitos
    // El estado local solo se actualiza con "Guardar Todo"

    // Cancelar cualquier guardado pendiente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Si es guardado inmediato (botón "Guardar"), guardar sin debounce
    if (immediate) {
      if (!selectedPage.id.startsWith('temp-')) {
        try {
          const pageData = {
            nombre: selectedPage.nombre,
            orden: selectedPage.orden,
            canvasData: canvasData,
            contenido: selectedPage.contenido || {},
            componentesData: selectedPage.componentesData || {},
            configuracion: selectedPage.configuracion || { width: 1200, height: 800 },
            visible: selectedPage.visible
          }

          const response = await fetch(`/api/admin/brochures/${brochure.id}/pages/${selectedPage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
          })

          if (!response.ok) {
            throw new Error('Error al guardar la página')
          }

          console.log('✅ Página guardada manualmente')

          // Si es la primera página, generar thumbnail automáticamente
          if (selectedPage.orden === 0 && currentCanvasInstance) {
            try {
              console.log('🖼️ Generando thumbnail automático para la primera página...')

              // Capturar el canvas como data URL
              const dataUrl = currentCanvasInstance.toDataURL({
                format: 'png',
                quality: 0.8,
                multiplier: 0.5 // Reducir tamaño para optimizar
              })

              // Enviar al endpoint de generación de thumbnail
              const thumbnailResponse = await fetch(`/api/admin/brochures/${brochure.id}/generate-thumbnail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ thumbnailDataUrl: dataUrl })
              })

              if (thumbnailResponse.ok) {
                const result = await thumbnailResponse.json()
                console.log('✅ Thumbnail generado automáticamente:', result.thumbnail)
              } else {
                console.warn('⚠️ No se pudo generar el thumbnail automático')
              }
            } catch (thumbError) {
              console.error('Error generando thumbnail:', thumbError)
              // No detener el flujo principal si falla el thumbnail
            }
          }
        } catch (error) {
          console.error('Error saving page:', error)
          throw error // Re-throw para que el spinner se maneje correctamente
        }
      }
    } else {
      // Auto-save con debounce
      if (!selectedPage.id.startsWith('temp-')) {
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            const pageData = {
              nombre: selectedPage.nombre,
              orden: selectedPage.orden,
              canvasData: canvasData,
              contenido: selectedPage.contenido || {},
              componentesData: selectedPage.componentesData || {},
              configuracion: selectedPage.configuracion || { width: 1200, height: 800 },
              visible: selectedPage.visible
            }

            const response = await fetch(`/api/admin/brochures/${brochure.id}/pages/${selectedPage.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(pageData)
            })

            if (!response.ok) {
              throw new Error('Error al guardar la página')
            }

            console.log('✅ Página auto-guardada en el servidor')

            // Si es la primera página, generar thumbnail automáticamente
            if (selectedPage.orden === 0 && currentCanvasInstance) {
              try {
                console.log('🖼️ Generando thumbnail automático (auto-save)...')

                const dataUrl = currentCanvasInstance.toDataURL({
                  format: 'png',
                  quality: 0.8,
                  multiplier: 0.5
                })

                const thumbnailResponse = await fetch(`/api/admin/brochures/${brochure.id}/generate-thumbnail`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ thumbnailDataUrl: dataUrl })
                })

                if (thumbnailResponse.ok) {
                  console.log('✅ Thumbnail regenerado automáticamente')
                }
              } catch (thumbError) {
                console.error('Error generando thumbnail:', thumbError)
              }
            }
          } catch (error) {
            console.error('Error auto-saving page:', error)
            // No mostrar alert para auto-save, solo log
          }
        }, 1500) // 1.5 segundos de debounce
      }
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/page-templates?public=true')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const handleLoadTemplate = async (template: any) => {
    if (!selectedPage) return

    handleUpdatePage(selectedPage.id, {
      canvasData: template.canvasData,
      configuracion: template.configuracion
    })

    setShowTemplateModal(false)
    alert('✅ Plantilla cargada exitosamente')
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Obtener datos actuales del canvas si existe
      let currentCanvasData = null
      if (currentCanvasInstance && selectedPage) {
        currentCanvasData = currentCanvasInstance.toJSON()
      }

      for (const page of pages) {
        const isNewPage = page.id.startsWith('temp-')

        // Si es la página seleccionada, usar los datos actuales del canvas
        const canvasData = (selectedPage && page.id === selectedPage.id && currentCanvasData)
          ? currentCanvasData
          : (page.canvasData || {})

        const pageData = {
          nombre: page.nombre,
          orden: page.orden,
          canvasData: canvasData,
          contenido: page.contenido || {},
          componentesData: page.componentesData || {},
          configuracion: page.configuracion || { width: 1200, height: 800 },
          visible: page.visible
        }

        if (isNewPage) {
          await fetch(`/api/admin/brochures/${brochure.id}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
          })
        } else {
          await fetch(`/api/admin/brochures/${brochure.id}/pages/${page.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
          })
        }
      }

      alert('✅ Brochure guardado exitosamente')
      router.refresh()
    } catch (error) {
      console.error('Error saving:', error)
      alert('❌ Error al guardar el brochure')
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (isGeneratingPDF || pages.length === 0) return

    try {
      setIsGeneratingPDF(true)
      setPdfProgress(0)

      const jsPDF = (await import('jspdf')).default

      console.log('📄 [PDF] Iniciando generación de PDF del brochure...')

      const visiblePages = pages.filter(p => p.visible).sort((a, b) => a.orden - b.orden)

      if (visiblePages.length === 0) {
        alert('No hay páginas visibles para generar el PDF')
        return
      }

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      console.log(`📄 [PDF] Procesando ${visiblePages.length} páginas...`)

      // Procesar cada página
      for (let i = 0; i < visiblePages.length; i++) {
        const page = visiblePages[i]
        console.log(`📄 [PDF] Procesando página ${i + 1}/${visiblePages.length}: ${page.nombre}`)

        // Actualizar progreso
        setPdfProgress(Math.round(((i) / visiblePages.length) * 100))

        // Si no es la primera página, agregar nueva página al PDF
        if (i > 0) {
          pdf.addPage()
        }

        try {
          let imageData: string

          if (page.canvasData) {
            // Renderizar página con canvas en background
            console.log(`  📐 [PDF] Renderizando canvas en background...`)

            // Crear contenedor invisible para el canvas
            const container = document.createElement('div')
            container.style.position = 'fixed'
            container.style.left = '-9999px'
            container.style.top = '0'
            container.style.width = '1200px'
            container.style.height = '800px'
            container.style.zIndex = '-1'
            container.style.visibility = 'hidden'
            document.body.appendChild(container)

            // Crear canvas element
            const tempCanvas = document.createElement('canvas')
            const canvasWidth = page.configuracion?.width || 1200
            const canvasHeight = page.configuracion?.height || 800

            container.appendChild(tempCanvas)

            // Crear instancia de StaticCanvas de Fabric.js
            const staticCanvas = new fabric.StaticCanvas(tempCanvas, {
              width: canvasWidth,
              height: canvasHeight,
              renderOnAddRemove: true,
              backgroundColor: '#ffffff'
            })

            console.log(`  📦 [PDF] Canvas temporal creado: ${canvasWidth}x${canvasHeight}`)

            // Cargar el JSON del canvas
            try {
              await new Promise<void>((resolve, reject) => {
                const dataToLoad = typeof page.canvasData === 'string'
                  ? JSON.parse(page.canvasData)
                  : page.canvasData

                staticCanvas.loadFromJSON(dataToLoad, () => {
                  const objects = staticCanvas.getObjects()
                  console.log(`  ✅ [PDF] Canvas cargado con ${objects.length} objetos`)

                  // Forzar renders
                  staticCanvas.renderAll()

                  // Dar tiempo para que las imágenes se carguen
                  setTimeout(() => {
                    staticCanvas.renderAll()
                    console.log(`  ✅ [PDF] Canvas renderizado completamente`)
                    resolve()
                  }, 300)
                }, (error: any) => {
                  console.error(`  ❌ [PDF] Error cargando JSON:`, error)
                  reject(error)
                })
              })

              // Capturar imagen
              imageData = staticCanvas.toDataURL('image/jpeg', 0.95)
              console.log(`  ✅ [PDF] Imagen capturada del canvas temporal`)

            } catch (error) {
              console.error(`  ❌ [PDF] Error en renderizado background:`, error)
              throw error
            } finally {
              // Limpiar
              staticCanvas.dispose()
              document.body.removeChild(container)
            }
          } else {
            // Página sin canvas, crear página en blanco
            console.log(`  📦 [PDF] Página sin canvasData, agregando página en blanco`)
            imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          }

          // Agregar imagen al PDF manteniendo aspecto
          pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
          console.log(`  ✅ [PDF] Página ${i + 1} agregada al PDF`)

        } catch (pageError) {
          console.error(`  ❌ [PDF] Error procesando página ${i + 1}:`, pageError)
        }
      }

      // Actualizar progreso al 100%
      setPdfProgress(100)

      // Convertir PDF a data URL
      const pdfBlob = pdf.output('blob')
      const reader = new FileReader()

      reader.onloadend = async () => {
        const pdfDataUrl = reader.result as string

        console.log('📤 [PDF] Subiendo PDF a Google Cloud Storage...')

        // Enviar al endpoint
        const response = await fetch(`/api/admin/brochures/${brochure.id}/generate-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfDataUrl })
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ [PDF] PDF generado y guardado:', result.pdfUrl)
          alert('✅ PDF generado y guardado exitosamente')
          router.refresh()
        } else {
          throw new Error('Error al subir el PDF')
        }
      }

      reader.readAsDataURL(pdfBlob)

    } catch (error) {
      console.error('❌ [PDF] Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setIsGeneratingPDF(false)
      setPdfProgress(0)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar - Pages List */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/admin/brochures/${brochure.id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-lg font-semibold text-gray-900 flex-1 ml-3">
              Editor Visual
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">{brochure.titulo}</p>
            {brochure.categoria && (
              <p className="text-xs">{brochure.categoria.nombre}</p>
            )}
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Páginas ({pages.length})
            </h3>
            <button
              onClick={handleAddPage}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Agregar página"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pages.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {pages.map((page) => (
                  <SortablePageItem
                    key={page.id}
                    page={page}
                    isSelected={selectedPageId === page.id}
                    onSelect={() => setSelectedPageId(page.id)}
                    onDelete={() => handleDeletePage(page.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            href={`/brochure/${brochure.urlAmigable}`}
            target="_blank"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Vista Previa
          </Link>

          {/* Generate PDF Button */}
          <button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF || pages.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border border-green-300 text-green-700 bg-white hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando PDF {pdfProgress > 0 && `(${pdfProgress}%)`}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generar PDF
              </>
            )}
          </button>

          {/* Template Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                loadTemplates()
                setShowTemplateModal(true)
              }}
              disabled={!selectedPage}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-blue-300 text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cargar plantilla en la página actual"
            >
              <Download className="w-4 h-4" />
              Cargar
            </button>
            <button
              onClick={() => setShowSaveTemplateModal(true)}
              disabled={!selectedPage}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-purple-300 text-purple-600 bg-white hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Guardar página como plantilla reutilizable"
            >
              <Bookmark className="w-4 h-4" />
              Guardar
            </button>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Todo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 hover:bg-gray-50 rounded-r-lg shadow-md transition-all duration-300 ${
          sidebarCollapsed ? 'left-0' : 'left-80'
        }`}
        title={sidebarCollapsed ? 'Mostrar sidebar' : 'Ocultar sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600 m-2" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600 m-2" />
        )}
      </button>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPage ? (
          <>
            {/* Page Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={selectedPage.nombre}
                  onChange={(e) => handleUpdatePage(selectedPage.id, { nombre: e.target.value })}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  placeholder="Nombre de la página"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPage.visible}
                    onChange={(e) => handleUpdatePage(selectedPage.id, { visible: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Visible</span>
                </label>
              </div>
            </div>

            {/* Canvas Editor */}
            <div className="flex-1">
              <FabricCanvasEditor
                initialData={selectedPage.canvasData}
                onSave={handleCanvasSave}
                onAddPages={handleAddPagesFromPPTX}
                width={selectedPage.configuracion?.width || 1200}
                height={selectedPage.configuracion?.height || 800}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay páginas
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega tu primera página para comenzar a diseñar
              </p>
              <button
                onClick={handleAddPage}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Página
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Load Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Cargar Plantilla
              </h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay plantillas disponibles
                  </h3>
                  <p className="text-gray-600">
                    Guarda tu primera plantilla para reutilizarla después
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleLoadTemplate(template)}
                    >
                      {/* Template Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                        {template.thumbnail ? (
                          <Image
                            src={template.thumbnail}
                            alt={template.nombre}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <Layout className="w-12 h-12 text-blue-300" />
                        )}
                      </div>

                      {/* Template Info */}
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                        {template.nombre}
                      </h3>
                      {template.descripcion && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {template.descripcion}
                        </p>
                      )}
                      {template.categoria && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {template.categoria}
                        </span>
                      )}
                      {template.usageCount > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Usado {template.usageCount} veces
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      <SaveAsTemplateModal
        isOpen={showSaveTemplateModal}
        onClose={() => setShowSaveTemplateModal(false)}
        currentCanvasData={selectedPage?.canvasData}
        currentCanvas={currentCanvasInstance}
        pageName={selectedPage?.nombre || 'Nueva Plantilla'}
        canvasConfig={{
          width: selectedPage?.configuracion?.width || 1200,
          height: selectedPage?.configuracion?.height || 800
        }}
      />
    </div>
  )
}
