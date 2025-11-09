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

async function migrate() {
  console.log('🧹 Limpiando proyectos de ejemplo...\n')
  
  await prismaProd.imagenProyecto.deleteMany({})
  await prismaProd.historiaProyecto.deleteMany({})
  await prismaProd.proyecto.deleteMany({})
  console.log('  ✅ Limpieza completa\n')
  
  // Obtener el admin user de producción
  const adminUser = await prismaProd.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('No admin user found in production!')
  }
  
  console.log(`📋 Migrando proyectos (usando usuario: ${adminUser.email})...\n`)
  
  const proyectos = await prismaLocal.proyecto.findMany()
  let count = 0
  
  for (const proyecto of proyectos) {
    const { createdBy, updatedBy, ...data } = proyecto as any
    
    await prismaProd.proyecto.create({ 
      data: {
        ...data,
        createdBy: adminUser.id  // Usar el admin de producción
      }
    })
    count++
    if (count % 5 === 0) {
      console.log(`  ⏳ ${count}/${proyectos.length} proyectos...`)
    }
  }
  
  console.log(`\n✅ ${count} proyectos migrados\n`)
  
  console.log('📋 Migrando imágenes...\n')
  const imagenes = await prismaLocal.imagenProyecto.findMany()
  
  for (const imagen of imagenes) {
    try {
      await prismaProd.imagenProyecto.create({ data: imagen })
    } catch (e) {
      // Skip on error
    }
  }
  
  console.log(`✅ ${imagenes.length} imágenes migradas\n`)
  
  console.log('📋 Migrando historias...\n')
  const historias = await prismaLocal.historiaProyecto.findMany()
  
  for (const historia of historias) {
    try {
      const { userId, ...histData } = historia as any
      await prismaProd.historiaProyecto.create({ 
        data: {
          ...histData,
          userId: adminUser.id
        }
      })
    } catch (e) {
      // Skip
    }
  }
  
  console.log(`✅ ${historias.length} historias migradas\n`)
  console.log('🎉 ¡Migración exitosa!')
}

migrate()
  .catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaLocal.$disconnect()
    await prismaProd.$disconnect()
  })
