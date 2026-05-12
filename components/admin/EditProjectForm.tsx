"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  ExternalLink,
  Building,
} from "lucide-react"
import { CategoriaEnum, EstadoProyecto, PrioridadEnum } from "@prisma/client"
import { AdminTabsLayout, type AdminTab } from "@/components/admin/AdminTabsLayout"
import { FormField, type FieldDef } from "@/components/admin/shared/FormFields"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaEnum
  cliente: string
  clienteId: string | null
  ubicacion: string
  fechaInicio: Date | string
  fechaFin: Date | string
  estado: EstadoProyecto
  prioridad: PrioridadEnum
  presupuesto: number | null
  costoReal: number | null
  toneladas: number | null
  areaTotal: number | null
  moneda: string
  contactoCliente: string | null
  telefono: string | null
  email: string | null
  destacado: boolean
  destacadoEnCategoria: boolean
  visible: boolean
  slug: string
}

interface Cliente {
  id: string
  nombre: string
  sector: string
  descripcion?: string | null
}

interface EditProjectFormProps {
  project: Project
  /** Contenido opcional para una pestaña adicional (ej: galería de imágenes). */
  galleryContent?: React.ReactNode
}

const ESTADO_LABEL: Record<EstadoProyecto, string> = {
  PLANIFICACION: "Planificación",
  EN_PROGRESO: "En progreso",
  PAUSADO: "Pausado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
}

const PRIORIDAD_LABEL: Record<PrioridadEnum, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  URGENTE: "Urgente",
}

const ESTADO_TONE: Record<EstadoProyecto, string> = {
  COMPLETADO: "bg-green-50 text-green-700 border-green-200",
  EN_PROGRESO: "bg-blue-50 text-blue-700 border-blue-200",
  PAUSADO: "bg-amber-50 text-amber-700 border-amber-200",
  PLANIFICACION: "bg-slate-50 text-slate-700 border-slate-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200",
}

