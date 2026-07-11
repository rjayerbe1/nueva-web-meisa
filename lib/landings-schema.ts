// Validación zod del Json `contenido` de LandingSeo, por tipo.
// Usado por:
//   - /api/admin/landings/[id] (PUT) — rechaza contenido mal formado
//   - lib/content/landings.ts — valida antes de servir a las páginas públicas
//     (si no valida, la página cae al config en código).
import { z } from 'zod'

export const CATEGORIA_ENUM_VALUES = [
  'COMERCIAL',
  'INDUSTRIAL',
  'PUENTES',
  'INFRAESTRUCTURA_URBANA',
  'EDIFICACIONES',
  'DEPORTES_EDUCACION',
] as const

const categoriaEnum = z.enum(CATEGORIA_ENUM_VALUES)

const faqItem = z.object({ pregunta: z.string(), respuesta: z.string() })
const nombreDescripcion = z.object({ nombre: z.string(), descripcion: z.string() })
// Ítem de sección de guía con apoyo visual opcional.
//   - ilustracion: imagen subida, centrada y de altura contenida (tipos)
//   - imagen / categoria: foto a sangre del tile (usos)
const guiaSeccionItem = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  ilustracion: z.string().optional(),
  imagen: z.string().optional(),
  categoria: z.string().optional(),
})
const tituloDescripcion = z.object({ titulo: z.string(), descripcion: z.string() })
const statValorLabel = z.object({ valor: z.string(), label: z.string() })
const statConSufijo = z.object({
  valor: z.string(),
  sufijo: z.string().optional().default(''),
  label: z.string(),
})
const linkRelacionado = z.object({
  href: z.string(),
  eyebrow: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
})

/* ─── SOLUCION (lib/soluciones.ts → Solucion sin slug/meta) ──────────── */

export const solucionContenidoSchema = z
  .object({
    keywordH1: z.string().min(1),
    heroEyebrow: z.string(),
    heroTitulo1: z.string().min(1),
    heroTitulo2: z.string(),
    // Si está vacío, la página usa imagenCover de la categoría como fallback.
    heroImagen: z.string().optional(),
    intro: z.string().min(1),
    secciones: z.array(
      z.object({
        titulo: z.string(),
        parrafos: z.array(z.string()),
        bullets: z.array(z.string()).optional(),
      }),
    ),
    tiposDeEstructura: z.array(nombreDescripcion),
    ventajas: z.array(z.string()),
    procesoResumen: z.array(tituloDescripcion),
    faq: z.array(faqItem),
    proyectosIntro: z.string(),
    categoriaEnum: categoriaEnum,
    categoriaSlug: z.string().min(1),
    statsPropios: z.array(statValorLabel),
  })
  .passthrough()

/* ─── CIUDAD (lib/ciudades.ts → CiudadConfig sin slug/meta) ──────────── */

export const ciudadContenidoSchema = z
  .object({
    nombre: z.string().min(1),
    h1: z.string().min(1),
    heroCategoriaKey: categoriaEnum,
    // Si está vacío, la página usa imagenCover de heroCategoriaKey como fallback.
    heroImagen: z.string().optional(),
    heroEyebrow: z.string(),
    heroTitulo1: z.string(),
    heroTitulo2: z.string(),
    heroDescripcion: z.string(),
    introEyebrow: z.string(),
    introTitulo1: z.string(),
    introTitulo2: z.string(),
    intro: z.array(z.string()),
    statProyectosLabel: z.string(),
    statToneladasLabel: z.string(),
    statsFijas: z.array(statConSufijo),
    seccionesEyebrow: z.string(),
    seccionesTitulo1: z.string(),
    seccionesTitulo2: z.string(),
    secciones: z.array(nombreDescripcion),
    ventajaEyebrow: z.string(),
    ventajaTitulo: z.string(),
    ventaja: z.array(z.string()),
    proyectosTitulo2: z.string(),
    proyectosDescripcion: z.string(),
    faqTitulo1: z.string(),
    faqTitulo2: z.string(),
    faq: z.array(faqItem),
    relacionadas: z.array(linkRelacionado),
    ctaEyebrow: z.string(),
    ctaTitulo1: z.string(),
    ctaTitulo2: z.string(),
    ctaDescripcion: z.string(),
    terminosUbicacion: z.array(z.string().min(1)).min(1),
  })
  .passthrough()

/* ─── GUIA (lib/guias.ts → GuiaContenido, dos variantes) ─────────────── */

