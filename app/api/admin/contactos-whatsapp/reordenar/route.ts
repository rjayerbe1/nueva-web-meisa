import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH - Reordenar contactos
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden reordenar contactos." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { contactos } = body // Array de {id, orden}

    if (!Array.isArray(contactos)) {
      return NextResponse.json(
        { error: "Se requiere un array de contactos con {id, orden}" },
        { status: 400 }
      )
    }

    // Actualizar el orden de cada contacto en una transacción
    await prisma.$transaction(
      contactos.map(contacto =>
        prisma.contactoWhatsApp.update({
          where: { id: contacto.id },
          data: { orden: contacto.orden }
        })
      )
    )

    return NextResponse.json(
      { message: "Contactos reordenados correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al reordenar contactos:", error)
    return NextResponse.json(
      { error: "Error al reordenar contactos" },
      { status: 500 }
    )
  }
}
