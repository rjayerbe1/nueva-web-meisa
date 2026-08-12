/**
 * Genera, para CADA vacante abierta, una carpeta lista para pasarle al jefe del
 * área: el informe PDF de evaluación con membrete MEISA + las hojas de vida de
 * los candidatos, renombradas con su puesto y puntaje.
 *
 * Vive en el repo (no en el scratchpad, que se borra entre sesiones) porque esto
 * se corre cada vez que entran candidatos nuevos.
 *
 * Uso:
 *   npx tsx scripts/informe-vacantes.ts
 *   npx tsx scripts/informe-vacantes.ts --vacante="Proyectista"
 *   npx tsx scripts/informe-vacantes.ts --sin-evaluar        # no re-evalúa, solo re-arma
 *   npx tsx scripts/informe-vacantes.ts --salida=~/Downloads/otra-carpeta
 *
 * Requiere el skill meisa-pdf-local instalado en .claude/skills/ (ya lo está).
 *
 * OJO habeas data: esto EXPORTA hojas de vida (datos personales) a una carpeta
 * local. Es uso legítimo para el proceso de selección, pero la carpeta no debe
 * salir de la empresa ni subirse a servicios personales.
 */
import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env.local" })

import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { execFileSync } from "node:child_process"
import { Prisma } from "@prisma/client"
import { armarHtml, CORTE, type Cand } from "../lib/talento/informe"

const SKILL = path.join(process.cwd(), ".claude/skills/meisa-pdf-local")

