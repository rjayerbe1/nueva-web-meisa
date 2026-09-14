import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cachedContent, PUBLIC_API_CACHE_HEADERS } from "@/lib/cache/content-cache"
import { TAGS } from "@/lib/cache/tags"

// El widget flotante llama esta API desde el navegador en CADA página. Se
// sirve del caché (1 h) y cualquier cambio desde /admin/contactos-whatsapp
// lo invalida al instante (hook de escritura en lib/prisma.ts).
export const revalidate = 3600

const getContactosWhatsApp = cachedContent(
  ["api-contactos-whatsapp"],
  [TAGS.contactosWhatsApp, TAGS.configuracionWhatsApp],
  async () => {
    const [contactos, configuracion] = await Promise.all([
      prisma.contactoWhatsApp.findMany({
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
      }),
      prisma.configuracionWhatsApp.findFirst(),
    ])
    return { contactos, configuracion }
  },
)

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
