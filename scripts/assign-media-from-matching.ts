/**
 * Asigna Media.proyectoIds desde /tmp/drive-matching-report.csv.
 *
 * - Solo asigna cuando best_match_score >= MIN_SCORE
 * - Idempotente: no toca Media que ya tienen proyectoIds asignados
 * - Para cada drive:<fileId>, busca el Media correspondiente por tag
 *
 * Uso:
 *   npx tsx scripts/assign-media-from-matching.ts                 # dry-run
 *   npx tsx scripts/assign-media-from-matching.ts --commit        # aplica cambios
 *   npx tsx scripts/assign-media-from-matching.ts --commit --min 0.6   # ajusta umbral
 */
import { readFileSync } from "node:fs"
import { prisma } from "../lib/prisma"

const CSV_PATH = "/tmp/drive-matching-report.csv"
const COMMIT = process.argv.includes("--commit")
const MIN_IDX = process.argv.indexOf("--min")
const MIN_SCORE = MIN_IDX >= 0 ? Number(process.argv[MIN_IDX + 1]) : 0.7

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else cur += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ",") {
        out.push(cur)
        cur = ""
      } else cur += c
    }
  }
  out.push(cur)
  return out
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"} · Min score: ${MIN_SCORE}\n`)

  const text = readFileSync(CSV_PATH, "utf8")
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = parseCsvLine(lines[0])
  const idx = (k: string) => header.indexOf(k)

  const I_DRIVE_ID = idx("drive_file_id")
  const I_DRIVE_NAME = idx("drive_name")
  const I_SCORE = idx("best_match_score")
  const I_PROY_ID = idx("best_match_proyecto_id")
  const I_PROY_TITLE = idx("best_match_titulo")

  const candidates: Array<{
    driveId: string
    driveName: string
    score: number
    proyectoId: string
    proyectoTitulo: string
  }> = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const score = parseFloat(cols[I_SCORE] || "0")
    if (!isFinite(score) || score < MIN_SCORE) continue
    const proyectoId = cols[I_PROY_ID]
    if (!proyectoId) continue
    candidates.push({
      driveId: cols[I_DRIVE_ID],
      driveName: cols[I_DRIVE_NAME],
      score,
      proyectoId,
      proyectoTitulo: cols[I_PROY_TITLE],
    })
  }

  console.log(`📋 Candidatos en CSV (score >= ${MIN_SCORE}): ${candidates.length}`)

  // Fetch all Media rows tagged with these drive ids
  const driveTags = candidates.map((c) => `drive:${c.driveId}`)
  const medias = await prisma.media.findMany({
    where: { tags: { hasSome: driveTags } },
    select: { id: true, fileName: true, tags: true, proyectoIds: true },
  })
  const byDriveId = new Map<string, (typeof medias)[number]>()
  for (const m of medias) {
    const t = m.tags.find((x) => x.startsWith("drive:"))
    if (t) byDriveId.set(t.slice(6), m)
  }
  console.log(`📦 Media rows encontrados: ${byDriveId.size}\n`)

  let willAssign = 0
  let alreadyAssigned = 0
  let mediaMissing = 0

  for (const c of candidates) {
    const m = byDriveId.get(c.driveId)
    if (!m) {
      mediaMissing++
      continue
    }
    if (m.proyectoIds.length > 0) {
      alreadyAssigned++
      continue
    }
    willAssign++
    if (willAssign <= 30) {
      console.log(
        `  · ${c.driveName.slice(0, 50).padEnd(50)} (${c.score.toFixed(2)}) → ${c.proyectoTitulo.slice(0, 45)}`,
      )
    }
  }
  if (willAssign > 30) console.log(`  ... y ${willAssign - 30} más`)

  console.log()
  console.log("━".repeat(60))
  console.log(`Para asignar:        ${willAssign}`)
  console.log(`Ya tenían proyecto:  ${alreadyAssigned}`)
  console.log(`Media no encontrado: ${mediaMissing}`)
  if (mediaMissing > 0) {
    console.log("  (probablemente el upload aún no terminó — re-correr más tarde)")
  }

  if (COMMIT && willAssign > 0) {
    console.log("\nAplicando…")
    let applied = 0
    for (const c of candidates) {
      const m = byDriveId.get(c.driveId)
      if (!m || m.proyectoIds.length > 0) continue
      await prisma.media.update({
        where: { id: m.id },
        data: { proyectoIds: [c.proyectoId] },
      })
      applied++
    }
    console.log(`✅ ${applied} Media actualizados`)
  } else if (!COMMIT) {
    console.log("\n(sin --commit no se modifica nada)")
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
