/**
 * Reescribe todas las referencias `"/images/..."`, `'/images/...'`, backticks,
 * y `"/videos/..."`, `'/videos/...'` en archivos .ts/.tsx/.js/.jsx del código
 * para que apunten al bucket GCS `site/<resto>`.
 *
 * Salta scripts de uso one-off (scripts/, seed, ts root) y archivos que son
 * snapshots/backups.
 *
 * Uso:
 *   npx tsx scripts/rewrite-local-urls-in-code.ts [--dry-run]
 */
import { readFile, writeFile } from "node:fs/promises"
import { readdir, stat } from "node:fs/promises"
import path from "node:path"

const dryRun = process.argv.includes("--dry-run")
const ROOT = process.cwd()
const GCS_PREFIX = "https://storage.googleapis.com/meisa-imagenes/site"

// Carpetas a procesar
const INCLUDE_DIRS = ["app", "components", "lib"]
// Extensiones a procesar
const EXT = new Set([".ts", ".tsx", ".js", ".jsx"])
// Archivos a saltar (tests, demos, mocks)
const SKIP_FILE_PATTERNS = [/\.d\.ts$/, /\.test\.[tj]sx?$/, /\.spec\.[tj]sx?$/]

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...(await walk(full)))
    else if (EXT.has(path.extname(e.name))) files.push(full)
  }
  return files
}

function rewriteContent(content: string): { out: string; hits: number } {
  let hits = 0

  // Replacement in strings:
  //   "/images/..." → GCS_PREFIX + "/..."
  //   '/images/...' → same
  //   `/images/...` → same (template literal literal content)
  // No reemplazar cuando hay ${...} interpolation que rompa el string;
  // nos limitamos a strings "simples".
  const re = /(["'`])\/(images|videos)\/([^"'`]+)\1/g
  const out = content.replace(re, (_m, q: string, kind: string, rest: string) => {
    hits++
    return `${q}${GCS_PREFIX}/${rest}${q}`
  })

  return { out, hits }
}

async function main() {
  console.log(`\n🔄 Reescritura de URLs locales → GCS`)
  console.log(`   Modo: ${dryRun ? "DRY-RUN" : "LIVE"}\n`)

  const allFiles: string[] = []
  for (const d of INCLUDE_DIRS) {
    try {
      allFiles.push(...(await walk(path.join(ROOT, d))))
    } catch {
      /* may not exist */
    }
  }

  const files = allFiles.filter((f) => !SKIP_FILE_PATTERNS.some((re) => re.test(f)))
  console.log(`📦 Archivos a revisar: ${files.length}\n`)

  let totalHits = 0
  let filesModified = 0
  for (const f of files) {
    const content = await readFile(f, "utf8")
    if (!content.includes('"/images/') && !content.includes("'/images/") &&
        !content.includes("`/images/") &&
        !content.includes('"/videos/') && !content.includes("'/videos/") &&
        !content.includes("`/videos/")) continue

    const { out, hits } = rewriteContent(content)
    if (hits === 0) continue
    totalHits += hits
    filesModified++
    const rel = path.relative(ROOT, f)
    console.log(`  ${dryRun ? "·" : "✓"} ${rel}: ${hits} reemplazos`)
    if (!dryRun) await writeFile(f, out)
  }

  console.log(`\n📊 Total: ${totalHits} reemplazos en ${filesModified} archivos`)
  if (dryRun) console.log(`   (dry-run — ningún archivo modificado)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
