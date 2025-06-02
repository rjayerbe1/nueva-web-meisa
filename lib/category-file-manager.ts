import fs from 'fs'
import path from 'path'

/**
 * Utilidades para manejar la estructura de archivos de categorías
 */

export interface CategoryFileStructure {
  coverPath: string
  iconPath: string
  directoryPath: string
}

/**
 * Genera la estructura de archivos para una categoría basada en su slug
 */
export function getCategoryFileStructure(slug: string): CategoryFileStructure {
  const directoryPath = path.join(process.cwd(), 'public', 'images', 'categories', slug)
  
  return {
    coverPath: path.join(directoryPath, 'cover.jpg'),
    iconPath: path.join(directoryPath, 'icon.svg'),
    directoryPath
  }
}

/**
 * Genera las rutas URL para las imágenes de una categoría
 */
export function getCategoryImageUrls(slug: string) {
  return {
    imagenCover: `/images/categories/${slug}/cover.jpg`,
    icono: `/images/categories/${slug}/icon.svg`
  }
}

/**
 * Crea la estructura de directorios para una categoría
 */
export async function ensureCategoryDirectory(slug: string): Promise<void> {
  const { directoryPath } = getCategoryFileStructure(slug)
  
  if (!fs.existsSync(directoryPath)) {
    await fs.promises.mkdir(directoryPath, { recursive: true })
    console.log(`✅ Directorio creado: ${slug}/`)
  }
}

/**
 * Mueve archivos de imagen cuando cambia el slug de una categoría
 */
export async function moveCategoryFiles(oldSlug: string, newSlug: string): Promise<void> {
  const oldStructure = getCategoryFileStructure(oldSlug)
  const newStructure = getCategoryFileStructure(newSlug)
  
  // Crear el nuevo directorio
  await ensureCategoryDirectory(newSlug)
  
  // Mover cover.jpg si existe
  if (fs.existsSync(oldStructure.coverPath)) {
    await fs.promises.rename(oldStructure.coverPath, newStructure.coverPath)
    console.log(`📁 Cover movido: ${oldSlug}/cover.jpg → ${newSlug}/cover.jpg`)
  }
  
  // Mover icon.svg si existe
  if (fs.existsSync(oldStructure.iconPath)) {
    await fs.promises.rename(oldStructure.iconPath, newStructure.iconPath)
    console.log(`📁 Icono movido: ${oldSlug}/icon.svg → ${newSlug}/icon.svg`)
  }
  
  // Eliminar directorio viejo si está vacío
  try {
    if (fs.existsSync(oldStructure.directoryPath)) {
      const files = await fs.promises.readdir(oldStructure.directoryPath)
      if (files.length === 0) {
        await fs.promises.rmdir(oldStructure.directoryPath)
        console.log(`🧹 Directorio eliminado: ${oldSlug}/`)
      }
    }
  } catch (error) {
    console.log(`⚠️  No se pudo eliminar directorio ${oldSlug}/: ${error}`)
  }
}

/**
 * Elimina todos los archivos de una categoría
 */
export async function deleteCategoryFiles(slug: string): Promise<void> {
  const { directoryPath } = getCategoryFileStructure(slug)
  
  if (fs.existsSync(directoryPath)) {
    await fs.promises.rm(directoryPath, { recursive: true, force: true })
    console.log(`🗑️  Archivos eliminados: ${slug}/`)
  }
}

/**
 * Crea un icono SVG por defecto para una categoría
 */
export async function createDefaultIcon(slug: string): Promise<void> {
  const { iconPath } = getCategoryFileStructure(slug)
  
  if (!fs.existsSync(iconPath)) {
    const defaultIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
  <path d="M9 12L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    
    await fs.promises.writeFile(iconPath, defaultIcon)
    console.log(`🎯 Icono por defecto creado: ${slug}/icon.svg`)
  }
}

/**
 * Normaliza un slug para que sea consistente con la estructura de archivos
 */
export function normalizeSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Verifica si los archivos de una categoría existen
 */
export function checkCategoryFiles(slug: string): { coverExists: boolean; iconExists: boolean } {
  const { coverPath, iconPath } = getCategoryFileStructure(slug)
  
  return {
    coverExists: fs.existsSync(coverPath),
    iconExists: fs.existsSync(iconPath)
  }
}