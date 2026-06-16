import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SLUG = 'precios-estructuras-metalicas'
const NEW_HEROSUB =
  'Rangos reales del mercado colombiano, qué incluyen, qué los hace variar y cómo pasar de kilogramos a metros cuadrados. Sin rodeos ni promesas infladas.'

const row = await prisma.landingSeo.findUnique({ where: { slug: SLUG } })

if (!row) {
  console.log('⚠️  No existe fila en landings_seo para', SLUG)
  console.log('   → La página usa el fallback de código (lib/guias.ts), ya corregido.')
  await prisma.$disconnect()
  process.exit(0)
}

const contenido = { ...row.contenido }
console.log('tipo:', row.tipo, '| activa:', row.activa)
console.log('OLD heroSub:', JSON.stringify(contenido.heroSub))

if (contenido.heroSub === NEW_HEROSUB) {
  console.log('✅ Ya estaba con el texto nuevo, nada que hacer.')
  await prisma.$disconnect()
  process.exit(0)
}

contenido.heroSub = NEW_HEROSUB
await prisma.landingSeo.update({ where: { slug: SLUG }, data: { contenido } })

const after = await prisma.landingSeo.findUnique({ where: { slug: SLUG } })
console.log('NEW heroSub:', JSON.stringify(after.contenido.heroSub))
console.log('✅ Actualizado en DB (Neon — afecta dev y prod).')

await prisma.$disconnect()
