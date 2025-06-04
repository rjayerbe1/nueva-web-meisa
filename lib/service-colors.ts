// Utilidades para colores de servicios - sincronizado entre admin y frontend

export type ServiceColor = 'blue' | 'green' | 'red' | 'gray' | 'slate'

export interface ServiceColorConfig {
  text: string
  bg: string
  bgHover: string
  gradient: string
  border: string
}

// Mapeo de colores seguros para servicios
export const SERVICE_COLOR_MAP: Record<ServiceColor, ServiceColorConfig> = {
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    bgHover: 'bg-blue-200',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-200'
  },
  green: {
    text: 'text-green-600', 
    bg: 'bg-green-100',
    bgHover: 'bg-green-200',
    gradient: 'from-green-600 to-green-800',
    border: 'border-green-200'
  },
  red: {
    text: 'text-red-600',
    bg: 'bg-red-100', 
    bgHover: 'bg-red-200',
    gradient: 'from-red-600 to-red-800',
    border: 'border-red-200'
  },
  gray: {
    text: 'text-gray-600',
    bg: 'bg-gray-100',
    bgHover: 'bg-gray-200', 
    gradient: 'from-gray-600 to-gray-800',
    border: 'border-gray-200'
  },
  slate: {
    text: 'text-slate-600',
    bg: 'bg-slate-100',
    bgHover: 'bg-slate-200',
    gradient: 'from-slate-600 to-slate-800', 
    border: 'border-slate-200'
  }
}

// Función para obtener colores seguros basados en la paleta MEISA
export function getServiceColors(colorBase: string): ServiceColorConfig {
  const validColor = isValidServiceColor(colorBase) ? colorBase : 'blue'
  return SERVICE_COLOR_MAP[validColor]
}

// Función para validar si un color es válido
export function isValidServiceColor(color: string): color is ServiceColor {
  return Object.keys(SERVICE_COLOR_MAP).includes(color)
}

// Colores válidos disponibles
export const VALID_SERVICE_COLORS = Object.keys(SERVICE_COLOR_MAP) as ServiceColor[]

// Opciones para el admin panel
export const COLOR_OPTIONS = [
  { 
    value: 'blue', 
    label: 'Azul MEISA (Principal)', 
    class: 'bg-blue-600', 
    description: 'Color principal de la marca MEISA' 
  },
  { 
    value: 'green', 
    label: 'Verde (Secundario)', 
    class: 'bg-green-600', 
    description: 'Para servicios de calidad y sostenibilidad' 
  },
  { 
    value: 'red', 
    label: 'Rojo MEISA (Acento)', 
    class: 'bg-red-600', 
    description: 'Color de acento de la marca' 
  },
  { 
    value: 'gray', 
    label: 'Gris (Neutro)', 
    class: 'bg-gray-600', 
    description: 'Para servicios técnicos y consultoría' 
  },
  { 
    value: 'slate', 
    label: 'Pizarra (Elegante)', 
    class: 'bg-slate-600', 
    description: 'Para servicios especializados' 
  },
] as const