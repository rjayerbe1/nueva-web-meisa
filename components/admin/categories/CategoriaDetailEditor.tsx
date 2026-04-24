"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminTabsLayout } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { ArrowLeft, ExternalLink, Save, Loader2, Check } from "lucide-react"
import type { CategoriaProyecto } from "@prisma/client"
import { CasosExitoPicker } from "./CasosExitoPicker"
import { IconPreview } from "./IconPreview"

const identidadFields: FieldDef[] = [
  { name: "nombre", label: "Nombre", kind: "text", required: true },
  { name: "slug", label: "Slug (único)", kind: "text", required: true },
  {
    name: "key",
    label: "Key (enum)",
    kind: "select",
    required: true,
    options: [
      { value: "COMERCIAL", label: "COMERCIAL" },
      { value: "INDUSTRIAL", label: "INDUSTRIAL" },
      { value: "PUENTES", label: "PUENTES" },
      { value: "INFRAESTRUCTURA_URBANA", label: "INFRAESTRUCTURA_URBANA" },
      { value: "EDIFICACIONES", label: "EDIFICACIONES" },
      { value: "DEPORTES_EDUCACION", label: "DEPORTES_EDUCACION" },
      { value: "OTRO", label: "OTRO" },
    ],
    hint: "Identificador técnico interno. No cambiarlo a menos que sepas qué haces.",
  },
  // icono se renderiza aparte via <IconPreview /> en el panel Identidad
  { name: "descripcion", label: "Descripción corta", kind: "textarea", rows: 2, gridSpan: 2 },
  { name: "orden", label: "Orden", kind: "number" },
  { name: "visible", label: "Visible", kind: "boolean" },
  { name: "destacada", label: "Destacada", kind: "boolean" },
]

// Grupo único — Tarjeta en el grid de categorías (home + /proyectos).
// El hero de la página interna toma la imagen de la especialidad activa
// (se sube desde tab "Contenido ampliado → Especialidades"). No hay campos
// imagenBanner/videoBanner — deprecated y removidos del modelo.
const gridHomeFields: FieldDef[] = [
  {
    name: "imagenCover",
    label: "Imagen cover",
    kind: "image",
    gridSpan: 2,
    hint: "Aparece en el grid de 6 tarjetas del home y /proyectos (también sirve de poster si hay video).",
  },
  {
    name: "videoCover",
    label: "Video cover (hover)",
    kind: "video",
    gridSpan: 2,
    hint: "Se reproduce al pasar el mouse por la tarjeta en desktop.",
  },
  {
    name: "usarVideoCover",
    label: "Usar video cover (en vez de solo imagen)",
    kind: "boolean",
    gridSpan: 2,
  },
  {
    name: "videoCoverScale",
    label: "Escala video",
    kind: "number",
    step: 0.05,
    min: 0.5,
    max: 3,
  },
  {
    name: "videoCoverPosition",
    label: "Posición video (X,Y en %)",
    kind: "text",
    placeholder: "center center · o -10,5",
  },
  {
    name: "color",
    label: "Color del ícono (hex)",
    kind: "text",
    placeholder: "#1e40af",
    gridSpan: 2,
    hint: "Color del ícono de la categoría dentro de la tarjeta del grid.",
  },
  {
    name: "overlayColor",
    label: "Overlay color (hex)",
    kind: "text",
    placeholder: "#000000",
  },
  {
    name: "overlayOpacity",
    label: "Overlay opacity (0–1)",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
  },
  {
    name: "enableHoverOverlay",
    label: "Activar overlay adicional al hover",
    kind: "boolean",
    gridSpan: 2,
  },
  {
    name: "hoverOverlayColor",
    label: "Hover overlay color",
    kind: "text",
    placeholder: "#1e40af",
  },
  {
    name: "hoverOverlayOpacity",
    label: "Hover overlay opacity (0–1)",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
  },
]

// Textos UI — overrides editables de los textos hardcoded de la página pública.
// Agrupados por sección. Dejar vacío = usar el default (branding MEISA coherente).
// Soporta {nombre} en cualquiera — se reemplaza con el nombre de la categoría.
type TextoDef = {
  key: string
  label: string
  defaultValue: string
  kind?: "text" | "textarea"
  rows?: number
}

