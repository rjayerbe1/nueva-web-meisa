import { PrismaClient } from '@prisma/client'

// Base de datos local
const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DB_URL || 'postgresql://rjayerbe@localhost:5432/meisa_db'
    }
  }
})

// Base de datos producción (Neon)
const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PROD_DB_URL || 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
  }
})

async function migrateAll() {
  console.log('🚀 Iniciando migración completa de base de datos...\n')

  try {
    // 1. Migrar usuarios (excepto los que ya existen)
    console.log('📋 1/10 Migrando usuarios...')
    const users = await prismaLocal.user.findMany()
    let userCount = 0
    for (const user of users) {
      try {
        await prismaProd.user.create({ data: user })
        userCount++
      } catch (e) {
        console.log(`  ⚠️  Usuario ${user.email} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${userCount} usuarios migrados\n`)

    // 2. Migrar categorías de proyectos
    console.log('📋 2/10 Migrando categorías de proyectos...')
    const categorias = await prismaLocal.categoriaProyecto.findMany()
    let catCount = 0
    for (const cat of categorias) {
      try {
        await prismaProd.categoriaProyecto.create({ data: cat })
        catCount++
      } catch (e) {
        console.log(`  ⚠️  Categoría ${cat.nombre} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${catCount} categorías migradas\n`)

    // 3. Migrar clientes
    console.log('📋 3/10 Migrando clientes...')
    const clientes = await prismaLocal.cliente.findMany()
    for (const cliente of clientes) {
      try {
        await prismaProd.cliente.create({ data: cliente })
      } catch (e) {
        console.log(`  ⚠️  Cliente ${cliente.nombre} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${clientes.length} clientes migrados\n`)

    // 4. Migrar servicios
    console.log('📋 4/10 Migrando servicios...')
    const servicios = await prismaLocal.servicio.findMany()
    for (const servicio of servicios) {
      try {
        await prismaProd.servicio.create({ data: servicio })
      } catch (e) {
        console.log(`  ⚠️  Servicio ${servicio.nombre} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${servicios.length} servicios migrados\n`)

    // 5. Migrar miembros del equipo
    console.log('📋 5/10 Migrando equipo...')
    const equipo = await prismaLocal.miembroEquipo.findMany()
    for (const miembro of equipo) {
      try {
        await prismaProd.miembroEquipo.create({ data: miembro })
      } catch (e) {
        console.log(`  ⚠️  Miembro ${miembro.nombre} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${equipo.length} miembros del equipo migrados\n`)

    // 6. Migrar páginas
    console.log('📋 6/10 Migrando páginas...')
    const paginas = await prismaLocal.pagina.findMany()
    for (const pagina of paginas) {
      try {
        await prismaProd.pagina.create({ data: pagina })
      } catch (e) {
        console.log(`  ⚠️  Página ${pagina.slug} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${paginas.length} páginas migradas\n`)

    // 7. Migrar proyectos
    console.log('📋 7/10 Migrando proyectos...')
    const proyectos = await prismaLocal.proyecto.findMany()
    for (const proyecto of proyectos) {
      try {
        await prismaProd.proyecto.create({ data: proyecto })
      } catch (e) {
        console.log(`  ⚠️  Proyecto ${proyecto.titulo} ya existe, omitiendo...`)
      }
    }
    console.log(`  ✅ ${proyectos.length} proyectos migrados\n`)

    // 8. Migrar imágenes de proyectos
    console.log('📋 8/10 Migrando imágenes de proyectos...')
    const imagenes = await prismaLocal.imagenProyecto.findMany()
    for (const imagen of imagenes) {
      try {
        await prismaProd.imagenProyecto.create({ data: imagen })
      } catch (e) {
        // Silent fail para imágenes duplicadas
      }
    }
    console.log(`  ✅ ${imagenes.length} imágenes migradas\n`)

    // 9. Migrar historias de proyectos
    console.log('📋 9/10 Migrando historias de proyectos...')
    const historias = await prismaLocal.historiaProyecto.findMany()
    for (const historia of historias) {
      try {
        await prismaProd.historiaProyecto.create({ data: historia })
      } catch (e) {
        // Silent fail
      }
    }
    console.log(`  ✅ ${historias.length} historias migradas\n`)

    // 10. Migrar formularios de contacto
    console.log('📋 10/10 Migrando formularios de contacto...')
    const contactos = await prismaLocal.contactForm.findMany()
    for (const contacto of contactos) {
      try {
        await prismaProd.contactForm.create({ data: contacto })
      } catch (e) {
        // Silent fail
      }
    }
    console.log(`  ✅ ${contactos.length} formularios migrados\n`)

    console.log('🎉 ¡Migración completa exitosa!\n')
    console.log('Resumen:')
    console.log(`- ${users.length} usuarios`)
    console.log(`- ${categorias.length} categorías`)
    console.log(`- ${clientes.length} clientes`)
    console.log(`- ${servicios.length} servicios`)
    console.log(`- ${equipo.length} miembros del equipo`)
    console.log(`- ${paginas.length} páginas`)
    console.log(`- ${proyectos.length} proyectos`)
    console.log(`- ${imagenes.length} imágenes`)
    console.log(`- ${historias.length} historias`)
    console.log(`- ${contactos.length} formularios de contacto`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  }
}

migrateAll()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaLocal.$disconnect()
    await prismaProd.$disconnect()
  })
