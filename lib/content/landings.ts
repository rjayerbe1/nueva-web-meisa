// Lectura DB-first de las landings SEO (tabla landings_seo) con FALLBACK
// al config en código (lib/soluciones.ts, lib/ciudades.ts, lib/guias.ts).
//
// Reglas:
//   - Si la fila existe, está activa y su Json valida contra el schema del
//     tipo → se sirve el contenido de la DB (editable desde /admin/landings).
//   - Si la fila no existe, está inactiva, no valida o la DB falla → se
//     sirve el config en código. Las 13 rutas públicas nunca se caen.
//   - metaTitle/metaDescription viven en columnas propias; el resto del
//     contenido en el Json `contenido`.
import { prisma } from '@/lib/prisma'
import { SOLUCIONES, type Solucion } from '@/lib/soluciones'
import { CIUDADES, type CiudadConfig } from '@/lib/ciudades'
import { GUIAS, type GuiaLanding, type GuiaContenido } from '@/lib/guias'
import { PILAR_CONFIG, type PilarConfig } from '@/lib/pilar'
import {
  solucionContenidoSchema,
  ciudadContenidoSchema,
  guiaContenidoSchema,
  pilarContenidoSchema,
} from '@/lib/landings-schema'

type LandingRow = {
  slug: string
  tipo: 'SOLUCION' | 'GUIA' | 'CIUDAD' | 'PILAR'
  metaTitle: string
  metaDescription: string
  contenido: unknown
  activa: boolean
  orden: number
  updatedAt: Date
}

async function fetchRow(slug: string): Promise<LandingRow | null> {
  try {
    return (await prisma.landingSeo.findUnique({ where: { slug } })) as
      | LandingRow
      | null
  } catch {
    return null
  }
}

async function fetchRows(
  tipo: 'SOLUCION' | 'GUIA' | 'CIUDAD' | 'PILAR',
): Promise<LandingRow[]> {
  try {
    return (await prisma.landingSeo.findMany({
      where: { tipo, activa: true },
      orderBy: { orden: 'asc' },
    })) as LandingRow[]
  } catch {
    return []
  }
}

/* ─── Soluciones ──────────────────────────────────────────────────────── */

function mergeSolucion(row: LandingRow, fallback?: Solucion): Solucion | undefined {
  const parsed = solucionContenidoSchema.safeParse(row.contenido)
  if (!parsed.success) return fallback
  return {
    ...(fallback ?? {}),
    ...parsed.data,
    slug: row.slug,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  } as Solucion
}

export async function getSolucionDb(slug: string): Promise<Solucion | undefined> {
  const fallback = SOLUCIONES.find((s) => s.slug === slug)
  const row = await fetchRow(slug)
  if (!row || row.tipo !== 'SOLUCION') return fallback
  if (!row.activa) return fallback
  return mergeSolucion(row, fallback)
}

/** Lista de soluciones activas (para cross-links). DB-first, fallback a código. */
export async function getSolucionesDb(): Promise<Solucion[]> {
  const rows = await fetchRows('SOLUCION')
  if (rows.length === 0) return SOLUCIONES
  const merged = rows
    .map((row) =>
      mergeSolucion(row, SOLUCIONES.find((s) => s.slug === row.slug)),
    )
    .filter((s): s is Solucion => Boolean(s))
  return merged.length > 0 ? merged : SOLUCIONES
}

export async function getSolucionSlugsDb(): Promise<string[]> {
  const rows = await fetchRows('SOLUCION')
  const dbSlugs = rows.map((r) => r.slug)
  const codeSlugs = SOLUCIONES.map((s) => s.slug)
  return Array.from(new Set([...codeSlugs, ...dbSlugs]))
}

/* ─── Ciudades ────────────────────────────────────────────────────────── */

function mergeCiudad(
  row: LandingRow,
  fallback?: CiudadConfig,
): CiudadConfig | undefined {
  const parsed = ciudadContenidoSchema.safeParse(row.contenido)
  if (!parsed.success) return fallback
  return {
    ...(fallback ?? {}),
    ...parsed.data,
    slug: row.slug,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  } as CiudadConfig
}

export async function getCiudadDb(slug: string): Promise<CiudadConfig | undefined> {
  const fallback = CIUDADES.find((c) => c.slug === slug)
  const row = await fetchRow(slug)
  if (!row || row.tipo !== 'CIUDAD') return fallback
  if (!row.activa) return fallback
  return mergeCiudad(row, fallback)
}

export async function getCiudadSlugsDb(): Promise<string[]> {
  const rows = await fetchRows('CIUDAD')
  const dbSlugs = rows.map((r) => r.slug)
  const codeSlugs = CIUDADES.map((c) => c.slug)
  return Array.from(new Set([...codeSlugs, ...dbSlugs]))
}

/* ─── Guías ───────────────────────────────────────────────────────────── */

export async function getGuiaDb(slug: string): Promise<GuiaLanding | undefined> {
  const fallback = GUIAS.find((g) => g.slug === slug)
  const row = await fetchRow(slug)
  if (!row || row.tipo !== 'GUIA' || !row.activa) return fallback
  const parsed = guiaContenidoSchema.safeParse(row.contenido)
  if (!parsed.success) return fallback
  return {
    slug: row.slug,
    titulo: fallback?.titulo ?? row.slug,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    contenido: parsed.data as GuiaContenido,
    // Cada guardado en /admin/landings actualiza updatedAt → señal de
    // frescura (fecha visible + article:modified_time) sin trabajo manual.
    updatedAt: row.updatedAt,
  }
}

/* ─── Pilar ───────────────────────────────────────────────────────────── */

/**
 * Config de la página pilar (/estructuras-metalicas-colombia). DB-first
 * (tabla landings_seo, tipo PILAR — editable en /admin/landings) con
 * fallback total a PILAR_CONFIG en código: la página nunca se cae.
 */
export async function getPilarDb(): Promise<PilarConfig> {
  const row = await fetchRow(PILAR_CONFIG.slug)
  if (!row || row.tipo !== 'PILAR' || !row.activa) return PILAR_CONFIG
  const parsed = pilarContenidoSchema.safeParse(row.contenido)
  if (!parsed.success) return PILAR_CONFIG
  return {
    ...PILAR_CONFIG,
    ...parsed.data,
    slug: row.slug,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  } as PilarConfig
}
