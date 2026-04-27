"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import MessageCard from "./MessageCard"

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "NUEVO", label: "Nuevos" },
  { value: "LEIDO", label: "Leídos" },
  { value: "RESPONDIDO", label: "Respondidos" },
  { value: "COTIZADO", label: "Cotizados" },
  { value: "CERRADO", label: "Cerrados" },
] as const

export interface AdminMessage {
  id: string
  referencia: string | null
  nombre: string
  empresa: string | null
  email: string
  telefono: string | null
  ciudad: string | null
  tipoProyecto: string | null
  etapa: string | null
  mensaje: string
  estado: string
  leido: boolean
  createdAt: string
}

interface MessagesListProps {
  messages: AdminMessage[]
  countsByEstado: Record<string, number>
  currentEstado?: string
  currentQuery?: string
}

export default function MessagesList({
  messages,
  countsByEstado,
  currentEstado,
  currentQuery,
}: MessagesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [query, setQuery] = useState(currentQuery || "")

  function buildHref(params: Partial<{ estado: string; q: string }>) {
    const sp = new URLSearchParams(searchParams.toString())
    if (params.estado === undefined ? !currentEstado : !params.estado) sp.delete("estado")
    else if (params.estado) sp.set("estado", params.estado)
    if (params.q === undefined ? !currentQuery : !params.q) sp.delete("q")
    else if (params.q) sp.set("q", params.q)
    const qs = sp.toString()
    return qs ? `?${qs}` : ""
  }

  function setEstado(value: string) {
    startTransition(() => {
      router.push(`/admin/messages${buildHref({ estado: value })}`)
    })
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      router.push(`/admin/messages${buildHref({ q: query })}`)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {ESTADOS.map((e) => {
            const active =
              (e.value === "" && !currentEstado) || e.value === currentEstado
            const count = e.value ? countsByEstado[e.value] ?? 0 : undefined
            return (
              <button
                key={e.value}
                onClick={() => setEstado(e.value)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  active
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-slate-700"
                }`}
              >
                {e.label}
                {count !== undefined && (
                  <span
                    className={`ml-2 ${active ? "text-white/70" : "text-gray-400"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <form onSubmit={onSearchSubmit} className="relative flex-shrink-0 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, email, empresa, ref..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-slate-700"
          />
        </form>
      </div>

      {messages.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
