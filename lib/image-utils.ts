import fs from 'fs'
import path from 'path'
import { CategoriaEnum } from '@prisma/client'

// Mapeo de categorías para nombres de carpetas
const CATEGORY_FOLDER_MAP: Record<CategoriaEnum, string> = {
  CENTROS_COMERCIALES: 'centros-comerciales',
  EDIFICIOS: 'edificios',
  INDUSTRIA: 'industria',
  PUENTES_VEHICULARES: 'puentes-vehiculares',
  PUENTES_PEATONALES: 'puentes-peatonales',
  ESCENARIOS_DEPORTIVOS: 'escenarios-deportivos',
  CUBIERTAS_Y_FACHADAS: 'cubiertas-y-fachadas',
  ESTRUCTURAS_MODULARES: 'estructuras-modulares',
  OIL_AND_GAS: 'oil-and-gas',
  OTRO: 'otros'
}

// Convertir título a slug para nombres de carpetas y archivos
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/--+/g, '-') // Múltiples guiones a uno
    .trim()
}

// Obtener carpeta de categoría
export function getCategoryFolder(category: CategoriaEnum): string {
  return CATEGORY_FOLDER_MAP[category] || 'otros'
}

// Generar ruta de imagen para un proyecto
export function generateImagePath(
  category: CategoriaEnum,
  projectTitle: string,
  fileName: string,
  imageIndex?: number
): string {
  const categoryFolder = getCategoryFolder(category)
  const projectSlug = slugify(projectTitle)
  const projectFolder = `${categoryFolder}/${projectSlug}`
  
  // Extraer extensión del archivo
  const fileExtension = path.extname(fileName)
  const baseName = path.basename(fileName, fileExtension)
  
  // Generar nombre del archivo con formato: titulo-proyecto_numero_dimensiones.ext
  const imageNumber = imageIndex ? String(imageIndex).padStart(2, '0') : '01'
  const newFileName = `${projectSlug}-${imageNumber}-${baseName}${fileExtension}`
  
  return `${projectFolder}/${newFileName}`
}

// Crear directorio si no existe
export function ensureDirectoryExists(dirPath: string): void {
  const fullPath = path.join(process.cwd(), 'public', 'images', 'projects', dirPath)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}

// Mover imagen de una categoría a otra
export async function moveImageToNewCategory(
  imageUrl: string,
  oldCategory: CategoriaEnum,
  newCategory: CategoriaEnum,
  projectTitle: string
): Promise<string> {
  try {
    // Extraer ruta relativa de la URL
    const urlPath = imageUrl.replace('/images/projects/', '')
    const oldFullPath = path.join(process.cwd(), 'public', 'images', 'projects', urlPath)
    
    if (!fs.existsSync(oldFullPath)) {
      console.warn(`Archivo no encontrado: ${oldFullPath}`)
      return imageUrl // Retornar URL original si no se encuentra el archivo
    }
    
    // Generar nueva ruta
    const fileName = path.basename(urlPath)
    const newImagePath = generateImagePath(newCategory, projectTitle, fileName)
    const newFullPath = path.join(process.cwd(), 'public', 'images', 'projects', newImagePath)
    
    // Crear directorio de destino
    ensureDirectoryExists(path.dirname(newImagePath))
    
    // Mover archivo
    fs.renameSync(oldFullPath, newFullPath)
    
    // Retornar nueva URL
    return `/images/projects/${newImagePath}`
    
  } catch (error) {
    console.error('Error moviendo imagen:', error)
    return imageUrl // Retornar URL original en caso de error
  }
}

// Obtener dimensiones de una imagen desde el nombre del archivo
export function extractDimensionsFromFileName(fileName: string): string | null {
  // Buscar patrones como "400x400", "1000x768", etc.
  const dimensionMatch = fileName.match(/(\d+x\d+)/i)
  return dimensionMatch ? dimensionMatch[1] : null
}

// Generar nombre de archivo con dimensiones
export function generateFileNameWithDimensions(
  projectTitle: string,
  originalFileName: string,
  imageIndex: number,
  dimensions?: string
): string {
  const projectSlug = slugify(projectTitle)
  const fileExtension = path.extname(originalFileName)
  const baseName = path.basename(originalFileName, fileExtension)
  
  // Extraer dimensiones del nombre original si no se proporcionan
  const imageDimensions = dimensions || extractDimensionsFromFileName(baseName) || ''
  const dimensionsSuffix = imageDimensions ? `-${imageDimensions}` : ''
  
  const imageNumber = String(imageIndex).padStart(2, '0')
  return `${projectSlug}-${imageNumber}-${baseName}${dimensionsSuffix}${fileExtension}`
}

// Limpiar directorio vacío
export function cleanupEmptyDirectory(dirPath: string): void {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'images', 'projects', dirPath)
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath)
      if (files.length === 0) {
        fs.rmdirSync(fullPath)
        console.log(`Directorio vacío eliminado: ${dirPath}`)
      }
    }
  } catch (error) {
    console.error('Error limpiando directorio:', error)
  }
}

// Obtener la siguiente secuencia de imagen para un proyecto
export function getNextImageIndex(projectImages: Array<{ url: string }>): number {
  if (projectImages.length === 0) return 1
  
  // Extraer números de secuencia de las URLs existentes
  const indices = projectImages
    .map(img => {
      const match = img.url.match(/-(\d+)-/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter(num => num > 0)
  
  if (indices.length === 0) return 1
  
  return Math.max(...indices) + 1
}