import { PrismaClient } from '@prisma/client'

const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

async function consolidar() {
  console.log('🧹 Consolidando servicios - Eliminando duplicados...\n')
  
  // Servicios a ELIMINAR (duplicados)
  const serviciosEliminar = [
    'diseno-estructural',        // Duplicado de "Consultoría en Diseño Estructural"
    'fabricacion',               // Duplicado de "Fabricación de Estructuras Metálicas"
    'montaje',                   // Duplicado de "Montaje de Estructuras"
    'consultoria'                // Genérico, duplicado de "Consultoría en Diseño Estructural"
  ]
  
  for (const slug of serviciosEliminar) {
    const servicio = await prismaProd.servicio.findUnique({ where: { slug } })
    if (servicio) {
      await prismaProd.servicio.delete({ where: { slug } })
      console.log(`  ❌ Eliminado: ${servicio.nombre} (${slug})`)
    }
  }
  
  console.log('\n✅ Servicios duplicados eliminados\n')
  
  // Mostrar servicios que quedan
  const serviciosFinales = await prismaProd.servicio.findMany({
    orderBy: { orden: 'asc' }
  })
  
  console.log('📋 SERVICIOS FINALES (4 servicios principales):\n')
  serviciosFinales.forEach((s, i) => {
    console.log(`${i+1}. ${s.nombre}`)
    console.log(`   Slug: ${s.slug}`)
    console.log('')
  })
  
  console.log(`\n🎉 Consolidación completa: ${serviciosFinales.length} servicios`)
}

consolidar()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prismaProd.$disconnect())
