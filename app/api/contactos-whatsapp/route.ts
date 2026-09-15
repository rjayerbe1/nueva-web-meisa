import { NextResponse } from "next/server"
import { getSitio } from "@/lib/content/snapshot"
import { PUBLIC_API_CACHE_HEADERS } from "@/lib/cache/content-cache"

// El widget flotante llama esta API desde el navegador en CADA página. Sale
// del snapshot público (1 h) y cualquier cambio desde /admin/contactos-whatsapp
// lo invalida al instante (hook de escritura en lib/prisma.ts).
export const revalidate = 3600

async function getContactosWhatsApp() {
  const { contactosWhatsApp, configuracionWhatsApp } = await getSitio()
  return {
    contactos: contactosWhatsApp.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      cargo: c.cargo,
      telefono: c.telefono,
      mensajePredeterminado: c.mensajePredeterminado,
      avatar: c.avatar,
      orden: c.orden,
    })),
    configuracion: configuracionWhatsApp,
  }
}

// GET - Obtener contactos activos y configuración (API PÚBLICA)
export async function GET() {
  try {
    const { contactos, configuracion: configDb } = await getContactosWhatsApp()
    let configuracion = configDb

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
    }, { headers: PUBLIC_API_CACHE_HEADERS })
  } catch (error) {
    console.error("Error al obtener contactos de WhatsApp:", error)
    return NextResponse.json(
      { error: "Error al obtener contactos de WhatsApp" },
      { status: 500 }
    )
  }
}
