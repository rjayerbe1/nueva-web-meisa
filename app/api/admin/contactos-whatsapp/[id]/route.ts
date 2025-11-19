import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Obtener un contacto específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const contacto = await prisma.contactoWhatsApp.findUnique({
      where: { id: params.id }
    })

    if (!contacto) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(contacto)
  } catch (error) {
    console.error("Error al obtener contacto:", error)
    return NextResponse.json(
      { error: "Error al obtener contacto" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar contacto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden actualizar contactos." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nombre, cargo, telefono, mensajePredeterminado, avatar, orden, activo } = body

    // Verificar que el contacto existe
    const contactoExistente = await prisma.contactoWhatsApp.findUnique({
      where: { id: params.id }
    })

    if (!contactoExistente) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      )
    }

    // Actualizar el contacto
    const contactoActualizado = await prisma.contactoWhatsApp.update({
      where: { id: params.id },
      data: {
        nombre: nombre || contactoExistente.nombre,
        cargo: cargo || contactoExistente.cargo,
        telefono: telefono || contactoExistente.telefono,
        mensajePredeterminado: mensajePredeterminado || contactoExistente.mensajePredeterminado,
        avatar: avatar !== undefined ? avatar : contactoExistente.avatar,
        orden: orden !== undefined ? orden : contactoExistente.orden,
        activo: activo !== undefined ? activo : contactoExistente.activo
      }
    })

    return NextResponse.json(contactoActualizado)
  } catch (error) {
    console.error("Error al actualizar contacto:", error)
    return NextResponse.json(
      { error: "Error al actualizar contacto" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar contacto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden eliminar contactos." },
        { status: 401 }
      )
    }

    // Verificar que el contacto existe
    const contactoExistente = await prisma.contactoWhatsApp.findUnique({
      where: { id: params.id }
    })

    if (!contactoExistente) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      )
    }

    // Eliminar el contacto
    await prisma.contactoWhatsApp.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: "Contacto eliminado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al eliminar contacto:", error)
    return NextResponse.json(
      { error: "Error al eliminar contacto" },
      { status: 500 }
    )
  }
}
