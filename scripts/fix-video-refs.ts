/**
 * Para cada referencia /videos/X.mp4 en la DB, busca el archivo en GCS por basename
 * y actualiza el campo a la URL completa. No re-sube nada — solo apunta a archivos
 * que ya existen.
 *
 * Uso:
 *   npx tsx scripts/fix-video-refs.ts          # dry-run
 *   npx tsx scripts/fix-video-refs.ts --commit
 */
import { Storage } from "@google-cloud/storage"
import { prisma } from "../lib/prisma"

const COMMIT = process.argv.includes("--commit")

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  // List all videos in GCS, indexed by basename
  const storage = new Storage({ projectId: "meisa-web-prod-2025" })
  const bucket = storage.bucket("meisa-imagenes")
  const [files] = await bucket.getFiles({ prefix: "videos/" })
  const gcsByName = new Map<string, string>()
  for (const f of files) {
    const baseName = f.name.split("/").pop() ?? ""
    const cleanName = baseName.replace(/^\d{13}-[a-z0-9]{6}-/, "")
    const url = `https://storage.googleapis.com/meisa-imagenes/${f.name}`
    if (!gcsByName.has(baseName)) gcsByName.set(baseName, url)
    if (!gcsByName.has(cleanName)) gcsByName.set(cleanName, url)
  }
  console.log(`Videos en GCS: ${files.length}\n`)

  // Find columns
  const cols = await prisma.$queryRawUnsafe<Array<{ table: string; column: string; type: string }>>(`
    SELECT table_name AS table, column_name AS column, data_type AS type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND data_type IN ('text', 'jsonb', 'character varying')
  `)

  let updated = 0
  let nullified = 0
  let stillMissing = 0

  for (const c of cols) {
    try {
      let rows: Array<{ id: string; v: string }> = []
      if (c.type === "jsonb") {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}"::text AS v FROM "${c.table}" WHERE "${c.column}"::text LIKE '%/videos/%'`,
        )
      } else {
        rows = await prisma.$queryRawUnsafe(
          `SELECT id, "${c.column}" AS v FROM "${c.table}" WHERE "${c.column}" LIKE '%/videos/%'`,
        )
      }

      for (const r of rows) {
        const matches = r.v.match(/\/videos\/[^"',\s\)\]]+/g) ?? []
        if (matches.length === 0) continue

        let newRaw = r.v
        let allResolved = true
        const missing: string[] = []
        for (const m of matches) {
          const baseName = m.split("/").pop() ?? ""
          const cleanName = baseName.replace(/^\d{13}-[a-z0-9]{6}-/, "")
          const gcsUrl = gcsByName.get(baseName) ?? gcsByName.get(cleanName)
          if (gcsUrl) {
            newRaw = newRaw.split(m).join(gcsUrl)
          } else {
            allResolved = false
            missing.push(m)
          }
        }

        if (newRaw !== r.v) {
          console.log(`  ${c.table}.${c.column} [${r.id}]`)
          for (const m of matches) {
            const newUrl = gcsByName.get(m.split("/").pop() ?? "") ?? gcsByName.get(m.split("/").pop()!.replace(/^\d{13}-[a-z0-9]{6}-/, ""))
            if (newUrl) console.log(`    ${m} → ${newUrl.slice(40)}`)
          }
          if (COMMIT) {
            try {
              if (c.type === "jsonb") {
                await prisma.$executeRawUnsafe(
                  `UPDATE "${c.table}" SET "${c.column}" = $1::jsonb WHERE id = $2`,
                  newRaw, r.id,
                )
              } else if (c.table === "media") {
                // media: also update pathGcs
                const newUrl = gcsByName.get(matches[0].split("/").pop() ?? "")
                  ?? gcsByName.get(matches[0].split("/").pop()!.replace(/^\d{13}-[a-z0-9]{6}-/, ""))
                if (newUrl) {
                  const pathGcs = newUrl.replace(/^https:\/\/storage\.googleapis\.com\/meisa-imagenes\//, "")
                  try {
                    await prisma.$executeRawUnsafe(
                      `UPDATE media SET url = $1, "pathGcs" = $2 WHERE id = $3`,
                      newUrl, pathGcs, r.id,
                    )
                  } catch (e: any) {
                    if (e?.meta?.code === "23505") {
                      await prisma.media.delete({ where: { id: r.id } })
                      console.log(`    (duplicada — borrada)`)
                    } else throw e
                  }
                }
              } else {
                await prisma.$executeRawUnsafe(
                  `UPDATE "${c.table}" SET "${c.column}" = $1 WHERE id = $2`,
                  newRaw, r.id,
                )
              }
            } catch (e) {
              console.error(`    ❌ ${(e as Error).message}`)
            }
          }
          updated++
        }
        if (!allResolved) {
          for (const m of missing) {
            console.log(`  ❌ ${c.table}.${c.column} [${r.id}] — ${m} no está en GCS`)
            stillMissing++
          }
        }
      }
    } catch {}
  }

  console.log(`\n━━━ Resumen ━━━`)
  console.log(`Filas con al menos una ref actualizada: ${updated}`)
  console.log(`Refs aún ausentes en GCS: ${stillMissing}`)

  await prisma.$disconnect()
}
main().catch((e) => { console.error(e); process.exit(1) })
