/**
 * Contenido público de la web en DOS entradas del Data Cache de Next,
 * cargadas y refrescadas SIEMPRE juntas.
 *
 * Por qué (medido 2026-09-15): con una entrada de caché por consulta, cada
 * una vencía a su hora y las 264 páginas de proyecto se regeneraban cada una
 * por su lado con ~26 consultas. Neon despertaba cada 2-4 minutos (15 h
 * activas/día) y el pool de Prisma en Cloud Run (3 conexiones con 1 CPU) se
 * agotaba: >1000 timeouts/día y páginas cacheadas con metadatos de respaldo.
 *
 * Ahora TODA lectura del sitio público sale de este snapshot (~1 MB): la base
 * se consulta como mucho una vez por `PUBLIC_CACHE_TTL` (una ráfaga de ~40
 * consultas en paralelo) o tras una escritura del admin (el hook de
 * lib/prisma.ts invalida las tags). Las páginas derivan lo que necesitan en
 * memoria con los selectores de abajo y de lib/content/*.
 *
 * Reglas para quien toque esto:
 *  - Los selectores NO deben mutar el snapshot (se comparte dentro del
 *    request): usar `[...arr].sort()`, nunca `arr.sort()`.
 *  - Una tabla nueva que se muestre en la web pública se agrega aquí y en
 *    MODEL_TAGS (lib/cache/tags.ts). No leer Prisma directo en páginas públicas.
 *  - Límite de Next: 2 MB por entrada. Si una entrada se acerca, partirla.
 */
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Prisma } from '@prisma/client'
import type {
  Brochure,
  CategoriaEnum,
  CategoriaProyecto,
  Certificacion,
  Cliente,
  CompanyValue,
  ConfiguracionContacto,
  ConfiguracionEmpresa,
  ConfiguracionTrayectoria,
  ConfiguracionWhatsApp,
  ContactoWhatsApp,
  Equipo,
  EtapaControlCalidad,
  FaseFlujoTecnologia,
  FooterLink,
  FormOption,
  GobiernoItem,
  GrupoSeccion,
  HomeFeaturedProject,
  HomeHeroEspecialidad,
  HomeSeccionConfig,
  HomeServicioDestacado,
  HomeStat,
  ImagenProyecto,
  LandingSeo,
  MenuItem,
  Norma,
  Obra,
  OrdenSeccionesHome,
  PilarSIG,
  Plant,
  Politica,
  ProcesoDigital,
  ProcesoFase,
  Proyecto,
  ProyectoHojaVida,
  ResumenAnio,
  Servicio,
  ServiciosPagina,
  SocialLink,
  Tecnologia,
  TimelineHito,
  Vacante,
} from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PUBLIC_CACHE_TTL, TAGS } from '@/lib/cache/tags'
import { generacionContenido } from '@/lib/cache/revalidate'

/* ─── Tipos ───────────────────────────────────────────────────────────── */

export type ProyectoConImagenes = Proyecto & { imagenes: ImagenProyecto[] }

export type Catalogo = {
  /** Proyectos visibles, orden createdAt desc, con TODAS sus imágenes (orden asc). */
  proyectos: ProyectoConImagenes[]
  /** Todas las categorías (visibles o no), orden asc. */
  categorias: CategoriaProyecto[]
  /** Todas las obras (activas o no). */
  obras: Obra[]
  brochures: Brochure[]
  /** Todos los servicios (activos o no), orden asc. */
  servicios: Servicio[]
  clientes: Cliente[]
  /** Toda la hoja de vida (visible o no). */
  hojaVida: ProyectoHojaVida[]
  resumenes: ResumenAnio[]
  configuracionTrayectoria: ConfiguracionTrayectoria | null
}