function arg(n: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`))
  return hit ? hit.split("=").slice(1).join("=") : undefined
}
const flag = (n: string) => process.argv.includes(`--${n}`)

/** Nombre de archivo seguro en macOS/Windows. */
const safe = (s: string) => s.replace(/[/\\:*?"<>|]/g, "-").replace(/\s+/g, " ").trim()

async function main() {
  const { prisma } = await import("../lib/prisma")
  const { leerCriterios, evaluarMatch } = await import("../lib/talento/ia")
  const { analizarPendientes } = await import("../lib/talento/drive-sync")
  const { downloadCv } = await import("../lib/talento/gcs-hv")

  const hoy = new Date()
  const iso = hoy.toISOString().slice(0, 10)
  const fechaLarga = hoy.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })

  const raizArg = arg("salida")
  const raiz = raizArg
    ? raizArg.replace(/^~/, os.homedir())
    : path.join(os.homedir(), "Downloads", `Seleccion-MEISA-${iso}`)
  fs.mkdirSync(raiz, { recursive: true })

  const filtro = arg("vacante")
  const vacantes = await prisma.vacante.findMany({
    where: { estado: "ABIERTA", ...(filtro ? { titulo: filtro } : {}) },
    orderBy: { titulo: "asc" },
  })
  if (!vacantes.length) {
    console.error(`No hay vacantes ABIERTAS${filtro ? ` con título "${filtro}"` : ""}`)
    process.exit(1)
  }

  if (!flag("sin-evaluar")) {
    const pend = await prisma.candidato.count({
      where: { datosIA: { equals: Prisma.DbNull }, cvPathGcs: { not: null } },
    })
    if (pend) {
      console.log(`Analizando ${pend} hojas de vida sin procesar…`)
      const h = await analizarPendientes(pend)
      console.log(`  analizadas: ${h.length}\n`)
    }
  }

  const resumen: string[] = []

  for (const v of vacantes) {
    const criterios = leerCriterios(v.criteriosEvaluacion)
    if (!criterios.length) {
      console.log(`⚠ ${v.titulo}: SIN matriz de evaluación — se omite. Definirla en /admin/talento.`)
      resumen.push(`${v.titulo}: omitida (sin matriz)`)
      continue
    }

    // Los DESCARTADA quedan fuera del informe — su registro sigue en el admin
    // con el motivo en notasInternas, pero no le hacen perder tiempo al jefe.
    const ps = await prisma.postulacion.findMany({
      where: { vacanteId: v.id, etapa: { not: "DESCARTADA" } },
      include: {
        candidato: {
          select: { nombre: true, ciudad: true, createdAt: true, datosIA: true, cvPathGcs: true, cvFileName: true },
        },
      },
    })

    if (!flag("sin-evaluar")) {
      process.stdout.write(`Evaluando ${v.titulo} (${ps.length})… `)
      for (const p of ps) {
        if (!p.candidato.datosIA) continue
        try { await evaluarMatch(p.id) } catch { /* se reporta abajo como score vacío */ }
      }
      console.log("ok")
    }

    const frescas = await prisma.postulacion.findMany({
      where: { vacanteId: v.id, etapa: { not: "DESCARTADA" } },
      include: {
        candidato: {
          select: { nombre: true, ciudad: true, createdAt: true, datosIA: true, cvPathGcs: true, cvFileName: true },
        },
      },
      // NULLS LAST: sin esto Postgres pone los sin-puntaje de PRIMEROS en DESC
      // y en el informe parecen los mejores candidatos.
      orderBy: { scoreIA: { sort: "desc", nulls: "last" } },
    })

    const cands: Cand[] = frescas.map((p) => ({
      nombre: p.candidato.nombre,
      ciudad: p.candidato.ciudad,
      recibido: new Date(p.candidato.createdAt.getTime() - 5 * 3600e3).toISOString().slice(0, 10),
      score: p.scoreIA,
      anos: (p.candidato.datosIA as { anosExperiencia?: number } | null)?.anosExperiencia ?? null,
      cvPathGcs: p.candidato.cvPathGcs,
      cvFileName: p.candidato.cvFileName,
      match: p.matchIA as Cand["match"],
    }))

    const dir = path.join(raiz, safe(v.titulo))
    const dirCv = path.join(dir, "Hojas de vida")
    fs.mkdirSync(dirCv, { recursive: true })

    // ── informe PDF ──
    const html = armarHtml(v.titulo, v.ciudad, fechaLarga, criterios, cands)
    const htmlPath = path.join(dir, "_informe.html")
    fs.writeFileSync(htmlPath, html)
    fs.copyFileSync(path.join(SKILL, "assets/logo-meisa.webp"), path.join(dir, "logo-meisa.webp"))
    const pdf = path.join(dir, `Evaluacion-${safe(v.titulo)}-${iso}.pdf`)
    execFileSync("node", [path.join(SKILL, "generar-pdf-puppeteer.cjs"), htmlPath, pdf, "--numeros"], {
      stdio: "inherit",
    })
    // Se limpian los insumos: la carpeta va al jefe del área, no al taller.
    fs.rmSync(htmlPath); fs.rmSync(path.join(dir, "logo-meisa.webp"))

    // ── hojas de vida, renombradas con puesto y puntaje ──
    let bajadas = 0
    for (const [i, c] of cands.entries()) {
      if (!c.cvPathGcs) continue
      try {
        const buf = await downloadCv(c.cvPathGcs)
        const ext = path.extname(c.cvFileName ?? "").toLowerCase() || ".pdf"
        const puntos = c.score == null ? "sin evaluar" : `${String(c.score).padStart(2, "0")}pts`
        const nom = `${String(i + 1).padStart(2, "0")} - ${puntos} - ${safe(c.nombre)}${ext}`
        fs.writeFileSync(path.join(dirCv, nom), buf)
        bajadas++
      } catch (e) {
        console.error(`   ✗ CV de ${c.nombre}: ${(e as Error).message.slice(0, 80)}`)
      }
    }

    const rec = cands.filter((c) => (c.score ?? 0) >= CORTE).length
    console.log(`   → ${path.basename(dir)}: informe + ${bajadas} hojas de vida · ${rec} recomendados\n`)
    resumen.push(`${v.titulo}: ${cands.length} candidatos, ${rec} recomendados, ${bajadas} CV`)
  }

  // ── índice para el que abra la carpeta ──
  fs.writeFileSync(
    path.join(raiz, "LEEME.txt"),
    [
      `SELECCIÓN MEISA — corte ${fechaLarga}`,
      ``,
      `Una carpeta por vacante abierta. Dentro de cada una:`,
      `  · Evaluacion-<cargo>-${iso}.pdf   informe con la matriz del cargo y el ranking`,
      `  · Hojas de vida/                  los CV, nombrados "puesto - puntaje - nombre"`,
      ``,
      ...resumen.map((r) => `  ${r}`),
      ``,
      `El puntaje es una PRESELECCIÓN SUGERIDA, no un veredicto: mide solo lo que el`,
      `candidato demostró por escrito. Cada ficha señala qué validar en entrevista.`,
      `No se consideran edad, sexo, estado civil ni origen (Ley 931 de 2004).`,
      ``,
      `USO RESTRINGIDO: contiene datos personales (Ley 1581 de 2012). No sacar de la`,
      `empresa ni subir a servicios personales.`,
      ``,
      `Regenerar: npx tsx scripts/informe-vacantes.ts`,
    ].join("\n"),
  )

  console.log(`\n✅ Carpeta lista: ${raiz}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("FALLO:", e)
  process.exit(1)
})