const textosUiGroups: { title: string; eyebrow: string; items: TextoDef[] }[] = [
  {
    eyebrow: "01",
    title: "Hero",
    items: [
      { key: "heroEyebrow", label: "Eyebrow del hero", defaultValue: "Categoría" },
      { key: "heroIndicadorScroll", label: "Texto indicador de scroll", defaultValue: "Ver proyectos" },
    ],
  },
  {
    eyebrow: "02",
    title: "Grid de proyectos (header + tarjetas)",
    items: [
      { key: "gridEyebrowSingular", label: "Eyebrow (1 proyecto)", defaultValue: "Proyecto entregado" },
      { key: "gridEyebrowPlural", label: "Eyebrow (2+ proyectos)", defaultValue: "Proyectos entregados" },
      { key: "gridTitulo1", label: "Título línea 1", defaultValue: "Nuestros" },
      { key: "gridTitulo2", label: "Título línea 2", defaultValue: "trabajos." },
      { key: "gridCardDestacado", label: "Label 'Destacado' en tarjeta", defaultValue: "Destacado" },
      { key: "gridCardVerProyecto", label: "Label 'Ver proyecto' en tarjeta", defaultValue: "Ver proyecto" },
    ],
  },
  {
    eyebrow: "03",
    title: "Otros proyectos (lista sin imagen)",
    items: [
      { key: "otrosEyebrow", label: "Eyebrow", defaultValue: "Más entregados" },
      { key: "otrosTitulo1", label: "Título línea 1", defaultValue: "Otros" },
      { key: "otrosTitulo2", label: "Título línea 2", defaultValue: "proyectos." },
    ],
  },
  {
    eyebrow: "04",
    title: "CTA final",
    items: [
      { key: "ctaEyebrow", label: "Eyebrow", defaultValue: "¿Tu proyecto aquí?" },
      { key: "ctaTitulo1", label: "Título línea 1", defaultValue: "Hablemos" },
      { key: "ctaTitulo2", label: "Título línea 2", defaultValue: "de tu obra." },
      {
        key: "ctaDescripcion",
        label: "Descripción",
        defaultValue: "Cotización personalizada para proyectos de {nombre}. Respuesta en menos de 48 horas.",
        kind: "textarea",
        rows: 2,
      },
      { key: "ctaBotonPrimarioLabel", label: "Botón primario", defaultValue: "Solicitar cotización" },
      { key: "ctaBotonSecundarioLabel", label: "Botón secundario", defaultValue: "Otras categorías" },
    ],
  },
]

const especialidadesField: FieldDef = {
  name: "especialidades",
  label: "Especialidades (tabs del hero)",
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  hint: "Cada ítem aparece como un tab en el hero de la página. Al hacer click en el título, se despliegan los campos para editar.",
  itemTemplate: {
    id: "",
    titulo: "",
    descripcion: "",
    imagen: "",
    icono: "",
    orden: 1,
    activo: true,
    proyectosEjemplo: [],
  },
  itemFields: [
    { name: "titulo", label: "Título", kind: "text", required: true, gridSpan: 2 },
    {
      name: "descripcion",
      label: "Descripción",
      kind: "textarea",
      rows: 6,
      gridSpan: 2,
      hint: "Usa **negrita** para resaltar y doble salto de línea para separar párrafos.",
    },
    { name: "imagen", label: "Imagen de fondo del hero", kind: "image", gridSpan: 2 },
    {
      name: "icono",
      label: "Ícono (nombre Lucide)",
      kind: "text",
      placeholder: "Warehouse",
    },
    { name: "orden", label: "Orden", kind: "number" },
    { name: "activo", label: "Activo (visible)", kind: "boolean" },
    {
      name: "proyectosEjemplo",
      label: "Ideal para (tags)",
      kind: "stringArray",
      gridSpan: 2,
      hint: 'Ej: "Bodegas industriales", "Centros de distribución"',
    },
  ],
  itemLabel: (item, i) =>
    typeof item.titulo === "string" && item.titulo
      ? `${String(i + 1).padStart(2, "0")} — ${item.titulo}`
      : `Especialidad ${String(i + 1).padStart(2, "0")}`,
}

const estadisticasField: FieldDef = {
  name: "estadisticas",
  label: "Estadísticas del hero",
  kind: "objectArray",
  gridSpan: 2,
  collapsible: true,
  hint: "Máximo 4. Aparecen en la esquina inferior derecha del hero. Ejemplos: 8.500 ton + Acero fabricado · 57 + + Proyectos entregados · 150 m + Luz máxima.",
  itemTemplate: { valor: "", sufijo: "", label: "" },
  itemFields: [
    {
      name: "valor",
      label: "Valor",
      kind: "text",
      required: true,
      placeholder: "8.500 · 57 · 150",
      hint: "Número grande que destaca. Formato libre.",
    },
    {
      name: "sufijo",
      label: "Sufijo (opcional)",
      kind: "text",
      placeholder: "ton · + · años · m · %",
      hint: "Aparece a la derecha del valor en color atenuado.",
    },
    {
      name: "label",
      label: "Etiqueta",
      kind: "text",
      gridSpan: 2,
      placeholder: "Acero fabricado · Proyectos entregados · Luz máxima",
      hint: "Texto pequeño uppercase bajo el valor.",
    },
  ],
  itemLabel: (item, i) => {
    const valor = typeof item.valor === "string" ? item.valor : ""
    const label = typeof item.label === "string" ? item.label : ""
    if (valor && label) return `${valor} — ${label}`
    if (valor) return valor
    return `Stat ${String(i + 1).padStart(2, "0")}`
  },
}

