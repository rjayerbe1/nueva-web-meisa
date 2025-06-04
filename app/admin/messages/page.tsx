import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import MessageCard from "@/components/admin/MessageCard"

async function getMessages() {
  return await prisma.contactForm.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === UserRole.VIEWER) {
    redirect("/")
  }

  const messages = await getMessages()
  const unreadCount = messages.filter(m => !m.leido).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestiona las consultas y mensajes de clientes potenciales
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{unreadCount}</span> mensajes sin leer
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {messages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message as any} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
            <p className="text-gray-500">Los mensajes de contacto aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  )
}