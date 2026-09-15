/**
 * Informe general de Talento Humano: todas las vacantes vigentes y todas las
 * hojas de vida que llegaron en un periodo, en un solo documento imprimible.
 *
 * Complementa el informe por vacante (`informe.ts`), que es el que va al jefe
 * del área con la evaluación candidato por candidato. Este es el tablero para
 * Talento Humano y la gerencia: cuánto llegó, por dónde, a qué cargo, en qué
 * etapa va cada proceso y qué está pendiente (SPE, matrices, postulaciones
 * quietas, hojas de vida sin clasificar).
 *
 * Mismo membrete y CSS base que el informe por vacante (`envolver`).
 */
import { prisma } from "@/lib/prisma"
import { leerCriterios } from "./ia"
import { concepto, CORTE, envolver, esc } from "./informe"

const TZ = "America/Bogota"

const ETAPAS = [
  ["RECIBIDA", "Recib."],
  ["PRESELECCION", "Presel."],
  ["ENTREVISTA", "Entrev."],
  ["OFERTA", "Oferta"],
  ["CONTRATADA", "Contrat."],
  ["DESCARTADA", "Desc."],
] as const

const ETAPA_LARGA: Record<string, string> = {
  RECIBIDA: "Recibida",
  PRESELECCION: "Preselección",
  ENTREVISTA: "Entrevista",
  OFERTA: "Oferta",
  CONTRATADA: "Contratada",
  DESCARTADA: "Descartada",
}

const ORIGEN: Record<string, string> = {
  web: "Página web",
  drive: "Drive de TH",
  computrabajo: "Computrabajo",
  magneto: "Magneto",
  elempleo: "elempleo",
  linkedin: "LinkedIn",
  spe: "SPE (SENA / caja)",
  referido: "Referido",
  email: "Correo",
  whatsapp: "WhatsApp",
  fisico: "Entrega física",
  otro: "Otro / carga histórica",
}

/** Días sin moverse de "Recibida" a partir de los cuales se marca como pendiente. */
export const DIAS_QUIETA = 15

/** Periodos que ofrece el admin. 0 = todo el histórico. */
export const PERIODOS = [7, 30, 90, 0] as const

export function etiquetaPeriodo(dias: number) {
  return dias ? `Últimos ${dias} días` : "Todo el histórico"
}

const fechaCorta = (d: Date) =>
  d.toLocaleDateString("es-CO", { day: "numeric", month: "short", timeZone: TZ }).replace(".", "")
const fechaLarga = (d: Date) =>
  d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: TZ })
const diasEntre = (a: Date, b: Date) => Math.max(0, Math.floor((b.getTime() - a.getTime()) / 864e5))

type Historial = { a?: string; fecha?: string }[]

/** Cuándo entró la postulación a su etapa actual (último cambio registrado, o su creación). */
function entradaEtapa(etapa: string, historial: unknown, creada: Date): Date {
  const h = Array.isArray(historial) ? (historial as Historial) : []
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i]?.a === etapa && h[i]?.fecha) {
      const d = new Date(h[i].fecha as string)
      if (!Number.isNaN(d.getTime())) return d
    }
  }
  return creada
}

