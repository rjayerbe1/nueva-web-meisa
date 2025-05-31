/**
 * Script para inicializar las categorías en la base de datos
 * Ejecutar con: npx tsx scripts/seed-categories.ts
 */

import { PrismaClient, CategoriaEnum } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES_DATA = [
  {
    key: CategoriaEnum.CENTROS_COMERCIALES,
    nombre: 'Centros Comerciales',
    descripcion: 'Estructuras metálicas para centros comerciales, plazas y complejos de retail.',
    slug: 'centros-comerciales',
    icono: 'Building',
    color: '#3B82F6',
    colorSecundario: '#1E40AF',
    orden: 1,
    metaTitle: 'Estructuras Metálicas para Centros Comerciales - MEISA',
    metaDescription: 'Especialistas en diseño y construcción de estructuras metálicas para centros comerciales y plazas comerciales en Colombia.'
  },
  {
    key: CategoriaEnum.EDIFICIOS,
    nombre: 'Edificios',
    descripcion: 'Estructuras metálicas para edificios residenciales, comerciales e institucionales.',
    slug: 'edificios',
    icono: 'Home',
    color: '#10B981',
    colorSecundario: '#047857',
    orden: 2,
    metaTitle: 'Estructuras Metálicas para Edificios - MEISA',
    metaDescription: 'Construcción de estructuras metálicas para edificios residenciales, comerciales e institucionales con los más altos estándares de calidad.'
  },
  {
    key: CategoriaEnum.INDUSTRIA,
    nombre: 'Industria',
    descripcion: 'Estructuras metálicas industriales, bodegas, plantas de producción y complejos industriales.',
    slug: 'industria',
    icono: 'Factory',
    color: '#F59E0B',
    colorSecundario: '#D97706',
    orden: 3,
    metaTitle: 'Estructuras Metálicas Industriales - MEISA',
    metaDescription: 'Diseño y construcción de estructuras metálicas para la industria: bodegas, plantas de producción y complejos industriales.'
  },
  {
    key: CategoriaEnum.PUENTES_VEHICULARES,
    nombre: 'Puentes Vehiculares',
    descripcion: 'Puentes metálicos para tráfico vehicular, viaductos y obras de infraestructura vial.',
    slug: 'puentes-vehiculares',
    icono: 'Layers',
    color: '#EF4444',
    colorSecundario: '#DC2626',
    orden: 4,
    metaTitle: 'Puentes Vehiculares Metálicos - MEISA',
    metaDescription: 'Construcción de puentes vehiculares metálicos y obras de infraestructura vial con tecnología de punta.'
  },
  {
    key: CategoriaEnum.PUENTES_PEATONALES,
    nombre: 'Puentes Peatonales',
    descripcion: 'Puentes peatonales metálicos para conectividad urbana y accesibilidad.',
    slug: 'puentes-peatonales',
    icono: 'Layers',
    color: '#8B5CF6',
    colorSecundario: '#7C3AED',
    orden: 5,
    metaTitle: 'Puentes Peatonales Metálicos - MEISA',
    metaDescription: 'Diseño y construcción de puentes peatonales metálicos para mejorar la conectividad urbana y accesibilidad.'
  },
  {
    key: CategoriaEnum.ESCENARIOS_DEPORTIVOS,
    nombre: 'Escenarios Deportivos',
    descripcion: 'Estructuras metálicas para coliseos, estadios, canchas y centros deportivos.',
    slug: 'escenarios-deportivos',
    icono: 'Camera',
    color: '#F97316',
    colorSecundario: '#EA580C',
    orden: 6,
    metaTitle: 'Estructuras Metálicas para Escenarios Deportivos - MEISA',
    metaDescription: 'Construcción de estructuras metálicas para coliseos, estadios y centros deportivos con diseños innovadores.'
  },
  {
    key: CategoriaEnum.CUBIERTAS_Y_FACHADAS,
    nombre: 'Cubiertas y Fachadas',
    descripcion: 'Sistemas de cubiertas metálicas y fachadas arquitectónicas especializadas.',
    slug: 'cubiertas-y-fachadas',
    icono: 'Layers',
    color: '#06B6D4',
    colorSecundario: '#0891B2',
    orden: 7,
    metaTitle: 'Cubiertas y Fachadas Metálicas - MEISA',
    metaDescription: 'Especialistas en sistemas de cubiertas metálicas y fachadas arquitectónicas con diseños únicos y funcionales.'
  },
  {
    key: CategoriaEnum.ESTRUCTURAS_MODULARES,
    nombre: 'Estructuras Modulares',
    descripcion: 'Sistemas modulares metálicos prefabricados para construcción rápida y eficiente.',
    slug: 'estructuras-modulares',
    icono: 'Layers',
    color: '#84CC16',
    colorSecundario: '#65A30D',
    orden: 8,
    metaTitle: 'Estructuras Modulares Metálicas - MEISA',
    metaDescription: 'Sistemas modulares metálicos prefabricados para construcción rápida, eficiente y sostenible.'
  },
  {
    key: CategoriaEnum.OIL_AND_GAS,
    nombre: 'Oil & Gas',
    descripcion: 'Estructuras metálicas especializadas para la industria petrolera y gasífera.',
    slug: 'oil-and-gas',
    icono: 'Zap',
    color: '#EC4899',
    colorSecundario: '#DB2777',
    orden: 9,
    metaTitle: 'Estructuras Metálicas Oil & Gas - MEISA',
    metaDescription: 'Estructuras metálicas especializadas para la industria petrolera y gasífera con los más altos estándares de seguridad.'
  },
  {
    key: CategoriaEnum.OTRO,
    nombre: 'Otros Proyectos',
    descripcion: 'Proyectos especiales y estructuras metálicas personalizadas.',
    slug: 'otros-proyectos',
    icono: 'MoreHorizontal',
    color: '#6B7280',
    colorSecundario: '#4B5563',
    orden: 10,
    metaTitle: 'Proyectos Especiales - MEISA',
    metaDescription: 'Proyectos especiales y estructuras metálicas personalizadas para necesidades únicas y específicas.'
  }
]

