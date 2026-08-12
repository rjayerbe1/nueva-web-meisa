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

const SKILL = path.join(process.cwd(), ".claude/skills/meisa-pdf-local")
const CORTE = 75 // mismo umbral que la etiqueta "Recomendado"

function arg(n: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`))
  return hit ? hit.split("=").slice(1).join("=") : undefined
}
const flag = (n: string) => process.argv.includes(`--${n}`)

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Nombre de archivo seguro en macOS/Windows. */
const safe = (s: string) => s.replace(/[/\\:*?"<>|]/g, "-").replace(/\s+/g, " ").trim()

const CSS = `
  @page { size: Letter; margin: 1.3cm 1.5cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1f2933; font-size: 9.5pt; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  table.page-wrap { width: 100%; border-collapse: collapse; }
  .page-wrap > thead { display: table-header-group; }
  .page-wrap > tfoot { display: table-footer-group; }
  .page-wrap > thead td, .page-wrap > tfoot td, .page-wrap > tbody td { padding: 0; }
  .rhead { display: flex; align-items: center; justify-content: space-between; padding-bottom: .45rem; }
  .rhead img { height: 38px; width: auto; }
  .rhead .meta { text-align: right; font-size: 7pt; color: #64748b; line-height: 1.4; }
  .rhead .meta b { color: #16294d; }
  .rhead-rule { height: 2.5px; background: #16294d; position: relative; margin-bottom: .9rem; }
  .rhead-rule::after { content: ""; position: absolute; left: 0; top: 0; height: 2.5px; width: 90px; background: #be1622; }
  .rfoot { border-top: 1px solid #e2e8f0; margin-top: .7rem; padding-top: .35rem; font-size: 7pt; color: #94a3b8; display: flex; justify-content: space-between; }
  body.numbered .rfoot { display: none; }
  .kicker { font-size: 8pt; letter-spacing: 3px; text-transform: uppercase; color: #be1622; font-weight: 700; }
  .title { font-size: 17pt; font-weight: 800; color: #16294d; margin-top: .1rem; line-height: 1.15; }
  .sub { color: #64748b; font-size: 9pt; margin-top: .25rem; }
  h2 { font-size: 10pt; color: #16294d; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 800; margin: 1rem 0 .5rem 0; padding-bottom: .28rem; border-bottom: 1.5px solid #e2e8f0; break-after: avoid; }
  p { text-align: justify; margin-bottom: .55rem; }
  p b, li b { color: #16294d; }
  .intro { border-left: 3px solid #be1622; padding-left: .8rem; margin: .6rem 0 .2rem 0; }
  table.data { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  table.data thead { display: table-header-group; }
  table.data th { background: #16294d; color: #fff; text-align: left; padding: .38rem .55rem; font-weight: 700; font-size: 8pt; }
  table.data th.num, table.data td.num { text-align: right; }
  table.data td { padding: .34rem .55rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  table.data tbody tr:nth-child(even) { background: #f6f8fb; }
  table.data tr { break-inside: avoid; }
  td.guia, p.guia { color: #64748b; font-size: 7.8pt; }
  table.mini th { font-size: 7.5pt; }
  table.mini td { font-size: 7.8pt; padding: .26rem .5rem; }
  .pill { display: inline-block; padding: .05rem .4rem; font-size: 7.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
  .pill-a { background: #dcfce7; color: #15803d; }
  .pill-b { background: #fef3c7; color: #b45309; }
  .pill-c { background: #f1f5f9; color: #64748b; }
  .chart text { font-family: Helvetica, Arial, sans-serif; }
  .chart .cat { font-size: 9px; fill: #334155; }
  .chart .val { font-size: 9px; fill: #16294d; font-weight: 700; }
  .bar { fill: #16294d; } .bar.alt { fill: #be1622; }
  .ficha { break-inside: avoid; margin-bottom: .7rem; border: 1px solid #e2e8f0; padding: .45rem .6rem; }
  .fh { display: flex; align-items: baseline; gap: .5rem; border-bottom: 1.5px solid #16294d; padding-bottom: .25rem; margin-bottom: .3rem; }
  .fpos { background: #16294d; color: #fff; font-weight: 800; font-size: 8pt; padding: .1rem .38rem; }
  .fnom { font-weight: 800; color: #16294d; font-size: 10.5pt; flex: 1; }
  .fsc { font-weight: 800; color: #be1622; font-size: 13pt; }
  .fsc small { font-size: 7.5pt; color: #94a3b8; font-weight: 600; }
  .fmeta { color: #64748b; font-size: 7.8pt; margin-bottom: .4rem; }
  .blk { margin-top: .28rem; font-size: 7.9pt; }
  .blk-t { font-weight: 700; font-size: 7.4pt; text-transform: uppercase; letter-spacing: .6px; }
  .blk.ok .blk-t { color: #15803d; } .blk.gap .blk-t { color: #b45309; } .blk.val .blk-t { color: #16294d; }
  .blk ul { list-style: none; margin-top: .1rem; }
  .blk li { position: relative; padding-left: .8rem; margin-bottom: .08rem; text-align: justify; }
  .blk li::before { content: ""; position: absolute; left: 0; top: .3rem; width: 5px; height: 5px; transform: rotate(45deg); background: #cbd5e1; }
  .blk.ok li::before { background: #22c55e; } .blk.gap li::before { background: #f59e0b; } .blk.val li::before { background: #16294d; }
  .reco { margin-top: .32rem; font-size: 7.9pt; background: #f6f8fb; padding: .3rem .45rem; text-align: justify; }
  .nota { font-size: 7.8pt; color: #64748b; background: #f6f8fb; border-left: 3px solid #16294d; padding: .45rem .6rem; margin-top: .5rem; text-align: justify; }
  .page-break { break-before: page; }
  table.matriz th.rot { font-size: 7pt; line-height: 1.15; }
  table.matriz th.rot small { font-weight: 400; opacity: .75; }
  table.matriz td { font-size: 8pt; }
  table.matriz td.lo { color: #be1622; font-weight: 700; }
  table.matriz td.tot { font-weight: 800; color: #16294d; background: #eef2f7; }
  table.matriz tr.motivo td { font-size: 7.6pt; color: #64748b; padding-top: 0; padding-bottom: .4rem; border-bottom: 1.5px solid #cbd5e1; text-align: justify; }
  table.matriz tbody tr:nth-child(even) { background: transparent; }
  table.matriz tbody { break-inside: avoid; }
`

type Criterio = { nombre: string; peso: number; guia?: string }
type CritEval = { nombre: string; peso: number; puntaje: number; valoracion: string; justificacion: string }
type Cand = {
  nombre: string
  ciudad: string | null
  recibido: string
  score: number | null
  anos: number | null
  cvPathGcs: string | null
  cvFileName: string | null
  match: {
    criterios?: CritEval[]
    fortalezas?: string[]
    brechas?: string[]
    porValidar?: string[]
    recomendacion?: string
  } | null
}

function concepto(s: number) {
  if (s >= 75) return '<span class="pill pill-a">Recomendado</span>'
  if (s >= 55) return '<span class="pill pill-b">Considerar</span>'
  return '<span class="pill pill-c">No cumple perfil</span>'
}

function armarHtml(vacante: string, ciudad: string | null, fecha: string, criterios: Criterio[], cands: Cand[]) {
  const BW = 300, RH = 16, GUT = 195
  const alto = cands.length * RH + 8
  const svg =
    `<svg class="chart" viewBox="0 0 ${GUT + BW + 40} ${alto}" width="100%" height="${alto}">` +
    cands
      .map((c, i) => {
        const y = i * RH, w = ((c.score ?? 0) / 100) * BW
        const cls = (c.score ?? 0) >= CORTE ? "bar" : "bar alt"
        const nom = c.nombre.length <= 30 ? c.nombre : c.nombre.slice(0, 29) + "…"
        return `<text class="cat" x="${GUT - 6}" y="${y + 11}" text-anchor="end">${esc(nom)}</text>` +
          `<rect class="${cls}" x="${GUT}" y="${y + 2}" width="${w.toFixed(1)}" height="10"/>` +
          `<text class="val" x="${(GUT + w + 5).toFixed(1)}" y="${y + 11}">${c.score}</text>`
      })
      .join("") + "</svg>"

  const filCrit = criterios
    .map((c) => `<tr><td>${esc(c.nombre)}</td><td class="num">${c.peso}%</td><td class="guia">${esc(c.guia)}</td></tr>`)
    .join("")

  const filRank = cands
    .map((c, i) =>
      `<tr><td class="num">${i + 1}</td><td><b>${esc(c.nombre)}</b></td><td>${esc(c.ciudad)}</td>` +
      `<td class="num">${c.score}</td><td class="num">${((c.score ?? 0) / 10).toFixed(1)}</td>` +
      `<td>${concepto(c.score ?? 0)}</td></tr>`)
    .join("")

  const top = cands.filter((c) => (c.score ?? 0) >= CORTE)
  const resto = cands.filter((c) => (c.score ?? 0) < CORTE)

  const lista = (t: string, items: string[] | undefined, cls: string) =>
    !items?.length ? "" :
      `<div class="blk ${cls}"><span class="blk-t">${t}</span><ul>` +
      items.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul></div>"

  const fichas = top
    .map((c, i) => {
      const filas = (c.match?.criterios ?? [])
        .map((k) => `<tr><td>${esc(k.nombre)}</td><td class="num">${k.peso}%</td><td class="num">${k.puntaje}</td>` +
          `<td>${esc(k.valoracion)}</td><td class="guia">${esc(k.justificacion)}</td></tr>`)
        .join("")
      return `<div class="ficha">
        <div class="fh"><span class="fpos">${i + 1}</span><span class="fnom">${esc(c.nombre)}</span>
          <span class="fsc">${c.score}<small>/100</small></span></div>
        <div class="fmeta">${esc(c.ciudad)} · recibida el ${esc(c.recibido)}${c.anos ? ` · ${c.anos} años de experiencia` : ""}</div>
        <table class="data mini"><thead><tr><th>Criterio</th><th class="num">Peso</th><th class="num">Punt.</th>
          <th>Valoración</th><th>Sustento en la hoja de vida</th></tr></thead><tbody>${filas}</tbody></table>
        ${lista("Fortalezas", c.match?.fortalezas, "ok")}
        ${lista("Brechas", c.match?.brechas, "gap")}
        ${lista("Por validar en entrevista o prueba", c.match?.porValidar, "val")}
        <p class="reco"><b>Recomendación:</b> ${esc(c.match?.recomendacion)}</p></div>`
    })
    .join("")

  const cab = criterios
    .map((c) => {
      const corto = c.nombre.length > 14 ? c.nombre.split(" ")[0] : c.nombre
      return `<th class="num rot">${esc(corto)}<br><small>${c.peso}%</small></th>`
    })
    .join("")

  const filResto = resto
    .map((c) => {
      const porc = new Map((c.match?.criterios ?? []).map((k) => [k.nombre, k.puntaje]))
      const celdas = criterios
        .map((k) => {
          const p = porc.get(k.nombre)
          return `<td class="num ${p != null && p < 50 ? "lo" : ""}">${p ?? "—"}</td>`
        })
        .join("")
      return `<tbody><tr><td><b>${esc(c.nombre)}</b><br><small class="guia">${esc(c.ciudad)}</small></td>` +
        `${celdas}<td class="num tot">${c.score}</td></tr>` +
        `<tr class="motivo"><td colspan="${criterios.length + 2}">${esc(c.match?.recomendacion)}</td></tr></tbody>`
    })
    .join("")

  const bloqueResto = resto.length
    ? `<h2>Resto de candidatos evaluados</h2>
       <p class="guia" style="margin-bottom:.5rem">Los ${resto.length} restantes, con su puntaje en cada criterio de la matriz. En rojo, los criterios por debajo de 50.</p>
       <table class="data matriz"><thead><tr><th>Candidato</th>${cab}<th class="num">Total</th></tr></thead>${filResto}</table>`
    : ""

  const bloqueTop = top.length
    ? `<div class="page-break"></div>
       <h2>Fichas de los candidatos recomendados</h2>
       <p class="guia" style="margin-bottom:.5rem">Detalle criterio por criterio de los ${top.length} candidatos que superan el umbral de recomendación.</p>
       ${fichas}`
    : `<div class="nota"><b>Ningún candidato supera el umbral de recomendación (${CORTE}/100).</b> Revisar la
       matriz por si está mal calibrada para este cargo, o abrir canales de reclutamiento adicionales
       (SENA APE, cajas de compensación, Computrabajo) — la web sola puede no traer el perfil requerido.</div>`

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
<table class="page-wrap">
  <thead><tr><td><div class="rhead"><img src="logo-meisa.webp" alt="MEISA">
    <div class="meta"><b>METÁLICAS E INGENIERÍA S.A.S.</b><br>NIT 817.000.639-1<br>Jamundí &amp; Popayán</div></div>
    <div class="rhead-rule"></div></td></tr></thead>
  <tfoot><tr><td><div class="rfoot"><span>METÁLICAS E INGENIERÍA S.A.S. · Documento interno de selección</span>
    <span>Uso restringido — datos personales Ley 1581/2012</span></div></td></tr></tfoot>
  <tbody><tr><td>
  <div class="kicker">Talento Humano · Evaluación preliminar</div>
  <div class="title">${esc(vacante)}</div>
  <div class="sub">Comparativo de ${cands.length} candidatos · Corte ${esc(fecha)}${ciudad ? ` · Planta ${esc(ciudad)}` : ""}</div>
  <div class="intro">
    <p>Este informe compara las hojas de vida recibidas para el cargo de <b>${esc(vacante)}</b> contra la
    <b>matriz de evaluación definida por la jefatura del área</b>. Cada criterio se califica de 0 a 100 según
    la evidencia que aporta la hoja de vida, y el puntaje final es el <b>promedio ponderado</b> por los pesos
    de la matriz.</p>
    <p>El resultado es una <b>preselección sugerida, no un veredicto</b>: la calificación solo mide lo que el
    candidato logró demostrar por escrito. La decisión es del comité, y cada ficha señala qué debe verificarse
    en entrevista técnica y prueba práctica.</p>
  </div>
  <h2>Matriz de evaluación del cargo</h2>
  <table class="data"><thead><tr><th>Criterio</th><th class="num">Peso</th><th>Qué se evalúa</th></tr></thead>
    <tbody>${filCrit}</tbody></table>
  <h2>Resultado del comparativo</h2>
  <table class="data"><thead><tr><th class="num">#</th><th>Candidato</th><th>Ciudad</th>
    <th class="num">Puntaje</th><th class="num">Sobre 10</th><th>Concepto</th></tr></thead><tbody>${filRank}</tbody></table>
  <h2>Distribución de puntajes</h2>
  ${svg}
  <div class="nota"><b>Cómo leer este informe.</b> La inteligencia artificial puntúa cada criterio citando la
  evidencia hallada en la hoja de vida, y el ponderado lo calcula el sistema. Es deliberadamente
  <b>conservadora</b>: si un candidato menciona una herramienta pero no demuestra su uso, el criterio baja y
  se traslada a "por validar". Por eso un puntaje medio no descarta a nadie — indica qué falta comprobar.
  No se consideran edad, sexo, estado civil ni origen (Ley 931 de 2004).</div>
  ${bloqueTop}
  ${bloqueResto}
  </td></tr></tbody></table></body></html>`
}

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

    const ps = await prisma.postulacion.findMany({
      where: { vacanteId: v.id },
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
      where: { vacanteId: v.id },
      include: {
        candidato: {
          select: { nombre: true, ciudad: true, createdAt: true, datosIA: true, cvPathGcs: true, cvFileName: true },
        },
      },
      orderBy: { scoreIA: "desc" },
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
        const nom = `${String(i + 1).padStart(2, "0")} - ${String(c.score ?? 0).padStart(2, "0")}pts - ${safe(c.nombre)}${ext}`
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
