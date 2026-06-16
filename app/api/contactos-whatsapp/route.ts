import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Leer siempre de la DB en cada request (sin caché estático),
// para que los cambios de contactos/horario se reflejen de inmediato.
export const dynamic = "force-dynamic"

// GET - Obtener contactos activos y configuración (API PÚBLICA)
export async function GET() {
  try {
    // Obtener contactos activos ordenados
    const contactos = await prisma.contactoWhatsApp.findMany({
      where: {
        activo: true
      },
      orderBy: {
        orden: 'asc'
      },
      select: {
        id: true,
        nombre: true,
        cargo: true,
        telefono: true,
        mensajePredeterminado: true,
        avatar: true,
        orden: true
      }
    })

    // Obtener configuración del widget
    let configuracion = await prisma.configuracionWhatsApp.findFirst()

    // Si no existe configuración, usar valores por defecto
    if (!configuracion) {
      configuracion = {
        id: '',
        horarioAtencion: "Lunes a Viernes: 7:00 AM - 5:00 PM",
        mensajeIntroduccion: "Elije la persona disponible para iniciar una conversación de WhatsApp",
        tituloWidget: "Háblanos por WhatsApp",
        activo: true,
        updatedAt: new Date()
      }
    }

    // Solo mostrar el widget si está activo y hay contactos
    const mostrarWidget = configuracion.activo && contactos.length > 0

    return NextResponse.json({
      contactos,
      configuracion: {
        horarioAtencion: configuracion.horarioAtencion,
        mensajeIntroduccion: configuracion.mensajeIntroduccion,
        tituloWidget: configuracion.tituloWidget,
        activo: mostrarWidget
      }
    })
  } catch (error) {
    console.error("Error al obtener contactos de WhatsApp:", error)
    return NextResponse.json(
      { error: "Error al obtener contactos de WhatsApp" },
      { status: 500 }
    )
  }
}
