/**
 * Script para corregir la categoría del Puente Peatonal Terminal Intermedio
 * Ejecutar con: npx tsx scripts/fix-puente-peatonal-category.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixPuentePeatonalCategory() {
  console.log('🔧 Corrigiendo categoría del Puente Peatonal Terminal Intermedio...')

  try {
    // Buscar el proyecto
    const proyecto = await prisma.proyecto.findFirst({
      where: {
        titulo: {
          contains: 'Puente Peatonal Terminal Intermedio'
        }
      },
      include: {
        imagenes: {
          select: { id: true, url: true }
        }
      }
    })

    if (!proyecto) {
      console.log('❌ No se encontró el proyecto "Puente Peatonal Terminal Intermedio"')
      return
    }

    console.log(`📋 Proyecto encontrado: ${proyecto.titulo}`)
    console.log(`📂 Categoría actual: ${proyecto.categoria}`)
    console.log(`🖼️  Imágenes: ${proyecto.imagenes.length}`)

    if (proyecto.categoria === 'PUENTES_PEATONALES') {
      console.log('✅ El proyecto ya tiene la categoría correcta')
      return
    }

    // Actualizar la categoría
    const updatedProject = await prisma.proyecto.update({
      where: { id: proyecto.id },
      data: { categoria: 'PUENTES_PEATONALES' }
    })

    console.log(`✅ Categoría actualizada de ${proyecto.categoria} a ${updatedProject.categoria}`)
    console.log(`📌 Las imágenes se moverán automáticamente cuando ejecutes el script de reorganización`)

  } catch (error) {
    console.error('❌ Error corrigiendo categoría:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar script
if (require.main === module) {
  fixPuentePeatonalCategory()
    .then(() => {
      console.log('\nCorrección completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error ejecutando corrección:', error)
      process.exit(1)
    })
}

export { fixPuentePeatonalCategory }