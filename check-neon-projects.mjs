#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_LvDIU8e3bhxG@ep-young-wave-ae409lqp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } }
})

async function check() {
  console.log('\n📊 Verificando proyectos en Neon...\n')

  const proyectos = await prisma.proyecto.count()
  const hojaVida = await prisma.proyectoHojaVida.count()
  const categorias = await prisma.categoriaProyecto.findMany({
    select: { nombre: true, key: true, totalProyectos: true }
  })

  console.log(`Proyectos detallados: ${proyectos}`)
  console.log(`Proyectos hoja de vida: ${hojaVida}`)
  console.log(`\nCategorías:`)
  categorias.forEach(c => {
    console.log(`  ${c.nombre}: ${c.totalProyectos} proyectos`)
  })

  await prisma.$disconnect()
}

check()
