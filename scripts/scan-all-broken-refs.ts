/**
 * Escanea TODAS las columnas de texto de TODAS las tablas en busca de paths
 * "/images/*" o "/videos/*" rotos. Usa information_schema + queries dinámicas.
 *
 * Uso:
 *   npx tsx scripts/scan-all-broken-refs.ts            # solo lista
 *   npx tsx scripts/scan-all-broken-refs.ts --json     # output como JSON
 */
import { prisma } from "../lib/prisma"

interface Hit {
  table: string
  column: string
  id: string
  value: string
}

async function main() {
  // Get all text/varchar/jsonb columns of public tables
  const cols = await prisma.$queryRawUnsafe<
    Array<{ table_name: string; column_name: string; data_type: string }>
  >(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying', 'character', 'jsonb')
    ORDER BY table_name, column_name
  `)

  const hits: Hit[] = []

  // Group by table
  const byTable = new Map<string, Array<{ column: string; type: string }>>()
  for (const c of cols) {
    if (!byTable.has(c.table_name)) byTable.set(c.table_name, [])
    byTable.get(c.table_name)!.push({ column: c.column_name, type: c.data_type })
  }

  for (const [table, columns] of byTable.entries()) {
    // Check if table has 'id' column
    const hasId = columns.find((c) => c.column === "id")
    if (!hasId) continue

    for (const c of columns) {
      try {
        if (c.type === "jsonb") {
          // jsonb: cast to text and search
          const rows = await prisma.$queryRawUnsafe<Array<{ id: string; v: string }>>(
            `SELECT id, "${c.column}"::text AS v FROM "${table}"
             WHERE "${c.column}"::text LIKE '%/images/%'
                OR "${c.column}"::text LIKE '%/videos/%'`,
          )
          for (const r of rows) {
            hits.push({ table, column: c.column, id: r.id, value: r.v })
          }
        } else {
          const rows = await prisma.$queryRawUnsafe<Array<{ id: string; v: string }>>(
            `SELECT id, "${c.column}" AS v FROM "${table}"
             WHERE "${c.column}" LIKE '/images/%'
                OR "${c.column}" LIKE '/videos/%'`,
          )
          for (const r of rows) {
            hits.push({ table, column: c.column, id: r.id, value: r.v })
          }
        }
      } catch (e) {
        // skip columns we can't query
      }
    }
  }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(hits, null, 2))
  } else {
    console.log(`Total refs rotas: ${hits.length}\n`)
    const grouped = new Map<string, Hit[]>()
    for (const h of hits) {
      const k = `${h.table}.${h.column}`
      if (!grouped.has(k)) grouped.set(k, [])
      grouped.get(k)!.push(h)
    }
    for (const [k, arr] of [...grouped.entries()].sort()) {
      console.log(`\n=== ${k} (${arr.length}) ===`)
      for (const h of arr.slice(0, 10)) {
        const v = h.value.length > 120 ? h.value.slice(0, 117) + "..." : h.value
        console.log(`  · [${h.id}] ${v}`)
      }
      if (arr.length > 10) console.log(`  ... y ${arr.length - 10} más`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
