// Utilidades para manejo de aspect ratios y expansión de imágenes

export interface AspectRatio {
  ratio: string      // Ej: "3:5"
  decimal: number    // Ej: 0.6
  width: number      // Parte ancha
  height: number     // Parte alta
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface ExpansionSuggestion {
  top: number
  right: number
  bottom: number
  left: number
  resultingSize: ImageDimensions
  resultingRatio: AspectRatio
}

// Ratios predefinidos de MEISA
export const MEISA_RATIOS = {
  HERO_DESKTOP: {
    ratio: "3:5",
    decimal: 0.6,
    width: 3,
    height: 5,
    label: "Hero Desktop (Vertical)"
  },
  HERO_MOBILE: {
    ratio: "5:3",
    decimal: 1.667,
    width: 5,
    height: 3,
    label: "Hero Mobile (Landscape)"
  },
  SQUARE: {
    ratio: "1:1",
    decimal: 1,
    width: 1,
    height: 1,
    label: "Cuadrado"
  },
  LANDSCAPE_16_9: {
    ratio: "16:9",
    decimal: 1.778,
    width: 16,
    height: 9,
    label: "Landscape 16:9"
  },
  PORTRAIT_9_16: {
    ratio: "9:16",
    decimal: 0.5625,
    width: 9,
    height: 16,
    label: "Portrait 9:16"
  },
  LANDSCAPE_4_3: {
    ratio: "4:3",
    decimal: 1.333,
    width: 4,
    height: 3,
    label: "Landscape 4:3"
  },
  PORTRAIT_3_4: {
    ratio: "3:4",
    decimal: 0.75,
    width: 3,
    height: 4,
    label: "Portrait 3:4"
  }
} as const

/**
 * Calcula el aspect ratio de unas dimensiones
 */
export function calculateAspectRatio(width: number, height: number): AspectRatio {
  const decimal = width / height
  const gcd = findGCD(width, height)
  const w = width / gcd
  const h = height / gcd

  return {
    ratio: `${w}:${h}`,
    decimal,
    width: w,
    height: h
  }
}

/**
 * Encuentra el máximo común divisor
 */
function findGCD(a: number, b: number): number {
  return b === 0 ? a : findGCD(b, a % b)
}

/**
 * Convierte string de ratio (ej: "3:5") a objeto AspectRatio
 */
export function parseRatioString(ratioStr: string): AspectRatio | null {
  const parts = ratioStr.split(':').map(Number)
  if (parts.length !== 2 || parts.some(isNaN)) return null

  const [width, height] = parts
  return {
    ratio: ratioStr,
    decimal: width / height,
    width,
    height
  }
}

/**
 * Sugiere cuántos pixeles expandir en cada lado para lograr el target ratio
 * Intenta distribuir la expansión de manera balanceada
 */
export function suggestExpansion(
  currentSize: ImageDimensions,
  targetRatio: AspectRatio
): ExpansionSuggestion {
  const currentRatio = currentSize.width / currentSize.height
  const targetDecimal = targetRatio.decimal

  let top = 0, right = 0, bottom = 0, left = 0

  // Determinar si necesitamos expandir en ancho o alto
  if (currentRatio > targetDecimal) {
    // Imagen muy ancha, necesita más altura
    const targetHeight = currentSize.width / targetDecimal
    const totalHeightToAdd = Math.ceil(targetHeight - currentSize.height)

    // Distribuir equitativamente arriba y abajo
    top = Math.floor(totalHeightToAdd / 2)
    bottom = Math.ceil(totalHeightToAdd / 2)
  } else if (currentRatio < targetDecimal) {
    // Imagen muy alta, necesita más ancho
    const targetWidth = currentSize.height * targetDecimal
    const totalWidthToAdd = Math.ceil(targetWidth - currentSize.width)

    // Distribuir equitativamente izquierda y derecha
    left = Math.floor(totalWidthToAdd / 2)
    right = Math.ceil(totalWidthToAdd / 2)
  }
  // Si currentRatio === targetDecimal, no se necesita expansión

  const resultingSize = {
    width: currentSize.width + left + right,
    height: currentSize.height + top + bottom
  }

  return {
    top,
    right,
    bottom,
    left,
    resultingSize,
    resultingRatio: calculateAspectRatio(resultingSize.width, resultingSize.height)
  }
}

/**
 * Verifica si dos ratios son aproximadamente iguales
 * (tolera diferencias pequeñas por redondeo)
 */
export function areRatiosEqual(ratio1: AspectRatio, ratio2: AspectRatio, tolerance = 0.01): boolean {
  return Math.abs(ratio1.decimal - ratio2.decimal) < tolerance
}

/**
 * Encuentra el preset de MEISA más cercano a un ratio dado
 */
export function findClosestMEISARatio(ratio: AspectRatio): typeof MEISA_RATIOS[keyof typeof MEISA_RATIOS] | null {
  let closest = null
  let minDiff = Infinity

  for (const preset of Object.values(MEISA_RATIOS)) {
    const diff = Math.abs(preset.decimal - ratio.decimal)
    if (diff < minDiff) {
      minDiff = diff
      closest = preset
    }
  }

  return closest
}

/**
 * Formatea el aspect ratio para display
 */
export function formatRatio(ratio: AspectRatio): string {
  // Simplificar ratios complejos
  if (ratio.width === ratio.height) return "1:1"
  if (ratio.width > 20 || ratio.height > 20) {
    // Ratio muy complejo, mostrar decimal
    return `${ratio.decimal.toFixed(2)}:1`
  }
  return ratio.ratio
}

/**
 * Valida que la expansión no sea excesiva
 * Retorna true si es válida, false si excede límites
 */
export function validateExpansion(
  originalSize: ImageDimensions,
  expansion: { top: number; right: number; bottom: number; left: number },
  maxExpansionPercent = 100 // Máximo 100% del tamaño original
): { valid: boolean; error?: string } {
  const totalWidthExpansion = expansion.left + expansion.right
  const totalHeightExpansion = expansion.top + expansion.bottom

  const widthExpansionPercent = (totalWidthExpansion / originalSize.width) * 100
  const heightExpansionPercent = (totalHeightExpansion / originalSize.height) * 100

  if (widthExpansionPercent > maxExpansionPercent) {
    return {
      valid: false,
      error: `Expansión horizontal muy grande (${widthExpansionPercent.toFixed(0)}%). Máximo: ${maxExpansionPercent}%`
    }
  }

  if (heightExpansionPercent > maxExpansionPercent) {
    return {
      valid: false,
      error: `Expansión vertical muy grande (${heightExpansionPercent.toFixed(0)}%). Máximo: ${maxExpansionPercent}%`
    }
  }

  return { valid: true }
}

/**
 * Calcula el costo estimado de expansión
 */
export function calculateExpansionCost(): number {
  // Bria Expand cuesta $0.04 por imagen
  return 0.04
}
