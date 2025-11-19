import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Obtener configuración del widget
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Obtener o crear configuración por defecto
    let config = await prisma.configuracionWhatsApp.findFirst()

    if (!config) {
      config = await prisma.configuracionWhatsApp.create({
        data: {
          horarioAtencion: "Lunes a Viernes: 7:00 AM - 5:00 PM",
          mensajeIntroduccion: "Elije la persona disponible para iniciar una conversación de WhatsApp",
          tituloWidget: "Háblanos por WhatsApp",
          activo: true
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error al obtener configuración:", error)
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración del widget
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden actualizar la configuración." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { horarioAtencion, mensajeIntroduccion, tituloWidget, activo } = body

    // Buscar configuración existente
    let config = await prisma.configuracionWhatsApp.findFirst()

    if (!config) {
      // Crear si no existe
      config = await prisma.configuracionWhatsApp.create({
        data: {
          horarioAtencion: horarioAtencion || "Lunes a Viernes: 7:00 AM - 5:00 PM",
          mensajeIntroduccion: mensajeIntroduccion || "Elije la persona disponible para iniciar una conversación de WhatsApp",
          tituloWidget: tituloWidget || "Háblanos por WhatsApp",
          activo: activo !== undefined ? activo : true
        }
      })
    } else {
      // Actualizar existente
      config = await prisma.configuracionWhatsApp.update({
        where: { id: config.id },
        data: {
          horarioAtencion: horarioAtencion || config.horarioAtencion,
          mensajeIntroduccion: mensajeIntroduccion || config.mensajeIntroduccion,
          tituloWidget: tituloWidget || config.tituloWidget,
          activo: activo !== undefined ? activo : config.activo
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error al actualizar configuración:", error)
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    )
  }
}
