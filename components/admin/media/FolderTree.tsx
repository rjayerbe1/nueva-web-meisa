"use client"

import { useState } from "react"
import { ChevronRight, Folder, FolderPlus, MoreVertical, Pencil, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FolderNode } from "@/lib/media/folder-path"
import { joinPath, normalizeSegment, lastSegment, parentPath } from "@/lib/media/folder-path"

interface Props {
  nodes: FolderNode[]
  currentPath: string | null
  rootCount: number
  onNavigate: (path: string | null) => void
  onCreate: (parentPath: string | null, segment: string) => Promise<void> | void
  onRename: (oldPath: string, newPath: string) => Promise<void> | void
  onDelete: (path: string) => Promise<void> | void
  onDropItems: (ids: string[], targetPath: string) => Promise<void> | void
}

export function FolderTree({
  nodes,
  currentPath,
  rootCount,
  onNavigate,
  onCreate,
  onRename,
  onDelete,
  onDropItems,
}: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>()
    if (currentPath) {
      const parts = currentPath.split("/")
      let acc = ""
      for (const p of parts) {
        acc = acc ? `${acc}/${p}` : p
        s.add(acc)
      }
    }
    return s
  })
  const [creatingUnder, setCreatingUnder] = useState<string | null | "__root__">(null)
  const [renaming, setRenaming] = useState<string | null>(null)

  const toggle = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })

  const submitCreate = async (parent: string | null, segment: string) => {
    const clean = normalizeSegment(segment)
    if (!clean) {
      setCreatingUnder(null)
      return
    }
    const full = parent ? joinPath(parent, clean) : clean
    await onCreate(parent, clean)
    setCreatingUnder(null)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (parent) next.add(parent)
      next.add(full)
      return next
    })
  }

  return (
    <div className="space-y-1">
      {/* Root "Todas" */}
      <RootRow
        active={currentPath === null}
        count={rootCount}
        onClick={() => onNavigate(null)}
        onAdd={() => setCreatingUnder("__root__")}
        onDropItems={(ids) => onDropItems(ids, "")}
      />

      {creatingUnder === "__root__" && (
        <InlineCreator
          depth={0}
          onCancel={() => setCreatingUnder(null)}
          onSubmit={(seg) => submitCreate(null, seg)}
        />
      )}

      {nodes.map((n) => (
        <FolderRow
          key={n.path}
          node={n}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          currentPath={currentPath}
          onNavigate={onNavigate}
          creatingUnder={creatingUnder}
          setCreatingUnder={setCreatingUnder}
          renaming={renaming}
          setRenaming={setRenaming}
          onCreate={submitCreate}
          onRename={async (oldPath, newSegment) => {
            const parent = parentPath(oldPath)
            const cleaned = normalizeSegment(newSegment)
            if (!cleaned || cleaned === lastSegment(oldPath)) {
              setRenaming(null)
              return
            }
            const newPath = parent ? joinPath(parent, cleaned) : cleaned
            await onRename(oldPath, newPath)
            setRenaming(null)
          }}
          onDelete={onDelete}
          onDropItems={onDropItems}
        />
      ))}
    </div>
  )
}

function RootRow({
  active,
  count,
  onClick,
  onAdd,
  onDropItems,
}: {
  active: boolean
  count: number
  onClick: () => void
  onAdd: () => void
  onDropItems: (ids: string[]) => void
}) {
  const [over, setOver] = useState(false)
  return (
    <div
      className={cn(
        "group flex items-center gap-1 px-2 py-1.5",
        active && "bg-red-50",
        over && "bg-red-100 outline outline-2 outline-red-500",
      )}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("application/x-media-ids")) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        const raw = e.dataTransfer.getData("application/x-media-ids")
        setOver(false)
        if (!raw) return
        try {
          const ids = JSON.parse(raw) as string[]
          if (Array.isArray(ids) && ids.length > 0) onDropItems(ids)
        } catch {
          /* noop */
        }
      }}
    >
      <button
        onClick={onClick}
        className={cn(
          "flex flex-1 items-center gap-2 font-lato text-sm transition-colors",
          active ? "font-semibold text-red-700" : "text-slate-700 hover:text-slate-950",
        )}
      >
        <Folder className="h-3.5 w-3.5 text-slate-400" />
        <span className="flex-1 truncate text-left">Todas las carpetas</span>
        <span className="text-[11px] text-slate-400">{count}</span>
      </button>
      <button
        onClick={onAdd}
        title="Nueva carpeta raíz"
        className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 hover:text-red-600"
      >
        <FolderPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

