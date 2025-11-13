import JSZip from 'jszip'
import { xml2js } from 'xml-js'

export interface PPTXSlide {
  slideNumber: number
  thumbnail: string | null
  elements: PPTXElement[]
  width: number
  height: number
}

export interface PPTXElement {
  type: 'image' | 'text' | 'shape'
  content?: string // Para texto
  imageData?: string // Para imágenes
  shapeType?: string // Para formas
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  style?: {
    fill?: string
    stroke?: string
    strokeWidth?: number
    fontSize?: number
    fontFamily?: string
    textAlign?: string
    color?: string
  }
}

/**
 * Procesa un archivo PPTX y extrae las diapositivas con sus elementos
 */
export async function processPPTX(file: File): Promise<PPTXSlide[]> {
  console.log('📊 [PPTX] Iniciando procesamiento de PPTX...')

  try {
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)

    console.log('📊 [PPTX] Archivo PPTX descomprimido')

    // Obtener tamaño de diapositiva desde presentation.xml
    const slideSize = await getSlideSize(zip)
    console.log('📊 [PPTX] Tamaño de diapositiva:', slideSize)

    // Obtener lista de slides
    const slides = Object.keys(zip.files)
      .filter(path => path.match(/ppt\/slides\/slide\d+\.xml$/))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0')
        const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0')
        return numA - numB
      })

    console.log(`📊 [PPTX] Encontradas ${slides.length} diapositivas`)

    const processedSlides: PPTXSlide[] = []

    // Procesar cada slide
    for (let i = 0; i < slides.length; i++) {
      const slidePath = slides[i]
      const slideNumber = slidePath.match(/slide(\d+)\.xml/)?.[1] || '1'
      console.log(`📊 [PPTX] Procesando ${slidePath}...`)

      const slideData = await zip.file(slidePath)?.async('string')
      if (!slideData) continue

      // Parsear XML del slide
      const slideXml = xml2js(slideData, { compact: true }) as any

      // Leer archivo de relaciones del slide
      const relsPath = `ppt/slides/_rels/slide${slideNumber}.xml.rels`
      const relsMap = await loadRelationships(zip, relsPath)
      console.log(`📊 [PPTX] Relaciones encontradas para slide ${slideNumber}:`, Object.keys(relsMap).length)

      // Extraer elementos de la diapositiva
      const elements = await extractSlideElements(slideXml, zip, slideSize, relsMap)

      processedSlides.push({
        slideNumber: i + 1,
        thumbnail: null,
        elements,
        width: slideSize.width,
        height: slideSize.height
      })

      console.log(`✅ [PPTX] Diapositiva ${i + 1} procesada con ${elements.length} elementos`)
    }

    return processedSlides
  } catch (error) {
    console.error('❌ [PPTX] Error procesando PPTX:', error)
    throw error
  }
}

/**
 * Carga el archivo de relaciones y crea un mapa de rId a ruta de archivo
 */