export type Sitio = {
  landings: LandingSeo[]
  menu: MenuItem[]
  footer: FooterLink[]
  social: SocialLink[]
  /** Todas las plantas (activas o no). */
  plantas: Plant[]
  configuracionEmpresa: ConfiguracionEmpresa | null
  configuracionContacto: ConfiguracionContacto | null
  heroImagesValor: string | null
  empresa: {
    valores: CompanyValue[]
    hitos: TimelineHito[]
    certificaciones: Certificacion[]
    normas: Norma[]
    gobierno: GobiernoItem[]
  }
  home: {
    especialidades: HomeHeroEspecialidad[]
    stats: HomeStat[]
    featured: HomeFeaturedProject | null
    servicios: HomeServicioDestacado[]
    seccionConfig: HomeSeccionConfig | null
    orden: OrdenSeccionesHome | null
  }
  tecnologia: {
    grupos: GrupoSeccion[]
    tecnologias: Tecnologia[]
    equipos: Equipo[]
    procesos: ProcesoDigital[]
    fasesFlujo: FaseFlujoTecnologia[]
  }
  calidad: {
    grupos: GrupoSeccion[]
    pilares: PilarSIG[]
    politicas: Politica[]
    etapasControl: EtapaControlCalidad[]
  }
  formOptions: FormOption[]
  procesoFases: ProcesoFase[]
  serviciosPagina: ServiciosPagina | null
  talento: { paginaPublicaActiva: boolean; textoConsentimiento: string | null } | null
  /** Vacantes ABIERTA, orden [orden asc, createdAt desc]. */
  vacantesAbiertas: Vacante[]
  contactosWhatsApp: ContactoWhatsApp[]
  configuracionWhatsApp: ConfiguracionWhatsApp | null
}

/* ─── Serialización que conserva Date y Decimal ───────────────────────── */
// El Data Cache guarda JSON. Codificamos Date/Decimal para devolverlos con
// el MISMO tipo que entregaba Prisma: las páginas siguen llamando
// `.toISOString()` o `Number(decimal)` sin cambios.

function encode(value: unknown): unknown {
  if (value instanceof Date) return { $date: value.toISOString() }
  if (Prisma.Decimal.isDecimal(value)) return { $decimal: (value as Prisma.Decimal).toString() }
  if (Array.isArray(value)) return value.map(encode)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = encode(v)
    return out
  }
  return value
}

function decode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decode)
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 1 && typeof obj.$date === 'string') return new Date(obj.$date)
    if (keys.length === 1 && typeof obj.$decimal === 'string') return new Prisma.Decimal(obj.$decimal)
    const out: Record<string, unknown> = {}
    for (const k of keys) out[k] = decode(obj[k])
    return out
  }
  return value
}

const LIMITE_ENTRADA = 2 * 1024 * 1024

function empaquetar(nombre: string, data: unknown): unknown {
  const encoded = encode(data)
  const bytes = JSON.stringify(encoded).length
  if (bytes > LIMITE_ENTRADA * 0.9) {
    // Next NO cachea entradas >2 MB (en producción falla en silencio y
    // entonces cada render consultaría Neon). Que se vea en los logs.
    console.error(
      `[cache] snapshot "${nombre}" pesa ${(bytes / 1024 / 1024).toFixed(2)} MB (límite 2 MB): hay que partirlo`,
    )
  }
  return encoded
}

/* ─── Cargas ──────────────────────────────────────────────────────────── */

