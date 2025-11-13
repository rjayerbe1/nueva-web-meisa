/**
 * Polygon Controls for Fabric.js v6
 * Permite editar vértices de polígonos arrastrando puntos individuales
 * Adaptado para Fabric.js v6
 */

import type { Canvas, Polygon, Control, Point } from 'fabric'

/**
 * Renderizado visual del punto de control (círculo)
 */
function anchorRender(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: any,
  fabricObject: Polygon
) {
  ctx.save()
  ctx.fillStyle = styleOverride?.fill || '#ec4899' // Rosa para mejor visibilidad
  ctx.strokeStyle = styleOverride?.stroke || '#be185d'
  ctx.lineWidth = 1.5

  ctx.beginPath()
  ctx.arc(left, top, 4, 0, 2 * Math.PI, false) // Radio reducido de 6 a 4
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

/**
 * Función principal: Agrega controles editables a un polígono
 */
export function addPolygonControls(polygon: Polygon, fabric: any) {
  if (!polygon.points || polygon.points.length === 0) {
    console.warn('⚠️ [PolygonControls] El polígono no tiene puntos')
    return
  }

  // Crear funciones handler con acceso a fabric mediante closures

  /**
   * Calcula la posición del control en coordenadas canvas
   */
  function polygonPositionHandler(this: Control, dim: Point, finalMatrix: number[], fabricObject: Polygon) {
    const point = fabricObject.points![this.pointIndex]

    // Usar fabric.util.transformPoint con la matriz de transformación del polígono
    const transformedPoint = fabric.util.transformPoint(
      {
        x: point.x - (fabricObject.pathOffset?.x || 0),
        y: point.y - (fabricObject.pathOffset?.y || 0),
      },
      fabricObject.calcTransformMatrix()
    )

    return transformedPoint
  }

  /**
   * Handler cuando se arrastra un vértice - usa sistema de "anchor point"
   */
  function actionHandler(
    eventData: MouseEvent,
    transform: any,
    x: number,
    y: number
  ) {
    const poly = transform.target as Polygon
    const currentControl = poly.controls[poly.__corner as string]
    const pointIndex = currentControl.pointIndex
    const points = poly.points!

    // 1. Elegir un punto ancla (el primer punto que NO sea el que estamos arrastrando)
    const anchorIndex = pointIndex === 0 ? 1 : 0

    // 2. Guardar la posición absoluta del punto ancla ANTES de modificar
    const anchorPoint = points[anchorIndex]
    const absoluteAnchor = fabric.util.transformPoint(
      {
        x: anchorPoint.x - (poly.pathOffset?.x || 0),
        y: anchorPoint.y - (poly.pathOffset?.y || 0),
      } as any,
      poly.calcTransformMatrix()
    )

    // 3. Convertir las coordenadas del mouse a coordenadas locales del polígono
    const mousePoint = { x, y }
    const transform2 = poly.calcTransformMatrix()
    const invertedTransform = fabric.util.invertTransform(transform2)
    const localMouse = fabric.util.transformPoint(mousePoint as any, invertedTransform)

    // 4. Actualizar el punto que estamos arrastrando
    // En Fabric.js v6, los puntos están relativos al pathOffset
    points[pointIndex].x = localMouse.x + (poly.pathOffset?.x || 0)
    points[pointIndex].y = localMouse.y + (poly.pathOffset?.y || 0)

    // 5. Recalcular el bounding box y pathOffset usando nuestro método personalizado
    if (poly.setDimensions) {
      poly.setDimensions()
    }

    // 6. Calcular la nueva posición relativa del punto ancla
    const relativeAnchorX = (anchorPoint.x - (poly.pathOffset?.x || 0)) / (poly.width || 1)
    const relativeAnchorY = (anchorPoint.y - (poly.pathOffset?.y || 0)) / (poly.height || 1)

    // 7. Reposicionar el polígono para que el punto ancla permanezca en su posición absoluta
    poly.setPositionByOrigin(absoluteAnchor as any, relativeAnchorX + 0.5, relativeAnchorY + 0.5)

    return true
  }

  // Limpiar controles existentes
  polygon.controls = {}

  console.log(`🎨 [PolygonControls] Agregando ${polygon.points.length} controles al polígono`)

  // Crear un control por cada vértice
  polygon.points.forEach((point, index) => {
    const controlName = `p${index}`

    const control = new fabric.Control({
      positionHandler: polygonPositionHandler,
      actionHandler: actionHandler,
      actionName: 'modifyPolygon',
      pointIndex: index,
      render: anchorRender,
      cursorStyle: 'pointer',
      offsetX: 0,
      offsetY: 0,
      sizeX: 12, // Reducido de 20 a 12
      sizeY: 12, // Reducido de 20 a 12
    })

    polygon.controls[controlName] = control
  })

  // Configurar para modo de edición de vértices
  polygon.cornerStyle = 'circle'
  polygon.cornerColor = 'rgba(236, 72, 153, 0.5)' // Rosa semi-transparente
  polygon.hasBorders = false
  polygon.hasControls = true
  polygon.objectCaching = false
  polygon.transparentCorners = false

  // IMPORTANTE: Desactivar movimiento del polígono en modo de edición
  polygon.lockMovementX = true
  polygon.lockMovementY = true

  // Forzar actualización de coordenadas
  polygon.setCoords()

  console.log('✅ [PolygonControls] Controles agregados exitosamente')
}

/**
 * Función helper: Actualiza las dimensiones del polígono después de editar
 */
declare module 'fabric' {
  interface Polygon {
    setDimensions(): void
  }
}

// Extender el prototipo de Polygon para incluir setDimensions
export function setupPolygonPrototype(fabric: any) {
  fabric.Polygon.prototype.setDimensions = function(this: Polygon) {
    const points = this.points!
    let minX = points[0].x
    let minY = points[0].y
    let maxX = points[0].x
    let maxY = points[0].y

    // Encontrar el bounding box
    points.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    const width = maxX - minX
    const height = maxY - minY

    this.set({
      width,
      height,
      pathOffset: {
        x: minX + width / 2,
        y: minY + height / 2,
      } as Point,
    })

    this.setCoords()
  }
}

/**
 * Función helper: Elimina controles de polígono y restaura controles normales
 */
export function removePolygonControls(polygon: Polygon, fabric: any) {
  if (!polygon.points) return

  // Restaurar controles predeterminados (escala, rotación, etc.)
  polygon.controls = {}

  // Copiar los controles por defecto
  const defaultControls = fabric.controlsUtils.createObjectDefaultControls()
  Object.keys(defaultControls).forEach(key => {
    polygon.controls[key] = defaultControls[key]
  })

  // Restaurar estilo normal
  polygon.cornerStyle = 'rect'
  polygon.cornerColor = 'blue'
  polygon.hasBorders = true
  polygon.hasControls = true
  polygon.transparentCorners = false

  // IMPORTANTE: Reactivar movimiento del polígono
  polygon.lockMovementX = false
  polygon.lockMovementY = false

  // Actualizar coordenadas
  polygon.setCoords()

  console.log('🗑️ [PolygonControls] Controles de polígono removidos, restaurados controles normales')
}

/**
 * Función helper: Verifica si un objeto es un polígono
 */
export function isPolygon(obj: any): obj is Polygon {
  return obj && obj.type === 'Polygon'
}
