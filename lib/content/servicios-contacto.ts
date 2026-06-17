import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  ProcesoFase,
  FormOption,
  ConfiguracionContacto,
} from "@prisma/client"

export type ProcesoFaseItem = ProcesoFase
export type FormOptionItem = FormOption
export type ContactoConfig = ConfiguracionContacto

export const getProcesoFases = cache(async () => {
  return prisma.procesoFase.findMany({
    where: { activo: true },
    orderBy: { numero: "asc" },
  })
})

export async function getAllProcesoFases() {
  return prisma.procesoFase.findMany({ orderBy: { numero: "asc" } })
}

// ── Página /servicios (contenido editable: hero, cifras, intro proceso, sectores, CTA) ──

export interface ServiciosStatConfig {
  clave: string // "anios" | "proyectos" | "toneladas" | "m2" | "" (literal)
  valor: string // "AUTO" para calcular desde la DB, o un valor literal
  sufijo: string
  label: string
}
export interface ServiciosSectorItem {
  label: string
  desc: string
  slug: string
}
export interface ServiciosPaginaData {
  heroEyebrow: string
  heroTitulo1: string
  heroTitulo2: string
  heroParrafo: string
  stats: ServiciosStatConfig[]
  procesoEyebrow: string
  procesoTitulo1: string
  procesoTitulo2: string
  procesoParrafo: string
  sectoresEyebrow: string
  sectoresTitulo1: string
  sectoresTitulo2: string
  sectoresParrafo: string
  sectores: ServiciosSectorItem[]
  ctaEyebrow: string
  ctaTitulo1: string
  ctaTitulo2: string
  ctaParrafo: string
  ctaPrimarioTexto: string
  ctaPrimarioHref: string
  ctaSecundarioTexto: string
  ctaSecundarioHref: string
}

// Defaults = contenido actual de la página. Se usan si falta la fila o un campo.
// Token {anios} se reemplaza por los años de experiencia al renderizar.
export const SERVICIOS_PAGINA_DEFAULTS: ServiciosPaginaData = {
  heroEyebrow: "Servicios integrales — {anios}+ años de experiencia",
  heroTitulo1: "Soluciones",
  heroTitulo2: "en acero.",
  heroParrafo:
    "Diseñamos, fabricamos en plantas propias y montamos en obra. Un solo equipo controla todo el flujo —del modelo BIM al acero instalado— bajo un mismo Sistema Integrado de Gestión.",
  stats: [
    { clave: "anios", valor: "AUTO", sufijo: "+", label: "Años de experiencia" },
    { clave: "proyectos", valor: "AUTO", sufijo: "+", label: "Proyectos entregados" },
    { clave: "toneladas", valor: "AUTO", sufijo: "+", label: "Toneladas de acero" },
    { clave: "m2", valor: "AUTO", sufijo: "+", label: "m² construidos" },
  ],
  procesoEyebrow: "Metodología",
  procesoTitulo1: "Proceso",
  procesoTitulo2: "integral.",
  procesoParrafo:
    "Un enfoque sistemático que garantiza resultados excepcionales en cada proyecto, desde la conceptualización hasta la entrega final.",
  sectoresEyebrow: "Dónde trabajamos",
  sectoresTitulo1: "Sectores",
  sectoresTitulo2: "que atendemos.",
  sectoresParrafo:
    "Seis frentes en los que hemos construido en acero a lo largo del país. Cada uno con su propia ingeniería, normativa y logística.",
  sectores: [
    { label: "Edificaciones", desc: "Edificios institucionales, oficinas y vivienda en altura.", slug: "edificios-en-estructura-metalica" },
    { label: "Bodegas e industria", desc: "Naves industriales, bodegas y plantas de proceso.", slug: "estructura-metalica-para-bodegas" },
    { label: "Centros comerciales", desc: "Construcción y ampliación de centros comerciales.", slug: "estructura-metalica-centros-comerciales" },
    { label: "Puentes", desc: "Puentes vehiculares y peatonales en acero.", slug: "puentes-metalicos" },
    { label: "Escenarios deportivos", desc: "Coliseos, estadios y complejos deportivos.", slug: "estructura-metalica-escenarios-deportivos" },
    { label: "Cubiertas y fachadas", desc: "Cubiertas de gran luz y fachadas metálicas.", slug: "cubiertas-metalicas" },
  ],
  ctaEyebrow: "Trabajemos juntos",
  ctaTitulo1: "Tu próximo",
  ctaTitulo2: "proyecto.",
  ctaParrafo:
    "Con {anios}+ años de experiencia, más de 260 proyectos y 32.000 toneladas entregadas, estamos listos para ejecutar tu visión en acero.",
  ctaPrimarioTexto: "Solicitar cotización",
  ctaPrimarioHref: "/contacto",
  ctaSecundarioTexto: "Ver proyectos",
  ctaSecundarioHref: "/proyectos",
}