async function consultarCatalogo(): Promise<Catalogo> {
  const [proyectos, imagenes, categorias, obras, brochures, servicios, clientes, hojaVida, resumenes, configuracionTrayectoria] =
    await Promise.all([
      prisma.proyecto.findMany({ where: { visible: true }, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] }),
      prisma.imagenProyecto.findMany({
        where: { proyecto: { visible: true } },
        // 25 proyectos tienen varias imágenes con el mismo `orden`; antes el
        // desempate lo decidía Postgres (distinto según la consulta). Por
        // antigüedad es estable y coincide con lo que la web mostraba en la
        // mayoría de páginas (comparado URL por URL, sep-2026).
        orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
      }),
      prisma.categoriaProyecto.findMany({ orderBy: [{ orden: 'asc' }, { id: 'asc' }] }),
      prisma.obra.findMany({ orderBy: [{ orden: 'asc' }, { id: 'asc' }] }),
      prisma.brochure.findMany({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
      prisma.servicio.findMany({ orderBy: [{ orden: 'asc' }, { id: 'asc' }] }),
      prisma.cliente.findMany({ orderBy: [{ orden: 'asc' }, { nombre: 'asc' }] }),
      prisma.proyectoHojaVida.findMany({
        orderBy: [{ destacado: 'desc' }, { fechaInicio: 'desc' }, { orden: 'asc' }],
      }),
      prisma.resumenAnio.findMany({ orderBy: { anio: 'desc' } }),
      prisma.configuracionTrayectoria.findFirst(),
    ])

  const imagenesPorProyecto = new Map<string, ImagenProyecto[]>()
  for (const img of imagenes) {
    if (!img.proyectoId) continue
    const lista = imagenesPorProyecto.get(img.proyectoId)
    if (lista) lista.push(img)
    else imagenesPorProyecto.set(img.proyectoId, [img])
  }

  return {
    proyectos: proyectos.map((p) => ({ ...p, imagenes: imagenesPorProyecto.get(p.id) ?? [] })),
    categorias,
    obras,
    brochures,
    servicios,
    clientes,
    hojaVida,
    resumenes,
    configuracionTrayectoria,
  }
}

async function consultarSitio(): Promise<Sitio> {
  const activo = { activo: true }
  const porOrden = { orden: 'asc' as const }
  const [
    landings, menu, footer, social, plantas, configuracionEmpresa, configuracionContacto, heroImages,
    valores, hitos, certificaciones, normas, gobierno,
    especialidades, stats, featured, homeServicios, seccionConfig, orden,
    gruposTecnologia, tecnologias, equipos, procesos, fasesFlujo,
    gruposCalidad, pilares, politicas, etapasControl,
    formOptions, procesoFases, serviciosPagina, talento, vacantesAbiertas, contactosWhatsApp, configuracionWhatsApp,
  ] = await Promise.all([
    prisma.landingSeo.findMany({ orderBy: [{ orden: 'asc' }, { slug: 'asc' }] }),
    prisma.menuItem.findMany({ where: activo, orderBy: porOrden }),
    prisma.footerLink.findMany({ where: activo, orderBy: [{ grupo: 'asc' }, { orden: 'asc' }] }),
    prisma.socialLink.findMany({ where: activo, orderBy: porOrden }),
    prisma.plant.findMany({ orderBy: [{ esSedePrincipal: 'desc' }, { orden: 'asc' }, { nombre: 'asc' }] }),
    prisma.configuracionEmpresa.findUnique({ where: { id: 'default' } }),
    prisma.configuracionContacto.findUnique({ where: { id: 'default' } }),
    prisma.configuracionSitio.findUnique({ where: { clave: 'hero_images' } }),
    prisma.companyValue.findMany({ where: activo, orderBy: porOrden }),
    prisma.timelineHito.findMany({ where: activo, orderBy: porOrden }),
    prisma.certificacion.findMany({ where: activo, orderBy: porOrden }),
    prisma.norma.findMany({ where: activo, orderBy: porOrden }),
    prisma.gobiernoItem.findMany({ where: activo, orderBy: porOrden }),
    prisma.homeHeroEspecialidad.findMany({ where: activo, orderBy: porOrden }),
    prisma.homeStat.findMany({ where: activo, orderBy: porOrden }),
    prisma.homeFeaturedProject.findUnique({ where: { id: 'default' } }),
    prisma.homeServicioDestacado.findMany({ where: activo, orderBy: porOrden }),
    prisma.homeSeccionConfig.findUnique({ where: { id: 'default' } }),
    prisma.ordenSeccionesHome.findUnique({ where: { id: 'default' } }),
    prisma.grupoSeccion.findMany({ where: { pagina: 'tecnologia', activo: true }, orderBy: porOrden }),
    prisma.tecnologia.findMany({ where: activo, orderBy: porOrden }),
    prisma.equipo.findMany({ where: activo, orderBy: [{ categoria: 'asc' }, { orden: 'asc' }] }),
    prisma.procesoDigital.findMany({ where: activo, orderBy: porOrden }),
    prisma.faseFlujoTecnologia.findMany({ where: activo, orderBy: porOrden }),
    prisma.grupoSeccion.findMany({ where: { pagina: 'calidad', activo: true }, orderBy: porOrden }),
    prisma.pilarSIG.findMany({ where: activo, orderBy: porOrden }),
    prisma.politica.findMany({ where: activo, orderBy: porOrden }),
    prisma.etapaControlCalidad.findMany({ where: activo, orderBy: porOrden }),
    prisma.formOption.findMany({ where: activo, orderBy: [{ grupo: 'asc' }, { orden: 'asc' }] }),
    prisma.procesoFase.findMany({ where: activo, orderBy: { numero: 'asc' } }),
    prisma.serviciosPagina.findUnique({ where: { id: 'default' } }),
    prisma.configuracionTalento.findUnique({
      where: { id: 'default' },
      select: { paginaPublicaActiva: true, textoConsentimiento: true },
    }),
    prisma.vacante.findMany({ where: { estado: 'ABIERTA' }, orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }] }),
    prisma.contactoWhatsApp.findMany({ where: activo, orderBy: porOrden }),
    prisma.configuracionWhatsApp.findFirst(),
  ])

  return {
    landings,
    menu,
    footer,
    social,
    plantas,
    configuracionEmpresa,
    configuracionContacto,
    heroImagesValor: heroImages?.valor ?? null,
    empresa: { valores, hitos, certificaciones, normas, gobierno },
    home: { especialidades, stats, featured, servicios: homeServicios, seccionConfig, orden },
    tecnologia: { grupos: gruposTecnologia, tecnologias, equipos, procesos, fasesFlujo },
    calidad: { grupos: gruposCalidad, pilares, politicas, etapasControl },
    formOptions,
    procesoFases,
    serviciosPagina,
    talento,
    vacantesAbiertas,
    contactosWhatsApp,
    configuracionWhatsApp,
  }
}

