/**
 * Armado del informe de evaluación de una vacante (HTML listo para imprimir).
 *
 * Fuente ÚNICA del diseño: lo usan tanto `scripts/informe-vacantes.ts` (que lo
 * pasa por Chrome headless en la máquina local) como la ruta del admin
 * `/api/admin/talento/informe/[vacanteId]` (que lo sirve al navegador para que
 * Talento Humano lo guarde como PDF sin depender de nadie). Si el diseño se
 * toca, se toca acá y cambia en los dos lados.
 */

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export const CORTE = 75 // mismo umbral que la etiqueta "Recomendado"

export const CSS = `
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

export type Criterio = { nombre: string; peso: number; guia?: string }
export type CritEval = { nombre: string; peso: number; puntaje: number; valoracion: string; justificacion: string }
export type Cand = {
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

function concepto(s: number | null) {
  if (s == null) return '<span class="pill pill-c">Sin evaluar</span>'
  if (s >= 75) return '<span class="pill pill-a">Recomendado</span>'
  if (s >= 55) return '<span class="pill pill-b">Considerar</span>'
  return '<span class="pill pill-c">No cumple perfil</span>'
}

/** URL pública del logo a color, para el informe servido desde la web. */
export const LOGO_URL = "https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"

export function armarHtml(
  vacante: string,
  ciudad: string | null,
  fecha: string,
  criterios: Criterio[],
  cands: Cand[],
  opciones: {
    /** Ruta o URL del logo. Local: "logo-meisa.webp" junto al HTML. Web: LOGO_URL. */
    logo?: string
    /** Abre el diálogo de impresión al cargar (para el informe servido en el admin). */
    autoImprimir?: boolean
  } = {},
) {
  const logo = opciones.logo ?? "logo-meisa.webp"
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
      `<td class="num">${c.score ?? "—"}</td><td class="num">${c.score == null ? "—" : (c.score / 10).toFixed(1)}</td>` +
      `<td>${concepto(c.score)}</td></tr>`)
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

  const extra = opciones.autoImprimir
    ? `<style>@media screen{body{background:#f1f5f9;padding:1.5rem}
         table.page-wrap{background:#fff;max-width:8.5in;margin:0 auto;padding:1.3cm 1.5cm;box-shadow:0 1px 4px rgba(0,0,0,.15)}
         .aviso{max-width:8.5in;margin:0 auto 1rem;background:#16294d;color:#fff;padding:.7rem 1rem;font:600 13px/1.4 Helvetica,Arial,sans-serif;border-radius:2px}
         .aviso b{color:#fff}}
       @media print{.aviso{display:none}}</style>
       <div class="aviso">Se abrirá el diálogo de impresión. Elige <b>Guardar como PDF</b> · destino <b>Carta</b>, márgenes <b>predeterminados</b> y activa <b>Gráficos de fondo</b> para que se vea el membrete.</div>
       <script>window.addEventListener("load", () => setTimeout(() => window.print(), 700))</script>`
    : ""

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación — ${esc(vacante)}</title><style>${CSS}</style>${extra}</head><body>
<table class="page-wrap">
  <thead><tr><td><div class="rhead"><img src="${logo}" alt="MEISA">
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

