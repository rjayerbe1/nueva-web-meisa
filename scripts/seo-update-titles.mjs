/**
 * Mejora los <title> de las landings de soluciones: estaban templateados
 * ("— Diseño, Fabricación y Montaje | MEISA") y muy largos. Los reemplaza por
 * títulos keyword-led con un número real y estable (toneladas floored, que solo
 * crecen y coinciden con el dato que ya muestra la página). Editable luego en
 * /admin/landings. OJO: landingSeo vive en Neon (DB compartida dev+prod).
 * Uso: node scripts/seo-update-titles.mjs
 */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NUEVOS = {
  'estructura-metalica-para-bodegas':
    'Estructura Metálica para Bodegas y Naves: +6.200 ton | MEISA',
  'puentes-metalicos':
    'Puentes Metálicos en Colombia: +4.600 ton de Acero | MEISA',
  'cubiertas-metalicas':
    'Cubiertas Metálicas para Grandes Luces y Fachadas | MEISA',
  'estructura-metalica-centros-comerciales':
    'Estructura Metálica para Centros Comerciales: +14.600 ton | MEISA',
  'edificios-en-estructura-metalica':
    'Edificios en Estructura Metálica: +2.800 ton de Acero | MEISA',
}

for (const [slug, metaTitle] of Object.entries(NUEVOS)) {
  const row = await prisma.landingSeo.findUnique({ where: { slug }, select: { metaTitle: true } })
  if (!row) { console.log(`SKIP  ${slug} — no existe fila`); continue }
  if (row.metaTitle === metaTitle) { console.log(`OK    ${slug} — ya estaba`); continue }
  await prisma.landingSeo.update({ where: { slug }, data: { metaTitle } })
  console.log(`UPD   ${slug}`)
  console.log(`        antes:  ${row.metaTitle}`)
  console.log(`        ahora:  ${metaTitle} (${metaTitle.length} chars)`)
}

await prisma.$disconnect()