export const guiaTemplateContenidoSchema = z
  .object({
    variante: z.literal('template'),
    path: z.string().min(1),
    breadcrumbName: z.string().min(1),
    heroEyebrow: z.string(),
    heroTitulo1: z.string(),
    heroTitulo2: z.string(),
    heroSub: z.string(),
    introEyebrow: z.string(),
    introTitulo1: z.string(),
    introTitulo2: z.string(),
    intro: z.string(),
    categoriaHero: categoriaEnum,
    // Si está vacío, la página usa imagenCover de categoriaHero como fallback.
    heroImagen: z.string().optional(),
    stats: z.array(statConSufijo),
    secciones: z.array(
      z.object({
        titulo: z.string(),
        parrafos: z.array(z.string()),
        items: z.array(guiaSeccionItem).optional(),
      }),
    ),
    proceso: z.array(tituloDescripcion).optional(),
    procesoTitulo1: z.string().optional(),
    procesoTitulo2: z.string().optional(),
    // Video destacado (facade YouTube + VideoObject) — opcional.
    video: z
      .object({
        videoId: z.string().min(1),
        obra: z.string(),
        titulo: z.string(),
        descripcion: z.string(),
        poster: z.string(),
        uploadDate: z.string(),
        duration: z.string(),
      })
      .optional(),
    proyectosSlugs: z.array(z.string()),
    proyectosIntro: z.string(),
    faq: z.array(faqItem),
    faqTitulo1: z.string(),
    faqTitulo2: z.string(),
    relacionados: z.array(linkRelacionado),
    ctaEyebrow: z.string(),
    ctaTitulo1: z.string(),
    ctaTitulo2: z.string(),
    ctaDescripcion: z.string(),
  })
  .passthrough()

export const guiaPreciosContenidoSchema = z
  .object({
    variante: z.literal('precios'),
    heroEyebrow: z.string(),
    heroTitulo1: z.string(),
    heroTitulo2: z.string(),
    heroSub: z.string(),
    // Si está vacío, la página usa imagenCover de INDUSTRIAL como fallback.
    heroImagen: z.string().optional(),
    breadcrumbName: z.string(),
    cotizacionEyebrow: z.string(),
    cotizacionTitulo1: z.string(),
    cotizacionTitulo2: z.string(),
    cotizacionParrafos: z.array(z.string()),
    rangosEyebrow: z.string(),
    rangosTitulo1: z.string(),
    rangosTitulo2: z.string(),
    rangosSubtitulo: z.string(),
    rangos: z.array(
      z.object({
        tipo: z.string().min(1),
        ejemplos: z.string(),
        rango: z.string().min(1),
      }),
    ),
    rangosNota: z.string(),
    factoresEyebrow: z.string(),
    factoresTitulo1: z.string(),
    factoresTitulo2: z.string(),
    factores: z.array(tituloDescripcion),
    conversionEyebrow: z.string(),
    conversionTitulo1: z.string(),
    conversionTitulo2: z.string(),
    conversionParrafos: z.array(z.string()),
    faqTitulo1: z.string(),
    faqTitulo2: z.string(),
    faq: z.array(faqItem),
    ctaEyebrow: z.string(),
    ctaTitulo1: z.string(),
    ctaTitulo2: z.string(),
    ctaDescripcion: z.string(),
  })
  .passthrough()

export const guiaContenidoSchema = z.discriminatedUnion('variante', [
  guiaTemplateContenidoSchema,
  guiaPreciosContenidoSchema,
])

/* ─── PILAR (lib/pilar.ts → PilarConfig sin slug/meta) ───────────────── */

export const pilarContenidoSchema = z
  .object({
    // Si está vacío, la página usa imagenCover de PUENTES como fallback.
    heroImagen: z.string().optional(),
    heroEyebrow: z.string(),
    heroTitulo1: z.string().min(1),
    heroTitulo2: z.string(),
    heroDescripcion: z.string(),
    introEyebrow: z.string(),
    introTitulo1: z.string(),
    introTitulo2: z.string(),
    intro: z.array(z.string()),
    statProyectosLabel: z.string(),
    statToneladasLabel: z.string(),
    statsFijas: z.array(statConSufijo),
    solucionesEyebrow: z.string(),
    solucionesTitulo1: z.string(),
    solucionesTitulo2: z.string(),
    soluciones: z.array(
      z.object({
        href: z.string().min(1),
        titulo: z.string().min(1),
        descripcion: z.string(),
      }),
    ),
    ventajaEyebrow: z.string(),
    ventajaTitulo: z.string(),
    ventaja: z.array(z.string()),
    ciudadesEyebrow: z.string(),
    ciudadesTitulo: z.string(),
    ciudades: z.array(
      z.object({
        href: z.string().min(1),
        nombre: z.string().min(1),
        descripcion: z.string(),
      }),
    ),
    guiasEyebrow: z.string(),
    guiasTitulo: z.string(),
    faqTitulo1: z.string(),
    faqTitulo2: z.string(),
    faq: z.array(faqItem),
    ctaEyebrow: z.string(),
    ctaTitulo1: z.string(),
    ctaTitulo2: z.string(),
    ctaDescripcion: z.string(),
  })
  .passthrough()

/* ─── Helpers ─────────────────────────────────────────────────────────── */

export type LandingTipoStr = 'SOLUCION' | 'GUIA' | 'CIUDAD' | 'PILAR'

export function contenidoSchemaForTipo(tipo: LandingTipoStr) {
  switch (tipo) {
    case 'SOLUCION':
      return solucionContenidoSchema
    case 'CIUDAD':
      return ciudadContenidoSchema
    case 'GUIA':
      return guiaContenidoSchema
    case 'PILAR':
      return pilarContenidoSchema
  }
}

/** Path público de una landing según su tipo. */
export function landingPublicPath(tipo: LandingTipoStr, slug: string): string {
  switch (tipo) {
    case 'SOLUCION':
      return `/soluciones/${slug}`
    case 'CIUDAD':
      return `/estructuras-metalicas/${slug}`
    case 'GUIA':
      return `/${slug}`
    case 'PILAR':
      return `/${slug}`
  }
}
