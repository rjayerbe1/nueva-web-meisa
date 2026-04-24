import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { prisma } from "../lib/prisma"

async function main() {
  const all = await prisma.imagenProyecto.findMany({ select: { url: true } })
  const local = all.filter((i) => i.url.startsWith("/")).length
  const gcs = all.filter((i) => i.url.includes("storage.googleapis.com")).length
  const other = all.length - local - gcs

  console.log(`\n📊 Estado ImagenProyecto URLs:`)
  console.log(`   Total:    ${all.length}`)
  console.log(`   GCS:      ${gcs} (${((gcs / all.length) * 100).toFixed(1)}%)`)
  console.log(`   Local:    ${local} (${((local / all.length) * 100).toFixed(1)}%)`)
  console.log(`   Otros:    ${other}`)

  // Samples
  const stillLocal = await prisma.imagenProyecto.findMany({
    where: { url: { startsWith: "/" } },
    select: { url: true, proyecto: { select: { titulo: true, slug: true } } },
    take: 15,
  })
  if (stillLocal.length > 0) {
    console.log(`\n⚠️  Primeras ${stillLocal.length} filas aún locales:`)
    for (const r of stillLocal) {
      console.log(`   ${r.proyecto.slug}: ${r.url.split("/").pop()?.slice(0, 60)}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