async function seedCategories() {
  console.log('🌱 Inicializando categorías...')

  try {
    // Verificar categorías existentes
    const existingCategories = await prisma.categoriaProyecto.findMany()
    
    if (existingCategories.length > 0) {
      console.log(`📋 Ya existen ${existingCategories.length} categorías configuradas`)
      console.log('   Categorías existentes:')
      existingCategories.forEach(cat => {
        console.log(`   - ${cat.nombre} (${cat.key})`)
      })
      
      console.log('\n❓ ¿Deseas continuar y actualizar las categorías existentes?')
      console.log('   Esto actualizará los datos pero mantendrá configuraciones personalizadas.')
    }

    console.log('\n🚀 Procesando categorías...')

    let created = 0
    let updated = 0

    for (const categoryData of CATEGORIES_DATA) {
      try {
        // Intentar crear o actualizar
        const existing = await prisma.categoriaProyecto.findUnique({
          where: { key: categoryData.key }
        })

        if (existing) {
          // Actualizar solo si no tiene configuración personalizada
          const updateData: any = {}
          
          // Mantener configuración personalizada existente
          if (!existing.nombre || existing.nombre === categoryData.key) {
            updateData.nombre = categoryData.nombre
          }
          if (!existing.descripcion) {
            updateData.descripcion = categoryData.descripcion
          }
          if (!existing.icono) {
            updateData.icono = categoryData.icono
          }
          if (!existing.color) {
            updateData.color = categoryData.color
          }
          if (!existing.colorSecundario) {
            updateData.colorSecundario = categoryData.colorSecundario
          }
          if (!existing.metaTitle) {
            updateData.metaTitle = categoryData.metaTitle
          }
          if (!existing.metaDescription) {
            updateData.metaDescription = categoryData.metaDescription
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.categoriaProyecto.update({
              where: { key: categoryData.key },
              data: updateData
            })
            console.log(`   ✅ Actualizada: ${categoryData.nombre}`)
            updated++
          } else {
            console.log(`   ⏭️  Sin cambios: ${categoryData.nombre}`)
          }
        } else {
          // Crear nueva categoría
          await prisma.categoriaProyecto.create({
            data: categoryData
          })
          console.log(`   ✨ Creada: ${categoryData.nombre}`)
          created++
        }

      } catch (error) {
        console.error(`   ❌ Error con ${categoryData.nombre}:`, error)
      }
    }

    // Actualizar estadísticas de proyectos
    console.log('\n📊 Actualizando estadísticas...')
    const categoryStats = await prisma.proyecto.groupBy({
      by: ['categoria'],
      _count: {
        categoria: true
      }
    })

    for (const stat of categoryStats) {
      await prisma.categoriaProyecto.updateMany({
        where: { key: stat.categoria },
        data: { totalProyectos: stat._count.categoria }
      })
    }

    console.log(`\n🎉 Inicialización completada:`)
    console.log(`   ✨ Categorías creadas: ${created}`)
    console.log(`   ✅ Categorías actualizadas: ${updated}`)
    console.log(`   📊 Estadísticas actualizadas`)

    // Mostrar resumen final
    const finalCategories = await prisma.categoriaProyecto.findMany({
      orderBy: { orden: 'asc' }
    })

    console.log(`\n📋 Categorías configuradas (${finalCategories.length}):`)
    finalCategories.forEach(cat => {
      console.log(`   ${cat.orden}. ${cat.nombre} (${cat.totalProyectos} proyectos)`)
    })

  } catch (error) {
    console.error('❌ Error inicializando categorías:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar script
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('\n✅ Script finalizado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error ejecutando script:', error)
      process.exit(1)
    })
}

export { seedCategories }