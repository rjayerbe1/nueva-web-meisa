// Seed de las 13 landings SEO → tabla landings_seo.
//   6 soluciones  (lib/soluciones.ts)  → tipo SOLUCION
//   4 guías       (lib/guias.ts)       → tipo GUIA
//   3 ciudades    (lib/ciudades.ts)    → tipo CIUDAD
//
// Idempotente: upsert por slug. En update NO pisa contenido editado en el
// admin salvo que se pase --force (por defecto solo crea las que faltan).
//
// Correr:  npx tsx scripts/seed-landings.mjs [--force]
import { PrismaClient } from '@prisma/client'
import { SOLUCIONES } from '../lib/soluciones.ts'
import { CIUDADES } from '../lib/ciudades.ts'
import { GUIAS } from '../lib/guias.ts'

const prisma = new PrismaClient()
const FORCE = process.argv.includes('--force')

function stripKeys(obj, keys) {
  const copy = { ...obj }
  for (const k of keys) delete copy[k]
  return copy
}

function buildLandings() {
  const landings = []

  SOLUCIONES.forEach((s, i) => {
    landings.push({
      slug: s.slug,
      tipo: 'SOLUCION',
      titulo: `Solución — ${s.keywordH1}`,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      contenido: stripKeys(s, ['slug', 'metaTitle', 'metaDescription']),
      orden: i,
    })
  })

  GUIAS.forEach((g, i) => {
    landings.push({
      slug: g.slug,
      tipo: 'GUIA',
      titulo: g.titulo,
      metaTitle: g.metaTitle,
      metaDescription: g.metaDescription,
      contenido: g.contenido,
      orden: i,
    })
  })

  CIUDADES.forEach((c, i) => {
    landings.push({
      slug: c.slug,
      tipo: 'CIUDAD',
      titulo: `Estructuras metálicas en ${c.nombre}`,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
      contenido: stripKeys(c, ['slug', 'metaTitle', 'metaDescription']),
      orden: i,
    })
  })

  return landings
}

async function main() {
  const landings = buildLandings()
  console.log(`Seed de ${landings.length} landings (force=${FORCE})…\n`)

  let creadas = 0
  let actualizadas = 0
  let intactas = 0

  for (const l of landings) {
    const existente = await prisma.landingSeo.findUnique({
      where: { slug: l.slug },
      select: { id: true },
    })

    if (!existente) {
      await prisma.landingSeo.create({ data: l })
      creadas++
      console.log(`  + creada      [${l.tipo}] ${l.slug}`)
    } else if (FORCE) {
      await prisma.landingSeo.update({
        where: { slug: l.slug },
        data: {
          tipo: l.tipo,
          titulo: l.titulo,
          metaTitle: l.metaTitle,
          metaDescription: l.metaDescription,
          contenido: l.contenido,
          orden: l.orden,
        },
      })
      actualizadas++
      console.log(`  ~ actualizada [${l.tipo}] ${l.slug}`)
    } else {
      intactas++
      console.log(`  = intacta     [${l.tipo}] ${l.slug}`)
    }
  }

  console.log(
    `\nListo: ${creadas} creadas, ${actualizadas} actualizadas, ${intactas} sin tocar.`,
  )
  const total = await prisma.landingSeo.count()
  console.log(`Total en landings_seo: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
