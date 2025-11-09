import { PrismaClient } from '@prisma/client'

const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

async function main() {
  const servicios = await prismaProd.servicio.findMany({
    orderBy: { orden: 'asc' }
  })
  
  console.log('\n📋 SERVICIOS EN PRODUCCIÓN:\n')
  servicios.forEach((s, i) => {
    console.log(`${i+1}. ${s.nombre}`)
    console.log(`   Slug: ${s.slug}`)
    console.log(`   Activo: ${s.activo}`)
    console.log(`   Visible: ${s.visible}`)
    console.log('')
  })
  
  console.log(`TOTAL: ${servicios.length} servicios en base de datos`)
  
  const activos = servicios.filter(s => s.activo === true || s.activo === null)
  console.log(`ACTIVOS: ${activos.length} servicios activos`)
}

main().finally(() => prismaProd.$disconnect())
