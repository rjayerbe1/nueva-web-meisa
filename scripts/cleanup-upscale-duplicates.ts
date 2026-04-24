/**
 * Limpia duplicados de Media generados por runs antiguos de upscale-project-images.ts
 * (antes del fix de path determinístico, cada run creaba `<timestamp>-<model>-<filename>`).
 *
 * Estrategia: por (proyecto-tag, filename, modelo), conservar solo el Media más
 * reciente. Borra los anteriores en Media + GCS.
 *
 * Uso:
 *   npx tsx scripts/cleanup-upscale-duplicates.ts --slug=<slug> [--dry-run]
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })

import { Storage } from "@google-cloud/storage"
import { prisma } from "../lib/prisma"

const args = process.argv.slice(2)
const slug = args.find((a) => a.startsWith("--slug="))?.split("=")[1]
const dryRun = args.includes("--dry-run")

if (!slug) {
  console.error("❌ Falta --slug=<slug>")
  process.exit(1)
}

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || "meisa-web-prod-2025"
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "meisa-imagenes"

async function main() {
  const medias = await prisma.media.findMany({
    where: {
      tags: { has: `proyecto:${slug}` },
      folder: `upscaled/${slug}`,
    },
    orderBy: { createdAt: "desc" },
  })

  console.log(`\n🔍 Media items del proyecto ${slug}: ${medias.length}`)
  if (medias.length === 0) {
    console.log("Nada que limpiar.")
    await prisma.$disconnect()
    return
  }

  // Key = fileName + tag modelo (para distinguir bria/esrgan/imagen por filename)
  const keyOf = (m: (typeof medias)[number]): string => {
    const modelTag =
      m.tags.find((t) => t.endsWith("-4x") && t !== "ai:upscale") ?? "unknown"
    return `${modelTag}::${m.fileName}`
  }

  const byKey = new Map<string, typeof medias>()
  for (const m of medias) {
    const k = keyOf(m)
    if (!byKey.has(k)) byKey.set(k, [])
    byKey.get(k)!.push(m)
  }

  const toDelete: typeof medias = []
  for (const [k, group] of byKey) {
    if (group.length <= 1) continue
    // group ya viene ordenado por createdAt desc → [0] es el más nuevo, el resto borrar
    const keep = group[0]
    const deletes = group.slice(1)
    console.log(`\n· ${k}`)
    console.log(`    keep:   ${keep.pathGcs} (${keep.createdAt.toISOString().slice(0, 19)})`)
    for (const d of deletes) {
      console.log(`    delete: ${d.pathGcs} (${d.createdAt.toISOString().slice(0, 19)})`)
      toDelete.push(d)
    }
  }

  console.log(`\n📊 Resumen:`)
  console.log(`  Keys únicas: ${byKey.size}`)
  console.log(`  A borrar: ${toDelete.length}`)

  if (dryRun || toDelete.length === 0) {
    console.log(`\n${dryRun ? "DRY-RUN" : "Nada que borrar"} — sin cambios.`)
    await prisma.$disconnect()
    return
  }

  const storage = new Storage({ projectId: GCS_PROJECT_ID })
  const bucket = storage.bucket(GCS_BUCKET_NAME)

  console.log(`\n🗑️  Borrando ${toDelete.length} items...`)
  for (const d of toDelete) {
    try {
      if (d.pathGcs) {
        await bucket.file(d.pathGcs).delete({ ignoreNotFound: true })
      }
      await prisma.media.delete({ where: { id: d.id } })
      console.log(`  ✅ ${d.pathGcs}`)
    } catch (e) {
      console.error(`  ❌ ${d.pathGcs}:`, (e as Error).message)
    }
  }

  console.log(`\n✨ Listo.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