/**
 * `unstable_cache` no deduplica cargas simultáneas: tras una invalidación,
 * cada render (y Next llega a hacer dos por página) y cada request en paralelo
 * recargaba el snapshot entero (6 páginas a la vez = 541 consultas). Aquí las
 * cargas en curso se comparten dentro del proceso, pero solo si empezaron en
 * la misma "generación": una carga iniciada antes de una escritura del admin
 * nunca se reutiliza después de ella (traería datos viejos por 1 h).
 */
function compartirCargaEnCurso<T>(cargar: () => Promise<T>): () => Promise<T> {
  let enCurso: { generacion: number; promesa: Promise<T> } | null = null
  return () => {
    const generacion = generacionContenido()
    if (enCurso && enCurso.generacion === generacion) return enCurso.promesa
    const promesa = cargar().finally(() => {
      if (enCurso?.promesa === promesa) enCurso = null
    })
    enCurso = { generacion, promesa }
    return promesa
  }
}

const consultarCatalogoCompartido = compartirCargaEnCurso(consultarCatalogo)
const consultarSitioCompartido = compartirCargaEnCurso(consultarSitio)

// Ambas entradas llevan TODAS las tags: cualquier escritura pública las
// invalida a las dos, así que siempre se recargan en el mismo instante.
const TODAS_LAS_TAGS = Object.values(TAGS)