export const getServiciosPagina = cache(async (): Promise<ServiciosPaginaData> => {
  const D = SERVICIOS_PAGINA_DEFAULTS
  try {
    const row = await prisma.serviciosPagina.findUnique({ where: { id: "default" } })
    if (!row) return D
    const stats = Array.isArray(row.stats) && (row.stats as unknown[]).length > 0
      ? (row.stats as unknown as ServiciosStatConfig[])
      : D.stats
    const sectores = Array.isArray(row.sectores) && (row.sectores as unknown[]).length > 0
      ? (row.sectores as unknown as ServiciosSectorItem[])
      : D.sectores
    return {
      heroEyebrow: row.heroEyebrow ?? D.heroEyebrow,
      heroTitulo1: row.heroTitulo1 ?? D.heroTitulo1,
      heroTitulo2: row.heroTitulo2 ?? D.heroTitulo2,
      heroParrafo: row.heroParrafo ?? D.heroParrafo,
      stats,
      procesoEyebrow: row.procesoEyebrow ?? D.procesoEyebrow,
      procesoTitulo1: row.procesoTitulo1 ?? D.procesoTitulo1,
      procesoTitulo2: row.procesoTitulo2 ?? D.procesoTitulo2,
      procesoParrafo: row.procesoParrafo ?? D.procesoParrafo,
      sectoresEyebrow: row.sectoresEyebrow ?? D.sectoresEyebrow,
      sectoresTitulo1: row.sectoresTitulo1 ?? D.sectoresTitulo1,
      sectoresTitulo2: row.sectoresTitulo2 ?? D.sectoresTitulo2,
      sectoresParrafo: row.sectoresParrafo ?? D.sectoresParrafo,
      sectores,
      ctaEyebrow: row.ctaEyebrow ?? D.ctaEyebrow,
      ctaTitulo1: row.ctaTitulo1 ?? D.ctaTitulo1,
      ctaTitulo2: row.ctaTitulo2 ?? D.ctaTitulo2,
      ctaParrafo: row.ctaParrafo ?? D.ctaParrafo,
      ctaPrimarioTexto: row.ctaPrimarioTexto ?? D.ctaPrimarioTexto,
      ctaPrimarioHref: row.ctaPrimarioHref ?? D.ctaPrimarioHref,
      ctaSecundarioTexto: row.ctaSecundarioTexto ?? D.ctaSecundarioTexto,
      ctaSecundarioHref: row.ctaSecundarioHref ?? D.ctaSecundarioHref,
    }
  } catch {
    return D
  }
})

export const getTiposProyecto = cache(async () => {
  return prisma.formOption.findMany({
    where: { grupo: "TIPO_PROYECTO", activo: true },
    orderBy: { orden: "asc" },
  })
})

export const getServiciosContacto = cache(async () => {
  return prisma.formOption.findMany({
    where: { grupo: "SERVICIO_CONTACTO", activo: true },
    orderBy: { orden: "asc" },
  })
})

export async function getAllFormOptions() {
  return prisma.formOption.findMany({
    orderBy: [{ grupo: "asc" }, { orden: "asc" }],
  })
}

export const getConfiguracionContacto = cache(async () => {
  return prisma.configuracionContacto.findUnique({ where: { id: "default" } })
})

export type ContactoData = {
  config: ContactoConfig | null
  tiposProyecto: FormOption[]
  serviciosContacto: FormOption[]
}

export async function getContactoData(): Promise<ContactoData> {
  const [config, tiposProyecto, serviciosContacto] = await Promise.all([
    getConfiguracionContacto(),
    getTiposProyecto(),
    getServiciosContacto(),
  ])
  return { config, tiposProyecto, serviciosContacto }
}