export async function cargarInformeGeneral(dias: number) {
  const ahora = new Date()
  const desde = dias ? new Date(ahora.getTime() - dias * 864e5) : null

  const [vacantes, recibidos] = await Promise.all([
    prisma.vacante.findMany({
      where: { estado: { in: ["ABIERTA", "PAUSADA"] } },
      orderBy: [{ estado: "asc" }, { orden: "asc" }, { titulo: "asc" }],
      include: {
        publicaciones: { select: { canal: true } },
        postulaciones: {
          select: {
            etapa: true,
            scoreIA: true,
            historial: true,
            createdAt: true,
            candidato: { select: { nombre: true, ciudad: true } },
          },
        },
      },
    }),
    prisma.candidato.findMany({
      where: desde ? { createdAt: { gte: desde } } : {},
      orderBy: { createdAt: "desc" },
      select: {
        nombre: true,
        ciudad: true,
        origen: true,
        areaInteres: true,
        createdAt: true,
        postulaciones: {
          select: { etapa: true, scoreIA: true, vacante: { select: { titulo: true } } },
        },
      },
    }),
  ])

  const enPeriodo = (d: Date) => !desde || d >= desde

  const resumenVacantes = vacantes.map((v) => {
    const etapas: Record<string, number> = {}
    for (const p of v.postulaciones) etapas[p.etapa] = (etapas[p.etapa] ?? 0) + 1
    const activas = v.postulaciones.filter((p) => p.etapa !== "DESCARTADA")
    const puntajes = activas.map((p) => p.scoreIA).filter((s): s is number => s != null)
    const abierta = v.fechaPublicacion ?? v.createdAt
    return {
      titulo: v.titulo,
      ciudad: v.ciudad,
      estado: v.estado,
      diasAbierta: diasEntre(abierta, ahora),
      total: v.postulaciones.length,
      nuevas: v.postulaciones.filter((p) => enPeriodo(p.createdAt)).length,
      etapas,
      mejor: puntajes.length ? Math.max(...puntajes) : null,
      recomendados: puntajes.filter((s) => s >= CORTE).length,
      sinEvaluar: activas.filter((p) => p.scoreIA == null).length,
      quietas: v.postulaciones.filter(
        (p) =>
          p.etapa === "RECIBIDA" &&
          diasEntre(entradaEtapa(p.etapa, p.historial, p.createdAt), ahora) > DIAS_QUIETA,
      ).length,
      conMatriz: leerCriterios(v.criteriosEvaluacion).length > 0,
      spe: v.publicaciones.some((p) => p.canal.toUpperCase().startsWith("SPE")),
      top: activas
        .slice()
        .sort((a, b) => (b.scoreIA ?? -1) - (a.scoreIA ?? -1))
        .slice(0, 5)
        .map((p) => ({
          nombre: p.candidato.nombre,
          ciudad: p.candidato.ciudad,
          recibida: p.createdAt,
          score: p.scoreIA,
          etapa: p.etapa,
        })),
    }
  })

  const contar = (claves: string[]) => {
    const m = new Map<string, number>()
    for (const k of claves) m.set(k, (m.get(k) ?? 0) + 1)
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  }

  const conVacante = recibidos.filter((c) => c.postulaciones.some((p) => p.vacante))

  return {
    ahora,
    dias,
    desde,
    vacantes: resumenVacantes,
    recibidos,
    kpis: {
      recibidas: recibidos.length,
      aVacante: conVacante.length,
      sinVacante: recibidos.length - conVacante.length,
      abiertas: vacantes.filter((v) => v.estado === "ABIERTA").length,
    },
    porOrigen: contar(recibidos.map((c) => ORIGEN[c.origen ?? ""] ?? (c.origen || "Sin registrar"))),
    porArea: contar(recibidos.map((c) => c.areaInteres || "Sin clasificar")),
    sinClasificar: recibidos.filter((c) => !c.areaInteres && !c.postulaciones.some((p) => p.vacante)).length,
  }
}

export type DatosInformeGeneral = Awaited<ReturnType<typeof cargarInformeGeneral>>

const CSS_GENERAL = `
  .kpis { display: flex; gap: .5rem; margin: .8rem 0 .2rem; }
  .kpi { flex: 1; border: 1px solid #e2e8f0; border-top: 3px solid #16294d; padding: .45rem .6rem; }
  .kpi b { display: block; font-size: 19pt; line-height: 1.05; color: #16294d; font-weight: 800; }
  .kpi span { font-size: 7.6pt; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }
  .alertas { list-style: none; margin: .2rem 0 .4rem; }
  .alertas li { display: flex; gap: .5rem; align-items: baseline; padding: .28rem 0; border-bottom: 1px solid #eef2f7; font-size: 8.6pt; break-inside: avoid; }
  .tag { flex-shrink: 0; min-width: 4.6rem; text-align: center; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; padding: .08rem .35rem; color: #fff; }
  .tag.legal { background: #be1622; } .tag.aten { background: #b45309; } .tag.pend { background: #16294d; }
  table.data td.c, table.data th.c { text-align: center; }
  table.data td.cero { color: #cbd5e1; }
  table.data tr.tot td { font-weight: 800; color: #16294d; background: #eef2f7; border-top: 1.5px solid #16294d; }
  .si { color: #15803d; font-weight: 700; } .no { color: #be1622; font-weight: 700; }
  .grid2 { display: flex; gap: .9rem; align-items: flex-start; break-inside: avoid; }
  .grid2 > div { flex: 1; min-width: 0; }
  td.barra { width: 42%; }
  .bar-h { height: 8px; background: #16294d; border-radius: 0 2px 2px 0; }
  .vac { break-inside: avoid; margin-bottom: .8rem; }
  .vac-t { display: flex; justify-content: space-between; align-items: baseline; gap: .6rem; border-bottom: 1.5px solid #16294d; padding-bottom: .2rem; margin-bottom: .3rem; }
  .vac-t b { font-size: 10.5pt; color: #16294d; }
  .vac-t span { font-size: 7.6pt; color: #64748b; }
`

