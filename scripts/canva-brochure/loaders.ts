// Cargadores desde Prisma → estructura ProyectoBrochure consumible por layouts.
// Uno por categoría: filtra visibles con al menos 1 imagen, ordena por
// destacadoEnCategoria + fecha desc, y asigna layouts según categorias.ts.

import type { PrismaClient, CategoriaEnum, Proyecto, ImagenProyecto } from "@prisma/client"
import { CATEGORIAS } from "./categorias"
import type { LayoutKey, ProyectoBrochure } from "./data"

type ProyectoConImagenes = Proyecto & { imagenes: ImagenProyecto[] }

/** Stats agregadas por categoría — usadas en portada/intro */
export interface StatsCategoria {
  total: number
  toneladas: number
  toneladasFmt: string // "3.525"
}

export async function loadStatsCategoria(
  prisma: PrismaClient,
  cat: CategoriaEnum,
): Promise<StatsCategoria> {
  const total = await prisma.proyecto.count({ where: { categoria: cat, visible: true } })
  const agg = await prisma.proyecto.aggregate({
    where: { categoria: cat, visible: true },
    _sum: { toneladas: true },
  })
  const ton = Number(agg._sum.toneladas ?? 0)
  return {
    total,
    toneladas: ton,
    toneladasFmt: ton.toLocaleString("es-CO", { maximumFractionDigits: 0 }),
  }
}

/** Carga proyectos con imagen, listos para ensamblar el brochure */
export async function loadProyectosByCategoria(
  prisma: PrismaClient,
  cat: CategoriaEnum,
): Promise<ProyectoBrochure[]> {
  const cfg = CATEGORIAS[cat]
  const rows = (await prisma.proyecto.findMany({
    where: { categoria: cat, visible: true, imagenes: { some: {} } },
    include: { imagenes: { orderBy: { orden: "asc" }, take: 4 } },
    orderBy: [{ destacadoEnCategoria: "desc" }, { fechaInicio: "desc" }],
  })) as ProyectoConImagenes[]

  if (rows.length === 0) return []

  // Asignación de layouts:
  //   - índice 0 → cfg.layoutHero (anchor visual de apertura)
  //   - 1 proyecto destacado → cfg.layoutDestacadoUnico (R fondo rojo) si existe
  //   - el resto → rotación sobre cfg.layoutPool, evitando repetir el hero al inicio
  const usedDestacadoUnique = { current: false }
  const proyectos = rows.map((row, idx) =>
    mapRowToBrochure(row, idx, cfg, rows, usedDestacadoUnique),
  )
  return proyectos
}

function mapRowToBrochure(
  row: ProyectoConImagenes,
  idx: number,
  cfg: typeof CATEGORIAS[CategoriaEnum],
  allRows: ProyectoConImagenes[],
  usedDestacadoUnique: { current: boolean },
): ProyectoBrochure {
  const fotos = row.imagenes.map((img) => img.urlOptimized || img.url).filter(Boolean)
  const anio = formatAnio(row.fechaFin ?? row.fechaInicio)
  const peso = row.toneladas
    ? `${formatDecimal(Number(row.toneladas))} ton`
    : undefined
  const area = row.areaTotal
    ? `${formatDecimal(Number(row.areaTotal))} m²`
    : undefined

  // Decidir layout
  const layout = pickLayout(row, idx, cfg, allRows, usedDestacadoUnique)

  return {
    layout,
    numero: idx + 1,
    tipo: deriveTipo(row, cfg.nombreDisplay),
    nombre: cleanNombre(row.titulo),
    ubicacionCorta: row.ubicacion,
    anio,
    cliente: row.cliente || undefined,
    area,
    peso,
    descripcion: row.descripcion?.slice(0, 220) || undefined,
    fotos,
  }
}

function pickLayout(
  row: ProyectoConImagenes,
  idx: number,
  cfg: typeof CATEGORIAS[CategoriaEnum],
  _allRows: ProyectoConImagenes[],
  used: { current: boolean },
): LayoutKey {
  // Anchor: primer proyecto siempre layoutHero
  if (idx === 0) return cfg.layoutHero

  // Si la categoría tiene layoutDestacadoUnico (R) y este proyecto es el primero
  // marcado destacadoEnCategoria, asignárselo
  if (
    cfg.layoutDestacadoUnico &&
    !used.current &&
    row.destacadoEnCategoria
  ) {
    used.current = true
    return cfg.layoutDestacadoUnico
  }

  // Resto: rotación sobre layoutPool, saltando el hero (ya usado en idx 0)
  // y el layoutDestacadoUnico (no aparece en pool)
  const pool = cfg.layoutPool.filter((k) => k !== cfg.layoutHero)
  return pool[(idx - 1) % pool.length]
}

// ---- helpers de formato -----------------------------------------------------

function formatDecimal(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString("es-CO")
  return n.toLocaleString("es-CO", { maximumFractionDigits: 1 })
}

function formatAnio(d: Date | null | undefined): string {
  if (!d) return ""
  return String(d.getFullYear())
}

/** Quita prefijos comunes ("Construcción de", "Edificio") y mayuscula */
function cleanNombre(t: string): string {
  return t
    .replace(/^Construcci[óo]n\s+(de\s+)?(la\s+)?/i, "")
    .replace(/^Edificio\s+/i, "")
    .trim()
    .toUpperCase()
}

/** Para el "tipo" arriba del nombre. Usa categoria por defecto. */
function deriveTipo(_row: ProyectoConImagenes, nombreDisplayCat: string): string {
  return nombreDisplayCat.toUpperCase()
}
