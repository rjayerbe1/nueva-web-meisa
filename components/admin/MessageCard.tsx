"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Phone, Calendar, MapPin, Trash2, Eye, Building2 } from "lucide-react"
import type { AdminMessage } from "./MessagesList"

const ESTADO_LABEL: Record<string, { label: string; classes: string }> = {
  NUEVO: { label: "Nuevo", classes: "bg-orange-100 text-orange-800" },
  LEIDO: { label: "Leído", classes: "bg-blue-100 text-blue-800" },
  RESPONDIDO: { label: "Respondido", classes: "bg-green-100 text-green-800" },
  COTIZADO: { label: "Cotizado", classes: "bg-purple-100 text-purple-800" },
  CERRADO: { label: "Cerrado", classes: "bg-gray-100 text-gray-700" },
}

const TIPO_LABEL: Record<string, string> = {
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
  PUENTES: "Puentes",
  INFRAESTRUCTURA_URBANA: "Infraestructura Urbana",
  EDIFICACIONES: "Edificaciones",
  DEPORTES_EDUCACION: "Deportes & Educación",
}

const ETAPA_LABEL: Record<string, string> = {
  IDEA: "Idea inicial",
  ANTEPROYECTO: "Anteproyecto",
  PLANOS_DEFINITIVOS: "Planos definitivos",
  EN_OBRA: "Ya en obra",
}

export default function MessageCard({ message }: { message: AdminMessage }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const estado = ESTADO_LABEL[message.estado] || ESTADO_LABEL.NUEVO

  async function handleDelete() {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el mensaje de "${message.nombre}"?`,
      )
    ) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Error al eliminar el mensaje")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el mensaje")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors ${
        message.estado === "NUEVO" ? "bg-orange-50/40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${estado.classes}`}
            >
              {estado.label}
            </span>
            {message.referencia && (
              <span className="font-mono text-xs text-gray-500 font-bold">
                {message.referencia}
              </span>
            )}
            <span className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {new Date(message.createdAt).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {message.nombre}
            {message.empresa && (
              <span className="font-normal text-gray-500"> · {message.empresa}</span>
            )}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
            <a
              href={`mailto:${message.email}`}
              className="flex items-center hover:text-blue-600"
            >
              <Mail className="h-4 w-4 mr-1" />
              {message.email}
            </a>
            {message.telefono && (
              <a
                href={`tel:${message.telefono}`}
                className="flex items-center hover:text-blue-600"
              >
                <Phone className="h-4 w-4 mr-1" />
                {message.telefono}
              </a>
            )}
            {message.ciudad && (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                {message.ciudad}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {message.tipoProyecto && (
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-slate-900 text-white">
                <Building2 className="h-3 w-3 mr-1" />
                {TIPO_LABEL[message.tipoProyecto] || message.tipoProyecto}
              </span>
            )}
            {message.etapa && (
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300">
                {ETAPA_LABEL[message.etapa] || message.etapa}
              </span>
            )}
          </div>

          <p className="text-gray-700 line-clamp-2 text-sm">{message.mensaje}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/messages/${message.id}`}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Ver mensaje completo"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
