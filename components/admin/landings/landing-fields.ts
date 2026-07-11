// Definición declarativa de las secciones del editor de landings SEO
// (/admin/landings/[id]) por tipo y variante. Los `name` de cada campo
// corresponden 1:1 con las keys del Json `contenido` de LandingSeo
// (ver lib/soluciones.ts, lib/ciudades.ts, lib/guias.ts).
import type { FieldDef } from "@/components/admin/shared/FormFields"
import { CATEGORIA_ENUM_VALUES } from "@/lib/landings-schema"

/** Campo extendido: FieldDef estándar o widget especial del editor. */
export type LandingFieldDef =
  | (FieldDef & { widget?: undefined })
  | {
      widget: "tags"
      name: string
      label: string
      hint?: string
      placeholder?: string
    }

export interface LandingSection {
  id: string
  title: string
  description?: string
  fields: LandingFieldDef[]
}

const CATEGORIA_LABELS: Record<string, string> = {
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
  PUENTES: "Puentes",
  INFRAESTRUCTURA_URBANA: "Infraestructura urbana",
  EDIFICACIONES: "Edificaciones",
  DEPORTES_EDUCACION: "Deportes y educación",
}

const CATEGORIA_OPTIONS = CATEGORIA_ENUM_VALUES.map((v) => ({
  value: v,
  label: CATEGORIA_LABELS[v] ?? v,
}))

/* ─── Helpers de campos repetidos ─────────────────────────────────────── */

/**
 * Selector de imagen del hero. Si se deja vacío, la página pública cae a la
 * imagenCover de la categoría asociada (comportamiento histórico).
 */
const heroImagenField = (fallbackHint: string): FieldDef => ({
  name: "heroImagen",
  label: "Imagen del hero (portada)",
  kind: "image",
  gridSpan: 2,
  hint: `Imagen de fondo del encabezado. Si se deja vacía, ${fallbackHint}`,
})

const faqField = (name = "faq"): FieldDef => ({
  name,
  label: "Preguntas frecuentes",
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  itemLabel: (item, i) =>
    (item.pregunta as string) || `Pregunta ${String(i + 1).padStart(2, "0")}`,
  itemTemplate: { pregunta: "", respuesta: "" },
  itemFields: [
    { name: "pregunta", label: "Pregunta", kind: "text", gridSpan: 2, required: true },
    {
      name: "respuesta",
      label: "Respuesta",
      kind: "textarea",
      rows: 5,
      gridSpan: 2,
      required: true,
    },
  ],
})

const linksRelacionados = (name: string, label: string): FieldDef => ({
  name,
  label,
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  itemLabel: (item, i) =>
    (item.titulo as string) || `Link ${String(i + 1).padStart(2, "0")}`,
  itemTemplate: { href: "", eyebrow: "Solución", titulo: "", descripcion: "" },
  itemFields: [
    {
      name: "href",
      label: "Ruta interna",
      kind: "text",
      placeholder: "/soluciones/…",
      gridSpan: 1,
    },
    { name: "eyebrow", label: "Eyebrow", kind: "text", gridSpan: 1 },
    { name: "titulo", label: "Título", kind: "text", gridSpan: 2 },
    { name: "descripcion", label: "Descripción", kind: "textarea", rows: 3, gridSpan: 2 },
  ],
})

const tituloDescripcionArray = (
  name: string,
  label: string,
  hint?: string,
): FieldDef => ({
  name,
  label,
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  itemLabel: (item, i) =>
    (item.titulo as string) || `Paso ${String(i + 1).padStart(2, "0")}`,
  itemTemplate: { titulo: "", descripcion: "" },
  itemFields: [
    { name: "titulo", label: "Título", kind: "text", gridSpan: 2 },
    { name: "descripcion", label: "Descripción", kind: "textarea", rows: 4, gridSpan: 2 },
  ],
  hint,
})

const nombreDescripcionArray = (
  name: string,
  label: string,
  hint?: string,
): FieldDef => ({
  name,
  label,
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  itemLabel: (item, i) =>
    (item.nombre as string) || `Ítem ${String(i + 1).padStart(2, "0")}`,
  itemTemplate: { nombre: "", descripcion: "" },
  itemFields: [
    { name: "nombre", label: "Nombre", kind: "text", gridSpan: 2 },
    { name: "descripcion", label: "Descripción", kind: "textarea", rows: 4, gridSpan: 2 },
  ],
  hint,
})

