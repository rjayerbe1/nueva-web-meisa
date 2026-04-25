/**
 * Recupera los logos de clientes que quedaron rotos tras el commit 7f8a0a7
 * (que borró public/images/clients sin migrar las URLs en DB).
 *
 * - Para cada Cliente con Cliente.logo apuntando a "/images/clients/*", saca el
 *   archivo de git history (7f8a0a7^), lo sube a GCS bajo "clientes/", y actualiza
 *   Cliente.logo con la URL pública.
 * - Idempotente por path: si ya está en GCS no rehace.
 *
 * Uso:
 *   npx tsx scripts/recover-cliente-logos.ts            # dry-run
 *   npx tsx scripts/recover-cliente-logos.ts --commit
 */
import { execFileSync } from "node:child_process"
import { prisma } from "../lib/prisma"
import { uploadToGcs } from "../lib/media/gcs"
import { ensureFolderPath } from "../lib/media/folder-repo"

const SOURCE_COMMIT = "7f8a0a7^"
const REPO_DIR = "/Users/rjayerbe/Web Development Local/meisa.com.co/nueva-web-meisa"
const COMMIT = process.argv.includes("--commit")

function readFromGit(commitPath: string): Buffer | null {
  try {
    return execFileSync("git", ["show", commitPath], {
      cwd: REPO_DIR,
      maxBuffer: 50 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return null
  }
}

function contentTypeFromExt(path: string): string {
  if (path.endsWith(".webp")) return "image/webp"
  if (path.endsWith(".png")) return "image/png"
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg"
  return "application/octet-stream"
}

async function main() {
  console.log(`Mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}\n`)

  const clientes = await prisma.cliente.findMany({
    select: { id: true, nombre: true, logo: true, logoBlanco: true, slug: true },
    orderBy: { orden: "asc" },
  })

  // Two passes: cliente.logo and cliente.logoBlanco
  interface Job {
    clienteId: string
    nombre: string
    field: "logo" | "logoBlanco"
    oldPath: string // "/images/clients/cliente-x.webp"
    fileName: string // "cliente-x.webp"
  }
  const jobs: Job[] = []
  for (const c of clientes) {
    for (const field of ["logo", "logoBlanco"] as const) {
      const url = c[field]
      if (!url) continue
      if (!url.startsWith("/images/clients/")) continue
      jobs.push({
        clienteId: c.id,
        nombre: c.nombre,
        field,
        oldPath: url,
        fileName: url.split("/").pop()!,
      })
    }
  }

  console.log(`Logos rotos a recuperar: ${jobs.length}\n`)

  if (COMMIT) await ensureFolderPath("clientes")

  let recovered = 0
  let missingInGit = 0
  let errors = 0

  for (const job of jobs) {
    const gitPath = `${SOURCE_COMMIT}:public${job.oldPath}` // "7f8a0a7^:public/images/clients/x.webp"
    const buf = readFromGit(gitPath)
    if (!buf) {
      missingInGit++
      console.log(`  ❌ ${job.nombre} (${job.field}) — no encontrado en git: ${gitPath}`)
      continue
    }

    if (!COMMIT) {
      console.log(
        `  · ${job.nombre} (${job.field}) — ${(buf.byteLength / 1024).toFixed(1)}KB — ${job.oldPath}`,
      )
      recovered++
      continue
    }

    try {
      const ct = contentTypeFromExt(job.fileName)
      const up = await uploadToGcs(buf, job.fileName, ct, "clientes")
      await prisma.cliente.update({
        where: { id: job.clienteId },
        data: { [job.field]: up.url },
      })
      // Also register in Media pool (best-effort, ignore conflicts on unique url)
      try {
        await prisma.media.create({
          data: {
            url: up.url,
            pathGcs: up.pathGcs,
            fileName: up.fileName,
            contentType: ct,
            kind: "IMAGE",
            size: up.size,
            folder: "clientes",
            title: `${job.nombre} — logo${job.field === "logoBlanco" ? " blanco" : ""}`,
            tags: ["cliente-logo", `cliente:${job.clienteId}`],
          },
        })
      } catch {
        /* duplicate or other — ignore */
      }
      recovered++
      console.log(`  ✅ ${job.nombre} (${job.field}) → ${up.url}`)
    } catch (e) {
      errors++
      console.error(`  ❌ ${job.nombre} (${job.field}): ${(e as Error).message}`)
    }
  }

  console.log()
  console.log("━".repeat(60))
  console.log(`${COMMIT ? "Recuperados" : "Recuperables"}: ${recovered}`)
  console.log(`No encontrados en git: ${missingInGit}`)
  if (errors) console.log(`Errores: ${errors}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
