"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  GripVertical,
  LayoutGrid,
  List as RowsIcon,
  ImageOff,
  Package,
  Search,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react"
import { FormField, type FieldDef } from "./FormFields"
import { cn } from "@/lib/utils"

type BaseItem = {
  id: string
  orden?: number | null
  activo?: boolean | null
}

type ViewMode = "cards" | "table"

export type ListFilterDef = {
  /** Clave del campo a filtrar (ej. "categoria", "estado", "visible"). */
  key: string
  label: string
  /** Opciones del dropdown. El valor especial "" representa "Todos". */
  options: { value: string; label: string }[]
}

interface ListCrudEditorProps<T extends BaseItem> {
  items: T[]
  fields: FieldDef[]
  endpoint: string
  emptyTemplate: Omit<Partial<T>, "id">
  renderPreview?: (item: T) => React.ReactNode
  addLabel?: string
  emptyMessage?: string
  canReorder?: boolean
  defaultView?: ViewMode
  /** Claves de campos a mostrar como columnas de la tabla. Si se omite, se auto-detectan. */
  tableColumns?: { key: string; label: string; className?: string }[]
  /** Campo que contiene la URL de imagen para el thumbnail (ej. "imagen", "logo"). */
  thumbnailField?: string
  /** Claves donde se buscará texto. Si se omite, se auto-detectan campos texto/textarea/stringArray. */
  searchableFields?: string[]
  /** Filtros tipo dropdown (categoría, estado, etc.) */
  filters?: ListFilterDef[]
  /** Placeholder del input de búsqueda */
  searchPlaceholder?: string
  /** Tamaño de página para paginación incremental. Default 48. */
  pageSize?: number
  /**
   * URL del editor detallado por item (con galería de fotos, etc).
   * Cuando se provee, la fila en tabla y el thumbnail en tarjetas se vuelven
   * un link a esa URL, y las acciones se muestran siempre (no solo en hover).
   */
  detailHref?: (item: any) => string
  /** Texto del link de detalle. Default "Editar fotos y detalle". */
  detailLabel?: string
}

