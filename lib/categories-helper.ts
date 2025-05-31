import { prisma } from '@/lib/prisma'
import { CategoriaEnum } from '@prisma/client'

export interface CategoryData {
  id: string
  key: CategoriaEnum
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  metaTitle: string | null
  metaDescription: string | null
  orden: number
  visible: boolean
  destacada: boolean
  totalProyectos: number
}

/**
 * Obtener todas las categorías visibles ordenadas para frontend
 */
export async function getVisibleCategories(): Promise<CategoryData[]> {
  try {
    const categories = await prisma.categoriaProyecto.findMany({
      where: { visible: true },
      orderBy: { orden: 'asc' }
    })

    return categories
  } catch (error) {
    console.error('Error fetching visible categories:', error)
    return []
  }
}

/**
 * Obtener categorías destacadas para homepage
 */
export async function getFeaturedCategories(): Promise<CategoryData[]> {
  try {
    const categories = await prisma.categoriaProyecto.findMany({
      where: { 
        visible: true,
        destacada: true 
      },
      orderBy: { orden: 'asc' }
    })

    return categories
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    return []
  }
}

/**
 * Obtener una categoría por su slug
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  try {
    const category = await prisma.categoriaProyecto.findUnique({
      where: { slug }
    })

    return category
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

/**
 * Obtener una categoría por su key enum
 */
export async function getCategoryByKey(key: CategoriaEnum): Promise<CategoryData | null> {
  try {
    const category = await prisma.categoriaProyecto.findUnique({
      where: { key }
    })

    return category
  } catch (error) {
    console.error('Error fetching category by key:', error)
    return null
  }
}

/**
 * Actualizar el contador de proyectos para una categoría
 */
export async function updateCategoryProjectCount(key: CategoriaEnum): Promise<void> {
  try {
    const projectCount = await prisma.proyecto.count({
      where: { categoria: key }
    })

    await prisma.categoriaProyecto.updateMany({
      where: { key },
      data: { totalProyectos: projectCount }
    })
  } catch (error) {
    console.error('Error updating category project count:', error)
  }
}

/**
 * Actualizar todos los contadores de proyectos
 */
export async function updateAllCategoryProjectCounts(): Promise<void> {
  try {
    const categoryStats = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: {
        categoria: true
      }
    })

    // Resetear todos los contadores a 0
    await prisma.categoriaProyecto.updateMany({
      data: { totalProyectos: 0 }
    })

    // Actualizar contadores con datos reales
    for (const stat of categoryStats) {
      await prisma.categoriaProyecto.updateMany({
        where: { key: stat.categoria },
        data: { totalProyectos: stat._count.categoria }
      })
    }
  } catch (error) {
    console.error('Error updating all category project counts:', error)
  }
}

/**
 * Mapeo de legacy category config para compatibilidad hacia atrás
 */
export function mapToLegacyCategory(category: CategoryData) {
  return {
    id: category.slug,
    name: category.nombre,
    description: category.descripcion || '',
    icon: category.icono ? `/images/icons/${category.icono}.png` : '/images/icons/default.png',
    image: category.imagenCover || '/images/categories/default.jpg',
    backgroundColor: category.color || '#2d2e80',
    exampleProject: category.slug,
    dbValue: category.key
  }
}

/**
 * Obtener categorías en formato legacy para compatibilidad
 */
export async function getLegacyCategories() {
  const categories = await getVisibleCategories()
  return categories.map(mapToLegacyCategory)
}