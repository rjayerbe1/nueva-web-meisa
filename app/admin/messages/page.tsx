import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import MessagesList from "@/components/admin/MessagesList"

const ESTADOS_VALIDOS = [
  "NUEVO",
  "LEIDO",
  "RESPONDIDO",
  "COTIZADO",
  "CERRADO",
] as const

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { estado?: string; q?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const estado =
    searchParams.estado && (ESTADOS_VALIDOS as readonly string[]).includes(searchParams.estado)
      ? searchParams.estado
      : undefined
  const q = searchParams.q?.trim() || undefined

  const where: Record<string, unknown> = {}
  if (estado) where.estado = estado
  if (q) {
    where.OR = [
      { nombre: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { empresa: { contains: q, mode: "insensitive" } },
      { referencia: { contains: q, mode: "insensitive" } },
      { ciudad: { contains: q, mode: "insensitive" } },
    ]
  }

  const [messages, counts] = await Promise.all([
    prisma.contactForm.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactForm.groupBy({
      by: ["estado"],
      _count: { _all: true },
    }),
  ])

  const countsByEstado = Object.fromEntries(
    counts.map((c) => [c.estado || "NUEVO", c._count._all]),
  )
  const total = counts.reduce((acc, c) => acc + c._count._all, 0)
  const nuevoCount = countsByEstado["NUEVO"] ?? 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensajes de contacto</h1>
          <p className="mt-2 text-lg text-gray-600">
            {total} solicitudes · {nuevoCount} nuevas
          </p>
        </div>
      </div>

      <MessagesList
        messages={messages.map((m) => ({
          id: m.id,
          referencia: m.referencia,
          nombre: m.nombre,
          empresa: m.empresa,
          email: m.email,
          telefono: m.telefono,
          ciudad: m.ciudad,
          tipoProyecto: m.tipoProyecto,
          etapa: m.etapa,
          mensaje: m.mensaje,
          estado: m.estado,
          leido: m.leido,
          createdAt: m.createdAt.toISOString(),
        }))}
        countsByEstado={countsByEstado}
        currentEstado={estado}
        currentQuery={q}
      />

      {messages.length === 0 && (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay mensajes
          </h3>
          <p className="text-gray-500">
            {estado || q
              ? "Ningún mensaje coincide con el filtro actual."
              : "Los mensajes de contacto aparecerán aquí."}
          </p>
        </div>
      )}
    </div>
  )
}