export default function EditProjectForm({ project, galleryContent }: EditProjectFormProps) {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)

  const [form, setForm] = useState({
    titulo: project.titulo,
    descripcion: project.descripcion,
    categoria: project.categoria as string,
    cliente: project.cliente,
    clienteId: project.clienteId || "",
    ubicacion: project.ubicacion,
    fechaInicio: new Date(project.fechaInicio).toISOString().split("T")[0],
    fechaFin: new Date(project.fechaFin).toISOString().split("T")[0],
    estado: project.estado as string,
    prioridad: project.prioridad as string,
    presupuesto: project.presupuesto as number | null,
    costoReal: project.costoReal as number | null,
    toneladas: project.toneladas as number | null,
    areaTotal: project.areaTotal as number | null,
    moneda: project.moneda || "COP",
    contactoCliente: project.contactoCliente || "",
    telefono: project.telefono || "",
    email: project.email || "",
    destacado: project.destacado,
    destacadoEnCategoria: project.destacadoEnCategoria,
    visible: project.visible,
  })

  useEffect(() => {
    let cancelled = false
    fetch("/api/clientes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setClientes(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const selectedCliente = useMemo(
    () => clientes.find((c) => c.id === form.clienteId) ?? null,
    [clientes, form.clienteId],
  )

  const setField = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        presupuesto:
          form.presupuesto !== null && form.presupuesto !== ("" as any)
            ? Number(form.presupuesto)
            : null,
        costoReal:
          form.costoReal !== null && form.costoReal !== ("" as any)
            ? Number(form.costoReal)
            : null,
        toneladas:
          form.toneladas !== null && form.toneladas !== ("" as any)
            ? Number(form.toneladas)
            : null,
        areaTotal:
          form.areaTotal !== null && form.areaTotal !== ("" as any)
            ? Number(form.areaTotal)
            : null,
        clienteId: form.clienteId || null,
      }
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Error al guardar el proyecto")
      }
      setSavedAt(Date.now())
      setDirty(false)
      router.refresh()
    } catch (e: any) {
      setError(e.message || "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  /* ─── Field definitions ──────────────────────────────────────────────── */

  const infoFields: FieldDef[] = [
    { name: "titulo", label: "Título del proyecto", kind: "text", required: true, gridSpan: 2 },
    {
      name: "descripcion",
      label: "Descripción",
      kind: "textarea",
      rows: 4,
      required: true,
      gridSpan: 2,
    },
    {
      name: "categoria",
      label: "Categoría",
      kind: "select",
      required: true,
      options: Object.values(CategoriaEnum).map((c) => ({
        value: c,
        label: c.replace(/_/g, " "),
      })),
    },
    { name: "ubicacion", label: "Ubicación", kind: "text", required: true },
    { name: "fechaInicio", label: "Fecha de inicio", kind: "date", required: true },
    { name: "fechaFin", label: "Fecha de fin", kind: "date", required: true },
  ]

  const estadoFields: FieldDef[] = [
    {
      name: "estado",
      label: "Estado",
      kind: "select",
      required: true,
      options: Object.values(EstadoProyecto).map((e) => ({
        value: e,
        label: ESTADO_LABEL[e],
      })),
    },
    {
      name: "prioridad",
      label: "Prioridad",
      kind: "select",
      required: true,
      options: Object.values(PrioridadEnum).map((p) => ({
        value: p,
        label: PRIORIDAD_LABEL[p],
      })),
    },
    {
      name: "destacado",
      label: "Proyecto destacado",
      kind: "boolean",
      gridSpan: 2,
      hint: "Aparece como destacado a nivel global del sitio.",
    },
    {
      name: "destacadoEnCategoria",
      label: "Destacado en categoría",
      kind: "boolean",
      gridSpan: 2,
      hint: "Aparece en el home dentro de su categoría.",
    },
    {
      name: "visible",
      label: "Visible en el sitio",
      kind: "boolean",
      gridSpan: 2,
      hint: "Si está apagado, no aparece públicamente.",
    },
  ]

  const especFields: FieldDef[] = [
    {
      name: "toneladas",
      label: "Toneladas de acero",
      kind: "number",
      step: 0.01,
      placeholder: "Ej: 125.5",
      hint: "Peso total en toneladas del acero utilizado.",
    },
    {
      name: "areaTotal",
      label: "Área total (m²)",
      kind: "number",
      step: 0.01,
      placeholder: "Ej: 5000",
      hint: "Área total de construcción en metros cuadrados.",
    },
  ]

  const finanFields: FieldDef[] = [
    {
      name: "presupuesto",
      label: "Presupuesto",
      kind: "number",
      step: 1000,
      placeholder: "Ej: 500000000",
      hint: "Presupuesto inicial del proyecto.",
    },
    {
      name: "costoReal",
      label: "Costo real",
      kind: "number",
      step: 1000,
      placeholder: "Ej: 480000000",
      hint: "Costo real final del proyecto.",
    },
    {
      name: "moneda",
      label: "Moneda",
      kind: "select",
      options: [
        { value: "COP", label: "COP — Peso colombiano" },
        { value: "USD", label: "USD — Dólar" },
        { value: "EUR", label: "EUR — Euro" },
      ],
    },
  ]

  const contactoFields: FieldDef[] = [
    {
      name: "contactoCliente",
      label: "Contacto del cliente",
      kind: "text",
      placeholder: "Nombre del contacto",
    },
    { name: "telefono", label: "Teléfono", kind: "text", placeholder: "+57 …" },
    { name: "email", label: "Email", kind: "text", placeholder: "contacto@empresa.com" },
  ]

  /* ─── Render helpers ─────────────────────────────────────────────────── */

  const renderFields = (fields: FieldDef[]) => (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <FormField
          key={f.name}
          field={f}
          value={(form as any)[f.name]}
          onChange={(v) => setField(f.name, v)}
          disabled={saving}
        />
      ))}
    </div>
  )

  const SectionCard = ({
    title,
    description,
    children,
  }: {
    title: string
    description?: string
    children: React.ReactNode
  }) => (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-bebas text-xl uppercase leading-tight text-slate-950">{title}</h2>
        {description && (
          <p className="mt-1 font-lato text-sm text-slate-600">{description}</p>
        )}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  )

  /* ─── Cliente section (custom) ───────────────────────────────────────── */

  const clienteSection = (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-bebas text-xl uppercase leading-tight text-slate-950">Cliente</h2>
        <p className="mt-1 font-lato text-sm text-slate-600">
          Nombre del cliente y, opcionalmente, vinculación con un cliente del CRM.
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            field={{
              name: "cliente",
              label: "Nombre del cliente",
              kind: "text",
              required: true,
              placeholder: "Nombre tal como debe aparecer",
            }}
            value={form.cliente}
            onChange={(v) => setField("cliente", v)}
            disabled={saving}
          />
          <FormField
            field={{
              name: "clienteId",
              label: "Conectar a cliente existente",
              kind: "select",
              placeholder: "Sin conexión",
              options: [
                { value: "__none__", label: "Sin conexión" },
                ...clientes.map((c) => ({
                  value: c.id,
                  label: `${c.nombre} (${c.sector})`,
                })),
              ],
              hint: "Opcional. Vincula con un cliente del CRM.",
            }}
            value={form.clienteId || "__none__"}
            onChange={(v) => {
              const clienteId = v === "__none__" ? "" : (v as string)
              setField("clienteId", clienteId)
              if (clienteId) {
                const c = clientes.find((cl) => cl.id === clienteId)
                if (c) setField("cliente", c.nombre)
              }
            }}
            disabled={saving}
          />
        </div>
        {selectedCliente && (
          <div className="mt-5 border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Building className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <span className="truncate font-lato font-semibold text-blue-900">
                  {selectedCliente.nombre}
                </span>
                <span className="flex-shrink-0 font-lato text-xs text-blue-600">
                  ({selectedCliente.sector})
                </span>
              </div>
              <Link
                href={`/admin/clientes/${selectedCliente.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-blue-600 transition-colors hover:text-blue-800"
                title="Abrir cliente en nueva pestaña"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            {selectedCliente.descripcion && (
              <p className="mt-1.5 font-lato text-xs text-blue-700">
                {selectedCliente.descripcion}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )

  /* ─── Tabs ───────────────────────────────────────────────────────────── */

  const baseTabs: AdminTab[] = [
    {
      id: "info",
      label: "Información",
      content: (
        <div className="space-y-6">
          <SectionCard title="Datos generales" description="Título, descripción, categoría, ubicación y fechas del proyecto.">
            {renderFields(infoFields)}
          </SectionCard>
          {clienteSection}
        </div>
      ),
    },
    {
      id: "estado",
      label: "Estado y visibilidad",
      content: (
        <SectionCard title="Estado, prioridad y publicación" description="Cómo aparece el proyecto en el sitio público.">
          {renderFields(estadoFields)}
        </SectionCard>
      ),
    },
    {
      id: "especs",
      label: "Especificaciones",
      content: (
        <SectionCard title="Especificaciones técnicas" description="Toneladas de acero y área construida.">
          {renderFields(especFields)}
        </SectionCard>
      ),
    },
    {
      id: "finan",
      label: "Financiero",
      content: (
        <SectionCard title="Información financiera" description="Presupuesto, costo real y moneda.">
          {renderFields(finanFields)}
        </SectionCard>
      ),
    },
    {
      id: "contacto",
      label: "Contacto",
      content: (
        <SectionCard title="Contacto del cliente" description="Datos de contacto opcionales para el seguimiento.">
          {renderFields(contactoFields)}
        </SectionCard>
      ),
    },
  ]

  const tabs: AdminTab[] = galleryContent
    ? [
        ...baseTabs,
        {
          id: "galeria",
          label: "Galería",
          content: galleryContent,
        },
      ]
    : baseTabs

  const justSaved = savedAt !== null && Date.now() - savedAt < 3000

  return (
    <div className="space-y-6 pb-24">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 font-lato text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a proyectos
        </Link>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded-none border px-2 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider",
              ESTADO_TONE[project.estado],
            )}
          >
            {ESTADO_LABEL[project.estado]}
          </span>
          {project.visible && (
            <Link
              href={`/proyectos/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-lato text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:text-red-700"
            >
              Ver público
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      <AdminTabsLayout
        title={project.titulo || "Proyecto sin título"}
        eyebrow="Editar proyecto"
        description={`${project.cliente || "Sin cliente"} · ${project.ubicacion || "Sin ubicación"}`}
        tabs={tabs}
        defaultTab="info"
      />

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-10">
          <div className="min-w-0 flex-1">
            {error ? (
              <div className="font-lato text-sm text-red-700">{error}</div>
            ) : dirty ? (
              <div className="font-lato text-xs uppercase tracking-wider text-slate-400">
                Cambios sin guardar
              </div>
            ) : null}
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
            {justSaved && (
              <span className="flex items-center gap-1.5 font-lato text-xs font-semibold uppercase tracking-wide text-green-700">
                <Check className="h-3.5 w-3.5" />
                Guardado
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-red-600 px-5 py-2.5 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>
    </div>
  )
}
