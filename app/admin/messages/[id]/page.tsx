"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Reply,
  MapPin,
  Building2,
  Layers,
  Ruler,
  FileText,
  Save,
} from "lucide-react"
import Link from "next/link"

const ESTADO_OPTIONS = [
  { value: "NUEVO", label: "Nuevo", classes: "bg-orange-100 text-orange-800 border-orange-300" },
  { value: "LEIDO", label: "Leído", classes: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "RESPONDIDO", label: "Respondido", classes: "bg-green-100 text-green-800 border-green-300" },
  { value: "COTIZADO", label: "Cotizado", classes: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "CERRADO", label: "Cerrado", classes: "bg-gray-100 text-gray-700 border-gray-300" },
] as const

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

const UNIDAD_LABEL: Record<string, string> = {
  M2: "m²",
  TON: "Toneladas",
  NA: "Sin definir",
}

interface Adjunto {
  name: string
  url: string
  size?: number
  mime?: string
}

interface Message {
  id: string
  referencia: string | null
  nombre: string
  empresa: string | null
  email: string
  telefono: string | null
  ciudad: string | null
  tipoProyecto: string | null
  etapa: string | null
  escalaValor: number | null
  escalaUnidad: string | null
  mensaje: string
  adjuntos: Adjunto[] | null
  origen: string | null
  estado: string
  leido: boolean
  notasInternas: string | null
  createdAt: string
  updatedAt: string
}

export default function MessageDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<Message | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notas, setNotas] = useState("")
  const [savingNotas, setSavingNotas] = useState(false)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/admin/messages/${params.id}`)
        if (response.ok) {
          const messageData: Message = await response.json()
          setMessage(messageData)
          setNotas(messageData.notasInternas || "")

          // Marcar como leído al abrir si está NUEVO
          if (messageData.estado === "NUEVO") {
            const updateRes = await fetch(`/api/admin/messages/${params.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ estado: "LEIDO" }),
            })
            if (updateRes.ok) {
              const updated = await updateRes.json()
              setMessage(updated)
            }
          }
        } else {
          alert("Error al cargar el mensaje")
          router.push("/admin/messages")
        }
      } catch (error) {
        console.error("Error:", error)
        alert("Error al cargar el mensaje")
        router.push("/admin/messages")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMessage()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (
      !message ||
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
        router.push("/admin/messages")
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

  const setEstado = async (estado: string) => {
    if (!message) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      })

      if (response.ok) {
        const updatedMessage: Message = await response.json()
        setMessage(updatedMessage)
      } else {
        alert("Error al actualizar el mensaje")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el mensaje")
    } finally {
      setIsUpdating(false)
    }
  }

  const saveNotas = async () => {
    if (!message) return
    setSavingNotas(true)
    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notasInternas: notas }),
      })

      if (response.ok) {
        const updated: Message = await response.json()
        setMessage(updated)
      } else {
        alert("Error al guardar las notas")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar las notas")
    } finally {
      setSavingNotas(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Mensaje no encontrado
        </h2>
        <Link
          href="/admin/messages"
          className="text-meisa-blue hover:underline mt-2 inline-block"
        >
          Volver a mensajes
        </Link>
      </div>
    )
  }

  const escalaTxt =
    message.escalaValor && message.escalaUnidad
      ? `${message.escalaValor} ${UNIDAD_LABEL[message.escalaUnidad] || message.escalaUnidad}`
      : message.escalaUnidad === "NA"
      ? "Sin definir"
      : "—"

  const adjuntos: Adjunto[] = Array.isArray(message.adjuntos) ? message.adjuntos : []

  const replySubject = encodeURIComponent(
    `Re: Solicitud ${message.referencia ?? "MEISA"} · ${message.nombre}`,
  )
  const replyBody = encodeURIComponent(
    `Hola ${message.nombre},\n\nGracias por contactar a MEISA${message.referencia ? ` (referencia ${message.referencia})` : ""}.\n\n[Tu respuesta aquí]\n\nSaludos,\nEquipo MEISA`,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/messages"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {message.nombre}
              {message.empresa && (
                <span className="text-gray-500 font-normal"> · {message.empresa}</span>
              )}
            </h1>
            <p className="text-gray-600 font-mono text-xs mt-1">
              {message.referencia ?? message.id}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      {/* Estado pills */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Estado
        </p>
        <div className="flex flex-wrap gap-2">
          {ESTADO_OPTIONS.map((opt) => {
            const active = message.estado === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setEstado(opt.value)}
                disabled={isUpdating || active}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  active
                    ? opt.classes
                    : "bg-white border-gray-300 text-gray-700 hover:border-slate-700"
                } ${active ? "ring-2 ring-offset-1 ring-current" : ""} disabled:opacity-100`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identificación */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Identificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-base text-meisa-blue hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {message.email}
                </a>
              </div>
              {message.telefono && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                  <a
                    href={`tel:${message.telefono}`}
                    className="text-base text-meisa-blue hover:underline flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    {message.telefono}
                  </a>
                </div>
              )}
              {message.ciudad && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ciudad</p>
                  <p className="text-base text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {message.ciudad}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recibido</p>
                <p className="text-base text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(message.createdAt).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>

          {/* Proyecto */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Proyecto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Tipo
                </p>
                <p className="text-base text-gray-900 font-semibold">
                  {message.tipoProyecto
                    ? TIPO_LABEL[message.tipoProyecto] || message.tipoProyecto
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Etapa
                </p>
                <p className="text-base text-gray-900 font-semibold">
                  {message.etapa ? ETAPA_LABEL[message.etapa] || message.etapa : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Ruler className="h-3 w-3" /> Escala estimada
                </p>
                <p className="text-base text-gray-900 font-semibold">{escalaTxt}</p>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Mensaje
            </h3>
            <div className="bg-gray-50 p-5 border-l-4 border-slate-900">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.mensaje}
              </p>
            </div>
          </div>

          {/* Adjuntos */}
          {adjuntos.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                Adjuntos ({adjuntos.length})
              </h3>
              <ul className="space-y-2">
                {adjuntos.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 border border-gray-200 hover:border-slate-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 truncate text-meisa-blue hover:underline text-sm"
                    >
                      {a.name}
                    </a>
                    {typeof a.size === "number" && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {(a.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar — acciones + notas */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Acciones
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${message.email}?subject=${replySubject}&body=${replyBody}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-meisa-blue border border-transparent rounded-md hover:bg-blue-700"
              >
                <Reply className="h-4 w-4 mr-2" />
                Responder por email
              </a>
              {message.telefono && (
                <a
                  href={`tel:${message.telefono}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </a>
              )}
              {message.telefono && (
                <a
                  href={`https://wa.me/${message.telefono.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Notas internas
            </h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={6}
              placeholder="Notas de seguimiento, próximos pasos…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-slate-700"
            />
            <button
              onClick={saveNotas}
              disabled={savingNotas || notas === (message.notasInternas || "")}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 border border-transparent rounded-md hover:bg-slate-800 disabled:opacity-40"
            >
              <Save className="h-4 w-4 mr-2" />
              {savingNotas ? "Guardando…" : "Guardar notas"}
            </button>
          </div>

          {message.origen && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                Origen
              </h3>
              <p className="text-xs text-gray-700 break-all">{message.origen}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
