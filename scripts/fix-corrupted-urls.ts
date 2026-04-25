/**
 * Repara URLs corruptas que quedaron concatenadas múltiples veces tras los
 * scripts de recovery. Extrae la última URL https://storage.googleapis.com/...
 * de cada campo y lo reemplaza por solo esa URL.
 *
 * Uso:
 *   npx tsx scripts/fix-corrupted-urls.ts            # dry-run
 *   npx tsx scripts/fix-corrupted-urls.ts --commit
 */
import { prisma } from "../lib/prisma"

const COMMIT = process.argv.includes("--commit")
const GCS_PREFIX = "https://storage.googleapis.com/meisa-imagenes/"

function fixOne(value: string): string | null {
  // Real corruption signal: GCS prefix appears immediately after a non-separator
  // character (no `"`, `,`, `]`, `}`, whitespace before it). E.g.:
  //   ".../meisa-imageneshttps://storage.googleapis.com/..."
  // If the URLs are properly separated (in JSON, arrays), we leave them.
  const corruption = /[^"',\s\]\{\}\(\)]https:\/\/storage\.googleapis\.com\/meisa-imagenes/.test(value)
  if (!corruption) return null

  // Extract the LAST GCS URL — it's the one we want
  const lastIdx = value.lastIndexOf(GCS_PREFIX)
  if (lastIdx < 0) return null
  const tail = value.slice(lastIdx)
  return tail.replace(/[,"'\]\s\}].*/, "")
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  const cols = await prisma.$queryRawUnsafe<Array<{ table: string; column: string; type: string }>>(`
    SELECT table_name AS table, column_name AS column, data_type AS type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND data_type IN ('text', 'jsonb', 'character varying')
  `)

  let fixed = 0
  let scanned = 0

  for (const c of cols) {
    try {
      let rows: Array<{ id: string; v: string }> = []
      const pattern = `%${GCS_PREFIX}%${GCS_PREFIX}%`
      if (c.type === "jsonb") {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}"::text AS v FROM "${c.table}" WHERE "${c.column}"::text LIKE $1`,
          pattern,
        )
      } else {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}" AS v FROM "${c.table}" WHERE "${c.column}" LIKE $1`,
          pattern,
        )
      }

      for (const r of rows) {
        scanned++
        if (c.type === "jsonb") {
          // Try to parse the JSON and fix each string member
          let data: any
          try { data = JSON.parse(r.v) } catch { continue }
          let changed = false
          if (typeof data === "string") {
            const f = fixOne(data)
            if (f) { data = f; changed = true }
          } else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
              if (typeof data[i] === "string") {
                const f = fixOne(data[i])
                if (f) { data[i] = f; changed = true }
              }
            }
          } else if (typeof data === "object" && data !== null) {
            for (const k of Object.keys(data)) {
              if (typeof data[k] === "string") {
                const f = fixOne(data[k])
                if (f) { data[k] = f; changed = true }
              }
            }
          }
          if (!changed) continue
          const newJson = JSON.stringify(data)
          console.log(`  ${c.table}.${c.column} [${r.id}]:`)
          console.log(`    raw len ${r.v.length} → ${newJson.length}`)
          if (COMMIT) {
            await prisma.$executeRawUnsafe(
              `UPDATE "${c.table}" SET "${c.column}" = $1::jsonb WHERE id = $2`,
              newJson, r.id,
            )
          }
          fixed++
        } else {
          const f = fixOne(r.v)
          if (!f) continue
          console.log(`  ${c.table}.${c.column} [${r.id}]:`)
          console.log(`    ${r.v.slice(0, 80)}...`)
          console.log(`    → ${f}`)
          if (COMMIT) {
            try {
              await prisma.$executeRawUnsafe(
                `UPDATE "${c.table}" SET "${c.column}" = $1 WHERE id = $2`,
                f, r.id,
              )
              fixed++
            } catch (e: any) {
              if (e?.meta?.code === "23505") {
                // duplicate URL on a media row — delete it
                if (c.table === "media") {
                  await prisma.media.delete({ where: { id: r.id } })
                  console.log(`    (duplicada — borrada)`)
                  fixed++
                }
              } else throw e
            }
          } else {
            fixed++
          }
        }
      }
    } catch (e) {
      console.error(`error scanning ${c.table}.${c.column}:`, (e as Error).message)
    }
  }

  console.log(`\nEscaneadas: ${scanned}`)
  console.log(`${COMMIT ? "Reparadas" : "Reparables"}: ${fixed}`)

  await prisma.$disconnect()
}
main().catch((e) => { console.error(e); process.exit(1) })