export function ListCrudEditor<T extends BaseItem>({
  items: initialItems,
  fields,
  endpoint,
  emptyTemplate,
  renderPreview,
  addLabel = "Agregar",
  emptyMessage = "Aún no hay elementos. Usa el botón para agregar el primero.",
  canReorder = true,
  defaultView = "cards",
  tableColumns,
  thumbnailField,
  searchableFields,
  filters,
  searchPlaceholder = "Buscar…",
  pageSize = 48,
  detailHref,
  detailLabel = "Editar fotos y detalle",
}: ListCrudEditorProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>(defaultView)
  const [query, setQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const searchRef = useRef<HTMLInputElement>(null)

  const storageKey = `admin.view.${endpoint}`

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(storageKey) as ViewMode | null
    if (saved === "cards" || saved === "table") setView(saved)
  }, [storageKey])

  const changeView = (v: ViewMode) => {
    setView(v)
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, v)
  }

  /* ── Búsqueda + filtros ── */

  const autoSearchableKeys = useMemo<string[]>(() => {
    if (searchableFields && searchableFields.length) return searchableFields
    const keys: string[] = []
    for (const f of fields) {
      if (
        f.kind === "text" ||
        f.kind === "textarea" ||
        f.kind === "stringArray"
      ) {
        keys.push(f.name)
      }
    }
    return keys
  }, [searchableFields, fields])

  const normalize = (v: unknown): string => {
    if (v == null) return ""
    if (Array.isArray(v)) return v.map((x) => normalize(x)).join(" ")
    return String(v)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
  }

  const queryNorm = useMemo(() => normalize(query.trim()), [query])

  const filteredItems = useMemo(() => {
    let list = items
    // Filtros dropdown
    for (const [key, value] of Object.entries(filterValues)) {
      if (!value) continue
      list = list.filter((it) => {
        const raw = (it as any)[key]
        if (typeof raw === "boolean") return String(raw) === value
        if (raw == null) return value === "__null__"
        return String(raw) === value
      })
    }
    // Búsqueda texto
    if (queryNorm) {
      list = list.filter((it) =>
        autoSearchableKeys.some((k) => normalize((it as any)[k]).includes(queryNorm)),
      )
    }
    return list
  }, [items, filterValues, queryNorm, autoSearchableKeys])

  const hasActiveFilters =
    queryNorm.length > 0 || Object.values(filterValues).some((v) => v)

  const clearFilters = () => {
    setQuery("")
    setFilterValues({})
  }

  // Reset paginación al filtrar/buscar
  useEffect(() => {
    setVisibleCount(pageSize)
  }, [queryNorm, filterValues, pageSize])

  // Atajo "/" para enfocar búsqueda
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      const tag = t?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasMore = filteredItems.length > visibleCount

  const autoThumbnailField = useMemo(() => {
    if (thumbnailField) return thumbnailField
    // Prefer single-image fields
    const single = fields.find((f) =>
      ["imagen", "logo", "image", "portada", "thumbnail"].includes(f.name),
    )
    if (single) return single.name
    // Fallback: array-like image fields (imagenes, imagenesFeatured, imagenesGaleria…)
    const arr = fields.find((f) =>
      ["imagenes", "imagenesFeatured", "imagenesGaleria", "fotos", "images"].includes(f.name),
    )
    return arr?.name
  }, [thumbnailField, fields])

  /** Dado un valor (string | string[]), devuelve la URL primaria para thumbnail. */
  const resolveThumbnail = (value: unknown): string | undefined => {
    if (Array.isArray(value)) {
      const first = value.find((v) => typeof v === "string" && v.trim().length > 0)
      return typeof first === "string" ? first : undefined
    }
    return typeof value === "string" && value.length > 0 ? value : undefined
  }

  const columns = useMemo(() => {
    if (tableColumns) return tableColumns
    // Auto-detect columns: primary name fields + 1-2 supporting
    const primary = fields.find((f) =>
      ["nombre", "titulo", "label", "codigo", "clave", "red", "valor"].includes(f.name),
    )
    const secondary = fields.find((f) =>
      ["descripcion", "subtitulo", "categoria", "grupo", "pagina"].includes(f.name),
    )
    const cols: { key: string; label: string; className?: string }[] = []
    if (primary) cols.push({ key: primary.name, label: primary.label })
    if (secondary) cols.push({ key: secondary.name, label: secondary.label })
    // Orden if present
    if (fields.some((f) => f.name === "orden"))
      cols.push({ key: "orden", label: "Orden", className: "w-20 text-center" })
    return cols
  }, [tableColumns, fields])

  const isNew = editingId === "__new__"

  const beginNew = () => {
    setEditingId("__new__")
    setDraft({ ...emptyTemplate })
    setError(null)
  }
  const beginEdit = (item: T) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setError(null)
  }
  const cancel = () => {
    setEditingId(null)
    setDraft({})
    setError(null)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isNew ? endpoint : `${endpoint}/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(msg.error ?? "Error")
      }
      const saved: T = await res.json()
      setItems((prev) =>
        isNew ? [...prev, saved] : prev.map((it) => (it.id === saved.id ? saved : it)),
      )
      cancel()
    } catch (e: any) {
      setError(e.message ?? "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: string) => {
    if (!confirm("¿Eliminar este elemento? Esta acción no se puede deshacer.")) return
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Error eliminando")
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const patch = async (id: string, data: Partial<T>) => {
    const res = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) return null
    const updated: T = await res.json()
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
    return updated
  }

  const toggleActivo = (item: T) => patch(item.id, { activo: !item.activo } as Partial<T>)

  /* ── Drag-and-drop ── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((it) => it.id === active.id)
    const newIndex = items.findIndex((it) => it.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const reordered = arrayMove(items, oldIndex, newIndex)
    // Reasigna `orden` a toda la lista (0..n-1) para eliminar ambigüedad
    const withOrder = reordered.map((it, i) => ({ ...it, orden: i }))
    setItems(withOrder)
    // Persistir todos los que cambiaron
    await Promise.all(
      withOrder
        .filter((it, i) => (items[i]?.id ?? null) !== it.id)
        .map((it) => patch(it.id, { orden: it.orden as any } as Partial<T>)),
    )
  }

  /* ── Render ── */

  const itemIds = visibleItems.map((it) => it.id)

  const showSearch = items.length >= 8 && autoSearchableKeys.length > 0
  const showFilters = (filters?.length ?? 0) > 0

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {hasActiveFilters
            ? `${filteredItems.length} de ${items.length} ${items.length === 1 ? "elemento" : "elementos"}`
            : `${items.length} ${items.length === 1 ? "elemento" : "elementos"}`}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-none border border-slate-200 bg-white">
            <button
              onClick={() => changeView("cards")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wide transition-colors",
                view === "cards"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-stone-50 hover:text-slate-900",
              )}
              aria-pressed={view === "cards"}
              aria-label="Vista en tarjetas"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Tarjetas
            </button>
            <button
              onClick={() => changeView("table")}
              className={cn(
                "flex items-center gap-1.5 border-l border-slate-200 px-3 py-1.5 font-lato text-xs font-semibold uppercase tracking-wide transition-colors",
                view === "table"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-stone-50 hover:text-slate-900",
              )}
              aria-pressed={view === "table"}
              aria-label="Vista en tabla"
            >
              <RowsIcon className="h-3.5 w-3.5" />
              Tabla
            </button>
          </div>
          <button
            onClick={beginNew}
            disabled={editingId !== null}
            className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      {(showSearch || showFilters) && (
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && (
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-none border border-slate-300 bg-white py-2 pl-9 pr-16 font-lato text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                aria-label="Buscar"
              />
              <kbd
                aria-hidden
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-none border border-slate-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400"
              >
                /
              </kbd>
            </div>
          )}
          {filters?.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] ?? ""}
              onChange={(e) =>
                setFilterValues((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className="rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-semibold uppercase tracking-wide text-slate-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              aria-label={f.label}
            >
              <option value="">{f.label}: todos</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* New form (top) */}
      {isNew && (
        <EditForm
          fields={fields}
          draft={draft}
          setDraft={setDraft}
          saving={saving}
          error={error}
          onCancel={cancel}
          onSave={save}
        />
      )}

      {/* Empty state */}
      {items.length === 0 && !isNew && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-slate-300" />
          <p className="mb-1 font-bebas text-lg uppercase tracking-wide text-slate-700">
            Vacío
          </p>
          <p className="max-w-xs font-lato text-sm text-slate-500">{emptyMessage}</p>
          <button
            onClick={beginNew}
            className="mt-4 inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </button>
        </div>
      )}

      {/* Filtros sin resultados */}
      {items.length > 0 && filteredItems.length === 0 && !isNew && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <SlidersHorizontal className="mb-3 h-8 w-8 text-slate-300" />
          <p className="mb-1 font-bebas text-base uppercase tracking-wide text-slate-700">
            Sin resultados
          </p>
          <p className="max-w-sm font-lato text-sm text-slate-500">
            Ningún elemento coincide con la búsqueda o los filtros aplicados.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* List */}
      {filteredItems.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {view === "cards" ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item) =>
                  editingId === item.id ? (
                    <div key={item.id} className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                      <EditForm
                        fields={fields}
                        draft={draft}
                        setDraft={setDraft}
                        saving={saving}
                        error={error}
                        onCancel={cancel}
                        onSave={save}
                      />
                    </div>
                  ) : (
                    <CardGrid
                      key={item.id}
                      item={item}
                      fields={fields}
                      thumbnailField={autoThumbnailField}
                      renderPreview={renderPreview}
                      canReorder={canReorder && !hasActiveFilters}
                      disabled={editingId !== null}
                      onEdit={() => beginEdit(item)}
                      onDelete={() => del(item.id)}
                      onToggleActivo={() => toggleActivo(item)}
                      detailHref={detailHref ? detailHref(item) : undefined}
                    />
                  ),
                )}
              </div>
            ) : (
              <TableView
                items={visibleItems}
                fields={fields}
                columns={columns}
                thumbnailField={autoThumbnailField}
                canReorder={canReorder && !hasActiveFilters}
                editingId={editingId}
                draft={draft}
                setDraft={setDraft}
                saving={saving}
                error={error}
                onEdit={beginEdit}
                onDelete={del}
                onToggleActivo={toggleActivo}
                onCancel={cancel}
                onSave={save}
                detailHref={detailHref}
                detailLabel={detailLabel}
              />
            )}
          </SortableContext>
        </DndContext>
      )}

      {/* Paginación incremental */}
      {hasMore && (
        <div className="flex flex-col items-center gap-1 py-2">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + pageSize)}
            className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:bg-stone-50"
          >
            Mostrar más
          </button>
          <p className="font-lato text-[11px] text-slate-400">
            {visibleItems.length} de {filteredItems.length}
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Card grid (stacked: imagen arriba, contenido abajo) ─────────────── */

function CardGrid<T extends BaseItem>({
  item,
  fields,
  thumbnailField,
  renderPreview,
  canReorder,
  disabled,
  onEdit,
  onDelete,
  onToggleActivo,
  detailHref,
}: {
  item: T
  fields: FieldDef[]
  thumbnailField?: string
  renderPreview?: (item: T) => React.ReactNode
  canReorder: boolean
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActivo: () => void
  detailHref?: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: disabled || !canReorder })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const thumbnailRaw = thumbnailField ? (item as any)[thumbnailField] : undefined
  const thumbnail = Array.isArray(thumbnailRaw)
    ? thumbnailRaw.find((v) => typeof v === "string" && v.length > 0)
    : typeof thumbnailRaw === "string"
      ? thumbnailRaw
      : undefined
  const isActive = !("activo" in item) || item.activo

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition-all",
        "hover:border-red-300 hover:shadow-md",
        isDragging && "z-10 shadow-lg",
        !isActive && "opacity-60",
      )}
    >
      {/* Thumbnail area (imagen o placeholder) */}
      <div className="relative w-full bg-slate-100" style={{ aspectRatio: "4 / 3" }}>
        {detailHref ? (
          <Link
            href={detailHref}
            className="block h-full w-full"
            aria-label="Editar fotos y detalle"
          >
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <ImageOff className="h-10 w-10" />
              </div>
            )}
          </Link>
        ) : thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-10 w-10" />
          </div>
        )}

        {/* Drag handle (esquina superior izquierda, aparece en hover) */}
        {canReorder && (
          <button
            type="button"
            className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-none bg-white/90 text-slate-700 opacity-0 transition-opacity hover:bg-slate-950 hover:text-white group-hover:opacity-100 active:cursor-grabbing"
            aria-label="Reordenar"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Actions overlay (esquina superior derecha, aparecen en hover) */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {"activo" in item && (
            <button
              onClick={onToggleActivo}
              disabled={disabled}
              title={isActive ? "Ocultar del sitio" : "Mostrar en el sitio"}
              className="flex h-7 w-7 items-center justify-center rounded-none bg-white/90 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:opacity-50"
            >
              {isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={onEdit}
            disabled={disabled}
            title="Editar"
            className="flex h-7 w-7 items-center justify-center rounded-none bg-white/90 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            title="Eliminar"
            className="flex h-7 w-7 items-center justify-center rounded-none bg-white/90 text-slate-700 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content (abajo) */}
      <div className="flex flex-1 flex-col px-4 py-3">
        {renderPreview ? renderPreview(item) : <DefaultPreview item={item} fields={fields} />}
      </div>
    </div>
  )
}

/* ─── Edit form ───────────────────────────────────────────────────────── */

function EditForm({
  fields,
  draft,
  setDraft,
  saving,
  error,
  onCancel,
  onSave,
}: {
  fields: FieldDef[]
  draft: Record<string, unknown>
  setDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
  saving: boolean
  error: string | null
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50/30 px-5 py-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <FormField
            key={f.name}
            field={f}
            value={draft[f.name]}
            onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
            disabled={saving}
          />
        ))}
      </div>
      {error && (
        <div className="mt-4 rounded-none border border-red-300 bg-red-100 px-3 py-2 font-lato text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2 border-t border-red-200 pt-4">
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-4 py-2 font-lato text-xs font-semibold uppercase tracking-wider text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-none bg-red-600 px-4 py-2 font-lato text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Guardar
        </button>
      </div>
    </div>
  )
}

/* ─── Card row ────────────────────────────────────────────────────────── */

function CardRow<T extends BaseItem>({
  item,
  fields,
  thumbnailField,
  renderPreview,
  canReorder,
  disabled,
  onEdit,
  onDelete,
  onToggleActivo,
}: {
  item: T
  fields: FieldDef[]
  thumbnailField?: string
  renderPreview?: (item: T) => React.ReactNode
  canReorder: boolean
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActivo: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: disabled || !canReorder })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const thumbnailRaw = thumbnailField ? (item as any)[thumbnailField] : undefined
  const thumbnail = Array.isArray(thumbnailRaw) ? thumbnailRaw.find((v) => typeof v === "string" && v.length > 0) : (typeof thumbnailRaw === "string" ? thumbnailRaw : undefined)
  const isActive = !("activo" in item) || item.activo

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-stretch gap-0 overflow-hidden rounded-md border border-slate-200 bg-white transition-all",
        "hover:border-red-300 hover:shadow-sm",
        isDragging && "z-10 shadow-lg",
        !isActive && "opacity-60",
      )}
    >
      {/* Drag handle */}
      {canReorder && (
        <button
          type="button"
          className="flex w-8 flex-shrink-0 cursor-grab items-center justify-center border-r border-slate-100 bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing disabled:cursor-not-allowed"
          aria-label="Reordenar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {/* Thumbnail */}
      <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center bg-slate-50">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-slate-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          {renderPreview ? renderPreview(item) : <DefaultPreview item={item} fields={fields} />}
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {"activo" in item && (
            <button
              onClick={onToggleActivo}
              disabled={disabled}
              title={isActive ? "Ocultar del sitio" : "Mostrar en el sitio"}
              className="flex h-8 w-8 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50"
            >
              {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={onEdit}
            disabled={disabled}
            title="Editar"
            className="flex h-8 w-8 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            title="Eliminar"
            className="flex h-8 w-8 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Table view ──────────────────────────────────────────────────────── */

function TableView<T extends BaseItem>({
  items,
  fields,
  columns,
  thumbnailField,
  canReorder,
  editingId,
  draft,
  setDraft,
  saving,
  error,
  onEdit,
  onDelete,
  onToggleActivo,
  onCancel,
  onSave,
  detailHref,
  detailLabel,
}: {
  items: T[]
  fields: FieldDef[]
  columns: { key: string; label: string; className?: string }[]
  thumbnailField?: string
  canReorder: boolean
  editingId: string | null
  draft: Record<string, unknown>
  setDraft: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
  saving: boolean
  error: string | null
  onEdit: (item: T) => void
  onDelete: (id: string) => void
  onToggleActivo: (item: T) => void
  onCancel: () => void
  onSave: () => void
  detailHref?: (item: any) => string
  detailLabel?: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-stone-50">
            {canReorder && <th className="w-8" />}
            {thumbnailField && <th className="w-12" />}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2.5 text-left font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500",
                  col.className,
                )}
              >
                {col.label}
              </th>
            ))}
            <th className="w-28 px-3 py-2.5 text-right font-lato text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) =>
            editingId === item.id ? (
              <tr key={item.id}>
                <td
                  colSpan={columns.length + 2 + (canReorder ? 1 : 0)}
                  className="p-0"
                >
                  <EditForm
                    fields={fields}
                    draft={draft}
                    setDraft={setDraft}
                    saving={saving}
                    error={error}
                    onCancel={onCancel}
                    onSave={onSave}
                  />
                </td>
              </tr>
            ) : (
              <TableRow
                key={item.id}
                item={item}
                fields={fields}
                columns={columns}
                thumbnailField={thumbnailField}
                canReorder={canReorder}
                disabled={editingId !== null}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
                onToggleActivo={() => onToggleActivo(item)}
                detailHref={detailHref ? detailHref(item) : undefined}
                detailLabel={detailLabel}
              />
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

function TableRow<T extends BaseItem>({
  item,
  fields,
  columns,
  thumbnailField,
  canReorder,
  disabled,
  onEdit,
  onDelete,
  onToggleActivo,
  detailHref,
  detailLabel,
}: {
  item: T
  fields: FieldDef[]
  columns: { key: string; label: string; className?: string }[]
  thumbnailField?: string
  canReorder: boolean
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActivo: () => void
  detailHref?: string
  detailLabel?: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: disabled || !canReorder })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const thumbnailRaw = thumbnailField ? (item as any)[thumbnailField] : undefined
  const thumbnail = Array.isArray(thumbnailRaw) ? thumbnailRaw.find((v) => typeof v === "string" && v.length > 0) : (typeof thumbnailRaw === "string" ? thumbnailRaw : undefined)
  const isActive = !("activo" in item) || item.activo

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-b border-slate-100 bg-white transition-colors last:border-0",
        "hover:bg-stone-50",
        isDragging && "z-10 shadow-md bg-white",
        !isActive && "opacity-60",
      )}
    >
      {canReorder && (
        <td className="w-8 px-2">
          <button
            type="button"
            className="flex h-8 w-full cursor-grab items-center justify-center text-slate-300 transition-colors hover:text-slate-700 active:cursor-grabbing"
            aria-label="Reordenar"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </td>
      )}
      {thumbnailField && (
        <td className="w-12 px-2 py-2">
          {detailHref ? (
            <Link
              href={detailHref}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-slate-100 bg-slate-50 transition-all hover:border-red-300 hover:shadow-sm"
              aria-label={detailLabel ?? "Editar fotos y detalle"}
            >
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="h-3.5 w-3.5 text-slate-300" />
              )}
            </Link>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-slate-100 bg-slate-50">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="h-3.5 w-3.5 text-slate-300" />
              )}
            </div>
          )}
        </td>
      )}
      {columns.map((col) => {
        const raw = (item as any)[col.key]
        const isPrimary = col === columns[0]
        return (
          <td
            key={col.key}
            className={cn(
              "px-3 py-2.5 font-lato text-sm",
              isPrimary
                ? "font-semibold text-slate-900"
                : "text-slate-600",
              col.className,
            )}
          >
            {isPrimary && detailHref ? (
              <Link
                href={detailHref}
                className="block truncate text-slate-900 hover:text-red-600 hover:underline"
              >
                {formatCell(raw)}
              </Link>
            ) : (
              <div className="truncate">{formatCell(raw)}</div>
            )}
          </td>
        )
      })}
      <td className="px-3 py-2.5">
        <div
          className={cn(
            "flex items-center justify-end gap-1",
            detailHref
              ? "opacity-100"
              : "opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
          )}
        >
          {detailHref && (
            <Link
              href={detailHref}
              title={detailLabel ?? "Editar fotos y detalle"}
              className="flex h-7 items-center gap-1 rounded-none border border-slate-200 px-2 font-lato text-[10px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" />
              Detalle
            </Link>
          )}
          {"activo" in item && (
            <button
              onClick={onToggleActivo}
              disabled={disabled}
              title={isActive ? "Ocultar" : "Mostrar"}
              className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50"
            >
              {isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={onEdit}
            disabled={disabled}
            title="Edición rápida (sin fotos)"
            className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-stone-100 hover:text-slate-900 disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            title="Eliminar"
            className="flex h-7 w-7 items-center justify-center rounded-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function formatCell(raw: unknown): string {
  if (raw === null || raw === undefined) return "—"
  if (Array.isArray(raw)) return raw.length === 0 ? "—" : `${raw.length} ítems`
  if (typeof raw === "boolean") return raw ? "Sí" : "No"
  return String(raw)
}

/* ─── Default preview (fallback) ──────────────────────────────────────── */

function DefaultPreview<T extends BaseItem>({
  item,
  fields,
}: {
  item: T
  fields: FieldDef[]
}) {
  const primary = fields.find((f) =>
    ["nombre", "titulo", "label", "clave", "codigo", "red", "valor"].includes(f.name),
  )
  const secondary = fields.find((f) => ["descripcion", "subtitulo"].includes(f.name))
  const value = primary ? (item as any)[primary.name] : item.id
  const isActive = !("activo" in item) || item.activo
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="truncate font-bebas text-base uppercase tracking-wide text-slate-950">
          {String(value ?? "(sin título)")}
        </span>
        {!isActive && (
          <span className="flex-shrink-0 rounded-none border border-slate-300 bg-stone-100 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-slate-600">
            Oculto
          </span>
        )}
      </div>
      {secondary && (item as any)[secondary.name] && (
        <p className="mt-0.5 line-clamp-1 font-lato text-xs text-slate-500">
          {String((item as any)[secondary.name])}
        </p>
      )}
    </div>
  )
}