const cargarCatalogo = unstable_cache(
  async () => empaquetar('catalogo', await consultarCatalogoCompartido()),
  ['contenido-publico', 'catalogo', 'v1'],
  { revalidate: PUBLIC_CACHE_TTL, tags: TODAS_LAS_TAGS },
)

const cargarSitio = unstable_cache(
  async () => empaquetar('sitio', await consultarSitioCompartido()),
  ['contenido-publico', 'sitio', 'v1'],
  { revalidate: PUBLIC_CACHE_TTL, tags: TODAS_LAS_TAGS },
)

/**
 * Snapshot completo. Siempre pide las dos entradas juntas para que venzan y
 * se refresquen en el mismo request (un solo despertar de Neon por hora).
 * `cache()` lo deduplica dentro de un render.
 */
export const getContenidoPublico = cache(async (): Promise<{ catalogo: Catalogo; sitio: Sitio }> => {
  const [catalogo, sitio] = await Promise.all([cargarCatalogo(), cargarSitio()])
  return { catalogo: decode(catalogo) as Catalogo, sitio: decode(sitio) as Sitio }
})

export async function getCatalogo(): Promise<Catalogo> {
  return (await getContenidoPublico()).catalogo
}

export async function getSitio(): Promise<Sitio> {
  return (await getContenidoPublico()).sitio
}

/* ─── Helpers de consulta en memoria ──────────────────────────────────── */

/** Número de un Decimal/number/string de Prisma (null → 0). */
export function num(value: unknown): number {
  if (value === null || value === undefined) return 0
  return Number(value)
}

/** Suma de un campo Decimal (equivale a `_sum` de Prisma: null si no hay valores). */
export function sumar<T>(items: T[], campo: (item: T) => unknown): number | null {
  let total = 0
  let alguno = false
  for (const item of items) {
    const v = campo(item)
    if (v === null || v === undefined) continue
    total += Number(v)
    alguno = true
  }
  return alguno ? total : null
}

type Dir = 'asc' | 'desc'
type Criterio<T> = [(item: T) => unknown, Dir]

function comparable(v: unknown): number | string | null {
  if (v === null || v === undefined) return null
  if (v instanceof Date) return v.getTime()
  if (Prisma.Decimal.isDecimal(v)) return Number(v)
  if (typeof v === 'boolean') return v ? 1 : 0
  return v as number | string
}

/**
 * Orden estable con semántica de Postgres: en ASC los null van al final y en
 * DESC al principio. Nunca muta el arreglo original.
 */
export function ordenar<T>(items: readonly T[], ...criterios: Criterio<T>[]): T[] {
  return [...items].sort((a, b) => {
    for (const [campo, dir] of criterios) {
      const va = comparable(campo(a))
      const vb = comparable(campo(b))
      if (va === vb) continue
      if (va === null) return dir === 'asc' ? 1 : -1
      if (vb === null) return dir === 'asc' ? -1 : 1
      const cmp = typeof va === 'string' && typeof vb === 'string' ? (va < vb ? -1 : 1) : (va as number) - (vb as number)
      if (cmp !== 0) return dir === 'asc' ? cmp : -cmp
    }
    return 0
  })
}

/** `contains` + `mode: 'insensitive'` de Prisma. */
export function contieneSinMayusculas(texto: string | null | undefined, termino: string): boolean {
  if (!texto) return false
  return texto.toLowerCase().includes(termino.toLowerCase())
}

export function categoriaPorKey(catalogo: Catalogo, key: CategoriaEnum | string) {
  return catalogo.categorias.find((c) => c.key === key) ?? null
}

/** Primeras `n` imágenes del proyecto (ya vienen en orden asc). */
export function imagenesTop(p: ProyectoConImagenes, n = 1) {
  return p.imagenes.slice(0, n).map((i) => ({ url: i.url, urlOptimized: i.urlOptimized, alt: i.alt }))
}
