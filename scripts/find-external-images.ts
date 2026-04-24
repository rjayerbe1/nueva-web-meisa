/**
 * Busca imágenes en carpetas externas (wordpress-ftp-backup, IMAGENES STOCK BROCHURE,
 * archived-outros-images, meisa-web-v2/public) que coincidan con proyectos MEISA
 * en DB que no tengan imágenes.
 *
 * Estrategia:
 *   1. Extraer tokens significativos de slug + titulo + cliente + ubicacion
 *   2. Cruzar con el índice /tmp/all-imgs-index.txt
 *   3. Matchear por presencia de tokens rarios (≥2 o 1 muy único)
 *   4. Agrupar y rankear por # de tokens matcheados
 *
 * Uso:
 *   npx tsx scripts/find-external-images.ts > /tmp/matches.txt
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env" })
loadEnv({ path: ".env.local", override: true })
import { readFileSync } from "node:fs"
import { prisma } from "../lib/prisma"

// Tokens genéricos que NO suman al score (aparecen en muchos proyectos)
const STOPWORDS = new Set([
  "centro",
  "comercial",
  "puente",
  "vehicular",
  "peatonal",
  "cubierta",
  "cubiertas",
  "coliseo",
  "escenario",
  "escenarios",
  "deportivo",
  "edificio",
  "estructura",
  "estructuras",
  "metalica",
  "metalicas",
  "industrial",
  "popayan",
  "pereira",
  "cali",
  "valle",
  "cauca",
  "bogota",
  "proyecto",
  "proyectos",
  "colombia",
  "consorcio",
  "unico",
  "2012",
  "2013",
  "ampliacion",
  "etapa",
  "sede",
  "colegio",
  "cancha",
  "construcciones",
  "wp-admin",
  "wp-includes",
  "wp-content",
  "media",
  "images",
  "jpeg",
  "scaled",
])

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t))
}

async function main() {
  const indexRaw = readFileSync("/tmp/all-imgs-index.txt", "utf8")
  const allFiles = indexRaw.split("\n").filter((l) => l.trim().length > 0)

  // Pre-filtrar: sólo archivos que NO son de wp-admin o wp-includes internos
  const candidateFiles = allFiles.filter((f) => {
    const p = f.toLowerCase()
    if (p.includes("wp-admin/")) return false
    if (p.includes("wp-includes/")) return false
    if (p.includes("node_modules/")) return false
    if (p.includes(".next/")) return false
    // filtrar chicas si hay variantes — pero mejor dejarlas todas, la dedup es ad-hoc
    return true
  })

  console.log(`\n📂 Archivos candidatos: ${candidateFiles.length} (de ${allFiles.length})`)

  // Tokenizar cada path una vez
  const fileTokens = new Map<string, Set<string>>()
  for (const f of candidateFiles) {
    fileTokens.set(f, new Set(tokenize(f)))
  }

  const proyectos = await prisma.proyecto.findMany({
    where: { imagenes: { none: {} } },
    select: { slug: true, titulo: true, cliente: true, ubicacion: true, categoria: true },
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  })

  console.log(`🏗️  Proyectos sin imágenes: ${proyectos.length}\n`)

  interface Match {
    file: string
    score: number
    matchedTokens: string[]
  }

  let totalMatches = 0
  const categoryStats = new Map<string, number>()

  for (const p of proyectos) {
    const tokens = Array.from(
      new Set([
        ...tokenize(p.slug),
        ...tokenize(p.titulo),
        ...tokenize(p.cliente),
      ]),
    )
    if (tokens.length === 0) continue

    // Tokens rare: los que aparecen en pocos proyectos (definir después)
    // Por ahora, considerar "raro" si el token es ≥7 chars y no está en STOPWORDS
    const isRare = (t: string) => t.length >= 7

    const matches: Match[] = []
    for (const [file, fTokens] of fileTokens) {
      const matched: string[] = []
      for (const t of tokens) if (fTokens.has(t)) matched.push(t)
      // Requisito: al menos 1 token "raro" (no genérico) match, O ≥3 tokens matches
      const hasRare = matched.some(isRare)
      if (hasRare || matched.length >= 3) {
        matches.push({ file, score: matched.length, matchedTokens: matched })
      }
    }

    if (matches.length === 0) continue

    matches.sort((a, b) => b.score - a.score)

    // Dedup: conservar sólo 1 por baseName (filename sin dim suffix)
    const seen = new Set<string>()
    const dedup: Match[] = []
    for (const m of matches) {
      const name = m.file.split("/").pop() ?? ""
      const base = name
        .replace(/\.(webp|png|jpe?g|gif)$/i, "")
        .replace(/-\d{3,4}x\d{3,4}$/i, "")
        .replace(/-scaled$/i, "")
      if (seen.has(base)) continue
      seen.add(base)
      dedup.push(m)
    }

    const top = dedup.slice(0, 10)
    totalMatches += top.length
    categoryStats.set(
      p.categoria,
      (categoryStats.get(p.categoria) ?? 0) + top.length,
    )

    console.log(`\n═══════════════════════════════════════════════`)
    console.log(`📦 ${p.titulo}`)
    console.log(`   ${p.slug} · ${p.categoria}`)
    console.log(`   tokens: [${tokens.slice(0, 8).join(", ")}]`)
    console.log(`   ${dedup.length} matches (top ${top.length} mostrados):`)
    for (const m of top) {
      console.log(`   [score ${m.score}] ${m.file}`)
      console.log(`     tokens: ${m.matchedTokens.slice(0, 5).join(", ")}`)
    }
  }

  console.log(`\n\n═══════════════════════════════════════════════`)
  console.log(`📊 Total matches (hasta 10 por proyecto): ${totalMatches}`)
  console.log(`   Por categoría:`)
  for (const [cat, count] of Array.from(categoryStats).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${cat}: ${count}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