async function loadRelationships(zip: JSZip, relsPath: string): Promise<Record<string, string>> {
  const relsMap: Record<string, string> = {}

  try {
    const relsData = await zip.file(relsPath)?.async('string')
    if (!relsData) return relsMap

    const relsXml = xml2js(relsData, { compact: true }) as any
    const relationships = relsXml['Relationships']?.['Relationship']

    if (relationships) {
      const relsArray = Array.isArray(relationships) ? relationships : [relationships]
      for (const rel of relsArray) {
        const id = rel._attributes?.Id
        const target = rel._attributes?.Target
        const type = rel._attributes?.Type

        if (id && target) {
          // Convertir ruta relativa a ruta absoluta en el zip
          // ../media/image1.jpeg -> ppt/media/image1.jpeg
          const absolutePath = target.startsWith('../')
            ? `ppt/${target.substring(3)}`
            : `ppt/slides/${target}`

          relsMap[id] = absolutePath

          console.log(`📊 [PPTX] Relación: ${id} -> ${absolutePath}`)
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ [PPTX] No se pudieron cargar relaciones:', error)
  }

  return relsMap
}

/**
 * Obtiene el tamaño de las diapositivas desde presentation.xml
 */
async function getSlideSize(zip: JSZip): Promise<{ width: number; height: number }> {
  try {
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('string')
    if (!presentationXml) {
      // Tamaño por defecto (16:9, 1920x1080)
      return { width: 1920, height: 1080 }
    }

    const parsed = xml2js(presentationXml, { compact: true }) as any
    const sldSz = parsed['p:presentation']?.['p:sldSz']?._attributes

    if (sldSz) {
      // Convertir de EMUs (English Metric Units) a píxeles
      // 1 EMU = 1/914400 pulgadas, 1 pulgada = 96 píxeles
      const width = Math.round((parseInt(sldSz.cx) / 914400) * 96)
      const height = Math.round((parseInt(sldSz.cy) / 914400) * 96)
      return { width, height }
    }

    return { width: 1920, height: 1080 }
  } catch (error) {
    console.warn('⚠️ [PPTX] No se pudo leer tamaño de diapositiva, usando default')
    return { width: 1920, height: 1080 }
  }
}

/**
 * Extrae elementos de una diapositiva
 */
async function extractSlideElements(
  slideXml: any,
  zip: JSZip,
  slideSize: { width: number; height: number },
  relsMap: Record<string, string>
): Promise<PPTXElement[]> {
  const elements: PPTXElement[] = []

  try {
    const spTree = slideXml['p:sld']?.['p:cSld']?.['p:spTree']
    if (!spTree) return elements

    // Procesar todos los elementos de forma recursiva
    await processSpTreeElements(spTree, elements, zip, slideSize, relsMap)

    console.log(`📊 [PPTX] Total de elementos extraídos: ${elements.length}`)
    return elements
  } catch (error) {
    console.error('❌ [PPTX] Error extrayendo elementos:', error)
    return elements
  }
}

/**
 * Procesa elementos del spTree de forma recursiva, manteniendo el orden Z
 */
async function processSpTreeElements(
  node: any,
  elements: PPTXElement[],
  zip: JSZip,
  slideSize: { width: number; height: number },
  relsMap: Record<string, string>,
  groupTransform?: { x: number; y: number; scaleX: number; scaleY: number }
): Promise<void> {
  // Obtener todas las claves del nodo para procesar elementos en orden
  const nodeKeys = Object.keys(node)

  // Log de tipos de elementos encontrados para debug
  const elementTypes = nodeKeys.filter(key => key.startsWith('p:'))
  if (elementTypes.length > 0) {
    console.log(`📋 [PPTX] Tipos de elementos en nodo:`, elementTypes)
  }

  // Procesar cada tipo de elemento
  for (const key of nodeKeys) {
    if (key === 'p:pic') {
      // Procesar imágenes
      const pics = Array.isArray(node[key]) ? node[key] : [node[key]]
      for (const pic of pics) {
        const imageElement = await extractImage(pic, zip, slideSize, relsMap, groupTransform)
        if (imageElement) {
          elements.push(imageElement)
          console.log(`🖼️ [PPTX] Imagen extraída (#${elements.length}):`, imageElement.position)
        }
      }
    } else if (key === 'p:sp') {
      // Procesar shapes (pueden contener texto o formas)
      const shapes = Array.isArray(node[key]) ? node[key] : [node[key]]
      for (const shape of shapes) {
        // Log el tipo de preset geometry si existe
        const prstGeom = shape['p:spPr']?.['a:prstGeom']?._attributes?.prst
        if (prstGeom) {
          console.log(`🔍 [PPTX] Shape encontrado con geometría: ${prstGeom}`)
        }

        const shapeElement = extractShape(shape, slideSize, groupTransform)
        if (shapeElement) {
          elements.push(shapeElement)
          console.log(`📐 [PPTX] ${shapeElement.type} extraído (#${elements.length}):`, {
            shapeType: shapeElement.shapeType,
            position: shapeElement.position
          })
        } else {
          console.warn(`⚠️ [PPTX] Shape no pudo ser extraído`)
        }
      }
    } else if (key === 'p:grpSp') {
      // Procesar grupos de forma recursiva
      const groups = Array.isArray(node[key]) ? node[key] : [node[key]]
      for (const group of groups) {
        // Obtener transformación del grupo
        const grpXfrm = group['p:grpSpPr']?.['a:xfrm']
        const grpOff = grpXfrm?.['a:off']?._attributes
        const grpExt = grpXfrm?.['a:ext']?._attributes
        const grpChOff = grpXfrm?.['a:chOff']?._attributes
        const grpChExt = grpXfrm?.['a:chExt']?._attributes

        // Calcular transformación del grupo
        let newGroupTransform = groupTransform

        if (grpOff && grpExt && grpChOff && grpChExt) {
          // Posición del grupo en el padre (en EMUs)
          const groupX = (parseInt(grpOff.x) / 914400) * 96
          const groupY = (parseInt(grpOff.y) / 914400) * 96

          // Tamaño del grupo
          const groupWidth = (parseInt(grpExt.cx) / 914400) * 96
          const groupHeight = (parseInt(grpExt.cy) / 914400) * 96

          // Espacio de coordenadas hijo (child offset/extent)
          const childWidth = (parseInt(grpChExt.cx) / 914400) * 96
          const childHeight = (parseInt(grpChExt.cy) / 914400) * 96
          const childOffsetX = (parseInt(grpChOff.x) / 914400) * 96
          const childOffsetY = (parseInt(grpChOff.y) / 914400) * 96

          // Escala del grupo (tamaño visual / tamaño del espacio hijo)
          const groupScaleX = childWidth > 0 ? groupWidth / childWidth : 1
          const groupScaleY = childHeight > 0 ? groupHeight / childHeight : 1

          // Combinar con transformación del padre si existe
          if (groupTransform) {
            newGroupTransform = {
              x: groupTransform.x + (groupX - childOffsetX) * groupTransform.scaleX,
              y: groupTransform.y + (groupY - childOffsetY) * groupTransform.scaleY,
              scaleX: groupTransform.scaleX * groupScaleX,
              scaleY: groupTransform.scaleY * groupScaleY
            }
          } else {
            newGroupTransform = {
              x: groupX - childOffsetX * groupScaleX,
              y: groupY - childOffsetY * groupScaleY,
              scaleX: groupScaleX,
              scaleY: groupScaleY
            }
          }

          console.log(`📦 [PPTX] Grupo transformado:`, {
            groupPos: { x: groupX, y: groupY },
            childOffset: { x: childOffsetX, y: childOffsetY },
            scale: { x: groupScaleX, y: groupScaleY },
            finalTransform: newGroupTransform
          })
        }

        // Procesar recursivamente los elementos dentro del grupo con la transformación acumulada
        await processSpTreeElements(group, elements, zip, slideSize, relsMap, newGroupTransform)
      }
    }
  }
}

/**
 * Extrae una imagen del PPTX usando el mapa de relaciones
 */
async function extractImage(
  pic: any,
  zip: JSZip,
  slideSize: { width: number; height: number },
  relsMap: Record<string, string>,
  groupTransform?: { x: number; y: number; scaleX: number; scaleY: number }
): Promise<PPTXElement | null> {
  try {
    // Obtener relación de imagen
    const blip = pic['p:blipFill']?.['a:blip']
    const embedId = blip?._attributes?.['r:embed']

    if (!embedId) {
      console.warn('⚠️ [PPTX] Imagen sin embed ID')
      return null
    }

    // Buscar la ruta de la imagen en el mapa de relaciones
    const imagePath = relsMap[embedId]
    if (!imagePath) {
      console.warn(`⚠️ [PPTX] No se encontró ruta para ${embedId}`)
      return null
    }

    console.log(`📊 [PPTX] Cargando imagen: ${embedId} -> ${imagePath}`)

    // Cargar la imagen desde el zip
    const imageFile = zip.file(imagePath)
    if (!imageFile) {
      console.warn(`⚠️ [PPTX] No se encontró archivo: ${imagePath}`)
      return null
    }

    const blob = await imageFile.async('blob')
    const imageData = await blobToDataURL(blob)

    // Obtener posición y tamaño
    const xfrm = pic['p:spPr']?.['a:xfrm']
    const position = extractPosition(xfrm, slideSize)

    // Aplicar transformación del grupo si existe
    if (groupTransform) {
      console.log(`📦 [PPTX] Aplicando transformación de grupo a imagen:`, {
        original: { ...position },
        transform: groupTransform
      })

      position.x = (position.x * groupTransform.scaleX) + groupTransform.x
      position.y = (position.y * groupTransform.scaleY) + groupTransform.y
      position.width = position.width * groupTransform.scaleX
      position.height = position.height * groupTransform.scaleY

      console.log(`📦 [PPTX] Posición transformada:`, position)
    }

    console.log(`✅ [PPTX] Imagen cargada: ${imagePath}`)

    return {
      type: 'image',
      imageData,
      position
    }
  } catch (error) {
    console.error('❌ [PPTX] Error extrayendo imagen:', error)
    return null
  }
}

/**
 * Extrae una forma o texto
 */
function extractShape(
  shape: any,
  slideSize: { width: number; height: number },
  groupTransform?: { x: number; y: number; scaleX: number; scaleY: number }
): PPTXElement | null {
  try {
    // Obtener posición y tamaño
    const xfrm = shape['p:spPr']?.['a:xfrm']
    const position = extractPosition(xfrm, slideSize)

    // Aplicar transformación del grupo si existe
    if (groupTransform) {
      console.log(`📦 [PPTX] Aplicando transformación de grupo a forma/texto:`, {
        original: { ...position },
        transform: groupTransform
      })

      position.x = (position.x * groupTransform.scaleX) + groupTransform.x
      position.y = (position.y * groupTransform.scaleY) + groupTransform.y
      position.width = position.width * groupTransform.scaleX
      position.height = position.height * groupTransform.scaleY

      console.log(`📦 [PPTX] Posición transformada:`, position)
    }

    // Verificar si tiene texto
    const txBody = shape['p:txBody']
    const hasText = txBody?.['a:p']

    if (hasText) {
      // Extraer texto
      const paragraphs = Array.isArray(txBody['a:p']) ? txBody['a:p'] : [txBody['a:p']]
      let text = ''

      for (const p of paragraphs) {
        if (p['a:r']) {
          const runs = Array.isArray(p['a:r']) ? p['a:r'] : [p['a:r']]
          for (const run of runs) {
            const t = run['a:t']
            if (t?._text) {
              text += t._text
            }
          }
        }
        text += '\n'
      }

      text = text.trim()

      if (text) {
        // Extraer estilo de texto
        const style = extractTextStyle(shape)

        // Escalar el tamaño de fuente si hay transformación de grupo
        if (groupTransform && style?.fontSize) {
          style.fontSize = style.fontSize * Math.min(groupTransform.scaleX, groupTransform.scaleY)
        }

        return {
          type: 'text',
          content: text,
          position,
          style
        }
      }
    }

    // Si no tiene texto, es una forma
    const prstGeom = shape['p:spPr']?.['a:prstGeom']
    const shapeType = prstGeom?._attributes?.prst || 'rect'

    // Extraer estilo de forma
    const style = extractShapeStyle(shape)

    // Escalar el ancho de línea si hay transformación de grupo
    if (groupTransform && style?.strokeWidth) {
      style.strokeWidth = style.strokeWidth * Math.min(groupTransform.scaleX, groupTransform.scaleY)
    }

    return {
      type: 'shape',
      shapeType,
      position,
      style
    }
  } catch (error) {
    console.error('❌ [PPTX] Error extrayendo forma:', error)
    return null
  }
}

/**
 * Extrae posición y tamaño de un elemento
 */
function extractPosition(xfrm: any, slideSize: { width: number; height: number }): {
  x: number
  y: number
  width: number
  height: number
} {
  const off = xfrm?.['a:off']?._attributes
  const ext = xfrm?.['a:ext']?._attributes

  // Convertir de EMUs a píxeles
  // 1 EMU = 1/914400 pulgadas, 1 pulgada = 96 píxeles
  const x = off?.x ? (parseInt(off.x) / 914400) * 96 : 0
  const y = off?.y ? (parseInt(off.y) / 914400) * 96 : 0
  const width = ext?.cx ? (parseInt(ext.cx) / 914400) * 96 : 100
  const height = ext?.cy ? (parseInt(ext.cy) / 914400) * 96 : 100

  console.log(`📊 [PPTX] Posición EMU -> Pixels:`, {
    emus: { x: off?.x, y: off?.y, cx: ext?.cx, cy: ext?.cy },
    pixels: { x, y, width, height }
  })

  return { x, y, width, height }
}

/**
 * Extrae estilo de texto
 */
function extractTextStyle(shape: any): PPTXElement['style'] {
  const style: PPTXElement['style'] = {}

  try {
    // Intentar obtener propiedades de texto
    const rPr = shape['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?._attributes

    if (rPr) {
      if (rPr.sz) {
        // Tamaño de fuente en puntos (PPTX usa puntos * 100)
        style.fontSize = parseInt(rPr.sz) / 100
      }

      // Color de texto
      const solidFill = shape['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['a:solidFill']
      if (solidFill) {
        const srgbClr = solidFill['a:srgbClr']?._attributes?.val
        if (srgbClr) {
          style.color = `#${srgbClr}`
        }
      }
    }
  } catch (error) {
    // Ignorar errores de estilo
  }

  return style
}

/**
 * Extrae estilo de forma
 */
function extractShapeStyle(shape: any): PPTXElement['style'] {
  const style: PPTXElement['style'] = {}

  try {
    // Intentar obtener color de relleno
    const solidFill = shape['p:spPr']?.['a:solidFill']
    if (solidFill) {
      const srgbClr = solidFill['a:srgbClr']?._attributes?.val
      if (srgbClr) {
        style.fill = `#${srgbClr}`
      }
    }

    // Intentar obtener borde
    const ln = shape['p:spPr']?.['a:ln']
    if (ln) {
      const lnSolidFill = ln['a:solidFill']
      if (lnSolidFill) {
        const srgbClr = lnSolidFill['a:srgbClr']?._attributes?.val
        if (srgbClr) {
          style.stroke = `#${srgbClr}`
        }
      }

      if (ln._attributes?.w) {
        // Ancho de línea en EMUs
        style.strokeWidth = (parseInt(ln._attributes.w) / 914400) * 96
      }
    }
  } catch (error) {
    // Ignorar errores de estilo
  }

  return style
}

/**
 * Convierte Blob a Data URL
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
