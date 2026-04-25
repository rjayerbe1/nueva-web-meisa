/**
 * Limpia las referencias muertas que quedaron tras correr recover-all-broken-refs.
 * - Media rows con url "/images/*" o "/videos/*": DELETE (no existían en git)
 * - Otras tablas con paths /images/* | /videos/*: SET NULL en ese campo
 *
 * Uso:
 *   npx tsx scripts/clean-dead-refs.ts            # dry-run
 *   npx tsx scripts/clean-dead-refs.ts --commit
 */
import { prisma } from "../lib/prisma"

const COMMIT = process.argv.includes("--commit")

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  // 1. Media rows with broken url
  const deadMedia = await prisma.$queryRawUnsafe<Array<{ id: string; url: string; folder: string }>>(`
    SELECT id, url, folder FROM media
    WHERE url LIKE '/images/%' OR url LIKE '/videos/%'
  `)
  console.log(`Media rows fantasma a borrar: ${deadMedia.length}`)
  for (const m of deadMedia.slice(0, 10)) {
    console.log(`  · [${m.folder}] ${m.url}`)
  }
  if (deadMedia.length > 10) console.log(`  ... y ${deadMedia.length - 10} más`)

  // 2. Other tables — find remaining
  const cols = await prisma.$queryRawUnsafe<Array<{ table: string; column: string; type: string }>>(`
    SELECT table_name AS table, column_name AS column, data_type AS type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name <> 'media'
      AND data_type IN ('text', 'character varying', 'character', 'jsonb')
  `)
  interface DeadRef { table: string; column: string; id: string; value: string; type: string }
  const deadRefs: DeadRef[] = []
  for (const c of cols) {
    try {
      let rows: Array<{ id: string; v: string }> = []
      if (c.type === "jsonb") {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}"::text AS v FROM "${c.table}"
           WHERE "${c.column}"::text LIKE '%/images/%' OR "${c.column}"::text LIKE '%/videos/%'`,
        )
      } else {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}" AS v FROM "${c.table}"
           WHERE "${c.column}" LIKE '/images/%' OR "${c.column}" LIKE '/videos/%'`,
        )
      }
      for (const r of rows) {
        deadRefs.push({ table: c.table, column: c.column, id: r.id, value: r.v, type: c.type })
      }
    } catch {}
  }

  console.log(`\nOtras refs muertas (no-media): ${deadRefs.length}`)
  const grouped = new Map<string, DeadRef[]>()
  for (const d of deadRefs) {
    const k = `${d.table}.${d.column}`
    if (!grouped.has(k)) grouped.set(k, [])
    grouped.get(k)!.push(d)
  }
  for (const [k, arr] of [...grouped.entries()].sort()) {
    console.log(`\n  ${k} (${arr.length}):`)
    for (const d of arr.slice(0, 5)) {
      const v = d.value.length > 100 ? d.value.slice(0, 97) + "..." : d.value
      console.log(`    · [${d.id}] ${v}`)
    }
    if (arr.length > 5) console.log(`    ... y ${arr.length - 5} más`)
  }

  if (!COMMIT) {
    console.log("\n(sin --commit no se modifica nada)")
    await prisma.$disconnect()
    return
  }

  // Apply
  if (deadMedia.length > 0) {
    const ids = deadMedia.map((m) => m.id)
    const deleted = await prisma.media.deleteMany({ where: { id: { in: ids } } })
    console.log(`\n🗑️  Borradas ${deleted.count} Media rows fantasma`)
  }

  let nullified = 0
  for (const d of deadRefs) {
    if (d.type === "jsonb") {
      // Skip jsonb — might be array with mix of valid/invalid; needs manual review
      console.log(`  skip jsonb: ${d.table}.${d.column} [${d.id}]`)
      continue
    }
    await prisma.$executeRawUnsafe(
      `UPDATE "${d.table}" SET "${d.column}" = NULL WHERE id = $1`,
      d.id,
    )
    nullified++
  }
  console.log(`\nCampos puestos en NULL: ${nullified}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
