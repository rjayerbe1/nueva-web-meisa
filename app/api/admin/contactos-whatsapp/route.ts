import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar todos los contactos de WhatsApp
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const contactos = await prisma.contactoWhatsApp.findMany({
      orderBy: {
        orden: 'asc'
      }
    })

    return NextResponse.json(contactos)
  } catch (error) {
    console.error("Error al obtener contactos:", error)
    return NextResponse.json(
      { error: "Error al obtener contactos" },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo contacto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden crear contactos." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nombre, cargo, telefono, mensajePredeterminado, avatar, orden, activo } = body

    // Validaciones
    if (!nombre || !cargo || !telefono) {
      return NextResponse.json(
        { error: "Nombre, cargo y teléfono son campos requeridos" },
        { status: 400 }
      )
    }

    // Crear el contacto
    const nuevoContacto = await prisma.contactoWhatsApp.create({
      data: {
        nombre,
        cargo,
        telefono,
        mensajePredeterminado: mensajePredeterminado || "Hola, me gustaría solicitar información sobre sus servicios.",
        avatar: avatar || null,
        orden: orden || 0,
        activo: activo !== undefined ? activo : true
      }
    })

    return NextResponse.json(nuevoContacto, { status: 201 })
  } catch (error) {
    console.error("Error al crear contacto:", error)
    return NextResponse.json(
      { error: "Error al crear contacto" },
      { status: 500 }
    )
  }
}