const seoFields: FieldDef[] = [
  { name: "metaTitle", label: "SEO — título", kind: "text", gridSpan: 2 },
  { name: "metaDescription", label: "SEO — descripción", kind: "textarea", rows: 3, gridSpan: 2 },
]

export function CategoriaDetailEditor({ categoria }: { categoria: CategoriaProyecto }) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown>>({ ...(categoria as any) })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const setField = (name: string, value: unknown) => {
    if (name.includes(".")) {
      const [root, key] = name.split(".", 2)
      setForm((prev) => {
        const parent = (prev[root] as Record<string, unknown>) ?? {}
        const nextParent = { ...parent }
        if (value === "" || value === null || value === undefined) {
          delete nextParent[key]
        } else {
          nextParent[key] = value
        }
        return { ...prev, [root]: nextParent }
      })
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const getField = (name: string): unknown => {
    if (name.includes(".")) {
      const [root, key] = name.split(".", 2)
      const parent = form[root] as Record<string, unknown> | null | undefined
      return parent?.[key]
    }
    return form[name]
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const { id, createdAt, updatedAt, totalProyectos, ...body } = form as any
      const res = await fetch(`/api/admin/categories/${categoria.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      const saved = await res.json()
      setForm(saved)
      setSavedAt(Date.now())
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (
      !confirm(
        `¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return
    const res = await fetch(`/api/admin/categories/${categoria.id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/projects")
      router.refresh()
    } else {
      alert("Error eliminando")
    }
  }

  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  const renderFields = (fields: FieldDef[]) => (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={getField(f.name)}
            onChange={(v) => setField(f.name, v)}
            disabled={saving}
          />
        ))}
      </div>
    </div>
  )

  const identidadPanel = (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        {identidadFields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={getField(f.name)}
            onChange={(v) => setField(f.name, v)}
            disabled={saving}
          />
        ))}
        <IconPreview
          value={(form.icono as string | null) ?? null}
          onChange={(v) => setField("icono", v)}
          disabled={saving}
        />
      </div>
    </div>
  )

  const visualesPanel = (
    <div className="space-y-6">
      <div className="border-l-2 border-blue-400 bg-blue-50 px-4 py-3">
        <p className="font-lato text-xs text-blue-900">
          <strong>Nota</strong>: la imagen del hero de{" "}
          <code className="font-mono text-[11px]">/proyectos/categoria/{(form.slug as string) || "…"}</code>{" "}
          toma la foto de la <strong>especialidad activa</strong> (se sube en{" "}
          <em>Contenido ampliado → Especialidades</em>). Si la categoría no
          tiene especialidades, usa la <strong>imagen cover</strong> de abajo
          como fallback.
        </p>
      </div>

      <section className="rounded-md border border-slate-200 bg-white">
        <header className="border-b border-slate-100 bg-stone-50 px-6 py-4">
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Grid del home y /proyectos
          </p>
          <h3 className="mt-1 font-bebas text-2xl uppercase text-slate-950">
            Tarjeta en el grid de categorías
          </h3>
          <p className="mt-1 font-lato text-xs text-slate-500">
            Cómo se ve esta categoría dentro de la grilla 3×2 del home y del listado de proyectos.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
          {gridHomeFields.map((f) => (
            <FormField
              key={f.name}
              field={f}
              value={getField(f.name)}
              onChange={(v) => setField(f.name, v)}
              disabled={saving}
            />
          ))}
        </div>
      </section>
    </div>
  )

  const textosUiPanel = (
    <div className="space-y-6">
      <div className="border-l-2 border-blue-400 bg-blue-50 px-4 py-3">
        <p className="font-lato text-xs text-blue-900">
          Deja los campos vacíos para usar los textos por defecto de MEISA. Los
          campos que llenes sobrescriben al default <strong>solo en esta categoría</strong>.
          Puedes usar <code className="font-mono text-[11px]">{"{nombre}"}</code>{" "}
          en cualquier campo — se sustituye por el nombre de la categoría.
        </p>
      </div>

      {textosUiGroups.map((group) => (
        <section
          key={group.eyebrow}
          className="rounded-md border border-slate-200 bg-white"
        >
          <header className="border-b border-slate-100 bg-stone-50 px-6 py-4">
            <p className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {group.eyebrow}
            </p>
            <h3 className="mt-1 font-bebas text-2xl uppercase text-slate-950">
              {group.title}
            </h3>
          </header>
          <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
            {group.items.map((t) => {
              const fieldName = `textosUi.${t.key}`
              const field: FieldDef =
                t.kind === "textarea"
                  ? {
                      name: fieldName,
                      label: t.label,
                      kind: "textarea",
                      rows: t.rows ?? 2,
                      gridSpan: 2,
                      placeholder: t.defaultValue,
                      hint: `Default: ${t.defaultValue}`,
                    }
                  : {
                      name: fieldName,
                      label: t.label,
                      kind: "text",
                      placeholder: t.defaultValue,
                      hint: `Default: ${t.defaultValue}`,
                    }
              return (
                <FormField
                  key={fieldName}
                  field={field}
                  value={getField(fieldName)}
                  onChange={(v) => setField(fieldName, v)}
                  disabled={saving}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )

  const contenidoPanel = (
    <div className="space-y-6">
      {/* Especialidades — objectArray con image picker por item */}
      <section className="rounded-md border border-slate-200 bg-white">
        <header className="border-b border-slate-100 bg-stone-50 px-6 py-4">
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            01 — Hero interactivo
          </p>
          <h3 className="mt-1 font-bebas text-2xl uppercase text-slate-950">
            Especialidades
          </h3>
        </header>
        <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
          <FormField
            field={especialidadesField}
            value={form.especialidades as any}
            onChange={(v) => setField("especialidades", v)}
            disabled={saving}
          />
        </div>
      </section>

      {/* Estadísticas — array flexible editable por categoría */}
      <section className="rounded-md border border-slate-200 bg-white">
        <header className="border-b border-slate-100 bg-stone-50 px-6 py-4">
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            02 — Stats del hero
          </p>
          <h3 className="mt-1 font-bebas text-2xl uppercase text-slate-950">
            Estadísticas
          </h3>
          <p className="mt-1 font-lato text-xs text-slate-500">
            Aparecen en la esquina inferior derecha del hero. Cada categoría
            puede tener sus propias métricas (ej: "Luz máxima" para puentes,
            "Área construida" para edificios).
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
          <FormField
            field={estadisticasField}
            value={form.estadisticas as any}
            onChange={(v) => setField("estadisticas", v)}
            disabled={saving}
          />
        </div>
      </section>

      {/* Proyectos destacados — picker visual de proyectos */}
      <section className="rounded-md border border-slate-200 bg-white">
        <header className="border-b border-slate-100 bg-stone-50 px-6 py-4">
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            03 — Orden del grid
          </p>
          <h3 className="mt-1 font-bebas text-2xl uppercase text-slate-950">
            Proyectos destacados
          </h3>
          <p className="mt-1 font-lato text-xs text-slate-500">
            Los seleccionados aparecen primero en el grid de la página pública
            con el eyebrow rojo <strong className="text-red-600">"Destacado"</strong> sobre el título.
          </p>
        </header>
        <div className="px-6 py-6">
          <CasosExitoPicker
            categoriaId={categoria.id}
            value={(form.casosExitoIds as string[] | null) ?? []}
            onChange={(v) => setField("casosExitoIds", v)}
            disabled={saving}
          />
        </div>
      </section>

    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/projects?tab=categorias"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a categorías
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/proyectos/categoria/${categoria.slug}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
          >
            Ver pública
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            onClick={remove}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      <AdminTabsLayout
        eyebrow="Categoría"
        title={(form.nombre as string) || "Categoría"}
        description={(form.descripcion as string) ?? undefined}
        tabs={[
          { id: "identidad", label: "Identidad", content: identidadPanel },
          { id: "visuales", label: "Visuales", content: visualesPanel },
          { id: "contenido", label: "Contenido ampliado", content: contenidoPanel },
          { id: "textos", label: "Textos UI", content: textosUiPanel },
          { id: "seo", label: "SEO", content: renderFields(seoFields) },
        ]}
      />

      {error && (
        <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 font-lato text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-10 lg:px-10">
        {justSaved && (
          <span className="flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wide text-green-700">
            <Check className="h-3.5 w-3.5" />
            Guardado
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-none bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