/* ─── SOLUCION ────────────────────────────────────────────────────────── */

const SOLUCION_SECTIONS: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    description: "Encabezado de la página: eyebrow y título en dos líneas.",
    fields: [
      { name: "heroEyebrow", label: "Eyebrow", kind: "text" },
      {
        name: "keywordH1",
        label: "Keyword principal (H1 / schema)",
        kind: "text",
        hint: "Se usa en el alt de imágenes y en el ServiceSchema.",
      },
      { name: "heroTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      heroImagenField("se usa la imagen de portada de la categoría asociada."),
    ],
  },
  {
    id: "intro",
    title: "Intro",
    description: "Párrafo editorial de apertura (Patrón A).",
    fields: [
      {
        name: "intro",
        label: "Párrafo de introducción",
        kind: "textarea",
        rows: 7,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "secciones",
    title: "Secciones de contenido",
    description:
      "Bloques editoriales: título + párrafos y bullets opcionales. Se pueden agregar, quitar y reordenar.",
    fields: [
      {
        name: "secciones",
        label: "Secciones",
        kind: "objectArray",
        gridSpan: 2,
        collapsible: true,
        itemLabel: (item, i) =>
          (item.titulo as string) || `Sección ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { titulo: "", parrafos: [], bullets: [] },
        itemFields: [
          { name: "titulo", label: "Título de la sección", kind: "text", gridSpan: 2 },
          {
            name: "parrafos",
            label: "Párrafos",
            kind: "stringArray",
            multiline: true,
            rows: 5,
            gridSpan: 2,
          },
          {
            name: "bullets",
            label: "Bullets (opcional)",
            kind: "stringArray",
            multiline: true,
            rows: 2,
            gridSpan: 2,
          },
        ],
      },
    ],
  },
  {
    id: "tipos",
    title: "Tipos de estructura",
    description: "Lista citable (AI Overviews): nombre + descripción por tipología.",
    fields: [nombreDescripcionArray("tiposDeEstructura", "Tipologías")],
  },
  {
    id: "ventajas",
    title: "Ventajas",
    fields: [
      {
        name: "ventajas",
        label: "Ventajas (una por línea)",
        kind: "stringArray",
        multiline: true,
        rows: 2,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "proceso",
    title: "Proceso (4 pasos)",
    description: "Diseño BIM → fabricación CNC → logística → montaje.",
    fields: [tituloDescripcionArray("procesoResumen", "Pasos del proceso")],
  },
  {
    id: "proyectos",
    title: "Proyectos que nos respaldan",
    fields: [
      {
        name: "proyectosIntro",
        label: "Párrafo de apertura de la sección",
        kind: "textarea",
        rows: 5,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [faqField()],
  },
  {
    id: "datos",
    title: "Datos y categoría",
    description:
      "Vinculación con la base de proyectos (cover, aggregates, top proyectos) y stats fijas.",
    fields: [
      {
        name: "categoriaEnum",
        label: "Categoría de proyectos",
        kind: "select",
        options: CATEGORIA_OPTIONS,
      },
      {
        name: "categoriaSlug",
        label: "Slug de la categoría",
        kind: "text",
        hint: "Para links a /proyectos/categoria/[slug].",
      },
      {
        name: "statsPropios",
        label: "Stats propias (las de proyectos/toneladas salen de la DB)",
        kind: "objectArray",
        gridSpan: 2,
        itemLabel: (item, i) =>
          (item.label as string) || `Stat ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { valor: "", label: "" },
        itemFields: [
          { name: "valor", label: "Valor", kind: "text" },
          { name: "label", label: "Label", kind: "text" },
        ],
      },
    ],
  },
]

/* ─── CIUDAD ──────────────────────────────────────────────────────────── */

const CIUDAD_SECTIONS: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      { name: "nombre", label: "Nombre corto de la ciudad", kind: "text" },
      { name: "h1", label: "H1 completo", kind: "text" },
      {
        name: "heroCategoriaKey",
        label: "Categoría del hero (imagen de respaldo)",
        kind: "select",
        options: CATEGORIA_OPTIONS,
      },
      heroImagenField("se usa la imagen de portada de la categoría seleccionada arriba."),
      { name: "heroEyebrow", label: "Eyebrow", kind: "text" },
      { name: "heroTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "heroDescripcion",
        label: "Descripción del hero",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "intro",
    title: "Intro editorial",
    fields: [
      { name: "introEyebrow", label: "Eyebrow", kind: "text" },
      { name: "introTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "introTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "intro",
        label: "Párrafos de la intro",
        kind: "stringArray",
        multiline: true,
        rows: 6,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "stats",
    title: "Stats",
    description:
      "Las cifras de proyectos y toneladas se calculan desde la DB; aquí se editan los labels y las 2 stats fijas.",
    fields: [
      { name: "statProyectosLabel", label: "Label — stat de proyectos", kind: "text" },
      { name: "statToneladasLabel", label: "Label — stat de toneladas", kind: "text" },
      {
        name: "statsFijas",
        label: "Stats fijas (completan el strip de 4)",
        kind: "objectArray",
        gridSpan: 2,
        itemLabel: (item, i) =>
          (item.label as string) || `Stat ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { valor: "", sufijo: "", label: "" },
        itemFields: [
          { name: "valor", label: "Valor", kind: "text" },
          { name: "sufijo", label: "Sufijo (ej. +)", kind: "text" },
          { name: "label", label: "Label", kind: "text", gridSpan: 2 },
        ],
      },
    ],
  },
  {
    id: "sectores",
    title: "Qué construimos (sectores)",
    fields: [
      { name: "seccionesEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "seccionesTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "seccionesTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      nombreDescripcionArray("secciones", "Tiles numerados de sectores"),
    ],
  },
  {
    id: "ventaja",
    title: "Ventaja local",
    fields: [
      { name: "ventajaEyebrow", label: "Eyebrow", kind: "text" },
      { name: "ventajaTitulo", label: "Título", kind: "text" },
      {
        name: "ventaja",
        label: "Párrafos",
        kind: "stringArray",
        multiline: true,
        rows: 5,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "proyectos",
    title: "Proyectos destacados",
    fields: [
      {
        name: "proyectosTitulo2",
        label: "Título — línea 2 (\"Proyectos destacados …\")",
        kind: "text",
      },
      {
        name: "proyectosDescripcion",
        label: "Descripción",
        kind: "textarea",
        rows: 4,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      { name: "faqTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "faqTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      faqField(),
    ],
  },
  {
    id: "relacionadas",
    title: "Soluciones relacionadas",
    fields: [linksRelacionados("relacionadas", "Cross-links")],
  },
  {
    id: "cta",
    title: "CTA final",
    fields: [
      { name: "ctaEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "ctaTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "ctaTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "ctaDescripcion",
        label: "Descripción",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "ubicacion",
    title: "Términos de ubicación",
    description:
      "Términos para el query (OR contains, sin tildes parciales: \"Jamund\" cubre Jamundí/Jamundi) que selecciona los proyectos de la ciudad.",
    fields: [
      {
        widget: "tags",
        name: "terminosUbicacion",
        label: "Términos de búsqueda sobre Proyecto.ubicacion",
        placeholder: "Escribe un término y Enter…",
      },
    ],
  },
]

/* ─── GUIA — variante template ────────────────────────────────────────── */

const GUIA_TEMPLATE_SECTIONS: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      { name: "heroEyebrow", label: "Eyebrow", kind: "text" },
      {
        name: "breadcrumbName",
        label: "Nombre en breadcrumb",
        kind: "text",
      },
      { name: "heroTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "heroSub",
        label: "Subtítulo del hero",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
      {
        name: "categoriaHero",
        label: "Categoría del hero (imagen de respaldo)",
        kind: "select",
        options: CATEGORIA_OPTIONS,
      },
      heroImagenField("se usa la imagen de portada de la categoría seleccionada arriba."),
      {
        name: "path",
        label: "Path canónico",
        kind: "text",
        hint: "No cambiar: debe coincidir con la ruta pública.",
      },
    ],
  },
  {
    id: "intro",
    title: "Intro editorial",
    fields: [
      { name: "introEyebrow", label: "Eyebrow", kind: "text" },
      { name: "introTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "introTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "intro",
        label: "Párrafo de introducción",
        kind: "textarea",
        rows: 7,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "stats",
    title: "Stats",
    fields: [
      {
        name: "stats",
        label: "Strip de 4 stats",
        kind: "objectArray",
        gridSpan: 2,
        itemLabel: (item, i) =>
          (item.label as string) || `Stat ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { valor: "", sufijo: "", label: "" },
        itemFields: [
          { name: "valor", label: "Valor", kind: "text" },
          { name: "sufijo", label: "Sufijo (ej. +)", kind: "text" },
          { name: "label", label: "Label", kind: "text", gridSpan: 2 },
        ],
      },
    ],
  },
  {
    id: "secciones",
    title: "Secciones de contenido",
    description:
      "Bloques editoriales: título + párrafos. Si la sección tiene ítems, se renderiza como grid de tiles numerados.",
    fields: [
      {
        name: "secciones",
        label: "Secciones",
        kind: "objectArray",
        gridSpan: 2,
        collapsible: true,
        itemLabel: (item, i) =>
          (item.titulo as string) || `Sección ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { titulo: "", parrafos: [], items: [] },
        itemFields: [
          { name: "titulo", label: "Título de la sección", kind: "text", gridSpan: 2 },
          {
            name: "parrafos",
            label: "Párrafos",
            kind: "stringArray",
            multiline: true,
            rows: 5,
            gridSpan: 2,
          },
          {
            name: "items",
            label: "Ítems (tiles numerados, opcional)",
            kind: "objectArray",
            gridSpan: 2,
            collapsible: true,
            itemLabel: (item, i) =>
              (item.nombre as string) || `Tile ${String(i + 1).padStart(2, "0")}`,
            itemTemplate: { nombre: "", descripcion: "" },
            itemFields: [
              { name: "nombre", label: "Nombre", kind: "text", gridSpan: 2 },
              {
                name: "descripcion",
                label: "Descripción",
                kind: "textarea",
                rows: 4,
                gridSpan: 2,
              },
              {
                name: "ilustracion",
                label: "Ilustración (imagen centrada)",
                kind: "image",
                gridSpan: 2,
                hint: "Imagen del tipo que se muestra centrada y de altura contenida sobre fondo blanco. Tiene prioridad sobre la foto.",
              },
              {
                name: "categoria",
                label: "Foto desde categoría (a sangre)",
                kind: "select",
                options: [
                  { value: "", label: "— Sin foto de categoría" },
                  ...CATEGORIA_OPTIONS,
                ],
                gridSpan: 1,
                hint: "Usa la portada de la categoría como foto a sangre del tile (si no hay ilustración).",
              },
              {
                name: "imagen",
                label: "Foto propia a sangre (opcional)",
                kind: "image",
                gridSpan: 1,
                hint: "Foto específica a sangre. Sobrescribe la foto de categoría.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "proceso",
    title: "Proceso",
    fields: [
      { name: "procesoTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "procesoTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      tituloDescripcionArray("proceso", "Pasos del proceso"),
    ],
  },
  {
    id: "proyectos",
    title: "Proyectos que nos respaldan",
    fields: [
      {
        name: "proyectosIntro",
        label: "Párrafo de apertura",
        kind: "textarea",
        rows: 5,
        gridSpan: 2,
      },
      {
        widget: "tags",
        name: "proyectosSlugs",
        label: "Slugs de proyectos insignia (orden curado)",
        hint: "Slugs de /proyectos/detalle/[slug] — se resuelven contra la DB.",
        placeholder: "slug-del-proyecto + Enter…",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      { name: "faqTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "faqTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      faqField(),
    ],
  },
  {
    id: "relacionados",
    title: "Guías y soluciones relacionadas",
    fields: [linksRelacionados("relacionados", "Cross-links")],
  },
  {
    id: "cta",
    title: "CTA final",
    fields: [
      { name: "ctaEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "ctaTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "ctaTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "ctaDescripcion",
        label: "Descripción",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
]

/* ─── GUIA — variante precios ─────────────────────────────────────────── */

const GUIA_PRECIOS_SECTIONS: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      { name: "heroEyebrow", label: "Eyebrow", kind: "text" },
      { name: "breadcrumbName", label: "Nombre en breadcrumb", kind: "text" },
      { name: "heroTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "heroSub",
        label: "Subtítulo del hero",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
      heroImagenField("se usa la imagen de portada de la categoría Industrial."),
    ],
  },
  {
    id: "cotizacion",
    title: "Cómo se cotiza",
    fields: [
      { name: "cotizacionEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "cotizacionTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "cotizacionTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "cotizacionParrafos",
        label: "Párrafos",
        kind: "stringArray",
        multiline: true,
        rows: 5,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "rangos",
    title: "Tabla de rangos de precio",
    description:
      "Filas de la tabla COP/kg instalado: etiqueta del tipo, ejemplos y rango.",
    fields: [
      { name: "rangosEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "rangosTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "rangosTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "rangosSubtitulo",
        label: "Subtítulo sobre la tabla",
        kind: "text",
        gridSpan: 2,
      },
      {
        name: "rangos",
        label: "Filas de la tabla",
        kind: "objectArray",
        gridSpan: 2,
        itemLabel: (item, i) =>
          (item.tipo as string) || `Rango ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { tipo: "", ejemplos: "", rango: "" },
        itemFields: [
          { name: "tipo", label: "Etiqueta (tipo de estructura)", kind: "text", gridSpan: 2 },
          {
            name: "ejemplos",
            label: "Descripción / ejemplos",
            kind: "textarea",
            rows: 2,
            gridSpan: 2,
          },
          {
            name: "rango",
            label: "Rango COP/kg",
            kind: "text",
            placeholder: "$10.900 – $13.000",
            gridSpan: 2,
          },
        ],
      },
      {
        name: "rangosNota",
        label: "Nota bajo la tabla (se antepone \"Nota:\" en negrita)",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "factores",
    title: "Qué hace variar el precio",
    fields: [
      { name: "factoresEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "factoresTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "factoresTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      tituloDescripcionArray("factores", "Factores (tiles numerados)"),
    ],
  },
  {
    id: "conversion",
    title: "Conversión a m²",
    fields: [
      { name: "conversionEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "conversionTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "conversionTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "conversionParrafos",
        label: "Párrafos (admiten **negrita** con doble asterisco)",
        kind: "stringArray",
        multiline: true,
        rows: 5,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      { name: "faqTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "faqTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      faqField(),
    ],
  },
  {
    id: "cta",
    title: "CTA final",
    fields: [
      { name: "ctaEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "ctaTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "ctaTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "ctaDescripcion",
        label: "Descripción",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
]

/* ─── PILAR (lib/pilar.ts → página /estructuras-metalicas-colombia) ───── */

const PILAR_SECTIONS: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      heroImagenField("se usa la imagen de portada de la categoría Puentes."),
      { name: "heroEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "heroTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "heroTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "heroDescripcion",
        label: "Descripción del hero",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "intro",
    title: "Intro editorial",
    fields: [
      { name: "introEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "introTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "introTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "intro",
        label: "Párrafos de la intro",
        kind: "stringArray",
        multiline: true,
        rows: 6,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "stats",
    title: "Stats",
    description:
      "Las cifras de proyectos y toneladas se calculan desde la DB; aquí se editan los labels y las stats fijas.",
    fields: [
      { name: "statProyectosLabel", label: "Label — stat de proyectos", kind: "text" },
      { name: "statToneladasLabel", label: "Label — stat de toneladas", kind: "text" },
      {
        name: "statsFijas",
        label: "Stats fijas (completan el strip de 4)",
        kind: "objectArray",
        gridSpan: 2,
        itemLabel: (item, i) =>
          (item.label as string) || `Stat ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { valor: "", sufijo: "", label: "" },
        itemFields: [
          { name: "valor", label: "Valor", kind: "text" },
          { name: "sufijo", label: "Sufijo (ej. +)", kind: "text" },
          { name: "label", label: "Label", kind: "text", gridSpan: 2 },
        ],
      },
    ],
  },
  {
    id: "soluciones",
    title: "Soluciones (fan-out del clúster)",
    description:
      "Cards que enlazan a las landings de solución. El href debe ser una ruta interna existente.",
    fields: [
      { name: "solucionesEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "solucionesTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "solucionesTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "soluciones",
        label: "Cards de soluciones",
        kind: "objectArray",
        gridSpan: 2,
        collapsible: true,
        itemLabel: (item, i) =>
          (item.titulo as string) || `Solución ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { href: "/soluciones/", titulo: "", descripcion: "" },
        itemFields: [
          {
            name: "href",
            label: "Ruta interna",
            kind: "text",
            placeholder: "/soluciones/…",
            gridSpan: 2,
          },
          { name: "titulo", label: "Título", kind: "text", gridSpan: 2 },
          {
            name: "descripcion",
            label: "Descripción",
            kind: "textarea",
            rows: 3,
            gridSpan: 2,
          },
        ],
      },
    ],
  },
  {
    id: "ventaja",
    title: "Por qué MEISA",
    fields: [
      { name: "ventajaEyebrow", label: "Eyebrow", kind: "text" },
      { name: "ventajaTitulo", label: "Título", kind: "text" },
      {
        name: "ventaja",
        label: "Párrafos",
        kind: "stringArray",
        multiline: true,
        rows: 5,
        gridSpan: 2,
      },
    ],
  },
  {
    id: "ciudades",
    title: "Cobertura por ciudad",
    fields: [
      { name: "ciudadesEyebrow", label: "Eyebrow", kind: "text" },
      { name: "ciudadesTitulo", label: "Título", kind: "text" },
      {
        name: "ciudades",
        label: "Cards de ciudades",
        kind: "objectArray",
        gridSpan: 2,
        collapsible: true,
        itemLabel: (item, i) =>
          (item.nombre as string) || `Ciudad ${String(i + 1).padStart(2, "0")}`,
        itemTemplate: { href: "/estructuras-metalicas/", nombre: "", descripcion: "" },
        itemFields: [
          {
            name: "href",
            label: "Ruta interna",
            kind: "text",
            placeholder: "/estructuras-metalicas/…",
            gridSpan: 2,
          },
          { name: "nombre", label: "Nombre", kind: "text", gridSpan: 2 },
          {
            name: "descripcion",
            label: "Descripción",
            kind: "textarea",
            rows: 3,
            gridSpan: 2,
          },
        ],
      },
    ],
  },
  {
    id: "guias",
    title: "Guías técnicas",
    description:
      "Las cards de guías salen del código (GUIAS_NAV); aquí solo se edita el encabezado de la sección.",
    fields: [
      { name: "guiasEyebrow", label: "Eyebrow", kind: "text" },
      { name: "guiasTitulo", label: "Título", kind: "text" },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      { name: "faqTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "faqTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      faqField(),
    ],
  },
  {
    id: "cta",
    title: "CTA final",
    fields: [
      { name: "ctaEyebrow", label: "Eyebrow", kind: "text", gridSpan: 2 },
      { name: "ctaTitulo1", label: "Título — línea 1", kind: "text" },
      { name: "ctaTitulo2", label: "Título — línea 2 (gris)", kind: "text" },
      {
        name: "ctaDescripcion",
        label: "Descripción",
        kind: "textarea",
        rows: 3,
        gridSpan: 2,
      },
    ],
  },
]

/* ─── Builder ─────────────────────────────────────────────────────────── */

export function buildLandingSections(
  tipo: "SOLUCION" | "GUIA" | "CIUDAD" | "PILAR",
  variante?: string,
): LandingSection[] {
  switch (tipo) {
    case "SOLUCION":
      return SOLUCION_SECTIONS
    case "CIUDAD":
      return CIUDAD_SECTIONS
    case "GUIA":
      return variante === "precios" ? GUIA_PRECIOS_SECTIONS : GUIA_TEMPLATE_SECTIONS
    case "PILAR":
      return PILAR_SECTIONS
  }
}
