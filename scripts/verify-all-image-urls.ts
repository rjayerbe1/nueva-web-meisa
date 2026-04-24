import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { prisma } from "../lib/prisma"

function bucketize(url: string): "gcs" | "local" | "remote-other" | "empty" {
  if (!url) return "empty"
  if (url.includes("storage.googleapis.com/meisa-imagenes")) return "gcs"
  if (url.startsWith("/")) return "local"
  if (url.startsWith("http")) return "remote-other"
  return "empty"
}

async function check(
  label: string,
  urls: (string | null | undefined)[],
) {
  const buckets = { gcs: 0, local: 0, "remote-other": 0, empty: 0 }
  const localSamples: string[] = []
  for (const u of urls) {
    if (!u) {
      buckets.empty++
      continue
    }
    const b = bucketize(u)
    buckets[b]++
    if (b === "local" && localSamples.length < 3) localSamples.push(u)
  }
  const total = urls.filter((u) => u).length
  if (total === 0) return
  console.log(`\n📦 ${label} (${total} con URL):`)
  console.log(`   GCS:          ${buckets.gcs}`)
  console.log(`   Local:        ${buckets.local}`)
  console.log(`   Remote otro:  ${buckets["remote-other"]}`)
  if (localSamples.length) {
    console.log(`   Samples local:`)
    for (const s of localSamples) console.log(`     · ${s.slice(0, 80)}`)
  }
}

async function main() {
  const imagenes = await prisma.imagenProyecto.findMany({ select: { url: true } })
  await check("ImagenProyecto.url", imagenes.map((i) => i.url))

  const categorias = await prisma.categoriaProyecto.findMany({
    select: { imagenCover: true },
  })
  await check("CategoriaProyecto.imagenCover", categorias.map((c) => c.imagenCover))

  const servicios = await prisma.servicio.findMany({ select: { imagen: true } })
  await check("Servicio.imagen", servicios.map((s) => s.imagen))

  const plantas = await prisma.plant.findMany({ select: { imagen: true } })
  await check("Plant.imagen", plantas.map((p) => p.imagen))

  const valores = await prisma.companyValue.findMany({ select: { imagen: true } })
  await check("CompanyValue.imagen", valores.map((v) => v.imagen))

  const equipos = await prisma.equipo.findMany({ select: { imagen: true } })
  await check("Equipo.imagen", equipos.map((e) => e.imagen))

  const tecs = await prisma.tecnologia.findMany({ select: { imagen: true } })
  await check("Tecnologia.imagen", tecs.map((t) => t.imagen))

  const politicas = await prisma.politica.findMany({ select: { imagen: true } })
  await check("Politica.imagen", politicas.map((p) => p.imagen))

  const procFases = await prisma.procesoFase.findMany({
    select: { imagen: true },
  })
  await check("ProcesoFase.imagen", procFases.map((p) => p.imagen))

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