interface RowProps {
  node: FolderNode
  depth: number
  expanded: Set<string>
  toggle: (path: string) => void
  currentPath: string | null
  onNavigate: (path: string) => void
  creatingUnder: string | null | "__root__"
  setCreatingUnder: (p: string | null | "__root__") => void
  renaming: string | null
  setRenaming: (p: string | null) => void
  onCreate: (parent: string | null, segment: string) => Promise<void>
  onRename: (oldPath: string, newSegment: string) => Promise<void>
  onDelete: (path: string) => Promise<void> | void
  onDropItems: (ids: string[], targetPath: string) => Promise<void> | void
}

function FolderRow(props: RowProps) {
  const {
    node,
    depth,
    expanded,
    toggle,
    currentPath,
    onNavigate,
    creatingUnder,
    setCreatingUnder,
    renaming,
    setRenaming,
    onCreate,
    onRename,
    onDelete,
    onDropItems,
  } = props
  const hasChildren = node.children.length > 0
  const isExpanded = expanded.has(node.path)
  const isActive = currentPath === node.path
  const [menuOpen, setMenuOpen] = useState(false)
  const [over, setOver] = useState(false)

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1.5",
          isActive && "bg-red-50",
          over && "bg-red-100 outline outline-2 outline-red-500",
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("application/x-media-ids")) return
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          const raw = e.dataTransfer.getData("application/x-media-ids")
          setOver(false)
          if (!raw) return
          try {
            const ids = JSON.parse(raw) as string[]
            if (Array.isArray(ids) && ids.length > 0) onDropItems(ids, node.path)
          } catch {
            /* noop */
          }
        }}
      >
        <button
          onClick={() => hasChildren && toggle(node.path)}
          className={cn(
            "flex h-4 w-4 items-center justify-center text-slate-400",
            !hasChildren && "invisible",
          )}
        >
          <ChevronRight
            className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")}
          />
        </button>

        {renaming === node.path ? (
          <InlineEditor
            initial={node.name}
            onCancel={() => setRenaming(null)}
            onSubmit={(v) => onRename(node.path, v)}
          />
        ) : (
          <button
            onClick={() => onNavigate(node.path)}
            className={cn(
              "flex flex-1 items-center gap-2 font-lato text-sm transition-colors",
              isActive ? "font-semibold text-red-700" : "text-slate-700 hover:text-slate-950",
            )}
          >
            <Folder className="h-3.5 w-3.5 text-slate-400" />
            <span className="flex-1 truncate text-left">{node.name}</span>
            {node.count > 0 && (
              <span className="text-[11px] text-slate-400">{node.count}</span>
            )}
          </button>
        )}

        {renaming !== node.path && (
          <div className="relative flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => {
                setCreatingUnder(node.path)
                if (!isExpanded) toggle(node.path)
              }}
              title="Nueva subcarpeta"
              className="text-slate-400 hover:text-red-600"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              title="Opciones"
              className="text-slate-400 hover:text-slate-900"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-5 z-20 w-40 border border-slate-200 bg-white py-1 shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setRenaming(node.path)
                    setMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left font-lato text-xs text-slate-700 hover:bg-stone-100"
                >
                  <Pencil className="h-3 w-3" />
                  Renombrar
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    onDelete(node.path)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left font-lato text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && creatingUnder === node.path && (
        <InlineCreator
          depth={depth + 1}
          onCancel={() => setCreatingUnder(null)}
          onSubmit={(seg) => onCreate(node.path, seg)}
        />
      )}

      {isExpanded &&
        node.children.map((c) => (
          <FolderRow key={c.path} {...props} node={c} depth={depth + 1} />
        ))}
    </div>
  )
}

function InlineCreator({
  depth,
  onCancel,
  onSubmit,
}: {
  depth: number
  onCancel: () => void
  onSubmit: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-1 py-1" style={{ paddingLeft: 8 + depth * 14 + 16 }}>
      <Folder className="h-3.5 w-3.5 text-slate-300" />
      <InlineEditor initial="" placeholder="nueva carpeta" onCancel={onCancel} onSubmit={onSubmit} autoFocus />
    </div>
  )
}

function InlineEditor({
  initial,
  placeholder,
  onCancel,
  onSubmit,
  autoFocus = true,
}: {
  initial: string
  placeholder?: string
  onCancel: () => void
  onSubmit: (value: string) => void
  autoFocus?: boolean
}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="flex flex-1 items-center gap-1">
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit(value)
          if (e.key === "Escape") onCancel()
        }}
        className="flex-1 border border-red-400 bg-white px-2 py-0.5 font-lato text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
      />
      <button
        onClick={() => onSubmit(value)}
        className="text-green-600 hover:text-green-800"
        title="Confirmar"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button onClick={onCancel} className="text-slate-400 hover:text-slate-700" title="Cancelar">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
