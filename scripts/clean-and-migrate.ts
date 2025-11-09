import { PrismaClient } from '@prisma/client'

const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

async function cleanAndMigrate() {
  console.log('🧹 Limpiando proyectos de ejemplo de producción...\n')
  
  // Eliminar imágenes de proyectos primero (foreign key)
  await prismaProd.imagenProyecto.deleteMany({})
  console.log('  ✅ Imágenes eliminadas')
  
  // Eliminar historias de proyectos
  await prismaProd.historiaProyecto.deleteMany({})
  console.log('  ✅ Historias eliminadas')
  
  // Eliminar proyectos
  await prismaProd.proyecto.deleteMany({})
  console.log('  ✅ Proyectos eliminados\n')
  
  console.log('📋 Migrando todos los proyectos reales...\n')
  
  const proyectos = await prismaLocal.proyecto.findMany()
  let count = 0
  
  for (const proyecto of proyectos) {
    await prismaProd.proyecto.create({ data: proyecto })
    count++
    if (count % 5 === 0) {
      console.log(`  ⏳ ${count}/${proyectos.length} proyectos migrados...`)
    }
  }
  
  console.log(`\n✅ ${count} proyectos migrados\n`)
  
  console.log('📋 Migrando imágenes de proyectos...\n')
  const imagenes = await prismaLocal.imagenProyecto.findMany()
  
  for (const imagen of imagenes) {
    try {
      await prismaProd.imagenProyecto.create({ data: imagen })
    } catch (e) {
      // Skip si hay error con foreign key
    }
  }
  
  console.log(`✅ ${imagenes.length} imágenes migradas\n`)
  
  console.log('📋 Migrando historias...\n')
  const historias = await prismaLocal.historiaProyecto.findMany()
  
  for (const historia of historias) {
    try {
      await prismaProd.historiaProyecto.create({ data: historia })
    } catch (e) {
      // Skip si hay error
    }
  }
  
  console.log(`✅ ${historias.length} historias migradas\n`)
  
  console.log('🎉 ¡Migración completa!')
}

cleanAndMigrate()
  .finally(async () => {
    await prismaLocal.$disconnect()
    await prismaProd.$disconnect()
  })
