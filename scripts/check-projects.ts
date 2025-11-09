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

async function check() {
  console.log('📊 Verificando proyectos...\n')
  
  const localProjects = await prismaLocal.proyecto.findMany({
    select: { titulo: true, slug: true }
  })
  
  const prodProjects = await prismaProd.proyecto.findMany({
    select: { titulo: true, slug: true }
  })
  
  console.log(`📋 Base de datos LOCAL: ${localProjects.length} proyectos`)
  console.log(`📋 Base de datos PRODUCCIÓN: ${prodProjects.length} proyectos\n`)
  
  console.log('Proyectos en producción:')
  prodProjects.forEach((p, i) => {
    console.log(`${i+1}. ${p.titulo}`)
  })
}

check()
  .finally(async () => {
    await prismaLocal.$disconnect()
    await prismaProd.$disconnect()
  })
