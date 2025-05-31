/**
 * Script para organizar los archivos de categorías en una estructura similar a proyectos
 * Ejecutar con: npx tsx scripts/organize-category-files.ts
 */

import fs from 'fs'
import path from 'path'
import { CATEGORY_TO_SLUG } from '../lib/category-assets'

const PUBLIC_PATH = path.join(process.cwd(), 'public')
const IMAGES_PATH = path.join(PUBLIC_PATH, 'images')
const CATEGORIES_PATH = path.join(IMAGES_PATH, 'categories')

async function organizeFiles() {
  console.log('📁 Organizando archivos de categorías...')
  
  // Crear estructura de carpetas organizada
  console.log('\n🏗️  Creando estructura de carpetas:')
  
  for (const [categoryEnum, slug] of Object.entries(CATEGORY_TO_SLUG)) {
    const categoryPath = path.join(CATEGORIES_PATH, slug)
    const iconsPath = path.join(categoryPath, 'icons')
    const coversPath = path.join(categoryPath, 'covers')
    const bannersPath = path.join(categoryPath, 'banners')
    
    // Crear directorios si no existen
    const dirsToCreate = [categoryPath, iconsPath, coversPath, bannersPath]
    dirsToCreate.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`   ✅ ${dir.replace(PUBLIC_PATH, '/public')}`)
      }
    })
  }
  
  console.log('\n📦 Estructura recomendada creada:')
  console.log(`
/public/images/categories/
├── centros-comerciales/
│   ├── icons/
│   ├── covers/
│   └── banners/
├── edificios/
│   ├── icons/
│   ├── covers/
│   └── banners/
├── industria/
│   ├── icons/
│   ├── covers/
│   └── banners/
└── ... (para cada categoría)
  `)
  
  console.log('💡 Próximos pasos sugeridos:')
  console.log('   1. Mover archivos de /images/icons/ a las carpetas /icons/ correspondientes')
  console.log('   2. Mover archivos de /images/categories/ a las carpetas /covers/ correspondientes')
  console.log('   3. Agregar nuevas imágenes de banners en las carpetas /banners/')
  console.log('   4. Actualizar las rutas en category-assets.ts si es necesario')
  
  // Mostrar archivos existentes que se pueden organizar
  console.log('\n📋 Archivos actuales por organizar:')
  
  const iconsPath = path.join(IMAGES_PATH, 'icons')
  if (fs.existsSync(iconsPath)) {
    const iconFiles = fs.readdirSync(iconsPath)
    console.log('\n🔷 Iconos:')
    iconFiles.forEach(file => {
      console.log(`   ${file}`)
    })
  }
  
  const currentCategoriesPath = CATEGORIES_PATH
  if (fs.existsSync(currentCategoriesPath)) {
    const categoryFiles = fs.readdirSync(currentCategoriesPath).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')
    )
    console.log('\n🖼️  Imágenes de categorías:')
    categoryFiles.forEach(file => {
      console.log(`   ${file}`)
    })
  }
}

// Ejecutar script
if (require.main === module) {
  organizeFiles()
    .then(() => {
      console.log('\n✅ Organización completada')
    })
    .catch((error) => {
      console.error('❌ Error:', error)
    })
}

export { organizeFiles }