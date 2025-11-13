'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  // Herramientas principales
  MousePointer,
  Type,
  Shapes,
  Image as ImageIcon,
  FileText,
  Presentation,

  // Formas geométricas
  Square,
  Circle,
  Triangle,
  Minus,
  Pentagon,
  Hexagon,
  Star,
  PenTool,

  // Acciones de edición
  Undo2,
  Redo2,
  Copy,
  Clipboard,
  Trash2,
  Save,

  // Formato de texto
  Bold,
  Italic,
  Underline,

  // Alineación
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignCenterHorizontal,

  // Z-index y organización
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  MoveRight,
  Group,
  Ungroup,

  // Vista y capas
  ZoomIn,
  ZoomOut,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,

  // UI y navegación
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  RotateCw,
  RotateCcw,
  Scissors,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
  Check,
  X,

  // Exportar
  Download,
  FileDown,

  // Estados
  Loader2
} from 'lucide-react'
import { ImageSelectorModal } from './ImageSelectorModal'
import { PDFSelectorModal } from './PDFSelectorModal'
import { PPTXSelectorModal } from './PPTXSelectorModal'
import { FontSelector } from './FontSelector'
import { FontUploader } from './FontUploader'
import { FontDropdown } from './FontDropdown'
import { addPolygonControls, removePolygonControls, setupPolygonPrototype, isPolygon } from '@/lib/polygonControls'
import { PPTXSlide } from '@/lib/pptxProcessor'
import { getAllFontNames, loadAllGoogleFonts, loadFontOnDemand, loadAllCustomFonts, preloadCriticalFonts } from '@/lib/fonts'

interface FabricCanvasEditorProps {
  initialData?: any // JSON de Fabric.js
  onSave?: (canvasData: any, canvasInstance?: any, immediate?: boolean) => Promise<void> | void
  onAddPages?: (slides: PPTXSlide[]) => void // Para agregar páginas desde PPTX
  width?: number
  height?: number
  className?: string
}

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

// Helper: Create star shape for PPTX import
function createStar(centerX: number, centerY: number, radius: number, points: number, props: any) {
  const innerRadius = radius * 0.5
  const starPoints = generateStarPoints(points, radius, innerRadius)

  const adjustedPoints = starPoints.map((point: any) => ({
    x: centerX + point.x,
    y: centerY + point.y
  }))

  return new (window as any).fabric.Polygon(adjustedPoints, {
    ...props,
    left: centerX - radius,
    top: centerY - radius,
    originX: 'center',
    originY: 'center'
  })
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

  return new (window as any).fabric.Polygon(adjustedPoints, {
    ...props,
    left: centerX - radius,
    top: centerY - radius,
    originX: 'center',
    originY: 'center'
  })
}

// Helper: Create arrow shape
function createArrow(left: number, top: number, width: number, height: number, direction: 'right' | 'left' | 'up' | 'down', props: any) {
  const fabric = (window as any).fabric

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
  const fabric = (window as any).fabric
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
  const fabric = (window as any).fabric
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
  const fabric = (window as any).fabric
  const roofHeight = height * 0.4
  const bodyHeight = height * 0.6

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

// Componente DropdownMenu reutilizable con soporte para submenús
interface DropdownMenuItem {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  submenu?: DropdownMenuItem[]
}

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
}