export function armarInformeGeneral(d: DatosInformeGeneral, opciones: { logo?: string; autoImprimir?: boolean } = {}) {
  const periodo = d.desde
    ? `${etiquetaPeriodo(d.dias)} (${fechaCorta(d.desde)} – ${fechaLarga(d.ahora)})`
    : `${etiquetaPeriodo(d.dias)} · corte ${fechaLarga(d.ahora)}`
  const n = (x: number) => (x ? String(x) : "—")
  // Con todo el histórico "nuevas" es igual al total: la columna sobra.
  const conNuevas = d.dias > 0

  // ── Pendientes ──────────────────────────────────────────────────────────
  const alertas: [string, string, string][] = []
  const sinSpe = d.vacantes.filter((v) => v.estado === "ABIERTA" && !v.spe)
  if (sinSpe.length)
    alertas.push(["legal", "Legal", `<b>${sinSpe.length} de ${d.kpis.abiertas} vacantes abiertas sin registro en el SPE</b> (${esc(sinSpe.map((v) => v.titulo).join(", "))}). Es obligatorio registrar cada vacante en un prestador autorizado —SENA APE o caja de compensación— dentro de 10 días hábiles (Ley 1636 de 2013); publicarla solo en la web no cumple. La constancia se anota en la pestaña Publicaciones.`])
  const sinMatriz = d.vacantes.filter((v) => !v.conMatriz)
  if (sinMatriz.length)
    alertas.push(["aten", "Atención", `<b>Sin matriz de evaluación:</b> ${esc(sinMatriz.map((v) => v.titulo).join(", "))}. Sin ella los candidatos no reciben puntaje ni se puede sacar el informe por vacante.`])
  const quietas = d.vacantes.filter((v) => v.quietas > 0)
  if (quietas.length)
    alertas.push(["pend", "Pendiente", `<b>${quietas.reduce((s, v) => s + v.quietas, 0)} postulaciones llevan más de ${DIAS_QUIETA} días en «Recibida»</b> sin que nadie las mueva: ${quietas.map((v) => `${esc(v.titulo)} (${v.quietas})`).join(", ")}.`])
  const sinEval = d.vacantes.filter((v) => v.conMatriz && v.sinEvaluar > 0)
  if (sinEval.length)
    alertas.push(["pend", "Pendiente", `<b>${sinEval.reduce((s, v) => s + v.sinEvaluar, 0)} postulaciones aún sin puntaje:</b> ${sinEval.map((v) => `${esc(v.titulo)} (${v.sinEvaluar})`).join(", ")}. El sincronizador las evalúa cada hora en horario laboral; si siguen así, revisar que la hoja de vida sea legible.`])
  if (d.sinClasificar)
    alertas.push(["pend", "Pendiente", `<b>${d.sinClasificar} hojas de vida sin vacante ni área</b> en el periodo: asignarles un área en la pestaña Candidatos para que aparezcan en las búsquedas del banco.`])
  const secas = d.vacantes.filter((v) => v.estado === "ABIERTA" && d.dias && v.nuevas === 0)
  if (secas.length)
    alertas.push(["aten", "Atención", `<b>Sin postulaciones nuevas en el periodo:</b> ${esc(secas.map((v) => v.titulo).join(", "))}. Conviene abrir otros canales (SENA APE, cajas, Computrabajo).`])

  const bloqueAlertas = alertas.length
    ? `<h2>Pendientes</h2><ul class="alertas">${alertas.map(([c, t, txt]) => `<li><span class="tag ${c}">${t}</span><span>${txt}</span></li>`).join("")}</ul>`
    : `<h2>Pendientes</h2><p class="guia">Sin pendientes: todas las vacantes tienen SPE y matriz, y no hay postulaciones quietas.</p>`

  // ── Estado de las vacantes ──────────────────────────────────────────────
  const filasVac = d.vacantes
    .map((v) =>
      `<tr><td><b>${esc(v.titulo)}</b>${v.estado === "PAUSADA" ? ' <span class="pill pill-c">Pausada</span>' : ""}` +
      `<br><small class="guia">${esc(v.ciudad ?? "")}${v.ciudad ? " · " : ""}abierta hace ${v.diasAbierta} días</small></td>` +
      `<td class="num">${v.total}</td>${conNuevas ? `<td class="num">${n(v.nuevas)}</td>` : ""}` +
      ETAPAS.map(([k]) => `<td class="c ${v.etapas[k] ? "" : "cero"}">${v.etapas[k] ?? 0}</td>`).join("") +
      `<td class="num">${v.mejor ?? "—"}</td>` +
      `<td class="c">${v.spe ? '<span class="si">Sí</span>' : '<span class="no">No</span>'}</td></tr>`)
    .join("")
  const sum = (f: (v: DatosInformeGeneral["vacantes"][number]) => number) => d.vacantes.reduce((s, v) => s + f(v), 0)
  const filaTot = d.vacantes.length > 1
    ? `<tr class="tot"><td>Total</td><td class="num">${sum((v) => v.total)}</td>${conNuevas ? `<td class="num">${sum((v) => v.nuevas)}</td>` : ""}` +
      ETAPAS.map(([k]) => `<td class="c">${sum((v) => v.etapas[k] ?? 0)}</td>`).join("") + "<td></td><td></td></tr>"
    : ""
  const bloqueVacantes = d.vacantes.length
    ? `<h2>Estado de las vacantes</h2>
       <table class="data"><thead><tr><th>Vacante</th><th class="num">Total</th>${conNuevas ? '<th class="num">Nuevas</th>' : ""}
         ${ETAPAS.map(([, l]) => `<th class="c">${l}</th>`).join("")}<th class="num">Mejor</th><th class="c">SPE</th></tr></thead>
         <tbody>${filasVac}${filaTot}</tbody></table>
       <p class="guia" style="margin-top:.3rem"><b>Total</b>: postulaciones desde que se abrió la vacante. ${conNuevas ? "<b>Nuevas</b>: las recibidas en el periodo del informe. " : ""}
       Las columnas de etapa muestran dónde está cada postulación hoy. <b>Mejor</b>: puntaje más alto entre las no descartadas (0-100, sugerencia de la IA).
       <b>SPE</b>: vacante registrada en el Servicio Público de Empleo.</p>`
    : `<h2>Estado de las vacantes</h2><p class="guia">No hay vacantes abiertas ni pausadas.</p>`

  // ── Canales y áreas ─────────────────────────────────────────────────────
  const tablaConteo = (titulo: string, filas: [string, number][]) => {
    const max = Math.max(1, ...filas.map(([, x]) => x))
    const total = filas.reduce((s, [, x]) => s + x, 0) || 1
    return `<div><table class="data mini"><thead><tr><th>${titulo}</th><th class="num">HV</th><th></th><th class="num">%</th></tr></thead><tbody>` +
      filas.map(([k, x]) =>
        `<tr><td>${esc(k)}</td><td class="num"><b>${x}</b></td>` +
        `<td class="barra"><div class="bar-h" style="width:${((x / max) * 100).toFixed(1)}%"></div></td>` +
        `<td class="num">${Math.round((x / total) * 100)}%</td></tr>`).join("") +
      "</tbody></table></div>"
  }
  const bloqueCanales = d.recibidos.length
    ? `<h2>Por dónde llegaron y a qué área</h2>
       <div class="grid2">${tablaConteo("Canal de llegada", d.porOrigen)}${tablaConteo("Área / pool", d.porArea)}</div>`
    : ""

  // ── Mejores por vacante ─────────────────────────────────────────────────
  const bloquesTop = d.vacantes
    .filter((v) => v.top.length)
    .map((v) => {
      const sinPuntaje = v.top.every((c) => c.score == null)
      return `<div class="vac"><div class="vac-t"><b>${esc(v.titulo)}</b>
        <span>${v.total} postulaciones · ${v.recomendados} recomendados (${CORTE}+)${v.conMatriz ? "" : " · sin matriz"}</span></div>
        ${sinPuntaje ? `<p class="guia">Todavía sin puntajes${v.conMatriz ? " (pendientes de evaluación)" : ": falta definir la matriz del cargo"}.</p>` : ""}
        <table class="data mini"><thead><tr><th class="num">#</th><th>Candidato</th><th>Ciudad</th><th>Recibida</th>
          <th class="num">Puntaje</th><th>Concepto</th><th>Etapa</th></tr></thead><tbody>` +
        v.top.map((c, i) =>
          `<tr><td class="num">${i + 1}</td><td><b>${esc(c.nombre)}</b></td><td>${esc(c.ciudad)}</td>` +
          `<td>${fechaCorta(c.recibida)}</td><td class="num">${c.score ?? "—"}</td><td>${concepto(c.score)}</td>` +
          `<td>${ETAPA_LARGA[c.etapa] ?? c.etapa}</td></tr>`).join("") +
        "</tbody></table></div>"
    })
    .join("")
  const bloqueTop = bloquesTop
    ? `<h2>Mejores candidatos por vacante</h2>
       <p class="guia" style="margin-bottom:.5rem">Hasta cinco por vacante, sin contar los descartados. El detalle criterio por
       criterio está en el informe de cada vacante.</p>${bloquesTop}`
    : ""

  // ── Listado de hojas de vida del periodo ────────────────────────────────
  const TOPE = 400
  const filasHv = d.recibidos
    .slice(0, TOPE)
    .map((c) => {
      const ps = c.postulaciones.filter((p) => p.vacante)
      const destino = ps.length
        ? esc(ps.map((p) => p.vacante!.titulo).join(", "))
        : `<span class="guia">Banco · ${esc(c.areaInteres || "sin clasificar")}</span>`
      const etapa = ps.length === 1 ? ETAPA_LARGA[ps[0].etapa] ?? ps[0].etapa : ps.length > 1 ? "Varias" : "—"
      const puntajes = ps.map((p) => p.scoreIA).filter((s): s is number => s != null)
      return `<tr><td style="white-space:nowrap">${fechaCorta(c.createdAt)}</td><td><b>${esc(c.nombre)}</b></td>` +
        `<td>${esc(c.ciudad)}</td><td style="white-space:nowrap">${esc(ORIGEN[c.origen ?? ""] ?? (c.origen || "—"))}</td>` +
        `<td>${destino}</td><td>${etapa}</td><td class="num">${puntajes.length ? Math.max(...puntajes) : "—"}</td></tr>`
    })
    .join("")
  const bloqueHv = d.recibidos.length
    ? `<h2>Hojas de vida recibidas (${d.recibidos.length})</h2>
       <p class="guia" style="margin-bottom:.5rem">De la más reciente a la más antigua. «Banco» son las que llegaron sin aplicar a una vacante.</p>
       <table class="data mini"><thead><tr><th>Fecha</th><th>Nombre</th><th>Ciudad</th><th>Canal</th><th>Aplicó a</th>
         <th>Etapa</th><th class="num">Punt.</th></tr></thead><tbody>${filasHv}</tbody></table>
       ${d.recibidos.length > TOPE ? `<p class="guia" style="margin-top:.3rem">Se muestran las ${TOPE} más recientes de ${d.recibidos.length}. Para el resto, elige un periodo más corto.</p>` : ""}`
    : `<h2>Hojas de vida recibidas</h2><p class="guia">No llegaron hojas de vida en el periodo.</p>`

  const cuerpo = `
  <div class="kicker">Talento Humano · Informe general</div>
  <div class="title">Vacantes y hojas de vida recibidas</div>
  <div class="sub">${esc(periodo)}</div>
  <div class="kpis">
    <div class="kpi"><b>${d.kpis.recibidas}</b><span>Hojas de vida recibidas</span></div>
    <div class="kpi"><b>${d.kpis.aVacante}</b><span>Aplicaron a una vacante</span></div>
    <div class="kpi"><b>${d.kpis.sinVacante}</b><span>Llegaron al banco</span></div>
    <div class="kpi"><b>${d.kpis.abiertas}</b><span>Vacantes abiertas</span></div>
  </div>
  ${bloqueAlertas}
  ${bloqueVacantes}
  ${bloqueCanales}
  ${bloqueTop}
  ${bloqueHv}
  <div class="nota"><b>Cómo leer este informe.</b> Los puntajes son una sugerencia de la inteligencia artificial contra la
  matriz de evaluación de cada cargo y solo miden lo que la hoja de vida demuestra por escrito: la decisión es de
  Talento Humano y del jefe del área (Circular SIC 002 de 2024). No se consideran edad, sexo, estado civil ni origen
  (Ley 931 de 2004). Contiene datos personales: uso interno del proceso de selección (Ley 1581 de 2012).</div>
`

  return envolver("Informe general — Talento Humano", cuerpo, { ...opciones, cssExtra: CSS_GENERAL })
}