function DropdownMenu({ trigger, items, align = 'left' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setActiveSubmenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false)
              setActiveSubmenu(null)
            }}
          />

          <div
            className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
          {items.map((item, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (item.submenu) {
                    setActiveSubmenu(activeSubmenu === index ? null : index)
                  } else if (!item.disabled && item.onClick) {
                    item.onClick()
                    setIsOpen(false)
                    setActiveSubmenu(null)
                  }
                }}
                onMouseEnter={() => {
                  if (item.submenu) {
                    setActiveSubmenu(index)
                  }
                }}
                disabled={item.disabled && !item.submenu}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                  item.disabled && !item.submenu
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50 cursor-pointer'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === items.length - 1 && !item.submenu ? 'rounded-b-lg' : 'border-b border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                {item.submenu && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {/* Submenú */}
              {item.submenu && activeSubmenu === index && (
                <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px]">
                  {item.submenu.map((subitem, subindex) => (
                    <button
                      type="button"
                      key={subindex}
                      onClick={() => {
                        if (!subitem.disabled && subitem.onClick) {
                          subitem.onClick()
                          setIsOpen(false)
                          setActiveSubmenu(null)
                        }
                      }}
                      disabled={subitem.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        subitem.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50 cursor-pointer'
                      } ${subindex === 0 ? 'rounded-t-lg' : ''} ${
                        subindex === item.submenu!.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
                      }`}
                    >
                      <span className="text-gray-600">{subitem.icon}</span>
                      <span className="text-sm text-gray-700">{subitem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  )
}

export function FabricCanvasEditor({
  initialData,
  onSave,
  onAddPages,
  width = 1200,
  height = 800,
  className = ''
}: FabricCanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any | null>(null)
  const [selectedObject, setSelectedObject] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showLayers, setShowLayers] = useState(false)
  const [layers, setLayers] = useState<any[]>([])
  const [customFonts, setCustomFonts] = useState<string[]>([])
  const [showFontSelector, setShowFontSelector] = useState(false)
  const [showFontUploader, setShowFontUploader] = useState(false)
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const fabricRef = useRef<any>(null)
  const initialLoadDoneRef = useRef(false)

  // Estado para el panel flotante de propiedades
  const [floatingPanelPosition, setFloatingPanelPosition] = useState({ x: 0, y: 0 })
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activePanelTab, setActivePanelTab] = useState<'general' | 'style' | 'alignment' | 'order' | 'text'>('general')

  // Estado para el panel flotante de capas
  const [layersPanelPosition, setLayersPanelPosition] = useState({ x: 0, y: 0 })
  const [isDraggingLayersPanel, setIsDraggingLayersPanel] = useState(false)
  const [layersDragOffset, setLayersDragOffset] = useState({ x: 0, y: 0 })

  // Estado para trackear propiedades del objeto seleccionado (para actualización visual)
  const [selectedObjectProps, setSelectedObjectProps] = useState<any>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    opacity: 1,
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
    textAlign: 'left'
  })

  // Undo/Redo state
  const [history, setHistory] = useState<string[]>([])
  const [historyStep, setHistoryStep] = useState(0)
  const historyStepRef = useRef(0) // Ref para evitar dependencias circulares
  const historyInitialized = useRef(false) // Ref para trackear si ya se inicializó el historial
  const historyDebounceTimer = useRef<NodeJS.Timeout | null>(null) // Timer para debounce
  const isSavingHistory = useRef(false) // Flag para prevenir guardados simultáneos
  const isUndoRedoing = useRef(false)

  // Mantener los refs sincronizados con los states
  useEffect(() => {
    historyStepRef.current = historyStep
  }, [historyStep])

  // Cargar fuentes de Google Fonts y fuentes personalizadas al inicializar
  useEffect(() => {
    console.log('⚡ Inicializando sistema de fuentes...')

    // 1. Precargar fuentes críticas con alta prioridad (inmediato)
    preloadCriticalFonts()

    // 2. Cargar todas las fuentes de Google Fonts en una sola petición (optimizado)
    setTimeout(() => {
      loadAllGoogleFonts()
    }, 100)

    // 3. Cargar fuentes personalizadas en paralelo
    const loadCustomFonts = async () => {
      try {
        await loadAllCustomFonts()
        // Obtener lista de nombres para el estado
        const response = await fetch('/api/fonts/upload')
        if (response.ok) {
          const data = await response.json()
          const fontNames = data.fonts.map((f: any) => f.fontFamily)
          setCustomFonts(fontNames)
        }
      } catch (error) {
        console.error('❌ Error cargando fuentes personalizadas:', error)
      }
    }

    loadCustomFonts()
  }, [])

  // Estado para modal de selección de imágenes
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [isReplacingImage, setIsReplacingImage] = useState(false)
  const [imageToReplace, setImageToReplace] = useState<any | null>(null)

  // Estado para modal de selección de PDF
  const [showPDFSelector, setShowPDFSelector] = useState(false)

  // Estado para modal de selección de PPTX
  const [showPPTXSelector, setShowPPTXSelector] = useState(false)
  const [showPPTXConfirmModal, setShowPPTXConfirmModal] = useState(false)
  const [selectedPPTXSlides, setSelectedPPTXSlides] = useState<PPTXSlide[]>([])

  // Estado para modo de recorte de imagen
  const [isCropping, setIsCropping] = useState(false)
  const [cropRect, setCropRect] = useState<any | null>(null)
  const [imageToCrop, setImageToCrop] = useState<any | null>(null)
  const [cropToolbarPosition, setCropToolbarPosition] = useState<{ x: number; y: number } | null>(null)

  // Estado para modo de dibujo de polígonos
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false)
  const isDrawingPolygonRef = useRef(false) // Ref para evitar re-registros de event listeners
  const [polygonPoints, setPolygonPoints] = useState<{x: number, y: number}[]>([])
  const [tempPolygonLine, setTempPolygonLine] = useState<any>(null)
  const [tempPolygonCircles, setTempPolygonCircles] = useState<any[]>([])

  // Estado para rastrear qué polígonos están en modo de edición
  const [editingPolygons, setEditingPolygons] = useState<Set<any>>(new Set())

  // Estado para clipboard (copiar/pegar)
  const [clipboard, setClipboard] = useState<any>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Mantener isDrawingPolygonRef sincronizado con isDrawingPolygon
  useEffect(() => {
    isDrawingPolygonRef.current = isDrawingPolygon
  }, [isDrawingPolygon])

  // Cargar Fabric.js dinámicamente
  useEffect(() => {
    console.log('📦 [Fabric Load] Iniciando carga de Fabric.js...')
    import('fabric').then((fabricModule) => {
      console.log('✅ [Fabric Load] Fabric.js cargado:', fabricModule)
      console.log('   - fabricModule keys:', Object.keys(fabricModule))
      // Fabric.js puede exportarse de diferentes formas según la versión
      fabricRef.current = fabricModule as any
      console.log('   - fabricRef asignado:', !!fabricRef.current)

      // Configurar prototipos para polygon controls
      setupPolygonPrototype(fabricRef.current)
      console.log('✅ [Polygon Controls] Prototipo configurado')

      setFabricLoaded(true)
    }).catch((error) => {
      console.error('❌ [Fabric Load] Error cargando Fabric.js:', error)
    })
  }, [])

  // Inicializar canvas - SOLO cuando Fabric esté cargado Y canvasRef exista
  useEffect(() => {
    console.log('🔍 [Canvas Init] useEffect ejecutándose...')
    console.log('   - canvasRef.current:', !!canvasRef.current)
    console.log('   - fabricLoaded:', fabricLoaded)
    console.log('   - fabricRef.current:', !!fabricRef.current)

    if (!canvasRef.current || !fabricLoaded || !fabricRef.current) {
      console.log('❌ [Canvas Init] Condiciones no cumplidas')
      return
    }

    console.log('✅ [Canvas Init] Creando canvas...')

    const fabric = fabricRef.current
    console.log('   - fabric.Canvas:', !!fabric.Canvas)

    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true
      })

      console.log('✅ [Canvas Init] Canvas creado')

      // Cargar datos iniciales si existen
      if (initialData && initialData.objects) {
        console.log('📥 [Canvas Init] Cargando initialData...', {
          objectCount: initialData.objects.length
        })
        fabricCanvas.loadFromJSON(initialData, () => {
          console.log('✅ [Canvas Init] JSON cargado, forzando renders...')

          // Hacer que todos los textos sean editables
          fabricCanvas.getObjects().forEach((obj: any) => {
            if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
              obj.set({
                editable: true,
                selectable: true
              })
            }
          })

          // Estrategia 1: Render inmediato
          fabricCanvas.renderAll()
          console.log('   - Render #1 ejecutado')

          // Estrategia 2: Render con requestAnimationFrame
          requestAnimationFrame(() => {
            fabricCanvas.renderAll()
            console.log('   - Render #2 (RAF) ejecutado')

            // Estrategia 3: Render con pequeño delay
            setTimeout(() => {
              fabricCanvas.renderAll()
              console.log('   - Render #3 (delay) ejecutado')

              // Estrategia 4: Actualizar capas y render final
              const objects = fabricCanvas.getObjects()
              console.log('   - Objetos en canvas:', objects.length)
              setLayers([...objects])

              setTimeout(() => {
                fabricCanvas.renderAll()
                console.log('   - Render #4 (final) ejecutado')

                // Notificar al parent que el canvas está listo con los datos cargados
                // Solo hacerlo una vez para evitar loops infinitos
                if (onSave && !initialLoadDoneRef.current) {
                  initialLoadDoneRef.current = true
                  const canvasData = fabricCanvas.toJSON()
                  onSave(canvasData, fabricCanvas)
                  console.log('✅ [Canvas Init] Canvas instance enviado al parent via onSave')
                }
              }, 200)
            }, 50)
          })

          console.log('✅ [Canvas Init] initialData cargado con', fabricCanvas.getObjects().length, 'objetos')
        })
      } else {
        console.log('ℹ️ [Canvas Init] No hay initialData, canvas vacío')
      }

      // Event listeners
      fabricCanvas.on('selection:created', (e) => {
        const obj = e.selected?.[0]
        setSelectedObject(obj || null)
      })

      fabricCanvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0]
        setSelectedObject(obj || null)
      })

      fabricCanvas.on('selection:cleared', () => {
        setSelectedObject(null)
      })

      fabricCanvas.on('object:added', () => {
        const objects = fabricCanvas.getObjects()
        setLayers([...objects])
      })

      fabricCanvas.on('object:removed', () => {
        const objects = fabricCanvas.getObjects()
        setLayers([...objects])
      })

      fabricCanvas.on('object:modified', () => {
        const objects = fabricCanvas.getObjects()
        setLayers([...objects])
      })

      console.log('🎯 [Canvas Init] Llamando setCanvas()...')
      setCanvas(fabricCanvas)
      console.log('✅ [Canvas Init] Canvas configurado')

      return () => {
        console.log('🧹 [Canvas Init] Limpiando canvas...')
        fabricCanvas.dispose()
      }
    } catch (error) {
      console.error('❌ [Canvas Init] Error:', error)
    }
  }, [width, height, fabricLoaded, initialData])

  // Actualizar capas cuando cambia el canvas
  const refreshLayers = useCallback(() => {
    if (!canvas) return
    const objects = canvas.getObjects()
    setLayers([...objects])
  }, [canvas])

  // Helper para actualizar propiedades del objeto Y el estado de React
  const updateObjectProperty = useCallback((property: string, value: any) => {
    if (!selectedObject || !canvas) return

    // Actualizar el objeto de Fabric.js
    selectedObject.set({ [property]: value })
    canvas.renderAll()

    // Actualizar el estado de React para reflejar cambios en la UI
    setSelectedObjectProps((prev: any) => ({
      ...prev,
      [property]: value
    }))
  }, [selectedObject, canvas])

  // Sincronizar propiedades del objeto seleccionado con el estado de React
  useEffect(() => {
    if (!selectedObject) return

    // Actualizar el estado con las propiedades actuales del objeto
    const updateProps = () => {
      setSelectedObjectProps({
        left: selectedObject.left || 0,
        top: selectedObject.top || 0,
        width: selectedObject.width || 0,
        height: selectedObject.height || 0,
        scaleX: selectedObject.scaleX || 1,
        scaleY: selectedObject.scaleY || 1,
        angle: selectedObject.angle || 0,
        opacity: selectedObject.opacity ?? 1,
        fill: selectedObject.fill || '#000000',
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 0,
        fontSize: selectedObject.fontSize || 24,
        fontFamily: selectedObject.fontFamily || 'Inter',
        fontWeight: selectedObject.fontWeight || 'normal',
        fontStyle: selectedObject.fontStyle || 'normal',
        underline: selectedObject.underline || false,
        textAlign: selectedObject.textAlign || 'left',
        lockMovementX: selectedObject.lockMovementX || false,
        lineHeight: selectedObject.lineHeight || 1.16,
        charSpacing: selectedObject.charSpacing || 0
      })
    }

    // Actualizar inmediatamente
    updateProps()

    // Escuchar cambios en el objeto (cuando se modifica desde el canvas)
    const handleModified = () => {
      updateProps()
    }

    const handleScaling = () => {
      updateProps()
    }

    const handleRotating = () => {
      updateProps()
    }

    const handleMoving = () => {
      updateProps()
    }

    // Verificar que el objeto tiene el método 'on' antes de usarlo
    if (selectedObject && typeof selectedObject.on === 'function') {
      selectedObject.on('modified', handleModified)
      selectedObject.on('scaling', handleScaling)
      selectedObject.on('rotating', handleRotating)
      selectedObject.on('moving', handleMoving)

      return () => {
        if (typeof selectedObject.off === 'function') {
          selectedObject.off('modified', handleModified)
          selectedObject.off('scaling', handleScaling)
          selectedObject.off('rotating', handleRotating)
          selectedObject.off('moving', handleMoving)
        }
      }
    }
  }, [selectedObject])

  // Calcular posición del panel flotante cuando se selecciona un objeto
  useEffect(() => {
    if (!selectedObject || !canvas || !canvasRef.current) return

    // Obtener el contenedor del canvas
    const canvasContainer = canvasRef.current.parentElement
    if (!canvasContainer) return

    const containerRect = canvasContainer.getBoundingClientRect()

    // Obtener coordenadas del objeto en el canvas
    const objLeft = selectedObject.left || 0
    const objTop = selectedObject.top || 0
    const objWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1)
    const objHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1)

    // Calcular posición del panel (más separado y compacto)
    const panelWidth = 280 // Ancho del panel (reducido)
    const panelHeight = 400 // Alto del panel (reducido)
    const margin = 60 // Más separación

    // Estrategia 1: Intentar esquina superior derecha del canvas
    let x = width - panelWidth - 40
    let y = 40

    // Estrategia 2: Si el objeto está en la zona derecha, ponerlo a la izquierda
    if (objLeft + objWidth/2 > width/2) {
      x = 40 // Izquierda del canvas
    }

    // Estrategia 3: Si el panel colisiona con el objeto, ajustar
    const objCenterX = objLeft + objWidth/2
    const objCenterY = objTop + objHeight/2
    const panelCenterX = x + panelWidth/2
    const panelCenterY = y + panelHeight/2

    // Si hay colisión, mover el panel
    if (Math.abs(objCenterX - panelCenterX) < (objWidth + panelWidth)/2 + margin &&
        Math.abs(objCenterY - panelCenterY) < (objHeight + panelHeight)/2 + margin) {
      // Mover al lado opuesto
      if (x < width/2) {
        x = width - panelWidth - 40
      } else {
        x = 40
      }
    }

    // Asegurar que no se salga del canvas
    x = Math.max(20, Math.min(x, width - panelWidth - 20))
    y = Math.max(20, Math.min(y, height - panelHeight - 20))

    // Posición relativa al contenedor del canvas
    setFloatingPanelPosition({ x, y })
  }, [selectedObject, canvas, width, height])

  // Handlers para arrastrar el panel flotante
  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    // Solo iniciar drag si se hace click en el header
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault()
      e.stopPropagation()
      setIsDraggingPanel(true)
      setDragOffset({
        x: e.clientX - floatingPanelPosition.x,
        y: e.clientY - floatingPanelPosition.y
      })
    }
  }, [floatingPanelPosition])

  const handlePanelMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingPanel) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    setFloatingPanelPosition({ x: newX, y: newY })
  }, [isDraggingPanel, dragOffset])

  const handlePanelMouseUp = useCallback(() => {
    setIsDraggingPanel(false)
  }, [])

  // Agregar/remover listeners para el drag del panel
  useEffect(() => {
    if (isDraggingPanel) {
      window.addEventListener('mousemove', handlePanelMouseMove)
      window.addEventListener('mouseup', handlePanelMouseUp)
      return () => {
        window.removeEventListener('mousemove', handlePanelMouseMove)
        window.removeEventListener('mouseup', handlePanelMouseUp)
      }
    }
  }, [isDraggingPanel, handlePanelMouseMove, handlePanelMouseUp])

  // Handlers para arrastrar el panel de capas flotante
  const handleLayersPanelMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle-layers')) {
      e.preventDefault()
      e.stopPropagation()
      setIsDraggingLayersPanel(true)
      setLayersDragOffset({
        x: e.clientX - layersPanelPosition.x,
        y: e.clientY - layersPanelPosition.y
      })
    }
  }, [layersPanelPosition])

  const handleLayersPanelMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingLayersPanel) return

    const newX = e.clientX - layersDragOffset.x
    const newY = e.clientY - layersDragOffset.y

    setLayersPanelPosition({ x: newX, y: newY })
  }, [isDraggingLayersPanel, layersDragOffset])

  const handleLayersPanelMouseUp = useCallback(() => {
    setIsDraggingLayersPanel(false)
  }, [])

  useEffect(() => {
    if (isDraggingLayersPanel) {
      window.addEventListener('mousemove', handleLayersPanelMouseMove)
      window.addEventListener('mouseup', handleLayersPanelMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleLayersPanelMouseMove)
        window.removeEventListener('mouseup', handleLayersPanelMouseUp)
      }
    }
  }, [isDraggingLayersPanel, handleLayersPanelMouseMove, handleLayersPanelMouseUp])

  // Posicionar panel de capas flotante
  useEffect(() => {
    if (!canvas || !showLayers) return

    // Posicionar en la esquina superior derecha
    const x = width - 320 - 40 // Ancho del panel + margen
    const y = 100

    setLayersPanelPosition({ x, y })
  }, [showLayers, canvas, width])

  // Funciones de prueba para agregar elementos
  const addText = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const text = new fabric.IText('Haz clic para editar', {
      left: 100,
      top: 100,
      fontFamily: 'Inter, sans-serif',
      fontSize: 24,
      fill: '#1f2937'
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }, [canvas])

  const addRectangle = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }, [canvas])

  const addCircle = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 60,
      fill: '#10b981',
      stroke: '#059669',
      strokeWidth: 2
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }, [canvas])

  const addTriangle = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const triangle = new fabric.Triangle({
      left: 250,
      top: 250,
      width: 120,
      height: 100,
      fill: '#f59e0b',
      stroke: '#d97706',
      strokeWidth: 2
    })

    canvas.add(triangle)
    canvas.setActiveObject(triangle)
    canvas.renderAll()
  }, [canvas])

  const addLine = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const line = new fabric.Line([50, 50, 250, 50], {
      stroke: '#1f2937',
      strokeWidth: 3
    })

    canvas.add(line)
    canvas.setActiveObject(line)
    canvas.renderAll()
  }, [canvas])

  // Funciones para agregar flechas (tipo línea con puntas)
  const addArrowLine = useCallback((direction: 'right' | 'left' | 'up' | 'down' | 'both') => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    let x1 = 50, y1 = 200, x2 = 250, y2 = 200

    // Ajustar coordenadas según dirección
    if (direction === 'up') {
      x1 = 200; y1 = 250; x2 = 200; y2 = 50
    } else if (direction === 'down') {
      x1 = 200; y1 = 50; x2 = 200; y2 = 250
    } else if (direction === 'left') {
      x1 = 250; y1 = 200; x2 = 50; y2 = 200
    }

    // Crear línea principal
    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke: '#1e40af',
      strokeWidth: 3,
      selectable: true,
      hasControls: true,
      lockScalingFlip: true
    })

    // Calcular ángulo de la línea
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)
    const arrowHeadLength = 15

    // Crear punta de flecha al final
    const arrowHead = new fabric.Triangle({
      left: x2,
      top: y2,
      width: arrowHeadLength,
      height: arrowHeadLength,
      fill: '#1e40af',
      angle: angle + 90,
      originX: 'center',
      originY: 'center',
      selectable: false
    })

    // Si es bidireccional, crear punta al inicio también
    let arrowTail = null
    if (direction === 'both') {
      arrowTail = new fabric.Triangle({
        left: x1,
        top: y1,
        width: arrowHeadLength,
        height: arrowHeadLength,
        fill: '#1e40af',
        angle: angle - 90,
        originX: 'center',
        originY: 'center',
        selectable: false
      })
    }

    // Agrupar línea y puntas
    const objects = direction === 'both' && arrowTail
      ? [line, arrowHead, arrowTail]
      : [line, arrowHead]

    const arrowGroup = new fabric.Group(objects, {
      left: 200,
      top: 200,
      hasControls: true,
      lockScalingFlip: true
    })

    canvas.add(arrowGroup)
    canvas.setActiveObject(arrowGroup)
    canvas.renderAll()
  }, [canvas])

  const addArrowRight = useCallback(() => addArrowLine('right'), [addArrowLine])
  const addArrowLeft = useCallback(() => addArrowLine('left'), [addArrowLine])
  const addArrowUp = useCallback(() => addArrowLine('up'), [addArrowLine])
  const addArrowDown = useCallback(() => addArrowLine('down'), [addArrowLine])
  const addArrowBidirectional = useCallback(() => addArrowLine('both'), [addArrowLine])

  // Configurar doble clic en polígono para toggle de modo de edición
  const setupPolygonDoubleClick = useCallback((polygon: any) => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    // Marcar que el polígono tiene doble click configurado
    polygon._hasDoubleClickSetup = true

    polygon.on('mousedblclick', () => {
      // Usar una propiedad en el polígono para rastrear el estado de edición
      const isEditing = polygon._isEditingVertices || false

      console.log(`🔄 [Polygon Edit] Toggle modo edición: ${!isEditing}`)

      if (isEditing) {
        // Salir del modo de edición: restaurar controles normales
        removePolygonControls(polygon, fabric)
        polygon._isEditingVertices = false
        setEditingPolygons(prev => {
          const newSet = new Set(prev)
          newSet.delete(polygon)
          return newSet
        })
      } else {
        // Entrar en modo de edición: agregar controles de vértices
        addPolygonControls(polygon, fabric)
        polygon._isEditingVertices = true
        setEditingPolygons(prev => new Set(prev).add(polygon))
      }

      canvas.requestRenderAll()
    })
  }, [canvas, fabricRef])

  const addPentagon = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const points = generatePolygonPoints(5, 60)
    const pentagon = new fabric.Polygon(points, {
      left: 300,
      top: 200,
      fill: '#8b5cf6',
      stroke: '#6d28d9',
      strokeWidth: 2,
      objectCaching: false
    })

    // Configurar doble clic para editar vértices
    setupPolygonDoubleClick(pentagon)

    canvas.add(pentagon)
    canvas.setActiveObject(pentagon)
    canvas.renderAll()
  }, [canvas, setupPolygonDoubleClick])

  const addHexagon = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const points = generatePolygonPoints(6, 60)
    const hexagon = new fabric.Polygon(points, {
      left: 350,
      top: 250,
      fill: '#06b6d4',
      stroke: '#0891b2',
      strokeWidth: 2,
      objectCaching: false
    })

    // Configurar doble clic para editar vértices
    setupPolygonDoubleClick(hexagon)

    canvas.add(hexagon)
    canvas.setActiveObject(hexagon)
    canvas.renderAll()
  }, [canvas, setupPolygonDoubleClick])

  const addStar = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    const fabric = fabricRef.current

    const points = generateStarPoints(5, 60, 25)
    const star = new fabric.Polygon(points, {
      left: 400,
      top: 300,
      fill: '#fbbf24',
      stroke: '#f59e0b',
      strokeWidth: 2,
      objectCaching: false
    })

    // Configurar doble clic para editar vértices
    setupPolygonDoubleClick(star)

    canvas.add(star)
    canvas.setActiveObject(star)
    canvas.renderAll()
  }, [canvas, setupPolygonDoubleClick])

  // Activar modo de dibujo de polígono libre
  const startPolygonDrawing = useCallback(() => {
    if (!canvas) return
    console.log('🎨 [Polygon] Modo de dibujo libre activado')
    setIsDrawingPolygon(true)
    setPolygonPoints([])
    setTempPolygonCircles([]) // Limpiar círculos anteriores
    canvas.selection = false // Deshabilitar selección mientras dibujamos
    canvas.defaultCursor = 'crosshair'
  }, [canvas])

  // Finalizar dibujo de polígono y crear el objeto
  const finishPolygonDrawing = useCallback(() => {
    if (!canvas || !fabricRef.current || polygonPoints.length < 3) {
      console.warn('⚠️ [Polygon] Se necesitan al menos 3 puntos para crear un polígono')
      return
    }
    const fabric = fabricRef.current

    // Limpiar línea temporal
    if (tempPolygonLine) {
      canvas.remove(tempPolygonLine)
      setTempPolygonLine(null)
    }

    // Limpiar círculos temporales
    tempPolygonCircles.forEach(circle => {
      canvas.remove(circle)
    })
    setTempPolygonCircles([])

    // Crear polígono con los puntos recopilados
    const polygon = new fabric.Polygon(polygonPoints, {
      fill: '#ec4899',
      stroke: '#be185d',
      strokeWidth: 2,
      objectCaching: false
    })

    // Configurar doble clic para editar vértices
    setupPolygonDoubleClick(polygon)

    canvas.add(polygon)
    canvas.setActiveObject(polygon)
    canvas.renderAll()

    // Resetear estado
    setIsDrawingPolygon(false)
    setPolygonPoints([])
    canvas.selection = true
    canvas.defaultCursor = 'default'

    // Guardar en historial después de crear el polígono
    // Usamos setTimeout para asegurar que el estado se actualizó primero
    setTimeout(() => {
      if (!isUndoRedoing.current) {
        const json = JSON.stringify(canvas.toJSON())
        setHistory(prev => {
          const newHistory = prev.slice(0, historyStep + 1)
          newHistory.push(json)
          if (newHistory.length > 50) {
            newHistory.shift()
            return newHistory
          }
          return newHistory
        })
        setHistoryStep(prev => {
          const newStep = prev + 1
          return newStep > 49 ? 49 : newStep
        })
      }
    }, 0)

    console.log(`✅ [Polygon] Polígono creado con ${polygonPoints.length} puntos`)
  }, [canvas, polygonPoints, tempPolygonLine, tempPolygonCircles, setupPolygonDoubleClick, historyStep])

  // Cancelar dibujo de polígono
  const cancelPolygonDrawing = useCallback(() => {
    if (!canvas) return

    // Limpiar línea temporal
    if (tempPolygonLine) {
      canvas.remove(tempPolygonLine)
      setTempPolygonLine(null)
    }

    // Limpiar círculos temporales
    tempPolygonCircles.forEach(circle => {
      canvas.remove(circle)
    })
    setTempPolygonCircles([])

    setIsDrawingPolygon(false)
    setPolygonPoints([])
    canvas.selection = true
    canvas.defaultCursor = 'default'

    console.log('❌ [Polygon] Modo de dibujo cancelado')
  }, [canvas, tempPolygonLine, tempPolygonCircles])

  const addImage = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    console.log('🖼️ [Image] Abriendo modal de selección de imágenes...')
    setShowImageSelector(true)
  }, [canvas])

  // Reemplazar imagen existente
  const handleReplaceImage = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') {
      console.warn('⚠️ [Replace Image] No hay imagen seleccionada')
      return
    }

    console.log('🔄 [Replace Image] Iniciando reemplazo de imagen...')
    setImageToReplace(selectedObject)
    setIsReplacingImage(true)
    setShowImageSelector(true)
  }, [canvas, selectedObject])

  // Handler para cuando se selecciona una imagen desde el modal
  const handleImageSelected = useCallback(async (imageUrl: string, isSmall: boolean, base64?: string) => {
    if (!canvas || !fabricRef.current) {
      console.error('❌ [Image Selected] Canvas o Fabric no disponible')
      return
    }

    console.log('📸 [Image Selected] Iniciando carga de imagen:', {
      url: imageUrl.substring(0, 50) + '...',
      isSmall,
      hasBase64: !!base64,
      urlType: imageUrl.startsWith('data:') ? 'Base64' : 'URL',
      isReplacing: isReplacingImage
    })

    const fabric = fabricRef.current

    try {
      // En Fabric.js v6, Image.fromURL devuelve una Promise directamente
      console.log('🔄 [Image Selected] Llamando a fabric.Image.fromURL...')
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: 'anonymous'
      })

      if (!img) {
        throw new Error('Image.fromURL devolvió null o undefined')
      }

      console.log('✅ [Image Selected] Imagen cargada desde URL, dimensiones:', {
        width: img.width,
        height: img.height
      })

      // Modo REEMPLAZO: mantener todas las propiedades de la imagen original
      if (isReplacingImage && imageToReplace) {
        console.log('🔄 [Replace Image] Copiando propiedades de imagen original...')

        // Calcular las dimensiones de visualización reales de la imagen original
        const displayWidth = imageToReplace.width * imageToReplace.scaleX
        const displayHeight = imageToReplace.height * imageToReplace.scaleY

        // Calcular la nueva escala para que la nueva imagen tenga el mismo tamaño visual
        const newScaleX = displayWidth / img.width
        const newScaleY = displayHeight / img.height

        console.log('📏 [Replace Image] Calculando escala:', {
          originalDimensions: { width: imageToReplace.width, height: imageToReplace.height },
          originalScale: { scaleX: imageToReplace.scaleX, scaleY: imageToReplace.scaleY },
          displaySize: { width: displayWidth, height: displayHeight },
          newDimensions: { width: img.width, height: img.height },
          newScale: { scaleX: newScaleX, scaleY: newScaleY }
        })

        // Copiar todas las propiedades importantes
        img.set({
          left: imageToReplace.left,
          top: imageToReplace.top,
          scaleX: newScaleX,
          scaleY: newScaleY,
          angle: imageToReplace.angle,
          opacity: imageToReplace.opacity,
          flipX: imageToReplace.flipX,
          flipY: imageToReplace.flipY,
          shadow: imageToReplace.shadow,
          filters: imageToReplace.filters,
          lockMovementX: imageToReplace.lockMovementX,
          lockMovementY: imageToReplace.lockMovementY,
          lockRotation: imageToReplace.lockRotation,
          lockScalingX: imageToReplace.lockScalingX,
          lockScalingY: imageToReplace.lockScalingY,
          selectable: imageToReplace.selectable
        })

        // Aplicar filtros si existen
        if (imageToReplace.filters && imageToReplace.filters.length > 0) {
          img.applyFilters()
        }

        console.log('🗑️ [Replace Image] Removiendo imagen original...')
        canvas.remove(imageToReplace)

        console.log('➕ [Replace Image] Agregando nueva imagen...')
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()

        // Resetear estados
        setIsReplacingImage(false)
        setImageToReplace(null)

        console.log('✅ [Replace Image] Imagen reemplazada exitosamente')
      }
      // Modo AGREGAR: comportamiento normal
      else {
        // Escalar imagen si es muy grande
        const maxWidth = 400
        const maxHeight = 400

        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
          img.scale(scale)
          console.log('📏 [Image Selected] Imagen escalada:', scale)
        }

        // Posicionar en el centro
        img.set({
          left: 100,
          top: 100
        })

        console.log('➕ [Image Selected] Agregando imagen al canvas...')
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()

        console.log('✅ [Image Selected] Imagen agregada al canvas exitosamente')
      }
    } catch (error) {
      console.error('❌ [Image Selected] Error al cargar imagen:', error)
      console.error('   - URL:', imageUrl.substring(0, 100))
      console.error('   - Error completo:', error)

      // Resetear estados en caso de error
      setIsReplacingImage(false)
      setImageToReplace(null)
    }
  }, [canvas, isReplacingImage, imageToReplace])

  // ========== FUNCIONES DE EDICIÓN DE IMAGEN ==========

  // Flip horizontal
  const handleFlipHorizontal = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return
    selectedObject.set('flipX', !selectedObject.flipX)
    canvas.renderAll()
    console.log('🔄 [Image Edit] Flip horizontal aplicado')
  }, [canvas, selectedObject])

  // Flip vertical
  const handleFlipVertical = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return
    selectedObject.set('flipY', !selectedObject.flipY)
    canvas.renderAll()
    console.log('🔄 [Image Edit] Flip vertical aplicado')
  }, [canvas, selectedObject])

  // Rotar 90 grados
  const handleRotate90 = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return
    const currentAngle = selectedObject.angle || 0
    selectedObject.rotate(currentAngle + 90)
    canvas.renderAll()
    console.log('🔄 [Image Edit] Rotación 90° aplicada')
  }, [canvas, selectedObject])

  // Rotar -90 grados
  const handleRotateMinus90 = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return
    const currentAngle = selectedObject.angle || 0
    selectedObject.rotate(currentAngle - 90)
    canvas.renderAll()
    console.log('🔄 [Image Edit] Rotación -90° aplicada')
  }, [canvas, selectedObject])

  // Activar modo crop
  const handleStartCrop = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image' || !fabricRef.current) return

    console.log('✂️ [Crop] Iniciando modo crop...')

    const fabric = fabricRef.current
    const img = selectedObject

    // Crear rectángulo de crop
    const rect = new fabric.Rect({
      left: img.left,
      top: img.top,
      width: img.getScaledWidth() * 0.8,
      height: img.getScaledHeight() * 0.8,
      fill: 'rgba(0,0,0,0.3)',
      stroke: '#3b82f6',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: true
    })

    // Marcar como objeto temporal para que no se guarde en el historial
    ;(rect as any)._isTemporary = true

    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()

    // Calcular posición del toolbar (debajo del rectángulo de crop)
    const canvasElement = canvas.getElement()
    const canvasRect = canvasElement.getBoundingClientRect()
    const zoom = canvas.getZoom()

    const toolbarX = (rect.left + rect.width / 2) * zoom + canvasRect.left
    const toolbarY = (rect.top + rect.height + 20) * zoom + canvasRect.top

    setIsCropping(true)
    setCropRect(rect)
    setImageToCrop(img)
    setCropToolbarPosition({ x: toolbarX, y: toolbarY })

    console.log('✂️ [Crop] Modo crop activado')
  }, [canvas, selectedObject])

  // Aplicar crop
  const handleApplyCrop = useCallback(() => {
    if (!canvas || !cropRect || !imageToCrop || !fabricRef.current) return

    console.log('✂️ [Crop] Aplicando recorte...')

    const img = imageToCrop
    const rect = cropRect

    // Calcular las coordenadas de crop relativas a la imagen
    const imgLeft = img.left || 0
    const imgTop = img.top || 0
    const rectLeft = rect.left || 0
    const rectTop = rect.top || 0

    const cropX = (rectLeft - imgLeft) / (img.scaleX || 1)
    const cropY = (rectTop - imgTop) / (img.scaleY || 1)
    const cropWidth = (rect.width * rect.scaleX) / (img.scaleX || 1)
    const cropHeight = (rect.height * rect.scaleY) / (img.scaleY || 1)

    // Aplicar crop a la imagen
    img.set({
      cropX: Math.max(0, cropX),
      cropY: Math.max(0, cropY),
      width: cropWidth,
      height: cropHeight
    })

    // Remover rectángulo de crop
    canvas.remove(rect)
    canvas.setActiveObject(img)
    canvas.renderAll()

    // Resetear estados
    setIsCropping(false)
    setCropRect(null)
    setImageToCrop(null)
    setCropToolbarPosition(null)

    console.log('✅ [Crop] Recorte aplicado exitosamente')
  }, [canvas, cropRect, imageToCrop])

  // Cancelar crop
  const handleCancelCrop = useCallback(() => {
    if (!canvas || !cropRect) return

    console.log('❌ [Crop] Cancelando recorte...')

    canvas.remove(cropRect)
    if (imageToCrop) {
      canvas.setActiveObject(imageToCrop)
    }
    canvas.renderAll()

    setIsCropping(false)
    setCropRect(null)
    setImageToCrop(null)
    setCropToolbarPosition(null)
  }, [canvas, cropRect, imageToCrop])

  // Restablecer imagen (quitar todos los ajustes)
  const handleResetImage = useCallback(() => {
    if (!canvas || !selectedObject || selectedObject.type !== 'image') return

    console.log('🔄 [Image Edit] Restableciendo imagen...')

    // Obtener dimensiones originales de la imagen
    const originalWidth = selectedObject._element?.naturalWidth || selectedObject._element?.width
    const originalHeight = selectedObject._element?.naturalHeight || selectedObject._element?.height

    console.log('📐 [Image Edit] Dimensiones originales:', { originalWidth, originalHeight })
    console.log('📐 [Image Edit] Dimensiones actuales:', { width: selectedObject.width, height: selectedObject.height })

    // Quitar filtros
    selectedObject.filters = []
    selectedObject.applyFilters()

    // Quitar flips, crops y restaurar dimensiones originales
    selectedObject.set({
      flipX: false,
      flipY: false,
      cropX: 0,
      cropY: 0,
      width: originalWidth,
      height: originalHeight
    })

    // Renderizar
    canvas.renderAll()

    // Forzar actualización del estado
    setSelectedObject({...selectedObject})

    console.log('✅ [Image Edit] Imagen restablecida a dimensiones originales')
  }, [canvas, selectedObject])

  // Agregar PDF
  const addPDF = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    console.log('📄 [PDF] Abriendo modal de selección de PDF...')
    setShowPDFSelector(true)
  }, [canvas])

  // Handle PDF page selected
  const handlePDFPageSelected = useCallback(async (imageDataUrl: string) => {
    if (!canvas || !fabricRef.current) {
      console.error('❌ [PDF Page Selected] Canvas o Fabric no disponible')
      return
    }

    console.log('📄 [PDF Page Selected] Iniciando carga de página PDF...')

    const fabric = fabricRef.current

    try {
      // Cargar la imagen del data URL
      const img = await fabric.Image.fromURL(imageDataUrl, {
        crossOrigin: 'anonymous'
      })

      if (!img) {
        throw new Error('Image.fromURL devolvió null o undefined')
      }

      console.log('✅ [PDF Page Selected] Página PDF cargada, dimensiones:', {
        width: img.width,
        height: img.height
      })

      // Escalar si es muy grande
      const maxWidth = 600
      const maxHeight = 800

      if (img.width > maxWidth || img.height > maxHeight) {
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
        img.scale(scale)
        console.log('📏 [PDF Page Selected] Página escalada:', scale)
      }

      // Posicionar en el centro
      img.set({
        left: 100,
        top: 100
      })

      console.log('➕ [PDF Page Selected] Agregando página al canvas...')
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()

      console.log('✅ [PDF Page Selected] Página PDF agregada al canvas exitosamente')
    } catch (error) {
      console.error('❌ [PDF Page Selected] Error al cargar página PDF:', error)
    }
  }, [canvas])

  // ========== FUNCIONES DE PPTX ==========

  // Agregar PPTX
  const addPPTX = useCallback(() => {
    if (!canvas || !fabricRef.current) return
    console.log('📊 [PPTX] Abriendo modal de selección de PPTX...')
    setShowPPTXSelector(true)
  }, [canvas])

  // Handle PPTX slides selected
  const handlePPTXSlidesSelected = useCallback((slides: PPTXSlide[], indices: number[]) => {
    console.log(`📊 [PPTX] ${slides.length} diapositivas seleccionadas:`, indices)
    setSelectedPPTXSlides(slides)
    setShowPPTXSelector(false)
    setShowPPTXConfirmModal(true)
  }, [])

  // Agregar PPTX al canvas actual
  const handleAddPPTXToCanvas = useCallback(async () => {
    if (!canvas || !fabricRef.current || selectedPPTXSlides.length === 0) return

    const fabric = fabricRef.current
    console.log(`📊 [PPTX] Agregando ${selectedPPTXSlides.length} diapositivas al canvas...`)

    try {
      for (const slide of selectedPPTXSlides) {
        // Calcular factor de escala entre el slide PPTX y el canvas
        const scaleX = (canvas.width || 1200) / slide.width
        const scaleY = (canvas.height || 800) / slide.height

        console.log(`📊 [PPTX] Factor de escala: Canvas ${canvas.width}x${canvas.height} / Slide ${slide.width}x${slide.height} = ${scaleX}x${scaleY}`)

        // Agregar cada elemento de la diapositiva
        for (const element of slide.elements) {
          // Escalar posición y tamaño al canvas actual
          const scaledPos = {
            x: element.position.x * scaleX,
            y: element.position.y * scaleY,
            width: element.position.width * scaleX,
            height: element.position.height * scaleY
          }

          if (element.type === 'image' && element.imageData) {
            // Agregar imagen manteniendo relación de aspecto
            const img = await fabric.Image.fromURL(element.imageData, {
              crossOrigin: 'anonymous'
            })

            // Usar escala uniforme para mantener relación de aspecto
            const uniformScale = Math.min(
              scaledPos.width / (img.width || 1),
              scaledPos.height / (img.height || 1)
            )

            img.set({
              left: scaledPos.x,
              top: scaledPos.y,
              scaleX: uniformScale,
              scaleY: uniformScale
            })

            console.log(`🖼️ [PPTX] Imagen agregada: ${scaledPos.x}, ${scaledPos.y} (escala uniforme: ${uniformScale.toFixed(3)})`)
            canvas.add(img)
          } else if (element.type === 'text' && element.content) {
            // Agregar texto con tamaño de fuente escalado
            const scaledFontSize = (element.style?.fontSize || 16) * Math.min(scaleX, scaleY)

            const text = new fabric.Textbox(element.content, {
              left: scaledPos.x,
              top: scaledPos.y,
              width: scaledPos.width,
              fontSize: scaledFontSize,
              fill: element.style?.color || '#000000',
              fontFamily: element.style?.fontFamily || 'Arial'
            })

            console.log(`📝 [PPTX] Texto agregado: "${element.content.substring(0, 20)}" en ${scaledPos.x}, ${scaledPos.y}`)
            canvas.add(text)
          } else if (element.type === 'shape') {
            // Agregar forma manteniendo relación de aspecto
            let shape: any

            // Usar escala uniforme para mantener relación de aspecto
            const uniformScale = Math.min(scaleX, scaleY)
            const shapeWidth = element.position.width * uniformScale
            const shapeHeight = element.position.height * uniformScale
            const shapeLeft = element.position.x * uniformScale
            const shapeTop = element.position.y * uniformScale

            const commonProps = {
              fill: element.style?.fill || '#cccccc',
              stroke: element.style?.stroke,
              strokeWidth: (element.style?.strokeWidth || 0) * uniformScale
            }

            // Mapear tipos de formas de PowerPoint a Fabric.js
            switch (element.shapeType) {
              case 'rect':
              case 'roundRect':
                shape = new fabric.Rect({
                  left: shapeLeft,
                  top: shapeTop,
                  width: shapeWidth,
                  height: shapeHeight,
                  rx: element.shapeType === 'roundRect' ? 10 : 0,
                  ry: element.shapeType === 'roundRect' ? 10 : 0,
                  ...commonProps
                })
                break

              case 'ellipse':
              case 'circle':
                shape = new fabric.Ellipse({
                  left: shapeLeft,
                  top: shapeTop,
                  rx: shapeWidth / 2,
                  ry: shapeHeight / 2,
                  ...commonProps
                })
                break

              case 'triangle':
                shape = new fabric.Triangle({
                  left: shapeLeft,
                  top: shapeTop,
                  width: shapeWidth,
                  height: shapeHeight,
                  ...commonProps
                })
                break

              case 'star':
              case 'star5':
              case 'star6':
              case 'star7':
              case 'star8':
                // Crear estrella usando polígono
                const points = element.shapeType === 'star' ? 5 :
                              parseInt(element.shapeType.replace('star', '')) || 5
                shape = createStar(shapeLeft + shapeWidth/2, shapeTop + shapeHeight/2,
                                  Math.min(shapeWidth, shapeHeight) / 2, points, commonProps)
                break

              case 'line':
                shape = new fabric.Line([
                  shapeLeft, shapeTop,
                  shapeLeft + shapeWidth, shapeTop + shapeHeight
                ], {
                  ...commonProps,
                  fill: undefined
                })
                break

              // Polygons
              case 'pentagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 5, commonProps)
                break

              case 'hexagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 6, commonProps)
                break

              case 'heptagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 7, commonProps)
                break

              case 'octagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 8, commonProps)
                break

              case 'decagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 10, commonProps)
                break

              case 'dodecagon':
                shape = createPolygon(shapeLeft, shapeTop, shapeWidth, shapeHeight, 12, commonProps)
                break

              // Arrows
              case 'rightArrow':
              case 'arrow':
                shape = createArrow(shapeLeft, shapeTop, shapeWidth, shapeHeight, 'right', commonProps)
                break

              case 'leftArrow':
                shape = createArrow(shapeLeft, shapeTop, shapeWidth, shapeHeight, 'left', commonProps)
                break

              case 'upArrow':
                shape = createArrow(shapeLeft, shapeTop, shapeWidth, shapeHeight, 'up', commonProps)
                break

              case 'downArrow':
                shape = createArrow(shapeLeft, shapeTop, shapeWidth, shapeHeight, 'down', commonProps)
                break

              // Plus/Cross
              case 'plus':
              case 'mathPlus':
                shape = createPlus(shapeLeft, shapeTop, shapeWidth, shapeHeight, commonProps)
                break

              // Heart
              case 'heart':
                shape = createHeart(shapeLeft, shapeTop, shapeWidth, shapeHeight, commonProps)
                break

              // House
              case 'homePlate':
              case 'house':
                shape = createHouse(shapeLeft, shapeTop, shapeWidth, shapeHeight, commonProps)
                break

              default:
                // Para formas no reconocidas (incluyendo iconos), usar rectángulo
                console.log(`⚠️ [PPTX] Forma desconocida "${element.shapeType}", renderizando como rectángulo`)
                shape = new fabric.Rect({
                  left: shapeLeft,
                  top: shapeTop,
                  width: shapeWidth,
                  height: shapeHeight,
                  ...commonProps
                })
            }

            if (shape) {
              console.log(`📐 [PPTX] Forma "${element.shapeType}" agregada en ${shapeLeft.toFixed(1)}, ${shapeTop.toFixed(1)} (${shapeWidth.toFixed(1)}x${shapeHeight.toFixed(1)})`)
              canvas.add(shape)
            } else {
              console.warn(`❌ [PPTX] No se pudo crear forma de tipo "${element.shapeType}"`)
            }
          }
        }
      }

      canvas.renderAll()
      console.log('✅ [PPTX] Elementos agregados al canvas')

      setShowPPTXConfirmModal(false)
      setSelectedPPTXSlides([])
    } catch (error) {
      console.error('❌ [PPTX] Error agregando elementos:', error)
    }
  }, [canvas, selectedPPTXSlides])

  // Agregar PPTX como páginas nuevas
  const handleAddPPTXAsPages = useCallback(() => {
    if (!onAddPages || selectedPPTXSlides.length === 0) {
      console.warn('⚠️ [PPTX] No se puede agregar como páginas: onAddPages no disponible')
      return
    }

    console.log(`📊 [PPTX] Agregando ${selectedPPTXSlides.length} diapositivas como páginas nuevas...`)
    onAddPages(selectedPPTXSlides)

    setShowPPTXConfirmModal(false)
    setSelectedPPTXSlides([])
  }, [onAddPages, selectedPPTXSlides])

  const uploadFont = useCallback(async () => {
    // Crear input file
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ttf,.otf,.woff,.woff2'

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      console.log('🔤 [Font Upload] Cargando fuente:', file.name)

      try {
        // Extraer nombre de fuente del archivo (sin extensión)
        const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '')

        // Leer el archivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Crear FontFace
        const fontFace = new FontFace(fontName, arrayBuffer)

        // Cargar la fuente
        await fontFace.load()

        // Agregar al document
        document.fonts.add(fontFace)

        // Agregar a la lista de fuentes personalizadas
        setCustomFonts(prev => [...prev, fontName])

        console.log('✅ [Font Upload] Fuente cargada:', fontName)
      } catch (error) {
        console.error('❌ [Font Upload] Error cargando fuente:', error)
        alert('Error al cargar la fuente. Asegúrate de que el archivo sea válido.')
      }
    }

    input.click()
  }, [])

  // Guardar estado en historial
  const saveHistory = useCallback(() => {
    if (!canvas || isUndoRedoing.current || isDrawingPolygonRef.current) return

    // Filtrar objetos temporales antes de guardar
    const allObjects = canvas.getObjects()
    const permanentObjects = allObjects.filter((obj: any) => !obj._isTemporary)

    // Crear un JSON solo con objetos permanentes
    const canvasData = canvas.toJSON()
    canvasData.objects = permanentObjects.map((obj: any) => obj.toObject())

    const json = JSON.stringify(canvasData)

    setHistory(prev => {
      // Si estamos en medio del historial, eliminar todo lo que viene después
      const currentStep = historyStepRef.current
      const newHistory = prev.slice(0, currentStep + 1)
      // Agregar nuevo estado
      newHistory.push(json)
      // Limitar a 50 estados
      if (newHistory.length > 50) {
        newHistory.shift()
        // No incrementar historyStep si hicimos shift
        setHistoryStep(49)
        historyStepRef.current = 49
        return newHistory
      }
      // Incrementar historyStep solo si no hicimos shift
      setHistoryStep(currentStep + 1)
      historyStepRef.current = currentStep + 1
      return newHistory
    })

    console.log('💾 [History] Estado guardado manualmente, step:', historyStepRef.current)
  }, [canvas])

  // Undo
  const undo = useCallback(() => {
    console.log('🔄 [Undo] Intentando undo...', {
      historyStep,
      historyLength: history.length,
      canUndo: historyStep > 0
    })

    if (!canvas) {
      console.warn('⚠️ [Undo] Canvas no disponible')
      return
    }

    if (historyStep <= 0) {
      console.warn('⚠️ [Undo] No hay más acciones para deshacer')
      return
    }

    isUndoRedoing.current = true

    const previousStep = historyStep - 1
    const previousState = history[previousStep]

    if (previousState) {
      console.log('↩️ [Undo] Cargando estado anterior, step:', previousStep)
      canvas.loadFromJSON(previousState, () => {
        // Hacer que todos los textos sean editables
        canvas.getObjects().forEach((obj: any) => {
          if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
            obj.set({
              editable: true,
              selectable: true
            })
          }
        })

        canvas.renderAll()
        setHistoryStep(previousStep)
        historyStepRef.current = previousStep

        // Forzar renders adicionales para asegurar visualización
        requestAnimationFrame(() => {
          canvas.renderAll()
          setTimeout(() => {
            canvas.renderAll()
            isUndoRedoing.current = false
            console.log('✅ [Undo] Undo completado, step:', previousStep)
          }, 50)
        })
      })
    } else {
      console.error('❌ [Undo] Estado anterior no encontrado')
      isUndoRedoing.current = false
    }
  }, [canvas, history, historyStep])

  // Redo
  const redo = useCallback(() => {
    console.log('🔄 [Redo] Intentando redo...', {
      historyStep,
      historyLength: history.length,
      canRedo: historyStep < history.length - 1
    })

    if (!canvas) {
      console.warn('⚠️ [Redo] Canvas no disponible')
      return
    }

    if (historyStep >= history.length - 1) {
      console.warn('⚠️ [Redo] No hay más acciones para rehacer')
      return
    }

    isUndoRedoing.current = true

    const nextStep = historyStep + 1
    const nextState = history[nextStep]

    if (nextState) {
      console.log('↪️ [Redo] Cargando estado siguiente, step:', nextStep)
      canvas.loadFromJSON(nextState, () => {
        // Hacer que todos los textos sean editables
        canvas.getObjects().forEach((obj: any) => {
          if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
            obj.set({
              editable: true,
              selectable: true
            })
          }
        })

        canvas.renderAll()
        setHistoryStep(nextStep)
        historyStepRef.current = nextStep

        // Forzar renders adicionales para asegurar visualización
        requestAnimationFrame(() => {
          canvas.renderAll()
          setTimeout(() => {
            canvas.renderAll()
            isUndoRedoing.current = false
            console.log('✅ [Redo] Redo completado, step:', nextStep)
          }, 50)
        })
      })
    } else {
      console.error('❌ [Redo] Estado siguiente no encontrado')
      isUndoRedoing.current = false
    }
  }, [canvas, history, historyStep])

  // Exportar como PNG
  const exportAsPNG = useCallback(() => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // 2x resolution
    })

    const link = document.createElement('a')
    link.download = `brochure-${Date.now()}.png`
    link.href = dataURL
    link.click()

    console.log('📥 [Export] PNG descargado')
  }, [canvas])

  // Exportar como JPG
  const exportAsJPG = useCallback(() => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: 2 // 2x resolution
    })

    const link = document.createElement('a')
    link.download = `brochure-${Date.now()}.jpg`
    link.href = dataURL
    link.click()

    console.log('📥 [Export] JPG descargado')
  }, [canvas])

  // Exportar como SVG
  const exportAsSVG = useCallback(() => {
    if (!canvas) return

    const svg = canvas.toSVG()
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.download = `brochure-${Date.now()}.svg`
    link.href = url
    link.click()

    URL.revokeObjectURL(url)

    console.log('📥 [Export] SVG descargado')
  }, [canvas])

  // Exportar como PDF (usando canvas.toDataURL y creando PDF simple)
  const exportAsPDF = useCallback(() => {
    if (!canvas) return

    // Crear un PDF simple con el canvas como imagen
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    })

    // Crear ventana con el dataURL para imprimir como PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Brochure PDF</title>
            <style>
              body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataURL}" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    console.log('📥 [Export] PDF generado (imprimir)')
  }, [canvas])

  // Estado para mostrar menú de exportación
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Funciones de alineación
  const alignLeft = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    activeObject.set({ left: 0 })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const alignCenter = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    const centerX = (canvas.width || 0) / 2
    activeObject.set({ left: centerX - (activeObject.width! * activeObject.scaleX!) / 2 })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const alignRight = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    const right = (canvas.width || 0) - (activeObject.width! * activeObject.scaleX!)
    activeObject.set({ left: right })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const alignTop = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    activeObject.set({ top: 0 })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const alignMiddle = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    const centerY = (canvas.height || 0) / 2
    activeObject.set({ top: centerY - (activeObject.height! * activeObject.scaleY!) / 2 })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const alignBottom = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    const bottom = (canvas.height || 0) - (activeObject.height! * activeObject.scaleY!)
    activeObject.set({ top: bottom })
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  const centerInCanvas = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    canvas.viewportCenterObject(activeObject)
    canvas.renderAll()
    saveHistory()
  }, [canvas, saveHistory])

  // Agrupar objetos seleccionados
  const groupObjects = useCallback(() => {
    if (!canvas || !fabricRef.current) return

    const activeSelection = canvas.getActiveObject()
    const fabric = fabricRef.current

    console.log('🔍 [Group] Active object:', activeSelection)
    console.log('🔍 [Group] Type:', activeSelection?.type)

    // Verificar si hay una selección
    if (!activeSelection) {
      console.log('⚠️ [Group] Selecciona múltiples objetos para agrupar (Ctrl+Click)')
      return
    }

    // En Fabric v6, ActiveSelection tiene type 'activeselection' (lowercase)
    if (activeSelection.type !== 'activeselection') {
      console.log('⚠️ [Group] Selecciona múltiples objetos para agrupar (Ctrl+Click)')
      return
    }

    // Obtener objetos usando getObjects() que es el método correcto en Fabric v6
    const objects = (activeSelection as any).getObjects ? (activeSelection as any).getObjects() : []

    console.log('🔍 [Group] Objetos encontrados:', objects.length)

    if (objects.length < 2) {
      console.log('⚠️ [Group] Selecciona al menos 2 objetos para agrupar')
      return
    }

    // Guardar posiciones antes de descartar la selección
    const selectionLeft = activeSelection.left
    const selectionTop = activeSelection.top

    // Primero descartar la selección activa
    canvas.discardActiveObject()

    // Crear un nuevo grupo con los objetos
    const group = new fabric.Group(objects, {
      left: selectionLeft,
      top: selectionTop
    })

    // Agregar el grupo al canvas
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.requestRenderAll()
    saveHistory()
    refreshLayers()

    console.log('✅ [Group] Objetos agrupados:', objects.length)
  }, [canvas, saveHistory, refreshLayers])

  // Desagrupar objetos
  const ungroupObjects = useCallback(() => {
    if (!canvas || !fabricRef.current) return

    const activeObject = canvas.getActiveObject()

    // Verificar si el objeto seleccionado es un grupo
    if (!activeObject || activeObject.type !== 'group') {
      console.log('⚠️ [Ungroup] Selecciona un grupo para desagrupar')
      return
    }

    const fabric = fabricRef.current
    const items = (activeObject as any)._objects || []

    // Guardar posición del grupo
    const groupLeft = activeObject.left || 0
    const groupTop = activeObject.top || 0

    // Remover el grupo del canvas
    canvas.remove(activeObject)

    // Agregar cada objeto individual de vuelta al canvas
    items.forEach((item: any) => {
      // Calcular posición absoluta del objeto
      const itemLeft = groupLeft + (item.left || 0)
      const itemTop = groupTop + (item.top || 0)

      item.set({
        left: itemLeft,
        top: itemTop
      })

      canvas.add(item)
    })

    canvas.requestRenderAll()
    saveHistory()
    refreshLayers()

    console.log('✅ [Ungroup] Grupo desagrupado:', items.length, 'objetos')
  }, [canvas, saveHistory, refreshLayers])

  const deleteSelected = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
      canvas.renderAll()
      setSelectedObject(null)
    }
  }, [canvas])

  const duplicateSelected = useCallback(async () => {
    if (!canvas || !fabricRef.current) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    const fabric = fabricRef.current

    try {
      // Para ActiveSelection (múltiples objetos), duplicar cada uno
      if (activeObject.type === 'activeselection') {
        const objects = (activeObject as any).getObjects ? (activeObject as any).getObjects() : []

        // Clonar todos los objetos
        const clonedPromises = objects.map(async (obj: any) => {
          const cloned = await obj.clone()
          cloned.set({
            left: (obj.left || 0) + 20,
            top: (obj.top || 0) + 20
          })
          return cloned
        })

        const clonedObjects = await Promise.all(clonedPromises)

        clonedObjects.forEach((cloned: any) => {
          canvas.add(cloned)
        })

        canvas.discardActiveObject()
        canvas.requestRenderAll()
        saveHistory()
        console.log('✅ [Duplicate] Objetos duplicados:', clonedObjects.length)
        return
      }

      // Para objetos individuales, usar clone()
      const cloned = await activeObject.clone()
      cloned.set({
        left: (activeObject.left || 0) + 20,
        top: (activeObject.top || 0) + 20
      })

      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.requestRenderAll()
      saveHistory()
      console.log('✅ [Duplicate] Objeto duplicado')
    } catch (error) {
      console.error('❌ [Duplicate] Error al duplicar:', error)
    }
  }, [canvas, saveHistory])

  // Mostrar mensaje toast
  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }, [])

  // Copiar objeto seleccionado al clipboard
  const copySelected = useCallback(async () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (!activeObject) return

    try {
      // Si es ActiveSelection (múltiples objetos), copiar cada uno
      if (activeObject.type === 'activeselection') {
        const objects = (activeObject as any).getObjects ? (activeObject as any).getObjects() : []

        const clonedPromises = objects.map((obj: any) => obj.clone())
        const clonedObjects = await Promise.all(clonedPromises)

        setClipboard(clonedObjects)
        showToast(`📋 ${clonedObjects.length} objetos copiados`)
        console.log('✅ [Copy] Objetos copiados al clipboard:', clonedObjects.length)
      } else {
        // Clonar un solo objeto
        const cloned = await activeObject.clone()
        setClipboard([cloned])
        showToast('📋 Objeto copiado')
        console.log('✅ [Copy] Objeto copiado al clipboard')
      }
    } catch (error) {
      console.error('❌ [Copy] Error al copiar:', error)
    }
  }, [canvas, showToast])

  // Pegar objeto del clipboard
  const pasteFromClipboard = useCallback(async () => {
    if (!canvas || !clipboard || clipboard.length === 0) return

    try {
      const pastedObjects: any[] = []

      // Pegar cada objeto del clipboard
      for (const obj of clipboard) {
        const cloned = await obj.clone()

        // Posicionar con offset
        cloned.set({
          left: (obj.left || 0) + 20,
          top: (obj.top || 0) + 20
        })

        canvas.add(cloned)
        pastedObjects.push(cloned)
      }

      // Actualizar clipboard con nuevas posiciones
      setClipboard(pastedObjects)

      // Seleccionar los objetos pegados
      if (pastedObjects.length === 1) {
        canvas.setActiveObject(pastedObjects[0])
      } else {
        const selection = new (fabricRef.current as any).ActiveSelection(pastedObjects, {
          canvas: canvas
        })
        canvas.setActiveObject(selection)
      }

      canvas.requestRenderAll()
      saveHistory()

      if (pastedObjects.length > 1) {
        showToast(`✅ ${pastedObjects.length} objetos pegados`)
      } else {
        showToast('✅ Objeto pegado')
      }
      console.log('✅ [Paste] Objetos pegados desde clipboard:', pastedObjects.length)
    } catch (error) {
      console.error('❌ [Paste] Error al pegar:', error)
    }
  }, [canvas, clipboard, saveHistory, showToast])

  const bringToFront = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringObjectToFront(activeObject)
      canvas.requestRenderAll()
      refreshLayers()
    }
  }, [canvas, refreshLayers])

  const sendToBack = useCallback(() => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendObjectToBack(activeObject)
      canvas.requestRenderAll()
      refreshLayers()
    }
  }, [canvas, refreshLayers])

  // Mover capa específica arriba/abajo
  const moveLayerUp = useCallback((layer: any) => {
    if (!canvas) return
    canvas.bringObjectForward(layer)
    canvas.requestRenderAll()
    refreshLayers()
  }, [canvas, refreshLayers])

  const moveLayerDown = useCallback((layer: any) => {
    if (!canvas) return
    canvas.sendObjectBackwards(layer)
    canvas.requestRenderAll()
    refreshLayers()
  }, [canvas, refreshLayers])

  // Generar thumbnail de una capa
  const generateLayerThumbnail = useCallback((layer: any) => {
    if (!canvas) return null

    try {
      // Crear un mini canvas temporal
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) return null

      // Tamaño del thumbnail
      const thumbSize = 40
      tempCanvas.width = thumbSize
      tempCanvas.height = thumbSize

      // Obtener bounds del objeto
      const bounds = layer.getBoundingRect()
      const scale = Math.min(thumbSize / bounds.width, thumbSize / bounds.height) * 0.8

      // Centrar y dibujar
      ctx.save()
      ctx.translate(thumbSize / 2, thumbSize / 2)
      ctx.scale(scale, scale)
      ctx.translate(-bounds.width / 2, -bounds.height / 2)

      layer.render(ctx)
      ctx.restore()

      return tempCanvas.toDataURL()
    } catch (error) {
      console.error('Error generando thumbnail:', error)
      return null
    }
  }, [canvas])

  const handleZoomIn = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.min(zoom * 1.2, 3)
    setZoom(newZoom)
    canvas.setZoom(newZoom)
    canvas.renderAll()
  }, [canvas, zoom])

  const handleZoomOut = useCallback(() => {
    if (!canvas) return
    const newZoom = Math.max(zoom / 1.2, 0.5)
    setZoom(newZoom)
    canvas.setZoom(newZoom)
    canvas.renderAll()
  }, [canvas, zoom])

  const resetZoom = useCallback(() => {
    if (!canvas) return
    setZoom(1)
    canvas.setZoom(1)
    canvas.renderAll()
  }, [canvas])

  const handleSave = useCallback(async () => {
    if (!canvas || !onSave || isDrawingPolygon) {
      console.warn('⚠️ No se puede guardar mientras se dibuja un polígono')
      return
    }

    setSaving(true)
    try {
      // Filtrar objetos temporales antes de guardar
      const allObjects = canvas.getObjects()
      const permanentObjects = allObjects.filter((obj: any) => !obj._isTemporary)

      const canvasData = canvas.toJSON()
      canvasData.objects = permanentObjects.map((obj: any) => obj.toObject())

      // Pasar immediate=true para guardado inmediato sin debounce
      await onSave(canvasData, canvas, true)
      console.log('✅ Canvas guardado')
    } finally {
      setSaving(false)
    }
  }, [canvas, onSave, isDrawingPolygon])

  // Inicializar historial una sola vez
  useEffect(() => {
    if (!canvas || historyInitialized.current) return

    // Filtrar objetos temporales del estado inicial
    const allObjects = canvas.getObjects()
    const permanentObjects = allObjects.filter((obj: any) => !obj._isTemporary)

    const canvasData = canvas.toJSON()
    canvasData.objects = permanentObjects.map((obj: any) => obj.toObject())

    const initialState = JSON.stringify(canvasData)
    setHistory([initialState])
    historyInitialized.current = true
    console.log('📝 [History] Estado inicial guardado')
  }, [canvas])

  // Escuchar eventos del canvas y guardar historial
  useEffect(() => {
    if (!canvas || !historyInitialized.current) return

    // Función inline que llama a saveHistory con debounce
    const handleChange = () => {
      // Verificar condiciones directamente para evitar dependencias (usar refs)
      if (isUndoRedoing.current || isDrawingPolygonRef.current) {
        console.log('⏭️ [History] Guardado omitido (undo/redo o dibujando polígono)')
        return
      }

      // Cancelar el timer anterior si existe
      if (historyDebounceTimer.current) {
        clearTimeout(historyDebounceTimer.current)
      }

      // Crear un nuevo timer para guardar después de 100ms
      historyDebounceTimer.current = setTimeout(() => {
        // Prevenir guardados simultáneos
        if (isSavingHistory.current) {
          console.log('⏭️ [History] Guardado omitido (ya hay un guardado en progreso)')
          return
        }

        isSavingHistory.current = true
        const json = JSON.stringify(canvas.toJSON())

        setHistory(prev => {
          const currentStep = historyStepRef.current
          // Eliminar todo lo que viene después del paso actual
          const newHistory = prev.slice(0, currentStep + 1)
          // Agregar nuevo estado
          newHistory.push(json)

          // Limitar a 50 estados
          if (newHistory.length > 50) {
            newHistory.shift()
            // El nuevo step es 49 (último índice del array de 50 elementos)
            const newStep = 49
            setHistoryStep(newStep)
            historyStepRef.current = newStep
            isSavingHistory.current = false
            console.log('💾 [History] Estado guardado (límite), step:', newStep, 'total:', newHistory.length)
            return newHistory
          }

          // El nuevo step es el último índice del array
          const newStep = newHistory.length - 1
          setHistoryStep(newStep)
          historyStepRef.current = newStep
          isSavingHistory.current = false
          console.log('💾 [History] Estado guardado, step:', newStep, 'total:', newHistory.length)
          return newHistory
        })
      }, 100) // Esperar 100ms sin cambios antes de guardar
    }

    canvas.on('object:modified', handleChange)
    canvas.on('object:added', handleChange)
    canvas.on('object:removed', handleChange)

    console.log('🎧 [History] Event listeners registrados')

    return () => {
      canvas.off('object:modified', handleChange)
      canvas.off('object:added', handleChange)
      canvas.off('object:removed', handleChange)

      // Limpiar el timer si existe
      if (historyDebounceTimer.current) {
        clearTimeout(historyDebounceTimer.current)
      }

      console.log('🔌 [History] Event listeners desregistrados')
    }
  }, [canvas])

  // Keyboard shortcuts
  useEffect(() => {
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      // Undo (Ctrl/Cmd + Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo (Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }

      // Group (Ctrl/Cmd + G)
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) {
        e.preventDefault()
        groupObjects()
      }

      // Ungroup (Ctrl/Cmd + Shift + G)
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && e.shiftKey) {
        e.preventDefault()
        ungroupObjects()
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteSelected()
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        duplicateSelected()
      }

      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        copySelected()
      }

      // Paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        pasteFromClipboard()
      }

      // Save (Ctrl/Cmd + S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }

      // Zoom in (Ctrl/Cmd + +)
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        handleZoomIn()
      }

      // Zoom out (Ctrl/Cmd + -)
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      }

      // Reset zoom (Ctrl/Cmd + 0)
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault()
        resetZoom()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, deleteSelected, duplicateSelected, copySelected, pasteFromClipboard, handleSave, handleZoomIn, handleZoomOut, resetZoom, undo, redo, groupObjects, ungroupObjects])

  // Polygon drawing mode event handlers
  useEffect(() => {
    if (!canvas || !fabricRef.current || !isDrawingPolygon) return
    const fabric = fabricRef.current

    const handleCanvasClick = (e: any) => {
      const pointer = canvas.getPointer(e.e)
      const newPoint = { x: pointer.x, y: pointer.y }

      console.log(`➕ [Polygon] Punto agregado:`, newPoint)
      setPolygonPoints(prev => [...prev, newPoint])

      // Dibujar círculo temporal para mostrar el punto
      const circle = new fabric.Circle({
        radius: 3,
        fill: '#be185d',
        left: newPoint.x - 3,
        top: newPoint.y - 3,
        selectable: false,
        evented: false
      })

      // Marcar como objeto temporal para que no se guarde en el historial
      ;(circle as any)._isTemporary = true

      canvas.add(circle)
      setTempPolygonCircles(prev => [...prev, circle]) // Guardar referencia al círculo
      canvas.renderAll()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelPolygonDrawing()
      } else if (e.key === 'Enter') {
        finishPolygonDrawing()
      }
    }

    canvas.on('mouse:down', handleCanvasClick)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      canvas.off('mouse:down', handleCanvasClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canvas, isDrawingPolygon, cancelPolygonDrawing, finishPolygonDrawing])

  // Actualizar posición del toolbar de crop cuando se mueve el rectángulo
  useEffect(() => {
    if (!canvas || !cropRect || !cropToolbarPosition) return

    const updateToolbarPosition = () => {
      const canvasElement = canvas.getElement()
      const canvasRect = canvasElement.getBoundingClientRect()
      const zoom = canvas.getZoom()

      const toolbarX = (cropRect.left + cropRect.width * cropRect.scaleX / 2) * zoom + canvasRect.left
      const toolbarY = (cropRect.top + cropRect.height * cropRect.scaleY + 20) * zoom + canvasRect.top

      setCropToolbarPosition({ x: toolbarX, y: toolbarY })
    }

    cropRect.on('moving', updateToolbarPosition)
    cropRect.on('scaling', updateToolbarPosition)
    cropRect.on('modified', updateToolbarPosition)

    return () => {
      cropRect.off('moving', updateToolbarPosition)
      cropRect.off('scaling', updateToolbarPosition)
      cropRect.off('modified', updateToolbarPosition)
    }
  }, [canvas, cropRect, cropToolbarPosition])

  const isReady = fabricLoaded && canvas

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`}>
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {!fabricLoaded ? 'Cargando editor visual...' : 'Inicializando canvas...'}
            </p>
          </div>
        </div>
      )}

      {/* Toolbar Minimalista */}
      {isReady && (
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Sección Izquierda: Undo/Redo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={undo}
                disabled={historyStep <= 0}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Rehacer (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 ml-1">
                {historyStep}/{history.length - 1}
              </span>
            </div>

            {/* Sección Central: Herramientas principales */}
            <div className="flex items-center gap-2">
              {/* Selección */}
              <button
                type="button"
                onClick={() => {
                  if (canvas) {
                    canvas.discardActiveObject()
                    canvas.renderAll()
                  }
                }}
                className="p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                title="Herramienta de selección (V)"
              >
                <MousePointer className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Texto */}
              <button
                type="button"
                onClick={addText}
                className="p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                title="Agregar texto (T)"
              >
                <Type className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Dropdown de Formas con Submenús */}
              <DropdownMenu
                trigger={
                  <button
                type="button"
                    className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                    title="Formas"
                  >
                    <Shapes className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                }
                items={[
                  {
                    label: 'Formas básicas',
                    icon: <Square className="w-4 h-4" />,
                    submenu: [
                      {
                        label: 'Rectángulo',
                        icon: <Square className="w-4 h-4" />,
                        onClick: addRectangle
                      },
                      {
                        label: 'Círculo',
                        icon: <Circle className="w-4 h-4" />,
                        onClick: addCircle
                      },
                      {
                        label: 'Triángulo',
                        icon: <Triangle className="w-4 h-4" />,
                        onClick: addTriangle
                      },
                      {
                        label: 'Línea',
                        icon: <Minus className="w-4 h-4" />,
                        onClick: addLine
                      }
                    ]
                  },
                  {
                    label: 'Flechas',
                    icon: <ArrowRight className="w-4 h-4" />,
                    submenu: [
                      {
                        label: 'Flecha derecha',
                        icon: <ArrowRight className="w-4 h-4" />,
                        onClick: addArrowRight
                      },
                      {
                        label: 'Flecha izquierda',
                        icon: <ArrowLeft className="w-4 h-4" />,
                        onClick: addArrowLeft
                      },
                      {
                        label: 'Flecha arriba',
                        icon: <ArrowUp className="w-4 h-4" />,
                        onClick: addArrowUp
                      },
                      {
                        label: 'Flecha abajo',
                        icon: <ArrowDown className="w-4 h-4" />,
                        onClick: addArrowDown
                      },
                      {
                        label: 'Flecha bidireccional',
                        icon: <MoveRight className="w-4 h-4" />,
                        onClick: addArrowBidirectional
                      }
                    ]
                  },
                  {
                    label: 'Polígonos',
                    icon: <Pentagon className="w-4 h-4" />,
                    submenu: [
                      {
                        label: 'Pentágono',
                        icon: <Pentagon className="w-4 h-4" />,
                        onClick: addPentagon,
                        disabled: isDrawingPolygon
                      },
                      {
                        label: 'Hexágono',
                        icon: <Hexagon className="w-4 h-4" />,
                        onClick: addHexagon,
                        disabled: isDrawingPolygon
                      },
                      {
                        label: 'Estrella',
                        icon: <Star className="w-4 h-4" />,
                        onClick: addStar,
                        disabled: isDrawingPolygon
                      },
                      {
                        label: isDrawingPolygon ? 'Dibujando...' : 'Polígono libre',
                        icon: <PenTool className="w-4 h-4" />,
                        onClick: startPolygonDrawing,
                        disabled: isDrawingPolygon
                      }
                    ]
                  }
                ]}
              />

              <div className="w-px h-6 bg-gray-300" />

              {/* Dropdown de Imagen/Medios */}
              <DropdownMenu
                trigger={
                  <button
                type="button"
                    className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                    title="Imagen y medios"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                }
                items={[
                  {
                    label: 'Agregar imagen',
                    icon: <ImageIcon className="w-4 h-4" />,
                    onClick: addImage
                  },
                  {
                    label: 'Importar PDF',
                    icon: <FileText className="w-4 h-4" />,
                    onClick: addPDF
                  },
                  {
                    label: 'Importar PowerPoint',
                    icon: <Presentation className="w-4 h-4" />,
                    onClick: addPPTX
                  }
                ]}
              />
            </div>

            {/* Sección Derecha: Vista y acciones */}
            <div className="flex items-center gap-2">
              {/* Zoom */}
              <div className="flex items-center gap-1">
                <button
                type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
                  title="Alejar (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                type="button"
                  onClick={resetZoom}
                  className="px-2 py-1 hover:bg-gray-100 text-gray-700 rounded transition-colors text-xs font-medium min-w-[48px]"
                  title="Restablecer zoom (0)"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
                  title="Acercar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Capas */}
              <button
                type="button"
                onClick={() => setShowLayers(!showLayers)}
                className={`p-2 rounded-lg transition-colors ${
                  showLayers
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Mostrar/Ocultar capas"
              >
                <Layers className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Exportar con DropdownMenu */}
              <DropdownMenu
                trigger={
                  <button
                type="button"
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    title="Exportar"
                  >
                    <Download className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                }
                align="right"
                items={[
                  {
                    label: 'Exportar como PNG',
                    icon: <FileDown className="w-4 h-4" />,
                    onClick: exportAsPNG
                  },
                  {
                    label: 'Exportar como JPG',
                    icon: <FileDown className="w-4 h-4" />,
                    onClick: exportAsJPG
                  },
                  {
                    label: 'Exportar como SVG',
                    icon: <FileDown className="w-4 h-4" />,
                    onClick: exportAsSVG
                  },
                  {
                    label: 'Imprimir como PDF',
                    icon: <FileDown className="w-4 h-4" />,
                    onClick: exportAsPDF
                  }
                ]}
              />

              {/* Guardar */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Guardar cambios (Ctrl+S)"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polygon Drawing Mode Notification */}
      {isReady && isDrawingPolygon && (
        <div className="bg-pink-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <PenTool className="w-5 h-5" />
            <div>
              <p className="font-semibold">Modo de Dibujo de Polígono</p>
              <p className="text-xs text-pink-100">
                Clic para agregar puntos • Enter para finalizar • Esc para cancelar • Mínimo 3 puntos ({polygonPoints.length} agregados)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
                type="button"
              onClick={finishPolygonDrawing}
              disabled={polygonPoints.length < 3}
              className="px-3 py-1.5 bg-white text-pink-600 rounded font-medium text-sm hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar
            </button>
            <button
                type="button"
              onClick={cancelPolygonDrawing}
              className="px-3 py-1.5 bg-pink-700 hover:bg-pink-800 rounded font-medium text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Container - ALWAYS rendered */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="shadow-2xl" style={{ width, height }}>
            <canvas ref={canvasRef} />
          </div>

          {/* Panel Flotante de Propiedades (Moderno y Compacto) */}
          {isReady && selectedObject && (
            <div
              className="absolute backdrop-blur-xl bg-white/95 rounded-xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                left: `${floatingPanelPosition.x}px`,
                top: `${floatingPanelPosition.y}px`,
                width: '340px',
                maxHeight: '600px',
                cursor: isDraggingPanel ? 'grabbing' : 'default'
              }}
              onMouseDown={handlePanelMouseDown}
            >
              {/* Header compacto con acciones rápidas */}
              <div className="drag-handle bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 cursor-grab active:cursor-grabbing flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" />
                  <h3 className="text-xs font-semibold">Propiedades</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      duplicateSelected()
                    }}
                    className="p-1 hover:bg-blue-700 rounded transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSelected()
                    }}
                    className="p-1 hover:bg-red-600 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      canvas?.discardActiveObject()
                      canvas?.renderAll()
                    }}
                    className="p-1 hover:bg-blue-700 rounded transition-colors"
                    title="Cerrar"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tabs de navegación */}
              <div className="flex border-b border-gray-200 bg-gray-50/50 px-2">
                <button
                type="button"
                  onClick={() => setActivePanelTab('general')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    activePanelTab === 'general'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  General
                </button>
                <button
                type="button"
                  onClick={() => setActivePanelTab('style')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    activePanelTab === 'style'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Estilo
                </button>
                <button
                type="button"
                  onClick={() => setActivePanelTab('alignment')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    activePanelTab === 'alignment'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Alineación
                </button>
                <button
                type="button"
                  onClick={() => setActivePanelTab('order')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    activePanelTab === 'order'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Orden
                </button>
                {(selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox') && (
                  <button
                type="button"
                    onClick={() => setActivePanelTab('text')}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                      activePanelTab === 'text'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Texto
                  </button>
                )}
              </div>

              {/* Contenido del panel - scrollable */}
              <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
                <div className="p-3 space-y-3">
                  {/* TAB: GENERAL */}
                  {activePanelTab === 'general' && (
                    <>
                      {/* Posición & Dimensiones (inline) */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">X</label>
                          <input
                            type="number"
                            value={Math.round(selectedObjectProps.left)}
                            onChange={(e) => updateObjectProperty('left', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Y</label>
                          <input
                            type="number"
                            value={Math.round(selectedObjectProps.top)}
                            onChange={(e) => updateObjectProperty('top', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">W</label>
                          <input
                            type="number"
                            value={Math.round(selectedObjectProps.width * selectedObjectProps.scaleX)}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value) || 0
                              const newScaleX = newWidth / selectedObjectProps.width
                              updateObjectProperty('scaleX', newScaleX)
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">H</label>
                          <input
                            type="number"
                            value={Math.round(selectedObjectProps.height * selectedObjectProps.scaleY)}
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value) || 0
                              const newScaleY = newHeight / selectedObjectProps.height
                              updateObjectProperty('scaleY', newScaleY)
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Rotación */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Rotación ({Math.round(selectedObjectProps.angle)}°)</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={Math.round(selectedObjectProps.angle)}
                          onChange={(e) => updateObjectProperty('angle', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Opacidad */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Opacidad ({Math.round(selectedObjectProps.opacity * 100)}%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round(selectedObjectProps.opacity * 100)}
                          onChange={(e) => updateObjectProperty('opacity', parseInt(e.target.value) / 100)}
                          className="w-full"
                        />
                      </div>

                      {/* Bloquear */}
                      <button
                type="button"
                        onClick={() => {
                          const locked = selectedObjectProps.lockMovementX || false
                          selectedObject.set({
                            lockMovementX: !locked,
                            lockMovementY: !locked,
                            lockRotation: !locked,
                            lockScalingX: !locked,
                            lockScalingY: !locked,
                            selectable: locked
                          })
                          canvas?.renderAll()
                          // Actualizar el estado de React para reflejar cambios en la UI
                          setSelectedObjectProps((prev: any) => ({
                            ...prev,
                            lockMovementX: !locked
                          }))
                        }}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                          selectedObjectProps.lockMovementX
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedObjectProps.lockMovementX ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Bloqueado
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            Desbloqueado
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {/* TAB: ESTILO */}
                  {activePanelTab === 'style' && (
                    <>
                      {/* Colores para formas */}
                      {(selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'line' || selectedObject.type === 'polygon') && (
                        <>
                          {selectedObject.type !== 'line' && (
                            <div>
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">Relleno</label>
                              <input
                                type="color"
                                value={selectedObjectProps.fill}
                                onChange={(e) => updateObjectProperty('fill', e.target.value)}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>
                          )}
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-1">Borde</label>
                            <input
                              type="color"
                              value={selectedObjectProps.stroke}
                              onChange={(e) => updateObjectProperty('stroke', e.target.value)}
                              className="w-full h-8 rounded border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-1">Grosor ({selectedObjectProps.strokeWidth}px)</label>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={selectedObjectProps.strokeWidth}
                              onChange={(e) => updateObjectProperty('strokeWidth', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}

                      {/* Filtros para imágenes */}
                      {selectedObject.type === 'image' && fabricRef.current && (
                        <>
                          {/* Botón Reemplazar Imagen */}
                          <div className="mb-4">
                            <button
                              type="button"
                              onClick={handleReplaceImage}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                              title="Reemplazar imagen manteniendo posición y propiedades"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Reemplazar imagen
                            </button>
                          </div>

                          {/* Herramientas de Edición */}
                          <div className="mb-4">
                            <label className="block text-[10px] font-medium text-gray-700 mb-2">Herramientas de edición</label>

                            {/* Recortar y Flips */}
                            <div className="grid grid-cols-3 gap-1.5 mb-2">
                              <button
                                type="button"
                                onClick={handleStartCrop}
                                className="flex items-center justify-center gap-1 px-2 py-2 text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                                title="Recortar imagen"
                              >
                                <Scissors className="w-3.5 h-3.5" />
                                <span>Recortar</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleFlipHorizontal}
                                className="flex items-center justify-center gap-1 px-2 py-2 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                title="Voltear horizontalmente"
                              >
                                <FlipHorizontal className="w-3.5 h-3.5" />
                                <span>Flip H</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleFlipVertical}
                                className="flex items-center justify-center gap-1 px-2 py-2 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                title="Voltear verticalmente"
                              >
                                <FlipVertical className="w-3.5 h-3.5" />
                                <span>Flip V</span>
                              </button>
                            </div>

                            {/* Rotaciones */}
                            <div className="grid grid-cols-2 gap-1.5 mb-2">
                              <button
                                type="button"
                                onClick={handleRotate90}
                                className="flex items-center justify-center gap-1 px-2 py-2 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                title="Rotar 90° en sentido horario"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Rotar 90°</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleRotateMinus90}
                                className="flex items-center justify-center gap-1 px-2 py-2 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                title="Rotar 90° en sentido antihorario"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Rotar -90°</span>
                              </button>
                            </div>

                            {/* Restablecer */}
                            <button
                              type="button"
                              onClick={handleResetImage}
                              className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors"
                              title="Restablecer todos los ajustes"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Restablecer todo</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-2">Filtros rápidos</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                type="button"
                                onClick={() => {
                                  const fabric = fabricRef.current
                                  selectedObject.filters = [new fabric.filters.Grayscale()]
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="px-2 py-1.5 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                Grises
                              </button>
                              <button
                type="button"
                                onClick={() => {
                                  const fabric = fabricRef.current
                                  selectedObject.filters = [new fabric.filters.Sepia()]
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="px-2 py-1.5 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                Sepia
                              </button>
                              <button
                type="button"
                                onClick={() => {
                                  const fabric = fabricRef.current
                                  selectedObject.filters = [new fabric.filters.Invert()]
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="px-2 py-1.5 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                Invertir
                              </button>
                              <button
                type="button"
                                onClick={() => {
                                  selectedObject.filters = []
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="px-2 py-1.5 text-[10px] bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-1">Brillo</label>
                            <input
                              type="range"
                              min="-1"
                              max="1"
                              step="0.1"
                              defaultValue="0"
                              onChange={(e) => {
                                const fabric = fabricRef.current
                                const value = parseFloat(e.target.value)
                                selectedObject.filters = selectedObject.filters?.filter((f: any) => f.type !== 'Brightness') || []
                                if (value !== 0) {
                                  selectedObject.filters.push(new fabric.filters.Brightness({ brightness: value }))
                                }
                                selectedObject.applyFilters()
                                canvas?.renderAll()
                              }}
                              className="w-full"
                            />
                          </div>

                          {/* Filtros Avanzados */}
                          <div>
                            <label className="block text-[10px] font-medium text-gray-700 mb-2 mt-3">Ajustes avanzados</label>

                            {/* Contraste */}
                            <div className="mb-2">
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">Contraste</label>
                              <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.1"
                                defaultValue="0"
                                onChange={(e) => {
                                  const fabric = fabricRef.current
                                  const value = parseFloat(e.target.value)
                                  selectedObject.filters = selectedObject.filters?.filter((f: any) => f.type !== 'Contrast') || []
                                  if (value !== 0) {
                                    selectedObject.filters.push(new fabric.filters.Contrast({ contrast: value }))
                                  }
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="w-full"
                              />
                            </div>

                            {/* Saturación */}
                            <div className="mb-2">
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">Saturación</label>
                              <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.1"
                                defaultValue="0"
                                onChange={(e) => {
                                  const fabric = fabricRef.current
                                  const value = parseFloat(e.target.value)
                                  selectedObject.filters = selectedObject.filters?.filter((f: any) => f.type !== 'Saturation') || []
                                  if (value !== 0) {
                                    selectedObject.filters.push(new fabric.filters.Saturation({ saturation: value }))
                                  }
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="w-full"
                              />
                            </div>

                            {/* Blur */}
                            <div className="mb-2">
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">Desenfoque</label>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                defaultValue="0"
                                onChange={(e) => {
                                  const fabric = fabricRef.current
                                  const value = parseFloat(e.target.value)
                                  selectedObject.filters = selectedObject.filters?.filter((f: any) => f.type !== 'Blur') || []
                                  if (value > 0) {
                                    selectedObject.filters.push(new fabric.filters.Blur({ blur: value }))
                                  }
                                  selectedObject.applyFilters()
                                  canvas?.renderAll()
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Color de texto */}
                      {(selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox') && (
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Color</label>
                          <input
                            type="color"
                            value={selectedObjectProps.fill}
                            onChange={(e) => updateObjectProperty('fill', e.target.value)}
                            className="w-full h-8 rounded border border-gray-300"
                          />
                        </div>
                      )}

                      {/* Controles de Sombra (para todos los objetos) */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[10px] font-semibold text-gray-700">Sombra</label>
                          <input
                            type="checkbox"
                            checked={!!selectedObject.shadow}
                            onChange={(e) => {
                              if (e.target.checked) {
                                selectedObject.shadow = {
                                  color: 'rgba(0,0,0,0.3)',
                                  blur: 10,
                                  offsetX: 5,
                                  offsetY: 5
                                }
                              } else {
                                selectedObject.shadow = null
                              }
                              canvas?.renderAll()
                              setSelectedObject({...selectedObject})
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        {selectedObject.shadow && (
                          <>
                            <div>
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">Color</label>
                              <input
                                type="color"
                                value={selectedObject.shadow.color?.replace('rgba(', '#').replace(/,.*/, '') || '#000000'}
                                onChange={(e) => {
                                  if (selectedObject.shadow) {
                                    selectedObject.shadow.color = e.target.value
                                    canvas?.renderAll()
                                    setSelectedObject({...selectedObject})
                                  }
                                }}
                                className="w-full h-8 rounded border border-gray-300"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                Desplazamiento X ({selectedObject.shadow.offsetX || 0}px)
                              </label>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={selectedObject.shadow.offsetX || 0}
                                onChange={(e) => {
                                  if (selectedObject.shadow) {
                                    selectedObject.shadow.offsetX = parseInt(e.target.value)
                                    canvas?.renderAll()
                                    setSelectedObject({...selectedObject})
                                  }
                                }}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                Desplazamiento Y ({selectedObject.shadow.offsetY || 0}px)
                              </label>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={selectedObject.shadow.offsetY || 0}
                                onChange={(e) => {
                                  if (selectedObject.shadow) {
                                    selectedObject.shadow.offsetY = parseInt(e.target.value)
                                    canvas?.renderAll()
                                    setSelectedObject({...selectedObject})
                                  }
                                }}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                Difuminado ({selectedObject.shadow.blur || 0}px)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="30"
                                value={selectedObject.shadow.blur || 0}
                                onChange={(e) => {
                                  if (selectedObject.shadow) {
                                    selectedObject.shadow.blur = parseInt(e.target.value)
                                    canvas?.renderAll()
                                    setSelectedObject({...selectedObject})
                                  }
                                }}
                                className="w-full"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* TAB: TEXTO */}
                  {activePanelTab === 'text' && (selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox') && (
                    <>
                      {/* Tamaño */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Tamaño ({selectedObjectProps.fontSize}px)</label>
                        <input
                          type="range"
                          min="8"
                          max="120"
                          value={selectedObjectProps.fontSize}
                          onChange={(e) => updateObjectProperty('fontSize', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Fuente */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-medium text-gray-500">Fuente</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowFontUploader(true)}
                              className="text-[10px] text-green-600 hover:text-green-700 font-medium"
                            >
                              + Subir
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowFontSelector(true)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Buscar...
                            </button>
                          </div>
                        </div>
                        <FontDropdown
                          value={selectedObjectProps.fontFamily}
                          onChange={(fontName) => {
                            updateObjectProperty('fontFamily', fontName)
                            loadFontOnDemand(fontName)
                          }}
                          fonts={getAllFontNames()}
                          customFonts={customFonts}
                        />
                      </div>

                      {/* Estilos */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Estilo</label>
                        <div className="flex gap-1.5">
                          <button
                type="button"
                            onClick={() => {
                              const newValue = selectedObjectProps.fontWeight === 'bold' ? 'normal' : 'bold'
                              updateObjectProperty('fontWeight', newValue)
                            }}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.fontWeight === 'bold'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Bold className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                type="button"
                            onClick={() => {
                              const newValue = selectedObjectProps.fontStyle === 'italic' ? 'normal' : 'italic'
                              updateObjectProperty('fontStyle', newValue)
                            }}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.fontStyle === 'italic'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Italic className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                type="button"
                            onClick={() => updateObjectProperty('underline', !selectedObjectProps.underline)}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.underline
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Underline className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>
                      </div>

                      {/* Alineación */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Alineación</label>
                        <div className="flex gap-1.5">
                          <button
                type="button"
                            onClick={() => updateObjectProperty('textAlign', 'left')}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.textAlign === 'left'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <AlignLeft className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                type="button"
                            onClick={() => updateObjectProperty('textAlign', 'center')}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.textAlign === 'center'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <AlignCenter className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                type="button"
                            onClick={() => updateObjectProperty('textAlign', 'right')}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.textAlign === 'right'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <AlignRight className="w-3.5 h-3.5 mx-auto" />
                          </button>
                          <button
                type="button"
                            onClick={() => updateObjectProperty('textAlign', 'justify')}
                            className={`flex-1 p-1.5 rounded transition-colors ${
                              selectedObjectProps.textAlign === 'justify'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <AlignJustify className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>
                      </div>

                      {/* Espaciado entre líneas */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                          Espaciado entre líneas ({selectedObjectProps.lineHeight || 1.16})
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={selectedObjectProps.lineHeight || 1.16}
                          onChange={(e) => updateObjectProperty('lineHeight', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Espaciado entre caracteres */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                          Espaciado entre caracteres ({selectedObjectProps.charSpacing || 0})
                        </label>
                        <input
                          type="range"
                          min="-200"
                          max="1000"
                          step="10"
                          value={selectedObjectProps.charSpacing || 0}
                          onChange={(e) => updateObjectProperty('charSpacing', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {/* TAB: ALINEACIÓN */}
                  {activePanelTab === 'alignment' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-2">Alinear en canvas</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {/* Fila superior */}
                          <button
                type="button"
                            onClick={() => {
                              alignLeft()
                              alignTop()
                            }}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear arriba izquierda"
                          >
                            <div className="w-4 h-4 mx-auto flex items-start justify-start">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={alignTop}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear arriba centro"
                          >
                            <div className="w-4 h-4 mx-auto flex items-start justify-center">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={() => {
                              alignRight()
                              alignTop()
                            }}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear arriba derecha"
                          >
                            <div className="w-4 h-4 mx-auto flex items-start justify-end">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>

                          {/* Fila central */}
                          <button
                type="button"
                            onClick={alignLeft}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear centro izquierda"
                          >
                            <div className="w-4 h-4 mx-auto flex items-center justify-start">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={centerInCanvas}
                            className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-lg transition-colors"
                            title="Centrar en canvas"
                          >
                            <div className="w-4 h-4 mx-auto flex items-center justify-center">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={alignRight}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear centro derecha"
                          >
                            <div className="w-4 h-4 mx-auto flex items-center justify-end">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>

                          {/* Fila inferior */}
                          <button
                type="button"
                            onClick={() => {
                              alignLeft()
                              alignBottom()
                            }}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear abajo izquierda"
                          >
                            <div className="w-4 h-4 mx-auto flex items-end justify-start">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={alignBottom}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear abajo centro"
                          >
                            <div className="w-4 h-4 mx-auto flex items-end justify-center">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                          <button
                type="button"
                            onClick={() => {
                              alignRight()
                              alignBottom()
                            }}
                            className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Alinear abajo derecha"
                          >
                            <div className="w-4 h-4 mx-auto flex items-end justify-end">
                              <div className="w-2 h-2 bg-current rounded-sm" />
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <label className="block text-[10px] font-medium text-gray-700 mb-2">Alineación precisa</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                type="button"
                            onClick={alignCenter}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors text-xs"
                            title="Centrar horizontal"
                          >
                            <AlignCenterHorizontal className="w-3.5 h-3.5" />
                            H
                          </button>
                          <button
                type="button"
                            onClick={alignMiddle}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors text-xs"
                            title="Centrar vertical"
                          >
                            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
                            V
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB: ORDEN Y ACCIONES */}
                  {activePanelTab === 'order' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-2">Orden de capas (Z-index)</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                type="button"
                            onClick={bringToFront}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Traer al frente"
                          >
                            <ArrowUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Al frente</span>
                          </button>
                          <button
                type="button"
                            onClick={sendToBack}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Enviar al fondo"
                          >
                            <ArrowDown className="w-4 h-4" />
                            <span className="text-xs font-medium">Al fondo</span>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <label className="block text-[10px] font-medium text-gray-700 mb-2">Agrupar objetos</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                type="button"
                            onClick={groupObjects}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
                            title="Agrupar (Ctrl+G)"
                          >
                            <Group className="w-4 h-4" />
                            <span className="text-xs font-medium">Agrupar</span>
                          </button>
                          <button
                type="button"
                            onClick={ungroupObjects}
                            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                              selectedObject?.type === 'group'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600'
                            }`}
                            title="Desagrupar (Ctrl+Shift+G)"
                          >
                            <Ungroup className="w-4 h-4" />
                            <span className="text-xs font-medium">Desagrupar</span>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <label className="block text-[10px] font-medium text-gray-700 mb-2">Acciones rápidas</label>
                        <div className="space-y-1.5">
                          <button
                type="button"
                            onClick={copySelected}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded-lg transition-colors"
                            title="Copiar (Ctrl+C)"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-medium">Copiar</span>
                          </button>
                          <button
                type="button"
                            onClick={pasteFromClipboard}
                            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                              clipboard
                                ? 'bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title="Pegar (Ctrl+V)"
                            disabled={!clipboard}
                          >
                            <Clipboard className="w-4 h-4" />
                            <span className="text-xs font-medium">Pegar</span>
                          </button>
                          <button
                type="button"
                            onClick={duplicateSelected}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 rounded-lg transition-colors"
                            title="Duplicar (Ctrl+D)"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-medium">Duplicar</span>
                          </button>
                          <button
                type="button"
                            onClick={deleteSelected}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 rounded-lg transition-colors"
                            title="Eliminar (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Panel Flotante de Capas (Moderno) */}
        {isReady && showLayers && (
          <div
            className="absolute backdrop-blur-xl bg-white/95 rounded-xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-right-2 duration-150"
            style={{
              left: `${layersPanelPosition.x}px`,
              top: `${layersPanelPosition.y}px`,
              width: '320px',
              maxHeight: '500px',
              cursor: isDraggingLayersPanel ? 'grabbing' : 'default'
            }}
            onMouseDown={handleLayersPanelMouseDown}
          >
            {/* Header */}
            <div className="drag-handle-layers bg-gradient-to-r from-slate-700 to-slate-600 text-white px-3 py-2 cursor-grab active:cursor-grabbing flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <h3 className="text-xs font-semibold">Capas</h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  {layers.length}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLayers(false)
                }}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
                title="Cerrar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto p-3" style={{ maxHeight: '440px' }}>
              {layers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No hay objetos</p>
                  <p className="text-xs mt-1">Agrega formas, texto o imágenes</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {layers.slice().reverse().map((layer: any, index: number) => {
                    const isSelected = selectedObject === layer
                    const isGroup = layer.type === 'group'

                    // Nombre de la capa
                    let layerName = 'Objeto'
                    let layerIcon = <Square className="w-4 h-4" />

                    if (isGroup) {
                      layerName = `Grupo (${layer._objects?.length || 0})`
                      layerIcon = <Group className="w-4 h-4" />
                    } else if (layer.type === 'i-text' || layer.type === 'text' || layer.type === 'textbox') {
                      layerName = layer.text?.substring(0, 15) || 'Texto'
                      if (layerName.length >= 15) layerName += '...'
                      layerIcon = <Type className="w-4 h-4" />
                    } else if (layer.type === 'image') {
                      layerName = 'Imagen'
                      layerIcon = <ImageIcon className="w-4 h-4" />
                    } else if (layer.type === 'rect') {
                      layerName = 'Rectángulo'
                      layerIcon = <Square className="w-4 h-4" />
                    } else if (layer.type === 'circle') {
                      layerName = 'Círculo'
                      layerIcon = <Circle className="w-4 h-4" />
                    } else if (layer.type === 'triangle') {
                      layerName = 'Triángulo'
                      layerIcon = <Triangle className="w-4 h-4" />
                    } else if (layer.type === 'line') {
                      layerName = 'Línea'
                      layerIcon = <Minus className="w-4 h-4" />
                    } else if (layer.type === 'polygon') {
                      layerName = 'Polígono'
                      layerIcon = <Pentagon className="w-4 h-4" />
                    }

                    return (
                      <div key={index}>
                        <div
                          onClick={() => {
                            canvas?.setActiveObject(layer)
                            canvas?.renderAll()
                            setSelectedObject(layer)
                          }}
                          className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-100 border border-blue-300 shadow-sm'
                              : 'bg-gray-50/80 border border-transparent hover:bg-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded border flex items-center justify-center ${
                            isSelected ? 'border-blue-300 bg-white' : 'border-gray-200 bg-white'
                          }`}>
                            <div className="text-gray-500">
                              {layerIcon}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${
                              isSelected ? 'text-blue-900' : 'text-gray-700'
                            }`}>
                              {layerName}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {layer.type}
                            </p>
                          </div>

                          {/* Controles */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Mover arriba */}
                            <button
                type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                moveLayerUp(layer)
                              }}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                              title="Mover arriba"
                            >
                              <ArrowUp className="w-3 h-3 text-gray-600" />
                            </button>

                            {/* Mover abajo */}
                            <button
                type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                moveLayerDown(layer)
                              }}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                              title="Mover abajo"
                            >
                              <ArrowDown className="w-3 h-3 text-gray-600" />
                            </button>

                            {/* Visibilidad */}
                            <button
                type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const visible = layer.visible !== false
                                layer.set({ visible: !visible })
                                canvas?.renderAll()
                                refreshLayers()
                              }}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                              title={layer.visible !== false ? 'Ocultar' : 'Mostrar'}
                            >
                              {layer.visible !== false ? (
                                <Eye className="w-3 h-3 text-gray-600" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Elementos del grupo (si es grupo) */}
                        {isGroup && layer._objects && layer._objects.length > 0 && (
                          <div className="ml-6 mt-1 space-y-1 pl-3 border-l-2 border-gray-200">
                            {layer._objects.map((childLayer: any, childIndex: number) => {
                              const childName = childLayer.type === 'i-text' || childLayer.type === 'text' || childLayer.type === 'textbox'
                                ? `Texto: ${childLayer.text?.substring(0, 10) || 'Sin texto'}...`
                                : childLayer.type || 'Objeto'

                              return (
                                <div
                                  key={childIndex}
                                  className="flex items-center gap-2 p-1.5 rounded bg-gray-50/50 text-xs text-gray-600"
                                >
                                  <div className="w-6 h-6 rounded border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                                    {childLayer.type === 'rect' && <Square className="w-3 h-3" />}
                                    {childLayer.type === 'circle' && <Circle className="w-3 h-3" />}
                                    {childLayer.type === 'text' && <Type className="w-3 h-3" />}
                                    {childLayer.type === 'image' && <ImageIcon className="w-3 h-3" />}
                                  </div>
                                  <span className="truncate flex-1">{childName}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Modal de Selección de Imágenes */}
      <ImageSelectorModal
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelectImage={handleImageSelected}
      />

      {/* Modal de Selección de PDF */}
      <PDFSelectorModal
        isOpen={showPDFSelector}
        onClose={() => setShowPDFSelector(false)}
        onSelectPage={handlePDFPageSelected}
      />

      {/* Modal de Selección de PPTX */}
      <PPTXSelectorModal
        isOpen={showPPTXSelector}
        onClose={() => setShowPPTXSelector(false)}
        onSelectSlides={handlePPTXSlidesSelected}
      />

      {/* Modal de Confirmación PPTX */}
      {showPPTXConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Presentation className="w-5 h-5" />
                ¿Cómo deseas agregar las diapositivas?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedPPTXSlides.length} diapositiva{selectedPPTXSlides.length !== 1 ? 's' : ''} seleccionada{selectedPPTXSlides.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={handleAddPPTXToCanvas}
                className="w-full p-4 text-left border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="font-medium text-gray-900">Agregar al canvas actual</div>
                <div className="text-sm text-gray-600 mt-1">
                  Los elementos se agregarán como objetos individuales en el canvas
                </div>
              </button>

              {onAddPages && (
                <button
                  onClick={handleAddPPTXAsPages}
                  className="w-full p-4 text-left border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-lg transition-all"
                >
                  <div className="font-medium text-gray-900">Agregar como páginas nuevas</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Cada diapositiva se agregará como una nueva página del brochure
                  </div>
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowPPTXConfirmModal(false)
                  setSelectedPPTXSlides([])
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar Flotante para Crop */}
      {cropToolbarPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${cropToolbarPosition.x}px`,
            top: `${cropToolbarPosition.y}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          className="bg-white shadow-2xl rounded-lg border-2 border-blue-500 p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-gray-800">
              Modo Recorte
            </p>
          </div>
          <p className="text-[10px] text-gray-600 mb-3">
            Ajusta el rectángulo y confirma
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplyCrop}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs font-medium shadow-md"
            >
              <Check className="w-4 h-4" />
              Aplicar
            </button>
            <button
              type="button"
              onClick={handleCancelCrop}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs font-medium shadow-md"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Toast de notificación */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Modal de Selector de Fuentes */}
      <FontSelector
        isOpen={showFontSelector}
        onClose={() => setShowFontSelector(false)}
        onSelect={(fontName) => {
          updateObjectProperty('fontFamily', fontName)
          loadFontOnDemand(fontName)
        }}
        currentFont={selectedObjectProps.fontFamily}
      />

      {/* Modal de Subida de Fuentes */}
      <FontUploader
        isOpen={showFontUploader}
        onClose={() => setShowFontUploader(false)}
        onFontUploaded={async (fontFamily) => {
          // Recargar lista de fuentes personalizadas
          try {
            const response = await fetch('/api/fonts/upload')
            if (response.ok) {
              const data = await response.json()
              const fontNames = data.fonts.map((f: any) => f.fontFamily)
              setCustomFonts(fontNames)
              console.log('✅ Lista de fuentes actualizada')

              // Aplicar la nueva fuente al objeto seleccionado
              if (selectedObject) {
                updateObjectProperty('fontFamily', fontFamily)
                loadFontOnDemand(fontFamily)
              }
            }
          } catch (error) {
            console.error('❌ Error actualizando lista de fuentes:', error)
          }
        }}
      />
    </div>
  )
}
